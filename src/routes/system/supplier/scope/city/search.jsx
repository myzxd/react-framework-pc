/**
 * 供应商列表
 */
import React, { Component } from 'react';
import { Select, Form } from 'antd';

import { CoreContent, CoreSearch } from '../../../../../components/core';
import { CommonSelectPlatforms } from '../../../../../components/common';

const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      search: {
        platforms: [],           // 平台
        distributeType: '',     // 分配状态
      },
      onSearch: props.onSearch || undefined,       // 搜索回调
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    // 重置搜索
    if (onSearch) {
      this.onSearch();
    }
  }

  // 搜索
  onSearch = (values = {}) => {
    const { onSearch } = this.state;
    const { platforms, distributeType } = values;
    const params = {
      platforms,
      distributeType,
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
    const items = [
      <Form.Item label="平台" name="platforms">
        <CommonSelectPlatforms
          allowClear
          showSearch
          mode="multiple"
          showArrow
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={this.onChangePlatform}
        />
      </Form.Item>,
      <Form.Item label="分配情况" name="distributeType">
        <Select allowClear placeholder="请选择分配情况" onChange={this.onChangeDistributeType}>
          <Option key={1} value={'1'}>{'未分配'}</Option>
          <Option key={2} value={'2'}>{'已分配'}</Option>
        </Select>
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
