/**
 * 服务费规则生成 - 管理组件 - 公用组件 - 公用表单 - 子项 Finance/Rules/Generator
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
    InputNumber,
    Button,
    Select,
  } from 'antd';

import { DeprecatedCoreForm } from '../../../../../../../../components/core';
import { Unit } from '../../../../../../../../application/define';
import ComponentDayNum from '../dayNum/index';

import styles from './style/index.less';

const Option = Select.Option;

class ComponentDayItems extends Component {
  static propTypes = {
    item: PropTypes.object, // 数据
  }
  static defaultProps = {
    item: {},
  }

  // 改变初始天数
  onChangeMin = (e) => {
    const { onChangeMin } = this.props;
    const { key } = this.props.item;
    if (onChangeMin) {
      onChangeMin(e, key);
    }
  }

  // 改变结束天数
  onChangeMax = (e) => {
    const { onChangeMax } = this.props;
    const { key } = this.props.item;
    if (onChangeMax) {
      onChangeMax(e, key);
    }
  }

  // 改变比较
  onChangeSymbolMax = (e) => {
    const { onChangeSymbolMax } = this.props;
    const { key } = this.props.item;
    if (onChangeSymbolMax) {
      onChangeSymbolMax(e, key);
    }
  }

  // 改变扣罚元
  onChangeDeductionMoney = (e) => {
    const { onChangeDeductionMoney } = this.props;
    const { key } = this.props.item;
    if (onChangeDeductionMoney) {
      onChangeDeductionMoney(e, key);
    }
  }

  // 添加
  onPlusItem = () => {
    const { onPlusItem } = this.props;
    const { key } = this.props.item;
    if (onPlusItem) {
      onPlusItem(key);
    }
  }

  // 删除每一项
  onDeleteItem = () => {
    const { onDeleteItem } = this.props;
    const { key } = this.props.item;
    if (onDeleteItem) {
      onDeleteItem(key);
    }
  }

  // 改变天数
  onConfirmCompareItem = (e) => {
    const { onConfirmCompareItem } = this.props;
    const { key } = this.props.item;
    if (onConfirmCompareItem) {
      onConfirmCompareItem(e, key);
    }
  }

  // 渲染表单子项
  renderForm = () => {
    const { min, config, symbolMin, key, symbolMax, index, max, money } = this.props.item;
    const { disabled } = this.props;
    const formItems = [
      {
        label: '',
        span: 3,
        form: <InputNumber
          min={0}
          onChange={this.onChangeMin}
          disabled={disabled}
          value={min}
        />,
      },
      {
        label: '',
        span: 1,
        form: symbolMin,
      },
      {
        label: '',
        span: 3,
        form: (
          <ComponentDayNum disabled={disabled} onConfirm={this.onConfirmCompareItem} compareItem={index} />
        ),
      },
      {
        label: '',
        span: 3,
        form: (
          <Select
            disabled={disabled}
            value={symbolMax}
            className={styles['app-comp-finance-day-item-from']}
            onChange={this.onChangeSymbolMax}
          >
            <Option value="<=">{'<='}</Option>
            <Option value=">=">{'>='}</Option>
            <Option value="<">{'<'}</Option>
            <Option value=">">{'>'}</Option>
            <Option value="!=">{'!='}</Option>
            <Option value="=">{'='}</Option>
          </Select>
          ),
      },
      {
        label: '',
        span: 3,
        form: (
          <InputNumber
            onChange={this.onChangeMax}
            disabled={disabled}
            value={max}
            min={0}
          />
          ),
      },
      {
        label: '',
        span: 2,
        form: '扣罚',
      },
      {
        label: '',
        span: 4,
        form: (
          <InputNumber
            value={money}
            disabled={disabled}
            className={styles['app-comp-finance-day-item-from']}
            step={0.01}
            min={0}
            onChange={this.onChangeDeductionMoney}
            formatter={value => `${Unit.limitDecimals(value)}元`}
            parser={value => Unit.limitDecimals(value.replace('元', ''))}
          />
        ),
      },
    ];
    if (key !== 0) {
      formItems.splice(0, 1, {
        label: '',
        span: 3,
        form: <span>{min}</span>,
      });
    }

    // 按钮
    const btns = [];

    if (config.operatDelete) {
      btns.push((
        <Button
          key="minus"
          shape="circle"
          icon={<MinusOutlined />}
          onClick={this.onDeleteItem}
          className={styles['app-comp-finance-day-item-button']}
          disabled={disabled}
        />
      ));
    }

    if (config.operatCreate) {
      btns.push((
        <Button
          key="plus"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={this.onPlusItem}
          disabled={disabled}
        />
        ));
    }

    formItems.push({
      span: 4,
      label: '',
      form: (<div>{btns}</div>),
    });


    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  render = () => {
    return (
      <div className={styles['app-comp-finance-day-item-from']}>
        {/* 渲染表单子项 */}
        {this.renderForm()}
      </div>
    );
  }
}

export default ComponentDayItems;
