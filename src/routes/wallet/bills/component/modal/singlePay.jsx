/**
 * 趣活钱包 - 支付账单 - 付款弹窗（单账单）
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

const SinglePay = ({
  visible,
  onCancel,
  data = {}, // 账单信息
  dispatch,
}) => {
  const { _id: id } = data;
  // onOk
  const onOk = async () => {
    const res = await dispatch({
      type: 'wallet/onPayBill',
      payload: { billIds: [id] },
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
          {dot.get(data, '_id', '--')}
        </Form.Item>
        <Form.Item label="关联审批单号" {...formLayout}>
          {dot.get(data, 'ref_id', '--')}
        </Form.Item>
        <Form.Item label="审批单提报人" {...formLayout}>
          {dot.get(data, 'order_apply_info.name', '--')}
        </Form.Item>
        <Form.Item label="账单总金额" {...formLayout}>
          ￥{Unit.exchangePriceCentToMathFormat(dot.get(data, 'total_money', 0))}
        </Form.Item>
        <Form.Item label="付款金额" {...formLayout}>
          ￥{Unit.exchangePriceCentToMathFormat(dot.get(data, 'unpaid_money', 0))}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SinglePay;
