/**
 * code - 审批单详情 - 基本信息
 */
import dot from 'dot-prop';
import React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  CoreForm,
  CoreContent,
} from '../../../../../components/core';
import {
  ExpenseExamineOrderProcessState,
  CodeApproveOrderPayState,
  CodeTicketState,
} from '../../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const BasicInfo = ({
  approveOrderDetail = {}, // 审批单详情
}) => {
  // form items
  const formItems = [
    <Form.Item label="申请人" {...formLayout}>
      {dot.get(approveOrderDetail, 'apply_account_info.name', '--')}
    </Form.Item>,
    <Form.Item label="部门" {...formLayout}>
      {dot.get(approveOrderDetail, 'department_job_info.department_info.name', '--')}
    </Form.Item>,
    <Form.Item label="岗位" {...formLayout}>
      {dot.get(approveOrderDetail, 'department_job_info.job_info.name', '--')}
    </Form.Item>,
    <Form.Item label="职级" {...formLayout}>
      {dot.get(approveOrderDetail, 'department_job_info.job_info.rank', '--')}
    </Form.Item>,
    <Form.Item label="审批单号" {...formLayout}>
      {dot.get(approveOrderDetail, '_id', '--')}
    </Form.Item>,
    <Form.Item label="审批流" {...formLayout}>
      {dot.get(approveOrderDetail, 'flow_info.name', '--')}
    </Form.Item>,
    <Form.Item label="流程状态" {...formLayout}>
      {dot.get(approveOrderDetail, 'state', undefined) ? ExpenseExamineOrderProcessState.description(dot.get(approveOrderDetail, 'state', undefined)) : '--'}
    </Form.Item>,
    <Form.Item label="付款状态" {...formLayout}>
      {dot.get(approveOrderDetail, 'paid_state', undefined) ? CodeApproveOrderPayState.description(dot.get(approveOrderDetail, 'paid_state', undefined)) : '--'}
    </Form.Item>,
    <Form.Item label="验票状态" {...formLayout}>
      {dot.get(approveOrderDetail, 'inspect_bill_state', undefined) ? CodeTicketState.description(dot.get(approveOrderDetail, 'inspect_bill_state', undefined)) : '--'}
    </Form.Item>,
    <Form.Item
      label="记账月份"
      {...formLayout}
    >
      {dot.get(approveOrderDetail, 'belong_month', undefined) || '付款月份'}
    </Form.Item>,
  ];

  // 打印预览
  const onPrintView = () => {
    const printData = JSON.stringify([dot.get(approveOrderDetail, '_id', undefined)]);
    window.location.href = `/#/Code/Print?selectedRowKeys=${printData}`;
  };

  const isPrint = (dot.get(approveOrderDetail, 'state', undefined) === ExpenseExamineOrderProcessState.processing ||
    dot.get(approveOrderDetail, 'state', undefined) === ExpenseExamineOrderProcessState.finish ||
    dot.get(approveOrderDetail, 'state', undefined) === ExpenseExamineOrderProcessState.close)
  && !dot.get(approveOrderDetail, 'plugin_app_id', undefined)
  ;

  // titleExt
  const titleExt = isPrint ? (
    <Button type="primary" onClick={onPrintView}>打印</Button>
  ) : '';

  return (
    <CoreContent
      title="基本信息"
      titleExt={titleExt}
      className="affairs-flow-detail-basic"
    >
      <Form>
        <CoreForm items={formItems} cols={4} />
      </Form>
    </CoreContent>
  );
};

export default BasicInfo;
