/**
 * oa单据页面 - 搜索组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select, Input, DatePicker } from 'antd';

import { CoreContent, DeprecatedCoreSearch } from '../../../../components/core';
import {
  CommonSelectSearchExamineFlows,
  CommonSelectExamineAccount,
} from '../../../../components/common';
import {
  ExpenseExamineOrderProcessState,
  ExpenseApprovalType,
} from '../../../../application/define';

import { PagesTypes } from '../../../oa/document/define';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    selectedTabKey: PropTypes.string,
  };

  static defaultProps = {
    onSearch: () => { },
    selectedTabKey: '',
  };

  componentDidUpdate(prevProps) {
    // 判断tab是否切换，切换清空查询条件
    if (prevProps.selectedTabKey !== this.props.selectedTabKey) {
      if (this.form) {
        this.form.resetFields();
      }
    }
  }

  // 定义form
  onHookForm = (form) => {
    this.form = form;
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      page: 1,
      limit: 30,
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
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

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;

    const {
      state,
      examineFlowId,
      applyAccountId,
      orderId,
      paidState,
      submitAt,
      paymentAt,
      approvalType,
      themeTags,
      actualApplyAccountId,
    } = values;

    // 处理时间
    const submitStartAt = dot.has(submitAt, '0') ? moment(submitAt[0]).format('YYYYMMDD') : ''; // 创建开始日期
    const submitEndAt = dot.has(submitAt, '0') ? moment(submitAt[1]).format('YYYYMMDD') : ''; // 创建开始日期
    const paidStartAt = dot.has(paymentAt, '0') ? moment(paymentAt[0]).format('YYYYMMDD') : ''; // 创建开始日期
    const paidEndAt = dot.has(paymentAt, '0') ? moment(paymentAt[1]).format('YYYYMMDD') : ''; // 创建开始日期

    const params = {
      state,          // 状态
      examineFlowId,  // 审批流id
      applyAccountId,        // 申请人
      orderId: orderId ? orderId.replace(/\s+/g, '') : '', // 审批单号
      paidState,   // 付款状态
      submitStartAt,  // 提报日期开始时间
      submitEndAt,    // 提报日期结束时间
      paidStartAt, // 付款日期开始时间
      paidEndAt,   // 付款日期开始时间
      approvalType,   // 审批单类型
      themeTags,    // 主题标签
      page: 1,
      limit: 30,
      actualApplyAccountId,
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索功能
  render = () => {
    const items = [
      {
        // 可选时间为当天及之前
        label: '提报日期',
        form: form => (form.getFieldDecorator('submitAt', { initialValue: null })(
          <RangePicker format={'YYYY-MM-DD'} disabledDate={current => current && current > new Date()} />,
        )),
      },
      {
        label: '审批类型',
        form: form => (form.getFieldDecorator('approvalType', { initialValue: undefined })(
          <Select optionFilterProp="children" showSearch placeholder="请选择审批类型" allowClear>
            {
              PagesTypes.map((page) => {
                return <Option value={page.key}>{page.title}</Option>;
              })
            }
          </Select>,
        )),
      },
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
      {
        label: '审批流',
        form: form => (form.getFieldDecorator('examineFlowId', { initialValue: undefined }))(
          <CommonSelectSearchExamineFlows
            showSearch
            allowClear
            selectedTabKey={this.props.selectedTabKey}
            placeholder="请选择审批流"
          />,
        ),
      },
      {
        label: '审批单号',
        form: form => (form.getFieldDecorator('orderId', { initialValue: undefined })(
          <Input placeholder="请输入审批单号" />,
        )),
      },
      {
        label: '流程状态',
        form: form => (form.getFieldDecorator('state', { initialValue: undefined })(
          <Select allowClear placeholder="请选择流程状态">
            <Option value={`${ExpenseExamineOrderProcessState.processing}`}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}</Option>
            <Option value={`${ExpenseExamineOrderProcessState.finish}`}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}</Option>
            <Option value={`${ExpenseExamineOrderProcessState.close}`}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}</Option>
          </Select>,
        )),
      },
      {
        label: '实际申请人',
        form: form => (form.getFieldDecorator('actualApplyAccountId', { initialValue: undefined })(
          <CommonSelectExamineAccount allowClear showSearch optionFilterProp="children" placeholder="请选择申请人" />,
        )),
      },
    ];

    if (Number(this.props.selectedTabKey) !== ExpenseApprovalType.penddingSubmit) {
      items.unshift(
        {
          label: '申请人',
          form: form => (form.getFieldDecorator('applyAccountId', { initialValue: undefined })(
            <CommonSelectExamineAccount allowClear showSearch optionFilterProp="children" placeholder="请选择申请人" />,
          )),
        },
      );
    }

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
