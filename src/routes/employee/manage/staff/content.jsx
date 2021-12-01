/*
 * 人员管理 - 人员档案 - 员工档案 - content
 */
import moment from 'moment';
import React, { useState } from 'react';
import { Link } from 'dva/router';
import {
  Table,
  Button,
} from 'antd';
import {
  SignContractType,
  SigningState,
  StaffSate,
  OrganizationDepartmentState,
  StaffTag,
  AccountApplyWay,
  ContractState,
  StaffTabKey,
} from '../../../../application/define';
import { CoreContent } from '../../../../components/core';
import { system, utils } from '../../../../application';
import Operate from '../../../../application/define/operate';

import ChangeTeam from '../menu/components/changeTeam';
import Resignation from '../components/other/regignation';

const codeFlag = system.isShowCode(); // 判断是否是code

// 权限
// 编辑
const canOperateEmployeeSearchUpdateButton = Operate.canOperateEmployeeSearchUpdateButton();
// 变更team
const canOperateEmployeeChangeScendTeam = Operate.canOperateEmployeeChangeScendTeam();
// 办理离职
const canOperateEmployeeResignVerifyForceButton = Operate.canOperateEmployeeResignVerifyForceButton();
// 确认离职
const canOperateEmployeeResignButton = Operate.canOperateEmployeeResignButton();

const Content = ({
  onShowSizeChange = () => {},
  onChangePage = () => {},
  staffList = {}, // 员工列表
  loading, // 是否为加载中
  getStaffList, // 获取员工列表
  tabKey,
}) => {
  // selectedRowKeys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 办理离职modal visible
  const [visible, setVisible] = useState(false);
  // 当前操作人员detail
  const [staffDetail, setStaffDetail] = useState({});

  const { data = [], _meta: meta = {} } = utils.dotOptimal(staffList, tabKey, {});

  // 办理离职
  const onResignation = (rec) => {
    setStaffDetail(rec);
    setVisible(true);
  };

  // 修改team成功回调
  const onChangeTeamCallBack = () => {
    setSelectedRowKeys([]);
    getStaffList && getStaffList();
  };

  // 操作
  const renderOption = (text, rec) => {
    // 详情
    const detailOp = (
      <a
        href={`/#/Employee/Detail?id=${rec._id}&fileType=staff`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 10 }}
      >查看详情</a>
    );

    // 编辑
    const updateOp = canOperateEmployeeSearchUpdateButton && rec.state !== SigningState.release ? (
      <Link
        to={{
          pathname: '/Employee/Update',
          query: { id: rec._id, fileType: 'staff' },
        }}
        style={{ marginRight: 10 }}
      >编辑</Link>
    ) : '';

    // 办理离职
    const handleResignOp = canOperateEmployeeResignVerifyForceButton
      && rec.state !== SigningState.release
      && rec.state !== StaffSate.willResign
      ? (
        <a
          onClick={() => onResignation(rec)}
        >办理离职</a>
      ) : '';

    // 确认离职
    const confirmResignOp = canOperateEmployeeResignButton
      && rec.state === StaffSate.willResign
      ? (
        <a
          href={`/#/Employee/Resign?id=${rec._id}&fileType=staff`}
          target="_blank"
          rel="noopener noreferrer"
        >确认离职</a>
      ) : '';

    return (
      <React.Fragment>
        {detailOp}
        {updateOp}
        {handleResignOp}
        {confirmResignOp}
      </React.Fragment>
    );
  };

  // 「试用期」「续签」「离职」tab操作
  const renderOtherOption = (text) => {
    return (
      <a
        href={`/#/Employee/Detail?id=${text}&fileType=staff`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 10 }}
      >查看详情</a>
    );
  };

  // 获取全部columns
  const getAllColumns = () => {
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
        width: 150,
        title: '部门',
        dataIndex: 'department_info_list',
        render: (text = []) => {
          if (!Array.isArray(text) || text.length < 1) return '--';
          return text.reduce((cur, item, idx) => {
            // 已裁撤状态
            const state = Operate.canOperateEmployeeAbolishDepartment() && item.state === OrganizationDepartmentState.disable
              ? OrganizationDepartmentState.description(item.state) : '';
            if (idx === 0) {
              return state ? `${item.name}(${state})` : `${item.name}`;
            }
            return state ? `${cur}，${item.name}(${state})` : `${cur}，${item.name}`;
          }, '');
        },
      },
      {
        width: 150,
        title: '岗位',
        dataIndex: 'major_job_info',
        render: text => utils.dotOptimal(text, 'name', '--'),
      },
      {
        width: 100,
        title: '部门编号',
        dataIndex: 'major_department_info',
        render: text => utils.dotOptimal(text, 'code', '--'),
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
        width: 150,
        title: '员工标签',
        dataIndex: 'work_label',
        render: (text = []) => {
          if (!text || !Array.isArray(text) || text.length <= 0) return '--';
          return text.map(i => StaffTag.description(i)).join('、');
        },
      },
      {
        width: 150,
        title: '签约类型',
        dataIndex: 'sign_type',
        render: text => (text ? SignContractType.description(text) : '--'),
      },
      {
        width: 150,
        title: '员工状态',
        dataIndex: 'state',
        render: text => (text ? StaffSate.description(text) : '--'),
      },
      {
        width: 150,
        title: '合同状态',
        dataIndex: 'contract_state',
        render: text => (text ? ContractState.description(text) : '--'),
      },
      {
        title: '合同甲方',
        dataIndex: 'contract_belong_info',
        render: text => (text && text.name ? text.name : '--'),
      },
      {
        width: 200,
        title: '应聘途径',
        dataIndex: 'application_channel_id',
        render: text => (text ? AccountApplyWay.description(text) : '--'),
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

    return columns;
  };

  // 获取试用期columns
  const getProbationColumns = () => {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        fixed: 'left',
      },
      {
        title: '部门',
        dataIndex: 'department_info_list',
        render: (text) => {
          return text.reduce((cur, item, idx) => {
            // 已裁撤状态
            const state = Operate.canOperateEmployeeAbolishDepartment() && item.state === OrganizationDepartmentState.disable
              ? OrganizationDepartmentState.description(item.state) : '';
            if (idx === 0) {
              return state ? `${item.name}(${state})` : `${item.name}`;
            }
            return state ? `${cur}，${item.name}(${state})` : `${cur}，${item.name}`;
          }, '');
        },
      },
      {
        title: '部门编号',
        dataIndex: 'major_department_info',
        render: text => utils.dotOptimal(text, 'code', '--'),
      },
      {
        title: '岗位',
        dataIndex: 'major_job_info',
        key: 'post_name',
        render: text => utils.dotOptimal(text, 'name', '--'),
      },
      {
        title: '职级',
        dataIndex: 'major_job_info',
        key: 'post_rank',
        render: text => utils.dotOptimal(text, 'rank', '--'),
      },
      {
        title: '试用期到期情况',
        dataIndex: 'regular_left_days',
        render: (text) => {
          if (!text && text !== 0) return '--';
          if (text === 0) return '今天到期';
          if (text > 0) return `剩余${text}天`;
          if (text < 0) return `已过期${Math.abs(text)}天`;
        },
      },
      {
        title: '入职日期',
        dataIndex: 'entry_date',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '预计转正日期',
        dataIndex: 'regular_date',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: text => renderOtherOption(text),
      },
    ];

    return columns;
  };

  // 获取续签columns
  const getRenewColumns = () => {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        fixed: 'left',
      },
      {
        title: '所属部门',
        dataIndex: 'department_info_list',
        render: (text) => {
          return text.reduce((cur, item, idx) => {
            // 已裁撤状态
            const state = Operate.canOperateEmployeeAbolishDepartment() && item.state === OrganizationDepartmentState.disable
              ? OrganizationDepartmentState.description(item.state) : '';
            if (idx === 0) {
              return state ? `${item.name}(${state})` : `${item.name}`;
            }
            return state ? `${cur}，${item.name}(${state})` : `${cur}，${item.name}`;
          }, '');
        },
      },
      {
        title: '岗位',
        dataIndex: 'major_job_info',
        key: 'post',
        render: text => utils.dotOptimal(text, 'name', '--'),
      },
      {
        title: '职级',
        dataIndex: 'major_job_info',
        key: 'rank',
        render: text => utils.dotOptimal(text, 'rank', '--'),
      },
      {
        title: '部门编号',
        dataIndex: 'major_department_info',
        render: text => utils.dotOptimal(text, 'code', '--'),
      },
      {
        title: '当前合同到期情况',
        dataIndex: 'current_end_left_days',
        render: (text) => {
          if (!text && text !== 0) return '--';
          if (text === 0) return '今天到期';
          if (text > 0) return `剩余${text}天`;
          if (text < 0) return `已过期${Math.abs(text)}天`;
        },
      },
      {
        title: '入职日期',
        dataIndex: 'entry_date',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '当前合同生效日期',
        dataIndex: 'current_start_at',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '当前合同结束日期',
        dataIndex: 'current_end_at',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: text => renderOtherOption(text),
      },
    ];

    return columns;
  };

  // 获取离职columns
  const getResignColumns = () => {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        fixed: 'left',
      },
      {
        title: '所属部门',
        dataIndex: 'department_info_list',
        render: (text) => {
          return text.reduce((cur, item, idx) => {
            // 已裁撤状态
            const state = Operate.canOperateEmployeeAbolishDepartment() && item.state === OrganizationDepartmentState.disable
              ? OrganizationDepartmentState.description(item.state) : '';
            if (idx === 0) {
              return state ? `${item.name}(${state})` : `${item.name}`;
            }
            return state ? `${cur}，${item.name}(${state})` : `${cur}，${item.name}`;
          }, '');
        },
      },
      {
        title: '岗位',
        dataIndex: 'major_job_info',
        key: 'post_name',
        render: text => utils.dotOptimal(text, 'name', '--'),
      },
      {
        title: '职级',
        dataIndex: 'major_job_info',
        key: 'post_rank',
        render: text => utils.dotOptimal(text, 'rank', '--'),
      },
      {
        title: '部门编号',
        dataIndex: 'major_department_info',
        render: text => utils.dotOptimal(text, 'code', '--'),
      },
      {
        title: '入职日期',
        dataIndex: 'entry_date',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '离职日期',
        dataIndex: 'departure_date',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: text => renderOtherOption(text),
      },
    ];

    return columns;
  };

  // 获取columns
  const getColumns = () => {
    let columns = [];

    // 全部
    if (tabKey === StaffTabKey.all) {
      columns = getAllColumns();
    }

    // 试用期
    if (tabKey === StaffTabKey.probation) {
      columns = getProbationColumns();
    }

    // 续签
    if (tabKey === StaffTabKey.renew) {
      columns = getRenewColumns();
    }

    // 离职
    if (tabKey === StaffTabKey.resign) {
      columns = getResignColumns();
    }

    return columns;
  };

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
  const rowSelection = tabKey === StaffTabKey.all ? {
    selectedRowKeys,
    columnWidth: 60,
    getCheckboxProps: rec => ({
      // 离职禁用
      disabled: rec.state === StaffSate.departure,
    }),
    onChange: val => setSelectedRowKeys(val),
  } : null;

  // table scrollX
  let scrollX = 1940;
  // 是code系统
  if (codeFlag) scrollX = 2140;
  // 不为「全部」列表时，不设置scrollX
  if (tabKey !== StaffTabKey.all) scrollX = false;

  // 渲染列表
  const renderContent = () => {
    return (
      <Table
        rowKey={(re, key) => re._id || key}
        columns={getColumns()}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection}
        bordered
        loading={loading}
        scroll={{ y: 500, x: scrollX }}
      />
    );
  };

  // 办理离职modal
  const renderResignationModel = () => {
    if (!visible) return;
    return (
      <Resignation
        visible={visible}
        onCancel={() => setVisible(false)}
        staffDetail={staffDetail}
        getStaffList={getStaffList}
      />
    );
  };

  // titleExt
  const titleExt = tabKey === StaffTabKey.all ? (
    <React.Fragment>
      {
        canOperateEmployeeChangeScendTeam ? (
          <ChangeTeam
            selectedRowKeys={selectedRowKeys}
            disabled={selectedRowKeys.length < 1}
            fileType="staff"
            onSuccessCallback={onChangeTeamCallBack}
          />
        ) : ''
      }
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        href="/#/Employee/Create?fileType=staff"
      >新增员工档案</Button>
    </React.Fragment>
  ) : '';

  let tableTitle = '员工档案列表';
  // 试用期title
  if (tabKey === StaffTabKey.probation) {
    tableTitle = '以下列表显示的员工数据范围为：人员档案页面中未到「预计转正日期」的员工';
  }
  // 续签title
  if (tabKey === StaffTabKey.renew) {
    tableTitle = '以下列表显示的员工数据范围为：人员档案页面中合同临近到期的在职和待离职员工';
  }
  // 离职title
  if (tabKey === StaffTabKey.resign) {
    tableTitle = '';
  }

  return (
    <CoreContent title={tableTitle} titleExt={titleExt}>
      {/* 列表 */}
      {renderContent()}

      {/* 办理离职modal */}
      {renderResignationModel()}
    </CoreContent>
  );
};

export default Content;
