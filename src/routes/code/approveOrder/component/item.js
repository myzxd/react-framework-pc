/**
 * 费用信息 - 差旅费用明细
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { InputNumber, Row, Col } from 'antd';

import { Unit } from '../../../../application/define';

class Detaileditems extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: dot.get(props, 'value', {}),
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
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.subsidy_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.subsidy_fee = Unit.maxMoney;
    }
    // 金额是否超标
    if (this.props.onChangeBizExtraDataIsOutMoney) {
      this.props.onChangeBizExtraDataIsOutMoney(value);
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 住宿
  onChangeStayFee = (e) => {
    const { value } = this.state;
    value.stay_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.stay_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.stay_fee = Unit.maxMoney;
    }
    // 金额是否超标
    if (this.props.onChangeBizExtraDataIsOutMoney) {
      this.props.onChangeBizExtraDataIsOutMoney(value);
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 往返交通费
  onChangeTransportFee = (e) => {
    const { value } = this.state;
    value.transport_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.transport_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.transport_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 市内交通费
  onChangeurBanTransportFee = (e) => {
    const { value } = this.state;
    value.urban_transport_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.urban_transport_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.urban_transport_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 其他
  onChangeOtherFee = (e) => {
    const { value } = this.state;
    value.other_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.other_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.other_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 动车/高铁交通费
  onChangehighSpeedRailMotorCarFee = (e) => {
    const { value } = this.state;
    value.high_speed_train_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.high_speed_train_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.high_speed_train_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 飞机交通费
  onChangeplaneFee = (e) => {
    const { value } = this.state;
    value.aircraft_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.aircraft_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.aircraft_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 普通软卧交通费
  onChangesoftSleeperFee = (e) => {
    const { value } = this.state;
    value.train_ordinary_soft_sleeper_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.train_ordinary_soft_sleeper_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.train_ordinary_soft_sleeper_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 客车交通费
  onChangepassengerCarFee = (e) => {
    const { value } = this.state;
    value.bus_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.bus_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.bus_fee = Unit.maxMoney;
    }
    this.setState({
      value,
    });
    this.triggerChange({ ...value });
  }

  // 自驾交通费
  onChangedriveFee = (e) => {
    const { value } = this.state;
    value.self_driving_fee = e;
    // 判断是否存在，不存在为0
    if (is.not.existy(e) || is.empty(e)) {
      value.self_driving_fee = 0;
    }
    // 判断金额是否大于最大金额
    if (e > Unit.maxMoney) {
      value.self_driving_fee = Unit.maxMoney;
    }
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
    const { value = {} } = this.state;
    const {
      isTransportFee,
      isHighSpeedRailMotorCarFee,
      isplaneFee,
      issoftSleeperFee,
      ispassengerCarFee,
      isdriveFee,
      subsidyFeeVisible,
      stayFeeVisible,
    } = this.props;
    const formItem = [
      {
        label: '补助(元)',
        form: (
          <InputNumber
            value={value.subsidy_fee}
            style={{ width: '100%', color: subsidyFeeVisible ? 'red' : '' }}
            onChange={this.onChangeSubsidyFee}
            min={0}
            step={0.01}
            max={Unit.maxMoney}
            formatter={Unit.maxMoneyLimitDecimalsFormatter}
            parser={Unit.limitDecimalsParser}
          />
        ),
      },
      {
        label: '住宿(元)',
        form: (
          <InputNumber
            value={value.stay_fee}
            style={{ width: '100%', color: stayFeeVisible ? 'red' : '' }}
            min={0}
            step={0.01}
            max={Unit.maxMoney}
            formatter={Unit.maxMoneyLimitDecimalsFormatter}
            parser={Unit.limitDecimalsParser}
            onChange={this.onChangeStayFee}
          />
        ),
      },
      {
        label: '市内交通费(元)',
        form: (
          <InputNumber
            value={value.urban_transport_fee}
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            max={Unit.maxMoney}
            formatter={Unit.maxMoneyLimitDecimalsFormatter}
            parser={Unit.limitDecimalsParser}
            onChange={this.onChangeurBanTransportFee}
          />
        ),
      },
    ];
    if (isHighSpeedRailMotorCarFee) {
      formItem.push(
        {
          label: '动车/高铁交通费(元)',
          form: (
            <InputNumber
              value={value.high_speed_train_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangehighSpeedRailMotorCarFee}
            />
          ),
        },
      );
    }
    if (isplaneFee) {
      formItem.push(
        {
          label: '飞机交通费(元)',
          form: (
            <InputNumber
              value={value.aircraft_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangeplaneFee}
            />
          ),
        },
      );
    }
    if (issoftSleeperFee) {
      formItem.push(
        {
          label: '普通软卧交通费(元)',
          form: (
            <InputNumber
              value={value.train_ordinary_soft_sleeper_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangesoftSleeperFee}
            />
          ),
        },
      );
    }
    if (ispassengerCarFee) {
      formItem.push(
        {
          label: '客车交通费(元)',
          form: (
            <InputNumber
              value={value.bus_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangepassengerCarFee}
            />
          ),
        },
      );
    }
    if (isdriveFee) {
      formItem.push(
        {
          label: '自驾交通费(元)',
          form: (
            <InputNumber
              value={value.self_driving_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangedriveFee}
            />
          ),
        },
      );
    }
    if (isTransportFee) {
      formItem.push(
        {
          label: '往返交通费(元)',
          form: (
            <InputNumber
              value={value.transport_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangeTransportFee}
            />
          ),
        },
      );
    }
    // 判断历史数据其他是否有金额，有的话可编辑
    if (value.other_fee) {
      formItem.push(
        {
          label: '其他(元)',
          form: (
            <InputNumber
              value={value.other_fee}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              max={Unit.maxMoney}
              formatter={Unit.maxMoneyLimitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              onChange={this.onChangeOtherFee}
            />
          ),
        },
      );
    }
    return (
      <Row>
        {formItem.map((val, index) => {
          return (
            <Col
              key={index}
              span={6}
              style={{
                marginTop: index >= 4 ? 10 : 0,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            ><div>{val.label}：</div><div>{val.form}</div>
            </Col>
          );
        })}
      </Row>
    );
  }

  render() {
    const { id } = this.props;
    return (
      <div id={id} style={{ marginLeft: 10 }}>
        {/* 明细 */}
        {this.renderDetailed()}
      </div>
    );
  }
}


export default Detaileditems;
