/**
 * 退款/红冲 - 提交审批单按钮
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Button, message, Modal } from 'antd';

import {
  DeprecatedCoreForm,
} from '../../../../components/core';

// TODO: 当前为组件，组件不应该引用上级的页面，互相应用的情况下，会导致混乱。（颗粒度关系页面>组件）
// TODO: 需要将引用的页面修改为组件，并且优化内部逻辑，当前引用组件之前的判断逻辑过于复杂，234～330行。 @王晋
import ApprovePersonOrPost from '../examineOrder/detail/approvePersonOrPost';

import {
  OaApplicationFlowAssigned,
  OaApplicationFlowTemplateApproveMode,
} from '../../../../application/define';

import style from './style.css';

class Operate extends Component {
  static propTypes = {
    orderId: PropTypes.string,            // 审批单id
    examineDetail: PropTypes.object,      // 审批单详情
    examineOrderDetail: PropTypes.object, // 审批单详情
    action: PropTypes.number,             // 审批单action
    onSuccessCallback: PropTypes.func,    // 提交成功的回调
  }

  static defaultProps = {
    orderId: '',
    examineDetail: {},
    examineOrderDetail: {},
    action: 1,
    onSuccessCallback: () => {},
  }

  constructor() {
    super();
    this.state = {
      visible: false, // 弹窗是否可见
      isDefault: true, // 是否使用默认值
      isVerifyPost: false, // 是否校验审批岗位下的审批人
      isDisabledPerson: false, // 是否禁用审批岗位下的审批人选择框
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 隐藏弹窗
  onHideModal = () => {
    this.setState({
      visible: false,
      isVerifyPost: false,
      isDefault: true,
    });
  }

  // 修改审批人或审批岗位
  onChangePerson = (isVerifyPost, isDisabledPerson) => {
    this.setState({
      isVerifyPost, // 是否校验审批岗位下的审批人
      isDefault: false, // 提交用组件是否是初次默认值
      isDisabledPerson, // 是否禁用提交用组件的审批岗位下的审批人选择框
    });
  }

  // 提交成功后的回调函数
  onSubmitSuccessCallback = () => {
    const {
      onSuccessCallback,
    } = this.props;

    onSuccessCallback && onSuccessCallback();
  }

  // 提交失败的回调
  onSubmitFailureCallback = (res) => {
    // 重置提交状态（失败可以重新提交）
    this.private.isSubmit = true;
    return message.error(res.zh_message);
  }

  // 自定义Form校验
  onVerify = (rule, value, callback) => {
    // 审批单详情
    const {
      examineOrderDetail,
    } = this.props;

    // 是否校验审批岗位下的审批人
    let {
      isVerifyPost,
    } = this.state;

    // 节点列表
    const nodeList = dot.get(examineOrderDetail, 'flowInfo.nodeList', []);

    // 获取下一节点的审批人列表
    const examinePerson = dot.get(nodeList[0], 'accountList', []);

    // 获取下一节点的审批岗位列表
    const postList = dot.get(nodeList[0], 'postList', []);

    // 只有一个岗位时，重置岗位的校验
    if (postList.length === 1 && examinePerson.length === 0) {
      isVerifyPost = true;
    }

    // 判断：如果下一节点审批规则是全部 || (审批规则为任一 && 自动指派 && 选择至审批人),则不用校验
    if (rule.isApprovalAll === true || (rule.isApprovalAll === false && rule.isAutoMatic && isVerifyPost === false)) {
      callback();
      return;
    }
    // 判断：如果下一节点审批规则为任一 && 选择至审批岗位（审批岗位下的审批人必选），则全部校验
    if (rule.isApprovalAll === false && isVerifyPost === true && value.postId && value.personId) {
      callback();
      return;
    }
    // 判断：如果下一节点审批规则为任一 && 指派规则为手动 && 指派人选择至审批人
    if (rule.isApprovalAll === false && rule.isAutoMatic === false && isVerifyPost === false && value.personId) {
      callback();
      return;
    }

    // 如果校验不通过，则提示错误文本
    callback('请选择指派审批人或审批岗位');
  }

  // 点击提交,判断是否显示弹窗
  onPresent = () => {
    const {
      examineDetail,
    } = this.props;

    // 获取第一个节点信息
    let approveMode; // 审批规则

    const {
      nodeList = [], // 节点信息
    } = examineDetail;

    if (nodeList && nodeList.length > 0) {
      approveMode = nodeList[0].approveMode;
    }

    // 如果审批规则为全部，则不显示弹窗,否则显示弹窗
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      this.onSubmit();
    } else {
      this.setState({ visible: true });
    }
  }

  // 提交服务器
  onSubmit = () => {
    const {
      form,
      orderId,
      dispatch,
      action,
    } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        action,
        id: orderId,  // 审批单id
        onSuccessCallback: this.onSubmitSuccessCallback,  // 提交成功回调
        onFailureCallback: this.onSubmitFailureCallback,        // 提交失败的回调
      };

      const {
        assignedPerson = {}, // 自定义表单
      } = values;

      const {
        postId, // 岗位id
        personId, // 审批人id
      } = assignedPerson;

      // 判断，如果存在指派人，则传入参数
      if (personId) {
        params.person = personId;
      }

      // 指派审批岗位
      if (postId) {
        params.postIds = postId;
      }

      // 防止多次提交
      if (this.private.isSubmit) {
        dispatch({
          type: 'expenseExamineOrder/submitExamineOrder',
          payload: params,
        });
        this.private.isSubmit = false;
      }
    });
  }

  // TODO: 逻辑拆分的事例 @王晋
  // 获取指定顺序的审批节点
  fetchNodeByIndex = (index) => {
    // TODO: 应修改为state中获取
    const { examineDetail } = this.state;
    // 判断参数
    if (is.number(index) !== true) {
      return {};
    }
    return dot.get(examineDetail, `nodeList.${index}`, {});
  }

  // TODO: 逻辑拆分的事例 @王晋
  // 逻辑判断
  isAutoMatic = () => {
    // 提报节点中第一个节点的审批人
    const node = this.fetchNodeByIndex(0);

    // 判断数据是否存在
    if (dot.has(node, 'pickMode') !== true) {
      return false;
    }
    // 定义提交表但是的校验规则-指派规则
    if (dot.get(node, 'pickMode') === OaApplicationFlowAssigned.automatic) {
      return true;
    }
    return false;
  }

  // 渲染弹窗内容
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;

    const {
      visible, // 弹窗是否显示
      // examineOrderDetail, // 审批单详情
      isDefault, // 提交用组件是否是初次默认值
    } = this.state;
    // TODO: 不要直接使用props
    const { examineDetail } = this.props;

    // 如果不显示弹窗，return
    if (!visible || Object.keys(examineDetail).length === 0) {
      return;
    }

    // TODO: 判断逻辑过于复杂，可以拆分为独立的 isXXXX() 函数，函数内独立判断，不需要每个判断都创建中间变量。 @王晋
    // TODO: 事例 isAutoMatic() fetchNodeByIndex()
    // 获取下一节点的审批规则
    let approveMode;
    // 获取下一节点的指派方式
    let pickMode;
    // 获取下一节点审批人，用于指派审批人
    let nextNodeAccountList = [];
    // 获取下一节点审批岗位列表
    let nextNodePostList = [];
    // 获取下一节点详情
    let nextNodeInfo = {};
    // 获取当前审批单所属审批流的节点列表
    const nodeList = dot.get(examineDetail, 'nodeList');
    // 获取提报节点之后的第一个节点的审批人
    if (is.existy(nodeList) && is.array(nodeList) && is.not.empty(nodeList)) {
      nextNodeInfo = nodeList[0] || {};
      nextNodeAccountList = dot.get(nodeList[0], 'accountList', []);
      nextNodePostList = dot.get(nodeList[0], 'postList', []);
      pickMode = dot.get(nodeList[0], 'pickMode');
      approveMode = nodeList[0].approveMode;
    }
    const rules = {
      message: '请选择审批人或审批岗位',
      isApprovalAll: false,
      isAutoMatic: false,
      required: false,
    };

    // TODO：此部分逻辑的拆分事例见 isAutoMatic函数，节点的拆分事例见fetchNodeByIndex函数
    // 定义提交表单时的校验规则-审批规则
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      rules.isApprovalAll = true;
    }
    // 定义提交表但是的校验规则-指派规则
    if (pickMode === OaApplicationFlowAssigned.automatic) {
      rules.isAutoMatic = true;
    }

    // 是否必选
    if (!rules.isApprovalAll && !rules.isAutoMatic) {
      rules.required = true;
    }

    // 合并审批人与审批岗位
    const accountIdsData = nextNodeAccountList.concat(nextNodePostList);

    let postId; // 提交用岗位id
    let personId; // 提交用审批人id
    let postPersonId; // 显示用审批岗位/审批人id
    let personShowId; // 显示用审批岗位下的审批人id
    let isDisabledPost = false; // 是否禁用自定义组件的审批岗位/审批人选择框
    let isDisabledPerson = false; // 是否禁用审批岗位下的审批人选择框

    // TODO: 函数中多次判断node节点和数组，可以使用dot.has, 或者更好的调整逻辑，优先判断数组。 @王晋
    // TODO: 组件的逻辑，是否考虑应该放到组件中做判断
    // 只有一个审批人 && 审批规则为任一
    if (
      nextNodePostList.length === 0
      && accountIdsData.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = accountIdsData[0].id;
      personShowId = accountIdsData[0].id;
      isDisabledPost = true;
    }

    // 只有一个岗位 && 审批规则为任一
    if (
      nextNodePostList.length === 1
      && accountIdsData.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      postId = nextNodePostList[0]._id;
      personShowId = nextNodePostList[0]._id;
      isDisabledPost = true;
    }

    // 只有一个审批岗位 && 该岗位下只有一个审批人 && 审批规则为任一
    if (
      nextNodePostList.length === 1
      && accountIdsData.length === 1
      && nextNodePostList[0].account_ids.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = nextNodePostList[0].account_ids[0];
      postId = nextNodePostList[0]._id;
      postPersonId = nextNodePostList[0].account_ids[0];
      personShowId = nextNodePostList[0]._id;
      isDisabledPost = true;
      isDisabledPerson = true;
    }
    // 定义传入的参数
    const props = {
      nextNodeDetail: nextNodeInfo,
      accountIdsData,
      postPersonList: nextNodePostList,
      onChangePerson: this.onChangePerson,
      isDisabledPost,
      isDisabledPerson: isDefault ? isDisabledPerson : this.state.isDisabledPerson,
      postList: nextNodePostList,
      personList: nextNodeAccountList,
    };

    const formItems = [
      {
        label: '下一节点审批人',
        form: getFieldDecorator('assignedPerson',
          {
            initialValue: { personId, postId, postPersonId, personShowId },
            rules: [{ ...rules, validator: this.onVerify }],
            validateTrigger: this.onSubmit,
          })(
            <ApprovePersonOrPost {...props} />,
          ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <Modal
        title="审批意见"
        visible={visible}
        onOk={this.onSubmit}
        onCancel={this.onHideModal}
      >
        <div className={style['app-comp-expense-form-modal-next-approval-wrap']}>
          <p className={style['app-comp-expense-form-modal-next-approval']}>请指派下一个节点的审批人</p>
        </div>
        <Form>
          <DeprecatedCoreForm
            items={formItems}
            cols={1}
            layout={layout}
          />
        </Form>
      </Modal>
    );
  }

  // 内容
  renderContent = () => {
    return (
      <div
        className={style['app-comp-expense-manage-form-submit']}
      >
        <Button
          type="primary"
          onClick={this.onPresent}
        >
          提交
        </Button>
        {
          this.renderModal()
        }
      </div>
    );
  }

  // TODO: 将renderContent修改问render，删除多余代码 @王晋
  render() {
    return this.renderContent();
  }
}

export default connect()(Form.create()(Operate));
