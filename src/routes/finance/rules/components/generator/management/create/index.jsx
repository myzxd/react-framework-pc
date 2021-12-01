/**
 * 服务费规则生成 - 管理组件 - 创建组件 Finance/Rules/Generator
 */
import React, { Component } from 'react';
import ComponentInsuranceDeductions from './insuranceDeduct';
// import ComponentSuppliesDeductions from './suppliesDeduct';
import { CoreTabs } from '../../../../../../../components/core';
import { FinanceSalaryManagementType } from '../../../../../../../application/define';


class ManagementCreateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDebugMode: window.application.system.isDebugMode(),     // 当前是否为调试模式，用于隐藏服务费模块功能
    };
  }

  // 渲染管理创建
  renderTabs = () => {
    // const { isDebugMode } = this.state;
    const { platformCode, ruleCollectionId, tags } = this.props;
    const items = [
      {
        title: `${FinanceSalaryManagementType.description(
          FinanceSalaryManagementType.insurance)}扣款设置`,
        content: (
          <ComponentInsuranceDeductions
            tags={tags}
            bizCate={FinanceSalaryManagementType.insurance}
            ruleCollectionId={ruleCollectionId}
            platformCode={platformCode}
          />
        ),
        key: FinanceSalaryManagementType.insurance,
      },
    ];
    // 判断当前是否为调试模式，如果是，则显示服务费规则生成第4步的物质扣款设置tab项;如果否，则不显示
    // if (isDebugMode === true) {
    //   items.unshift(
    //     {
    //       title: `${FinanceSalaryManagementType.description(
    //         FinanceSalaryManagementType.supplies)}扣款设置`,
    //       content: (
    //         <ComponentSuppliesDeductions
    //           bizCate={FinanceSalaryManagementType.supplies}
    //           ruleCollectionId={ruleCollectionId}
    //           platformCode={platformCode}
    //         />
    //       ),
    //       key: FinanceSalaryManagementType.supplies,
    //     },
    //   );
    // }

    return (
      <CoreTabs
        items={items}
        type="card"
        defaultActiveKey={`${FinanceSalaryManagementType.supplies}`}
      />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染管理创建 */}
        {this.renderTabs()}
      </div>
    );
  }
}

export default ManagementCreateComponent;
