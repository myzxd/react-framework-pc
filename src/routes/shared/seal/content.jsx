/*
 * 共享登记 - 印章列表 - 表格组件 /Shared/Seal
 */
import moment from 'moment';
import React, { useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { CoreContent } from '../../../components/core';
import {
  SharedSealState,
  SharedContractBorrowState,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

const Content = ({
  sealList = {}, // 印章列表
  onShowSizeChange = () => {},
  onChangePage = () => {},
  dispatch,
  enumeratedValue = {},
}) => {
  const { data = [], _meta: meta = {} } = sealList;

  useEffect(() => {
    dispatch({
      type: 'codeRecord/getEnumeratedValue',
      payload: {},
    });

    return () => {
      dispatch({
        type: 'codeRecord/resetEnumerateValue',
        payload: {},
      });
    };
  }, [dispatch]);


  // 渲染 印章类型
  const renderSealType = (sealType) => {
    const sealTypes = enumeratedValue.seal_types || [];
    let sealValue = '--';
    if (sealTypes.length > 0) {
      sealTypes.forEach((item) => {
        if (item.value === sealType) {
          sealValue = item.name;
        }
      });
    }
    return sealValue;
  };

  const columns = [
    {
      title: '印章ID',
      dataIndex: '_id',
    },
    {
      title: '印章名称',
      dataIndex: 'name',
    },
    {
      title: '印章类型',
      dataIndex: 'seal_type',
      render: (text) => {
        if (text) return renderSealType(text);
        return '--';
      },
    },
    {
      title: '公司名称',
      dataIndex: ['firm_info', 'name'],
    },
    {
      title: '保管人',
      dataIndex: ['keep_account_info', 'name'],
    },
    {
      title: '印章状态',
      dataIndex: 'state',
      render: (text) => {
        if (text) return SharedSealState.description(text);
        return '--';
      },
    },
    {
      title: '借用状态',
      dataIndex: 'borrow_state',
      render: (text) => {
        if (text) return SharedContractBorrowState.description(text);
        return '--';
      },
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
        const formUrl = `/#/Shared/Seal/Update?id=${id}`;
        const detailUrl = `/#/Shared/Seal/Detail?id=${id}`;
        return (
          <div>
            {
              Operate.canOperateSharedSealDetail() ?
                (<a href={detailUrl} target="_blank" rel="noopener noreferrer">查看</a>)
                : ''
            }
            {
              Operate.canOperateSharedSealUpdate() ?
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
    <CoreContent title="印章列表">
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
  codeRecord: { enumeratedValue },
}) => {
  return { enumeratedValue };
};


export default connect(mapStateToProps)(Content);
