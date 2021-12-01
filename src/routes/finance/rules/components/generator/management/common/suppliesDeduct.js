/**
 * 服务费规则生成 - 管理组件 - 创建组件 - 物资扣款设置 Finance/Rules/Generator
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { InputNumber, message, Radio, Input } from 'antd';

import { DeprecatedCoreForm } from '../../../../../../../components/core';
import {
  FinanceSalaryMeetConditions,
  FinanceSalaryKnightTagState,
  Unit,
} from '../../../../../../../application/define';
import ManagementFormComponent from './dayItem';

import styles from './style/index.less';

const RadioGroup = Radio.Group;

class ComponentDeductions extends Component {
  static propTypes = {
    computeLogic: PropTypes.object, // 内容
    matchFilters: PropTypes.object, // 内容
    payrollMark: PropTypes.string,  // 对应列
  }
  static defaultProps = {
    computeLogic: {},
    matchFilters: {},
  }

  // 校验
  checkAttendanceIndexValueData = (data = []) => {
    // 判断是否为空
    if (is.empty(data)) {
      return message.error('数据为空');
    }
    // 判断格式是否错误
    if (is.not.array(data)) {
      return message.error('数据格式错误');
    }
    let flag = false;
    // 遍历数据中
    data.forEach((item) => {
      // 判断是否为空
      if (is.empty(item)) {
        flag = true;
        return;
      }
      // 遍历数据中的子项
      Object.keys(item).forEach((key) => {
        // 判断数据是否为空
        if (is.not.existy(item[key]) || is.empty(item[key])) {
          flag = true;
          return true;
        }
      });
    });
    return flag;
  }

  // 检查满足条件
  checkAttendanceIndex = (_rules, value = [], callback) => {
    const flag = this.checkAttendanceIndexValueData(value);
    if (flag === false) {
      callback();
      return;
    }
    callback('请填写完整');
  }

  // 渲染满足条件
  rendeConditions = () => {
    const { disabled } = this.props;
    const { matchFilters } = this.props;
    const { getFieldDecorator } = this.props.form;
    const orderVars = matchFilters.orderVars ? matchFilters.orderVars : {};
    const matchType = orderVars.matchType || FinanceSalaryMeetConditions.meetAll;
    const formItems = [
      {
        label: '',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 18, offset: 1 } },
        form: getFieldDecorator('matchType', {
          initialValue: matchType,
          rules: [{ required: true, message: '请选择' }] })(
            <RadioGroup disabled={disabled}>
              <Radio value={FinanceSalaryMeetConditions.meetAll}>{FinanceSalaryMeetConditions.description(FinanceSalaryMeetConditions.meetAll)}</Radio>
              <Radio value={FinanceSalaryMeetConditions.meetAny}>{FinanceSalaryMeetConditions.description(FinanceSalaryMeetConditions.meetAny)}</Radio>
            </RadioGroup>,
        ),
      },
    ];
    return (<DeprecatedCoreForm items={formItems} />);
  }
  // 渲染基础的表单信息
  renderBaseFrom = () => {
    const { getFieldDecorator } = this.props.form;
    const { disabled } = this.props;
    const { matchFilters, payrollMark } = this.props;
    const orderVars = matchFilters.orderVars ? matchFilters.orderVars : {};
    const attendanceDays = orderVars.attendanceDays; // 出勤天数
    const workDays = orderVars.workDays; // 在职天数

    // 骑士标签: v6.4.0 默认选中全部
    // const knightTags = orderVars.knightTags; // 骑士标签
    const formItems = [
      {
        label: '出勤天数',
        form: getFieldDecorator('attendanceDays', {
          initialValue: attendanceDays || undefined,
          rules: [{ required: true, message: '请选择出勤天数' }] })(
            <InputNumber
              className={styles['app-comp-finance-management-insurace-form-width']}
              placeholder="请输入"
              min={0}
              precision={0}
              formatter={value => `${value}天`}
              parser={value => value.replace('天', '')}
              disabled={disabled}
            />,
        ),
      },
      {
        label: '在职天数',
        form: getFieldDecorator('workDays', {
          initialValue: workDays || undefined,
          rules: [{ required: true, message: '请选择在职天数' }] })(
            <InputNumber
              className={styles['app-comp-finance-management-insurace-form-width']}
              placeholder="请输入"
              min={0}
              precision={0}
              formatter={value => `${value}天`}
              parser={value => value.replace('天', '')}
              disabled={disabled}
            />,
        ),
      },
      {
        label: '骑士标签',
        form: FinanceSalaryKnightTagState.description(FinanceSalaryKnightTagState.all),
      },
      {
        label: '结算单对应列',
        form: getFieldDecorator('payrollMark', {
          initialValue: payrollMark,
        })(
          <Input placeholder="请输入结算单对应列(可选)" disabled={disabled} />,
          ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 12 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
        {/* 满足条件 */}
        {this.rendeConditions()}
      </div>
    );
  }

  // 渲染额外的表单信息
  renderRuleFrom = () => {
    const { getFieldDecorator } = this.props.form;
    const { disabled, platformCode } = this.props;
    const { computeLogic } = this.props;
    const computeLogicParams = computeLogic.params ? computeLogic.params : {};
    let computeLogicParamsRangeTable = computeLogicParams.rangeTable;
    // 判断是否有数据
    if (computeLogicParamsRangeTable) {
      computeLogicParamsRangeTable = computeLogicParamsRangeTable.map((val) => {
        return {
          ...val,
          money: Unit.exchangePriceToYuan(val.money),
        };
      });
    }
    const formItems = [
      {
        label: '',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 18, offset: 1 } },
        form: getFieldDecorator('rangeTable', {
          initialValue: computeLogicParamsRangeTable,
          rules: [{ required: true, validator: this.checkAttendanceIndex }],
        })(
          <ManagementFormComponent disabled={disabled} platformCode={platformCode} />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 渲染创建物资扣款设置
  renderSuppliesDeduct = () => {
    return (
      <div>
        {/* 渲染基础的表单信息 */}
        {this.renderBaseFrom()}

        {/* 渲染额外的表单信息 */}
        {this.renderRuleFrom()}
      </div>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染创建物资扣款设置 */}
        {this.renderSuppliesDeduct()}
      </div>
    );
  }
}


export default ComponentDeductions;
