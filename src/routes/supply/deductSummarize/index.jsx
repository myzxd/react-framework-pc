/**
 * 物资管理 - 扣款汇总页面 Supply/DeductSummarize
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
  Table,
  Empty,
} from 'antd';
import { noop } from 'redux-saga/utils';

import Search from './search';

import { CoreContent } from '../../../components/core';
import { Unit, SupplyNameType } from '../../../application/define';

class DeductSummarize extends Component {
  static propTypes = {
    deductSummarizeList: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    deductSummarizeList: {},
    dispatch: noop,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.private = {
      searchParams: {},   // 查询参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    // 扣款汇总数据列表
    const { dispatch } = this.props;
    dispatch({
      type: 'supplyDeductSummarize/fetchSupplyDeductSummarizeList',
      payload: {},
    });
  }

  // 搜索
  onSearch = (params) => {
    const { dispatch } = this.props;
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }

    // 调用搜索
    dispatch({
      type: 'supplyDeductSummarize/fetchSupplyDeductSummarizeList',
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

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    const { dispatch } = this.props;
    return (
      <Search
        onSearch={onSearch}
        dispatch={dispatch}
      />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { page, limit } = this.private.searchParams;

    // 扣款汇总数据
    const { deductSummarizeList } = this.props;

    // 数据为空，不渲染
    if (Object.keys(deductSummarizeList).length === 0) {
      return <Empty />;
    }

    const { data: deductionsData, meta } = deductSummarizeList;

    // tabel列表
    const columns = [{
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      fixed: 'left',
      width: 80,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      fixed: 'left',
      width: 180,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      fixed: 'left',
      width: 100,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '姓名',
      dataIndex: 'staff_info',
      key: 'staff_info.name',
      width: 100,
      render: (text) => {
        return text.name || '--';
      },
    }, {
      title: '物资分类',
      dataIndex: 'group',
      key: 'group',
      width: 100,
      render: (text) => {
        if (text) {
          return SupplyNameType.description(text);
        }
        return '--';
      },
    }, {
      title: '归属时间',
      dataIndex: 'month',
      key: 'month',
      width: 100,
    }, {
      title: '本月累计应扣款(元)',
      dataIndex: 'deduction_deposit',
      key: 'deduction_deposit',
      width: 140,
      render: (text, record) => {
        const deductionDeposit = text || 0;
        const ultDeductionDeposit = dot.get(record, 'ult_deduction_deposit', 0);
        const deductionUsageFee = dot.get(record, 'deduction_usage_fee', 0);
        const ultDeductionUsageFee = dot.get(record, 'ult_deduction_usage_fee', 0);
        const money = deductionDeposit + ultDeductionDeposit + deductionUsageFee + ultDeductionUsageFee;
        return Unit.exchangePriceCentToMathFormat(money);
      },
    }, {
      title: '本月应扣款(元)',
      dataIndex: 'deduction_usage_fee',
      key: 'deduction_usage_fee',
      width: 120,
      render: (text, record) => {
        const deductionUsageFee = text || 0;
        const deductionDeposit = dot.get(record, 'deduction_deposit', 0);
        const money = deductionUsageFee + deductionDeposit;
        return Unit.exchangePriceCentToMathFormat(money);
      },
    }, {
      title: '上月未扣款(元)',
      dataIndex: 'last_month_debt',
      key: 'last_month_debt',
      width: 120,
      render: (text, record) => {
        const ultDeductionUsageFee = dot.get(record, 'ult_deduction_usage_fee', 0);
        const ultDeductionDeposit = dot.get(record, 'ult_deduction_deposit', 0);
        const money = ultDeductionDeposit + ultDeductionUsageFee;
        return Unit.exchangePriceCentToMathFormat(money);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        const id = record._id;
        return (
          <a
            key="detail"
            target="_blank"
            rel="noopener noreferrer"
            href={`/#/Supply/DeductSummarize/Detail?id=${id}`}
          >
            查看
          </a>
        );
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: meta.count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };

    if (page) {
      pagination.current = page; // 当前页数
    }

    return (
      <CoreContent title="物资汇总表">
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={record => record._id}
          dataSource={deductionsData}
          bordered
          scroll={{ x: 1290, y: 600 }}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染列表内容 */}
        {this.renderContent()}
      </div>
    );
  }
}
function mapStateToProps({ supplyDeductSummarize: { deductSummarizeList } }) {
  return { deductSummarizeList };
}
export default connect(mapStateToProps)(DeductSummarize);

