/**
 * code提报弹窗
 */
import React from 'react';
import moment from 'moment';
import {
  Modal,
  Button,
  Form,
  Radio,
} from 'antd';
import { authorize } from '../../../application';

import style from './style.less';

const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } };

const ReportModal = ({
  visible,
  setVisble,
  onCreateOrder, // 重新创建审批单
  onUpdateOrder, // 编辑保存的审批单
}) => {
  const [form] = Form.useForm();
  // 创建新的审批单
  const onCreate = async () => {
    const formVals = await form.validateFields();
    if (formVals && formVals.prompt) {
      authorize.prompt = {
        value: formVals.prompt,
        date: new Date(),
        employee_id: authorize.account.id,
      };
    }
    onCreateOrder && onCreateOrder();
  };

  // 编辑保存的审批单
  const onUpdate = async () => {
    const formVals = await form.validateFields();
    if (formVals && formVals.prompt) {
      authorize.prompt = {
        value: formVals.prompt,
        date: new Date(),
        employee_id: authorize.account.id,
      };
    }
    onUpdateOrder && onUpdateOrder();
  };

  // 是否显示提示
  const isShowPrompt = () => {
    const {
      value,
      date,
      employee_id: employeeId,
    } = authorize.prompt;
    const {
      id,
    } = authorize.account;

    if (!authorize.prompt
      || !value
      || !date
      || !employeeId
      || id !== employeeId
    ) return true;

    if (value === 1 && moment(new Date()).diff(moment(date), 'days') >= 1) {
      return true;
    }
    if (value === 2 && moment(new Date()).diff(moment(date), 'days') >= 7) {
      return true;
    }
    return false;
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={() => setVisble(false)}
    >
      <div
        className={style['code-report-modal-title']}
      >您之前保存过此链接的审批单，是否直接打开进行编辑？</div>
      {
        isShowPrompt() ?
          (
            <Form
              form={form}
              className="affairs-flow-basic"
            >
              <Form.Item
                name="prompt"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
                {...formLayout}
              >
                <Radio.Group>
                  <Radio value={1}>今日不再提示</Radio>
                  <Radio value={2}>七天内不再提示</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          ) : ''
      }
      <div
        className={style['code-report-modal-btn-wrap']}
      >
        <Button onClick={onCreate}>重新创建审批单</Button>
        <Button type="primary" onClick={onUpdate}>编辑保存的审批单</Button>
      </div>
    </Modal>
  );
};

export default ReportModal;
