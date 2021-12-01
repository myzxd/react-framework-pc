/**
 * 单量提成规则--详细方案规则
 */
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';
import Items from './items';

const { itemsConfig } = Items;

class ExtractRule extends Component {
  static propTypes = {
    value: PropTypes.array,          // 子项目
    extractType: PropTypes.string,   // 方案提成类型
    isDisabled: PropTypes.bool,      // 表单是否可编辑
    onChange: PropTypes.func,        // form中的onChange
    platformCode: PropTypes.string,  // 平台code
    indexId: PropTypes.string,       // 结算指标id
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {};
    if (!props.value) {
      this.onChange(this.ruleArr);
    }
    this.ruleArr = [
      { min: 0, symbolMin: '<', index: '', symbolMax: '<=', max: 0, unitAmount: 1, money: 0 },
      { min: 0, symbolMin: '<', index: '', symbolMax: '<=', max: 'inf', unitAmount: 1, money: 0 },
    ];
  }

  onChange = (rangeTable) => {
    // form onChange
    const { onChange } = this.props;
    if (onChange) {
      onChange(rangeTable);
    }
  }

  // 修改子项目内容
  onChangeItem = (key, e) => {
    const rangeTable = this.props.value || this.ruleArr;
    const extractRuleArr = rangeTable.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          ...e,
        };
      }
      // 当改变属性为max、改变条的下一条。满足这三个条件时更改起始单量
      if (Object.keys(e)[0] === 'max' && index === key + 1) {
        if (!e.max) {
          return {
            ...item,
            min: 0,
          };
        }
        return {
          ...item,
          min: e.max,
        };
      }
      return item;
    });
    this.onChange(extractRuleArr);
  }

  // 创建子项目
  onCreateItem = (key) => {
    const rangeTable = this.props.value;
    // 新建子项目的起始单量
    const min = rangeTable[key].max;
    const max = rangeTable[key].max + 1;
    rangeTable.splice(key + 1, 0, { min, symbolMin: '<', index: rangeTable[key].index || '', symbolMax: '<=', max, money: 0, unitAmount: 1 });
    rangeTable.splice(rangeTable.length - 1, 1, { ...rangeTable[rangeTable.length - 1], min: max });
    this.onChange(rangeTable);
  }

  // 删除子项目
  onDeleteItem = (key) => {
    const rangeTable = this.props.value;
    if (key === 0) {
      rangeTable[key + 1].min = 0;
    } else {
      // 删除子项目时设置前一个子项目结束金额及比较类型为此子项目的结束金额及比较类型
      rangeTable[key - 1].max = rangeTable[key].max;
      rangeTable[key - 1].symbolMax = rangeTable[key].symbolMax;
    }
    rangeTable.splice(key, 1);
    this.onChange(rangeTable);
  }

  // 渲染提成规则
  renderExtractRule = () => {
    const { indexId, orderTypes } = this.props;
    const rangeTable = this.props.value || this.ruleArr;
    let rangeTableData = this.props.value || this.ruleArr;
    if (indexId) {
      rangeTableData = rangeTable.map((item) => {
        return {
          ...item,
          index: indexId,
        };
      });
    }
    const { extractType, isDisabled, platformCode } = this.props;
    // 更改区间数值
    rangeTableData.forEach((item, index) => {
      if (index !== 0) {
          // eslint-disable-next-line no-param-reassign
        item.min = rangeTableData[index - 1].max;
      }
        // 创建及编辑时‘小于等于’与‘小于’保持联动
      if (`${item.symbolMax}` === '<') {
        rangeTableData[index + 1].symbolMin = '<=';
      } else if (rangeTableData[index + 1]) {
        rangeTableData[index + 1].symbolMin = '<';
      }
    });
    return (
      <div>
        {
          rangeTableData.map((item, index, records) => {
            const length = records.length;
            // 显示项目的配置项
            const config = [];
            // 只有一行数据的情况下，只显示创建按钮
            if (length === 2 && index !== 1) {
              config.push(itemsConfig.openCreate);
            // 多行数据的情况下，倒数第二条条显示创建按钮
            } else if (index === length - 2) {
              config.push(itemsConfig.openCreate, itemsConfig.openDelete);
            // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮（最后一条都不显示）
            } else if (index !== length - 1) {
              config.push(itemsConfig.openDelete);
            }
            // 合并表单数据，传递给下一级组件
            const value = Object.assign({ key: index }, item, {
              config,
              extractType,
              isDisabled,
              platformCode,
            });
            return (<Items
              key={index}
              value={value}
              orderTypes={orderTypes}
              onCreate={this.onCreateItem}
              onDelete={this.onDeleteItem}
              onChange={this.onChangeItem}
            />);
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

function mapStateToProps({ financeRulesGenerator: { orderTypes } }) {
  return { orderTypes };
}
export default connect(mapStateToProps)(ExtractRule);
