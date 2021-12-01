/**
 * code - 基础设置 - 审批流配置
 */
import React from 'react';
import {
  Form,
  Input,
  Select,
} from 'antd';
import {
  CodeFlowState,
  CodeCostCenterType,
} from '../../../../application/define';
import {
  CoreSearch,
  CoreContent,
} from '../../../../components/core';

const { Option } = Select;

const Search = ({
  onSearch,
  onReset,
}) => {
  // form items
  const formItems = [
    <Form.Item
      label="审批流名称"
      name="name"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="成本中心类型"
      name="type"
    >
      <Select placeholder="请选择" allowClear showSearch>
        <Option
          value={CodeCostCenterType.code}
        >{CodeCostCenterType.description(CodeCostCenterType.code)}</Option>
        <Option
          value={CodeCostCenterType.team}
        >{CodeCostCenterType.description(CodeCostCenterType.team)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="状态"
      name="state"
    >
      <Select placeholder="请选择" allowClear showSearch>
        <Option
          value={CodeFlowState.normal}
        >{CodeFlowState.description(CodeFlowState.normal)}</Option>
        <Option
          value={CodeFlowState.deactivate}
        >{CodeFlowState.description(CodeFlowState.deactivate)}</Option>
        <Option
          value={CodeFlowState.draft}
        >{CodeFlowState.description(CodeFlowState.draft)}</Option>
      </Select>
    </Form.Item>,
  ];

  // coreSearch props
  const sProps = {
    items: formItems,
    onSearch,
    onReset,
  };

  return (
    <CoreContent>
      <CoreSearch {...sProps} />
    </CoreContent>
  );
};

export default Search;
