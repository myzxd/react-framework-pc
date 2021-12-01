/**
 * 审批流设置 /Expense/ExamineFlow/Config
 */
import React, { Component } from 'react';
import { CoreTabs } from '../../../../components/core';
import HousingManagementComponent from './housingManagement/index';
import SalaryPlanComponent from './salaryPlan/index';
import SalaryIssueComponent from './salaryIssue/index';
import { ExamineFlowConfigType } from '../../../../application/define';

class ExpenseFlowConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.private = {
    };
  }

  // 渲染标签页
  renderCoreTabs = () => {
    const items = [
      {
        title: ExamineFlowConfigType.description('house_contract'),           // 标示
        key: ExamineFlowConfigType.houseManage,          // 标题
        content: <HousingManagementComponent />,         // 内容
      },
      {
        title: ExamineFlowConfigType.description('salary_plan'),                                 // 标示
        key: ExamineFlowConfigType.salaryPlan,           // 标题
        content: <SalaryPlanComponent />,  // 内容
      },
      {
        title: ExamineFlowConfigType.description('salary_payment'),                                // 标示
        key: ExamineFlowConfigType.salaryIssue,         // 标题
        content: <SalaryIssueComponent />,    // 内容
      },
    ];

    const props = {
      items,
      type: 'card',
      defaultActiveKey: ExamineFlowConfigType.houseManage,
    };
    return (
      <CoreTabs {...props} />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染标签页 */}
        {this.renderCoreTabs()}
      </div>
    );
  }
}

export default ExpenseFlowConfig;
