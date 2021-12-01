/**
 * 公告接收人 - 权限列表 - 搜索
 */
import React, { Component } from 'react';
import { Input, Form } from 'antd';

import { CoreSearch, CoreContent } from '../../components/core';
import { CommonSelectSuppliers, CommonSelectCities, CommonSelectDistricts, CommonSelectPlatforms, CommonSelectPositions } from '../../components/common';

import { SupplierState } from '../../application/define';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,                // 搜索的form
      search: {
        platforms: '',                 // 平台
        suppliers: '',                 // 供应商(页面组件选中使用)
        cities: '',                    // 城市(页面组件选中使用)
        districts: '',                 // 商圈
        name: '',                      // 姓名
        positions: [],                 // 职位
        phone: '',                     // 手机号
      },
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      platforms: '',                 // 平台
      suppliers: '',                 // 供应商(页面组件选中使用)
      cities: '',                    // 城市(页面组件选中使用)
      districts: '',                 // 商圈
      name: '',                      // 姓名
      positions: [],                 // 职位
      phone: '',                     // 手机号
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
    const { onSearch } = this.state;
    if (onSearch) {
      onSearch(values);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }
  // 更换平台
  onChangePlatforms = (e) => {
    const { search, form } = this.state;
    search.platforms = e;
    search.suppliers = [];
    search.cities = [];
    search.districts = [];
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ suppliers: [] });
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ teams: [] });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { search, form } = this.state;
    search.suppliers = e;
    search.cities = [];
    search.districts = [];
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ teams: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { search, form } = this.state;

    // 保存城市参数
    search.cities = e;
    search.districts = [];
    this.setState({ search });

    // 如果是商圈状态就可以清空商圈选项
    form.setFieldsValue({ teams: [] });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { search } = this.state;
    // 保存商圈参数
    search.districts = e;
    this.setState({ search });
  }
  // 更换的状态
  onState = (e) => {
    const { search } = this.state;
    search.state = e;
    this.setState({ search });
  }
  // 搜索功能
  render = () => {
    const items = [
      <Form.Item label="平台" name="platforms">
        <CommonSelectPlatforms
          showArrow
          allowClear
          showSearch
          mode="multiple"
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={this.onChangePlatforms}
        />
      </Form.Item>,
      <Form.Item
        noStyle
        key="suppliers"
        shouldUpdate={
          (prevValues, curValues) => prevValues.platforms !== curValues.platforms
        }
      >
        {({ getFieldValue }) =>
          <Form.Item label="供应商" name="suppliers">
            <CommonSelectSuppliers
              showArrow
              allowClear
              showSearch
              mode="multiple"
              optionFilterProp="children"
              placeholder="请选择供应商"
              state={SupplierState.enable}
              platforms={getFieldValue('platforms')}
              onChange={this.onChangeSuppliers}
            />
          </Form.Item>
        }
      </Form.Item>,
      <Form.Item
        noStyle
        key="cities"
        shouldUpdate={
          (prevValues, curValues) => (
            prevValues.platforms !== curValues.platforms ||
            prevValues.suppliers !== curValues.suppliers
          )
        }
      >
        {({ getFieldValue }) =>
          <Form.Item label="城市" name="cities">
            <CommonSelectCities
              showArrow
              allowClear
              showSearch
              namespace="cities"
              mode="multiple"
              optionFilterProp="children"
              placeholder="请选择城市"
              platforms={getFieldValue('platforms')}
              suppliers={getFieldValue('suppliers')}
              onChange={this.onChangeCity}
            />
          </Form.Item>
        }
      </Form.Item>,
      <Form.Item
        noStyle
        key="teams"
        shouldUpdate={
          (prevValues, curValues) => (
            prevValues.platforms !== curValues.platforms ||
            prevValues.suppliers !== curValues.suppliers ||
            prevValues.cities !== curValues.cities
          )
        }
      >
        {({ getFieldValue }) =>
          <Form.Item label="团队" name="teams">
            <CommonSelectDistricts
              allowClear
              showArrow
              showSearch
              mode="multiple"
              namespace="districts"
              optionFilterProp="children"
              placeholder="请选择商圈"
              platforms={getFieldValue('platforms')}
              suppliers={getFieldValue('suppliers')}
              cities={getFieldValue('cities')}
              onChange={this.onChangeDistrict}
            />
          </Form.Item>
        }
      </Form.Item>,
      <Form.Item label="角色" name="positions">
        <CommonSelectPositions
          showArrow
          allowClear
          mode="multiple"
          placeholder="请选择角色"
          optionFilterProp="children"
        />
      </Form.Item>,
      <Form.Item label="姓名" name="name">
        <Input placeholder="请输入姓名" />
      </Form.Item>,
      <Form.Item label="手机号" name="phone">
        <Input placeholder="请输入手机号" />
      </Form.Item>,
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
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
