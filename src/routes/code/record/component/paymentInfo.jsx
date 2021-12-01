/**
 * code - 审批单详情 - 付款明细
 */
import React from 'react';
import {
  Table,
} from 'antd';
import {
  Unit,
  ExpenseCollectionType,
} from '../../../../application/define';
import {
  CoreContent,
} from '../../../../components/core';

const PaymentInfo = ({
  detail = {}, // 审批单详情
}) => {
  const {
    actual_payee_list: dataSource = [], // 付款明细
  } = detail;

  // table
  const renderContent = () => {
    const columns = [
      {
        title: '收款人',
        dataIndex: 'card_name',
        render: (text, record) => {
          if (text) {
            return `${text} ${record.card_phone ? `(${record.card_phone})` : ''}`;
          }
          return '--';
        },
      },
      {
        title: '银行卡号',
        dataIndex: 'card_num',
        render: text => text || '--',
      },
      {
        title: '开户支行',
        dataIndex: 'bank_details',
        render: text => text || '--',
      },
      {
        title: '金额（元）',
        dataIndex: 'money',
        render: text => (text >= 0 ? Unit.exchangePriceCentToMathFormat(text) : '--'),
      },
      {
        title: '收款方式',
        dataIndex: 'payee_type',
        render: text => (text ? ExpenseCollectionType.description(text) : '--'),
      },
    ];

    return (
      <Table
        bordered
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        rowKey={(rec, key) => rec._id || key}
        scroll={{ y: 400 }}
      />
    );
  };

  return (
    <CoreContent title="付款明细">
      {/* 列表 */}
      {renderContent()}
    </CoreContent>
  );
};

export default PaymentInfo;
