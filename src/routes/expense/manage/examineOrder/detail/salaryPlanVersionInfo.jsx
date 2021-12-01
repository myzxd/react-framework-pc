/**
 * 审批单详情 - 薪资规则组件 Expense/Manage/ExamineOrder/Detail
 */
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
} from 'antd';

import {
  Unit,
  ExpenseCostOrderState,
  ExpenseExamineOrderProcessState,
} from '../../../../../application/define';
import { CoreContent } from '../../../../../components/core';

class SalaryPlanVersionInfo extends Component {
  static PropTypes = {
    salaryPlanVersionId: PropTypes.string, // 服务费方案id
    planVersionDetailData: PropTypes.object, // 服务费方案版本详情
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    salaryPlanVersionId: '', // 服务费方案id
    planVersionDetailData: {}, // 服务费方案版本详情
    dispatch: () => {},
  }

  componentDidMount() {
    // 服务费方案id
    const { salaryPlanVersionId, dispatch } = this.props;

    dispatch({
      type: 'financePlan/fetchPlanVersionDetailData',
      payload: {
        id: salaryPlanVersionId, // 服务费方案id
      },
    });
  }

  // 渲染内容
  renderContent = () => {
    const {
      salaryPlanVersionId, // 服务费方案id
      planVersionDetailData, // 服务费方案版本详情
    } = this.props;

    // 数据为空，返回null
    if (Object.keys(planVersionDetailData).length === 0) return null;

    // 定义数据
    const dataSource = [planVersionDetailData[salaryPlanVersionId]];

    const columns = [
      {
        title: '单笔流水号',
        dataIndex: 'oaApplicationOrderId',
        key: 'oaApplicationOrderId',
        width: 200,
        fixed: 'left',
      },
      {
        title: '平台',
        dataIndex: 'platformName',
        key: 'platformName',
        render: text => text || '--',
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: 'cityName',
        key: 'cityName',
        render: text => text || '--',
      },
      {
        title: '商圈',
        dataIndex: 'bizDistrictName',
        key: 'bizDistrictName',
        render: text => text || '--',
      },
      {
        title: '生效时间',
        dataIndex: 'activeAt',
        key: 'activeAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '版本号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '试算月份',
        dataIndex: ['computeTaskInfo', 'fromDate'],
        key: 'computeTaskInfo.fromtDate',
        render: (text) => {
          const time = text ? `${text}`.slice(4, 6) : '--';
          return `${time}月`;
        },
      },
      {
        title: '试算总金额（元）',
        dataIndex: 'managementAmount',
        key: 'managementAmount',
        render: text => Unit.exchangePriceCentToMathFormat(text || 0),
      },
      {
        title: '单据状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        fixed: 'right',
        render: (text) => {
          return ExpenseCostOrderState.description(text);
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
          // 费用单id
          const {
            id: recordId, // 版本id
            planId: id, // 服务费方案id
            state, // 审批单状态
          } = record;

          const operations = [];

          // 判断，如果审批流进行中，则跳转到审核中页面activeTab
          if (state === ExpenseExamineOrderProcessState.processing) {
            operations.push(
              <a
                key="detail"
                target="_blank"
                rel="noopener noreferrer"
                href={`/#/Finance/Rules?id=${id}&isReview=1`}
              >
                详情
              </a>);
          }

          // 判断，如果审批流结束，则跳转到 服务费模块 - 审批历史详情页面
          if (state === ExpenseExamineOrderProcessState.finish || state === ExpenseExamineOrderProcessState.close) {
            operations.push(
              <a
                key="detail"
                target="_blank"
                rel="noopener noreferrer"
                href={`/#/Finance/Rules/History?planVersionId=${recordId}&planId=${id}`}
              >
                详情
              </a>);
          }
          return operations;
        },
      },
    ];

    return (
      <CoreContent title="费用单数据">
        <Table
          rowKey={record => record.id}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: 1700 }}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

function mapStateToProps({
  financePlan: { planVersionDetailData },
}) {
  return {
    planVersionDetailData,
  };
}

export default connect(mapStateToProps)(SalaryPlanVersionInfo);
