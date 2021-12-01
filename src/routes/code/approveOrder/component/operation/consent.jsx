/**
 * code - 审批单 - 同意审批
 */
import React, { useState } from 'react';
import {
  Button,
  message,
  Modal,
  Form,
} from 'antd';

import {
  // ExpenseExamineOrderPaymentState,
  Alternatives,
} from '../../../../../application/define';
import { dotOptimal } from '../../../../../application/utils';
import AlternativedTextBox from '../../../../expense/components/alternativedTextBox';
import CommonTab from '../../../../expense/manage/examineOrder/detail/commonTab';
import BookMonth from './bookMonth';

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

const Consent = ({
  dispatch,
  className,
  ccInfo, // 灵活抄送信息
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录详情
}) => {
  const [form] = Form.useForm();

  // modal visible
  const [modalVis, setModalVis] = useState(false);
  // tab key
  const [tabKey, setTabKey] = useState(Alternatives.often);
  // button loading
  const [loading, setLoading] = useState(false);

  // 付款状态
  const {
    _id: orderId, // 审批单id
    isPaymentNode = true,
    belong_month: belongMonth, // 记账月份
  } = approveOrderDetail;

  // 流转记录id
  const {
    _id: recordId,
    handle_list: handleList = [], // 是否可操作记账月份
  } = recordDetail;

  // 同意操作
  const onOk = async () => {
    const vals = await form.validateFields();
    setLoading(true);

    const res = await dispatch({
      type: 'codeOrder/agreeApproveOrder',
      payload: {
        orderId,
        recordId,
        ...vals,
        flexibleDep: dotOptimal(ccInfo, 'flexibleDep', undefined),
        flexibleUser: dotOptimal(ccInfo, 'flexibleUser', undefined),
      },
    });

    if (res && res._id) {
      message.success('请求成功');
      dispatch({
        type: 'codeOrder/getApproveOrderDetail',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/getCostOrderList',
        payload: { orderId },
      });
      setLoading(false);
      // 隐藏弹窗
      setModalVis(false);
      // window.location.href = '/#/Code/PayOrder';
    } else {
      setLoading(false);
      res.zh_message && message.error(res.zh_message);
    }
  };

  // tab onChange
  const onChangeTab = (v) => {
    setTabKey(v);
    form.resetFields();
  };

  // modal
  const renderModal = () => {
    const defaultActiveKey = isPaymentNode ? Alternatives.finance : Alternatives.often;  // tab状态
    const alternativeKey = tabKey || defaultActiveKey;

    // initialValues
    const initialValues = {
      belongTime: belongMonth ? belongMonth : 0,
    };

    return (
      <Modal
        title="同意"
        visible={modalVis}
        onOk={onOk}
        confirmLoading={loading}
        onCancel={() => setModalVis(false)}
      >
        <CommonTab
          activeKey={alternativeKey}
          onChange={onChangeTab}
        />
        <Form
          form={form}
          initialValues={initialValues}
          className="affairs-flow-basic"
        >
          <Form.Item
            label="意见"
            name="note"
            rules={[
              { max: 1000, message: '意见的最大长度不能超过1000' },
            ]}
            {...formLayout}
          >
            <AlternativedTextBox
              alternatives={Alternatives.conversionData(alternativeKey)}
              placeholder="请输入意见"
              rows={4}
            />
          </Form.Item>
          {
            Array.isArray(handleList) && handleList.includes('edit_belong_month') ?
              (
                <Form.Item
                  label="记账月份"
                  name="belongTime"
                  rules={[
                    { required: true, message: '请选择记账月份' },
                  ]}
                  {...formLayout}
                >
                  <BookMonth orderId={orderId} />
                </Form.Item>
              ) : ''
          }
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <Button
        type="primary"
        onClick={() => setModalVis(true)}
        className={className}
      >同意</Button>
    </React.Fragment>
  );
};

export default Consent;
