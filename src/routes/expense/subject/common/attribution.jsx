/**
 * 费用管理 - 科目设置 - 成本归属  /Expense/Subject
 */
import React, { Component } from 'react';

import { CoreSelect } from '../../../../components/core';
import { ExpenseCostCenterType } from '../../../../application/define';
import { omit } from '../../../../application/utils';

const Option = CoreSelect.Option;

class CosAttribution extends Component {
  // 渲染成本归属
  render = () => {
    const props = { ...this.props };
    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'attributionData',
    ], props);
    return (
      <CoreSelect {...omitedProps} >
        <Option value={`${ExpenseCostCenterType.project}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.project)}</Option>
        <Option value={`${ExpenseCostCenterType.headquarter}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.headquarter)}</Option>
        <Option value={`${ExpenseCostCenterType.city}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.city)}</Option>
        <Option value={`${ExpenseCostCenterType.district}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.district)}</Option>
        <Option value={`${ExpenseCostCenterType.knight}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.knight)}</Option>
        <Option value={`${ExpenseCostCenterType.headquarters}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.headquarters)}</Option>
        <Option value={`${ExpenseCostCenterType.managementCost}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.managementCost)}</Option>
        <Option value={`${ExpenseCostCenterType.operatingSupport}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.operatingSupport)}</Option>
        <Option value={`${ExpenseCostCenterType.vehicleDirectly}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.vehicleDirectly)}</Option>
        <Option value={`${ExpenseCostCenterType.vehicleIndirect}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.vehicleIndirect)}</Option>
      </CoreSelect>
    );
  }
}

export default CosAttribution;
