/**
 * 摊销管理 - 摊销确认表 - 批量确认规则modal
 */
import moment from 'moment';
import { connect } from 'dva';
import is from 'is_js';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  message,
  Radio,
  InputNumber,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  Unit,
  AmortizationCycleType,
  AmortizationRuleType,
} from '../../../../application/define';
import {
  CoreForm,
} from '../../../../components/core';

import Subject from '../../component/subject';

const { RangePicker } = DatePicker;

const ComfirmRule = ({
  dispatch,
  visible,
  onCancel,
  selectedRowKeys = [],
  data = [], // 确认摊销list
}) => {
  const [form] = Form.useForm();
  // 当前操作的摊销数据
  const [curAmotization, setCurAmorization] = useState([]);
  // button loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data.length > 0 && selectedRowKeys.length > 0) {
      const curData = data.filter(d => selectedRowKeys.includes(d._id));
      setCurAmorization(curData);
    }
  }, [data, selectedRowKeys]);

  // 残值率onChange
  const onChangeResidual = (val) => {
    const curData = curAmotization[0] || {};
    const {
      allocation_total_money: allocationTotalMoney = 0, // 应摊总金额
      pre_salvage_money: preSalvageMoney = 0, // 预计残值金额
      tax_deduction: taxDeduction = 0, // 税后金额
    } = curData;

    // 根据残值率，计算预计残值金额，再计算应摊总金额
    if (val || val === 0) {
      const curPreSalvageMoney = ((taxDeduction * 1000) * (val / 100)) / 1000;
      const money = (allocationTotalMoney + preSalvageMoney) - curPreSalvageMoney;
      form.setFieldsValue({ allocationTotalMoney: Unit.exchangePriceToYuan(money) });
    }
  };

  // onCancel
  const onModalCancel = (isReset) => {
    form.resetFields();
    onCancel && onCancel(isReset);
  };

  // 摊销起止日期disabledDate
  const disabledDate = (c) => {
    return c && c < moment().set('date', 1).startOf('day');
  };

  // 提交
  const onSubmit = async () => {
    const values = await form.validateFields();
    setIsLoading(true);

    const res = await dispatch({
      type: 'costAmortization/onUpdateRule',
      payload: {
        ...values,
        ids: selectedRowKeys,
        allocationTotalMoney: selectedRowKeys.length > 1 ?
         undefined
        : (values.allocationTotalMoney || values.allocationTotalMoney === 0) ? Unit.exchangePriceToCent(values.allocationTotalMoney) : undefined, // 应摊总额
      },
    });
    if (res && res.zh_message) {
      setIsLoading(false);
      return message.error(res.zh_message);
    }

    if (res && res.result) {
      message.success('请求成功');
      // 重置当前操作的数据
      setCurAmorization([]);
      // 重置button loading
      setIsLoading(false);
      // 隐藏表单
      onModalCancel(true);
    }
  };

  // 摊销周期onChange
  const onChangeBelongTime = (val) => {
    if (val === AmortizationCycleType.cycle) {
      // 重置摊销起止日期
      form.setFieldsValue({
        belongDate: undefined,
      });
    }

    // 重置摊销周期
    if (val === AmortizationCycleType.startAndEnd) {
      form.setFieldsValue({
        belongTime: undefined,
      });
    }
  };

  // 获取分期期数
  const getNumberOfPeriods = (val = []) => {
    if (Array.isArray(val) && val.length === 2) {
      const startYear = moment(String(val[0])).get('year');
      const endYear = moment(String(val[1])).get('year');

      const startDay = moment(String(val[0])).get('M');
      const endDay = moment(String(val[1])).get('M');

      // 计算年份
      const year = (endYear - startYear);

      const period = (Number(endDay) - Number(startDay)) + 1;

      return period + (year * 12);
    }
    return 0;
  };

  // 获取分期期数form
  const getNumberOfPeriodsForm = (getFieldValue) => {
    const belongDate = getFieldValue('belongDate');
    return (
      <Form.Item label="分期期数" key="numberOfPeriodsItem">
        {getNumberOfPeriods(belongDate)}期
      </Form.Item>
    );
  };

  // batch form
  const renderBatchForm = () => {
    const items = [
      <Form.Item label="总付款金额">
        {
          Unit.exchangePriceCentToMathFormat(curAmotization.reduce((rec, cur) => rec + (cur.total_money || 0), 0))
        }
      </Form.Item>,
      <Form.Item label="数量">
        {selectedRowKeys.length}
      </Form.Item>,
      <Form.Item label="总税金">
        {
          Unit.exchangePriceCentToMathFormat(curAmotization.reduce((rec, cur) => rec + (cur.tax_money || 0), 0))
        }
      </Form.Item>,
      <Form.Item label="总税后金额">
        {
          Unit.exchangePriceCentToMathFormat(curAmotization.reduce((rec, cur) => rec + (cur.tax_deduction || 0), 0))
        }
      </Form.Item>,
      <Form.Item
        label="残值率"
        name="residual"
      >
        <InputNumber
          min={0}
          max={99}
          placeholder="请输入"
          formatter={v => `${Unit.limitMaxZeroIntegerNumber(v, 99)}%`}
          parser={v => Unit.limitMaxZeroIntegerNumber(v.replace('%', ''), 99)}
        />
      </Form.Item>,
      <Form.Item
        label="预计残值金额"
        shouldUpdate={(prevVal, curVal) => prevVal.residual !== curVal.residual}
      >
        {
          ({ getFieldValue }) => {
            // 预计残值金额
            const preSalvageMoney = curAmotization.reduce((rec, cur) => rec + (cur.pre_salvage_money || 0), 0);
            // 残值率
            const residual = getFieldValue('residual');
            // 总税后金额
            const taxDeduction = curAmotization.reduce((rec, cur) => rec + (cur.tax_deduction || 0), 0);
            if (residual || residual === 0) {
              const money = ((taxDeduction * 1000) * (residual / 100)) / 1000;
              return Unit.exchangePriceCentToMathFormat(money);
            }
            return Unit.exchangePriceCentToMathFormat(preSalvageMoney);
          }
        }
      </Form.Item>,
      <Form.Item label="应摊总金额">
        {
          Unit.exchangePriceCentToMathFormat(curAmotization.reduce((rec, cur) => rec + (cur.allocation_total_money || 0), 0))
        }
      </Form.Item>,
      {
        key: 'amortization_cycle',
        span: 24,
        render: (
          <Form.Item
            label="摊销周期"
            name="belongTimeType"

          >
            <Radio.Group onChange={val => onChangeBelongTime(val.target.value)}>
              <Radio
                value={AmortizationCycleType.cycle}
              >
                {AmortizationCycleType.description(AmortizationCycleType.cycle)}
              </Radio>
              <Radio
                value={AmortizationCycleType.startAndEnd}
              >
                {AmortizationCycleType.description(AmortizationCycleType.startAndEnd)}
              </Radio>
            </Radio.Group>
          </Form.Item>
        ),
      },
      {
        key: 'batchTimeType',
        span: 24,
        render: (
          <Form.Item
            shouldUpdate={(prevVal, curVal) => (prevVal.belongTimeType !== curVal.belongTimeType || prevVal.belongDate !== curVal.belongDate)}
          >
            {
              ({ getFieldValue }) => {
                const belongTimeType = getFieldValue('belongTimeType');
                // 按照周期
                if (belongTimeType === AmortizationCycleType.cycle) {
                  return (
                    <Form.Item
                      name="belongTime"
                      label="摊销周期"
                      rules={[
                        { required: true, message: '请输入' },
                      ]}
                    >
                      <InputNumber
                        max={9999}
                        min={1}
                        precision={0}
                        placeholder="请输入"
                        formatter={Unit.limitPositiveIntegerNumber}
                        parser={Unit.limitPositiveIntegerNumber}
                      />
                    </Form.Item>
                  );
                }

                // 按照起止日期
                if (belongTimeType === AmortizationCycleType.startAndEnd) {
                  return (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name="belongDate"
                          label="摊销起止日期"
                          rules={[
                            { required: true, message: '请选择' },
                          ]}
                        >
                          <RangePicker
                            disabledDate={disabledDate}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {getNumberOfPeriodsForm(getFieldValue)}
                      </Col>
                    </Row>
                  );
                }
              }
            }
          </Form.Item>
        ),
      },
      <Form.Item
        label="分摊规则"
        name="rule"
      >
        <Radio.Group>
          <Radio
            value={AmortizationRuleType.average}
          >
            {AmortizationRuleType.description(AmortizationRuleType.average)}
          </Radio>
        </Radio.Group>
      </Form.Item>,
    ];

    const initialValues = {
      belongTimeType: AmortizationCycleType.cycle, // 摊销周期类型
      rule: AmortizationRuleType.average, // 分摊规则
      residual: 0, // 残值率
    };

    return (
      <Form form={form} initialValues={initialValues} className="affairs-flow-basic">
        <CoreForm items={items} cols={4} />
      </Form>
    );
  };

  const onChangeAllocationTotalMoney = (v) => {
    // 如果清空 默认设置为0 最小值为0
    if (is.not.existy(v)) {
      form.setFieldsValue({ allocationTotalMoney: 0 });
    }
  };
  // single form
  const renderSingleForm = () => {
    const curData = curAmotization[0] || {};

    const items = [
      {
        span: 12,
        render: (
          <Form.Item
            label="记账科目"
            name="subject"
            rules={[
              { required: true, message: '请选择' },
            ]}
          >
            <Subject
              placeholder="请选择"
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ width: '80%' }}
            />
          </Form.Item>
        ),
      },
      <Form.Item label="付款金额">
        {
          curData.total_money ?
            Unit.exchangePriceCentToMathFormat(curData.total_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="税金">
        {
          curData.tax_money ?
            Unit.exchangePriceCentToMathFormat(curData.tax_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="税后金额">
        {
          curData.tax_deduction ?
            Unit.exchangePriceCentToMathFormat(curData.tax_deduction)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item
        label="残值率"
        name="residual"
      >
        <InputNumber
          min={0}
          max={99}
          placeholder="请输入"
          formatter={v => `${Unit.limitMaxZeroIntegerNumber(v, 99)}%`}
          parser={v => Unit.limitMaxZeroIntegerNumber(v.replace('%', ''), 99)}
          onChange={onChangeResidual}
        />
      </Form.Item>,
      <Form.Item
        label="预计残值金额"
        shouldUpdate={(prevVal, curVal) => prevVal.residual !== curVal.residual}
      >
        {
          ({ getFieldValue }) => {
            // 预计残值金额
            const preSalvageMoney = curData.pre_salvage_money ?
              Unit.exchangePriceCentToMathFormat(curData.pre_salvage_money)
              : '0.00';
            // 税后金额
            const taxDeduction = curData.tax_deduction ? curData.tax_deduction : 0;
            // 残值率
            const residual = getFieldValue('residual');
            if (residual || residual === 0) {
              const money = ((taxDeduction * 1000) * (residual / 100)) / 1000;
              return Unit.exchangePriceCentToMathFormat(money);
            }
            return preSalvageMoney;
          }
        }
      </Form.Item>,
      <Form.Item
        label="应摊总金额"
        name="allocationTotalMoney"
      >
        <InputNumber
          onChange={onChangeAllocationTotalMoney}
          precision={2}
          max={9999999999}
          min={0}
          placeholder="请输入"
          formatter={Unit.limitDecimalsFormatter}
          parser={Unit.limitDecimalsParser}
        />
      </Form.Item>,
      {
        span: 12,
        key: 'belongTimeType',
        render: (
          <Form.Item
            label="摊销周期"
            name="belongTimeType"
          >
            <Radio.Group onChange={val => onChangeBelongTime(val.target.value)}>
              <Radio
                value={AmortizationCycleType.cycle}
              >
                {AmortizationCycleType.description(AmortizationCycleType.cycle)}
              </Radio>
              <Radio
                value={AmortizationCycleType.startAndEnd}
              >
                {AmortizationCycleType.description(AmortizationCycleType.startAndEnd)}
              </Radio>
            </Radio.Group>
          </Form.Item>
        ),
      },
      {
        key: 'belongTime',
        span: 24,
        render: (
          <Form.Item
            shouldUpdate={(prevVal, curVal) => (prevVal.belongTimeType !== curVal.belongTimeType || prevVal.belongDate !== curVal.belongDate)}
          >
            {
              ({ getFieldValue }) => {
                const belongTimeType = getFieldValue('belongTimeType');
                if (belongTimeType === AmortizationCycleType.cycle) {
                  return (
                    <Form.Item
                      name="belongTime"
                      label="摊销周期"
                      rules={[
                        { required: true, message: '请输入' },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={9999}
                        precision={0}
                        placeholder="请输入"
                        formatter={Unit.limitPositiveIntegerNumber}
                        parser={Unit.limitPositiveIntegerNumber}
                      />
                    </Form.Item>
                  );
                }

                if (belongTimeType === AmortizationCycleType.startAndEnd) {
                  return (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name="belongDate"
                          label="摊销起止日期"
                          rules={[
                            { required: true, message: '请选择' },
                          ]}
                        >
                          <RangePicker
                            disabledDate={disabledDate}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {getNumberOfPeriodsForm(getFieldValue)}
                      </Col>
                    </Row>
                  );
                }
              }
            }
          </Form.Item>
        ),
      },
      <Form.Item
        label="分摊规则"
        name="rule"
      >
        <Radio.Group>
          <Radio
            value={AmortizationRuleType.average}
          >
            {AmortizationRuleType.description(AmortizationRuleType.average)}
          </Radio>
        </Radio.Group>
      </Form.Item>,
    ];

    const initialValues = {
      subject: curData.book_accounting_id || curData.cost_accounting_id || undefined, // 记账科目
      belongTimeType: curData.allocation_type || AmortizationCycleType.cycle, // 摊销周期类型
      belongTime: curData.allocation_cycle || undefined, // 摊销周期
      belongDate: curData.allocation_start_date && curData.allocation_end_date ?
        [moment(String(curData.allocation_start_date)), moment(String(curData.allocation_end_date))]
        : undefined, // 摊销起止日
      rule: AmortizationRuleType.average || undefined, // 摊销周期
      residual: curData.salvage_value_rate || 0, // 残时率
      allocationTotalMoney: (curData.allocation_total_money || curData.allocation_total_money === 0) ?
        Unit.exchangePriceToYuan(curData.allocation_total_money)
        : undefined,
    };

    return (
      <Form form={form} initialValues={initialValues} className="affairs-flow-basic">
        <CoreForm items={items} cols={4} />
      </Form>
    );
  };

  // modal
  const renderModal = () => {
    return (
      <Modal
        visible={visible}
        onOk={onSubmit}
        title="设置摊销规则"
        confirmLoading={isLoading}
        onCancel={() => onModalCancel(false)}
        width="70%"
      >
        {
          selectedRowKeys.length > 1 ?
            renderBatchForm()
            : renderSingleForm()
        }
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
    </React.Fragment>
  );
};

export default connect()(ComfirmRule);
