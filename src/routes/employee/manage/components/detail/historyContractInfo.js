/**
  劳动者档案 - 历史合同信息
*/
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import { CoreContent } from '../../../../../components/core';
import { HistoryContractState, SignContractType } from '../../../../../application/define';
import HistoryContractInfoSearch from './historyContractSearch';


function HistoryContractInfo(props) {
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  const [searchParams, setSearchParams] = useState({});
  const { dispatch, contractData, location: { query = {} } } = props;
  const { staffId, identityCardId } = query;

  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchContractInfoData',
      payload: {
        meta,
        id: staffId,
        identity: identityCardId,
        state: [HistoryContractState.one, HistoryContractState.two, HistoryContractState.three, HistoryContractState.four],
        ...searchParams,
      } });
    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeContractInfo',
        payload: {},
      });
    };
  }, [dispatch, meta, searchParams, staffId, identityCardId]);

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
        title: '协议编号',
        dataIndex: 'contract_no',
        key: 'contract_no',
        render: text => text || '--',
      },

      {
        title: '甲方',
        dataIndex: ['third_part_info', 'name'],
        key: 'third_part_info.name',
        render: text => text || '--',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: text => (text ? HistoryContractState.description(text) : '--'),
      },
      {
        title: '失效原因',
        dataIndex: '失效原因',
        key: '失效原因',
        render: (text, record) => {
          if (record.delete_reason || record.delete_reason) {
            const arr = [];
            // 删除原因
            if (record.delete_reason) {
              arr.push(record.delete_reason);
            }
            // 失败原因
            if (record.failure_reason) {
              arr.push(record.failure_reason);
            }
            return arr.join(', ');
          }
          return '--';
        },
      },
      {
        title: '周期',
        dataIndex: 'contract_cycle',
        key: 'contract_cycle',
        render: (text) => {
          return text ? `${text}` : '--';
        },
      },
      {
        title: '生效日期',
        dataIndex: 'signed_date',
        key: 'signed_date',
        render: (text, record) => {
          const {
            expired_at: expiredAt,
          } = record;
          // 生效日期
          const effective = text && expiredAt
            ? `${text}-${expiredAt}`
            : '--';
          return effective;
        },
      },
      {
        title: '签约方式',
        dataIndex: 'sign_type',
        key: 'sign_type',
        render: text => (text ? SignContractType.description(text) : '--'),
      },
      {
        title: '签约完成时间',
        dataIndex: 'done_at',
        key: 'done_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'contract_asset_url',
        key: 'contract_asset_url',
        render: (text) => {
          if (text) {
            return (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={text}
                download
              >下载电子合同</a>
            );
          }
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              download
              style={{
                color: 'rgba(0,0,0,.25)',
              }}
            >下载电子合同</a>
          );
        },
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
      total: dot.get(contractData, '_meta.count', 0),  // 数据总条数
    };
    return (
      <Table rowKey={({ _id: id }) => id} pagination={pagination} columns={columns} dataSource={dot.get(contractData, 'data', [])} bordered />
    );
  };

  return (
    <CoreContent title={`${query.name || ''}历史合同/承揽协议信息`}>
      <HistoryContractInfoSearch onSearch={setSearchParams} />
      {/* 渲染主体内容 */}
      {renderContent()}
    </CoreContent>
  );
}

function mapStateToProps({ employeeManage: { contractData } }) {
  return {
    contractData,
  };
}
export default connect(mapStateToProps)(HistoryContractInfo);
