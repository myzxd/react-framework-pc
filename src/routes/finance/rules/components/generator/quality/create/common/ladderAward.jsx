/**
 * 服务费规则 补贴质量 单人考核 设定奖罚 阶梯奖励
 * Finance/Components/generator/quality/create/personLadderAward
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import {
  InputNumber,
} from 'antd';

import {
  Unit,
  FinanceQualityAwardOrPunish,
  SalaryRulesLadderCalculateType,
} from '../../../../../../../../application/define';
import {
  DeprecatedCoreForm,
} from '../../../../../../../../components/core';
import LadderAwardRule from '../common/ladderAwardRule';
import ComponentSalaryIndicators from '../../../../common/salaryIndicators';

import styles from './style/index.less';

// 表单默认值
const defaultFormValue = [{
  startOrder: 0, // 单量左边界
  compareType: '<=', // 比较符
  endOrder: 0, // 单量右边界
  money: 0, // 金额
  minMoney: 0, // 最小金额
  unitAmount: 1, // 计算单位
  awardOrPunish: `${FinanceQualityAwardOrPunish.award}`, // 奖励还是惩罚
  calculateType: `${SalaryRulesLadderCalculateType.nomal}`, // 计算方式
  compareItem: '',
}];

class LadderAward extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台
    currentStep: PropTypes.number, // 当前步骤
    disabled: PropTypes.bool,   // 是否禁用
    form: PropTypes.object,     // 上级表单
    dataSource: PropTypes.object, // 数据源(展示/编辑模式为object,新建模式为undfined)
  }

  static defaultProps = {
    disabled: false, // 是否禁用
    form: {},                   // 上级表单默认值
  }

  constructor(props) {
    super(props);
    this.state = {
      isCollapse: false,         // 是否折叠
      indicatorData: {           // 当前所选指标信息
        id: '',                  // 指标id
        name: '',                // 指标名字
        unit: '',                // 指标单位
      },
    };
  }

  componentDidUpdate(props) {
    // disabled(选择的奖励方式)发生改变时,在组件渲染完成(rules更新完成)
    // 之后, 调用表单数据校验方法,以确保disabled的数据不被校验
    // 变为disabled = false的状态不做校验
    if (props.disabled === this.props.disabled || props.disabled === true) return;
    this.props.form.validateFields(
      ['orderType', 'rewardMoneyLimit', 'ladderAwardRule'],
      { force: true },
    );
  }

  // 改变指标回调
  salaryIndicatorOnChange = (id, unit, name) => {
    this.props.form.setFieldsValue({ orderTypeUnit: unit });
    // 重置步长
    // const ladderAwardRule = this.props.form.getFieldValue('ladderAwardRule');
    // const ladderAwardRuleNew = ladderAwardRule.map((v) => {
    //   return { ...v, unitAmount: 1 };
    // });
    // this.props.form.setFieldsValue({ ladderAwardRule: ladderAwardRuleNew });
    this.setState({ indicatorData: { id, unit, name } });
  }

  validateMaxMoney = (rule, value, callback) => {
    const { disabled } = this.props;
    if (disabled) {
      callback();
      return;
    }
    if (value === undefined) {
      callback('请填写数据');
      return;
    }
    const moneyValidateRes = Unit.dynamicValid(value, Unit.priceYuan);
    if (moneyValidateRes !== true) {
      callback(`${moneyValidateRes}`);
      return;
    }
    callback();
  }

  validateLadderAward = (rule, value, callback) => {
    const { indicatorData: { unit } } = this.state;
    const { disabled } = this.props;
    if (disabled) {
      callback();
      return;
    }
    if (!value) {
      callback('数据格式错误');
      return;
    }
    if (Object.prototype.toString.call(value) !== '[object Array]') {
      callback('数据格式错误');
      return;
    }
    for (let i = 0; i < value.length; i += 1) {
      const {
        startOrder, // 单量左边界
        endOrder, // 单量右边界
        compareType, // 比较符
        money, // 金额
        awardOrPunish, // 奖励还是惩罚
        minMoney, // 最小金额
        calculateType, // 计算方式
        unitAmount, // 计算单位
      } = value[i];

      if (startOrder === undefined) {
        callback(`第${i + 1}条起始数据未填写`);
        return;
      }

      const startOrderValidateRes = Unit.dynamicValid(startOrder, unit);
      if (startOrderValidateRes !== true) {
        callback(`第${i + 1}条起始数据${startOrderValidateRes}`);
        return;
      }

      if (compareType === undefined) {
        callback(`第${i + 1}条比较符未选择`);
      }

      if (endOrder === undefined) {
        callback(`第${i + 1}条结束数据未填写`);
        return;
      }

      if (endOrder <= startOrder) {
        callback(`第${i + 1}条结束数据应大于起始数据`);
        return;
      }

      const endOrderValidateRes = Unit.dynamicValid(endOrder, unit);
      if (endOrderValidateRes !== true) {
        callback(`第${i + 1}条结束数据${endOrderValidateRes}`);
        return;
      }

      if (calculateType === undefined) {
        callback(`第${i + 1}条计算方式未选择`);
        return;
      }

      if (money === undefined) {
        callback(`第${i + 1}条金额未填写`);
        return;
      }

      const moneyValidateRes = Unit.dynamicValid(money, Unit.priceYuan);
      if (moneyValidateRes !== true) {
        callback(`第${i + 1}条金额${moneyValidateRes}`);
        return;
      }

      if (unitAmount === undefined) {
        callback(`第${i + 1}条计算步长未填写`);
        return;
      }

      const unitAmountValidateRes = Unit.dynamicValid(unitAmount, unit);
      if (unitAmountValidateRes !== true) {
        callback(`第${i + 1}条计算步长${moneyValidateRes}`);
        return;
      }

      if (awardOrPunish === undefined) {
        callback(`第${i + 1}条奖励/惩罚未选择`);
        return;
      }

      if (minMoney === undefined) {
        callback(`第${i + 1}条最低金额未填写`);
        return;
      }

      const minMoneyValidateRes = Unit.dynamicValid(minMoney, Unit.priceYuan);
      if (minMoneyValidateRes !== true) {
        callback(`第${i + 1}条最低金额${minMoneyValidateRes}`);
        return;
      }

      if (i + 1 >= value.length) {
        callback();
        return;
      }
      // 如果不是最后一条数据
      const { startOrder: nextStartOrder } = value[i + 1];
      if (endOrder > nextStartOrder) {
        callback(`第${i + 2}条起始数据应大于等于第${i + 1}条结束数据`);
        return;
      }
    }

    callback();
  }

  // 渲染首行
  renderFirstLine = () => {
    const { disabled, dataSource, currentStep, platformCode } = this.props;
    const { getFieldDecorator } = this.props.form;
    const orderType = dot.get(dataSource, 'computeLogic.rangeParams.index', '') || '';
    const totalMaxNum = dot.get(dataSource, 'computeLogic.rangeParams.totalMaxNum', '');
    const rewardMoneyLimit = totalMaxNum ? Unit.exchangePriceToYuan(totalMaxNum) : '';
    const validRequired = !disabled;
    const formItems = [
      {
        label: '',
        span: 4,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: getFieldDecorator('orderType', {
          initialValue: `${orderType}`,
          rules: [{
            required: validRequired,
            message: '请选择',
          }],
        })(
          <ComponentSalaryIndicators
            platformCode={platformCode}
            tagList={[currentStep]}
            disabled={disabled}
            className={styles['app-comp-finance-common-ladder-award-wrap']}
            onChange={this.salaryIndicatorOnChange}
          />,
        ),
      },
      {
        label: '最高金额限制',
        form: getFieldDecorator('rewardMoneyLimit', {
          initialValue: rewardMoneyLimit,
          rules: [{
            validator: this.validateMaxMoney,
          }],
        })(
          <InputNumber
            disabled={disabled}
            formatter={value => `${value}元`}
            parser={value => value.replace('元', '')}
          />,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (<DeprecatedCoreForm items={formItems} cols={2} layout={layout} />);
  }

  // 渲染阶梯奖励组件
  renderLadderAwardRule = () => {
    const { disabled, dataSource } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 指标数据
    const { indicatorData } = this.state;
    // 接口返回的阶梯奖罚数据
    const rangeTable = dot.get(dataSource, 'computeLogic.rangeParams.rangeTable', undefined);
    // 接口返回的计算逻辑
    const bizLogic = dot.get(dataSource, 'computeLogic.bizLogic', []);
    let personLadderAwardRule = [];
    // 如果未使用了阶梯奖罚,则传入默认值
    if (bizLogic.indexOf('qc_logic_by_range') === -1 || rangeTable === undefined) {
      personLadderAwardRule = defaultFormValue;
    } else {
      // 如果使用了阶梯奖励, 将接口的阶梯奖罚数据转化为个人奖罚组件需要的数据
      personLadderAwardRule = rangeTable.map((v) => {
        return {
          startOrder: Unit.dynamicExchange(v.min, indicatorData.unit, false), // 起始指标数值(根据指标转化数值)
          compareType: v.symbolMax, // 比较符
          endOrder: Unit.dynamicExchange(v.max, indicatorData.unit, false), // 结束指标数值(根据指标转化数值)
          // 奖罚的金额(转成正数)
          money: v.money >= 0 ? Unit.exchangePriceToYuan(v.money) : Unit.exchangePriceToYuan(-v.money),
          // 奖励or扣罚(通过返回金额的正/负来取对应枚举值)
          awardOrPunish: v.money >= 0 ? FinanceQualityAwardOrPunish.award : FinanceQualityAwardOrPunish.punish,
          // 最小金额(转成正数)
          minMoney: v.minMoney >= 0 ? Unit.exchangePriceToYuan(v.minMoney) : Unit.exchangePriceToYuan(-v.minMoney),
          // 计算方式(通过deltaFlag的真/假取枚举值)
          calculateType: v.deltaFlag ? SalaryRulesLadderCalculateType.difference : SalaryRulesLadderCalculateType.nomal,
          unitAmount: Unit.dynamicExchange(v.unitAmount, indicatorData.unit, false), // 计算单位(根据指标转化)
        };
      });
    }
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('ladderAwardRule', {
          initialValue: personLadderAwardRule,
          rules: [{
            validator: this.validateLadderAward,
          }],
        })(
          <LadderAwardRule form={this.props.form} disabled={disabled} indicatorData={indicatorData} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (<DeprecatedCoreForm items={formItems} layout={layout} cols={1} />);
  }

  // 渲染内容
  renderContent = () => {
    return (
      <div>
        {this.renderLadderAwardRule()}
      </div>
    );
  }

  render() {
    // 初始化orderTypeUnit
    this.props.form.getFieldDecorator('orderTypeUnit');
    return (
      <div>
        {this.renderFirstLine()}

        {this.renderContent()}
      </div>
    );
  }

}

export default LadderAward;
