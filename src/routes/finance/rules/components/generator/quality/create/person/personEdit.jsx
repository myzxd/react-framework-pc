/**
 * 服务费规则 补贴质量 单人评比 可编辑部分 Finance/Components/generator/quality/create/competition/competitionEdit
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Radio, message, Input } from 'antd';
import dot from 'dot-prop';
import is from 'is_js';

import {
  Unit,
  FinanceQualityStatisticsTime,
  FinanceRulesGeneratorStep,
  FinanceSalaryMeetConditions,
  FinanceMatchFiltersValue,
} from '../../../../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../../../../components/core';
import ComponentOrderType from '../../../../common/orderType';
import AwardSetting from '../common/awardSetting';
import TitleBar from '../common/titleBar';

const RadioGroup = Radio.Group;
const CurrentStep = FinanceRulesGeneratorStep.third;

class PersonEdit extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台
    disabled: PropTypes.bool,     // 禁用
    form: PropTypes.object,       // 上级下传表单
    dataSource: PropTypes.object, // 数据源(编辑/展示模式为object,否则不传)
  }

  static defaultProps = {
    disabled: false, // 是否禁用
    form: {}, // 表单实例
  }

  // 根据指标匹配单位
  getUnitByIndex = (index, currentOrderTypes) => {
    for (let i = 0; i < currentOrderTypes.data.length; i += 1) {
      if (currentOrderTypes.data[i].id === index) {
        return currentOrderTypes.data[i].unit;
      }
    }
  }

  // 校验
  checkAttendanceIndexValueRules = (data = []) => {
    // 判断是否为空
    if (is.empty(data)) {
      return message.error('满足条件的数据为空');
    }
    // 判断格式是否错误
    if (is.not.array(data)) {
      return message.error('满足条件的数据格式错误');
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
  checkAttendanceIndex = (_rules, value = {}, callback) => {
    const flag = this.checkAttendanceIndexValueRules(value.rules);
    if (value.matchType !== undefined && flag === false) {
      callback();
      return;
    }
    callback('请填写完整');
  }

  // 渲染订单指标
  renderOrderTarget = () => {
    const { disabled, dataSource, platformCode, orderTypes } = this.props;
    const currentOrderTypes = orderTypes[`${platformCode}${CurrentStep}`];
    // 如果当前平台步骤对应的指标数据未加载,则不渲染订单指标组件
    if (dataSource && !currentOrderTypes) {
      return <div />;
    }
    const { getFieldDecorator } = this.props.form;
    const matchFilters = dot.get(dataSource, 'matchFilters', []);
    const orderVars = FinanceMatchFiltersValue.description(matchFilters, '', true);
    const rules = dot.get(orderVars, '0.groupFilters', []);
    const groupMatch = dot.get(orderVars, '0.groupMatch', []);
    // 默认满足所有条件
    let orderTarget = { matchType: FinanceSalaryMeetConditions.meetAll };
    if (is.existy(orderVars) && is.not.empty(orderVars)) {
      orderTarget = {
        matchType: groupMatch, // 匹配条件的规则
        rules: rules.map((v) => {
          return {
            name: v.varName, // 变量名
            index: v.index, // 指标
            symbol: v.symbol, // 比较符
            num: Unit.dynamicExchange(v.value, this.getUnitByIndex(v.index, currentOrderTypes), false), // 指标值
          };
        }),
      };
    }
    const formItems = [
      {
        label: '筛选条件',
        form: getFieldDecorator('orderIndex', {
          rules: [
            { required: true },
            { validator: this.checkAttendanceIndex },
          ],
          initialValue: orderTarget,
        })(
          <ComponentOrderType
            platformCode={platformCode}
            tags={[CurrentStep]}
            disabled={disabled}
            layout={{
              indicators: 6,
              symbol: 3,
              num: 3 }}
          />,
        ),
      },
    ];
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  // 渲染适用范围
  renderRange = () => {
    const { disabled, dataSource } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 数据统计时间
    const statisticsTime = FinanceQualityStatisticsTime.month;
    // 结算对应列
    const payrollMark = dot.get(dataSource, 'payrollMark', '');
    const formItemsFirstLine = [
      {
        label: '数据统计时间',
        form: getFieldDecorator('statisticsTime', {
          initialValue: statisticsTime,
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <RadioGroup disabled={disabled}>
            <Radio value={FinanceQualityStatisticsTime.month}>
              {FinanceQualityStatisticsTime.description(FinanceQualityStatisticsTime.month)}
            </Radio>
          </RadioGroup>,
        ),
      },
    ];

    const formItemsLastLine = [
      {
        label: '结算单对应列',
        form: getFieldDecorator('payrollMark', {
          initialValue: payrollMark,
        })(
          <Input placeholder="请输入结算单对应列(可选)" disabled={disabled} />,
          ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItemsFirstLine} layout={layout} cols={3} />
        {this.renderOrderTarget()}
        <DeprecatedCoreForm items={formItemsLastLine} layout={layout} cols={3} />
      </div>
    );
  }

  // 渲染设定奖罚
  renderReward = () => {
    const { form, disabled, dataSource, platformCode } = this.props;
    return (
      <div>
        <TitleBar title="设定奖罚" />
        <AwardSetting
          platformCode={platformCode}
          currentStep={CurrentStep}
          dataSource={dataSource}
          form={form}
          disabled={disabled}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染适用范围 */}
        {this.renderRange()}

        {/* 渲染设定奖罚 */}
        {this.renderReward()}
      </div>
    );
  }
}

function mapStateToProps({ financeRulesGenerator: { orderTypes } }) {
  return { orderTypes };
}

export default connect(mapStateToProps)(PersonEdit);
