/**
 * 合同归属管理, 搜索选项
 */
import dot from 'dot-prop';
import is from 'is_js';
import React, { useState } from 'react';
import { Select, Input, Form } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import {
  CommonSelectPlatforms,
  CommonSelectSuppliers,
  CommonSelectCities,
} from '../../../../components/common';
import { ThirdCompanyState } from '../../../../application/define';

const { Option } = Select;

const Search = (props = {}) => {
  const {
    onSearch = () => { },
  } = props;
  const [industry, setIndustry] = useState();

  // 搜索
  const onClickSearch = (values) => {
    const { name, companyId, state } = values;

    const params = values;
    if (is.existy(name) && is.not.empty(name)) {
      params.name = name;
    }
    if (is.existy(companyId) && is.not.empty(companyId)) {
      params.companyId = companyId;
    }
    if (is.existy(state) && is.not.empty(state)) {
      params.state = state;
    }

    // 每次点击查询,重置页码为1
    if (onSearch) {
      onSearch({
        ...values,
        industry,
        page: 1,
        limit: 30,
      });
    }
  };

  // 重置
  const onReset = () => {
    const params = {
      name: undefined,
      state: `${ThirdCompanyState.on}`,   // 第三方公司状态
      suppliers: undefined,
      cities: undefined,
      page: 1,
      limit: 30,
      industry: undefined,
    };
    setIndustry(undefined);

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  };

  // 平台
  const onChangePlatforms = (options = {}, setFieldsValue) => {
    setIndustry(dot.get(options, 'props.industry', undefined));
    setFieldsValue && setFieldsValue({
      suppliers: undefined,
      cities: undefined,
    });
  };

  // 供应商
  const onChangeSuppliers = (setFieldsValue) => {
    setFieldsValue && setFieldsValue({
      cities: undefined,
    });
  };

  // 渲染搜索区域
  const items = [
    <Form.Item name="name" label="公司名称">
      <Input placeholder="请输入内容" allowClear />
    </Form.Item>,
    <Form.Item name="state" label="状态">
      <Select placeholder="请选择状态">
        <Option value={`${ThirdCompanyState.on}`} >{ThirdCompanyState.description(ThirdCompanyState.on)}</Option>
        <Option value={`${ThirdCompanyState.off}`} >{ThirdCompanyState.description(ThirdCompanyState.off)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      noStyle
      key="platforms"
      shouldUpdate
    >
      {({ setFieldsValue }) => (
        <Form.Item name="platforms" label="平台">
          <CommonSelectPlatforms
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={(e, otpions) => onChangePlatforms(otpions, setFieldsValue)}
          />
        </Form.Item>
  )}
    </Form.Item>,
    <Form.Item
      noStyle
      key="suppliers"
      shouldUpdate={
      (prevValues, curValues) => {
        return prevValues.platforms !== curValues.platforms;
      }}
    >
      {({ setFieldsValue, getFieldValue }) => (
        <Form.Item name="suppliers" label="供应商">
          <CommonSelectSuppliers
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            platforms={getFieldValue('platforms')}
            onChange={() => onChangeSuppliers(setFieldsValue)}
          />
        </Form.Item>
  )}
    </Form.Item>,
    <Form.Item
      noStyle
      key="cities"
      shouldUpdate={
      (prevValues, curValues) => {
        return prevValues.platforms !== curValues.platforms || prevValues.suppliers !== curValues.suppliers;
      }}
    >
      {({ getFieldValue }) => (
        <Form.Item name="cities" label="城市">
          <CommonSelectCities
            allowClear
            showSearch
            isExpenseModel
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={getFieldValue('platforms')}
            suppliers={getFieldValue('suppliers')}
          />
        </Form.Item>
  )}
    </Form.Item>,
  ];
  const params = {
    items,
    expand: true,
    onReset,
    onSearch: onClickSearch,
    initialValues: { state: `${ThirdCompanyState.on}` },
  };
  return (
    <CoreContent>
      <CoreSearch {...params} />
    </CoreContent>
  );
};

export default Search;
