/**
 * 服务费规则生成 - 质量组件 - 列表组件 Finance/Rules/Generator
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import dot from 'dot-prop';
import { message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  FinanceQualityStaffOnDuty,
  SalaryCollectType,
  FinanceRulesGeneratorStep,
  SalaryRules,
  FinanceKnightClassification,
  FinanceSalaryKnightTagState,
  FinanceQualityType,
  FinanceMatchFiltersValue,
} from '../../../../../../application/define';

// 抽象容器组件
import CommonContainerComponent from '../../common/container';
// 内容展开收起组件
import CommonCollapseComponent from '../../common/collapse';
import MutualExclusionControl from '../../common/mutualExclusionControl';
import CompetitionEdit from './create/competition/competitionEdit';
import PersonEdit from './create/person/personEdit';

import styles from './style/index.less';

// 当前步骤常量
const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.third;
class QualityContentComponent extends Component {

  static propTypes = {
    platformCode: PropTypes.string,
    type: PropTypes.number,             // 模板tab标识
    ruleCollectionId: PropTypes.string, // 服务费方案规则集id
  }

  static defaultProps = {
    type: SalaryCollectType.generator,
  }

  componentDidMount() {
    this.fetchListData();
  }

  // 删除回调
  onClickDelete = (data) => {
    const params = {
      id: data.id,
      onSuccessCallback: this.fetchListData,
    };
    this.props.dispatch({ type: 'financeRulesGenerator/deleteFinanceRulesGeneratorList', payload: params });
  }

  // 上移回调
  onClickMoveUp = (data, index, dataSource) => {
    const params = {
      upId: data.id,
      downId: dataSource[index - 1].id,
      onSuccessCallback: this.fetchListData,
    };
    this.props.dispatch({ type: 'financeRulesGenerator/updateFinanceRuleSort', payload: params });
  }

  // 下移回调
  onClickMoveDown = (data, index, dataSource) => {
    const params = {
      upId: data.id,
      downId: dataSource[index + 1].id,
      onSuccessCallback: this.fetchListData,
    };
    this.props.dispatch({ type: 'financeRulesGenerator/updateFinanceRuleSort', payload: params });
  }

  // 重置回调
  onReset = () => {
  }

  // 提交回调
  onSubmit = (data, index, dataScoure, values, callBack) => {
    const {
      matchFilters,
    } = data;
    const qualityType = FinanceMatchFiltersValue.description(matchFilters, '评比分类');
    // 判断最大人数和最小人数
    if (is.existy(values.minPeople) && is.not.empty(values.minPeople)) {
      if (is.existy(values.maxPeople) && is.not.empty(values.maxPeople)) {
        if (values.minPeople > values.maxPeople) {
          return message.error('最大人数应不小于最小人数');
        }
      }
    }
    // 判断是否是竞赛评比/设定名次
    if (values.rankSetting === true) {
      if (is.not.existy(values.rank) || is.empty(values.rank)) {
        return message.error('请设置具体的名次范围！');
      }
      if (is.existy(values.rank) && is.not.empty(values.rank)) {
        const rank = dot.get(values, 'rank', {});
        const rankSum = dot.get(rank, 'rankSum', undefined);
        if (is.not.existy(rankSum) || is.empty(rankSum) || rankSum < 1) {
          return message.error('请设置具体的名次范围！');
        }
      }
    }
    const params = {
      ...matchFilters,
      ...values,
      id: data.id,
      platformCode: this.props.platformCode,
      type: qualityType[0],
      step: FinanceRulesGeneratorStep.third,
      onSuccessCallback: this.fetchListData.bind(this, callBack),
    };
    this.props.dispatch({ type: 'financeRulesGenerator/createFinanceRulesGeneratorListOne', payload: params });
  }

  // 刷新列表数据
  fetchListData = (callBack) => {
    const { dispatch, ruleCollectionId } = this.props;
    if (typeof (callBack) === 'function') {
      callBack();
    }
    dispatch({
      type: 'financeRulesGenerator/fetchRulesGeneratorList',
      payload: {
        ruleCollectionId,
        step: CurrentFinanceRulesGeneratorStep,
      },
    });
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
    const states = is.existy(state) && is.not.empty(state) ? state : [FinanceQualityStaffOnDuty.all];
    const qualityType = FinanceMatchFiltersValue.description(matchFilters, '评比分类');
    const formItemsFirstLine = [
      {
        label: '分类',
        form: this.renderArrayByConstans(qualityType, FinanceQualityType),
      },
      {
        label: '骑士分类',
        form: FinanceKnightClassification.description(FinanceKnightClassification.all),
      },
      {
        label: '当月在离职',
        form: this.renderArrayByConstans(states, FinanceQualityStaffOnDuty),
        layout: { labelCol: { span: 7 }, wrapperCol: { span: 17 } },
      },
    ];
    const formItemsSecondLine = [{
      label: '骑士标签',
      form: FinanceSalaryKnightTagState.description(FinanceSalaryKnightTagState.all),
    }];
    const layoutFirstLine = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    const layoutSecondLine = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItemsFirstLine} cols={3} layout={layoutFirstLine} />
        <DeprecatedCoreForm items={formItemsSecondLine} cols={1} layout={layoutSecondLine} />
      </div>
    );
  }

  // 渲染内容
  renderContent = (data) => {
    const { platformCode } = this.props;
    const { form, isDisabled } = data;
    const matchFilters = dot.get(data, 'matchFilters', []);
    const qualityType = FinanceMatchFiltersValue.description(matchFilters, '评比分类');
    if (qualityType[0] === FinanceQualityType.person) {
      return (
        <div className={styles['app-comp-finance-quaity-content-wrap']}>
          <PersonEdit platformCode={platformCode} disabled={isDisabled} form={form} dataSource={data} />
        </div>
      );
    } else if (qualityType[0] === FinanceQualityType.competition) {
      return (
        <div className={styles['app-comp-finance-quaity-content-wrap']}>
          <CompetitionEdit platformCode={platformCode} disabled={isDisabled} form={form} dataSource={data} />
        </div>
      );
    }
    return <div />;
  }

  // 渲染数据
  renderData = (data, index, dataSource) => {
    const { type } = this.props;
    const props = {
      data,
      index,
      type,
      dataSource,
      forceValidate: true, // 对已经校验过的表单域，在 validateTrigger 再次被触发时再次校验
      onRenderTitle: this.renderTitle,        // 渲染标题
      onRenderContent: this.renderContent,    // 渲染内容
      onClickDelete: this.onClickDelete,      // 删除回调
      onClickMoveUp: this.onClickMoveUp,      // 上移回调
      onClickMoveDown: this.onClickMoveDown,  // 下移回调
      onReset: this.onReset,                  // 重置回调
      onSubmit: this.onSubmit,                // 提交回调
    };
    return <CommonCollapseComponent {...props} />;
  }

  render() {
    const { ruleCollectionId, type } = this.props;
    const dataSource = dot.get(
      this.props.financeRulesGeneratorList,
      `${ruleCollectionId}.${CurrentFinanceRulesGeneratorStep}.data`,
      [],
    );
    return (
      <CoreContent>
        <MutualExclusionControl
          ruleCollectionId={ruleCollectionId}
          type={type}
          ruleType={SalaryRules.quality}
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

export default connect(mapStateToProps)(QualityContentComponent);
