/**
 * code - 审批单 - 标记付款审批
 */
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
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
import AlternativedTextBox from '../../../../expense/components/alternativedTextBox';
import CommonTab from '../../../../expense/manage/examineOrder/detail/commonTab';
import PayeeTable from '../../../../expense/manage/examineOrder/detail/components/payeeTable';

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

const Consent = ({
  dispatch,
  approveOrderDetail = {}, // 审批单详情
  className,
}) => {
  const {
    _id: orderId, // 审批单id
    payee_list: initPayeeList = [], // 付款明细list
    // paid_money: paidMoney, // 付款金额
    plugin_extra_meta: pluginExtraMeta = {}, // 外部审批单标识
    payment_total_money: paidMoney, // 付款金额
  } = approveOrderDetail;

  const [form] = Form.useForm();
  // modal visible
  const [modalVis, setModalVis] = useState(false);
  // tab key
  const [tabKey, setTabKey] = useState(Alternatives.finance);
  // 付款明细
  const [payeeList, setPayeeList] = useState(initPayeeList);
  // button loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPayeeList(initPayeeList);
  }, [initPayeeList]);

  // 标记付款操作
  const onOk = async () => {
    const vals = await form.validateFields();
    await setIsLoading(true);
    const res = await dispatch({
      type: 'codeOrder/markApproveOrderPayDone',
      payload: {
        orderId,
        ...vals,
        payeeList: dot.get(pluginExtraMeta, 'is_plugin_order', false) ? [] : payeeList,
      },
    });
    if (res && res._id) {
      message.success('请求成功');

      // 重新获取审批单详情
      dispatch({
        type: 'codeOrder/getApproveOrderDetail',
        payload: { orderId },
      });

      // 隐藏弹窗
      setModalVis(false);
    } else {
      res.zh_message && message.error(res.zh_message);
    }

    setIsLoading(false);
  };

  // tab onChange
  const onChangeTab = (v) => {
    setTabKey(v);
    form.resetFields();
  };

  // 修改付款明细
  const onChangePayeeList = (e, payeeId) => {
    const curPayList = payeeList.map((p) => {
      if (p._id === payeeId) {
        return { ...p, payee_type: e.target.value };
      }

      return p;
    });
    setPayeeList(curPayList);
  };

  // modal
  const renderModal = () => {
    const alternativeKey = tabKey || Alternatives.finance;

    // 付款明细props
    const payeeTableProps = {
      dataSource: payeeList,
      money: paidMoney,
      pluginMoney: paidMoney,
      onChangepayeeList: onChangePayeeList,
      isPaymentNode: true,
      isPluginOrder: dot.get(pluginExtraMeta, 'is_plugin_order', false),
    };

    return (
      <Modal
        title="标记付款"
        visible={modalVis}
        onOk={onOk}
        onCancel={() => setModalVis(false)}
      >
        <CommonTab
          activeKey={alternativeKey}
          onChange={onChangeTab}
        />
        <PayeeTable {...payeeTableProps} />
        <Form
          form={form}
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
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <Button
        loading={isLoading}
        type="primary"
        onClick={() => setModalVis(true)}
        className={className}
      >标记付款</Button>
    </React.Fragment>
  );
};

export default Consent;
