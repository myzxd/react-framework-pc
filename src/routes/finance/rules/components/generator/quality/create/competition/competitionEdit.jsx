/**
 * 服务费规则 补贴质量 竞赛评比 可编辑部分 Finance/Components/generator/quality/create/competition/competitionEdit
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import is from 'is_js';
import {
  Radio,
  InputNumber,
  Checkbox,
  message,
  Input,
} from 'antd';

import {
  FinanceQualityStatisticsTime,
  FinanceQualityCompetitionSortOrder,
  FinanceRulesGeneratorStep,
  FinanceSalaryMeetConditions,
  Unit,
} from '../../../../../../../../application/define';
import {
  DeprecatedCoreForm,
} from '../../../../../../../../components/core';
import RankSetting from './rankSetting';
import ComponentOrderType from '../../../../common/orderType';
import ComponentSalaryIndicators from '../../../../common/salaryIndicators';
import TitleBar from '../common/titleBar';
import AwardSetting from '../common/awardSetting';

import styles from './style/index.less';

const RadioGroup = Radio.Group;
const CurrentStep = FinanceRulesGeneratorStep.third;

class CompetitionEdit extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台
    disabled: PropTypes.bool,   // 是否禁用
    form: PropTypes.object,     // 上级下传表单
    dataSource: PropTypes.object, // 数据源(编辑/展示模式为object,否则不传)
  }

  static defaultProps = {
    disabled: false, // 是否禁用
    form: {}, // 表单实例
  }

  // 根据指标匹配单位
  getUnitByIndex = (index, data = []) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === index) {
        return data[i].unit;
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
  checkAttendanceIndex = (rules, value = {}, callback) => {
    const flag = this.checkAttendanceIndexValueRules(value.rules);
    if (value.matchType !== undefined && flag === false) {
      callback();
      return;
    }
    callback('请填写完整');
  }

  // 筛选指标数据
  renderMatchFiltersOrderVars = (data = []) => {
    const orderVars = [];
    const list = data.filter(val => val.groupMatch);
    list.forEach((val) => {
      val.groupFilters.filter((v) => {
        if (v.varName !== '入选人数') {
          orderVars.push(val);
        }
      });
    });
    return orderVars;
  }

  // 渲染订单指标
  renderOrderTarget = () => {
    const { disabled, dataSource, platformCode, orderTypes } = this.props;
    const { getFieldDecorator } = this.props.form;
    const currentOrderTypes = orderTypes[`${platformCode}${CurrentStep}`];

    // 如果当前平台步骤对应的指标数据未加载,则不渲染订单指标组件
    if (dataSource && !currentOrderTypes) {
      return <div />;
    }
    const matchFilters = dot.get(dataSource, 'matchFilters', []);
    const orderVars = this.renderMatchFiltersOrderVars(matchFilters);
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
          initialValue: orderTarget,
          rules: [
            { validator: this.checkAttendanceIndex },
            { required: true },
          ],
        })(
          <ComponentOrderType
            platformCode={platformCode}
            tags={[CurrentStep]}
            disabled={disabled}
            layout={{
              indicators: 6,
              symbol: 3,
              num: 3 }}
          />),
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

  // 获取入选人数值
  renderMatchFiltersPeopleNumValue = (data = [], symbol) => {
    const str = '入选人数';
    const peoples = [];
    // 筛选数据
    const list = data.filter(val => val.groupMatch);
    list.forEach((val) => {
      val.groupFilters.filter((v) => {
        // 判断是最大还是最小
        if (v.varName === str && v.symbol === symbol) {
          peoples.push(v.value);
        }
      });
    });
    if (is.existy(peoples) && is.not.empty(peoples)) {
      return peoples[0];
    }
    return undefined;
  }

  // 渲染考核范围
  renderRange = () => {
    const { disabled, dataSource, platformCode } = this.props;
    const { getFieldDecorator } = this.props.form;
    const statisticsTime = FinanceQualityStatisticsTime.month;
    const payrollMark = dot.get(dataSource, 'payrollMark', '');
    const sortOptions = dot.get(dataSource, 'sortOptions', []);
    const sortIndex = dot.get(sortOptions[0], 'index', '');
    const matchFilters = dot.get(dataSource, 'matchFilters', []);
    const sortOrder = dot.get(sortOptions[0], 'direction', FinanceQualityCompetitionSortOrder.ascend);
    // <= 最大 >= 最小
    const singleJoinMinPeopleNum = this.renderMatchFiltersPeopleNumValue(matchFilters, '>=');
    let singleJoinMaxPeopleNum = this.renderMatchFiltersPeopleNumValue(matchFilters, '<=');
    // 若最大人数<=0, 则说明人数不限, 表单初始值置为空
    if (singleJoinMaxPeopleNum <= 0) {
      singleJoinMaxPeopleNum = '';
    }
    const formItems = [
      {
        label: '数据统计时间',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 12 } },
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

    const formItemsSecondLine = [
      {
        label: '指标排序',
        form: getFieldDecorator('sortIndex', {
          rules: [{
            required: true,
            message: '请选择',
          }],
          initialValue: `${sortIndex}`,
        })(
          <ComponentSalaryIndicators
            platformCode={platformCode}
            tagList={[CurrentStep]}
            disabled={disabled}
            className={styles['app-comp-finance-quality-create-competiton-competition-edit-from']}
          />,
        ),
      },
      {
        label: '',
        form: getFieldDecorator('sortOrder', {
          initialValue: sortOrder,
        })(
          <RadioGroup disabled={disabled}>
            <Radio
              value={FinanceQualityCompetitionSortOrder.ascend}
            >
              {FinanceQualityCompetitionSortOrder.description(FinanceQualityCompetitionSortOrder.ascend)}
            </Radio>
            <Radio
              value={FinanceQualityCompetitionSortOrder.descend}
            >
              {FinanceQualityCompetitionSortOrder.description(FinanceQualityCompetitionSortOrder.descend)}
            </Radio>
          </RadioGroup>,
        ),
      },
    ];

    const formItemsThirdLine = [
      {
        label: '入选人数',
        form: getFieldDecorator('minPeople', {
          initialValue: singleJoinMinPeopleNum,
          rules: [
            { required: true, message: '请填写' },
          ],
        })(
          <InputNumber
            className={styles['app-comp-finance-quality-create-competiton-competition-edit-from']}
            min={0}
            precision={0}
            disabled={disabled}
            placeholder="最少"
          />,
        ),
      },
      {
        label: '',
        form: getFieldDecorator('maxPeople', {
          initialValue: singleJoinMaxPeopleNum,
        })(
          <InputNumber
            className={styles['app-comp-finance-quality-create-competiton-competition-edit-from']}
            min={0}
            precision={0}
            disabled={disabled}
            placeholder="最多"
          />,
        ),
      },
    ];

    const formItemsForthLine = [
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
        <DeprecatedCoreForm items={formItems} layout={layout} cols={3} />
        {this.renderOrderTarget()}
        <DeprecatedCoreForm items={formItemsSecondLine} layout={layout} cols={3} />
        <DeprecatedCoreForm items={formItemsThirdLine} layout={layout} cols={3} />
        <DeprecatedCoreForm items={formItemsForthLine} layout={layout} cols={3} />
      </div>
    );
  }

  // 渲染奖罚
  renderAward = () => {
    const { form, disabled, dataSource, platformCode } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const bizLogic = dot.get(dataSource, 'computeLogic.bizLogic', []);
    // 默认选择奖励法
    let awardSetting = true;
    let rankSetting = false;
    // 如果为空时，都是false
    if (is.not.existy(bizLogic) || is.empty(bizLogic)) {
      awardSetting = false;
      rankSetting = false;
    }
    if (bizLogic.indexOf('qc_logic_battle') !== -1) {
      rankSetting = true;
      // 若有排名奖励且无奖励法才可将奖励法设为false
      if (bizLogic.indexOf('qc_logic_by_multiple') === -1 && bizLogic.indexOf('qc_logic_by_range') === -1) {
        awardSetting = false;
      }
    }
    const battleParams = dot.get(dataSource, 'computeLogic.battleParams', undefined);
    let rank;
    if (battleParams !== undefined && rankSetting === true) {
      rank = {
        rankSum: battleParams.rankSum, // 最高奖励金额
        rankLadder: battleParams.ladder.map((v) => { // 阶梯数据
          return {
            interval: [v.rankFrom, v.rankTo], // 阶梯范围
            money: Unit.exchangePriceToYuan(v.money), // 奖罚金额
          };
        }),
      };
    }
    // 被禁用的情况：1. 竞赛总体被禁用 2. 奖罚方式未选择该方式
    const disabledAwardSetting = (
      disabled ||
      (getFieldValue('awardSetting') !== undefined &&
        !getFieldValue('awardSetting'))
    );
    const disabledRankSetting = disabled || !getFieldValue('rankSetting');
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('awardSetting', {
          valuePropName: 'checked',
          initialValue: awardSetting,
        })(<Checkbox disabled={disabled}>奖励法</Checkbox>),
      },
      {
        label: '',
        form: (
          <AwardSetting
            platformCode={platformCode}
            currentStep={CurrentStep}
            dataSource={dataSource}
            disabled={disabledAwardSetting}
            form={form}
            style={{ marginLeft: 30 }}
          />
        ),
      },
      {
        label: '',
        form: getFieldDecorator('rankSetting', {
          valuePropName: 'checked',
          initialValue: rankSetting,
        })(<Checkbox disabled={disabled}>竞赛评比</Checkbox>),
      },
      {
        label: '',
        form: getFieldDecorator('rank', {
          initialValue: rank,
        })(<RankSetting disabled={disabledRankSetting} />),
      },
    ];

    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };

    return (
      <div>
        <TitleBar title="设定奖罚" />
        <DeprecatedCoreForm items={formItems} layout={layout} cols={1} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染适用范围 */}
        {this.renderRange()}

        {/* 渲染设定奖罚 */}
        {this.renderAward()}
      </div>
    );
  }
}

function mapStateToProps({ financeRulesGenerator: { orderTypes } }) {
  return { orderTypes };
}

export default connect(mapStateToProps)(CompetitionEdit);
