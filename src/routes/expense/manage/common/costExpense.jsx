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
import CommonItems from './costItems';
import style from './styles.less';

const { CommonItemsType } = CommonItems;
const RadioGroup = Radio.Group;

class CommonExpense extends Component {

  static propTypes = {
    isUpdateRule: PropTypes.bool, // 是否是金额调整（如果是金额调整，编辑界面，只有特定字段能够修改）
    selectedCostCenterType: PropTypes.number, // 成本中心
    value: PropTypes.object,
    onChange: PropTypes.func,
    costAccountingId: PropTypes.string, // 费用科目id
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
    const { costAccountingId, isCost, onChange } = this.props;
    // 如果费用科目id更改，并且初始化不为空，则重置数据
    if (!_.isEqual(costAccountingId, prevProps.costAccountingId) && isCost) {
      onChange({ costItems: [{}], costBelong: dot.get(this.props, 'value.costBelong', `${ExpenseCostOrderBelong.average}`) });
    }
  }

  // 回调函数
  onChange = (val, key) => {
    const { onChange, value, getPlatFormVendor } = this.props;
    const costItems = dot.get(value, 'costItems', [{}]);
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);

    const newCostItems = [
      ...costItems,
    ];

    if (key === undefined) {
      onChange && onChange(val);
    } else {
      newCostItems[key] = val;
      onChange && onChange({ costItems: newCostItems, costBelong });
    }

    if (val) {
      val.isCostCountFlag && getPlatFormVendor && getPlatFormVendor(val);
    }
    // this.setState({ costItems: newCostItems });
  }

  // 成本归属
  onChangeCostBelong = (e) => {
    const value = {
      ...this.state,
      costBelong: e.target.value,
      costItems: [{}],
    };
    this.onChange(value);
    const { getPlatFormVendor } = this.props;
    // 成本分摊改变时，发票抬头也要清空
    getPlatFormVendor && getPlatFormVendor(e);
    // 如果成本归属是个人，则要清空人员列表
    const { costAttribution } = this.props;
    // 如果是个人，需要重置个人选项
    if (costAttribution === ExpenseCostCenterType.person) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetStaffMember' });
    }
  }

  // 创建子项目
  onCreateItem = (index) => {
    const { costAttribution, selectedCostCenterType, value } = this.props;
    const costItems = dot.get(value, 'costItems', [{}]);
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
    if (this.isCreateItem(selectedCostCenterType, costItems[index], costAttribution) !== true) {
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
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
    const costItems = dot.get(value, 'costItems', [{}]);
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
    const { costAttribution, platform, selectedCostCenterType } = this.props;
    const checkPlatform = ['elem', 'meituan', 'relian', 'zongbu', 'chengtu', 'haluo', 'mobike', 'chengjing', 'lailai'];
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
      case ExpenseCostCenterType.headquarters:
        config = [];
        break;
      default: config = [CommonItemsType.platform];
    }

    const isPlatform = checkPlatform.findIndex(item => item === platform) > -1;

    // 资产
    if (costAttribution === ExpenseCostCenterType.asset && isPlatform) {
      config = [
        CommonItemsType.platform,
        CommonItemsType.vendor,
        CommonItemsType.city,
        CommonItemsType.district,
      ];
    }

    // 判断是否是自定义分摊
    if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
      config.push(CommonItemsType.costCount);
    }

    // 创建操作按钮
    if (enableCreate &&
      selectedCostCenterType !== ExpenseCostCenterType.project &&
      selectedCostCenterType !== ExpenseCostCenterType.headquarter
    ) {
      config.push(CommonItemsType.operatCreate);
    }
    // 创建操作按钮
    if (enableCreate &&
      (selectedCostCenterType === ExpenseCostCenterType.project ||
      selectedCostCenterType === ExpenseCostCenterType.headquarter) &&
      (costAttribution === ExpenseCostCenterType.team ||
        costAttribution === ExpenseCostCenterType.person ||
        costAttribution === ExpenseCostCenterType.asset)
    ) {
      config.push(CommonItemsType.operatCreate);
    }

    // 删除操作按钮
    if (enableDelete) {
      config.push(CommonItemsType.operatDelete);
    }

    return config;
  }

  // 判断是否添加新的数据
  isCreateItem = (selectedCostCenterType, data, costAttribution) => {
    const checkPlatform = ['elem', 'meituan', 'relian', 'zongbu', 'chengtu', 'haluo', 'mobike', 'chengjing', 'lailai'];
    const { platform } = this.props;
    const isPlatform = checkPlatform.findIndex(item => item === platform) > -1;
    let flag;
    switch (Number(selectedCostCenterType)) {
      case ExpenseCostCenterType.project:
        flag = is.existy(data.platform);
        break;
      case ExpenseCostCenterType.headquarter:
        flag = is.existy(data.platform) && is.existy(data.vendor);
        break;
      case ExpenseCostCenterType.city:
        flag = is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city);
        break;
      case ExpenseCostCenterType.district:
        flag = is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city) && is.existy(data.district);
        break;
      case ExpenseCostCenterType.knight:
        flag = is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city) && is.existy(data.district);
        break;
      case ExpenseCostCenterType.headquarters:
        flag = true;
        break;
      default: flag = false;
    }

    // 团队
    if (Number(costAttribution) === ExpenseCostCenterType.team && isPlatform) {
      flag = is.existy(data.teamType) && is.existy(data.teamId);

      // 科目成本归属为总部时，只校验团队信息
      if (Number(selectedCostCenterType) === ExpenseCostCenterType.headquarters) {
        flag = is.existy(data.teamId);
      }
    }

    // 个人
    if (Number(costAttribution) === ExpenseCostCenterType.person && isPlatform) {
      flag = is.existy(data.staffId);
    }

    // 资产
    if (Number(costAttribution) === ExpenseCostCenterType.asset && isPlatform) {
      flag = is.existy(data.platform) && is.existy(data.vendor) && is.existy(data.city) && is.existy(data.district);
    }
    return flag;
  }

  // 渲染子项目
  renderItems = () => {
    const {
      costAttribution,
      teamTypeList = [],
      platform,
      isUpdateRule,
      selectedCostCenterType,
      value,
      costAccountingId,
      unique,
      isNegative,
      isPluginOrder,
    } = this.props;
    const costItems = dot.get(value, 'costItems', [{}]);
    const costBelong = dot.get(value, 'costBelong', `${ExpenseCostOrderBelong.average}`);
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
            if (!!isUpdateRule === true) {
              isEdit = false;
            }
            const props = {
              value: { ...item },
              isPluginOrder,
              config,
              costBelong,
              isUpdateRule,
              costCenter: selectedCostCenterType,
              costAccountingId,
              isEdit,
              unique,
              isShow,
              costAttribution,
              isNegative,
              key: index,
              index,
              dispatch: this.props.dispatch,
              platform, // 审批流平台
              teamTypeList,
              onCreate: this.onCreateItem,
              onDelete: this.onDeleteItem,
              onChange: this.onChange,
            };
            return <CommonItems {...props} />;
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
          <RadioGroup onChange={this.onChangeCostBelong} disabled={!!isUpdateRule}>
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
