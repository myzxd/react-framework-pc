/* eslint-disable no-param-reassign */
/**
 * 记录明细
 */
import dot from 'dot-prop';
import moment from 'moment';
import React from 'react';

import {
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleOutlined,
} from '@ant-design/icons';

import {
  ExpenseExamineOrderVerifyState,
} from '../../../application/define';

const Process = ({
  orderRecordList = [],
}) => {
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

  // icon
  const renderIcon = (node) => {
    // 节点流程状态list
    const processStatus = node.map(n => n.state);
    let iconSrc = <CheckCircleOutlined style={{ color: 'rgb(164,204,178)', fontSize: '18px' }} />;

    // 驳回，撤回，关闭状态
    if (processStatus.includes(ExpenseExamineOrderVerifyState.reject)
      || processStatus.includes(ExpenseExamineOrderVerifyState.recall)
      || processStatus.includes(ExpenseExamineOrderVerifyState.close)
    ) {
      iconSrc = <CloseCircleOutlined style={{ color: 'rgb(243,27,40)', fontSize: '18px' }} />;
    }

    // 待处理
    if (processStatus.includes(ExpenseExamineOrderVerifyState.pendding)) {
      iconSrc = <ClockCircleFilled style={{ color: 'rgb(240,149,27)', fontSize: '18px' }} />;
    }

    return (
      <div>
        {iconSrc}
      </div>
    );
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
      Array.isArray(enableAccountList) && (applyName = (
        <span>{enableAccountList.slice(0, 3).map(i => i.name).join('、')}</span>
      ));
      return applyName;
    }

    return dot.get(accountInfo, 'name');
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

  // 补充意见
  const renderSupplementOpinionText = (data) => {
    if (!data || !Array.isArray(data) || data.length < 1) return '';
    return (
      <div
        style={{
          marginLeft: 12,
          marginTop: 10,
        }}
      >
        <div
          style={{
            height: 20,
            lineHeight: '20px',
            color: '#333',
          }}
        >补充意见</div>
        {
          data.map((opinion, opinionKey) => {
            return (
              <div
                key={opinionKey}
                style={{
                  borderBottom: '1px solid #e2e2e2',
                  padding: '20px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: '#323232',
                    }}
                  >{dot.get(opinion, 'creator_info.name')}</span>
                  <span
                    style={{
                      marginRight: 10,
                    }}
                  >
                    {
                      opinion.created_at ?
                        moment(opinion.created_at).format('YYYY-MM-DD HH:mm:ss') : ''
                    }
                  </span>
                </div>
                <p
                  style={{
                    marginLeft: 5,
                    color: '#000',
                    opacity: '0.6',
                    fontSize: 12,
                    whiteSpace: 'pre-wrap',
                  }}
                >{opinion.content}</p>
                {
                  dot.get(opinion, 'asset_list', []).length > 0 ?
                    (
                      <div
                        style={{ display: 'flex' }}
                      >
                        <span>附件</span>
                        <div>
                          {
                              dot.get(opinion, 'asset_list', []).map((fileUrl, fileKey) => {
                                return <p key={fileKey}>{fileUrl.file_name}</p>;
                              })
                          }
                        </div>
                      </div>
                    ) : ''
                }
              </div>
            );
          })
        }
      </div>
    );
  };

  // 节点信息
  const renderNodeInfo = (node, nodeKey) => {
    const {
      done_at: operateAt, // 操作时间
      note, // 意见
      order_flow_extra_list: orderFlowExtraList = [], // 补充意见
      flow_node_id: flowNodeId,
    } = node;

    return (
      <div
        style={{
          borderLeft: flowNodeId ? '1px solid #e4e4e4' : '',
          marginLeft: 9,
          paddingLeft: 16,
          width: '100%',
          paddingBottom: 16,
          minHeight: 40,
        }}
        key={nodeKey}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '35%',
              color: '#323232',
              fontSize: 14,
              lineHeight: '40px',
            }}
          >{renderApplyName(node)}</div>
          <div
            style={{
              width: '30%',
              lineHeight: '40px',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {
              operateAt ?
                moment(operateAt).format('YYYY-MM-DD HH:mm:ss')
              : '--'
            }
          </div>
          <div
            style={{
              width: '35%',
              fontSize: 12,
              color: renderColor(node),
              lineHeight: '40px',
              textAlign: 'center',
            }}
          >
            {renderOperateAccount(node)}
            &nbsp;
            {renderActionText(node)}
          </div>
        </div>
        <div>
          {
            note ?
              (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    width: '100%',
                    fontSize: 12,
                    color: '#bababa',
                  }}
                >
                  {`意见：${note}`}
                </div>
              ) : ''
          }
        </div>
        {renderSupplementOpinionText(orderFlowExtraList)}
      </div>
    );
  };

  // 流转记录节点信息
  const renderRecordNode = (rec, key) => {
    return (
      <div key={key}>
        <div
          style={{
            height: 28,
            lineHeight: '28px',
            display: 'flex',
          }}
        >
          {renderIcon(rec)}
          <div
            style={{
              borderBottom: '1px solid #e4e4e4',
              lineHeight: '20px',
              color: '#bababa',
              fontSize: 12,
              height: 20,
              width: '100%',
              marginLeft: 12,
            }}
          >{dot.get(rec, '0.flow_node_info.name', '提报节点')}</div>
        </div>
        {
          rec.map((node, nodeKey) => renderNodeInfo(node, nodeKey))
        }
      </div>
    );
  };

  if (!orderRecordList
    || !Array.isArray(orderRecordList)
    || orderRecordList.length < 1) return '';

  return (
    <div>
      <p
        style={{
          borderBottom: '1px solid rgb(204,204,204)',
          paddingBottom: 10,
          fontWeight: 500,
          fontSize: 14,
          margin: '10px 5px 0 0',
        }}
      >
        审核记录详情
      </p>
      {
        dealWithData(orderRecordList).map((record, key) => {
          return renderRecordNode(record, key);
        })
      }
    </div>
  );
};

export default Process;
