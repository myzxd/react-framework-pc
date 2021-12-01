/**
 * 费用管理 - 借还款管理 - 还款管理列表页 - 还款详情页
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Unit, OaApplicationOrderType } from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

import RepaymentsInfo from './info';
import ExpenseProcessComponent from '../../../manage/examineOrder/common/process';  // 流转记录时间轴

class Detail extends Component {
  static propTypes = {
    repaymentDetail: PropTypes.object, // 还款单详情
    flowRecordList: PropTypes.array, // 借款单所属审批单留住记录信息
  }

  static defaultProps = {
    repaymentDetail: {},
    flowRecordList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      orderId: dot.get(props, 'location.query.orderId', undefined),  // 审批单id
      repaymentOrderId: dot.get(props, 'location.query.repaymentOrderId', undefined),  // 借款id
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { repaymentOrderId, orderId } = this.state;
    // 还款单详情
    this.props.dispatch({
      type: 'borrowingRepayment/fetchRepaymentsDetails',
      payload: {
        id: repaymentOrderId,
      },
    });

    // 还款单所属审批单流转记录列表
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
    // 还款单详情
    const { repaymentDetail } = this.props;

    // 还款单所属审批单信息
    const { application_order_info: applicationOrderInfo = {} } = repaymentDetail;

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
  renderRepaymentsInfo = () => {
    const { repaymentDetail } = this.props;
    return <RepaymentsInfo repaymentDetail={repaymentDetail} />;
  }

  // 渲染审核记录详情
  renderAuditRecordsInfo = () => {
    const { orderId } = this.state;
    const { flowRecordList, repaymentDetail } = this.props;

    if (flowRecordList.length === 0) return null;

    // 还款单详情没有任何审批操作
    const isOpera = false;

    const {
      apply_account_id: applyAccountId, // 操作人
      operate_accounts_list: operateAccountsList, //
      file_url_list: fileUrlList, // 附件
      application_order_info: applicationOrderInfo,
    } = repaymentDetail;

    // 当前节点id
    const { current_flow_node: currentFlowNode } = applicationOrderInfo;

    return (
      <ExpenseProcessComponent
        isOpera={isOpera}
        applyAccountId={applyAccountId}
        orderId={orderId}
        data={flowRecordList}
        currentFlowNode={currentFlowNode}
        dispatch={this.props.dispatch}
        accountList={operateAccountsList}
        fileUrlList={fileUrlList}
      />
    );
  }

  render = () => {
    const { repaymentDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(repaymentDetail).length === 0) return <div />;

    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染还款单信息 */}
        {this.renderRepaymentsInfo()}

        {/* 渲染审核记录详情 */}
        {this.renderAuditRecordsInfo()}
      </div>
    );
  }
}

function mapStateToProps({
  borrowingRepayment: {
    repaymentDetail,
    flowRecordList,
  },
}) {
  return {
    repaymentDetail,
    flowRecordList,
  };
}

export default connect(mapStateToProps)(Detail);
