/**
 * 借款单详情 - 借款信息
 */
import dot from 'dot-prop';
import is from 'is_js';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Popover } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';

import style from './style.css';

import { CoreContent } from '../../../../../components/core';
import { Unit, ExpenseExamineOrderProcessState } from '../../../../../application/define';

class RepaymentsInfo extends Component {
  static propTypes = {
    id: PropTypes.string,
    repaymentOrders: PropTypes.object,
  };

  static defaultProps = {
    id: '',
    repaymentOrders: {},
  };

  // 默认加载数据
  componentDidMount() {
    const { id } = this.props;
    if (id) {
      this.props.dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: { borrowingId: id, orderState: true } });
    }
  }

  // 离开页面后自动清空详情数据
  componentWillUnmount() {
    const { id } = this.props;
    if (id !== undefined) {
      this.props.dispatch({ type: 'borrowingRepayment/resetRepaymentOrders' }); // 重置还款单列表数据
    }
  }

  // 修改还款分页
  onChangeRepaymentPage = (page) => {
    const { id } = this.props;
    if (id) {
      this.props.dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: { borrowingId: id, orderState: true, limit: 30, page } }); // 还款单列表
    }
  }

  // 改变还款每页展示条数
  onRepaymentShowSizeChange = (page, limit) => {
    const { id } = this.props;
    if (id) {
      this.props.dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: { borrowingId: id, orderState: true, limit, page } }); // 还款单列表
    }
  }

  render() {
    const { repaymentOrders = {} } = this.props;
    const repaymentOrdersDate = dot.get(repaymentOrders, 'data', []);
    const repaymentOrdersCount = dot.get(repaymentOrders, 'meta.count', 0);

    const columns = [{
      title: '还款单号',
      dataIndex: '_id',
      key: '_id',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '还款金额',
      dataIndex: 'repayment_money',
      key: 'repayment_money',
      render: (text) => {
        return Unit.exchangePriceCentToMathFormat(text);
      },
    }, {
      title: '实际还款人',
      dataIndex: 'apply_account_info',
      key: 'apply_account_info',
      render: (text) => {
        return text.name || '--';
      },
    }, {
      title: '备注',
      dataIndex: 'repayment_note',
      key: 'repayment_note',
      render: (text) => {
        // 判断是否存在
        if (is.not.existy(text) || is.empty(text)) {
          return '--';
        }
        if (text.length <= 20) {
          return text;
        }
        // 如果数据长度大于1就气泡展示
        return (
          <Popover content={<p className={style['app-comp-expense-borrowing-repayments-info-not']}>{text}</p>} trigger="hover">
            <div>{text.slice(0, 20)}...</div>
          </Popover>
        );
      },
    }, {
      title: '审批流',
      dataIndex: 'application_order_info',
      key: 'application_order_info.flow_info',
      render: (text) => {
        const flow = dot.get(text, 'flow_info.name');
        return flow || '--';
      },
    }, {
      title: '还款时间',
      dataIndex: 'done_at',
      key: 'done_at',
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '流程状态',
      dataIndex: 'state',
      key: 'state',
      render: text => ExpenseExamineOrderProcessState.description(text) || '--',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        return <a key="delete" target="_blank" rel="noopener noreferrer" href={`/#/Expense/BorrowingRepayments/Repayments/Detail?orderId=${record.application_order_id}&repaymentOrderId=${record._id}`}>查看</a>;
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangeRepaymentPage,  // 切换分页
      total: repaymentOrdersCount,       // 数据总条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onRepaymentShowSizeChange,
    };
    return (
      <CoreContent title="还款信息">
        <Table columns={columns} rowKey={record => record._id} pagination={pagination} dataSource={repaymentOrdersDate} />
      </CoreContent>
    );
  }
}
function mapStateToProps({ borrowingRepayment: { repaymentOrders } }) {
  return { repaymentOrders };
}
export default connect(mapStateToProps)(RepaymentsInfo);
