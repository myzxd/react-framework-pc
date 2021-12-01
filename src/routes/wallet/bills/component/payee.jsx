/**
 * 趣活钱包 - 支付账单 - 账单详情 - 收款人信息
 */
import _ from 'lodash';
import React, { useState } from 'react';
import moment from 'moment';
import {
  Table,
  Button,
} from 'antd';

import {
  Unit,
  WalletBillsPaidState,
} from '../../../../application/define';
import {
  CoreContent,
} from '../../../../components/core';
import DetailPayModal from './modal/detailPay';
import PaymentStateModal from './modal/paymentState';
import Operate from '../../../../application/define/operate';

import style from '../style.less';

const Approval = ({
  detail = {}, // 账单详情
  dispatch,
}) => {
  // 当前操作付款的账单
  const [curBill, setCurBill] = useState([]);
  // 单账单弹窗visible
  const [singlePayVis, setSinglePayVis] = useState(false);
  // 付款状态弹窗visible
  const [payStateVis, setPayStateVis] = useState(false);
  // 选中的invoice
  const [checkInvoice, setCheckInvoice] = useState('all');

  // 收款人信息数据
  const {
    oa_payment_bill_detail_list: billList = [],
    state: billState, // 账单状态
  } = detail;

  // 获取支付账单明细
  const getWalletBillDetail = () => {
    const { _id: id } = detail;
    dispatch({
      type: 'wallet/getWalletBillDetail',
      payload: { id },
    });
  };

  // 单账单付款
  const onBill = (rec) => {
    setCurBill(rec);
    setSinglePayVis(true);
  };

  // 隐藏单账单付款弹窗
  const onCancelPayModal = (res) => {
    setSinglePayVis(false);
    if (res && res.ok) {
      // 获取支付账单明细
      getWalletBillDetail();
      setPayStateVis(true);
    }
  };

  // columns
  const columns = [
    {
      title: '收款人姓名',
      dataIndex: 'payee_name',
      fixed: 'left',
      width: 110,
      render: text => (text || '--'),
    },
    {
      title: '收款金额',
      dataIndex: 'total_money',
      fixed: 'left',
      width: 100,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '收款人所属费用单号',
      dataIndex: 'ref_id',
      width: 150,
      render: text => (text || '--'),
    },
    {
      title: '科目',
      dataIndex: 'cost_accounting_name',
      width: 120,
      render: text => (text || '--'),
    },
    {
      title: '所属费用单发票抬头',
      dataIndex: 'invoice_title',
      width: 150,
      render: text => (text || '--'),
    },
    {
      title: '收款人BOSS账号',
      dataIndex: 'payee_phone',
      width: 140,
      render: text => (text || '--'),
    },
    {
      title: '所属费用单备注',
      dataIndex: 'note',
      width: 170,
      render: text => <div className={style['wallet-bill-batch-pay-footer-money']}>{text || '--'}</div>,
    },
    {
      title: '付款状态',
      dataIndex: 'state',
      width: 100,
      render: text => (text ? WalletBillsPaidState.description(text) : '--'),
    },
    {
      title: '付款时间',
      dataIndex: 'done_at',
      width: 120,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: 'operate',
      width: 80,
      render: (text, rec) => {
        const { state } = rec;
        if (Operate.canOperateWalletBillsPay() &&
          (state === WalletBillsPaidState.toBePaid
          || state === WalletBillsPaidState.fail)
          && billState !== WalletBillsPaidState.void
        ) {
          return <a onClick={() => onBill(rec)}>付款</a>;
        }
        return '--';
      },
    },
  ];

  // 付款弹窗
  const renderSinglePayModal = () => {
    return (
      <DetailPayModal
        data={curBill}
        detail={detail}
        visible={singlePayVis}
        onCancel={onCancelPayModal}
        dispatch={dispatch}
      />
    );
  };

  // 付款状态弹窗
  const renderPaymentStateModal = () => {
    return (
      <PaymentStateModal
        title="确认付款信息"
        visible={payStateVis}
        onCancel={() => setPayStateVis(false)}
      />
    );
  };

  // button
  const renderBut = () => {
    const invoiceList = _.uniqWith(billList.filter(b => b.invoice_title).map(i => i.invoice_title), _.isEqual);

    return (
      <div className={style['wallet-pay-detail-payee-btn-wrap']}>
        <Button
          type={checkInvoice === 'all' ? 'primary' : null}
          className={style['wallet-pay-detail-payee-btn']}
          onClick={() => setCheckInvoice('all')}
        >全部</Button>
        {
          invoiceList.map(i => (
            <Button
              type={checkInvoice === i ? 'primary' : null}
              onClick={() => setCheckInvoice(i)}
              key={i}
              className={style['wallet-pay-detail-payee-btn']}
            >{i}</Button>
          ))
        }
      </div>
    );
  };

  // dataSource
  let dataSource = [];
  if (checkInvoice === 'all') {
    dataSource = billList;
  } else {
    dataSource = billList.filter(b => b.invoice_title === checkInvoice);
  }

  // 获取表头的宽度
  const columnsWidth = columns.map(v => v.width);
  const scrollX = columnsWidth.reduce((x, y) => x + y);
  return (
    <CoreContent title={<span className={style['wallet-bill-content-title']}>收款人信息</span>}>
      {renderBut()}
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: scrollX }}
        bordered
        pagination={false}
      />
      {renderSinglePayModal()}
      {renderPaymentStateModal()}
    </CoreContent>
  );
};

export default Approval;

