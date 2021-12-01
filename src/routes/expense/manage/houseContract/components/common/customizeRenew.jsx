/**
 * 付款方式 - 自定义表单（无运算逻辑）
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
  }

  static defaultProps = {
    onChange: () => {},
    form: {},
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
    const { onChange } = this.props;
    const { pay } = this.state;

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
    const { onChange } = this.props;
    const { betting } = this.state;

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
    // 表单值
    const { betting, pay } = this.state;

    return (
      <div>
        <span className={style['app-comp-expense-house-contract-from-customize']}>
          <span
            className={style['app-comp-expense-house-contract-from-customize']}
          >
            押
          </span>
          <InputNumber
            min={0}
            max={12}
            precision={0}
            value={betting}
            className={style['app-comp-expense-house-contract-from-payment']}
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
            className={style['app-comp-expense-house-contract-from-payment']}
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
