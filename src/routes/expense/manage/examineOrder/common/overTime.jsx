/**
 * 付款审批 - 加班申请
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

import style from './style.less';

class OverTime extends Component {
  static propTypes = {
    overTimeId: PropTypes.string, // 加班单id
    overTimeDetail: PropTypes.object, // 加班单详情
  }

  static defaultProps = {
    overTimeId: '',
    overTimeDetail: {},
  }

  componentDidMount() {
    const {
      overTimeId, // 加班单id
      dispatch,
    } = this.props;

    if (overTimeId) {
      // 获取加班单详情
      dispatch({ type: 'expenseOverTime/fetchOverTimeDetail', payload: { overTimeId } });
    }
  }

  // 列表
  renderContent = () => {
    const {
      overTimeDetail: detail, // 加班单详情
    } = this.props;

    if (Object.keys(detail).length === 0) return null;

    const columns = [
      {
        title: '加班申请单号',
        dataIndex: '_id',
        render: text => text || '--',
      },
      {
        title: '实际加班人',
        dataIndex: 'actual_apply_name',
        render: text => text || '--',
      },
      {
        title: '开始时间',
        dataIndex: 'start_at',
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY.MM.DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end_at',
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY.MM.DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '加班时长（小时）',
        dataIndex: 'duration',
      },
      {
        title: '原因及说明',
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
              href={`/#/Expense/Attendance/OverTime/Update?overTimeId=${text}&applicationOrderId=${record.application_order_id}`}
              className={style['app-comp-expense-repayment-operation']}
            >
              编辑
            </a>);
        },
      },
    ];
    return (
      <CoreContent title="加班单">
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
  expenseOverTime: { overTimeDetail } }) {
  return {
    overTimeDetail,
  };
}

export default connect(mapStateToProps)(OverTime);
