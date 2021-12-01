/**
 * Code/Team审批管理 - 付款类型配置管理 - 添加链接弹窗
 */
import React, { useEffect } from 'react';
import {
  Form,
  Input,
  message,
  Button,
} from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';

import {
  CoreForm,
} from '../../../../../components/core';

const { TextArea } = Input;

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const UpdateMatter = ({
  visible,
  onClose,
  dispatch,
  data = {}, // 事项详情
  matterId, // 事项id
}) => {
  const [form] = Form.useForm();

  // onOk
  const onOk = async () => {
    const vals = await form.validateFields();
    const res = await dispatch({
      type: 'codeMatter/updateMatter',
      payload: { ...vals, matterId },
    });

    if (res && res._id) {
      message.success('请求成功');
      onClose && onClose(res._id);
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: data.name,
        note: data.note,
      });
    }
  }, [visible]);
  // initialValues
  const initialValues = {
    name: data.name,
    note: data.note,
  };

  // form item
  const renderForm = () => {
    const formItems = [
      <Form.Item
        label="菜单名称"
        name="name"
        {...formLayout}
        rules={[
          { required: true, message: '请输入' },
          { pattern: /^\S+$/, message: '菜单名称不能包含空格' },
        ]}
      >
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
      <Form.Item
        label="说明"
        name="note"
        className="code-flow-link-textArea"
        {...formLayout}
      >
        <TextArea allowClear placeholder="请输入" rows={4} />
      </Form.Item>,
    ];

    return (
      <Form
        form={form}
        className="affairs-flow-basic"
        initialValues={initialValues}
      >
        <CoreForm items={formItems} cols={1} />
      </Form>
    );
  };

  // footer
  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => onClose()}
        >取消</Button>
        <Button
          onClick={() => onOk()}
          type="primary"
          style={{ marginLeft: 10 }}
        >确定</Button>
      </div>
    );
  };

  return (
    <Drawer
      title="编辑菜单"
      visible={visible}
      onClose={onClose}
      width={400}
      footer={renderFooter()}
    >
      {renderForm()}
    </Drawer>
  );
};

export default UpdateMatter;
