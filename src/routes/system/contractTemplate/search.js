/**
 *  合同模版管理 - 查询
 */
import React from 'react';
import { Form, Input } from 'antd';

import { CoreSearch, CoreContent } from '../../../components/core';

function Search(props) {
  // 重置
  const onReset = () => {
    props.onSearch && props.onSearch({});
  };

  // 渲染查询条件
  const renderSearch = () => {
    const { operations } = props;
    const items = [
      <Form.Item label="合同模版编码" name="code">
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
      <Form.Item label="合同模版名称" name="name">
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
    ];
    const searchProps = {
      items,
      operations,
      expand: true,
      onReset,
      onSearch: props.onSearch,
    };
    return (
      <CoreContent>
        <CoreSearch {...searchProps} />
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染查询条件 */}
      {renderSearch()}
    </React.Fragment>
  );
}

export default Search;
