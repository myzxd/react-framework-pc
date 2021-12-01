/**
 * 服务费结算 - 基础设置 - 结算指标设置 - 搜索组件
 */
import is from 'is_js';
import React, { Component } from 'react';
import { Input, Select } from 'antd';
import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';
import { HouseholdType } from '../../../../application/define';

const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      search: {
        name: '',      // 姓名
        phone: '',     // 手机号
        workType: undefined, //  人员类型
      },
      onSearch: props.onSearch || undefined,       // 搜索回调
    };
  }

  // 判断两次传递的标签id是否一致 如果不一致 则重置搜索内容
  componentDidUpdate(prevProps) {
    const { form } = this.state;
    if (prevProps.selectedTagId !== this.props.selectedTagId) {
      if (form) {
        form.resetFields();
      }
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;

    const params = {
      name: '',      // 姓名
      phone: '',     // 手机号
      workType: undefined, //  人员类型
    };

    this.setState({
      search: params,
    });

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { name, phone, workType } = values;
    const params = values;
    if (is.existy(name)) {
      params.name = name;
    }
    if (is.existy(phone)) {
      params.phone = phone;
    }
    if (is.existy(workType)) {
      params.workType = workType;
    }

    // 每次点击查询,重置页码为1
    params.page = 1;
    // 查询回调
    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 渲染搜索区域
  render = () => {
    const { name, phone, workType } = this.state.search;
    const { onHookForm, onReset, onSearch } = this;

    const items = [
      {
        label: '骑士姓名',
        form: form => (form.getFieldDecorator('name', {
          initialValue: name,
          rules: [{ pattern: /^[\u4e00-\u9fa5]{2,}$/g, message: '请输入正确的姓名' }], // 校验姓名, 非必填项,如果不填不校验
        })(
          <Input placeholder="请输入姓名" />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone', {
          initialValue: phone,
          rules: [{ pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }], // 校验手机号码, 非必填项,如果不填不校验
        })(
          <Input placeholder="请输入手机号" />,
        )),
      },
      {
        label: '个户类型',
        form: form => (form.getFieldDecorator('workType', { initialValue: workType })(
          <Select allowClear placeholder="请选择个户类型">
            <Option value={`${HouseholdType.first}`}>{HouseholdType.description(HouseholdType.first)}</Option>
            <Option value={`${HouseholdType.second}`}>{HouseholdType.description(HouseholdType.second)}</Option>
          </Select>,
        )),
      },
    ];
    const props = {
      items,          // 扩展其他搜索
      onReset,        // 重置
      onSearch,       // 搜索
      onHookForm,     // 获取提交用的form表单
      expand: true,   // 默认展开更多搜索项
    };
    return (
      <CoreContent style={{ marginBottom: 10 }}>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
