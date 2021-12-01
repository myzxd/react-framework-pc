/**
 * 费用管理 / 房屋管理 / 退租编辑 / 中介费信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Unit } from '../../../../../../../application/define/';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';

class AgencyFeeInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    detail: {}, // 默认为空
  }

  // 渲染费用信息
  renderContent = () => {
    // 房屋详情
    const { detail = {} } = this.props;

    const {
      agentMoney, // 中介费金额
      agentAccountingInfo: { // 中介费科目信息
        name: accountingName, // 科目name
        accountingCode, // 科目id
      } = {
        name: '',
        accountingCode: '',
      },
      agentPayeeInfo: {
        bank_details: bankDetails, // 开户支行
        card_name: cardName, // 中介费收款人
        card_num: cardNum, // 收款账号
      } = {
        bank_details: '',
        card_name: '',
        card_num: '',
      },
    } = detail;

    // 金额信息
    const moneyForm = [
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

    // 收款人信息
    const receiptForm = [
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
      <CoreContent title="中介费信息">
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
    return this.renderContent();
  }
}

export default AgencyFeeInfo;
