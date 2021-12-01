/**
 * code - 审批单列表 - 表格
 */
import is from 'is_js';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table,
  Tooltip,
  Popconfirm,
  message,
  Button,
} from 'antd';
import { connect } from 'dva';

import { CoreContent } from '../../../components/core';
import {
  Unit,
  ExpenseExamineOrderProcessState,
  CodeTicketState,
  CodeCostCenterType,
  CodeApproveOrderPayState,
  CodeApproveOrderTabKey,
  AccountState,
} from '../../../application/define';
import { utils } from '../../../application';
import Operate from '../../../application/define/operate';

const Content = ({
  onShowSizeChange = () => {},
  onChangePage = () => {},
  approveOrderList = {}, // 审批单列表
  getApproveOrderList = () => {}, // 获取审批单列表
  dispatch,
  tabKey,
  loading, // 是否为加载中
}) => {
  // 列表selectedRowKeys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data = [], _meta: meta = {} } = approveOrderList;

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [tabKey, approveOrderList]);

  // 操作回调
  const onOperateCBack = (res = {}) => {
    // 重新获取审批流list
    if (res && res._id) {
      getApproveOrderList && getApproveOrderList();
    } else {
      // 抛错
      res.zh_message && (message.error(res.zh_message));
    }
  };

  // 删除审批单
  const onDeleteOrder = async (orderId) => {
    const res = await dispatch({
      type: 'codeOrder/deleteOrder',
      payload: { orderId },
    });
    onOperateCBack(res);
  };

  // 撤回审批单
  const onRecallOrder = async (orderId) => {
    const res = await dispatch({
      type: 'codeOrder/recallOrder',
      payload: { orderId },
    });
    onOperateCBack(res);
  };

  // 关闭审批单
  const onCloseOrder = async (orderId) => {
    const res = await dispatch({
      type: 'codeOrder/closeOrder',
      payload: { orderId },
    });
    onOperateCBack(res);
  };

  // 批量打印
  const onPrintView = () => {
    const printData = JSON.stringify(selectedRowKeys);
    if (selectedRowKeys.length < 1) {
      return message.warning('请先选择需要打印审批单');
    }

    if (selectedRowKeys.length > 20) {
      return message.warning(`最多同时打印20份,你已选择: ${selectedRowKeys.length}份`);
    }
    window.location.href = `/#/Code/Print?selectedRowKeys=${printData}&tabKey=${tabKey}`;
  };

  // 渲染标签
  const renderTags = (tagsList, type) => {
    // 标签数据大于三个
    if (Array.isArray(tagsList) && tagsList.length > 3) {
      const title = type === 'inspect' ?
        tagsList.map(t => t.name).join(' 、 ')
        : tagsList.map(t => t).join(' 、 ');
      return (
        <Tooltip title={title}>
          <div>
            {
              type === 'inspect' ?
                tagsList.slice(0, 3).map(t => t.name).join(' 、 ')
                : tagsList.slice(0, 3).map(t => t).join(' 、 ')
            }...</div>
        </Tooltip>
      );
    }

    // 标签数据小于三个
    if (Array.isArray(tagsList) && tagsList.length <= 3 && tagsList.length > 0) {
      return (
        <div>
          {
            type === 'inspect' ?
              tagsList.map(t => t.name).join('、')
              : tagsList.map(t => t).join('、')
          }
        </div>
      );
    }

    return '--';
  };

  // 操作汇总
  const renderOperate = (rec = {}) => {
    const {
      handle_list: handleList = [],
    } = rec;
    // 系统操作权限（撤回，编辑，关闭，删除）
    const isSystemAuth = Operate.canOperateOperateCodeApproveOrderOp();

    // 是否显示‘查看’操作
    const isShowDetailOp = Operate.canOperateModuleCodeOrderDetail() &&
      handleList.includes('view') &&
      !handleList.includes('edit');

    // 是否显示‘编辑’操作
    // 当前账户为申请人 && （流程状态为进行中 || 流程状态为待提报)
    const isShowUpdateOp = isSystemAuth
      && handleList.includes('edit');

    // 是否显示‘删除’操作
    // 当前账户为申请人 && 流程状态为待提报
    const isShowDeleteOp = isSystemAuth
    && handleList.includes('delete');

    // 是否显示‘撤回’操作
    // 当前账户为申请人 && 流程状态为进行中 && 当前节点不为提报节点
    const isShowRecallOp = isSystemAuth
      && handleList.includes('withdraw');

    // 是否显示‘关闭’操作
    // 当前账户为申请人 && 流程状态为进行中 && 当前节点不为提报节点 && (业务状态为‘驳回到提报人’ || 业务状态为‘申请人撤回’) && 付款状态不为已付款
    const isShowCloseOp = isSystemAuth
    && handleList.includes('close');

    return (
      <React.Fragment>
        {/* 查看 */}
        {isShowDetailOp && renderDetailOp(rec)}
        {/* 编辑 */}
        {isShowUpdateOp && renderUpdateOp(rec)}
        {/* 删除 */}
        {isShowDeleteOp && renderDeleteOp(rec)}
        {/* 撤回 */}
        {isShowRecallOp && renderRecallOp(rec)}
        {/* 关闭 */}
        {isShowCloseOp && renderCloseOp(rec)}
      </React.Fragment>
    );
  };

  const onClickAction = () => {
    // 存储用户操作
    dispatch({ type: 'codeOrder/updateUserAction', payload: { tabKey, page: meta.page, pageSize: meta.page_size } });
  };


  // 查看操作
  const renderDetailOp = (rec = {}) => {
    return (
      <a
        onClick={onClickAction}
        href={`/#/Code/PayOrder/Detail?orderId=${rec._id}`}
      >查看</a>
    );
  };

  // 编辑操作
  const renderUpdateOp = (rec = {}) => {
    return (
      <a
        onClick={onClickAction}
        href={`/#/Code/PayOrder/Update?orderId=${rec._id}`}
        className="common-table-list-operate"
      >编辑</a>
    );
  };

  // 删除操作
  const renderDeleteOp = (rec) => {
    return (
      <Popconfirm
        title="您是否确定删除该审批单？"
        onConfirm={() => onDeleteOrder(rec._id)}
        okText="确定"
        cancelText="取消"
      >
        <a className="common-table-list-operate">删除</a>
      </Popconfirm>
    );
  };

  // 撤回操作
  const renderRecallOp = (rec) => {
    return (
      <Popconfirm
        title="您是否确定撤回该审批单？"
        onConfirm={() => onRecallOrder(rec._id)}
        okText="确定"
        cancelText="取消"
      >
        <a className="common-table-list-operate">撤回</a>
      </Popconfirm>
    );
  };

  // 关闭操作
  const renderCloseOp = (rec) => {
    return (
      <Popconfirm
        title="您是否确定关闭该审批单？"
        onConfirm={() => onCloseOrder(rec._id)}
        okText="确定"
        cancelText="取消"
      >
        <a className="common-table-list-operate">关闭</a>
      </Popconfirm>
    );
  };

  // rowSelection
  const renderRowSelection = () => {
    let rowSelection = null;
    if (tabKey && Number(tabKey) !== CodeApproveOrderTabKey.awaitReport) {
      rowSelection = {
        selectedRowKeys,
        onChange: keys => setSelectedRowKeys(keys),
        columnWidth: 60,
        getCheckboxProps: rec => ({ disabled: rec.plugin_app_id }),
      };
    }
    return rowSelection;
  };

  // columns
  const columns = [
    {
      title: '审批单标题',
      dataIndex: 'name',
      fixed: 'left',
      render: text => text || '--',
    },
    {
      title: '审批单号',
      dataIndex: '_id',
      fixed: 'left',
    },
    {
      title: '主题标签',
      dataIndex: 'theme_label_list',
      render: text => renderTags(text),
    },
    {
      title: '提报类型',
      dataIndex: 'cost_center_type',
      render: text => (text ? CodeCostCenterType.description(text) : '--'),
    },
    {
      title: '费用总金额',
      dataIndex: 'paid_money',
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '当前审批节点',
      dataIndex: ['current_node', 'name'],
      render: text => (text || '--'),
    },
    {
      title: '流程状态',
      dataIndex: 'state',
      render: text => (text ? ExpenseExamineOrderProcessState.description(text) : '--'),
    },
    {
      title: '付款状态',
      dataIndex: 'paid_state',
      render: text => (text ? CodeApproveOrderPayState.description(text) : '--'),
    },
    {
      title: '验票状态',
      dataIndex: 'inspect_bill_state',
      render: text => (text ? CodeTicketState.description(text) : '--'),
    },
    {
      title: '审批流',
      dataIndex: ['flow_info', 'name'],
      render: text => (text || '--'),
    },
    {
      title: '验票标签',
      dataIndex: 'inspect_bill_label_list',
      render: text => renderTags(text, 'inspect'),
    },
    {
      title: '场景',
      dataIndex: 'industry_list',
      render: (text, rec) => {
        if (Array.isArray(text) && text.length > 0) {
          return text.map(i => i.name).join(' 、 ');
        }

        return utils.dotOptimal(rec, 'industry_name', '--');
      },
    },
    {
      title: '主体',
      dataIndex: 'supplier_list',
      render: (text, rec) => {
        if (Array.isArray(text) && text.length > 0) {
          return text.map(s => s.name).join(' 、 ');
        }
        return utils.dotOptimal(rec, 'supplier_name', '--');
      },
    },
    {
      title: '申请人',
      dataIndex: 'apply_account_info',
      render: (text) => {
        // 判断是否有值
        if (is.existy(text) && is.not.empty(text)) {
          // 判断状态是否是禁用的
          if (text.state === AccountState.off) {
            return text.name ? `${text.name}(${AccountState.description(text.state)})` : '--';
          }
          return text.name ? text.name : '--';
        }
        return '--';
      },
    },
    {
      title: '提报日期',
      dataIndex: 'submit_at',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '记账月份',
      dataIndex: 'belong_month',
      render: text => (text || '--'),
    },
    {
      title: '付款日期',
      dataIndex: 'paid_at',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '验票日期',
      dataIndex: 'inspect_bill_at',
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      fixed: 'right',
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

  // 批量打印
  let titleExt;
  const isPrint = tabKey && Number(tabKey) !== CodeApproveOrderTabKey.awaitReport;

  // 打印
  if (isPrint) {
    titleExt = (
      <React.Fragment>
        <Button
          type="primary"
          onClick={onPrintView}
        >批量打印</Button>
      </React.Fragment>
    );
  }

  // 待提报tab
  if (tabKey === CodeApproveOrderTabKey.awaitReport) {
    titleExt = '若审批单不再编辑，请及时删除';
  }

  return (
    <CoreContent title="审批列表" titleExt={titleExt}>
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
        rowSelection={renderRowSelection()}
        loading={loading}
        scroll={{ x: isPrint ? 2260 : 2200, y: 500 }}
      />
    </CoreContent>
  );
};


export default connect()(Content);
