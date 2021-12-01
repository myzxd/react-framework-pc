/**
  劳动者档案 - 历史工作信息
*/
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import { CoreContent } from '../../../../../components/core';
import {
  StaffTeamRank,
  WorkState,
  CityIndustryState,
  TeamMemberAttribute,
} from '../../../../../application/define';


function HistoryWorkInfo(props) {
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  const { dispatch, workData, location: { query = {} } } = props;
  const { staffId } = query;
  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchWorkInfoData',
      payload: {
        meta,
        staffId,
        state: [-100], // 已退出
      } });
    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeWorkInfo',
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
        dataIndex: ['team_info', 'industry_code'],
        key: 'team_info.industry_code',
        render: (text) => {
          return text ? CityIndustryState.description(text) : '--';
        },
      },
      {
        title: '平台',
        dataIndex: ['team_info', 'platform_name'],
        key: 'team_info.platform_name',
        render: text => text || '--',
      },
      {
        title: '平台证件号',
        dataIndex: 'identity_card_id',
        key: 'identity_card_id',
        render: text => text || '--',
      },
      {
        title: '供应商',
        dataIndex: ['team_info', 'supplier_name'],
        key: 'team_info.supplier_name',
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: ['team_info', 'city_name'],
        key: 'team_info.city_name',
        render: text => text || '--',
      },
      {
        title: '商圈',
        dataIndex: ['team_info', 'biz_district_name'],
        key: 'team_info.biz_district_name',
        render: text => text || '--',
      },
      {
        title: '加入时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '退出时间',
        dataIndex: 'quit_at',
        key: 'quit_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '工作状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return text ? WorkState.description(text) : '--';
        },
      },
      {
        title: '团队身份',
        dataIndex: 'role',
        key: 'role',
        render: (text) => {
          return text ? StaffTeamRank.description(text) : '--';
        },
      },
      {
        title: '成员类型',
        dataIndex: 'member_attribute',
        render: text => TeamMemberAttribute.description(text),
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
      total: dot.get(workData, '_meta.result_count', 0),  // 数据总条数
    };
    return (
      <Table rowKey={({ _id: id }) => id} pagination={pagination} columns={columns} dataSource={dot.get(workData, 'data', [])} bordered />
    );
  };

  return (
    <CoreContent title={`${query.name || '--'}历史工作信息`}>
      {/* 渲染主体内容 */}
      {renderContent()}
    </CoreContent>
  );
}

function mapStateToProps({ employeeManage: { workData } }) {
  return {
    workData,
  };
}
export default connect(mapStateToProps)(HistoryWorkInfo);
