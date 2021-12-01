/**
 * 结算汇总,城市结算明细,查询 - Finance/Manage/Summary/Detail/City
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select, Input } from 'antd';

import { DeprecatedCoreSearch, CoreContent } from '../../../../../../components/core';
import { CommonSelectDistricts } from '../../../../../../components/common';
import { SalaryPaymentState, HouseholdType } from '../../../../../../application/define';

const { Option } = Select;

class Search extends Component {
  static propTypes = {
    recordId: PropTypes.string,
    supplierName: PropTypes.string,
    platformName: PropTypes.string,
    cityName: PropTypes.string,
    workType: PropTypes.string,
    onSearch: PropTypes.func,
    supplier: PropTypes.string,
    platform: PropTypes.string,
    city: PropTypes.string,
  };

  static defaultProps = {
    recordId: '',
    supplierName: '--',
    platformName: '--',
    cityName: '--',
    workType: '',
    onSearch: () => {},
    supplier: '',
    platform: '',
    city: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,          // 搜索的form
    };
  }

  // 重置
  onReset = () => {
    const { onSearch, recordId } = this.props;

    const params = {
      recordId,                       // 数据id
      districts: [],    // 商圈
      name: [],         // 姓名
      paymentState: [], // 工资发放状态
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch, recordId } = this.props;
    const { districts, name, paymentState } = values;
    const params = {
      recordId,
      districts,
      name,
      paymentState,
      page: 1,
      limit: 30,
    };

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
    const { supplier, platform, city, supplierName, platformName, cityName, workType } = this.props;
    const items = [
      {
        label: '平台',
        form: () => (platformName),
      },
      {
        label: '供应商',
        form: () => (supplierName),
      },
      {
        label: '城市',
        form: () => (cityName),
      },
      {
        label: '个户类型',
        form: () => (HouseholdType.description(workType)),
      },
      {
        label: '商圈',
        form: form => (form.getFieldDecorator('districts')(
          <CommonSelectDistricts allowClear enableSelectAll showSearch optionFilterProp="children" showArrow mode="multiple" placeholder="请选择商圈" platforms={[platform]} suppliers={[supplier]} cities={[city]} />,
        )),
      },
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请填写姓名" />,
        )),
      },
      {
        label: '服务费发放状态',
        form: form => (form.getFieldDecorator('paymentState')(
          <Select allowClear placeholder="请选择服务费发放状态" mode="multiple" showArrow>
            <Option value={`${SalaryPaymentState.normal}`}>{SalaryPaymentState.description(SalaryPaymentState.normal)}</Option>
            <Option value={`${SalaryPaymentState.delayed}`}>{SalaryPaymentState.description(SalaryPaymentState.delayed)}</Option>
            <Option value={`${SalaryPaymentState.reissue}`}>{SalaryPaymentState.description(SalaryPaymentState.reissue)}</Option>
            <Option value={`${SalaryPaymentState.notPay}`}>{SalaryPaymentState.description(SalaryPaymentState.notPay)}</Option>
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
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
