/**
 * oa单据页面 Expense/Manage/OaOrder
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tooltip, Table, Popconfirm } from 'antd';

import { CoreContent, CoreTabs } from '../../../../components/core';
import {
  ExpenseExamineOrderProcessState,
  ExpenseExamineOrderPaymentState,
  ExpenseApprovalType,
  ExpenseExamineOrderVerifyState,
  OaApplicationOrderType,
  ExpenseCostOrderBizType,
  AccountState,
} from '../../../../application/define';


import { authorize } from '../../../../application';
import Modules from '../../../../application/define/modules';

import Search from './search';
import { PagesHelper } from '../../../oa/document/define';

import styles from './style.less';

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
      loading: true, // 列表loading
    };

    this.private = {
      // 默认显示我待办的
      searchParams: {
        limit: 30,
        page: 1,
        applyAccountId: authorize.account.id,
        state: ExpenseExamineOrderProcessState.pendding,
        type: ExpenseCostOrderBizType.transactional,  // 事务性审批单
      },
    };
  }

  // 默认加载数据
  componentDidMount() {
    // 获取路由中的参数（需要跳转的tab key）
    const { selectedTabKey } = this.props.location.query;
    // 如果路由中有tab key参数 && 为 我待办 的 key，则获取 我待办 的数据
    if (Number(selectedTabKey) === ExpenseApprovalType.penddingVerify) {
      this.onSearch(); // 调用搜索重置
    } else {
      // 否则获取默认的 待提报 数据
      this.props.dispatch({
        type: 'expenseExamineOrder/fetchExamineOrders',
        payload: { ...this.private.searchParams, setLoading: () => this.setState({ loading: false }) },
      });
    }
  }

  // 离开页面后自动清空数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseExamineOrder/resetExamineOrders' });
  }

  // 搜索
  onSearch = (params = {}) => {
    const { selectedTabKey } = this.state;
    // 保存搜索的参数
    this.private.searchParams = {
      // 事务性审批单
      type: ExpenseCostOrderBizType.transactional,
      ...params,
    };
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
    // 我经手的 当前用户操作过的审批单（除申请人）
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

    // 抄送我的
    // 条件： 流程状态 = [审批流进行中，流程完成，流程关闭]
    if (Number(selectedTabKey) === ExpenseApprovalType.copyGive) {
      this.private.searchParams.cc_accounts = [authorize.account.id];
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

    this.setState({ loading: true });

    // 调用搜索
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchExamineOrders',
      payload: { ...this.private.searchParams, setLoading: () => this.setState({ loading: false }) },
    });
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
    this.setState({
      selectedTabKey,
    }, () => this.onSearch());
  }

  // 渲染tabs
  renderTabs = () => {
    // 获取路由参数，默认为 我待办 tab
    const { selectedTabKey } = this.props.location.query;
    const items = [];

    // 给我待提报加权限
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderReported)) {
      items.push(
        { title: '待提报', content: this.renderTabContent(ExpenseApprovalType.penddingSubmit), key: ExpenseApprovalType.penddingSubmit },
      );
    }

    // 我待办的加权限
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderStayDo)) {
      items.push(
        { title: '我待办的', content: this.renderTabContent(ExpenseApprovalType.penddingVerify), key: ExpenseApprovalType.penddingVerify },
      );
    }

    // 我提报的加权限
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderSubmission)) {
      items.push(
        { title: '我提报的', content: this.renderTabContent(ExpenseApprovalType.submit), key: ExpenseApprovalType.submit },
      );
    }

    // 我经手的加权限
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderHandle)) {
      items.push(
        { title: '我经手的', content: this.renderTabContent(ExpenseApprovalType.verify), key: ExpenseApprovalType.verify },
      );
    }

    // 抄送我的加权限
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderCopyGive)) {
      items.push(
        { title: '抄送我的', content: this.renderTabContent(ExpenseApprovalType.copyGive), key: ExpenseApprovalType.copyGive },
      );
    }

    // 全部加权限
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderAll)) {
      items.push(
        { title: '全部', content: this.renderTabContent(ExpenseApprovalType.all), key: ExpenseApprovalType.all },
      );
    }

    // 如果路由参数的tab key有值，则默渲染 我待办 tab，否则渲染 待提报 tab
    const defaultActiveKey = selectedTabKey || `${ExpenseApprovalType.penddingSubmit}`;

    return (
      <CoreTabs items={items} defaultActiveKey={defaultActiveKey} onChange={this.onSelectTab} />
    );
  }

  // 渲染tab内容
  renderTabContent = (key) => {
    return (
      <div>
        {/* 渲染搜索框 */}
        <Search onRef={this.onRef} selectedTabKey={this.state.selectedTabKey} onSearch={this.onSearch} />

        {/* 渲染内容栏目 */}
        {this.renderContent(key)}
      </div>
    );
  }

  // 渲染审批单操作
  renderOperation = (text, key, record) => {
    const pathname = dot.get(this.props, 'location.privateLocation.pathname', undefined);
    const isShowCode = pathname === '/Code/Manage/OAOrder';
    // 汇总记录id
    const orderId = record.id;
    // 审批单申请人id
    const applyAccountId = record.applyAccountInfo.id;
    // 当前审批单付款状态
    const {
      paidState, // 付款状态
      currentFlowNode,
      applicationOrderType, // 审批单类型
    } = record;
    // 显示的操作
    const operations = [];

    // 定义是否可编辑、查看、撤回、关闭、下载结算单、红冲、退款操作
    let canEdit = false;
    let canDelete = false;
    let canRecall = false;
    let canClose = false;

    // 数据处于待提交状态（草稿状态下）&& 数据的创建人是当前用户
    if (record.state === ExpenseExamineOrderProcessState.pendding && applyAccountId === authorize.account.id) {
      canEdit = true;
      canDelete = true;
    }

    // 数据处于待提交的节点下 && 数据的创建人是当前用户
    if ((record.state === ExpenseExamineOrderProcessState.pendding
      || record.state === ExpenseExamineOrderProcessState.processing)
      && record.currentFlowNodeInfo.id === undefined
      && applyAccountId === authorize.account.id
    ) {
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
    if (canEdit === true && authorize.canOperate(Modules.OperateExpenseManageOAOrderEditButton)) {
      // 审批类型不能是组织管理,组织管理不可编辑
      if (applicationOrderType !== PagesHelper.getDepartmentPostKey()) {
        const url = `/#/Expense/Manage/ExamineOrder/Form?orderId=${orderId}&approvalKey=${key}&isShowCode=${isShowCode}`;
        operations.push(
          <a
            key="update"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['app-comp-expense-exam-order-Table-operate-btn']}
          >编辑</a>,
        );
      }
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

    return operations;
  }

  // 渲染内容列表
  renderContent = (key) => {
    const { examineOrdersData } = this.props;
    const examineOrdersCount = dot.get(examineOrdersData, 'meta.count', 0);
    const dataSource = dot.get(examineOrdersData, 'data', []);
    const { loading, selectedTabKey } = this.state;

    const columns = [{
      title: '审批单号',
      dataIndex: 'id',
      key: 'id',
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
      title: '申请人',
      dataIndex: 'applyAccountInfo',
      key: 'applyAccountInfo',
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
      title: '实际申请人',
      dataIndex: 'actualApplyAccountInfo',
      key: 'actualApplyAccountInfo',
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
      title: '实际申请部门',
      dataIndex: ['actualApplyAccountDepartmentInfo', 'name'],
      key: 'actualApplyAccountDepartmentInfo.name',
      width: 100,
      render: text => text || '--',
    }, {
      title: '提报日期',
      dataIndex: 'submitAt',
      key: 'submitAt',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '审批流',
      dataIndex: 'flowInfo',
      key: 'flowInfo',
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
      key: 'applicationOrderType',
      width: 100,
      render: (text) => {
        return PagesHelper.titleByKey(text);
      },
    }, {
      title: '流程状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      render: text => ExpenseExamineOrderProcessState.description(text),
    }, {
      title: '当前节点',
      dataIndex: 'currentFlowNodeInfo',
      key: 'currentFlowNodeInfo',
      width: 120,
      render: (text, record) => {
        // 获取当前节点未处理人员列表
        const pendingAccountList = record.currentPendingAccountList;
        // 获取当前审批流进行状态、提报人信息、当前节点信息
        const { state, currentFlowNode, applyAccountInfo } = record;
        // 判断，如果当前节点存在，则渲染当前节点信息
        if (text && text.name && is.existy(currentFlowNode)) {
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
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
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
      pageSize: limit || 30,                        // 默认数据条数
      onChange: this.onChangePage,                // 切换分页
      total: examineOrdersCount,                  // 数据总条数
      showTotal: total => `总共${total}条`,        // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,                      // 显示快速跳转
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
    };

    if (page) {
      pagination.current = page;
    }

    const titleExt = `${selectedTabKey}` === `${ExpenseApprovalType.submit}`
                      ? (
                        <div>
                          组织管理申请单，请进入<a target="_blank" rel="noopener noreferrer" href="#/Organization/Manage/Department">组织架构模块</a>修改
                        </div>
                        )
                      : null;

    return (
      <CoreContent title="事务审批列表" titleExt={titleExt}>
        <Table
          rowKey={record => record.id}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          bordered
          loading={loading}
          scroll={{ x: 'max-content', y: 400 }}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染标签 */}
        {this.renderTabs()}
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { examineOrdersData } }) {
  return { examineOrdersData };
}
export default connect(mapStateToProps)(IndexPage);
