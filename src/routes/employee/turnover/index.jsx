/**
 * 人员管理 - 人员异动管理列表
 */
import is from 'is_js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Button, Tooltip } from 'antd';
import dot from 'dot-prop';

import Search from './search';
import style from './style.css';

import { EmployeeTurnoverApplyState, EmployeeTurnoverInfoChangeTask } from '../../../application/define';
import { CoreContent } from '../../../components/core';
import Operate from '../../../application/define/operate';

// 默认分页参数
const defaultPagination = {
  page: 1,
  limit: 30,
};
const privates = {
  searchParams: {},
};

function Contract(props) {
  const [pagination] = useState(defaultPagination);


  useEffect(() => {
    props.dispatch({ type: 'employeeTurnover/fetchEmployeeTurnoverData', payload: defaultPagination });
  }, []);

   // 搜索
  const onSearch = (params) => {
    // 保存搜索的参数
    privates.searchParams = params;
    if (!privates.searchParams.page) {
      privates.searchParams.page = 1;
    }
    if (!privates.searchParams.limit) {
      privates.searchParams.limit = 30;
    }
    // 调用搜索
    props.dispatch({ type: 'employeeTurnover/fetchEmployeeTurnoverData', payload: privates.searchParams });
  };

  // 删除操作
  const onDeleteOpration = (id) => {
    // 参数id与回调函数
    const params = {
      id,
      taskState: EmployeeTurnoverInfoChangeTask.detele, // 任务状态
      onSuccessCallback: () => { props.dispatch({ type: 'employeeTurnover/fetchEmployeeTurnoverData', payload: defaultPagination }); },
    };

    // 调用搜索
    props.dispatch({ type: 'employeeTurnover/EmployeeTurnoverDelete', payload: params });
  };

  // 信息变更
  const onInfoChanges = (id) => {
    // 参数id与回调函数
    const params = {
      id,
      changeState: EmployeeTurnoverInfoChangeTask.finished,
      onSuccessCallback: () => { props.dispatch({ type: 'employeeTurnover/fetchEmployeeTurnoverData', payload: defaultPagination }); },
    };

    // 调用搜索
    props.dispatch({ type: 'employeeTurnover/updateEmployeeTurnover', payload: params });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    const { searchParams } = privates;
    searchParams.page = page;
    searchParams.limit = limit;
    onSearch(searchParams);
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    const { searchParams } = privates;
    searchParams.page = page;
    searchParams.limit = limit;
    onSearch(searchParams);
  };

  // 渲染搜索
  const renderSearch = () => {
    return (
      <Search
        onSearch={onSearch}
      />
    );
  };

  // 渲染操作
  const renderOpration = (record) => {
    let oprationUpdate = ''; // 编辑操作
    let oprationDelete = ''; // 删除操作
    let oprationInfoChange = ''; // 信息变更操作
    // 详情按钮操作
    const oprationDetails = <Link to={{ pathname: '/Employee/Turnover/Detail', search: `?id=${record._id}` }} target="_blank" > 详情 </Link>;
    const flowNodeId = dot.get(record, 'current_flow_node_info', undefined);  // 提报人节点id

    // 添加编辑权限
    if (Operate.canOperateEmployeeTurnoverUpdate()) {
      oprationUpdate = <a src="" className={style['app-comp-employee-contract-opration-download']} onClick={() => { window.location.href = `/#/Employee/Turnover/Update?id=${record._id}`; }}>编辑</a>;
    }

    // 添加删除权限
    if (Operate.canOperateEmployeeTurnoverDelete()) {
      oprationDelete = <a src="" className={style['app-comp-employee-contract-opration-download']} onClick={() => { onDeleteOpration(record._id); }}>删除</a>;
    }

    // 添加信息变更权限
    if (Operate.canOperateEmployeeTurnoverInfoChange()) {
      oprationInfoChange = <a src="" className={style['app-comp-employee-contract-opration-download']} onClick={() => { onInfoChanges(record._id); }}>完成信息变更</a>;
    }

    // 如果审批状态是草稿状态,编辑,详情,删除展示
    if (EmployeeTurnoverApplyState.pendding === record.state) {
      return (
        <div>
          {oprationDetails}
          {oprationUpdate}
          {oprationDelete}
        </div>
      );
    } else if ((EmployeeTurnoverApplyState.rejected === record.state && flowNodeId === null) || EmployeeTurnoverApplyState.withdraw === record.state) {
      // 当状态是驳回或撤回,显示详情,编辑
      return (
        <div>
          {oprationDetails}
          {oprationUpdate}
        </div>
      );
    } else if (EmployeeTurnoverApplyState.done === record.state && EmployeeTurnoverInfoChangeTask.unfinished === record.task_state) {
      // 当状态是审批完成并且变更未完成,显示详情,完成信息变更
      return (
        <div>
          {oprationDetails}
          {oprationInfoChange}
        </div>
      );
    }
    return (
      <div>
        {oprationDetails}
      </div>
    );
  };

  // 渲染表格
  const renderTable = () => {
    const dataSource = dot.get(props, 'employeeTurnoverData.data', []);
    const resultCount = dot.get(props, 'employeeTurnoverData.meta.resultCount', 0);
    const columns = [
      {
        dataIndex: '_id',
        key: '_id',
        title: '申请单号',
        render: (text) => {
          return text || '--';
        },
      },
      {
        dataIndex: 'changed_staff_info',
        key: 'name',
        title: '调岗人',
        render: (text) => {
          return text ? text.name : '--';
        },
      },
      {
        dataIndex: 'changed_staff_info',
        key: 'identity_card_id',
        title: '身份证号',
        render: (text) => {
          return text ? text.identity_card_id : '--';
        },
      },
      {
        dataIndex: 'state',
        key: 'state',
        title: '申请单状态',
        render: (text) => {
          return text ? EmployeeTurnoverApplyState.description(text) : '--';
        },
      },
      {
        dataIndex: 'theme_tags',
        key: 'theme_tags',
        title: '主题标签',
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
        dataIndex: 'active_at',
        key: 'active_at',
        title: '期望生效时间',
        render: (text) => {
          return text ? moment(text).format('YYYY.MM.DD') : '--';
        },
      },
      {
        dataIndex: 'apply_info',
        key: 'apply_info',
        title: '申请人',
        render: (text) => {
          return text ? text.name : '--';
        },
      },
      {
        dataIndex: 'created_at',
        key: 'created_at',
        title: '申请时间',
        render: (text) => {
          return text ? moment(text).format('YYYY.MM.DD') : '--';
        },
      },
      {
        dataIndex: 'task_state',
        key: 'task_state',
        title: '信息变更任务',
        render: (text) => {
          return text ? EmployeeTurnoverInfoChangeTask.description(text) : '--';
        },
      },
      {
        key: 'opration',
        title: '操作',
        render: (text, record) => {
          // 渲染操作
          return (
            <div>
              {renderOpration(record)}
            </div>
          );
        },
      },
    ];

    const paginations = {
      total: resultCount,           // 数据总数
      pageSize: pagination.limit,              // 展示条数
      current: pagination.page,                // 当前页码
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: onChangePage,  // 切换分页
      onShowSizeChange,              // 展示每页数据数
    };
    let createOpration = '';   // 申请单创建
    // 添加权限
    if (Operate.canOperateEmployeeTurnoverCreate()) {
      createOpration = <Button type="primary" onClick={() => { window.location.href = '/#/Employee/Turnover/Create'; }} >调岗申请</Button>;
    }
    return (
      <CoreContent title="人员异动申请列表" titleExt={createOpration}>
        <Table
          bordered
          rowKey={record => record._id}
          columns={columns}
          dataSource={dataSource}
          pagination={paginations}
        />
      </CoreContent>
    );
  };

  return (
    <div>
      {renderSearch()}
      {renderTable()}
    </div>
  );
}

function mapStateToProps({ employeeTurnover: { employeeTurnoverData } }) {
  return { employeeTurnoverData };
}

export default connect(mapStateToProps)(Contract);
