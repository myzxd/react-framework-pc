/*
 * 审批管理 - 基础设置 - 付款审批 - 打验票标签
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { Checkbox, Modal, Button, Form, message } from 'antd';

const AddTicketTag = (props) => {
  const {
    dispatch,
    ticketTags = {},
    orderId = undefined,
    orderRecordId = undefined,
    orderDetail = {}, // 审批单详情
  } = props;
  // 标签列表
  const { inspectBillLabelList = [] } = orderDetail;
  const defaultValue = inspectBillLabelList.map(i => i._id);

  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const payload = { page: 1, limit: 9999 };

    visible && dispatch({ type: 'ticketTag/getTicketTags', payload });
  }, [dispatch, visible]);

  useEffect(() => {
    form.setFieldsValue({ tags: [...defaultValue] });
  }, [orderDetail, defaultValue, form]);

  const { data = [] } = ticketTags;

  const onCancel = () => {
    setVisible(false);
    form.setFieldsValue({ tags: [...defaultValue] });
  };

  // submit
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({ type: 'ticketTag/setOrderTicket', payload: { ...formRes, orderRecordId, orderId } });
    if (res && res.ok) {
      message.success('请求成功');
      setVisible(false);
      // 获取审批单详情
      dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId, flag: true } });
      // 重置验票标签
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // modal
  const renderModal = () => {
    if (!visible) return;

    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };

    const options = data.map((tag) => {
      const { _id: id, name } = tag;
      return { label: name, value: id };
    });

    return (
      <Modal
        title="打验票标签"
        visible={visible}
        onOk={onSubmit}
        okText="保存"
        onCancel={() => onCancel()}
        destroyOnClose
      >
        <Form {...layout} form={form} initialValues={{ tags: [...defaultValue] }}>
          <Form.Item name="tags" label="" rules={[{ required: true, message: '请选择' }]}>
            <Checkbox.Group style={{ margin: '5px 5px' }} options={options} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div>
      {renderModal()}
      <Button onClick={() => setVisible(true)}>打验票标签</Button>
    </div>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(AddTicketTag);
