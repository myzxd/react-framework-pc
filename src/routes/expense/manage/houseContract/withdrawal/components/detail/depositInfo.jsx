/**
 * 费用管理 / 房屋管理 / 退租编辑 / 押金信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Unit } from '../../../../../../../application/define';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core';

class DepositInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    detail: {}, // 默认为空
  }

  // 渲染押金信息
  renderDepositInfo = () => {
    // 房屋详情
    const { detail = {} } = this.props;

    const {
      pledgeMoney, // 押金金额
      pledgeAccountingInfo: {
        name: accountingName, // 科目name
        accountingCode, // 科目id
      } = {
        name: '',
        accountingCode: '',
      },
      pledgePayeeInfo: { // 押金科目信息
        bank_details: bankDetails, // 开户支行
        card_name: cardName, // 收款账户
        card_num: cardNum, // 押金收款人
      } = {
        bank_details: '',
        card_name: '',
        card_num: '',
      },
      migrateFlag, // 合同录入方式
    } = detail;

    // 押金字段
    const pledgeTilte = migrateFlag ? '期初押金' : '押金金额';

    // 押金信息
    const moneyForm = [
      {
        label: pledgeTilte,
        form: pledgeMoney !== undefined
        ? Unit.exchangePriceToYuan(pledgeMoney)
        : '--',
      },
      {
        label: '科目',
        form: `${accountingName}${accountingCode}`,
      },
    ];

    // 收款信息
    const receiptForm = [
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
      <CoreContent title="押金信息">
        <DeprecatedCoreForm
          items={moneyForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={receiptForm}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderDepositInfo();
  }
}

export default DepositInfo;
