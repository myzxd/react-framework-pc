/**
 * 非成本类审批流 - 查询
 */
import React, { useState } from 'react';
import {
  Input,
  Form,
  Select,
} from 'antd';

import {
  CoreSearch,
  CoreContent,
} from '../../../../components/core';
import {
  RelationExamineFlowAvailableState,
  OaApplicationOrderType,
} from '../../../../application/define';

const { Option } = Select;

const Search = (props) => {
  const { dataTypes = [] } = props;
  // form
  const [form, setForm] = useState({});

  const onSearch = (val) => {
    props.onSearch && props.onSearch(val);
  };

  // 重置
  const onReset = () => {
    form.resetFields();
    props.onSearch && props.onSearch({});
  };

  // 展示借款和还款
  const types = dataTypes.filter(item => item.value === OaApplicationOrderType.borrowing || item.value === OaApplicationOrderType.repayments);
  // common item
  const commonItems = [
    <Form.Item
      label="BU3审批流名称"
      name="xdFlowName"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="趣活审批流名称"
      name="name"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="适用类型"
      name="applyApplicationType"
    >
      <Select placeholder="请选择">
        <Option value="">全部</Option>
        {
          types.map((item) => {
            return <Option key={item.value} value={item.value}>{item.name}</Option>;
          })
        }
      </Select>
    </Form.Item>,
    <Form.Item
      label="可用状态"
      name="state"
    >
      <Select placeholder="请选择">
        <Option value="">全部</Option>
        <Option value={RelationExamineFlowAvailableState.available}>{RelationExamineFlowAvailableState.description(RelationExamineFlowAvailableState.available)}</Option>
        <Option value={RelationExamineFlowAvailableState.noAvailable}>{RelationExamineFlowAvailableState.description(RelationExamineFlowAvailableState.noAvailable)}</Option>
      </Select>
    </Form.Item>,
  ];


  const items = [
    ...commonItems,
  ];

  const searchProps = {
    items,
    onReset,
    onSearch,
    onHookForm: hForm => setForm(hForm),
    initialValues: {
      state: '', // 默认全部
      applyApplicationType: '',
    },
  };

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch {...searchProps} />
    </CoreContent>
  );
};

export default Search;
