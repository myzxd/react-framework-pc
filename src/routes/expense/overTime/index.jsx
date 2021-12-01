/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 /Expense/Attendance/OverTime
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  message,
} from 'antd';

import {
  CoreTabs,
} from '../../../components/core';

import Operate from '../../../application/define/operate';
import {
  ExpenseOverTimeTabType,
} from '../../../application/define';

import Search from './search';

import TabContent from './components/tabContent'; // 表格组件

import { authorize } from '../../../application';

class Index extends Component {
  static propTypes = {
    overTimeMineList: PropTypes.object, // 加班单列表 - 我的
    overTimeAllList: PropTypes.object, // 加班单列表 - 全部
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    overTimeMineList: {},
    overTimeAllList: [],
    dispatch: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      activeKey: `${ExpenseOverTimeTabType.mine}`,    // tab key
      form: undefined,
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
    const { activeKey } = this.state;
    const { dispatch } = this.props;

    const params = {
      selectKey: activeKey,
      ...this.private.searchParams,
    };

    dispatch({ type: 'expenseOverTime/fetchOverTimeList', payload: params });
  }

  // 重置数据
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expenseOverTime/resetOverTimeList',
      payload: {},
    });
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 查询
  onSearch = (value = {}) => {
    const { activeKey } = this.state;
    const {
      limit,
      page,
    } = this.private.searchParams;

    const params = {
      ...value,
      page: page || 1,
      limit: limit || 30,
      selectKey: activeKey,
    };

    // 重置
    this.private.searchParams = { ...params };

    // 如果tab时‘我的’，则传入登录账号
    if (Number(activeKey) === ExpenseOverTimeTabType.mine) {
      params.applyAccountId = authorize.account.id;
    }

    // 调用搜索
    this.props.dispatch({ type: 'expenseOverTime/fetchOverTimeList', payload: params });
  }

  // 重置
  onReset = () => {
    this.onSearch({});
  }

  // 导出EXCEL
  onExportEXCEL = () => {
    const {
      form,
      activeKey,
    } = this.state;

    const {
      dispatch,
    } = this.props;

    form.validateFields((err, values) => {
      if (err) return;

      const params = {
        ...values,
        onSuccessCallback: () => message.success('请求成功'),
      };

      // 如果tab时‘我的’，则传入登录账号
      if (Number(activeKey) === ExpenseOverTimeTabType.mine) {
        params.applyAccountId = authorize.account.id;
      }

      dispatch({ type: 'expenseOverTime/exportOverTime', payload: params });
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 切换tab
  onChangeTab = (activeKey) => {
    // 更新tab key，并重新获取数据
    this.setState({ activeKey }, () => this.onSearch());
  }

  // 渲染查询组件
  renderSearch = () => {
    const {
      onSearch,
      onReset,
      onHookForm,
      onExportEXCEL,
    } = this;

    // tab key
    const { activeKey } = this.state;

    return (
      <Search
        activeKey={activeKey}
        onSearch={onSearch}
        onReset={onReset}
        onHookForm={onHookForm}
        onExportEXCEL={onExportEXCEL}
      />
    );
  }

  // 渲染列表组件
  renderContent = () => {
    const {
      activeKey,
    } = this.state;

    const {
      overTimeMineList, // 我的
      overTimeAllList, // 全部
    } = this.props;

    // 数据
    const dataList = Number(activeKey) === ExpenseOverTimeTabType.mine
    ? { ...overTimeMineList }
    : { ...overTimeAllList };

    return <TabContent dataList={dataList} onChangePage={this.onChangePage} />;
  }

  // 渲染内容
  renderTabContent = () => {
    return (
      <div>
        {/* 查询 */}
        {this.renderSearch()}
        {/* 列表 */}
        {this.renderContent()}
      </div>
    );
  }

  // 渲染Tab
  renderTabs = () => {
    const items = [];
    // 我的
    if (Operate.canOperateExpenseOverTimeMy()) {
      items.push({ title: '我的', content: this.renderTabContent(), key: ExpenseOverTimeTabType.mine });
    }

    // 全部
    if (Operate.canOperateExpenseOverTimeAll()) {
      items.push({ title: '全部', content: this.renderTabContent(), key: ExpenseOverTimeTabType.all });
    }

    return (
      <CoreTabs
        items={items}
        onChange={this.onChangeTab}
        defaultActiveKey={`${ExpenseOverTimeTabType.mine}`}
      />
    );
  }

  render = () => {
    return this.renderTabs();
  }
}

function mapStateToProps({
  expenseOverTime: {
    overTimeMineList,
    overTimeAllList,
  },
}) {
  return { overTimeMineList, overTimeAllList };
}

export default connect(mapStateToProps)(Index);
