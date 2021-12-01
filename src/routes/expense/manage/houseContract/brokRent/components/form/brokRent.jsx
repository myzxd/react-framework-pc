/**
 * 费用管理 / 房屋管理 / 断租编辑 / 断租信息
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputNumber,
  DatePicker,
} from 'antd';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';

import { Unit } from '../../../../../../../application/define';

class BrokRentInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 默认数据
    form: PropTypes.object, // form
  };

  static defaultProps = {
    detail: {}, // 默认为空
    form: {},
  };

  constructor() {
    super();
    this.state = {
      lostMoney: 0, // 押金损失
      lostMoneyTax: 0, // 押金损失税金
    };
  }

  // 修改退回押金
  onChangeReturnMoney = (val) => {
    // 房屋详情
    const { detail } = this.props;
    // 押金金额
    const { unrefundedPledgeMoney } = detail;

    // 押金损失
    const lostMoney = Unit.exchangePriceToYuan(unrefundedPledgeMoney) - val;

    // 押金损失税金
    const lostMoneyTax = lostMoney * 0.045;

    this.setState({
      lostMoney, // 押金损失
      lostMoneyTax, // 押金损失税金
    });
  }

  // 断租日期要在合同结束日期之前
  disabledDate = (value) => {
    const { detail } = this.props;

    const {
      contractEndDate, // 合同结束时间
    } = detail;

    // 断租时间在今天起（不包括今天）至合同结束日期区间
    return value >= moment(String(contractEndDate)) || value < moment(new Date());
  }

  // 渲染断租信息
  renderBrokRentInfo = () => {
    // 房屋详情
    const { detail, form } = this.props;

    const {
      lostMoney, // 押金损失
      lostMoneyTax, // 押金损失税金
    } = this.state;

    const { getFieldDecorator } = form;

    const {
      unrefundedPledgeMoney, // 退回押金
      contractEndDate, // 房屋租期结束时间（断租时间）
    } = detail;

    // 退回押金
    const brokDeposit = [
      {
        label: '退回押金',
        form: getFieldDecorator('returnPledgeMoney', {
          initialValue: Unit.exchangePriceToYuan(unrefundedPledgeMoney),
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            max={Unit.exchangePriceToYuan(unrefundedPledgeMoney)}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeReturnMoney}
          />,
        ),
      },
    ];

    // 损失押金
    const lostDeposit = [
      {
        label: '押金损失',
        form: lostMoney,
      },
      {
        label: '押金损失税金',
        form: lostMoneyTax,
      },
    ];

    // 断租信息
    const formItems = [
      {
        label: '退回租金',
        form: getFieldDecorator('returnRentMoney', {
          initialValue: 0,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '断租时间',
        form: getFieldDecorator('updateTime', {
          initialValue: moment(String(contractEndDate)).subtract('days', 1),
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <DatePicker
            format="YYYY-MM-DD"
            showToday={false}
            disabledDate={this.disabledDate}
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <CoreContent title="断租信息">
        <DeprecatedCoreForm
          items={brokDeposit}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={lostDeposit}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderBrokRentInfo();
  }
}

export default BrokRentInfo;
