/**
 * 费用管理 / 房屋管理 / 房屋续签编辑
 */
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import BasisInfo from './components/detail/basisInfo'; // 基础信息
import HistoryContractInfo from '../components/detail/renew'; // 历史合同信息
import AccountInfo from '../components/detail/account'; // 房屋台账
import HouseInfo from '../components/form/houseInfo'; // 房屋信息表单
import AscriptionInfo from '../components/form/ascriptionNew'; // 成本归属
import RenewContractInfo from './components/form/contract'; // 续签合同信息
import RentInfo from '../withdrawal/components/form/rentInfo'; // 租金信息
import DepositInfo from '../components/form/deposit'; // 押金信息
import AgencyFeeInfo from '../components/form/agencyFees.jsx'; // 中介费信息
import Operation from './components/form/operation'; // 操作

class Index extends Component {
  static propsTypes = {
    form: PropTypes.object,
    houseContractDetail: PropTypes.object,
  }

  static defaultProps = {
    form: {},
    houseContractDetail: {},
  }

  // 渲染基础信息
  renderBasisInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;
    return (
      <BasisInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染历史合同信息
  renderHistoryContractInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;
    return (
      <HistoryContractInfo
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染房屋台账信息
  renderAccoutInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;
    return (
      <AccountInfo
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染房屋信息表单
  renderHouseInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail,
    } = this.props;
    return (
      <HouseInfo
        form={form}
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染成本归属
  renderAscriptionInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail,
    } = this.props;
    return (
      <AscriptionInfo
        form={form}
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染续签合同信息
  renderRenewContractInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail,
    } = this.props;
    return (
      <RenewContractInfo
        form={form}
        detail={houseContractDetail}
      />
    );
  }

  // 渲染租金信息
  renderRentInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail,
    } = this.props;
    return (
      <RentInfo
        form={form}
        isContract
        detail={houseContractDetail}
      />
    );
  }

  // 渲染押金信息
  renderDepositInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail,
    } = this.props;
    return (
      <DepositInfo
        form={form}
        isContract
        detail={houseContractDetail}
      />
    );
  }

  // 渲染中介费信息
  renderAgencyFeeInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail,
    } = this.props;
    return (
      <AgencyFeeInfo
        form={form}
        isContract
        detail={houseContractDetail}
      />
    );
  }

  // 渲染操作
  renderOpration = () => {
    return (
      <Operation />
    );
  }

  renderContent = () => {
    return (
      <div>
        {/* 基本信息 */}
        {this.renderBasisInfo()}
        {/* 历史合同信息 */}
        {this.renderHistoryContractInfo()}
        {/* 房屋台账信息 */}
        {this.renderAccoutInfo()}
        {/* 房屋信息 */}
        {this.renderHouseInfo()}
        {/* 成本归属信息 */}
        {this.renderAscriptionInfo()}
        {/* 续签合同信息 */}
        {this.renderRenewContractInfo()}
        {/* 合同租金信息 */}
        {this.renderRentInfo()}
        {/* 合同押金信息 */}
        {this.renderDepositInfo()}
        {/* 合同中介费信息 */}
        {this.renderAgencyFeeInfo()}
        {/* 操作 */}
        {this.renderOpration()}
      </div>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

function mapStateToProps({
  expenseHouseContract: {
    houseContractDetail,
  },
}) {
  return {
    houseContractDetail,
  };
}

export default Form.create()(connect(mapStateToProps)(Index));
