/**
 * code - 审批单详情 - 关联审批信息
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';
import {
  Collapse,
  Table,
  Tooltip,
  Empty,
} from 'antd';
import {
  CoreContent,
} from '../../../../../components/core';
import {
  Unit,
  ExpenseExamineOrderProcessState,
  CodeCostCenterType,
  CodeOrderType,
  OaApplicationOrderType,
} from '../../../../../application/define';

import Operate from '../../../../../application/define/operate';
import { PagesHelper } from '../../../../oa/document/define';

const { Panel } = Collapse;

const RelatedOrder = ({
  orderId,
  dispatch,
  relationOrderList = {}, // 关联审批单列表
}) => {
  // 获取关联审批单列表
  useEffect(() => {
    dispatch({
      type: 'codeOrder/getRelationOrderList',
      payload: { page: 1, limit: 999, orderId },
    });

    return () => {
      dispatch({
        type: 'codeOrder/reduceRelationOrderList',
        payload: {},
      });
    };
  }, [dispatch, orderId]);

  const { data = [] } = relationOrderList;

  if (!Array.isArray(data) || data.length < 1) return <Empty />;

  // 查看操作
  const renderDetailOp = (rec = {}) => {
    // 新的审批单
    if (rec.order_type === CodeOrderType.new) {
      return (
        <a
          href={`/#/Code/PayOrder/Detail?orderId=${rec._id}&isShowOperation=true`}
        >查看</a>
      );
    }

    // 旧的审批单
    if (rec.order_type === CodeOrderType.old) {
      return (
        <a
          key="detail"
          href={`javascript:void(window.open('/#/Expense/Manage/ExamineOrder/Detail?orderId=${rec._id}'));`}
          rel="noopener noreferrer"
        >查看</a>
      );
    }
    return '--';
  };

  // 操作
  const renderOperate = (rec) => {
    // 是否显示‘查看’操作
    const isShowDetailOp = Operate.canOperateModuleCodeOrderDetail();

    return (
      <React.Fragment>
        {/* 查看 */}
        {isShowDetailOp ? renderDetailOp(rec) : '--'}
      </React.Fragment>
    );
  };

  // columns
  const columns = [
    {
      title: '审批单标题',
      dataIndex: 'name',
      fixed: 'left',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '审批单号',
      dataIndex: '_id',
      width: 120,
      fixed: 'left',
    },
    {
      title: '主题标签',
      dataIndex: 'theme_label_list',
      width: 150,
      render: text => renderTags(text),
    },
    {
      title: '验票标签',
      dataIndex: 'inspect_bill_label_list',
      width: 150,
      render: text => renderTags(text, 'inspect'),
    },
    {
      title: '归属',
      dataIndex: 'cost_center_type',
      width: 120,
      render: (text, record) => {
        // code审批单
        if (record.order_type === CodeOrderType.new) {
          return text ? CodeCostCenterType.description(text) : '--';
        }
        // 费用单
        if (record.order_type === CodeOrderType.old) {
          // 判断大于100的是事务类的审批单
          if (text >= 100) {
            return PagesHelper.titleByKey(text);
          }
          return text ? OaApplicationOrderType.description(text) : '--';
        }
        return '--';
      },
    },
    {
      title: '发票抬头',
      dataIndex: 'invoice_title',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '付款金额',
      dataIndex: 'paid_money',
      width: 120,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '申请人',
      dataIndex: ['apply_account_info', 'name'],
      width: 120,
      render: text => (text || '--'),
    },
    {
      title: '提报时间',
      dataIndex: 'submit_at',
      width: 150,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '付款时间',
      dataIndex: 'paid_at',
      width: 150,
      render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '流程状态',
      dataIndex: 'state',
      width: 120,
      render: text => (text ? ExpenseExamineOrderProcessState.description(text) : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      fixed: 'right',
      key: 'operate',
      width: 80,
      render: (_, rec) => renderOperate(rec),
    },
  ];

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

  return (
    <CoreContent>
      <Collapse>
        <Panel header="关联审批单">
          <Table
            rowKey={(rec, key) => rec._id || key}
            dataSource={data}
            columns={columns}
            pagination={false}
            bordered
            scroll={{ x: 1580 }}
          />
        </Panel>
      </Collapse>
    </CoreContent>
  );
};

const mapStateToProps = ({
  codeOrder: { relationOrderList },
}) => {
  return { relationOrderList };
};

export default connect(mapStateToProps)(RelatedOrder);
