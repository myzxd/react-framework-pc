/**
 * 审批单 - 审核记录列表详情页面 /Expense/Manage/ExamineOrder/Detail
 */
import is from 'is_js';
import dot from 'dot-prop';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Col, Timeline, Popover } from 'antd';
import reject from '../../../static/reject.png';
import approve from '../../../static/approve.png';
import waiting from '../../../static/waiting.png';
import waitingPayment from '../../../static/waiting_payment.png';
import approvePayment from '../../../static/approve_payment.png';
import { authorize } from '../../../../../application';
import SupplementOpinion from '../detail/supplementOpinion';  // 补充意见弹窗
import {
  ExpenseExamineOrderVerifyState,
  SupplementOpinionState,
  ExpenseExamineOrderProcessState,
  OaApplicationFlowTemplateApproveMode,
  ExpenseExamineOrderPaymentState,
  ExpenseTicketState,
  OaApplicationOrderType,
  OaApplicationApprovalTransferReason,
} from '../../../../../application/define';
import { CommonModalCopyGive } from '../../../../../components/common';
import { CoreContent } from '../../../../../components/core';
import SupplementOpinionText from './supplementOpinionText';
import Operate from '../../../../../application/define/operate';
import ApproveModal from '../detail/approve';
import RejectModal from '../detail/reject';
import PaymentExceptionModal from '../detail/paymentException';
import AddTicketTag from '../detail/components/addTicketTag'; // 打验票标签
import CheckTicket from '../detail/components/checkTicket'; // 完成验票
import TicketAbnormal from '../detail/components/ticketAbnormal'; // 验票异常
import styles from './style.less';

class ExpenseProcessComponent extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array,
    orderId: PropTypes.string,
    applyAccountId: PropTypes.string,
    currentFlowNode: PropTypes.string,
    accountList: PropTypes.array,
    fileUrlList: PropTypes.array,
    dataSource: PropTypes.object,
  }

  static defaultProps = {
    data: [],
    orderId: '',
    applyAccountId: '',
    currentFlowNode: '',
    accountList: [],
    fileUrlList: [],
    dataSource: {},
  }

  constructor() {
    super();
    this.state = {
      isShowAllNode: false,  // 是否显示全部节点
      isShowMore: false,
    };
  }

  // 显示更多
  onShowMore = () => {
    const { isShowMore } = this.state;
    this.setState({ isShowMore: !isShowMore });
  }

  // 改变抄送信息
  onChangeCopyGiveValues = (values) => {
    if (this.props.onChangeCopyGiveValues) {
      this.props.onChangeCopyGiveValues(values);
    }
  }

  // 判断是否显示全部节点
  isShowAllNode = () => {
    const { isShowAllNode } = this.state;
    this.setState({
      isShowAllNode: !isShowAllNode,
    });
  };


  // 按要求显示用户名称
  reduceAccountList = (list) => {
    if (!list || (typeof (list) === 'object' && Array === list.constructor && list.length === 0)) return '无';
    return list.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染操作状态文本内容
  renderActionText = (item) => {
    const flowNodeInfo = dot.get(item, 'flowNodeInfo', {});
    const { isPaymentNode } = flowNodeInfo;
    const { paidState } = this.props;
    // 判断，如果是已关闭的状态，则返回 ‘已关闭’
    if (item.state === ExpenseExamineOrderVerifyState.close) {
      return '已关闭';
    }
    // 如果是提报节点，并且状态为通过，则返回 提报
    if (item.indexNum === 0 && item.state === ExpenseExamineOrderVerifyState.approve) {
      return '提报';
    }
    // 如果是提报节点，并且状态不是通过，则返回 待提报
    if (item.indexNum === 0 && item.state !== ExpenseExamineOrderVerifyState.approve) {
      return '待提报';
    }
    // 判断是否是付款节点，如果是待付款的状态,返回’待付款‘
    if (isPaymentNode && paidState === ExpenseExamineOrderPaymentState.waiting) {
      return '待付款';
    }
    // 判断是否是付款节点，如果是已付款的状态,返回’已付款‘
    if (isPaymentNode && paidState === ExpenseExamineOrderPaymentState.paid) {
      return '已付款';
    }
    // 判断，如果是已经审批的状态，则返回 ‘已审核’
    if (item.state === ExpenseExamineOrderVerifyState.approve) {
      return '已审核';
    }
    // 判断，如果是已经驳回的状态，则返回 ‘驳回至 第n节点（某某）’
    if (item.state === ExpenseExamineOrderVerifyState.reject && item.rejectToNodeId !== undefined && is.not.empty(item.rejectToRecordAccounts)) {
      const { rejectToNodeInfo, rejectToRecordAccounts } = item;
      const names = rejectToRecordAccounts.map(account => account.name).join(' , ');
      return `驳回至 ${rejectToNodeInfo.name} (${names})`;
    }
    // 判断，如果是已经驳回的状态，驳回到申请人
    if (item.state === ExpenseExamineOrderVerifyState.reject && item.rejectToNodeId === undefined) {
      return '驳回至申请人';
    }
    // 判断，如果是已撤回的状态,返回’已撤回‘
    if (item.state === ExpenseExamineOrderVerifyState.recall) {
      return '已撤回';
    }
    // 默认返回 待处理
    return '待处理';
  };

  // 渲染操作状态文本内容的字体颜色
  renderColor = (item) => {
    // 如果是提报节点，并且是关闭状态
    if (item.indexNum === 0 && item.state === ExpenseExamineOrderVerifyState.close) {
      return '#d00218';
    }
    // 如果是提报节点，则返回字体颜色 #595959
    if (item.indexNum === 0) {
      return '#595959';
    }

    // 判断，如果是已经审批的状态，则返回字体颜色 #29ab58
    if (item.state === ExpenseExamineOrderVerifyState.approve) {
      return '#29ab58';
    }

    // 判断，如果是已经驳回的状态，或者已关闭状态，或者已撤回状态，则返回字体颜色 #d00218
    if (item.state === ExpenseExamineOrderVerifyState.reject
        || item.state === ExpenseExamineOrderVerifyState.close
        || item.state === ExpenseExamineOrderVerifyState.recall
        ) {
      return '#d00218';
    }

    // 判断，如果为待处理的状态，则返回字体颜色 #F5A623
    return '#F5A623';
  };

  // 渲染时间轴图标
  renderIconByState = (groupNode) => {
    const { paidState } = this.props;
    // 如果数据中有 驳回 操作 则返回被驳回状态
    if (groupNode.find(item => (item.state === ExpenseExamineOrderVerifyState.reject || item.state === ExpenseExamineOrderVerifyState.recall) || item.state === ExpenseExamineOrderVerifyState.close)) {
      return <img src={reject} className={styles['app-comp-expense-process-state-img']} role="presentation" />;
    }

    // 判断是否是付款节点，付款状态是已付款
    if (groupNode.find(item => dot.get(item, 'flowNodeInfo', {}).isPaymentNode) && paidState === ExpenseExamineOrderPaymentState.paid) {
      return <img src={approvePayment} className={styles['app-comp-expense-process-state-img']} role="presentation" />;
    }
    // 判断是否是付款节点,付款状态是未付款
    if (groupNode.find(item => dot.get(item, 'flowNodeInfo', {}).isPaymentNode) && paidState === ExpenseExamineOrderPaymentState.waiting) {
      return <img src={waitingPayment} className={styles['app-comp-expense-process-state-img']} role="presentation" />;
    }
   // 如果数据中没有 驳回 操作，但有 待处理 操作，则返回 待处理状态
    if (groupNode.find(item => item.state === ExpenseExamineOrderVerifyState.pendding)) {
      return <img src={waiting} className={styles['app-comp-expense-process-state-img']} role="presentation" />;
    }

   // 如果数据中都是 通过 操作，则返回 通过状态
    return <img src={approve} className={styles['app-comp-expense-process-state-img']} role="presentation" />;
  };

  // 渲染节点名
  renderNodeName = (groupNode) => {
    // 判断当前节点下数组中数据的indexNum是否为0，如果是，则返回 提报节点；否则返回相对应的 节点名
    if (groupNode[0].indexNum === 0) {
      return '提报节点';
    }
    return groupNode[0].flowNodeInfo.name;
  };

  // 渲染操作人姓名
  renderActionName = (item) => {
    const accoutList = item.operateAccountList;

    // 判断当前节点的 operateAccountList 是否有多个人，如果是，则渲染操作人名；如果只有一个，则 return
    if (accoutList && accoutList.length > 1) {
      // 查找当前节点的操作节点对应的操作人，返回 渲染的对应的操作人姓名
      const data = accoutList.filter(nodeItem => nodeItem.id === item.accountInfo.id);
      if (is.empty(data)) {
        return '';
      }
      // 返回渲染操作人姓名文本
      return (<span>({data[0].name})</span>);
    }
    return '';
  };


  // 渲染操作
  renderOperates = (ext) => {
    const { isOpera = true, copyGiveValues, isSupportCc } = this.props;
    const { isHighLight, id: currentRecordId = undefined } = ext;
    const { dataSource: examineOrderDetail = {}, examineDetail = {} } = this.props;

    // 如果详情数据为空，则直接返回
    if (is.empty(examineOrderDetail) || is.not.existy(examineOrderDetail)) {
      return '';
    }

    // 判断当前节点可审核操作（通过/驳回）的人员列表
    const { currentPendingAccounts = [], inspectBillState } = examineOrderDetail;
    const isShowApprove = isHighLight && isOpera && currentPendingAccounts.indexOf(authorize.account.id) !== -1;

    // 拥有审核/驳回操作权限
    if (Operate.canOperateExpenseManageApprovalButton() === false) {
      return '';
    }

    // 审批单id
    const orderId = examineOrderDetail.id;

    // 审批记录id
    const {
      currentRecordIds = [],
      currentFlowNode = undefined, // 当前节点id
      currentRecordList = [], // 当前流转记录列表
      applicationOrderType,
    } = examineOrderDetail;

    // 当亲操作的流转记录id
    let orderRecordId = '';

    // 标记付款状态
    const paidState = dot.get(examineOrderDetail, 'paidState');

    // 审批流节点
    const nodeList = dot.get(examineDetail, 'nodeList', []);

    // 当前节点信息
    const currentNodeInfo = nodeList.filter(item => item.id === currentFlowNode)[0] || {};

    const {
      approveMode, // 审批规则
      isPaymentNode = false,
    } = currentNodeInfo;

    // 任一
    if (approveMode === OaApplicationFlowTemplateApproveMode.any && currentRecordIds.length === 1) {
      orderRecordId = currentRecordIds[0];
    }

    // 全部
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      currentRecordList.forEach((item = {}) => {
        const {
          operateAccounts = [],
        } = item;
        operateAccounts.forEach((account) => {
          if (account === authorize.account.id) {
            orderRecordId = item.id;
          }
        });
      });
    }

    // 流转记录数据列表
    const flowRecordList = dot.get(examineOrderDetail, 'flowRecordList', []);
    // 获取需要显示验票操作的流转记录
    const ticketNodeList = flowRecordList.filter(i => i.flowNodeInfo.isInspectBillNode) || [];
    const ticketRecordNode = ticketNodeList[0] || {};
    const { id: ticketRecordId = undefined } = ticketRecordNode;

    // 过滤出标记验票节点
    const ticketNode = nodeList.find(i => i.isInspectBillNode) || [];

    const { accountIds: ticketAccount = [], postList = [] } = ticketNode;

    // 岗位下成员
    const postAccountList = Array.isArray(postList) && postList.length > 0 ? postList.map(i => [...i.account_ids]) : [];

    // 当前节点下所有成员
    const accountList = [...ticketAccount, ...postAccountList.flat()];

    // 当前账户是否有标记验票权限
    const isShowTicket = ((applicationOrderType === OaApplicationOrderType.cost
      || applicationOrderType === OaApplicationOrderType.travel)
      && ticketRecordId === currentRecordId
      && accountList.find(i => i === authorize.account.id) !== undefined
    );
    // 默认显示补充意见、驳回、通过按钮
    const operations = [
      <SupplementOpinion
        key={'SupplementOpinion'}
        orderId={orderId}
        recordId={orderRecordId}
        isPaymentNode={isPaymentNode}
        dispatch={this.props.dispatch}
        onSuccessCallback={this.onSuccessCallback}
      />,
      <RejectModal
        key={'RejectModal'}
        orderId={orderId}
        copyGiveValues={copyGiveValues}
        orderRecordId={orderRecordId}
        currentFlowNode={currentFlowNode}
        flowRecordList={flowRecordList}
        nodeList={nodeList}
        dispatch={this.props.dispatch}
        examineDetail={examineDetail}
      />,
      <ApproveModal
        key={'ApproveModal'}
        orderId={orderId}
        copyGiveValues={copyGiveValues}
        orderRecordId={orderRecordId}
        examineOrderDetail={examineOrderDetail}
        currentFlowNode={currentFlowNode}
        isPaymentNode={isPaymentNode}
        dispatch={this.props.dispatch}
        examineDetail={examineDetail}
      />,
    ];
    // 标记付款节点 && 未付款状态下，显示标记付款操作
    if (is.truthy(isPaymentNode) && paidState === ExpenseExamineOrderPaymentState.waiting) {
      operations.splice(
        1, 0,
        <PaymentExceptionModal
          key={'PaymentExceptionModal'}
          orderId={orderId}
          orderRecordId={orderRecordId}
          dispatch={this.props.dispatch}
        />,
      );
    }

    const ticketProps = {
      orderId,
      orderRecordId: ticketRecordId,
      orderDetail: examineOrderDetail,
    };

    // 验票操作
    const ticketOptions = [
      <AddTicketTag {...ticketProps} />,
    ];

    // 验票状态不为已验票
    inspectBillState !== ExpenseTicketState.already && (
      ticketOptions[ticketOptions.length] = <CheckTicket {...ticketProps} />
    );

    // 验票状态为待验票
    inspectBillState === ExpenseTicketState.waiting && (
      ticketOptions[ticketOptions.length] = <TicketAbnormal {...ticketProps} />
    );
    // 判断是否显示
    if (!isShowApprove && !isShowTicket) {
      return <div />;
    }
    return (
      <Col className={styles['app-comp-expense-detail-operate-wrap']} span={8} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          {isShowApprove ? operations.map((item, index) => {
            return (
              <div key={index} className={styles['app-comp-expense-detail-operate-item']}>{item}</div>
            );
          }) : null}
        </div>
        {/* 抄送按钮 */}
        <div style={{ display: 'flex', margin: 5 }}>
          {isShowApprove && isSupportCc ?
            (
              <CommonModalCopyGive
                isProcess
                flowId={examineOrderDetail.flowId}
                orderId={orderId}
                value={copyGiveValues}
                onChange={this.onChangeCopyGiveValues}
              />
            ) : null}
        </div>

        <div style={{ display: 'flex', marginTop: 10 }}>
          {isShowTicket ? ticketOptions.map((item, index) => {
            return (
              <div key={index} className={styles['app-comp-expense-detail-operate-item']}>{item}</div>
            );
          }) : null}
        </div>
      </Col>
    );
  }


  // 渲染时间轴
  renderTimeLine = (groupDataSource) => {
    const { isShowAllNode } = this.state;
    // 默认显示全部分组数据
    let data = groupDataSource;

    // 判断不显示全部时，只显示前3个分组数据
    if (isShowAllNode === false) {
      data = groupDataSource.slice(0, 3);
    }

    // 判断是否存在 显示更多 按钮（数组长度是否大于3）
    const isShowMoreButton = groupDataSource.length > 3;
    return (
      <div style={{ marginTop: 10 }}>
        <Timeline>
          {/* 渲染总分组里，每个分组的数据 */}
          {
          data.map((groupNode, index) => {
            return this.renderTimeLineByGroup(groupNode, index);
          })
        }

          {/* 如果存在  显示更多 按钮 ,则显示此时间轴*/}
          { isShowMoreButton ? <Timeline.Item color="green"><span onClick={() => this.isShowAllNode()} className={styles['app-comp-expense-process-timeline-item']}>{isShowAllNode ? '收起 <<' : '查看更多 >>'}</span></Timeline.Item> : null }
        </Timeline>
      </div>
    );
  };

  // 渲染每个时间轴的点
  renderTimeLineByGroup = (groupNode, key) => {
    const { fileUrlList, orderId, flowId, isCopyGive, copyGiveValues, isSupportCc } = this.props;
    // 是否有审批操作
    const isOpera = dot.get(this.props, 'isOpera', true);

    // 获取当前时间轴图标
    const image = this.renderIconByState(groupNode);
    return (
      <Timeline.Item key={key} dot={image} >
        {/* 渲染节点名称 */}
        <Row className={styles['app-comp-expense-process-point-name-wrap']}>
          <Col className={styles['app-comp-expense-process-point-name']}>{this.renderNodeName(groupNode)}</Col>
        </Row>

        {/* 遍历每个分组，并渲染数据*/}
        {
          groupNode.map((item, index) => {
            // 定义补充意见数据数组
            let extraInfoList = [];
            let isCopyGiveText = false;
            // 是否渲染抄送姓名
            if (item.isHighLight !== true) {
              isCopyGiveText = true;
            }
            if (key === 0 && isCopyGive) {
              isCopyGiveText = false;
            }

            // 判断补充意见是否有值，如果有值，则过滤出正常的补充意见，剔除掉已删除的补充意见
            if (is.existy(item.extraInfoList) && is.not.empty(item.extraInfoList)) {
              extraInfoList = item.extraInfoList.filter(extraInfo => extraInfo.state === SupplementOpinionState.normal);
            }

            // 判断补充意见数组是否有值，如果有值则将数据倒序显示
            if (is.existy(extraInfoList) && is.not.empty(extraInfoList)) {
              extraInfoList.reverse();
            }
            const flexibleDepartmentList = dot.get(item, 'flexibleCcDepartmentInfoList', []); // 抄送部门
            const flexibleAccountList = dot.get(item, 'flexibleCcAccountInfoList', []); // 抄送用户
            const flexibleJobList = dot.get(item, 'flexibleCcDepartmentJobRelationInfoList', []).map(i => i.job_info); // 灵活抄送岗位
            const flexibleList = [...flexibleDepartmentList, ...flexibleAccountList, ...flexibleJobList]; // 抄送信息
            const fixedDepartmentList = dot.get(item, 'fixedCcDepartmentInfoList', []); // 固定抄送部门
            const fixedAccountList = dot.get(item, 'fixedCcAccountInfoList', []); // 固定抄送用户
            const fixedJobList = dot.get(item, 'fixedCcDepartmentJobRelationInfoList', []).map(i => i.job_info); // 固定抄送岗位
            const fixedList = [...fixedDepartmentList, ...fixedAccountList, ...fixedJobList]; // 固定抄送信息
            return (
              <Row span={24} type="flex" justify="start" align="middle" key={index} className={styles['app-comp-expense-process-point-item-wrap']}>

                {/* 渲染人名 */}
                <Col span={10} className={styles['app-comp-expense-process-point-item-people-name']}>

                  {/* 遍历每个节点的operateAccountList数组 渲染其中所有的操作人名及其对应的职位 */}
                  {
                    item.operateAccountList.map((nodeItem, nodeIndex) => {
                      const postList = item.operatePostList || [];
                      const name = nodeItem.name || '';
                      const postName = dot.get(postList[nodeIndex], 'post_name', '');
                      return (
                        <span key={nodeIndex} className={styles['app-comp-expense-process-point-item-node-wrap']}>
                          {
                            postName ?
                              <span>
                                <span className={styles['app-comp-expense-process-point-item-node-post-name']}>{postName}:</span>&nbsp;&nbsp;
                                <span className={styles['app-comp-expense-process-point-item-node-name']}>{name}</span>
                              </span>
                            :
                              <span>
                                <span className={styles['app-comp-expense-process-point-item-node-name']}>{name}</span>
                              </span>
                          }
                        </span>
                      );
                    })
                  }
                </Col>

                {/* 渲染时间 */}
                <Col span={3} className={styles['app-comp-expense-process-point-item-node-operate-at']}>{item.operatedAt ? moment(item.operatedAt).format('YYYY-MM-DD HH:mm:ss') : '--'}</Col>

                {/* 渲染状态 */}
                <Col span={2} className={styles['app-comp-expense-process-point-item-node-state']} style={{ color: this.renderColor(item) }}>

                  {/* 判断当前节点的操作人数是否大于1 ，如果大于1,则将相对应的操作与人名显示。*/}
                  { this.renderActionName(item) }
                  {/* 渲染操作状态 */}
                  <span>{this.renderActionText(item)}</span>

                </Col>
                {
                  (key === 0 && item.isSupplementIdea && item.isHighLight !== true && isOpera === true) ||
                    (key === 0 && isCopyGive && isSupportCc) ? (

                      <Col span={8} >
                        {/* 渲染补充意见按钮 */}
                        {
                          key === 0 && item.isSupplementIdea && item.isHighLight !== true && isOpera === true ?
                            <div style={{ marginTop: 10 }}>
                              <div className={styles['app-comp-expense-process-point-item-node-operate-wrap']}>
                                <SupplementOpinion
                                  key={'SupplementOpinion'}
                                  orderId={orderId}
                                  recordId={item.id}
                                  dispatch={this.props.dispatch}
                                />
                              </div>
                            </div> : ''
                        }
                        {
                          key === 0 && isCopyGive && isSupportCc ? (
                            <div style={{ marginTop: 10 }} className={styles['app-comp-expense-process-point-item-node-operate-wrap']}>
                              <CommonModalCopyGive
                                isProcess
                                flowId={flowId}
                                value={copyGiveValues}
                                onChange={this.onChangeCopyGiveValues}
                              />
                            </div>
                          ) : null
                        }
                      </Col>
                  ) : null
                }


                {/* 判断是否高亮显示 */}
                {this.renderOperates(item)}

                {/* 判断是否有意见文本显示 */}
                { item.note !== '' ? <Col span={15} className={styles['app-comp-expense-process-point-item-node-note']}><span>{`意见：${item.note}`}</span>{this.renderActionName(item)}</Col> : null}

                {/* 渲染抄送人姓名 */}
                {isCopyGiveText && is.existy(flexibleList) && is.not.empty(flexibleList) ? (
                  <Col
                    span={15}
                    className={styles['app-comp-expense-process-point-item-node-note']}
                  >
                    <span>抄送：{flexibleList.map(v => v.name).join(', ')}</span>
                  </Col>) : null}

                {/* 判断是否有固定抄送文本显示 */}
                { is.existy(fixedList) && is.not.empty(fixedList) ?
                  <Col span={15} className={styles['app-comp-expense-process-point-item-node-note']}>
                    <span>固定抄送：{fixedList.map(v => v.name).join(', ')}</span></Col>
                  : null}

                {/* 渲染补充意见 */}
                {
                  is.not.empty(extraInfoList) ?
                    <Col span={15} className={styles['app-comp-expense-process-point-item-node-addition-wrap']}>
                      <SupplementOpinionText orderId={orderId} dataSource={extraInfoList} fileUrlList={fileUrlList} />
                    </Col> : ''
                }

                {/* 显示转交信息（事务性的审批单） */}
                {
                  item.approvalTransferReason && item.transferAt && Array.isArray(item.historyApprovalAccountList) && item.historyApprovalAccountList.length > 0
                  ? <Col span={24} style={{ marginTop: 5 }}>
                    <div>
                      <Row align="middle" span={24} className={styles['app-comp-expense-process-point-item-node-name']}>
                        <Col span={10}>
                          {item.historyApprovalAccountList[0].name}
                        </Col>
                        <Col span={3} className={styles['app-comp-expense-process-point-item-node-operate-at']}>{item.transferAt ? moment(item.transferAt).format('YYYY-MM-DD HH:mm:ss') : '--'}</Col>
                        <Col span={3} className={styles['app-comp-expense-process-point-item-node-state']} style={{ color: '#008FE0' }}>{`已转交给${item.operateAccountList[0].name}`}</Col>
                      </Row>
                      <Col span={10} className={styles['app-comp-expense-process-point-item-node-note']}>{`转交原因：${OaApplicationApprovalTransferReason.description(item.approvalTransferReason)}`}</Col>
                    </div>
                  </Col>
                  : null
                }
              </Row>
            );
          })
        }
      </Timeline.Item>
    );
  };

  // 渲染审批流信息
  renderExamineFlow = (examineOrderDetail, examineDetail) => {
    // 审批流信息
    // const flowInfo = dot.get(record, 'flowInfo', {});
    // 如果数据不存在，则返回 --
    if (is.not.existy(examineDetail) || is.empty(examineDetail)) return null;

    const { isShowMore } = this.state;
    // 获取当前节点id
    const { currentFlowNode, applyAccountInfo, state } = examineOrderDetail;
    // 定义是否展示 显示更多 操作
    let isShowMoreOperation = false;

    // 判断如果当前节点不为提报节点,则展示 显示更多 操作
    if (is.existy(currentFlowNode) && is.not.empty(currentFlowNode)) {
      isShowMoreOperation = true;
    }

    // 初始数据
    const originalNodeList = dot.get(examineDetail, 'nodeList', []);

    // 获取当前审批流节点列表
    const nodeList = _.cloneDeep(originalNodeList.filter(n => (n.indexNum !== 0 && n.name !== '提报节点')));

    // 如果审批流节点中没有 提报节点，则添加 提报节点信息
    if (nodeList.find(node => node.name === '提报节点') === undefined) {
      nodeList.unshift({
        name: '提报节点',
        accountList: [{ name: applyAccountInfo.name }],
      });
    }
    // 判断，如果当前节点不是提报节点，则过滤出当前节点的Index
    // 定义当前节点index
    let currentNodeIndex;
    // 判断，如果当前节点存在 && 审批流节点列表存在，则定义定义当前节点index
    if (is.existy(currentFlowNode) && is.not.empty(currentFlowNode) && is.existy(nodeList) && is.not.empty(nodeList)) {
      currentNodeIndex = nodeList.findIndex(node => node.id === currentFlowNode);
    }
    // 定义需要展示的节点数据
    let nodeTimeLineList = nodeList;
    // 判断，当前节点index存在，并且不显示全部节点数据时，则截取审批流节点
    if (is.existy(currentNodeIndex) && is.not.empty(currentNodeIndex) && isShowMore === false) {
      nodeTimeLineList = nodeList.slice(0, currentNodeIndex + 1);
    }

    // 定义渲染的气泡显示框
    const title = (<Timeline onMouseEnter={this.onShowNormal} onMouseLeave={this.onShowNormal}>
      {
        // 遍历渲染节点列表数据
        nodeTimeLineList.map((item, index) => {
          // 定义高亮样式
          let style;
          let color;
          // 判断，如果审批单是进行中或待提交状态，并且是当前节点或者提报节点，则高亮显示；
          if ((state === ExpenseExamineOrderProcessState.processing || state === ExpenseExamineOrderProcessState.pendding) && item.id === currentFlowNode) {
            style = { color: '#FF7700' };
            color = '#FF7700';
          }

          // 根据下标判断出审批过得人设置成灰色
          if (currentNodeIndex + 1 <= index
            || state === ExpenseExamineOrderProcessState.finish
            || state === ExpenseExamineOrderProcessState.close
            || state === ExpenseExamineOrderProcessState.deleted) {
            style = { color: '#ccc' };
            color = '#ccc';
          }
          return (
            <Timeline.Item key={index} style={style} color={color}>
              {item.name}
              ({
                // 遍历渲染当前节点的审批岗位信息
                item.postList && item.postList.length > 0
                  ? `${item.postList.reduce((acc, cur, idx) => {
                    if (idx === 0) {
                      return `${cur.post_name}(${this.reduceAccountList(cur.account_info_list)})`;
                    }
                    return `${acc}, ${cur.post_name}(${this.reduceAccountList(cur.account_info_list)})`;
                  // eslint-disable-next-line comma-spacing
                  }, '')},`
                  : null
              }
              {
                // 遍历渲染当前节点的审批人列表信息
                Array.isArray(item.accountList) && item.accountList.length > 0
                  ? item.accountList.reduce((acc, cur, idx) => {
                    if (idx === 0) return cur.name;
                    return `${acc}, ${cur.name}`;
                  }, '')
                  : '无'
              })
            </Timeline.Item>);
        })
      }
      {/* 判断是否展示 显示更多 操作，如果当前节点为提报节点，则不展示 */}
      {
        isShowMoreOperation === true ?
          <Timeline.Item key={nodeTimeLineList.length} color="#ccc">
            <span
              className={styles['app-comp-expense-process-show-more-btn']}
              onClick={this.onShowMore}
            >
              {isShowMore === true ? '收起 <<' : '显示更多 >>'}
            </span>
          </Timeline.Item> : null
      }
    </Timeline>);
    return (
      <div>
        <span className={styles['app-comp-expense-process-examflow-wrap']}>{examineDetail.name}</span>
        <Popover content={title}>
          <InfoCircleOutlined className={styles['app-comp-expense-process-examflow-icon']} />
        </Popover>
      </div>
    );
  }

  render() {
    const {
      data = [],
      currentFlowNode,
      accountList = [], // 审批流可操作人列表id
      applyAccountId,
      dataSource: examineOrderDetail = {},
    } = this.props;
    // 如果数据为空则不渲染
    if (is.empty(data) || is.not.existy(data)) {
      return <div />;
    }
    // 总分组数据
    let groupDataSource = [];

    // 当前分组，节点索引
    let currentGroupNodeIndexNum;
    // 当前分组，节点数据
    let currentGroupNodes = [];
    const len = data.length;
    // 遍历数组,将数据按照操作节点进行分组
    data.forEach((itemParam, index) => {
      const item = itemParam;

      // 定义当前流转记录节点的审批人
      const operateAccounts = item.operateAccountList.map(account => account.id);

      // 判断是否可以补充意见
      if (accountList.indexOf(authorize.account.id) !== -1 || applyAccountId === authorize.account.id) {
        item.isSupplementIdea = true;
      } else {
        item.isSupplementIdea = false;
      }

      // 节点与操作节点一致，并且节点的操作人与当前用户一致。则设置当前数据为
      if (item.nodeId === currentFlowNode &&
        operateAccounts.indexOf(authorize.account.id) !== -1 &&
        item.state === ExpenseExamineOrderVerifyState.pendding &&
        item.indexNum !== 0) {
        // 高亮属性为true
        item.isHighLight = true;
      } else {
        item.isHighLight = false;
      }

      // 判断下数组的长度 抄送的情况下有可能会只有一条数据，其他情况不会
      if (len !== 1) {
        // 初始化分组节点，根据indexNum设置
        if (currentGroupNodeIndexNum === undefined) {
          currentGroupNodeIndexNum = item.indexNum;
        }

        // 如果是当前分组的节点 == 当前数据节点，则划分为一组
        if (currentGroupNodeIndexNum === item.indexNum) {
          currentGroupNodes.push(item);
          return;
        }

        // 如果当前分组的节点 != 当前节点数据，则添加当前分组 数据到 总分组数据中。
        groupDataSource.push(currentGroupNodes);
        // 设置下一个节点的索引
        currentGroupNodeIndexNum = item.indexNum;
      }

      // 重置当前分组的节点数据
      currentGroupNodes = [];
      // 添加当前数据到新的分组中
      currentGroupNodes.push(item);

      // 判断是否是最后一条数据，如果是最后一条数据，则直接将 最后的分组 添加到 总分组中
      if (index + 1 === data.length) {
        groupDataSource.push(currentGroupNodes);
      }
    });

    // 遍历数据，返回要操作的数据.并将高亮数据放在第一位
    groupDataSource = groupDataSource.map((group) => {
      // 判断是否可以显示并操作 补充意见 按钮,当前操作人属于当前审批流审批人,并且节点与操作节点一致

      // 定义非高亮数据数组
      const groupData = [];

      // 定义高亮数据数组
      const highLight = [];
      // 遍历数组
      group.forEach((item) => {
        // 判断高亮，分别放入相应的数组
        if (item.isHighLight === false) {
          groupData.push(item);
        } else {
          highLight.push(item);
        }
      });
      // 整合数组，返回新的数组
      return highLight.concat(groupData);
    });
    const { examineDetail, isTitleExt } = this.props;
    // 扩展信息：审批流节点信息
    let titleExt = this.renderExamineFlow(examineOrderDetail, examineDetail);
    // 判断是否显示节点记录
    if (isTitleExt) {
      titleExt = undefined;
    }
    return (
      <CoreContent title="审核记录详情" titleExt={titleExt}>
        {/* 渲染操作数据 */}
        {this.renderTimeLine(groupDataSource)}
      </CoreContent>
    );
  }
}

export default ExpenseProcessComponent;
