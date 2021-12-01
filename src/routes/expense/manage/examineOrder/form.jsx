/**
 * 审批单 - 创建/编辑页面 Expense/Manage/ExamineOrder/Form
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Table, Popconfirm, message, Modal, Tooltip, Select } from 'antd';
import ComponentRelatedApproval from '../../../oa/document/components/relatedApproval';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import {
  Unit,
  ExpenseCostOrderTemplateType,
  ExpenseCostOrderState,
  ExpenseApprovalType,
  OaApplicationFlowAssigned,
  OaApplicationFlowTemplateApproveMode,
  OaApplicationOrderType,
  ExpenseCostCenterType,
} from '../../../../application/define';
import { authorize } from '../../../../application';

import ExpenseProcessComponent from './common/process';
import Borrowing from './common/borrowing';
import Repayment from './common/repayment';
import ExpenseCreateCostOrderComponent from './common/createCostOrder';
import BusinessTrip from './common/businessTrip';
import ApprovePersonOrPost from './detail/approvePersonOrPost';
import ElemSalarySummary from './detail/components/elemSalarySummary';
import MeituanSalarySummary from './detail/components/meituanSalarySummary';
import OverTime from './common/overTime';
import TakeLeave from './common/takeLeave';
import AffairOrder from '../components/affairOrder';

import { PagesTypes, PagesHelper } from '../../../oa/document/define';

import styles from './style.less';

class SummaryTemplate extends Component {
  static getDerivedStateFromProps(prevProps, oriState) {
    const { examineOrderDetail: prevData = {}, location = {} } = prevProps;
    const { examineOrderDetail: data = undefined, orderId = undefined } = oriState;
    if (data === undefined && Object.keys(prevData).length > 0) {
      const { themeLabelList = [] } = prevData;
      const flowRecordItem = dot.get(prevData, 'flowRecordList.0', {});
      // 外部审批单标签
      const pluginThemeLabelList = dot.get(prevData, 'pluginExtraMeta.theme_label_list', []);
      return {
        examineOrderDetail: prevData,
        themeTags: [...themeLabelList, ...pluginThemeLabelList],
        copyGiveValues: { // 抄送信息
          userNames: dot.get(flowRecordItem, 'flexibleCcAccountInfoList', []),
          departmentNames: dot.get(flowRecordItem, 'flexibleCcDepartmentInfoList', []),
        },
      };
    }

    // 审批单id、模板
    const { query = {} } = location;
    if (orderId === undefined && Object.keys(query).length > 0) {
      // template默认值为费用单类型
      const { orderId: prevOrderId, template: prevTemplate = ExpenseCostOrderTemplateType.refund } = query;
      return { orderId: prevOrderId, template: prevTemplate };
    }
    return null;
  }

  static propTypes = {
    examineOrderDetail: PropTypes.object,
    costOrdersData: PropTypes.object,
    examineDetail: PropTypes.object,
  };

  static defaultProps = {
    examineOrderDetail: {},
    costOrdersData: {},
    examineDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      orderId: undefined,      // 审批单id
      template: undefined,     // 模板类型
      themeTags: undefined, // 主题标签
      visible: false,   // 是否显示弹窗
      isVerifyPost: false, // 提交时，是否判断审批岗位
      isDefault: true, // 提交时，是否是初次默认值
      isDisabledPerson: false, // 是否禁用提交用组件的审批岗位下的审批人选择框
      copyGiveValues: {}, // 抄送信息
    };
    this.private = {
      isSubmit: true, // 防止多次提交
      isShowCreate: true,  // 是否显示新建按钮
    };
  }

  // 默认加载数据
  componentDidMount() {
    const orderId = dot.get(this.props, 'location.query.orderId', undefined);
    // 如果审批单id不为空，则获取审批单详情数据
    if (orderId !== undefined) {
      this.props.dispatch({
        type: 'expenseExamineOrder/fetchExamineOrderDetail',
        payload: {
          id: orderId,
          onSuccessCallback: this.fetchHouseContractDetail,
        },
      });
      this.props.dispatch({
        type: 'expenseCostOrder/fetchCostOrders',
        payload: {
          examineOrderId: orderId,
        },
      });
    }
  }

  // 离开页面后自动清空详情数据
  componentWillUnmount() {
    const { orderId } = this.state;
    if (orderId !== undefined) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetExamineOrderDetail' });
      this.props.dispatch({ type: 'expenseCostOrder/resetCostOrders' });
      this.props.dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
    }
  }

  // 显示弹窗
  onShowModal = () => {
    this.setState({ visible: true });
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

  // 自定义Form校验
  onVerify = (rule, value, callback) => {
    // 审批单详情
    const { examineOrderDetail = {} } = this.props;

    // 是否校验审批岗位下的审批人
    let { isVerifyPost } = this.state;

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
    const { examineOrderDetail = {}, examineDetail = {}, dispatch } = this.props;
    const {
      flowId, // 审批流id
      costOrderIds = [], // 费用单
      businessTravelOrderId, // 出差单id
      extraWorkOrLeaveId, // 加班单id
      applicationOrderType,
    } = examineOrderDetail;

    if (Object.keys(examineDetail).length === 0) {
      dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId } });
    }

    // 判断费用单ids是否为空，如果为空，则不能创建
    // 出差单的id不会出现在costOrderIds数组里，所以单独判断
    if (
      (is.not.existy(costOrderIds)
        || is.empty(costOrderIds))
      && (is.not.existy(businessTravelOrderId)
        || is.empty(businessTravelOrderId))
      && is.not.existy(extraWorkOrLeaveId)
      && !PagesTypes.find(i => i.key === applicationOrderType)
    ) {
      return message.info('请添加费用单数据');
    }

    // 获取第一个节点信息
    let approveMode;          // 审批规则
    const nodeList = dot.get(examineDetail, 'nodeList', []);
    if (is.existy(nodeList) && is.not.empty(nodeList)) {
      approveMode = nodeList[0].approveMode;
    }

    // 如果审批规则为全部，则不显示弹窗,否则显示弹窗
    if (approveMode === OaApplicationFlowTemplateApproveMode.any) {
      this.setState({ visible: true });
    } else {
      this.onSubmit();
    }
  }

  // 修改抄送信息
  onChangeCopyGiveValues = (values) => {
    this.setState({
      copyGiveValues: values,
    });
  }

  // 提交服务器
  onSubmit = () => {
    const { orderId, copyGiveValues } = this.state;

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 抄送信息 - 岗位
      const copyGivedepartments = dot.get(copyGiveValues, 'departmentNames', []);
      // 抄送信息 - 用户
      const copyGiveusers = dot.get(copyGiveValues, 'userNames', []);
      const params = {
        id: orderId,  // 审批单id
        copyGivedepartments,  // 抄送信息 - 岗位
        copyGiveusers,       // 抄送信息 - 用户
        onSuccessCallback: this.onSubmitSuccessCallback,  // 提交成功回调
        onFailureCallback: this.onSubmitFailureCallback,        // 提交失败的回调
      };

      // 获取自定义表单的值
      const { assignedPerson = {} } = values;
      const { postId, personId } = assignedPerson;
      // 判断，如果存在指派人，则传入参数
      if (is.existy(personId) && is.not.empty(personId)) {
        params.person = personId;
      }
      // 指派审批岗位
      if (is.existy(postId) && is.not.empty(postId)) {
        params.postIds = postId;
      }

      // 防止多次提交
      if (this.private.isSubmit) {
        this.props.dispatch({ type: 'expenseExamineOrder/submitExamineOrder', payload: params });
        this.private.isSubmit = false;
      }
    });
  }

  // 提交成功后的回调函数
  onSubmitSuccessCallback = () => {
    const { examineOrderDetail = {} } = this.props;
    // 审批单类型
    const { applicationOrderType } = examineOrderDetail;

    // 判断审批单类型 付款审批<100，事务审批>=100
    if (applicationOrderType < 100) {
      // 跳转到付款审批
      window.location.href = '/#/Expense/Manage/ExamineOrder';
    } else {
      // 判断是否是code审批
      if (dot.get(this.props, 'location.query', {}).isShowCode === 'true') {
        window.location.href = '/#/Code/Manage/OAOrder';
        return;
      }
      // 跳转到事务审批
      window.location.href = '/#/Expense/Manage/OAOrder';
    }
  }

  // 补充意见成功后重新刷新数据
  onSuccessCallback = () => {
    const { orderId } = this.state;
    // 如果审批单id不为空，则获取审批单详情数据
    if (orderId !== undefined) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: { examineOrderId: orderId } });
    }
  }

  // 提交失败的回调
  onSubmitFailureCallback = (res) => {
    // 重置提交状态（失败可以重新提交）
    this.private.isSubmit = true;
    return message.error(res.zh_message);
  }

  // 删除审批单中的费用单
  onDeleteCostOrder = (e) => {
    const { orderId } = this.state;
    const params = {
      orderId,         // 审批单id
      recordIds: [e],  // 费用单ids
      onSuccessCallback: this.onDeleteCostOrderSuccessCallback,  // 删除成功回调
    };
    this.props.dispatch({ type: 'expenseCostOrder/deleteCostOrder', payload: params });
  }

  // 删除审批单中的费用单回调
  onDeleteCostOrderSuccessCallback = () => {
    const { orderId } = this.state;
    this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
    this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: { examineOrderId: orderId } });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { orderId } = this.state;
    this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: { examineOrderId: orderId, limit, page } });
  }

  // 修改分页
  onChangePage = (page) => {
    const { orderId } = this.state;
    this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: { examineOrderId: orderId, limit: 30, page } });
  }

  // 关联账号失败的回调函数
  onFailureAssociatedCallback = (res) => {
    message.error(res.zh_message);
  }

  // 修改主题标签
  onChangeThemeTags = (newValue) => {
    const noSpaceValue = newValue;
    const newLength = noSpaceValue.length;
    // 当新增标签时去除新增标签的空格
    if (newLength > this.state.themeTags.length) {
      const tmp = noSpaceValue[newLength - 1].replace(/\s+/g, '');
      if (tmp === '') return;
      noSpaceValue[newLength - 1] = tmp;
    }
    this.setState({ themeTags: noSpaceValue });
  }

  // 保存主题标签
  onSaveThemeTags = () => {
    const { themeTags, orderId } = this.state;
    const { examineOrderDetail: { applicationOrderType } = {} } = this.props;
    // 合同会审 || 合同借阅，主体标签字段必填
    if ((applicationOrderType === OaApplicationOrderType.contractCome || applicationOrderType === OaApplicationOrderType.contractBorrowing)
      && themeTags.length <= 0) return message.error('请填写主题标签');
    // 外部审批单标签
    const pluginThemeLabelList = dot.get(this.props, 'examineOrderDetail.pluginExtraMeta.theme_label_list', []);
    const params = {
      // 过滤兴达主题标签
      themeTags: themeTags.filter(v => !pluginThemeLabelList.includes(v)), // 主题标签
      orderId, // 审批单id
    };
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchCostApprovalThemeTag',
      payload: {
        params,
        onFailureCallback: this.onFailureAssociatedCallback,
      },
    });
  }

  // 获取合同详情
  fetchHouseContractDetail = (result) => {
    const { dispatch } = this.props;
    const { flow_id: flowId } = result;

    // 审批单id
    const { orderId } = this.state;
    // 获取审批流详情
    flowId && dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId, orderId } });

    if (!result.biz_extra_house_contract_id) return;
    dispatch({
      type: 'expenseHouseContract/fetchHouseContractsDetail',
      payload: { id: result.biz_extra_house_contract_id },
    });
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { examineOrderDetail = {} } = this.props;
    const { applicationOrderType } = examineOrderDetail;
    // 审批单类型
    const type = applicationOrderType < 100
      ? OaApplicationOrderType.description(applicationOrderType)
      : PagesHelper.titleByKey(applicationOrderType);

    // 以下特定单子 title变化显示
    let isNewMoneyRule = false;
    const isCost = applicationOrderType === OaApplicationOrderType.cost;     // 是否是费用单子
    const isTravel = applicationOrderType === OaApplicationOrderType.travel;     // 是否是差旅单子
    const isHouse = applicationOrderType === OaApplicationOrderType.housing;     // 是否是房屋单子
    const isBorrowing = applicationOrderType === OaApplicationOrderType.borrowing;    // 是否是借款单子
    const isRepayments = applicationOrderType === OaApplicationOrderType.repayments;  // 是否是还款单子
    if (isCost || isTravel || isHouse || isBorrowing || isRepayments) {
      isNewMoneyRule = true;
    }
    const formItemsBase = [
      {
        label: '审批单号',
        form: dot.get(examineOrderDetail, 'id', '--'),
      },
      {
        label: '申请人',
        form: dot.get(examineOrderDetail, 'applyAccountInfo.name', '--'),
      }, {
        label: isNewMoneyRule ? '付款金额(元)' : '总金额',
        form: Unit.exchangePriceCentToMathFormat(dot.get(examineOrderDetail, 'totalMoney', 0)),
      }, {
        label: '审批类型',
        form: type,
      }, {
        label: '审批流程',
        form: dot.get(examineOrderDetail, 'flowInfo.name', '--'),
      },
    ];

    // 基本信息的布局
    const layoutBase = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <CoreContent>
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItemsBase} cols={3} layout={layoutBase} />
        </Form>
      </CoreContent>
    );
  }

  // 渲染列表数据
  renderListInfo = () => {
    const { orderId } = this.state;
    const {
      examineOrderDetail = {},
      examineFlowConfig = {},
      loading,
      costOrdersData = {},
    } = this.props;

    const dataSource = dot.get(costOrdersData, 'data', []);
    const costOrdersCount = dot.get(costOrdersData, 'meta.count', 0);

    let platformCodes = [];
    if (examineOrderDetail.platformCodes) {
      platformCodes = examineOrderDetail.platformCodes;
    }
    // 获取审批流类型
    const applicationOrderType = dot.get(examineOrderDetail, 'applicationOrderType', 1);

    // 事务性审批单
    if (PagesHelper.apiByKey(applicationOrderType)) {
      return null;
    }

    // 如果是付款审批、物资采购单、房屋审批单，才能渲染
    if (applicationOrderType === OaApplicationOrderType.salaryRules
      || applicationOrderType === OaApplicationOrderType.salaryIssue
      || applicationOrderType === OaApplicationOrderType.borrowing
      || applicationOrderType === OaApplicationOrderType.repayments
      || applicationOrderType === OaApplicationOrderType.business
      || applicationOrderType === OaApplicationOrderType.overTime
      || applicationOrderType === OaApplicationOrderType.takeLeave
      || applicationOrderType === OaApplicationOrderType.turnover
    ) {
      return;
    }

    let { template } = this.state;

    const { isShowCreate } = this.private;
    const { approvalKey } = this.props.location.query;
    const isLoading = dot.get(loading.effects, 'expenseExamineOrder/fetchExamineOrderDetail', false);

    // const {
    // platformCodes = [], // 审批流使用平台
    // } = examineDetail;

    // 处理特殊字符，使用encodeURIComponent编码
    const platform = platformCodes[0] && typeof platformCodes[0] === 'string' ? encodeURIComponent(platformCodes[0]) : undefined;


    // 判断新建按钮显示及使用模板
    if (!isLoading) {
      // 判断，如果有房屋信息id，则渲染房屋模板
      if (examineOrderDetail.bizExtraHouseContractId) {
        this.private.isShowCreate = false;
        template = ExpenseCostOrderTemplateType.rent;
        // 默认渲染报销模板
      } else {
        this.private.isShowCreate = true;
      }
    }

    // 审批单所属平台（判断房屋费用单）
    const housePlatform = dot.get(examineOrderDetail, 'platformCodes.0', undefined);

    // 获取审批流配置
    const houseConfig = dot.get(examineFlowConfig, `${housePlatform}.accountings`, undefined);

    let isNewMoneyRule = false;
    const isCost = applicationOrderType === OaApplicationOrderType.cost;     // 是否是费用单子
    const isTravel = applicationOrderType === OaApplicationOrderType.travel;     // 是否是差旅单子
    const isHouse = applicationOrderType === OaApplicationOrderType.housing;     // 是否是房屋单子
    const isBorrowing = applicationOrderType === OaApplicationOrderType.borrowing;    // 是否是借款单子
    const isRepayments = applicationOrderType === OaApplicationOrderType.repayments;  // 是否是还款单子
    if (isCost || isTravel || isHouse || isBorrowing || isRepayments) {
      isNewMoneyRule = true;
    }

    // 费用单数据title
    const columns = [{
      title: '费用单号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '费用分组',
      dataIndex: 'costGroupName',
      key: 'costGroupName',
    }, {
      title: '平台',
      dataIndex: 'platformNames',
      key: 'platformNames',
      render: (text) => {
        if (is.array(text) && is.not.empty(text)) {
          return text.join(',');
        }
        return '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplierNames',
      key: 'supplierNames',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item).join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '城市',
      dataIndex: 'cityNames',
      key: 'cityNames',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item).join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictNames',
      key: 'bizDistrictNames',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item).join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '科目',
      dataIndex: ['costAccountingInfo', 'name'],
      key: 'costAccountingInfo.name',
      render: (text, record) => {
        return `${text}(${record.costAccountingCode})`;
      },
    }, {
      title: '成本归属',
      dataIndex: 'costCenterType',
      key: 'costCenterType',
      render: (text) => {
        if (text) {
          return ExpenseCostCenterType.description(text);
        }
        return '--';
      },
    }, {
      title: isNewMoneyRule ? '付款金额(元)' : '金额（元）',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return '--';
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        // 数据的创建人是否属于本人
        if (record.applyAccountId !== authorize.account.id) {
          return '';
        }
        // 费用单id
        const recordId = record.id;

        // 成本中心（获取科目下的成本中心）
        const costCenterType = dot.get(record, 'costAccountingInfo.costCenterType', undefined);

        // 操作
        const operations = [];

        // 根据模板类型确定传递的费用单id个数
        if (applicationOrderType === OaApplicationOrderType.travel && !isLoading) {
          operations.push(<a key="update" href={`/#/Expense/Manage/ExamineOrder/BusinessTravel/Update?recordId=${recordId}&orderId=${orderId}&approvalKey=${approvalKey}&platformParam=${platform}&platform=${platform}`} className={styles['app-comp-expense-form-cost-order-table-operate-btn']}>编辑</a>);
        } else if (`${template}` === `${ExpenseCostOrderTemplateType.refund}` && !isLoading) {
          operations.push(<a key="update" href={`/#/Expense/Manage/Template/Update?recordId=${recordId}&template=${template}&approvalKey=${approvalKey}&orderId=${orderId}&platformParam=${platform}&applicationOrderType=${applicationOrderType}&platform=${platform}`} className={styles['app-comp-expense-form-cost-order-table-operate-btn']}>编辑</a>);
        } else if (`${template}` === `${ExpenseCostOrderTemplateType.rent}` && !isLoading) {
          let pledgeRecordId = '';   // 押金费用id
          let agentRecordId = '';    // 中介费用id
          let rentRecordId = '';     // 房租费用id
          let pledgeLostRecordId = ''; // 押金损失费用id
          // 根据费用单的科目id与房屋合同费用单对应的费用科目id判断属于哪种类型的费用单
          dataSource.forEach((item) => {
            const costAccountingId = item.costAccountingId;  // 费用科目id

            // 判断，房屋信息的租金会计科目id === 费用科目id，则定义租金会计科目id
            if (dot.get(houseConfig, `rent_accounting_id.${costCenterType}`) === costAccountingId) {
              rentRecordId = item.id;

              // 判断，房屋信息的押金科目ID === 费用科目id，则定义押金科目ID
            } else if (dot.get(houseConfig, `pledge_accounting_id.${costCenterType}`) === costAccountingId) {
              pledgeRecordId = item.id;

              // 判断，房屋信息的中介费科目ID === 费用科目id，则定义中介费科目ID
            } else if (dot.get(houseConfig, `agent_accounting_id.${costCenterType}`) === costAccountingId) {
              agentRecordId = item.id;
              // 判断，房屋信息的押金损失科目ID === 费用科目id，则定义押金损失科目ID
            } else if (dot.get(houseConfig, `lost_accounting_id.${costCenterType}`) === costAccountingId) {
              pledgeLostRecordId = item.id;
            }
          });
          operations.push(
            <a
              key="update"
              href={`/#/Expense/Manage/Template/Update?pledgeRecordId=${pledgeRecordId}&agentRecordId=${agentRecordId}&rentRecordId=${rentRecordId}&pledgeLostRecordId=${pledgeLostRecordId}&template=${template}&approvalKey=${approvalKey}&orderId=${orderId}&platformParam=${platform}`}
              className={styles['app-comp-expense-form-cost-order-table-operate-btn']}
            >编辑</a>,
          );
        }
        // 删除操作 如果费用单详情加载完成 && 我待办的没有删除 && 房屋没有删除
        if (!isLoading && Number(approvalKey) !== ExpenseApprovalType.penddingVerify && OaApplicationOrderType.housing !== dot.get(examineOrderDetail, 'applicationOrderType', 0)) {
          operations.push(
            <Popconfirm
              key="delete"
              title="确定执行操作？"
              onConfirm={() => { this.onDeleteCostOrder(recordId); }}
              okText="确定"
              cancelText="取消"
            >
              <a className={styles['app-comp-expense-form-cost-order-table-operate-btn']}>删除</a>
            </Popconfirm>,
          );
        }
        return operations;
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: costOrdersCount,       // 数据总条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };

    // 新建费用单
    const titleExt = !isLoading && isShowCreate ? (<ExpenseCreateCostOrderComponent
      approvalKey={approvalKey}
      orderId={examineOrderDetail.id}
      flowId={examineOrderDetail.flowId}
      applicationOrderType={applicationOrderType}
      platformCode={platformCodes}
    />) : null;

    return (
      <CoreContent key="salaryRules" title="费用单数据" titleExt={titleExt}>
        <Table rowKey={record => record.id} dataSource={dataSource} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  // 渲染审批流列表数据 - 服务费规则
  renderFinanceListInfo = () => {
    const { costOrdersCount } = this.state;
    const { examineOrderDetail = {} } = this.props;

    // 获取审批流类型
    const applicationOrderType = dot.get(examineOrderDetail, 'applicationOrderType', 1);
    // 如果不是服务费规则审批单，return
    if (applicationOrderType !== OaApplicationOrderType.salaryRules) {
      return;
    }

    const columns = [{
      title: '单笔流水号',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      fixed: 'left',
    }, {
      title: '平台',
      dataIndex: 'platformNames',
      key: 'platformNames',
      render: text => text | '--',
    }, {
      title: '供应商',
      dataIndex: 'supplierNames',
      key: 'supplierNames',
      render: (text) => {
        if (is.array(text) && is.not.empty(text)) {
          return text.join(',');
        }
        return '--';
      },
    }, {
      title: '城市',
      dataIndex: 'cityNames',
      key: 'cityNames',
      render: (text) => {
        if (is.array(text) && is.not.empty(text)) {
          return text.join(',');
        }
        return '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictNames',
      key: 'bizDistrictNames',
      render: (text) => {
        if (is.array(text) && is.not.empty(text)) {
          return text.join(',');
        }
        return '--';
      },
    }, {
      title: '生效时间',
      dataIndex: ['salaryPlanVersionInfo', 'fromDate'],
      key: 'salaryPlanVersionInfo.fromDate',
      render: text => text || '--',
    }, {
      title: '版本号',
      dataIndex: 'salaryPlanVersionId',
      key: 'salaryPlanVersionId',
    }, {
      title: '试算月份',
      dataIndex: ['salaryComputeTaskInfo', 'fromDate'],
      key: 'salaryComputeTaskInfo.fromDate',
      render: (text) => {
        const time = text ? `${text}`.slice(4, 6) : '--';
        return `${time}月`;
      },
    }, {
      title: '试算总金额（元）',
      dataIndex: 'managementAmount',
      key: 'managementAmount',
      render: text => Unit.exchangePriceCentToMathFormat(text || 0),
    }, {
      title: '单据状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      fixed: 'right',
      render: (text) => {
        return ExpenseCostOrderState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        // 服务费规则id
        const id = dot.get(record, 'salaryPlanVersionInfo.planId', undefined);
        return <a key="detail" target="_blank" rel="noopener noreferrer" href={`/#/Finance/Rules?id=${id}`}>编辑</a>;
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: costOrdersCount,       // 数据总条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };
    const dataSource = [];
    dataSource.push(examineOrderDetail);
    return (
      <CoreContent title="费用单数据">
        <Table rowKey={record => record.id} dataSource={dataSource} columns={columns} pagination={pagination} bordered scroll={{ x: 1700 }} />
      </CoreContent>
    );
  }

  // 渲染审批流列表 - 服务费发放
  renderSalaryLssue = () => {
    const { examineOrderDetail = {}, dispatch } = this.props;
    // 数据为空，返回
    if (Object.keys(examineOrderDetail).length === 0) {
      return null;
    }
    // 判断是否是服务费发放的审批单
    const orderType = dot.get(examineOrderDetail, 'applicationOrderType');
    // 只渲染服务费发放
    if (orderType !== OaApplicationOrderType.salaryIssue) {
      return;
    }

    // 所属平台
    const platformCode = dot.get(examineOrderDetail, 'payrollStatementInfo.platformCode', 'elem');

    // 饿了么
    if (platformCode === 'elem') {
      return (
        <ElemSalarySummary
          detail={examineOrderDetail}
          dispatch={dispatch}
        />
      );
    }
    // 美团
    return (
      <MeituanSalarySummary
        detail={examineOrderDetail}
        dispatch={dispatch}
      />
    );
  }

  // 渲染审批单借款信息
  renderBorrowing = () => {
    const { examineOrderDetail = {} } = this.props;
    const { id, costOrderIds = [] } = examineOrderDetail;
    const content = [];
    if (OaApplicationOrderType.borrowing !== dot.get(examineOrderDetail, 'applicationOrderType') || !id) {
      return;
    }
    if (is.empty(costOrderIds)) {
      content.push(<span key="3"><Borrowing applicationOrderId={id} /></span>);
    } else {
      content.push(
        <span key="4">
          {
            costOrderIds.map((item, index) => {
              return <Borrowing borrowingId={item} key={index} />;
            })
          }
        </span>,
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }

  // 渲染审批单还款信息
  renderRepayments = () => {
    const { examineOrderDetail = {} } = this.props;
    // 费用单id列表
    const costOrderIds = dot.get(examineOrderDetail, 'costOrderIds', []);

    const content = [];
    if (OaApplicationOrderType.repayments !== dot.get(examineOrderDetail, 'applicationOrderType')) {
      return;
    }
    if (is.empty(costOrderIds)) {
      content.push(<span key="1"><Repayment /></span>);
    } else {
      content.push(
        <span key="2">
          {
            costOrderIds.map((item, index) => {
              return <Repayment repaymentId={item} key={index} />;
            })
          }
        </span>,
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }

  // 渲染出差申请
  renderBusinessTrip = () => {
    const { orderId } = this.state;
    const { examineOrderDetail = {} } = this.props;
    const { businessTravelOrderId } = examineOrderDetail;
    if (OaApplicationOrderType.business !== dot.get(examineOrderDetail, 'applicationOrderType')) {
      return;
    }
    if (!businessTravelOrderId) {
      return <BusinessTrip applicationOrderId={orderId} key="tripempty" />;
    }
    return <BusinessTrip businessTripId={businessTravelOrderId} applicationOrderId={orderId} key="tripfull" />;
  }

  // 加班
  renderOverTime = () => {
    const { examineOrderDetail = {} } = this.props; // 审批单详情

    const {
      applicationOrderType, // 审批单类型
      extraWorkOrLeaveId = undefined, // 加班单id
    } = examineOrderDetail;

    // 不为加班单，不渲染
    if (OaApplicationOrderType.overTime !== Number(applicationOrderType) || extraWorkOrLeaveId === undefined) {
      return null;
    }

    return <OverTime overTimeId={extraWorkOrLeaveId} />;
  }

  // 请假
  renderTakeLeave = () => {
    const { examineOrderDetail = {} } = this.props; // 审批单详情

    const {
      applicationOrderType, // 审批单类型
      extraWorkOrLeaveId, // 请假单id
    } = examineOrderDetail;

    // 不为请假单，不渲染
    if (OaApplicationOrderType.takeLeave !== applicationOrderType) {
      return;
    }

    return <TakeLeave takeLeaveId={extraWorkOrLeaveId} />;
  }

  // 渲染审核记录列表
  renderExpenseProcess = () => {
    const { orderId, copyGiveValues } = this.state;
    const { examineOrderDetail = {}, dispatch } = this.props;
    let isCopyGive = true; // 是否显示抄送
        // 审批单类型
    const { applicationOrderType } = examineOrderDetail;

    // 判断，如果当前审批单是成本类型，并且为付款审批，则渲染 抄送 按钮
    // 和提交按钮判断一样
    if (OaApplicationOrderType.salaryIssue === applicationOrderType
          || OaApplicationOrderType.salaryRules === applicationOrderType
          || OaApplicationOrderType.turnover === applicationOrderType
    ) {
      isCopyGive = false;
    }

    return (
      <ExpenseProcessComponent
        orderId={orderId}
        isCopyGive={isCopyGive}
        isSupportCc={examineOrderDetail.isSupportCc}
        applyAccountId={examineOrderDetail.applyAccountId}
        dispatch={dispatch}
        flowId={examineOrderDetail.flowId}
        data={examineOrderDetail.flowRecordList}
        currentFlowNode={examineOrderDetail.currentFlowNode}
        accountList={examineOrderDetail.operateAccountsList}
        fileUrlList={examineOrderDetail.fileUrlList}
        onSuccessCallback={this.onSuccessCallback}
        onChangeCopyGiveValues={this.onChangeCopyGiveValues}
        copyGiveValues={copyGiveValues}
      />
    );
  }


  // 渲染 提交 按钮
  renderSubmintButton = () => {
    // 审批单详情
    const { examineOrderDetail = {} } = this.props;

    // 审批单类型
    const { applicationOrderType } = examineOrderDetail;

    // 判断，如果当前审批单是成本类型，并且为付款审批，则渲染 提交 按钮
    if (OaApplicationOrderType.salaryIssue === applicationOrderType
      || OaApplicationOrderType.salaryRules === applicationOrderType
      || OaApplicationOrderType.turnover === applicationOrderType
    ) {
      return <div />;
    }
    return (
      <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
        <Button type="primary" onClick={this.onPresent}>提交</Button>
      </CoreContent>
    );
  }

  // 渲染弹窗内容
  renderModal = () => {
    const {
      visible, // 弹窗是否显示
      isDefault, // 提交用组件是否是初次默认值
    } = this.state;
    const { examineDetail = {}, form = {} } = this.props;
    const { getFieldDecorator } = form;

    // 如果不显示弹窗，return
    if (!visible || Object.keys(examineDetail).length === 0) {
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
      <Modal title="审批意见" visible={visible} onOk={this.onSubmit} onCancel={this.onHideModal}>
        <div className={styles['app-comp-expense-form-modal-next-approval-wrap']}>
          <p className={styles['app-comp-expense-form-modal-next-approval']}>请指派下一个节点的审批人</p>
        </div>
        <Form>
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  // 事务性审批单
  renderAffair = () => {
    const { examineOrderDetail = {}, location = {} } = this.props;
    const { approvalKey } = location.query;
    // 审批单id
    const { applicationOrderType } = examineOrderDetail;
    if (!PagesTypes.find(i => i.key === applicationOrderType)) return;
    return <AffairOrder detail={examineOrderDetail} approvalKey={approvalKey} />;
  }

  // 渲染关联审批列表和主题标签
  renderRelationApproval=() => {
    const formItemsTags = [
      <Form.Item
        label="主题标签"
        name="themeTag"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <div>
          <Select
            value={this.state.themeTags}
            mode="tags"
            notFoundContent=""
            onChange={this.onChangeThemeTags}
            tokenSeparators={[',', '，']}
            className={styles['app-comp-expense-form-theme-tag-selector']}
          />
          <Button type="primary" onClick={this.onSaveThemeTags}>
            保存
          </Button>
        </div>
      </Form.Item>,
    ];
    return (
      <ComponentRelatedApproval isType="update" formItemsTags={formItemsTags} orderId={this.state.orderId} />
    );
  }
  render = () => {
    const { examineOrderDetail = {} } = this.props;
    // 数据为空，返回null
    if (Object.keys(examineOrderDetail).length === 0) return <div />;
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染事务性关联审批和主题标签 */}
        {this.renderRelationApproval()}

        {/* 渲染列表数据 */}
        {this.renderListInfo()}

        {/* 渲染列表数据 非成本类 */}
        {this.renderFinanceListInfo()}

        {/* 渲染审批流列表 - 服务费发放 */}
        {this.renderSalaryLssue()}

        {/* 渲染审批流列表 - 借款列表 */}
        {this.renderBorrowing()}

        {/* 渲染审批流列表 - 还款列表 */}
        {this.renderRepayments()}

        {/* 渲染审批流列表 - 出差申请 */}
        {this.renderBusinessTrip()}

        {/* 渲染加班 */}
        {this.renderOverTime()}

        {/* 渲染请假 */}
        {this.renderTakeLeave()}

        {/* 事务性 */}
        {this.renderAffair()}

        {/* 渲染审核记录列表 */}
        {this.renderExpenseProcess()}

        {/* 表单提交按钮 */}
        {this.renderSubmintButton()}

        {/* 渲染操作弹窗 */}
        {this.renderModal()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseExamineOrder: { examineOrderDetail },
  expenseCostOrder: { costOrdersData },
  loading,
  expenseExamineFlow: { examineDetail, examineFlowConfig },
}) {
  return {
    examineOrderDetail,
    costOrdersData,
    loading,
    examineDetail,
    examineFlowConfig,
  };
}
export default connect(mapStateToProps)(Form.create()(SummaryTemplate));
