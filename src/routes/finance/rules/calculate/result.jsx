/**
* 服务费试算 - 试算结果
 */
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import PropTypes from 'prop-types';
// import { Table, Popconfirm } from 'antd';
// import { Link } from 'dva/router';

import { CoreContent } from '../../../../components/core';
import { Unit, FinanceSalaryTaskState } from '../../../../application/define';
// import Operate from '../../../../application/define/operate';

class CalculateResultComponent extends Component {
  static propTypes = {
    calculateResultsData: PropTypes.object, // 试算结果列表数据
    planVersionId: PropTypes.string,        // 版本Id
  }
  static defaultProps = {
    calculateResultsData: {},
    planVersionId: '',
  }
  constructor() {
    super();
    // 服务费试算页面刷新定时器
    this.setInter = undefined;
  }

  componentDidMount = () => {
    const { planVersionId } = this.props;
    const payload = {
      planVersionId,
      type: 'now',
      onSuccessCallback: this.onSuccessCallback,
    };
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanResultsData', payload });
  }

  // 清除定时器
  componentWillUnmount() {
    clearInterval(this.setInter);
  }

  // 列表回调函数
  onSuccessCallback = (res) => {
    if (res !== undefined) {
      const data = res.data;
      if (is.not.empty(data)) {
        // 当状态为成功停止定时器
        data.map((item) => {
          if (item.state === FinanceSalaryTaskState.success || item.state === FinanceSalaryTaskState.failure) {
            clearInterval(this.setInter);
          } else {
            this.onSetInter();
          }
        });
      }
    }
  }

  // 添加定时器
  onSetInter = () => {
    const { planVersionId } = this.props;
    const payload = {
      planVersionId,
      type: 'now',
      onSuccessCallback: this.onSuccessCallback,
    };
    this.setInter = setInterval(() => {
      this.props.dispatch({ type: 'financePlan/fetchSalaryPlanResultsData', payload });
    }, 10000);
  }


  // 进入明细详情
  onDetails = (record) => {
    const params = {
      taskId: record.id,
    };
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanSummaryData', payload: params });
  }

  // 导出数据
  onExportData = (record) => {
    const params = {
      taskId: record.id,
    };
    this.props.dispatch({ type: 'financePlan/downloadSalaryPlanList', payload: params });
  }

  // 渲染试算结果列表
  renderResultContent = () => {
    const { calculateResultsData } = this.props;
    // 试算结果tabel列表
    const columns = [{
      title: '流水号',
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return text || '--';
      },
    }, {
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
      title: '试算月份',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '完成单量',
      dataIndex: ['computeDataSet', 'doneOrder'],
      key: 'computeDataSet.doneOrder',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? text : '--';
      },
    }, {
      title: '试算总金额(元)',
      dataIndex: ['computeDataSet', 'trialCalculationAmount'],
      key: 'computeDataSet.trialCalculationAmount',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '单量提成(元)',
      dataIndex: ['computeDataSet', 'totalOrder'],
      key: 'computeDataSet.totalOrder',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '补贴总额(元)',
      dataIndex: ['computeDataSet', 'subsidyAmount'],
      key: 'computeDataSet.subsidyAmount',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '管理总额(元)',
      dataIndex: ['computeDataSet', 'managementAmount'],
      key: 'computeDataSet.managementAmount',
      render: (text, { state }) => {
        return is.number(text) && state !== FinanceSalaryTaskState.pendding ? Unit.exchangePriceToYuan(text) : '--';
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return (<span>{FinanceSalaryTaskState.description(text)}</span>);
      },
    },
    ];
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   key: 'operation',
    //   render: (text, record) => {
    //     return (<span>
    //       <Link style={{ color: 'orange' }} to={{ pathname: '/Finance/Rules/Calculate/Detail', query: { calculateId: record.id } }} onClick={() => { this.onDetails(record); }}>明细详情</Link>
    //       <Popconfirm placement="top" title="是否导出数据内容?" onConfirm={() => { this.onExportData(record); }} okText="确认" cancelText="取消">
    //         {!Operate.canOperateFinancePlanExportData() || <a style={{ marginLeft: '10px', color: 'orange' }} >导出数据</a>}
    //       </Popconfirm>
    //     </span>);
    //   },
    // }
    return (
      <CoreContent title="试算结果">
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1000 }}
          pagination={false}
          dataSource={calculateResultsData.data || []}
          bordered
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染试算结果*/}
        {this.renderResultContent()}
      </div>
    );
  }
}

function mapStateToProps({ financePlan: { calculateResultsData } }) {
  return { calculateResultsData };
}
export default connect(mapStateToProps)(CalculateResultComponent);
