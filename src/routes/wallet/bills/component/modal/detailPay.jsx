/**
 * 趣活钱包 - 支付账单 - 账单详情 - 付款弹窗
 */
import dot from 'dot-prop';
import React from 'react';
import {
  Modal,
  Form,
} from 'antd';
import {
  Unit,
} from '../../../../../application/define';
// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const BillDetailPay = ({
  visible,
  onCancel,
  data = {}, // 账单收款人信息
  detail = {}, // 账单详情
  dispatch,
}) => {
  const { _id: id, ref_id: refId } = detail;
  // onOk
  const onOk = async () => {
    // 账单明细id
    const { _id: detailId } = data;
    const res = await dispatch({
      type: 'wallet/onPayBill',
      payload: { billDetailIds: [detailId] },
    });

    if (res && res.ok) {
      onCancel && onCancel(res);
    }
  };

  return (
    <Modal
      title="确认付款信息"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form className="affairs-flow-node-time-line-form">
        <Form.Item label="账单编号" {...formLayout}>
          {id || '--'}
        </Form.Item>
        <Form.Item label="关联审批单号" {...formLayout}>
          {refId || '--'}
        </Form.Item>
        <Form.Item label="收款人姓名" {...formLayout}>
          {dot.get(data, 'payee_name', '--')}
        </Form.Item>
        <Form.Item label="收款人所属费用单号" {...formLayout}>
          {dot.get(data, 'ref_id', '--')}
        </Form.Item>
        <Form.Item label="科目" {...formLayout}>
          {dot.get(data, 'cost_accounting_name', '--')}
        </Form.Item>
        <Form.Item label="发票抬头" {...formLayout}>
          {dot.get(data, 'invoice_title', '--')}
        </Form.Item>
        <Form.Item label="付款金额" {...formLayout}>
          ￥{Unit.exchangePriceCentToMathFormat(dot.get(data, 'total_money', 0))}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BillDetailPay;
