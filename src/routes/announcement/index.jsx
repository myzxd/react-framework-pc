/**
 * 公告接收人 - 权限列表
 */
import is from 'is_js';
import dot from 'dot-prop';
import { Table, Tooltip, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import Search from './search';
import style from './style.css';

import { CoreContent } from '../../components/core';
import {
  canOperateAnnouncementPermissionsDetail,
  canOperateAnnouncementPermissionsCreate,
  canOperateAnnouncementPermissionsUpdate,
} from '../../application/define/operate';

const { Column, ColumnGroup } = Table;

class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: dot.get(props, 'permissions.permissionsData.data', []),          // 获取权限数据
      count: dot.get(props, 'permissions.permissionsData.meta.count', 0),    // 权限计数更新
    };
    this.private = {
      searchParams: {},     // 查询参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'permissions/fetchPermissionsList' }); // 获取物资设置数据
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
    this.props.dispatch({ type: 'permissions/fetchPermissionsList', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 创建权限数据
  onCreate = () => {
    this.props.history.push('/Announcement/Permissions/Create');
  }

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { page } = this.private.searchParams;
    const data = dot.get(this.props, 'permissionsData.data', []);          // 获取权限数据
    const count = dot.get(this.props, 'permissionsData.meta.count', 0);    // 权限计数更新
    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }
    let operations = '';
    if (canOperateAnnouncementPermissionsCreate() === true) {
      operations = (<Button type="primary" onClick={this.onCreate}>设置权限</Button>);
    }
    return (
      <CoreContent title="权限列表" titleExt={operations}>
        {/* 渲染的内容 */}
        <Table
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          dataSource={data}
          bordered
        >
          <Column title="角色" dataIndex="position_name" key="position_name" width={120} render={(text) => { return text || '--'; }} />
          <Column title="姓名" dataIndex="name" key="name" width={120} render={(text) => { return text || '--'; }} />
          <Column title="手机号" dataIndex="phone" key="phone" width={130} render={(text) => { return text || '--'; }} />
          <ColumnGroup title="接收权限范围">
            <Column
              title="平台"
              dataIndex="platform_info_list"
              key="platform_info_list"
              width={130}
              render={(text) => {
                // 判断数据是否存在
                if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
                  return '--';
                }
                return text.map(item => item.name).join(' , ');
              }
              }
            />
            <Column
              title="供应商"
              dataIndex="supplier_info_list"
              key="supplier_info_list"
              width={180}
              render={(text) => {
                // 判断数据是否存在
                if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
                  return '--';
                }
                // 只有一行数据数据则直接返回
                if (text.length === 1) {
                  return dot.get(text, '0.name');
                }
                // 默认使用弹窗显示数据
                return (
                  <Tooltip title={text.map(item => item.name).join(' , ')}>
                    <span>{dot.get(text, '0.name')} 等{text.length}条</span>
                  </Tooltip>
                );
              }
              }
            />
          </ColumnGroup>
          <Column
            title="操作"
            dataIndex="operation"
            key="operation"
            width={70}
            render={(text, record) => {
              let operationUpadate;
              let operationDetails;
              // 操作 编辑用户权限
              if (canOperateAnnouncementPermissionsUpdate() === true) {
                operationUpadate = <a className={style.boss_announcement_list_operation_update} href={`/#/Announcement/Permissions/Update?id=${record._id}`}>编辑</a>;
              }
              // 操作 编辑用户权限
              if (canOperateAnnouncementPermissionsDetail() === true) {
                operationDetails = <a className={style.boss_announcement_list_operation_detail} target="_blank" rel="noopener noreferrer" href={`/#/Announcement/Permissions/Detail?id=${record._id}`}>详情</a>;
              }
              return (
                <div>
                  {operationUpadate}
                  {operationDetails}
                </div>
              );
            }
            }
          />
        </Table>
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染列表内容 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ permissions: { permissionsData } }) {
  return { permissionsData };
}

export default connect(mapStateToProps)(Permissions);
