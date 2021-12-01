/*
 * 审批管理 - 基础设置 - 付款审批 - 发票
 */
//  import is from 'is_js';
import React, { useState } from 'react';
import { connect } from 'dva';

import {
  Form,
  Input,
  Button,
  InputNumber,
  Radio,
  Select,
  Popconfirm,
  message,
  Row,
  Col,
} from 'antd';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import {
  Unit,
  ExpenseInvoiceType,
  ExpenseInvoiceTaxRate,
} from '../../../../../application/define';

import Operate from '../../../../../application/define/operate';

const { Option } = Select;

const Invoice = ({
  dispatch,
  cost = {},
  detail = {}, // 费用单详情
  examineOrderDetail = {}, // 审批单详情
  namespace,
}) => {
  // 系统审批操作权限
  const isSystemAuth = Operate.canOperateModuleCodeOrderDetail();
  const {
    _id: costOrderId, // 费用单id
    total_cost_bill_amount: totalCostBillAmount = 0, // 实时汇总发票总金额
    total_tax_amount_amount: totalTaxAmountAmount = 0, // 实时汇总发票总税额
    total_tax_deduction_amount: totalTaxDeductionAmount = 0, // 实时汇总发票总去税额
    cost_bill_list: costBillList = [], // 发票列表
  } = detail;

  const {
    is_bill_red_push: isBillRedPush = false, // 是否可以红冲
    is_add_cost_bill: isAddCostBill = false, // 是否可添加发票
  } = cost;

  // 是否存在专用发票
  const isAvt = (Array.isArray(costBillList) && costBillList.find(c => c.type === ExpenseInvoiceType.avt));

  const {
    _id: orderId, // 审批单id
   } = examineOrderDetail;

  const [form] = Form.useForm();
  // form visible
  const [formVisible, setFormVisible] = useState(false);

  // taxRate disabled
  const [rateDisabled, setRateDiabled] = useState(false);

  // taxRate option disabled
  const [rateZeroDiabled, setRateZeroDiabled] = useState(false);

  // tax disabled
  const [taxDisabled, setTaxDisabled] = useState(true);

  // tax money
  const [taxMoney, setTaxMoney] = useState(0);

  // layout
  const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

  // submit
  const onAdd = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({
      type: 'codeOrder/addCostOrderInvoice',
      payload: { ...formRes, costOrderId, orderId },
    });

    if (res && res._id) {
      dispatch({
        type: 'codeOrder/getCostOrderList',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/fetchOrderCostItem',
        payload: {
          id: cost._id,
          orderId,
          namespace,
        },
      });

      // hide form
      setFormVisible(false);
      // reset form
      form.resetFields();
    } else if (res && res.zh_message) {
      // set money
      message.error(res.zh_message);
    }
  };

  // submit
  const onCancelForm = () => {
    form.resetFields();
    setFormVisible(false);
  };

  // 红冲
  const onRedPunch = async () => {
    const res = await dispatch({
      type: 'codeOrder/pushRedCostOrder',
      payload: { costOrderId, orderId },
    });

    // 重新获取数据
    if (res && res._id) {
      message.success('请求成功');
      dispatch({
        type: 'codeOrder/getCostOrderList',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/fetchOrderCostItem',
        payload: {
          id: cost._id,
          orderId,
          namespace,
        },
      });

      dispatch({
        type: 'codeOrder/getApproveOrderDetail',
        payload: { orderId },
      });
    }
  };

  // type
  const onChangeType = (e) => {
    const val = e.target.value;
    const taxRate = form.getFieldValue('taxRate');
    const money = form.getFieldValue('money');

    // 普通发票
    if (val === ExpenseInvoiceType.ordinary) {
      money && (form.setFieldsValue({ tax: 0, noTax: money }));
      !money && (form.setFieldsValue({ tax: undefined, noTax: undefined }));

      form.setFieldsValue({ taxRate: ExpenseInvoiceTaxRate.zero });
      setRateDiabled(true);
      setRateZeroDiabled(false);
      setTaxDisabled(true);
    } else {
      money !== undefined && taxRate !== undefined && (
        form.setFieldsValue({
          tax: ((money / (1 + taxRate)) * taxRate).toFixed(2),
          noTax: (money - ((money / (1 + taxRate)) * taxRate)).toFixed(2),
        })
      );

      (!money || !taxRate) && (
        form.setFieldsValue({ tax: undefined, noTax: undefined })
      );

      // 增值税专用发票
      taxRate === ExpenseInvoiceTaxRate.zero && (form.setFieldsValue({ taxRate: undefined }));
      setRateDiabled(false);
      setRateZeroDiabled(true);
      setTaxDisabled(false);
    }
  };

  // tax money
  const onChangeMoney = (val) => {
    const taxRate = form.getFieldValue('taxRate');
    // taxMoney
    if (val !== undefined && taxRate !== undefined) {
      const tax = (val / (1 + taxRate)) * taxRate;
      form.setFieldsValue({ tax: tax.toFixed(2) });
    }

    // noTaxMoney
    if (val !== undefined && taxRate !== undefined) {
      const noTax = val - ((val / (1 + taxRate)) * taxRate);
      form.setFieldsValue({ noTax: noTax.toFixed(2) });
    }

    // 发票金额
    setTaxMoney(val);
  };

  // tax rate
  const onChangeTaxRate = (val) => {
    const money = form.getFieldValue('money');
    // taxMoney
    if (val !== undefined && money !== undefined) {
      const tax = (money / (1 + val)) * val;
      form.setFieldsValue({ tax: tax.toFixed(2) });
    }

    // noTaxMoney
    if (val !== undefined && money !== undefined) {
      const noTax = money - ((money / (1 + val)) * val);
      form.setFieldsValue({ noTax: noTax.toFixed(2) });
    }
  };

  // tax
  const onChangeTax = (val) => {
    const money = form.getFieldValue('money');

    let noTax;
    if (val !== undefined && money !== undefined) {
      noTax = ((money * 1000) - (val * 1000)) / 1000;
    }

    form.setFieldsValue({ noTax });
  };

  // delete invoice
  const onDeleteInvoice = async (invoiceId) => {
    const res = await dispatch({
      type: 'codeOrder/deleteOrderInvoice',
      payload: { id: invoiceId, costOrderId, orderId },
    });

    if (res && res._id) {
      dispatch({
        type: 'codeOrder/getCostOrderList',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/fetchOrderCostItem',
        payload: {
          id: cost._id,
          orderId,
          namespace,
        },
      });

      // 正常单据
      //! isPluginOrder && (
        // dispatch({
          // type: 'expenseCostOrder/fetchNamespaceCostOrderDetail',
          // payload: { recordId: costOrderId, namespace: orderId },
        // })
        // );

      // 外部单据（不能获取费用单详情）
      // isPluginOrder && (
        // dispatch({
          // type: 'expenseExamineOrder/fetchExamineOrderDetail',
          // payload: { id: orderId, flag: true } })
      // );
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // money
  const renderMoneyHeader = () => {
    const moneyItems = [
      {
        label: '发票总金额',
        form: `${Unit.exchangePriceCentToMathFormat(totalCostBillAmount)}元`,
      }, {
        label: '费用总金额',
        form: `${Unit.exchangePriceCentToMathFormat(totalTaxDeductionAmount)}元`,
      },
      {
        label: '总税金',
        form: `${Unit.exchangePriceCentToMathFormat(totalTaxAmountAmount)}元`,
      },
    ];
    return (
      <DeprecatedCoreForm items={moneyItems} cols={3} layout={layout} />
    );
  };

  // details
  const renderDetails = () => {
    return (
      <div>
        {
          costBillList.map((item, itemKey) => {
            const {
              code = undefined,
              type = undefined,
              money = 0,
              tax_rate: taxRate = undefined,
              tax_amount: tax = 0,
              tax_deduction: noTax = 0,
              _id: id = undefined,
            } = item;

            const items = [
              {
                label: `发票${itemKey + 1}编号`,
                form: code || '--',
              }, {
                label: '发票类型',
                form: type ? ExpenseInvoiceType.description(type) : '--',
              }, {
                label: '发票金额',
                form: `${Unit.exchangePriceCentToMathFormat(money)}元`,
              }, {
                label: '税率',
                form: taxRate !== undefined ? ExpenseInvoiceTaxRate.description(taxRate) : '--',
              }, {
                label: '费用金额',
                form: `${Unit.exchangePriceCentToMathFormat(noTax)}元`,
              }, {
                label: '税金',
                form: `${Unit.exchangePriceCentToMathFormat(tax)}元`,
              },
            ];

            // 是否有删除权限
            isAddCostBill && (
              items[items.length] = {
                label: '',
                layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
                form: (
                  <Popconfirm
                    title="你确定要删除这行内容吗？"
                    icon={<CloseCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => onDeleteInvoice(id)}
                  >
                    <DeleteOutlined style={{ color: 'red', fontSize: '16px' }} />
                  </Popconfirm>
                ),
              }
            );
            return (
              <DeprecatedCoreForm items={items} cols={4} layout={layout} key={itemKey} />
            );
          })
        }
      </div>
    );
  };

  // invoice form
  const renderInvoiceForm = () => {
    const enterRule = [{ required: true, message: '请输入' }];
    const selectRule = [{ required: true, message: '请选择' }];

    const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    if (!formVisible) return;

    const colStyle = { margin: '10px 0' };
    return (
      <Form layout="inline" form={form} {...formLayout}>
        <Row>
          <Col span={8} style={colStyle}>
            <Form.Item
              name="code"
              label="发票编号"
              rules={[{ required: false }, { pattern: /^[A-Za-z0-9]+$/, message: '编号只可以为数字或字母' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8} style={colStyle}>
            <Form.Item name="type" label="发票类型" rules={selectRule}>
              <Radio.Group onChange={onChangeType}>
                <Radio value={ExpenseInvoiceType.ordinary}>{ExpenseInvoiceType.description(ExpenseInvoiceType.ordinary)}</Radio>
                <Radio value={ExpenseInvoiceType.avt}>{ExpenseInvoiceType.description(ExpenseInvoiceType.avt)}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8} style={colStyle}>
            <Form.Item name="money" label="发票金额" rules={enterRule}>
              <InputNumber
                min={0}
                step={0.01}
                formatter={Unit.limitDecimals}
                parser={Unit.limitDecimals}
                onChange={onChangeMoney}
              />
            </Form.Item>
          </Col>
          <Col span={6} style={colStyle}>
            <Form.Item name="taxRate" label="税率" rules={selectRule}>
              <Select disabled={rateDisabled} style={{ width: '100px' }} onChange={onChangeTaxRate}>
                <Option
                  value={ExpenseInvoiceTaxRate.zero}
                  disabled={rateZeroDiabled}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.zero)}
                </Option>
                <Option
                  value={ExpenseInvoiceTaxRate.three}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.three)}
                </Option>
                <Option
                  value={ExpenseInvoiceTaxRate.five}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.five)}
                </Option>
                <Option
                  value={ExpenseInvoiceTaxRate.six}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.six)}
                </Option>
                <Option
                  value={ExpenseInvoiceTaxRate.nine}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.nine)}
                </Option>
                <Option
                  value={ExpenseInvoiceTaxRate.ten}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.ten)}
                </Option>
                <Option
                  value={ExpenseInvoiceTaxRate.thirteen}
                >
                  {ExpenseInvoiceTaxRate.description(ExpenseInvoiceTaxRate.thirteen)}
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} style={colStyle}>
            <Form.Item name="tax" label="税额" rules={enterRule}>
              <InputNumber
                min={0}
                max={taxMoney}
                step={0.01}
                formatter={Unit.limitDecimals}
                parser={Unit.limitDecimals}
                disabled={taxDisabled}
                onChange={onChangeTax}
              />
            </Form.Item>
          </Col>
          <Col span={6} style={colStyle}>
            <Form.Item name="noTax" label="去税额" rules={enterRule}>
              <InputNumber
                min={0}
                step={0.01}
                formatter={Unit.limitDecimals}
                parser={Unit.limitDecimals}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', ...colStyle }}>
            <Form.Item><CloseCircleOutlined style={{ color: 'red', fontSize: '16px' }} onClick={() => onCancelForm()} /></Form.Item>
            <Form.Item><CheckCircleOutlined style={{ color: 'green', fontSize: '16px' }} onClick={() => onAdd()} /></Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  const titleExt = (
    <div>
      {
        isAddCostBill && isSystemAuth && (
          <Button
            type="primary"
            style={{ marginRight: '5px' }}
            disabled={formVisible}
            onClick={() => setFormVisible(true)}
          >
            添加发票信息
          </Button>
        )
      }
      {/* 有系统权限 && 后端有字段 && 发票列表中有专票 */}
      {
        isBillRedPush && isAvt && isSystemAuth ? (
          <Popconfirm
            title="请确认您是否红冲"
            onConfirm={() => onRedPunch()}
          >
            <Button
              type="primary"
            >红冲</Button>
          </Popconfirm>
        ) : null
      }
    </div>
  );

  return (
    <CoreContent title="发票信息" titleExt={titleExt}>
      {renderMoneyHeader()}
      {renderDetails()}
      {renderInvoiceForm()}
    </CoreContent>
  );
};


export default connect()(Invoice);
