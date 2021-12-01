/**
 * 供应商管理, 搜索选项
 */
import is from 'is_js';
import React from 'react';
import { Select, Input, Form } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { SupplierState } from '../../../../application/define';
import { CommonSelectPlatforms } from '../../../../components/common/index';

const { Option } = Select;

const Search = (props = {}) => {
  const {
    onSearch = () => { },
    operations = undefined,
  } = props;

  // 搜索
  const onClickSearch = (values) => {
    const { platforms, name, supplierId, state } = values;

    const params = values;
    if (is.existy(platforms)) {
      params.platforms = platforms;
    }
    if (is.existy(name) && is.not.empty(name)) {
      params.name = name;
    }
    if (is.existy(supplierId) && is.not.empty(supplierId)) {
      params.supplierId = supplierId;
    }
    if (is.existy(state) && is.not.empty(state)) {
      params.state = state;
    }
    // 每次点击查询,重置页码为1
    params.page = 1;
    params.limit = 30;

    if (onSearch) {
      onSearch(params);
    }
  };

  // 重置
  const onReset = () => {
    const params = {
      platforms: [],                      // 平台
      name: '',                           // 供应商名称
      supplierId: undefined,              // 供应商id
      state: `${SupplierState.enable}`,   // 第三方供应商状态
      page: 1,
      limit: 30,
    };
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  };

  // 渲染搜索区域
  const items = [
    <Form.Item label="平台" name="platforms">
      <CommonSelectPlatforms
        allowClear
        showSearch
        optionFilterProp="children"
        mode="multiple"
        showArrow
        placeholder="请选择平台"
      />
    </Form.Item>,
    <Form.Item label="供应商名称" name="name">
      <Input placeholder="请输入供应商名称" />
    </Form.Item>,
    <Form.Item label="供应商ID" name="supplierId">
      <Input placeholder="请输入供应商ID" />
    </Form.Item>,
    <Form.Item label="状态" name="state">
      <Select placeholder="请选择状态">
        {/* 启用 */}
        <Option value={`${SupplierState.enable}`} >{SupplierState.description(SupplierState.enable)}</Option>
        {/* 停用 */}
        <Option value={`${SupplierState.stoped}`} >{SupplierState.description(SupplierState.stoped)}</Option>
      </Select>
    </Form.Item>,
  ];
  const params = {
    items,
    operations,
    expand: true,
    onReset,
    onSearch: onClickSearch,
    initialValues: { state: `${SupplierState.enable}` },
  };
  return (
    <CoreContent>
      <CoreSearch {...params} />
    </CoreContent>
  );
};

export default Search;
