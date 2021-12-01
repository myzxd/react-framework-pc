/**
 * code - 审批单详情 - 流转记录 - 付款操作
 */
import React from 'react';
import {
  Row,
  Col,
} from 'antd';
import {
  // CodeApproveOrderPayState,
} from '../../../../../application/define';
import MarkAbnormal from './markAbnormal'; // 标记付款异常
import MarkPayment from './markPayment'; // 标记付款
import MarkNoPay from './markNoPay'; // 标记不付款
import style from '../style.less';

const PayOperation = ({
  dispatch,
  approveOrderDetail = {}, // 审批单详情
}) => {
  const {
    handle_list: handleList = [], // 可操作字段列表
    // paid_state: paidState, // 付款状态
  } = approveOrderDetail;

  // markAbnormal props
  const markAbnormalProps = {
    approveOrderDetail,
    dispatch,
    className: style['code-circulation-pay-operation'],
  };

  // markAbnormal props
  const markPaymentProps = {
    approveOrderDetail,
    dispatch,
    className: style['code-circulation-pay-operation'],
  };

  // markAbnormal props
  const markNoPayProps = {
    approveOrderDetail,
    dispatch,
    className: style['code-circulation-pay-operation'],
  };

  return (
    <Row className={style['code-circulation-pay-row']}>
      <Col span={15}>
        <span
          className={style['code-circulation-pay-title']}
        >付款方式</span>
      </Col>
      <Col span={8}>
        {/* 标记付款异常 */}
        {handleList.includes('no_pay') && (<MarkAbnormal {...markAbnormalProps} />)}
        {/* 标记未付款 */}
        {handleList.includes('no_need_pay') && (<MarkNoPay {...markNoPayProps} />)}
        {/* 标记付款 */}
        {handleList.includes('pay') && (<MarkPayment {...markPaymentProps} />)}
      </Col>
    </Row>
  );
};

export default PayOperation;
