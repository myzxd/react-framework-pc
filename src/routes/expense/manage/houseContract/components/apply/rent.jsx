/**
 * 房屋管理/费用申请/租金信息
 */

import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';

import {
  InputNumber,
  Radio,
  Input,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreSelect,
} from '../../../../../../components/core';
import { Unit, PayModeEnumer } from '../../../../../../application/define';
import DateRanger from './datePicker';
import Collection from '../form/collection';
import { isProperIdCardNumber } from '../../../../../../application/utils';

const { Option } = CoreSelect;

class Rent extends Component {


  static propTypes = {
    houseContractDetail: PropTypes.object, // 默认数据
    form: PropTypes.object, // form
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    isCreate: false,
    form: {},
  };

  static getDerivedStateFromProps(prevProps, oriState) {
    const { houseContractDetail: prevData = {} } = prevProps;

    // 编辑页面 初始化收款类型值
    if (is.existy(prevData) && is.not.empty(prevData) && oriState.updateRadioValue) {
      const { rentPayeeInfo = {} } = prevData;
      const { payment = PayModeEnumer.credit } = rentPayeeInfo;
      return { radioValue: payment };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      radioValue: PayModeEnumer.credit,
      updateRadioValue: true, // 初始化收款类型状态为true 代表第一次进来 后面只要操作会设置为false
    };
  }

  // 更改房屋金额
  onHouseMoney = (value) => {
    const { setFieldsValue } = this.props.form;
    const afterTax = value * 0.045; // 不开发票的税金
    if (afterTax !== undefined) {
      setFieldsValue({ rentTax: afterTax });
    }
  }

  // 修改是否开票
  onIsOpenTicket = (value) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const afterTax = getFieldValue('houseMoney') * 0.045; // 不开发票的税金

    // 判断是否开票来计算税金
    if (value === '1') {
      setFieldsValue({ rentTax: 0 });
    } else {
      setFieldsValue({ rentTax: afterTax });
    }
  }

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

  // 收款类型切换
  onChangeRadioGroupValue = (e) => {
    const { form = {} } = this.props;
    // 切换到统一信用radio 把身份证号输入框的内容清空
    if (e.target.value === PayModeEnumer.credit) {
      form.setFieldsValue({ idNumber: undefined });
    }
    // 切换到身份证号radio 把统一信用输入框的内容清空
    if (e.target.value === PayModeEnumer.idCard) {
      form.setFieldsValue({ UnifiedCode: undefined });
    }
    this.setState({ updateRadioValue: false, radioValue: e.target.value });
  };

  // 租金期间-开始时间限制
  disabledEndDate = (val) => {
    // 房屋详情
    const { houseContractDetail } = this.props;

    const {
      contractEndDate, // 合同结束日期
      firstRentCycle, // 租金期间
    } = houseContractDetail;

    if (!val) {
      return false;
    }

    // 续租周期开始时间 - 合同租期结束时间
    return val < moment(`${firstRentCycle[0]}`) || val > moment(`${contractEndDate}`);
  }


   // 证件号码校验
  validatorIdentityCardId = (_, value, callback) => {
    if (!value) {
      return callback('请输入证件号码');
    }

    if (!isProperIdCardNumber(value)) {
      return callback('请输入正确的身份证号');
    }

    callback();
  };

   // 证件号码校验
  validatorIdentityCardId = (_, value, callback) => {
    if (!value) {
      return callback('请输入证件号码');
    }

    if (!isProperIdCardNumber(value)) {
      return callback('请输入正确的身份证号');
    }

    callback();
  };
  // 渲染租金日期
  renderDateInfo = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { houseContractDetail } = this.props;
    const {
      firstRentCycle,
    } = houseContractDetail;

    let startDate = ''; // 开始时间
    let endDate = '';  // 结束时间
    let day = '';      // 总天数

    // 续签新合同不继承寄合同的合同租期
    if (is.not.empty(firstRentCycle) && is.existy(firstRentCycle)) {
      startDate = moment(String(firstRentCycle[0]), 'YYYY-MM-DD');
      endDate = moment(String(firstRentCycle[1]), 'YYYY-MM-DD');
      day = moment(`${firstRentCycle[1]}`, 'YYYYMMDD').diff(moment(`${firstRentCycle[0]}`, 'YYYYMMDD'), 'day') + 1;
    }

    // 租金期间
    const rentDate = getFieldsValue(['rentDate']).rentDate;

    // 更改租金期间，计算天数
    if (rentDate && rentDate.startValue && rentDate.endValue) {
      day = rentDate.endValue.diff(rentDate.startValue, 'day') + 1;
    }

    // 租金期间props
    const rentPeriodProps = {
      form,
      disabledEndDate: this.disabledEndDate,
      disabledStart: true,
      detail: houseContractDetail,
    };

    const formItems = [
      {
        label: '租金期间',
        form: getFieldDecorator('rentDate', {
          initialValue: { startValue: startDate, endValue: endDate },
          rules: [{
            required: true,
            message: '请选择',
            validator: this.onVerify,
          }],
        })(
          <DateRanger {...rentPeriodProps} />,
        ),
      },
      {
        label: '总天数',
        form: getFieldDecorator('totalDay', {
          initialValue: day,
        })(
          <span>{day}</span>,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={2}
        layout={layout}
      />
    );
  }
  // 渲染租金信息
  renderBaseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { houseContractDetail } = this.props;

    const {
      monthMoney,
      paymentMethodRent,
    } = houseContractDetail;
    // 计算房屋租金
    const houseMoney = monthMoney * paymentMethodRent;
    // 税金
    const afterTax = houseMoney * 0.045;
    const formItems = [
      {
        label: '房屋租金(元)',
        form: getFieldDecorator('houseMoney', {
          initialValue: Unit.exchangePriceToYuan(houseMoney),
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onHouseMoney}
          />,
        ),
      },
      {
        label: '是否开票',
        form: getFieldDecorator('rentInvoiceFlag', {
          initialValue: '0',
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <CoreSelect placeholder="请选择" onChange={this.onIsOpenTicket}>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </CoreSelect>,
        ),
      },
      {
        label: '税金(元)',
        form: getFieldDecorator('rentTax', {
          initialValue: Unit.exchangePriceToYuan(afterTax),
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            disabled
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
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

  // 渲染收款信息
  renderReceiptInfo = () => {
    const { form, houseContractDetail, disabled } = this.props;
    const {
      rentPayeeInfo = {},
    } = houseContractDetail;

    const label = {
      cardNameLabel: '房租收款人',
    };

    const placeholder = {
      cardNamePlace: '请输入姓名',
      cardNumPlace: '请输入卡号',
      bankNamePlace: '请输入全称',
    };

    const formName = {
      cardNameForm: 'rentPayee',
      cardNumForm: 'rentPayeeAccount',
      bankNameForm: 'rentBankName',
    };

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    const detail = { payeeInfo: rentPayeeInfo };

    return (
      <Collection
        form={form}
        disabled={disabled}
        detail={detail}
        label={label}
        placeholder={placeholder}
        formName={formName}
        isHouse
        layout={layout}
        namespace={'rent'}
      />
    );
  }

  // 渲染收款方式 对应的form
  renderCorresponding = (forms) => {
    const { houseContractDetail = {}, disabled } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 获取租金信息
    const { rentPayeeInfo = {} } = houseContractDetail;
    const detail = { payeeInfo: rentPayeeInfo };

    if (this.state.radioValue === PayModeEnumer.credit) {
      // updateRadioValue为true代表第一次进来,并且详情有值就设置默认值,否则显示空
      const codeInitValue = this.state.updateRadioValue && dot.get(detail, 'payeeInfo.credit_no') ? dot.get(detail, 'payeeInfo.credit_no') : '';

      const UnifiedCodeForm = {
        label: '统一信用代码',
        form: getFieldDecorator('UnifiedCode', {
          initialValue: codeInitValue,
        })(
          <Input disabled={disabled} />,
            ),
      };
      forms.push(UnifiedCodeForm);
    }

    if (this.state.radioValue === PayModeEnumer.idCard) {
      // updateRadioValue为true代表第一次进来,并且详情有值就设置默认值,否则显示空
      const idCardInitValue = this.state.updateRadioValue && dot.get(detail, 'payeeInfo.id_card_no') ? dot.get(detail, 'payeeInfo.id_card_no') : '';
      const idNumberForm = {
        label: '身份证号',
        form: getFieldDecorator('idNumber', {
          initialValue: idCardInitValue,
          rules: [{ required: true, validator: this.validatorIdentityCardId }],
        })(
          <Input disabled={disabled} />,
              ),
      };
      forms.push(idNumberForm);
    }
  };

  // 渲染收款方式
  renderPaymentMethodInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { disabled } = this.props;
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const formItems = [
      {
        label: '收款类型',
        form: getFieldDecorator('payMethod', {
          initialValue: this.state.radioValue,
          rules: [{ required: true, message: '请选择收款类型' }],
        })(
          <Radio.Group onChange={this.onChangeRadioGroupValue} disabled={disabled}>
            <Radio value={PayModeEnumer.idCard}>{PayModeEnumer.description(PayModeEnumer.idCard)}</Radio>
            <Radio value={PayModeEnumer.credit}>{PayModeEnumer.description(PayModeEnumer.credit)}</Radio>
          </Radio.Group>,
          ),
      },
    ];
    // 根据收款类型的不同：显示对应的item
    this.renderCorresponding(formItems);
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
      <CoreContent >

        {/* 渲染租金时间 */}
        {this.renderDateInfo()}

        {/* 渲染租金信息 */}
        {this.renderBaseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}
        {/* 渲染收款方式 */}
        {this.renderPaymentMethodInfo()}
      </CoreContent>
    );
  }
}

export default Rent;

