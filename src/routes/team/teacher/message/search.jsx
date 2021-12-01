/**
 * 私教管理 - 私教指导, 搜索选项
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  CommonSelectSuppliers,
  CommonSelectPlatforms,
  CommonSelectCities,
  CommonSelectDistricts,
} from '../../../../components/common';
import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';

const noop = () => {};
class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,    // 点击搜索事件
    operations: PropTypes.array, // 扩展操作
  }

  static defaultProps = {
    onSearch: noop,
    operations: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],  // 供应商
      platforms: [],  // 平台
      cities: [],     // 城市
    };
    this.form = {};   // 表单form
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { setFieldsValue } = this.form;

    this.setState({
      suppliers: e,
      cities: [],
    });

    // 清空选项
    setFieldsValue({ cities: [], districts: [] });
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { setFieldsValue } = this.form;

    this.setState({
      platforms: e,
      suppliers: [],
      cities: [],
    });

    // 清空选项
    setFieldsValue({ suppliers: [], cities: [], districts: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { setFieldsValue } = this.form;

    this.setState({
      cities: e,
    });

    // 清空选项
    setFieldsValue({ districts: [] });
  }

  // 搜索
  onSearch = (params) => {
    const { onSearch } = this.props;
    // 每次点击搜索重置页码为1
    const newParams = {
      ...params,
      meta: { page: 1, limit: 30 },
    };
    if (onSearch) {
      onSearch(newParams);
    }
  }

  // 重置搜索表单
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      platforms: undefined,         // 平台
      suppliers: undefined,         // 供应商
      cities: undefined,            // 城市
      districts: undefined,         // 商圈
      meta: { page: 1, limit: 30 },
    };
    this.setState({
      suppliers: [],  // 供应商
      platforms: [],  // 平台
      cities: [],     // 城市
      districts: [],  // 商圈
    });
    if (onSearch) {
      onSearch(params);
    }
  }

  onHookForm = (form) => {
    this.form = form;
  }

  // 渲染搜索区域
  render = () => {
    const { operations } = this.props;
    const {
      suppliers,
      platforms,
      cities,
    } = this.state;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platforms')(
          <CommonSelectPlatforms
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatforms}
          />,
        )),
      },
      {
        label: '供应商',
        form: form => (form.getFieldDecorator('suppliers')(
          <CommonSelectSuppliers
            showSearch
            platforms={platforms}
            optionFilterProp="children"
            placeholder="请选择供应商"
            onChange={this.onChangeSuppliers}
          />,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('cities')(
          <CommonSelectCities
            showSearch
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={platforms}
            suppliers={suppliers}
            onChange={this.onChangeCity}
          />,
        )),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('districts')(
          <CommonSelectDistricts
            showSearch
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={cities}
          />,
        )),
      },
    ];
    const props = {
      items,
      operations,
      expand: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  }
}

export default Search;

