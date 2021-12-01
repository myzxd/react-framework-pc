/**
 * code - 基本设置 - 付款规则
 */
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Radio,
  Select,
  Button,
  message,
} from 'antd';
import {
  CoreForm,
} from '../../../../components/core';

import {
  ExpenseExamineFlowAmountAdjust,
} from '../../../../application/define';
import Operate from '../../../../application/define/operate';

const { Option } = Select;

const PaymentRule = ({
  dispatch,
  codePaymentRule = {}, // code付款规则
}) => {
  const [form] = Form.useForm();
  // 操作类型，是否为编辑状态
  const [isUpdate, setIsUpdate] = useState(false);
  // button loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'codeFlow/getCodePaymentRule',
      payload: {},
    });

    return () => {
      dispatch({ type: 'codeFlow/resetCodePaymentRule' });
    };
  }, [dispatch]);

  // 保存
  const onSave = async () => {
    const values = await form.validateFields();
    setIsLoading(true);
    const res = await dispatch({
      type: 'codeFlow/onUpdatePaymentRule',
      payload: { ...values },
    });

    if (res && res._id) {
      // 重置为详情状态
      setIsUpdate(false);

      // 重新获取付款规则
      dispatch({
        type: 'codeFlow/getCodePaymentRule',
        payload: {},
      });
    }

    setIsLoading(false);
    if (res && res.zh_message) {
      return message.error(res.zh_message);
    }
  };

  // 付款规则详情
  const renderRuleDetail = () => {
    if (isUpdate) return;
    const {
      allow_update_money: isAdjustment = false, // 是否允许调整
      cost_update_rule: adjustWay = ExpenseExamineFlowAmountAdjust.down, // 调整规则
    } = codePaymentRule;

    const items = [
      <Form.Item
        label="付款节点是否允许调整金额"
      >
        {isAdjustment ? '是' : '否'}
      </Form.Item>,
    ];

    isAdjustment && (
      items[items.length] = (
        <Form.Item
          label="调整规则"
        >
          {
            adjustWay ?
              ExpenseExamineFlowAmountAdjust.description(adjustWay)
              : '--'
          }
        </Form.Item>
      )
    );

    return (
      <Form
        className="affairs-flow-basic"
      >
        <CoreForm items={items} cols={3} />
      </Form>
    );
  };

  // 编辑付款规则
  const renderRuleForm = () => {
    if (!isUpdate) return;
    const {
      allow_update_money: allowUpdateMoney = false, // 是否允许调整
      cost_update_rule: adjustWay = ExpenseExamineFlowAmountAdjust.down, // 调整规则
    } = codePaymentRule;

    const items = [
      <Form.Item
        label="付款节点是否允许调整金额"
        name="isAdjustment"
      >
        <Radio.Group>
          <Radio.Button
            value
          >是</Radio.Button>
          <Radio.Button
            value={false}
          >否</Radio.Button>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        key="adjust_way_wrap"
        shouldUpdate={(prevVal, curVal) => prevVal.isAdjustment !== curVal.isAdjustment}
      >
        {
          ({ getFieldValue }) => {
            const isAdjustment = getFieldValue('isAdjustment');
            if (isAdjustment) {
              return (
                <Form.Item
                  name="adjustWay"
                  label="调整规则"
                  rules={[
                    { required: true, message: '请选择' },
                  ]}
                >
                  <Select
                    placeholder="请选择"
                    allowClear
                  >
                    <Option
                      value={ExpenseExamineFlowAmountAdjust.down}
                    >
                      {ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.down)}
                    </Option>
                    {/*
                    <Option
                      value={ExpenseExamineFlowAmountAdjust.upward}
                    >
                      {ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.upward)}
                    </Option>
                   <Option
                      value={ExpenseExamineFlowAmountAdjust.any}
                    >
                      {ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.any)}
                    </Option>
                    */}
                  </Select>
                </Form.Item>
              );
            }
          }
        }
      </Form.Item>,
    ];

    const initialValues = {
      isAdjustment: allowUpdateMoney,
      adjustWay: adjustWay ? adjustWay : ExpenseExamineFlowAmountAdjust.down,
    };

    return (
      <Form
        form={form}
        className="affairs-flow-basic"
        initialValues={initialValues}
      >
        <CoreForm items={items} cols={3} />
      </Form>
    );
  };

  // 操作
  const renderOperate = () => {
    if (Operate.canOperateCodePaymentRuleUpdate()) {
      return (
        <div style={{ textAlign: 'center' }}>
          {
            isUpdate ?
              <Button onClick={onSave} type="primary" loading={isLoading}>保存</Button>
              : <Button onClick={() => setIsUpdate(true)} type="primary">编辑</Button>
          }
        </div>
      );
    }
    return '';
  };

  return (
    <React.Fragment>
      {/* 详情 */}
      {renderRuleDetail()}
      {/* 编辑 */}
      {renderRuleForm()}
      {/* 操作 */}
      {renderOperate()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeFlow: { codePaymentRule },
}) => {
  return { codePaymentRule };
};

export default connect(mapStateToProps)(PaymentRule);
