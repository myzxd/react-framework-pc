/**
 * 出差管理 - 搜索组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import moment from 'moment';
import { Input, Select, Button, Popconfirm, DatePicker } from 'antd';
import Operate from '../../../application/define/operate';
import { CommonSelectExamineAccount } from '../../../components/common';
import { ExpenseTravelApplicationBizState } from '../../../application/define';
import { authorize } from '../../../application';
import { DeprecatedCoreSearch } from '../../../components/core';
import style from './style.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {

  static propTypes = {
    onSearch: PropTypes.func,            // 搜索回调
  }

  static defaultProps = {
    onSearch: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,
      search: {
        applyUserName: '',                 // 实际出差人
        applyAccountId: '',                // 申请人
        travelApplyOrderId: '',            // 出差申请单号
        bizState: '',                      // 报销状态
        applyAt: '',                       // 申请时间
        expectStartTime: '',               // 开始时间
        expectDoneTime: '',                // 结束时间
      },
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      applyUserName: '',                 // 实际出差人
      applyAccountId: '',                // 申请人
      travelApplyOrderId: '',            // 出差申请单号
      bizState: '',                      // 报销状态
      applyAt: '',                       // 申请时间
      expectStartTime: '',               // 开始时间
      expectDoneTime: '',                // 结束时间
      page: 1,
      limit: 30,
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 创建下载任务
  onCreateExportTask = () => {
    this.state.form.validateFields((err, values) => {
      const {
        applyUserName,                 // 实际出差人
        applyAccountId,                // 申请人
        travelApplyOrderId,            // 出差申请单号
        bizState,                      // 报销状态
        applyAt,                       // 申请时间
        expectStartTime,               // 开始时间
        expectDoneTime,                // 结束时间
      } = values;

      // 处理时间
      const applyStartAt = dot.has(applyAt, '0') ? moment(applyAt[0]).format('YYYY-MM-DD 00:00:00') : ''; // 申请开始日期
      const applyDoneAt = dot.has(applyAt, '0') ? moment(applyAt[1]).format('YYYY-MM-DD 00:00:00') : ''; // 申请结束日期
      const expectStartMinAt = dot.has(expectStartTime, '0') ? moment(expectStartTime[0]).format('YYYY-MM-DD 00:00:00') : ''; // 开始最小时间
      const expectStartMaxAt = dot.has(expectStartTime, '0') ? moment(expectStartTime[1]).format('YYYY-MM-DD 00:00:00') : '';  // 开始最大时间
      const expectDoneMinAt = dot.has(expectDoneTime, '0') ? moment(expectDoneTime[0]).format('YYYY-MM-DD 00:00:00') : ''; // 结束最小时间
      const expectDoneMaxAt = dot.has(expectDoneTime, '0') ? moment(expectDoneTime[1]).format('YYYY-MM-DD 00:00:00') : ''; // 结束最大时间

      let params = {
        applyUserName,                 // 实际出差人
        applyAccountId,                // 申请人
        travelApplyOrderId,            // 出差申请单号
        bizState,                      // 报销状态
        applyStartAt,                  // 申请开始时间
        applyDoneAt,                   // 申请结束时间
        expectStartMinAt,              // 开始最小时间
        expectStartMaxAt,              // 开始最大时间
        expectDoneMinAt,               // 结束最小时间
        expectDoneMaxAt,               // 结束最大时间
      };
      // 如果不是全部 添加本人id
      if (!this.props.isAll) {
        params = { ...params, applyAccountId: authorize.account.id };
      }
      this.props.dispatch({ type: 'expenseTravelApplication/exportExpenseTravelApplication', payload: params });
    });
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const {
      applyUserName,                 // 实际出差人
      applyAccountId,                // 申请人
      travelApplyOrderId,            // 出差申请单号
      bizState,                      // 报销状态
      applyAt,                       // 申请时间
      expectStartTime,               // 开始时间
      expectDoneTime,                // 结束时间
    } = values;

    // 处理时间
    const applyStartAt = dot.has(applyAt, '0') ? moment(applyAt[0]).format('YYYY-MM-DD 00:00:00') : ''; // 申请开始日期
    const applyDoneAt = dot.has(applyAt, '0') ? moment(applyAt[1]).format('YYYY-MM-DD 00:00:00') : ''; // 申请结束日期
    const expectStartMinAt = dot.has(expectStartTime, '0') ? moment(expectStartTime[0]).format('YYYY-MM-DD 00:00:00') : ''; // 开始最小时间
    const expectStartMaxAt = dot.has(expectStartTime, '0') ? moment(expectStartTime[1]).format('YYYY-MM-DD 00:00:00') : '';  // 开始最大时间
    const expectDoneMinAt = dot.has(expectDoneTime, '0') ? moment(expectDoneTime[0]).format('YYYY-MM-DD 00:00:00') : ''; // 结束最小时间
    const expectDoneMaxAt = dot.has(expectDoneTime, '0') ? moment(expectDoneTime[1]).format('YYYY-MM-DD 00:00:00') : ''; // 结束最大时间

    const params = {
      applyUserName,                 // 实际出差人
      applyAccountId,                // 申请人
      travelApplyOrderId,            // 出差申请单号
      bizState,                      // 报销状态
      applyStartAt,                  // 申请开始时间
      applyDoneAt,                   // 申请结束时间
      expectStartMinAt,              // 开始最小时间
      expectStartMaxAt,              // 开始最大时间
      expectDoneMinAt,               // 结束最小时间
      expectDoneMaxAt,               // 结束最大时间
      page: 1,
      limit: 30,
    };

    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索功能
  render = () => {
    // 导出EXCEL(超级管理员)
    let operations = '';
    if (Operate.canOperateEmployeeSearchExportExcel()) {
      operations = (
        <Popconfirm title="创建下载任务？" onConfirm={this.onCreateExportTask} okText="确认" cancelText="取消">
          <Button type="primary">导出EXCEL</Button>
        </Popconfirm>
      );
    }

    const items = [
      {
        label: '实际出差人',
        form: form => (form.getFieldDecorator('applyUserName')(
          <Input placeholder="请输入实际出差人" />,
        )),
      },
      {
        label: '出差申请单号',
        form: form => (form.getFieldDecorator('travelApplyOrderId')(
          <Input placeholder="请输入出差申请单号" />,
        )),
      },
      {
        label: '报销状态',
        form: form => (form.getFieldDecorator('bizState')(
          <Select allowClear placeholder="请输入报销状态">
            <Option value={ExpenseTravelApplicationBizState.undone}>{ExpenseTravelApplicationBizState.description(1)}</Option>
            <Option value={ExpenseTravelApplicationBizState.completed}>{ExpenseTravelApplicationBizState.description(100)}</Option>
          </Select>,
        )),
      },
      {
        label: '申请时间',
        form: form => (form.getFieldDecorator('applyAt', { initialValue: null })(
          <RangePicker key="apply-at" />,
        )),
      },
      {
        label: '开始时间',
        form: form => (form.getFieldDecorator('expectStartTime', { initialValue: null })(
          <RangePicker key="expect-start-time" />,
        )),
      },
      {
        label: '结束时间',
        form: form => (form.getFieldDecorator('expectDoneTime', { initialValue: null })(
          <RangePicker key="expect-done-time" />,
        )),
      },
    ];

    // 是否是全部
    if (this.props.isAll) {
      items.splice(1, 0, {
        label: '申请人',
        form: form => (form.getFieldDecorator('applyAccountId')(
          <CommonSelectExamineAccount allowClear showSearch optionFilterProp="children" placeholder="请输入申请人" />,
        )),
      });
    }

    const props = {
      items,
      operations,
      expand: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };

    return (
      <div className={style['app-comp-expense-ravel-application-search']}>
        <DeprecatedCoreSearch {...props} />
      </div>
    );
  }
}

export default Search;
