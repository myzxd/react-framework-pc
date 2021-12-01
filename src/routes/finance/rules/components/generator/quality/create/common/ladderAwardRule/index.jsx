/**
 * 服务费规则 - 质量评比 - 阶梯奖励组件
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  FinanceQualityAwardOrPunish,
  SalaryRulesLadderCalculateType,
} from '../../../../../../../../../application/define';
import Item from './item';

const { itemsConfig } = Item;

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

class LadderAwardRule extends Component {

  static propTypes = {
    indicatorData: PropTypes.object,     // 订单指标
    disabled: PropTypes.bool,        // 是否禁用
    form: PropTypes.object,           // 表单
  }

  static defaultProps = {
    disabled: false,                 // 默认不禁用
    form: {},                        // 表单
  }

  // 如果value不同，从props中更新state的value
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      let { value } = props;
      if (!value || value.length < 1) {
        value = defaultFormValue;
      }
      return {
        value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    if ('value' in props) {
      let { value } = props;
      if (!value || value.length < 1) {
        value = defaultFormValue;
      }
      this.state = { value }; // 表单value
    }
  }

  onChange = (extractRule) => {
    // form onChange
    const { onChange } = this.props;
    if (onChange) {
      onChange(extractRule);
    }
  }

  // 修改子项目内容
  onChangeItem = (key, e) => {
    const extractRule = this.props.value || [defaultFormValue];
    const extractRuleArr = extractRule.map((item, index) => {
      if (e.awardOrPunish) {
        return {
          ...item,
          ...e,
        };
      }
      if (index === key) {
        return {
          ...item,
          ...e,
        };
      }
      return item;
    });
    this.onChange(extractRuleArr);
  }

  // 创建子项目
  onCreateItem = (key) => {
    const extractRule = this.props.value || [{}];
    // 新建子项目的起始单量
    const startOrder = dot.get(extractRule[key], 'endOrder', 0);
    extractRule.push({
      startOrder,
      compareType: '<=',
      endOrder: 0,
      money: 0,
      minMoney: 0,
      unitAmount: 1,
      awardOrPunish: extractRule[0].awardOrPunish ? extractRule[0].awardOrPunish : `${FinanceQualityAwardOrPunish.award}`,
      calculateType: `${SalaryRulesLadderCalculateType.nomal}`,
      compareItem: '',
    });
    this.onChange(extractRule);
  }

  // 删除子项目
  onDeleteItem = (key) => {
    const extractRule = this.props.value;
    extractRule.splice(key, 1);
    this.onChange(extractRule);
  }

  // 渲染提成规则
  renderExtractRule = () => {
    const extractRule = this.state.value;
    const { disabled, indicatorData, form } = this.props;
    return (
      <div>
        {
          extractRule.map((item, index, records) => {
            const length = records.length;
            // 显示项目的配置项
            const config = [];
            // 只有一行数据的情况下，只显示创建按钮
            if (length === 1) {
              config.push(itemsConfig.openCreate);
            // 多行数据的情况下，最后一条显示创建按钮
            } else if (index === length - 1) {
              config.push(itemsConfig.openCreate, itemsConfig.openDelete);
            // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮
            } else {
              config.push(itemsConfig.openDelete);
            }
            let preEndOrder = 0;
            let nextStartOrder = Infinity;

            if (index > 0) {
              preEndOrder = records[index - 1].endOrder;
            }
            if (index + 1 < length) {
              nextStartOrder = records[index + 1].startOrder;
            }

            // 合并表单数据，传递给下一级组件
            const value = Object.assign({ key: index }, item, {
              indicatorData,
              config,
              disabled,
              preEndOrder,
              nextStartOrder,
            });
            return (
              <Item
                disabled={disabled}
                key={index}
                value={value}
                form={form}
                onCreate={this.onCreateItem}
                onDelete={this.onDeleteItem}
                onChange={this.onChangeItem}
              />
            );
          })
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderExtractRule()}
      </div>
    );
  }
}

export default LadderAwardRule;
