/**
 * 费用管理 - 科目设置 /Expense/Subject
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Popover, Button, Popconfirm, message } from 'antd';
import { Link } from 'dva/router';

import { CoreContent } from '../../../components/core';
import Operate from '../../../application/define/operate';
import { authorize } from '../../../application';
import { OaCostAccountingState, OaCostAccountingLevel, ExpenseCostCenterType, OaApplicationFlowRegulation } from '../../../application/define';

import Search from './search';
import style from './style.css';

class Index extends Component {
  static propTypes = {
    subjectsData: PropTypes.object,
  };

  static defaultProps = {
    subjectsData: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.private = {
      searchParams: {
        state: [OaCostAccountingState.normal, OaCostAccountingState.disable, OaCostAccountingState.draft],
      },
    };
  }

  // 默认加载数据
  componentDidMount() {
    const params = {
      isAll: true,
    };
    this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects', payload: params });
    this.props.dispatch({ type: 'applicationCommon/getEnumeratedValue', payload: { enumeratedType: 'subjectScense' } });
  }

  // 数据重置
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseSubject/resetSubjects' });
    dispatch({ type: 'applicationCommon/resetEnumeratedValue' });
  }

  // 科目创建
  onCreate = () => {
    this.props.history.push('/Expense/Subject/Create');
  }
  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    if (params.state === undefined || is.empty(params.state)) {
      this.private.searchParams.state = [OaCostAccountingState.normal, OaCostAccountingState.disable, OaCostAccountingState.draft];
    }
    this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects', payload: this.private.searchParams });
  }

  // 删除成功的回调函数
  onSuccessDelete = () => {
    message.success('科目删除成功');
    const params = {
      state: [OaCostAccountingState.normal, OaCostAccountingState.disable, OaCostAccountingState.draft],
    };
    this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects', payload: params });
  }

  // 开启失败的回调函数
  onFailureDelete = (res) => {
    message.error(res.zh_message);
  }

  // 删除
  onDelete = (record) => {
    const { dispatch } = this.props;
    const params = {
      id: record.id, // 合同id
    };
    dispatch({
      type: 'expenseSubject/deleteSubject',
      payload: {
        params,
        onSuccessCallback: this.onSuccessDelete,
        onFailureCallback: this.onFailureDelete,
      },
    });
  }

  // 开启科目成功的回调
  onSuccessOpen = () => {
    message.success('科目开启成功');
    const params = {
      state: [OaCostAccountingState.normal, OaCostAccountingState.disable, OaCostAccountingState.draft],
    };
    this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects', payload: params });
  }

  // 开启失败的回调函数
  onFailureOpen = (res) => {
    message.error(res.zh_message);
  }

  // 开启
  onOpen = (record) => {
    const { dispatch } = this.props;
    const params = {
      id: record.id, // 合同id
      state: OaCostAccountingState.normal,
    };
    dispatch({
      type: 'expenseSubject/toggleSubjectState',
      payload: {
        params,
        onSuccessCallback: this.onSuccessOpen,
        onFailureCallback: this.onFailureOpen,
      },
    });
  }

  // 科目停用的成功会掉
  onSuccessDisable = () => {
    message.success('科目停用成功');
    const params = {
      state: [OaCostAccountingState.normal, OaCostAccountingState.disable, OaCostAccountingState.draft],
    };
    this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects', payload: params });
  }

  // 科目停用的失败回调函数
  onFailureDisable = (res) => {
    message.error(res.zh_message);
  }

  // 停用
  onDisable = (record) => {
    const params = {
      id: record.id, // 合同id
      state: OaCostAccountingState.disable,
    };
    this.props.dispatch({
      type: 'expenseSubject/toggleSubjectState',
      payload: {
        params,
        onSuccessCallback: this.onSuccessDisable,
        onFailureCallback: this.onFailureDisable,
      },
    });
  }

  // 渲染内容
  renderContent = () => {
    const { subjectsData = {}, enumeratedValue = {} } = this.props;

    // 适用场景枚举
    const { subjectScense: enumeratedData = [] } = enumeratedValue;

    const dataSource = dot.get(subjectsData, 'data', []);
    const total = dot.get(subjectsData, 'meta.count', 0);

    const { page, limit } = this.private.searchParams;
    const accountId = authorize.account.id; // 系统账户id
    const columns = [
      {
        title: '科目编码',
        dataIndex: 'accountingCode',
        width: '12%',
        render: (text) => {
          // 判断数据是否存在
          if (!text || text === '') {
            return '--';
          }
          if (text.length <= 8) {
            return text;
          }
          // 如果数据长度大于8就气泡展示
          return (
            <Popover content={text} title="科目编码" trigger="hover">
              <div>{`${text.substr(0, 8)}...`}</div>
            </Popover>
          );
        },
      },
      {
        title: '适用场景',
        dataIndex: 'industryCodes',
        render: (text = 2000) => {
          if (!text || text.length !== 1) return '--';
          const currentEn = enumeratedData.find(en => en.value === text[0]) || {};
          const { name: currentVal = undefined } = currentEn;
          return currentVal || '--';
        },
      },
      {
        title: '科目名称',
        dataIndex: 'name',
        width: '13.28%',
        render: (text) => {
          // 判断数据是否存在
          if (!text || text === '') {
            return '--';
          }
          if (text.length <= 8) {
            return text;
          }
          // 如果数据长度大于8就气泡展示
          return (
            <Popover content={text} title="科目名称" trigger="hover">
              <div>{`${text.substr(0, 8)}...`}</div>
            </Popover>
          );
        },
      },
      {
        title: '级别',
        dataIndex: 'level',
        width: 50,
        render: (text) => {
          return <div>{OaCostAccountingLevel.description(text)}</div>;
        },
      },
      {
        title: '上级科目',
        dataIndex: 'parentName',
        width: '13.28%',
        render: (text) => {
          // 判断数据是否存在
          if (!text || text === '') {
            return '--';
          }
          if (text.length <= 8) {
            return text;
          }
          // 如果数据长度大于8就气泡展示
          return (
            <Popover content={text} title="上级科目" trigger="hover">
              <div>{`${text.substr(0, 8)}...`}</div>
            </Popover>
          );
        },
      },
      {
        title: '是否成本类',
        dataIndex: 'costFlag',
        align: 'center',
        render: (text) => {
          return OaApplicationFlowRegulation.description(text) || '--';
        },
      },
      {
        title: '成本归属',
        dataIndex: 'costCenterType',
        render: (text) => {
          return text ? ExpenseCostCenterType.description(text) : '--';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: 140,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorInfo',
        render: (text) => {
          // 判断是否有值
          if (text) {
            return text.name ? text.name : '--';
          }
          return '--';
        },
      },
      {
        title: '科目描述',
        dataIndex: 'description',
        render: (text) => {
          if (!text || text === '') {
            return '--';
          }
          if (text.length <= 8) {
            return text;
          }
          // 如果数据长度大于8就气泡展示
          return (
            <Popover content={text} title="科目描述" trigger="hover">
              <div>{text.substr(0, 8)}</div>
            </Popover>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text) => {
          return <div>{OaCostAccountingState.description(text)}</div>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const { state, creatorInfo } = record;
          const operations = [];
          switch (state) {
            // 草稿
            case OaCostAccountingState.draft:
              if (Operate.canOperateExpenseSubjectDetail() && creatorInfo.id !== accountId) {
                operations.push(<Link key="disableDraft" to={{ pathname: '/Expense/Subject/Details', query: { subjiectId: record.id } }}>查看</Link>);
              }
              if (Operate.canOperateExpenseSubjectUpdate() && creatorInfo.id === accountId) {
                operations.push(<Link className={style['app-comp-expense-subject-operation-update']} key="draftUpadate" to={{ pathname: '/Expense/Subject/Update', query: { subjiectId: record.id } }}>编辑</Link>);
              }
              if (Operate.canOperateExpenseSubjectDelete() && creatorInfo.id === accountId) {
                operations.push(<Popconfirm placement="top" key="draftDelete" title="你确定要删除该费用科目吗?" onConfirm={() => { this.onDelete(record); }} okText="确认" cancelText="取消">
                  <a className={style['app-comp-expense-subject-operation-detele']}>删除</a>
                </Popconfirm>);
              }
              if (Operate.canOperateExpenseSubjectEnable() && creatorInfo.id === accountId) {
                operations.push(<Popconfirm placement="top" key="draftOpen" title="你确定要启用该费用科目吗?" onConfirm={() => { this.onOpen(record); }} okText="确认" cancelText="取消">
                  <a className={style['app-comp-expense-subject-operation-enable']}>启用</a>
                </Popconfirm>);
              }
              break;
            // 正常
            case OaCostAccountingState.normal:
              if (Operate.canOperateExpenseSubjectDetail()) {
                operations.push(<Link key="normalDetails" to={{ pathname: '/Expense/Subject/Details', query: { subjiectId: record.id } }}>查看</Link>);
              }
              if (Operate.canOperateExpenseSubjectDisable() && creatorInfo.id === accountId) {
                operations.push(<Popconfirm placement="top" key="normalDisable" title="你确定要停用该费用科目吗?" onConfirm={() => { this.onDisable(record); }} okText="确认" cancelText="取消">
                  <a className={style['app-comp-expense-subject-operation-disable']}>停用</a>
                </Popconfirm>);
              }
              break;
            // 停用
            case OaCostAccountingState.disable:
              if (Operate.canOperateExpenseSubjectDetail()) {
                operations.push(<Link key="disableDetails" to={{ pathname: '/Expense/Subject/Details', query: { subjiectId: record.id } }}>查看</Link>);
              }
              if (Operate.canOperateExpenseSubjectEnable() && creatorInfo.id === accountId) {
                operations.push(<Popconfirm placement="top" key="disableOpen" title="你确定要启用该费用科目吗?" onConfirm={() => { this.onOpen(record); }} okText="确认" cancelText="取消">
                  <a className={style['app-comp-expense-subject-operation-enable']}>启用</a>
                </Popconfirm>);
              }
              break;
            default:
              if (Operate.canOperateExpenseSubjectDetail()) {
                operations.push(<Link to={{ pathname: '/Expense/Subject/Details', query: { subjiectId: record.id } }}>查看</Link>);
              }
          }
          return (<span>
            {operations}
          </span>);
        },
      },
    ];

    // 分页
    const pagination = {
      pageSize: limit || 30,
      onChange: this.onChangePage,
      total,
      showTotal: totalCount => `总共${totalCount}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };
    if (page) {
      pagination.current = page; // 当前页数
    }
    const props = {
      columns,
      pagination,
      dataSource,
      rowKey: (record, index) => index,
      onShowSizeChange: this.onShowSizeChange,
    };
    const content = (
      <span>
        {
          Operate.canOperateExpenseSubjectCreate() ?
            <Button onClick={() => { this.onCreate(); }} type="primary">新建科目</Button> :
            null
        }
      </span>
    );
    return (
      <CoreContent title="科目列表" titleExt={content} className={style['app-comp-expense-subject']}>
        {/* 渲染列表页面 */}
        <Table {...props} />
      </CoreContent>
    );
  }
  render = () => {
    return (
      <div>
        {/* 渲染搜索栏 */}
        <Search onSearch={this.onSearch} />

        {/* 渲染内容 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ expenseSubject: { subjectsData }, applicationCommon: { enumeratedValue } }) {
  return { subjectsData, enumeratedValue };
}
export default connect(mapStateToProps)(Index);
