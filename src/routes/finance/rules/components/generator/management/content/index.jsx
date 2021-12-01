/**
 * 服务费规则生成 - 管理组件 - 列表组件 - 内容组件 Finance/Rules/Generator
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { message } from 'antd';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../../components/core';

// 抽象容器组件
import CommonContainerComponent from '../../../common/container';
// 内容展开收起组件
import CommonCollapseComponent from '../../../common/collapse';
import MutualExclusionControl from '../../../common/mutualExclusionControl';
// import ComponentDeductions from '../common/suppliesDeduct';    // 物资组件未启用
import ComponentInsuranceForm from '../common/InsuranceForm';

import {
  FinanceRulesGeneratorStep,
  SalaryRules,
  FinanceSalaryManagementType,
  FinanceSalaryDeductionsType,
  Unit,
} from '../../../../../../../application/define';

const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.forth;

class ManagementContentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

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

  // 提交回调
  onSubmit = (data, index, dataSource, value, callBack) => {
    const { validateFieldsAndScroll } = data.form;
    const {
      matchFilters,
    } = data;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 判断是否是按月扣款，扣款金额不能为空
        if (values.monthFlag === true &&
          (is.not.existy(values.decMoney) || is.empty(values.decMoney))) {
          return message.error('操作失败，扣款金额不能为空');
        }
        const params = {
          ...values,
          id: data.id,
          matchFilters,
          onSuccessCallback: this.onSuccessCallback.bind(this, callBack),
          step: CurrentFinanceRulesGeneratorStep,
        };
        this.props.dispatch({ type: 'financeRulesGenerator/createFinanceRulesGeneratorListOne', payload: params });
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

  // 渲染数组数据
  // renderArrayByConstans = (data, constans) => {
  //   if (!Array.isArray(data) || data.length <= 0) return '--';
  //   return data.reduce((record, value, index) => {
  //     if (index === 0) return `${record}${constans.description(value)}`;
  //     return `${record},${constans.description(value)}`;
  //   }, '');
  // }

  // 渲染数组数据
  renderArray = (data, name) => {
    let dataValue = '--';

    data.forEach((item) => {
      if (item.varName === name) {
        dataValue = item.value[0];
      }
    });
    return dataValue;
  }

  // 渲染标题
  renderTitle = (data) => {
    const matchFilters = data.matchFilters;
    const formItems = [
      {
        label: '分类',
        form: FinanceSalaryManagementType.description(this.renderArray(matchFilters, '管理扣款分类')),
      },
      {
        label: '保险扣款',
        form: FinanceSalaryDeductionsType.description(Number(this.renderArray(matchFilters, '保险扣款项'))),
      },
      {
        label: '险种',
        form: this.renderArray(matchFilters, '险种'),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 12 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染内容
  renderContent = (data) => {
    // const { platformCode } = this.props;
    const computeLogic = data.computeLogic || {};
    const matchFilters = data.matchFilters;
    const payrollMark = data.payrollMark;
    const computeLogicParams = computeLogic.params || {};
    // 判断是物资还是保险的
    // if (Number(matchFilters.bizCate) === FinanceSalaryManagementType.supplies) {
    //   const props = {
    //     form: data.form,
    //     disabled: data.isDisabled,
    //     computeLogic,
    //     matchFilters,
    //     platformCode,
    //     payrollMark,
    //   };
    //   return (
    //     <ComponentDeductions {...props} />
    //   );
    // }
    // if (Number(matchFilters.bizCate) === FinanceSalaryManagementType.insurance) {
    const props = {
      cols: 3,
      tags: this.props.tags,
      platformCode: this.props.platformCode,
      form: data.form,
      computeLogic: { ...computeLogic, params: { ...computeLogic.params, unitMoney: Unit.exchangePriceToYuan(computeLogicParams.unitMoney || ''), decMoney: Unit.exchangePriceToYuan(computeLogicParams.decMoney || '') } },
      matchFilters,
      disabled: data.isDisabled,
      payrollMark,
    };
    return (
      <ComponentInsuranceForm {...props} />
    );
    // }
    // return '';
  }

  // 渲染数据
  renderData = (data, index, dataSource) => {
    const props = {
      data,
      index,
      dataSource,
      type: this.props.type,
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
          ruleType={SalaryRules.management}
        />
        <CommonContainerComponent
          dataSource={dataSource}
          renderData={this.renderData}
        />
      </CoreContent>
    );
  }
}

function mapStateToProps({ financeRulesGenerator: { financeRulesGeneratorList } }) {
  return { financeRulesGeneratorList };
}

export default connect(mapStateToProps)(ManagementContentComponent);
