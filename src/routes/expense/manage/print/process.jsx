/**
 * 审批单打印模板审批列表 Expense/Manage/Print/Process
 */
import React, { Component } from 'react';
import is from 'is_js';
import moment from 'moment';

import {
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { ExpenseExamineOrderVerifyState, SupplementOpinionState } from '../../../../application/define';
import { authorize } from '../../../../application';

class ExpenseProcessComponent extends Component {

  // 渲染时间轴的图标
  renderIconByState = (groupNode) => {
    // 如果数据中有 驳回 操作 则返回被驳回状态
    if (groupNode.find(item => (item.state === ExpenseExamineOrderVerifyState.reject || item.state === ExpenseExamineOrderVerifyState.recall) || item.state === ExpenseExamineOrderVerifyState.close)) {
      return <CloseCircleOutlined style={{ color: 'rgb(243,27,40)', fontSize: '18px' }} />;
    }

    // 如果数据中没有 驳回 操作，但有 待处理 操作，则返回 待处理状态
    if (groupNode.find(item => item.state === ExpenseExamineOrderVerifyState.pendding)) {
      return <ClockCircleFilled style={{ color: 'rgb(240,149,27)', fontSize: '18px' }} />;
    }
      // 如果数据中都是 通过 操作，则返回 通过状态
    return <CheckCircleOutlined style={{ color: 'rgb(164,204,178)', fontSize: '18px' }} />;
  };
  // 渲染节点名字
  renderNodeName = (groupNode) => {
    // 判断当前节点下数组中数据的indexNum是否为0，如果是，则返回 提报节点；否则返回相对应的 节点名
    if (groupNode[0].index_num === 0) {
      return '提报节点';
    }
    return groupNode[0].flow_node_info.name;
  };
  // 渲染每个分组
  renderGroup = (groupNode) => {
    return groupNode.map((item, itemIndex) => {
      let extraInfoList = [];

      // 判断补充意见是否有值，如果有值，则过滤出正常的补充意见，剔除掉已删除的补充意见
      if (is.existy(item.extra_info_list) && is.not.empty(item.extra_info_list)) {
        extraInfoList = item.extra_info_list.filter(extraInfo => extraInfo.state === SupplementOpinionState.normal);
      }

      // 判断补充意见数组是否有值，如果有值则将数据倒序显示
      if (is.existy(extraInfoList) && is.not.empty(extraInfoList)) {
        extraInfoList.reverse();
      }
      return (
        <div key={itemIndex} style={{ borderLeft: '1px solid rgb(204,204,204)', margin: '-2px 0 0 8px' }}>
          <div style={{ overflow: 'hidden', padding: '6px 10px' }}>
            <div style={{ width: '60%', float: 'left' }}>
              <div style={{ float: 'left', width: '66%' }}>
                {
                  item.operate_account_list.map((nodeItem, nodeIndex) => {
                    return (
                      <span key={nodeIndex} style={{ display: 'inline-block', marginRight: '20px' }}>
                        <span style={{ color: '#323232', fontSize: '14px' }}>{nodeItem.name ? nodeItem.name : ''}</span>&nbsp;&nbsp;
                      </span>
                    );
                  })
                }
              </div>
              <div style={{ float: 'right', width: '34%' }}>
                {item.operated_at ? moment(item.operated_at).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </div>
            </div>
            <div style={{ width: '40%', float: 'left', textAlign: 'left', paddingLeft: '20px', boxSizing: 'border-box', color: this.renderColor(item) }}>
              {/* 判断当前节点的操作人数是否大于1 ，如果大于1,则将相对应的操作与人名显示。*/}
              { this.renderActionName(item) }
              {/* 渲染操作状态 */}
              {this.renderActionText(item)}
            </div>
          </div>
          {
            item.note !== null ? <span style={{ marginLeft: '10px' }}>{`意见：${item.note}`}</span> : ''
          }
          {
            is.not.empty(extraInfoList) ? this.renderNote(extraInfoList) : ''
          }
        </div>
      );
    });
  };
  // 渲染补充意见
  renderNote = (data) => {
    return (
      <div style={{ backgroundColor: 'rgb(240,240,240)', width: '68%', marginLeft: '10px' }}>
        <div>补充意见</div>
        {data.map((dataItem, dataIndex) => {
          return (
            <div key={dataIndex} style={{ overflow: 'hidden', padding: '0 10px' }}>
              <div style={{ height: '24px', lineHeight: '24px' }}>
                <div style={{ float: 'left' }}>{dataItem.creator_info.name}</div>
                <div style={{ float: 'right' }}>{moment(dataItem.created_at).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
              <div style={{ textIndent: '1.5em' }}>{dataItem.content}</div>
              <div style={{ overflow: 'hidden' }}>
                {
                  dataItem.file_list && dataItem.file_list.length > 0 ?
                    (<div>
                      <div style={{ float: 'left' }}>附件：</div>
                      <div style={{ float: 'left' }}>
                        {dataItem.file_list.map((fileItem, index) => {
                          return <span key={index} style={{ marginRight: '4px' }}>{fileItem}</span>;
                        })}
                      </div>
                    </div>)
                    : ''
                }

              </div>
              {
                dataItem.creator_id === authorize.account.id
                  ? <DeleteOutlined style={{ fontSize: '14px', color: 'rgb(233,97,105)', float: 'right' }} /> : ''
              }
            </div>
          );
        })}

      </div>
    );
  }
  // 渲染操作状态文本
  renderActionText = (item) => {
    // 判断，如果是已关闭的状态，则返回 ‘已关闭’
    if (item.state === ExpenseExamineOrderVerifyState.close) {
      return '已关闭';
    }
    // 如果是提报节点，并且状态为通过，则返回 提报
    if (item.index_num === 0 && item.state === ExpenseExamineOrderVerifyState.approve) {
      return '提报';
    }
    // 如果是提报节点，并且状态不是通过，则返回 待提报
    if (item.index_num === 0 && item.state !== ExpenseExamineOrderVerifyState.approve) {
      return '待提报';
    }
    // 判断，如果是已经审批的状态，则返回 ‘已审核’
    if (item.state === ExpenseExamineOrderVerifyState.approve) {
      return '已审核';
    }
    // 判断，如果是已经驳回的状态，则返回 ‘驳回至 第n节点（某某）’
    if (item.state === ExpenseExamineOrderVerifyState.reject && item.reject_to_node_id !== null && is.not.empty(item.reject_to_record_accounts)) {
      const { reject_to_node_info: rejectToNodeInfo,
        reject_to_record_accounts: rejectToRecordAccounts } = item;
      const names = rejectToRecordAccounts.map(account => account.name).join(' , ');
      return `驳回至 ${rejectToNodeInfo.name} (${names})`;
    }
    // 判断，如果是已经驳回的状态，驳回到申请人
    if (item.state === ExpenseExamineOrderVerifyState.reject && item.reject_to_node_id === null) {
      return '驳回至申请人';
    }
    // 判断，如果是已撤回的状态,返回’已撤回‘
    if (item.state === ExpenseExamineOrderVerifyState.recall) {
      return '已撤回';
    }
    // 默认返回 待处理
    return '待处理';
  };
  // 渲染操作人姓名
  renderActionName = (item) => {
    const accoutList = item.operate_account_list;
    // 判断当前节点的 operateAccountList 是否有多个人，如果是，则渲染操作人名；如果只有一个，则 return
    if (accoutList && accoutList.length > 1) {
      // 查找当前节点的操作节点对应的操作人，返回 渲染的对应的操作人姓名
      const data = accoutList.filter(nodeItem => item.account_info && nodeItem._id === item.account_info._id);
      if (is.empty(data)) {
        return '';
      }
      // 返回渲染操作人姓名文本
      return (<span>({data[0].name})</span>);
    }
    return '';
  };
  // 渲染操作状态文本内容的字体颜色
  renderColor = (item) => {
    // 如果是提报节点，并且是关闭状态
    if (item.index_num === 0 && item.state === ExpenseExamineOrderVerifyState.close) {
      return '#d00218';
    }
    // 如果是提报节点，则返回字体颜色 #595959
    if (item.index_num === 0) {
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
  render() {
    const { data, currentFlowNode, accountList = [], applyAccountId } = this.props;
    // 根据总数据 切割节点数组
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

    // 遍历数组,将数据按照操作节点进行分组
    data.forEach((itemParam, index) => {
      const item = itemParam;

      // 定义当前流转记录节点的审批人
      const operateAccounts = item.operate_account_list.map(account => account.id);

      // 判断是否可以补充意见
      if (accountList.indexOf(authorize.account.id) !== -1 || applyAccountId === authorize.account.id) {
        item.isSupplementIdea = true;
      } else {
        item.isSupplementIdea = false;
      }

      // 节点与操作节点一致，并且节点的操作人与当前用户一致。则设置当前数据为
      if (item.nodeId === currentFlowNode && operateAccounts.indexOf(authorize.account.id) !== -1 && item.state === ExpenseExamineOrderVerifyState.pendding && item.indexNum !== 0) {
        // 高亮属性为true
        item.isHighLight = true;
      } else {
        item.isHighLight = false;
      }

      // 初始化分组节点，根据indexNum设置
      if (currentGroupNodeIndexNum === undefined) {
        currentGroupNodeIndexNum = item.index_num;
      }

      // 如果是当前分组的节点 == 当前数据节点，则划分为一组
      if (currentGroupNodeIndexNum === item.index_num) {
        currentGroupNodes.push(item);
        return;
      }

      // 如果当前分组的节点 != 当前节点数据，则添加当前分组 数据到 总分组数据中。
      groupDataSource.push(currentGroupNodes);

      // 设置下一个节点的索引
      currentGroupNodeIndexNum = item.index_num;
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
    return (
      <div
        style={{
          padding: '0 16px',
          boxSizing: 'border-box',
          backgroundColor: 'rgb(247,247,247)',
          margin: '20px 0 0 0',
          overflow: 'hidden',
        }}
      >
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0px', top: '7px', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)' }} />
            <span style={{ position: 'absolute', left: '12px', top: '4px' }}>审核记录详情</span>
          </div>
          {
            groupDataSource.map((groupNode, index) => {
              return (
                <div key={index}>
                  <div style={{ height: '28px', lineHeight: '28px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: '0px', bottom: '-4px' }}>
                      {this.renderIconByState(groupNode)}
                    </div>
                    <div style={{ width: '100%', borderBottom: '1px solid rgb(204,204,204)', position: 'absolute', left: '26px', bottom: '4px', lineHeight: '20px' }}>
                      {this.renderNodeName(groupNode)}
                    </div>
                  </div>
                  {this.renderGroup(groupNode)}
                </div>
              );
            })
          }
          {
            groupDataSource.length > 3 ?
              (
                <div style={{ height: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '6px', left: '2px' }}>
                    <div style={{ width: '8px', height: '8px', border: '2px solid rgb(120,195,27)', borderRadius: '50%' }} />
                  </div>
                  <div style={{ position: 'absolute', left: '20px', top: '2px', color: 'rgb(236,186,59)' }}>收起 &gt;&gt;</div>
                </div>
              )
              : ''
          }
        </div>
      </div>);
  }
}
export default ExpenseProcessComponent;
