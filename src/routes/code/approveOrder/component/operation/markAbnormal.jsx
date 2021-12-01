/**
 * code - 审批单 - 标记异常审批
 */
import React, { useState } from 'react';
import {
  Button,
  Form,
  Modal,
  message,
  Input,
} from 'antd';
import {
  CodeApproveOrderPayState,
} from '../../../../../application/define';

const { TextArea } = Input;

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

const MarkAbnormal = ({
  dispatch,
  approveOrderDetail = {}, // 审批单详情
  className,
}) => {
  const [form] = Form.useForm();
  // visible
  const [visible, setVisible] = useState(false);

  // 审批单id
  const { _id: orderId } = approveOrderDetail;

  // 标记异常
  const onOk = async () => {
    const vals = await form.validateFields();
    const res = await dispatch({
      type: 'codeOrder/markApproveOrderAbnormal',
      payload: { orderId, ...vals },
    });

    if (res && res._id) {
      message.success('请求成功');

      // 重新获取审批单详情
      dispatch({
        type: 'codeOrder/getApproveOrderDetail',
        payload: { orderId },
      });

      // 隐藏弹窗
      setVisible(false);
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  // modal
  const renderModal = () => {
    return (
      <Modal
        title="暂不付款"
        visible={visible}
        onOk={onOk}
        onCancel={() => setVisible(false)}
      >
        <Form
          form={form}
          className="affairs-flow-basic"
        >
          <Form.Item
            label="付款状态"
            {...formLayout}
          >
            {CodeApproveOrderPayState.description(CodeApproveOrderPayState.abnormal)}
          </Form.Item>
          <Form.Item
            label="备注"
            name="note"
            rules={[
              { max: 1000, message: '备注的最大长度不能超过1000' },
            ]}
            {...formLayout}
          >
            <TextArea placeholder="请输入备注" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      <Button
        onClick={() => setVisible(true)}
        className={className}
      >暂不付款</Button>
      {renderModal()}
    </React.Fragment>
  );
};

export default MarkAbnormal;
