/**
 * 人员合同列表-搜索功能
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension, CommonSelectCompanies } from '../../../components/common';

const noop = () => {};

class Search extends Component {

  static propTypes = {
    onSearch: PropTypes.func.isRequired,   // 搜索回调
    onReset: PropTypes.func.isRequired,    // 重置回调
    defaultSearchParams: PropTypes.object, // 默认搜索参数
  }

  static defaultProps = {
    onSearch: noop,                 // 搜索回调
    onReset: noop,                 // 搜索回调
    defaultSearchParams: {},        // 默认搜索参数
  }

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      suppliers: [],    // 已选供应商
    };
  }

  // 搜索的扩展数据
  onChangeSearchExtensions = (values) => {
    this.setState({
      suppliers: values.suppliers,
    });
  }

  // 重置
  onReset = () => {
    // 重置搜索
    this.props.onReset();
  }

  // 搜索
  onSearch = (params) => {
    this.props.onSearch(params);
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const { name, phone, contracts, platformId } = this.props.defaultSearchParams;
    const { suppliers } = this.state;

    const items = [
      {
        label: '合同归属',
        form: form => (form.getFieldDecorator('contracts', { initialValue: contracts })(
          <CommonSelectCompanies allowClear showArrow mode="multiple" placeholder="请选择合同归属" suppliers={suppliers} />,
        )),
      },
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name', { initialValue: name })(
          <Input placeholder="请输入姓名" />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone', { initialValue: phone })(
          <Input placeholder="请输入手机号" />,
        )),
      },
      {
        label: '第三方平台账户ID',
        form: form => (form.getFieldDecorator('platformId', { initialValue: platformId })(
          <Input placeholder="请输入第三方平台账户ID" />,
        )),
      },
    ];

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onChange: this.onChangeSearchExtensions,
      onHookForm: this.onHookForm,
      expand: true,
    };
    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  };
}

export default Search;
