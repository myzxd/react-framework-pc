/**
 * 费用信息 - 差旅费用明细
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { InputNumber } from 'antd';

import { Unit } from '../../../../../../../application/define';


class Detaileditems extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: props.value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: dot.get(props, 'value', {}),
    };
  }

  // 补助
  onChangeSubsidyFee = (e) => {
    const { value } = this.state;
    value.subsidy_fee = e;
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 住宿
  onChangeStayFee = (e) => {
    const { value } = this.state;
    value.stay_fee = e;
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 往返交通费
  onChangeTransportFee = (e) => {
    const { value } = this.state;
    value.transport_fee = e;
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 市内交通费
  onChangeurBanTransportFee = (e) => {
    const { value } = this.state;
    value.urban_transport_fee = e;
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 其他
  onChangeOtherFee = (e) => {
    const { value } = this.state;
    value.other_fee = e;
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  triggerChange =(changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state.value, changedValue));
    }
  }

  // 明细
  renderDetailed = () => {
    const { value } = this.state;
    const formItem = [
      {
        label: '补助(元)',
        style: { marginRight: 10 },
        form: (
          <InputNumber
            value={value.subsidy_fee}
            onChange={this.onChangeSubsidyFee}
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />
        ),
      },
      {
        label: '住宿(元)',
        style: { marginRight: 10 },
        form: (
          <InputNumber
            value={value.stay_fee}
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeStayFee}
          />
        ),
      },
      {
        label: '往返交通费(元)',
        style: { marginRight: 10 },
        form: (
          <InputNumber
            value={value.transport_fee}
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeTransportFee}
          />
        ),
      },
      {
        label: '市内交通费(元)',
        style: { marginRight: 10 },
        form: (
          <InputNumber
            value={value.urban_transport_fee}
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeurBanTransportFee}
          />
        ),
      },
      {
        label: '其他(元)',
        form: (
          <InputNumber
            value={value.other_fee}
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeOtherFee}
          />
        ),
      },
    ];
    return (
      <div>
        {formItem.map((val, index) => {
          return (
            <span key={index} style={val.style}>{val.label}: {val.form}</span>
          );
        })}

      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 明细 */}
        {this.renderDetailed()}
      </div>
    );
  }
}


export default Detaileditems;
