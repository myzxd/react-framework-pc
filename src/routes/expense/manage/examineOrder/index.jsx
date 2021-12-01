/**
 * 付款审批页面 Expense/Manage/ExamineOrder
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tooltip, Table, Button, Popconfirm, Row, Col, message } from 'antd';
import aoaoBossTools from '../../../../utils/util';
import { CoreContent, CoreTabs } from '../../../../components/core';
import {
  Unit,
  ExpenseExamineOrderProcessState,
  ExpenseExamineOrderPaymentState,
  ExpenseApprovalType,
  ExpenseExamineOrderVerifyState,
  OaApplicationOrderType,
  InvoiceAjustAction,
  ExpenseTicketState,
  AccountState,
} from '../../../../application/define';

import { authorize, system } from '../../../../application';
import { dotOptimal } from '../../../../application/utils';
import Operate from '../../../../application/define/operate';

import Search from './search';
import InvoiceAdjust from './modal/invoiceAdjust';

import styles from './style.less';

const { SearchComponentItems } = Search;

const ComponentTabKey = {

  // 显示的搜索条件
  // 待提报：  审批流、
  // 我待办的：平台、城市、供应商、商圈、审批流、（创建）
  // 我提报的：平台、城市、供应商、商圈、审批流、流程状态、
  // 我经手的：平台、城市、供应商、商圈、审批流、流程状态、
  // 全部：   平台、城市、供应商、商圈、审批流、流程状态、
  searchComponentItems(rawValue) {
    switch (Number(rawValue)) {
      case ExpenseApprovalType.penddingSubmit: return [SearchComponentItems.examine];
      case ExpenseApprovalType.penddingVerify: return [SearchComponentItems.scope, SearchComponentItems.examine, SearchComponentItems.creator];
      case ExpenseApprovalType.submit: return [SearchComponentItems.scope, SearchComponentItems.state, SearchComponentItems.examine];
      case ExpenseApprovalType.verify: return [SearchComponentItems.scope, SearchComponentItems.state, SearchComponentItems.examine, SearchComponentItems.creator];
      case ExpenseApprovalType.all: return [SearchComponentItems.scope, SearchComponentItems.state, SearchComponentItems.examine, SearchComponentItems.creator];
      default: return '--';
    }
  },
};

class IndexPage extends Component {
  static propTypes = {
    examineOrdersData: PropTypes.object,
  };

  static defaultProps = {
    examineOrdersData: {},
  };

  constructor(props) {
    super();
    const { selectedTabKey } = props.location.query;
    this.state = {
      selectedTabKey: selectedTabKey || ExpenseApprovalType.penddingSubmit, // 默认选中的tab
      isShowExpand: true,       // 判断搜索内容是否收起
      selectedRowKeys: [],       // 选中的表单号
      redRushRefundVisible: false, // 红冲和退款模态框的显示状态
      orderId: undefined,  // 红冲退款单号ID
      actionType: undefined, // 红冲20)和退款(10)的标识
    };
    this.private = {
      // 默认的搜索参数 ExpenseApprovalType.penddingSubmit
      searchParams: {
        limit: 30,
        page: 1,
        applyAccountId: authorize.account.id,
        state: ExpenseExamineOrderProcessState.pendding,
      },
    };
  }

  // 默认加载数据
  componentDidMount() {
    // 获取路由中的参数（需要跳转的tab key）
    const { selectedTabKey } = this.props.location.query;
    // 存储在本地的搜索参数
    const examineOrderSearchParams = system.searchParams('examineOrder');
    // 定义获取 我待办 数据参数
    const params = {
      limit: 30,
      page: 1,
      currentPendingAccount: authorize.account.id,
      state: ExpenseExamineOrderProcessState.processing,
      approvalType: dotOptimal(examineOrderSearchParams, 'approvalType', undefined),
    };

    // 如果路由中有tab key参数 && 为 我待办 的 key，则获取 我待办 的数据
    if (Number(selectedTabKey) === ExpenseApprovalType.penddingVerify) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrders', payload: params });
    } else {
      // 否则获取默认的 待提报 数据
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrders', payload: this.private.searchParams });
    }
  }

  // 离开页面后自动清空数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseExamineOrder/resetExamineOrders' });
    // 清空存储在本地的搜索参数
    system.setSearchParams('examineOrder', {});
  }

  // 显示红冲退款模态窗
  onShowRenderRedRushRefund = (order, action) => {
    this.setState({ redRushRefundVisible: true, orderId: order, actionType: action });
  }

  // 隐藏红冲退款模态窗
  onHideRenderRedRushRefund = () => {
    this.setState({ redRushRefundVisible: false });
  }
  // 搜索
  onSearch = (params = {}, refresh) => {
    const { selectedTabKey } = this.state;
    // 存储在本地的搜索参数
    const examineOrderSearchParams = system.searchParams('examineOrder');
    // 保存搜索的参数
    this.private.searchParams = params;
    if (is.not.existy(this.private.searchParams.page) || is.empty(this.private.searchParams.page)) {
      this.private.searchParams.page = 1;
    }
    if (is.not.existy(this.private.searchParams.limit) || is.empty(this.private.searchParams.limit)) {
      this.private.searchParams.limit = 30;
    }

    // 待提报：当前用户可编辑的审批单  （创建按钮）
    // 条件：申请人 = 当前用户 && 流程状态 = [待提交]
    if (Number(selectedTabKey) === ExpenseApprovalType.penddingSubmit) {
      this.private.searchParams.applyAccountId = authorize.account.id;
      this.private.searchParams.flag = undefined;
      this.private.searchParams.state = [
        ExpenseExamineOrderProcessState.pendding, // 付款审批状态 待提交
      ];
    }
    // 我待办的：当前用户需要审批的审批单
    // 条件：当前等待处理的人员账号列表 = [当前用户] && 流程状态 = [审批流进行中]
    if (Number(selectedTabKey) === ExpenseApprovalType.penddingVerify) {
      this.private.searchParams.currentPendingAccount = authorize.account.id;
      this.private.searchParams.flag = undefined;
      this.private.searchParams.state = [
        ExpenseExamineOrderProcessState.processing, // 付款审批状态 进行中
      ];
      this.private.searchParams.approvalType = dotOptimal(params, 'approvalType', undefined) || dotOptimal(examineOrderSearchParams, 'approvalType', undefined);
    }
    // 我提报的：当前用户提报的审批单
    // 条件：申请人 = 当前用户 && 流程状态 = [审批流进行中，流程完成，流程关闭]
    if (Number(selectedTabKey) === ExpenseApprovalType.submit) {
      this.private.searchParams.applyAccountId = authorize.account.id;
      this.private.searchParams.flag = undefined;
      if (is.not.existy(params.state) || is.empty(params.state)) {
        this.private.searchParams.state = [
          ExpenseExamineOrderProcessState.processing, // 付款审批状态 进行中
          ExpenseExamineOrderProcessState.finish, // 付款审批状态 完成
          ExpenseExamineOrderProcessState.close, // 付款审批状态 关闭
        ];
      }
    }
    // 我经手的：当前用户操作过的审批单（除申请人）
    // 条件：当前审批流已经手操作的人员账号列表 = [当前用户] && 流程状态 = [审批流进行中、流程关闭、流程完成]
    if (Number(selectedTabKey) === ExpenseApprovalType.verify) {
      this.private.searchParams.flowAccountId = authorize.account.id;
      this.private.searchParams.flag = undefined;
      if (is.not.existy(params.state) || is.empty(params.state)) {
        this.private.searchParams.state = [
          ExpenseExamineOrderProcessState.processing, // 付款审批状态 进行中
          ExpenseExamineOrderProcessState.finish, // 付款审批状态 完成
          ExpenseExamineOrderProcessState.close, // 付款审批状态 关闭
        ];
      }
    }

    // 全部
    // 条件： 流程状态 = [审批流进行中，流程完成，流程关闭]
    if (Number(selectedTabKey) === ExpenseApprovalType.all) {
      this.private.searchParams.flag = true;
      if (is.not.existy(params.state) || is.empty(params.state)) {
        this.private.searchParams.state = [
          ExpenseExamineOrderProcessState.processing, // 付款审批状态 进行中
          ExpenseExamineOrderProcessState.finish, // 付款审批状态 完成
          ExpenseExamineOrderProcessState.close, // 付款审批状态 关闭
        ];
      }
    }
    //  默认查询搜索清空表格选中的状态
    if (!refresh) {
      this.setState({
        selectedRowKeys: [],
      });
    }
    // 调用搜索
    this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrders', payload: this.private.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    //  第二个参数为区分分页搜索和查询搜索（查询搜索需要清空选中状态，分页搜索不需要）
    this.onSearch(searchParams, true);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    //  第二个参数为区分分页搜索和查询搜索（查询搜索需要清空选中状态，分页搜索不需要）
    this.onSearch(searchParams, true);
  }

  // 删除汇总数据
  onDelete = (examineId) => {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'expenseExamineOrder/deleteExamineOrder',
      payload: {
        id: examineId,
        onSuccessCallback: () => { this.onSearch(searchParams); },
      },
    });
  }

  // 申请人撤回审批单
  onRecall = (orderId) => {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'expenseExamineOrder/recallExamineOrder',
      payload: {
        id: orderId,
        onSuccessCallback: () => { this.onSearch(searchParams); },
      },
    });
  }

  // 申请人关闭审批单
  onClose = (orderId) => {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'expenseExamineOrder/closeExamineOrder',
      payload: {
        id: orderId, onSuccessCallback: () => { this.onSearch(searchParams); },
      },
    });
  }

  // 更换tab
  onSelectTab = (selectedTabKey) => {
    // 重置数据
    this.props.dispatch({ type: 'expenseExamineOrder/resetExamineOrders' });
    // 清空存储在本地的搜索参数
    system.setSearchParams('examineOrder', {});
    this.setState({
      selectedTabKey,
    }, () => this.onSearch());
  }

  // 收起搜索内容
  onToggle = (expand) => {
    this.setState({
      isShowExpand: expand,
    });
  }

  onSelectRow = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }
  // 获取外部审批单字段（判断是否为外部审批单）
  getPluginOrder = (item) => {
    const { pluginExtraMeta = {} } = item;

    if (is.existy(pluginExtraMeta) && pluginExtraMeta.is_plugin_order === true) {
      return true;
    }

    return false;
  }
  // 跳转到打印预览页面
  goPrintPreview = () => {
    const selectedRowKeys = JSON.stringify(this.state.selectedRowKeys);
    const num = this.state.selectedRowKeys.length;
    if (num <= 0) {
      message.warning('请勾选打印单子');
    } else if (num > 20) {
      message.warning(`最多同时打印20份,你已选择: ${num}份`);
    } else {
      aoaoBossTools.popUpCompatible(`/#/Expense/Manage/ExamineOrder/print?selectedRowKeys=${selectedRowKeys}`);
      // window.open(`/#/Expense/Manage/ExamineOrder/print?selectedRowKeys=${selectedRowKeys}`);
    }
  }

  // 按要求显示用户名称
  reduceAccountList = (list) => {
    if (!list || (typeof (list) === 'object' && Array === list.constructor && list.length === 0)) return '无';
    return list.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染tabs
  renderTabs = () => {
    // 获取路由参数，默认为 我待办 tab
    const { selectedTabKey } = this.props.location.query;
    const items = [];

    // 给我待提报加权限
    if (Operate.canOperateExpenseManageExamineOrderReported()) {
      items.push(
        { title: '待提报', content: this.renderTabContent(ExpenseApprovalType.penddingSubmit), key: ExpenseApprovalType.penddingSubmit },
      );
    }

    // 我待办的加权限
    if (Operate.canOperateExpenseManageExamineOrderStayDo()) {
      items.push(
        { title: '我待办的', content: this.renderTabContent(ExpenseApprovalType.penddingVerify), key: ExpenseApprovalType.penddingVerify },
      );
    }

    // 我提报的加权限
    if (Operate.canOperateExpenseManageExamineOrderSubmission()) {
      items.push(
        { title: '我提报的', content: this.renderTabContent(ExpenseApprovalType.submit), key: ExpenseApprovalType.submit },
      );
    }

    // 我经手的加权限
    if (Operate.canOperateExpenseManageExamineOrderHandle()) {
      items.push(
        { title: '我经手的', content: this.renderTabContent(ExpenseApprovalType.verify), key: ExpenseApprovalType.verify },
      );
    }

    // 全部加权限
    if (Operate.canOperateExpenseManageExamineOrderAll()) {
      items.push(
        { title: '全部', content: this.renderTabContent(ExpenseApprovalType.all), key: ExpenseApprovalType.all },
      );
    }

    // 如果路由参数的tab key有值，则默渲染 我待办 tab，否则渲染 待提报 tab
    const defaultActiveKey = selectedTabKey || `${ExpenseApprovalType.penddingSubmit}`;

    return (
      <CoreTabs
        items={items}
        defaultActiveKey={defaultActiveKey}
        onChange={this.onSelectTab}
      />
    );
  }

  // 渲染tab内容
  renderTabContent = (key) => {
    return (
      <div>
        {/* 渲染搜索框 */}
        {this.renderSearch(key)}

        {/* 渲染内容栏目 */}
        {this.renderContent(key)}
      </div>
    );
  }

  // 渲染搜索条件
  renderSearch = (key) => {
    // 获取当前Tab key，以及账户信息
    const { selectedTabKey, isShowExpand } = this.state;        // 当前Tab key
    const platforms = authorize.platform();

    // 定义获取审批流时的条件：平台
    let platformCodes = '';

    // 如果当前Tab不是全部，则平台为当前账户所属平台；否则为所有平台
    if (Number(selectedTabKey) !== ExpenseApprovalType.all && is.existy(platforms)) {
      platformCodes = platforms.map(item => item.id);
    }

    const { onSearch } = this;

    // 搜索的选项
    const componentItems = ComponentTabKey.searchComponentItems(key);
    return (
      <Search
        componentItems={componentItems}
        onSearch={onSearch}
        selectedTabKey={selectedTabKey}
        isShowMore
        isShowExpand={isShowExpand}
        onToggle={this.onToggle}
        platformCodes={platformCodes}
      />
    );
  }

  // 渲染审批单操作
  renderOperation = (text, key, record) => {
    const { selectedTabKey } = this.state;
    // 汇总记录id
    const orderId = record.id;
    // 审批单申请人id
    const applyAccountId = record.applyAccountInfo.id;
    // 当前审批单付款状态
    const {
      state, // 审批状态
      paidState, // 付款状态
      currentFlowNode,
      applicationOrderType, // 审批单类型
      applicationSubType, // 红冲/退款类型
      extraWorkOrLeaveId = undefined, // 加班单/请假单id
    } = record;
    // 显示的操作
    const operations = [];

    // 定义是否可编辑、查看、撤回、关闭、下载结算单、红冲、退款操作
    let canEdit = false;
    let canDelete = false;
    let canRecall = false;
    let canClose = false;
    // let canRedRush = false;
    let canRefund = false;

    // 如果在 我要提报或全部tab页面显示 且 流程状态为流程完成，审批单类型为费用申请 显示红冲和退款按钮
    if ((Number(selectedTabKey) === ExpenseApprovalType.submit || Number(selectedTabKey) === ExpenseApprovalType.all)
      && state === ExpenseExamineOrderProcessState.finish
      && applicationOrderType === OaApplicationOrderType.cost
      && paidState === ExpenseExamineOrderPaymentState.paid
      && applicationSubType === InvoiceAjustAction.normal
    ) {
      // canRedRush = true;
      canRefund = true;
    }

    // 数据处于待提交状态（草稿状态下）&& 数据的创建人是当前用户
    if (record.state === ExpenseExamineOrderProcessState.pendding && applyAccountId === authorize.account.id) {
      canEdit = true;
      canDelete = true;
    }

    // 数据处于待提交的节点下 && 数据的创建人是当前用户
    if ((record.state === ExpenseExamineOrderProcessState.pendding
      || record.state === ExpenseExamineOrderProcessState.processing)
      && record.currentFlowNodeInfo.id === undefined
      && applyAccountId === authorize.account.id) {
      canEdit = true;
    }

    // 判断审批单状态是进行中 && 当前账户是审批单提报人 && 未付款状态 && 当前节点不是提报节点
    if (record.state === ExpenseExamineOrderProcessState.processing
      && applyAccountId === authorize.account.id
      && paidState === ExpenseExamineOrderPaymentState.waiting
      && currentFlowNode !== undefined) {
      canRecall = true;
    }

    // (判断审批单上一次业务流程状态状态是撤回状态 || 审批单被驳回到申请人) && 当前节点是提报节点 && 当前账户是提报人 && 审批状态不等于外部审批
    if (
      (record.bizState === ExpenseExamineOrderVerifyState.reject
        || record.bizState === ExpenseExamineOrderVerifyState.recall)
      && record.state === ExpenseExamineOrderProcessState.processing
      && applyAccountId === authorize.account.id
      && currentFlowNode === undefined &&
      applicationOrderType !== OaApplicationOrderType.externalApproval) {
      canClose = true;
    }

    // 可以编辑 && 并且有权限编辑
    if (canEdit === true && Operate.canOperateExpenseManageEditButton() && applicationOrderType !== OaApplicationOrderType.turnover && applicationOrderType !== OaApplicationOrderType.externalApproval) {
      let url = `/#/Expense/Manage/ExamineOrder/Form?orderId=${orderId}&approvalKey=${key}`;

      // 退款审批单编辑页
      if (applicationSubType === InvoiceAjustAction.refund) {
        url = `/#/Expense/Manage/RefundForm?refundId=${orderId}`;
      }

      // 红冲审批单编辑页
      if (applicationSubType === InvoiceAjustAction.invoiceAdjust) {
        url = `/#/Expense/Manage/InvoiceAdjust?invoiceAdjustId=${orderId}`;
      }

      // 加班单未创建
      if (applicationOrderType === OaApplicationOrderType.overTime && extraWorkOrLeaveId === undefined) {
        url = `/#/Expense/Attendance/OverTime/Create?applicationOrderId=${orderId}`;
      }

      // 请假单未创建
      if (applicationOrderType === OaApplicationOrderType.takeLeave && extraWorkOrLeaveId === undefined) {
        url = `/#/Expense/Attendance/TakeLeave/Create?applicationOrderId=${orderId}`;
      }

      operations.push(
        <a
          key="update"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['app-comp-expense-exam-order-Table-operate-btn']}
        >编辑</a>,
      );
    } else {
      // 详情
      operations.push(
        <a
          key="detail"
          href={`javascript:void(window.open('/#/Expense/Manage/ExamineOrder/Detail?orderId=${orderId}&approvalKey=${key}'));`}
          rel="noopener noreferrer"
          className={styles['app-comp-expense-exam-order-Table-operate-btn']}
        >查看
        </a>,
      );
    }

    // 可以删除
    if (canDelete) {
      const deleteMessage = '确认删除？';
      operations.push(
        <Popconfirm key="delete" title={deleteMessage} onConfirm={() => { this.onDelete(orderId); }}>
          <a className={styles['app-comp-expense-exam-order-Table-operate-btn']}>删除</a>
        </Popconfirm>,
      );
    }
    // 可以撤回
    if (canRecall) {
      operations.push(
        <Popconfirm key="recall" title="是否确认撤回审批单" onConfirm={() => { this.onRecall(orderId); }}>
          <a className={styles['app-comp-expense-exam-order-Table-operate-btn']}>撤回</a>
        </Popconfirm>,
      );
    }

    // 可以关闭
    if (canClose) {
      operations.push(
        <Popconfirm key="close" title="是否确认关闭审批单" onConfirm={() => { this.onClose(orderId); }}>
          <a className={styles['app-comp-expense-exam-order-Table-operate-btn']} >关闭</a>
        </Popconfirm>,
      );
    }

    // 可以红冲
    // if (canRedRush && Operate.canOperateExpenseManageRedBluntButton()) {
      // if (record.redRushApplicationOrderId) {
        // operations.push(
          // <span className={styles['app-comp-expense-exam-order-Table-operate-btn-diable']} key="redrushdisable">红冲</span>,
        // );
      // } else {
        // operations.push(
          // <a type="primary" onClick={() => { this.onShowRenderRedRushRefund(orderId, InvoiceAjustAction.invoiceAdjust); }} className={styles['app-comp-expense-exam-order-Table-operate-btn']} key="redrush" >红冲</a>,
        // );
      // }
    // }

    // 可以退款
    if (canRefund && Operate.canOperateExpenseManageRefundButton()) {
      if (record.refundApplicationOrderId) {
        operations.push(
          <span className={styles['app-comp-expense-exam-order-Table-operate-btn-diable']} key="refunddisable">退款</span>,
        );
      } else {
        operations.push(
          <a type="primary" onClick={() => { this.onShowRenderRedRushRefund(orderId, InvoiceAjustAction.refund); }} className={styles['app-comp-expense-exam-order-Table-operate-btn']} key="refund">退款</a>,
        );
      }
    }

    return operations;
  }


  // 渲染内容列表
  renderContent = (key) => {
    const { examineOrdersData } = this.props;
    const examineOrdersCount = dot.get(examineOrdersData, 'meta.count', 0);
    const dataSource = dot.get(examineOrdersData, 'data', []);

    const { selectedTabKey, selectedRowKeys } = this.state;

    const columns = [{
      title: '审批单号',
      dataIndex: 'id',
      width: 100,
      fixed: 'left',
      render: text => (
        <div className={styles['app-comp-expense-exam-order-table-break-line']}>
          {text}
        </div>
      ),
    }, {
      title: '主题标签',
      dataIndex: 'themeLabelList',
      width: 100,
      fixed: 'left',
      render: (text, record) => {
        const themeLabelList = text || [];
        // 外部审批单主题标签
        const pluginLabelList = dot.get(record, 'pluginExtraMeta.theme_label_list', []);
        const labels = [...themeLabelList, ...pluginLabelList];
        // 如果标签长度大于3，只显示3条，其余用...显示
        if (is.not.empty(labels) && labels.length > 3) {
          return (
            <Tooltip title={labels.map(item => item).join(' 、 ')}>
              <div className={styles['app-comp-expense-exam-order-table-break-line']}>
                {dot.get(labels, '0')}、{dot.get(labels, '1')}、{dot.get(labels, '2')}...
              </div>
            </Tooltip>
          );
        }
        // 如果标签长度小于等于3，咋全部渲染
        if (is.not.empty(labels) && labels.length <= 3) {
          return (
            <div className={styles['app-comp-expense-exam-order-table-break-line']}>
              {labels.map(item => item).join('、')}
            </div>
          );
        }
        return '--';
      },
    }, {
      title: '是否有验票标签',
      dataIndex: 'inspectBillLabelList',
      key: 'isInspectBill',
      width: 120,
      fixed: 'left',
      render: (text) => {
        if (Array.isArray(text) && text.length > 0) {
          return '有';
        }
        return '无';
      },
    }, {
      title: '验票标签',
      dataIndex: 'inspectBillLabelList',
      width: 100,
      fixed: 'left',
      render: (text) => {
        // 如果标签长度大于3，只显示3条，其余用...显示
        if (Array.isArray(text) && text.length > 3) {
          return (
            <Tooltip title={text.map(item => item.name).join(' 、 ')}>
              <div className={styles['app-comp-expense-exam-order-table-break-line']}>
                {dot.get(text, '0').name}、{dot.get(text, '1').name}、{dot.get(text, '2').name}...
              </div>
            </Tooltip>
          );
        }
        // 如果标签长度小于等于3，咋全部渲染
        if (Array.isArray(text) && text.length <= 3) {
          return (
            <div className={styles['app-comp-expense-exam-order-table-break-line']}>
              {text.map(item => item.name).join('、')}
            </div>
          );
        }
        return '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platformNames',
      width: 70,
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        return text.map(item => item).join(' , ');
      },
    }, {
      title: '供应商',
      dataIndex: 'supplierNames',
      width: 150,
      render: (text, record) => {
        // 外部审批单供应商
        const pluginNames = dot.get(record, 'pluginExtraMeta.supplier_names', []);
        // 判断外部审批单
        const names = this.getPluginOrder(record) ? pluginNames : text;
        // 判断数据是否存在
        if (is.not.existy(names) || is.empty(names) || is.not.array(names)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (names.length === 1) {
          return dot.get(names, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={names.map(item => item).join(' , ')}>
            <span>{dot.get(names, '0')} 等{names.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '城市',
      dataIndex: 'cityNames',
      width: 70,
      render: (text, record) => {
        // 外部审批单城市
        const pluginNames = dot.get(record, 'pluginExtraMeta.city_names', []);
        // 判断外部审批单
        const names = this.getPluginOrder(record) ? pluginNames : text;
        // 判断数据是否存在
        if (is.not.existy(names) || is.empty(names) || is.not.array(names)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (names.length === 1) {
          return dot.get(names, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={names.map(item => item).join(' , ')}>
            <span>{dot.get(names, '0')} 等{names.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictNames',
      width: 150,
      render: (text, record) => {
        // 外部审批单城市
        const pluginNames = dot.get(record, 'pluginExtraMeta.biz_district_names', []);
        // 判断外部审批单
        const names = this.getPluginOrder(record) ? pluginNames : text;
        // 判断数据是否存在
        if (is.not.existy(names) || is.empty(names) || is.not.array(names)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (names.length === 1) {
          return dot.get(names, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={names.map(item => item).join(' , ')}>
            <span>{dot.get(names, '0')} 等{names.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '提报日期',
      dataIndex: 'submitAt',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '归属周期',
      dataIndex: 'belongTime',
      width: 100,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '申请人',
      dataIndex: 'applyAccountInfo',
      width: 100,
      render: (text) => {
        // 判断是否有值
        if (is.existy(text) && is.not.empty(text)) {
          // 判断状态是否是禁用的
          if (text.state === AccountState.off) {
            return text.name ? `${text.name}(${AccountState.description(text.state)})` : '--';
          }
          return text.name ? text.name : '--';
        }
        return '--';
      },
    }, {
      title: '费用总金额(元)',
      dataIndex: 'totalMoney',
      width: 150,
      render: (text, record) => {
        // 外部审批单
        if (this.getPluginOrder(record)) {
          return (<div className={`${styles['app-comp-expense-exam-order-table-break-line']} ${styles['app-comp-expense-exam-order-table-total-money']}`}>
            { Unit.exchangePriceCentToMathFormat(dot.get(record, 'pluginExtraMeta.total_money', '--'))}</div>);
        }
        if (text) {
          return (<div className={`${styles['app-comp-expense-exam-order-table-break-line']} ${styles['app-comp-expense-exam-order-table-total-money']}`}>
            {Unit.exchangePriceCentToMathFormat(text)}</div>);
        }
        return '--';
      },
    }, {
      title: '审批流',
      dataIndex: 'flowInfo',
      width: 100,
      render: (text) => {
        if (text) {
          return <div className={styles['app-comp-expense-exam-order-table-break-line']}>{text.name}</div>;
        }
        return '--';
      },
    }, {
      title: '审批类型',
      dataIndex: 'applicationOrderType',
      width: 100,
      render: (text) => {
        return OaApplicationOrderType.description(text);
      },
    }, {
      title: '流程状态',
      dataIndex: 'state',
      width: 100,
      render: text => ExpenseExamineOrderProcessState.description(text),
    }, {
      title: '当前节点',
      dataIndex: 'currentFlowNodeInfo',
      width: 120,
      render: (text, record) => {
        // 获取当前节点未处理人员列表
        const pendingAccountList = record.currentPendingAccountList;
        // 获取当前审批流进行状态、提报人信息、当前节点信息
        const { state, currentFlowNode, applyAccountInfo } = record;
        // 判断，如果当前节点存在，则渲染当前节点信息
        if (text && text.name && is.existy(currentFlowNode) && state === ExpenseExamineOrderProcessState.processing) {
          // 获取当前节点所有可操作人员列表、审批岗位列表
          const { postList = [], accountList: accountlist = [] } = text;
          // 定义渲染的数据列表
          const accountData = [];
          const postData = [];

          // 层级
          const levelData = [];
          // 当前节点未处理人员在所有人员列表中高亮
          pendingAccountList.forEach((account) => {
            const item = account;
            // 判断在当前节点所有操作人员中的未操作人员
            if (pendingAccountList.find(pendingAccount => pendingAccount.id === account.id) !== undefined) {
              item.isHeight = true;
            } else {
              item.isHeight = false;
            }
            levelData[levelData.length] = item;
          });

          // 当前节点未处理人员在所有人员列表中高亮
          accountlist.forEach((account) => {
            const item = account;
            // 判断在当前节点所有操作人员中的未操作人员
            if (pendingAccountList.find(pendingAccount => pendingAccount.id === account.id) !== undefined) {
              item.isHeight = true;
            } else {
              item.isHeight = false;
            }
            accountData.push(item);
          });
          // 当前节点未处理人员所在岗位在审批岗位列表中高亮
          postList
            && typeof (postList) === 'object'
            && Array === postList.constructor
            && postList.forEach((account) => {
              const item = account;
              // 判断在当前节点所有操作人员中的未操作人员
              if (pendingAccountList.some((pendItem) => {
                const a = item.account_info_list || [];
                return a.some((accountItem) => {
                  return accountItem._id === pendItem.id || pendItem._id;
                });
              })) {
                item.isHeight = true;
              } else {
                item.isHeight = false;
              }
              postData.push(item);
            });
          // 定义气泡显示
          const title = (
            <span>
              {text.name}
              (
              <span>
                {
                  postData.map((item, index) => {
                    const a = item.account_info_list || [];
                    return (
                      <span
                        className={item.isHeight === true ? styles['app-comp-expense-exam-order-now-point-colored'] : ''}
                        key={`postData${index}`}
                      >
                        {item.post_name}
                        (
                          {
                          a.reduce((acc, cur, idx) => {
                            if (idx === 0) return cur.name;
                            return `${acc}, ${cur.name}`;
                          }, '')
                        }
                        )
                        {index !== postData.length - 1 ? ' , ' : null}
                      </span>);
                  })
                }
              </span>
              {
                postData
                  && accountData
                  && postData.length > 0
                  && accountData.length > 0
                  ? ', '
                  : ''
              }
              <span>
                {
                  accountData.map((item, index) => {
                    return (
                      <span
                        className={item.isHeight === true ? styles['app-comp-expense-exam-order-now-point-colored'] : ''}
                        key={`accountData${index}`}
                      >
                        {item.name}
                        {index !== accountData.length - 1 ? ' , ' : null}
                      </span>);
                  })
                }
              </span>
              <span>
                {
                  accountData.length < 1 && postData.length < 1
                    ? levelData.map((i, index) => {
                      return (
                        <span>
                          {i.name}
                          {index !== levelData.length - 1 ? ' , ' : null}
                        </span>
                      );
                    })
                    : ''
                }
              </span>
              )
            </span>
          );
          return (
            <Tooltip title={title}>
              <div className={`${styles['app-comp-expense-exam-order-table-break-line']} ${styles['app-comp-expense-exam-order-table-now-point']}`}>
                {
                  `${text.name}(${is.not.empty(pendingAccountList) ? pendingAccountList.reduce((acc, cur, idx) => {
                    if (idx === 0) return cur.name;
                    return `${acc}, ${cur.name}`;
                  }, '') : ''})`.length >= 10
                    ? `${`${text.name}(${is.not.empty(pendingAccountList) ? pendingAccountList.reduce((acc, cur, idx) => {
                      if (idx === 0) return cur.name;
                      return `${acc}, ${cur.name}`;
                    }, '') : ''})`.substring(0, 10)}...`
                    : `${text.name}(${is.not.empty(pendingAccountList) ? pendingAccountList.reduce((acc, cur, idx) => {
                      if (idx === 0) return cur.name;
                      return `${acc}, ${cur.name}`;
                    }, '') : ''})`
                }
              </div>
            </Tooltip>
          );
        }

        // 如果当前节点不存在，并且审批流进行中，则当前节点为提报节点
        if (is.not.existy(currentFlowNode) && state === ExpenseExamineOrderProcessState.processing) {
          return `提报节点(${applyAccountInfo.name})`;
        }

        // 如果，当前节点不存在，并且审批流流程完成、关闭、待提交、删除，则返回‘--’
        return '--';
      },
    }, {
      title: '付款状态',
      dataIndex: 'paidState',
      width: 100,
      render: text => ExpenseExamineOrderPaymentState.description(text),
    }, {
      title: '付款日期',
      dataIndex: 'paidAt',
      width: 150,
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '付款异常说明',
      dataIndex: 'paidNote',
      render: (text) => {
        if (is.empty(text) || is.not.existy(text)) {
          return '--';
        }
        // 判断字符串长度是否超过20
        if (text.length <= 100) {
          return <span>{text}</span>;
        }

        // 超过20显示省略号，加上气泡
        return (
          <Tooltip title={<span className={styles['app-comp-expense-exam-order-table-paid-note']}>{text}</span>}>
            <span>{text.substring(0, 100)}...</span>
          </Tooltip>
        );
      },
    }, {
      title: '验票状态',
      dataIndex: 'inspectBillState',
      width: 150,
      render: (text) => {
        if (text) {
          return ExpenseTicketState.description(text);
        }
        return '--';
      },
    }, {
      title: '验票日期',
      dataIndex: 'inspectBillAt',
      width: 150,
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '验票说明',
      dataIndex: 'inspectBillNote',
      width: 150,
      render: (text) => {
        if (is.empty(text) || is.not.existy(text)) {
          return '--';
        }
        // 判断字符串长度是否超过20
        if (text.length <= 100) {
          return <span className={styles['app-comp-expense-exam-order-table-break-line']}>{text}</span>;
        }

        // 超过20显示省略号，加上气泡
        return (
          <Tooltip title={<span className={styles['app-comp-expense-exam-order-table-paid-note']}>{text}</span>}>
            <span>{text.substring(0, 100)}...</span>
          </Tooltip>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return this.renderOperation(text, key, record);
      },
    }];

    // 当前页码
    const { page, limit } = this.private.searchParams;
    // 分页
    const pagination = {
      pageSize: limit || 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: examineOrdersCount,                     // 数据总条数
      showTotal: total => `总共${total}条`,  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,                // 显示快速跳转
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
    };

    if (page) {
      pagination.current = page;
    }
    // 根据Tab中我经手的、我待办的、全部，表格左侧出现选择框
    let rowSelection = null;
    // 默认不显示批量打印的按钮
    let printButton = false;
    switch (Number(selectedTabKey)) {
      case ExpenseApprovalType.submit:
      case ExpenseApprovalType.verify:
      case ExpenseApprovalType.all:
        printButton = true;
        rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectRow,
          columnWidth: 60,
          getCheckboxProps: (record) => {
            const { pluginExtraMeta = {} } = record;
            let isPluginOrder = false;

            // 外部审批单不能打印
            if (is.existy(pluginExtraMeta)) {
              isPluginOrder = pluginExtraMeta.is_plugin_order;
            }

            return {
              disabled: (
                !(record.applicationOrderType === 1 ||
                record.applicationOrderType === 4 ||
                record.applicationOrderType === 5 ||
                record.applicationOrderType === 6 ||
                record.applicationOrderType === 7 ||
                record.applicationOrderType === 8 ||
                record.applicationOrderType === 9 ||
                record.applicationOrderType === 10 ||
                record.applicationOrderType === 11
                ) || isPluginOrder
              ),
            };
          },
        };
        break;
      default:
        rowSelection = null;
        break;
    }
    return (
      <CoreContent>
        {/* 数据 */}
        <div className={styles['app-comp-expense-exam-order-table-header']}>
          <Row>
            <Col span={21} className={styles['app-comp-expense-exam-order-table-header-col']}>
              <span className={styles.headerLeftSpan} />
              <span>付款审批列表</span>
            </Col>
            {
              printButton ? (<Col span={3}>
                <Button type="primary" onClick={this.goPrintPreview}>批量打印</Button>
              </Col>) : ''
            }
          </Row>
        </div>
        <Table rowSelection={rowSelection} rowKey={record => record.id} dataSource={dataSource} columns={columns} pagination={pagination} bordered scroll={{ x: printButton ? 2865 : 2700, y: 400 }} />
      </CoreContent>
    );
  }

  // 渲染红冲退款的模态框
  renderHongChongRefundModal = () => {
    const { redRushRefundVisible, selectedTabKey, orderId, actionType } = this.state;
    const { onHideRenderRedRushRefund } = this;
    const props = {
      dispatch: this.props.dispatch,
      visible: redRushRefundVisible,
      onCancel: onHideRenderRedRushRefund,
      selectedTabKey,
      OrderId: orderId,
      ActionType: actionType,
    };
    return (
      <InvoiceAdjust {...props} />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染标签 */}
        {this.renderTabs()}
        {/* 渲染红冲退款的模态框 */}
        {this.renderHongChongRefundModal()}
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { examineOrdersData } }) {
  return { examineOrdersData };
}
export default connect(mapStateToProps)(IndexPage);
