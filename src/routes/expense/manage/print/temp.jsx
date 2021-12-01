/**
 * 审批单打印的打印区域 Expense/Manage/Print/Temp
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import is from 'is_js';

import {
  ExpenseExamineOrderPaymentState, OaApplicationOrderType,
  Unit,
} from '../../../../application/define';

import ExpenseProcessComponent from './process';
import BorrowMoney from './borrow';
import BusinessTrip from './businessTrip';
import Travel from './travel';
import Repayment from './repayment';
import House from './house';
import Cost from './cost';
import TakeLeave from './takeLeave';
import OverTime from './overTime';

class printTemp extends Component {
  renderBaseMoney = (examineOrder, headStyle) => {
    const { application_order_type: applicationOrderType, cost_order_list: costOrderList = [] } = examineOrder;
    // 审批单为费用或差旅报销，改变
    if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
      const sum = costOrderList.reduce((pre, current) => pre + (current.total_tax_amount_amount ? current.total_tax_amount_amount : 0), 0);
      return (<React.Fragment>
        <div style={headStyle}>付款金额：{Unit.exchangePriceCentToMathFormat(dot.get(examineOrder, 'total_money', 0) + sum)}</div>
        <div style={headStyle}>费用总金额：{Unit.exchangePriceCentToMathFormat(dot.get(examineOrder, 'total_money', 0))}</div>
        <div style={headStyle}>总税金：{Unit.exchangePriceCentToMathFormat(sum)}</div>
      </React.Fragment>);
    }
    return <div style={headStyle}>总金额：{Unit.exchangePriceCentToMathFormat(dot.get(examineOrder, 'total_money', 0))}</div>;
  };
  render() {
    const { examineOrder, houseDetail, costOrder, houseCostOrders, overTimeDetail, takeLeaveDetail } = this.props.detail;
    if (!examineOrder) {
      return '';
    }
    const headStyle = { height: '100%', marginRight: '44px', float: 'left', color: 'rgb(154,154,154)' };
    return (
      <div>
        <div style={{ WebkitPrintColorAdjust: 'exact', fontSize: '12px' }}>
          <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '0 20px', boxSizing: 'border-box', lineHeight: '32px', overflow: 'hidden' }}>
            <div style={headStyle}>审批单号：{examineOrder._id}</div>
            <div style={headStyle}>申请人：{dot.get(examineOrder, 'apply_account_info.name', '--')}</div>
            {this.renderBaseMoney(examineOrder, headStyle)}
            <div style={headStyle}>审批流程：{dot.get(examineOrder, 'flow_info.name', '--')}</div>
            <div style={headStyle}>
              审批类型：{OaApplicationOrderType.description(dot.get(examineOrder, 'application_order_type'))}</div>
            <div style={headStyle}>标记付款状态：{ExpenseExamineOrderPaymentState.description(dot.get(examineOrder, 'paid_state'))}</div>
            <div style={headStyle}>付款异常说明：{examineOrder.paid_note || '--'}</div>
            <div style={headStyle}>主题标签：
              {
                examineOrder.theme_label_list && examineOrder.theme_label_list.length > 0 ?
                  examineOrder.theme_label_list.map((labelItem, labelIndex) => {
                    return <span style={{ marginRight: '4px' }} key={labelIndex}>{labelItem}</span>;
                  }) :
                  '--'
              }
            </div>
          </div>
          {/* 房屋信息 */}
          {
            is.existy(houseDetail) && is.not.empty(houseDetail) ? (
              <House houseDetail={houseDetail} houseCostOrders={houseCostOrders} />
              ) :
              ''
          }
          {/* 借款申请列表 */}
          {
            examineOrder.application_order_type === 6 ? (
              <BorrowMoney examineOrder={examineOrder} />
              ) :
              ''
          }
          {/* 出差列表 */}
          {
            examineOrder.application_order_type === 8 ? (
              <BusinessTrip examineOrder={examineOrder} />
              ) :
              ''
          }
          {/* 差旅列表 */}
          {
            examineOrder.application_order_type === 9 ? (
              <Travel examineOrder={examineOrder} costOrder={costOrder} />
              ) :
              ''
          }
          {/* 还款申请列表 */}
          {
            examineOrder.application_order_type === 7 ? (
              <Repayment examineOrder={examineOrder} />
              ) :
              ''
          }
          {/* 请假申请列表 */}
          {
            is.existy(takeLeaveDetail) && is.not.empty(takeLeaveDetail) && examineOrder.application_order_type === 11 ? (
              <TakeLeave takeLeaveDetail={takeLeaveDetail} />
              ) :
              ''
          }
          {/* 费用单列表 */}
          {
            is.existy(costOrder) && is.not.empty(costOrder) && examineOrder.application_order_type !== 9 ? (
              <Cost costOrder={costOrder} />
            ) :
              ''
          }
          {/* 加班单列表 */}
          {
            is.existy(overTimeDetail) && is.not.empty(overTimeDetail) && examineOrder.application_order_type === OaApplicationOrderType.overTime ? (
              <OverTime overTimeDetail={overTimeDetail} />
            ) :
              ''
          }
          {/* 审批记录列表 */}
          <ExpenseProcessComponent
            applyAccountId={examineOrder.apply_account_id}
            orderId={examineOrder._id}
            data={examineOrder.flow_record_list}
            currentFlowNode={examineOrder.current_flow_node}
            accountList={examineOrder.operate_accounts}
            fileUrlList={examineOrder.file_url_list}
          />
          <div style={{ pageBreakAfter: 'always' }} />
        </div>
      </div>
    );
  }
}


export default printTemp;
