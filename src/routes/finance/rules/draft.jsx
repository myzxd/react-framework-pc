/**
 * 服务费规则--模板--草稿箱、审核中、待生效、已生效
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StarOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message, Empty } from 'antd';
import { CoreContent, CoreTabs } from '../../../components/core';
import { SalaryCollapseType, HouseholdType, FinanceRulesGeneratorStep } from '../../../application/define';
import Operate from '../../../application/define/operate';
import AddRuleModal from './components/common/addRuleModal';                  // 规则添加弹窗
import UpdataEffectiveModal from './components/common/updataEffectiveModal';  // 更改有效时间弹窗
import OrderContentComponent from './components/generator/order/content';           // 单量提成内容组件
import AttendanceContentComponent from './components/generator/attendance/content'; // 出勤内容组件
import ManagementContentComponent from './components/generator/management/content'; // 管理内容组件
import QualityContentComponent from './components/generator/quality/content';       // 质量内容组件

import styles from './style/index.less';

class RuleDraftlComponent extends Component {
  static propTypes = {
    type: PropTypes.number,            // 模板tab标识
    planVersionId: PropTypes.string,   // 服务费方案版本id
    planId: PropTypes.string,          // 服务费方案id
    onChangeCalculate: PropTypes.func, // 点击去试算回调
    isDelete: PropTypes.bool,          // 草稿箱、待生效删除按钮是否显示
  }

  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,           // 添加规则对话框是否展示
      updataVisible: false,        // 修改生效时间Model是否显示
      confirmLoading: false,       // 添加规则对话框确定按钮是否有loading
    };
  }

  // 获取服务费方案版本详情
  componentDidMount = () => {
    const { planVersionId } = this.props;
    if (!planVersionId) return;
    const payload = {
      id: planVersionId,
    };
    this.props.dispatch({ type: 'financePlan/fetchPlanVersionDetailData', payload });
  }

  componentDidUpdate(prevProps) {
    const { planVersionId } = this.props;
    if (prevProps.planVersionId !== planVersionId) {
      if (!planVersionId) return;
      const payload = {
        id: planVersionId,
      };
      this.props.dispatch({ type: 'financePlan/fetchPlanVersionDetailData', payload });
    }
  }

  // 请求成功回调
  onSuccessCallback = (e) => {
    const planId = e.record.plan_id;
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanDetailData', payload: { id: planId } });
  }

  // 请求失败回调
  onFailureCallback = (e) => {
    if (e.zh_message) {
      return message.error(e.zh_message);
    }
  }

  // 创建方案成功回调
  onSuccessChangeProgramCallback = (res) => {
    // 方案id、方案版本id
    const { planId, planVersionId } = this.props;
    const { platformCode } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});

    // 接口不成功，return
    if (!res.ok) return;
    if (!res.record._id) return;

    // 跳转编辑页面
    window.location.href = `/#/Finance/Rules/Generator?id=${res.record._id}&planId=${planId}&planVersionId=${planVersionId}&platformCode=${platformCode}`;
  }

  // 创建方案失败回调
  onFailureChangeProgramCallback = (e) => {
    if (e.zh_message) {
      return message.error(e.zh_message);
    }
  }

  // 添加规则对话框展示隐藏切换
  onChangeModalDisplayState = () => {
    this.setState({
      ...this.state,
      addVisible: !this.state.addVisible,
    });
  }

  // 修改生效时间Model展示隐藏切换
  onChangeEffectiveModalDisplayState = () => {
    this.setState({
      updataVisible: !this.state.updataVisible,
    });
  }

  // 区分全职、兼职规则集
  getRuleCollection = () => {
    const { planVersionId } = this.props;
    const planVersionDetailData = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});  // 服务费方案版本详情
    let fullTimeObj;   // 全职规则集
    let partTimeIdObj; // 兼职规则集
    if (Object.keys(planVersionDetailData).length === 0) return {};
    // 根据工作性质获取规则集id
    planVersionDetailData.rulesList.forEach((item) => {
      if (item.workType === HouseholdType.first) {
        fullTimeObj = item;
      }
      if (item.workType === HouseholdType.second) {
        partTimeIdObj = item;
      }
    });
    return { fullTimeObj, partTimeIdObj };
  }

  // 修改方案(全职)
  changeFullTimeProgram = () => {
    const { planId, planVersionId } = this.props;
    const { platformCode } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const ruleCollectionObj = this.getRuleCollection();
    if (Object.keys(ruleCollectionObj).length === 0) return message.error('无服务费规则');
    const { fullTimeObj } = ruleCollectionObj;

    // 没有甲类方案，则创建甲类方案
    if (!fullTimeObj) {
      // 接口参数
      const payload = {
        planVersionId, // 版本id
        workType: HouseholdType.first, // 乙类
        onSuccessCallback: this.onSuccessChangeProgramCallback, // 成功回调
        onFailureCallback: this.onFailureChangeProgramCallback, // 失败回调
      };

      this.props.dispatch({
        type: 'financePlan/createRuleCollection',
        payload,
      });

      return;
    }

    // 甲类方案存在，则进入编辑页
    window.location.href = `/#/Finance/Rules/Generator?id=${fullTimeObj.id}&planId=${planId}&planVersionId=${planVersionId}&platformCode=${platformCode}`;
  }

  // 修改方案(兼职)
  changePartTimeProgram = () => {
    const { planId, planVersionId } = this.props;
    const { platformCode } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const ruleCollectionObj = this.getRuleCollection();
    if (Object.keys(ruleCollectionObj).length === 0) return message.error('无服务费规则');
    const { partTimeIdObj } = ruleCollectionObj;

    // 乙类方案不存在，则创建乙类方案
    if (!partTimeIdObj) {
      // 接口参数
      const payload = {
        planVersionId, // 版本id
        workType: HouseholdType.second, // 乙类
        onSuccessCallback: this.onSuccessChangeProgramCallback, // 成功回调
        onFailureCallback: this.onFailureChangeProgramCallback, // 失败回调
      };

      this.props.dispatch({
        type: 'financePlan/createRuleCollection',
        payload,
      });

      return;
    }

    // 乙类方案存在，则跳转入编辑页
    window.location.href = `/#/Finance/Rules/Generator?id=${partTimeIdObj.id}&planId=${planId}&planVersionId=${planVersionId}&&platformCode=${platformCode}`;
  }

  // 返回草稿（待生效）
  toDraft = () => {
    const { planVersionId } = this.props;
    const payload = {
      id: planVersionId,
      onSuccessCallback: this.onSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    };
    this.props.dispatch({ type: 'financePlan/backPlanVersion', payload });
  }

  // 调薪（创建一份草稿）
  createDraft = () => {
    const { planVersionId } = this.props;
    const payload = {
      id: planVersionId,
      onSuccessCallback: this.onSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    };
    this.props.dispatch({ type: 'financePlan/adjustSalaryPlan', payload });
  }

  // 删除草稿
  deleteDraft = () => {
    const { planVersionId } = this.props;
    const payload = {
      id: planVersionId,
      onSuccessCallback: this.onSuccessCallback,
    };
    this.props.dispatch({ type: 'financePlan/deletePlanVersion', payload });
  }

  // 去试算
  toCalculate = () => {
    const { planVersionId, onChangeCalculate } = this.props;
    if (onChangeCalculate) {
      onChangeCalculate(planVersionId);
    }
  }

  // 展示有效时间
  renderEffective = () => {
    const { planVersionId } = this.props;
    const { fromDate, toDate } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const startDate = fromDate ? moment(`${fromDate}`).format('LL') : '';
    const endDate = toDate ? moment(`${toDate}`).format('LL') : '';
    return (
      <div className={styles['app-comp-finance-generator-draft-effective']}>
        <span>有效时间：</span>
        <span>{`${startDate} 至 ${endDate}`}</span>
      </div>
    );
  }

  // 渲染编辑生效时间弹窗
  renderUpdataEffectiveModal = () => {
    const { updataVisible } = this.state;
    const { planVersionId, type } = this.props;
    const { fromDate, toDate, canAllowEdit } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const props = {
      visible: updataVisible,
      planVersionId,
      fromDate: `${fromDate}`,
      toDate: `${toDate}`,
      onChangeModalDisplayState: this.onChangeEffectiveModalDisplayState,
    };
    if (type === SalaryCollapseType.todo || type === SalaryCollapseType.now) return;
    return (
      <div className={styles['app-comp-finance-generator-draft-update-effective']}>
        {
          canAllowEdit
          && Operate.canOperateFinancePlanRulesUpdate()
          && <Button
            type="primary"
            onClick={this.onChangeEffectiveModalDisplayState}
          >调整时间</Button>
        }
        <UpdataEffectiveModal {...props} />
      </div>
    );
  }

  // 渲染添加弹窗
  renderAddModal = () => {
    const { addVisible, confirmLoading } = this.state;
    const { planVersionId, planId } = this.props;
    const { platformCode } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const props = {
      visible: addVisible,
      confirmLoading,
      planVersionId,
      planId,
      platformCode,
      onChangeModalDisplayState: this.onChangeModalDisplayState,
    };
    const type = this.props.type;
    if (type === SalaryCollapseType.draft) {
      return (
        <div className={styles['app-comp-finance-generator-draft-add-modal-wrap']}>
          {
            !Operate.canOperateFinancePlanRulesCreate()
            || <Button
              type="primary"
              onClick={this.onChangeModalDisplayState}
            >创建方案</Button>
          }
          <AddRuleModal {...props} />
        </div>
      );
    }
  }

  // 渲染下方操作按钮
  renderSubmit = () => {
    const { isDelete, planVersionId } = this.props;
    const { canAllowEdit, canAllowCompute } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const type = this.props.type;
    if (type === SalaryCollapseType.review) {
      return (
        <div className={styles['app-comp-finance-generator-draft-operation-wrap']}>
          {!canAllowCompute || <Button className={styles['app-comp-finance-generator-draft-button']} onClick={this.toCalculate} >去试算</Button>}
          <Popconfirm
            title=""
            onConfirm={this.changeFullTimeProgram}
            onCancel={this.changePartTimeProgram}
            okText="甲类"
            cancelText="乙类"
          >
            {!canAllowEdit || (!Operate.canOperateFinancePlanRulesUpdate() || <Button type="primary" >修改方案</Button>)}
          </Popconfirm>
        </div>
      );
    }
    if (type === SalaryCollapseType.todo) {
      return (
        <div className={styles['app-comp-finance-generator-draft-operation-wrap']}>
          <Popconfirm
            title="默认返回草稿箱"
            onConfirm={this.toDraft}
            okText="是"
            cancelText="否"
          >
            {!Operate.canOperateFinancePlanVersionToDraft() || <Button type="primary" >取消生效</Button>}
          </Popconfirm>
        </div>
      );
    }
    if (type === SalaryCollapseType.now) {
      return (
        <div className={styles['app-comp-finance-generator-draft-operation-wrap']}>
          {!Operate.canOperateFinancePlanVersionCreateDraft() || <Button type="primary" onClick={this.createDraft} >调薪</Button>}
        </div>
      );
    }
    // 去试算，提交审核（提交前需要先试算，如果没试算，提交后台报错。）
    if (type === SalaryCollapseType.draft) {
      return (
        <div className={styles['app-comp-finance-generator-draft-operation-wrap']}>
          <Popconfirm
            title="确定删除此版本？"
            onConfirm={this.deleteDraft}
            okText="是"
            cancelText="否"
          >
            {!isDelete || (!Operate.canOperateFinancePlanVersionDelete() || <Button className={styles['app-comp-finance-generator-draft-button']}>删除</Button>)}
          </Popconfirm>
          {!canAllowCompute || <Button
            className={styles['app-comp-finance-generator-draft-button']}
            type="primary"
            onClick={this.toCalculate}
          >去试算并提交审核</Button>}
        </div>
      );
    }
  }

  // 渲染全职、兼职titleExt
  renderTitleExt = (id) => {
    const { planId, planVersionId } = this.props;
    const type = this.props.type;
    const { platformCode, fromDate } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    const year = `${fromDate}`.substr(0, 4);
    const month = `${fromDate}`.substr(4, 2);
    const day = `${fromDate}`.substr(6, 2);
    if (type === SalaryCollapseType.todo) {
      return (
        <span>
          <StarOutlined className={styles['app-comp-finance-generator-draft-title-ext']} />
            生效日期: {`${year}年${month}月${day}日`}
        </span>
      );
    } else if (type === SalaryCollapseType.draft) {
      return (
        !Operate.canOperateFinancePlanRulesUpdate()
        || <a
          className={styles['app-comp-finance-generator-draft-senior-editor']}
          href={`/#/Finance/Rules/Generator?id=${id}&planId=${planId}&planVersionId=${planVersionId}&platformCode=${platformCode}`}
        >
          高级编辑模式
        </a>
      );
    } else {
      return '';
    }
  }

  // 渲染列表内容
  renderContent = () => {
    const ruleCollectionObj = this.getRuleCollection();
    if (Object.keys(ruleCollectionObj).length === 0) return;
    const { fullTimeObj, partTimeIdObj } = ruleCollectionObj;
    return (
      <div>
        <CoreContent
          title="甲类"
          titleExt={fullTimeObj ? this.renderTitleExt(fullTimeObj.id) : ''}
        >
          {fullTimeObj ? this.renderRuleTabs(fullTimeObj) : this.renderEmptyPage()}
        </CoreContent>
        <CoreContent
          title="乙类"
          titleExt={partTimeIdObj ? this.renderTitleExt(partTimeIdObj.id) : ''}
        >
          {partTimeIdObj ? this.renderRuleTabs(partTimeIdObj) : this.renderEmptyPage()}
        </CoreContent>
      </div>
    );
  }

  // 渲染规则标签页面
  renderRuleTabs = (obj) => {
    // key自定义。可以使用服务器的数据状态作为key。
    const items = [
      {
        title: `单量提成 ${obj.orderRules.length}`,
        content: this.renderRuleTabContent('单量', obj.id),
        disabled: !obj.orderRuleFlag,
        key: '单量',
      },
      {
        title: `出勤奖罚 ${obj.workRules.length}`,
        content: this.renderRuleTabContent('出勤', obj.id),
        disabled: !obj.workRuleFlag,
        key: '出勤',
      },
      {
        title: `质量奖罚 ${obj.qaRules.length}`,
        content: this.renderRuleTabContent('质量', obj.id),
        disabled: !obj.qaRuleFlag,
        key: '质量',
      },
      {
        title: `管理奖罚 ${obj.operationRules.length}`,
        content: this.renderRuleTabContent('管理', obj.id),
        disabled: !obj.operationRuleFlag,
        key: '管理',
      },
    ];
    return (
      <CoreTabs items={items} onChange={this.onChange} defaultActiveKey={'单量'} />
    );
  }

  // 渲染规则tab内容
  renderRuleTabContent = (key, id) => {
    const { type, planVersionId } = this.props;
    const { platformCode } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    if (key === '单量') {
      return (
        <OrderContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
          type={type}
        />
      );
    } else if (key === '出勤') {
      return (
        <AttendanceContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
          type={type}
        />
      );
    } else if (key === '质量') {
      return (
        <QualityContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
          type={type}
        />
      );
    } else if (key === '管理') {
      return (
        <ManagementContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
          type={type}
          tags={FinanceRulesGeneratorStep.forth}
        />
      );
    }
  }

  // 空页面提示
  renderEmptyPage = () => {
    return (
      <div
        className={styles['app-comp-finance-generator-draft-empty-page']}
      >
        <Empty />
      </div>
    );
  }

  render() {
    const { planVersionId } = this.props;
    return (
      <div>
        {
          // 方案版本id不存在说明无数据
          planVersionId ?
            <div>
              <div className={styles['app-comp-finance-generator-draft-wrap']}>
                {/* 展示生效日期 */}
                {this.renderEffective()}
                {/* 编辑生效时间弹窗 */}
                {this.renderUpdataEffectiveModal()}
                {/* 添加弹窗 */}
                {this.renderAddModal()}
              </div>
              {/* 列表内容 */}
              {this.renderContent()}
              {/* 下方操作按钮 */}
              {this.renderSubmit()}
            </div> :
            this.renderEmptyPage()
        }
      </div>
    );
  }
}

function mapStateToProps({ financePlan: { planVersionDetailData } }) {
  return { planVersionDetailData };
}
export default connect(mapStateToProps)(RuleDraftlComponent);
