/**
 * 房屋管理 / 房屋详情 / 房屋台账
 */

import React, { Component } from 'react';
import PropsType from 'prop-types';

import { CoreContent } from '../../../../../../components/core';

import AccountAgencyFees from './components/accountAgencyFee'; // 台账中介费
import AccountDeposit from './components/accountDeposit'; // 台账押金
import AccountRent from './components/accountRent'; // 台账租金

class Account extends Component {

  static propTypes = {
    houseAccout: PropsType.object, // 房屋详情
    houseContractDetail: PropsType.object, // 房屋详情
    onChangePage: PropsType.func,
  };

  static defaultProps = {
    houseAccout: {}, // 房屋详情
    houseContractDetail: PropsType.object,
    onChangePage: () => {},
  };

  // 渲染中介费记录
  renderAgencyFees = () => {
    const {
      houseContractDetail = {},
      houseAccout = {}, // 房屋台账
    } = this.props;

    // 中介费科目id
    const {
      agentAccountingId,
      costOrderList = [],
    } = houseContractDetail;

    const {
      data: houseAccoutData = [], // 台账数据
    } = houseAccout;

    // 中介费费用单数据（房屋台账无数据时，中介费不显示）
    const data = houseAccoutData.length === 0
      ? []
      : costOrderList.filter(item => item.cost_accounting_id === agentAccountingId);

    return (
      <AccountAgencyFees
        costOrderData={data}
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染押金记录
  renderDeposit = () => {
    const {
      houseContractDetail,
      houseAccout, // 房屋台账
    } = this.props;

    const {
      pledgeAccountingId, // 押金科目id
      // lostAccountingId,
      costOrderList = [], // 费用单列表
      pledgeMoney, // 房屋合同中押金金额
    } = houseContractDetail;

    const {
      data: houseAccoutData = [], // 台账数据
    } = houseAccout;

    // 押金费用单数据（台账无数据时，押金不显示）
    const data = houseAccoutData.length === 0
      ? []
      : costOrderList.filter(item => item.cost_accounting_id === pledgeAccountingId && item.total_money === pledgeMoney);

    return (
      <AccountDeposit
        costOrderData={data}
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染租金记录
  renderRent = () => {
    const {
      houseAccout, // 台账信息
      houseContractDetail, // 房屋详情
      onChangePage, // 修改分页
    } = this.props;

    return (
      <AccountRent
        houseAccout={houseAccout}
        houseContractDetail={houseContractDetail}
        onChangePage={onChangePage}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="房屋台账记录">

        {/* 渲染中介费记录 */}
        {this.renderAgencyFees()}

        {/* 渲染押金记录 */}
        {this.renderDeposit()}

        {/* 渲染租金记录 */}
        {this.renderRent()}
      </CoreContent>
    );
  }
}

export default Account;
