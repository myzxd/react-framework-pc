/**
 * 单选框气泡选择组件
 */
import React, { Component } from 'react';
import { Popconfirm, Radio } from 'antd';
import PropTypes from 'prop-types';

import { TimeCycle } from '../../../../../../application/define';

import style from './style.less';

const RadioGroup = Radio.Group;

class PopconfirmRadio extends Component {
  static propTypes = {
    value: PropTypes.string,   // 时间周期
    disabled: PropTypes.bool,           // 是否禁用
    onChange: PropTypes.func,           // 更改表单值的回调（自定义表单onChange）
    onChangePopconfirm: PropTypes.func, // 父组件监听点击确定事件
  }

  static defaultProps = {
    value: `${TimeCycle.year}`,
    disabled: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      timeCycle: props.value,  // 时间周期
    };
  }

  // 选择时间周期
  changeTimeType = () => {
    const { timeCycle } = this.state;
    const { onChange, onChangePopconfirm } = this.props;
    if (onChange) {
      onChange(timeCycle);
    }
    if (onChangePopconfirm) {
      onChangePopconfirm(timeCycle);
    }
  }

  // 改变state时间周期
  changeStateTimeCycle = (e) => {
    this.setState({
      timeCycle: e.target.value,
    });
  }

  renderPopconfirm = () => {
    const { timeCycle } = this.state;
    const { value, disabled } = this.props;
    if (disabled) {
      return (
        <div className={style.compareTypeDisabled}>
          <span>{TimeCycle.description(value)}</span>
        </div>
      );
    }
    return (
      <Popconfirm
        icon={''}
        className=":global"
        title={<RadioGroup value={timeCycle} onChange={this.changeStateTimeCycle}>
          <Radio className={style['app-comp-employee-manage-form-components-common-popconfirm']} value={`${TimeCycle.year}`}>{TimeCycle.description(TimeCycle.year)}</Radio>
          <Radio className={style['app-comp-employee-manage-form-components-common-popconfirm']} value={`${TimeCycle.month}`}>{TimeCycle.description(TimeCycle.month)}</Radio>
          <Radio className={style['app-comp-employee-manage-form-components-popconfirm-button']} value={`${TimeCycle.day}`}>{TimeCycle.description(TimeCycle.day)}</Radio>
        </RadioGroup>}
        onConfirm={this.changeTimeType}
      >
        <div className={style['app-comp-employee-compareType']}>
          <span>{TimeCycle.description(value)}</span>
        </div>
      </Popconfirm>
    );
  }

  render() {
    return (
      <div>
        {this.renderPopconfirm()}
      </div>
    );
  }
}

export default PopconfirmRadio;
