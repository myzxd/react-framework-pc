/**
 * 费用管理 - 考勤管理 - 请假管理
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Popover } from 'antd';
import { CoreContent, CoreTabs } from '../../../../components/core';

import Operate from '../../../../application/define/operate';
import {
  ExpenseBorrowRepaymentsTabType,
  ExpenseExamineOrderProcessState,
  ExpenseAttendanceTakeLeaveType,
} from '../../../../application/define';
import Search from './search';

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
    this.props.dispatch({ type: 'expenseTakeLeave/fetchExpenseTakeLeaveList', payload: this.private.searchParams });
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'expenseTakeLeave/resetExpenseTakeLeave',
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
    this.props.dispatch({ type: 'expenseTakeLeave/fetchExpenseTakeLeaveList', payload: this.private.searchParams });
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
    dispatch({ type: 'expenseTakeLeave/resetExpenseTakeLeave' });
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
    const { dispatch } = this.props;
    return (
      <Search
        onSearch={onSearch}
        dispatch={dispatch}
        activeKey={activeKey}
        expand={isShowExpand}
        onToggle={this.onToggle}
      />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    // 获取借款单列表相关数据
    const { expenseTakeLeaveMineList } = this.props;
    // 借款单列表数据
    const data = dot.get(expenseTakeLeaveMineList, 'data', []);

    // 借款单条码信息
    const meta = dot.get(expenseTakeLeaveMineList, '_meta', {});
    const dataCount = dot.get(meta, 'result_count', 0);

    const columns = [{
      title: '请假单号',
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
      title: '项目',
      dataIndex: 'platform_name',
      key: 'platform_name',
      width: 100,
      render: text => text || '--',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      width: 100,
      render: text => text || '--',
    }, {
      title: '团队',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      width: 150,
      render: text => text || '--',
    }, {
      title: '实际请假人',
      dataIndex: 'actual_apply_name',
      key: 'actual_apply_name',
      width: 100,
      render: (text) => {
        return (
          <div className={style['app-comp-expense-borrowing-actual-borrower']}>
            {text}
          </div>
        );
      },
    }, {
      title: '请假类型',
      dataIndex: 'leave_type',
      key: 'leave_type',
      width: 100,
      render: text => ExpenseAttendanceTakeLeaveType.description(text) || '--',
    }, {
      title: '请假事由',
      dataIndex: 'reason',
      key: 'reason',
      width: 120,
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
          <Popover content={text} title="请假事由" trigger="hover">
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
        const {
          current_flow_node_info: currentFlowNodeInfo = {},
        } = text;

        if (currentFlowNodeInfo) {
          const name = currentFlowNodeInfo.name;
          const accountList = currentFlowNodeInfo.account_list;
          let subName = '';
          if (accountList.length > 0) {
            subName = '(';
            accountList.map((item) => {
              subName += item.name;
            });
            subName += ')';
          }

          return <div className={style['app-comp-expense-overtime-table-line']}>{`${name}${subName}`}</div>;
        } else {
          return '--';
        }
      },
    }, {
      title: '申请人',
      dataIndex: 'apply_account_info',
      key: 'apply_account_info.name',
      width: 100,
      render: (text) => {
        return dot.get(text, 'name', '--');
      },
    }, {
      title: '开始时间',
      dataIndex: 'start_at',
      key: 'start_at',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
      },
    }, {
      title: '结束时间',
      dataIndex: 'end_at',
      key: 'end_at',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        const {
          _id: takeLeaveId,                         // 请假id
        } = record;

        const operations = [];
        // 判断是否有查看请假详情页面的权限
        operations.push(
          <a
            key="detail"
            href={`/#/Expense/Attendance/TakeLeave/Detail?takeLeaveId=${takeLeaveId}`}
            target="_blank"
            rel="noopener noreferrer"
          >查看
            </a>,
        );
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
    // 渲染新增请假创建按钮

    if (page) {
      pagination.current = page;
    }

    return (
      <CoreContent title="请假列表">
        <Table
          rowKey={record => record._id}
          dataSource={data}
          columns={columns}
          bordered
          pagination={pagination}
          scroll={{ x: 1700, y: 400 }}
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
    if (Operate.canOperateExpenseAttendanceTakeLeaveMy()) {
      items.push({ title: '我的', content: this.renderTabContent(ExpenseBorrowRepaymentsTabType.mine), key: ExpenseBorrowRepaymentsTabType.mine });
    }
    if (Operate.canOperateExpenseAttendanceTakeLeaveAll()) {
      items.push({ title: '全部', content: this.renderTabContent(ExpenseBorrowRepaymentsTabType.all), key: ExpenseBorrowRepaymentsTabType.all });
    }
    return (
      <CoreTabs items={items} onChange={this.onChangeTab} defaultActiveKey={`${ExpenseBorrowRepaymentsTabType.mine}`} />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染Tab */}
        {this.renderTabs()}
      </div>
    );
  }
}

function mapStateToProps({ expenseTakeLeave: { expenseTakeLeaveMineList } }) {
  return { expenseTakeLeaveMineList };
}
export default connect(mapStateToProps)(Index);
