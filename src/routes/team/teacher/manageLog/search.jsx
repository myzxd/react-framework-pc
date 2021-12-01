/**
 * 私教管理记录 - 搜索组件
 */
import { Input, Form } from 'antd';
import React from 'react';

import { CoreContent, CoreSearch } from '../../../../components/core';

const Search = ({ onSearch }) => {
  // 重置搜索表单
  const onReset = () => {
    onSearch(false);
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
        label="业主姓名"
        name="name"
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="业主手机号"
        name="phone"
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="业主身份证号"
        name="idCard"
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="商圈名称"
        name="disName"
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="业主团队ID"
        name="ownerTeamId"
      >
        <Input placeholder="请输入" />
      </Form.Item>,
    ];

    const props = {
      items,
      onReset,
      onSearch: onSearchComp,
      expand: true,
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

export default Search;
