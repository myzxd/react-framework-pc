/*
 * 审批管理 - 基础设置 - 付款审批 - 验票异常
 */
import React, { useState } from 'react';
import { connect } from 'dva';

import { Input, Modal, Button, Form, message } from 'antd';

const { TextArea } = Input;

const TicketAbnormal = (props) => {
  const { dispatch, orderId = undefined, orderRecordId = undefined } = props;
  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);

  // submit
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({ type: 'ticketTag/setAbnormalTicket', payload: { ...formRes, orderId, orderRecordId } });
    if (res && res.ok) {
      message.success('请求成功');
      setVisible(false);
      form.resetFields();

      dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId, flag: true } });
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
        <Form {...layout} form={form}>
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
    <div>
      {renderModal()}
      <Button onClick={() => setVisible(true)}>验票异常</Button>
    </div>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(TicketAbnormal);
