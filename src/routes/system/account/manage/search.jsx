/**
 * 账号管理列表，搜索功能
 */
import is from 'is_js';
import React, { useState } from 'react';
import { Select, Input, Form } from 'antd';

import { CoreContent, CoreSearch } from '../../../../components/core';
import CommonSelectAllPositions from './allPositions';
import { AccountState } from '../../../../application/define';

const { Option } = Select;

const Search = (props = {}) => {
  const {
    onSearch = () => { },
    operations = undefined,
  } = props;

  // 设置表单
  const [form, setForm] = useState(undefined);
  console.log(form);
  // 重置
  const onReset = () => {
    const params = {
      name: '',       // 姓名
      phone: '',      // 手机号
      positions: [],  // 职位
      state: `${AccountState.on}`,    // 账户状态
    };
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  };

  // 搜索
  const onClickSearch = (values) => {
    const { name, phone, positions, state } = values;
    const params = values;
    if (is.existy(name)) {
      params.name = name;
    }
    if (is.existy(phone)) {
      params.phone = phone;
    }
    if (is.existy(positions) && is.not.empty(positions)) {
      params.positions = positions;
    }
    if (is.existy(state)) {
      params.state = state;
    }

    // 每次点击查询,重置页码为1
    params.page = 1;
    params.limit = 30;

    if (onSearch) {
      onSearch(params);
    }
  };

  // 获取提交用的form表单
  const onHookForm = (val) => {
    setForm(val);
  };

  // 搜索功能
  const items = [
    <Form.Item name="name" label="账户姓名">
      <Input placeholder="请输入姓名" />
    </Form.Item>,
    <Form.Item name="phone" label="手机号">
      <Input placeholder="请输入手机号" />
    </Form.Item>,
    <Form.Item name="positions" label="角色">
      <CommonSelectAllPositions
        allowClear
        showArrow
        showSearch
        mode="multiple"
        placeholder="请选择角色"
        optionFilterProp="children"
      />
    </Form.Item>,
    <Form.Item name="state" label="用户状态">
      <Select allowClear placeholder="请选择用户状态">
        <Option
          value={`${AccountState.on}`}
        >
          {AccountState.description(AccountState.on)}
        </Option>
        <Option
          value={`${AccountState.off}`}
        >
          {AccountState.description(AccountState.off)}
        </Option>
      </Select>
    </Form.Item>,
  ];
  const params = {
    items,
    operations,
    onReset,
    onSearch: onClickSearch,
    onHookForm,
    expand: true,
    initialValues: { state: `${AccountState.on}` },
  };
  return (
    <CoreContent>
      <CoreSearch {...params} />
    </CoreContent>
  );
};

export default Search;
