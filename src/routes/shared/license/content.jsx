/*
 * 共享登记 - 证照列表 - 表格组件 /Shared/license
 */
import moment from 'moment';
import React from 'react';
import { Table } from 'antd';

import { CoreContent } from '../../../components/core';
import {
  AdministrationLicense,
  SharedLicenseType,
  SharedLicenseBorrowState,
  AdministrationLicenseType,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

const Content = ({
  licenseList = {}, // 证照列表
  onShowSizeChange = () => {},
  onChangePage = () => {},
}) => {
  const { data = [], _meta: meta = {} } = licenseList;

  const columns = [
    {
      title: '证照ID',
      dataIndex: '_id',
    },
    {
      title: '证照名称',
      dataIndex: 'name',
    },
    {
      title: '正副本',
      dataIndex: 'origin',
      render: (text) => {
        return text ? AdministrationLicenseType.description(text) : '--';
      },
    },
    {
      title: '证照编号',
      dataIndex: 'cert_no',
      render: (text) => {
        return text || '--';
      },
    },
    {
      title: '原件/复印件',
      dataIndex: 'display',
      render: (text) => {
        if (text) return AdministrationLicense.description(text);
        return '--';
      },
    },
    {
      title: '证照类型',
      dataIndex: 'cert_type',
      render: (text) => {
        if (text) return SharedLicenseType.description(text);
        return '--';
      },
    },
    {
      title: '公司名称',
      dataIndex: ['firm_info', 'name'],
    },
    {
      title: '负责人',
      dataIndex: ['keep_account_info', 'name'],
      render: text => text || '--',
    },
    {
      title: '证照状态',
      dataIndex: 'borrow_state',
      render: text => (text ? SharedLicenseBorrowState.description(text) : '--'),
    },
    {
      title: '借用人',
      dataIndex: ['borrower_info', 'name'],
      render: text => text || '--',
    },
    {
      title: '预计归还时间',
      dataIndex: 'expected_return_date',
      render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      width: 150,
      render: (id) => {
        const formUrl = `/#/Shared/License/Update?id=${id}`;
        const detailUrl = `/#/Shared/License/Detail?id=${id}`;
        return (
          <div>
            {
              Operate.canOperateSharedLicenseDetail() ?
                (<a href={detailUrl} target="_blank" rel="noopener noreferrer">查看</a>)
                : ''
            }
            {
              Operate.canOperateSharedLicenseUpdate() ?
                (<a href={formUrl} style={{ marginLeft: 10 }}>编辑</a>)
                : ''
            }
          </div>
        );
      },
    },
  ];

  const pagination = {
    current: meta.page || 1,
    defaultPageSize: 30,
    pageSize: meta.page_size || 30,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: onChangePage,
    onShowSizeChange,
    showTotal: showTotal => `总共${showTotal}条`,
    total: meta.result_count,
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  return (
    <CoreContent title="证照列表">
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
      />
    </CoreContent>
  );
};

export default Content;
