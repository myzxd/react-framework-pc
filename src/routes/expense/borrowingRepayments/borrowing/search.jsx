/**
 * 费用管理 - 借还款管理 - 借款管理 - 查询组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Input, DatePicker, message, Popconfirm, Button } from 'antd';

import { CoreContent } from '../../../../components/core';
import { authorize } from '../../../../application';

import {
  DeprecatedCommonSearchExtension,
} from '../../../../components/common';
import {
  BorrowType,
  ExpenseRepaymentState,
  ExpenseExamineOrderProcessState,
  ExpenseBorrowRepaymentsTabType,
} from '../../../../application/define';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
    };
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

  // 查询
  onSearch = (values) => {
    const { onSearch } = this.props;
    const {
      suppliers,
      platforms,
      cities,
      districts,
      borrowType,
      borrowOrderId,
      repaymentState,
      borrowTime,
      repaymentTime,
      subjectMatter,
      state,
    } = values;

    // 处理时间
    const borrowStartTime = dot.has(borrowTime, '0') ? moment(borrowTime[0]).format('YYYYMMDD') : '';
    const borrowEndTime = dot.has(borrowTime, '1') ? moment(borrowTime[1]).format('YYYYMMDD') : '';
    const repaymentStartTime = dot.has(repaymentTime, '0') ? moment(repaymentTime[0]).format('YYYYMMDD') : '';
    const repaymentEndTime = dot.has(repaymentTime, '1') ? moment(repaymentTime[1]).format('YYYYMMDD') : '';

    // 定义参数
    const params = {
      suppliers,
      platforms,
      cities,
      districts,
      borrowType,
      borrowOrderId,
      repaymentState,
      subjectMatter,
      borrowStartTime,
      borrowEndTime,
      repaymentStartTime,
      repaymentEndTime,
      state,
    };

    if (onSearch) {
      onSearch(params);
    }
  };

  // 展开，收起
  onToggle = (expand) => {
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle(expand);
    }
  }
  // 模板下载成功的回调函数
  onDownloadSuccess = () => {
    message.success('借款数据导出成功');
  }

  // 模板下载失败的回调函数
  onDownloadFailure = () => {
    message.error('借款数据导出失败');
  }

  // 导出EXCEL表格
  onDownload = () => {
    const { dispatch } = this.props;
    this.state.form.validateFields((err, values) => {
      const {
        suppliers,
        platforms,
        cities,
        districts,
        borrowType,
        borrowOrderId,
        repaymentState,
        borrowTime,
        repaymentTime,
        subjectMatter,
        state,
      } = values;

      // 处理时间
      const borrowStartTime = dot.has(borrowTime, '0') ? moment(borrowTime[0]).format('YYYYMMDD') : '';
      const borrowEndTime = dot.has(borrowTime, '1') ? moment(borrowTime[1]).format('YYYYMMDD') : '';
      const repaymentStartTime = dot.has(repaymentTime, '0') ? moment(repaymentTime[0]).format('YYYYMMDD') : '';
      const repaymentEndTime = dot.has(repaymentTime, '1') ? moment(repaymentTime[1]).format('YYYYMMDD') : '';

      if (ExpenseBorrowRepaymentsTabType.mine === this.props.activeKey) {
        // 定义参数
        const params = {
          suppliers,
          platforms,
          cities,
          districts,
          borrowType,
          borrowOrderId,
          repaymentState,
          subjectMatter,
          borrowStartTime,
          borrowEndTime,
          repaymentStartTime,
          repaymentEndTime,
          state,
          applyAccountId: authorize.account.id,
        };
        dispatch({
          type: 'borrowingRepayment/borrowingDownloadTemplate',
          payload: {
            params,
            onSuccessCallback: this.onDownloadSuccess,
            onFailureCallback: this.onDownloadFailure,
          },
        });
      } else {
        // 定义参数
        const params = {
          suppliers,
          platforms,
          cities,
          districts,
          borrowType,
          borrowOrderId,
          repaymentState,
          subjectMatter,
          borrowStartTime,
          borrowEndTime,
          repaymentStartTime,
          repaymentEndTime,
          state,
        };
        dispatch({
          type: 'borrowingRepayment/borrowingDownloadTemplate',
          payload: {
            params,
            onSuccessCallback: this.onDownloadSuccess,
            onFailureCallback: this.onDownloadFailure,
          },
        });
      }
    });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 渲染查询表单
  renderSearchForm = () => {
    const { expand } = this.props;
    // 导出Execel
    const operations = (
      <Popconfirm placement="top" title="是否导出借款列表数据?" okText="确认" onConfirm={() => { this.onDownload(); }} cancelText="取消">
        <Button type="primary">导出EXCEL</Button>
      </Popconfirm>
    );
    const items = [{
      label: '借款类型',
      form: form => (form.getFieldDecorator('borrowType')(
        <Select allowClear placeholder="请选择借款类型">
          <Option value={BorrowType.normal}>{BorrowType.description(BorrowType.normal)}</Option>
        </Select>,
      )),
    }, {
      label: '借款单号',
      form: form => (form.getFieldDecorator('borrowOrderId')(
        <Input placeholder="请输入借款单号" />,
      )),
    }, {
      label: '还款状态',
      form: form => (form.getFieldDecorator('repaymentState')(
        <Select allowClear placeholder="请选择还款状态">
          <Option value={ExpenseRepaymentState.hasAlso}>{ExpenseRepaymentState.description(ExpenseRepaymentState.hasAlso)}</Option>
          <Option value={ExpenseRepaymentState.repaymenting}>{ExpenseRepaymentState.description(ExpenseRepaymentState.repaymenting)}</Option>
          <Option value={ExpenseRepaymentState.notYet}>{ExpenseRepaymentState.description(ExpenseRepaymentState.notYet)}</Option>
        </Select>,
      )),
    }, {
      label: '流程状态',
      form: form => (form.getFieldDecorator('state')(
        <Select allowClear placeholder="请选择流程状态">
          <Option value={ExpenseExamineOrderProcessState.processing}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}</Option>
          <Option value={ExpenseExamineOrderProcessState.finish}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}</Option>
          <Option value={ExpenseExamineOrderProcessState.close}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}</Option>
        </Select>,
      )),
    }, {
      label: '申请借款时间',
      form: form => (form.getFieldDecorator('borrowTime', { initialValue: null })(
        <RangePicker format={'YYYY-MM-DD'} disabledDate={this.disableDateOfMonth} />,
      )),
    }, {
      label: '预计还款时间',
      form: form => (form.getFieldDecorator('repaymentTime', { initialValue: null })(
        <RangePicker format={'YYYY-MM-DD'} />,
      )),
    }, {
      label: '借款事由',
      form: form => (form.getFieldDecorator('subjectMatter')(
        <Input placeholder="请输入借款事由" />,
      )),
    }];

    const props = {
      items,
      operations,
      expand,
      isExpenseModel: true,       // 费用模块使用fix city_code
      onReset: this.onReset,
      onSearch: this.onSearch,
      onToggle: this.onToggle,
      onHookForm: this.onHookForm,

      namespace: `borrow${this.props.activeKey}`,
    };
    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {this.renderSearchForm()}
      </div>
    );
  }
}
function mapStateToProps({ borrowingRepayment }) {
  return { borrowingRepayment };
}
export default connect(mapStateToProps)(Search);
