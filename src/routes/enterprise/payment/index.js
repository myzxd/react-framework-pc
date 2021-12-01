/**
 *  付款单列表
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';

import Search from './search';
import { CoreContent } from '../../../components/core';
import { Unit, EnterprisePaymentState } from '../../../application/define';
import Operate from '../../../application/define/operate';

const EnterprisePayment = (props = {}) => {
  const {
    paymentList = {},
    fetchDataSource = () => { },
  } = props;
  // 分页值
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 30 });

  // 列表数据请求
  useEffect(() => {
    const params = {
      ...searchParams,
    };
    fetchDataSource(params);
  }, [fetchDataSource, searchParams]);

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 查询
  const onSearch = (params) => {
    // 设置搜索参数
    setSearchParams({
      ...params,
      page: 1,
      limit: 30,
    });
  };

  // 跳转到新增付款单页面
  const addPaymentOrder = () => {
    window.location.href = '/#/Enterprise/Payment/paymentOrder';
  };

  // 渲染查询
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} />
    );
  };

  // 渲染表格
  const renderTable = () => {
    const { page, limit } = searchParams;
    const dataSource = dot.get(paymentList, 'data', []);
    let titleExt = '';
    if (Operate.canOperateEnterprisePaymentUpdate()) {
      titleExt = (<Button type="primary" onClick={addPaymentOrder}>新增付款单</Button>);
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => {
          const num = (limit * (page - 1)) + index + 1;
          return <div>{num}</div>;
        },
      },
      {
        title: '付款金额',
        dataIndex: 'total_money',
        key: 'total_money',
        render: (text) => {
          return text ? Unit.exchangePriceCentToMathFormat(text) : '--';
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return EnterprisePaymentState.description(text);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD') : '--';
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (text) => {
          return <a href={`/#/Enterprise/Payment/Detail?id=${text._id}`}>详情</a>;
        },
      },
    ];
    // 分页
    const pagination = {
      current: page,                           // 每次点击查询, 重置页码为1
      defaultPageSize: limit,                  // 默认数据条数
      pageSize: limit,                         // 每页条数
      onChange: onChangePage,             // 切换分页
      showQuickJumper: true,                   // 显示快速跳转
      showSizeChanger: true,                   // 显示分页
      onShowSizeChange, // 展示每页数据数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(paymentList, '_meta.result_count', 0), // 数据总条数
    };
    return (
      <CoreContent title="付款单列表" titleExt={titleExt}>
        <Table
          rowKey={(record, index) => { return index; }}
          pagination={pagination}
          dataSource={dataSource}
          columns={columns}
        />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染查询 */}
      {renderSearch()}

      {/* 渲染表格 */}
      {renderTable()}
    </div>
  );
};

const mapStateToProps = ({ enterprisePayment: { paymentList } }) => ({
  paymentList,
});

const mapDispatchToProps = dispatch => (
  {
    fetchDataSource: params => dispatch({
      type: 'enterprisePayment/fetchPaymentList',
      payload: params,
    }),
  }
);
export default connect(mapStateToProps, mapDispatchToProps)(EnterprisePayment);
