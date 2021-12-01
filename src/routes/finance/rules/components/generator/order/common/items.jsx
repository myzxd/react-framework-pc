/**
 * 单量提成规则-详细方案规则-子项
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, message } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../../components/core';
import {
  SalaryExtractType,
  FinanceRulesGeneratorStep,
  Unit,
} from '../../../../../../../application/define';
import ComponentPopconfirmBtns from '../../../common/popconfirmBtns/index';
import PopoverRadio from '../../../common/popoverRadio';

import styles from '../style/index.less';


// 子项目配置项
const itemsConfig = {
  openCreate: 'openCreate',
  openDelete: 'openDelete',
};

class Items extends Component {
  static propTypes = {
    value: PropTypes.object,        // 详细信息
    extractType: PropTypes.string,  // 方案提成类型
    onChange: PropTypes.func,       // 回调事件, 数据变化
    onCreate: PropTypes.func,       // 回调事件, 创建按钮
    onDelete: PropTypes.func,       // 回调事件, 删除按钮
    orderTypes: PropTypes.object,   // 指标数据
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 修改表单
  onChange = (e) => {
    const key = this.props.value.key;     // 数据条目的key
    const onChange = this.props.onChange; // 回调事件, 数据变化
    if (onChange) {
      onChange(key, e);
    }
  }

  // 创建操作的回调
  onCreate = () => {
    const { min, max } = this.props.value;
    const key = this.props.value.key;     // 数据条目的key
    const onCreate = this.props.onCreate; // 回调事件, 创建按钮
    if (!max) {
      return message.error('请输入结束单量');
    }
    if (min >= max) {
      return message.error('结束单量应大于起始单量');
    }
    if (onCreate) {
      onCreate(key);
    }
  }

  // 删除操作的回调
  onDelete = () => {
    const onDelete = this.props.onDelete; // 回调事件, 删除按钮
    const key = this.props.value.key;     // 数据条目的key
    if (onDelete) {
      onDelete(key);
    }
  }

  // 根据指标id获取指标名称
  getOrderTypeAttr = (orderTypeId) => {
    const { orderTypes } = this.props;
    const { platformCode } = this.props.value;
    const dataArray = dot.get(orderTypes, `${platformCode}${FinanceRulesGeneratorStep.first}.data`, []);
    let orderTypeName = '';  // 指标名称
    let orderTypeUnit = '';  // 指标单位
    let orderTypeUnitCode = 2; // 指标单位code
    dataArray.forEach((item) => {
      if (item.id === orderTypeId) {
        orderTypeName = item.name;
        orderTypeUnit = item.unitText;
        orderTypeUnitCode = item.unit;
      }
    });
    return {
      orderTypeName,
      orderTypeUnit,
      orderTypeUnitCode,
    };
  }

  // 更改步长单位
  changeUnitAmount = (unitAmount) => {
    this.onChange({ unitAmount });
  }

  // 选择比较形式
  changeCompareType = (symbolMax) => {
    this.onChange({ symbolMax });
  }

  // 更改结束单量
  changemax = (max) => {
    this.onChange({ max });
  }

  // 更改区间价格
  changeFavourableNum = (money) => {
    if (money === '') {
      this.onChange({ money: 0 });
      return;
    }
    this.onChange({ money });
  }

  // 根据指标判断数字显示位数
  changeNumberDigits = (unit) => {
    if (`${unit}` === `${Unit.timeYear}`
      || `${unit}` === `${Unit.timeMonth}`
      || `${unit}` === `${Unit.timeDay}`
      || `${unit}` === `${Unit.customOrder}`
      || `${unit}` === `${Unit.weightG}`
      || `${unit}` === `${Unit.distanceM}`
      || `${unit}` === `${Unit.customStar}`
      ) {
      return 0;
    }
    if (`${unit}` === `${Unit.mathPercent}`
      || `${unit}` === `${Unit.priceYuan}`
      ) {
      return 2;
    }
    if (`${unit}` === `${Unit.weightKG}`
      || `${unit}` === `${Unit.distanceKM}`
      ) {
      return 3;
    }
    return 0;
  }

  render() {
    const {
      min,
      index,
      max,
      symbolMax,
      symbolMin,
      unitAmount,
      money,
      extractType,
      isDisabled,
    } = this.props.value;
    const config = this.props.value.config;
    const maxInfinity = max === 'inf';   // 结束单量是否为无穷大
    const unit = this.getOrderTypeAttr(index).orderTypeUnitCode;  // 指标单位code
    const popoverProps = {
      disabled: isDisabled,
      compareTypeProps: symbolMax,
      onChange: this.changeCompareType,
    };
    const formItems = [
      {
        key: 1,
        offset: 1,
        span: 1,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: <span>{`${min || 0}${this.getOrderTypeAttr(index).orderTypeUnit}`}</span>,
      },
      {
        key: 2,
        span: 1,
        form: <span>{symbolMin}</span>,
      },
      {
        key: 3,
        span: 3,
        layout: { wrapperCol: { span: 24 } },
        form: <span>{this.getOrderTypeAttr(index).orderTypeName}</span>,
      },
      {
        key: 4,
        span: 1,
        layout: { wrapperCol: { span: 24 } },
        form:
          !maxInfinity
            ? <PopoverRadio {...popoverProps} />
            : <div className={styles['app-comp-finance-generator-order-common-item-from']}><span>&lt;=</span></div>,
      },
      {
        key: 5,
        label: '',
        span: 2,
        form:
          maxInfinity
          ?
          '无穷大'
          :
          <InputNumber
            min={min}
            max={`${unit}` === `${Unit.customStar}` ? 5 : Infinity}
            value={max || 0}
            onChange={this.changemax}
            disabled={isDisabled}
            precision={this.changeNumberDigits(unit)}
            formatter={value => `${value}${this.getOrderTypeAttr(index).orderTypeUnit}`}
            parser={value => value.replace(this.getOrderTypeAttr(index).orderTypeUnit, '')}
          />,
      },
      {
        key: 6,
        label: <span>
          {
            `${extractType}` === `${SalaryExtractType.segmentation}`
            || `0-${maxInfinity ? '无穷大' : `${max || 0}单`}`
          }
          区间内每
          {
            <ComponentPopconfirmBtns
              disabled={isDisabled}
              num={unitAmount || 1}
              sum={10}
              onConfirm={this.changeUnitAmount}
            />
          }
          单
        </span>,
        span: 5,
        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
        form: <InputNumber
          min={0}
          value={money}
          onChange={this.changeFavourableNum}
          disabled={isDisabled}
          precision={2}
          formatter={value => `${value}元`}
          parser={value => value.replace('元', '')}
        />,
      },
    ];
    if (config.includes(itemsConfig.openCreate) && config.includes(itemsConfig.openDelete)) {
      formItems.push({
        key: 7,
        span: 3,
        form: (
          <div>
            <Button className={styles['app-comp-finance-generator-order-common-item-button']} onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} disabled={isDisabled} />
            {maxInfinity || <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} disabled={isDisabled} />}
          </div>
        ),
      });
    } else if (config.includes(itemsConfig.openCreate) && !maxInfinity) {
      formItems.push({
        key: 8,
        span: 3,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} disabled={isDisabled} />
          </div>
        ),
      });
    } else if (config.includes(itemsConfig.openDelete)) {
      formItems.push({
        key: 9,
        span: 3,
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} disabled={isDisabled} />
          </div>
        ),
      });
    }
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={8} />
      </div>
    );
  }
}

Items.itemsConfig = itemsConfig;
export default Items;
