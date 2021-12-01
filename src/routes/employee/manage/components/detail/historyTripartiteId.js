/**
  劳动者档案 - 历史三方ID
*/
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import { EmployeeManageReasonsRevision, CityIndustryState } from '../../../../../application/define';
import { CoreContent } from '../../../../../components/core';


function HistoryTripartiteId(props) {
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  const { dispatch, historyTripartiteId, location: { query = {} } } = props;
  const { staffId } = query;

  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchEmployeeHistoryTripartiteId',
      payload: {
        meta,
        staffId,
      } });
    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeHistoryTripartiteId',
        payload: {},
      });
    };
  }, [dispatch, meta, staffId]);

    // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({
      page,
      limit,
    });
  };

    // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({
      page,
      limit,
    });
  };

  // 渲染主体内容
  const renderContent = () => {
    const columns = [
      {
        title: '所属场景',
        dataIndex: 'industry_code',
        key: 'industry_code',
        render: (text) => {
          return text ? CityIndustryState.description(text) : '--';
        },
      },
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: text => text || '--',
      },
      {
        title: '三方ID',
        dataIndex: 'custom_id_name',
        key: 'custom_id_name',
        render: text => text || '--',
      },
      {
        title: '三方ID更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '修改原因',
        dataIndex: 'update_type',
        key: 'update_type',
        render: (text) => {
          return text ? EmployeeManageReasonsRevision.description(text) : '--';
        },
      },
      {
        title: '说明',
        dataIndex: 'note',
        key: 'note',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '操作人',
        dataIndex: ['operator_info', 'name'],
        key: 'operator_info.name',
        render: text => text || '--',
      },
    ];
        // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: meta.page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: onChangePage,       // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(historyTripartiteId, '_meta.count', 0),  // 数据总条数
    };
    return (
      <Table rowKey={({ _id: id }) => id} pagination={pagination} columns={columns} dataSource={dot.get(historyTripartiteId, 'data', [])} bordered />
    );
  };

  return (
    <CoreContent title={`${query.name || ''}历史三方id信息`}>
      {/* 渲染主体内容 */}
      {renderContent()}
    </CoreContent>
  );
}

function mapStateToProps({ employeeManage: { historyTripartiteId } }) {
  return {
    historyTripartiteId,
  };
}
export default connect(mapStateToProps)(HistoryTripartiteId);
