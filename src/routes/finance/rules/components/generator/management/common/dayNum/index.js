/**
 * 服务费规则生成 - 管理组件 - 公用组件 - 天数组件 Finance/Rules/Generator
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Popconfirm, Radio } from 'antd';

import { DeprecatedCoreForm } from '../../../../../../../../components/core';
import { FinanceSalaryDayState } from '../../../../../../../../application/define';
import styles from './style/index.less';

const RadioGroup = Radio.Group;

class ComponentDayNum extends Component {
  static propTypes = {
    compareItem: PropTypes.string, // 天数
  }
  static defaultProps = {
    compareItem: FinanceSalaryDayState.attendanceDays,
  }

  // 确定
  onConfirmCompareItem = () => {
    const { onConfirm } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (onConfirm) {
        onConfirm(values.compareItem);
      }
    });
  }

  // 天数
  renderRadioGroup = () => {
    const { getFieldDecorator } = this.props.form;
    const { compareItem } = this.props;
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('compareItem', { initialValue: compareItem })(
          <RadioGroup>
            <Radio className={styles['app-comp-finance-radio-style']} value={FinanceSalaryDayState.attendanceDays}>{FinanceSalaryDayState.description(FinanceSalaryDayState.attendanceDays)}</Radio>
            <Radio className={styles['app-comp-finance-radio-style']} value={FinanceSalaryDayState.workDays}>{FinanceSalaryDayState.description(FinanceSalaryDayState.workDays)}</Radio>
          </RadioGroup>,
        ),
      },
    ];
    return <DeprecatedCoreForm items={formItems} />;
  }

  // 渲染天数组件
  renderIsPopconfirm = () => {
    const { compareItem } = this.props;
    const { disabled } = this.props;
    if (disabled) {
      return (
        <span>{FinanceSalaryDayState.description(compareItem)}</span>
      );
    }
    return (
      <Popconfirm className=":global" title={this.renderRadioGroup()} onConfirm={this.onConfirmCompareItem}>
        <span className={styles['app-comp-finance-compare-type']}>{FinanceSalaryDayState.description(compareItem)}</span>
      </Popconfirm>
    );
  }

  render = () => {
    return (
      <span>
        {/* 渲染天数组件 */}
        { this.renderIsPopconfirm()}
      </span>
    );
  }
}


export default Form.create()(ComponentDayNum);
