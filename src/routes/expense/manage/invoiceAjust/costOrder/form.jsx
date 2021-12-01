/**
 * 费用管理 - 付款审批 - 红冲审批单 - 红冲费用单编辑
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';

import {
  ExpenseCostOrderState,
} from '../../../../../application/define';

import {
  CoreContent,
} from '../../../../../components/core';

import CostOrderItem from '../../components/costOrderItem'; // 费用单组件
import InvoiceAdjust from './index'; // 红冲费用单表单

import style from './style.css';

class InvoiceAdjustCostOrder extends Component {
  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单详情
    examineDetail: PropTypes.object, // 审批流详情
    costOrderDetail: PropTypes.object, // 费用单详情
    originalCostOrder: PropTypes.array, // 原费用单列表
  }

  static defaultProps = {
    examineOrderDetail: {},
    examineDetail: {},
    costOrderDetail: {},
    originalCostOrder: [],
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { originalCostOrder = undefined } = oriState;
    const { originalCostOrder: prevData = [], location } = prevProps;
    const { costOrderId } = location.query;
    if (originalCostOrder === undefined && prevData.length > 0) {
      // 费用单详情
      const costOrder = prevData.filter(item => item.id === costOrderId)[0] || {};

      const {
        refCostOrderInfoList = [],
      } = costOrder;

      // 过滤正常的费用单
      const filterCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.delete && item.state !== ExpenseCostOrderState.close && item.total_money > 0));
      return { costOrderList: filterCostOrder.map(item => item._id), originalCostOrder: prevData };
    }
  }

  constructor() {
    super();
    this.state = {
      originalCostOrder: undefined,
      costOrderList: [],
    };
  }

  // 默认加载数据
  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;

    const {
      orderId, // 审批单id
      costOrderId, // 原费用单id
    } = location.query;

    // 费用单详情
    if (costOrderId) {
      dispatch({
        type: 'expenseCostOrder/fetchCostOrderDetail',
        payload: {
          recordId: costOrderId,
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

      // 获取原费用单列表（红冲）
      dispatch({ type: 'expenseCostOrder/fetchOriginalCostOrder',
        payload: {
          orderId,
          // onFailureCallback: this.onFailureCallback,
          // onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });
    }
  }

  // 添加红冲单
  onAdd = () => {
    const { costOrderList } = this.state;
    this.setState({ costOrderList: [...costOrderList, ''] });
  }

  // 编辑
  onUpdate = (costOrderId, uniqueKey) => {
    const {
      costOrderList,
    } = this.state;

    costOrderList.splice(uniqueKey, 1, costOrderId);

    this.setState({
      costOrderList,
    });

    this.fetchOriginalCostOrder();
  }

  // 取消
  onCancel = (key) => {
    const { costOrderList } = this.state;
    costOrderList.splice(key, 1);
    this.setState({
      costOrderList,
    });

    this.fetchOriginalCostOrder();
  }

  // 创建完成
  onSubmit = () => {
    const {
      location,
      costOrderDetail,
      originalCostOrder,
    } = this.props;

    const {
      orderId, // 原审批单id
      invoiceAdjustId, // 红冲审批单id
      costOrderId,
    } = location.query;

    const {
      totalMoney,
    } = costOrderDetail;

    // 费用单详情
    const costOrder = originalCostOrder.filter(item => item.id === costOrderId)[0] || {};

    const {
      refCostOrderInfoList = [],
    } = costOrder;

    // 过滤正常的费用单
    const filterCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.delete && item.state !== ExpenseCostOrderState.close && item.total_money > 0));

    // 获取金额
    const costOrderMoney = filterCostOrder.map(item => Math.abs(item.total_money));

    // 计算金额
    const money = costOrderMoney.reduce((acc, cur) => acc + cur);

    if (money !== totalMoney) {
      return message.error('红冲单金额累计不正确');
    }

    window.location.href = `/#/Expense/Manage/InvoiceAdjust?orderId=${orderId}&invoiceAdjustId=${invoiceAdjustId}`;
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

  // 获取原费用单列表（红冲）
  fetchOriginalCostOrder = () => {
    const {
      dispatch,
      location,
    } = this.props;

    const {
      orderId,
    } = location.query;

    // 获取原费用单列表（红冲）
    dispatch({ type: 'expenseCostOrder/fetchOriginalCostOrder',
      payload: {
        orderId,
        // onFailureCallback: this.onFailureCallback,
        // onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
      },
    });
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
        isInvoiceAdjust
        location={location}
        recordId={costOrderId}
        costOrderDetail={costOrderDetail}
        examineOrderDetail={examineOrderDetail}
        examineDetail={examineDetail}
      />
    );
  }

  // 红冲费用单表单
  renderInvocieAdjust = () => {
    const {
      examineOrderDetail, // 审批单详情
      examineDetail, // 审批流详情
      location,
      originalCostOrder, // 原费用单列表
    } = this.props;

    const {
      costOrderList,
    } = this.state;

    // 数据为空，默认添加一项
    if (costOrderList.length === 0) {
      costOrderList.push('');
    }

    const {
      orderId, // 审批单id
      invoiceAdjustId, // 红冲审批单id
      costOrderId, // 原费用单id
    } = location.query;

    // 过滤出关联的费用单
    const costOrder = originalCostOrder.filter(item => item.id === costOrderId)[0] || {};

    const {
      refCostOrderInfoList = [], // 关联的红冲单
    } = costOrder;

    return costOrderList.map((item, key) => {
      // 费用单详情
      const detail = refCostOrderInfoList.filter(i => i._id === item)[0] || {};

      return (
        <InvoiceAdjust
          // key={key}
          uniqueKey={key}
          orderId={orderId}
          onCancel={this.onCancel}
          onUpdate={this.onUpdate}
          invoiceAdjustId={invoiceAdjustId}
          originalId={costOrderId}
          costOrderId={item}
          costOrderDetail={detail}
          examineDetail={examineDetail}
          examineOrderDetail={examineOrderDetail}
        />
      );
    });
  }

  // 渲染操作
  renderOperate = () => {
    return (
      <div
        className={style['app-comp-expense-invoiceAdjust-operate-wrap']}
      >
        <Button
          type="primary"
          onClick={this.onAdd}
        >
          添加下一个红冲单
        </Button>
        <Button
          type="primary"
          onClick={this.onSubmit}
          className={style['app-comp-expense-invoiceAdjust-operate-done']}
        >
          创建完成
        </Button>
      </div>
    );
  }

  // 渲染内容
  renderContent = () => {
    const {
      examineOrderDetail,
      examineDetail,
      costOrderDetail,
      originalCostOrder,
    } = this.props;

    // 数据不存在，不渲染
    if (
      Object.keys(examineDetail).length === 0
      || Object.keys(examineOrderDetail).length === 0
      || Object.keys(costOrderDetail).length === 0
      || Object.keys(originalCostOrder).length === 0
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

        {this.renderInvocieAdjust()}

        {/* 操作 */}
        {this.renderOperate()}
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
    originalCostOrder,
  },
}) {
  return {
    examineOrderDetail,
    examineDetail,
    costOrderDetail,
    originalCostOrder,
  };
}

export default connect(mapStateToProps)(Form.create()(InvoiceAdjustCostOrder));
