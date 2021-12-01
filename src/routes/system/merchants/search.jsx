/**
 * 服务商配置 - 搜索组件
 */

import React, { useState } from 'react';
import { CoreContent } from '../../../components/core/index';
import { CommonSearchExtension } from '../../../components/common/index';

const Search = (props = {}) => {
  const {
    onSearch = () => { },
  } = props;

  // 设置表单
  const [form, setForm] = useState(undefined);
  console.log(form);
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

  // 获取提交用的form表单
  const onHookForm = (val) => {
    setForm(val);
  };


  const params = {
    isExpenseModel: true, // 启用费用模块
    onReset,
    onSearch: onClickSearch,
    onHookForm,
  };

  return (
    <CoreContent>
      <CommonSearchExtension {...params} />
    </CoreContent>
  );
};

export default Search;
