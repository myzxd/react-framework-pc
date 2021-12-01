/**
 * 费用管理 - 借还款管理 - 还款管理 - 查询组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Input, DatePicker, message, Popconfirm, Button } from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  DeprecatedCommonSearchExtension,
} from '../../../../components/common';
import { ExpenseExamineOrderProcessState, ExpenseBorrowRepaymentsTabType } from '../../../../application/define';
import { authorize } from '../../../../application';

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
      repaymentsOrderId,
      state,
      repaymentTime,
    } = values;

    // 处理时间
    const repaymentStartTime = dot.has(repaymentTime, '0') ? moment(repaymentTime[0]).format('YYYYMMDD') : '';
    const repaymentEndTime = dot.has(repaymentTime, '0') ? moment(repaymentTime[1]).format('YYYYMMDD') : '';

    const params = {
      suppliers,
      platforms,
      cities,
      districts,
      state,
      repaymentsOrderId,
      repaymentStartTime,
      repaymentEndTime,
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

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 模板下载成功的回调函数
  onDownloadSuccess = () => {
    message.success('还款数据导出成功');
  }

  // 模板下载失败的回调函数
  onDownloadFailure = () => {
    message.error('还款数据导出失败');
  }

  // 导出EXCEL表格
  onDownload = () => {
    this.state.form.validateFields((err, values) => {
      const {
        suppliers,
        platforms,
        cities,
        districts,
        repaymentsOrderId,
        state,
        repaymentTime,
      } = values;

      // 处理时间
      const repaymentStartTime = dot.has(repaymentTime, '0') ? moment(repaymentTime[0]).format('YYYYMMDD') : '';
      const repaymentEndTime = dot.has(repaymentTime, '0') ? moment(repaymentTime[1]).format('YYYYMMDD') : '';

      if (ExpenseBorrowRepaymentsTabType.mine === this.props.activeKey) {
        const params = {
          suppliers,
          platforms,
          cities,
          districts,
          state,
          repaymentsOrderId,
          repaymentStartTime,
          repaymentEndTime,
          applyAccountId: authorize.account.id,
        };
        this.props.dispatch({
          type: 'borrowingRepayment/repaymentsDownloadTemplate',
          payload: {
            params,
            onSuccessCallback: this.onDownloadSuccess,
            onFailureCallback: this.onDownloadFailure,
          },
        });
      } else {
        const params = {
          suppliers,
          platforms,
          cities,
          districts,
          state,
          repaymentsOrderId,
          repaymentStartTime,
          repaymentEndTime,
        };
        this.props.dispatch({
          type: 'borrowingRepayment/repaymentsDownloadTemplate',
          payload: {
            params,
            onSuccessCallback: this.onDownloadSuccess,
            onFailureCallback: this.onDownloadFailure,
          },
        });
      }
    });
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
      <Popconfirm placement="top" title="是否导出还款列表数据?" okText="确认" onConfirm={() => { this.onDownload(); }} cancelText="取消">
        <Button type="primary">导出EXCEL</Button>
      </Popconfirm>
    );
    const items = [{
      label: '还款单号',
      form: form => (form.getFieldDecorator('repaymentsOrderId')(
        <Input placeholder="请输入还款单号" />,
      )),
    }, {
      label: '还款时间',
      form: form => (form.getFieldDecorator('repaymentTime', { initialValue: null })(
        <RangePicker format={'YYYY-MM-DD'} />,
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
      namespace: `repayment${this.props.activeKey}`,
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

