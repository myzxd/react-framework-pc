/**
 * 费用管理 / 房屋管理 / 退租编辑 / 续租信息
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputNumber,
} from 'antd';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';

import { Unit } from '../../../../../../../application/define';

class WithdrawalInfo extends Component {

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
    // 未退押金
    const { unrefundedPledgeMoney } = detail;
    // 押金损失
    const lostMoney = Unit.exchangePriceToYuan(unrefundedPledgeMoney) - val;

    // 押金损失税金
    const lostMoneyTax = lostMoney * 0.045;

    this.setState({
      lostMoney, // 押金损失
      lostMoneyTax: lostMoneyTax.toFixed(2), // 押金损失税金
    });
  }

  // 渲染退租信息
  renderWithdrawalInfo = () => {
    // 房屋详情
    const { detail } = this.props;

    const {
      lostMoney, // 押金损失
      lostMoneyTax, // 押金损失税金
    } = this.state;

    const { getFieldDecorator } = this.props.form;

    const {
      unrefundedPledgeMoney, // 退还押金（分）
      contractEndDate, // 房屋租期结束时间（退租时间）
    } = detail;

    // 退回押金
    const pledgeMoneyForm = [
      {
        label: '退回押金',
        form: getFieldDecorator('returnPledgeMoney',
          {
            initialValue: Unit.exchangePriceToYuan(unrefundedPledgeMoney),
            rules: [{ required: true, message: '请填写内容' }],
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

    // 押金损失
    const lostMoneyForm = [
      {
        label: '押金损失',
        form: lostMoney,
      },
      {
        label: '押金损失税金',
        form: lostMoneyTax,
      },
    ];

    // 退租时间
    const updateTimeForm = [
      {
        label: '退租时间',
        form: moment(`${contractEndDate}`).format('YYYY-MM-DD'),
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
      <CoreContent title="退租信息">
        <DeprecatedCoreForm
          items={pledgeMoneyForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={lostMoneyForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={updateTimeForm}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderWithdrawalInfo();
  }
}

export default WithdrawalInfo;
