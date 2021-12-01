/**
* 审批管理 - 验票标签 - 新增标签
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, message } from 'antd';

const { TextArea } = Input;

const Createtag = ({
  visible,
  onCancel,
  dispatch,
}) => {
  const [form] = Form.useForm();

  // submit
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({ type: 'ticketTag/createTicketTag', payload: { ...formRes } });
    if (res && res.ok) {
      message.success('请求成功');
      onCancel && onCancel();
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

  return (
    <Modal
      title="新增验票标签"
      visible={visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Form {...layout} form={form}>
        <Form.Item name="name" label="验票标签名称" rules={[{ required: true, message: '请输入' }, { pattern: /^\S+$/, message: '验票标签名称不能包含空格' }]}>
          <Input allowClear placeholder="请输入标签名称" />
        </Form.Item>
        <Form.Item name="remarks" label="备注">
          <TextArea placeholder="请输入备注" rows={4} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

Createtag.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  dispatch: PropTypes.func,
};

Createtag.defaultProps = {
  visible: false,
  onCancel: () => {},
  dispatch: () => {},
};

export default Createtag;
