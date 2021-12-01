/*
 * 共享登记 - 银行账户列表 - 查询组件 /Shared/BankAccount
 */
import React, { useState } from 'react';
import {
  Form,
  Select,
  Input,
  Popconfirm,
  Button,
  message,
  DatePicker,
} from 'antd';

import {
  BusinesBankAccountType,
  SharedBankAccountState,
  SharedBankCurrency,
  SharedBankAccountSystem,
} from '../../../application/define';
import CompanyPurview from '../component/companyPurview';
import { CoreContent, CoreSearch } from '../../../components/core';
import Operate from '../../../application/define/operate';

const Option = Select.Option;

const Search = ({ onSearch = () => {}, dispatch }) => {
  const [form, setForm] = useState({});
  const onCreateExportTask = async () => {
    const formRes = await form.validateFields();

    dispatch({
      type: 'sharedBankAccount/exportSharedBankAccount',
      payload: {
        params: { ...formRes },
        onSuccessCallback: () => message.success('创建下载任务成功'),
        // onFailureCallback: () => message.error('导出数据失败'),
      },
    });
  };

  const onHookForm = (hookForm) => {
    setForm(hookForm);
  };

  const onCreate = () => {
    window.location.href = '/#/Shared/BankAccount/Create';
  };

  const items = [
    <Form.Item label="公司名称" name="firm_id">
      <CompanyPurview />
    </Form.Item>,
    <Form.Item label="开户账号" name="bank_card">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item label="账户类型" name="bank_card_type">
      <Select placeholder="请选择" allowClear>
        <Option value={BusinesBankAccountType.basic}>{BusinesBankAccountType.description(BusinesBankAccountType.basic)}</Option>
        <Option value={BusinesBankAccountType.general}>{BusinesBankAccountType.description(BusinesBankAccountType.general)}</Option>
        <Option value={BusinesBankAccountType.temporary}>{BusinesBankAccountType.description(BusinesBankAccountType.temporary)}</Option>
        <Option value={BusinesBankAccountType.special}>{BusinesBankAccountType.description(BusinesBankAccountType.special)}</Option>
        <Option value={BusinesBankAccountType.treasure}>{BusinesBankAccountType.description(BusinesBankAccountType.treasure)}</Option>
        <Option value={BusinesBankAccountType.dollar}>{BusinesBankAccountType.description(BusinesBankAccountType.dollar)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="账户状态" name="state">
      <Select placeholder="请选择" allowClear>
        <Option value={SharedBankAccountState.normal}>{SharedBankAccountState.description(SharedBankAccountState.normal)}</Option>
        <Option value={SharedBankAccountState.disable}>{SharedBankAccountState.description(SharedBankAccountState.disable)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="银行账户ID" name="_id">
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="币种"
      name="currency"
    >
      <Select
        placeholder="请选择"
        allowClear
      >
        <Option value={SharedBankCurrency.rmb}>
          {SharedBankCurrency.description(SharedBankCurrency.rmb)}
        </Option>
        <Option value={SharedBankCurrency.dollar}>
          {SharedBankCurrency.description(SharedBankCurrency.dollar)}
        </Option>
        <Option value={SharedBankCurrency.hkdollar}>
          {SharedBankCurrency.description(SharedBankCurrency.hkdollar)}
        </Option>
        <Option value={SharedBankCurrency.other}>
          {SharedBankCurrency.description(SharedBankCurrency.other)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="开户日期"
      name="bankDate"
    >
      <DatePicker picker="month" allowClear />
    </Form.Item>,
    <Form.Item
      label="注销日期"
      name="canceler_date"
    >
      <DatePicker allowClear />
    </Form.Item>,
    <Form.Item
      label="账户体系"
      name="account_system"
    >
      <Select
        placeholder="请选择"
        allowClear
      >
        <Option value={SharedBankAccountSystem.inside}>
          {SharedBankAccountSystem.description(SharedBankAccountSystem.inside)}
        </Option>
        <Option value={SharedBankAccountSystem.outside}>
          {SharedBankAccountSystem.description(SharedBankAccountSystem.outside)}
        </Option>
      </Select>
    </Form.Item>,
  ];

  const operations = (
    <span>
      {
        Operate.canOperateSharedBankAccountCreate() ? (
          <Button type="primary" onClick={onCreate}>创建</Button>
        ) : ''
      }
      {
        Operate.canOperateSharedBankAccountExport() ? (
          <Popconfirm
            title="创建下载任务？"
            onConfirm={onCreateExportTask}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" style={{ marginLeft: 10 }}>导出EXCEL</Button>
          </Popconfirm>
        ) : ''
      }
    </span>
  );

  const searchProps = {
    operations,
    items,
    onSearch,
    onReset: onSearch,
    onHookForm,
  };

  return (
    <CoreContent>
      <CoreSearch {...searchProps} />
    </CoreContent>
  );
};

export default Search;
