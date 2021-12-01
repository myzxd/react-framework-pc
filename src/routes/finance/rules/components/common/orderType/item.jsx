/**
 * 服务费规则 - 模板规则创建 - 单型选择组件条目
 */
import is from 'is_js';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  InputNumber,
  Button,
  Select,
  message,
} from 'antd';
import {
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import { Unit } from '../../../../../../application/define';
import ComponentSalaryIndicators from '../salaryIndicators';

const Option = Select.Option;

class ComponentOrderTypeItem extends Component {
  static propTypes = {
    index: PropTypes.string,   // 单型
    symbol: PropTypes.string,
    num: PropTypes.number,     // 单
    config: PropTypes.object,  // 操作
    dataList: PropTypes.array, // 默认指标数据
    layout: PropTypes.object,  // 宽度
    unit: PropTypes.number,    // 单位
    name: PropTypes.string,    // 名称
  }
  static defaultProps = {
    config: {},
    layout: {},
  }

  // 单型改变回调
  onChangeIndex = (e, unit, name) => {
    this.triggerOnChange({ index: e, unit, name });
  }

  // 指标改变回调
  onChangeSymbol = (e) => {
    this.triggerOnChange({
      symbol: e,
    });
  }

  // 单量改变回调
  onChangeNum = (e) => {
    const { unit } = this.props;
    const prompt = Unit.dynamicValid(e, unit);
    if (prompt !== true) {
      return message.error(prompt);
    }
    this.triggerOnChange({ num: e });
  }

  // 新增条目
  onPlusItem = () => {
    const { onPlusItem } = this.props;
    if (onPlusItem) {
      onPlusItem();
    }
  }

  // 删除条目
  onDeleteItem = () => {
    const { onDeleteItem } = this.props;
    if (onDeleteItem) {
      onDeleteItem(this.props.itemIndex);
    }
  }

  // 触发值改变
  triggerOnChange = (e) => {
    const { index, symbol, num, unit, name } = this.props;
    const preValue = {
      index,
      symbol,
      num,
      unit,
      name,
    };
    const nextValue = { ...preValue, ...e };
    if (this.props.onChange) {
      this.props.onChange(nextValue, this.props.itemIndex);
    }
  }


  // 渲染表单
  renderItem = () => {
    const { index, symbol, num, config, dataList, layout } = this.props;
    const { disabled, platformCode, tags } = this.props;
    const { unitText } = this.props.orderTypes;
    let LayoutIndicators = 4;
    let LayoutSymbol = 3;
    let layoutNum = 3;
    // 判断是否有值
    if (is.existy(layout) && !is.empty(layout)) {
      LayoutIndicators = layout.indicators;
      LayoutSymbol = layout.symbol;
      layoutNum = layout.num;
    }
    const formItems = [
      {
        label: '',
        span: LayoutIndicators,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          <ComponentSalaryIndicators
            style={{ width: '100%' }}
            value={index}
            disabled={disabled}
            tagList={tags}
            platformCode={platformCode}
            onChange={this.onChangeIndex}
            dataList={dataList}
          />
        ),
      },
      {
        label: '',
        span: LayoutSymbol,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          <Select
            value={symbol}
            onChange={this.onChangeSymbol}
            disabled={disabled}
            className="app-global-componenth-width-percent100"
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
    ];


    // 单位
    const favourableOrderUnit = {
      label: '',
      span: layoutNum,
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      form: (
        <InputNumber
          disabled={disabled}
          className="app-global-componenth-width-percent100"
          value={num}
          min={0}
          onChange={this.onChangeNum}
          formatter={value => `${value}${unitText[index] || ''}`}
          parser={value => value.replace(`${unitText[index] || ''}`, '')}
        />
      ),
    };

    // 单位
    if (is.existy(index) && is.not.empty(index)) {
      formItems.push(favourableOrderUnit);
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
          disabled={disabled}
          className="app-global-mgr10"
        />
      ));
    }

    if (config.operatCreate) {
      btns.push((<Button
        shape="circle"
        key="plus"
        icon={<PlusOutlined />}
        onClick={this.onPlusItem}
        disabled={disabled}
      />));
    }

    formItems.push({
      span: 6,
      label: '',
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      form: (<div>{btns}</div>),
    });

    return (
      <DeprecatedCoreForm items={formItems} cols={6} />
    );
  }

  render() {
    return (
      <div>
        {this.renderItem()}
      </div>
    );
  }
}
function mapStateToProps({ financeRulesGenerator: { orderTypes } }) {
  return { orderTypes };
}
export default connect(mapStateToProps)(ComponentOrderTypeItem);
