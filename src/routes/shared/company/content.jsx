/*
 * 共享登记 - 公司列表 - 表格组件 /Shared/Company
 */
import moment from 'moment';
import React from 'react';
import dot from 'dot-prop';
import { Table } from 'antd';
import { connect } from 'dva';
import { CoreContent } from '../../../components/core';
import {
  Unit,
  SharedCompanyState,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

const Content = ({
  companyList = {},
  onShowSizeChange = () => {},
  onChangePage = () => {},
  companyNature,
}) => {
  const { data = [], _meta: meta = {} } = companyList;

  const columns = [
    {
      title: '公司ID',
      dataIndex: '_id',
    },
    {
      title: '公司名称',
      dataIndex: 'name',
    },
    {
      title: '公司类型',
      dataIndex: 'firm_nature',
      render: (text) => {
        if (text) return dot.get(companyNature, `data.${text}`, '--');
        return '--';
      },
    },
    {
      title: '企业代表人',
      dataIndex: 'legal_name',
    },
    {
      title: '注册资本（万）',
      dataIndex: 'registered_capital',
      render: (text) => {
        if (text >= 0) return Unit.exchangePriceToWanYuan(text);
        return '--';
      },
    },
    {
      title: '成立日期',
      dataIndex: 'registered_date',
      render: (text) => {
        if (text) return moment(String(text)).format('YYYY-MM-DD');
        return '--';
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text) => {
        if (text) return SharedCompanyState.description(text);
        return '--';
      },
    },
    {
      title: '操作',
      dataIndex: '_id',
      width: 150,
      render: (id) => {
        const formUrl = `/#/Shared/Company/Update?id=${id}`;
        const detailUrl = `/#/Shared/Company/Detail?id=${id}`;
        return (
          <div>
            {
              Operate.canOperateSharedCompanyDetail() ?
                (<a href={detailUrl} target="_blank" rel="noopener noreferrer">查看</a>)
                : ''
            }
            {
              Operate.canOperateSharedCompanyUpdate() ?
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
    <CoreContent title="公司列表">
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

const mapStateToProps = ({
  sharedCompany: {
    companyNature, // 公司类型
  },
}) => ({ companyNature });
export default connect(mapStateToProps)(Content);
