/**
 * code - 记录明细 - search
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Popconfirm,
} from 'antd';
import {
  CodeCostCenterType,
  CodeApproveOrderPayState,
  ExpenseExamineOrderProcessState,
  CodeRecordBillRedPushState,
} from '../../../application/define';
import {
  CoreSearch,
  CoreContent,
} from '../../../components/core';
import {
  CommonSelectExamineAccount,
} from '../../../components/common';
import Subject from '../basicSetting/flow/component/subject';
import CostCenterType from './component/costCenterType';
import InvoiceForm from './component/incoice';

import Operate from '../../../application/define/operate';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const Search = ({
  onSearch,
  onReset,
  dispatch,
  searchVal,
}) => {
  // form
  const [form, setForm] = useState({});

  useEffect(() => {
    form && form.resetFields && form.resetFields();
  }, [form]);

  // 导出报表
  const onConfirm = async () => {
    const formVals = await form.validateFields();
    dispatch({
      type: 'codeRecord/onExportRecords',
      payload: {
        ...searchVal,
        ...formVals,
      },
    });
  };

  // form items
  const formItems = [
    <Form.Item
      label="提报类型"
      name="reportType"
    >
      <Select placeholder="请选择" allowClear>
        <Option
          value={CodeCostCenterType.code}
        >{CodeCostCenterType.description(CodeCostCenterType.code)}</Option>
        <Option
          value={CodeCostCenterType.team}
        >{CodeCostCenterType.description(CodeCostCenterType.team)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="科目名称"
      name="subject"
    >
      <Subject />
    </Form.Item>,
    <Form.Item
      label="核算中心"
      name="accountCenter"
    >
      <CostCenterType />
    </Form.Item>,
    <Form.Item
      label="单据状态"
      name="state"
    >
      <Select placeholder="请选择" allowClear>
        <Option
          value={ExpenseExamineOrderProcessState.processing}
        >
          {ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}
        </Option>
        <Option
          value={ExpenseExamineOrderProcessState.finish}
        >
          {ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}
        </Option>
        <Option
          value={ExpenseExamineOrderProcessState.close}
        >
          {ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="费用单号"
      name="costOrderId"
    >
      <Input placeholder="请输入费用单号" allowClear />
    </Form.Item>,
    <Form.Item
      label="审批单号"
      name="orderId"
    >
      <Input placeholder="请输入审批单号" allowClear />
    </Form.Item>,
    <Form.Item
      label="记账月份"
      name="belongTime"
    >
      <MonthPicker inputReadOnly allowClear />
    </Form.Item>,
    <Form.Item
      label="提报时间"
      name="reportAt"
    >
      <RangePicker
        format={'YYYY-MM-DD'}
        disabledDate={c => (c && c > new Date())}
        allowClear
        inputReadOnly
      />
    </Form.Item>,
    <Form.Item
      label="付款时间"
      name="payAt"
    >
      <RangePicker
        format={'YYYY-MM-DD'}
        disabledDate={c => (c && c > new Date())}
        allowClear
        inputReadOnly
      />
    </Form.Item>,
    <Form.Item
      label="申请人"
      name="applicant"
    >
      <CommonSelectExamineAccount
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder="请选择"
      />
    </Form.Item>,
    <Form.Item
      label="是否红冲"
      name="billRedPushState"
    >
      <Select allowClear placeholder="请选择">
        <Option
          value={CodeRecordBillRedPushState.right}
        >{CodeRecordBillRedPushState.description(CodeRecordBillRedPushState.right)}</Option>
        <Option
          value={CodeRecordBillRedPushState.negate}
        >{CodeRecordBillRedPushState.description(CodeRecordBillRedPushState.negate)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="付款状态"
      name="payStatus"
    >
      <Select allowClear placeholder="请选择付款状态">
        <Option
          value={CodeApproveOrderPayState.done}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.done)}
        </Option>
        <Option
          value={CodeApproveOrderPayState.abnormal}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.abnormal)}
        </Option>
        <Option
          value={CodeApproveOrderPayState.untreated}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.untreated)}
        </Option>
        <Option
          value={CodeApproveOrderPayState.noNeed}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.noNeed)}
        </Option>
      </Select>
    </Form.Item>,
  ];

  const expandItems = [
    <Form.Item
      label="发票抬头"
      name="invoiceTitle"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      style={{ marginLeft: 8 }}
    >
      <InvoiceForm />
    </Form.Item>,
  ];

  // 操作
  const operations = Operate.canOperateOperateCodeRecordExport() ? (
    <Popconfirm
      title="创建下载任务？"
      onConfirm={onConfirm}
      okText="确认"
      cancelText="取消"
    >
      <Button type="primary">导出EXCEL</Button>
    </Popconfirm>
  ) : '';

  // coreSearch props
  const sProps = {
    items: formItems,
    expandItems,
    onSearch,
    onReset,
    onHookForm: hForm => setForm(hForm),
    operations,
  };

  return (
    <CoreContent>
      <CoreSearch {...sProps} />
    </CoreContent>
  );
};

export default Search;
