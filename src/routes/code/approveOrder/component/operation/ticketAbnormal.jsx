/*
 * code - 审批单 -  验票异常
 */
import React, { useState } from 'react';

import { Input, Modal, Button, Form, message } from 'antd';

const { TextArea } = Input;

const TicketAbnormal = ({
  dispatch,
  className,
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录详情
}) => {
  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);

  // 审批单id
  const { _id: orderId } = approveOrderDetail;
  // 流转记录id
  const { _id: recordId } = recordDetail;

  // submit
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({
      type: 'codeOrder/markOrderBillAbnormal',
      payload: { ...formRes, orderId, recordId },
    });

    if (res && res._id) {
      message.success('请求成功');
      setVisible(false);
      form.resetFields();

      // 重新获取流转记录列表
      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // modal
  const renderModal = () => {
    if (!visible) return;

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

    return (
      <Modal
        title="验票异常"
        visible={visible}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
      >
        <Form
          {...layout}
          form={form}
          className="affairs-flow-basic"
        >
          <Form.Item name="state" label="验票状态">
            <div>异常</div>
          </Form.Item>
          <Form.Item name="note" label="异常说明">
            <TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <Button
        onClick={() => setVisible(true)}
        className={className}
      >验票异常</Button>
    </React.Fragment>
  );
};

export default TicketAbnormal;
