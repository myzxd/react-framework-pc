/*
 * 审批管理 - 基础设置 - 付款审批 - 完成验票
 */
import React, { useState } from 'react';
import { connect } from 'dva';

import { Alert, Input, Modal, Button, Form, message } from 'antd';

const { TextArea } = Input;

const CheckTicket = (props) => {
  const { dispatch, orderId } = props;
  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);
  const [checkError, setCheckError] = useState({});

  // 获取验票校验结果
  const setTicketCheck = async () => {
    const res = await dispatch({ type: 'ticketTag/getTicketCheck', payload: { id: orderId } });
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
    const res = await dispatch({ type: 'ticketTag/checketTicket', payload: { ...formRes, id: orderId } });
    if (res && res.ok) {
      message.success('请求成功');
      form.resetFields();
      // 重置审批单详情
      dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId, flag: true } });
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
        <Form {...layout} form={form}>
          <Form.Item name="note" label="验票说明意见">
            <TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div>
      {renderModal()}
      <Button onClick={() => setTicketCheck()}>完成验票</Button>
    </div>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(CheckTicket);
