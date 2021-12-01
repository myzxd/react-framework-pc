/**
 * 服务费规则 补贴质量 竞赛评比 按多组条件设置
 * Finance/Components/generator/quality/create/competition/mutipleConditionSetting/index
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MutipleConditionSettingItem from './item';
import {
  FinanceQualityAwardOrPunish,
} from '../../../../../../../../../application/define';

const defaultValue = {
  award: {
    index: 1, // 当前索引
    awardOrPunish: FinanceQualityAwardOrPunish.award, // 默认奖励
  },
};

class MutipleConditionSetting extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台
    currentStep: PropTypes.number, // 当前步骤
    disabled: PropTypes.bool, // 是否禁用
  }

  static defaultProps = {
    disabled: false, // 是否禁用
  }

  // 如果value不同，从props中更新state的value
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      const value = props.value || [];
      if (value.length < 1) {
        value.push(defaultValue);
      }
      return {
        value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || []; // 表单value
    if (value.length < 1) {
      value.push(defaultValue);
    }
    this.state = { value };
  }

  // 值改变回调
  onChange = (v, index) => {
    const { value } = this.state;
    const { onChange } = this.props;
    value[index] = v;
    if (onChange) {
      onChange(value);
    }
  }

  // 新增条目
  onPlusItem = () => {
    const { value } = this.state;
    value.push(defaultValue);
    this.onChange(value);
  }

  // 删除条目
  onDeleteItem = (index) => {
    const { value } = this.state;
    value.splice(index, 1);
    this.onChange(value);
  }

  renderItems = () => {
    const { value } = this.state;
    const { disabled, platformCode, currentStep } = this.props;
    const items = value.map((v, i, arr) => {
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
        conditions = {},
        award = {},
      } = v;

      return (
        <MutipleConditionSettingItem
          platformCode={platformCode}
          currentStep={currentStep}
          disabled={disabled}
          key={i}
          index={i}
          conditions={conditions}
          award={award}
          config={config}
          onChange={this.onChange}
          onPlusItem={this.onPlusItem}
          onDeleteItem={this.onDeleteItem}
        />
      );
    });

    return items;
  }

  render() {
    return (
      <div>
        {this.renderItems()}
      </div>
    );
  }
}

export default MutipleConditionSetting;

