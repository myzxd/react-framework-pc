/**
 * 工号管理, 运力工号记录, 详情页面, 列表页的搜索组件
 */
import React, { Component } from 'react';
import { DatePicker, Input } from 'antd';

import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';
import { CommonSelectDistricts } from '../../../../components/common';

const { RangePicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,    // 搜索的form
      search: {
        districts: [],      // 商圈
        name: '',           // 姓名
        phone: '',          // 手机号
        date: undefined,    // 所属时间
      },
      record: props.record || {}, // 详情数据
      onSearch: props.onSearch || undefined,
    };
  }

  // 重置
  onReset = () => {
    const { onSearch, record } = this.state;
    const { recordId } = record;

    const params = {
      recordId,           // 数据id
      districts: [],      // 商圈
      name: '',           // 姓名
      phone: '',          // 手机号
      date: undefined,    // 所属时间
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch, record } = this.state;
    const { recordId, supplierId, platformId, cityId } = record;

    // 处理数据，查询商圈
    const suppliers = supplierId ? [supplierId] : [];
    const platforms = platformId ? [platformId] : [];
    const cities = cityId ? [cityId] : [];
    const params = {
      ...values,
      recordId,   // 人员id
      suppliers,
      platforms,
      cities,
    };
    // 每次点击查询,重置页码为1
    params.page = 1;
    params.limit = 30;

    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { record } = this.state;
    const { supplierId, supplierName, platformId, platformName, cityId, cityName } = record;
    // 处理数据，查询商圈
    const suppliers = supplierId ? [supplierId] : [];
    const platforms = platformId ? [platformId] : [];
    const cities = cityId ? [cityId] : [];

    const items = [
      {
        label: '供应商',
        form: () => (supplierName || '--'),
      },
      {
        label: '平台',
        form: () => (platformName || '--'),
      },
      {
        label: '城市',
        form: () => (cityName || '--'),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('districts')(
          <CommonSelectDistricts allowClear showSearch optionFilterProp="children" showArrow mode="multiple" placeholder="请选择商圈" platforms={platforms} suppliers={suppliers} cities={cities} />,
        )),
      },
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入姓名" />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone')(
          <Input placeholder="请输入手机号" />,
        )),
      },
      {
        label: '所属时间',
        form: form => (form.getFieldDecorator('date', { initialValue: null })(
          <RangePicker />,
        )),
      },
    ];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      expand: true,
    };
    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
