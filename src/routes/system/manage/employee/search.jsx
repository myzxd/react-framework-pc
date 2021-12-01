/**
 * 人员管理 - 合同归属管理 - 员工合同甲方 - seatch
 */
import React from 'react';
import {
  Form,
  Select,
  Input,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../../components/core';
import {
  ThirdCompanyState,
} from '../../../../application/define';

const { Option } = Select;

const Search = ({
  onSearch,
  onReset,
}) => {
  // form items
  const formItems = [
    <Form.Item
      label="公司名称"
      name="name"
    >
      <Input placeholder="请输入内容" />
    </Form.Item>,
    <Form.Item
      label="状态"
      name="state"
      initialValue={ThirdCompanyState.on}
    >
      <Select placeholder="请选择状态">
        <Option
          value={ThirdCompanyState.on}
        >{ThirdCompanyState.description(ThirdCompanyState.on)}
        </Option>
        <Option
          value={ThirdCompanyState.off}
        >{ThirdCompanyState.description(ThirdCompanyState.off)}
        </Option>
      </Select>
    </Form.Item>,
  ];

  const sProps = {
    items: formItems,
    onSearch,
    onReset,
  };

  return (
    <CoreContent>
      <CoreSearch {...sProps} />
    </CoreContent>
  );
};

export default Search;
