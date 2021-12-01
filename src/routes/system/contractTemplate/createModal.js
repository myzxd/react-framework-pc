/**
 *  合同模版管理 - 创建弹框
 */
import { connect } from 'dva';
import React, { useState } from 'react';
import { Form, Modal, Input } from 'antd';

import { CoreForm } from '../../../components/core';

function CreateModal(props) {
  const { dispatch, visible } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();


  // 关闭弹框，重置数据
  const onCancel = () => {
    form.resetFields();
    setLoading(false);
    props.onCancel && props.onCancel();
  };

  const onOk = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'systemContractTemplate/createContractTemplates',
        payload: {
          ...values,
          onLoading: () => {
            setLoading(false);
          },
          onSuccessCallback: () => {
            onCancel();
            props.onSuccessCallback && props.onSuccessCallback();
          },
        },
      });
    });
  };

  const renderForm = () => {
    const formItems = [
      <Form.Item
        label="合同模板编码"
        name="code"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
    ];
    return <CoreForm items={formItems} cols={1} />;
  };

  return (
    <Form form={form}>
      <Modal
        title="新增合同模板"
        visible={visible}
        confirmLoading={loading}
        onOk={onOk}
        onCancel={onCancel}
      >
        {renderForm()}
      </Modal>
    </Form>
  );
}

export default connect()(CreateModal);
