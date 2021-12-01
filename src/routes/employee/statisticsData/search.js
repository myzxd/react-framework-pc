/**
 * 个户注册数据 - 查询 /Employee/StatisticsData
 */
import React, { useState } from 'react';

import { DeprecatedCoreSearch, CoreContent } from '../../../components/core';
import { CommonSelectPlatforms, CommonSelectSuppliers, CommonSelectCities } from '../../../components/common';


function Search(props) {
  // 查询的form表单
  const [form, setForm] = useState(undefined);
  // cityCodes列表
  const [cityCodes, setCityCodes] = useState([]);


  // 选择供应商回调
  const onSupplierChange = () => {
    form.setFieldsValue({
      cityCodes: [],
    });
    setCityCodes([]);
  };


  // 选择平台回调
  const onChangePlatformCode = () => {
    form.setFieldsValue({
      supplierIds: [],
      cityCodes: [],
    });
    setCityCodes([]);
  };

   // 城市回调
  const onChangeCityCodes = (e, options) => {
    // 获取code列表
    const cityCode = options.map(v => v.props.code);
    setCityCodes(cityCode);
  };

  // 搜索
  const onSearchProp = (values) => {
    const params = {
      page: 1,
      limit: 30,
      ...values,
      cityCodes,
    };
    if (props.onSearch) {
      props.onSearch(params);
    }
  };

  // 重置
  const onReset = () => {
    const params = {
      page: 1,
      limit: 30,
    };
    setCityCodes([]);
    // 重置搜索
    if (props.onSearch) {
      props.onSearch(params);
    }
  };

    // 获取提交用的form表单
  const onHookForm = (forms) => {
    setForm(forms);
  };

  const items = [
    {
      label: '平台',
      form: forms => (forms.getFieldDecorator('platformCodes')(
        <CommonSelectPlatforms
          showArrow
          showSearch
          enableSelectAll
          allowClear
          mode="multiple"
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={onChangePlatformCode}
        />,
      )),
    },
    {
      label: '供应商',
      form: forms => (forms.getFieldDecorator('supplierIds')(
        <CommonSelectSuppliers
          showArrow
          enableSelectAll
          allowClear
          showSearch
          mode="multiple"
          optionFilterProp="children"
          placeholder="请选择供应商"
          platforms={forms.getFieldValue('platformCodes')}
          onChange={onSupplierChange}
        />,
      )),
    },
    {
      label: '城市',
      form: forms => (forms.getFieldDecorator('cityCodes')(
        <CommonSelectCities
          showArrow
          enableSelectAll
          allowClear
          showSearch
          optionFilterProp="children"
          mode="multiple"
          placeholder="请选择城市"
          onChange={onChangeCityCodes}
          platforms={forms.getFieldValue('platformCodes')}
          suppliers={forms.getFieldValue('supplierIds')}
        />,
      )),
    },
  ];
  const prop = {
    items,
    onReset,
    onSearch: onSearchProp,
    expand: true,
    onHookForm,
  };
  return (
    <CoreContent>
      <DeprecatedCoreSearch {...prop} />
    </CoreContent>
  );
}


export default Search;
