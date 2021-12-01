/**
 * 趣活钱包 - 支付账单 - 账单详情 - 审批单信息
 */
import React from 'react';
import moment from 'moment';
import {
  Table,
  Tooltip,
  Empty,
} from 'antd';

import {
  Unit,
  ExpenseTicketState,
  ExpenseExamineOrderProcessState,
  OaApplicationOrderType,
  WalletBillsPaidType,
  CodeCostCenterType,
  CodeApproveOrderPayState,
  CodeTicketState,
} from '../../../../application/define';
import {
  CoreContent,
} from '../../../../components/core';
import style from '../style.less';

const Approval = ({
  detail = {}, // 账单详情
}) => {
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
  // 渲染审批单类的审批单信息
  const renderApprovalOrder = () => {
    // 审批单数据
    const { application_order_info: orderInfo = {} } = detail;
    if (!orderInfo) return <Empty />;
    // columns
    const columns = [
      {
        title: '关联审批单号',
        dataIndex: '_id',
        width: 150,
        fixed: 'left',
        render: text => <a href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${text}`}>{text}</a>,
      },
      {
        title: '提报人',
        dataIndex: ['apply_account_info', 'name'],
        fixed: 'left',
        width: 80,
      },
      {
        title: '费用总金额',
        dataIndex: 'total_money',
        width: 100,
        fixed: 'left',
        render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
      },
      {
        title: '主题标签',
        dataIndex: 'theme_label_list',
        width: 120,
        render: text => renderTags(text),
      },
      {
        title: '是否有验票标签',
        dataIndex: 'inspect_bill_label_list',
        key: 'is_inspect_bill_label_list',
        width: 110,
        render: text => ((Array.isArray(text) && text.length > 0) ? '有' : '无'),
      },
      {
        title: '验票标签',
        dataIndex: 'inspect_bill_label_list',
        key: 'inspect_bill_label_list',
        width: 120,
        render: text => renderTags(text, 'inspect'),
      },
      {
        title: '提报日期',
        dataIndex: 'submit_at',
        width: 100,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '归属周期',
        dataIndex: 'belong_time',
        width: 80,
        render: text => (text || '--'),
      },
      {
        title: '审批流',
        dataIndex: ['flow_info', 'name'],
        width: 100,
        render: text => (text || '--'),
      },
      {
        title: '审批类型',
        dataIndex: 'application_order_type',
        width: 80,
        render: text => (text ? OaApplicationOrderType.description(text) : '--'),
      },
      {
        title: '流程状态',
        dataIndex: 'state',
        width: 100,
        render: text => (text ? ExpenseExamineOrderProcessState.description(text) : '--'),
      },
      {
        title: '当前节点',
        dataIndex: ['current_flow_node_info', 'name'],
        width: 100,
        render: text => (text || '--'),
      },
      {
        title: '验票状态',
        dataIndex: 'inspect_bill_state',
        width: 120,
        render: text => (text ? ExpenseTicketState.description(text) : '--'),
      },
      {
        title: '验票日期',
        dataIndex: 'inspect_bill_at',
        width: 120,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '验票说明',
        dataIndex: 'inspect_bill_note',
        render: text => (text || '--'),
      },
    ];
    return (
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={[orderInfo]}
        pagination={false}
        bordered
        scroll={{ x: 1700 }}
      />
    );
  };

  // 渲染CODE审批类的审批单信息
  const renderCodeOrder = () => {
    const { qoa_order_info: qoaOrderInfo = {} } = detail;
    if (!qoaOrderInfo) return <Empty />;
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
        render: (text) => {
          return (
            <a
              href={`/#/Code/PayOrder/Detail?orderId=${text}&isShowOperation=true`}
            >{text}</a>
          );
        },
      },
      {
        title: '申请人',
        dataIndex: ['apply_account_info', 'name'],
        fixed: 'left',
        width: 80,
        render: text => (text || '--'),
      },
      {
        title: '费用总金额',
        dataIndex: 'paid_money',
        fixed: 'left',
        width: 100,
        render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
      },
      {
        title: '主题标签',
        dataIndex: 'theme_label_list',
        render: text => renderTags(text),
      },
      {
        title: '验票标签',
        dataIndex: 'inspect_bill_label_list', // 待调
        render: text => renderTags(text, 'inspect'),
      },
      {
        title: '提报类型',
        dataIndex: 'cost_center_type',
        render: text => (text ? CodeCostCenterType.description(text) : '--'),
      },
      {
        title: '当前审批节点',
        dataIndex: ['current_node', 'name'],
        render: text => (text || '--'),
      },
      {
        title: '提报日期',
        dataIndex: 'submit_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '归属周期',
        dataIndex: 'belong_month',
        render: text => (text || '--'),
      },
      {
        title: '审批流',
        dataIndex: ['flow_info', 'name'],
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
        title: '验票日期',
        dataIndex: 'inspect_bill_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
    ];
    return (

      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={[qoaOrderInfo]}
        pagination={false}
        bordered
        scroll={{ x: 2200, y: 500 }}
      />
    );
  };

  // 渲染审批信息表格
  const renderOrder = () => {
    // 审批单类
    if (detail.type === WalletBillsPaidType.approval) {
      return renderApprovalOrder();
    }
    // CODE审批类
    if (detail.type === WalletBillsPaidType.code) {
      return renderCodeOrder();
    }
    return null;
  };

  return (
    <CoreContent title={<span className={style['wallet-bill-content-title']}>审批单信息</span>}>
      {/* 渲染审批信息表格 */}
      {renderOrder()}
    </CoreContent>
  );
};

export default Approval;

