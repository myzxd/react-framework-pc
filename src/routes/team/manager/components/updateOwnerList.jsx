/**
 * 业主管理 - 编辑页 - 业主团队变更记录列表
 */
import moment from 'moment';
import { connect } from 'dva';
import { Table, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';

import { CoreContent } from '../../../../components/core';
import {
  TeamUpdateOwnerEffectiveState,
  TeamUpdateOwnerEffectiveEventState,
  Gender,
  TeamOwnerManagerState,
} from '../../../../application/define';

function ComponentUpdateOwnerList(props) {
  const { dispatch, teamManagerUpdateOwnerList = {}, tiemStamp, ownerId, isDetail } = props;
  const { data: dataSource = [], _meta: paginationMeta = {} } = teamManagerUpdateOwnerList;
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  useEffect(() => {
    if (!ownerId) {
      return;
    }
    // tiemStamp判断是否需要重载
    const payload = {
      ...meta,
      ownerId,
    };
    // 请求接口
    dispatch({ type: 'teamManager/fetchTeamManagerUpdateOwnerList', payload });
    return () => {
      // 清除数据
      dispatch({ type: 'teamManager/reduceTeamManagerUpdateOwnerList', payload: {} });
    };
  }, [dispatch, meta, tiemStamp, ownerId]);

  // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({ page, limit });
  };

  // 成功回调
  const onSuccessCallBack = () => {
    const params = { ...meta };
    setMeta(params);
  };

  // 取消待生效
  const onChangeCancel = (id) => {
    const payload = {
      id,
      onSuccessCallBack,
    };
    dispatch({ type: 'teamManager/cancelTeamManagerUpdateOwnerListItem', payload });
  };

  // 业主团队变更记录
  const renderTable = () => {
    const columns = [
      {
        title: '动作',
        dataIndex: 'event',
        key: 'event',
        render: text => TeamUpdateOwnerEffectiveEventState.description(text),
      },
      {
        title: '操作人',
        dataIndex: ['operator_info', 'name'],
        key: 'operator_info.name',
        render: text => text || '--',
      },
      {
        title: '变更后业主姓名',
        dataIndex: ['staff_info', 'name'],
        key: 'staff_info.name',
        render: text => text || '--',
      },
      {
        title: '性别',
        dataIndex: ['staff_info', 'gender_id'],
        key: 'staff_info.gender_id',
        render: (text) => {
          return text ? Gender.description(text) : '--';
        },
      },
      {
        title: '手机号',
        dataIndex: ['staff_info', 'phone'],
        key: 'staff_info.phone',
        render: text => text || '--',
      },
      {
        title: '身份证号',
        dataIndex: ['staff_info', 'identity_card_id'],
        key: 'staff_info.identity_card_id',
        render: (text, record) => {
          if (record.state === TeamOwnerManagerState.notEffect) {
            return record.identity_card_id ? record.identity_card_id : '--';
          }
          return text || '--';
        },
      },
      {
        title: '操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '生效状态',
        dataIndex: 'state',
        key: 'state',
        render: text => TeamUpdateOwnerEffectiveState.description(text),
      },
      {
        title: '生效日期',
        dataIndex: 'plan_done_date',
        key: 'plan_done_date',
        render: text => (text ? moment(`${text}`).format('YYYY年MM月DD日') : '--'),
      },
    ];
    // 判断是否是详情
    if (!isDetail) {
      columns.push(
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 80,
          render: (text, record) => {
            // 判断是否是待生效
            if (record.state === TeamUpdateOwnerEffectiveState.effectBefore) {
              return (<Popconfirm
                title="是否确认取消本次变更?"
                onConfirm={() => onChangeCancel(record._id)}
                okText="确定"
                cancelText="取消"
              >
                <span className="app-global-compoments-cursor">取消</span>
              </Popconfirm>);
            }
            return '--';
          },
        });
    }

    // 分页
    const pagination = {
      current: paginationMeta.page || 1,
      defaultPageSize: 30,                      // 默认数据条数
      pageSize: paginationMeta.limit || 30,            // 每页展示条数
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onChange: onChangePage,  // 切换分页
      onShowSizeChange, // 展示每页数据
      showTotal: showTotal => `总共${showTotal}条`,      // 数据展示总条数
      total: paginationMeta.result_count,
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    return (
      <CoreContent
        title="业主团队变更记录"
      >
        <Table
          rowKey={record => record._id}
          pagination={pagination}
          dataSource={dataSource}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  };

  // 业主团队变更记录
  return renderTable();
}


const mapStateToProps = ({ teamManager: { teamManagerUpdateOwnerList } }) => {
  return { teamManagerUpdateOwnerList };
};

export default connect(mapStateToProps)(ComponentUpdateOwnerList);
