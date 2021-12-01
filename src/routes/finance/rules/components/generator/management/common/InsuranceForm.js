/**
 * 服务费规则生成 - 管理组件 - 创建组件 - 保险扣款设置 - 公用表单 Finance/Rules/Generator
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InputNumber, Col, Input, Checkbox } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../../components/core';
import ComponentSalaryIndicators from '../../../common/salaryIndicators';
import { Unit } from '../../../../../../../application/define';

import styles from './style/index.less';

class ComponentInsuranceForm extends Component {
  static propTypes = {
    computeLogic: PropTypes.object, // 内容
    payrollMark: PropTypes.string,  // 对应列
  }
  static defaultProps = {
    computeLogic: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      indicatorName: '', // 指标名称
    };
  }

  componentDidMount = () => {
    // 初始化
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  // 获取指标名称
  onChangeSalaryIndicators = (e, unit, name) => {
    this.setState({
      indicatorName: name,
    });
  }

  // 父级组件，创建成功清空指标名称
  onResetalaryIndicators = () => {
    this.setState({
      indicatorName: '',
    });
  }

  // 改变按天扣款
  onChangeCheckboxDayFlag = (e) => {
    const checked = e.target.checked;
    const { setFieldsValue } = this.props.form;
    let { indicatorName } = this.state;
    if (checked === false) {
      // 统计指标
      setFieldsValue({ unitIndex: undefined });
      // 最小天数
      setFieldsValue({ unitAmount: undefined });
      // 保险扣款金额
      setFieldsValue({ unitMoney: '' });
      indicatorName = '';
    }
    this.setState({
      indicatorName,
    });
  }

  // 改变按月扣款
  onChangeCheckboxMonthFlag = (e) => {
    const checked = e.target.checked;
    const { setFieldsValue } = this.props.form;
    if (checked === false) {
      // 扣款金额
      setFieldsValue({ decMoney: undefined });
    }
  }

  // 渲染结算单对应列
  renderPayrollMark = () => {
    const { getFieldDecorator } = this.props.form;
    const { disabled } = this.props;
    const { payrollMark } = this.props;
    const formItem = [
      {
        label: '结算单对应列',
        form: getFieldDecorator('payrollMark', {
          initialValue: payrollMark,
        })(
          <Input placeholder="请输入结算单对应列(可选)" disabled={disabled} />,
          ),
      },
    ];
    return (
      <div className={styles['app-comp-finance-management-insurace-form-pay-roll-mark']}>
        <DeprecatedCoreForm items={formItem} cols={4} />
      </div>
    );
  }

  // 按天扣款
  renderDayDeduction = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { tags, platformCode, disabled, computeLogic } = this.props;
    const { indicatorName } = this.state;
    const { unitIndex, unitMoney, unitAmount } = computeLogic.params || {};
    const bizLogic = computeLogic.bizLogic ? computeLogic.bizLogic : [];
    const dayFlag = bizLogic.indexOf('dec_logic_by_day') !== -1;
    const disabledDayFlag = getFieldValue('dayFlag');
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('dayFlag', {
          valuePropName: 'checked',
          initialValue: dayFlag,
        })(<Checkbox
          disabled={disabled}
          onChange={this.onChangeCheckboxDayFlag}
        >按天扣款</Checkbox>),
      },
      {
        label: '统计指标',
        span: 5,
        form: getFieldDecorator('unitIndex', {
          initialValue: unitIndex || undefined,
          rules: [{ required: disabledDayFlag, message: '请选择统计指标' }],
        })(
          <ComponentSalaryIndicators
            className={styles['app-comp-finance-management-insurace-form-width']}
            disabled={!disabledDayFlag || disabled}
            tagList={[tags]}
            onChange={this.onChangeSalaryIndicators}
            platformCode={platformCode}
          />,
        ),
      },
      {
        label: '最小天数',
        span: 5,
        form: getFieldDecorator('unitAmount', {
          initialValue: unitAmount,
          rules: [{ required: disabledDayFlag, message: '请选择最小天数' }],
        })(
          <InputNumber
            className={styles['app-comp-finance-management-insurace-form-width']}
            precision={0}
            min={1}
            max={31}
            disabled={!disabledDayFlag || disabled}
            placeholder="请输入"
            formatter={value => `${value}天`}
            parser={value => value.replace('天', '')}
          />,
        ),
      },
      {
        label: (<span>保险扣款 = {indicatorName} X</span>),
        colon: false,
        span: 10,
        layout: { labelCol: { span: 14 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('unitMoney', {
          initialValue: unitMoney,
          rules: [{ required: disabledDayFlag, message: '请选择' }],
        })(
          <InputNumber
            placeholder="请输入"
            step={0.01}
            min={0}
            disabled={!disabledDayFlag || disabled}
            formatter={value => `${Unit.limitDecimals(value)}元`}
            parser={value => Unit.limitDecimals(value.replace('元', ''))}
          />,
        ),
      },
    ];
    return (
      <Col>
        <DeprecatedCoreForm items={formItems} cols={6} />
      </Col>
    );
  }

  // 按月扣款
  renderMonthDeduction = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { disabled } = this.props;
    const { computeLogic } = this.props;
    const { decMoney } = computeLogic.params || {};
    const bizLogic = computeLogic.bizLogic ? computeLogic.bizLogic : [];
    const monthFlag = bizLogic.indexOf('dec_logic_by_once') !== -1;
    const disabledMonthFlag = getFieldValue('monthFlag');
    return (
      <div>
        {getFieldDecorator('monthFlag', {
          valuePropName: 'checked',
          initialValue: monthFlag,
        })(
          <Checkbox
            disabled={disabled}
            onChange={this.onChangeCheckboxMonthFlag}
          >按月固定扣款，扣款</Checkbox>,
          )}
        {getFieldDecorator('decMoney', {
          initialValue: decMoney,
        })(
          <InputNumber
            placeholder="请输入"
            step={0.01}
            min={0}
            disabled={disabled || !disabledMonthFlag}
            formatter={value => `${Unit.limitDecimals(value)}元`}
            parser={value => Unit.limitDecimals(value.replace('元', ''))}
          />,
        )}
      </div>
    );
  }

  render = () => {
    return (
      <div>
        {/* 按天扣款 */}
        {this.renderDayDeduction()}

        {/* 按月扣款 */}
        {this.renderMonthDeduction()}

        {/* 渲染结算单对应列 */}
        {this.renderPayrollMark()}

      </div>
    );
  }
}

export default ComponentInsuranceForm;
