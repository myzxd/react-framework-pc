/**
 * 费用信息模块模版
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, message } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';

import { DeprecatedCoreForm } from '../../../../components/core';
import { ExpenseCostCenterType, ExpenseCostOrderBelong } from '../../../../application/define';

// 项目
import CommonItems from '../common/items';
import style from './styles.less';

const { CommonItemsType } = CommonItems;
const RadioGroup = Radio.Group;

class CommonExpense extends Component {

  static propTypes = {
    isUpdateRule: PropTypes.bool, // 是否是金额调整（如果是金额调整，编辑界面，只有特定字段能够修改）
    selectedCostCenterType: PropTypes.number, // 成本中心
    value: PropTypes.object,
    onChange: PropTypes.func,
    CostAccountingId: PropTypes.string, // 费用科目id
    unique: PropTypes.string,
    isNegative: PropTypes.bool, // 分摊金额是否可以为负数
    getPlatFormVendor: PropTypes.func, // 分摊平台、供应商回调事件
  }

  static defaultProps = {
    isUpdateRule: false,
    value: {},
    onChange: () => {},
    isNegative: false,
  }

  componentDidUpdate(prevProps) {
    const { CostAccountingId, onChange } = this.props;
    // 如果费用科目id更改，并且初始化不为空，则重置数据
    if (!_.isEqual(CostAccountingId, prevProps.CostAccountingId)) {
      onChange({ costItems: [{}], costBelong: dot.get(this.props, 'value.costBelong', `${ExpenseCostOrderBelong.average}`) });
    }
  }

  // 回调函数
  onChange = (state) => {
    const { onChange } = this.props;
    this.setState(state);

    // 调用上级回调
    if (onChange) {
      onChange(state);
    }
  }

  // 成本归属
  onChangeCostBelong = (e) => {
    const value = e.target.value;
    const state = {
      ...this.state,
      costBelong: value,
      costItems: [{}],
    };
    this.onChange(state);
    const { getPlatFormVendor } = this.props;
    // 成本分摊改变时，发票抬头也要清空
    getPlatFormVendor && getPlatFormVendor(e);
  }

  // 修改子项目内容
  onChangeItem = (key, e) => {
    const { value, getPlatFormVendor } = this.props;
    const costItems = dot.get(value, 'costItems', [{}]);
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
    dot.set(costItems, `${key}`, e);
    const state = {
      ...this.state,
      costBelong,
      costItems,
    };
    this.onChange(state);
    if (e) {
      e.costCountFlag && getPlatFormVendor && getPlatFormVendor(e);
    }
  }

  // 创建子项目
  onCreateItem = (index) => {
    const { selectedCostCenterType, value } = this.props;
    const costItems = dot.get(value, 'costItems', [{}]);
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
    if (this.isCreateItem(selectedCostCenterType, costItems[index]) !== true) {
      return message.error('您的配置项还没填写完成');
    }
    // 获取要复制的当前子项目数据
    const copyItem = costItems[index];
    costItems.push(copyItem);
    const state = {
      ...this.state,
      costBelong,
      costItems,
    };
    this.onChange(state);
  }

  // 删除子项目
  onDeleteItem = (index) => {
    const { value } = this.props;
    const costItems = dot.get(value, 'costItems', [{}]);
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
    costItems.splice(index, 1);
    const state = {
      ...this.state,
      costBelong,
      costItems,
    };
    this.onChange(state);
  }

  // 根据成本中心获取配置文件
  getConfig = (costBelong, enableCreate = true, enableDelete = true) => {
    const { selectedCostCenterType } = this.props;
    let config = [];
    switch (Number(selectedCostCenterType)) {
      // 项目
      case ExpenseCostCenterType.project:
        config = [
          CommonItemsType.platform,
        ];
        break;
      // 项目主体总部
      case ExpenseCostCenterType.headquarter:
        config = [
          CommonItemsType.platform,
          CommonItemsType.vendor,
        ];
        break;
      // 城市
      case ExpenseCostCenterType.city:
        config = [
          CommonItemsType.platform,
          CommonItemsType.vendor,
          CommonItemsType.city,
        ];
        break;
      // 城市 或 商圈
      case ExpenseCostCenterType.district:
      case ExpenseCostCenterType.knight:
        config = [
          CommonItemsType.platform,
          CommonItemsType.vendor,
          CommonItemsType.city,
          CommonItemsType.district,
        ];
        break;
      default: config = [CommonItemsType.platform];
    }
    // 判断是否是自定义分摊
    if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
      config.push(CommonItemsType.costCount);
    }

    // 创建操作按钮
    if (enableCreate && selectedCostCenterType !== ExpenseCostCenterType.project && selectedCostCenterType !== ExpenseCostCenterType.headquarter) {
      config.push(CommonItemsType.operatCreate);
    }

    // 删除操作按钮
    if (enableDelete) {
      config.push(CommonItemsType.operatDelete);
    }

    return config;
  }

  // 判断是否添加新的数据
  isCreateItem = (selectedCostCenterType, data) => {
    // 判断，如果成本中心为平台，则只校验平台数据
    if (selectedCostCenterType === ExpenseCostCenterType.project && is.existy(data.platform)) {
      return true;
    }

    // 判断，如果成本中心为供应商，则校验平台、供应商数据
    if (selectedCostCenterType === ExpenseCostCenterType.headquarter && is.existy(data.platform) && is.existy(data.vendor)) {
      return true;
    }

    // 判断，如果成本中心为城市，则校验平台、供应商、城市数据
    if (selectedCostCenterType === ExpenseCostCenterType.city && is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city)) {
      return true;
    }

    // 判断，如果成本中心为商圈，则校验平台、供应商、城市、商圈数据
    if (selectedCostCenterType === ExpenseCostCenterType.district && is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city) && is.existy(data.district)) {
      return true;
    }

    // 判断，如果成本中心为骑士，则校验平台、供应商、城市、商圈数据
    if (selectedCostCenterType === ExpenseCostCenterType.knight && is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city) && is.existy(data.district)) {
      return true;
    }
    return false;
  }

  // 渲染子项目
  renderItems = () => {
    const { platformParam, isUpdateRule, selectedCostCenterType, value: formValue, CostAccountingId, unique, isNegative } = this.props;
    const costItems = dot.get(formValue, 'costItems', [{}]);
    const costBelong = dot.get(formValue, 'costBelong', `${ExpenseCostOrderBelong.average}`);

    return (
      <div className={style['app-comp-expense-manage-common-expense-project']}>
        {/* 分摊子项目 */}
        {
          costItems.map((item, index, records) => {
            const length = records.length;
            // 是否显示跨平台
            let isShow = false;
            // 显示的项目
            let config = [];
            // 只有一行数据的情况下，只显示创建按钮
            if (length === 1) {
              config = this.getConfig(costBelong, true, false);
              isShow = false;
              // 多行数据的情况下，最后一条显示创建按钮
            } else if (index === length - 1) {
              config = this.getConfig(costBelong);
              isShow = true;
              // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮
            } else {
              isShow = false;
              config = this.getConfig(costBelong, false);
            }
            let isEdit = false;
            if (index === 0 && costItems.length === 1) {
              isEdit = true;
            }
            if (index === costItems.length - 1) {
              isEdit = true;
            }
            if (isUpdateRule === true) {
              isEdit = false;
            }
            // 合并表单数据，传递给下一级组件
            const value = Object.assign({ key: index }, item, {
              config,
              isUpdateRule,
              costCenter: selectedCostCenterType,
              CostAccountingId,
              isEdit,
              unique,
              isShow,
              // totalCount: dot.get(this.props, 'approval.money', 0)
              // costCenter={this.state.selectedCostCenterType}
            });
            return <CommonItems isNegative={isNegative} key={index} dispatch={this.props.dispatch} value={value} platformParam={platformParam} onCreate={this.onCreateItem} onDelete={this.onDeleteItem} onChange={this.onChangeItem} />;
          })
        }
      </div>
    );
  }

  // 渲染成本分摊
  renderSelect = () => {
    const { isUpdateRule, value } = this.props;
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '成本分摊',
        form: getFieldDecorator('costBelong', {
          initialValue: `${costBelong}`,
          rules: [{ required: true, message: '请选择成本分摊' }],
        })(
          <RadioGroup onChange={this.onChangeCostBelong} disabled={isUpdateRule}>
            <Radio value={`${ExpenseCostOrderBelong.average}`}>{ExpenseCostOrderBelong.description(ExpenseCostOrderBelong.average)}</Radio>
            <Radio value={`${ExpenseCostOrderBelong.custom}`}>{ExpenseCostOrderBelong.description(ExpenseCostOrderBelong.custom)}</Radio>
          </RadioGroup>,
        ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />;
  }

  render = () => {
    const {
      className,
    } = this.props;
    return (
      <div className={className}>
        {/* 渲染成本分摊 */}
        {this.renderSelect()}
        {/* 渲染选项 */}
        {this.renderItems()}
      </div>
    );
  }
}

function mapStateToProps({ approval, expenseSubject }) {
  return { approval, expenseSubject };
}
export default Form.create()(connect(mapStateToProps)(CommonExpense));
