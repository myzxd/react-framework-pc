/**
 * 人员管理 - 社保配置管理 - 搜索组件
 */
import React from 'react';

import { Form } from 'antd';

import { CoreContent, CoreSearch } from '../../../components/core';
import { CommonSelectRegionalCascade } from '../../../components/common';

import SelectPlan from './components/selectPlan.jsx';           // 参保方案名称下拉组件

const SocietySearch = ({ onSearch }) => {
  // 重置搜索表单
  const onReset = () => {
    if (onSearch) {
      onSearch(false);
    }
  };

  // 搜索
  const onSearchComp = (params) => {
    // 每次点击搜索重置页码为1
    const newParams = {
      ...params,
      meta: { page: 1, limit: 30 },
    };
    if (onSearch) {
      onSearch(newParams);
    }
  };

  // 搜索功能
  const render = () => {
    const items = [
      <Form.Item
        label="城市"
        name="city"
      >
        <CommonSelectRegionalCascade isHideArea />
      </Form.Item>,
      <Form.Item
        label="参保方案名称"
        name="planName"
      >
        <SelectPlan />
      </Form.Item>,
    ];

    const props = {
      items,
      onReset,
      onSearch: onSearchComp,
    };
    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
  return (
    <div>
      {/* 渲染查询条件 */}
      {render()}
    </div>
  );
};
export default SocietySearch;
