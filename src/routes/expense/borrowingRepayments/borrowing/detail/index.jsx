/**
 * 费用管理 - 借还款管理 - 借款管理列表页 - 借款详情页
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Unit, ExpenseExamineOrderPaymentState, OaApplicationOrderType } from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

import BorrowingInfo from './info';
import RepaymentsInfo from './repaymentsInfo';
import ExpenseProcessComponent from '../../../manage/examineOrder/common/process';  // 流转记录时间轴

class Detail extends Component {
  static propTypes = {
    borrowingDetail: PropTypes.object, // 借款单详情
    flowRecordList: PropTypes.array, // 借款单所属审批单留住记录信息
  }

  static defaultProps = {
    borrowingDetail: {},
    flowRecordList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      approvalId: dot.get(props, 'location.query.approvalId', undefined),  // 借款id
      orderId: dot.get(props, 'location.query.orderId', undefined), // 审批单id
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { approvalId, orderId } = this.state;
    this.props.dispatch({
      type: 'borrowingRepayment/fetchBorrowingDetails',
      payload: {
        id: approvalId,
      },
    });
    this.props.dispatch({
      type: 'borrowingRepayment/fetchExamineOrderFlowRecordList',
      payload: {
        id: orderId,
      },
    });
  }

  // 渲染基本信息
  // eslint-disable-next-line react/sort-comp
  renderBaseInfo = () => {
    // 借款单详情
    const { borrowingDetail } = this.props;

    // 审批单信息
    const { application_order_info: applicationOrderInfo = {} } = borrowingDetail;

    const formItems = [
      {
        label: '审批单号',
        form: dot.get(applicationOrderInfo, '_id', '--'),
      },
      {
        label: '申请人',
        form: dot.get(applicationOrderInfo, 'apply_account_info.name', '--'),
      }, {
        label: '总金额',
        form: Unit.exchangePriceCentToMathFormat(dot.get(applicationOrderInfo, 'total_money', 0)),
      }, {
        label: '审批类型',
        form: `${OaApplicationOrderType.description(dot.get(applicationOrderInfo, 'application_order_type'))}`,
      }, {
        label: '审批流程',
        form: dot.get(applicationOrderInfo, 'flow_info.name', '--'),
      }, {
        label: '标记付款状态',
        form: `${ExpenseExamineOrderPaymentState.description(dot.get(applicationOrderInfo, 'paid_state'))}`,
      }, {
        label: '付款异常说明',
        form: dot.get(applicationOrderInfo, 'paid_note', '--'),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <CoreContent>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染还款单信息
  renderBorrowingInfo = () => {
    const { borrowingDetail } = this.props;

    return (
      <BorrowingInfo
        borrowingDetail={borrowingDetail}
      />
    );
  }

  // 渲染还款信息
  renderRepaymentsInfo = () => {
    const { borrowingDetail } = this.props;

    return (
      <div>
        {
          [borrowingDetail].map((item, index) => {
            return <RepaymentsInfo key={index} id={item._id} />;
          })
        }
      </div>
    );
  }

  // 渲染审核记录详情
  renderAuditRecordsInfo = () => {
    const { approvalId } = this.state;
    const { borrowingDetail, flowRecordList } = this.props;

    // 数据为空，返回null
    if (flowRecordList.length === 0) return null;

    const {
      application_order_info: applicationOrderInfo,
      apply_account_info: applyAccountInfo,
    } = borrowingDetail;

    const {
      current_flow_node: currentFlowNode, // 当前节点id
      operate_accounts_list: operateAccountsList, // 当前可操作人列表
      file_url_list: fileUrlList,
    } = applicationOrderInfo;

    const {
      apply_account_id: applyAccountId,
    } = applyAccountInfo;

    // 借款单详情没有任何审批操作
    const isOpera = false;

    return (
      <ExpenseProcessComponent
        isOpera={isOpera}
        applyAccountId={applyAccountId}
        orderId={approvalId}
        data={flowRecordList}
        currentFlowNode={currentFlowNode}
        dispatch={this.props.dispatch}
        accountList={operateAccountsList}
        fileUrlList={fileUrlList}
      />
    );
  }

  render = () => {
    const { borrowingDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(borrowingDetail).length === 0) return <div />;
    return (
      <div>
        {/* 渲染基本信息 */}
        {/* flag ? this.renderBaseInfo() : '' */}

        {/* 渲染借款单信息 */}
        {this.renderBorrowingInfo()}

        {/* 渲染还款信息 */}
        {this.renderRepaymentsInfo()}

        {/* 渲染审核记录详情 */}
        {this.renderAuditRecordsInfo()}
      </div>
    );
  }
}

function mapStateToProps({
  borrowingRepayment: {
    borrowingDetail,
    flowRecordList,
  },
}) {
  return {
    borrowingDetail,
    flowRecordList,
  };
}

export default connect(mapStateToProps)(Detail);
