/*
 * 共享登记 - 银行账户列表 - 表格组件 /Shared/BankAccount
 */
import moment from 'moment';
import React from 'react';
import { Table } from 'antd';

import { CoreContent } from '../../../components/core';
import {
  BusinesBankAccountType,
  SharedBankAccountState,
  SharedBankCurrency,
  SharedBankAccountSystem,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

const Content = ({
  bankAccountList = {},
  onShowSizeChange = () => {},
  onChangePage = () => {},
}) => {
  const { data = [], _meta: meta = {} } = bankAccountList;

  const columns = [
    // {
      // title: '银行账户ID',
      // dataIndex: '_id',
    // },
    {
      title: '公司名称',
      dataIndex: ['firm_info', 'name'],
    },
    {
      title: '开户账号',
      dataIndex: 'bank_card',
      render: text => text || '--',
    },
    {
      title: '账户类型',
      dataIndex: 'bank_card_type',
      render: (text) => {
        if (text) return BusinesBankAccountType.description(text);
        return '--';
      },
    },
    {
      title: '币种',
      dataIndex: 'currency',
      render: text => (text ? SharedBankCurrency.description(text) : '--'),
    },
    {
      title: '开户银行',
      dataIndex: 'bank_and_branch',
    },
    {
      title: '账户体系',
      dataIndex: 'account_system',
      render: text => (text ? SharedBankAccountSystem.description(text) : '--'),
    },
    {
      title: '最新修改时间',
      dataIndex: 'updated_at',
      render: text => (text ? moment(text).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '最新操作人',
      dataIndex: ['operator_info', 'name'],
      render: text => (text || '--'),
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text) => {
        if (text) return SharedBankAccountState.description(text);
        return '--';
      },
    },
    {
      title: '操作',
      dataIndex: '_id',
      width: 150,
      render: (id) => {
        const formUrl = `/#/Shared/BankAccount/Update?id=${id}`;
        const detailUrl = `/#/Shared/BankAccount/Detail?id=${id}`;
        return (
          <div>
            {
              Operate.canOperateSharedBankAccountDetail() ?
                (<a href={detailUrl} target="_blank" rel="noopener noreferrer">查看</a>)
                : ''
            }
            {
              Operate.canOperateSharedBankAccountUpdate() ?
                (<a href={formUrl} style={{ marginLeft: 10 }}>编辑</a>)
                : ''
            }
          </div>
        );
      },
    },
  ];

  const pagination = {
    current: meta.page || 1,
    defaultPageSize: 30,
    pageSize: meta.page_size || 30,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: onChangePage,
    onShowSizeChange,
    showTotal: showTotal => `总共${showTotal}条`,
    total: meta.result_count,
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  return (
    <CoreContent title="银行账户列表">
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
      />
    </CoreContent>
  );
};

export default Content;
