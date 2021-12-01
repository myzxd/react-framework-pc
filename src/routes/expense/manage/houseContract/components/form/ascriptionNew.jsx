/**
 * 房屋管理/新建(编辑)/成本归属/分摊
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreSelect,
} from '../../../../../../components/core';
import { CommonSelectPlatforms, CommonSelectSuppliers } from '../../../../../../components/common';
import CommonExpense from '../common/expense';

import {
  ExpenseCostCenterType,
} from '../../../../../../application/define';

const { Option } = CoreSelect;

const noop = () => {};

class Ascription extends Component {

  static propTypes = {
    editMode: PropTypes.bool,                // 是编辑还是新建
    houseContractDetail: PropTypes.object,   // 房屋详情数据
    form: PropTypes.object.isRequired,       // 表单
    onChangeCostCenterType: PropTypes.func,  // 成本中心改变回调
    onChangePlatform: PropTypes.func,        // 平台改变回调
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    editMode: false,
    houseContractDetail: {},       // 默认为空
    onChangePlatform: noop,        // 平台改变回调
    onChangeCostCenterType: noop,  // 成本中心改变回调
    disabled: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      apportionData: {},
      currentInvoiceFlag: true, // 是否用接口返回数据中的发票抬头
    };
  }

  // 更换成本中心
  onChangeCostCenterType = (e) => {
    const { form } = this.props;
    const expense = form.getFieldValue('expense');
    const costItems = [{
      vendorDisable: false,
      cityDisable: false,
      districtDisable: false,
    }];
    const platform = expense.costItems[0].platform;
    costItems[0].platform = platform;

    // 根据选择的成本中心，重置对应的值
    if (Number(e) === ExpenseCostCenterType.headquarter) {
      costItems[0].vendor = undefined;
    }
    if (Number(e) === ExpenseCostCenterType.city) {
      costItems[0].vendor = undefined;
      costItems[0].city = undefined;
    }
    if (Number(e) === ExpenseCostCenterType.district) {
      costItems[0].vendor = undefined;
      costItems[0].city = undefined;
      costItems[0].district = undefined;
    }

    const nextExpense = {
      ...expense,
      costItems,
    };
    this.props.onChangeCostCenterType(e);
    form.setFieldsValue({ expense: nextExpense });
  }

  // 更换平台
  onChangePlatform = (e) => {
    const { form, onChangePlatform } = this.props;
    const expense = form.getFieldValue('expense');
    const costCenterType = form.getFieldValue('costCenterType');
    const nextExpense = {
      ...expense,
      costItems: expense.costItems.map(() => {
        const res = {
          platform: e,
        };
        // 根据选择的成本中心，重置对应的值
        if (Number(costCenterType) === ExpenseCostCenterType.headquarter) {
          res.vendor = undefined;
        }
        if (Number(costCenterType) === ExpenseCostCenterType.city) {
          res.vendor = undefined;
          res.city = undefined;
        }
        if (Number(costCenterType) === ExpenseCostCenterType.district) {
          res.vendor = undefined;
          res.city = undefined;
          res.district = undefined;
        }
        return res;
      }),
    };
    nextExpense.costItems = nextExpense.costItems.slice(0, 1);
    form.setFieldsValue({ expense: nextExpense });
    onChangePlatform(e);
    // 设置发票抬头的平台获取供应商范围
    this.setState({
      apportionData: {
        platform: e,
      },
      currentInvoiceFlag: false,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 获取成本分摊中的平台、供应商
  getPlatFormVendor = (apportionData) => {
    this.setState({
      apportionData,
      currentInvoiceFlag: false,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 渲染第一行
  renderFirstLine = () => {
    const { houseContractDetail = {}, disabled, form = {} } = this.props;
    const { getFieldDecorator } = form;
    // 平台初始值
    const platformCode = dot.get(houseContractDetail, 'platformCodes.0', '');
    // 成本中心初始值
    const costCenterType = dot.get(houseContractDetail, 'costCenterType', '');

    const formItems = () => {
      return [
        {
          label: '成本中心',
          form: getFieldDecorator('costCenterType', {
            initialValue: `${costCenterType}`,
            rules: [{
              required: true,
              message: '请选择',
            }],
          })(
            <CoreSelect allowClear disabled={disabled} showSearch optionFilterProp="children" placeholder="请选择成本中心" onChange={this.onChangeCostCenterType}>
              <Option key={ExpenseCostCenterType.project} value={`${ExpenseCostCenterType.project}`} >
                {ExpenseCostCenterType.description(ExpenseCostCenterType.project)}
              </Option>
              <Option key={ExpenseCostCenterType.headquarter} value={`${ExpenseCostCenterType.headquarter}`}>
                {ExpenseCostCenterType.description(ExpenseCostCenterType.headquarter)}
              </Option>
              <Option key={ExpenseCostCenterType.city} value={`${ExpenseCostCenterType.city}`}>
                {ExpenseCostCenterType.description(ExpenseCostCenterType.city)}
              </Option>
              <Option key={ExpenseCostCenterType.district} value={`${ExpenseCostCenterType.district}`}>
                {ExpenseCostCenterType.description(ExpenseCostCenterType.district)}
              </Option>
            </CoreSelect>,
          ),
        },
        {
          label: '平台',
          form: getFieldDecorator('platformCode', {
            initialValue: platformCode,
            rules: [{
              required: true,
              message: '请选择',
            }],
          })(
            <CommonSelectPlatforms
              allowClear
              showSearch
              disabled={disabled}
              optionFilterProp="children"
              placeholder="请选择平台"
              onChange={this.onChangePlatform}
            />,
          ),
        },
      ];
    };

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems()}
        layout={layout}
        cols={3}
      />
    );
  }

  // 渲染分摊
  renderAscriptionInfo = () => {
    const { houseContractDetail = {}, editMode, disabled, form = {} } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const costCenterType = getFieldValue('costCenterType');
     // 成本中心
    const expense = {
      costCenter: costCenterType,                  // 成本中心归属类型
      // 子项目
      costItems: dot.get(houseContractDetail, 'costAllocations', []).map((item, index) => {
        const ret = {
          platform: dot.get(item, 'platform_code', ''), // 平台
        };
        if (item.supplier_id || Number(costCenterType) === ExpenseCostCenterType.headquarter) {
          ret.vendor = item.supplier_id;
          ret.vendorName = dot.get(houseContractDetail, 'supplierNames.0', '');
          // 供应商都给禁用，不能跨供应商修改
          ret.vendorDisable = true;
        }
        if (item.city_code || Number(costCenterType) === ExpenseCostCenterType.city) {
          ret.city = `${item.city_code}`;       // fix city_code是int格式，需要转换成string
          ret.citySpelling = item.city_spelling;
          // 城市除了最后一行 都成禁用状态 （始终保持最后一行才是可修改状态，其他行要修改只能通过加减按钮）
          if (dot.get(houseContractDetail, 'costAllocations', []).length - 1 !== index) {
            ret.cityDisable = true;
          }
        }
        if (item.biz_district_id || Number(costCenterType) === ExpenseCostCenterType.district) {
          ret.district = item.biz_district_id;
          if (dot.get(houseContractDetail, 'costAllocations', []).length - 1 !== index) {
            ret.districtDisable = true;
          }
        }
        return ret;
      }),
    };
    if (expense.costItems.length > 0) {
      return (
        getFieldDecorator('expense', { initialValue: expense })(
          <CommonExpense disabled={disabled} form={form} selectedCostCenterType={costCenterType} getPlatFormVendor={this.getPlatFormVendor} />,
        )
      );
    }
    const defaultValue = {
      costItems: [{ platform: '' }],
    };

    if (editMode) {
      return <div />;
    }
    return (
      getFieldDecorator('expense', { initialValue: defaultValue })(
        <CommonExpense disabled={disabled} form={form} selectedCostCenterType={costCenterType} getPlatFormVendor={this.getPlatFormVendor} />,
      )
    );
  }

  renderInvoice = () => {
    const { getFieldDecorator } = this.props.form;
    const { apportionData, currentInvoiceFlag } = this.state;
    const { houseContractDetail = {}, disabled } = this.props;
    const formItems = [{
      label: '发票抬头',
      form: getFieldDecorator('invoiceTitle', { initialValue: currentInvoiceFlag ? dot.get(houseContractDetail, 'agentInvoiceTitle', '') : apportionData.vendorName })(
        <CommonSelectSuppliers
          platforms={apportionData.platform}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择供应商"
          isSubmitNameAsValue
          disabled={disabled}
        />,
      ),
    }];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 5 } };

    return (
      <DeprecatedCoreForm
        items={formItems}
        layout={layout}
        cols={1}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="成本归属/分摊">

        {/* 渲染成本归属 */}
        {this.renderFirstLine()}

        {/* 渲染分摊 */}
        {this.renderAscriptionInfo()}

        {/* 发票抬头 */}
        {this.renderInvoice()}
      </CoreContent>
    );
  }
}

export default Ascription;
