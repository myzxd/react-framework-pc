/**
 * 付款审批 - 请假申请
 */
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Table,
} from 'antd';

import {
  CoreContent,
} from '../../../../../components/core';

import {
  ExpenseAttendanceTakeLeaveType,
} from '../../../../../application/define';

import style from './style.less';

class TakeLeave extends Component {
  static propTypes = {
    takeLeaveId: PropTypes.string, // 加班单id
    expenseTakeLeaveDetail: PropTypes.object, // 加班单详情
  }

  static defaultProps = {
    takeLeaveId: '',
    expenseTakeLeaveDetail: {},
  }

  componentDidMount() {
    const {
      takeLeaveId, // 请假单d
      dispatch,
    } = this.props;

    // 获取请假单详情
    dispatch({ type: 'expenseTakeLeave/fetchExpenseTakeLeaveDetail', payload: { id: takeLeaveId } });
  }

  // 列表
  renderContent = () => {
    const {
      expenseTakeLeaveDetail: detail, // 请假单详情
    } = this.props;

    if (Object.keys(detail).length === 0) return null;

    const columns = [
      {
        title: '请假申请单号',
        dataIndex: '_id',
        render: text => text || '--',
      },
      {
        title: '请假类型',
        dataIndex: 'leave_type',
        render: text => ExpenseAttendanceTakeLeaveType.description(text) || '--',
      },
      {
        title: '实际请假人',
        dataIndex: 'actual_apply_name',
        render: text => text || '--',
      },
      {
        title: '开始时间',
        dataIndex: 'start_at',
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY.MM.DD HH:mm');
          }
          return '--';
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end_at',
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY.MM.DD HH:mm');
          }
          return '--';
        },
      },
      {
        title: '请假时长（小时）',
        dataIndex: 'duration',
        render: text => text || '--',
      },
      {
        title: '请假事由',
        dataIndex: 'reason',
        render: (text) => {
          if (text) {
            return (
              <div className={style['app-comp-expense-associated-tag']}>{text}</div>
            );
          }
          return '--';
        },
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: (text, record) => {
          return (
            <a
              key="update"
              href={`/#/Expense/Attendance/TakeLeave/Update?applicationOrderId=${record.application_order_id}&takeLeaveId=${text}`}
              className={style['app-comp-expense-repayment-operation']}
            >
              编辑
            </a>);
        },
      },
    ];
    return (
      <CoreContent title="请假单">
        <Table
          rowKey={record => record._id}
          dataSource={[detail]}
          columns={columns}
          pagination={false}
          bordered
        />
      </CoreContent>
    );
  };

  render() {
    return this.renderContent();
  }
}

function mapStateToProps({
  expenseTakeLeave: { expenseTakeLeaveDetail } }) {
  return {
    expenseTakeLeaveDetail,
  };
}

export default connect(mapStateToProps)(TakeLeave);
