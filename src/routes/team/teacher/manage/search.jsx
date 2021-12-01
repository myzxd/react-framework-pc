/**
 * 私教管理 - 私教部门, 搜索选项
 */
import { Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';

const noop = () => {};
class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,    // 点击搜索事件
  }

  static defaultProps = {
    onSearch: noop,
  }

  constructor(props) {
    super(props);
    this.state = {};
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
      departmentName: undefined,
      departmentNum: undefined,
      departmentId: undefined,
      meta: { page: 1, limit: 30 },
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 渲染搜索区域
  render = () => {
    const items = [
      {
        label: '私教部门名称',
        form: form => (form.getFieldDecorator('departmentName')(
          <Input placeholder="请输入私教部门名称" />,
        )),
      },
      {
        label: '私教部门编号',
        form: form => (form.getFieldDecorator('departmentNum')(
          <Input placeholder="请输入私教部门编号" />,
        )),
      },
      {
        label: '私教部门ID',
        form: form => (form.getFieldDecorator('departmentId')(
          <Input placeholder="请输入私教部门ID" />,
        )),
      },
    ];
    const props = {
      items,
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
