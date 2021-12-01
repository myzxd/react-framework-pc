/**
 * 私教资产隶属管理 - 私教团队管理
 */
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table } from 'antd';

import Search from './search';
import { CoreContent } from '../../../../components/core';
import Operate from '../../../../application/define/operate';

class Index extends Component {

  constructor(props) {
    super(props);
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
      type: 'modelCoachDepartment/fetchCoachDepartmentList',
      payload: searchParams,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch();
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch();
  }

  // 搜索
  onSearch = (params = {}) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    this.private.searchParams = {
      ...searchParams,
      ...params,
    };
    this.props.dispatch({
      type: 'modelCoachDepartment/fetchCoachDepartmentList',
      payload: this.private.searchParams,
    });
  }


  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search
        onSearch={onSearch}
      />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { page, limit } = this.private.searchParams.meta;
    const { data, _meta = {} } = this.props.coachDepartmentList;
    const columns = [
      {
        title: '私教部门编号',
        dataIndex: 'code',
        key: 'code',
        render: text => text || '--',
      },
      {
        title: '私教部门名称',
        dataIndex: 'name',
        key: 'name',
        render: text => text || '--',
      },
      {
        title: '创建人',
        dataIndex: 'creator_info',
        key: 'creator_info.name',
        render: text => (text && text.name ? text.name : '--'),
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '修改人',
        dataIndex: 'operator_info',
        key: 'operator_info',
        render: text => ((text && text.name) ? text.name : '--'),
      },
      {
        title: '修改时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 150,
        render: (text, rowData) => {
          if (Operate.canOperateTeamTeacherManageOwnerTeam()) {
            return (<a href={`/#/Team/Teacher/Manage/OwnerTeam?id=${rowData._id}`} target="_blank" rel="noopener noreferrer" className="app-global-mgr10">私教团队管理</a>);
          }
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                       // 默认数据条数
      pageSize: limit,                          // 每页展示条数
      onChange: this.onChangePage,               // 切换分页
      showQuickJumper: true,                     // 显示快速跳转
      showSizeChanger: true,                     // 显示分页
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
      showTotal: total => `总共${total}条`,       // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: _meta.result_count || 0,            // 数据总条数
    };

    return (
      <CoreContent>
        <Table
          rowKey={(record, index) => { return index; }}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          bordered
        />
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

const mapStateToProps = ({ modelCoachDepartment: { coachDepartmentList } }) => {
  return { coachDepartmentList };
};

export default connect(mapStateToProps)(Index);
