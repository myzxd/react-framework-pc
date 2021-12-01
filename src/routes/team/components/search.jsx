/**
 * 业务承揽 - 业务承揽记录 - 搜索组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../components/common';

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
      department,
      month,
      // singleCost,
      // singleIncome
    } = values;
    const params = {
      platforms,      // 平台
      suppliers,      // 供应商
      cities,         // 城市
      districts,      // 商圈
      department,     // 私教部门
      month,          // 归属月份
      // singleCost,     // 单成本
      // singleIncome,   // 单收入
      page: 1,
      limit: 30,
    };
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
    const props = {
      onReset: this.onReset,
      onSearch: this.onSearch,
      items: this.props.items,
      isExpenseModel: true,
    };
    const { items } = this.props;
    if (items) {
      props.items = items;
    }
    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

}

export default Search;
