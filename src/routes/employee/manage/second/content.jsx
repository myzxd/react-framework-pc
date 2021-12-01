/*
 * 人员管理 - 人员档案 - 劳动者档案 - content
 */
import React, { useState } from 'react';
import { Link } from 'dva/router';
import {
  Table,
  Tooltip,
} from 'antd';
import {
  HouseholdType,
  SignContractType,
  SigningState,
  StaffSate,
} from '../../../../application/define';
import { CoreContent } from '../../../../components/core';
import { system } from '../../../../application';
import Operate from '../../../../application/define/operate';

import ChangeTeam from '../menu/components/changeTeam';

const codeFlag = system.isShowCode(); // 判断是否是code

// 权限
// 编辑
const canOperateEmployeeSearchUpdateButton = Operate.canOperateEmployeeSearchUpdateButton();
// 变更team
const canOperateEmployeeChangeScendTeam = Operate.canOperateEmployeeChangeScendTeam();

const Content = ({
  onShowSizeChange = () => {},
  onChangePage = () => {},
  employeesSecond = {},
  loading, // 是否为加载中
  getSecondList, // 获取劳动者列表
}) => {
  // selectedRowKeys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data = [], _meta: meta = {} } = employeesSecond;

  // 修改team成功回调
  const onChangeTeamCallBack = () => {
    setSelectedRowKeys([]);
    getSecondList && getSecondList();
  };

  // 渲染list table title
  const renderListTitle = (text) => {
    if (!text || (Array.isArray(text) && text.length < 1)) {
      return '--';
    }
    const len = text.length;
    return (
      <Tooltip
        placement="top"
        title={text && text.toString()}
      >{text[0]}{len > 1 ? `等共${text.length}条` : ''}</Tooltip>
    );
  };

  // 渲染人员状态
  const renderState = (state) => {
    if (state === SigningState.pending) {
      return '待合作';
    } else if (state === SigningState.normal || state === SigningState.replace || state === SigningState.pendingReview || state === SigningState.repair) {
      return '合作中';
    } else if (state === SigningState.release) {
      return '已解除';
    } else {
      return '--';
    }
  };

  // 操作
  const renderOption = (text, rec) => {
    // 详情
    const detailOp = (
      <a
        href={`/#/Employee/Detail?id=${rec._id}&fileType=second`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 10 }}
      >查看详情</a >
    );

    // 编辑
    const updateOp = canOperateEmployeeSearchUpdateButton && rec.state !== SigningState.release ? (
      <Link
        to={{
          pathname: '/Employee/Update',
          query: { id: rec._id, fileType: 'second' },
        }}
        style={{ marginRight: 10 }}
      >编辑</Link>
    ) : '';

    // 下载合同
    const downContractOp = rec.sign_type === SignContractType.electronic && rec.state === SigningState.normal && rec.contract_asset_url ? (
      <a href={rec.contract_asset_url} download>下载合同</a >
    ) : '';

    return (
      <React.Fragment>
        {detailOp}
        {updateOp}
        {downContractOp}
      </React.Fragment>
    );
  };

  // columns
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      fixed: 'left',
      width: 120,
    },
    {
      width: 100,
      title: '人员状态',
      dataIndex: 'state',
      render: text => renderState(text),
    },
    {
      width: 100,
      title: '个户类型',
      dataIndex: 'individual_type',
      render: text => (text ? HouseholdType.description(text) : '--'),
    },
    {
      width: 240,
      title: '第三方平台账户ID',
      dataIndex: 'custom_id_list',
      render: text => renderListTitle(text),
    },
    {
      width: 160,
      title: '风控检测状态',
      dataIndex: 'within_blacklist',
      render: (text) => {
        // 未通过
        if (text === true) {
          return (
            <span
              style={{ color: 'red' }}
            >未通过</span>
          );
        }
        // 通过
        if (text === false) {
          return (
            <span
              style={{ color: 'green' }}
            >通过</span>
          );
        }

        return '--';
      },
    },
    {
      title: '供应商',
      width: 200,
      dataIndex: 'working_supplier_names',
      render: text => renderListTitle(text),
    },
    {
      title: '平台',
      width: 100,
      dataIndex: 'working_platform_names',
      render: text => renderListTitle(text),
    },
    {
      title: '城市',
      width: 150,
      dataIndex: 'working_city_names',
      render: text => renderListTitle(text),
    },
    {
      title: '商圈',
      width: 150,
      dataIndex: 'working_biz_district_names',
      render: text => renderListTitle(text),
    },
    {
      title: '签约类型',
      width: 150,
      dataIndex: 'sign_type',
      render: text => (text ? SignContractType.description(text) : '--'),
    },
    {
      title: '合同甲方',
      width: 200,
      dataIndex: 'contract_belong_info',
      render: text => (text && text.name ? text.name : '--'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 120,
      render: (text, rec) => renderOption(text, rec),
    },
  ];

  // 需要判断是否是code系统
  if (codeFlag) {
    columns.splice(6, 0,
      {
        width: 100,
        title: 'team类型',
        dataIndex: 'cost_team_type',
        render: text => text || '--',
      },
      {
        width: 100,
        title: 'team信息',
        dataIndex: ['cost_team_info', 'name'],
        render: text => text || '--',
      },
    );
  }

  // pagination
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

  // rowSelection
  const rowSelection = {
    selectedRowKeys,
    columnWidth: 60,
    getCheckboxProps: rec => ({
      // 离职禁用
      disabled: rec.state === StaffSate.departure,
    }),
    onChange: val => setSelectedRowKeys(val),
  };

  // 渲染列表
  const renderContent = () => {
    return (
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection}
        bordered
        loading={loading}
        scroll={{ y: 500, x: 2510 }}
      />
    );
  };

  const titleExt = canOperateEmployeeChangeScendTeam ? (
    <ChangeTeam
      selectedRowKeys={selectedRowKeys}
      disabled={selectedRowKeys.length < 1}
      fileType="second"
      onSuccessCallback={onChangeTeamCallBack}
    />
  ) : '';

  return (
    <CoreContent title="劳动者档案列表" titleExt={titleExt}>
      {/* 列表 */}
      {renderContent()}
    </CoreContent>
  );
};

export default Content;
