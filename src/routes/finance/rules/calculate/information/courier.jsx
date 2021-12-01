/**
* 服务费试算详情页面 - 骑士维度明细
 */
import is from 'is_js';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { Unit, ExpenseCostCenterType, FinanceSalaryTaskState } from '../../../../../application/define';

class CourierDetail extends Component {
  static propTypes = {
    courierData: PropTypes.object, // 接收骑士维度明细数据
    calculateId: PropTypes.string, // 获取的详情id
  }
  static defaultProps = {
    courierData: {},
    calculateId: '',
  }

  // 加载默认数据
  componentDidMount = () => {
    const { calculateId } = this.props;
    const params = {
      taskId: calculateId,
      type: ExpenseCostCenterType.knight,
    };
    // 刷新骑士维度明细列表
    this.props.dispatch({ type: 'financePlan/fetchCourierDetailData', payload: params });
  }

  // 渲染骑士维度明细列表
  rendercourierContent = () => {
    const { courierData } = this.props;
    // 骑士维度明细tabel列表
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
      title: '骑士姓名/boss工号',
      dataIndex: ['staffInfo', 'name'],
      key: 'staffInfo.name',
      render: (text, record) => {
        return (<span>{text}/{record.staffInfo.id}</span>);
      },
    }, {
      title: '手机号',
      dataIndex: ['staffInfo', 'phone'],
      key: 'staffInfo.phone',
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
      dataIndex: ['data', 'subsidy_amount'],
      key: 'data.subsidy_amount',
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
      total: dot.get(courierData, 'data', []).length, // 数据的条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
    };
    return (
      <div>
        <Table
          columns={columns}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1000 }}
          dataSource={dot.get(courierData, 'data', [])}
          pagination={pagination}
          bordered
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染骑士维度明细列表*/}
        {this.rendercourierContent()}
      </div>
    );
  }
}

function mapStateToProps({ financePlan: { courierData } }) {
  return { courierData };
}
export default connect(mapStateToProps)(CourierDetail);
