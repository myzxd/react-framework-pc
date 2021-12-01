/**
 * 费用管理 - 审批监控 Expense/Statistics
 */
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Popover, Empty } from 'antd';

import Search from './search.jsx';
import { authorize } from '../../../application';
import Operate from '../../../application/define/operate.js';

import { CoreContent } from '../../../components/core';
import styles from './index.less';

const platforms = authorize.platform();

class Index extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    statisticsList: PropTypes.object,
  }

  static defaultProps = {
    dispatch: () => {},
    statisticsList: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      month: undefined,
    };
    this.private = {
      searchParams: {
        page: 1,
        limit: 30,
      }, // 查询参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'expenseStatistics/fetchExpenseStatistics',
      payload: {},
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

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 调用搜索
    this.props.dispatch({
      type: 'expenseStatistics/fetchExpenseStatistics',
      payload: this.private.searchParams,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 更改筛选月份
  onChangeMonth = (val) => {
    this.setState({ month: moment(val).format('YYYYMM') });
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
    const { page, limit } = this.private.searchParams;
    const { statisticsList } = this.props;
    const { month = '' } = this.state;

    // 数据为空，不渲染
    if (Object.keys(statisticsList).length === 0) return <Empty />;

    const { data = [], _meta: meta = {} } = statisticsList;

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
      className: styles.bossStatisticsTableHightlight,
      render: text => text || '--',
    }, {
      title: '付款-完成总时长占比（%）',
      dataIndex: 'rate_paid_to_done',
      key: 'rate_paid_to_done',
      align: 'center',
      className: styles.bossStatisticsTableHightlight,
      render: text => text || '--',
    }, {
      title: '操作',
      dataIndex: '_id',
      key: '_id',
      width: 70,
      align: 'center',
      fixed: 'right',
      render: (text) => {
        if (Operate.canOperateExpenseStatisticsDetail()) {
          return (
            <a
              key="detail"
              href={`/#/Expense/Statistics/Detail?approvalFlowId=${text}&month=${month}`}
            >
              详情
            </a>
          );
        }
        return '--';
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: meta.result_count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };

    if (page) {
      pagination.current = page; // 当前页数
    }

    // 右侧标题
    const titleExt = (
      <div>
        <InfoCircleOutlined className={styles.bossStatisticsTablePopoverIcon} />
        <span
          className={styles.bossStatisticsTableTitleExt}
        >
          本月统计时长、完成率及占比等数据截止到次月3号，数据将锁定不再变更
        </span>
      </div>
    );

    return (
      <CoreContent title="审批流统计列表" titleExt={titleExt}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={record => record._id}
          dataSource={data}
          scroll={{ x: 1510, y: 600 }}
          bordered
        />
      </CoreContent>
    );
  }

  // 渲染查询组件
  renderSearch = () => {
    const searchProps = {
      onSearch: this.onSearch,
      platforms,
      onChangeMonth: this.onChangeMonth,
    };
    return <Search {...searchProps} />;
  }

  render() {
    return (
      <div>
        {/* 查询 */}
        {this.renderSearch()}
        {/* 列表 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ expenseStatistics: { statisticsList } }) {
  return { statisticsList };
}
export default connect(mapStateToProps)(Index);
