/**
 * 费用管理 - 审批监控 - 详情 Expense/Statistics/Detail
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Popover, Empty } from 'antd';

import { OaApplicationOrderType } from '../../../application/define';

import { CoreContent } from '../../../components/core';
import styles from './index.less';

class Detail extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    statisticsList: PropTypes.object,
    location: PropTypes.object,
  }

  static defaultProps = {
    dispatch: () => {},
    statisticsList: {},
    location: {},
  }

  constructor(props) {
    super(props);
    this.private = {
      searchParams: {
        page: 1,
        limit: 30,
      }, // 查询参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { dispatch, location } = this.props;
    const { approvalFlowId, month } = location.query;
    dispatch({
      type: 'expenseStatistics/fetchExpenseStatistics',
      payload: {
        approvalFlowId,
        month,
      },
    });
  }

  // 重置数据
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expenseStatistics/resetExpenseStatistics',
      payload: {},
    });
  }

  // 转换时间（秒数转换成时分）
  changeTime = (time) => {
    if (!time || time !== +time) {
      return '--';
    }
    return (
      <div className={styles.bossStatisticsTableBreakLine}>
        {`${Math.floor(time / 3600)}小时${Math.floor(Math.floor(time % 3600) / 60)}分`}
      </div>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { statisticsList } = this.props;

    // 数据为空，不渲染
    if (Object.keys(statisticsList).length === 0) return <Empty />;

    const { data = [] } = statisticsList;

    // 过滤数据（已提报单不为0的数据）
    const dataSource = data.filter(item => item.sum_orders);

    // 当月已提报总数量 - 提示
    const sumOrdersTitle = '本月除关闭的审批单以外，所有提报过的审批单总数量';
    // 当月已关闭总数量 - 提示
    const sumCloseOrdersTitle = '当月关闭的审批单总数量';
    // 完成率 - 提示
    const doneRateTitle = '当月已完成总数量/当月已提报总数量';
    // 当月已提报总数量
    const sumOrders = (
      <div>
        <span>当月已提报总数量</span>
        <Popover content={sumOrdersTitle}>
          <InfoCircleOutlined className={styles.bossStatisticsTablePopoverIcon} />
        </Popover>
      </div>
    );

    // 当月已关闭总数量
    const sumCloseOrders = (
      <div>
        <span>当月已关闭总数量</span>
        <Popover content={sumCloseOrdersTitle}>
          <InfoCircleOutlined className={styles.bossStatisticsTablePopoverIcon} />
        </Popover>
      </div>
    );

    // 完成率
    const doneRate = (
      <div>
        <span>完成率</span>
        <Popover content={doneRateTitle}>
          <InfoCircleOutlined className={styles.bossStatisticsTablePopoverIcon} />
        </Popover>
      </div>
    );

    // tabel列表
    const columns = [{
      title: '审批类型',
      dataIndex: 'application_order_type',
      key: 'application_order_type',
      fixed: 'left',
      width: 150,
      align: 'center',
      render: text => OaApplicationOrderType.description(text),
    }, {
      title: '审批流名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      align: 'center',
      render: (text) => {
        if (text) {
          return <div className={styles.bossStatisticsTableBreakLine}>{text}</div>;
        }
        return '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      fixed: 'left',
      align: 'center',
      width: 90,
    }, {
      title: sumOrders,
      dataIndex: 'sum_orders',
      key: 'sum_orders',
      width: 90,
      align: 'center',
    }, {
      title: '当月待审批总数量',
      dataIndex: 'sum_wait_orders',
      key: 'sum_wait_orders',
      width: 90,
      align: 'center',
    }, {
      title: '当月已完成总数量',
      dataIndex: 'sum_done_orders',
      key: 'sum_done_orders',
      width: 90,
      align: 'center',
    }, {
      title: sumCloseOrders,
      dataIndex: 'sum_close_orders',
      key: 'sum_close_orders',
      width: 90,
      align: 'center',
    }, {
      title: '节点个数',
      dataIndex: 'flow_nodes_count',
      key: 'flow_nodes_count',
      width: 70,
      align: 'center',
    }, {
      title: '当前已完成审批总时长',
      dataIndex: 'total_done_time',
      key: 'total_done_time',
      width: 90,
      align: 'center',
      render: text => this.changeTime(text),
    }, {
      title: '已完成审批平均时长',
      dataIndex: 'avg_done_time',
      key: 'avg_done_time',
      width: 90,
      align: 'center',
      render: text => this.changeTime(text),
    }, {
      title: doneRate,
      dataIndex: 'done_rate',
      key: 'done_rate',
      width: 80,
      align: 'center',
      className: styles.bossStatisticsTableHightlight,
      render: text => text || '--',
    }, {
      title: '已完成审批提报-付款平均时长',
      dataIndex: 'avg_submit_to_paid',
      key: 'avg_submit_to_paid',
      width: 120,
      align: 'center',
      render: text => this.changeTime(text),
    }, {
      title: '已完成审批付款-完成平均时长',
      dataIndex: 'avg_paid_to_done',
      key: 'avg_paid_to_done',
      width: 120,
      align: 'center',
      render: text => this.changeTime(text),
    }, {
      title: '提报-付款总时长占比（%）',
      dataIndex: 'rate_submit_to_paid',
      key: 'rate_submit_to_paid',
      width: 120,
      align: 'center',
      render: text => text || '--',
    }, {
      title: '付款-完成总时长占比（%）',
      dataIndex: 'rate_paid_to_done',
      key: 'rate_paid_to_done',
      align: 'center',
      render: text => text || '--',
    }];

    return (
      <CoreContent title="审批流统计详情">
        {/* 渲染的内容 */}
        <Table
          pagination={false}
          columns={columns}
          rowKey={(record, index) => `${record._id}${index}`}
          dataSource={dataSource}
          scroll={{ x: 1590, y: 600 }}
          bordered
        />
      </CoreContent>
    );
  }
  render() {
    return (
      <div>
        {/* 渲染列表 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ expenseStatistics: { statisticsList } }) {
  return { statisticsList };
}
export default connect(mapStateToProps)(Detail);
