/**
 * 付款方式 - 自定义表单
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

import style from './style.css';

class CustomizeRenew extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    form: PropTypes.object,
    isCreate: PropTypes.bool,
    disabled: PropTypes.bool,
    firstRentCycle: PropTypes.array,
  }

  static defaultProps = {
    onChange: () => {},
    form: {},
    isCreate: false,
    disabled: false,
    firstRentCycle: [],
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      betting: value.betting || 0,
      pay: value.pay || 0,
    };
  }

  // 修改 押
  onChangeBetting = (val) => {
    const { onChange, form, isCreate } = this.props;
    const { pay } = this.state;

    // 新建房屋合同时，计算填充押金
    if (isCreate) {
      // form方法
      const { getFieldsValue, setFieldsValue } = form;

      // 月租总金额
      const monthMoney = getFieldsValue(['monthMoney']).monthMoney;

      // 月租金有值，计算押金金额：押的月数 * 月租金;否则重置为空
      monthMoney && val
        ? setFieldsValue({ pledgeMoney: monthMoney * val })
        : setFieldsValue({ pledgeMoney: undefined });

      // （月租金为0 && 押数有值） || （月租金有值 && 押数为0）置为0
      if ((monthMoney === 0 && val) || (val === 0 && monthMoney)) {
        setFieldsValue({ pledgeMoney: 0 });
      }
    }

    if (!('value' in this.props)) {
      this.setState({
        betting: val,
        pay,
      });
    }

    onChange && onChange({ betting: val, pay });
  }

  // 修改 付
  onChangePay = (val) => {
    const { onChange, form } = this.props;
    const { betting } = this.state;

    const { setFieldsValue } = form;

    // 重置付款周期与付相同
    setFieldsValue({ periodMonthNum: val });

    if (!('value' in this.props)) {
      this.setState({
        betting,
        pay: val,
      });
    }

    onChange && onChange({ pay: val, betting });
  }

  // 渲染表单
  renderContent = () => {
    const { disabled, firstRentCycle } = this.props;

    // 表单值
    const { betting, pay } = this.state;

    // 付，是否禁用
    const isDisable = disabled && firstRentCycle.length === 0;

    return (
      <div>
        <span className={style['app-comp-expense-house-contract-from-customize']}>
          <span
            className={style['app-comp-expense-house-contract-from-customize']}
          >
            押
          </span>
          <InputNumber
            min={1}
            max={120}
            precision={0}
            value={betting}
            className={style['app-comp-expense-house-contract-from-payment']}
            disabled={disabled}
            onChange={this.onChangeBetting}
          />
        </span>
        <span>
          <span
            className={style['app-comp-expense-house-contract-from-customize']}
          >
            付
          </span>
          <InputNumber
            min={1}
            max={120}
            precision={0}
            value={pay}
            className={style['boss-expense-house-contract-from-pay']}
            disabled={isDisable}
            onChange={this.onChangePay}
          />
        </span>
      </div>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

export default CustomizeRenew;
