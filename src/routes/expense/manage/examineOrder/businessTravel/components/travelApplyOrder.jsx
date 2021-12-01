/**
 * 出差信息
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import is from 'is_js';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import TravelApplicationForm from './travelApplicationForm';
import styles from './style.less';

const { RangePicker } = DatePicker;

class TravelApplyOrder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      travelItem: {},
    };
  }

  // 出差申请单
  onChangeTravelApplicationForm = (e, item) => {
    this.setState({
      travelItem: item,
    });

    const { setFieldsValue } = this.props.form;
    setFieldsValue({ bizExtraTravelApplyOrderId: e });
  }


  // 计算相差多少天并过滤休息日
  onChangeFilterDiffDay = () => {
    const { getFieldValue } = this.props.form;
    // 获取实际出差时间
    const date = getFieldValue('date');
    const startDate = is.existy(date) && is.not.empty(date) ? moment(date[0], 'YYYY-MM-DD HH:00') : undefined;
    const endDate = is.existy(date) && is.not.empty(date) ? moment(date[1], 'YYYY-MM-DD HH:00') : undefined;
    // 计算相差时间
    let days;
    if (is.existy(date) && is.not.empty(date)) {
      days = endDate.diff(startDate, 'day');
    }
    let diffDays = 0;
    if (days >= 0) {
      // 取消过滤周六日
      Array.from({ length: days }).forEach(() => {
        diffDays += 1;
      });
      return diffDays;
    }
    return '--';
  }

  // 更改时间, 如果结尾时间大于当前时间就用当前时间
  onGetValueFromEvent = (value) => {
    // 判断不是数组时清空数据
    if (!Array.isArray(value)) {
      return undefined;
    }
    const params = [...value];
    const endDate = moment(value[1]).valueOf();
    const date = moment().valueOf();
    // 判断结尾时间是否大于当前时间
    if (endDate > date) {
      params[1] = moment();
    }
    return params;
  }

  // 限制选择的日期
  disabledDate = (current) => {
    return current && current > moment().endOf('hours');
  }

  // 限制选择的时间
  disabledRangeTime = (_, type) => {
    // 当前小时
    const nowHours = new Date().getHours();

    // 今天的日期
    const today = moment(new Date()).format('YYYYHHDD');

    // 选择的结束时间
    let endTime;
    // 获取选择的date
    if (_ && _.length === 2) {
      endTime = moment(_[1]).format('YYYYHHDD');

      // 如果结束日期为今天，则限制选择的到小时
      if (Number(endTime) === Number(today) && type === 'end') {
        return {
          disabledHours: () => this.range(nowHours + 1, 24),
        };
      }
      // 其他不限制
      return {
        disabledHours: () => [],
      };
    }
  }

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  }

  // 出差申请单
  renderTravelApplyOrder = () => {
    const { getFieldDecorator } = this.props.form;
    const { travelItem } = this.state;
    const detail = dot.get(this.props, 'detail', {});
    const bizExtraTravelApplyOrderInfo = dot.get(detail, 'bizExtraTravelApplyOrderInfo', {});
    let items = {};
    if (is.existy(travelItem) && is.not.empty(travelItem)) {
      items = travelItem;
    } else {
      items = bizExtraTravelApplyOrderInfo;
    }
    const departure = items.departure || {}; // 出发地
    const destination = items.destination || {}; // 目的地
    const fromItem = [
      {
        label: '出差申请单',
        layout: { labelCol: { span: 6, pull: 1 }, wrapperCol: { span: 18, pull: 1 } },
        form: getFieldDecorator('bizExtraTravelApplyOrderId', {
          initialValue: detail.bizExtraTravelApplyOrderId || undefined,
          rules: [{ required: true, message: '请选择出差申请单' }],
        })(
          <TravelApplicationForm
            className={styles['app-comp-expense-travel-apply-order-item']}
            placeholder="请选择出差申请单"
            enableSelectAll
            showSearch
            optionFilterProp="children"
            onChange={this.onChangeTravelApplicationForm}
          />,
        ),
      },
    ];
    const fromItems = [
      {
        label: '出差申请单号',
        form: (
          <span>
            {
              items._id ?
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/#/Expense/TravelApplication/Detail?id=${items._id}`}
                >
                  {items._id}
                </a>
            : '--'
            }
          </span>
        ),
      },
      {
        label: '实际出差人',
        form: items.apply_user_name || '--',
      },
      {
        label: '预计出差时间',
        form: (
          <span>
            {items.expect_start_at ? moment(items.expect_start_at).format('YYYY-MM-DD HH:00') : ''}--
            {items.expect_done_at ? moment(items.expect_done_at).format('YYYY-MM-DD HH:00') : ''}
          </span>
        ),
      },
      {
        label: '出差地点',
        form: (
          <span>
            {departure.province_name || ''}
            {departure.city_name || ''}
            --
            {destination.province_name || ''}
            {destination.city_name || ''}
          </span>
        ),
      },
    ];
    let travelDate = [];
    if (is.existy(bizExtraTravelApplyOrderInfo.actual_start_at) && is.not.empty(bizExtraTravelApplyOrderInfo.actual_start_at) &&
    is.existy(bizExtraTravelApplyOrderInfo.actual_done_at) && is.not.empty(bizExtraTravelApplyOrderInfo.actual_done_at)
    ) {
      travelDate = [moment(`${bizExtraTravelApplyOrderInfo.actual_start_at}`, 'YYYY-MM-DD HH:00'), moment(`${bizExtraTravelApplyOrderInfo.actual_done_at}`, 'YYYY-MM-DD HH:00')];
    }

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    const fromItemDate = [
      {
        label: '实际出差时间',
        // span: 8,
        form: getFieldDecorator('date', {
          initialValue: travelDate,
          getValueFromEvent: this.onGetValueFromEvent,
          rules: [{ required: true, message: '请选择实际出差时间' }],
        })(
          <RangePicker
            disabledDate={this.disabledDate}
            disabledTime={this.disabledRangeTime}
            showTime={{ format: 'HH:00' }}
            format="YYYY-MM-DD HH:00"
          />,
        ),
      }, {
        label: '出差天数',
        // span: 16,
        form: `${this.onChangeFilterDiffDay() !== '--' ?
        this.onChangeFilterDiffDay() : (bizExtraTravelApplyOrderInfo.actual_apply_days || '--')}天`,
      },
    ];

    return (
      <div>
        <DeprecatedCoreForm items={fromItem} cols={2} />
        <DeprecatedCoreForm items={fromItems} cols={4} />
        <DeprecatedCoreForm items={fromItemDate} cols={2} layout={layout} />
      </div>
    );
  }

  render() {
    return (
      <CoreContent title="出差信息">
        {/* 出差信息 */}
        {this.renderTravelApplyOrder()}
      </CoreContent>
    );
  }
}


export default TravelApplyOrder;
