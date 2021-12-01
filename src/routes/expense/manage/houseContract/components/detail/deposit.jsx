/**
 * 房屋管理/房屋详情/押金信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Unit } from '../../../../../../application/define';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';

class Deposit extends Component {

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
      pledgeMoney,
      // pledgeInvoiceFlag,
      pledgeAccountingInfo: {
        name: accountingName,
        accountingCode,
      } = {
        name: '',
        accountingCode: '',
      },
    } = houseContractDetail;
    const formItems = [
      {
        label: '押金金额',
        form: pledgeMoney !== undefined
        ? Unit.exchangePriceToYuan(pledgeMoney)
        : '--',
      },
      // {
      //   label: '是否开票',
      //   form: pledgeInvoiceFlag ? '是' : '否',
      // },
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
      pledgePayeeInfo: {
        bank_details: bankDetails,
        card_name: cardName,
        card_num: cardNum,
      } = {
        bank_details: '',
        card_name: '',
        card_num: '',
      },
    } = houseContractDetail;
    const formItems = [
      {
        label: '押金收款人',
        form: cardName || '--',
      },
      {
        label: '收款账号',
        form: cardNum || '--',
      },
      {
        label: '开户支行',
        form: bankDetails || '',
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

  render = () => {
    return (
      <CoreContent title="押金信息">

        {/* 渲染费用信息 */}
        {this.renderExpenseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default Deposit;
