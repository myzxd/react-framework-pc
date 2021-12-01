/**
 * 供应商管理-详情页
 */
import React, { useState, useEffect } from 'react';
import dot from 'dot-prop';
import { Link } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Row, Button, Popconfirm } from 'antd';

import { CoreContent, CoreForm } from '../../../../components/core';
import { authorize } from '../../../../application';
import { SupplierState, DistrictState } from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import styles from './style/index.less';

const Detail = (props = {}) => {
  const {
    dispatch,
    districts = {},
    supplierDetail = {},
    location = {},
  } = props;
  // 供应商ID
  const id = location.query.id;
  // 搜索信息配置
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 30 });
  useEffect(() => {
    // 获取供应商id 查询相应商圈列表
    const payload = {
      supplierId: [location.query.id],
      ...searchParams,
    };
    dispatch({ type: 'supplierManage/fetchDistricts', payload });
  }, [id, searchParams]);

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 启用停用数据
  const onUpdateState = (state) => {
    const params = {
      recordId: supplierDetail._id,
      onSuccessCallback: onOperateSuccessCallback,
      supplierState: state,
    };
    dispatch({ type: 'supplierManage/updateSupplierState', payload: params });
  };

  // 服务器请求后的回调函数
  const onOperateSuccessCallback = () => {
    const params = {
      supplierId: supplierDetail._id,
    };
    // 更新数据
    dispatch({ type: 'supplierManage/fetchSupplierDetail', payload: params });
  };

  // 供应商状态切换按钮
  const randerChangeStateButton = () => {
    // 停用供应商
    const stopedTitle = (
      <div className={styles['app-comp-system-detail-stoped-title']}>
        <h2 className={styles['app-comp-system-title']}>你确定要停用该供应商吗?</h2>
        <p>停用后该供应商下<strong className={styles['app-comp-system-line']}>所有系统用户停用</strong></p>
        <p>将不能登录系统,<strong className={styles['app-comp-system-line']}>请慎重!</strong></p>
      </div>
    );
    // 启用供应商
    const enableTitle = (
      <div className={styles['app-comp-system-detail-enable-title']}>
        <h2 className={styles['app-comp-system-title']}>你确定要启用该供应商吗?</h2>
        <p>启用后该供应商下的系统用户将重新启用。</p>
      </div>
    );
    // 判断供应商当前状态 并 渲染是停用还是启用按钮
    if (dot.get(supplierDetail, 'state') === SupplierState.enable) {
      return (
        <Popconfirm title={stopedTitle} okText="确认" cancelText="取消" onConfirm={() => onUpdateState(SupplierState.stoped)}>
          <Button type="primary" className={styles['app-comp-system-detail-operate-btn']}>停用供应商</Button>
        </Popconfirm>
      );
    } else if (dot.get(supplierDetail, 'state') === SupplierState.stoped) {
      return (
        <Popconfirm title={enableTitle} okText="确认" cancelText="取消" onConfirm={() => onUpdateState(SupplierState.enable)}>
          <Button type="primary" className={styles['app-comp-system-detail-operate-btn']}>启用供应商</Button>
        </Popconfirm>
      );
    }
  };

  // 基本信息
  const renderUserInfo = () => {
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item
        label="供应商名称"
        {...layout}
      >
        <span>{dot.get(supplierDetail, 'name', '--')}</span>
      </Form.Item>,
      <Form.Item
        label="供应商ID"
        {...layout}
      >
        <span>{dot.get(supplierDetail, 'supplier_id', '--')}</span>
      </Form.Item>,
      <Form.Item
        label="状态"
        {...layout}
      >
        <span>{supplierDetail && supplierDetail.state ? SupplierState.description(dot.get(supplierDetail, 'state')) : '--'}</span>
      </Form.Item>,
      <Form.Item
        label="创建时间"
        {...layout}
      >
        <span>{supplierDetail && supplierDetail.created_at ? moment(dot.get(supplierDetail, 'created_at')).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
      </Form.Item>,
      <Form.Item
        label="停用时间"
        {...layout}
      >
        <span>{supplierDetail && supplierDetail.forbidden_at && Number(supplierDetail.state) === SupplierState.stoped ? moment(dot.get(supplierDetail, 'forbidden_at')).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
      </Form.Item>,
      <Form.Item
        label="最新操作时间"
        {...layout}
      >
        <span>{supplierDetail && supplierDetail.updated_at ? moment(dot.get(supplierDetail, 'updated_at')).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
      </Form.Item>,
      <Form.Item
        label="最新操作人"
        {...layout}
      >
        <span>{dot.get(supplierDetail, 'operator_info.name', '--')}</span>
      </Form.Item>,
    ];

    return (
      <CoreContent title="基本信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  };

  // 业务范围
  const renderScopeInfo = () => {
    const { page, limit } = searchParams;
    const columns = [
      {
        title: '商圈ID',
        dataIndex: 'customId',
        key: 'customId',
        render: text => text || '--',
      },
      {
        title: '商圈',
        dataIndex: 'name',
        key: 'name',
        render: text => text || '--',
      },
      {
        title: '平台',
        dataIndex: 'platformCode',
        key: 'platformCode',
        render: text => authorize.platformFilter(text),
      },
      {
        title: '城市',
        dataIndex: 'cityInfo',
        key: 'cityInfo',
        render: (text) => {
          return text && text.cityName ? text.cityName : '--';
        },
      },
      {
        title: '商圈添加时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      },
      {
        title: '商圈状态',
        dataIndex: 'state',
        key: 'state',
        render: text => DistrictState.description(text) || '--',
      },
    ];
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: limit,          // 默认数据条数
      onChange: onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(districts, 'meta.count', 0),  // 数据总条数
    };

    return (
      <div>
        <CoreContent
          title="业务范围"
        >
          <Table
            columns={columns}
            dataSource={dot.get(districts, 'data', [])}
            pagination={pagination}
            bordered
            rowKey={(record, index) => { return index; }}
          />
        </CoreContent>
        <Row justify={'center'} type="flex" className="app-global-mgt16">
          {/* 判断用户是否拥有启用停用供应商的权限 */}
          { Operate.canOperateSystemSupplierUpdateState() ? randerChangeStateButton() : null }
          <Button><Link to="/System/Supplier/Manage">返回</Link></Button>
        </Row>
      </div>
    );
  };
  // 渲染
  return (
    <div>
      {/* 基本信息 */}
      {renderUserInfo()}

      {/* 业务范围 */}
      {renderScopeInfo()}
    </div>
  );
};

function mapStateToProps({ supplierManage: { supplierDetail = {}, districts = {} } }) {
  return { supplierDetail, districts };
}

export default Form.create()(connect(mapStateToProps)(Detail));
