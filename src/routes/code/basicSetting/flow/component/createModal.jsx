/*
* code - 基础设置 - 表格组件 - 新建审批流弹窗
 */
import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  message,
} from 'antd';
import {
  CodeFlowType,
} from '../../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

const CreateModal = ({
  dispatch,
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  // onOk
  const onOk = async () => {
    const vals = await form.validateFields();
    const res = await dispatch({
      type: 'codeFlow/createFlow',
      payload: { ...vals },
    });

    if (res && res._id) {
      message.success('请求成功');
      window.location.href = `/#/Code/BasicSetting/Flow/Form?flowId=${res._id}`;
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  // 隐藏modal
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  // 弹窗
  const renderModal = () => {
    return (
      <Modal
        title="新建审批流"
        visible={visible}
        onOk={onOk}
        destroyOnClose
        onCancel={onCancel}
      >
        <Form
          form={form}
          preserve={false}
          className="affairs-flow-basic"
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              { required: true, message: '请输入审批流名称' },
              { pattern: /^\S+$/, message: '审批流名称不能包含空格' },
            ]}
            {...formLayout}
          >
            <Input placeholder="请输入审批流名称" />
          </Form.Item>
          <Form.Item
            label="审批流类型"
            {...formLayout}
          >
            {CodeFlowType.description(CodeFlowType.payment)}
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 操作
  const renderBtn = () => {
    return (
      <Button
        type="primary"
        onClick={() => setVisible(true)}
      >
        新增审批流
      </Button>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      {renderBtn()}
    </React.Fragment>
  );
};

export default CreateModal;
