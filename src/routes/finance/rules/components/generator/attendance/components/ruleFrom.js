/**
 * 服务费规则生成 - 出勤组件 - 公用表单
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Select, Checkbox, InputNumber, Input } from 'antd';
import ComponentOrderType from '../../../common/orderType';
import { DeprecatedCoreForm } from '../../../../../../../components/core';
import ComponentPopconfirmBtns from '../../../common/popconfirmBtns/index';
import ComponentSalaryIndicators from '../../../common/salaryIndicators';
import {
  FinanceRulesGeneratorStep,
  FinanceSalaryTotalSubsidies,
  FinanceSalaryMeetConditions,
  FinanceMatchFiltersValue,
  Unit,
} from '../../../../../../../application/define';

import styles from '../../../common/style/index.less';

const Option = Select.Option;
const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.second;

class RuleFromComponent extends Component {

  static propTypes = {
    computeLogic: PropTypes.object, // 内容
    matchFilters: PropTypes.array, // 内容
    payrollMark: PropTypes.string,   // 对应列
  }

  static defaultProps = {
    computeLogic: {}, // 内容
    matchFilters: [], // 内容
    payrollMark: '',   // 对应列
  }

  constructor(props) {
    super(props);
    this.state = {
      totalFlag: true, // 总额补贴动态校验
      singleFlag: true, // 按单补贴动态校验
      salaryFlag: true, // 底薪补贴动态校验
    };
  }

  // 是否可编辑不满足
  onChangeAutoDecOption = (e) => {
    const checked = e.target.checked;
    const { computeLogic } = this.props;
    const { setFieldsValue } = this.props.form;
    if (checked === false) {
      setFieldsValue({ unitIndex: '' });
      setFieldsValue({ decMinAmount: '' });
      setFieldsValue({ decUnitMoney: '' });
      computeLogic.byOnceParams.decUnitAmount = 1;
      this.setState({
        computeLogic,
      });
    }
  }

  // 改变天
  onConfirmBtnDay = (decUnitAmount) => {
    const { computeLogic } = this.props;
    const { onConfirmBtnDay } = this.props;
    computeLogic.byOnceParams.decUnitAmount = decUnitAmount;
    this.setState({
      computeLogic,
    });
    if (onConfirmBtnDay) {
      onConfirmBtnDay(decUnitAmount);
    }
  }

  // 改变每X单
  onConfirmIncUnitAmount = (e) => {
    const { computeLogic } = this.props;
    const { onConfirmIncUnitAmount } = this.props;
    computeLogic.byOrderUnitParams.incUnitAmount = e;
    this.setState({
      computeLogic,
    });
    if (onConfirmIncUnitAmount) {
      onConfirmIncUnitAmount(e);
    }
  }

  // 改变补贴方式
  onChangeBizLogic = (e) => {
    const { computeLogic } = this.props;
    computeLogic.bizLogic = e;
    const { setFieldsValue } = this.props.form;
    let { totalFlag, singleFlag, salaryFlag } = this.state;
    // 总额补贴
    if (e === FinanceSalaryTotalSubsidies.workLogicByOnce) {
      computeLogic.byOnceParams.decUnitAmount = 1;
      computeLogic.byOrderUnitParams.incUnitAmount = 0;
      totalFlag = true;
      singleFlag = false;
      salaryFlag = false;
      setFieldsValue({ minAmount: '' });
      setFieldsValue({ orderVarCount: '' });
      setFieldsValue({ incUnitMoney: '' });
      setFieldsValue({ salaryIncMoney: '' });
    }
    // 按单补贴
    if (e === FinanceSalaryTotalSubsidies.workLogicByOrderUnit) {
      computeLogic.byOnceParams.decUnitAmount = 0;
      computeLogic.byOrderUnitParams.incUnitAmount = 1;
      totalFlag = false;
      singleFlag = true;
      salaryFlag = false;
      setFieldsValue({ onceMoney: '' });
      setFieldsValue({ autoDecOption: false });
      setFieldsValue({ unitIndex: '' });
      setFieldsValue({ decMinAmount: '' });
      setFieldsValue({ salaryIncMoney: '' });
      setFieldsValue({ decUnitMoney: '' });
    }
    // 底薪补贴
    if (e === FinanceSalaryTotalSubsidies.workLogicBySalaryBase) {
      computeLogic.byOnceParams.decUnitAmount = 0;
      computeLogic.byOrderUnitParams.incUnitAmount = 0;
      totalFlag = false;
      singleFlag = false;
      salaryFlag = true;
      setFieldsValue({ incUnitMoney: '' });
      setFieldsValue({ decMinAmount: '' });
      setFieldsValue({ autoDecOption: false });
      setFieldsValue({ unitIndex: '' });
      setFieldsValue({ salaryIncMoney: '' });
      setFieldsValue({ decUnitMoney: '' });
      setFieldsValue({ onceMoney: '' });
      setFieldsValue({ minAmount: '' });
      setFieldsValue({ orderVarCount: '' });
    }
    this.setState({
      computeLogic, // 补贴方式
      totalFlag,   // 总额补贴动态校验
      singleFlag,   // 按单补贴动态校验
      salaryFlag,   // 底薪补贴动态校验
    });
  }

  // 渲染额外的表单
  renderRuleFrom = () => {
    // 绑定表单使用
    const { getFieldDecorator } = this.props.form;
    const { disabled, platformCode } = this.props;
    const { matchFilters } = this.props;
    const tags = [CurrentFinanceRulesGeneratorStep];
    const orderVars = FinanceMatchFiltersValue.description(matchFilters, '', true);
    const len = orderVars.length >= 0 ? orderVars.length - 1 : 0;
    const rules = dot.get(orderVars, `${len}.groupFilters`, []);
    const matchType = dot.get(orderVars, `${len}.groupMatch`, FinanceSalaryMeetConditions.meetAll);
    const layout = { indicators: 6, symbol: 3, num: 3 };
    const formItems = [
      {
        label: '满足条件',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('orderVars', {
          initialValue: { matchType, rules: rules || [{}] } })(
            <ComponentOrderType tags={tags} disabled={disabled} platformCode={platformCode} layout={layout} />,
        ),
      },
    ];
    return <DeprecatedCoreForm items={formItems} cols={1} />;
  }

  // 总额补贴
  renderTotalFore = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { totalFlag } = this.state;
    const { disabled, platformCode, computeLogic } = this.props;
    const byOnceParams = computeLogic.byOnceParams ? computeLogic.byOnceParams : {};
    const autoDecOption = byOnceParams.autoDecOption;
    const decUnitMoney = byOnceParams.decUnitMoney >= 0 ? Unit.exchangePriceToYuan(byOnceParams.decUnitMoney) : undefined;
    const onceMoney = byOnceParams.onceMoney >= 0 ? Unit.exchangePriceToYuan(byOnceParams.onceMoney) : undefined;
    const disabledAutoDecOption = getFieldValue('autoDecOption');
    const formItems = [
      {
        label: '一次性补贴',
        span: 6,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: getFieldDecorator('onceMoney', {
          initialValue: onceMoney,
          rules: [{ required: totalFlag, message: '请选择' }] })(
            <InputNumber
              className={styles['app-comp-finance-attendance-rule-from']}
              disabled={disabled}
              placeholder="请输入"
              step={0.01}
              min={0}
              formatter={value => `${Unit.limitDecimals(value)}元`}
              parser={value => Unit.limitDecimals(value.replace('元', ''))}
            />,
          ),
      },
      {
        label: '',
        span: 1,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 1, push: 6 } },
        form: getFieldDecorator('autoDecOption', {
          valuePropName: 'checked',
          initialValue: autoDecOption,
        })(
          <Checkbox
            disabled={disabled}
            onChange={this.onChangeAutoDecOption}
          />,
        ),
      },
      {
        label: '',
        span: 3,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: getFieldDecorator('unitIndex', {
          initialValue: byOnceParams.unitIndex || undefined,
          rules: [{ required: totalFlag && disabledAutoDecOption, message: '请选择' }] })(
            <ComponentSalaryIndicators
              className={styles['app-comp-finance-attendance-rule-from']}
              tagList={[CurrentFinanceRulesGeneratorStep]}
              platformCode={platformCode}
              disabled={disabled || !disabledAutoDecOption}
            />,
        ),
      },
      {
        label: '不满足',
        span: 4,
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
        form: getFieldDecorator('decMinAmount', {
          initialValue: byOnceParams.decMinAmount,
          rules: [{ required: totalFlag && disabledAutoDecOption, message: '请选择' }] })(
            <InputNumber
              className={styles['app-comp-finance-attendance-rule-from']}
              disabled={disabled || !disabledAutoDecOption}
              placeholder="请输入"
              formatter={value => `${value}天`}
              parser={value => value.replace('天', '')}
              precision={0}
            />,
          ),
      },
      {
        label: (
          <span>每
              {
                <ComponentPopconfirmBtns
                  disabled={disabled || !disabledAutoDecOption}
                  num={byOnceParams.decUnitAmount}
                  sum={10}
                  onConfirm={this.onConfirmBtnDay}
                />
              }

            天，扣
            </span>
        ),
        span: 5,
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: getFieldDecorator('decUnitMoney', {
          initialValue: decUnitMoney,
          rules: [{ required: totalFlag && disabledAutoDecOption, message: '请选择' }] })(
            <InputNumber
              className={styles['app-comp-finance-attendance-rule-from']}
              placeholder="请输入"
              step={0.01}
              min={0}
              formatter={value => `${Unit.limitDecimals(value)}元`}
              parser={value => Unit.limitDecimals(value.replace('元', ''))}
              disabled={disabled || !disabledAutoDecOption}
            />,
          ),
      },
    ];

    return formItems;
  }

  // 按单补贴
  renderAccordingSingle = () => {
    const { getFieldDecorator } = this.props.form;
    const { computeLogic, disabled, platformCode } = this.props;
    const { singleFlag } = this.state;
    const byOrderUnitParams = computeLogic.byOrderUnitParams ?
    computeLogic.byOrderUnitParams : {};
    const incUnitMoney = byOrderUnitParams.incUnitMoney >= 0 ?
    Unit.exchangePriceToYuan(byOrderUnitParams.incUnitMoney) : undefined;
    const incUnitAmount = byOrderUnitParams.incUnitAmount ? byOrderUnitParams.incUnitAmount : 1;
    const formItems = [
      {
        label: '单量统计指标',
        span: 8,
        form: getFieldDecorator('orderVarCount', {
          initialValue: byOrderUnitParams.unitIndex || undefined,
          rules: [{ required: singleFlag, message: '请选择单量统计指标' }] })(
            <ComponentSalaryIndicators
              className={styles['app-comp-finance-attendance-rule-from']}
              tagList={[CurrentFinanceRulesGeneratorStep]}
              platformCode={platformCode}
              disabled={disabled}
            />,
          ),
      },
      {
        label: '最小单量(含)',
        span: 6,
        form: getFieldDecorator('minAmount', {
          initialValue: byOrderUnitParams.minAmount,
          rules: [{ required: singleFlag, message: '请选择最小单量' }] })(
            <InputNumber
              className={styles['app-comp-finance-attendance-rule-from']}
              disabled={disabled}
              placeholder="请输入"
              formatter={value => `${value}单`}
              parser={value => value.replace('单', '')}
              precision={0}
            />,
          ),
      },
      {
        label: (<span>
          每{
            <ComponentPopconfirmBtns
              disabled={disabled}
              num={incUnitAmount}
              sum={10}
              onConfirm={this.onConfirmIncUnitAmount}
            />
              }单补贴
        </span>),
        span: 7,
        form: getFieldDecorator('incUnitMoney', {
          initialValue: incUnitMoney,
          rules: [{ required: singleFlag, message: '请选择' }] })(
            <InputNumber
              className={styles['app-comp-finance-attendance-rule-from']}
              placeholder="请输入"
              step={0.01}
              min={0}
              formatter={value => `${Unit.limitDecimals(value)}元`}
              parser={value => Unit.limitDecimals(value.replace('元', ''))}
              disabled={disabled}
            />,
          ),
      },
    ];

    return formItems;
  }

  // 底薪补贴
  renderBaseSalary = () => {
    const { getFieldDecorator } = this.props.form;
    const { computeLogic, disabled } = this.props;
    const { salaryFlag } = this.state;
    const bySalaryBaseParams = computeLogic.bySalaryBaseParams ? computeLogic.bySalaryBaseParams : {};
    const salaryIncMoney = bySalaryBaseParams.salaryIncMoney >= 0 ? Unit.exchangePriceToYuan(bySalaryBaseParams.salaryIncMoney) : undefined;
    const formItems = [
      {
        label: '满足条件的骑士拥有底薪保护，底薪设定为',
        span: 10,
        layout: { labelCol: { span: 18 }, wrapperCol: { span: 6 } },
        form: getFieldDecorator('salaryIncMoney', {
          initialValue: salaryIncMoney,
          rules: [{ required: salaryFlag, message: '请选择' }] })(
            <InputNumber
              className={styles['app-comp-finance-attendance-rule-from']}
              placeholder="请输入"
              step={0.01}
              min={0}
              formatter={value => `${Unit.limitDecimals(value)}元`}
              parser={value => Unit.limitDecimals(value.replace('元', ''))}
              disabled={disabled}
            />,
          ),
      },
    ];
    return formItems;
  }

  // 渲染提示语
  renderTopTit = () => {
    const formItems = [
      {
        label: '',
        span: 18,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          <div className={styles['app-comp-finance-top-tip']}>
            <InfoCircleOutlined className={styles['icon-info']} />
            <span className={styles['app-comp-finance-attendance-rule-from-toptip']}>当单量提成大于底薪补贴时，实际补贴为0。单量提成小于底薪补贴时，实际补贴为【底薪补贴 - 单量提成】</span>
          </div>
        ),
      },
    ];
    return formItems;
  }

  // 渲染基础的表单信息
  renderBaseFrom = () => {
    // 绑定表单使用
    const { getFieldDecorator } = this.props.form;
    const { computeLogic, disabled } = this.props;
    const bizLogic = computeLogic.bizLogic || [FinanceSalaryTotalSubsidies.workLogicByOnce];
    const formItemsSubsidy = [
      {
        label: '补贴方式',
        span: 6,
        form: getFieldDecorator('bizLogic', {
          initialValue: bizLogic[0],
          rules: [{ required: true, message: '请选择补贴方式' }] })(
            <Select
              placeholder="请选择补贴方式"
              onChange={this.onChangeBizLogic}
              disabled={disabled}
              className={styles['app-comp-finance-attendance-rule-from']}
            >
              <Option value={FinanceSalaryTotalSubsidies.workLogicByOnce}>{FinanceSalaryTotalSubsidies.description(FinanceSalaryTotalSubsidies.workLogicByOnce)}</Option>
              <Option value={FinanceSalaryTotalSubsidies.workLogicByOrderUnit}>{FinanceSalaryTotalSubsidies.description(FinanceSalaryTotalSubsidies.workLogicByOrderUnit)}</Option>
              <Option value={FinanceSalaryTotalSubsidies.workLogicBySalaryBase}>{FinanceSalaryTotalSubsidies.description(FinanceSalaryTotalSubsidies.workLogicBySalaryBase)}</Option>
            </Select>,
        ),
      },
    ];
    const formItems = [];
    // 总额补贴
    if (bizLogic.includes(FinanceSalaryTotalSubsidies.workLogicByOnce) === true) {
      formItems.push(...this.renderTotalFore());
    }
    // 按单补贴
    if (bizLogic.includes(FinanceSalaryTotalSubsidies.workLogicByOrderUnit) === true) {
      formItems.push(...this.renderAccordingSingle());
    }
    // 底薪补贴
    if (bizLogic.includes(FinanceSalaryTotalSubsidies.workLogicBySalaryBase) === true) {
      formItems.push(...this.renderBaseSalary());
      formItemsSubsidy.push(...this.renderTopTit());
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItemsSubsidy} cols={4} layout={layout} />
        <DeprecatedCoreForm items={formItems} />
      </div>
    );
  }

  // 渲染结算单对应列
  renderPayrollMark = () => {
    const { getFieldDecorator } = this.props.form;
    const { disabled, payrollMark } = this.props;
    const formItem = [
      {
        label: '结算单对应列',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('payrollMark', {
          initialValue: payrollMark,
        })(
          <Input placeholder="请输入结算单对应列(可选)" disabled={disabled} />,
          ),
      },
    ];
    return (
      <div>
        <DeprecatedCoreForm items={formItem} cols={3} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染额外的表单 */}
        {this.renderRuleFrom()}

        {/* 渲染基础的表单信息 */}
        {this.renderBaseFrom()}

        {/* 渲染结算单对应列 */}
        {this.renderPayrollMark()}
      </div>
    );
  }
}

export default RuleFromComponent;
