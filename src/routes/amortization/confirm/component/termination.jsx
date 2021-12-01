/**
 * 摊销管理 - 摊销确认表 - 终止modal
 */
import { connect } from 'dva';
import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Radio,
  InputNumber,
} from 'antd';
import {
  CoreForm,
} from '../../../../components/core';
import {
  Unit,
  AmortizationSurplusMoneyGreditWay,
} from '../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const Termination = ({
  dispatch,
  visible,
  onCancel,
  curAmotization = {}, // 当前操作的摊销数据
}) => {
  const [form] = Form.useForm();

  // button loading
  const [isLoading, setIsLoading] = useState(false);

  const {
    unallocation_money: surplusMoney = 0, // 剩余摊销金额
  } = curAmotization;

  // 隐藏弹窗
  const onCancelModal = (isReset) => {
    form.resetFields();
    onCancel && onCancel(isReset);
  };

  // 提交
  const onSubmit = async () => {
    const values = await form.validateFields();

    setIsLoading(true);

    const res = await dispatch({
      type: 'costAmortization/onTerminationAmortization',
      payload: {
        ...values,
        id: curAmotization._id, // 摊销id
      },
    });
    if (res && res.zh_message) {
      setIsLoading(false);
      return message.error(res.zh_message);
    }

    if (res && res.result) {
      setIsLoading(false);
      message.success('请求成功');
      // 隐藏表单
      onCancelModal(true);
    }
  };

  // form
  const renderForm = () => {
    const items = [
      <Form.Item
        label="剩余摊销金额计入方式"
        name="creditWay"
        {...formLayout}
      >
        <Radio.Group>
          <Radio
            value={AmortizationSurplusMoneyGreditWay.allGredit}
          >{AmortizationSurplusMoneyGreditWay.description(AmortizationSurplusMoneyGreditWay.allGredit)}</Radio>
          <Radio
            value={AmortizationSurplusMoneyGreditWay.notGredit}
          >{AmortizationSurplusMoneyGreditWay.description(AmortizationSurplusMoneyGreditWay.notGredit)}</Radio>
          <Radio
            value={AmortizationSurplusMoneyGreditWay.sectionGredit}
          >{AmortizationSurplusMoneyGreditWay.description(AmortizationSurplusMoneyGreditWay.sectionGredit)}</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        key="creditMoneyFormWrap"
        shouldUpdate={(prevVal, curVal) => prevVal.creditWay !== curVal.creditWay}
      >
        {
          ({ getFieldValue }) => {
            const way = getFieldValue('creditWay');
            if (way === AmortizationSurplusMoneyGreditWay.sectionGredit) {
              return (
                <Form.Item
                  name="money"
                  label="计入金额"
                  rules={[
                    { required: true, message: '请输入' },
                  ]}
                  {...formLayout}
                >
                  <InputNumber
                    precision={2}
                    min={0}
                    placeholder="请输入"
                    formatter={v => Unit.limitMaxDecimals(v, Unit.exchangePriceToYuan(surplusMoney))}
                    parser={v => Unit.limitMaxDecimals(v, Unit.exchangePriceToYuan(surplusMoney))}
                    max={surplusMoney ? Unit.exchangePriceToYuan(surplusMoney) : undefined}
                  />
                </Form.Item>
              );
            }
          }
        }
      </Form.Item>,
    ];

    const initialValues = {
      creditWay: AmortizationSurplusMoneyGreditWay.allGredit, // 计入方式
      money: surplusMoney ? Unit.exchangePriceToYuan(surplusMoney) : undefined, // 剩余摊销金额
    };

    return (
      <Form form={form} initialValues={initialValues} className="affairs-flow-basic">
        <CoreForm items={items} cols={1} />
      </Form>
    );
  };

  // modal
  const renderModal = () => {
    return (
      <Modal
        visible={visible}
        title="终止"
        confirmLoading={isLoading}
        onOk={onSubmit}
        onCancel={() => onCancelModal(false)}
        // width="70%"
      >
        {renderForm()}
        <div>操作「终止」费用将计入未封板财报当期，请谨慎操作</div>
      </Modal>
    );
  };

  return renderModal();
};

export default connect()(Termination);
