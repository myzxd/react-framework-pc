/**
 * 费用管理 = 付款审批 - 详情 - 成本分摊组件（详情）
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  InputNumber,
  Input,
} from 'antd';

import {
  CommonSelectSuppliers,
} from '../../../../components/common';

import {
  DeprecatedCoreForm,
} from '../../../../components/core';

import {
  Unit,
  OaCostAccountingState,
  ExpenseCostGroupState,
} from '../../../../application/define';

import CommonExpense from '../common/expense';  // 成本分摊

const { Option } = Select;

class CostAllocationForm extends Component {
  static propsTypes = {
    form: PropTypes.object,
    expenseTypeId: PropTypes.string, // 分用分组id
    examineDetail: PropTypes.object, // 审批流详情
    expenseTypeDetail: PropTypes.object, // 费用分组详情
    costOrderDetail: PropTypes.object, // 费用单详情
    uniqueKey: PropTypes.string,
    expenseTypeList: PropTypes.object, // 费用分组
  }

  static defaultProps = {
    form: {},
    expenseTypeId: '',
    examineDetail: {},
    expenseTypeDetail: {},
    costOrderDetail: {},
    uniqueKey: '',
    expenseTypeList: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedSubjectId: props.costAccountingId,       // 当前选择的科目id
      selectedCostCenterType: props.costCenterType,  // 当前选择的成本中心类型
      apportionData: {}, // 分摊中平台、供应商数据
    };
  }

  componentDidMount() {
    const {
      dispatch,
      costOrderDetail, // 费用单详情
      expenseTypeList, // 费用分组
    } = this.props;

    const {
      cost_group_info: {
        _id: costGroupId,
      } = {
        _id: undefined,
      },
    } = costOrderDetail;

    if (costGroupId) {
      // 获取费用分组详情
      dispatch({
        type: 'expenseType/fetchExpenseTypeDetail',
        payload: { id: costGroupId },
      });
    }

    // 费用分组列表
    if (Object.keys(expenseTypeList).length === 0) {
      dispatch({
        type: 'expenseType/fetchExpenseType',
        payload: {
          limit: 999,
          page: 1,
          state: ExpenseCostGroupState.enable,
        },
      });
    }
  }

  // 修改费用分组
  onChangeGroup = (id) => {
    const {
      dispatch,
      form,
    } = this.props;

    this.setState({
      expenseTypeId: id,
      selectedSubjectId: undefined,
      selectedCostCenterType: undefined,
    });

    form.resetFields('subject');
    // 获取费用分组详情
    dispatch({
      type: 'expenseType/fetchExpenseTypeDetail',
      payload: { id },
    });
  }

  // 改变科目回调
  onChangeSubject = (selectedSubjectId, options) => {
    const {
      props = {},
    } = options;

    const {
      costcentertype, // 成本中心
    } = props;

    // 设置当前选择的科目id值
    this.setState({
      ...this.state,
      selectedSubjectId,
      selectedCostCenterType: costcentertype,
    });
  }

  // 获取成本分摊中的平台、供应商
  getPlatFormVendor = (apportionData) => {
    this.setState({
      apportionData,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 基本信息
  renderBase = () => {
    const {
      form,
      expenseTypeDetail, // 费用分组详情
      costOrderDetail, // 费用单详情
      expenseTypeList, // 费用分组
    } = this.props;

    // 费用分组
    const { data: typeData = [] } = expenseTypeList;

    const {
      cost_group_info: {
        _id: costGroupId,
      } = {
        _id: '',
      },
      cost_accounting_info: {
        _id: costAccountingId,
      } = {
        _id: '',
      },
      total_money: totalMoney, // 金额
      invoice_flag: invoiceFlag, // 是否开发票
      _id: costOrderId,
    } = costOrderDetail;

    const {
      getFieldDecorator,
    } = form;

    // 科目列表
    const { accountingList = [] } = expenseTypeDetail;

    // 过滤出正常科目
    const subjects = accountingList.filter(subject => [OaCostAccountingState.normal].indexOf(subject.state) > -1);

    const formItems = [
      {
        label: '费用分组',
        form: getFieldDecorator('expenseType', {
          initialValue: costGroupId ? costGroupId : undefined,
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select
            style={{ width: '100%' }}
            placeholder="请选择费用分组"
            onChange={this.onChangeGroup}
          >
            {
              typeData.map((data) => {
                return (
                  <Option
                    key={data.id}
                    value={`${data.id}`}
                  >
                    {data.name}
                  </Option>
                );
              })
            }
          </Select>,
        ),
      },
      {
        label: '科目',
        form: getFieldDecorator('subject', {
          initialValue: costAccountingId ? costAccountingId : undefined,
          rules: [{ required: true, message: '请选择科目' }],
        })(
          <Select
            allowClear
            showSearch
            style={{ width: '100%' }}
            optionFilterProp="children"
            placeholder="请选择科目"
            onChange={this.onChangeSubject}
          >
            {
              subjects.map((subject) => {
                return (<Option
                  value={subject.id}
                  key={subject.id}
                  costcentertype={subject.costCenterType}
                  disabled={subject.state === OaCostAccountingState.disable}
                >
                  {`${subject.name}(${subject.accountingCode})${subject.state === OaCostAccountingState.disable ? '(停用)' : ''}`}
                </Option>);
              })
            }
          </Select>,
        ),
      },
      {
        label: '费用金额',
        form: getFieldDecorator('money', {
          initialValue: totalMoney !== undefined ? Unit.exchangePriceToYuan(totalMoney) : undefined,
          rules: [{ required: true, message: '请填写金额' }],
        })(
          <InputNumber
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '是否开票',
        form: getFieldDecorator('hasInvoice', {
          initialValue: costOrderId ? invoiceFlag ? '1' : '0' : undefined,
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select
            placeholder="请选择是否开票"
            style={{ width: '100%' }}
          >
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>,
        ),
      },
    ];

    // 布局
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <DeprecatedCoreForm
        cols={4}
        items={formItems}
        layout={layout}
      />
    );
  }

  // 成本分摊
  renderCostAllocation = () => {
    const {
      form,
      examineDetail,
      className,
      costOrderDetail,
      uniqueKey,
    } = this.props;

    const {
      selectedSubjectId, // 科目id
      selectedCostCenterType, // 成本中心
    } = this.state;

    // 审批流所属平台
    const { platformCodes: platformParam } = examineDetail;

    const {
      allocation_mode: costBelong = undefined,
      cost_allocation_list: costAllocationList = [],
    } = costOrderDetail;

    const {
      getFieldDecorator,
    } = form;

    // 成本中心
    const expense = Object.keys(costOrderDetail).length === 0
      ? {}
      : {
        costBelong, // 成本归属分摊模式
        // 子项目
        costItems: costAllocationList.map((item) => {
          let costCount;
          if (item.money) {
            costCount = Unit.exchangePriceToYuan(item.money);
          }
          const costAllocation = {};
          // 平台
          if (item.platform_code) {
            costAllocation.platform = item.platform_code;
            costAllocation.platformName = item.platform_name;
          }
          // 供应商
          if (item.supplier_id) {
            costAllocation.vendor = item.supplier_id;
            costAllocation.vendorName = item.supplier_name;
          }
          // 城市
          if (item.city_code) {
            costAllocation.city = item.city_code;
            costAllocation.cityName = item.city_name;
            costAllocation.citySpelling = item.city_spelling;
          }
          // 商圈
          if (item.biz_district_id) {
            costAllocation.district = item.biz_district_id;
            costAllocation.districtName = item.biz_district_name;
          }
          // 自定义分配金额
          if (costCount) {
            costAllocation.costCount = costCount;
          }
          return costAllocation;
        }),
      };

    return (
      getFieldDecorator('expense', { initialValue: expense })(
        <CommonExpense
          unique={uniqueKey}
          CostAccountingId={selectedSubjectId}
          form={this.props.form}
          selectedCostCenterType={selectedCostCenterType}
          getPlatFormVendor={this.getPlatFormVendor}
          platformParam={platformParam}
          className={className}
        />,
      )
    );
  }

  // 发票抬头
  renderInvoice = () => {
    const {
      form,
      costOrderDetail,
    } = this.props;

    const {
      apportionData, // 分摊中平台、供应商数据
    } = this.state;

    const {
      getFieldDecorator,
    } = form;

    const {
      invoice_title: invoiceTitle, // 发票抬头
    } = costOrderDetail;


    const formItems = [
      {
        label: '发票抬头',
        form: getFieldDecorator('invoiceTitle', { initialValue: invoiceTitle })(
          <CommonSelectSuppliers
            style={{ width: '100%' }}
            platforms={apportionData.platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            isSubmitNameAsValue
          />,
        ),
      },
    ];

    // 布局
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
      <DeprecatedCoreForm
        cols={1}
        items={formItems}
        layout={layout}
      />
    );
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { fileList } = this.state;
    const { form } = this.props;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('', { initialValue: fileList })(<Input hidden />),
      },
    ];
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  // 内容
  renderContent = () => {
    return (
      <div>
        {/* 基本信息 */}
        {this.renderBase()}

        {/* 成本分摊 */}
        {this.renderCostAllocation()}

        {/* 发票抬头 */}
        {this.renderInvoice()}
      </div>
    );
  }

  render() {
    return this.renderContent();
  }
}

function mapStateToProps({ expenseType: { expenseTypeDetail, expenseTypeList } }) {
  return { expenseTypeDetail, expenseTypeList };
}

export default connect(mapStateToProps)(CostAllocationForm);
