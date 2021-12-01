/**
 * 费用管理 - 费用预算 - 查询组件
 */
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  DatePicker,
} from 'antd';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension, CommonSelectScene } from '../../../components/common';

const { MonthPicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => {},
  };

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const {
      platforms,
      suppliers,
      cities,
      districts,
      industryCode,
      budgetTime,
    } = values;

    // 接口参数
    const params = {
      platforms, // 平台
      suppliers, // 供应商
      cities, // 城市
      districts, // 商圈
      industryCode, // 所属场景
      budgetTime: budgetTime ? moment(budgetTime).format('YYYYMM') : '',
      page: 1,
      limit: 30,
    };

    // 查询
    if (onSearch) {
      onSearch(params);
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      page: 1,
      limit: 30,
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索功能
  render = () => {
    // 其他查询项
    const items = [
      {
        label: '预算周期',
        form: form => (form.getFieldDecorator('budgetTime', { initialValue: null })(
          <MonthPicker placeholder="请选择预算周期" />,
        )),

      },
    ];

    // 特殊查询项（需要放在平台之前）
    const specialItems = [
      {
        label: '所属场景',
        form: form => (form.getFieldDecorator('industryCode')(
          <CommonSelectScene enumeratedType="industry" showArrow mode="multiple" />,
        )),
      },
    ];

    const props = {
      items,
      specialItems,
      isExpenseModel: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
    };

    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

}

export default Search;
