/**
 * 房屋管理/列表(搜索组件)
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, Input, DatePicker, Button } from 'antd';

import { CoreContent } from '../../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../../components/common';
import { ExpenseHouseContractState } from '../../../../application/define';
import ExportModal from './components/modal/export';
import Operate from '../../../../application/define/operate';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,
      visible: false, // 弹窗是否显示
      exportValue: {},
      search: {
        state: undefined,        // 执行状态
        contractnum: undefined,    // 合同编号
        houseNumber: undefined,    // 房屋编号
      },
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      state: undefined,        // 执行状态
      contractnum: undefined,    // 合同编号
      houseNumber: undefined,    // 房屋编号
    };
    // 重置数据
    this.setState({ search: params });

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 处理参数
  onDealWith = (val) => {
    const {
      startTime, // 合同开始时间段
      endTime, // 合同结束时间段
      contractnum,  // 合同编号
      state, // 执行状态
      houseNumber, // 房屋编号
    } = val;

    // 处理时间
    const startBeforeTime = dot.has(startTime, '0') ? moment(startTime[0]).format('YYYYMMDD') : ''; // 合同开始时间段开始时间
    const startAfterTime = dot.has(startTime, '1') ? moment(startTime[1]).format('YYYYMMDD') : ''; // 合同开始时间段结束时间
    const endBeforeTime = dot.has(endTime, '0') ? moment(endTime[0]).format('YYYYMMDD') : ''; // 合同结束时间段开始时间
    const endAfterTime = dot.has(endTime, '1') ? moment(endTime[1]).format('YYYYMMDD') : ''; // 合同结束时间段结束时间

    // 搜索参数
    const params = {
      ...val,
      contractnum, // 合同编号
      state, // 执行状态
      houseNumber, // 房屋编号
      startBeforeTime, // 合同开始时间段开始时间
      startAfterTime, // 合同开始时间段结束时间
      endBeforeTime, // 合同结束时间段开始时间
      endAfterTime, // 合同结束时间段结束时间
    };

    return params;
  }

  // 搜索
  onSearch = (values) => {
    // 搜索回调
    const { onSearch } = this.state;

    const params = this.onDealWith(values);

    if (onSearch) {
      onSearch(params);
    }
  }

  // 显示弹窗
  onShowModal = () => {
    const { form } = this.state;
    form.validateFields((err, values) => {
      if (err) return;

      const value = { ...this.onDealWith(values) };
      this.setState({
        exportValue: value,
        visible: true,
      });
    });
  }

  // 隐藏弹窗
  onCancelModal = () => {
    this.setState({ visible: false });
  }

  // 渲染弹窗
  renderModal = () => {
    const { visible, exportValue } = this.state;
    const { dispatch } = this.props;

    if (!visible) return null;

    return (
      <ExportModal
        visible={visible}
        value={exportValue}
        dispatch={dispatch}
        onCancelModal={this.onCancelModal}
      />
    );
  }

  // 搜索功能
  render = () => {
    let operations = '';
    const { contractnum, state, houseNumber } = this.state.search;

    // 导出EXCEL(超级管理员)
    if (Operate.canOperateExpenseManageHouseLedgerExport()) {
      operations = (
        <Button
          type="primary"
          onClick={this.onShowModal}
        >
          导出台账
        </Button>
      );
    }

    const items = [
      {
        label: '房屋编号',
        form: form => (form.getFieldDecorator('houseNumber', { initialValue: houseNumber })(
          <Input placeholder="请输入房屋编号" />,
        )),
      },
      {
        label: '合同编号',
        form: form => (form.getFieldDecorator('contractnum', { initialValue: contractnum })(
          <Input placeholder="请输入合同编号" />,
        )),
      },
      {
        label: '执行状态',
        form: form => (form.getFieldDecorator('state', { initialValue: state })(
          <Select allowClear placeholder="请选择合同状态" >
            <Option value={`${ExpenseHouseContractState.pendding}`}>{ExpenseHouseContractState.description(ExpenseHouseContractState.pendding)}</Option>
            <Option value={`${ExpenseHouseContractState.verifying}`}>{ExpenseHouseContractState.description(ExpenseHouseContractState.verifying)}</Option>
            <Option value={`${ExpenseHouseContractState.processing}`}>{ExpenseHouseContractState.description(ExpenseHouseContractState.processing)}</Option>
            <Option value={`${ExpenseHouseContractState.done}`}>{ExpenseHouseContractState.description(ExpenseHouseContractState.done)}</Option>
          </Select>,
        )),
      },
      {
        label: '合同开始时间',
        form: form => (form.getFieldDecorator('startTime', { initialValue: null })(
          <RangePicker format={'YYYY-MM-DD'} />,
        )),
      },
      {
        label: '合同结束时间',
        form: form => (form.getFieldDecorator('endTime', { initialValue: null })(
          <RangePicker format={'YYYY-MM-DD'} />,
        )),
      },
    ];

    const props = {
      items,
      isExpenseModel: true,           // 费用模块使用fix city_code
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      operations,
    };
    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
        {this.renderModal()}
      </CoreContent>
    );
  };
}

export default Search;
