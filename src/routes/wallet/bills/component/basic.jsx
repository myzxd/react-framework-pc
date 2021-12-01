/**
 * 趣活钱包 - 支付账单 - 账单详情 - 基本信息
 */
import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';

import {
  Form,
} from 'antd';

import {
  Unit,
  WalletBillsPaidType,
  WalletBillsPaidState,
} from '../../../../application/define';
import {
  CoreForm,
  CoreContent,
} from '../../../../components/core';

const BasicInfo = ({
  detail = {}, // 账单详情
}) => {
  const {
    _id: id, // 账单编号
    type, // 账单类型
    state, // 账单状态
    created_at: createdAt, // 账单生成时间
    total_money: totalMoney, // 账单总金额
    paid_money: paidMoney, // 已支付金额
    unpaid_money: unpaidMoney, // 未支付金额
    paying_money: payingMoney, // 支付中金额
    cancellation_at: cancellationAt, // 作废时间
  } = detail;

  // 账单单据信息
  const billItem = [
    <Form.Item label="账单编号">
      {id}
    </Form.Item>,
    <Form.Item label="账单类型">
      {type ? WalletBillsPaidType.description(type) : '审批单类'}
    </Form.Item>,
    <Form.Item label="账单生成时间">
      {createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm:ss') : '--'}
    </Form.Item>,
  ];

  // 作废账单
  if (state === WalletBillsPaidState.void) {
    billItem[billItem.length] = (
      <Form.Item label="作废时间">
        {cancellationAt ? moment(cancellationAt).format('YYYY-MM-DD HH:mm:ss') : '--'}
      </Form.Item>
    );

    billItem[billItem.length] = (
      <Form.Item label="作废操作人">
        {dot.get(detail, 'cancellation_operator_info.name', '--')}
      </Form.Item>
    );
  }

  // 账单金额信息
  const moneyItem = [
    <Form.Item label="账单总金额">
      {totalMoney ? Unit.exchangePriceCentToMathFormat(totalMoney) : '0.00'}
    </Form.Item>,
    <Form.Item label="已支付金额">
      {paidMoney ? Unit.exchangePriceCentToMathFormat(paidMoney) : '0.00'}
    </Form.Item>,
    <Form.Item label="未支付金额">
      {unpaidMoney ? Unit.exchangePriceCentToMathFormat(unpaidMoney) : '0.00'}
    </Form.Item>,
    <Form.Item label="支付中金额">
      {payingMoney ? Unit.exchangePriceCentToMathFormat(payingMoney) : '0.00'}
    </Form.Item>,
  ];


  return (
    <CoreContent>
      <Form className="wallet-bill-detail-basic-form">
        <CoreForm items={billItem} cols={3} />
      </Form>
      <Form
        layout="vertical"
        className="wallet-bill-detail-basic-form wallet-bill-detail-basic-form-ver"
      >
        <CoreForm items={moneyItem} cols={4} />
      </Form>
    </CoreContent>
  );
};

export default BasicInfo;
