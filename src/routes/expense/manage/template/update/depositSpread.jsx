/**
 * 押金差价
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

import style from './style.css';

class DepositSpread extends Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
  }

  constructor() {
    super();
    this.state = {};
  }

  onChange = (val) => {
    const { onChange } = this.props;
    onChange && onChange(val);
  }

  render = () => {
    return (
      <div>
        <InputNumber
          value={this.props.value}
          disabled
          onChange={this.onChange}
          formatter={value => `${value}元`}
          parser={value => value.replace('元', '')}
        />
        <span
          className={style['app-comp-expense-manage-template-deposit-spread']}
        >
          此处为续签合同后未付款的押金差价
        </span>
      </div>
    );
  }
}

export default DepositSpread;
