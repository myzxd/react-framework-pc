/**
 * 费用记录明细 - 搜索组件
 */
import moment from 'moment';
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Select, Input, DatePicker, Popconfirm, Button, message } from 'antd';

import { CoreContent } from '../../../../components/core';
import { ExpenseCostOrderState } from '../../../../application/define';
import { DeprecatedCommonSearchExtension, CommonSelectExpenseTypes, CommonSelectExpenseSubjects } from '../../../../components/common';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    onToggle: PropTypes.func,     // 展开回调
    isShowExpand: PropTypes.bool, // 展开状态
  }
  static defaultProps = {
    onToggle: () => {},
    isShowExpand: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      form: undefined,  // 搜索的form
      search: {
        type: undefined,         // 费用分组
        state: undefined,        // 状态
        approval: undefined,     // 审批单
        subjects: undefined,     // 分组
        cost: undefined,         // 费用单号
        attribution: undefined,  // 归属周期
        submissionStart: undefined, // 提报开始时间
        submissionEnd: undefined,   // 提报借宿时间
        paymentStart: undefined,    // 付款开始时间
        paymentEnd: undefined,      // 付款结束时间
      },
      onToggle: props.onToggle,       // 展开回调
      expand: props.isShowExpand,     // 展开状态
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  // 展开，收起
  onToggle = (expand) => {
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle(expand);
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      type: undefined,        // 费用分组
      state: undefined,       // 状态
      approval: undefined,    // 审批单
      subjects: undefined,    // 分组
      cost: undefined,         // 费用单号
      attribution: undefined,  // 归属周
      submissionStart: undefined, // 提报开始时间
      submissionEnd: undefined,   // 提报借宿时间
      paymentStart: undefined,    // 付款开始时间
      paymentEnd: undefined,      // 付款结束时间
      themeTags: undefined, // 主题标签
    };
    // 重置数据
    this.setState({ search: params });

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

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }
  // 导出数据的失败的回调函数
  onFailureExportCallback = () => {
    message.error('导出数据失败');
  }

  // 创建下载任务
  onCreateExportTask = () => {
    const { dispatch } = this.props;
    this.state.form.validateFields((err, values) => {
      const {
        platforms,
        suppliers,
        cities,
        districts,
        attribution,
        type,
        state,
        approval,
        subjects,
        cost,
        submissionDate,
        paymentDate,
        themeTags,
      } = values;

      const params = {
        platforms,
        suppliers,
        cities,
        districts,
        type,
        state,
        approval,
        subjects,
        cost,
        attribution: attribution ? Number(moment(attribution).format('YYYYMM')) : '',
        themeTags,
      };
      if (is.existy(submissionDate) && is.not.empty(submissionDate)) {
        params.submissionStart = moment(submissionDate[0]).format('YYYYMMDD');
        params.submissionEnd = moment(submissionDate[1]).format('YYYYMMDD');
      }
      if (is.existy(paymentDate) && is.not.empty(paymentDate)) {
        params.paymentStart = moment(paymentDate[0]).format('YYYYMMDD');
        params.paymentEnd = moment(paymentDate[1]).format('YYYYMMDD');
      }
      dispatch({
        type: 'expenseCostOrder/fetchCostOrderExport',
        payload: {
          params,
          onSuccessCallback: this.onSuccessExportCallback,
          onFailureCallback: this.onFailureExportCallback,
        },
      });
    });
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const {
      platforms,
      suppliers,
      cities,
      districts,
      attribution,
      type,
      state,
      approval,
      subjects,
      cost,
      submissionDate,
      paymentDate,
      themeTags,
    } = values;

    const params = {
      platforms,
      suppliers,
      cities,
      districts,
      type,
      state,
      approval,
      subjects,
      cost,
      attribution: attribution ? Number(moment(attribution).format('YYYYMM')) : '',
      themeTags,
    };
    if (is.existy(submissionDate) && is.not.empty(submissionDate)) {
      params.submissionStart = moment(submissionDate[0]).format('YYYYMMDD');
      params.submissionEnd = moment(submissionDate[1]).format('YYYYMMDD');
    }
    if (is.existy(paymentDate) && is.not.empty(paymentDate)) {
      params.paymentStart = moment(paymentDate[0]).format('YYYYMMDD');
      params.paymentEnd = moment(paymentDate[1]).format('YYYYMMDD');
    }
    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提报时间
  onSubmissionChange = (date, dateString) => {
    const { search } = this.state;
    search.submissionStart = dateString[0];
    search.submissionEnd = dateString[1];
    this.setState({
      search,
    });
  }

  // 获取付款时间
  onPaymentChange = (date, dateString) => {
    const { search } = this.state;
    search.paymentStart = dateString[0];
    search.paymentEnd = dateString[1];
    this.setState({
      search,
    });
  }

  // 搜索功能
  render = () => {
    let operations = '';
    const { type, state, subjects, approval, cost } = this.state.search;
    const { isShowExpand } = this.props;
    // 导出EXCEL(超级管理员)
    operations = (
      <Popconfirm title="创建下载任务？" onConfirm={this.onCreateExportTask} okText="确认" cancelText="取消">
        <Button type="primary">导出EXCEL</Button>
      </Popconfirm>
    );
    // 手动搜索
    const searchProps = {
      showSearch: true,
      mode: 'multiple',
      optionFilterProp: 'children',
      allowClear: true,
      showArrow: true,
    };

    const items = [
      {
        label: '费用分组',
        form: form => (form.getFieldDecorator('type', { initialValue: type })(
          <CommonSelectExpenseTypes allowClear placeholder="请选择费用分组" {...searchProps} />,
        )),
      },
      {
        label: '单据状态',
        form: form => (form.getFieldDecorator('state', { initialValue: state })(
          <Select allowClear placeholder="请选择费用单状态" {...searchProps}>
            <Option value={ExpenseCostOrderState.processing}>{ExpenseCostOrderState.description(ExpenseCostOrderState.processing)}</Option>
            <Option value={ExpenseCostOrderState.close}>{ExpenseCostOrderState.description(ExpenseCostOrderState.close)}</Option>
            <Option value={ExpenseCostOrderState.done}>{ExpenseCostOrderState.description(ExpenseCostOrderState.done)}</Option>
          </Select>,
        )),
      },
      {
        label: '科目',
        form: form => (form.getFieldDecorator('subjects', { initialValue: subjects })(
          <CommonSelectExpenseSubjects allowClear placeholder="请选择科目" {...searchProps} />,
        )),
      }, {
        label: '审批单号',
        form: form => (form.getFieldDecorator('approval', { initialValue: approval })(
          <Input placeholder="请输入审批单号" />,
        )),
      },
      {
        label: '费用单号',
        form: form => (form.getFieldDecorator('cost', { initialValue: cost })(
          <Input placeholder="请输入费用单号" />,
        )),
      },
      {
        label: '归属周期',
        form: form => (form.getFieldDecorator('attribution', { initialValue: null })(
          <MonthPicker />,
        )),
      },
      {
        label: '提报日期',
        form: form => (form.getFieldDecorator('submissionDate', { initialValue: null })(
          <RangePicker keys="3" onChange={this.onSubmissionChange} />,
        )),
      },
      {
        label: '付款日期',
        form: form => (form.getFieldDecorator('paymentDate', { initialValue: null })(
          <RangePicker keys="2" onChange={this.onPaymentChange} />,
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
          />,
        )),
      },

    ];

    const props = {
      items,
      operations,
      isExpenseModel: true,    // 费用模块使用fix city_code
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      expand: isShowExpand,
      onToggle: this.onToggle,
    };
    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  };
}

export default connect()(Search);
