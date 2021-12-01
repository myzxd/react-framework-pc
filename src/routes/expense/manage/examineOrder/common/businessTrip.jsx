/**
 * 付款审批 - 出差申请
 */
import is from 'is_js';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { Table, Button, Tooltip } from 'antd';
import { CoreContent } from '../../../../../components/core';
import styles from './style.less';

class BusinessTrip extends Component {
  static propTypes = {
    applicationOrderId: PropTypes.string, // 审批单id
    businessTripId: PropTypes.string, // 出差单id
    businessTripData: PropTypes.object,
  };

  static defaultProps = {
    applicationOrderId: '',
    businessTripId: '',
    businessTripData: {},
  };

  // 默认加载数据
  componentDidMount() {
    const { businessTripId } = this.props;
    if (businessTripId) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchBusinessTrip', payload: { costOrderId: businessTripId } }); // 借款单列表
    }
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'borrowingRepayment/resetBusinessTripOrders',
    });
  }

  // 新建还款单
  onAddBusinessTrip = () => {
    const { applicationOrderId: applicationId } = this.props;
    window.location.href = `/#/Expense/Manage/ExamineOrder/BusinessTrip/Create?applicationOrderId=${applicationId}`;
  }

  render = () => {
    const { businessTripData = {}, businessTripId, applicationOrderId: applicationId } = this.props;


    if (Object.keys(businessTripData).length <= 0) return null;

    const columns = [{
      title: '出差申请单号',
      dataIndex: '_id',
    }, {
      title: '实际出差人',
      dataIndex: 'apply_user_name',
      render: text => text || '--',
    }, {
      title: '出发地',
      dataIndex: 'departure',
      render: text => `${text.province_name}${text.city_name || ''}` || '--',
    }, {
      title: '目的地',
      dataIndex: 'destination',
      render: text => `${text.province_name}${text.city_name || ''}` || '--',
    }, {
      title: '开始时间',
      dataIndex: 'expect_start_at',
      render: text => moment(text).format('YYYY.MM.DD HH: 00') || '--',
    }, {
      title: '结束时间',
      dataIndex: 'expect_done_at',
      render: text => moment(text).format('YYYY.MM.DD HH: 00') || '--',
    }, {
      title: '出差天数',
      dataIndex: 'expect_apply_days',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '原因及说明',
      dataIndex: 'note',
      render: (text) => {
        if (is.empty(text) || is.not.existy(text)) {
          return '--';
        }
        // 判断字符串长度是否超过10
        if (text.length <= 10) {
          return (
            <div className={styles['app-comp-expense-trip-note']}>
              {text}
            </div>
          );
        }

        // 超过10显示省略号，加上气泡
        return (
          <Tooltip title={<span className={styles['app-comp-expense-trip-note-tool-tip']}>{text}</span>}>
            <span>{text.substring(0, 10)}...</span>
          </Tooltip>
        );
      },
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (<a
          key="update"
          href={`/#/Expense/Manage/ExamineOrder/BusinessTrip/Update?applicationOrderId=${applicationId}&costOrderId=${record._id}`}
          className={styles['app-comp-expense-trip-operate']}
        >编辑</a>);
      },
    }];
    const addBusinessTrip = (<Button type="primary" onClick={this.onAddBusinessTrip}>新建</Button>);
    return (
      <CoreContent key="businessTrip" title="出差单数据" titleExt={businessTripId ? '' : addBusinessTrip}>
        <Table pagination={false} rowKey={record => record._id} dataSource={businessTripData ? [businessTripData] : []} columns={columns} bordered />
      </CoreContent>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { businessTripData } }) {
  return { businessTripData };
}
export default connect(mapStateToProps)(BusinessTrip);
