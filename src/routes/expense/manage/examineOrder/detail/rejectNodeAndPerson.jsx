/**
 * 付款审批 - 驳回操作 - 自定义Form组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select } from 'antd';

import {
  OaApplicationFlowTemplateApproveMode,
 } from '../../../../../application/define';
import styles from './style.less';

const { Option } = Select;

class RejectNodeAndPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountIdsData: props.accountIdsData || [],             // 驳回的审批人或岗位列表
      isDisablePerson: false,         // 审批人或岗位选择框是否显示
      isShowPost: false,              // 审批岗位下的审批人选择框是否显示
      isPersonMultiple: '',        // 审批人或岗位选择框是否多选
      isShowPerson: false,            // 是否显示审批人或审批岗位的选择框
      isDisablePostPerson: false,     // 审批岗位下的审批人选择框是否可选
      isPostMultiple: '',             // 审批岗位下的审批人选择框是否可多选
      postPersonList: [],             // 审批岗位下的审批人列表
    };
  }

  // 修改节点
  onChangeNode = (nodeId) => {
    const {
      onChangeState,
      onChange,
      examineDetail,
      flowRecordList,
    } = this.props;
    // 定义需要onChange的值
    let personId;
    let postId;
    let postPersonIds;
    let personShowId;
    // 修改选中值
    let {
      isDisablePerson,
      isShowPost,
      isShowPerson,
      isPersonMultiple,
      accountIdsData,
      isDisablePostPerson,
      isPostMultiple,
      postPersonList,
    } = this.state;

    // 得到审批流的节点信息列表
    const nodeList = dot.get(examineDetail, 'nodeList', []);

    // 根据所选择的节点id，获取当前节点的信息列表
    const nodeInfo = is.not.empty(nodeList) ? nodeList.filter(item => item.id === nodeId) : [];
    // 所选节点的审批规则
    const approveMode = dot.get(nodeInfo[0], 'approveMode');

    // 获取选择的节点下课审批人列表及审批岗位列表
    const { accountList = [], postList = [] } = nodeInfo[0] ? nodeInfo[0] : {};

    // 将审批人列表与审批岗位列表拼成一个数组
    accountIdsData = accountList.concat(postList);

    // 审批规则全部时，获取所有审批人id
    const accountIdList = accountIdsData.map(item => item.id || item._id);
    // 如果是提报节点，则更新提报人数据
    if (Number(nodeId) === 0 && approveMode === undefined) {
      const accountInfo = dot.get(flowRecordList[flowRecordList.length - 1], 'accountInfo');
      accountIdsData = [accountInfo];
      isDisablePerson = true;
      isShowPost = false;
      isShowPerson = true;
      isPersonMultiple = '';
      personShowId = dot.get(accountInfo, 'id');
      personId = dot.get(accountInfo, 'id');
      postId = undefined;
    }

    // 如果是其他节点 && 审批岗位没有数据 && 所选节点审批规则是全部
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.all
      && is.empty(postList)
    ) {
      isDisablePerson = true;
      isPersonMultiple = 'multiple';
      isShowPost = false;
      isShowPerson = true;
      personShowId = accountIdList;
      personId = accountIdList;
      postId = undefined;
    }

    // 如果是其他节点 && 审批岗位有数据 && 所选节点审批规则是全部
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.all
      && is.not.empty(postList)
    ) {
      isShowPost = true;
      isShowPerson = false;
      isDisablePostPerson = true;
      isPostMultiple = 'multiple';
      postPersonIds = accountIdList;
      postPersonList = accountIdsData;
      personShowId = undefined;
      personId = accountIdList;
      postId = undefined;
    }

    // 如果是其他节点 && 所选节点审批规则是任一 && 审批岗位数据为空
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && is.empty(postList)
    ) {
      const accountInfo = flowRecordList.find(item => item.nodeId === nodeId).accountInfo;
      isDisablePerson = accountIdsData.length === 1;
      personId = dot.get(accountInfo, 'id');
      personShowId = dot.get(accountInfo, 'id');
      isShowPost = false;
      isShowPerson = true;
      isPersonMultiple = '';
      postId = undefined;
    }

    // 如果是其他节点 && 所选节点审批规则是任一 && 审批岗位数据有值
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && is.not.empty(postList)
    ) {
      isDisablePerson = false;
      isDisablePostPerson = false;
      isShowPerson = true;
      isShowPost = false;
      isPersonMultiple = '';
      isPostMultiple = '';
      postId = undefined;
      personId = undefined;
    }

    // 非提报节点 && 任一 && 只有一个审批人 && 没有岗位
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && accountList.length === 1
      && postList.length === 0
    ) {
      isDisablePerson = true;
      personId = accountList[0].id;
    }

    // 非提报节点 && 任一 && 只有一个审批岗位 && 岗位下多人 && 没有审批人
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && accountList.length === 0
      && postList.length === 1
      && postList[0].account_ids.length > 1
    ) {
      isDisablePerson = true;
      personShowId = postList[0]._id;
      isShowPost = true;
      postPersonList = postList[0].account_info_list;
      postId = postList[0]._id;
    }

    // 非提报节点 && 任一 && 只有一个审批岗位 && 岗位下只有一人 && 没有审批人
    if (Number(nodeId) !== 0
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && accountList.length === 0
      && postList.length === 1
      && postList[0].account_ids.length === 1
    ) {
      isDisablePerson = true;
      isDisablePostPerson = true;
      personShowId = postList[0]._id;
      postPersonIds = postList[0].account_ids[0];
      isShowPost = true;
      postPersonList = postList[0].account_info_list;
      postId = postList[0]._id;
      personId = postList[0].account_ids[0];
    }

    this.setState({
      accountIdsData,
      isDisablePerson,
      isPersonMultiple,
      isShowPost,
      isShowPerson,
      isDisablePostPerson,
      isPostMultiple,
      postPersonList,
    });

    // 调用onChange,更新value
    if (onChange) {
      onChange({ nodeId, personId, postId, personShowId, postPersonIds });
    }

    // 更新状态，判断使用默认数据或者新数据
    const isVerifyPost = !!isShowPost;
    if (onChangeState) {
      onChangeState(isVerifyPost);
    }
  }

  // 修改审批人
  onChangePerson = (personId, options) => {
    // 修改选中值
    const { onChange, onChangeState } = this.props;
    const { nodeId } = this.props.value;

    // 定义审批岗位id
    let isShowPost = false;
    // 定义岗位id
    let postId;
    let accountId = personId;

    // 获取审批岗位下的信息
    const {
      post_name: postName,
      account_info_list: postPersonList = [],
    } = options.props.info;

    // 如果审批岗位存在，则更新要提交的审批岗位id及审批人id``
    if (postName) {
      isShowPost = true;
      postId = personId;
      accountId = postPersonList.length === 1 ? postPersonList[0]._id : undefined;
    }

    this.setState({
      isShowPerson: true,
      isShowPost,
      postPersonList,
      isDisablePostPerson: postPersonList.length === 1,
    });

    // 调用onChange,更新value
    if (onChange) {
      onChange({
        nodeId,
        personId: accountId,
        postId,
        personShowId: personId,
        postPersonIds: postPersonList.length === 1 ? postPersonList[0]._id : undefined,
      });
    }

    const isVerifyPost = !!isShowPost;
    // 更新状态，判断使用默认数据或者新数据
    if (onChangeState) {
      onChangeState(isVerifyPost);
    }
  }

  // 修改审批岗位下的审批人
  onChangePostPerson = (val) => {
    const { onChange } = this.props;
    const { nodeId, postId, personShowId } = this.props.value;

    if (onChange) {
      onChange({
        nodeId,
        postId,
        personShowId,
        postPersonIds: val,
        personId: val,
      });
    }
  }

  render() {
    const { value, isDefault, nodes } = this.props;

    const {
      isShowPost,
      isShowPerson,
      isDisabledNode,
      isDisablePerson,
      isDisablePostPerson,
      isPersonMultiple,
      isPostMultiple,
      accountIdsData,
      postPersonList,
    } = isDefault ? this.props : this.state;

    // 节点
    const nodeId = dot.get(value, 'nodeId', undefined);
    // 审批人
    const { postPersonIds, personShowId } = value;

    return (
      <div>
        <Select
          placeholder="请输入驳回节点"
          className={styles['app-comp-expense-reject-node-node-selector']}
          onChange={this.onChangeNode}
          value={nodeId}
          disabled={isDisabledNode}
        >
          {
            nodes.map((item, index) => {
              // 提报节点
              if (index === 0) {
                return (<Option key={index} value={item.id}>{item.name}</Option>);
              }
              return (<Option key={index} value={item.id}>{item.name}</Option>);
            })
          }
        </Select>
        {
          isShowPerson ?
            <Select
              className={styles['app-comp-expense-reject-node-person-or-post']}
              onChange={this.onChangePerson}
              placeholder="请指派审批人或审批岗位"
              value={personShowId}
              disabled={isDisablePerson}
              mode={isPersonMultiple}
            >
              {
                accountIdsData.map((post) => {
                  const val = post.id || post._id;
                  const name = post.name || post.post_name;
                  return (<Option key={val} value={val} info={post}>{name}</Option>);
                })
              }
            </Select>
            : null
        }
        {
          isShowPost ?
            <Select
              value={postPersonIds}
              placeholder="请指派审批人"
              onChange={this.onChangePostPerson}
              className={styles['app-comp-expense-reject-node-person']}
              disabled={isDisablePostPerson}
              mode={isPostMultiple}
            >
              {
                postPersonList.map((post) => {
                  let name = post.name;
                  if (!post.name) {
                    // 获取审批岗位下对应的审批人列表
                    const infoList = post.account_info_list || [];
                    const account = infoList.map(item => item.name);
                    name = `${post.post_name}(${account})`;
                  }
                  return (<Option key={post._id || post.id} value={post._id || post.id}>{name}</Option>);
                })
              }
            </Select>
            : null
        }
      </div>
    );
  }
  }

export default RejectNodeAndPerson;
