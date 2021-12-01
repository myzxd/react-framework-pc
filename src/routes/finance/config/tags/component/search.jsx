/**
 * 服务费结算 - 基础设置 - 骑士标签设置 - 添加骑士标签组件 - 搜索组件 Finance/Config/Tags
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input, Select } from 'antd';
import { CoreContent, DeprecatedCoreSearch } from '../../../../../components/core';
import { HouseholdType } from '../../../../../application/define';

const { Option } = Select;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
    onShowDateList: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => {},
    onShowDateList: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      search: {
        name: '',                               // 姓名
        phone: '',                              // 手机号
        workType: `${HouseholdType.second}`, //  人员类型
      },
      form: undefined,                          // 搜索的form
    };
  }

  // 查询
  onSearch = (values) => {
    const { onSearch, onShowDateList } = this.props;
    const { name, phone, workType } = values;
    const params = values;

    // 判断如果有选择name，则传入查询参数
    if (is.existy(name)) {
      params.name = name;
    }

    // 判断如果有选择phone，则传入查询参数
    if (is.existy(phone)) {
      params.phone = phone;
    }

    // 判断如果有选择工作性质，则传入查询参数
    if (is.existy(workType)) {
      params.workType = workType;
    }

    // 每次点击查询,重置页码为1
    params.page = 1;

    if (onSearch) {
      onSearch(params);
    }
    if (onShowDateList) {
      onShowDateList();
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  render() {
    const { name, phone, workType } = this.state.search;
    const items = [
      {
        label: '骑士姓名',
        form: form => (form.getFieldDecorator('name', { initialValue: name })(
          <Input placeholder="请输入姓名" />,
        )),
      }, {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone', { initialValue: phone })(
          <Input placeholder="请输入手机号" />,
        )),
      }, {
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
      items,
      isHideReset: true,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      isShowOneRow: true,
    };
    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  }
}

export default Search;
