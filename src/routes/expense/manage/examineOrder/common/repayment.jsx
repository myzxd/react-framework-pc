/**
 * 付款审批 -还款信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table } from 'antd';
import { CoreContent } from '../../../../../components/core';

import {
  Unit,
} from '../../../../../application/define';
import styles from './style.less';

class Repayment extends Component {
  static propTypes = {
    repaymentId: PropTypes.string,
    repaymentOrders: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    repaymentId: '',
    repaymentOrders: {},
    dispatch: () => {},
  };

  // 默认加载数据
  componentDidMount() {
    const { repaymentId, dispatch } = this.props;
    if (repaymentId) {
      dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: { repaymentsOrderId: repaymentId, disableState: true } }); // 还款单列表
    }
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'borrowingRepayment/resetRepaymentOrders' }); // 重置还款单列表数据
  }

  // 修改还款分页
  onChangeRepaymentPage = (page) => {
    const { repaymentId, dispatch } = this.props;
    dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: { repaymentsOrderId: repaymentId, limit: 30, page, disableState: true } }); // 还款单列表
  }

  // 改变还款每页展示条数
  onRepaymentShowSizeChange = (page, limit) => {
    const { repaymentId, dispatch } = this.props;
    dispatch({ type: 'borrowingRepayment/fetchRepaymentOrders', payload: { repaymentsOrderId: repaymentId, limit, page, disableState: true } }); // 还款单列表
  }

  render = () => {
    const { repaymentOrders = {} } = this.props;

    const dataSource = dot.get(repaymentOrders, 'data', []);
    const repaymentOrdersCount = dot.get(repaymentOrders, 'meta.count', 0);

    const columns = [{
      title: '还款单号',
      dataIndex: '_id',
      render: text => (
        <div className={styles['app-comp-expense-repayment-id']}>
          {text}
        </div>
      ),
    }, {
      title: '平台',
      dataIndex: 'application_order_info',
      render: (text) => {
        const platformName = dot.get(text, 'platform_names', []);
        return is.empty(platformName) ? '--' : platformName;
      },
    }, {
      title: '供应商',
      dataIndex: 'application_order_info',
      render: (text) => {
        const supplierNames = dot.get(text, 'supplier_names', []);
        return is.empty(supplierNames) ? '--' : supplierNames;
      },
    }, {
      title: '城市',
      dataIndex: 'application_order_info',
      render: (text) => {
        const cityNames = dot.get(text, 'city_names', []);
        return is.empty(cityNames) ? '--' : cityNames;
      },
    }, {
      title: '商圈',
      dataIndex: 'application_order_info',
      render: (text) => {
        const bizDistrictNames = dot.get(text, 'biz_district_names', []);
        return is.empty(bizDistrictNames) ? '--' : bizDistrictNames;
      },
    }, {
      title: '还款金额',
      dataIndex: 'repayment_money',
      render: (text) => {
        return Unit.exchangePriceCentToMathFormat(text);
      },
    }, {
      title: '备注',
      dataIndex: 'repayment_note',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (<a
          key="update"
          href={`/#/Expense/BorrowingRepayments/Repayments/Update?repayOrderId=${record._id}&applicationOrderId=${record.application_order_id}`}
          className={styles['app-comp-expense-repayment-operation']}
        >编辑</a>);
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
      <CoreContent key="repayments" title="还款单数据">
        <Table rowKey={record => record._id} dataSource={dataSource} columns={columns} pagination={pagination} bordered />
      </CoreContent>);
  }
}

function mapStateToProps({ borrowingRepayment: { repaymentOrders } }) {
  return { repaymentOrders };
}
export default connect(mapStateToProps)(Repayment);
