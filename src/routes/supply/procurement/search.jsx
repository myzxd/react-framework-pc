/**
 * 物资管理 - 采购入库明细 - 搜索组件
 */
import React, { Component } from 'react';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../components/common';

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
    const { platforms, suppliers, cities, districts } = values;
    const params = {
      platforms,      // 平台
      suppliers,      // 供应商
      cities,         // 城市
      districts,      // 商圈
      page: 1,
      limit: 30,
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
    };

    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

}

export default Search;
