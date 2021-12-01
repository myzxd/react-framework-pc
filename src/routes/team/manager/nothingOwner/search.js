/**
 * 私教管理 - 私教指导, 搜索选项
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'antd';

import {
  CommonSelectSuppliers,
  CommonSelectPlatforms,
  CommonSelectCities,
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
    this.state = {};
    this.form = {};   // 表单form
  }

  // 更换供应商
  onChangeSuppliers = () => {
    const { setFieldsValue } = this.form;
    // 清空选项
    setFieldsValue({ cities: [] });
  }

  // 更换平台
  onChangePlatforms = () => {
    const { setFieldsValue } = this.form;
    // 清空选项
    setFieldsValue({ suppliers: [], cities: [] });
  }

  // 搜索
  onSearch = (params) => {
    const { onSearch } = this.props;
    // 每次点击搜索重置页码为1
    const newParams = {
      ...params,
    };
    if (onSearch) {
      onSearch(newParams);
    }
  }

  // 重置搜索表单
  onReset = () => {
    const { onSearch } = this.props;
    const params = {};
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
            platforms={form.getFieldValue('platforms')}
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
            isExpenseModel
            placeholder="请选择城市"
            platforms={form.getFieldValue('platforms')}
            suppliers={form.getFieldValue('suppliers')}
          />,
        )),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('name')(
          <Input
            placeholder="请输入商圈名称"
          />,
        )),
      },
      {
        label: '商圈BOSS ID',
        form: form => (form.getFieldDecorator('bossId')(
          <Input
            placeholder="请输入商圈BOSS ID"
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

