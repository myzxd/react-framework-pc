/**
 * 服务费规则 - 模板规则创建 - 单型选择组件
 */
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ComponentOrderTypeItem from './item';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import { FinanceSalaryMeetConditions } from '../../../../../../application/define';

const RadioGroup = Radio.Group;

class ComponentOrderType extends Component {
  static propTypes = {
    value: PropTypes.object,
    dataList: PropTypes.array,        // 默认数据
    layout: PropTypes.object,
    isHideConditions: PropTypes.bool, // 是否隐藏满足条件
  }
  static defaultProps = {
    layout: {},
    isHideConditions: false,
  }

  // 改变rules值
  onChangeRules = (v, key) => {
    const { value } = this.props;
    const rules = Array.isArray(value.rules) && value.rules.length > 0 ? value.rules : [{}];
    rules[key] = v;
    this.triggerChange({ rules });
  }

  // 满足条件
  onChangeConditions = (e) => {
    this.triggerChange({ matchType: e.target.value });
  }

  // 新增条目
  onPlusItem = () => {
    const { value } = this.props;
    const rules = Array.isArray(value.rules) && value.rules.length > 0 ? value.rules : [{}];
    rules.push({});
    this.triggerChange({ rules });
  }

  // 删除条目
  onDeleteItem = (key) => {
    const { value } = this.props;
    const rules = Array.isArray(value.rules) && value.rules.length > 0 ? value.rules : [{}];
    rules.splice(key, 1);
    this.triggerChange({ rules });
  }

  // 值改变回调
  triggerChange = (changedValue) => {
    const { value } = this.props;
    const rules = Array.isArray(value.rules) && value.rules.length > 0 ? value.rules : [{}];
    const { matchType } = value;
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, { rules, matchType }, changedValue));
    }
  }

  // 渲染满足条件
  rendeConditions = () => {
    const { disabled, value } = this.props;
    const formItems = [
      {
        label: '',
        form: (<RadioGroup disabled={disabled} value={value.matchType} onChange={this.onChangeConditions}>
          <Radio value={FinanceSalaryMeetConditions.meetAll}>{FinanceSalaryMeetConditions.description(FinanceSalaryMeetConditions.meetAll)}</Radio>
          <Radio value={FinanceSalaryMeetConditions.meetAny}>{FinanceSalaryMeetConditions.description(FinanceSalaryMeetConditions.meetAny)}</Radio>
        </RadioGroup>),
      },
    ];
    return (<DeprecatedCoreForm items={formItems} />);
  }

  // 渲染子项目
  renderItems = () => {
    const { value } = this.props;
    const rules = Array.isArray(value.rules) && value.rules.length > 0 ? value.rules : [{}];
    const { dataList, layout } = this.props;
    const { platformCode, disabled, tags } = this.props;
    // 遍历子项
    const items = rules.map((v, i, arr) => {
      const len = arr.length;
      const config = {};

        // 所有条目都添加删除按钮
      config.operatDelete = true;
        // 若是最后一行数据,则添加创建按钮
      if (i === len - 1) {
        config.operatCreate = true;
          // 若只有一行数据,去掉删除按钮
        if (i === 0) {
          config.operatDelete = false;
        }
      }

      const {
        index,
        symbol,
        num,
        unit,
        name,
      } = v;

      return (
        <ComponentOrderTypeItem
          key={i}
          itemIndex={i}
          tags={tags}
          disabled={disabled}
          platformCode={platformCode}
          index={index}
          symbol={symbol}
          name={name}
          num={num}
          unit={unit}
          layout={layout}
          config={config}
          dataList={dataList}
          onChange={this.onChangeRules}
          onPlusItem={this.onPlusItem}
          onDeleteItem={this.onDeleteItem}
        />
      );
    });

    return items;
  }

  render() {
    const { isHideConditions } = this.props;
    return (
      <div>
        {this.renderItems()}
        {isHideConditions ? '' : this.rendeConditions()}
      </div>
    );
  }

}

export default ComponentOrderType;
