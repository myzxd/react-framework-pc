/**
 * 无私教业主团队监控
 **/
import is from 'is_js';
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Tooltip } from 'antd';
import { CoreContent } from '../../../../components/core';
import Search from './search';
import CreateModal from './create/modal';

import { authorize } from '../../../../application';
import { TeamOwnerManagerState } from '../../../../application/define';
import Modules from '../../../../application/define/modules';

const Monitoring = (props) => {
  const { dispatch, monitoringData = {}, getMonitoringData, clearData } = props;
  const { data: dataSource = [] } = monitoringData;
  const [searchParams, setSearchParams] = useState({});
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  const [visibles, setVisibles] = useState(false);
  const [monitoringInfo, setMonitoringInfo] = useState({});

  useEffect(() => {
    getMonitoringData({ meta, ...searchParams });
    return () => clearData();
  }, [getMonitoringData, dispatch, searchParams, meta]);

  // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({ page, limit });
  };

  // 搜索
  const onSearch = (params) => {
    const payload = {
      meta,
      ...params,
    };
    setSearchParams(payload);
    setMeta({ page: 1, limit: 30 });
  };

  // 创建私教
  const onCreatePersonal = (values) => {
    setVisibles(true);
    setMonitoringInfo(values);
  };

  // 隐藏弹窗
  const hiadeModal = () => {
    setVisibles(false);
  };

  // 渲染搜索
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} />
    );
  };

  const renderCreateModal = () => {
    return (
      <CreateModal
        searchParams={searchParams}
        meta={meta}
        onHideModal={hiadeModal}
        visibles={visibles}
        monitoringInfo={monitoringInfo}
      />
    );
  };
  // 判断是否有业主管理编辑页面跳转的权限
  const checkAuthor = () => {
    return authorize.modules().some(item => item.id === Modules.ModuleTeamManagerUpdate.id);
  };
  // 列表
  const renderTable = () => {
    const authorFlag = checkAuthor();
    const columns = [
      {
        title: '业主姓名',
        dataIndex: 'staff_info',
        key: 'staff_info.name',
        render: (text, rowData) => {
          if (authorFlag && rowData._id && rowData.state !== TeamOwnerManagerState.notEffect) {
            return (<a
              href={`/#/Team/Manager/Update?id=${rowData._id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {dot.get(text, 'name', '--')}
            </a>);
          }
          return text && text.name ? text.name : '--';
        },
      },
      {
        title: '业主团队ID',
        dataIndex: '_id',
      },
      {
        title: '业主手机号',
        dataIndex: ['staff_info', 'phone'],
        render: text => text || '--',
      },
      {
        title: '业主身份证号',
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
        title: '平台',
        dataIndex: 'platform_names',
        key: 'platform_name',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '--';
          }
          // 只有一行数据数据则直接返回
          if (text.length === 1) {
            return dot.get(text, '0');
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.map(item => item).join(' , ')}>
              <span>{dot.get(text, '0')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplier_names',
        key: 'supplier_name',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '--';
          }
          // 只有一行数据数据则直接返回
          if (text.length === 1) {
            return dot.get(text, '0');
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.map(item => item).join(' , ')}>
              <span>{dot.get(text, '0')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      },
      {
        title: '城市',
        dataIndex: 'city_names',
        key: 'city_names',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '--';
          }
          // 只有一行数据数据则直接返回
          if (text.length === 1) {
            return dot.get(text, '0');
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.map(item => item).join(' , ')}>
              <span>{dot.get(text, '0')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: (text, record) => {
          if (record.state === TeamOwnerManagerState.notEffect) {
            return <span style={{ color: 'rgba(0,0,0,0.25)' }}>添加私教管理</span>;
          }
          return <a onClick={() => { onCreatePersonal(record); }}>添加私教管理</a>;
        },
      },
    ];
    // 分页
    const pagination = {
      current: meta.page,
      pageSize: meta.limit,                     // 默认数据条数
      onChange: onChangePage,                   // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(monitoringData, '_meta.result_count', 0), // 数据总条数
    };
    return (
      <CoreContent>
        <Table
          pagination={pagination}
          columns={columns}
          rowKey={(re, key) => re._id || key}
          dataSource={dataSource}
        />
      </CoreContent>
    );
  };
  return (
    <div>
      {/* 渲染搜索 */}
      {renderSearch()}

      {/* 渲染列表 */}
      {renderTable()}

      {/* 创建 */}
      {renderCreateModal()}
    </div>
  );
};

const mapStateToProps = ({ teamTeacher: { monitoringData } }) => ({ monitoringData });

const mapDispatchToProps = dispatch => ({
  getMonitoringData: params => dispatch({
    type: 'teamTeacher/fetchTeamTeacherMonitoringList',
    payload: params,
  }),
  clearData: () => dispatch({
    type: 'teamTeacher/resetTeamTeacherMonitoringList',
    payload: {},
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
