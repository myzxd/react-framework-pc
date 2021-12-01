/**
 * 服务费方案/列表  搜索组件
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select } from 'antd';

import { DeprecatedCoreSearch, CoreContent } from '../../../components/core';
import { CommonSelectSuppliers, CommonSelectCities, CommonSelectDistricts, CommonSelectPlatforms } from '../../../components/common';

import { SupplierState, ExpenseCostCenterType } from '../../../application/define';

const { Option } = Select;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,                // 搜索的form
      search: {
        platforms: '',                 // 平台
        suppliers: '',                 // 供应商(页面组件选中使用)
        cities: '',                    // 城市(页面组件选中使用)
        districts: '',                 // 商圈
        state: undefined,              // 执行状态
      },
      citySpelling: '',
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      platforms: '',                 // 平台
      suppliers: '',                 // 供应商(页面组件选中使用)
      cities: '',                    // 城市(页面组件选中使用)
      districts: '',                 // 商圈
      state: undefined,              // 执行状态
    };
    // 重置数据
    this.setState({ search: params, citySpelling: '' });
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
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
    search.suppliers = '';
    search.cities = '';
    search.districts = '';
    this.setState({ search, citySpelling: '' });

    // 清空选项
    form.setFieldsValue({ suppliers: '' });
    form.setFieldsValue({ cities: '' });

    // 如果是商圈状态就可以清空商圈选项
    if (Number(search.state) === ExpenseCostCenterType.district) {
      form.setFieldsValue({ districts: '' });
    }
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { search, form } = this.state;
    search.suppliers = e;
    search.cities = '';
    search.districts = '';
    this.setState({ search, citySpelling: '' });

    // 清空选项
    form.setFieldsValue({ cities: '' });

    // 如果是商圈状态就可以清空商圈选项
    if (Number(search.state) === ExpenseCostCenterType.district) {
      form.setFieldsValue({ districts: '' });
    }
  }

  // 更换城市
  onChangeCity = (e, option) => {
    const { search, form } = this.state;
    const citySpelling = dot.get(option, 'props.spell', '');

    // 保存城市参数
    search.cities = e;
    search.districts = '';
    this.setState({ search, citySpelling });

    // 如果是商圈状态就可以清空商圈选项
    if (Number(search.state) === ExpenseCostCenterType.district) {
      form.setFieldsValue({ districts: '' });
    }
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
    const { platforms, suppliers, cities, state, districts } = this.state.search;
    const { citySpelling } = this.state;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platforms', { initialValue: platforms })(
          <CommonSelectPlatforms allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={this.onChangePlatforms} />,
        )),
      }, {
        label: '供应商',
        form: form => (form.getFieldDecorator('suppliers', { initialValue: suppliers })(
          <CommonSelectSuppliers state={SupplierState.enable} allowClear showSearch optionFilterProp="children" platforms={platforms} placeholder="请选择供应商" onChange={this.onChangeSuppliers} />,
        )),
      }, {
        label: '城市:',
        form: form => (form.getFieldDecorator('cities', { initialValue: cities })(
          <CommonSelectCities namespace="cities" isExpenseModel allowClear showSearch optionFilterProp="children" placeholder="请选择城市" platforms={platforms} suppliers={suppliers} onChange={this.onChangeCity} />,
        )),
      }, {
        label: '方案类型:',
        form: form => (form.getFieldDecorator('state', { initialValue: state })(
          <Select allowClear placeholder="请选择方案类型" onChange={this.onState}>
            <Option value={`${ExpenseCostCenterType.city}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.city)}</Option>
            <Option value={`${ExpenseCostCenterType.district}`}>{ExpenseCostCenterType.description(ExpenseCostCenterType.district)}</Option>
          </Select>,
        )),
      },
    ];
    // 判断当状态为商圈时让商圈显示出来
    if (Number(state) === ExpenseCostCenterType.district) {
      items.push({
        label: '商圈:',
        form: form => (form.getFieldDecorator('districts', { initialValue: districts })(
          <CommonSelectDistricts
            allowClear
            showSearch
            namespace="districts"
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={citySpelling}
            disabled={this.state.isShowDistricts}
            onChange={this.onChangeDistrict}
          />,
        )),
      });
    }
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
