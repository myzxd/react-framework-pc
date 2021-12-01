/**
 * 付款审批 - 驳回操作
 */
import is from 'is_js';
import dot from 'dot-prop';
import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';
import {
  ExpenseApprovalType,
  OaApplicationFlowAssigned,
  OaApplicationFlowTemplateApproveMode,
} from '../../../../../application/define';
import Utils from '../../../../../application/utils';
import RejectNodeAndPerson from './rejectNodeAndPerson';
import AlternativedTextBox from '../../../components/alternativedTextBox';
import styles from './style.less';

// 常用语
const Alternatives = [
  {
    key: '0',
    value: '请上传附件。',
  },
  {
    key: '1',
    value: '文件有误，需要修改。',
  },
];

class RejectModal extends Component {

  static propTypes = {
    orderId: PropTypes.string,                   // 审批单id
    orderRecordId: PropTypes.string, // 审批单流转记录id
    currentFlowNode: PropTypes.string,   // 当前审批流节点id
    examineDetail: PropTypes.object,  // 审批流详情
  }

  constructor(props) {
    super();
    this.state = {
      visible: false, // 是否显示弹窗
      isDefault: true,         // 是否使用默认数据（自定义表单的默认值与onchange区分）
      count: 5,                 // 自动关闭倒计时
      showModal: false,         // 是否显示自动关闭弹窗
      isVerifyPost: false,
    };
    this.private = {
      dispatch: props.dispatch,
      isSubmit: true, // 防止多次提交
    };
  }

  // 显示弹窗
  onShowModal = () => {
    this.setState({ visible: true });
  }

  // 隐藏弹窗
  onHideModal = () => {
    this.setState({
      visible: false,
      detail: {},
      isDefault: true,
      isVerifyPost: false,
    });
    this.props.form.resetFields();
  }

  // 修改状态
  onChangeState = (isVerifyPost) => {
    // 如果不再是默认值，则不需要更新
    this.setState({
      isDefault: false,
      isVerifyPost,
    });
  }

  // 添加项目
  onSubmit = (e) => {
    const { orderId, orderRecordId, examineDetail } = this.props;
    // 得到审批流的节点信息列表
    const nodeList = dot.get(examineDetail, 'nodeList', []);
    // 抄送信息 - 岗位
    const copyGivedepartments = dot.get(this.props, 'copyGiveValues.departmentNames', []);
    // 抄送信息 - 用户
    const copyGiveusers = dot.get(this.props, 'copyGiveValues.userNames', []);

    this.props.form.validateFields((err, values) => {
      e.preventDefault();
      // 错误判断
      if (err) {
        return;
      }

      // 校验通过，隐藏弹窗
      this.setState({ visible: false });
      // 获取自定义表单
      const { person } = values;
      // 获取自定义表单相关值
      const { nodeId, personId, postId } = person;
      const params = {
        id: orderId,        // 审批单id
        orderRecordId,      // 审批单流转记录id
        note: values.note,  // 审批意见
        copyGivedepartments, // 抄送信息 - 岗位
        copyGiveusers,     // 抄送信息 - 用户
        onSuccessCallback: this.onSuccessCallback,  // 成功的回调函数
        onFailureCallback: this.onFailureCallback,   // 失败的回调函数
      };

      // 根据所选择的节点id，获取当前节点的信息列表
      const nodeInfo = nodeList.length === 0 ? [] : nodeList.filter(item => item.id === nodeId);
      // 所选节点的审批规则
      const approveMode = dot.get(nodeInfo[0], 'approveMode');

      // 判断驳回节点信息，并传入参数
      if (nodeId && nodeId !== '0') {
        params.rejectToNodeId = nodeId;
      }

      // 如果被驳回的节点审批规则是任一时，接口参数才可以传入审批人id
      if (approveMode === OaApplicationFlowTemplateApproveMode.any && is.existy(personId)) {
        params.accountId = personId;
      }

      // 指派审批节点
      if (approveMode === OaApplicationFlowTemplateApproveMode.any && is.existy(postId)) {
        params.postIds = postId;
      }

      // 防止多次提交
      if (this.private.isSubmit) {
        this.props.dispatch({
          type: 'expenseExamineOrder/updateExamineOrderByReject',
          payload: params,
        });
        this.private.isSubmit = false;
      }
    });
  }

  // 自定义Form校验
  onVerify = (rule, value, callback) => {
    const { examineDetail } = this.props;
    const { isDefault } = this.state;
    const { isVerifyPost } = isDefault ? rule : this.state;

    // 获取节点列表
    const nodeList = dot.get(examineDetail, 'nodeList', []);
    // 获取选中节点的信息
    const nodeInfo = nodeList.find(item => item.id === value.nodeId);
    // 获取选中节点的审批规则
    const isApprovalAll = dot.get(nodeInfo, 'approveMode', undefined) === OaApplicationFlowTemplateApproveMode.all;
    // 获取选中节点的指派规则
    const isAutoMatic = dot.get(nodeInfo, 'pickMode', undefined) === OaApplicationFlowAssigned.automatic;

    // 如果审批规则为全部，则校验驳回节点、驳回的审批人
    if ((isApprovalAll === true || value.nodeId === '0') && value.nodeId) {
      callback();
      return;
    }

    // 如果审批规则为任一 && 指派规则为自动 && 指派到审批人，则校验驳回节点
    if (isApprovalAll === false && isAutoMatic === true && isVerifyPost === false && value.nodeId) {
      callback();
      return;
    }

    // 如果审批为任一 && 选择至审批岗位下的审批人，则校验所有的表单
    if (isApprovalAll === false
      && isVerifyPost === true
      && value.nodeId
      && value.personId
      && value.postId) {
      callback();
      return;
    }

    // 如果审批规则为任一 && 指派规则为手动 && 指派至审批人
    if (isApprovalAll === false
      && isVerifyPost === false
      && isAutoMatic === false
      && value.nodeId
      && value.personId) {
      callback();
      return;
    }

    // 如果校验不通过，则提示错误文本
    callback('请选择驳回节点或审批人');
  }

  // 失败的回调
  onFailureCallback=() => {
     // 失败之后从新设置提交状态
    this.private.isSubmit = true;
  }
  // 成功的回调
  onSuccessCallback = () => {
    // 显示自动关闭弹窗
    this.setState({
      showModal: true,
    });
    const intervarID = setInterval(() => {
      this.setState({
        count: this.state.count - 1,
      });
      if (this.state.count === 0) {
        this.closeAndReload(intervarID);
      }
    }, 1000);
  }

  // 关闭子页面刷新父页面
  closeAndReload = (intervarID) => {
    clearInterval(intervarID);
    if (window.parent.opener) {
      // eslint-disable-next-line import/no-named-as-default-member
      const uri = Utils.uriFromHash(window.parent.opener.location.hash);
      window.parent.opener.location.href = `${uri}?selectedTabKey=${ExpenseApprovalType.penddingVerify}`;
      window.parent.opener.location.reload();
      window.close();
      return;
    }
    this.setState({
      showModal: false,
      visible: false,
    });
  }

  // 获取表单默认值
  fetchFormDefaultValue = () => {
    // 获取提报节点信息
    const { flowRecordList, examineDetail, currentFlowNode } = this.props;

    // 初始nodeList
    const originalNodeList = dot.get(examineDetail, 'nodeList', []);

    // 节点列表
    const nodeList = _.cloneDeep(originalNodeList.filter(n => (n.indexNum !== 0 && n.name !== '提报节点')));

    // 显示的驳回节点列表
    const nodes = [
      { id: '0', name: '提报节点' },   // 默认的提报人节点
    ];

    // 判断是否展示节点信息
    let isShowNodeInfo = true;
    nodeList.forEach((node) => {
      if (isShowNodeInfo === false) {
        return;
      }
      // 节点信息为顺序排列，如果遍历节点与当前节点一致，则后续节点不继续显示。
      if (node.id === currentFlowNode) {
        isShowNodeInfo = false;
        return;
      }
      nodes.push(node);
    });

    // 定义默认值
    let personId;           // 提交的审批人或审批岗位id
    let accountIdsData;     // 审批人或审批岗位列表数据
    let isDisablePerson;    // 审批人或审批岗位选择框是否可选
    let isShowPost = true;  // 是否显示审批岗位下审批人的选择框
    let isShowPerson = true; // 是否显示审批人或审批岗位的选择框
    let isPersonMultiple = false;    // 审批人或岗位选择框是否多选
    let isDisabledNode = false;      // 节点选择款是否可选
    let isDisablePostPerson = false;  // 审批岗位下的审批人选择框是否可选
    let isPostMultiple = '';          // 审批岗位下的审批人选择框是否可多选
    let personShowId;               // 用于显示的审批人id
    let postPersonIds;               // 用于显示的审批岗位下的审批人id

    // 根据当前节点Id获取上一个节点的id（审批流的节点列表）
    const lastNodeIndex = nodeList.findIndex(item => item.id === currentFlowNode) - 1;
    // 获取上一节点信息
    const lastNodeInfo = dot.get(nodeList[lastNodeIndex], {});

    // 节点id（默认获取上一节点id）
    const nodeId = dot.get(lastNodeInfo, 'id', '0');

    // 流转记录的上一节点信息
    const lastRecordNode = flowRecordList.find(item => item.nodeId === nodeId);
    // 审批岗位id
    const operatePostList = dot.get(lastRecordNode, 'operatePostList', []);
    const operateAccountList = dot.get(lastRecordNode, 'operateAccountList', []);
    // 获取当前审批节点的审批岗位信息
    const postList = dot.get(lastNodeInfo, 'postList', []);

    // 获取上一节点审核人列表信息
    const lastNodeAccount = dot.get(lastNodeInfo, 'accountList', []);

    // 审批人列表与审批岗位列表拼成一个数组
    accountIdsData = lastNodeAccount.concat(postList);

    // 获取上一节点的审批规则
    const approveMode = dot.get(lastNodeInfo, 'approveMode', 10);
    // 获取上一节点的指派规则
    const pickMode = dot.get(lastNodeInfo, 'pickMode');

    // 获取上一节点审批人id(全部)
    const personList = lastNodeAccount.map(item => item.id);
    // 上一节点实际操作人id
    const personAny = dot.get(lastRecordNode, 'accountInfo.id');
    const accountAll = accountIdsData.map(item => item.id || item._id);

    // 定义上一节点实际审批人对应的岗位id
    const actualOperatIndex = operateAccountList.findIndex(item => item.id === personAny);
    // 审批岗位id（用于提交）
    const postInfo = operatePostList[actualOperatIndex];
    // 实际审批人对应的岗位id
    const postId = dot.get(postInfo, '_id', '');
    // 获取上一节点的实际操作岗位信息
    const actualPostInfo = postList.find(item => item._id === postId);
    // 获取上一节点的实际岗位下的审批人列表
    let postPersonList = dot.get(actualPostInfo, 'account_info_list', []);

    // 如果驳回的节点只有提报节点，定义默认值及提报节点的提报人信息
    if (nodes.length === 1 && lastNodeIndex === -1) {
      // 提报节点的提报人信息
      const firstNodeAccount = dot.get(flowRecordList[flowRecordList.length - 1], 'accountInfo');
      // 提报节点的提报人id
      const accountId = dot.get(firstNodeAccount, 'id');
      // 重新赋值
      personId = accountId;
      personShowId = accountId;
      accountIdsData = [firstNodeAccount];
      isShowPost = false;
      isDisablePerson = true;
      isDisabledNode = true;
    }

    // 如果上一审批节点审批规则为全部 && 审批岗位没有值，赋对应默认值
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.all
      && is.empty(postList)
    ) {
      personId = personList;
      personShowId = personList;
      isDisablePerson = true;                                 // 审批人选择框是否可选
      isPersonMultiple = lastNodeAccount.length > 1 ? 'multiple' : '';    // 是否多选
      isShowPost = false;
      postPersonList = accountIdsData;
    }

    // 如果上一审批节点审批规则为全部 && 审批岗位有值，赋对应默认值
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.all
      && is.not.empty(postList)
    ) {
      personId = personList;
      postPersonIds = accountAll;
      isShowPerson = false;
      isShowPost = true;
      isDisablePostPerson = true;
      isPostMultiple = 'multiple';
      postPersonList = accountIdsData;
    }

    // 如果上一审批节点审批规则为任一 && 审批岗位没值，赋对应默认值
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && is.empty(postList)
    ) {
      personId = personAny;
      personShowId = dot.get(lastRecordNode, 'accountInfo.id');
      isShowPost = false;
    }

    // 如果上一审批节点审批规则为任一 && 审批岗位有值，赋对应默认值
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && is.not.empty(postList)
    ) {
      personId = personAny;
      personShowId = postId || personAny;
      postPersonIds = personAny;
      isShowPost = !!postId && !!personAny;
      isShowPerson = true;
    }

    // 非提报节点 && 任一 && 只有一个审批人 && 没有岗位
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && lastNodeAccount.length === 1
      && postList.length === 0
    ) {
      isDisablePerson = true;
    }

    // 非提报节点 && 任一 && 只有一个审批岗位 && 岗位下多人 && 没有审批人
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && lastNodeAccount.length === 0
      && postList.length === 1
      && postList[0].account_ids.length > 1
    ) {
      isDisablePerson = true;
    }

    // 非提报节点 && 任一 && 只有一个审批岗位 && 岗位下只有一人 && 没有审批人
    if (nodes.length > 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
      && lastNodeAccount.length === 0
      && postList.length === 1
      && postList[0].account_ids.length === 1
    ) {
      isDisablePerson = true;
      isDisablePostPerson = true;
    }

    return {
      nodeId,
      personId,
      personShowId,
      postId,
      postPersonIds,
      accountIdsData,
      isDisablePerson,
      isPersonMultiple,
      nodes,
      isShowPost,
      isShowPerson,
      isDisabledNode,
      isDisablePostPerson,
      isPostMultiple,
      postPersonList,
      isVerifyPost: isShowPost,
      isRequired: pickMode === OaApplicationFlowAssigned.manual,
    };
  }

  // 渲染弹窗内容
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { visible, isDefault } = this.state;
    const { examineDetail, currentFlowNode } = this.props;

    // 初始nodeList
    const originalNodeList = dot.get(examineDetail, 'nodeList', []);

    // 节点列表
    const nodeList = _.cloneDeep(originalNodeList.filter(n => (n.indexNum !== 0 && n.name !== '提报节点')));

    // 如果弹窗不显示，return
    if (!visible) {
      return;
    }
    // 获取审批单审批流转记录数据
    const { flowRecordList } = this.props;

    // 显示的驳回节点列表
    const changeNodes = [
      { id: '0', name: '提报节点' },   // 默认的提报人节点
    ];

    // 判断是否展示节点信息
    let isShowNodeInfo = true;
    nodeList.forEach((node) => {
      if (isShowNodeInfo === false) {
        return;
      }
      // 节点信息为顺序排列，如果遍历节点与当前节点一致，则后续节点不继续显示。
      if (node.id === currentFlowNode) {
        isShowNodeInfo = false;
        return;
      }
      changeNodes.push(node);
    });

    // 获取表单默认值
    const defalutValue = isDefault ? this.fetchFormDefaultValue() : {};

    // 定义initialvalue
    const {
      nodes,
      nodeId,
      personId,
      isVerifyPost,
      isRequired,
    } = defalutValue;

    // 定义表单校验规则（初始化校验）
    const rules = {
      required: isRequired,
      isVerifyPost,
      message: '请选择驳回的审批人或审批岗位',
    };
    // 传入下层组件的参数
    const props = {
      nodes: isDefault ? nodes : changeNodes,
      examineDetail,
      flowRecordList,
      onChangeState: this.onChangeState,
      isDefault,
      ...defalutValue,
    };

    const formItems = [
      {
        label: '驳回至节点',
        form: getFieldDecorator('person',
          {
            initialValue: { nodeId, personId, personShowId: defalutValue.personShowId, postId: defalutValue.postId, postPersonIds: defalutValue.postPersonIds },
            rules: [{ ...rules, validator: this.onVerify }],
            validateTrigger: this.onSubmit,
          },
        )(
          <RejectNodeAndPerson
            {...props}
          />),
      },
      {
        label: '意见',
        form: getFieldDecorator('note', { rules: [{ max: 1000, message: '意见的最大长度不能超过1000' }] })(
          <AlternativedTextBox
            alternatives={Alternatives}
            placeholder="请输入意见"
            rows={4}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

    return (
      <Modal title="操作" visible={visible} onOk={this.onSubmit} onCancel={this.onHideModal}>
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  // 渲染自动关闭提示弹窗
  renderCloseModal = () => {
    const { count } = this.state;
    return (
      <Modal
        title="提示"
        visible={this.state.showModal}
        footer={null}
        closable={false}
      >
        <div>
          <p className={styles['app-comp-expense-approve-close-modal-wrap']}>
            <CheckCircleOutlined className={styles['app-comp-expense-approve-close-modal-icon']} />
            <span className={styles['app-comp-expense-approve-close-modal-finish']}>审批完成</span>
          </p>
          <p className={styles['app-comp-expense-approve-close-modal-count']}>
            <span className={styles['app-comp-expense-approve-close-modal-seconds']}>{count}</span>秒后，系统页面自动关闭
          </p>
          <p className={styles['app-comp-expense-approve-close-modal-tip']}>
            如系统关闭失败，请手动关闭
          </p>
          <p className={styles['app-comp-expense-approve-close-modal-btn-wrap']}>
            <span className={styles['app-comp-expense-approve-close-modal-btn']} onClick={this.closeAndReload}>立即关闭</span>
          </p>
        </div>
      </Modal>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染操作弹窗 */}
        {this.renderModal()}

        {/* 渲染审批完成自动关闭弹窗 */}
        {this.renderCloseModal()}

        {/* 渲染文案 */}
        <Button onClick={this.onShowModal}>驳回</Button>
      </div>
    );
  }
}

export default Form.create()(RejectModal);
