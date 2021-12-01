/**
 * 供应商管理
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useState } from 'react';
import { Button, Table } from 'antd';
import moment from 'moment';
import Operate from '../../../../application/define/operate';
import { CoreContent } from '../../../../components/core';
import { SupplierState } from '../../../../application/define';
import Search from './search';
import styles from './style/index.less';

const Index = (props = {}) => {
  const {
    dispatch,
    dataSource = {},
  } = props;
    // 搜索信息配置
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 30, state: SupplierState.enable });

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    const params = {
      state: SupplierState.enable,
      page,
      limit,
    };
    setSearchParams({ ...searchParams, page, limit });
    onSearch(params);
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    const params = {
      state: SupplierState.enable,
      page,
      limit,
    };
    setSearchParams({ ...searchParams, page, limit });
    onSearch(params);
  };

  // 搜索
  const onSearch = (params) => {
    // 保存搜索的参数
    setSearchParams({
      ...params,
    });
    dispatch({ type: 'supplierManage/fetchSuppliers', payload: params });
  };

  // 渲染搜索区域
  const renderSearch = () => {
    // 操作
    const operations = [];
    // 判断是否能够添加供应商
    if (Operate.canOperateSystemSupplierUpdate()) {
      operations.push(
        <Button key="OperateSystemSupplierUpdate" type="primary" onClick={() => { window.location.href = '#/System/Supplier/Create'; }} className={styles['app-comp-system-supplier-operate-btn']}>添加供应商</Button>,
      );
    }

    // 业务分布情况(城市)
    if (Operate.canOperateModuleSystemSupplierScopeCity()) {
      operations.push(
        <Button key="OperateModuleSystemSupplierScopeCity" onClick={() => { window.location.href = '#/System/Supplier/Scope/City'; }} className={styles['app-comp-system-supplier-operate-btn']}>业务分布情况（城市）</Button>,
      );
    }

    return (
      <Search onSearch={onSearch} operations={operations} />
    );
  };

  // 渲染内容列表
  const renderContent = () => {
    const { page, limit } = searchParams;

    const columns = [
      {
        title: '供应商ID',
        dataIndex: 'supplier_id',
        key: 'supplier_id',
        render: text => text || '--',
      }, {
        title: '供应商名称',
        dataIndex: 'name',
        key: 'name',
        render: text => text || '--',
      }, {
        title: '所属平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: text => text || '--',
      }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: text => SupplierState.description(text) || '--',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => { return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'; },
      }, {
        title: '停用时间',
        dataIndex: 'forbidden_at',
        key: 'forbidden_at',
        render: (text) => { return text && Number(searchParams.state) === SupplierState.stoped ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'; },
      }, {
        title: '最新操作人',
        dataIndex: 'operator_name',
        key: 'operator_name',
        render: text => text || '--',
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          // 没有数据操作权限，只显示详情操作
          if (Operate.canOperateSystemSupplierUpdate() !== true) {
            return (
              <a href={`#/System/Supplier/Detail?id=${record._id}`} target="_blank" rel="noopener noreferrer" className={styles['app-comp-system-supplier-operate-btn']}>详情</a>
            );
          }
          return (
            <div>
              <a href={`#/System/Supplier/Update?id=${record._id}`} target="_blank" rel="noopener noreferrer" className={styles['app-comp-system-supplier-operate-btn']}>编辑</a>
              <a href={`#/System/Supplier/Detail?id=${record._id}`} target="_blank" rel="noopener noreferrer" className={styles['app-comp-system-supplier-operate-btn']}>详情</a>
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
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dot.get(dataSource, 'data', [])} bordered scroll={{ x: 1000 }} />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染搜索区域 */}
      {renderSearch()}

      {/* 渲染列表 */}
      {renderContent()}
    </div>
  );
};

function mapStateToProps({ supplierManage: { suppliers = {} } }) {
  return { dataSource: suppliers };
}
export default connect(mapStateToProps)(Index);
