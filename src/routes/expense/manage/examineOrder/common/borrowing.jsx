/**
 * 付款审批 - 借款信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table, Button, Tooltip } from 'antd';
import { CoreContent } from '../../../../../components/core';

import {
  Unit,
  BorrowType,
} from '../../../../../application/define';
import styles from './style.less';

class Borrowing extends Component {
  static propTypes = {
    applicationOrderId: PropTypes.string,
    borrowingId: PropTypes.string,
    borrowingOrders: PropTypes.object,
  };

  static defaultProps = {
    applicationOrderId: '',
    borrowingId: '',
    borrowingOrders: {},
  };

  // 默认加载数据
  componentDidMount() {
    const { borrowingId } = this.props;
    if (borrowingId) {
      this.props.dispatch({ type: 'borrowingRepayment/fetchBorrowingOrders', payload: { borrowOrderId: borrowingId, disableState: true } }); // 借款单列表
    }
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'borrowingRepayment/resetBorrowingOrders',
    });
  }

  // 修改借款分页
  onChangeBorrowingPage = (page) => {
    const { borrowingId } = this.props;
    this.props.dispatch({ type: 'borrowingRepayment/fetchBorrowingOrders', payload: { borrowOrderId: borrowingId, limit: 30, page, disableState: true } }); // 借款单列表
  }

  // 改变借款每页展示条数
  onBorrowingShowSizeChange = (page, limit) => {
    const { borrowingId } = this.props;
    this.props.dispatch({ type: 'borrowingRepayment/fetchBorrowingOrders', payload: { borrowOrderId: borrowingId, limit, page, disableState: true } }); // 借款单列表
  }
  // 新建还款单
  onAddBorrowing = () => {
    const { applicationOrderId } = this.props;
    window.location.href = `/#/Expense/BorrowingRepayments/Borrowing/Create?applicationOrderId=${applicationOrderId}`;
  }

  render = () => {
    const { borrowingOrders = {}, borrowingId } = this.props;
    const dataSource = dot.get(borrowingOrders, 'data', []);
    const borrowingOrdersCount = dot.get(borrowingOrders, 'meta.count', 0);

    const columns = [{
      title: '借款单号',
      dataIndex: '_id',
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      render: text => text || '--',
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      render: text => text || '--',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      render: text => text || '--',
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      render: text => text || '--',
    }, {
      title: '实际借款人',
      dataIndex: 'actual_loan_info',
      render: (text) => {
        const name = dot.get(text, 'name');
        return (
          <div className={styles['app-comp-expense-borrow-actual-loan-name']}>
            {name}
          </div>
        );
      },
    }, {
      title: '身份证号',
      dataIndex: 'actual_loan_info',
      render: (text) => {
        return text.identity || '--';
      },
    }, {
      title: '借款类型',
      dataIndex: 'loan_type',
      render: text => BorrowType.description(text) || '--',
    }, {
      title: '借款事由',
      dataIndex: 'loan_note',
      render: (text) => {
        if (is.empty(text) || is.not.existy(text)) {
          return '--';
        }
        // 判断字符串长度是否超过10
        if (text.length <= 10) {
          return (
            <div className={styles['app-comp-expense-borrow-loan-note']}>
              {text}
            </div>
          );
        }

        // 超过10显示省略号，加上气泡
        return (
          <Tooltip title={<span className={styles['app-comp-expense-borrow-loan-note-tooltip']}>{text}</span>}>
            <span>{text.substring(0, 10)}...</span>
          </Tooltip>
        );
      },
    }, {
      title: '借款金额（元）',
      dataIndex: 'loan_money',
      render: text => Unit.exchangePriceCentToMathFormat(text),
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (<a
          key="update"
          href={`/#/Expense/BorrowingRepayments/Borrowing/Update?applicationOrderId=${record.application_order_id}&costOrderId=${record._id}`}
          className={styles['app-comp-expense-borrow-operate']}
        >编辑</a>);
      },
    }];
    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangeBorrowingPage,  // 切换分页
      total: borrowingOrdersCount,       // 数据总条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onBorrowingShowSizeChange,
    };

    const addBorrowing = (<Button type="primary" onClick={this.onAddBorrowing}>新建</Button>);

    return (
      <CoreContent key="borrowing" title="借款单数据" titleExt={borrowingId ? '' : addBorrowing}>
        <Table rowKey={record => record._id} dataSource={dataSource} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }
}

function mapStateToProps({ borrowingRepayment: { borrowingOrders } }) {
  return { borrowingOrders };
}
export default connect(mapStateToProps)(Borrowing);
