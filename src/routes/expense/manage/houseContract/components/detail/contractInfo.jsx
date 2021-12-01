/**
 * 房屋管理/房屋详情/合同信息
 */

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';

class ContractInfo extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
  }

  // 渲染首行信息
  renderFirstLineInfo = () => {
    const { houseContractDetail = {} } = this.props;
    const {
      migrateFlag,
      migrateOaNote,
    } = houseContractDetail;
    const formItems = [
      {
        label: '合同录入类型',
        form: migrateFlag ? '现存执行合同补入' : '新合同',
      },
      {
        label: '原OA审批单号',
        form: migrateOaNote || '--',
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

  // 渲染房屋基本信息
  renderBaseInfo = () => {
    const { houseContractDetail = {} } = this.props;
    const {
      contractStartDate,
      contractEndDate,
      paymentMethodRent = 0,
      paymentMethodPledge = 0,
    } = houseContractDetail;

    // 后端返回int类型，需要处理时间
    // 合同租期开始时间
    const startTime = contractStartDate
      ? moment(String(contractStartDate)).format('YYYY-MM-DD')
      : '';
    // 合同租期结束时间
    const endTime = contractEndDate
      ? moment(String(contractEndDate)).format('YYYY-MM-DD')
      : '';

    // 合同租期（拼接字符串）
    const contractDate = startTime && endTime
      ? `${startTime}-${endTime}`
      : '--';

    const formItems = [
      {
        label: '合同租期',
        form: contractDate,
      },
      {
        label: '付款方式',
        form: `押${paymentMethodPledge}付${paymentMethodRent}` || '--',
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
      <div>
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
      </div>
    );
  }

  render = () => {
    return (
      <CoreContent title="合同信息">
        {/* 渲染首行 */}
        {this.renderFirstLineInfo()}

        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}
      </CoreContent>
    );
  }
}

export default ContractInfo;
