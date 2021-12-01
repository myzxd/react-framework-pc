/**
 * code - 记录明细详情 - 基本信息
 */
import dot from 'dot-prop';
import React from 'react';
import { connect } from 'dva';
import {
  Form,
} from 'antd';
import {
  CoreForm,
  CoreContent,
  CoreFinder,
} from '../../../../components/core';
import {
  Unit,
  ExpenseExamineOrderProcessState,
  CodeCostCenterType,
  CodeApproveOrderPayState,
  CodeTicketState,
  InvoiceAjustAction,
  CostOrderTicketPunchState,
} from '../../../../application/define';

const { CoreFinderList } = CoreFinder;

// form layout
const formLayoutF = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formLayoutO = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };

const BasicInfo = ({
  detail = {}, // 审批单详情
}) => {
  const {
    _id: id, // 费用单号
    cost_center_type: costCenterType, // 核算中心
    invoice_title: invoiceTitle, // 发票抬头
    total_money: totalMoney = 0, // 提报金额
    payment_total_money: reportMoney = 0, // 付款金额
    total_tax_amount_amount: totalTaxAmountAmount = 0, // 费用单税金
    state, // 状态
    paid_state: paidState, // 付款状态
    inspect_bill_state: inspectBillState, // 验票状态
    note, // 事项说明
    attachment_private_urls: attachmentPrivateUrls = [], // 附件
    bill_red_push_state: billRedPushState, // 红冲状态
    type, // 费用单类型（正常 || 红冲）
  } = detail;

  // 费用金额
  let costMoney = totalMoney;
  // 正常费用单 && 已红冲
  if (type === InvoiceAjustAction.normal && billRedPushState === CostOrderTicketPunchState.done) {
    costMoney = totalMoney - totalTaxAmountAmount;
  }


  // 核算中心
  let costCenterTypeText = '--';
  // code
  if (costCenterType === CodeCostCenterType.code) {
    costCenterTypeText = dot.get(detail, 'biz_code_info.name', '--');
  }

  // team
  if (costCenterType === CodeCostCenterType.team) {
    costCenterTypeText = dot.get(detail, 'biz_team_info.name', '--');
  }

  // form items
  const formItems = [
    <Form.Item label="费用单号" {...formLayoutF}>
      {id || '--'}
    </Form.Item>,
    <Form.Item label="科目" {...formLayoutF}>
      {dot.get(detail, 'biz_account_info.name', '--')}
      {
        dot.get(detail, 'biz_account_info.ac_code')
          ? `(${dot.get(detail, 'biz_account_info.ac_code')})`
          : ''
      }
    </Form.Item>,
    <Form.Item label="核算中心" {...formLayoutF}>
      {costCenterTypeText}
    </Form.Item>,
    <Form.Item label="发票抬头" {...formLayoutF}>
      {invoiceTitle || '--'}
    </Form.Item>,
    <Form.Item label="提报金额" {...formLayoutF}>
      {Unit.exchangePriceCentToMathFormat(totalMoney)}元
    </Form.Item>,
    <Form.Item label="付款金额" {...formLayoutF}>
      {Unit.exchangePriceCentToMathFormat(reportMoney)}元
    </Form.Item>,
    <Form.Item label="费用金额" {...formLayoutF}>
      {Unit.exchangePriceCentToMathFormat(costMoney)}元
    </Form.Item>,
    <Form.Item label="总税金" {...formLayoutF}>
      {Unit.exchangePriceCentToMathFormat(totalTaxAmountAmount)}元
    </Form.Item>,
    <Form.Item label="审批单状态" {...formLayoutF}>
      {state ? ExpenseExamineOrderProcessState.description(state) : '--'}
    </Form.Item>,
    <Form.Item label="付款状态" {...formLayoutF}>
      {
         paidState
           ? CodeApproveOrderPayState.description(paidState)
           : '--'
       }
    </Form.Item>,
    <Form.Item label="验票状态" {...formLayoutF}>
      {
        inspectBillState
          ? CodeTicketState.description(inspectBillState)
          : '--'
      }
    </Form.Item>,
  ];


   // 预览组件
  const renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const data = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };


  // 一行参数
  const formItemOne = [
    <Form.Item
      label="事项说明"
      {...formLayoutO}
    >
      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {note || '--'}
      </div>
    </Form.Item>,
    <Form.Item
      label="附件"
      {...formLayoutO}
    >
      {renderCorePreview(attachmentPrivateUrls)}
    </Form.Item>,
  ];

  return (
    <CoreContent
      title="基本信息"
      className="affairs-flow-detail-basic"
    >
      <CoreForm items={formItems} cols={4} />
      <CoreForm items={formItemOne} cols={1} />
    </CoreContent>
  );
};

export default connect()(BasicInfo);
