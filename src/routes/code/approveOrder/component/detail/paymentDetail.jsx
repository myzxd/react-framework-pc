/**
 * code - 审批单详情 - 付款明细
 */
import dot from 'dot-prop';
import React from 'react';
import {
  Table,
  Empty,
} from 'antd';
import {
  Unit,
  ExpenseCollectionType,
  CodeApproveOrderPayState,
} from '../../../../../application/define';
import {
  CoreContent,
} from '../../../../../components/core';

const PaymentDetail = ({
  detail = {}, // 审批单详情
  isShowMoney = true, // 是否显示金额
  isShowTitle = false,
  isApproveOrder = false, // 是否为审批单
}) => {
  const {
    total_money: totalMoney = 0, // 金额
    paid_state: paidState, // 付款状态
  } = detail;

  // 付款明细
  const dataSource = isApproveOrder ?
    dot.get(detail, 'actual_payee_list', [])
    : dot.get(detail, 'payee_list', []);

  // 已付款审批单，显示付款明细
  if (paidState !== CodeApproveOrderPayState.done
    && isApproveOrder
  ) {
    return <Empty description="无付款明细" />;
  }

  // 金额合计
  const renderMoney = () => {
    return (
      <div style={{ textAlign: 'center', margin: '5px 0' }}>
        金额合计
        {Unit.exchangePriceCentToMathFormat(totalMoney)}
        元
      </div>
    );
  };

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
        title: `${isApproveOrder ? '付款方式' : '收款方式'}`,
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
    <CoreContent title={isShowTitle ? '收款信息' : null}>
      {/* 金额 */}
      {isShowMoney && renderMoney()}
      {/* 列表 */}
      {renderContent()}
    </CoreContent>
  );
};

export default PaymentDetail;
