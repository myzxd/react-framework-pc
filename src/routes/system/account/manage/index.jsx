/**
 * 账号管理
 * */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Table, Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';

import { CoreContent } from '../../../../components/core';
import { AccountState } from './../../../../application/define';
import { canOperateSystemAccountManageVerifyEmployee, canOperateSystemAccountManageUpdate, canOperateSystemAccountManageDatails } from '../../../../application/define/operate';

import Search from './search';
import styles from './style/index.less';

const Index = (props = {}) => {
  const {
    dataSource = {},
    dispatch,
    history,
  } = props;

  const [searchParams, setSearchParams] = useState({ page: 1, limit: 30, state: `${AccountState.on}` });
  // 创建信息
  const onCreateInfo = () => {
    history.push('/System/Account/Manage/Create');
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
    const params = {
      ...searchParams,
      page,
      limit,
    };

    // 调用搜索
    dispatch({ type: 'accountManage/fetchAccounts', payload: params });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
    const params = {
      ...searchParams,
      page,
      limit,
    };

    // 调用搜索
    dispatch({ type: 'accountManage/fetchAccounts', payload: params });
  };

  // 搜索
  const onSearch = (params) => {
    // 设置搜索参数
    setSearchParams({
      ...params,
      page: 1,
      limit: 30,
    });

    // 调用搜索
    dispatch({ type: 'accountManage/fetchAccounts', payload: params });
  };

  // 渲染搜索
  const renderSearch = () => {
    let operations;
    // 操作 判断是否有添加账号的权限
    if (canOperateSystemAccountManageVerifyEmployee() === true) {
      operations = <Button type="primary" onClick={onCreateInfo}>添加账号</Button>;
    }
    return (
      <Search onSearch={onSearch} operations={operations} />
    );
  };

  // 渲染内容列表
  const renderContent = () => {
    const { page = 1, limit } = searchParams;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        fixed: 'left',
        width: 100,
      }, {
        title: '手机',
        dataIndex: 'phone',
        fixed: 'left',
        width: 100,
      }, {
        title: '角色',
        dataIndex: 'role_names',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          if (text.length <= 2) {
            return text.join(', ');
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.join(', ')}>
              <span>{text.slice(0, 2).join(', ')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      },
      {
        title: '关联员工档案',
        dataIndex: 'is_related_staff',
        render: (text) => {
          if (text === true || text === false) {
            return text ? '是' : '否';
          }
          return '--';
        },
      }, {
        title: '账号状态',
        dataIndex: 'state',
        render: text => AccountState.description(text),
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (text) => {
          return (
            <div>{moment(text).format('YYYY-MM-DD HH:mm')}</div>
          );
        },
      }, {
        title: '最新修改时间',
        dataIndex: 'updated_at',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD HH:mm');
        },
      }, {
        title: '最新操作人',
        dataIndex: ['operator_info', 'name'],
        render: text => text || '--',
      }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          const operation = [];
          // 操作 编辑用户权限,判断是否是超管，超管不可编辑
          if (canOperateSystemAccountManageUpdate() === true &&
            record.is_admin !== true) {
            operation.push(
              <a
                href={`/#/System/Account/Manage/Update?id=${record._id}&state=${record.state}`}
              >
                编辑</a>,
            );
          }
          // 操作 编辑用户权限
          if (canOperateSystemAccountManageDatails() === true) {
            operation.push(
              <a
                className={styles['app-comp-system-table-operate-detail']}
                target="_blank" rel="noopener noreferrer"
                href={`/#/System/Account/Manage/Details?id=${record._id}`}
              >详情</a>,
            );
          }
          return (
            <div>
              {operation.length === 0 ? '--' : operation}
            </div>
          );
        },
      }];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      pageSize: limit || 30,          // 默认数据条数
      onChange: onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent>
        <Table
          rowKey={(record) => { return record._id; }}
          pagination={pagination}
          columns={columns}
          dataSource={dataSource.data}
          bordered scroll={{ x: 1470 }}
        />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染搜索 */}
      {renderSearch()}

      {/* 渲染内容列表 */}
      {renderContent()}
    </div>
  );
};

function mapStateToProps({ accountManage: { accounts } }) {
  return { dataSource: accounts };
}

export default connect(mapStateToProps)(Index);
