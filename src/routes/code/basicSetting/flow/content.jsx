/*
* code - 基础设置 - 表格组件
 */
import React from 'react';
import moment from 'moment';
import {
  Table,
  Popover,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import {
  CodeCostCenterType,
  CodeFlowState,
} from '../../../../application/define';
import { CoreContent } from '../../../../components/core';
import CreateModal from './component/createModal';

import Operate from '../../../../application/define/operate';
import style from './style.less';

const { error } = Modal;

const Content = ({
  onShowSizeChange = () => {},
  onChangePage = () => {},
  flowList = {},
  dispatch,
  getFlowList = () => {},
}) => {
  const { data = [], _meta: meta = {} } = flowList;

  // 审批流启用异常提示
  const onErrorPrompt = (res) => {
    error({
      title: '提示：',
      content: res.zh_message,
      maskClosable: true,
      okText: '确定',
      // className: style['flow-enable-error-prompt'],
    });
  };

  // 操作回调
  const onOperateCBack = (res = {}, optionType) => {
    // 重新获取审批流list
    if (res && res._id) {
      message.success('请求成功');
      getFlowList && getFlowList();
    } else {
      optionType && (onErrorPrompt(res));
      // 抛错
      !optionType && res.zh_message && (message.error(res.zh_message));
    }
  };

  // 删除审批流
  const onDeleteFlow = async (flowId) => {
    const res = await dispatch({
      type: 'codeFlow/setFlowState',
      payload: {
        flowId,
        state: CodeFlowState.delete, // 删除状态
      },
    });
    // 操作回调
    onOperateCBack(res);
  };

  // 启用审批流
  const onEnableFlow = async (flowId) => {
    const res = await dispatch({
      type: 'codeFlow/setFlowState',
      payload: {
        flowId, // 审批流id
        state: CodeFlowState.normal, // 启用状态
      },
    });
    // 操作回调
    onOperateCBack(res, 'enable');
  };

  // 停用审批流
  const onDisableFlow = async (flowId) => {
    const res = await dispatch({
      type: 'codeFlow/setFlowState',
      payload: {
        flowId,
        state: CodeFlowState.deactivate, // 停用
      },
    });
    // 操作回调
    onOperateCBack(res);
  };

  // 查看操作
  const renderDetailOp = (rec) => {
    return (
      <a
        href={`/#/Code/BasicSetting/Flow/Detail?flowId=${rec._id}`}
      >查看</a>
    );
  };

  // 编辑操作
  const renderUpdateOp = (rec = {}) => {
    return (
      <a
        href={`/#/Code/BasicSetting/Flow/Form?flowId=${rec._id}`}
        className="common-table-list-operate"
      >编辑</a>
    );
  };

  // 删除操作
  const renderDeleteOp = (rec) => {
    return (
      <Popconfirm
        title="您是否确定删除该审批流"
        onConfirm={() => onDeleteFlow(rec._id)}
        okText="确定"
        cancelText="取消"
      >
        <a className="common-table-list-operate">删除</a>
      </Popconfirm>
    );
  };

  // 启用操作
  const renderEnablelOp = (rec) => {
    return (
      <Popconfirm
        title="您是否确定启用该审批流"
        onConfirm={() => onEnableFlow(rec._id)}
        okText="确定"
        cancelText="取消"
      >
        <a className="common-table-list-operate">启用</a>
      </Popconfirm>
    );
  };

  // 禁用操作
  const renderDisablelOp = (rec) => {
    return (
      <Popconfirm
        title="您是否确定停用该审批流"
        onConfirm={() => onDisableFlow(rec._id)}
        okText="确定"
        cancelText="取消"
      >
        <a className="common-table-list-operate">停用</a>
      </Popconfirm>
    );
  };

  // 列表操作
  const renderOperate = (rec) => {
    const { handle_list: handleList = [] } = rec;
    // 系统权限
    const isSystemAuth = Operate.canOperateModuleCodeFlowOp();

    // 详情页权限
    const isSystemAuthDetail = Operate.canOperateModuleCodeFlowDetail();

    // 查看
    const isShowDetailOp = handleList.includes('view') && isSystemAuthDetail;
    // 编辑
    const isShowUpdateOp = handleList.includes('edit') && isSystemAuth;
    // 删除
    const isShowDeleteOp = handleList.includes('delete') && isSystemAuth;
    // 启用
    const isShowEnableOp = handleList.includes('enable') && isSystemAuth;
    // 停用
    const isShowDisableOp = handleList.includes('disable') && isSystemAuth;

    return (
      <React.Fragment>
        {isShowDetailOp && renderDetailOp(rec)}
        {isShowUpdateOp && renderUpdateOp(rec)}
        {isShowDeleteOp && renderDeleteOp(rec)}
        {isShowEnableOp && renderEnablelOp(rec)}
        {isShowDisableOp && renderDisablelOp(rec)}
        {handleList.length === 0 && !isSystemAuth && '--'}
      </React.Fragment>
    );
  };

  // columns
  const columns = [
    {
      title: '审批流名称',
      dataIndex: 'name',
    },
    {
      title: '成本中心类型',
      dataIndex: 'cost_center_types',
      render: text => (Array.isArray(text) && text.length > 0 ? text.map(t => CodeCostCenterType.description(t)).join('，') : '--'),
    },
    {
      title: '创建日期',
      dataIndex: 'created_at',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '更新日期',
      dataIndex: 'updated_at',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '创建人',
      dataIndex: ['creator_info', 'name'],
      render: text => text || '--',
    },
    {
      title: '描述',
      dataIndex: 'note',
      render: (text) => {
        if (text === '' || !text) {
          return '--';
        }
        return (
          // 秒速长度大于8个字要气泡显示
          <div>{text.length <= 8 ? text :
          <Popover
            content={(
              <div
                className={style['code-flow-list-note']}
              >
                {text}
              </div>
            )}
            title="审批流描述"
            trigger="hover"
          >
            <div>{text.length <= 8 ? text : text.substr(0, 8)}</div>
          </Popover>}
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: text => (text ? CodeFlowState.description(text) : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: 'operate',
      render: (_, rec) => renderOperate(rec),
    },
  ];

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

  // titleExt
  const titleExt = Operate.canOperateModuleCodeFlowOp() ? (
    <CreateModal dispatch={dispatch} />
  ) : '';

  return (
    <CoreContent title="审批流列表" titleExt={titleExt}>
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
        scroll={{ y: 500 }}
      />
    </CoreContent>
  );
};

export default Content;
