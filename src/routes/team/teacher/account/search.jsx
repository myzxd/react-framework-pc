/**
 * 私教管理 - 私教账户, 搜索选项
 */
import { Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
  onChangeCity = (e, options) => {
    const { setFieldsValue } = this.form;

    const cities = options.map((item) => {
      return item.props ? item.props.spell : '';
    });
    this.setState({
      cities,
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
      id: undefined,
      name: undefined,
      phone: undefined,
      platforms: undefined,
      suppliers: undefined,
      cities: undefined,
      districts: undefined,
      teamName: undefined,
      meta: { page: 1, limit: 30 },
    };
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
        label: '私教姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入内容" />,
        )),
      },
      {
        label: '系统用户',
        form: form => (form.getFieldDecorator('phone')(
          <Input placeholder="请输入内容" />,
        )),
      },
      {
        label: '私教团队',
        form: form => (form.getFieldDecorator('teamName')(
          <Input placeholder="请输入内容" />,
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
