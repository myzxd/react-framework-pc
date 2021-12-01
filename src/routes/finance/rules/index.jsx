/**
 * 服务费规则 Finance/Rules
 */
import { Button, Badge } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import { CoreTabs } from '../../../components/core';
import { SalaryCollapseType } from '../../../application/define';
import Storage from '../../../application/library/storage';

import RuleDraftlComponent from './draft';           // 草稿组件
import CalculateComponent from './calculate/index';  // 试算组件

import styles from './style/index.less';

class IndexComponent extends Component {
  constructor(props) {
    super(props);
    const { activeTab, activePlanVersionId } = this.getActiveTab(props);
    this.state = {
      activePlanVersionId: activePlanVersionId || '',          // 当前去试算按钮页面对应的方案版本id
      activeTab: props.location.query.activeTab || activeTab,  // 当前选中的tab
      isDelete: false,          // 草稿箱、待生效删除按钮是否显示
    };
    this.private = {
      FinanceBadge: {
        // 草稿箱是否显示小红点
        isDraftBadge: false,
        // 审核中是否显示小红点
        isReviewBadge: false,
        // 待生效是否显示小红点
        isTodoBadge: false,
        // 已生效是否显示小红点
        isActiveBadge: false,
      },
      // 本地存储(服务费规则列表页小红点展示)
      FinanceBadgeCacheControl: new Storage('aoao.app.cache', { container: 'Finance', useSession: true }),
    };
    // // 服务费试算页面刷新定时器
    // this.setInter = undefined;
  }

  // 获取服务费方案详情请求
  componentDidMount = () => {
    const { id } = this.props.location.query;
    const payload = {
      id,
    };
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanDetailData', payload });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.salaryPlanDetailData !== this.props.salaryPlanDetailData) {
      const { activeTab, activePlanVersionId, isDelete } = this.getActiveTab(this.props);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isDelete,
      });
      // 当传入tab值时return
      if (this.props.location.query.activeTab) return;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        activeTab,
        activePlanVersionId,
      });
    }
  }

  // componentDidUpdate() {
  //   const { activeTab } = this.state;
  //   // 当前tab为服务费时开启定时器，否则关闭定时器
  //   if (activeTab === SalaryCollapseType.description(SalaryCollapseType.calculate)) {
  //     this.addSetInter();
  //   } else {
  //     clearInterval(this.setInter);
  //   }
  // }

  // componentWillUnmount() {
  //   clearInterval(this.setInter);
  // }

  // 方案版本页面点击去试算回调
  onChangeCalculate = (activePlanVersionId) => {
    this.setState({
      activePlanVersionId,
      activeTab: SalaryCollapseType.description(SalaryCollapseType.calculate),
    });
  }

  // Tab切换事件
  onChange = (e) => {
    const { isReview } = this.props.location.query;
    const { salaryPlanDetailData } = this.props;
    const { FinanceBadgeCacheControl, FinanceBadge } = this.private;
    const {
      activeVersion,       // 已生效方案版本id
      draftVersion,        // 草稿箱方案版本id
      applicationVersion,  // 审核中方案版本id
      pendingVersion,      // 待生效方案版本id
      id,                  // 服务费方案id
    } = salaryPlanDetailData;
    let activeTab;
    // 草稿箱、已生效id都存在
    if (draftVersion && activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.draft);
    // 审核中、已生效id都存在
    } else if (applicationVersion && activeVersion) {
      // 是否是在审批单详情页面（审批还未完成）跳转过来的
      if (isReview === '1') {
        activeTab = SalaryCollapseType.description(SalaryCollapseType.now);
      } else {
        activeTab = SalaryCollapseType.description(SalaryCollapseType.review);
      }
    // 待生效、已生效id都存在
    } else if (pendingVersion && activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.todo);
    }
    // 点击有小红点的tab时取消显示小红点
    if (e === activeTab) {
      FinanceBadge.isDraftBadge = false;
      FinanceBadge.isReviewBadge = false;
      FinanceBadge.isTodoBadge = false;
      FinanceBadge.isActiveBadge = false;
      const Finance = {
        salaryPlanId: id,
        isChangeTab: true,
      };
      FinanceBadgeCacheControl.set(Finance);
    }
    // 改变当前tab
    this.setState({
      activeTab: e,
    });
  }

  // 跳转到指标设置页面
  onDirectToFinanceConfig = () => {
    window.location.href = '/#/Finance/Config/Index';
  }

  // 根据服务费方案规则集id判断显示tab
  getActiveTab = (props) => {
    const { isReview } = props.location.query; // 是否是在审批单详情页面（审批还未完成）跳转过来的
    const { salaryPlanDetailData } = props;
    let activeTab;           // 当前显示tab
    let activePlanVersionId; // 可试算的方案版本id
    let isDelete;            // 草稿箱、待生效删除按钮是否显示
    if (Object.keys(salaryPlanDetailData).length === 0) return { activeTab, activePlanVersionId };
    const {
      activeVersion,       // 已生效方案版本id
      draftVersion,        // 草稿箱方案版本id
      applicationVersion,  // 审核中方案版本id
      pendingVersion,      // 待生效方案版本id
    } = salaryPlanDetailData;
    // 草稿箱id存在 已生效id不存在
    if (draftVersion && !activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.draft);
      activePlanVersionId = draftVersion;
    // 审核中id存在 已生效id不存在
    } else if (applicationVersion && !activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.review);
      activePlanVersionId = applicationVersion;
    // 待生效id存在 已生效id不存在
    } else if (pendingVersion && !activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.todo);
    // 草稿箱、已生效id都存在
    } else if (draftVersion && activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.now);
      activePlanVersionId = draftVersion;
      isDelete = true;
    // 审核中、已生效id都存在
    } else if (applicationVersion && activeVersion) {
      // 是否是在审批单详情页面（审批还未完成）跳转过来的
      if (isReview === '1') {
        activeTab = SalaryCollapseType.description(SalaryCollapseType.review);
      } else {
        activeTab = SalaryCollapseType.description(SalaryCollapseType.now);
      }
      activePlanVersionId = applicationVersion;
    // 待生效、已生效id都存在
    } else if (pendingVersion && activeVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.now);
      isDelete = true;
    // 只有已生效id存在
    } else if (activeVersion && !draftVersion && !applicationVersion && !pendingVersion) {
      activeTab = SalaryCollapseType.description(SalaryCollapseType.now);
    }
    return { activeTab, activePlanVersionId, isDelete };
  }

  // 当tab切换到草稿箱时显示指标配置按钮
  getOperations = (activeTab) => {
    let operations;
    if (activeTab === SalaryCollapseType.description(SalaryCollapseType.draft)) {
      operations = (
        <Button
          className={styles['app-comp-finance-finance-config']}
          size="large"
          onClick={this.onDirectToFinanceConfig}
        >
          指标配置
        </Button>
      );
    } else {
      operations = '';
    }
    return operations;
  }

  // // 添加定时器
  // addSetInter = () => {
  //   const { activePlanVersionId } = this.state;
  //   this.setInter = setInterval(() => {
  //     const payload = {
  //       planVersionId: activePlanVersionId,
  //     };
  //     this.props.dispatch({ type: 'financePlan/fetchSalaryPlanResultsData', payload: { ...payload, type: 'now' } });
  //     this.props.dispatch({ type: 'financePlan/fetchSalaryPlanHistoryData', payload });
  //   }, 10000);
  // }

  // 渲染标签页面
  renderTabs = () => {
    const { isReview } = this.props.location.query;
    const { salaryPlanDetailData } = this.props;
    const { FinanceBadgeCacheControl, FinanceBadge } = this.private;
    const planId = this.props.location.query.id;  // 服务费方案id
    const { isChangeTab, salaryPlanId } = FinanceBadgeCacheControl.get();
    const { activePlanVersionId, activeTab, isDelete } = this.state;
    const operations = this.getOperations(activeTab);
    const {
      activeVersion,       // 已生效方案版本id
      draftVersion,        // 草稿箱方案版本id
      applicationVersion,  // 审核中方案版本id
      pendingVersion,      // 待生效方案版本id
      domain,              // 适用范围（城市或商圈）
      id,                  // 服务费方案id
    } = salaryPlanDetailData;
    // 草稿箱id存在 已生效id不存在
    if (draftVersion && activeVersion && (!isChangeTab || salaryPlanId !== id)) {
      FinanceBadge.isDraftBadge = true;
    // 审核中、已生效id都存在
    } else if (applicationVersion && activeVersion && (!isChangeTab || salaryPlanId !== id)) {
      // 是否是在审批单详情页面（审批还未完成）跳转过来的
      if (isReview === '1') {
        FinanceBadge.isActiveBadge = true;
      } else {
        FinanceBadge.isReviewBadge = true;
      }
    // 待生效、已生效id都存在
    } else if (pendingVersion && activeVersion && (!isChangeTab || salaryPlanId !== id)) {
      FinanceBadge.isTodoBadge = true;
    }
    const {
      isDraftBadge,
      isReviewBadge,
      isTodoBadge,
      isActiveBadge,
    } = FinanceBadge;
    // key自定义。可以使用服务器的数据状态作为key。
    const items = [
      {
        title: isDraftBadge ? <Badge dot><span>草稿箱</span></Badge> : '草稿箱',
        content: <RuleDraftlComponent
          onChangeCalculate={this.onChangeCalculate}
          planVersionId={draftVersion}
          planId={planId}
          type={SalaryCollapseType.draft}
          isDelete={isDelete}
        />,
        key: '草稿箱',
      },
      {
        title: isReviewBadge ? <Badge dot><span>审核中</span></Badge> : '审核中',
        content: <RuleDraftlComponent
          onChangeCalculate={this.onChangeCalculate}
          planVersionId={applicationVersion}
          planId={planId}
          type={SalaryCollapseType.review}
        />,
        key: '审核中',
      },
      {
        title: isTodoBadge ? <Badge dot><span>待生效</span></Badge> : '待生效',
        content: <RuleDraftlComponent
          planVersionId={pendingVersion}
          planId={planId}
          type={SalaryCollapseType.todo}
          isDelete={isDelete}
        />,
        key: '待生效',
      },
      {
        title: isActiveBadge ? <Badge dot><span>已生效</span></Badge> : '已生效',
        content: <RuleDraftlComponent
          planVersionId={activeVersion}
          planId={planId}
          type={SalaryCollapseType.now}
        />,
        key: '已生效',
      },
      {
        title: '试算服务费',
        content: <CalculateComponent
          planVersionId={activePlanVersionId}
          planId={planId}
          domain={domain}
          activeTab={activeTab}
        />,
        key: '试算服务费',
      },
    ];
    return (
      <div>
        <h1 className={styles['app-comp-finance-rule-city']}>
          {
            salaryPlanDetailData.bizDistrictName
            ? `${salaryPlanDetailData.cityName}-${salaryPlanDetailData.bizDistrictName}`
            : salaryPlanDetailData.cityName
          }
        </h1>
        <CoreTabs operations={operations} items={items} onChange={this.onChange} type="card" activeKey={activeTab} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染标签页面 */}
        {this.renderTabs()}
      </div>
    );
  }
}
function mapStateToProps({ financePlan: { salaryPlanDetailData } }) {
  return { salaryPlanDetailData };
}
export default connect(mapStateToProps)(IndexComponent);
