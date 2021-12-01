/**
 * 审批流设置，审批流配置，房屋管理 /Expense/ExamineFlow/Config
 * 所有平台下的数据，必须一次性全部提交，和房屋有关联
 * 注：@TODO 2020.03.10,@李彩燕。修改提交校验规则（只校验当前修改的TAB配置）
 * 注：前端传什么后端存什么
 */
import is from 'is_js';
import _ from 'lodash';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';
import update from 'immutability-helper';

import { config } from './object';
import style from './style.css';

import ConfigSubject from './component/subjects';
import ConfigexamleFlow from './component/examleFlow';
import { authorize } from '../../../../../application';
import { OaApplicationFlowTemplateState, OaCostAccountingState, OaApplicationOrderType } from '../../../../../application/define';
import { CoreTabs } from '../../../../../components/core';

const platforms = authorize.platform();

class HousingManagementComponent extends Component {

  static propTypes = {
    examineList: PropTypes.object,  // 审批流列表信息
    subjectsData: PropTypes.object, // 科目列表信息
  }

  static defaultProps = {
    examineList: {},
    subjectsData: {},
  }

  constructor(props) {
    super(props);
    const examineConfig = dot.get(props, 'examineFlowConfig', config); // 审批流设置数据

    // 需要onChange的配置
    let examineFlowConfig = {};
    platforms.forEach((val) => {
      // 判断对应平台下是否有数据
      if (is.existy(examineConfig[val.id]) && is.not.empty(examineConfig[val.id])) {
        examineFlowConfig = _.cloneDeep(examineConfig); // 深拷贝，不能改变props中的原始配置
      } else {
        examineFlowConfig[val.id] = config[val.id];
      }
    });
    let platformCodes;
    if (is.existy(platforms) && is.not.empty(platforms)) {
      platformCodes = platforms[0].id;
    }
    this.state = {
      examineFlowConfig,  // 审批流设置数据，第一次是空时，用默认数据
      platformCodes, // 标签key
    };
    this.private = {
      isSubmit: true, // 防止多次点击
    };
  }

  componentDidMount = () => {
    const { platformCodes } = this.state;
    // 获取审批流列表
    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExamineFlows',
      payload: {
        page: 1, // 页码
        limit: 1000, // 条数
        platformCodes, // 平台
        isNewInterface: false, // 是否旧接口
        state: OaApplicationFlowTemplateState.normal, // 状态 默认显示正常的
        approvalType: OaApplicationOrderType.housing,
      },
    });

    // 获取科目列表
    this.props.dispatch({
      type: 'expenseSubject/fetchExpenseSubjects',
      payload: {
        page: 1, // 页码
        limit: 1000, // 条数
        state: [OaCostAccountingState.normal], // 状态 默认显示正常的
      },
    });
    const params = {
      feature: 'house_contract',
      platforms: platforms.map(val => val.id),
    };
    // 获取审批流设置的数据
    this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlowConfig', payload: params });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.examineFlowConfig !== this.props.examineFlowConfig) {
      const examineConfig = dot.get(this.props, 'examineFlowConfig', config); // 审批流设置数据
      // 需要onChange的配置
      const examineFlowConfig = {};
      platforms.forEach((val) => {
        // 判断对应平台下是否有数据
        if (is.existy(examineConfig[val.id]) && is.not.empty(examineConfig[val.id])) {
          examineFlowConfig[val.id] = examineConfig[val.id];
        } else {
          examineFlowConfig[val.id] = config[val.id];
        }
      });
      this.setState({
        examineFlowConfig,  // 审批流设置数据，第一次是空时，用默认数据
      });
    }
  }

  // 改变标签key值
  onChangeActiveKey = (platformCodes) => {
    this.setState({
      platformCodes, // 标签key
    });
    // 获取审批流列表
    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExamineFlows',
      payload: {
        page: 1, // 页码
        limit: 1000, // 条数
        platformCodes, // 平台
        state: OaApplicationFlowTemplateState.normal, // 状态 默认显示正常的
        approvalType: OaApplicationOrderType.housing,
      },
    });
  }

  // 改变审批流配置科目分组，清空费用分组
  onChangeAccountings = (e, element, type) => {
    const { platformCodes, examineFlowConfig } = this.state;
    // 获取审批流key值
    const examineConfigKeys = Object.keys(examineFlowConfig[platformCodes]).slice(1);
    // 费用分组清空
    examineConfigKeys.forEach((item) => {
      examineFlowConfig[platformCodes][item].cost_group_id = '';
    });
    const accountings = examineFlowConfig[platformCodes].accountings;
    // 改变对应的科目信息
    accountings[element][type] = e;
    this.setState({
      examineFlowConfig, // 审批流设置数据
    });
  }

  // 改变审批流
  onChangeExamine = (e, element) => {
    const { examineFlowConfig, platformCodes } = this.state;
    // 改变对应的审批流信息
    // 改变审批流,清空级联的费用分组
    this.setState({
      examineFlowConfig: update(examineFlowConfig, {
        [platformCodes]: {
          [element]: {
            flow_id: { $set: e },
            cost_group_id: { $set: '' },
          },
        },
      }),
    });
  }

  // 改变费用分组
  onChangeExpenseType = (e, element) => {
    const { examineFlowConfig, platformCodes } = this.state;
    // 改变对应的费用分组信息
    examineFlowConfig[platformCodes][element].cost_group_id = e;
    this.setState({
      examineFlowConfig, // 审批流配置数据
    });
  }

  // 判断传递对象内是否含有空数据
  onJudgeEmpty = (data) => {
    let flag = false;
    const f = (obj) => {     // 递归函数
      for (const i in obj) {
        if (typeof obj[i] === 'object') {
          f(obj[i]);
        } else if (is.not.existy(obj[i]) || is.empty(obj[i])) {
          flag = true;
        }
      }
    };
    f(data);
    return flag;// 判断 是否含有空字符串 如果有 说明还有未选中项
  }

  // 获取对象的key值
  onGetObjectKeys = (data = {}) => {
    const arr = [];
    const f = (obj) => {     // 递归函数
      for (const i in obj) {
        if (typeof obj[i] === 'object') {
          f(obj[i]);
        } else {
          arr.push(i);
        }
      }
    };
    f(data);
    return arr;
  }

  // @TODO 校验审批流配置数据是否填写完整（已弃用）
  onVerifyExamineFlowConfig = () => {
    const { examineFlowConfig } = this.state;
    let flag;
    platforms.forEach((val) => {
      // 获取本地的配置项和接口的配置项
      const oldArray = this.onGetObjectKeys(config[val.id]);
      const newArray = this.onGetObjectKeys(examineFlowConfig[val.id]);
      // 判断配置项是否为空
      if (this.onJudgeEmpty(examineFlowConfig[val.id]) || oldArray.length !== newArray.length) { // 判断有空数据 提示用户
        flag = true;
        message.error(`您的${val.name}审批流配置还有未选中项!`);
      }
    });
    if (flag !== true) {
      return true;
    }
  }

  // 校验（只校验当前修改的TAB配置）
  onVerifyOption = () => {
    const { examineFlowConfig, platformCodes } = this.state;
    if (this.onJudgeEmpty(examineFlowConfig[platformCodes])) {
      message.error(`您的${platformCodes}审批流配置还有未选中项!`);
      return false;
    }
    return true;
  }

  // 点击确定 提交按钮
  onSubmit = () => {
    const { examineFlowConfig, platformCodes } = this.state;

    // 原始配置
    const originalConfig = dot.get(this.props, 'examineFlowConfig', {});

    // 提交的配置,只提交当前修改的TAb配置
    const submitConfig = {
      ...originalConfig,
      [platformCodes]: examineFlowConfig[platformCodes],
    };

    // 只校验当前修改的TAB配置
    const flag = this.onVerifyOption();

    // 校验审批流配置数据是否填写完整
    // const flag = this.onVerifyExamineFlowConfig();
    const params = {
      feature: 'house_contract',
      platforms: platforms.map(val => val.id),
      options: submitConfig, // 审批流配置数据
      onSuccessCallback: this.onSuccessCallback, // 成功回调
    };
    if (flag) {
      // 提交后台
      this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowConfig',
        payload: params });
    }
  }

  // 成功回调
  onSuccessCallback = () => {
    window.location.href = '/#/Expense/ExamineFlow/Process';
  }

  // 标签页
  renderTabs = () => {
    const { platformCodes } = this.state;
    const items = platforms.map((val) => {
      return {
        key: val.id,
        title: val.name,
        content: this.renderContent(val.id),
      };
    });
    const props = {
      items,
      defaultActiveKey: platformCodes,
      onChange: this.onChangeActiveKey,
    };
    return <CoreTabs {...props} />;
  }

  // 标签内容
  renderContent = (key) => {
    const { examineList, subjectsData } = this.props;
    const {
      examineFlowConfig,
    } = this.state;
    const props = {
      subjectsData: dot.get(subjectsData, 'data', []), // 科目列表
      accountings: examineFlowConfig[key].accountings, // 数据
      onChangeSupper: this.onChangeAccountings, // 改变供应商科目
      onChangePlatform: this.onChangeAccountings, // 改变平台科目
      onChangeBizDistrict: this.onChangeAccountings, // 改变商圈科目
      onChangeCity: this.onChangeAccountings, // 改变城市科目
    };

    const examleProps = {
      examineFlows: dot.get(examineList, 'data', []), // 审批流列表
      examineConfig: examineFlowConfig[key], // 配置文件
      onChangeExpenseType: this.onChangeExpenseType, // 改变费用分组
      onChangeExamine: this.onChangeExamine, // 改变审批流
      form: this.props.form,
    };

    return (<div>
      <ConfigSubject {...props} />
      <ConfigexamleFlow {...examleProps} />
    </div>);
  }

  render = () => {
    return (
      <div className={style['app-comp-expense-housing-management-component']}>
        {this.renderTabs()}
        <div className={style['app-comp-expense-housing-management-component-button']}>
          <Button
            type="primary"
            onClick={this.onSubmit}
            className={style['app-comp-expense-housing-management-component-submit']}
          >
          确定
          </Button>
          <Button
            type="default"
            onClick={() => { window.location.href = '/#/Expense/ExamineFlow/Process'; }}
          >
          取消
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({
  expenseExamineFlow: { examineFlowConfig, examineList },
  expenseSubject: { subjectsData },
}) {
  return { examineFlowConfig, examineList, subjectsData };
}
export default Form.create()(connect(mapStateToProps)(HousingManagementComponent));
