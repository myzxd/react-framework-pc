/**
 * 费用管理 / 房屋管理 / 续签编辑 / 续签合同信息
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
} from '../../../../../../../components/core/';
import CustomizeRenew from '../../../components/common/customizeRenew'; // 付款方式

const { Group: RadioGroup } = Radio;
const { RangePicker } = DatePicker;

class RenewContract extends Component {

  static propTypes = {
    onChangeMigrateFlag: PropTypes.func, // 改变存量合同模式
    detail: PropTypes.object,  // 房屋详情数据
    form: PropTypes.object,
  };

  static defaultProps = {
    form: {},
    detail: {}, // 默认为空
  }

  // 存量合同模式改变
  onChangeMigrateFlagR = (e) => {
    const { onChangeMigrateFlag } = this.props;
    if (onChangeMigrateFlag) {
      onChangeMigrateFlag(e.target.value);
    }
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

  // 渲染表单
  renderContent = () => {
    const {
      form,
      detail = {}, // 房屋详情
    } = this.props;

    const { getFieldDecorator } = form;

    const {
      migrateFlag, // 合同录入方式
      migrateOaNote, // 原OA审批单号
      paymentMethodPledge, // 付款方式：押
      paymentMethodRent, // 付款方式：付
    } = detail;

    // 合同信息
    const contractForm = [
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
            onChange={this.onChangeMigrateFlagR}
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
          <Input />,
        ),
      },
    ];

    // 付款方式
    const paymentMethodForm = [
      {
        label: '付款方式',
        form: getFieldDecorator('paymentMethod', {
          initialValue: { betting: paymentMethodPledge, pay: paymentMethodRent },
          rules: [{ required: true, validator: this.onVerify }],
        })(
          <CustomizeRenew
            form={form}
          />,
        ),
      },
      {
        label: '合同租期',
        form: getFieldDecorator('contractDate', {
          initialValue: null,
          rules: [{
            required: true,
            validator: this.onCheckContractDate,
          }],
        })(
          <RangePicker
            disabledDate={this.disabledDate}
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
      <CoreContent title="续签合同信息">
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
    return this.renderContent();
  }
}

export default RenewContract;
