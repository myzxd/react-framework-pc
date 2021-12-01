/**
 * 费用分组列表页-搜索栏目
 */
import React, { Component } from 'react';
import { Select, Input } from 'antd';
import PropTypes from 'prop-types';
import { DeprecatedCoreSearch, CoreContent } from '../../../components/core';
import { ExpenseCostGroupState } from '../../../application/define';


import { CommonSelectScene, CommonSelectExpenseSubjects } from '../../../components/common';

const { Option } = Select;

class Search extends Component {
  static propsTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      search: {
        state: '',      // 状态
        costGroup: undefined,      // 费用分组
        scense: undefined,      // 适用场景
      },
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      state: '',      // 状态
      costGroup: undefined,      // 费用分组
      scense: undefined,      // 适用场景
    };
    this.setState({ search: params });

    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const params = values;

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
    const searchProps = {
      showSearch: true,
      mode: 'multiple',
      optionFilterProp: 'children',
      allowClear: true,
      showArrow: true,
    };
    const items = [
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state')(
          <Select placeholder="请选择" allowClear>
            <Option value={`${ExpenseCostGroupState.enable}`}>{ExpenseCostGroupState.description(ExpenseCostGroupState.enable)}</Option>
            <Option value={`${ExpenseCostGroupState.disabled}`}>{ExpenseCostGroupState.description(ExpenseCostGroupState.disabled)}</Option>
            <Option value={`${ExpenseCostGroupState.edit}`}>{ExpenseCostGroupState.description(ExpenseCostGroupState.edit)}</Option>
          </Select>,
        )),
      },
      {
        label: '费用分组',
        form: form => (form.getFieldDecorator('costGroup')(
          <Input placeholder="请输入" />,
        )),
      },
      {
        label: '科目',
        form: form => (form.getFieldDecorator('subjects')(
          <CommonSelectExpenseSubjects placeholder="请选择" {...searchProps} />,
        )),
      },
      {
        label: '适用场景',
        form: form => (form.getFieldDecorator('scense')(
          <CommonSelectScene
            enumeratedType="subjectScense"
          />,
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
  };
}

export default Search;
