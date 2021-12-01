/**
 * 服务费规则 - 质量评比 - 阶梯奖励组件 - 条目组件
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Button, InputNumber, Tooltip } from 'antd';

import {
  FinanceQualityAwardOrPunish,
  SalaryRulesLadderCalculateType,
} from '../../../../../../../../../application/define';
import PopoverRadio from '../../../../../common/popoverRadio';
import ComponentPopconfirmBtns from '../../../../../common/popconfirmBtns/index';

import styles from './style/index.less';

const { Option } = Select;

// 子项目配置项
const itemsConfig = {
  openCreate: 'openCreate',
  openDelete: 'openDelete',
};

class Item extends Component {

  // 修改表单
  onChange = (e) => {
    const key = dot.get(this.props, 'value.key');     // 数据条目的key
    const onChange = dot.get(this.props, 'onChange'); // 回调事件, 数据变化
    if (onChange) {
      onChange(key, e);
    }
  }

  // 创建操作的回调
  onCreate = () => {
    const key = dot.get(this.props, 'value.key');     // 数据条目的key
    const onCreate = dot.get(this.props, 'onCreate'); // 回调事件, 创建按钮
    if (onCreate) {
      onCreate(key);
    }
  }

  // 删除操作的回调
  onDelete = () => {
    const onDelete = dot.get(this.props, 'onDelete'); // 回调事件, 删除按钮
    const key = dot.get(this.props, 'value.key');     // 数据条目的key
    if (onDelete) {
      onDelete(key);
    }
  }

  // 选择比较形式
  changeCompareType = (compareType) => {
    this.onChange({ compareType });
  }

  // 更改开始单量
  changeStartOrder = (startOrder) => {
    this.onChange({ startOrder });
  }

  // 更改结束单量
  changeEndOrder = (endOrder) => {
    this.onChange({ endOrder });
  }

  // 更改区间价格
  changeIntervalMoney = (money) => {
    this.onChange({ money });
  }

  // 更改奖励或罚款
  changeAwardOrPunish = (awardOrPunish) => {
    this.onChange({ awardOrPunish });
  }

  // 更改计算方式
  changeCalculateType = (calculateType) => {
    this.onChange({ calculateType });
  }

  // 更改最小金额
  changeMinMoney = (minMoney) => {
    this.onChange({ minMoney });
  }

  // 更改步长
  changeUnitAmount = (unitAmount) => {
    this.onChange({ unitAmount });
  }

  // render without DeprecatedCoreForm
  render() {
    const {
      startOrder, // 单量左边界
      compareType, // 比较符
      endOrder, // 单量右边界
      money, // 金额
      disabled, // 是否禁用
      awardOrPunish, // 奖励还是惩
      indicatorData, // 指标数据
      calculateType, // 计算方式
      minMoney, // 最小金额
      unitAmount, // 计算单位
      key,
    } = dot.get(this.props, 'value');
    const indicatorId = this.props.form.getFieldValue('orderType');
    const { unitText } = this.props;
    const { name, unit } = indicatorData;
    const indicatorNameShow = indicatorId === '' ? '' : name;
    const unitTextShow = unitText && (unitText[indicatorId] || '');
    const config = dot.get(this.props, 'value.config');
    const lineItems = [
      // 左区间
      <InputNumber
        key="1"
        min={0}
        disabled={disabled}
        value={startOrder}
        onChange={this.changeStartOrder}
        formatter={value => `${value}${unitTextShow}`}
        parser={value => value.replace(`${unitTextShow}`, '')}
        className={styles['app-comp-finance-start-order']}
      />,
      // 小于号
      <span key="2">&lt;</span>,
      // 指标名称
      <span key="3" className={styles['app-comp-finance-order-var-show']}>{indicatorNameShow}</span>,
      // 符号选择器
      <span key="4">
        <PopoverRadio
          disabled={disabled}
          compareTypeProps={compareType}
          onChange={this.changeCompareType}
        />
      </span>,
      // 右区间
      <InputNumber
        key="5"
        min={0}
        value={endOrder}
        onChange={this.changeEndOrder}
        disabled={disabled}
        formatter={value => `${value}${unitTextShow}`}
        parser={value => value.replace(`${unitTextShow}`, '')}
        className={styles['app-comp-finance-end-order']}
      />,
      // 区间量展示
      <Tooltip key="6" title={`${startOrder}-${endOrder || 0}区间内`}>
        <span className={styles['app-comp-finance-interval-show']}>{`${startOrder}-${endOrder || 0}区间内`}</span>
      </Tooltip>,
      // 计算方式选择
      <Select
        key="7"
        disabled={disabled}
        value={`${calculateType}`}
        onChange={this.changeCalculateType}
        className={styles['app-comp-finance-calculate-type']}
      >
        <Option
          value={`${SalaryRulesLadderCalculateType.nomal}`}
        >
          {SalaryRulesLadderCalculateType.description(SalaryRulesLadderCalculateType.nomal)}
        </Option>
        <Option
          value={`${SalaryRulesLadderCalculateType.difference}`}
        >
          {SalaryRulesLadderCalculateType.description(SalaryRulesLadderCalculateType.difference)}
        </Option>
      </Select>,
      // 步长
      <span key="9" className={styles['app-comp-finance-step']}>
        <span>每</span>
        <ComponentPopconfirmBtns
          disabled={disabled}
          unit={unit}
          num={unitAmount}
          onConfirm={this.changeUnitAmount}
        />
        <span>{unitTextShow}</span>
      </span>,
      // 金额
      <InputNumber
        key="8"
        disabled={disabled}
        min={0}
        value={money}
        formatter={value => `${value}元`}
        parser={value => value.replace('元', '')}
        onChange={this.changeIntervalMoney}
        className={styles['app-comp-finance-interval-money']}
      />,

      // 奖罚选择disable条件:
      // 1. 不是第一行数据 或者
      // 2. 整个奖罚组件未使用
      <Select key="10" disabled={key > 0 || disabled} value={`${awardOrPunish}`} onChange={this.changeAwardOrPunish} className={styles['app-comp-finance-award-or-punish']} >
        <Option value={`${FinanceQualityAwardOrPunish.award}`} >
          {FinanceQualityAwardOrPunish.description(FinanceQualityAwardOrPunish.award)}
        </Option>
        <Option value={`${FinanceQualityAwardOrPunish.punish}`}>
          {FinanceQualityAwardOrPunish.description(FinanceQualityAwardOrPunish.punish)}
        </Option>
      </Select>,

      <span key="11">最低金额: </span>,
      <InputNumber
        key="12"
        disabled={disabled}
        min={0}
        value={minMoney}
        formatter={value => `${value}元`}
        parser={value => value.replace('元', '')}
        onChange={this.changeMinMoney}
        className={styles['app-comp-finance-min-money']}
      />,
    ];

    // 配置中openDelete为true按钮则展示删除按钮
    if (config.includes(itemsConfig.openDelete)) {
      lineItems.push(
        <Button
          key="delete"
          disabled={disabled}
          className={styles['app-comp-finance-ladder-award-item-button']}
          onClick={this.onDelete}
          shape="circle"
          icon={<MinusOutlined />}
        />,
      );
    }

    // 配置中openCreate为true按钮则展示创建按钮
    if (config.includes(itemsConfig.openCreate)) {
      lineItems.push(
        <Button
          key="create"
          disabled={disabled}
          className={styles['app-comp-finance-ladder-award-item-button']}
          onClick={this.onCreate}
          shape="circle"
          icon={<PlusOutlined />}
        />,
      );
    }
    return <div className={styles['app-comp-finance-line-wrap']}>{lineItems}</div>;
  }
}

Item.itemsConfig = itemsConfig;
function mapStateToProps({ financeRulesGenerator: { orderTypes: { unitText } } }) {
  return { unitText };
}

export default connect(mapStateToProps)(Item);
