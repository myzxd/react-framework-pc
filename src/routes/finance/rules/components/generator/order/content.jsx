/**
 * 服务费规则生成 - 单量组件 - 列表组件 Finance/Rules/Generator
 */
import is from 'is_js';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Radio, Tooltip, message, Input } from 'antd';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  FinanceRulesGeneratorStep,
  SalaryMonthState,
  SalaryStationLevel,
  SalaryExtractType,
  SalaryRules,
  FinanceKnightClassification,
  FinanceSalaryKnightTagState,
  Unit,
  FinanceMatchFiltersValue,
} from '../../../../../../application/define';
import ExtractRule from './common/extractRule';
import MutualExclusionControl from '../../common/mutualExclusionControl';

// 抽象容器组件
import CommonContainerComponent from '../../common/container';
// 内容展开收起组件
import CommonCollapseComponent from '../../common/collapse';

import styles from './style/index.less';

const RadioGroup = Radio.Group;

class OrderContentComponent extends Component {
  static propTypes = {
    platformCode: PropTypes.string,      // 平台code
    type: PropTypes.number,              // 模板tab标识
    ruleCollectionId: PropTypes.string,  // 服务费方案规则集id
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.fetchOrderTypes();
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

  // 提交回调
  onSubmit = (data, index, dataSource, values, callBack) => {
    const rangeTable = values.rangeTable;
    // 表单数据验证
    if (!rangeTable) return message.error('请检查方案提成规则（结束单量应大于起始单量）');
    // eslint-disable-next-line no-plusplus
    for (let k = 0; k < rangeTable.length; k++) {
      if (rangeTable[k].max - rangeTable[k].min <= 0 || !rangeTable[k].max) {
        return message.error('请检查方案提成规则（结束单量应大于起始单量）');
      }
      if (k !== rangeTable.length - 1 && k !== 0 && rangeTable[k].max - rangeTable[k - 1].max <= 0) {
        return message.error('请检查方案提成规则区间设置的合理性（每个区间规则的第二个值必须大于前一个规则区间第二个值）');
      }
    }
    const { matchFilters } = data;
    const params = {
      id: data.id,
      step: FinanceRulesGeneratorStep.first,
      computeLogic: values,
      platformCode: this.props.platformCode,
      matchFilters,
      payrollMark: values.payrollMark,
      onSuccessCallback: this.fetchListData.bind(this, callBack),
    };
    this.props.dispatch({ type: 'financeRulesGenerator/createFinanceRulesGeneratorListOne', payload: params });
  }

  // 根据指标id获取指标名称
  getOrderTypeName = (orderTypeId) => {
    const { orderTypes, platformCode } = this.props;
    const dataArray = dot.get(orderTypes, `${platformCode}${FinanceRulesGeneratorStep.first}.data`, []);
    let orderTypeName;
    dataArray.forEach((item) => {
      if (item.id === orderTypeId) {
        orderTypeName = item.name;
      }
    });
    return orderTypeName;
  }

  // 刷新列表数据
  fetchListData = (callBack) => {
    const { ruleCollectionId } = this.props;
    if (typeof (callBack) === 'function') {
      callBack();
    }
    this.props.dispatch({
      type: 'financeRulesGenerator/fetchRulesGeneratorList',
      payload: {
        ruleCollectionId,
        step: FinanceRulesGeneratorStep.first,
      },
    });
  }

  // 获取指标数据
  fetchOrderTypes = () => {
    const { platformCode } = this.props;
    const payload = {
      platformCode,
      tags: [FinanceRulesGeneratorStep.first],
    };
    this.props.dispatch({ type: 'financeRulesGenerator/fetchGeneratorOrderTypes', payload });
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
    const computeLogic = dot.get(data, 'computeLogic.params', {});
    const rangeTable = dot.get(computeLogic, 'rangeTable', []);
    const state = FinanceMatchFiltersValue.description(matchFilters, '当月在离职');
    // 默认全部
    const states = is.existy(state) && is.not.empty(state) ? state : [SalaryMonthState.all];
    const stationLevel = FinanceMatchFiltersValue.description(matchFilters, '站点评星');
    // 默认全部
    const stationLevels = is.existy(stationLevel) && is.not.empty(stationLevel) ? stationLevel : [SalaryStationLevel.all];
    const formItems = [
      {
        label: '结算指标',
        form: this.getOrderTypeName(rangeTable[0].index),
      },
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
        form: this.renderArrayByConstans(states, SalaryMonthState),
      },
    ];
    const formItemsLevel = [
      {
        label: '站点评星',
        style: { marginLeft: 6 },
        form: this.renderArrayByConstans(stationLevels, SalaryStationLevel),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    const layoutLevel = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
        <DeprecatedCoreForm items={formItemsLevel} cols={1} layout={layoutLevel} />
      </div>
    );
  }

  // 渲染内容
  renderContent = (data) => {
    // 表单内容, 根据业务实现, 额外信息（详情中可修改）
    const { platformCode } = this.props;
    let rangeTableArr;
    const {
      computeLogic: {
        params: {
          type,
          rangeTable,
        },
      },
      isDisabled,
      payrollMark,
    } = data;

    const { getFieldDecorator } = data.form;
    const extractTypeChange = data.form.getFieldsValue().type || `${type}`;
    // 当方案提成为阶段变动时起始单量为0
    if (`${extractTypeChange}` === `${SalaryExtractType.change}`) {
      rangeTableArr = rangeTable.map((item) => {
        return {
          ...item,
          money: Unit.exchangePriceToYuan(item.money),
          min: 0,
        };
      });
    } else {
      rangeTableArr = rangeTable.map((item) => {
        return {
          ...item,
          money: Unit.exchangePriceToYuan(item.money),
        };
      });
    }
    const formItems = [
      {
        label: '方案提成',
        form: getFieldDecorator('type', {
          initialValue: `${type}`,
          rules: [{ required: true, message: '请选择方案提成' }],
        })(
          <RadioGroup disabled={isDisabled}>
            <Radio value={`${SalaryExtractType.segmentation}`}>
              {SalaryExtractType.description(SalaryExtractType.segmentation)}
              <Tooltip title="单段金额=各区间段单量x单价，总值为各区间段相加">
                <QuestionCircleOutlined className={styles['app-comp-finance-generator-order-from-tooltip']} />
              </Tooltip>
            </Radio>
            <Radio value={`${SalaryExtractType.change}`}>
              {SalaryExtractType.description(SalaryExtractType.change)}
              <Tooltip title="单段金额=区间段单量x单价，总值为单量符合的单段金额">
                <QuestionCircleOutlined className={styles['app-comp-finance-generator-order-from-tooltip']} />
              </Tooltip>
            </Radio>
          </RadioGroup>,
        ),
      },
    ];
    const formItemsMark = [
      {
        label: '结算单对应列',
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 12 } },
        form: getFieldDecorator('payrollMark', {
          initialValue: payrollMark,
        })(
          <Input placeholder="可修改结算单对应列" disabled={isDisabled} />,
          ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

        {/* 单量规则 */}
        {
          getFieldDecorator('rangeTable', {
            initialValue: rangeTableArr,
          })(
            <ExtractRule extractType={extractTypeChange} isDisabled={isDisabled} platformCode={platformCode} />,
          )
        }
        <DeprecatedCoreForm items={formItemsMark} cols={3} layout={layout} />
      </div>
    );
  }

  // 渲染数据
  renderData = (data, index, dataSource) => {
    const { type } = this.props;
    const props = {
      data,
      index,
      dataSource,
      type,
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
    const dataSource = dot.get(this.props.financeRulesGeneratorList, `${ruleCollectionId}.${FinanceRulesGeneratorStep.first}.data`, []);
    return (
      <CoreContent title={title}>
        {/* 控制互斥组件 */}
        <MutualExclusionControl
          ruleCollectionId={ruleCollectionId}
          type={type}
          ruleType={SalaryRules.order}
        />
        <CommonContainerComponent
          dataSource={dataSource}
          renderData={this.renderData}
        />
      </CoreContent>
    );
  }
}

function mapStateToProps({ financeRulesGenerator: { financeRulesGeneratorList, orderTypes } }) {
  return { financeRulesGeneratorList, orderTypes };
}
export default connect(mapStateToProps)(OrderContentComponent);
