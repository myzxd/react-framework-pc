/**
 * 趣活钱包 - 支付账单 - 查询组件
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  Popconfirm,
  Button,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../components/core';
import {
  WalletBillsPaidType,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

const { Option } = Select;

const Search = ({
  onSearch,
  onReset,
  dispatch,
  tabKey,
  searchVal,
}) => {
  // form
  const [form, setForm] = useState({});

  useEffect(() => {
    form && form.resetFields && form.resetFields();
  }, [tabKey, form]);

  // 导出报表
  const onConfirm = async () => {
    const formVals = await form.validateFields();
    dispatch({
      type: 'wallet/onExportBills',
      payload: {
        ...searchVal,
        ...formVals,
        state: tabKey,
      },
    });
  };

  // form items
  const formItems = [
    <Form.Item
      label="类型"
      name="type"
    >
      <Select
        placeholder="请选择"
        showSearch
        allowClear
      >
        <Option
          value={WalletBillsPaidType.approval}
        >
          {WalletBillsPaidType.description(WalletBillsPaidType.approval)}
        </Option>
        <Option
          value={WalletBillsPaidType.code}
        >
          {WalletBillsPaidType.description(WalletBillsPaidType.code)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="提报人"
      name="informant"
      initialValue={undefined}
    >
      <Input
        placeholder="请输入"
        allowClear
      />
    </Form.Item>,
  ];

  // 操作
  const operations = Operate.canOperateWalletBillsExport() ? (
    <Popconfirm
      title="创建下载任务？"
      onConfirm={onConfirm}
      okText="确认"
      cancelText="取消"
    >
      <Button type="primary">导出报表</Button>
    </Popconfirm>
  ) : '';

  const sProps = {
    items: formItems,
    onSearch,
    onReset,
    onHookForm: hForm => setForm(hForm),
    operations,
  };

  return (
    <CoreContent>
      <CoreSearch {...sProps} />
    </CoreContent>
  );
};

export default Search;
