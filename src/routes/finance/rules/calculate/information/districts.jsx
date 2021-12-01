/**
* 服务费试算详情页面 - 商圈维度明细
 */
import is from 'is_js';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { Unit, ExpenseCostCenterType, FinanceSalaryTaskState } from '../../../../../application/define/index';

class DistrictsDetail extends Component {
  static propTypes = {
    districtsData: PropTypes.object, // 商圈数据列表
    calculateId: PropTypes.string,   // 获取的详情id
  }
  static defaultProps = {
    districtsData: {},
    calculateId: '',
  }
  // 默认数据的加载
  componentDidMount = () => {
    const { calculateId } = this.props;
    const params = {
      taskId: calculateId,
      type: ExpenseCostCenterType.district,
    };
    // 刷新商圈明细列表
    this.props.dispatch({ type: 'financePlan/fetchDistrictsDetailData', payload: params });
  }

  // 渲染商圈维度明细列表
  renderDistrictsContent = () => {
    const { districtsData } = this.props; // 获取商圈数据
    // 试算结果tabel列表
    const columns = [{
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictName',
      key: 'bizDistrictName',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '版本号',
      dataIndex: 'planVersionId',
      key: 'planVersionId',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '试算月份',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '完成单量',
      dataIndex: ['data', 'done_order'],
      key: 'data.done_order',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? text : '--';
      },
    }, {
      title: '试算总金额(元)',
      dataIndex: ['data', 'trial_calculation_amount'],
      key: 'data.trial_calculation_amount',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '单量提成(元)',
      dataIndex: ['data', 'total_order'],
      key: 'data.total_order',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '补贴总额(元)',
      dataIndex: ['data', 'subsidy_amount'],
      key: 'data.subsidy_amount',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '管理总额(元)',
      dataIndex: ['data', 'management_amount'],
      key: 'data.management_amount',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }];
    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 30, // 默认下拉页数
      total: dot.get(districtsData, 'data', []).length, // 数据的条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
    };
    return (
      <div>
        <Table
          columns={columns}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1000 }}
          dataSource={dot.get(districtsData, 'data', [])}
          pagination={pagination}
          bordered
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染商圈维度明细列表*/}
        {this.renderDistrictsContent()}
      </div>
    );
  }
}

function mapStateToProps({ financePlan: { districtsData } }) {
  return { districtsData };
}
export default connect(mapStateToProps)(DistrictsDetail);
