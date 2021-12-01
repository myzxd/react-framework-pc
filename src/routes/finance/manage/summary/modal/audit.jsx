/**
 * 服务费查询模块, 数据汇总页面-首页 - 提审弹窗
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, message } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';
import { OaApplicationFlowTemplateApproveMode, OaApplicationFlowAssigned } from '../../../../../application/define';
import ApprovePersonOrPost from '../../../../expense/manage/examineOrder/detail/approvePersonOrPost';
import styles from './style/index.less';

class AuditModal extends Component {
  static propTypes = {
    auditInfo: PropTypes.object,
    onHideModal: PropTypes.func,
    isShowModal: PropTypes.bool,
    summaryId: PropTypes.string,
  };

  static defaultProps = {
    auditInfo: {},
    onHideModal: () => {},
    isShowModal: false,
    summaryId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isVerifyPost: false, // 提交时，是否判断审批岗位
      isDefault: true, // 提交时，是否是初次默认值
      isDisabledPerson: false, // 是否禁用提交用组件的审批岗位下的审批人选择框
    };
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'financeSummaryManage/resetSalarySubmitAudit' });
  }

  // 获取数据的回调函数
  onDirectToInfo = () => {
    // 提交后重置
    this.onReset();
  }

  // 提交
  onSubmit = (e) => {
    const { onHideModal, summaryId } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errs, values) => {
      if (errs) {
        return;
      }
      // 获取自定义表单的值
      const { assignedPerson = {} } = values;
      const { postId, personId } = assignedPerson;
      if (is.not.existy(summaryId) || is.empty(summaryId)) {
        return message.error('操作失败，请选择结算单');
      }
      const params = {
        ids: summaryId, // 汇总id
        accountId: personId,  // 接点人id
        postId, // 岗位id
      };
      this.props.dispatch({ type: 'financeSummaryManage/submitSalaryStatement', payload: params });
      if (onHideModal) {
        onHideModal();
      }
    });
  }

  // 自定义Form校验
  onVerify = (rule, value, callback) => {
    // 审批单详情
    const { auditInfo: auditData = {} } = this.props;

    // 是否校验审批岗位下的审批人
    let { isVerifyPost } = this.state;

    // 节点列表
    const nodeList = dot.get(auditData, 'node_list', []);

    // 获取下一节点的审批人列表
    const examinePerson = dot.get(nodeList[0], 'account_list', []);

    // 获取下一节点的审批岗位列表
    const postList = dot.get(nodeList[0], 'post_list', []);

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

  // 隐藏弹窗
  onCancel = () => {
    const { onHideModal } = this.props;
    this.setState({
      isVerifyPost: false,
      isDefault: false,
    });
    if (onHideModal) {
      onHideModal();
    }
    // 重置数据
    this.onReset();
  }

  // 修改审批人或审批岗位
  onChangePerson = (isVerifyPost, isDisabledPerson) => {
    this.setState({
      isVerifyPost, // 是否校验审批岗位下的审批人
      isDefault: false, // 提交用组件是否是初次默认值
      isDisabledPerson, // 是否禁用提交用组件的审批岗位下的审批人选择框
    });
  }

  // 重置数据
  onReset = () => {
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染添加标签的表单
  renderCreateForm = () => {
    const { isDefault } = this.state;
    const { auditInfo: auditData = {}, isShowModal: visible } = this.props;
    const { getFieldDecorator } = this.props.form;

    // 如果不显示弹窗，return
    if (!visible || Object.keys(auditData).length === 0) {
      return;
    }

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
    const nodeList = dot.get(auditData, 'node_list');
    // 获取提报节点之后的第一个节点的审批人
    if (is.existy(nodeList) && is.array(nodeList) && is.not.empty(nodeList)) {
      nextNodeInfo = nodeList[0] || {};
      nextNodeAccountList = dot.get(nodeList[0], 'account_list', []);
      nextNodePostList = dot.get(nodeList[0], 'post_list', []);
      pickMode = dot.get(nodeList[0], 'pick_mode');
      approveMode = nodeList[0].approve_mode;
    }
    const rules = {
      message: '请选择审批人或审批岗位',
      isApprovalAll: false,
      isAutoMatic: false,
      required: false,
    };

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

    // 只有一个审批人 && 审批规则为任一
    if (
      nextNodePostList.length === 0
      && accountIdsData.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = nextNodeAccountList[0]._id;
      personShowId = nextNodeAccountList[0]._id;
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
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }

  render = () => {
    const { isShowModal: visible } = this.props;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="操作" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="创建" cancelText="取消">
        <div className={styles['app-comp-finance-audit-HM']}>
          <p className={styles['app-comp-finance-audit-modal-P']}>请指派下一个节点的审批人</p>
        </div>
        <Form>
          {this.renderCreateForm()}
        </Form>
      </Modal>
    );
  }
}
function mapStateToProps({ financeSummaryManage: { auditInfo } }) {
  return { auditInfo };
}
export default connect(mapStateToProps)(Form.create()(AuditModal));