/**
 * 服务费规则生成 - 管理组件 - 公用组件 - 公用表单 Finance/Rules/Generator
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentDayItems from './item';
import { FinanceSalaryDayState } from '../../../../../../../../application/define';

import styles from './style/index.less';

const defaultValue = [{
  min: undefined,
  symbolMin: '<',
  index: FinanceSalaryDayState.attendanceDays,
  symbolMax: undefined,
  max: undefined,
  money: undefined,
}];

class ManagementFormComponent extends Component {
  static propTypes = {
    value: PropTypes.array,
  }

  // 更改最小天数
  onChangeMin = (e, index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure[index].min = e;
    this.triggerChange(dataSoure);
  }

  // 改变最大天数
  onChangeMax = (e, index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure[index].max = e;
    const len = dataSoure.length - 1;
    if (index !== len) {
      dataSoure[index + 1].min = e;
    }
    this.triggerChange(dataSoure);
  }

  // 改变比较
  onChangeSymbolMax = (e, index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure[index].symbolMax = e;
    this.triggerChange(dataSoure);
  }

  // 改变扣罚元
  onChangeDeductionMoney = (e, index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure[index].money = e;
    this.triggerChange(dataSoure);
  }

  // 添加新的一项
  onPlusItem = (index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure.push({ min: 0, index: FinanceSalaryDayState.attendanceDays, symbolMin: '<', symbolMax: '', max: undefined, money: undefined });
    const len = dataSoure.length - 1;
    dataSoure[len].min = dataSoure[index].max;
    this.triggerChange(dataSoure);
  }

  // 改变天数
  onConfirmCompareItem = (e, index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure[index].index = e;
    this.triggerChange(dataSoure);
  }

  // 删除项
  onDeleteItem = (index) => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    dataSoure.splice(index, 1);
    this.triggerChange(dataSoure);
  }

  // 改变value值
  triggerChange = (data) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  }

  // 遍历组件子项
  renderDayItems = () => {
    const { value } = this.props;
    const dataSoure = value ? value : defaultValue;
    const { platformCode, disabled } = this.props;
    return dataSoure.map((val, index, arr) => {
      const len = arr.length;
      const config = {};

      // 所有条目都添加删除按钮
      config.operatDelete = true;
      // 若是最后一行数据,则添加创建按钮
      if (index === len - 1) {
        config.operatCreate = true;
          // 若只有一行数据,去掉删除按钮
        if (index === 0) {
          config.operatDelete = false;
        }
      }
      // 合并表单数据，传递给下一级组件
      const data = Object.assign({}, {
        key: index,
        config,
        ...val,
      });
      return (
        <ComponentDayItems
          key={index}
          item={data}
          platformCode={platformCode}
          onPlusItem={this.onPlusItem}
          onDeleteItem={this.onDeleteItem}
          onChangeMin={this.onChangeMin}
          onChangeMax={this.onChangeMax}
          onChangeSymbolMax={this.onChangeSymbolMax}
          onChangeDeductionMoney={this.onChangeDeductionMoney}
          onConfirmCompareItem={this.onConfirmCompareItem}
          disabled={disabled}
        />
      );
    });
  }

  render = () => {
    return (
      <div className={styles['app-comp-finance-day-item-from']}>
        {/* 遍历组件 */}
        {this.renderDayItems()}
      </div>
    );
  }
}

export default ManagementFormComponent;
