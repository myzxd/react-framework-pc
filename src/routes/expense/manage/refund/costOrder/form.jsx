/**
 * 费用管理 - 付款审批 - 退款审批单 - 退款费用单创建
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
  CoreContent,
} from '../../../../../components/core';

import CostOrderItem from '../../components/costOrderItem'; // 原费用单
import Refund from './refund'; // 退款费用单表单

class RefundCostOrder extends Component {
  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单详情
    examineDetail: PropTypes.object, // 审批流详情
    costOrderDetail: PropTypes.object, // 原费用单详情
    // originalCostOrder: PropTypes.array, // 原费用单列表
    invoiceCostOrder: PropTypes.object, // 退款费用单详情
  }

  static defaultProps = {
    examineOrderDetail: {},
    examineDetail: {},
    costOrderDetail: {},
    // originalCostOrder: [],
    invoiceCostOrder: {},
  }

  // 默认加载数据
  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;
    // 如果审批单id不为空，则获取审批单详情数据

    const {
      orderId, // 审批单id
      costOrderId, // is费用单id
      originalId, // 退款费用单id
    } = location.query;

    // 原费用单详情
    if (costOrderId) {
      dispatch({
        type: 'expenseCostOrder/fetchCostOrderDetail',
        payload: {
          recordId: costOrderId,
        },
      });
    }

    // 退款费用单列表
    if (originalId && originalId !== 'undefined') {
      dispatch({
        type: 'expenseCostOrder/fetchInvoiceCostOrderDetail',
        payload: {
          recordId: originalId,
        },
      });
    }

    // 审批单详情
    if (orderId !== undefined) {
      dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail',
        payload: {
          id: orderId,
          flag: true,
          // onFailureCallback: this.onFailureCallback,
          onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });
    }
  }

  componentWillUnmount() {
    const {
      dispatch,
    } = this.props;

    // 重置
    dispatch({ type: 'expenseCostOrder/resetInvoiceCostOrderDetail', payload: {} });
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

  // 渲染原费用单
  renderOriginalCostOrder = () => {
    const {
      location,
      examineOrderDetail, // 审批单详情
      examineDetail, // 审批流详情
      costOrderDetail, // 费用单详情
    } = this.props;

    const {
      costOrderId, // 原费用单id
    } = location.query;

    return (
      <CostOrderItem
        location={location}
        recordId={costOrderId}
        costOrderDetail={costOrderDetail}
        examineOrderDetail={examineOrderDetail}
        examineDetail={examineDetail}
      />
    );
  }

  // 渲染退款单
  renderRefundOrder = () => {
    const {
      examineOrderDetail, // 审批单详情
      costOrderDetail, // 费用单详情
      location,
      invoiceCostOrder, // 退款费用单详情
      examineDetail, // 审批流详情
    } = this.props;

    const {
      orderId, // 审批单id
      costOrderId, // 原费用单id
      refundId, // 退款审批单id
      originalId, // 退款费用单id
    } = location.query;

    return (
      <Refund
        orderId={orderId}
        refundId={refundId}
        originalId={originalId}
        costOrderId={costOrderId}
        detail={costOrderDetail}
        invoiceCostOrder={invoiceCostOrder}
        examineDetail={examineDetail}
        examineOrderDetail={examineOrderDetail}
      />
    );
  }

  // 内容
  renderContent = () => {
    const {
      examineOrderDetail,
      examineDetail,
      costOrderDetail,
    } = this.props;

    // 数据不存在，不渲染
    if (
      Object.keys(examineDetail).length === 0
      || Object.keys(examineOrderDetail).length === 0
      || Object.keys(costOrderDetail).length === 0
    ) {
      return null;
    }

    return (
      <div>
        <CoreContent
          title="原费用单"
        >
          {/* 渲染原费用单 */}
          {this.renderOriginalCostOrder()}
        </CoreContent>

        {/* 渲染退款单 */}
        {this.renderRefundOrder()}
      </div>
    );
  }

  render() {
    return this.renderContent();
  }
}

function mapStateToProps({
  expenseExamineOrder: { examineOrderDetail },
  expenseExamineFlow: { examineDetail },
  expenseCostOrder: {
    costOrderDetail,
    invoiceCostOrder,
  },
}) {
  return {
    examineOrderDetail,
    examineDetail,
    costOrderDetail,
    invoiceCostOrder,
  };
}

export default connect(mapStateToProps)(Form.create()(RefundCostOrder));
