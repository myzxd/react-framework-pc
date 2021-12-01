/* eslint-disable no-param-reassign */
/**
 * code - 审批单详情 - 流转记录
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Timeline,
  Row,
  Col,
  Empty,
  Tooltip,
} from 'antd';
import {
  ExpenseExamineOrderVerifyState,
  ExpenseExamineOrderProcessState,
} from '../../../../../application/define';
import SupplementOpinionText from './supplementOpinionText';
import RecordOperation from './recordOperation';
import PayOperation from '../operation/payOption';
import FlowPreview from './flowPreview';
import { utils } from '../../../../../application';

import reject from '../../../../expense/static/reject.png';
import approve from '../../../../expense/static/approve.png';
import waiting from '../../../../expense/static/waiting.png';

import Operate from '../../../../../application/define/operate';

import style from '../style.less';

import {
  CoreContent,
} from '../../../../../components/core';

const Circulation = ({
  dispatch,
  approveOrderDetail = {}, // 审批单详情
  flowRecordList = {}, // 流转记录列表
}) => {
  // 系统审批操作权限
  const isSystemAuth = Operate.canOperateModuleCodeOrderDetail();

  const {
    state: orderState, // 审批单状态
    _id: orderId, // 审批单id
    handle_list: handleList = [], // 可操作字段列表
  } = approveOrderDetail;

  const [isShowMore, setIsShowMore] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });
    }

    return () => {
      dispatch({
        type: 'codeOrder/resetOrderFolwRecoedList',
      });
    };
  }, [dispatch, orderId]);

  const { data = [] } = flowRecordList;

  // 无数据
  if (!Array.isArray(data) || data.length < 1) {
    return (
      <CoreContent title="审核记录详情">
        <Empty />
      </CoreContent>
    );
  }

  // 处理流转记录
  const dealWithData = (dataSource) => {
    const res = [];
    dataSource.reduce((acc, item) => {
      if (!acc[item.flow_node_id]) {
        acc = {};
        acc[item.flow_node_id] = [item];
        res[res.length] = acc[item.flow_node_id];
      } else {
        const len = acc[item.flow_node_id].length;
        acc[item.flow_node_id][len] = item;
      }

      return acc;
    }, {});

    return res;
  };

  // 付款功能props
  const payOpProps = {
    dispatch,
    approveOrderDetail,
  };

  // 操作状态文本color
  const renderColor = (rec = {}) => {
    const {
      flow_node_id: flowNodeId = undefined,
      state,
    } = rec;
    // 如果是提报节点，并且是关闭状态
    if (!flowNodeId &&
      state === ExpenseExamineOrderVerifyState.close) {
      return '#d00218';
    }
    // 如果是提报节点，则返回字体颜色 #595959
    if (!flowNodeId) {
      return '#595959';
    }

    // 判断，如果是已经审批的状态，则返回字体颜色 #29ab58
    if (state === ExpenseExamineOrderVerifyState.approve) {
      return '#29ab58';
    }

    // 判断，如果是已经驳回的状态，或者已关闭状态，或者已撤回状态，则返回字体颜色 #d00218
    if (state === ExpenseExamineOrderVerifyState.reject
        || state === ExpenseExamineOrderVerifyState.close
        || state === ExpenseExamineOrderVerifyState.recall
        ) {
      return '#d00218';
    }

    // 判断，如果为待处理的状态，则返回字体颜色 #F5A623
    return '#F5A623';
  };

  // timeline icon
  const renderIcon = (node = []) => {
    // 节点流程状态list
    const processStatus = node.map(n => n.state);
    // const isPaymentNode = node.find(n => n.isPaymentNode);
    let iconSrc = approve;

    // 驳回，撤回，关闭状态
    if (processStatus.includes(ExpenseExamineOrderVerifyState.reject)
      || processStatus.includes(ExpenseExamineOrderVerifyState.recall)
      || processStatus.includes(ExpenseExamineOrderVerifyState.close)
    ) {
      iconSrc = reject;
    }

    // 付款节点 && 已付款
    // if (isPaymentNode && paidState === ExpenseExamineOrderPaymentState.paid) {
      // iconSrc = approvePayment;
    // }

    // 付款节点 && 未付款
    // if (isPaymentNode && paidState === ExpenseExamineOrderPaymentState.paid) {
      // iconSrc = waitingPayment;
    // }

    // 待处理
    if (processStatus.includes(ExpenseExamineOrderVerifyState.pendding)) {
      iconSrc = waiting;
    }

    return (
      <img
        src={iconSrc}
        className={style['code-order-circulation-node-icon']}
        role="presentation"
      />
    );
  };

  // 操作人name
  const renderOperateAccount = (rec = {}) => {
    const {
      account_info: accountInfo = {},
    } = rec;

    if (!accountInfo || Object.keys(accountInfo).length < 1) {
      return '';
    }

    // 当前操作人
    return dot.get(accountInfo, 'name', '');
  };

  // 渲染操作状态文本内容
  const renderActionText = (rec = {}) => {
    // const isPaymentNode = true;
    const {
      state,
      flow_node_id: flowNodeId = undefined,
      reject_to_node_id: rejectToNodeId, // 上一审批驳回的节点id
      reject_to_node_info: rejectToNodeInfo = {}, // 上一审批驳回的节点信息
    } = rec;
    // 判断，如果是已关闭的状态，则返回 ‘已关闭’
    if (state === ExpenseExamineOrderVerifyState.close) {
      return '已关闭';
    }
    // 如果是提报节点，并且状态为通过，则返回 提报
    if (!flowNodeId && state === ExpenseExamineOrderVerifyState.approve) {
      return '提报';
    }
    // 如果是提报节点，并且状态不是通过，则返回 待提报
    if (!flowNodeId && state !== ExpenseExamineOrderVerifyState.approve) {
      return '待提报';
    }
    // 判断是否是付款节点，如果是待付款的状态,返回’待付款‘
    // if (isPaymentNode && paidState === ExpenseExamineOrderPaymentState.waiting) {
      // return '待付款';
    // }
    // 判断是否是付款节点，如果是已付款的状态,返回’已付款‘
    // if (isPaymentNode && paidState === ExpenseExamineOrderPaymentState.paid) {
      // return '已付款';
    // }
    // 判断，如果是已经审批的状态，则返回 ‘已审核’
    if (state === ExpenseExamineOrderVerifyState.approve) {
      return '已审核';
    }
    // 判断，如果是已经驳回的状态，则返回 ‘驳回至 第n节点（某某）’
    if (state === ExpenseExamineOrderVerifyState.reject
      && rejectToNodeId
      && dot.get(rejectToNodeInfo, 'name')) {
      return `驳回至 ${dot.get(rejectToNodeInfo, 'name')}`;
    }
    // 判断，如果是已经驳回的状态，驳回到申请人
    if (state === ExpenseExamineOrderVerifyState.reject &&
      !rejectToNodeId) {
      return '驳回至申请人';
    }
    // 判断，如果是已撤回的状态,返回’已撤回‘
    if (state === ExpenseExamineOrderVerifyState.recall) {
      return '已撤回';
    }
    // 默认返回 待处理
    return '待处理';
  };

  // 抄送信息
  const renderCCInfo = (rec = {}) => {
    // 固定抄送成员
    const fixedAccountName = utils.dotOptimal(rec, 'fixed_account_list', []).map(a => a.name);
    // 固定抄送岗位
    const fixedDepartmentJobName = utils.dotOptimal(rec, 'fixed_department_job_list', []).map(a => utils.dotOptimal(a, 'job_info.name'));
    // 固定抄送部门
    const fixedDepartmentName = utils.dotOptimal(rec, 'fixed_department_list', []).map(a => a.name);
    // 灵活抄送成员
    const flexibleAccountName = utils.dotOptimal(rec, 'flexible_account_list', []).map(a => a.name);
    // 灵活抄送岗位
    const flexibleDepartmentJobName = utils.dotOptimal(rec, 'flexible_department_job_list', []).map(a => utils.dotOptimal(a, 'job_info.name'));
    // 灵活抄送部门
    const flexibleDepartmentName = utils.dotOptimal(rec, 'flexible_department_list', []).map(a => a.name);

    // 固定抄送name
    const fixedName = [...fixedAccountName, ...fixedDepartmentJobName, ...fixedDepartmentName];
    // 灵活抄送name
    const flexibleName = [...flexibleAccountName, ...flexibleDepartmentJobName, ...flexibleDepartmentName];

    return (
      <React.Fragment>
        {
          fixedName.length > 0
              ? (<Col span={24}>
                固定抄送：
                {
                  fixedName.map(i => i).join(' 、 ')
                }
              </Col>)
              : ''
        }
        {
          flexibleName.length > 0
            ? (<Col span={24}>
              灵活抄送：
              {
                flexibleName.map(i => i).join(' 、 ')
              }
            </Col>)
            : ''
        }
      </React.Fragment>
    );
  };

  // 补充意见
  const renderExtraInfo = (orderFlowExtraList = []) => {
    if (Array.isArray(orderFlowExtraList) && orderFlowExtraList.length > 0) {
      return (
        <Col
          span={24}
          className={style['code-circulation-extra-wrap']}
        >
          <SupplementOpinionText
            orderId={approveOrderDetail._id}
            dataSource={orderFlowExtraList}
          />
        </Col>
      );
    }
    return '';
  };

  // 操作人name
  const renderApplyName = (rec) => {
    const {
      state,
      account_info: accountInfo = {},
      enable_account_list: enableAccountList = [],
    } = rec;

    // 待处理
    if (state === ExpenseExamineOrderVerifyState.pendding) {
      let applyName = '';
      Array.isArray(enableAccountList) && enableAccountList.length > 3 && (
        applyName = (
          <Tooltip title={enableAccountList.map(i => i.name).join('、')}>
            <span>{enableAccountList.slice(0, 3).map(i => i.name).join('、')}...</span>
          </Tooltip>
        )
      );

      Array.isArray(enableAccountList) && enableAccountList.length <= 3 && (
        applyName = enableAccountList.map(i => i.name).join('、')
      );
      return applyName;
    }

    return dot.get(accountInfo, 'name');
  };

  // 流转记录信息
  const renderRecInfo = (rec = {}) => {
    const {
      done_at: operateAt, // 操作时间
      note, // 意见
      order_flow_extra_list: orderFlowExtraList = [], // 补充意见
    } = rec;

    return (
      <Row>
        {/* 当前审批人name */}
        <Col
          span={12}
          className={style['code-order-circulation-rec-approve-name']}
        >
          {renderApplyName(rec)}
        </Col>
        {/* 操作时间 */}
        <Col
          span={6}
          className={style['code-circulation-rec-info']}
        >
          {
            operateAt ?
              moment(operateAt).format('YYYY-MM-DD HH:mm:ss')
            : '--'
          }
        </Col>
        {/* 操作状态 */}
        <Col
          span={6}
          className={style['code-circulation-rec-info']}
          style={{ color: renderColor(rec) }}
        >
          {renderOperateAccount(rec)}
          &nbsp;
          {renderActionText(rec)}
        </Col>

        {/* 抄送 */}
        {renderCCInfo(rec)}

        {/* 意见 */}
        {
          note ?
            (
              <Col span={24}>
                <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {`意见：${note}`}
                </div>
              </Col>
            ) : ''
        }

        {/* 补充意见 */}
        {
          renderExtraInfo(orderFlowExtraList)
        }
      </Row>
    );
  };

  // 时间轴（按记录）
  const renderRecTimeLine = (rec = {}) => {
    return (
      <Row span={24} key={rec._id}>
        <Col span={15}>{renderRecInfo(rec)}</Col>
        {
          isSystemAuth && (
            <Col span={8}>
              <RecordOperation
                dispatch={dispatch}
                approveOrderDetail={approveOrderDetail}
                recordDetail={rec}
              />
            </Col>
          )
        }
      </Row>
    );
  };

  // 时间轴（按记录）
  const renderNodeTimeLine = (node = [], key) => {
    const timelineImage = renderIcon(node);
    return (
      <Timeline.Item key={key} dot={timelineImage}>
        <Row className={style['code-order-circulation-node-name']}>
          <Col>{dot.get(node, '0.flow_node_info.name', '提报节点')}</Col>
        </Row>
        {
          node.map(rec => renderRecTimeLine(rec))
        }
      </Timeline.Item>
    );
  };

  // 时间轴（按节点）
  const renderContent = (rec = []) => {
    // 默认只展示三组节点
    let applyData = rec.slice(0, 3);
    // 显示所有节点
    if (isShowMore) applyData = rec;

    // 是否渲染付款组件（包含付款任意字段）
    const isShowPayOp = handleList.includes('no_pay')
      || handleList.includes('no_need_pay')
      || handleList.includes('pay');

    // 操作
    const operation = (
      <Timeline.Item color="green">
        <span
          onClick={() => setIsShowMore(!isShowMore)}
          className={style['code-order-circulation-node-operate']}
        >
          {isShowMore ? '收起 <<' : '查看更多 >>'}
        </span>
      </Timeline.Item>
    );

    return (
      <Timeline>
        {isSystemAuth && isShowPayOp && (<PayOperation {...payOpProps} />)}

        {
          applyData.map((node, key) => renderNodeTimeLine(node, key))
        }
        {rec.length > 3 && operation}
      </Timeline>
    );
  };

  // 审批流预览信息（审批单进行中, 黛提报）
  const flowPreviewInfo = (
    orderState === ExpenseExamineOrderProcessState.pendding
    || orderState === ExpenseExamineOrderProcessState.processing) ? (
      <FlowPreview approveOrderDetail={approveOrderDetail} />
  ) : '';

  return (
    <div>
      <CoreContent title="审核记录详情" titleExt={flowPreviewInfo}>
        {renderContent(dealWithData(data))}
      </CoreContent>
    </div>
  );
};

const mapStateToProps = ({
  codeOrder: { flowRecordList },
}) => {
  return { flowRecordList };
};

export default connect(mapStateToProps)(Circulation);
