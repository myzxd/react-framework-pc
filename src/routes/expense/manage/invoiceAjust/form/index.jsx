/**
 * 费用管理 - 付款审批 - 红冲审批单创建
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'antd';

import BaseInfo from '../../components/baseInfo';
import CostOrder from '../../components/costOrder';
import Operate from '../../components/operate';

import {
 InvoiceAjustAction,
 ExpenseApprovalType,
 ExpenseCostOrderState,
} from '../../../../../application/define';

import Associated from '../../examineOrder/common/associated'; // 关联审批

class Index extends Component {
  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单详情
    examineDetail: PropTypes.object, // 审批流信息
    location: PropTypes.object,
    originalCostOrder: PropTypes.array, // 原费用单列表
  }

  static defaultProps = {
    examineOrderDetail: {},
    examineDetail: {},
    location: {},
    originalCostOrder: [],
  }

  constructor() {
    super();
    this.state = {
      orderId: '',
    };
  }

  // 默认加载数据
  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;

    const {
      invoiceAdjustId, // 红冲审批单id
    } = location.query;

    // 如果审批单id不为空，则获取审批单详情数据
    if (invoiceAdjustId !== undefined) {
      dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail',
        payload: {
          id: invoiceAdjustId,
          flag: true,
          // onFailureCallback: this.onFailureCallback,
          onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });

      // 获取原费用单列表（红冲）
      dispatch({ type: 'expenseCostOrder/fetchOriginalCostOrder',
        payload: {
          orderId: invoiceAdjustId,
          // onFailureCallback: this.onFailureCallback,
          // onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });
    }
  }

  // 发起红冲
  onInvoiceAdjust = (orderId, costOrderId) => {
    const {
      location,
    } = this.props;

    const {
      invoiceAdjustId, // 红冲审批单id
    } = location.query;

    window.location.href = `/#/Expense/Manage/InvoiceAdjustCostOrderForm?orderId=${orderId}&invoiceAdjustId=${invoiceAdjustId}&costOrderId=${costOrderId}`;
  }

  // 成功回调
  onSuccessCallbackExamineOrderDetail = (result) => {
    // 关联的出差单id
    const {
      flow_id: flowId = '',
    } = result;

    const {
      dispatch,
    } = this.props;

    flowId && dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId } });
  }

  // 提交审批单成功回调
  onSuccessCallback = () => {
    window.location.href = `/#/Expense/Manage/ExamineOrder?selectedTabKey=${ExpenseApprovalType.penddingVerify}`;
  }

  renderContent = () => {
    const {
      examineOrderDetail, // 红冲审批单详情
      examineDetail, // 审批流详情
      originalCostOrder, // 原费用单列表
    } = this.props;

    // 数据不存在，不渲染
    if (Object.keys(examineOrderDetail).length === 0
      || Object.keys(examineDetail).length === 0
      || Object.keys(originalCostOrder).length === 0
    ) return null;

    return (
      <div>
        {/* 渲染基本信息  */}
        {this.renderBaseInfo()}

        {/* 渲染关联审批  */}
        {this.renderAssociatedInfo()}

        {/* 渲染费用单 */}
        {this.renderCostOrder()}

        {this.renderOperate()}
      </div>
    );
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const {
      examineOrderDetail,
    } = this.props;

    if (Object.keys(examineOrderDetail).length === 0) {
      return null;
    }

    return (
      <BaseInfo
        detail={examineOrderDetail}
      />
    );
  }

  // 渲染关联信息
  renderAssociatedInfo = () => {
    const {
      examineOrderDetail,
    } = this.props;

    const {
      id,
      relationApplicationOrderIds: relationApplicationOrderId = [],
    } = examineOrderDetail;

    return (
      <Associated
        key="1"
        relationApplicationOrderId={relationApplicationOrderId}
        orderId={id}
      />
    );
  }

  // 费用单
  renderCostOrder = () => {
    const {
      examineOrderDetail, // 红冲审批单详情
      examineDetail, // 审批流详情
      location,
      originalCostOrder, // 原费用单列表
    } = this.props;

    return (
      <CostOrder
        location={location}
        examineDetail={examineDetail}
        examineOrderDetail={examineOrderDetail}
        originalCostOrder={originalCostOrder}
        extra={this.renderCollapseExtra}
      />
    );
  }

  // 费用单右侧扩展内容
  renderCollapseExtra = (id, costOrderId) => {
    const {
      originalCostOrder, // 原费用单列表
    } = this.props;

    // 当前费用单
    const costOrder = originalCostOrder.filter(item => item.id === costOrderId)[0] || {};

    const {
      refCostOrderInfoList = [], // 关联的红冲单列表
    } = costOrder;

    // 过滤出退款单
    const refundCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.close && item.state !== ExpenseCostOrderState.delete && item.type === InvoiceAjustAction.refund));

    // 退款单存在，则不渲染
    if (refundCostOrder.length > 0) {
      return null;
    }

    // 过滤数组（红冲单）
    const filterCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.close && item.state !== ExpenseCostOrderState.delete && item.type === InvoiceAjustAction.invoiceAdjust));

    // 编辑（已红冲）
    const edit = (
      <a
        key="edit"
        onClick={() => this.onInvoiceAdjust(id, costOrderId)}
      >
        编辑
      </a>
    );

    // 红冲（未发起红冲）
    const invoiceAdjust = (
      <Button
        key={id}
        type="primary"
        onClick={() => this.onInvoiceAdjust(id, costOrderId)}
      >
        发起红冲
      </Button>
    );

    // 已红冲费用单，可以编辑
    if (filterCostOrder.length > 0) {
      return edit;
    }

    // 未红冲审批单，可以红冲
    if (filterCostOrder.length === 0) {
      return invoiceAdjust;
    }

    return null;
  }

  // 操作
  renderOperate = () => {
    const {
      location,
      examineDetail, // 审批流详情
      examineOrderDetail, // 审批单详情
      originalCostOrder, // 原费用单列表
    } = this.props;

    const {
      invoiceAdjustId, // 红冲单id
    } = location.query;

    // 过滤出每个原费用单的关联费用单
    const refCostOrderList = originalCostOrder.map(item => item.refCostOrderInfoList);

    // 合并成一个数组
    // eslint-disable-next-line prefer-spread
    const costOrderList = [].concat.apply([], refCostOrderList);

    // 过滤数组（过滤出红冲费用单）
    const isSubmit = costOrderList.filter(item => (item.type === InvoiceAjustAction.invoiceAdjust && item.state !== ExpenseCostOrderState.delete && item.state !== ExpenseCostOrderState.close && item.total_money > 0)).length > 0;

    if (isSubmit) {
      return (
        <Operate
          orderId={invoiceAdjustId}
          action={InvoiceAjustAction.invoiceAdjust}
          onSuccessCallback={this.onSuccessCallback}
          examineDetail={examineDetail}
          examineOrderDetail={examineOrderDetail}
        />
      );
    }

    return null;
  }

  render() {
    return this.renderContent();
  }
}

function mapStateToProps({
  expenseExamineOrder: { examineOrderDetail },
  expenseExamineFlow: { examineDetail },
  expenseCostOrder: { originalCostOrder },
}) {
  return {
    examineOrderDetail,
    examineDetail,
    originalCostOrder,
  };
}

export default connect(mapStateToProps)(Index);
