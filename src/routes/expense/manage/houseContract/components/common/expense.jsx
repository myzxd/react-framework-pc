/**
 * 费用信息模块模版
 */
import dot from 'dot-prop';
import { Radio, message } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import { ExpenseCostCenterType, ExpenseCostOrderBelong } from '../../../../../../application/define';

// 项目
import CommonItems from './expenseItem';
import style from './style.css';

const { CommonItemsType } = CommonItems;
const RadioGroup = Radio.Group;

const noop = () => {};

class CommonExpense extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  static propTypes = {
    onChange: PropTypes.func, // 表单onChange函数
    disabled: PropTypes.bool,
    getPlatFormVendor: PropTypes.func, // 分摊平台、供应商回调事件
  };

  static defaultProps = {
    selectedCostCenterType: ExpenseCostCenterType.project, // 成本中心
    onChange: noop, // 表单onChange函数
    disabled: false,
    getPlatFormVendor: () => {},
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      costBelong: ExpenseCostOrderBelong.average, // 固定平均分摊
      costItems: value.costItems || [{}],         // 子项目
    };
  }

  // 修改子项目内容
  onChangeItem = (key, e) => {
    const { costBelong, costItems } = this.state;
    const { getPlatFormVendor } = this.props;
    dot.set(costItems, `${key}`, e);
    const state = {
      costBelong,
      costItems,
    };
    this.props.onChange(state);
    if (e) {
      getPlatFormVendor && getPlatFormVendor(e);
    }
  }

  // 创建子项目
  onCreateItem = () => {
    const { costBelong, costItems } = this.state;
    // 将上一行全部变成disable，不能更改
    costItems[costItems.length - 1].vendorDisable = true;
    costItems[costItems.length - 1].cityDisable = true;
    costItems[costItems.length - 1].districtDisable = true;
    const obj = costItems[costItems.length - 1];
    const flag = this.isValidObj(obj);
    // 只有最后一个子项目可以点击新增，当新增时判断数据都已经填写完整了才能新增
    if (!flag) {
      message.error('请将内容填写完整再进行添加操作！');
      return;
    }
    // 如果成本中心为平台，设置该子项目平台值
    if (Number(this.props.selectedCostCenterType) === ExpenseCostCenterType.project) {
      costItems.push({
        platform: costItems[0].platform,
      });
    }

    // 如果成本中心为平台，设置该子项目平台、供应商值
    if (Number(this.props.selectedCostCenterType) === ExpenseCostCenterType.headquarter) {
      costItems.push({
        platform: costItems[0].platform,
        vendor: costItems[0].vendor,
        vendorName: costItems[0].vendorName,
        vendorDisable: true,
      });
    }

    // 如果成本中心为平台，设置该子项目平台、供应商、城市值
    if (Number(this.props.selectedCostCenterType) === ExpenseCostCenterType.city) {
      costItems.push({
        platform: costItems[0].platform,
        vendor: costItems[0].vendor,
        vendorName: costItems[0].vendorName,
        vendorDisable: true,
        city: undefined,
        cityDisable: false,
      });
    }

    // 如果成本中心为平台，设置该子项目平台、供应商、城市、商圈值
    if (Number(this.props.selectedCostCenterType) === ExpenseCostCenterType.district) {
      costItems[costItems.length - 1].districtDisable = true;
      costItems.push({
        platform: costItems[0].platform,
        vendor: costItems[0].vendor,
        vendorName: costItems[0].vendorName,
        vendorDisable: true,
        city: undefined,
        cityDisable: false,
        district: undefined,
        districtDisable: false,
      });
    }
    const state = {
      costBelong,
      costItems,
    };
    this.props.onChange(state);
  }

  // 删除子项目
  onDeleteItem = (index) => {
    const { costBelong, costItems } = this.state;
    costItems.splice(index, 1);
    const lastObj = costItems[costItems.length - 1];
    if (lastObj.vendor && costItems.length === 1) {
      lastObj.vendorDisable = false;
    }
    if (lastObj.city) {
      lastObj.cityDisable = false;
    }
    if (lastObj.district) {
      lastObj.districtDisable = false;
    }
    costItems[costItems.length - 1] = lastObj;
    const state = {
      costBelong,
      costItems,
    };
    this.props.onChange(state);
  }

  // 根据成本中心获取配置文件
  getConfig = (enableCreate = true, enableDelete = true) => {
    const { selectedCostCenterType } = this.props;
    let config = [];
    switch (Number(selectedCostCenterType)) {
      // 项目
      case ExpenseCostCenterType.project:
        config = [
          CommonItemsType.platformDisable,
        ];
        break;
      // 项目主体总部
      case ExpenseCostCenterType.headquarter:
        config = [
          CommonItemsType.platformDisable,
          CommonItemsType.vendor,
        ];
        break;
      // 城市
      case ExpenseCostCenterType.city:
        config = [
          CommonItemsType.platformDisable,
          CommonItemsType.vendor,
          CommonItemsType.city,
        ];
        break;
      // 城市 或 商圈
      case ExpenseCostCenterType.district:
      case ExpenseCostCenterType.knight:
        config = [
          CommonItemsType.platformDisable,
          CommonItemsType.vendor,
          CommonItemsType.city,
          CommonItemsType.district,
        ];
        break;
      default: config = [CommonItemsType.platformDisable];
    }

    // 创建操作按钮
    if (enableCreate) {
      config.push(CommonItemsType.operatCreate);
    }

    // 删除操作按钮
    if (enableDelete) {
      config.push(CommonItemsType.operatDelete);
    }
    return config;
  }

  // 判断对象每个属性是否都有值
  isValidObj = (obj) => {
    let flag = true;
    for (const n in obj) {
      if (!obj[n]) {
        flag = false;
        return;
      }
    }
    return flag;
  }
  // 渲染子项目
  renderItems = () => {
    const { costItems } = this.state;
    const { selectedCostCenterType, disabled } = this.props;
    return (
      <div className={style['app-comp-expense-house-contract-common-expense-info']}>
        {/* 分摊子项目 */}
        {
          costItems.map((item, index, records) => {
            const length = records.length;
            // 显示的项目
            let config = [];
            // 只有一行数据的情况下，只有平台或者只有平台和供应商情况下，不能有新建和删除按钮
            if (length === 1 && (Number(selectedCostCenterType) === 5 || Number(selectedCostCenterType) === 4 || Number(selectedCostCenterType) === 0)) {
              config = this.getConfig(false, false);
            // 多行数据的情况下，最后一条显示创建按钮
            } else if (index > 0 && index === length - 1) {
              config = this.getConfig();
            // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮
            } else if (length === 1 && (Number(selectedCostCenterType) === 3 || Number(selectedCostCenterType) === 2)) {
              config = this.getConfig(true, false);
            } else {
              // 多行情况下，除了最后一行就只能出现删除按钮，最后一行可以删除与新建
              config = this.getConfig(false, true);
            }
            // 合并表单数据，传递给下一级组件
            const value = Object.assign({ key: index }, item, {
              config,
              costCenter: this.state.selectedCostCenterType,
            });
            return <CommonItems key={index} value={value} disabled={disabled} onCreate={this.onCreateItem} onDelete={this.onDeleteItem} onChange={this.onChangeItem} />;
          })
        }
      </div>
    );
  }

  // 渲染成本分摊
  renderSelect = () => {
    const { costBelong } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '成本分摊',
        form: getFieldDecorator('costBelong', {
          initialValue: `${costBelong}`,
          rules: [{ required: true }],
        })(
          <RadioGroup onChange={this.onChangeCostBelong}>
            <Radio value={`${ExpenseCostOrderBelong.average}`}>{ExpenseCostOrderBelong.description(ExpenseCostOrderBelong.average)}</Radio>
          </RadioGroup>,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />;
  }

  render = () => {
    return (
      <div>
        {/* 渲染成本分摊 */}
        {this.renderSelect()}
        {/* 渲染选项 */}
        {this.renderItems()}
      </div>
    );
  }
}

export default CommonExpense;
