/**
 * 费用管理 / 房屋管理 / 续租编辑 / 续租信息
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputNumber,
  Select,
} from 'antd';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';
import DateRange from './datePicker';

import { Unit } from '../../../../../../../application/define';
import style from '../../style.css';

const { Option } = Select;

// 开发票
const InvoiceFlag = {
  sure: 1, // 是
  negative: 0, // 否
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.sure: return '是';
      case this.negative: return '否';
      default: return '未定义';
    }
  },
};

class RenewalInfo extends Component {
  static propTypes = {
    detail: PropTypes.object, // 默认数据
    form: PropTypes.object, // form
  };

  static defaultProps = {
    detail: {}, // 默认为空
    form: {},
  };

  // 租金期间自定义校验
  onVerify = (rule, value, callback) => {
    const {
      startValue,
      endValue,
    } = value;
    if (startValue && endValue) {
      callback();
      return;
    }
    callback('请选择');
  }

  // 修改房租租金
  onChangeRentMoney = (val) => {
    const { form } = this.props;
    const {
      getFieldsValue,
      setFieldsValue,
    } = form;

    // 是否开发票
    const invoiceFlag = getFieldsValue(['rentInvoiceFlag']).rentInvoiceFlag;

    // 开发票为否时，计算税金
    if (invoiceFlag === InvoiceFlag.negative) {
      setFieldsValue({
        tax: val * 0.045,
      });
    }
  }

  // 修改是否开发票
  onChangeRentInvoiceFlag = (val) => {
    const { form } = this.props;

    const {
      getFieldsValue,
      setFieldsValue,
    } = form;

    // 房租租金
    const rentMoney = getFieldsValue(['rentMoney']).rentMoney;

    // 开发票为是时，重置税金为0
    if (val === InvoiceFlag.sure) {
      setFieldsValue({
        tax: 0,
      });
    }

    // 开发票为否时，计算税金
    if (val === InvoiceFlag.negative) {
      setFieldsValue({
        tax: rentMoney * 0.045,
      });
    }
  }

  // 计算待付房租
  onCalculatingRent = () => {
    const { getFieldValue } = this.props.form;
    // 房屋租金
    const rentMoney = getFieldValue('rentMoney');
    // 税金
    const tax = getFieldValue('tax');
    const sum = rentMoney + Number(tax.toFixed(2));
    // 押金转租金
    const depositRent = getFieldValue('depositRent');
    // 税金
    if (is.empty(rentMoney) || is.not.existy(rentMoney)
      || is.empty(tax) || is.not.existy(tax)
      || is.empty(depositRent) || is.not.existy(depositRent)) {
      return 0;
    }
    const num = Number(sum - depositRent).toFixed(2);
    return num < 0 ? 0 : num;
  }

  // 租金期间-开始时间限制
  disabledEndDate = (val) => {
    // 房屋详情
    const { detail } = this.props;

    const {
      contractEndDate, // 合同租期结束时间
      firstRentCycle,  // 续租期间
    } = detail;

    if (!val) {
      return false;
    }

    // 续租周期开始时间 - 合同租期结束时间
    return val < moment(`${firstRentCycle[0]}`) || val > moment(String(contractEndDate));
  }

  // 渲染续租信息
  renderPaymentInfo = () => {
    // 房屋详情
    const { detail, form } = this.props;

    // 数据为空，返回null
    if (Object.keys(detail).length === 0) return null;

    const {
      getFieldDecorator,
      getFieldsValue,
      getFieldValue,
    } = form;

    const {
      rentPayeeInfo: {
        bank_details, // 开户支行
        card_name, // 房租收款人
        card_num, // 收款账户
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
      monthMoney, // 租金
      periodMonthNum, // 租房月数
      firstRentCycle, // 续租期间
      contractEndDate, // 合同租期结束时间
      unrefundedPledgeMoney, // 未退押金
    } = detail;

    // 请款金额
    const rentMoney = monthMoney * periodMonthNum;

    // 是否开发票
    const invoiceFlag = InvoiceFlag.negative;

    // 税金（开发票为是，则为0.为否计算税金）
    const taxMoney = invoiceFlag === InvoiceFlag.sure ? 0 : rentMoney * 0.045;

    // 租金期间
    const contractDate = getFieldsValue(['contractTime']).contractTime;

    // 天数
    let days = 0;
    // 初始化表单未渲染，天数为续租周期期间天数
    if (contractDate === undefined) {
      days = moment(`${firstRentCycle[1]}`, 'YYYYMMDD').diff(moment(`${firstRentCycle[0]}`, 'YYYYMMDD'), 'days') + 1;
    }
    // 更改租金期间，计算天数
    if (contractDate && contractDate.startValue && contractDate.endValue) {
      days = contractDate.endValue.diff(contractDate.startValue, 'days') + 1;
    }

    // 租金期间props
    const rentPeriodProps = {
      form,
      disabledEndDate: this.disabledEndDate,
      disabledStart: true,
      detail,
    };

    // 租金期间
    const rentPeriod = [
      {
        label: '租金期间',
        form: getFieldDecorator('contractTime', {
          initialValue: { startValue: moment(`${firstRentCycle[0]}`), endValue: moment(`${firstRentCycle[1]}`) },
          rules: [{
            required: true,
            message: '请选择',
            validator: this.onVerify,
          }],
        })(
          <DateRange
            {...rentPeriodProps}
          />,
        ),
      },
      {
        label: '总天数',
        form: days,
      },
    ];
    const formItems = [
      {
        label: '房租租金',
        form: getFieldDecorator('rentMoney', {
          initialValue: Unit.exchangePriceToYuan(rentMoney),
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeRentMoney}
          />,
        ),
      },
      {
        label: '是否开票',
        form: getFieldDecorator('rentInvoiceFlag', {
          initialValue: invoiceFlag,
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <Select
            placeholder="请选择"
            onChange={this.onChangeRentInvoiceFlag}
            className={style['app-comp-expense-manage-house-renewalInfo-rentInvoiceFlag']}
          >
            <Option
              value={InvoiceFlag.sure}
              key={InvoiceFlag.sure}
            >
              {InvoiceFlag.description(InvoiceFlag.sure)}
            </Option>
            <Option
              value={InvoiceFlag.negative}
              key={InvoiceFlag.negative}
            >
              {InvoiceFlag.description(InvoiceFlag.negative)}
            </Option>
          </Select>,
        ),
      },
      {
        label: '税金',
        form: getFieldDecorator('tax', {
          initialValue: Unit.exchangePriceToYuan(taxMoney),
        })(
          <InputNumber
            min={0}
            disabled
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '科目',
        form: `${accountingName}${accountingCode}`,
      },
    ];
    const fromItemsRent = [
      {
        label: '押金转租金',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('depositRent', {
          initialValue: Unit.exchangePriceToYuan(unrefundedPledgeMoney),
        })(
          <InputNumber
            min={0}
            max={Unit.exchangePriceToYuan(unrefundedPledgeMoney)}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '待付房租',
        form: <span>{this.onCalculatingRent()}</span>,
      },
    ];
    const rentEndDate = moment(`${contractEndDate}`);
    const contractEndTime = getFieldValue('contractTime').endValue;
    // 判断合同最后一天和租金期间结束日期是否相等
    if (contractEndTime.valueOf() === rentEndDate.valueOf()) {
      formItems.push(...fromItemsRent);
    }

    // 收款信息
    const receiptInfo = [
      {
        label: '房租收款人',
        form: getFieldDecorator('rentPayeeName', {
          initialValue: card_name,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入姓名"
          />,
        ),
      },
      {
        label: '收款账号',
        form: getFieldDecorator('rentPayeeNum', {
          initialValue: card_num,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入卡号"
          />,
        ),
      },
      {
        label: '开户支行',
        form: getFieldDecorator('rentPayeeBankDetails', {
          initialValue: bank_details,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入全称"
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
      <CoreContent title="续租信息">
        <DeprecatedCoreForm
          items={rentPeriod}
          cols={2}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={receiptInfo}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderPaymentInfo();
  }
}

export default RenewalInfo;
