/*
 * 趣活钱包 - 钱包明细 - 表格组件
 */
import React from 'react';
import moment from 'moment';
import {
  Table,
} from 'antd';

import { CoreContent } from '../../../components/core';
import {
  Unit,
  WalletDetailType,
  WalletBillsPaidState,
} from '../../../application/define';

const Content = ({
  walletDetails = {}, // 钱包明细list
  onShowSizeChange = () => {},
  onChangePage = () => {},
}) => {
  const { data = [], _meta: meta = {} } = walletDetails;

  // columns
  const columns = [
    {
      title: '姓名',
      dataIndex: 'payee_name',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Q钱包账户',
      dataIndex: 'wallet_account_id',
      width: 200,
      fixed: 'left',
      render: text => (text || '--'),
    },
    {
      title: 'BOSS登陆账号',
      dataIndex: 'payee_phone',
      width: 150,
      fixed: 'left',
      render: text => (text || '--'),
    },
    {
      title: '绑定微信',
      dataIndex: 'nick_name',
      width: 150,
      render: text => (text || '--'),
    },
    {
      title: '交易金额',
      dataIndex: 'total_money',
      width: 100,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      width: 100,
      render: text => (text ? WalletDetailType.description(text) : '--'),
    },
    {
      title: '交易状态',
      dataIndex: 'state',
      width: 100,
      render: text => (text ? WalletBillsPaidState.description(text) : '--'),
    },
    {
      title: '发起交易时间',
      dataIndex: 'created_at',
      width: 150,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '交易完成时间',
      dataIndex: 'done_at',
      width: 150,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '发票抬头',
      dataIndex: 'invoice_title',
      width: 150,
      render: text => (text || '--'),
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 150,
      render: text => (text || '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      width: 80,
      render: () => '--',
    },
  ];

  // pagination
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
    <CoreContent>
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
        scroll={{ x: 1500, y: 500 }}
      />
    </CoreContent>
  );
};

export default Content;
