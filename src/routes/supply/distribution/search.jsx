/**
 * 物资管理 - 物资分发明细 - 搜索组件   Supply/Distribution
 */
import React, { Component } from 'react';
import moment from 'moment';
import {
  DatePicker,
  Select,
} from 'antd';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../components/common';
import { SupplyDistributionState } from '../../../application/define';
import style from './index.css';

const { MonthPicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {

      },
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const {
      platforms,
      suppliers,
      cities,
      districts,
      belongTime,
      state,
    } = values;
    const params = {
      platforms,      // 平台
      suppliers,      // 供应商
      cities,         // 城市
      districts,      // 商圈
      page: 1,
      limit: 30,
      belongTime: belongTime ? moment(belongTime).format('YYYYMM') : '', // 分发周期
      state, // 领用状态
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
      belongTime: moment(new Date()).format('YYYYMM'),
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 渲染查询
  renderSearch = () => {
    const nowDate = moment(new Date(), 'YYYY-MM');
    // 定义其他查询条件
    const items = [
      {
        label: '分发周期',
        form: form => (form.getFieldDecorator('belongTime', { initialValue: nowDate })(
          <MonthPicker placeholder="请选择月份" format="YYYY-MM" />,
        )),
      },
      {
        label: '领用状态',
        form: form => (form.getFieldDecorator('state')(
          <Select placeholder="请选择领用状态">
            <Option value={SupplyDistributionState.used}>{SupplyDistributionState.description(SupplyDistributionState.used)}</Option>
            <Option value={SupplyDistributionState.toBeUsed}>{SupplyDistributionState.description(SupplyDistributionState.toBeUsed)}</Option>
            <Option value={SupplyDistributionState.return}>{SupplyDistributionState.description(SupplyDistributionState.return)}</Option>
          </Select>,
        )),
      },

    ];
    // 参数
    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
    };

    return (
      <CoreContent className={style['app-comp-supply-distribution-search']}>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

  // 搜索功能
  render = () => {
    return this.renderSearch();
  }

}

export default Search;

