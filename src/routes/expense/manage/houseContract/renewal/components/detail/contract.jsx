/**
 * 费用管理 / 房屋管理 / 续租编辑 / 合同信息
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';
import {
  Unit,
} from '../../../../../../../application/define';

class CntractInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 房屋信息
  };

  static defaultProps = {
    detail: {}, // 默认为空
  }

  // 渲染合同信息
  renderContractInfo = () => {
    // 房屋信息
    const { detail = {} } = this.props;

    const {
      id, // 房屋合同id
      migrateFlag, // 合同录入类型
      paymentMethodPledge = '-', // 付款方式：押
      paymentMethodRent = '-', // 付款方式：付
      monthMoney, // 月租金
      pledgeMoney, // 押金
      agentMoney, // 中介费
    } = detail;

    // 付款方式
    const paymentMethod = paymentMethodPledge && paymentMethodRent
      ? `押${paymentMethodPledge}付${paymentMethodRent}`
      : '--';

    const formItems = [
      {
        label: '合同录入方式',
        form: migrateFlag ? '现存执行合同补入' : '新合同',
      },
      {
        label: '付款方式',
        form: paymentMethod,
      },
      {
        label: '月租金',
        form: monthMoney !== undefined
        ? Unit.exchangePriceToYuan(monthMoney)
        : '--',
      },
      {
        label: '押金',
        form: pledgeMoney !== undefined
        ? Unit.exchangePriceToYuan(pledgeMoney)
        : '--',
      },
      {
        label: '中介费',
        form: agentMoney !== undefined
        ? Unit.exchangePriceToYuan(agentMoney)
        : '--',
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

    // 列表扩展
    const titleExt = (
      <a
        key="detail"
        target="_blank"
        rel="noopener noreferrer"
        href={`/#/Expense/Manage/House/Detail?id=${id}`}
      >
        更多详情
      </a>
    );

    return (
      <CoreContent
        title="合同信息"
        titleExt={titleExt}
      >
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderContractInfo();
  }
}

export default CntractInfo;
