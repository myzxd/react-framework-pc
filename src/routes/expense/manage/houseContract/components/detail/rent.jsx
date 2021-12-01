/**
 * 房屋管理/房屋详情/租金信息
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import { PayModeEnumer, Unit } from '../../../../../../application/define';


class Rent extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 默认数据
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
  };

  // 渲染租金信息
  renderBaseInfo = () => {
    const { houseContractDetail = {} } = this.props;
    const {
      monthMoney,
      schedulePrepareDays,
      periodMonthNum,
      initPaidMoney,
      initPaidMonthNum,
      rentAccountingInfo: {
        name: accountingName,
        accountingCode,
      } = {
        name: '',
        accountingCode: '',
      },
      migrateFlag, // 合同录入方式
      lastAllocationMoney, // 未分摊金额
      allocationStartDate, // 未分摊时间段（开始时间）
      allocationEndDate, // 未分摊时间段（结束时间）
    } = houseContractDetail;
    const formItems = [
      {
        label: '月租金',
        form: monthMoney !== undefined
        ? Unit.exchangePriceToYuan(monthMoney)
        : '--',
      },
      {
        label: '科目',
        form: `${accountingName}${accountingCode}`,
      },
      {
        label: '提前付款天数',
        form: schedulePrepareDays !== undefined
        ? schedulePrepareDays
        : '--',
      },
      {
        label: '付款周期（月／次）',
        form: periodMonthNum !== undefined
        ? periodMonthNum
        : '--',
      },
      {
        label: '已支付租金金额',
        form: initPaidMoney !== undefined
        ? Unit.exchangePriceToYuan(initPaidMoney)
        : '--',
      },
      {
        label: '已支付租金月数',
        form: initPaidMonthNum !== undefined
        ? initPaidMonthNum
        : '--',
      },
    ];

    // 现存合同录入，显示未分摊金额
    if (migrateFlag === true) {
      formItems.push(
        {
          label: '未分摊金额',
          form: lastAllocationMoney !== undefined
          ? Unit.exchangePriceToYuan(lastAllocationMoney)
          : '--',
        },
      );
    }

    // 未分摊金额大于0，则显示未分摊时间段
    if (migrateFlag === true && lastAllocationMoney > 0) {
      formItems.push(
        {
          label: '未分摊时间段',
          form: allocationStartDate && allocationEndDate
          ? `${moment(String(allocationStartDate)).format('YYYY.MM.DD')}-${moment(String(allocationEndDate)).format('YYYY.MM.DD')}`
          : '--',
        },
      );
    }

    // 未分摊金额为0，则显示已分摊结束时间
    if (migrateFlag === true && !lastAllocationMoney) {
      formItems.push(
        {
          label: '已分摊结束时间',
          form: allocationEndDate
          ? moment(String(allocationEndDate)).format('YYYY.MM.DD')
          : '--',
        },
      );
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

  // 渲染收款信息
  renderReceiptInfo = () => {
    const { houseContractDetail } = this.props;
    const {
      rentPayeeInfo: {
        bank_details: bankDetails,
        card_name: cardName,
        card_num: cardNum,
        id_card_no: rentIdCardNo,
        credit_no: rentCreditNo,
        payment: rentPayment,
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
      {
        label: '收款类型',
        form: PayModeEnumer.description(rentPayment) || '--',
      },
    ];
    if (rentPayment === PayModeEnumer.credit) {
      formItems.push({
        label: '统一信用代码',
        form: rentCreditNo || '--',
      });
    }
    if (rentPayment === PayModeEnumer.idCard) {
      formItems.push({
        label: '身份证号',
        form: rentIdCardNo || '--',
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
      <CoreContent title="租金信息">

        {/* 渲染租金信息 */}
        {this.renderBaseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default Rent;

