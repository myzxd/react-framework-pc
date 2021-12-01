/**
* 服务费试算详情页面 Finance/Rules/Calculate/Detail
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import DistrictsDetail from './districts';
import CourierDetail from './courier';
import CalculateSummary from './summary';
import styles from './style/index.less';

import { CoreContent, CoreTabs } from '../../../../../components/core';
import { FinanceSalaryDetailType, ExpenseCostCenterType } from '../../../../../application/define';

class CalculateDetail extends Component {
  static propTypes = {
    addressInfo: PropTypes.object, // 商圈数据列表
  }
  static defaultProps = {
    addressInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      courier: '骑士维度明细表',
      districts: '商圈维度明细表',
    };
  }
  componentDidMount = () => {
    const { calculateId } = this.props.location.query;
    const params = {
      taskId: calculateId,
    };
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanAddressInfo', payload: params });
  }
  // tabel的改变
  onChange = (e) => {
    const { calculateId } = this.props.location.query;
    const { courier } = this.state;
    const courierParams = {
      taskId: calculateId,
      type: ExpenseCostCenterType.knight,
    };
    const districtsParams = {
      taskId: calculateId,
      type: ExpenseCostCenterType.district,
    };
    if (e === courier) {
      // 刷新骑士维度明细列表
      this.props.dispatch({ type: 'financePlan/fetchCourierDetailData', payload: courierParams });
    } else {
      // 刷新商圈明细列表
      this.props.dispatch({ type: 'financePlan/fetchDistrictsDetailData', payload: districtsParams });
    }
  }
  // 渲染的城市与商圈
  renderAddress = () => {
    const { addressInfo } = this.props;
    const addressInfoData = dot.get(addressInfo, 'data', []);
    return (<div>
      {
        addressInfoData.map((item, index) => {
          return <h1 key={index} className={styles['app-comp-finance-Ifont']} > {item.bizDistrictName ? `${item.cityName}-${item.bizDistrictName}` : item.cityName} </h1>;
        })
      }
    </div>);
  }
  // 渲染城市-试算汇总
  renderCalculateSummary = () => {
    const { calculateId } = this.props.location.query;
    return (<CalculateSummary calculateId={calculateId} />);
  }

  // 渲染商圈明细Tabel
  renderTabs = () => {
    const { calculateId } = this.props.location.query;
    const { districts } = this.state;
    const items = [
      { title: '商圈维度明细表', content: <DistrictsDetail type={FinanceSalaryDetailType.districts} calculateId={calculateId} />, key: '商圈维度明细表' },
      { title: '骑士维度明细表', content: <CourierDetail type={FinanceSalaryDetailType.courier} calculateId={calculateId} />, key: '骑士维度明细表' },
    ];
    return (
      <div className={styles['app-comp-finance-Wrap']}>
        <CoreContent title="明细表">
          <CoreTabs items={items} onChange={this.onChange} defaultActiveKey={districts} />
        </CoreContent>
      </div>
    );
  }
  render() {
    return (
      <div>
        {/* 渲染的城市与商圈 */}
        {this.renderAddress()}

        {/* 渲染试算汇总 */}
        {this.renderCalculateSummary()}

        {/* 渲染商圈明细Tabel */}
        {this.renderTabs()}
      </div>
    );
  }
}

function mapStateToProps({ financePlan: { addressInfo } }) {
  return { addressInfo };
}

export default connect(mapStateToProps)(CalculateDetail);
