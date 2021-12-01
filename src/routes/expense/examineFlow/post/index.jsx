/**
 * 审批岗位设置 /Expense/ExamineFlow/Post
 */
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Tooltip, Button, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { ExpenseExaminePostType } from '../../../../application/define';
import { CoreContent } from '../../../../components/core';
import Search from './search';
import style from './style.css';
import AddPost from './components/addPost.jsx';
import Operate from '../../../../application/define/operate';

import { authorize } from '../../../../application';

class Index extends Component {
  static propTypes = {
    examinePostData: PropTypes.object,    // 审批岗位信息
  }

  static defaultProps = {
    examinePostData: {
      data: [],
      _meta: {},
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowTransferModel: false, // 添加岗位弹窗
      isCreate: true,
      postDate: {}, // 编辑的岗位数据
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  componentDidMount() {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExaminePost',
      payload: searchParams,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onChangeSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onChangeSearch(searchParams);
  }

  // 搜索
  onChangeSearch = (params) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    const payload = {
      ...searchParams,
      ...params,
    };
    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExaminePost',
      payload,
    });
  }

  // 查询
  onSearch=(params) => {
    const { searchParams } = this.private;
    searchParams.meta.page = 1;
    searchParams.meta.limit = 30;
    this.onChangeSearch({ ...searchParams, ...params });
  }

  // 显示弹窗
  onShowAdd = () => {
    this.setState({
      isShowTransferModel: true,
      isCreate: true,
    });
  }

  // 隐藏弹窗
  onCancelModal = () => {
    this.setState({ isShowTransferModel: false });
  }

  // 岗位编辑
  onEdit = (record) => {
    this.setState({
      isShowTransferModel: true,
      isCreate: false,
      postDate: record,
    });
  }

  // 启用/停用岗位
  onEnableAndDisablePost = (id, flag) => {
    this.props.dispatch({
      type: 'expenseExamineFlow/enableAndDisablePost',
      payload: {
        id,
        flag,
        onSuccessCallback: this.onSuccessCallback,
      },
    });
  }

  // 启用/停用成功回调
  onSuccessCallback = () => {
    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExaminePost',
      payload: { meta: { page: 1, limit: 30 } },
    });
  }

  // 列表内名称加逗号显示
  reduceName = (text) => {
    return text.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 岗位名称显示规则
  renderPostName = (text) => {
    if (!text || typeof (text) !== 'string') return '--';
    if (text.length <= 6) return text;
    return (
      <Tooltip title={text}>
        <span>{`${text.substring(0, 6)}...`}</span>
      </Tooltip>
    );
  }

  // 成员名称显示规则
  renderMemberInfo = (text) => {
    if (!text || (typeof (text) === 'object' && Array === text.constructor && text.length === 0)) return '--';
    if (text.length <= 7) {
      return this.reduceName(text);
    }
    return (
      <Tooltip title={this.reduceName(text)}>
        <span>{`${this.reduceName(text.slice(0, 7))}...`}</span>
      </Tooltip>
    );
  }

  // 渲染搜索
  renderSearch = () => {
    return (
      <Search
        onSearch={this.onSearch}
      />
    );
  }

  // 渲染列表
  renderContent = () => {
    // 页码
    const { page, limit } = this.private.searchParams.meta;
    // 岗位数据
    const { data, _meta } = this.props.examinePostData;

    // 当前账户id
    const accountId = authorize.account.id;

    const columns = [
      {
        title: '岗位号',
        dataIndex: '_id',
        key: '_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '岗位名称',
        dataIndex: 'post_name',
        key: 'post_name',
        render: this.renderPostName,
      },
      {
        title: '成员',
        width: '200px',
        dataIndex: 'account_info_list',
        key: 'account_info_list',
        render: this.renderMemberInfo,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return text ? ExpenseExaminePostType.description(text) : '--';
        },
      },
      {
        title: '最新操作者',
        dataIndex: 'operator_info',
        key: 'operator_info',
        render: (text) => {
          return text && text.name ? text.phone ? `${text.name}(${text.phone})` : text.name : '--';
        },
      },
      {
        title: '最新操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          // 岗位号
          const { _id: id, state, creator_id: creatorId } = record;
          let operations = [];
          let flag = true;

          // 岗位为草稿状态 && 当前账户为创建人，操作为编辑、启用
          if (state === ExpenseExaminePostType.draft && creatorId === accountId) {
            Operate.canOperateExpensePostUpdate() && operations.push(
              <a
                key="update"
                className={style['app-comp-expense-post-jobs-setting-operation-update']}
                onClick={() => this.onEdit(record)}
              >
                编辑
              </a>);
            Operate.canOperateExpensePostEnable() && operations.push(
              <Popconfirm key="delete" title="确认启用?" onConfirm={() => { this.onEnableAndDisablePost(id, flag); }}>
                <a key="disable">启用</a>
              </Popconfirm>,
            );
          }

          // 岗位为启用(正常)状态，操作为编辑、启用
          if (state === ExpenseExaminePostType.normal) {
            flag = false;
            Operate.canOperateExpensePostUpdate() && operations.push(
              <a
                key="update"
                className={style['app-comp-expense-post-jobs-setting-operation-update']}
                onClick={() => this.onEdit(record)}
              >
                编辑
              </a>);
            Operate.canOperateExpensePostDisable() && operations.push(
              <Popconfirm key="delete" title="确认停用?" onConfirm={() => { this.onEnableAndDisablePost(id, flag); }}>
                <a key="disable">停用</a>
              </Popconfirm>,
            );
          }

          // 岗位为停用状态，没有操作
          if (state === ExpenseExaminePostType.disable || operations.length === 0) {
            operations = '--';
          }
          return operations;
        },
      },
    ];
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      pageSize: limit,                     // 默认数据条数
      onChange: this.onChangePage,             // 切换分页
      showQuickJumper: true,                   // 显示快速跳转
      showSizeChanger: true,                   // 显示分页
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: _meta.result_count || 0,          // 数据总条数
    };

    // 添加岗位扩展操作
    const titleExt = Operate.canOperateExpensePostCreate()
      ? <Button type="primary" onClick={this.onShowAdd}>添加岗位</Button>
      : '';
    return (
      <CoreContent title="审批岗位" titleExt={titleExt}>
        <Table
          rowKey={(record, index) => { return index; }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
        />
      </CoreContent>
    );
  }

  // 渲染添加岗位弹窗
  renderAddPostModal = () => {
    const { isShowTransferModel, isCreate, postDate } = this.state;
    if (isShowTransferModel === false) {
      return;
    }

    const props = {
      isCreate,
      postDate: isCreate ? {} : postDate,
      dispatch: this.props.dispatch,
      visible: isShowTransferModel,
      onCancel: this.onCancelModal,
    };

    return <AddPost {...props} />;
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}
        {/* 渲染列表 */}
        {this.renderContent()}
        {/* 渲染添加岗位弹窗 */}
        {this.renderAddPostModal()}
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examinePostData } }) {
  return { examinePostData };
}

export default connect(mapStateToProps)(Index);
