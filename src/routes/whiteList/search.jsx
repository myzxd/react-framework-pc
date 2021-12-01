/**
 * 服务费预支设置权限 - 搜索组件
 */

import React from 'react';
import { CoreContent } from '../../components/core/index';
import { CommonSearchExtension } from '../../components/common/index';

const Search = (props = {}) => {
  const {
    onSearch,
  } = props;

  // 重置
  const onReset = () => {
    // 重置搜索
    if (onSearch) {
      onSearch({});
    }
  };

  // 搜索
  const onClickSearch = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const params = {
    isExpenseModel: true, // 启用费用模块
    onReset,
    onSearch: onClickSearch,
  };

  return (
    <CoreContent>
      <CommonSearchExtension {...params} />
    </CoreContent>
  );
};

export default Search;
