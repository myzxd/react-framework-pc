/**
 * 房屋管理/房屋信息查看 /Expense/Manage/House/Detail
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';

import HouseInfo from './components/detail/houseInfo';
import Deposit from './components/detail/deposit';
import AgencyFees from './components/detail/agencyFees';
import BaseInfo from './components/common/baseInfo';
import Rent from './components/detail/rent';
import Ascription from './components/detail/ascription';
import HistoryContract from './components/detail/renew';
import ContractInfo from './components/detail/contractInfo';
import Account from './components/detail/account';

class Detail extends Component {
  static propTypes = {
    houseContractDetail: PropTypes.object,
    houseAccout: PropTypes.object,
    isExternal: PropTypes.bool,
  };

  static defaultProps = {
    houseContractDetail: {},
    houseAccout: {},
    isExternal: false,
  };

  constructor() {
    super();
    this.state = {};
    this.private = {
      searchParams: {
        page: 1,
        limit: 10,
      },
    };
  }

  componentDidMount() {
    const { location, contractId, isExternal = false } = this.props;

    // 外部审批单不调用接口
    if (isExternal) return;

    // 房屋合同id
    const ids = contractId || location.query.id;
    // 获取房屋台账信息
    this.props.dispatch({ type: 'expenseHouseContract/fetchHouseAccount', payload: { id: ids } });
  }

  // 清空数据
  componentWillUnmount() {
    const { isReset } = this.props;
    if (isReset === true) {
      return;
    }
    this.props.dispatch({ type: 'expenseHouseContract/resetHouseContractDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetCostOrders' });
  }

  // 搜索
  onSearch = () => {
    const { dispatch, location, contractId } = this.props;
    const { id } = location.query;
    // 房屋合同id
    const ids = contractId || id;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    if (!this.private.searchParams.id) {
      this.private.searchParams.id = ids;
    }
    // 调用搜索
    dispatch({ type: 'expenseHouseContract/fetchHouseAccount', payload: this.private.searchParams });
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

  // 渲染基本信息
  renderBaseInfo = () => {
    const { houseContractDetail } = this.props;
    return (
      <BaseInfo
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染历史合同信息
  renderRenew = () => {
    const { houseContractDetail, isExternal } = this.props;
    return (
      <HistoryContract
        houseContractDetail={houseContractDetail}
        isExternal={isExternal}
      />
    );
  }

  // 渲染房屋台账
  renderAccount = () => {
    const { houseAccout, houseContractDetail } = this.props;
    if (Object.keys(houseAccout).length === 0) return null;
    return (
      <Account
        houseAccout={houseAccout}
        houseContractDetail={houseContractDetail}
        onChangePage={this.onChangePage}
        onShowSizeChange={this.onShowSizeChange}
      />
    );
  }

  // 渲染房屋信息
  renderHouseInfo = () => {
    const { houseContractDetail } = this.props;
    return (
      <HouseInfo
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染归属信息
  renderAscriptionInfo = () => {
    const { houseContractDetail } = this.props;
    return (
      <Ascription
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染合同信息
  renderContractInfo = () => {
    const { houseContractDetail } = this.props;
    return (
      <ContractInfo
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染租金信息
  renderRentInfo = () => {
    const { houseContractDetail } = this.props;
    return (
      <Rent
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染押金信息
  renderDeposit = () => {
    const { houseContractDetail } = this.props;
    return (
      <Deposit
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染中介费信息
  renderAgencyFees = () => {
    const { houseContractDetail } = this.props;
    return (
      <AgencyFees
        houseContractDetail={houseContractDetail}
      />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染历史合同信息 */}
        {this.renderRenew()}

        {/* 渲染房屋台账信息 */}
        {this.renderAccount()}

        {/* 渲染房屋信息 */}
        {this.renderHouseInfo()}

        {/* 渲染归属信息 */}
        {this.renderAscriptionInfo()}

        {/* 渲染合同信息 */}
        {this.renderContractInfo()}

        {/* 渲染租金信息 */}
        {this.renderRentInfo()}

        {/* 渲染押金信息 */}
        {this.renderDeposit()}

        {/* 渲染中介费信息 */}
        {this.renderAgencyFees()}
      </div>
    );
  }
}

function mapStateToProps({ expenseHouseContract: { houseContractDetail, houseAccout } }) {
  return { houseContractDetail, houseAccout };
}


export default withRouter(connect(mapStateToProps)(Detail));
