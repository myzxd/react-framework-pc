/**
 * 服务费试算详情页面 - 试算汇总
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Row, Col, Button, Popconfirm } from 'antd';
import { CoreContent } from '../../../../../components/core';

import { Unit } from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';
import styles from './style/index.less';

class calculateSummary extends Component {
  static propTypes = {
    calculateSummaryData: PropTypes.object, // 商圈数据列表
    calculateId: PropTypes.string,          // 获取的详情id
  }
  static defaultProps = {
    calculateSummaryData: {},
    calculateId: '',
  }

  // 默认加载数据
  componentDidMount = () => {
    const { calculateId } = this.props;
    const params = {
      taskId: calculateId,
    };
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanSummaryData', payload: params });
  }

  // 导出试算汇总数据
  onExportData = () => {
    const { calculateSummaryData } = this.props;
    const id = dot.get(calculateSummaryData, 'data', []).map((item) => {
      return item.id;
    });
    const taskId = id.join('');
    const params = {
      taskId,
    };
    this.props.dispatch({ type: 'financePlan/downloadSalaryPlanList', payload: params });
  }
  // 渲染试算汇总
  render() {
    const { calculateSummaryData } = this.props;     // 获取试算汇总数据
    const operations = (
      <span>
        <Popconfirm placement="left" title="是否导出数据内容?" onConfirm={this.onExportData} okText="确定" cancelText="取消">
          {!Operate.canOperateFinancePlanExportData() || <Button type="primary">导出数据</Button>}
        </Popconfirm>
      </span>
    );
    return (
      <CoreContent title="试算汇总" titleExt={operations}>
        {/* 渲染的内容 */}
        {
          dot.get(calculateSummaryData, 'data', []).map((items, index) => {
            return (<Row key={index}>
              <Col span={7} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>流水号:</Col>
                <Col span="14" className={styles['app-comp-finance-IStotw']} offset="1" >{`${items.id}` ? `${items.id}` : '--'}</Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>城市:</Col>
                <Col span="14" className={styles['app-comp-finance-IStotw']} offset="1" >{`${items.cityName}` ? `${items.cityName}` : '--'}</Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>商圈:</Col>
                <Col span="14" className={styles['app-comp-finance-IStotw']} offset="1" >{`${items.bizDistrictName}` ? `${items.bizDistrictName}` : '--'}</Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span={6} className={styles['app-comp-finance-ISfotw']}>版本号:</Col>
                <Col span="17" className={styles['app-comp-finance-IStotw']} offset="1" >{`${items.planVersionId}` ? `${items.planVersionId}` : '--'}</Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>试算月份:</Col>
                <Col span="14" className={styles['app-comp-finance-IStotw']} offset="1" >{`${items.fromDate}` ? `${items.fromDate}` : '--'}</Col>
              </Col>
              <Col span={7} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>完成单量:</Col>
                <Col span="14" className={styles['app-comp-finance-IStl']} offset="1" >{items.computeDataSet.doneOrder[0] ? items.computeDataSet.doneOrder[0] : '--'}</Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span="10" className={styles['app-comp-finance-ISfotw']}>试算总金额:</Col>
                <Col
                  span="12"
                  className={styles['app-comp-finance-IStotw']}
                  offset="1"
                >
                  {Unit.exchangePriceToYuan(items.computeDataSet.managementAmount[0]) ? Unit.exchangePriceToYuan(items.computeDataSet.managementAmount[0]) : '--'}
                </Col>
              </Col>
              <Col
                span={4}
                className={styles['app-comp-finance-IStrmt']}
              >
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>单量总额:</Col>
                <Col span="14" className={styles['app-comp-finance-IStotw']} offset="1" >{items.computeDataSet.totalOrder[0] ? items.computeDataSet.totalOrder[0] : '--'}</Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>补贴总额:</Col>
                <Col
                  span="14"
                  className={styles['app-comp-finance-IStotw']}
                  offset="1"
                >
                  {Unit.exchangePriceToYuan(items.computeDataSet.subsidyAmount[0]) ? Unit.exchangePriceToYuan(items.computeDataSet.subsidyAmount[0]) : '--'}
                </Col>
              </Col>
              <Col span={4} className={styles['app-comp-finance-IStrmt']}>
                <Col span={8} className={styles['app-comp-finance-ISfotw']}>管理总额:</Col>
                <Col
                  span="14"
                  className={styles['app-comp-finance-IStotw']}
                  offset="1"
                >
                  {Unit.exchangePriceToYuan(items.computeDataSet.managementAmount[0]) ? Unit.exchangePriceToYuan(items.computeDataSet.managementAmount[0]) : '--'}
                </Col>
              </Col>
            </Row>);
          })
        }
      </CoreContent>
    );
  }
}
function mapStateToProps({ financePlan: { calculateSummaryData } }) {
  return { calculateSummaryData };
}
export default connect(mapStateToProps)(calculateSummary);
