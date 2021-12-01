/**
 * 工号管理, 列表页的搜索组件
 */
import React, { Component } from 'react';
import { Select, Input } from 'antd';

import { TransportType, TransportState } from '../../../application/define';
import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension, CommonSelectPositions } from '../../../components/common';

const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,    // 搜索的form
      search: {
        name: '',           // 姓名
        phone: '',          // 手机号
        positions: [],      // 职位
        state: [],          // 运力状态
        type: [],           // 工号种类
      },
      onSearch: props.onSearch || undefined,
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      name: '',           // 姓名
      phone: '',          // 手机号
      positions: [],      // 职位
      state: [],          // 运力状态
      type: [],           // 工号种类
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (value) => {
    const values = value;
    const { onSearch } = this.state;
    // 每次点击查询,重置页码为1
    values.page = 1;
    values.limit = 30;
    if (onSearch) {
      onSearch(values);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 搜索功能
  render = () => {
    const items = [
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
        label: '职位',
        form: form => (form.getFieldDecorator('positions')(
          <CommonSelectPositions allowClear showSearch optionFilterProp="children" showArrow mode="multiple" placeholder="请选择职位" />,
        )),
      },
      {
        label: '运力状态',
        form: form => (form.getFieldDecorator('state')(
          <Select placeholder="请选择运力状态" showArrow mode="multiple">
            <Option value={`${TransportState.working}`}>{TransportState.description(TransportState.working)}</Option>
            <Option value={`${TransportState.waiting}`}>{TransportState.description(TransportState.waiting)}</Option>
          </Select>,
        )),
      },
      {
        label: '工号种类',
        form: form => (form.getFieldDecorator('type')(
          <Select placeholder="请选择工号种类" showArrow mode="multiple">
            <Option value={`${TransportType.transport}`}>{TransportType.description(TransportType.transport)}</Option>
            <Option value={`${TransportType.exchange}`}>{TransportType.description(TransportType.exchange)}</Option>
            <Option value={`${TransportType.normal}`}>{TransportType.description(TransportType.normal)}</Option>
          </Select>,
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
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  };
}

export default Search;
