/**
 * 趣活钱包 - 钱包明细 - 查询组件
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  Popconfirm,
  Button,
  DatePicker,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../components/core';
import {
  WalletDetailType,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Search = ({
  onSearch,
  onReset,
  dispatch,
  tabKey,
  walletDetailsInvoice = [],
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
      type: 'wallet/onExportWalletDetails',
      payload: {
        ...searchVal,
        ...formVals,
        type: tabKey,
      },
    });
  };

  // form items
  const formItems = [
    <Form.Item
      label="姓名"
      name="name"
      initialValue={undefined}
    >
      <Input
        placeholder="请输入"
        allowClear
      />
    </Form.Item>,
    <Form.Item
      label="发票抬头"
      name="invoice"
      initialValue={undefined}
    >
      <Select
        placeholder="请选择"
        allowClear
        showSearch
      >
        {
          walletDetailsInvoice.map((i) => {
            return <Option value={i} key={i}>{i}</Option>;
          })
        }
      </Select>
    </Form.Item>,
    <Form.Item
      label="交易完成时间"
      name="time"
      initialValue={undefined}
    >
      <RangePicker />
    </Form.Item>,
  ];

  // 提现不用发票抬头查询条件
  if (Number(tabKey) === WalletDetailType.withdraw) {
    formItems.splice(1, 1);
  }

  // 操作
  const operations = Operate.canOperateWalletDetailExport() ? (
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
