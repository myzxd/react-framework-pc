/**
 * 服务费规则生成 - 出勤组件 - 列表组件 Finance/Rules/Generator
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
// 抽象容器组件
import CommonContainerComponent from '../../common/container';
// 内容展开收起组件
import CommonCollapseComponent from '../../common/collapse';
import RuleFromComponent from './components/ruleFrom';
import MutualExclusionControl from '../../common/mutualExclusionControl';
import {
  FinanceQualityStaffOnDuty,
  FinanceRulesGeneratorStep,
  SalaryRules,
  FinanceKnightClassification,
  FinanceSalaryKnightTagState,
  FinanceMatchFiltersValue,
  SalaryMonthState,
  Unit,
} from '../../../../../../application/define';

const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.second;

class AttendanceContentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 加载数据
  componentDidMount = () => {
    const params = {
      step: CurrentFinanceRulesGeneratorStep, // 步骤
      ruleCollectionId: this.props.ruleCollectionId, // 详情id
    };
    this.props.dispatch({ type: 'financeRulesGenerator/fetchRulesGeneratorList', payload: params });
  }

  // 删除回调
  onClickDelete = (data) => {
    const params = {
      id: data.id,
      onSuccessCallback: this.onSuccessCallback,
    };
    this.props.dispatch({ type: 'financeRulesGenerator/deleteFinanceRulesGeneratorList', payload: params });
  }

  // 上移回调
  onClickMoveUp = (data, index, dataSource) => {
    const params = {
      upId: data.id,
      downId: dataSource[index - 1].id,
      onSuccessCallback: this.onSuccessCallback,
    };
    this.props.dispatch({ type: 'financeRulesGenerator/updateFinanceRuleSort', payload: params });
  }

  // 下移回调
  onClickMoveDown = (data, index, dataSource) => {
    const params = {
      upId: data.id,
      downId: dataSource[index + 1].id,
      onSuccessCallback: this.onSuccessCallback,
    };
    this.props.dispatch({ type: 'financeRulesGenerator/updateFinanceRuleSort', payload: params });
  }

   // 校验满足条件
  onCheckAttendanceIndexValueRules = (data = []) => {
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
      const isFlag = Object.keys(item).some(key => is.not.existy(item[key]) || is.empty(item[key]));
      // 判断是否为空
      if (isFlag === true) {
        flag = true;
        return true;
      }
    });
    return flag;
  }

  // 提交回调
  onSubmit = (data, index, dataSource, value, callBack) => {
    const {
      matchFilters,
    } = data;
    const { computeLogic } = data;
    const {
      decUnitAmount,
    } = computeLogic.byOnceParams;

    const { incUnitAmount } = computeLogic.byOrderUnitParams;
    data.form.validateFields((err, values) => {
      if (!err) {
        const { orderVars } = values;
        const flag = this.onCheckAttendanceIndexValueRules(orderVars.rules);
        if (is.empty(orderVars.rules[0]) || flag === true) {
          return message.error('满足条件请填写完整');
        }
        const params = {
          matchFilters,
          ...values,
          id: data.id,
          platformCode: this.props.platformCode,
          step: CurrentFinanceRulesGeneratorStep,
          decUnitAmount,
          incUnitAmount,
          onSuccessCallback: this.onSuccessCallback.bind(this, callBack),
        };
        this.props.dispatch({
          type: 'financeRulesGenerator/createFinanceRulesGeneratorListOne',
          payload: params,
        });
      }
    });
  }

  onSuccessCallback = (callBack) => {
    if (typeof (callBack) === 'function') {
      callBack();
    }
    const params = {
      step: CurrentFinanceRulesGeneratorStep, // 步骤
      ruleCollectionId: this.props.ruleCollectionId, // 详情id
    };
    this.props.dispatch({ type: 'financeRulesGenerator/fetchRulesGeneratorList', payload: params });
  }

  // 根据指标匹配单位
  getUnitByIndex = (index, data = []) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === index) {
        return data[i].unit;
      }
    }
  }

  // 渲染数组数据
  renderArrayByConstans = (data, constans) => {
    if (!Array.isArray(data) || data.length <= 0) return '--';
    return data.reduce((record, value, index) => {
      if (index === 0) return `${record}${constans.description(value)}`;
      return `${record},${constans.description(value)}`;
    }, '');
  }

  // 渲染标题
  renderTitle = (data) => {
    const matchFilters = dot.get(data, 'matchFilters', []);
    const state = FinanceMatchFiltersValue.description(matchFilters, '当月在离职');
    // 默认全部
    const states = is.existy(state) && is.not.empty(state) ? state : [SalaryMonthState.all];
    // 获取所有的骑士标签
    const formItems = [
      {
        label: '骑士分类',
        form: FinanceKnightClassification.description(FinanceKnightClassification.all),
      },
      {
        label: '骑士标签',
        form: FinanceSalaryKnightTagState.description(FinanceSalaryKnightTagState.all),
      },
      {
        label: '当月在离职',
        form: this.renderArrayByConstans(states, FinanceQualityStaffOnDuty),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 12 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
    );
  }

  // 渲染内容
  renderContent = (item) => {
    const data = item;
    const { orderTypes, platformCode } = this.props;
    const currentOrderTypes = orderTypes[`${platformCode}${CurrentFinanceRulesGeneratorStep}`] || {};
    const matchFilters = dot.get(data, 'matchFilters', []);
    const orderVars = FinanceMatchFiltersValue.description(matchFilters, '', true);
    const groupMatch = dot.get(orderVars, '0.groupMatch', '');
    const rules = dot.get(orderVars, '0.groupFilters', []);
    const ruleList = rules.map((v) => {
      const unit = this.getUnitByIndex(v.index, currentOrderTypes.data);
      return {
        name: v.varName,
        index: v.index,
        symbol: v.symbol,
        num: Unit.dynamicExchange(v.value, unit, false),
        unit,
      };
    });
    const props = {
      payrollMark: data.payrollMark,
      computeLogic: data.computeLogic,
      matchFilters: [
        ...data.matchFilters,
        {
          groupMatch,
          groupFilters: ruleList,
        },
      ],
      form: data.form,
      disabled: data.isDisabled,
      platformCode: this.props.platformCode,
    };
    return (
      <RuleFromComponent {...props} />
    );
  }

  // 渲染数据
  renderData = (data, index, dataSource) => {
    const { type } = this.props;
    const props = {
      data,
      index,
      type,
      dataSource,
      onRenderTitle: this.renderTitle,        // 渲染标题
      onRenderContent: this.renderContent,    // 渲染内容
      onClickDelete: this.onClickDelete,      // 删除回调
      onClickMoveUp: this.onClickMoveUp,      // 上移回调
      onClickMoveDown: this.onClickMoveDown,  // 下移回调
      onSubmit: this.onSubmit,                // 提交回调
    };
    return <CommonCollapseComponent {...props} />;
  }

  render() {
    const { title } = this.state;
    const { type, ruleCollectionId } = this.props;
    const dataSource = dot.get(
      this.props.financeRulesGeneratorList,
      `${ruleCollectionId}.${CurrentFinanceRulesGeneratorStep}.data`,
      [],
    );
    return (
      <CoreContent title={title}>
        <MutualExclusionControl
          ruleCollectionId={ruleCollectionId}
          type={type}
          ruleType={SalaryRules.attendance}
        />
        <CommonContainerComponent
          dataSource={dataSource}
          renderData={this.renderData}
        />
      </CoreContent>
    );
  }
}
function mapStateToProps({ financeRulesGenerator: { financeRulesGeneratorList },
  financeConfigTags: { knightTags }, financeRulesGenerator: { orderTypes } }) {
  return { financeRulesGeneratorList, knightTags, orderTypes };
}

export default connect(mapStateToProps)(Form.create()(AttendanceContentComponent));
