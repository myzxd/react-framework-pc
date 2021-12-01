/**
 * 审批流设置 - 审批流配置 - 服务费方案 /Expense/ExamineFlow/Config
 */
import is from 'is_js';
import _ from 'lodash';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Button, message } from 'antd';
import Items from './component/items';
import style from './style.css';

import { CoreTabs } from '../../../../../components/core';
import { authorize } from '../../../../../application';

const { itemsConfig } = Items;
const platforms = authorize.platform();

class SalaryPlanComponent extends Component {
  static getDerivedStateFromProps(prevProps, oriState) {
    const { examineFlowConfig = undefined, submitConfig = undefined } = oriState;
    const { salaryPlanConfig = {} } = prevProps;
    if (examineFlowConfig === undefined && Object.keys(salaryPlanConfig).length > 0) {
      return { examineFlowConfig: _.cloneDeep(salaryPlanConfig) };
    }

    if (submitConfig === undefined && Object.keys(salaryPlanConfig).length > 0) {
      return { submitConfig: _.cloneDeep(salaryPlanConfig) };
    }
    return null;
  }

  constructor() {
    super();
    let platformCodes;
    if (is.existy(platforms) && is.not.empty(platforms)) {
      platformCodes = platforms[0].id;
    }
    this.state = {
      platformCodes, // 标签key 默认为饿了么
      examineFlowConfig: undefined,
      submitConfig: undefined,
    };
  }

  componentDidMount = () => {
    const params = {
      platforms: platforms.map(val => val.id), // 平台
    };
    // 获取审批流(服务费方案)配置数据
    this.props.dispatch({ type: 'expenseExamineFlow/fetchSalaryPlanConfig', payload: params });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseExamineFlow/resetSalaryPlanConfig' });
  }

  // 改变平台标签key值
  onChangeActiveKey = (platformCodes) => {
    this.setState({
      platformCodes,          // 标签key
    });
  }

  // 修改子项目
  onChangeItems = (key, e) => {
    const { examineFlowConfig, platformCodes } = this.state;

    // 更新当前操作的配置项数据
    const value = {
      platform_code: platformCodes,
      flow_id: e.examineFlow,               // 审批流id
      supplier_ids: e.supplier,             // 供应商id
      city_codes: e.cityCodes,              // 城市id(city_codes)
      city_spelling_list: e.city,                // 城市(city_spelling)
      biz_district_ids: e.district,         // 商圈id
      domain: e.domain,                     // 适用范围
      uniqueKey: e.uniqueKey,               // 唯一key
      supplierName: e.supplierName,         // 供应商name
      cityName: e.cityName,                 // 城市name
      districtName: e.districtName,         // 商圈name
      platformName: e.platformName,         // 平台name
    };

    dot.set(examineFlowConfig[platformCodes], `${key}`, value);
    this.setState({
      examineFlowConfig,
    });
  }

  // 删除 (审批流配置数据条目)
  onDelete = (key) => {
    const { platformCodes, examineFlowConfig } = this.state;

    // 判断当前平台的配置数据是否有值，如果有值，才能够删除当前平台下的指定配置项
    if (examineFlowConfig[platformCodes]) {
      examineFlowConfig[platformCodes].splice(key, 1);
      this.setState({
        examineFlowConfig,
      });
    }
  }

  // 添加 (审批流配置数据条目)
  onCreate = (key) => {
    const { platformCodes, examineFlowConfig } = this.state;

    // 校验当前的配置项，如果都有值，才能创建新的配置项
    const verifyData = dot.get(examineFlowConfig[platformCodes], `${key}`);
    if (is.not.existy(verifyData.flow_id) || is.empty(verifyData.supplier_ids) || is.empty(verifyData.city_codes) || is.empty(verifyData.biz_district_ids)) {
      return message.error('您的配置项还没填写完成');
    }

    // 判断当前平台的配置数据是否有值，如果有值，才能够在当前平台下的配置数据数组后添加新的配置项
    if (examineFlowConfig[platformCodes]) {
      examineFlowConfig[platformCodes].push({
        uniqueKey: Math.random().toString(36).substr(2),
      });
    }

    this.setState({
      examineFlowConfig,
    });
  }

  // 复制按钮 (审批流配置数据条目)
  onCopy = (value) => {
    const { platformCodes, examineFlowConfig } = this.state;

    // 判断当前平台下审批流配置的最后一条配置是否有值，如果没有值，则移除最后一项，将拷贝的配置项放入数组最后
    const lastData = dot.get(examineFlowConfig[platformCodes], `${examineFlowConfig[platformCodes].length - 1}`);
    if (examineFlowConfig[platformCodes].length !== 1 && (is.not.existy(lastData.flow_id) || is.empty(lastData.supplier_ids) || is.empty(lastData.city_codes) || is.empty(lastData.biz_district_ids))) {
      examineFlowConfig[platformCodes].pop();
    }

    // 校验当前被拷贝的配置项，如果他都有值，才能进行拷贝操作
    if (is.not.existy(value.examineFlow) || is.empty(value.supplier) || is.empty(value.cityCodes) || is.empty(value.district)) {
      return message.error('您的配置项还没填写完成');
    }

    // 定义新组数数据为原数组数据，避免引用关系
    const copyData = {
      flow_id: value.examineFlow,                       // 审批流id
      supplier_ids: value.supplier,             // 供应商id
      city_codes: value.cityCodes,                 // 城市id
      biz_district_ids: value.district,     // 商圈id
      domain: value.domain,                         // 适用范围
      uniqueKey: Math.random().toString(36).substr(2),  // 唯一key值
      supplierName: value.supplierName,               // 供应商name
      cityName: value.cityName,                       // 城市name
      districtName: value.districtName,               // 商圈name
      platformName: value.platformName,               // 平台name
    };

    // 判断当前平台下的配置数据是否有值，如果有值，才能够将拷贝的配置项添加到当前平台的配置数据数组中
    if (examineFlowConfig[platformCodes]) {
      examineFlowConfig[platformCodes].push(copyData);
      this.setState({
        examineFlowConfig,
      });
    }
  }

  // 校验数据 判断每一条配置项数据下的必填项是否有值，如果都有值，则可以提交
  onVerify = (data) => {
    // 遍历每一项，判断他是否为空
    let isPass = true;
    data.forEach((item) => {
      // 判断每条配置项是否为空
      if (is.empty(item)) {
        isPass = false;
      }
      // 判断配置项中的审批流是否选中
      if (!is.existy(item.flow_id)) {
        isPass = false;
      }
      // 判断配置项中的供应商是否选中
      if (is.empty(item.supplier_ids)) {
        isPass = false;
      }
      // 判断配置项中的商圈是否选中
      if (is.empty(item.biz_district_ids)) {
        isPass = false;
      }
      // 判断配置项中的城市是否选中
      if (is.empty(item.city_codes)) {
        isPass = false;
      }
      // 判断配置项中的适用范围是否有值
      if (!is.existy(item.domain)) {
        isPass = false;
      }
    });
    return isPass;
  }

  // 点击确定，提交
  onSubmit = () => {
    const { examineFlowConfig, platformCodes, submitConfig } = this.state;
    // 编辑并校验需要提交的数据
    const options = {};
    platforms.forEach((val) => {
      if (platformCodes === val.id) {
        options[platformCodes] = examineFlowConfig[platformCodes];
      } else {
        options[val.id] = submitConfig[val.id];
      }
    });
    // 数据校验
    if (!this.onVerify(options[platformCodes])) {
      return message.error('您的审批流配置（服务费规则配置）还有未选中项!');
    }
    // 提交后台
    this.props.dispatch({ type: 'expenseExamineFlow/updateSalaryPlanConfig',
      payload: {
        platforms: platforms.map(val => val.id),
        options,                                            // 审批流配置数据
        onSuccessCallback: this.onSuccessCallback,          // 成功回调
      },
    });
  }

  // 成功回调
  onSuccessCallback = () => {
    window.location.href = '/#/Expense/ExamineFlow/Process';
  }

  // 渲染标签页
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

  // 标签页内容
  renderContent = () => {
    const { platformCodes = undefined, examineFlowConfig = {} } = this.state;
    // 初始化没获取到数据时，自定义
    if (!examineFlowConfig[platformCodes] || is.empty(examineFlowConfig[platformCodes])) {
      examineFlowConfig[platformCodes] = [{}];
    }
    // 渲染当前平台key的tab
    const dataSource = examineFlowConfig[platformCodes];

    return (
      <div className={style['app-comp-expense-salary-plan-component-content']}>
        {
          dataSource.map((item, index, records) => {
            const length = records.length;
            // 显示项目的配置项
            const config = [];
            // 只有一行数据的情况下，只显示创建按钮
            if (length === 1) {
              config.push(itemsConfig.openCreate);
              // 多行数据的情况下，最后一条显示创建按钮
            } else if (index === length - 1) {
              config.push(itemsConfig.openCreate, itemsConfig.openDelete);
              // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮
            } else {
              config.push(itemsConfig.openDelete);
            }

            // 判断是否是可编辑状态
            // 如果当前数据项是唯一一项，或者是数据数组的最后一项，则为可编辑状态，否则为不可编辑状态
            // 编辑状态为表单显示，不可编辑状态为文本显示
            let isEdit = false;
            if (dataSource.length === 1 || index === dataSource.length - 1) {
              isEdit = true;
            }

            // 定义唯一的key值，防止组件之间相互影响
            const uniqueKey = item.uniqueKey ? item.uniqueKey : `salaryPlan${platformCodes}${item.flow_id}${index}`;
            // 合并表单数据，传递给下一级组件
            const itemProps = {
              config,
              uniqueKey,
              isEdit,
              platformCodes, // 当前平台
              onCreate: this.onCreate,
              onDelete: this.onDelete,
              onCopy: this.onCopy,
              onChange: this.onChangeItems,
              value: {
                examineFlow: item.flow_id,
                supplier: item.supplier_ids,
                city: item.city_spelling_list,
                cityCodes: item.city_codes,
                district: item.biz_district_ids,
                domain: item.domain,
                supplierName: item.supplierName,
                cityName: item.cityName,
                districtName: item.districtName,
                platformName: item.platformName,
              },
              operateKey: index,
            };
            return <Items key={uniqueKey} {...itemProps} />;
          })
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染Tab标签内容 */}
        { this.renderTabs() }

        {/* 渲染底部操作按钮 */}
        <div className={style['app-comp-expense-salary-plan-component-button']}>
          <Button type="primary" onClick={this.onSubmit} className={style['app-comp-expense-salary-plan-component-submit']}>确定</Button>
          <Button type="default" onClick={() => { window.location.href = '/#/Expense/ExamineFlow/Process'; }}>取消</Button>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ expenseExamineFlow: { salaryPlanConfig } }) {
  return { salaryPlanConfig };
}
export default connect(mapStateToProps)(SalaryPlanComponent);
