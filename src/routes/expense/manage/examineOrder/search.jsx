/**
 * 付款审批 - 搜索组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select, Input, DatePicker } from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  CommonSelectExamineFlows,
  DeprecatedCommonSearchExtension,
  CommonSelectExamineAccount,
} from '../../../../components/common';
import {
  ExpenseExamineOrderProcessState,
  ExpenseCostOrderPaymentState,
  OaApplicationOrderType,
  ExpenseTicketState,
  ExpenseTicketExistState,
  ExpenseApprovalType,
 } from '../../../../application/define';
import { system } from '../../../../application';
import { dotOptimal } from '../../../../application/utils';
import TicketTag from '../components/ticketTag';

const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;

// 搜索组件的内容构成
const SearchComponentItems = {
  scope: 1,   // 范围
  state: 2,   // 流程状态
  examine: 3, // 审批流
  creator: 4, // 申请人
};


class Search extends Component {
  static propTypes = {
    componentItems: PropTypes.array,
    onSearch: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    isShowExpand: PropTypes.bool,
    platformCodes: PropTypes.array,
  };

  static defaultProps = {
    componentItems: [],
    onSearch: () => { },
    onToggle: () => { },
    isShowExpand: false,
    platformCodes: [],
  };

  constructor() {
    super();
    this.state = {
      existStateDis: false,
      ticketTagDis: false,
      form: {},
    };
  }

  componentDidUpdate(nextProps) {
    // 重置所有表单value
    if (Number(nextProps.selectedTabKey) !== Number(this.props.selectedTabKey)
      && this.state.form
    ) {
      this.state.form.resetFields();
      this.state.form.setFieldsValue({
        platforms: [],
        suppliers: [],
        cities: [],
        districts: [],
      });
      // 重置选择框的禁用状态
      this.onResetState();
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 重置选择框的禁用状态
  onResetState = () => {
    // 重置选择框的禁用状态
    this.setState({ existStateDis: false, ticketTagDis: false });
  }

  // 重置
  onReset = () => {
    const { onSearch, selectedTabKey } = this.props;
    const params = {
      page: 1,
      limit: 30,
    };
    // 重置选择框的禁用状态
    this.onResetState();
    // 我待办tab下
    if (`${selectedTabKey}` === `${ExpenseApprovalType.penddingVerify}`) {
      // 清空存储在本地的搜索参数
      system.setSearchParams('examineOrder', {});
    }
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 展开，收起
  onToggle = (expand) => {
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle(expand);
    }
  }

  // 更改标签
  onNormalizeThemeTags = (value) => {
    const tags = value;
    const tagsLength = tags.length;
    // 处理输入的值，移除所有空格
    const tag = tagsLength >= 1 ? tags[tagsLength - 1].replace(/\s+/g, '') : '';

    // 处理完的值如果是空串，则移除
    tag === '' ? tags.pop() : tags[tagsLength - 1] = tag;
    return tags;
  }

  // 是否存在验票标签
  onChangeExistState = (val) => {
    const { form } = this.state;
    if (val) {
      this.setState({ ticketTagDis: true });
      form.setFieldsValue({ ticketTag: undefined });
    } else {
      this.setState({ ticketTagDis: false });
    }
  }

  // 验票标签
  onChangeTicketTag = (val) => {
    const { form } = this.state;
    if (Array.isArray(val) && val.length > 0) {
      this.setState({ existStateDis: true });
      form.setFieldsValue({ existState: undefined });
    } else {
      this.setState({ existStateDis: false });
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;

    const {
      suppliers,
      platforms,
      cities,
      districts,
      state,
      examineFlowId,
      applyAccountId,
      orderId,
      paidState,
      submitAt,
      paymentAt,
      belongTime,
      approvalType,
      themeTags,
      ticketTag, // 验票标签
      ticketState, // 验票状态
      existState, // 验票标签存在状态
      totalMoney, // 费用总金额
     } = values;

    // 处理时间
    const submitStartAt = dot.has(submitAt, '0') ? moment(submitAt[0]).format('YYYYMMDD') : ''; // 创建开始日期
    const submitEndAt = dot.has(submitAt, '0') ? moment(submitAt[1]).format('YYYYMMDD') : ''; // 创建开始日期
    const paidStartAt = dot.has(paymentAt, '0') ? moment(paymentAt[0]).format('YYYYMMDD') : ''; // 创建开始日期
    const paidEndAt = dot.has(paymentAt, '0') ? moment(paymentAt[1]).format('YYYYMMDD') : ''; // 创建开始日期

    const params = {
      suppliers,      // 供应商
      platforms,      // 平台
      cities,         // 城市
      districts,      // 商圈
      state,          // 状态
      examineFlowId,  // 审批流id
      applyAccountId,        // 申请人
      orderId: orderId ? orderId.replace(/\s+/g, '') : '', // 审批单号
      paidState,   // 付款状态
      submitStartAt,  // 提报日期开始时间
      submitEndAt,    // 提报日期结束时间
      paidStartAt, // 付款日期开始时间
      paidEndAt,   // 付款日期开始时间
      belongTime: belongTime ? moment(belongTime).format('YYYYMM') : '',   // 归属周期
      approvalType,   // 审批单类型
      themeTags,           // 主题标签
      page: 1,
      limit: 30,
      ticketTag,
      ticketState,
      existState,
      totalMoney,   // 费用总金额
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 搜索功能
  render = () => {
    const {
      operations,
      componentItems = [],
      platformCodes,
      isShowExpand: expand,
      selectedTabKey,
    } = this.props;
    const items = [];
    const { existStateDis, ticketTagDis } = this.state;
    // 存储在本地的搜索参数
    const examineOrderSearchParams = system.searchParams('examineOrder');

    // 审批流
    if (componentItems.indexOf(SearchComponentItems.examine) !== -1) {
      items.push({
        label: '审批流',
        form: form => (form.getFieldDecorator('examineFlowId', { initialValue: undefined }))(
          <CommonSelectExamineFlows showSearch allowClear isShowDataDisable optionFilterProp="children" platformCodes={platformCodes} placeholder="请选择审批流" namespace="search" />,
        ),
      });
    }

    // 流程状态
    if (componentItems.indexOf(SearchComponentItems.state) !== -1) {
      items.push({
        label: '流程状态',
        form: form => (form.getFieldDecorator('state', { initialValue: undefined })(
          <Select allowClear placeholder="请选择流程状态">
            <Option value={`${ExpenseExamineOrderProcessState.processing}`}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}</Option>
            <Option value={`${ExpenseExamineOrderProcessState.finish}`}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}</Option>
            <Option value={`${ExpenseExamineOrderProcessState.close}`}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}</Option>
          </Select>,
        )),
      });
    }

    // 付款状态
    if (componentItems.indexOf(SearchComponentItems.scope) !== -1) {
      items.push({
        label: '付款状态',
        form: form => (form.getFieldDecorator('paidState', { initialValue: undefined })(
          <Select allowClear placeholder="请选择付款状态">
            <Option value={`${ExpenseCostOrderPaymentState.payment}`}>{ExpenseCostOrderPaymentState.description(ExpenseCostOrderPaymentState.payment)}</Option>
            <Option value={`${ExpenseCostOrderPaymentState.untreated}`}>{ExpenseCostOrderPaymentState.description(ExpenseCostOrderPaymentState.untreated)}</Option>
            <Option value={`${ExpenseCostOrderPaymentState.abnormal}`}>{ExpenseCostOrderPaymentState.description(ExpenseCostOrderPaymentState.abnormal)}</Option>
          </Select>,
        )),
      });
    }

    items.push(
      {
        label: '审批类型',
        form: form => (form.getFieldDecorator('approvalType', {
          initialValue: `${selectedTabKey}` === `${ExpenseApprovalType.penddingVerify}`
                        ? dotOptimal(examineOrderSearchParams, 'approvalType', undefined)
                        : undefined,
        })(
          <Select
            placeholder="请选择审批类型"
            allowClear
          >
            <Option value={OaApplicationOrderType.cost}>{OaApplicationOrderType.description(OaApplicationOrderType.cost)}</Option>
            <Option value={OaApplicationOrderType.salaryRules}>{OaApplicationOrderType.description(OaApplicationOrderType.salaryRules)}</Option>
            <Option value={OaApplicationOrderType.salaryIssue}>{OaApplicationOrderType.description(OaApplicationOrderType.salaryIssue)}</Option>
            <Option value={OaApplicationOrderType.supplies}>{OaApplicationOrderType.description(OaApplicationOrderType.supplies)}</Option>
            <Option value={OaApplicationOrderType.housing}>{OaApplicationOrderType.description(OaApplicationOrderType.housing)}</Option>
            <Option value={OaApplicationOrderType.borrowing}>{OaApplicationOrderType.description(OaApplicationOrderType.borrowing)}</Option>
            <Option value={OaApplicationOrderType.repayments}>{OaApplicationOrderType.description(OaApplicationOrderType.repayments)}</Option>
            <Option value={OaApplicationOrderType.business}>{OaApplicationOrderType.description(OaApplicationOrderType.business)}</Option>
            <Option value={OaApplicationOrderType.travel}>{OaApplicationOrderType.description(OaApplicationOrderType.travel)}</Option>
            <Option value={OaApplicationOrderType.takeLeave}>{OaApplicationOrderType.description(OaApplicationOrderType.takeLeave)}</Option>
            <Option value={OaApplicationOrderType.overTime}>{OaApplicationOrderType.description(OaApplicationOrderType.overTime)}</Option>
          </Select>,
        )),
      },
    );

    // 申请人
    if (componentItems.indexOf(SearchComponentItems.creator) !== -1) {
      items.push({
        label: '申请人',
        form: form => (form.getFieldDecorator('applyAccountId', { initialValue: undefined })(
          <CommonSelectExamineAccount allowClear showSearch optionFilterProp="children" placeholder="请选择申请人" />,
        )),
      });
    }

    // 审批单号
    if (componentItems.indexOf(SearchComponentItems.examine) !== -1) {
      items.push({
        label: '审批单号',
        form: form => (form.getFieldDecorator('orderId', { initialValue: undefined })(
          <Input placeholder="请输入审批单号" />,
        )),
      });
    }

    // 日期
    if (componentItems.indexOf(SearchComponentItems.scope) !== -1) {
      items.push(
        {
          label: '提报日期',
          form: form => (form.getFieldDecorator('submitAt', { initialValue: null })(
            <RangePicker format={'YYYY-MM-DD'} disabledDate={this.disableDateOfMonth} />,
          )),
        },
        {
          label: '付款日期',
          form: form => (form.getFieldDecorator('paymentAt', { initialValue: null })(
            <RangePicker format={'YYYY-MM-DD'} disabledDate={this.disableDateOfMonth} />,
          )),
        },
        {
          label: '归属周期',
          form: form => (form.getFieldDecorator('belongTime', { initialValue: null })(
            <MonthPicker style={{ width: '100%' }} placeholder="请选择归属周期" disabledDate={this.disableDateOfMonth} />,
          )),
        },
      );
    }

    // 标签
    items.push(
      {
        label: '主题标签',
        form: form => (form.getFieldDecorator('themeTags', { initialValue: [], normalize: this.onNormalizeThemeTags })(
          <Select
            placeholder="请输入主题标签"
            mode="tags"
            notFoundContent=""
            tokenSeparators={[',', '，']}
            allowClear
          />,
        )),
      },
    );

    // 验票状态
    items[items.length] = {
      label: '验票状态',
      form: form => (form.getFieldDecorator('ticketState', { initialValue: undefined })(
        <Select allowClear placeholder="请选择">
          <Option value={ExpenseTicketState.already}>{ExpenseTicketState.description(ExpenseTicketState.already)}</Option>
          <Option value={ExpenseTicketState.waiting}>{ExpenseTicketState.description(ExpenseTicketState.waiting)}</Option>
          <Option value={ExpenseTicketState.abnormal}>{ExpenseTicketState.description(ExpenseTicketState.abnormal)}</Option>
        </Select>,
      )),
    };

    // 验票状态
    items[items.length] = {
      label: '验票标签',
      form: form => (form.getFieldDecorator('ticketTag', { initialValue: undefined })(
        <TicketTag
          showArrow
          showSearch
          optionFilterProp="children"
          onChange={this.onChangeTicketTag}
          disabled={ticketTagDis}
        />,
       )),
    };

    // 验票标签存在状态
    items[items.length] = {
      label: '是否有验票标签',
      form: form => (form.getFieldDecorator('existState', { initialValue: undefined })(
        <Select allowClear placeholder="请选择" onChange={this.onChangeExistState} disabled={existStateDis}>
          <Option value={ExpenseTicketExistState.all}>{ExpenseTicketExistState.description(ExpenseTicketExistState.all)}</Option>
          <Option value={ExpenseTicketExistState.have}>{ExpenseTicketExistState.description(ExpenseTicketExistState.have)}</Option>
          <Option value={ExpenseTicketExistState.no}>{ExpenseTicketExistState.description(ExpenseTicketExistState.no)}</Option>
        </Select>,
      )),
    };
    // 费用总金额
    items.push(
      {
        label: '费用总金额',
        form: form => (form.getFieldDecorator('totalMoney')(
          <Input placeholder="请输入费用总金额(元)" />,
        )),
      },
    );

    const props = {
      items,
      operations,
      isExpenseModel: true,                           // 费用模块使用fix city_code
      namespace: `namespace${this.props.selectedTabKey}`,      // 命名空间,
      onReset: this.onReset,
      onSearch: this.onSearch,
      expand,
      onToggle: this.onToggle,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  };
}

Search.SearchComponentItems = SearchComponentItems;
export default Search;
