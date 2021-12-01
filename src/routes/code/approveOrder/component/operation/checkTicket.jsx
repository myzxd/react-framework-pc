/*
 * code - 审批单 -  完成验票
 */
import React, { useState } from 'react';

import { Alert, Input, Modal, Button, Form, message } from 'antd';

const { TextArea } = Input;

const CheckTicket = ({
  dispatch,
  className,
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录详情
}) => {
  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);
  const [checkError, setCheckError] = useState({});

  // 审批单id
  const { _id: orderId } = approveOrderDetail;
  // 流转记录id
  const { _id: recordId } = recordDetail;

  // 获取验票校验结果
  const setTicketCheck = async () => {
    const res = await dispatch({
      type: 'codeOrder/getTicketCheck',
      payload: { orderId, recordId },
    });

    if (res && res.err_msg) {
      setCheckError(res.err_msg);
      setVisible(true);
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // submit
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({
      type: 'codeOrder/markCostOrderBillDone',
      payload: { ...formRes, orderId, recordId },
    });
    if (res && res._id) {
      message.success('请求成功');
      form.resetFields();
      // 重置审批单流转记录
      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/getCostOrderList',
        payload: { orderId },
      });

      setVisible(false);
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
        title="完成验票"
        visible={visible}
        onOk={onSubmit}
        okText="确认验票"
        onCancel={() => setVisible(false)}
      >
        {
          checkError.map((i, key) => {
            return (
              <Alert
                key={key}
                showIcon
                closable
                message={i}
                type="error"
                style={{ margin: '10px 0' }}
              />);
          })
        }
        <Form
          {...layout}
          form={form}
          className="affairs-flow-basic"
        >
          <Form.Item name="note" label="验票说明意见">
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
        onClick={() => setTicketCheck()}
        className={className}
      >完成验票</Button>
    </React.Fragment>
  );
};

export default CheckTicket;
