/**
 * 单选框气泡选择组件
 */
import React, { Component } from 'react';
import { Popconfirm, Radio } from 'antd';
import PropTypes from 'prop-types';

import styles from './style/index.less';

const RadioGroup = Radio.Group;

class PopoverRadio extends Component {
  static propTypes = {
    compareTypeProps: PropTypes.string,  // 比较方式（props）
    disabled: PropTypes.bool,            // 是否禁用
    onChange: PropTypes.func,            // 点击确定的回调（更改比较方式）
  }

  static defaultProps = {
    disabled: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      compareType: props.compareTypeProps || '<=',  // 比较方式
    };
  }

  // 选择比较形式
  changeCompareType = () => {
    const { compareType } = this.state;
    const { onChange } = this.props;
    if (onChange) {
      onChange(compareType);
    }
  }

  // 改变state比较方式
  changeStateCompareType = (e) => {
    this.setState({
      compareType: e.target.value,
    });
  }

  renderPopover = () => {
    const { compareType } = this.state;
    const { compareTypeProps, disabled } = this.props;
    if (disabled) {
      return (
        <div className={styles['app-comp-finance-popover-radio-disabled']}>
          <span>{compareTypeProps}</span>
        </div>
      );
    }
    return (
      <Popconfirm
        className=":global"
        title={<RadioGroup value={compareType} onChange={this.changeStateCompareType}>
          <Radio className={styles['app-comp-finance-popover-radio-radio1']} value="<=">{'<='}</Radio>
          <Radio className={styles['app-comp-finance-popover-radio-radiodb']} value="<">{'<'}</Radio>
        </RadioGroup>}
        onConfirm={this.changeCompareType}
      >
        <div className={styles['app-comp-finance-popover-radiop-content']}>
          <span>{compareTypeProps}</span>
        </div>
      </Popconfirm>
    );
  }

  render() {
    return (
      <div>
        {this.renderPopover()}
      </div>
    );
  }
}

export default PopoverRadio;
