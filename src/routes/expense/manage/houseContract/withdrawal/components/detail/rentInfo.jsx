/**
 * 费用管理 / 房屋管理 / 退租编辑 / 租金信息（无运算逻辑）
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core';
import {
  Unit,
} from '../../../../../../../application/define';

class RentInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 默认数据
  };

  static defaultProps = {
    detail: {}, // 默认为空
    form: {},
  };

  // 渲染租金信息
  renderRentInfo = () => {
    // 房屋详情
    const { detail = {} } = this.props;

    const {
      monthMoney, // 月租金
      schedulePrepareDays, // 提前付款天数
      periodMonthNum, // 付款周期
      initPaidMoney, // 已支付租金金额
      initPaidMonthNum, // 已支付租金月数
      rentPayeeInfo: {
        bank_details: bankDetails, // 开户支行
        card_name: cardName, // 房租收款人
        card_num: cardNum, // 收款账户
      } = {
        bank_details: '',
        card_name: '',
        card_num: '',
      },
      rentAccountingInfo: { //  租金科目信息
        name: accountingName, // 科目name
        accountingCode, // 科目id
      } = {
        name: '',
        accountingCode: '',
      },
    } = detail;

    // 租金信息
    const moneyForm = [
      {
        label: '月租金(元)',
        form: monthMoney
        ? Unit.exchangePriceToYuan(monthMoney)
        : '--',
      },
      {
        label: '科目',
        form: `${accountingName}${accountingCode}`,
      },
      {
        label: '提前付款天数(天)',
        form: schedulePrepareDays || '--',
      },
      {
        label: '付款周期（月／次）',
        form: periodMonthNum || '--',
      },
      {
        label: '已支付租金金额(元)',
        form: initPaidMoney
        ? Unit.exchangePriceToYuan(initPaidMoney)
        : '--',
      },
      {
        label: '已支付租金月数(月)',
        form: initPaidMonthNum || '--',
      },
    ];

    // 收款信息
    const receiptForm = [
      {
        label: '房租收款人',
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
      <CoreContent title="租金信息">
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
    return this.renderRentInfo();
  }
}

export default RentInfo;
