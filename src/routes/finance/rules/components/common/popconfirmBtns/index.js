/**
 * 服务费规则生成 - 公用气泡数量组件 Finance/Rules/Generator
 */
import PropTypes from 'prop-types';
import { Popconfirm, Radio } from 'antd';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { DeprecatedCoreForm } from '../../../../../../components/core';
import { Unit } from '../../../../../../application/define';
import styles from '../style/index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 选项数量
const RadioNum = 10;

class ComponentPopconfirmBtns extends Component {
  static propTypes = {
    num: PropTypes.number,   // 初始
    disabled: PropTypes.bool, // 是否禁用
  }
  static defaultProps = {
    num: 0,
    disabled: false,
  }

  // 确定
  onConfirmPopconfirm = () => {
    const { onConfirm } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (onConfirm) {
          onConfirm(values.num);
        }
      }
    });
  }

  // 渲染按钮
  renderBtns = () => {
    const { num, unit } = this.props;
    const { getFieldDecorator } = this.props.form;
    const radioDom = [];
    if (unit === Unit.mathPercent) {
      for (let i = 0; i < RadioNum; i += 1) {
        if (i < Math.floor(RadioNum / 2)) {
          radioDom.push(
            <RadioButton className={styles['app-comp-finance-pbtns-style']} key={i} value={Number(`0.${i + 1}`)}>{`0.${i + 1}`}</RadioButton>,
          );
        } else {
          radioDom.push(
            <RadioButton
              className={styles['app-comp-finance-pbtns-style']}
              key={i}
              value={(i + 1) - Math.floor(RadioNum / 2)}
            >
              {(i + 1) - Math.floor(RadioNum / 2)}
            </RadioButton>,
          );
        }
      }
    } else {
      for (let i = 0; i < RadioNum; i += 1) {
        radioDom.push(
          <RadioButton className={styles['app-comp-finance-pbtns-style']} key={i} value={i + 1}> {i + 1} </RadioButton>,
        );
      }
    }
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('num', { initialValue: num })(
          <RadioGroup className={styles['app-comp-finance-pbtns-radio-group-style']}>
            {radioDom}
          </RadioGroup>,
        ),
      },
    ];
    return <div className="app-global-componenth-width-percent100"><DeprecatedCoreForm items={formItems} cols={1} /></div>;
  }

  // 渲染Popconfirm
  renderPopconfirm = () => {
    const { num, disabled } = this.props;
    if (!disabled) {
      return (
        <Popconfirm
          className=":global"
          placement="topLeft"
          title={this.renderBtns()}
          okText="确定"
          cancelText="取消"
          onConfirm={this.onConfirmPopconfirm}
        >
          <span className={{ ...styles['app-comp-finance-component-mglr5'], ...styles['app-comp-finance-popover-radiop-content'] }}>{num}</span>
        </Popconfirm>
      );
    } else {
      return (
        <span className={styles['app-comp-finance-component-mglr5']}>{num}</span>
      );
    }
  }

  render = () => {
    return (
      <span>
        {/* 渲染Popconfirm   */}
        {this.renderPopconfirm()}
      </span>
    );
  }
}

export default Form.create()(ComponentPopconfirmBtns);
