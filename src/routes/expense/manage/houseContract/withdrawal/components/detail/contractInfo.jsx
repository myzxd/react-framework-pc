/**
 * 房屋管理 / 房屋详情 / 退租编辑 / 合同信息
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';


class ContractInfo extends Component {

  static propTypes = {
    detail: PropTypes.object,  // 房屋详情数据
  };

  static defaultProps = {
    detail: {},
  }

  // 渲染合同信息
  renderContractInfo = () => {
    const {
      detail = {},
    } = this.props;
    const {
      migrateFlag, // 合同录入类型
      paymentMethodPledge, // 付款方式：押
      paymentMethodRent, // 付款方式：付
      migrateOaNote, // 原OA审批单号
    } = detail;

    // 付款方式
    const paymentMethod = paymentMethodRent && paymentMethodPledge
      ? `押${paymentMethodPledge}付${paymentMethodRent}`
      : '--';

    // 原合同信息
    const contractForm = [
      {
        label: '合同录入类型',
        form: migrateFlag ? '现存执行合同补入' : '新合同',
      },
      {
        label: '原OA审批单号',
        form: migrateOaNote || '--',
      },
    ];

    // 付款方式
    const paymentMethodForm = [
      {
        label: '付款方式',
        form: paymentMethod,
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
      <CoreContent title="合同信息">
        <DeprecatedCoreForm
          items={contractForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={paymentMethodForm}
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

export default ContractInfo;
