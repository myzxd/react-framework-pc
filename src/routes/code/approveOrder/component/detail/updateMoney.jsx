/*
* code - 基础设置 - 表格组件 - 新建审批流弹窗
 */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  message,
  InputNumber,
  Radio,
  Table,
} from 'antd';
import {
  Unit,
  ExpenseCollectionType,
  ExpenseExamineFlowAmountAdjust,
} from '../../../../../application/define';
import {
  system,
} from '../../../../../application';
import style from '../style.less';

const systemIdentifierFlag = system.isEnablExpenseCollectionPayeeType();

const UpdateMoney = ({
  dispatch,
  visible,
  onCancel,
  detail = {}, // 费用单详情
  approveOrderDetail = {}, // 审批单详情
}) => {
  const {
    payment_total_money: paymentTotalMoney = 0, // 付款金额
    payee_list: payeeList = [], // 付款明细
    total_money: totalMoney, // 提报金额
    cost_update_rule: costUpdateRule, // 金额调控规则
  } = detail;

  const [form] = Form.useForm();
  // loading
  const [isLoading, setIsLoading] = useState(false);

  // 付款金额
  const [payMoney, setPayMoney] = useState(paymentTotalMoney);

  useEffect(() => {
    if (detail && Object.keys(detail).length > 0) {
      setPayMoney(detail.payment_total_money);
    }
  }, [detail]);

  // 金额onChange
  const onChangeMoney = () => {
    // 收款信息ids，form name
    const payeeIds = payeeList.map(p => p._id);
    // 获取所有表单值
    const values = form.getFieldsValue([...payeeIds]);
    const objValue = Object.values(values);
    // 计算金额
    const money = objValue.reduce((ac, cr) => ac + cr.money, 0);
    // 设置付款金额
    setPayMoney(money * 100);
  };

  // onOk
  const onOk = async () => {
    const vals = await form.validateFields();
    await setIsLoading(true);

    // 金额form value数组
    const moneyVals = Object.values(vals).map(v => v.money);
    // 金额汇总
    const money = moneyVals.reduce((rc, cr) => rc + cr, 0);
    // money * 100 之后只保存小数点后六位 经产品确认过
    const newMoney = (money * 100).toFixed(6);
    // 向下调整
    if (costUpdateRule === ExpenseExamineFlowAmountAdjust.down
      && newMoney > totalMoney
    ) {
      setIsLoading(false);
      return message.error('付款金额不能大于提报金额');
    }

    const res = await dispatch({
      type: 'codeOrder/onUpdateOrderMoney',
      payload: {
        orderId: approveOrderDetail._id, // 审批单id
        costOrderId: detail._id, // 费用单id
        payeeList: vals, // 付款明细
      },
    });

    if (res && res._id) {
      message.success('请求成功');

      // 费用单list
      dispatch({
        type: 'codeOrder/getCostOrderList',
        payload: { orderId: approveOrderDetail._id },
      });

      await dispatch({
        type: 'codeOrder/reduceOrderCostItem',
        payload: { namespace: detail._id, result: {} },
      });

      // 重新获取审批单详情
      dispatch({
        type: 'codeOrder/getApproveOrderDetail',
        payload: { orderId: approveOrderDetail._id },
      });

      // 费用单详情
      await dispatch({
        type: 'codeOrder/fetchOrderCostItem',
        payload: {
          id: detail._id,
          orderId: approveOrderDetail._id,
          namespace: detail._id,
        },
      });

      setIsLoading(false);

      // 隐藏弹窗
      onCancelModal();
    } else {
      setIsLoading(false);

      res && res.zh_message && message.error(res.zh_message);
    }
  };

  // onCancel
  const onCancelModal = () => {
    // 重置button loading状态
    setIsLoading(false);
    // 重置表单
    form.resetFields();

    onCancel && onCancel();
  };

  // table
  const renderContent = () => {
    const columns = [
      {
        title: '收款人',
        dataIndex: 'card_name',
        width: 150,
        render: (text, record) => {
          if (text) {
            return `${text} ${record.card_phone ? `(${record.card_phone})` : ''}`;
          }
          return '--';
        },
      },
      {
        title: '银行卡号',
        dataIndex: 'card_num',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '开户支行',
        dataIndex: 'bank_details',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '收款方式',
        dataIndex: 'payee_type',
        width: 100,
        render: (_, rec) => {
          return (
            <Form.Item
              name={[[rec._id], 'payee_type']}
            >
              <Radio.Group>
                <Radio
                  value={ExpenseCollectionType.onlineBanking}
                >
                  {ExpenseCollectionType.description(ExpenseCollectionType.onlineBanking)}
                </Radio>
                {
                  systemIdentifierFlag && (
                    <Radio
                      value={ExpenseCollectionType.wallet}
                      disabled={!rec.payee_employee_id}
                    >
                      {ExpenseCollectionType.description(ExpenseCollectionType.wallet)}
                    </Radio>
                  )
                }
              </Radio.Group>
            </Form.Item>
          );
        },
      },
      {
        title: '金额',
        dataIndex: 'money',
        width: 100,
        render: (_, rec) => {
          return (
            <Form.Item
              name={[[rec._id], 'money']}
              rules={[
                { required: true, message: '请输入' },
                { type: 'number', min: 0.01, message: '金额不能为0' },
              ]}
            >
              <InputNumber
                precision={2}
                min={0.01}
                placeholder="请填写金额"
                formatter={Unit.limitDecimalsFormatter}
                parser={Unit.limitDecimalsParser}
                onChange={onChangeMoney}
              />
            </Form.Item>
          );
        },
      },
    ];

    return (
      <Table
        bordered
        columns={columns}
        pagination={false}
        dataSource={payeeList}
        rowKey={(rec, key) => rec._id || key}
        scroll={{ y: 400 }}
      />
    );
  };

  // 弹窗
  const renderModal = () => {
    const initialValues = {};
    payeeList.forEach((d) => {
      initialValues[d._id] = {
        payee_type: d.payee_type || undefined,
        money: d.money ? Unit.exchangePriceToYuan(d.money) : undefined,
      };
    });

    return (
      <Modal
        title="修改金额"
        visible={visible}
        onOk={onOk}
        width={750}
        onCancel={onCancelModal}
        confirmLoading={isLoading}
      >
        <span className={style['code-order-cost-header-money-modal']}>
          <span className={style['code-order-cost-header-tax']}>
            <span
              className={style['code-order-cost-header-money-text']}
            >提报金额：</span>
            <span>{Unit.exchangePriceCentToMathFormat(totalMoney)}元</span>
          </span>
          <span className={style['code-order-cost-header-tax']}>
            <span
              className={style['code-order-cost-header-money-text']}
            >付款金额：</span>
            <span>{Unit.exchangePriceCentToMathFormat(payMoney)}元</span>
          </span>
        </span>
        <Form
          form={form}
          initialValues={initialValues}
          className="affairs-flow-basic"
        >
          {renderContent()}
        </Form>
      </Modal>
    );
  };

  return renderModal();
};

export default UpdateMoney;
