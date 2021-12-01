/**
 * 房屋管理 / 新建(编辑) / 付款方式
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import CustomizeRenew from './customizeRenew';

class Renew extends Component {

  static propTypes = {
    form: PropTypes.object,
    isCreate: PropTypes.bool,
    houseContractDetail: PropTypes.object, // 房屋详情数据
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    form: {},
    houseContractDetail: {}, // 默认为空
    isCreate: false,
    disabled: false,
  }

  // 自定义表单校验
  onVerify = (rule, value, callback) => {
    if (value.pay && (value.betting === 0 || value.betting)) {
      callback();
      return;
    }
    callback('请选择');
  }

  renderRenew = () => {
    const { form = {}, isCreate, houseContractDetail = {}, disabled } = this.props;
    const { paymentMethodPledge = undefined, paymentMethodRent = undefined, firstRentCycle = [] } = houseContractDetail;
    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '付款方式',
        form: getFieldDecorator('paymentMethod', {
          initialValue: { betting: paymentMethodPledge ? paymentMethodPledge : 1, pay: paymentMethodRent ? paymentMethodRent : 1 },
          rules: [{ required: true, validator: this.onVerify }],
        })(
          <CustomizeRenew
            form={form}
            isCreate={isCreate}
            disabled={disabled}
            firstRentCycle={firstRentCycle}
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
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="付款方式">

        {/* 渲染费用信息 */}
        {this.renderRenew()}
      </CoreContent>
    );
  }
}

export default Renew;
