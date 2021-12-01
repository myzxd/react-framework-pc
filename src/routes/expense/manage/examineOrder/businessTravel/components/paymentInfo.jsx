/**
 * 收款信息
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Input } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';


class PaymentInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 收款信息
  renderPaymentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const payeeInfo = dot.get(this.props, 'payeeInfo', {});
    const formItems = [
      {
        label: '收款人',
        form: getFieldDecorator('payee', {

          initialValue: dot.get(payeeInfo, 'card_name', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款人" />,
      ),
      }, {
        label: '收款账号',
        form: getFieldDecorator('payeeAccount', {
          initialValue: dot.get(payeeInfo, 'card_num', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款账号" />,
        ),
      }, {
        label: '开户支行',
        form: getFieldDecorator('bankName', {
          initialValue: dot.get(payeeInfo, 'bank_details', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写开户支行" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息" style={{ backgroundColor: '#fff' }}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 收款信息 */}
        {this.renderPaymentInfo()}
      </div>
    );
  }
}


export default PaymentInfo;
