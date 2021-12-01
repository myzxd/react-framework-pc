/**
 * 费用管理 / 房屋管理 / 断租租编辑 / 最近一次付款信息
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';
import {
  Unit,
} from '../../../../../../../application/define';

class PaymentInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 默认数据
  };

  static defaultProps = {
    detail: {}, // 默认为空
  };

  // 渲染最近一次付款信息
  renderPaymentInfo = () => {
    // 房屋详情
    const { detail } = this.props;

    const {
      recentPayInfo = {}, // 最近一次付款信息
      migrateFlag, // 合同录入方式
      lastAllocationMoney, // 未分摊金额
      allocationStartDate, // 未分摊时间段（开始时间）
      allocationEndDate, // 未分摊时间段（结束时间）
      contractStartDate, // 合同开始时间
    } = detail;

    const {
      rent_cycle_start_at: rentCycleStartAt, // 租金期间开始时间
      rent_cycle_end_at: rentCycleEndAt, // 租金期间结束时间
      rent_money: rentMoney, // 房租租金
      tax_money: taxMoney, // 税金
      payee_info: {
        bank_details: bankDetails, // 开户支行
        card_name: cardName, // 房屋收款人
        card_num: cardNum, // 收款账户
      } = {
        bankDetails: '',
        cardName: '',
        cardNum: '',
      },
      invoice_flag: invoiceFlag, // 是否开票
    } = recentPayInfo;

    // 租金期间
    const contractDate = rentCycleStartAt && rentCycleEndAt
      ? `${moment(`${rentCycleStartAt}`).format('YYYY.MM.DD')}-${moment(`${rentCycleEndAt}`).format('YYYY.MM.DD')}`
      : '--';

    // 续签合同租金期间
    const renewDate = lastAllocationMoney > 0
      ? `${moment(`${allocationStartDate}`).format('YYYY.MM.DD')}-${moment(`${allocationEndDate}`).format('YYYY.MM.DD')}`
      : `${moment(`${contractStartDate}`).format('YYYY.MM.DD')}-${moment(`${allocationEndDate}`).format('YYYY.MM.DD')}`;

    // 租金期间
    const rentPeriod = [
      {
        label: '租金期间',
        form: contractDate,
      },
    ];

    // 续签合同付款展示
    const renewPeriod = [
      {
        label: '租金期间',
        form: renewDate,
      },
    ];

    const formItems = [
      {
        label: '房租租金',
        form: rentMoney !== undefined
        ? Unit.exchangePriceToYuan(rentMoney)
        : '--',
      },
      {
        label: '是否开票',
        form: invoiceFlag ? '是' : '否',
      },
      {
        label: '税金',
        form: taxMoney !== undefined
        ? Unit.exchangePriceToYuan(taxMoney)
        : '--',
      },
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
      <CoreContent title="最近一次付款信息">
        {
          migrateFlag
            ?
            (
              <DeprecatedCoreForm
                items={renewPeriod}
                cols={3}
                layout={layout}
              />
            )
            :
            (
              <div>
                <DeprecatedCoreForm
                  items={rentPeriod}
                  cols={3}
                  layout={layout}
                />
                <DeprecatedCoreForm
                  items={formItems}
                  cols={3}
                  layout={layout}
                />
              </div>
            )
        }
      </CoreContent>
    );
  }

  render = () => {
    return this.renderPaymentInfo();
  }
}

export default PaymentInfo;
