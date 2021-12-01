/**
 * 费用管理 - 借还款管理 - 新建/编辑 - 还款信息组件
 */
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import { RepayCircle, RepayMethod } from '../../../../../../application/define';

import style from './style.css';

const { Option } = Select;

class RepayInfo extends Component {

  static propTypes = {
    borrowingDetail: PropTypes.object, // 借款单详情
    form: PropTypes.object, // 表单
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单详情
    form: {}, // 表单
  }

  disabledDate = (current) => {
    return current < moment().startOf('day');
  }

  // 渲染隐藏表单
  renderHideForm = () => {
    const { getFieldDecorator } = this.props.form;
    const hideItems = [
      (getFieldDecorator('repayMethod', { initialValue: RepayMethod.currency })(
        <Select disabled key="repayMethod">
          <Option value={`${RepayMethod.currency}`}>{RepayMethod.description(RepayMethod.currency)}</Option>
        </Select>,
      )),
    ];
    return <div className={style['app-comp-expense-borrowing-form-hide']}>{hideItems}</div>;
  }

  render = () => {
    const { borrowingDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 还款方式
    const repayWayItems = [
      {
        label: '还款方式',
        form: RepayMethod.description(RepayMethod.currency),
      },
    ];
    const repayWayLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    // 还款信息
    const repayItems = [
      {
        label: '还款周期',
        form: getFieldDecorator('repayCircle', { initialValue: borrowingDetail.repayment_cycle ? `${borrowingDetail.repayment_cycle}` : `${RepayCircle.once}`, rules: [{ required: true, message: '请选择' }] })(
          <Select className={style['app-comp-expense-borrowing-form-repay-circle']}>
            <Option value={`${RepayCircle.once}`}>{RepayCircle.description(RepayCircle.once)}</Option>
            <Option value={`${RepayCircle.instalment}`}>{RepayCircle.description(RepayCircle.instalment)}</Option>
          </Select>,
        ),
      },
      {
        label: '预计还款时间',
        form: getFieldDecorator('repayDay', { initialValue: borrowingDetail.expected_repayment_time ? moment(borrowingDetail.expected_repayment_time, 'YYYYMMDD') : moment().add(1, 'M'), rules: [{ required: true, message: '请上传' }] })(
          <DatePicker
            disabledDate={this.disabledDate}
          />,
        ),
      },
    ];
    const repayLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <CoreContent title="还款信息">
        <DeprecatedCoreForm
          key="repayWay"
          items={repayWayItems}
          cols={4}
          layout={repayWayLayout}
        />
        <DeprecatedCoreForm
          key="repay"
          items={repayItems}
          cols={4}
          layout={repayLayout}
        />
        {this.renderHideForm()}
      </CoreContent>
    );
  }
}

export default RepayInfo;
