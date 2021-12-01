/**
 * 付款审批 - 同意操作
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button } from 'antd';

import {
  OaApplicationFlowAssigned,
  OaApplicationFlowTemplateApproveMode,
  ExpenseExamineOrderVerifyState,
  ExpenseApprovalType,
  OaApplicationOrderType,
  Alternatives,
  ExpenseExamineOrderPaymentState,
  ExpenseDepartmentSubtype,
  OAExtra,
} from '../../../../../application/define';
import Utils from '../../../../../application/utils';
import { DeprecatedCoreForm } from '../../../../../components/core';
import AlternativedTextBox from '../../../components/alternativedTextBox';
import ApprovePersonOrPost from './approvePersonOrPost';
import { PagesHelper } from '../../../../oa/document/define';
import PayeeTable from './components/payeeTable'; // 付款明细 - 表格
import CommonTab from './commonTab';
import styles from './style.less';

class ApproveModal extends Component {
  static getDerivedStateFromProps(nextProps) {
    const nextPayeeList = dot.get(nextProps, 'examineOrderDetail.payeeList', []);
    const pluginExtraMeta = dot.get(nextProps, 'examineOrderDetail.pluginExtraMeta', {});
    const pluginPayeeList = dot.get(nextProps, 'examineOrderDetail.pluginExtraMeta.payee_list', []);
    // 外部审批单字段
    let isPluginOrder = false;
    if (is.existy(pluginExtraMeta)) {
      isPluginOrder = pluginExtraMeta.is_plugin_order;
    }
    // 不是外部审批单
    if (nextPayeeList && isPluginOrder !== true) {
      return {
        payeeList: nextPayeeList,
      };
    }
    // 外部审批单
    if (isPluginOrder && isPluginOrder) {
      return {
        payeeList: pluginPayeeList,
      };
    }
    return null;
  }
  static propTypes = {
    orderId: PropTypes.string,            // 审批单id
    currentFlowNode: PropTypes.string,    // 当前操作节点的节点id
    examineOrderDetail: PropTypes.object, // 审批单详情
    orderRecordId: PropTypes.string,      // 审批单流转记录id
    isPaymentNode: PropTypes.bool,        // 是否是标记付款节点 （如果是，标题显示为标记付款）
  }
  static defaultProps = {
    examineOrderDetail: {},
    isPaymentNode: false,
  }

  constructor(props) {
    super();
    this.state = {
      visible: false, // 是否显示弹窗
      departmentVisible: false, // 是否显示弹框
      departmentInfo: {}, // 部门信息
      count: 5,           // 自动关闭倒计时
      showModal: false,     // 是否显示自动关闭弹窗
      isVerifyPost: false, // 是否校验审批岗位下的审批人
      isDefault: true, // 提交时，是否是初次默认值
      isDisabledPerson: false, // 是否禁用提交用组件的审批岗位下的审批人选择框
      payeeList: [],       // 付款明细
    };
    this.private = {
      dispatch: props.dispatch,
      isSubmit: true, // 防止多次提交
    };
  }

  componentDidMount() {
    const { examineOrderDetail, dispatch } = this.props;
    const { applicationOrderType, bizExtraWorkflowIds = [] } = examineOrderDetail;
    // 审批类型不是部门/编制的时候不调接口
    if (applicationOrderType !== PagesHelper.getDepartmentPostKey()) {
      return;
    }
    let list = [];
    const orderTypeStr = OAExtra[applicationOrderType];
    const oaDetail = examineOrderDetail[orderTypeStr] ? examineOrderDetail[orderTypeStr] : {};
    // 判断是否是外部插件
    if (oaDetail._id) {
      list = [
        { id: oaDetail._id, key: applicationOrderType },
      ];
    } else {
      list = bizExtraWorkflowIds.map((i) => {
        return { id: i, key: applicationOrderType };
      });
    }
    const obj = list[0] || {};
    if (oaDetail._id) {
      dispatch({ type: 'codeDocument/fetchDepartmentPostDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'codeDocument/fetchDepartmentPostDetail', payload: { id: obj.id } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    this.onHideModal();
    dispatch({
      type: 'codeDocument/reduceDepartmentPostDetail', payload: {},
    });
  }

  // 改变付款明细
  onChangepayeeList = (e, id) => {
    const { payeeList } = this.state;
    const item = payeeList.filter(v => v._id === id)[0];
    item.payee_type = e.target.value;
    this.setState({
      payeeList: [...payeeList, item],
    });
  }

  // 成功回调
  onDepartmentSuccessCallback = () => {
    this.setState({
      visible: true,
    });
  }

  // 失败回调
  onDepartmentFailureCallback = (record = {}) => {
    this.setState({
      departmentVisible: true,
      departmentInfo: record,
    });
  }

  // 显示部门弹窗
  onShowDepartmentModal = () => {
    this.setState({
      visible: true,
      departmentVisible: false,
      departmentInfo: {},
    });
  }

  // 显示弹窗
  onShowModal = () => {
    const { examineOrderDetail, departmentPostDetail, orderId } = this.props;
    // 审批单类型
    const { applicationOrderType } = examineOrderDetail;
    // 判断是否是组织管理
    if (applicationOrderType === PagesHelper.getDepartmentPostKey()) {
      // 岗位信息
      const jobList = dot.get(departmentPostDetail, 'job_data_list', []);
      const jobItem = jobList[0] || {};
      // 子类型
      const subType = dot.get(departmentPostDetail, 'organization_sub_type');
      let jobId; // 岗位id
      let departmentId; // 部门id
      let targetParentDepartmentId; // 当前父部门id
      let updateParentDepartmentId; // 调整后的上级部门ID
      // 新增部门
      if (subType === ExpenseDepartmentSubtype.newAdd) {
        // 当前父部门id
        targetParentDepartmentId = dot.get(departmentPostDetail, 'target_parent_department_info._id', undefined);
        // 调整上级部门
      } else if (subType === ExpenseDepartmentSubtype.adjustment) {
        // 调整后的上级部门ID
        updateParentDepartmentId = dot.get(departmentPostDetail, 'update_parent_department_info._id', undefined);
        // 部门id
        departmentId = dot.get(departmentPostDetail, 'department_info._id', undefined);
      } else {
        // 部门id
        departmentId = dot.get(departmentPostDetail, 'department_info._id', undefined);
      }
      // 增编
      if (subType === ExpenseDepartmentSubtype.addendum) {
        jobId = dot.get(jobItem, 'job_info._id', undefined);
      }
      // 减编
      if (subType === ExpenseDepartmentSubtype.reduceStaff) {
        jobId = dot.get(jobItem, 'job_info._id', undefined);
      }
      // 添加岗位
      if (subType === ExpenseDepartmentSubtype.addPost) {
        jobId = dot.get(jobItem, 'job_info._id', undefined);
      }
      this.props.dispatch({
        type: 'expenseExamineOrder/checkExamineDepartmentOrder',
        payload: {
          orderId,      // 审批单id
          subType,      // 子类型
          departmentId, // 部门id
          jobId,        // 岗位id
          targetParentDepartmentId, // 当前父部门id
          updateParentDepartmentId, // 调整后的上级部门ID
          onSuccessCallback: this.onDepartmentSuccessCallback,
          onFailureCallback: this.onDepartmentFailureCallback,
        },
      });
      return;
    }
    this.setState({
      visible: true,
    });
  }

  // 隐藏弹窗
  onHideModal = () => {
    this.private.isSubmit = true;
    this.setState({
      visible: false,
      detail: {},
      isVerifyPost: false,
      isDefault: true,
    });
    this.props.form.resetFields();
  }

  // tab状态
  onChangeTab = (v) => {
    this.setState({ activeKey: v });
    this.props.form.setFieldsValue({ note: undefined });
  }

  // 添加项目
  onSubmit = () => {
    const { orderId, orderRecordId, isPaymentNode, examineOrderDetail } = this.props;
    const paidState = dot.get(examineOrderDetail, 'paidState');
    const pluginExtraMeta = dot.get(examineOrderDetail, 'pluginExtraMeta', {});
    // 外部审批单字段
    let isPluginOrder = false;
    if (is.existy(pluginExtraMeta)) {
      isPluginOrder = pluginExtraMeta.is_plugin_order;
    }
    const { payeeList } = this.state;
    // 抄送信息 - 岗位
    const copyGivedepartments = dot.get(this.props, 'copyGiveValues.departmentNames', []);
    // 抄送信息 - 用户
    const copyGiveusers = dot.get(this.props, 'copyGiveValues.userNames', []);
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }

      // 校验通过，隐藏弹窗
      this.setState({ visible: false });
      const params = {
        id: orderId,        // 审批单id
        orderRecordId,      // 审批单流转记录id
        note: values.note,  // 审批意见
        copyGivedepartments, // 抄送信息 - 岗位
        copyGiveusers,     // 抄送信息 - 用户
        onSuccessCallback: this.onSuccessCallback,  // 成功的回调函数
        onFailureCallback: () => (this.private.isSubmit = true),
      };
      // 审批单类型
      const { applicationOrderType } = examineOrderDetail;
      // 费用|房屋|差旅单子显示付款明细&是付款节点&不是外部审批单&状态为待付款
      if (
        (applicationOrderType === OaApplicationOrderType.cost
        || applicationOrderType === OaApplicationOrderType.housing ||
        applicationOrderType === OaApplicationOrderType.travel) &&
        isPaymentNode && isPluginOrder !== true &&
        paidState === ExpenseExamineOrderPaymentState.waiting) {
        params.payeeList = payeeList; // 付款明细
      }


      // 服务费发放审批单同意操作，不传成功回调
      if (applicationOrderType === OaApplicationOrderType.salaryIssue && isPaymentNode === true) {
        params.onSuccessCallback = undefined;
      }

      const { assignedPerson = {} } = values;
      const { postId, personId } = assignedPerson;
      // 指派审批人
      if (is.existy(personId) && is.not.empty(personId)) {
        params.person = personId;
      }

      // 指派审批节点
      if (is.existy(postId) && is.not.empty(postId)) {
        params.postIds = postId;
      }

      // 防止多次提交
      if (this.private.isSubmit) {
        this.private.isSubmit = false;
        this.props.dispatch({ type: 'expenseExamineOrder/updateExamineOrderByApprove', payload: params });
      }

      // 服务费发放审批单直接回调
      if (applicationOrderType === OaApplicationOrderType.salaryIssue && isPaymentNode === true) {
        this.onSuccessCallback();
      }
    });
  }

  // 自定义Form校验
  onVerify = (rule, value, callback) => {
    const { currentFlowNode } = this.props;
    // 当前待处理的审批人列表
    const { examineOrderDetail } = this.props;

    // 审批流详情
    const { examineDetail } = this.props;

    // 是否校验审批岗位下的审批人
    let { isVerifyPost } = this.state;

    // 得到审批流的节点信息列表
    const nodeList = dot.get(examineDetail, 'nodeList');

    // 获取当前节点在审批单节点列表的下标
    const index = nodeList.findIndex(item => item.id === currentFlowNode);

    // 获取下一节点的审批人列表
    const examinePerson = dot.get(nodeList[index + 1], 'accountList', []);

    // 获取下一节点的审批岗位列表
    const postList = dot.get(nodeList[index + 1], 'postList', []);

    // 只有一个岗位时，默认值赋值。重置是否岗位校验
    if (postList.length === 1 && examinePerson.length === 0) {
      isVerifyPost = true;
    }

    // 获取流转记录列表
    const flowRecordList = dot.get(examineOrderDetail, 'flowRecordList');
    // 获取当前待处理人列表
    const currentPerson = flowRecordList.filter(flowRecord => flowRecord.state === ExpenseExamineOrderVerifyState.pendding);
    // 判断：当前节点待处理人不是一个 && 审批规则为全部，则不校验
    if (currentPerson.length !== 1 || rule.isLastNode || rule.isApprovalAll === true) {
      callback();
      return;
    }

    // 判断：审批规则为任一 && 指派规则为自动
    if (rule.isApprovalAll === false && rule.isAutoMatic && isVerifyPost === false) {
      callback();
      return;
    }

    // 判断：如果下一节点审批规则为任一 && 选择至审批岗位（审批岗位下的审批人必选），则全部校验
    if (rule.isApprovalAll === false && isVerifyPost === true && value.postId && value.personId) {
      callback();
      return;
    }

    // 判断：如果下一节点审批规则为任一 && 指派规则为手动 && 指派人选择至审批人, 则全部校验
    if (rule.isApprovalAll === false && rule.isAutoMatic === false && isVerifyPost === false && value.personId) {
      callback();
      return;
    }

    callback('请选择指派审批人或审批岗位');
  }

  // 修改审批人或审批岗位
  onChangePerson = (isVerifyPost, isDisabledPerson) => {
    this.setState({
      isVerifyPost, // 是否校验审批岗位下的审批人
      isDefault: false, // 提交用组件是否是初次默认值
      isDisabledPerson, // 是否禁用提交用组件的审批岗位下的审批人选择框
    });
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
      if (this.state.count <= 0) {
        this.closeAndReload(intervarID);
      }
    }, 1000);
  }

  // 关闭子页面刷新父页面
  closeAndReload = (intervarID) => {
    clearInterval(intervarID);
    // 父页面是否存在
    if (window.parent && window.parent.opener && window.parent.opener.location) {
      const uri = Utils.uriFromHash(window.parent.opener.location.hash);
      window.parent.opener.location.href = `${uri}?selectedTabKey=${ExpenseApprovalType.penddingVerify}`;
      window.parent.opener.location.reload();
      window.close();
    }
    window.close();
  }

  // 渲染弹窗内容
  renderModal = () => {
    const { currentFlowNode, examineOrderDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { visible, isDefault, activeKey } = this.state;
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

    const defaultActiveKey = this.props.isPaymentNode ? Alternatives.finance : Alternatives.often;  // tab状态
    const alternativeKey = activeKey || defaultActiveKey;

    // 审批流详情
    const { examineDetail = {} } = this.props;
    if (!visible || Object.keys(examineDetail).length === 0) {
      return;
    }

    const formItems = [
      {
        label: '意见',
        form: getFieldDecorator('note', { rules: [{ max: 1000, message: '意见的最大长度不能超过1000' }] })(
          <AlternativedTextBox
            alternatives={Alternatives.conversionData(alternativeKey)}
            placeholder="请输入意见"
            rows={4}
          />,
        ),
      },
    ];

    // 得到审批流的节点信息列表
    const nodeList = dot.get(examineDetail, 'nodeList');

    // 获取当前节点在审批单节点列表的下标
    const index = nodeList.findIndex(item => item.id === currentFlowNode);

    // 获取下一节点的审批人列表
    const examinePerson = dot.get(nodeList[index + 1], 'accountList', []);
    // 获取下一节点的审批岗位列表
    const postList = dot.get(nodeList[index + 1], 'postList', []);
    // 下一个节点的审批规则
    const approveMode = dot.get(nodeList[index + 1], 'approveMode');
    // 下一个节点的指派方式
    const pickMode = dot.get(nodeList[index + 1], 'pickMode');

    // 流转记录列表
    const flowRecordList = dot.get(examineOrderDetail, 'flowRecordList');

    // 当前待处理状态的操作人列表，当前节点审批规则为全部，下一个节点审批规则为任一时，只有最后一个人通过时，显示指派审批人选择框
    const currentPerson = flowRecordList.filter(flowRecord => flowRecord.state === ExpenseExamineOrderVerifyState.pendding);

    // 判断下一节点的审批规则，如果唯一，则审批人必选，否则，不必选
    const options = {
      message: '请指派审批人或审批岗位',
      isApprovalAll: false,
      isAutoMatic: false,
      isLastNode: index === nodeList.length - 1,
      required: pickMode === OaApplicationFlowAssigned.manual,
    };

    // 定义提交表单时的校验规则-审批规则
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      options.isApprovalAll = true;
    }
    // 定义提交表但是的校验规则-指派规则
    if (pickMode === OaApplicationFlowAssigned.automatic) {
      options.isAutoMatic = true;
    }

    let postId;
    let personId;
    let postPersonId;
    let personShowId;
    let isDisabledPost = false;
    let isDisabledPerson = false;
    // 只有一个审批人
    if (
      postList.length === 0
      && examinePerson.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = examinePerson[0].id;
      personShowId = examinePerson[0].id;
      isDisabledPost = true;
    }

    // 只有一个岗位
    if (
      postList.length === 1
      && examinePerson.length === 0
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      postId = postList[0]._id;
      personShowId = postList[0]._id;
      isDisabledPost = true;
    }

    // 只有一个审批岗位 && 该岗位下只有一个审批人
    if (
      postList.length === 1
      && examinePerson.length === 0
      && postList[0].account_ids.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = postList[0].account_ids[0];
      postId = postList[0]._id;
      postPersonId = postList[0].account_ids[0];
      personShowId = postList[0]._id;
      isDisabledPost = true;
      isDisabledPerson = true;
    }

    // 合并审批人与审批岗位
    const accountIdsData = examinePerson.concat(postList);


    // 定义闯入的参数
    const props = {
      accountIdsData,
      postPersonList: postList,
      onChangePerson: this.onChangePerson,
      isDisabledPerson: isDefault ? isDisabledPerson : this.state.isDisabledPerson,
      isDisabledPost,
      postList,
      personList: examinePerson,
    };

    // 如果下一个节点审批规则为任一,并且不是最后一个节点，则显示 指派审批人选择框，否则不显示
    if (approveMode === OaApplicationFlowTemplateApproveMode.any
      && index !== nodeList.length - 1
      && currentPerson.length === 1) {
      // 定义指派审批人选择框
      const formItem = {
        label: '下一节点审批人',
        form: getFieldDecorator('assignedPerson',
          {
            initialValue: { personId, postId, postPersonId, personShowId },
            rules: [{ ...options, validator: this.onVerify }],
            validateTrigger: this.onSubmit,
          })(
            <ApprovePersonOrPost
              {...props}
            />,
          ),
      };
      formItems.unshift(formItem);
    }
    const { isPaymentNode } = this.props;
    const paidState = dot.get(examineOrderDetail, 'paidState');
    const pluginExtraMeta = dot.get(examineOrderDetail, 'pluginExtraMeta', {});
    // 审批单类型
    const { applicationOrderType } = examineOrderDetail;
    // 外部审批单字段
    let isPluginOrder = false;
    if (is.existy(pluginExtraMeta)) {
      isPluginOrder = pluginExtraMeta.is_plugin_order;
    }
    return (
      <Modal title={isPaymentNode ? '完成付款' : ''} visible={visible} onOk={this.onSubmit} onCancel={this.onHideModal} >
        {/* 费用|房屋|差旅单子显示付款明细表格&是付款节点&不是外部审批单&状态为待付款 */}
        {
           (applicationOrderType === OaApplicationOrderType.cost
           || applicationOrderType === OaApplicationOrderType.housing ||
           applicationOrderType === OaApplicationOrderType.travel) &&
            isPaymentNode && paidState === ExpenseExamineOrderPaymentState.waiting ? (
              <PayeeTable
                isPluginOrder={isPluginOrder}
                dataSource={this.state.payeeList}
                isPaymentNode={isPaymentNode}
                money={dot.get(examineOrderDetail, 'totalMoney', undefined)}
                pluginMoney={pluginExtraMeta.total_money}
                onChangepayeeList={this.onChangepayeeList}
              />
          ) : null
        }
        <CommonTab title={!isPaymentNode ? '操作' : ''} activeKey={alternativeKey} onChange={this.onChangeTab} />
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  // 部门/岗位增编申请校验弹框
  renderDepartmentModal = () => {
    const { departmentVisible, departmentInfo = {} } = this.state;
    const { departmentPostDetail } = this.props;
    const list = dot.get(departmentInfo, 'hint_list', []);
    // 子类型
    const subType = dot.get(departmentPostDetail, 'organization_sub_type');
    // 岗位信息
    const jobList = dot.get(departmentPostDetail, 'job_data_list', []);
    const jobItem = jobList[0] || {};
    let titleName = '';
    // 新增部门 | 调整上级部门 | 裁撤部门
    if (subType === ExpenseDepartmentSubtype.newAd
      || subType === ExpenseDepartmentSubtype.adjustment
      || subType === ExpenseDepartmentSubtype.abolition) {
      // 当前部门
      titleName = dot.get(departmentPostDetail, 'department_info.name', '--');
    }
    // 添加岗位 | 增编 | 减编
    if (subType === ExpenseDepartmentSubtype.addPost
      || subType === ExpenseDepartmentSubtype.addendum
      || subType === ExpenseDepartmentSubtype.reduceStaff) {
      // 当前部门-当前岗位
      titleName = `${dot.get(departmentPostDetail, 'department_info.name', '--')} - ${dot.get(jobItem, 'job_info.name', '--')}`;
    }
    return (
      <Modal
        title="操作"
        okText="继续审批"
        visible={departmentVisible}
        onOk={this.onShowDepartmentModal}
        onCancel={() => {
          this.setState({
            departmentVisible: false,
            departmentInfo: {},
          });
        }}
      >
        <h4>{`调整类型：${ExpenseDepartmentSubtype.description(subType)}申请(${titleName})`}</h4>
        {
          list.map((v) => {
            return (
              <p dangerouslySetInnerHTML={{ __html: `${v.replace(/\n/g, '<br/>')}` }} />
            );
          })
        }
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
            <CheckCircleOutlined className={styles['app-comp-expense-approve-close-modal-icon ']} />
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
    const { isPaymentNode } = this.props;

    let title = '同意';
    // 如果是标记付款节点, 权限操作改名为标记付款
    if (isPaymentNode === true) {
      title = '完成付款';
    }
    return (
      <div>
        {/* 渲染操作弹窗 */}
        {this.renderModal()}

        {/* 部门/岗位增编申请校验弹框 */}
        {this.renderDepartmentModal()}

        {/* 渲染审批完成自动关闭弹窗 */}
        {this.renderCloseModal()}

        {/* 渲染文案 */}
        <Button type="primary" onClick={this.onShowModal}>{title}</Button>
      </div>
    );
  }
}
function mapStateToProps({ codeDocument: { departmentPostDetail } }) {
  return { departmentPostDetail };
}
export default connect(mapStateToProps)(Form.create()(ApproveModal));
