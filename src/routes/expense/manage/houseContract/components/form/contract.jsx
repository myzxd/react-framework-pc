/**
 * 房屋管理/新建(编辑)/合同信息
 */

import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Input,
  DatePicker,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import CustomizeRenew from './customizeRenew';
import { ExpenseHouseContractState } from '../../../../../../application/define';

const { Group: RadioGroup } = Radio;
const { RangePicker } = DatePicker;

class Contract extends Component {

  static propTypes = {
    onChangeMigrateFlag: PropTypes.func, // 改变存量合同模式
    houseContractDetail: PropTypes.object,  // 房屋详情数据
    disabled: PropTypes.bool, // 是否禁用
    isCreate: PropTypes.bool,
    form: PropTypes.object,
  };

  static defaultProps = {
    form: {},
    houseContractDetail: {}, // 默认为空
    isCreate: false,
    disabled: false,
    onChangeMigrateFlag: () => {},
  }

  // 存量合同模式改变
  onChangeMigrateFlag = (e) => {
    const { onChangeMigrateFlag } = this.props;
    onChangeMigrateFlag && onChangeMigrateFlag(e.target.value);
  }

  // 合同日期校验 => 不能为同一天
  onCheckContractDate = (rule, value, callback) => {
    if (is.not.existy(value) || is.empty(value)) {
      callback('请选择日期');
      return;
    }
    const startDate = moment(value[0]).format('YYYYMMDD');
    const endDate = moment(value[1]).format('YYYYMMDD');
    if (startDate && endDate && startDate === endDate) {
      callback('合同开始时间和结束时间不能是同一天！！！');
      return;
    }
    callback();
  }

  // 自定义表单校验
  onVerify = (rule, value, callback) => {
    if (value.pay && (value.betting === 0 || value.betting)) {
      callback();
      return;
    }
    callback('请选择');
  }

  // 续签合同租期限制
  disabledDate = (val) => {
    const { houseContractDetail = {} } = this.props;

    const {
      fromContractInfo = {}, // 历史合同信息
    } = houseContractDetail;

    const {
      contract_end_date: contractEndDate, // 历史合同结束日期
    } = fromContractInfo;

    if (!val) {
      return false;
    }
    return val && val < moment(`${contractEndDate}`).add(1, 'days');
  }

  // 渲染首行信息
  renderFirstLineInfo = () => {
    const { houseContractDetail = {}, disabled, form = {} } = this.props;
    const { getFieldDecorator } = form;

    // 历史合同信息
    const { fromContractId, migrateFlag, migrateOaNote } = houseContractDetail;

    // 历史合同存在，是续签合同，不显示
    if (fromContractId) {
      return null;
    }

    const formItems = [
      {
        label: '合同录入类型',
        form: getFieldDecorator('migrateFlag', {
          initialValue: migrateFlag ? 1 : 0,
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <RadioGroup
            onChange={this.onChangeMigrateFlag}
            disabled={disabled}
          >
            <Radio value={1}>现存执行合同补入</Radio>
            <Radio value={0}>新合同</Radio>
          </RadioGroup>,
        ),
      },
      {
        label: '原OA审批单号',
        form: getFieldDecorator('migrateOaNote', {
          initialValue: migrateOaNote,
          rules: [{
            required: false,
          }],
        })(
          <Input disabled={disabled} />,
        ),
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
    const { form = {}, isCreate, houseContractDetail = {}, disabled, isCreateRenew } = this.props;
    const { getFieldDecorator } = form;
    const {
      contractStartDate,
      contractEndDate,
      fromContractId, // 历史合同id
      state,
      paymentMethodPledge = undefined,
      paymentMethodRent = undefined,
      firstRentCycle = [],
    } = houseContractDetail;
    let contractDate = [];

    // 续签新合同不继承寄合同的合同租期
    if (contractStartDate && !isCreateRenew) {
      contractDate.push(moment(String(contractStartDate), 'YYYY-MM-DD'));
    }
    // 续签新合同不继承寄合同的合同租期
    if (contractEndDate && !isCreateRenew) {
      contractDate.push(moment(String(contractEndDate), 'YYYY-MM-DD'));
    }

    if (fromContractId && state === ExpenseHouseContractState.pendding) {
      contractDate = [];
    }
    const formItems = [
      {
        label: '合同租期',
        form: getFieldDecorator('contractDate', {
          initialValue: contractDate,
          rules: [{
            required: true,
            validator: this.onCheckContractDate,
          }],
        })(
          <RangePicker
            disabled={disabled}
            disabledDate={fromContractId ? this.disabledDate : null}
          />,
        ),
      },
      {
        label: '付款方式',
        form: getFieldDecorator('paymentMethod', {
          initialValue: { betting: paymentMethodPledge, pay: paymentMethodRent },
          rules: [{ required: true, validator: this.onVerify }],
        })(
          <CustomizeRenew
            form={form}
            isCreate={isCreate}
            disabled={disabled}
            firstRentCycle={firstRentCycle}
          />,
        ),
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
    // 是否是续签合同
    const { isCreateRenew } = this.props;
    // 列表title
    const title = isCreateRenew ? '续签合同信息' : '合同信息';

    return (
      <CoreContent title={title}>

        {/* 渲染收款信息 */}
        {isCreateRenew ? null : this.renderFirstLineInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default Contract;
