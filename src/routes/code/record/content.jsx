/*
 * code - 记录明细
 */
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';
import {
  Table,
  Tooltip,
} from 'antd';
import {
  Unit,
  CodeCostCenterType,
  ExpenseExamineOrderProcessState,
  CodeApproveOrderPayState,
  CodeRecordBillRedPushState,
  AccountState,
  AmortizationCostAllocationState,
} from '../../../application/define';
import { CoreContent } from '../../../components/core';

import Operate from '../../../application/define/operate';

const Content = ({
  onShowSizeChange = () => {},
  onChangePage = () => {},
  recordList = {},
  loading, // 是否为加载中
}) => {
  const { data = [], _meta: meta = {} } = recordList;

  // 查看操作
  const renderDetailOp = (recordId) => {
    if (Operate.canOperateModuleCodeRecordDetail()) {
      return (
        <a
          href={`/#/Code/Record/Detail?recordId=${recordId}`}
        >查看</a>
      );
    } else {
      return '--';
    }
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

  // columns
  const columns = [
    {
      title: '编号',
      dataIndex: '_id',
      key: 'number',
      fixed: 'left',
      width: 50,
      render: (text, rec, key) => {
        const { page_size: limit, page } = meta;
        const num = (limit * (page - 1)) + key + 1;
        return num;
      },
    },
    {
      title: '费用单号',
      dataIndex: '_id',
      key: 'cost_id',
      fixed: 'left',
      width: 120,
      render: text => text || '--',
    },
    {
      title: '审批单号',
      dataIndex: 'oa_order_id',
      fixed: 'left',
      width: 120,
      render: text => text || '--',
    },
    {
      title: '主题标签',
      dataIndex: 'theme_label_list',
      fixed: 'left',
      width: 120,
      render: text => renderTags(text),
    },
    {
      title: '提报类型',
      dataIndex: 'cost_center_type',
      key: 'type',
      width: 80,
      render: text => (text ? CodeCostCenterType.description(text) : '--'),
    },
    {
      title: '科目名称',
      dataIndex: 'biz_account_info',
      width: 200,
      render: (text) => {
        const { name, ac_code: code } = text;
        return (
          <span>
            {name || '--'}
            {code ? `(${code})` : ''}
          </span>
        );
      },
    },
    {
      title: '核算中心',
      dataIndex: 'cost_center_type',
      key: 'cost_center_type',
      width: 120,
      render: (text, rec) => {
        let costCenterType = '--';
        // code
        if (text === CodeCostCenterType.code) {
          costCenterType = dot.get(rec, 'biz_code_info.name', '--');
        }

        // team
        if (text === CodeCostCenterType.team) {
          costCenterType = dot.get(rec, 'biz_team_info.name', '--');
        }

        return costCenterType;
      },
    },
    {
      title: '发票抬头',
      dataIndex: 'invoice_title',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '提报金额',
      dataIndex: 'total_money',
      width: 120,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '应付款金额',
      dataIndex: 'payment_total_money',
      width: 120,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '税金',
      dataIndex: 'total_tax_amount_amount',
      key: 'total_tax_amount_amount',
      width: 120,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : Unit.exchangePriceCentToMathFormat(0)),
    },
    {
      title: '红冲金额',
      dataIndex: 'total_tax_amount_amount',
      key: 'red_push',
      width: 120,
      render: (text, rec) => {
        const { bill_red_push_state: billRedPushState } = rec;
        // 已红冲，红冲金额为税金
        if (billRedPushState === CodeRecordBillRedPushState.right) {
          return (text ? Unit.exchangePriceCentToMathFormat(text) : Unit.exchangePriceCentToMathFormat(0));
        }
        // 否则为0
        return Unit.exchangePriceCentToMathFormat(0);
      },
    },
    {
      title: '记账月份',
      dataIndex: 'book_month',
      width: 120,
      render: (text, rec) => {
        const { cost_allocation_state: costAllocationState } = rec;
        // 摊销确认状态，为手动进入
        if (costAllocationState === AmortizationCostAllocationState.manualEntered) {
          return '按分摊规则记账';
        }
        return text || '--';
      },
    },
    {
      title: '是否红冲',
      dataIndex: 'bill_red_push_state',
      width: 100,
      render: text => (text ? CodeRecordBillRedPushState.description(text) : '--'),
    },
    {
      title: '单据状态',
      dataIndex: 'state',
      width: 100,
      render: text => (text ? ExpenseExamineOrderProcessState.description(text) : '--'),
    },
    {
      title: '付款状态',
      dataIndex: 'paid_state',
      width: 100,
      render: text => (text ? CodeApproveOrderPayState.description(text) : '--'),
    },
    {
      title: '申请人',
      dataIndex: 'apply_account_info',
      width: 100,
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
      title: '提报时间',
      dataIndex: 'submit_at',
      width: 160,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '付款时间',
      dataIndex: 'paid_at',
      width: 160,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: 'operate',
      fixed: 'right',
      width: 80,
      render: text => renderDetailOp(text),
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

  // 渲染列表
  const renderContent = () => {
    return (
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
        loading={loading}
        scroll={{ y: 500, x: 2410 }}
      />
    );
  };

  return (
    <CoreContent title="费用记录明细列表">
      {/* 列表 */}
      {renderContent()}
    </CoreContent>
  );
};

export default Content;
