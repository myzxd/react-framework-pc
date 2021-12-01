/*
 *  出差申请 Expense/TravelApplication
 **/
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import dot from 'dot-prop';
import { Table } from 'antd';
import { CoreContent, CoreTabs } from '../../../components/core';
import { authorize } from '../../../application';
import {
  ExpenseBorrowRepaymentsTabType,
  ExpenseBusinessTripWay,
  ExpenseExamineOrderProcessState,
  ExpenseTravelApplicationBizState,
  AccountState,
} from '../../../application/define';
import Operate from '../../../application/define/operate';
import Search from './search';
import style from './style.css';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabKey: `${ExpenseBorrowRepaymentsTabType.mine}`,   // tabs[key]
    };

    // 搜索参数
    this.private = {
      searchParams: {
        limit: 30,
        page: 1,
        selectKey: this.state.selectedTabKey,
      },
    };
  }

  componentDidMount() {
    this.private.searchParams = { ...this.private.searchParams, applyAccountId: authorize.account.id };
    this.props.dispatch({ type: 'expenseTravelApplication/fetchExpenseTravelApplication', payload: this.private.searchParams });
  }

  // 更换tab
  onSelectTab = (selectedTabKey) => {
    // 重置数据
    this.props.dispatch({ type: 'expenseTravelApplication/resetExpenseTravelApplication' });

    this.setState({
      selectedTabKey,
    }, () => this.onSearch());
  }

  // 搜索
  onSearch = (params) => {
    if (this.state.selectedTabKey === `${ExpenseBorrowRepaymentsTabType.mine}`) {
      this.private.searchParams = Object.assign({}, params, {
        selectKey: this.state.selectedTabKey,
        applyAccountId: authorize.account.id,
      });
    } else {
      this.private.searchParams = Object.assign({}, params, {
        selectKey: this.state.selectedTabKey,
      });
    }

    const { dispatch } = this.props;
    dispatch({ type: 'expenseTravelApplication/fetchExpenseTravelApplication', payload: this.private.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 切换分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 渲染tab内容
  renderTabContent = () => {
    return (
      <div>
        {/* 渲染搜索框 */}
        {this.renderSearch()}

        {/* 渲染内容栏目 */}
        {this.renderContent()}
      </div>
    );
  }

  // 渲染tabs
  renderTabs = () => {
    const items = [];
    // 出差我的加权限
    if (Operate.canOperateExpenseTravelApplicationMy()) {
      items.push(
        {
          title: '我的',
          content: this.renderTabContent(),
          key: ExpenseBorrowRepaymentsTabType.mine,
        },
      );
    }
    // 出差全部加权限
    if (Operate.canOperateExpenseTravelApplicationAll()) {
      items.push(
        {
          title: '全部',
          content: this.renderTabContent(),
          key: ExpenseBorrowRepaymentsTabType.all,
        },
      );
    }
    const defaultActiveKey = `${this.state.selectedTabKey}` || `${ExpenseBorrowRepaymentsTabType.mine}`;

    return (
      <CoreTabs
        items={items}
        onChange={this.onSelectTab}
        defaultActiveKey={defaultActiveKey}
      />
    );
  }

  // 渲染搜索框
  renderSearch = () => {
    const { selectedTabKey } = this.state;
    return (
      <Search
        isAll={selectedTabKey === `${ExpenseBorrowRepaymentsTabType.all}`}
        onSearch={this.onSearch}
        dispatch={this.props.dispatch}
      />
    );
  }

  // 渲染内容栏目
  renderContent = () => {
    let dataSource;
    if (this.state.selectedTabKey === `${ExpenseBorrowRepaymentsTabType.mine}`) {
      dataSource = this.props.expenseTravelApplicationMineList;
    } else {
      dataSource = this.props.expenseTravelApplicationAllList;
    }
    const { page = 1 } = this.private.searchParams;

    const columns = [
      {
        title: '出差申请单号',
        dataIndex: '_id',
        key: '_id',
        fixed: 'left',
        width: 200,
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '实际出差人',
        dataIndex: 'apply_user_name',
        key: 'apply_user_name',
        fixed: 'left',
        width: 100,
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '出发地',
        dataIndex: 'departure',
        key: 'departure',
        width: 100,
        render: (text) => {
          if (text) {
            return `${text.province_name}${text.area_name || ''}${text.city_name || ''}${text.detailed_address}`;
          } else {
            return '--';
          }
        },
      },
      {
        title: '目的地',
        dataIndex: 'destination',
        key: 'destination',
        width: 100,
        render: (text) => {
          if (text) {
            return `${text.province_name}${text.area_name || ''}${text.city_name || ''}${text.detailed_address}`;
          } else {
            return '--';
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'expect_start_at',
        key: 'expect_start_at',
        width: 100,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:00:00') : '--';
        },
      },
      {
        title: '结束时间',
        dataIndex: 'expect_done_at',
        key: 'expect_done_at',
        width: 100,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:00:00') : '--';
        },
      },
      {
        title: '出差天数',
        dataIndex: 'expect_apply_days',
        key: 'expect_apply_days',
        width: 100,
        render: (text) => {
          return (`${text} 天`);
        },
      },
      {
        title: '出差方式',
        dataIndex: 'transport_kind',
        key: 'transport_kind',
        width: 100,
        render: (text) => {
          let transport = '';
          text.forEach((item) => {
            transport += `${ExpenseBusinessTripWay.description(item)}, `;
          });
          return transport ? transport.substring(0, transport.length - 2) : '--';
        },
      },
      {
        title: '审批流',
        dataIndex: 'apply_application_order_info',
        key: 'apply_application_order_info.flow_info',
        width: 160,
        render: (text) => {
          const name = dot.get(text, 'flow_info.name', undefined);
          return <div className={style['app-comp-expense-travel-application-approval']}>{name}</div> || '--';
        },
      },
      {
        title: '流程状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text) => {
          return text ? ExpenseExamineOrderProcessState.description(text) : '--';
        },
      },
      {
        title: '当前节点',
        dataIndex: 'apply_application_order_info',
        key: 'current_flow_node_info',
        width: 100,
        render: (text, record) => {
          const currentFlowNodeInfo = record.apply_application_order_info && record.apply_application_order_info.current_flow_node_info;

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

            return name + subName;
          } else {
            return '--';
          }
        },
      },
      {
        title: '报销状态',
        dataIndex: 'biz_state',
        key: 'biz_state',
        width: 100,
        render: (text) => {
          return text ? ExpenseTravelApplicationBizState.description(text) : '--';
        },
      },
      {
        title: '申请人',
        dataIndex: 'apply_account_info',
        key: 'apply_account_info',
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
      },
      {
        title: '申请出差时间',
        dataIndex: 'submit_at',
        key: 'submit_at',
        width: 200,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (text, record) => {
          return (
            <div>
              {Operate.canOperateExpenseTravelApplicationDetail() ? <a href={`/#/Expense/TravelApplication/Detail?id=${record._id}`} target="_blank" rel="noopener noreferrer" >查看</a> : '--'}
            </div>
          );
        },
      },
    ];
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent>
        <Table
          rowKey={({ _id: id }) => id}
          pagination={pagination}
          columns={columns}
          dataSource={dataSource.data}
          bordered
          scroll={{ x: 1780, y: 500 }}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染tabs */}
        {this.renderTabs()}
      </div>
    );
  }
}

const mapStateToProps = ({ expenseTravelApplication }) => {
  return {
    expenseTravelApplicationMineList: expenseTravelApplication.expenseTravelApplicationMineList,
    expenseTravelApplicationAllList: expenseTravelApplication.expenseTravelApplicationAllList,
  };
};

export default connect(mapStateToProps)(Index);
