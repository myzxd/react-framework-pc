/**
 * code - 记录明细详情 - 发票信息
 */
import React from 'react';
import {
  Table,
  Empty,
} from 'antd';
import {
  Unit,
  ExpenseInvoiceType,
  ExpenseInvoiceTaxRate,
} from '../../../../application/define';
import {
  CoreContent,
} from '../../../../components/core';

const InvoiceInfo = ({
  detail = {}, // 审批单详情
}) => {
  const {
    cost_bill_list: costBillList = [], // 发票列表
  } = detail;

  // 无数据
  const renderEmpty = () => {
    if (Array.isArray(costBillList) && costBillList.length > 0) {
      return;
    }

    return <Empty description="暂无发票信息" />;
  };

  // table
  const renderContent = () => {
    if (!costBillList || costBillList.length < 1) {
      return;
    }
    const columns = [
      {
        title: '发票编号',
        dataIndex: 'code',
        render: text => text || '--',
      },
      {
        title: '发票类型',
        dataIndex: 'type',
        render: text => (text ? ExpenseInvoiceType.description(text) : '--'),
      },
      {
        title: '发票金额',
        dataIndex: 'money',
        render: text => `${Unit.exchangePriceCentToMathFormat(text)}元`,
      },
      {
        title: '税率',
        dataIndex: 'tax_rate',
        render: text => (text !== undefined ? ExpenseInvoiceTaxRate.description(text) : '--'),
      },
      {
        title: '税金',
        dataIndex: 'tax_amount',
        render: text => `${Unit.exchangePriceCentToMathFormat(text)}元`,
      },
      {
        title: '税金',
        dataIndex: 'tax_deduction',
        render: text => `${Unit.exchangePriceCentToMathFormat(text)}元`,
      },
    ];

    return (
      <Table
        bordered
        columns={columns}
        pagination={false}
        dataSource={costBillList}
        rowKey={(rec, key) => rec._id || key}
        scroll={{ y: 400 }}
      />
    );
  };

  return (
    <CoreContent title="发票信息">
      {/* 列表 */}
      {renderContent()}

      {/* 无数据 */}
      {renderEmpty()}
    </CoreContent>
  );
};

export default InvoiceInfo;
