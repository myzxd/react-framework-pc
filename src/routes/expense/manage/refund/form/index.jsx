/**
 * 费用管理 - 付款审批 - 退款审批单编辑
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';

import BaseInfo from '../../components/baseInfo'; // 基本信息
import CostOrder from '../../components/costOrder'; // 费用单
import Operate from '../../components/operate'; // 提交操作

import {
 InvoiceAjustAction,
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

  // 默认加载数据
  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;

    const {
      refundId, // 审批单id
    } = location.query;

    // 获取退款审批单详情
    if (refundId !== undefined) {
      dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail',
        payload: {
          id: refundId,
          flag: true,
          // onFailureCallback: this.onFailureCallback,
          onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });

      // 获取原费用单列表（退款）
      dispatch({ type: 'expenseCostOrder/fetchOriginalCostOrder',
        payload: {
          orderId: refundId,
          // onFailureCallback: this.onFailureCallback,
          // onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });
    }
  }

  // 提交成功的回调
  onSuccessCallback = () => {
    window.location.href = '/#/Expense/Manage/ExamineOrder';
  }

  // 编辑退款
  onEdit = (orderId, costOrderId) => {
    const {
      location,
    } = this.props;

    const {
      refundId, // 退款审批单id
      originalId = '', // 退款费用单id
    } = location.query;

    window.location.href = `/#/Expense/Manage/RefundCostOrderForm?orderId=${orderId}&refundId=${refundId}&costOrderId=${costOrderId}&originalId=${originalId}`;
  }

  // 发起退款
  onRefund = (orderId, costOrderId, refundCostOrderId) => {
    const {
      location,
    } = this.props;

    const {
      refundId, // 退款审批单id
    } = location.query;

    if (refundCostOrderId) {
      window.location.href = `/#/Expense/Manage/RefundCostOrderForm?orderId=${orderId}&refundId=${refundId}&costOrderId=${costOrderId}&originalId=${refundCostOrderId}`;
    } else {
      window.location.href = `/#/Expense/Manage/RefundCostOrderForm?orderId=${orderId}&refundId=${refundId}&costOrderId=${costOrderId}`;
    }
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

  // 渲染内容
  renderContent = () => {
    const {
      examineOrderDetail, // 审批单详情
      originalCostOrder, // 原费用单列表
      examineDetail, // 审批流详情
    } = this.props;

    // 数据为空,不渲染
    if (Object.keys(examineOrderDetail).length === 0
      || Object.keys(examineDetail).length === 0
      || originalCostOrder.length === 0
    ) return null;

    return (
      <div>
        {/* 渲染基本信息  */}
        {this.renderBaseInfo()}

        {/* 关联审批 */}
        {this.renderAssociatedInfo()}

        {/* 渲染费用单 */}
        {this.renderCostOrder()}

        {/* 渲染操作 */}
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

  // 费用单
  renderCostOrder = () => {
    const {
      examineOrderDetail,
      examineDetail,
      location,
      originalCostOrder,
    } = this.props;

    if (Object.keys(examineOrderDetail).length === 0) {
      return null;
    }

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

    // 过滤出红冲单
    const refundCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.close && item.state !== ExpenseCostOrderState.delete && item.type === InvoiceAjustAction.invoiceAdjust));

    // 退款单存在，则不渲染
    if (refundCostOrder.length > 0) {
      return null;
    }

    // 过滤数组
    const filterCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.close && item.state !== ExpenseCostOrderState.delete && item.type === InvoiceAjustAction.refund));

    let refundCostOrderId;

    if (filterCostOrder.length === 1) {
      refundCostOrderId = filterCostOrder[0]._id;
    }

    // 编辑（已退款）
    const edit = (
      <a
        key="edit"
        onClick={() => this.onRefund(id, costOrderId, refundCostOrderId)}
      >
        编辑
      </a>
    );

    // 退款（未发起退款）
    const refund = (
      <Button
        key={id}
        type="primary"
        onClick={() => this.onRefund(id, costOrderId)}
      >
        发起退款
      </Button>
    );

    // 已退款费用单，可以编辑
    if (filterCostOrder.length > 0) {
      return edit;
    }

    // 未退款审批单，可以退款
    if (filterCostOrder.length === 0) {
      return refund;
    }

    return null;
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

  // 操作
  renderOperate = () => {
    const {
      location,
      examineDetail, // 审批流详情
      examineOrderDetail, // 审批单详情
      originalCostOrder, // 原费用单列表
    } = this.props;

    const {
      refundId, // 退款单id
    } = location.query;

    // 过滤出每个原费用单的关联费用单
    const refCostOrderList = originalCostOrder.map(item => item.refCostOrderInfoList);

    // 合并成一个数组
    // eslint-disable-next-line prefer-spread
    const costOrderList = [].concat.apply([], refCostOrderList);

    // 过滤数组（过滤出退款费用单）
    const isSubmit = costOrderList.filter(item => (item.type === InvoiceAjustAction.refund && item.state !== ExpenseCostOrderState.delete && item.state !== ExpenseCostOrderState.close)).length > 0;

    if (isSubmit) {
      return (
        <Operate
          orderId={refundId}
          action={InvoiceAjustAction.refund}
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

export default connect(mapStateToProps)(Form.create()(Index));
