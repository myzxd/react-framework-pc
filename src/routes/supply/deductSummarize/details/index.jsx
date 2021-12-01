/**
 * 物资管理 - 扣款汇总 - 扣款汇总详情页 Supply/DeductSummarize/Details
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Empty } from 'antd';
import { noop } from 'redux-saga/utils';

import { CoreContent } from '../../../../components/core';
import {
  Unit,
  SupplyPledgeMoneyType,
  SupplyMoneyDeductionType,
} from '../../../../application/define';

import BasicInfo from './basicInfo.jsx';

class Index extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    deductSummarizeDetail: PropTypes.object,
  }

  static defaultProps = {
    deductSummarizeDetail: {},
    dispatch: noop,
  }

  constructor(props) {
    super(props);
    const id = dot.get(props, 'location.query.id');
    this.state = {
      id,
    };
    this.private = {
      searchParams: {},   // 查询参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { id } = this.state;
    const { dispatch } = this.props;
    // 扣款汇总数据列表
    dispatch({
      type: 'supplyDeductSummarize/fetchDeductSummarizeDetail',
      payload: { id, page: 1, limit: 30 },
    });
  }

  // 重置
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplyDeductSummarize/reduceDeductSummarizeDetail',
      payload: {},
    });
  }

  // 修改分页
  onChangePage = (page = 1, limit = 30) => {
    const { id } = this.state;
    const { dispatch } = this.props;

    // 页码、条数
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;

    // 扣款汇总数据列表
    dispatch({
      type: 'supplyDeductSummarize/fetchDeductSummarizeDetail',
      payload: { id, page, limit },
    });
  }

  // 改变每页展示条数
  onShowSizeChange = (page = 1, limit = 30) => {
    const { id } = this.state;
    const { dispatch } = this.props;

    // 页码、条数
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;

    // 扣款汇总数据列表
    dispatch({
      type: 'supplyDeductSummarize/fetchDeductSummarizeDetail',
      payload: { id, page, limit },
    });
  }

  // 渲染基本信息
  renderInfo = () => {
    const { deductSummarizeDetail } = this.props;

    return (
      <BasicInfo
        data={deductSummarizeDetail}
      />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { deductSummarizeDetail } = this.props;

    const { page } = this.private.searchParams;

    const columns = [
      {
        title: '物资名称',
        dataIndex: 'material_name',
        key: 'material_name.name',
        fixed: 'left',
        width: 100,
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '物资编号',
        dataIndex: 'material_code',
        key: 'material_code.code',
        fixed: 'left',
        width: 100,
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '数量',
        dataIndex: 'qty',
        key: 'qty',
        fixed: 'left',
        width: 80,
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '分发时间',
        dataIndex: 'distribute_at',
        key: 'distribute_at',
        width: 150,
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      }, {
        title: '领用时间',
        dataIndex: 'received_at',
        key: 'received_at',
        width: 100,
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      }, {
        title: '扣款周期',
        dataIndex: 'month',
        key: 'month',
        width: 100,
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '押金扣款方式',
        dataIndex: 'pledge_money_type',
        key: 'pledge_money_type',
        width: 120,
        render: (text) => {
          return SupplyPledgeMoneyType.description(text) || '--';
        },
      }, {
        title: '使用费扣款方式',
        dataIndex: 'fee_money_deduction_type',
        key: 'fee_money_deduction_type',
        width: 120,
        render: (text) => {
          return SupplyMoneyDeductionType.description(text) || '--';
        },
      }, {
        title: '应扣款押金(元)',
        dataIndex: 'deduction_deposit',
        key: 'deduction_deposit',
        width: 120,
        render: (text) => {
          return Unit.exchangePriceCentToMathFormat(text) || 0;
        },
      }, {
        title: '应扣款使用费(元)',
        dataIndex: 'deduction_usage_fee',
        key: 'deduction_usage_fee',
        width: 120,
        render: (text) => {
          return Unit.exchangePriceCentToMathFormat(text) || 0;
        },
      }, {
        title: '应扣款折损费(元)',
        dataIndex: 'deduction_fee',
        key: 'deduction_fee',
        width: 120,
        render: (text) => {
          return Unit.exchangePriceCentToMathFormat(text) || 0;
        },
      }, {
        title: '应退款押金(元)',
        dataIndex: 'refund_deposit',
        key: 'refund_deposit',
        width: 120,
        render: (text) => {
          return Unit.exchangePriceCentToMathFormat(text) || 0;
        },
      },
    ];
    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: deductSummarizeDetail.total_count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };

    if (page) {
      pagination.current = page; // 当前页数
    }

    return (
      <CoreContent>
        <Table
          columns={columns}
          rowKey={record => record._id}
          dataSource={deductSummarizeDetail.deduction_order_list}
          bordered
          pagination={pagination}
          scroll={{ x: 1350 }}
        />
      </CoreContent>
    );
  }

  render() {
    const { deductSummarizeDetail } = this.props;

    // 数据为空
    if (Object.keys(deductSummarizeDetail).length === 0) {
      return <Empty />;
    }

    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderInfo()}

        {/* 渲染数据列表 */}
        {this.renderContent()}
      </div>
    );
  }
}
function mapStateToProps({ supplyDeductSummarize: { deductSummarizeDetail } }) {
  return { deductSummarizeDetail };
}
export default connect(mapStateToProps)(Index);
