/**
 * 费用管理 - 借还款管理 - 还款管理列表页   Expense/BorrowingRepayments/Repayments
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Tooltip } from 'antd';
import { CoreContent, CoreTabs } from '../../../../components/core';

import Operate from '../../../../application/define/operate';
import {
  Unit,
  ExpenseBorrowRepaymentsTabType,
  ExpenseExamineOrderProcessState,
} from '../../../../application/define';

import Search from './search';
import style from './style.css';

import { authorize } from '../../../../application';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: ExpenseBorrowRepaymentsTabType.mine,             // tab key
      isShowExpand: true,       // 判断搜索内容是否收起
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
    this.props.dispatch({
      type: 'borrowingRepayment/fetchRepaymentOrders',
      payload: this.private.searchParams,
    });
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'borrowingRepayment/resetBorrowingOrders',
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
    this.props.dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: this.private.searchParams });
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
    dispatch({ type: 'borrowingRepayment/resetRepaymentOrders' });
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
                    style={item.isHeight === true ? { color: '#F5A623' } : null}
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
                    style={item.isHeight === true ? { color: '#F5A623' } : null}
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
          <div className={style['app-comp-expense-repayments-tooltip']}>
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
    // 获取还款单相关信息
    const { repaymentOrders } = this.props;

    // 获取借款单列表数据
    const data = dot.get(repaymentOrders, 'data', []);

    // 获取还款单条码信息
    const meta = dot.get(repaymentOrders, '_meta', {});
    const dataCount = dot.get(meta, 'result_count', 0);

    const columns = [{
      title: '还款单号',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      fixed: 'left',
      render: text => (
        <div className={style['app-comp-expense-repayments-flow-info-id']}>
          {text}
        </div>
      ),
    }, {
      title: '借款单号',
      dataIndex: 'loan_order_id',
      width: 100,
      fixed: 'left',
      render: text => (
        <div className={style['app-comp-expense-repayments-flow-info-id']}>
          {text}
        </div>
      ),
    }, {
      title: '平台',
      dataIndex: 'application_order_info',
      key: 'platformNames',
      width: 70,
      fixed: 'left',
      render: (text) => {
        const platformName = dot.get(text, 'platform_names', []);
        return is.empty(platformName) ? '--' : platformName;
      },
    }, {
      title: '供应商',
      dataIndex: 'application_order_info',
      key: 'supplierNames',
      width: 150,
      fixed: 'left',
      render: (text) => {
        const supplierNames = dot.get(text, 'supplier_names', []);
        return is.empty(supplierNames) ? '--' : supplierNames;
      },
    }, {
      title: '城市',
      dataIndex: 'application_order_info',
      key: 'cityNames',
      width: 70,
      fixed: 'left',
      render: (text) => {
        const cityNames = dot.get(text, 'city_names', []);
        return is.empty(cityNames) ? '--' : cityNames;
      },
    }, {
      title: '商圈',
      dataIndex: 'application_order_info',
      key: 'bizDistrictNames',
      width: 150,
      fixed: 'left',
      render: (text) => {
        const bizDistrictNames = dot.get(text, 'biz_district_names', []);
        return is.empty(bizDistrictNames) ? '--' : bizDistrictNames;
      },
    }, {
      title: '申请人 ',
      dataIndex: 'apply_account_info',
      key: 'apply_account_info.name',
      width: 70,
      fixed: 'left',
      render: (text) => {
        const name = dot.get(text, 'name');
        return (
          <div className={style['app-comp-expense-repayments-apply']}>
            {name}
          </div>
        );
      },
    }, {
      title: '还款金额',
      dataIndex: 'repayment_money',
      key: 'repayment_money',
      width: 100,
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return '--';
      },
    }, {
      title: '审批流',
      dataIndex: 'application_order_info',
      key: 'application_order_info.flow_info',
      width: 160,
      render: (text) => {
        const name = dot.get(text, 'flow_info.name', undefined);
        return <div className={style['app-comp-expense-repayments-flow-info']}>{name}</div> || '--';
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
      title: '还款时间',
      dataIndex: 'done_at',
      key: 'done_at',
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        const {
          application_order_id: applicationOrderId,
          _id: repaymentOrderId,
        } = record;
        const operations = [];

        // 判断是否有查看还款单详情页面的权限
        if (Operate.canOperateExpenseRepaymentOrderDetail()) {
          operations.push(
            <a
              key="detail"
              href={`/#/Expense/BorrowingRepayments/Repayments/Detail?orderId=${applicationOrderId}&repaymentOrderId=${repaymentOrderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={style['app-comp-expense-borrowing-operation-detail']}
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
      <CoreContent title="还款列表">
        <Table
          rowKey={record => record._id}
          dataSource={data}
          columns={columns}
          bordered
          pagination={pagination}
          scroll={{ x: 1470, y: 400 }}
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
    // 给tab我的加权限
    if (Operate.canOperateExpenseRepaymentOrderMy()) {
      items.push({ title: '我的', content: this.renderTabContent(ExpenseBorrowRepaymentsTabType.mine), key: ExpenseBorrowRepaymentsTabType.mine });
    }
    // 给tab全部加权限
    if (Operate.canOperateExpenseRepaymentOrderAll()) {
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

function mapStateToProps({ borrowingRepayment: { repaymentOrders } }) {
  return { repaymentOrders };
}
export default connect(mapStateToProps)(Index);
