/**
 * 服务费方案-审批历史 Finance/Rules/History
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { CoreContent, CoreTabs } from '../../../components/core';
import { HouseholdType } from '../../../application/define';
import OrderContentComponent from './components/generator/order/content';           // 单量提成内容组件
import AttendanceContentComponent from './components/generator/attendance/content'; // 出勤内容组件
import ManagementContentComponent from './components/generator/management/content'; // 管理内容组件
import QualityContentComponent from './components/generator/quality/content';       // 质量内容组件

import styles from './style/index.less';

class ApprovalHistory extends Component {

  componentDidMount = () => {
    this.fetchPlanVersionData();
  }

  // 区分全职、兼职规则集
  getRuleCollection = () => {
    const planVersionId = this.props.location.query.planVersionId;
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

  // 刷新列表数据
  fetchPlanVersionData = () => {
    const planVersionId = this.props.location.query.planVersionId;
    if (!planVersionId) return;
    const payload = {
      id: planVersionId,
    };
    this.props.dispatch({ type: 'financePlan/fetchPlanVersionDetailData', payload });
  }

  // 空页面提示
  renderEmptyPage = () => {
    return (
      <div
        className={styles['app-comp-finance-history-empty-page']}
      >
        页面无数据
      </div>
    );
  }

  // 渲染页面头部信息
  renderPageHeader = () => {
    const planVersionId = this.props.location.query.planVersionId;
    const { planVersionDetailData } = this.props;
    const planId = this.props.location.query.planId;
    const bizDistrictName = dot.get(planVersionDetailData, `${planVersionId}.bizDistrictName`, '');
    const cityName = dot.get(planVersionDetailData, `${planVersionId}.cityName`, '');
    return (
      <div>
        <h1 className={styles['app-comp-finance-generator-history-page-header-title']}>
          {
            bizDistrictName ? `${cityName}-${bizDistrictName}` : cityName
          }
        </h1>
        <div
          className={styles['app-comp-finance-generator-history-page-header-content']}
        >
        当前查看的是服务费方案的历史存档，
        <a className={styles['app-comp-finance-generator-history-page-header-link']} href={`#/Finance/Rules?id=${planId}`}>查看最新 &gt;&gt;</a>
        </div>
      </div>
    );
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
        >
          {fullTimeObj ? this.renderRuleTabs(fullTimeObj) : this.renderEmptyPage()}
        </CoreContent>
        <CoreContent
          title="乙类"
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
    const planVersionId = this.props.location.query.planVersionId;
    const { platformCode } = dot.get(this.props.planVersionDetailData, `${planVersionId}`, {});
    if (key === '单量') {
      return (
        <OrderContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
        />
      );
    } else if (key === '出勤') {
      return (
        <AttendanceContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
        />
      );
    } else if (key === '质量') {
      return (
        <QualityContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
        />
      );
    } else if (key === '管理') {
      return (
        <ManagementContentComponent
          platformCode={platformCode}
          ruleCollectionId={id}
        />
      );
    }
  }


  render() {
    return (
      <div>
        {/* 渲染页面头部信息 */}
        {this.renderPageHeader()}
        {/* 渲染列表内容 */}
        {this.renderContent()}
      </div>
    );
  }
}
function mapStateToProps({ financePlan: { planVersionDetailData } }) {
  return { planVersionDetailData };
}
export default connect(mapStateToProps)(ApprovalHistory);
