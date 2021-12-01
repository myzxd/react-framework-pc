/**
 * 付款审批 - 通过操作 - 自定义Form组件
 */
import _ from 'lodash';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select } from 'antd';
import styles from './style.less';

const { Option } = Select;

class ApprovePersonOrPost extends Component {
  static propTypes = {
    value: PropTypes.object,
  }

  static defaultProps = {
    value: {},
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { value: prevData = {} } = prevProps;
    const { value: oriData = undefined } = oriState;

    if (oriData === undefined && Object.keys(prevData).length > 0) {
      const { personShowId, postPersonId, postId, personId } = prevData;
      return {
        value: prevData,
        personShowId,
        postPersonId,
        postId,
        personId,
      };
    }

    return null;
  }

  constructor() {
    super();
    this.state = {
      value: undefined,
      isShowPost: false,        // 是否显示审批岗位下的审批人选择框
      personShowId: undefined,  // 用于页面显示的审批人或审批岗位选择框的值
      postPersonId: undefined,  // 用于页面显示的审批岗位下的审批人选择框的值
      postId: undefined,        // 用于提交的审批岗位的值
      personId: undefined,      // 用于提交的审批人的值
      accountList: [],          // 被选中的审批岗位下的审批人列表
    };
  }

  // 改变审批人或岗位
  onChangePersonOrPost = (val, options = {}) => {
    const { onChange, onChangePerson, postPersonList } = this.props;

    // 定义需要提交的审批人与审批岗位id
    let personId = val;
    let postId;
    let accountList = [];
    // 获取定义的属性，是否是审批岗位
    const { postmark = undefined } = options;
    const isShowPost = !!postmark;

    // 如果选择的是审批岗位，更新提交的审批人与审批岗位
    if (isShowPost) {
      postId = val;
      // 根据所选择的审批岗位，过滤其下的审批人
      const postList = postPersonList.filter(post => post._id === val);
      accountList = dot.get(postList[0], 'account_info_list', []);
      personId = accountList.length === 1 ? accountList[0]._id : undefined;
    }

    this.setState({
      personId,
      postId,
      personShowId: val,
      isShowPost,
      accountList,
    });

    onChange({
      personId,          // 用于提交的审批人或岗位id
      postId,            // 用于提交的岗位id
      postPersonId: accountList.length === 1 ? accountList[0]._id : undefined,      // 用于显示的审批岗位下的审批人id
      personShowId: val,      // 用于显示的审批人id
    });

    // 所选岗位下只有一个人，则禁用审批岗位下的审批人选择框
    const isDisabledPerson = accountList.length === 1 ? true : false;

    const isVerifyPost = !!isShowPost;
    if (onChangePerson) {
      onChangePerson(isVerifyPost, isDisabledPerson);
    }
  }

  // 修改审批岗位下的审批人
  onChangePerson = (val) => {
    const { onChange } = this.props;
    const { postId, personShowId } = this.state;

    this.setState({
      personId: val,
      postPersonId: val,
    });

    if (onChange) {
      onChange({
        personId: val,
        postId,
        postPersonId: val,
        personShowId,
      });
    }
  }

  // 渲染表单
  renderForm = () => {
    // 选择框数据
    const {
      accountIdsData,
      value,
      isDisabledPost,
      isDisabledPerson,
      postList = [],
      personList = [],
    } = this.props;

    // 审批人数据
    let { accountList } = this.state;

    const { postPersonId, personShowId } = value;

    // 是否显示审批岗位下的审批人选择框
    let { isShowPost } = this.state;

    // 只有一个岗位 && 岗位下有多人
    if (postList.length === 1 && personList.length === 0 && postList[0].account_ids !== 1) {
      accountList = dot.get(accountIdsData[0], 'account_info_list', []);
      isShowPost = true;
    }

    // 只有一个岗位 && 该岗位下只有一个审批人
    if (postList.length === 1 && personList.length === 0 && postList[0].account_ids === 1) {
      accountList = dot.get(accountIdsData[0], 'account_info_list', []);
      isShowPost = true;
    }

    // 审批人员数据去重
    const uniqAccountList = _.uniqWith(accountList, _.isEqual);

    return (
      <div>
        <Select
          placeholder="请选择审批人或审批岗位"
          value={personShowId}
          className={isShowPost === true ? styles['app-comp-expense-approve-person-post-selector'] : styles['app-comp-expense-approve-person-selector']}
          disabled={isDisabledPost}
          onChange={this.onChangePersonOrPost}
        >
          {
            accountIdsData.map((node) => {
              const val = node.id || node._id;
              const name = node.name || node.post_name;
              const postmark = node.post_name;
              return (<Option key={val} value={val} postmark={postmark}>{name}</Option>);
            })
          }
        </Select>
        {
          isShowPost === true ?
            <Select
              placeholder="请选择审批人"
              value={postPersonId}
              className={styles['app-comp-expense-approve-person-post-person-selector']}
              disabled={isDisabledPerson}
              onChange={this.onChangePerson}
            >
              {
                uniqAccountList.map((node) => {
                  return (<Option key={node._id} value={node._id}>{node.name}</Option>);
                })
              }
            </Select>

          : null
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染表单 */}
        {this.renderForm()}
      </div>
    );
  }
}

export default ApprovePersonOrPost;

