/**
 * 房屋管理/房屋详情/中介费信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Unit, PayModeEnumer } from '../../../../../../application/define';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';

class AgencyFees extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
  }

  // 渲染费用信息
  renderExpenseInfo = () => {
    const { houseContractDetail = {} } = this.props;
    const {
      agentMoney,
      // agentInvoiceFlag,
      agentAccountingInfo: {
        name: accountingName,
        accountingCode,
      } = {
        name: '',
        accountingCode: '',
      },
    } = houseContractDetail;
    const formItems = [
      {
        label: '费用金额',
        form: agentMoney !== undefined
        ? Unit.exchangePriceToYuan(agentMoney)
        : '--',
      },
      {
        label: '科目',
        form: `${accountingName}${accountingCode}`,
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  // 渲染收款信息
  renderReceiptInfo = () => {
    const { houseContractDetail } = this.props;
    const {
      agentPayeeInfo: {
        bank_details: bankDetails,
        card_name: cardName,
        card_num: cardNum,
        id_card_no: agentIdCardNo,
        credit_no: agentCreditNo,
        payment: agentPayment,
      } = {
        bank_details: '',
        card_name: '',
        card_num: '',
        id_card_no: '',
        credit_no: '',
        payment: '',
      },
    } = houseContractDetail;
    const formItems = [
      {
        label: '中介费收款人',
        form: cardName || '--',
      },
      {
        label: '收款账号',
        form: cardNum || '--',
      },
      {
        label: '开户支行',
        form: bankDetails || '--',
      },
      {
        label: '收款类型',
        form: PayModeEnumer.description(agentPayment) || '--',
      },
    ];

    if (agentPayment === PayModeEnumer.credit) {
      formItems.push({
        label: '统一信用代码',
        form: agentCreditNo || '--',
      });
    }
    if (agentPayment === PayModeEnumer.idCard) {
      formItems.push({
        label: '身份证号',
        form: agentIdCardNo || '--',
      });
    }

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="中介费信息">

        {/* 渲染费用信息 */}
        {this.renderExpenseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default AgencyFees;
