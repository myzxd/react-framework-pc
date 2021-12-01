/**
 * 物资管理 - 物资扣款明细页面 - 搜索组件   Supply/Deductions
 */
import moment from 'moment';
import React, { Component } from 'react';
import { DatePicker } from 'antd';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../components/common';
import style from './index.css';

const { MonthPicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {
        belongTime: undefined,  // 归属时间
      },
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { platforms, suppliers, cities, districts, belongTime } = values;
    const affiliation = belongTime ? moment(belongTime).format('YYYYMM') : '';  // 归属时间
    const params = {
      platforms,      // 平台
      suppliers,      // 供应商
      cities,         // 城市
      districts,      // 商圈
      page: 1,
      limit: 30,
      belongTime: affiliation,   // 归属时间
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      page: 1,
      limit: 30,
      belongTime: undefined,  // 归属时间
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 搜索功能
  render = () => {
    const { belongTime } = this.state.search;
    // 归属时间查询条件
    const items = [{
      label: '归属时间',
      form: form => (form.getFieldDecorator('belongTime', { initialValue: belongTime })(
        <MonthPicker placeholder="请选择归属时间" disabledDate={this.disableDateOfMonth} />,
      )),
    }];
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
    };

    return (
      <CoreContent className={style['app-comp-supply-deductions-search']}>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

}

export default Search;
