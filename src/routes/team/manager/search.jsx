/**
 * 业主管理, 搜索选项
 */
import { Input, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { DeprecatedCoreSearch, CoreContent } from '../../../components/core';
import { TeamOwnerManagerState } from '../../../application/define';

const { Option } = Select;

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

  // 重置搜索表单
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      id: undefined,
      name: undefined,
      mobile: undefined,
      idCard: undefined,
      teamId: undefined,
      platforms: undefined,
      suppliers: undefined,
      cities: undefined,
      districts: undefined,
      state: undefined,
      meta: { page: 1, limit: 30 },
    };
    if (onSearch) {
      onSearch(params);
    }
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

  onHookForm = (form) => {
    this.form = form;
  }

  // 渲染查询条件
  renderSearch = () => {
    const { operations } = this.props;
    const items = [
      {
        label: '业主姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入业主姓名" />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('mobile')(
          <Input placeholder="请输入手机号" />,
        )),
      },
      {
        label: '身份证号',
        form: form => (form.getFieldDecorator('idCard')(
          <Input placeholder="请输入身份证号" />,
        )),
      },
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state')(
          <Select placeholder="请选择状态">
            <Option value={TeamOwnerManagerState.normal}>{TeamOwnerManagerState.description(TeamOwnerManagerState.normal)}</Option>
            <Option value={TeamOwnerManagerState.notEffect}>{TeamOwnerManagerState.description(TeamOwnerManagerState.notEffect)}</Option>
          </Select>,
        )),
      },
      {
        label: '团队ID',
        form: form => (form.getFieldDecorator('teamId')(
          <Input placeholder="请输入团队ID" />,
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
  render() {
    return (
      <div>
        {/* 渲染查询条件 */}
        { this.renderSearch()}
      </div>
    );
  }
}

export default Search;
