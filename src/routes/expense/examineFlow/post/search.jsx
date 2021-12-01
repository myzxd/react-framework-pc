/**
 * 审批岗位设置 - 搜索组件
 */
import { Input, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';
import { CommonSelectJobs } from '../../../../components/common';
import { ExpenseExaminePostType } from '../../../../application/define';

const noop = () => {};
const { Option } = Select;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,    // 点击搜索事件
  }

  static defaultProps = {
    onSearch: noop,
  }

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
    };
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

  // 重置搜索条件
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      meta: { page: 1, limit: 30 },
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 渲染查询条件
  renderSearch = () => {
    const items = [
      {
        label: '岗位名称',
        form: form => (form.getFieldDecorator('postId')(
          <CommonSelectJobs
            placeholder="请选择岗位名称"
            allowClear
            showSearch
            optionFilterProp="children"
          />,
        )),
      },
      {
        label: '成员姓名',
        form: form => (form.getFieldDecorator('memberName')(
          <Input placeholder="请输入成员姓名" />,
        )),
      },
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state')(
          <Select
            placeholder="请选择"
            allowClear
            mode="multiple"
            showArrow
          >
            <Option value={ExpenseExaminePostType.draft}>{ExpenseExaminePostType.description(ExpenseExaminePostType.draft)}</Option>
            <Option value={ExpenseExaminePostType.disable}>{ExpenseExaminePostType.description(ExpenseExaminePostType.disable)}</Option>
            <Option value={ExpenseExaminePostType.normal}>{ExpenseExaminePostType.description(ExpenseExaminePostType.normal)}</Option>
          </Select>,
        )),
      },
      {
        label: '岗位号',
        form: form => (form.getFieldDecorator('postNum')(
          <Input placeholder="请输入岗位号" />,
        )),
      },
    ];
    const props = {
      items,
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

  // 渲染添加岗位弹窗
  renderAddPostModal = () => {
    const { isShowTransferModel } = this.state;
    if (isShowTransferModel === false) {
      return null;
    }
  }

  render() {
    return (
      <div>
        {/* 渲染查询条件 */}
        {this.renderSearch()}
      </div>
    );
  }
}

export default Search;
