/**
 * 系统管理 - 意见反馈 - 处理弹窗
 */
import React, { useState } from 'react';
import moment from 'moment';
import {
  message,
  Modal,
  Form,
  DatePicker,
  Input,
} from 'antd';

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

const { TextArea } = Input;

const Consent = ({
  dispatch,
  visible,
  onCancel,
  feedBackId, // 意见id
}) => {
  const [form] = Form.useForm();
  // button loading
  const [loading, setLoading] = useState(false);

  // 同意操作
  const onOk = async () => {
    const vals = await form.validateFields();
    setLoading(true);

    const res = await dispatch({
      type: 'systemManage/setDealFeedBack',
      payload: { feedBackId, ...vals },
    });

    if (res && res.ok) {
      message.success('请求成功');

      // 获取意见列表
      dispatch({
        type: 'systemManage/getFeedBackList',
        payload: { page: 1, limit: 30 },
      });

      setLoading(false);
    } else {
      setLoading(false);
      res.zh_message && message.error(res.zh_message);
    }

    onCancel && onCancel();
  };

  // modal
  const renderModal = () => {
    // initialValues
    const initialValues = {
      handleAt: moment(),
    };

    return (
      <Modal
        title="处理"
        visible={visible}
        onOk={onOk}
        confirmLoading={loading}
        onCancel={() => onCancel()}
      >
        <Form
          form={form}
          initialValues={initialValues}
          className="affairs-flow-basic"
        >
          <Form.Item
            label="处理完成时间"
            name="handleAt"
            rules={[
              { required: true, message: '请选择' },
            ]}
            {...formLayout}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item
            label="处理备注"
            name="handleNote"
            {...formLayout}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return renderModal();
};

export default Consent;
