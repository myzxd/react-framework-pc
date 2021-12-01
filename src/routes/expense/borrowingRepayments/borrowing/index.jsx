/**
 * 费用管理 - 借还款管理 - 借款管理列表页   /Expense/BorrowingRepayments/Borrowing
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Popover, Tooltip } from 'antd';
import { CoreContent, CoreTabs } from '../../../../components/core';

import Operate from '../../../../application/define/operate';
import {
  Unit,
  ExpenseBorrowRepaymentsTabType,
  ExpenseExamineOrderProcessState,
  BorrowType,
  ExpenseRepaymentState,
  ExpenseExamineOrderPaymentState,
} from '../../../../application/define';
import Search from './search';
import RepaymentsModal from './components/modal/repaymentsModal';
import style from './style.css';

import { authorize } from '../../../../application';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repaymentsVisible: false,       // 还款弹窗是否显示
      activeKey: ExpenseBorrowRepaymentsTabType.mine,    // tab key
      borrowOrderId: '',              // 还款弹窗传入的借款单号
      isShowExpand: true,       // 判断搜索内容是否收起
      flowInfo: {},             // 需要还款的借款单审批的审批流
      state: undefined,
    };

    this.private = {
      searchParams: {
        limit: 30,
        page: 1,
        applyAccountId: authorize.account.id,
      },
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'borrowingRepayment/fetchBorrowingOrders', payload: this.private.searchParams });
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'borrowingRepayment/resetBorrowingOrders',
    });
  }

  // 显示还款弹窗
  onShowRepaymentsModal = (id, flowInfo = {}, state) => {
    this.setState({
      repaymentsVisible: true,
      borrowOrderId: id,
      flowInfo,
      state,
    });
  }

  // 显示还款弹窗
  onHideRepaymentsModal = () => {
    this.setState({
      repaymentsVisible: false,
      borrowOrderId: '',
    });
  }

  // 查询
  onSearch = (params = {}) => {
    const { activeKey } = this.state;
    // 保存搜索信息
    this.setState({
      searchInfo: params,
    });

    // 保存搜索的参数
    this.private.searchParams = params;

    // 如果没有页码参数，则赋值
    if (is.not.existy(this.private.searchParams.page) || is.empty(this.private.searchParams.page)) {
      this.private.searchParams.page = 1;
    }

    // 如果没有条数参数，则赋值
    if (is.not.existy(this.private.searchParams.limit) || is.empty(this.private.searchParams.limit)) {
      this.private.searchParams.limit = 30;
    }

    // 如果tab时‘我的’，则传入登录账号
    if (Number(activeKey) === ExpenseBorrowRepaymentsTabType.mine) {
      this.private.searchParams.applyAccountId = authorize.account.id;
    }

    // 调用搜索
    this.props.dispatch({ type: 'borrowingRepayment/fetchBorrowingOrders', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 切换tab
  onChangeTab = (activeKey) => {
    const { dispatch } = this.props;
    // 重置数据
    dispatch({ type: 'borrowingRepayment/resetBorrowingOrders' });
    // 更新tab key，并重新获取数据
    this.setState({ activeKey }, () => this.onSearch());
  }

  // 收起搜索内容
  onToggle = (expand) => {
    this.setState({
      isShowExpand: expand,
    });
  }

  // 渲染查询组件
  renderSearch = () => {
    const { onSearch } = this;
    const { activeKey, isShowExpand } = this.state;
    return (
      <Search
        onSearch={onSearch}
        activeKey={activeKey}
        expand={isShowExpand}
        onToggle={this.onToggle}
      />
    );
  }

  // 渲染当前节点信息
  renderCurrentFlowNodeInfo = (text) => {
    // 获取当前节点未处理人员列表
    const pendingAccountList = dot.get(text, 'current_pending_account_list', []);

    // 当前审批流进行状态
    const state = dot.get(text, 'state');
    // 当前节点id
    const currentFlowNode = dot.get(text, 'current_flow_node', '');
    // 当前节点信息
    const currentFlowNodeInfo = dot.get(text, 'current_flow_node_info', {});
    // 提报人信息
    const applyAccountInfo = dot.get(text, 'apply_account_info', {});

    // 判断，如果当前节点存在，则渲染当前节点信息
    if (currentFlowNodeInfo && currentFlowNodeInfo.name && is.existy(currentFlowNode)) {
      // 获取当前节点所有可操作人员列表
      const accountlist = dot.get(currentFlowNodeInfo, 'account_list', []);
      const postList = dot.get(currentFlowNodeInfo, 'post_list', []);
      // 定义渲染的数据列表
      const data = [];
      const postData = [];

      // 当前节点未处理人员在所有人员列表中高亮
      accountlist.forEach((account) => {
        const item = account;

        // 判断在当前节点所有操作人员中的未操作人员
        if (pendingAccountList.find(pendingAccount => pendingAccount._id === account._id) !== undefined) {
          item.isHeight = true;
        } else {
          item.isHeight = false;
        }
        data.push(item);
      });
      // 当前节点未处理人员所在岗位在审批岗位列表中高亮
      postList
        && typeof (postList) === 'object'
        && Array === postList.constructor
        && postList.forEach((account) => {
          const item = account;
          // 判断在当前节点所有操作人员中的未操作人员
          if (pendingAccountList.some((pendItem) => {
            return item.account_info_list.some((accountItem) => {
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
          {currentFlowNodeInfo.name}
          (
          <span>
            {
              postData.map((item, index) => {
                return (
                  <span
                    className={item.isHeight === true ? style['app-comp-expense-borrowing-node-color'] : null}
                    key={`postData${index}`}
                  >
                    {item.post_name}
                    (
                      {
                      item.account_info_list.reduce((acc, cur, idx) => {
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
              && data
              && postData.length > 0
              && data.length > 0
              ? ', '
              : ''
          }
          <span>
            {
              data.map((item, index) => {
                return (
                  <span
                    className={item.isHeight === true ? style.boss_expense_borrowing_node_color : null}
                    key={`data${index}`}
                  >
                    {item.name}
                    {index !== data.length - 1 ? ' , ' : null}
                  </span>);
              })
            }
          </span>
          )
        </span>
      );

      return (
        <Tooltip title={title}>
          <div className={style['app-comp-expense-borrowing-tooltip']}>
            {
              `${currentFlowNodeInfo.name}(${is.not.empty(pendingAccountList) ? pendingAccountList.reduce((acc, cur, idx) => {
                if (idx === 0) return cur.name;
                return `${acc}, ${cur.name}`;
              }, '') : ''})`.length >= 10
                ? `${`${currentFlowNodeInfo.name}(${is.not.empty(pendingAccountList) ? pendingAccountList.reduce((acc, cur, idx) => {
                  if (idx === 0) return cur.name;
                  return `${acc}, ${cur.name}`;
                }, '') : ''})`.substring(0, 10)}...`
                : `${currentFlowNodeInfo.name}(${is.not.empty(pendingAccountList) ? pendingAccountList.reduce((acc, cur, idx) => {
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
  }

  // 渲染内容列表
  renderContent = () => {
    // 获取借款单列表相关数据
    const { borrowingOrders } = this.props;

    // 借款单列表数据
    const data = dot.get(borrowingOrders, 'data', []);

    // 借款单条码信息
    const meta = dot.get(borrowingOrders, '_meta', {});
    const dataCount = dot.get(meta, 'result_count', 0);

    const columns = [{
      title: '借款单号',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      fixed: 'left',
      render: text => (
        <div className={style['app-comp-expense-borrowin-id']}>
          {text}
        </div>
      ),
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      width: 70,
      fixed: 'left',
      render: text => text || '--',
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 150,
      fixed: 'left',
      render: text => text || '--',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      width: 70,
      fixed: 'left',
      render: text => text || '--',
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      width: 150,
      fixed: 'left',
      render: text => text || '--',
    }, {
      title: '实际借款人',
      dataIndex: 'actual_loan_info',
      key: 'actual_loan_info.name',
      width: 100,
      fixed: 'left',
      render: (text) => {
        const name = dot.get(text, 'name');
        return (
          <div className={style['app-comp-expense-borrowing-actual-borrower']}>
            {name}
          </div>
        );
      },
    }, {
      title: '借款类型',
      dataIndex: 'loan_type',
      key: 'loan_type',
      width: 100,
      render: text => BorrowType.description(text) || '--',
    }, {
      title: '借款事由',
      dataIndex: 'loan_note',
      key: 'loan_note',
      width: 100,
      render: (text) => {
        // 判断是否为空
        if (is.not.existy(text) || is.empty(text)) {
          return '--';
        }
        // 判断长度
        if (text.length <= 11) {
          return (
            <span>
              {text}
            </span>
          );
        }
        return (
          <Popover content={text} title="借款事由" trigger="hover">
            <div>{text.slice(0, 11)}...</div>
          </Popover>
        );
      },
    }, {
      title: '审批流',
      dataIndex: 'application_order_info',
      key: 'application_order_info.flow_info',
      width: 160,
      render: (text) => {
        const name = dot.get(text, 'flow_info.name', undefined);
        return <div className={style['app-comp-expense-borrowing-flow-info']}>{name}</div> || '--';
      },
    }, {
      title: '流程状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      render: text => ExpenseExamineOrderProcessState.description(text) || '--',
    }, {
      title: '当前节点',
      dataIndex: 'application_order_info',
      key: 'currentFlowNodeInfo',
      width: 150,
      render: (text) => {
        return this.renderCurrentFlowNodeInfo(text);
      },
    }, {
      title: '付款状态',
      dataIndex: 'paid_state',
      key: 'paid_state',
      width: 100,
      render: text => ExpenseExamineOrderPaymentState.description(text) || '--',
    }, {
      title: '借款金额（元）',
      dataIndex: 'loan_money',
      key: 'loan_money',
      width: 120,
      render: text => Unit.exchangePriceCentToMathFormat(text) || '--',
    }, {
      title: '已还金额（元）',
      dataIndex: 'repayment_money',
      key: 'repayment_money',
      width: 120,
      render: text => Unit.exchangePriceCentToMathFormat(text) || '--',
    }, {
      title: '未还金额（元）',
      dataIndex: 'non_repayment_money',
      key: 'non_repayment_money',
      width: 120,
      render: text => Unit.exchangePriceCentToMathFormat(text) || '--',
    }, {
      title: '还款状态',
      dataIndex: 'repayment_state',
      key: 'repayment_state',
      width: 100,
      render: text => ExpenseRepaymentState.description(text) || '--',
    }, {
      title: '申请人',
      dataIndex: 'apply_account_info',
      key: 'apply_account_info.name',
      width: 100,
      render: (text) => {
        return dot.get(text, 'name', '--');
      },
    }, {
      title: '申请借款时间',
      dataIndex: 'submit_at',
      key: 'submit_at',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '预计还款时间',
      dataIndex: 'expected_repayment_time',
      key: 'expected_repayment_time',
      width: 120,
      render: text => text || '--',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        const {
          state,              // 审批流流程状态
          non_repayment_money: nonRepaymentMoney,     // 未还款金额(包含待提报及进行中的还款单还款金额)
          wait_repayment_money: waitRepaymentMoney,   // 待还款金额（待提报及进行中的还款单还款金额，当审批完成时为0）
          application_order_id: applicationOrderId,   // 审批单id
          _id: borrowOrderId,                         // 借款单id
          apply_account_info: applyAccountInfo,       // 审批人信息
          repayment_state: repaymentState,            // 还款状态
        } = record;

        // 获取借款审批流
        const flowInfo = dot.get(record, 'application_order_info.flow_info', {});

        // 审批流状态
        const flowState = dot.get(flowInfo, 'state', undefined);

        // 当前登录账号id
        const accountId = authorize.account.id;
        // 申请人id
        const applyAcccountId = dot.get(applyAccountInfo, '_id');
        // 实际未还款金额（不包含待提报及进行中的还款单还款金额）
        const money = nonRepaymentMoney - waitRepaymentMoney;

        const operations = [];

        // 判断借款单的审批状态是完成 && 当前登录账户是申请人 && 当前借款单还款状态不为已还 && 实际未还款金额不能为0 && 角色有操作权限，才能进行还款
        if (state === ExpenseExamineOrderProcessState.finish
          && accountId === applyAcccountId
          && repaymentState !== ExpenseRepaymentState.hasAlso
          && money !== 0
          && Operate.canOperateExpenseRepaymentOrderCreate() === true) {
          operations.push(
            <a
              className={style['app-comp-expense-borrowing-operation-reimbursement']}
              key="repayments"
              onClick={() => this.onShowRepaymentsModal(borrowOrderId, flowInfo, flowState)}
            >还款
            </a>,
          );
        }

        // 判断是否有查看借款单详情页面的权限
        if (Operate.canOperateExpenseBorrowOrderDetail()) {
          operations.push(
            <a
              key="detail"
              href={`/#/Expense/BorrowingRepayments/Borrowing/Detail?approvalId=${borrowOrderId}&orderId=${applicationOrderId}`}
              target="_blank"
              rel="noopener noreferrer"
            >查看
            </a>,
          );
        }

        return operations;
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dataCount,                     // 数据总条数
      showTotal: total => `总共${total}条`,  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,                // 显示快速跳转
      showSizeChanger: true,                // 显示分页
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
    };

    // 当前页码
    const { page } = this.private.searchParams;
    if (page) {
      pagination.current = page;
    }

    return (
      <CoreContent title="借款列表" >
        <Table
          rowKey={record => record._id}
          dataSource={data}
          columns={columns}
          bordered
          pagination={pagination}
          scroll={{ x: 2280, y: 400 }}
        />
      </CoreContent>
    );
  }

  // 渲染Tan内容
  renderTabContent = () => {
    return (
      <div>
        {/** 渲染查询组件 */}
        {this.renderSearch()}

        {/** 渲染表格数据 */}
        {this.renderContent()}
      </div>
    );
  }

  // 渲染Tab
  renderTabs = () => {
    const items = [];
    if (Operate.canOperateExpenseBorrowOrderMy()) {
      items.push({ title: '我的', content: this.renderTabContent(ExpenseBorrowRepaymentsTabType.mine), key: ExpenseBorrowRepaymentsTabType.mine });
    }
    if (Operate.canOperateExpenseBorrowOrderAll()) {
      items.push({ title: '全部', content: this.renderTabContent(ExpenseBorrowRepaymentsTabType.all), key: ExpenseBorrowRepaymentsTabType.all });
    }

    return (
      <CoreTabs items={items} onChange={this.onChangeTab} defaultActiveKey={`${ExpenseBorrowRepaymentsTabType.mine}`} />
    );
  }

  // 渲染还款弹窗
  renderRepaymentsModal = () => {
    const {
      repaymentsVisible,
      borrowOrderId,
      // flowInfo, 因不需要默认显示审批流。
      state,
    } = this.state;
    const { onHideRepaymentsModal } = this;

    const props = {
      dispatch: this.props.dispatch,
      visible: repaymentsVisible,
      onCancel: onHideRepaymentsModal,
      borrowOrderId,
      // flowInfo,
      state,
    };
    return (
      <RepaymentsModal {...props} />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染Tab */}
        {this.renderTabs()}
        {/* 渲染弹窗 */}
        {this.renderRepaymentsModal()}
      </div>
    );
  }
}

function mapStateToProps({ borrowingRepayment: { borrowingOrders } }) {
  return { borrowingOrders };
}
export default connect(mapStateToProps)(Index);
