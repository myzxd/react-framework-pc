/**
 * 费用信息
 */
import dot from 'dot-prop';
import is from 'is_js';
import React, { Component } from 'react';
import { InputNumber, Select } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../../components/core';
import { Unit } from '../../../../../../../application/define';
import Detaileditems from './item';

const { Option } = Select;

class Cost extends Component {

  // 校验差旅费用明细
  checkDetaileditems = (rule, value, callback) => {
    if (is.existy(value) && is.not.empty(value)) {
      // every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true
      const flag = Object.values(value).every((v) => {
        return is.existy(v) && is.not.empty(v);
      });
      if (flag === true && Object.values(value).length === 5) {
        callback();
        return;
      } else {
        callback('差旅费用明细请填写完整');
      }
    }
    callback('请填写差旅费用明细');
  }

  // 费用信息
  renderRentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const detail = dot.get(this.props, 'detail', {});
    const formItems = [
      {
        label: '费用金额(元)',
        form: getFieldDecorator('money', {
          initialValue: detail.totalMoney >= 0 ?
          Unit.exchangePriceToYuan(detail.totalMoney) : undefined,
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <InputNumber
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      }, {
        label: '是否开票',
        form: getFieldDecorator('hasInvoice', {
          initialValue: detail.invoiceFlag ? '1' : '0',
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择是否开票">
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>,
        ),
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 明细
  renderDetailed = () => {
    const { getFieldDecorator } = this.props.form;
    const detail = dot.get(this.props, 'detail', {});
    // 差旅费用明细默认值
    const defaultValue = {
      subsidy_fee: 0, // 补助(元)
      stay_fee: 0, // 住宿(元)
      transport_fee: 0, // 往返交通费(元)
      urban_transport_fee: 0, // 市内交通费(元)
      other_fee: 0, // 其他(元)
    };
    const formItem = [
      {
        label: '差旅费用明细',
        form: getFieldDecorator('bizExtraData', {
          initialValue: { ...defaultValue, ...detail.bizExtraData },
          rules: [{ required: true, validator: this.checkDetaileditems }],
        })(
          <Detaileditems />,
        ),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <DeprecatedCoreForm items={formItem} layout={layout} />
    );
  }

  render() {
    return (
      <CoreContent title="费用信息">
        {/* 费用信息 */}
        {this.renderRentInfo()}

        {/* 明细 */}
        {this.renderDetailed()}
      </CoreContent>
    );
  }
}


export default Cost;
