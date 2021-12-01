/**
 * 审批单详情页面 - 每个费用单组件 Expense/Manage/ExamineOrder/Detail
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ExpenseCostCenterType,
  InvoiceAjustAction,
  ExpenseCostOrderState,
} from '../../../../../application/define';

import Refund from './components/refund'; // 退款申请单
import RedBlunt from './components/redBlunt'; // 红冲申请单
import HistoryApprove from './components/historyApprove'; // 历史审批单详情

class CostOrderItem extends Component {
  static propTypes = {
    recordId: PropTypes.string,
    examineDetail: PropTypes.object,
    examineOrderDetail: PropTypes.object,
    namespaceCostOrderDetail: PropTypes.object,
    isExternal: PropTypes.bool,
  }

  static defaultProps = {
    recordId: '',
    examineDetail: {},
    examineOrderDetail: {},
    namespaceCostOrderDetail: {},
    isExternal: false,
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { recordId, isExternal } = this.props;

    // 外部审批单不调用接口
    if (isExternal) return;

    // 触发新的审批单接口详情
    this.props.dispatch({
      type: 'expenseCostOrder/fetchNamespaceCostOrderDetail',
      payload: {
        recordId,
        namespace: recordId,
        onSuccessCallback: res => this.fetchCostOrderAmountSummay(res),
      },
    });
  }

  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.person) return value.staffInfo.identity_card_id;
    if (costCenter === ExpenseCostCenterType.team) return value.teamId;
    if (costCenter === ExpenseCostCenterType.asset) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }

  // get amount summary
  fetchCostOrderAmountSummay = (res) => {
    // 外部审批单不调用接口
    const { isExternal = false } = this.props;
    if (isExternal) return;

    const {
      costAllocationList,       // 成本费用记录分摊清单
      costCenterType,           // 成本中心归属类型名称
      costAccountingId,         // 费用科目ID
      applicationOrderId,       // 归属审批单ID
    } = res;
    // 审批单第一次提报时间
    const { submitAt } = this.props.examineOrderDetail;
    // 根据成本费用记录分摊列表获取当月已付款费用合计
    costAllocationList.forEach((v) => {
      const {
        identity_card_id: staffId,
      } = v.staffInfo;
      // 已付款金额参数
      const payload = {
        costCenter: costCenterType,
        costTargetId: this.getCostTargetId(costCenterType, v),
        subjectId: costAccountingId,
        applicationOrderId,
        submitAt,
      };
      // 定义提报金额参数
      const params = {
        costCenter: costCenterType,
        applicationOrderId,               // 审批单id
        accountingId: costAccountingId,   // 科目id
        costTargetId: this.getCostTargetId(costCenterType, v),                     // 成本归属id
        platformCode: v.platformCode,           // 平台
        supplierId: v.supplierId,               // 供应商
        cityCode: v.cityCode,                   // 城市
        bizDistrictId: v.bizDistrictId,          // 商圈
        submitAt,
        teamId: v.teamId,
        staffId,
        assetsId: v.assetsId,     // 资产id
      };
      // 获取已付款金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });
      // 获取提报金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
    });
  }

  // 渲染退款申请单信息
  renderRefundInfo = () => {
    const { examineOrderDetail, examineDetail, originalCostOrder } = this.props;
    const { approvalKey } = this.props.location.query; // 获取当前key
    const data = dot.get(originalCostOrder, 'refCostOrderInfoList'); // 退款信息
    const approvalType = dot.get(originalCostOrder, 'costOrderExistsRefoundRedRush', undefined); // 审批单详情类型
    return (
      <div>
        {
          data.map((item, index) => {
            // 判断状态是否是删除,关闭来筛选数据
            if (item.type === InvoiceAjustAction.refund && item.state !== ExpenseCostOrderState.close && item.state !== ExpenseCostOrderState.delete && approvalType === InvoiceAjustAction.refund) {
              return (<Refund
                costOrderDetail={item}
                examineOrderDetail={examineOrderDetail}
                examineDetail={examineDetail}
                approvalKey={approvalKey}
                key={index}
              />);
            }
            return null;
          })
        }
      </div>
    );
  }

  // 渲染红冲申请单
  renderRedBluntInfo = () => {
    const { examineOrderDetail, examineDetail, costOrderAmountSummary, costOrderSubmitSummary, originalCostOrder } = this.props;
    const { approvalKey } = this.props.location.query; // 获取当前key
    const data = dot.get(originalCostOrder, 'refCostOrderInfoList', []); // 红冲信息
    const approvalType = dot.get(originalCostOrder, 'costOrderExistsRefoundRedRush', undefined); // 审批单详情类型

    // 过滤掉后端生成的费用单
    const dataSource = data.filter(item => item.total_money > 0);
    return (
      <div>
        {
          dataSource.map((item, index) => {
            // 判断状态是否是删除,关闭来筛选数据
            if (item.type === InvoiceAjustAction.invoiceAdjust && item.state !== ExpenseCostOrderState.close && item.state !== ExpenseCostOrderState.delete && approvalType === InvoiceAjustAction.invoiceAdjust) {
              return (<RedBlunt
                costOrderDetail={item}
                examineOrderDetail={examineOrderDetail}
                examineDetail={examineDetail}
                approvalKey={approvalKey}
                costOrderAmountSummary={costOrderAmountSummary}
                costOrderSubmitSummary={costOrderSubmitSummary}
                key={index}
              />);
            }
            return null;
          })
        }
      </div>);
  }

  // 渲染历史审批信息
  renderHistoryApprove = (historyApproval) => {
    const {
      examineOrderDetail,
      examineDetail,
      costOrderAmountSummary,
      costOrderSubmitSummary,
      originalCostOrder,
      isExternal,
    } = this.props;
    const { approvalKey, orderId } = this.props.location.query; // 获取当前key
    return (<HistoryApprove
      historyApproval={historyApproval}
      examineOrderDetail={examineOrderDetail}
      examineDetail={examineDetail}
      approvalKey={approvalKey}
      orderId={orderId}
      originalCostOrder={originalCostOrder}
      costOrderAmountSummary={costOrderAmountSummary}
      costOrderSubmitSummary={costOrderSubmitSummary}
      isExternal={isExternal}
    />);
  }

  render = () => {
    const {
      examineOrderDetail,
      recordId,
      namespaceCostOrderDetail,
      originalCostOrder,
    } = this.props;
    // 获取历史审批单详情数据
    const historyApproval = originalCostOrder;
    // 数据为空，返回null
    if (namespaceCostOrderDetail.length === 0) return <div />;

    // 费用单详情
    let costOrderDetail;
    // 判断是否是正常审批单传递的数据不同
    if (InvoiceAjustAction.normal === dot.get(examineOrderDetail, 'applicationSubType')) {
      costOrderDetail = namespaceCostOrderDetail[recordId];
    } else {
      costOrderDetail = historyApproval;
    }

    // 数据为空，返回null
    if (!costOrderDetail || Object.keys(costOrderDetail).length === 0) return <div />;

    // 判断申请类型是否是红冲还是退款申请单
    if (dot.get(examineOrderDetail, 'applicationSubType') === InvoiceAjustAction.refund) {
      return (
        <div key={recordId}>
          {/* 渲染历史审批单详情 */}
          {this.renderHistoryApprove(costOrderDetail)}
          {/* 渲染退款申请单信息 */}
          {this.renderRefundInfo()}
        </div>
      );
    } else if (dot.get(examineOrderDetail, 'applicationSubType') === InvoiceAjustAction.invoiceAdjust) {
      return (
        <div key={recordId}>
          {/* 渲染历史审批单详情 */}
          {this.renderHistoryApprove(costOrderDetail)}
          {/* 渲染红冲申请单 */}
          {this.renderRedBluntInfo()}
        </div>
      );
    }
    return (
      <div key={recordId}>
        {/* 渲染历史审批单详情 */}
        {this.renderHistoryApprove(costOrderDetail)}
      </div>
    );
  }

}

function mapStateToProps({
  expenseCostOrder: {
    costOrderAmountSummary, // 月汇总金额
    costOrderSubmitSummary, // 已提报金额
    namespaceCostOrderDetail, // 费用单详情
  },
}) {
  return {
    costOrderAmountSummary, // 月汇总金额
    costOrderSubmitSummary, // 已提报金额
    namespaceCostOrderDetail, // 费用单详情
  };
}
export default connect(mapStateToProps)(CostOrderItem);
