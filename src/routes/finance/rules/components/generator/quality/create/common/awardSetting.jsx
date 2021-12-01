/**
 * 服务费规则 补贴质量 奖励部分 Finance/Components/generator/quality/create/common/awardSetting
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import dot from 'dot-prop';
import _ from 'lodash';

import {
  FinanceQualityAwardType,
  FinanceQualityAwardOrPunish,
  Unit,
} from '../../../../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../../../../components/core';
import LadderAward from './ladderAward';
import MutipleConditionSetting from './mutipleConditionSetting';

const RadioGroup = Radio.Group;
const defaultMutipleValue = [{
  award: {
    awardOrPunish: FinanceQualityAwardOrPunish.award, // 奖励或惩罚默认奖励
    index: 1, // 当前索引
  },
}];

class AwardSetting extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台
    currentStep: PropTypes.number, // 当前步骤
    form: PropTypes.object,     // 上级下传表单
    disabled: PropTypes.bool,   // 是否禁用
    style: PropTypes.object,    // 样式
    dataSource: PropTypes.object, // 数据源(若为展示/编辑模式则为object,新建模式则undefined)
  }

  static defaultProps = {
    form: {}, // 表单实例
    disabled: false, // 是否禁用
    style: {}, // 样式
  }

  constructor(props) {
    super(props);
    this.private = {
      multipleDisabledChanged: false, // 多条件奖罚的禁用是否改变
    };
  }

  componentDidUpdate(props) {
    // disabled(选择的奖励方式)发生改变时,在组件渲染完成(rules更新完成)
    // 之后, 调用表单数据校验方法,以确保disabled的数据不被校验
    const { validateFields, getFieldValue } = this.props.form;
    const awardType = getFieldValue('awardType');
    if (this.private.multipleDisabledChanged) {
      this.private.multipleDisabledChanged = false;
      if (awardType !== FinanceQualityAwardType.mutipleConditions) {
        validateFields(
          ['multipleConditions'],
          { force: true },
        );
        return;
      }
    }
    if (this.props.disabled !== props.disabled) {
      validateFields(
        ['multipleConditions'],
        { force: true },
      );
    }
  }

  onChangeAwardType = () => {
    this.private.multipleDisabledChanged = true;
  }

  // 根据指标匹配单位
  getUnitByIndex = (index, currentOrderTypes) => {
    for (let i = 0; i < currentOrderTypes.data.length; i += 1) {
      if (currentOrderTypes.data[i].id === index) {
        return currentOrderTypes.data[i].unit;
      }
    }
  }

  validateMultipleConditions = (disabled) => {
    return (rule, value, callback) => {
      if (disabled) {
        callback();
        return;
      }
      if (!value) {
        callback('数据格式错误');
        return;
      }
      if (_.isArray(value) === false) {
        callback('数据格式错误');
        return;
      }
      for (let i = 0; i < value.length; i += 1) {
        const {
          award,
          conditions,
        } = value[i];

        if (_.isObject(conditions) === false) {
          callback(`第${i + 1}条条件未填写`);
          return;
        }

        if (_.isArray(conditions.rules) === false || conditions.rules.length === 0) {
          callback(`第${i + 1}条条件未填写`);
          return;
        }

        for (let j = 0; j < conditions.rules.length; j += 1) {
          const {
            index,
            symbol,
            num,
            unit,
          } = conditions.rules[j];

          if (index === undefined || index === '') {
            callback(`第${i + 1}条的第${j + 1}个条件的指标未选择`);
            return;
          }
          if (symbol === undefined || symbol === '') {
            callback(`第${i + 1}条的第${j + 1}个条件的比较符未选择`);
            return;
          }
          if (num === undefined || num === '') {
            callback(`第${i + 1}条的第${j + 1}个条件的数值未填写`);
            return;
          }
          const numValidateRes = Unit.dynamicValid(num, unit);
          if (numValidateRes !== true) {
            callback(`第${i + 1}条的第${j + 1}个条件的数值${numValidateRes}`);
            return;
          }
        }

        if (award === undefined) {
          callback(`第${i + 1}条奖励方式未填写`);
          return;
        }
        if (award.compareItem === undefined || award.compareItem === '') {
          callback(`第${i + 1}条奖励指标未选择`);
          return;
        }
        if (award.index === undefined || award.index === '') {
          callback(`第${i + 1}条奖励单量未填写`);
          return;
        }
        if (
          Number(award.awardOrPunish) !== FinanceQualityAwardOrPunish.award &&
          Number(award.awardOrPunish) !== FinanceQualityAwardOrPunish.punish
        ) {
          callback(`第${i + 1}条奖励/惩罚未选择`);
          return;
        }
        if (award.money === undefined || award.money === '') {
          callback(`第${i + 1}条金额未填写`);
          return;
        }
        const moneyValidateRes = Unit.dynamicValid(award.money, Unit.priceYuan);
        if (moneyValidateRes !== true) {
          callback(`第${i + 1}条金额${moneyValidateRes}`);
          return;
        }
      }
      callback();
    };
  }

  renderLadderAward = () => {
    const { form, disabled, dataSource, platformCode, currentStep } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    // 如果接口返回的bizLogic有数据, 则采用bizLogic, 否则返回默认有阶梯奖罚的bizLogic
    const isLogicByRange = dot.get(dataSource, 'computeLogic.bizLogic', ['qc_logic_by_range']);
    // 奖罚类型, 默认使用阶梯奖罚
    let awardType = FinanceQualityAwardType.ladder;
    // 如果bizlogic存在阶梯奖罚字段, 则使用阶梯奖罚
    if (isLogicByRange.indexOf('qc_logic_by_range') !== -1) {
      awardType = FinanceQualityAwardType.ladder;
    }
    if (isLogicByRange.indexOf('qc_logic_by_multiple') !== -1) {
      awardType = FinanceQualityAwardType.mutipleConditions;
    }

    // 判断阶梯奖励是否禁用, 条件:
    // 1. 该组件未启用 或
    // 2. 单选选项未选择阶梯奖励 且 非首次渲染(表单未绑定值)
    const disabledLadderAward = (
      disabled ||
      (getFieldValue('awardType') !== FinanceQualityAwardType.ladder &&
        getFieldValue('awardType') !== undefined)
    );

    // 表单第一行
    const formItemsFirstLine = [
      {
        label: '',
        form: getFieldDecorator('awardType', {
          initialValue: awardType,
        })(
          <RadioGroup disabled={disabled}>
            <Radio value={FinanceQualityAwardType.ladder}>按阶梯设置</Radio>
          </RadioGroup>,
        ),
      },
    ];

    // 表单第二行
    const formItemsSecondLine = [
      {
        label: '',
        form: (
          <LadderAward
            platformCode={platformCode}
            currentStep={currentStep}
            dataSource={dataSource}
            form={form}
            disabled={disabledLadderAward}
          />
        ),
      },
    ];
    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItemsFirstLine} layout={layout} cols={1} />
        <DeprecatedCoreForm style={{ marginLeft: 20 }} items={formItemsSecondLine} layout={layout} cols={1} />
      </div>
    );
  }

  renderMutipleConditionsAward = () => {
    const { disabled, dataSource, platformCode, currentStep, orderTypes } = this.props;
    const currentOrderTypes = orderTypes[`${platformCode}${currentStep}`];
    if (dataSource && !currentOrderTypes) {
      return <div />;
    }
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const awardType = dot.get(
      dataSource,
      'computeLogic.bizLogic',
      ['qc_logic_by_range'],
    ).indexOf('qc_logic_by_multiple') !== -1 ? FinanceQualityAwardType.mutipleConditions : FinanceQualityAwardType.ladder;
    const multipleParams = dot.get(dataSource, 'computeLogic.multipleParams', undefined);
    let mutipleConditions;
    if (multipleParams !== undefined && awardType === FinanceQualityAwardType.mutipleConditions) {
      mutipleConditions = multipleParams.map((rawValue) => {
        const { unitIndex } = rawValue;
        const unit = this.getUnitByIndex(unitIndex, currentOrderTypes);
        return {
          award: {
            awardOrPunish: rawValue.unitMoney >= 0 ? FinanceQualityAwardOrPunish.award : FinanceQualityAwardOrPunish.punish,
            compareItem: rawValue.unitIndex,
            index: Unit.dynamicExchange(rawValue.unitAmount, unit, false),
            money: rawValue.unitMoney >= 0 ? Unit.exchangePriceToYuan(rawValue.unitMoney) : -Unit.exchangePriceToYuan(rawValue.unitMoney),
          },
          conditions: {
            rules: rawValue.rules.map((v) => {
              const unitRule = this.getUnitByIndex(v.index, currentOrderTypes);
              return {
                index: v.index,
                symbol: v.symbol,
                num: Unit.dynamicExchange(v.num, unitRule, false),
              };
            }),
          },
        };
      });
    } else {
      mutipleConditions = _.cloneDeep(defaultMutipleValue);
    }
    const disabledMutipleConditions = (
      disabled ||
      getFieldValue('awardType') !== FinanceQualityAwardType.mutipleConditions
    );
    const formItemsFirstLine = [
      {
        label: '',
        form: getFieldDecorator('awardType', {
          initialValue: awardType,
        })(
          <RadioGroup
            disabled={disabled}
            onChange={this.onChangeAwardType}
          >
            <Radio value={FinanceQualityAwardType.mutipleConditions}>按多组条件设置</Radio>
          </RadioGroup>,
        ),
      },
    ];
    const formItemsSecondLine = [
      {
        label: '',
        form: getFieldDecorator('multipleConditions', {
          initialValue: mutipleConditions,
          rules: [{
            validator: this.validateMultipleConditions(disabledMutipleConditions),
          }],
        })(
          <MutipleConditionSetting
            platformCode={platformCode}
            currentStep={currentStep}
            disabled={disabledMutipleConditions}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItemsFirstLine} layout={layout} cols={1} />
        <DeprecatedCoreForm style={{ marginLeft: 20 }} items={formItemsSecondLine} layout={layout} cols={1} />
      </div>
    );
  }

  render() {
    const { style } = this.props;
    return (
      <div style={style}>
        {this.renderLadderAward()}
        {this.renderMutipleConditionsAward()}
      </div>
    );
  }
}

function mapStateToProps({ financeRulesGenerator: { orderTypes } }) {
  return { orderTypes };
}

export default connect(mapStateToProps)(AwardSetting);
