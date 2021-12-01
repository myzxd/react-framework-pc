/**
 * 摊销管理 - 摊销确认表 - 编辑规则modal
 */
import moment from 'moment';
import { connect } from 'dva';
import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Radio,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  CoreForm,
} from '../../../../components/core';
import {
  Unit,
  AmortizationCycleType,
  AmortizationRuleType,
} from '../../../../application/define';

import Subject from '../../component/subject';

const EditRule = ({
  dispatch,
  visible,
  onCancel,
  curAmotization = {}, // 当前操作的摊销数据
  getAmortizationList, // 获取摊销列表
}) => {
  const [form] = Form.useForm();

  // button loading
  const [isLoading, setIsLoading] = useState(false);

  const {
    allocation_type: type = AmortizationCycleType.cycle, // 摊销周期类型
    allocation_cycle: allocationCycle = 0, // 摊销周期
    accumulated_allocation_cycle: accumulatedAllocationCycle = 0, // 已摊周期
    unallocation_money: accumulatedUnallocationMoney = undefined, // 未摊销金额
  } = curAmotization;

  // 摊销结束日期disabledDate
  const disabledDate = (c) => {
    if (curAmotization.allocation_start_date) {
      return c < moment(String(curAmotization.allocation_start_date)).endOf('day');
    }
  };

  // 提交
  const onSubmit = async () => {
    const values = await form.validateFields();

    setIsLoading(true);

    const res = await dispatch({
      type: 'costAmortization/onUpdateRule',
      payload: {
        ...values,
        unallocationTotalMoney: values.unallocationTotalMoney ? Unit.exchangePriceToCent(values.unallocationTotalMoney) : undefined, // 未摊销金额
        ids: curAmotization._id ? [curAmotization._id] : undefined,
      },
    });
    if (res && res.zh_message) {
      // 重置button loading
      setIsLoading(false);
      return message.error(res.zh_message);
    }

    if (res && res.result) {
      message.success('请求成功');
      // 重置button loading
      setIsLoading(false);
      // 获取摊销列表
      getAmortizationList && getAmortizationList();
      // 隐藏表单
      onCancel && onCancel(true);
    }
  };

  // 获取分期期数
  const getNumberOfPeriods = (startDate, endDate) => {
    if (startDate && endDate) {
      const startYear = moment(String(startDate)).get('year');
      const endYear = moment(String(endDate)).get('year');

      const startDay = moment(String(startDate)).get('M');
      const endDay = moment(String(endDate)).get('M');

      // 计算年份
      const year = (endYear - startYear);

      // 计算月份（默认加一个月）
      const period = (Number(endDay) - Number(startDay)) + 1;

      return period + (year * 12);
    }
    return 0;
  };

  // cycle form
  const renderCycleForm = () => {
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
          curAmotization.total_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.total_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="税金">
        {
          curAmotization.tax_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.tax_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="税后金额">
        {
          curAmotization.tax_deduction ?
            Unit.exchangePriceCentToMathFormat(curAmotization.tax_deduction)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="残值率">
        {
          curAmotization.salvage_value_rate ?
            `${curAmotization.salvage_value_rate}%`
            : '0%'
        }
      </Form.Item>,
      <Form.Item label="预计残值金额">
        {
          curAmotization.pre_salvage_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.pre_salvage_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="应摊总金额">
        {
          curAmotization.allocation_total_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.allocation_total_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="摊销周期">
        {`周期摊销，共${allocationCycle}期`}
      </Form.Item>,
      <Form.Item label="摊销起止时间">
        {
          curAmotization.allocation_start_date && curAmotization.allocation_end_date ?
            `${curAmotization.allocation_start_date} - ${curAmotization.allocation_end_date}`
            : '--'
        }
      </Form.Item>,
      <Form.Item label="已摊">
        {
          curAmotization.accumulated_allocation_cycle ?
            `${curAmotization.accumulated_allocation_cycle}期`
            : '0期'
        }
      </Form.Item>,
      <Form.Item label="已摊销金额">
        {
          curAmotization.accumulated_allocation_money ?
            `${Unit.exchangePriceCentToMathFormat(curAmotization.accumulated_allocation_money)}元`
            : '0.00元'
        }
      </Form.Item>,
    ];

    const twoLayoutItems = [
      <Form.Item label="剩余" className="boss-form-item-wrap-required">
        <div style={{ display: 'flex' }}>
          <Form.Item
            name="remaining"
            rules={[
              { required: true, message: '请输入' },
            ]}
          >
            <InputNumber
              min={1}
              precision={0}
              placeholder="请输入"
              formatter={Unit.limitPositiveIntegerNumber}
              parser={Unit.limitPositiveIntegerNumber}
            />
          </Form.Item>
          <span style={{ marginLeft: 5, lineHeight: '30px' }}>期</span>
        </div>
      </Form.Item>,
      <Form.Item
        label="未摊销金额"
        className="boss-form-item-wrap-required"
      >
        <div style={{ display: 'flex' }}>
          <Form.Item
            name="unallocationTotalMoney"
            rules={[
              { required: true, message: '请输入' },
            ]}
          >
            <InputNumber
              precision={2}
              min={0.01}
              placeholder="请输入"
              formatter={Unit.limitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
            />
          </Form.Item>
          <Form.Item
            shouldUpdate={(prevVal, curVal) => prevVal.unallocationTotalMoney !== curVal.unallocationTotalMoney || prevVal.remaining !== curVal.remaining}
          >
            {
              ({ getFieldValue }) => {
                const period = getFieldValue('remaining');
                const money = getFieldValue('unallocationTotalMoney');

                let targetMoney = 0;
                if (period && money) {
                  targetMoney = ((money * 1000) / period) / 1000;
                }

                return (
                  <span style={{ marginLeft: 5 }}>
                    {`元，（预计每期摊${targetMoney.toFixed(2)}元）`}
                  </span>
                );
              }
            }
          </Form.Item>
        </div>
      </Form.Item>,
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
      rule: AmortizationRuleType.average,
      subject: curAmotization.book_accounting_id, // 记账科目
      remaining: allocationCycle - accumulatedAllocationCycle, // 剩余摊销期数
      unallocationTotalMoney: accumulatedUnallocationMoney ?
        Unit.exchangePriceToYuan(accumulatedUnallocationMoney)
        : undefined, // 未摊销金额
    };

    return (
      <Form
        form={form}
        labelAlign="left"
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <CoreForm items={items} cols={4} />
        <CoreForm items={twoLayoutItems} cols={2} />
      </Form>
    );
  };

  // interval form
  const renderIntervalForm = () => {
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
          curAmotization.total_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.total_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="税金">
        {
          curAmotization.tax_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.tax_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="税后金额">
        {
          curAmotization.tax_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.tax_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="残值率">
        {
          curAmotization.salvage_value_rate ?
            `${curAmotization.salvage_value_rate}%`
            : '0%'
        }
      </Form.Item>,
      <Form.Item label="预计残值金额">
        {
          curAmotization.pre_salvage_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.pre_salvage_money)
            : '0.00'
        }
      </Form.Item>,
      <Form.Item label="应摊总金额">
        {
          curAmotization.allocation_total_money ?
            Unit.exchangePriceCentToMathFormat(curAmotization.allocation_total_money)
            : '0.00'
        }
      </Form.Item>,
      {
        key: 'belong_date',
        span: 12,
        render: (
          <Form.Item
            label="摊销起止时间"
          >
            <div style={{ display: 'flex' }}>
              <span style={{ lineHeight: '30px' }}>
                {
                  curAmotization.allocation_start_date ?
                    moment(String(curAmotization.allocation_start_date)).format('YYYY-MM-DD')
                    : '--'
                }
              </span>
              <span style={{ lineHeight: '30px', margin: '0 10px' }}> - </span>
              <Form.Item name="allocationEndDate">
                <DatePicker
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </div>
          </Form.Item>
        ),
      },
      <Form.Item
        label="分期期数"
        shouldUpdate={(prevVal, curVal) => prevVal.allocationEndDate !== curVal.allocationEndDate}
      >
        {
          ({ getFieldValue }) => {
            const endDate = getFieldValue('allocationEndDate');
            if (!curAmotization.allocation_start_date || !endDate) return '0期';
            return `${getNumberOfPeriods(curAmotization.allocation_start_date, moment(endDate).format('YYYYMMDD'))}期`;
          }
        }
      </Form.Item>,
      <Form.Item label="已摊">
        {
          curAmotization.accumulated_allocation_cycle ?
            `${curAmotization.accumulated_allocation_cycle}期`
            : '0期'
        }
      </Form.Item>,
      <Form.Item label="已摊金额">
        {
          curAmotization.accumulated_allocation_money ?
            `${Unit.exchangePriceCentToMathFormat(curAmotization.accumulated_allocation_money)}元`
            : '0.00元'
        }
      </Form.Item>,
      <Form.Item label="剩余">
        {allocationCycle - accumulatedAllocationCycle}期
      </Form.Item>,
      {
        span: 12,
        render: (
          <Form.Item
            label="未摊销金额"
            className="boss-form-item-wrap-required"
          >
            <div style={{ display: 'flex' }}>
              <Form.Item
                name="unallocationTotalMoney"
                rules={[
                  { required: true, message: '请输入' },
                ]}
              >
                <InputNumber
                  precision={2}
                  min={0.01}
                  placeholder="请输入"
                  formatter={Unit.limitDecimalsFormatter}
                  parser={Unit.limitDecimalsParser}
                />
              </Form.Item>
              <Form.Item
                shouldUpdate={(prevVal, curVal) => (prevVal.unallocationTotalMoney !== curVal.unallocationTotalMoney || prevVal.allocationEndDate !== curVal.allocationEndDate)}
              >
                {
                  ({ getFieldValue }) => {
                    let targetMoney = 0;
                    const money = getFieldValue('unallocationTotalMoney');
                    const date = getFieldValue('allocationEndDate');

                    if (!money
                      || !date
                      || !curAmotization.allocation_start_date) {
                      targetMoney = 0;
                    } else {
                      targetMoney = ((money * 1000) / moment(date).diff(moment(String(curAmotization.allocation_start_date)), 'days')) / 1000;
                    }

                    return (
                      <span style={{ marginLeft: 5, lineHeight: '30px' }}>
                        {`元，（预计每天摊${targetMoney.toFixed(2)}元）`}
                      </span>
                    );
                  }
                }
              </Form.Item>
            </div>
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
      rule: AmortizationRuleType.average, // 摊销规则
      subject: curAmotization.cost_accounting_id, // 记账科目
      unallocationTotalMoney: accumulatedUnallocationMoney ?
        Unit.exchangePriceToYuan(accumulatedUnallocationMoney)
        : undefined, // 未摊销金额
      allocationEndDate: curAmotization.allocation_end_date ?
        moment(String(curAmotization.allocation_end_date))
        : undefined, // 摊销结束日期
    };

    return (
      <Form
        form={form}
        labelAlign="left"
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <CoreForm items={items} cols={4} />
      </Form>
    );
  };

  // modal
  const renderModal = () => {
    return (
      <Modal
        visible={visible}
        title="设置摊销规则"
        confirmLoading={isLoading}
        onOk={onSubmit}
        onCancel={() => (onCancel && onCancel(false))}
        width="70%"
      >
        {
          type === AmortizationCycleType.cycle ?
            renderCycleForm()
            : renderIntervalForm()
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

export default connect()(EditRule);
