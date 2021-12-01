/**
 * 费用分组列表页 /Expense/Type
 */
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Popconfirm, Popover } from 'antd';
import dot from 'dot-prop';

import Search from './search';
import style from './style.css';

import Operate from '../../../application/define/operate';
import { authorize } from '../../../application';
import { CoreContent } from '../../../components/core';
import { ExpenseCostGroupState } from '../../../application/define';

class Index extends Component {
  static propsTypes = {
    expenseTypeList: PropTypes.object,
  };

  static defaultProps = {
    expenseTypeList: {},
  };

  constructor(props) {
    super(props);

    this.state = {};
    this.private = {
      searchParams: {},
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'applicationCommon/getEnumeratedValue', payload: { enumeratedType: 'subjectScense' } });
  }

  // 数据重置
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'applicationCommon/resetEnumeratedValue' });
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

    // 调用搜索
    this.props.dispatch({ type: 'expenseType/fetchExpenseType', payload: this.private.searchParams });
  }

  // 启用|停用
  onUpdateExpenseTypeByEnable = (id, flag) => {
    this.props.dispatch({ type: 'expenseType/updateExpenseTypeByEnable', payload: { id, flag, onSuccessCallback: this.onSuccessCallback } });
  }

  // 删除
  onDelete = (id) => {
    this.props.dispatch({ type: 'expenseType/deleteExpenseType', payload: { id, onSuccessCallback: this.onSuccessCallback } });
  }

  // 成功回调
  onSuccessCallback = () => {
    this.props.dispatch({ type: 'expenseType/fetchExpenseType', payload: this.private.searchParams });
  }

  // 渲染搜索功能
  renderSearch = () => {
    return (
      <Search onSearch={this.onSearch} />
    );
  };

  renderContent = () => {
    const { expenseTypeList: dataSource = {}, enumeratedValue = {} } = this.props;

    // 适用场景枚举
    const { subjectScense: enumeratedData = [] } = enumeratedValue;

    const { page = 1, limit } = this.private.searchParams;

    // 权限判断，能否新增费用分组
    let operations = '';
    if (Operate.canOperateExpenseExpenseTypeUpdate()) {
      // 跳转到新建费用分组页
      operations = (
        <div className={style['app-comp-expense-type-accounting-ist-create']}><Button type="primary" onClick={() => { window.location.href = '/#/Expense/Type/Create'; }}>新增费用分组</Button></div>
      );
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '费用分组名称',
        dataIndex: 'name',
      },
      {
        title: '适用场景',
        dataIndex: 'industryCodes',
        render: (text) => {
          if (!text || text.length !== 1) return '--';
          const currentEn = enumeratedData.find(en => en.value === text[0]) || {};
          const { name: currentVal = undefined } = currentEn;
          return currentVal || '--';
        },
      },
      {
        title: '科目',
        dataIndex: 'accountingList',
        render: (text) => {
          let subject = '';
          text.forEach((item) => {
            subject += `${item.name}${item.accountingCode},`;
          });
          // 判断数据是否存在
          if (text.length === 0) {
            return '--';
          }
          if (text.length <= 1) {
            return text[0].name;
          }
          const arr = subject.split(',');
          // 如果数据长度大于1就气泡展示
          return (
            <Popover content={<p className={style['app-comp-expense-type-accounting-list']}>{subject.slice(0, subject.length - 1)}</p>} trigger="hover">
              <div>{arr.slice(0, 1).join(',')}等</div>
            </Popover>
          );
        },
      },
      {
        title: '创建日期',
        dataIndex: 'createdAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD') : '--';
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
        title: '状态',
        dataIndex: 'state',
        render: text => ExpenseCostGroupState.description(text),
      },
      {
        title: '操作',
        render: (text, record) => {
          // 适用类型
          const scense = dot.get(record, 'industryCodes.0', undefined);
          // 状态值为删除时，显示‘--’
          if (Number(record.state) === ExpenseCostGroupState.deleted) {
            return '--';
          }
          // 改模版类型创建人是否是当前账号
          if (record.creatorInfo.id !== authorize.account.id) {
            return <a href={`/#/Expense/Type/Detail?id=${record.id}`}>查看</a>;
          }

          // 如果有权限--编辑费用分组
          if (Operate.canOperateExpenseExpenseTypeUpdate() !== true) {
            return <a href={`/#/Expense/Type/Detail?id=${record.id}`}>查看</a>;
          }
          switch (Number(record.state)) {
            // 费用分组状态是启用才能选停用
            case ExpenseCostGroupState.enable: return (
              <div>
                <a href={`/#/Expense/Type/Detail?id=${record.id}`} className={style['app-comp-expense-type-operate-detail']}>查看</a>
                <Popconfirm title="您是否确定停用该费用分组" onConfirm={() => { this.onUpdateExpenseTypeByEnable(record.id, false); }} okText="确定" cancelText="取消">
                  <a>停用</a>
                </Popconfirm>
              </div>
            );
            // 停用
            case ExpenseCostGroupState.disabled: return (
              <div>
                <Link
                  to={{ pathname: '/Expense/Type/Update',
                    query: { id: record.id, scense } }}
                  className={style['app-comp-expense-type-operate-update']}
                >编辑</Link>
                <Popconfirm title="您是否确定启用该费用分组" onConfirm={() => { this.onUpdateExpenseTypeByEnable(record.id, true); }} okText="确定" cancelText="取消">
                  <a className={style['app-comp-expense-type-operate-enable']}>启用</a>
                </Popconfirm>
                <Popconfirm title="您是否确定删除该费用分组" onConfirm={() => { this.onDelete(record.id); }} okText="确定" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              </div>
            );
            // 编辑
            case ExpenseCostGroupState.edit: return (
              <div>
                <Link
                  to={{ pathname: '/Expense/Type/Update',
                    query: { id: record.id, scense } }}
                  className={style['app-comp-expense-type-operate-update']}
                >编辑</Link>
                <Popconfirm title="您是否确定删除该费用分组" onConfirm={() => { this.onDelete(record.id); }} okText="确定" cancelText="取消">
                  <a className={style['app-comp-expense-type-operate-detele']}>删除</a>
                </Popconfirm>
                <Popconfirm title="您是否确定启用该费用分组" onConfirm={() => { this.onUpdateExpenseTypeByEnable(record.id, true); }} okText="确定" cancelText="取消">
                  <a className={style['app-comp-expense-type-operate-enable']}>启用</a>
                </Popconfirm>
                <Popconfirm title="您是否确定停用该费用分组" onConfirm={() => { this.onUpdateExpenseTypeByEnable(record.id, false); }} okText="确定" cancelText="取消">
                  <a>停用</a>
                </Popconfirm>
              </div>
            );
            case ExpenseCostGroupState.deleted: return (
              <div>--</div>
            );
            default: return (
              <div className={style['app-comp-expense-type-operate']}>
                <a href={`/#/Expense/Type/Detail?id=${record.id}`}>查看</a>
              </div>
            );
          }
        },
      },
    ];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      pageSize: limit || 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, 'meta.count', 0),  // 数据总条数
    };
    return (
      <CoreContent title={'费用分组列表'} titleExt={operations}>
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataSource.data} bordered />
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染内容 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ expenseType: { expenseTypeList }, applicationCommon: { enumeratedValue } }) {
  return { expenseTypeList, enumeratedValue };
}
export default connect(mapStateToProps)(Index);
