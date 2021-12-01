/**
 * code - 审批单详情 - 费用单单据组件
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import {
  Form,
} from 'antd';
import {
  CoreForm,
  CoreFinder,
} from '../../../../../components/core';
import {
  Unit,
  CodeCostCenterType,
  InvoiceAjustAction,
  CostOrderTicketPunchState,
} from '../../../../../application/define';
import PaymentDetail from './paymentDetail';
import Invoice from './invoice';

const { CoreFinderList } = CoreFinder;


// form layout
const formLayoutF = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formLayoutO = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };

function CostItem(props) {
  const {
    cost = {},
    orderId, // 审批单id
    approveOrderDetail = {}, // 审批单详情
    dispatch,
    orderCostItem = {},
  } = props;
  const namespace = cost._id;
  const detail = orderCostItem[namespace] || {};
  const {
    total_money: totalMoney = 0, // 提报金额
    total_tax_amount_amount: totalTaxAmountAmount = 0, // 费用单税金
    type, // 费用单类型（正常 || 红冲）
    bill_red_push_state: billRedPushState, // 红冲状态
    payment_total_money: paymentTotalMoney = 0, // 付款金额
  } = detail;

  useEffect(() => {
    // 判断是否有值
    if (cost._id && orderId) {
      const payload = {
        id: cost._id,
        orderId,
        namespace,
      };
      dispatch({ type: 'codeOrder/fetchOrderCostItem', payload });
    }
    return () => {
      // 清除数据
      dispatch({ type: 'codeOrder/reduceOrderCostItem', payload: { namespace, result: {} } });
    };
  }, [dispatch, cost, orderId, namespace]);

  // 费用金额
  let costMoney = paymentTotalMoney;
  // 正常费用单 && 已红冲
  if (type === InvoiceAjustAction.normal && billRedPushState === CostOrderTicketPunchState.done) {
    costMoney -= totalTaxAmountAmount;
  }

  // 核算中心
  let costCenterType = '--';
  // code
  if (dot.get(detail, 'cost_center_type') === CodeCostCenterType.code) {
    costCenterType = dot.get(detail, 'biz_code_info.name', '--');
  }

  // team
  if (dot.get(detail, 'cost_center_type') === CodeCostCenterType.team) {
    costCenterType = dot.get(detail, 'biz_team_info.name', '--');
  }

  // formItems
  const formItems = [
    <Form.Item
      label="科目"
      {...formLayoutF}
    >
      {dot.get(detail, 'biz_account_info.name', '--')}
      {
        dot.get(detail, 'biz_account_info.ac_code')
          ? `(${dot.get(detail, 'biz_account_info.ac_code')})`
          : ''
      }
    </Form.Item>,
    <Form.Item
      label="核算中心"
      {...formLayoutF}
    >
      {costCenterType}
    </Form.Item>,
    <Form.Item
      label="提报金额"
      {...formLayoutF}
    >
      {Unit.exchangePriceCentToMathFormat(totalMoney)}元
    </Form.Item>,
    <Form.Item
      label="付款金额"
      {...formLayoutF}
    >
      {Unit.exchangePriceCentToMathFormat(paymentTotalMoney)}元
    </Form.Item>,
    <Form.Item
      label="费用金额"
      {...formLayoutF}
    >
      {Unit.exchangePriceCentToMathFormat(costMoney)}元
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
      label="发票抬头"
      {...formLayoutO}
    >
      {dot.get(detail, 'invoice_title', '--')}
    </Form.Item>,
    <Form.Item
      label="事项说明"
      {...formLayoutO}
    >
      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {dot.get(detail, 'note', '--')}
      </div>
    </Form.Item>,
    <Form.Item
      label="附件"
      {...formLayoutO}
    >
      {renderCorePreview(dot.get(detail, 'attachment_private_urls', []))}
    </Form.Item>,
  ];

  // 发票
  const renderInvoice = () => {
    if (Object.keys(detail).length <= 0) return;

    return (
      <Invoice
        detail={detail}
        cost={cost}
        namespace={namespace}
        examineOrderDetail={approveOrderDetail}
      />
    );
  };

  return (
    <React.Fragment>
      <Form className="affairs-flow-detail-basic">
        <CoreForm items={formItems} cols={4} />
        <CoreForm items={formItemOne} cols={1} />
      </Form>

      {/* 支付信息 */}
      <PaymentDetail
        detail={detail}
        isShowMoney={false}
        isShowTitle
      />

      {/* 发票信息 */}
      {renderInvoice()}
    </React.Fragment>
  );
}

const mapStateToProps = ({
  codeOrder: { orderCostItem },
}) => {
  return { orderCostItem };
};
export default connect(mapStateToProps)(CostItem);
