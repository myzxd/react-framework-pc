/**
 * 房屋管理/新建(编辑)/租金信息
 */

import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputNumber,
  DatePicker,
  Radio,
  Input,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import ShowSubject from '../common/showSubject';
import Collection from './collection';
import { Unit, PayModeEnumer } from '../../../../../../application/define';
import { isProperIdCardNumber } from '../../../../../../application/utils';

const { RangePicker } = DatePicker;

class Rent extends Component {

  static propTypes = {
    subjectId: PropTypes.string,            // subjectId
    houseContractDetail: PropTypes.object, // 默认数据
    disabled: PropTypes.bool, // 是否禁用
    isCreate: PropTypes.bool, // 是否新建房屋合同
    form: PropTypes.object, // form
    migrateFlag: PropTypes.number, // 合同录入方式（新旧合同）
    isUpdateContract: PropTypes.bool,
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    disabled: false, // 是否禁用
    isCreate: false,
    form: {},
    migrateFlag: 0, // 合同录入方式（新旧合同）
    isUpdateContract: false,
  };

  static getDerivedStateFromProps(prevProps, oriState) {
    const { houseContractDetail: prevData = {} } = prevProps;

    // 编辑页面 初始化收款类型值
    if (is.existy(prevData) && is.not.empty(prevData) && oriState.updateRadioValue) {
      const { rentPayeeInfo = {} } = prevData;
      const { payment = PayModeEnumer.idCard } = rentPayeeInfo;
      return { radioValue: payment };
    }

    const { houseContractDetail = undefined } = oriState;
    if (houseContractDetail !== undefined && Object.keys(prevData).length > 0) {
      const { lastAllocationMoney = 0 } = houseContractDetail;
      return { houseContractDetail: prevData, noApportionMoney: lastAllocationMoney };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],   // 文件列表
      noApportionMoney: 0,
      houseContractDetail: undefined,
      radioValue: PayModeEnumer.idCard,
      updateRadioValue: true, // 初始化收款类型状态为true 代表第一次进来 后面只要操作会设置为false

    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
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

  // 修改月租金
  onChangeMonthMoney = (val) => {
    const { isCreate, form = {} } = this.props;
    // 新建房屋合同时，计算填充押金
    if (isCreate) {
      // form方法
      const { getFieldsValue, setFieldsValue } = form;

      // 月租总金额
      const betting = getFieldsValue(['paymentMethod']).paymentMethod.betting;

      // 月租金有值，计算押金金额：押的月数 * 月租金;否则重置为空
      betting && val
        ? setFieldsValue({ pledgeMoney: betting * val })
        : setFieldsValue({ pledgeMoney: undefined });

      // （月租金为0 && 押数有值） || （月租金有值 && 押数为0）置为0
      if ((betting === 0 && val) || (val === 0 && betting)) {
        setFieldsValue({ pledgeMoney: 0 });
      }
    }
  }

  // 修改付款周期
  onChangePayCycle = (val) => {
    const { form = {} } = this.props;
    // form方法
    const { setFieldsValue, getFieldsValue } = form;

    // 付款方式：押
    const betting = getFieldsValue(['paymentMethod']).paymentMethod.betting;

    // 重置付款方式：付，与付款周期相同
    setFieldsValue({ paymentMethod: { betting, pay: val } });
  }

  // 修改未分摊金额
  onChangeNoApportionMoney = (val) => {
    this.setState({ noApportionMoney: val });
  }

  // 已分摊结束时间限制
  disabledDateDate = (current) => {
    const { getFieldsValue } = this.props.form;
    // 合同租期
    const contractDate = getFieldsValue(['contractDate']).contractDate;

    // 合同租期结束时间
    const endDate = dot.has(contractDate, '1') ? moment(contractDate[1]) : undefined;

    // 合同租期有值，则限制已分摊结束时间
    if (endDate) {
      return current && current > endDate.add(1, 'days');
    }
  }

  // 未分摊时间段限制
  disableDateTime = (current) => {
    const { getFieldsValue } = this.props.form;
    // 合同租期
    const contractDate = getFieldsValue(['contractDate']).contractDate;

    // 合同租期开始时间
    const startDate = dot.has(contractDate, '0') ? moment(contractDate[0]) : undefined;
    // 合同租期结束时间
    const endDate = dot.has(contractDate, '1') ? moment(contractDate[1]).add(1, 'days') : undefined;

    // 合同租期有值，则限制已分摊结束时间
    if (startDate && endDate) {
      return current > endDate || current < startDate;
    }
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

  // 渲染租金信息
  renderBaseInfo = () => {
    const { houseContractDetail = {}, disabled, migrateFlag, form = {}, subjectId, isUpdateContract } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;

    // 未分摊金额
    const { noApportionMoney } = this.state;

    // 合同租期
    const contractDate = getFieldsValue(['contractDate']).contractDate || [];

    // 合同租期是否有值，如果有值，未分摊时间可以选择，否则禁用
    const allocationTimeDisable = contractDate.length === 2 ? false : true;

    // 合同编辑时，未分摊时间禁用
    const timeDisable = disabled === true ? disabled : allocationTimeDisable;

    const {
      monthMoney,
      schedulePrepareDays,
      periodMonthNum,
      initPaidMoney,
      initPaidMonthNum,
      firstRentCycle = [],
      lastAllocationMoney,
      allocationEndDate,
      allocationStartDate,
    } = houseContractDetail;

    // 付款周期是否禁用（合同状态 && 续租周期是否存在）
    const disabledPay = disabled && firstRentCycle.length === 0;

    const isDisable = isUpdateContract === true ? true : disabled;

    const formItems = [
      {
        label: '月租金(元)',
        form: getFieldDecorator('monthMoney', {
          initialValue: is.existy(monthMoney) && is.not.empty(monthMoney) ? Unit.exchangePriceToYuan(monthMoney) : '',
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            max={9999999999}
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            disabled={isUpdateContract}
            onChange={this.onChangeMonthMoney}
          />,
        ),
      },
      {
        label: '科目',
        form: getFieldDecorator('rentAccountingId', {
          initialValue: subjectId,
          rules: [{
            required: true,
            message: '没有科目',
          }],
        })(
          <ShowSubject subjectId={subjectId} />,
        ),
      },
      {
        label: '提前付款天数(天)',
        form: getFieldDecorator('schedulePrepareDays', {
          initialValue: schedulePrepareDays,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            max={9999999999}
            // disabled={disabled}
            disabled={isDisable}
          />,
        ),
      },
      {
        label: '付款周期（月／次）',
        form: getFieldDecorator('periodMonthNum', {
          initialValue: `${periodMonthNum || ''}`,
          rules: [{
            required: true,
            message: '请输入',
          }],
        })(
          <InputNumber
            min={1}
            max={120}
            precision={0}
            disabled={disabledPay}
            onChange={this.onChangePayCycle}
          />,
        ),
      },
      {
        label: '已支付租金金额(元)',
        form: getFieldDecorator('initPaidMoney', {
          initialValue: is.existy(initPaidMoney) && is.not.empty(initPaidMonthNum) ? Unit.exchangePriceToYuan(initPaidMoney) : '',
          rules: [{
            required: false,
          }],
        })(
          <InputNumber
            max={9999999999}
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            // disabled={disabled}
            disabled={isDisable}
          />,
        ),
      },
      {
        label: '已支付租金月数(月)',
        form: getFieldDecorator('initPaidMonthNum', {
          initialValue: initPaidMonthNum,
          rules: [{
            required: false,
          }],
        })(
          <InputNumber
            max={9999999999}
            min={0}
            // disabled={disabled}
            disabled={isDisable}
          />,
        ),
      },
    ];

    // 现存执行合同补入， 新增未分摊字段
    if (migrateFlag === 1) {
      formItems.push(
        {
          label: '未分摊金额(元)',
          form: getFieldDecorator('noApportionMoney', {
            initialValue: is.existy(lastAllocationMoney) && is.not.empty(lastAllocationMoney) ? Unit.exchangePriceToYuan(lastAllocationMoney) : undefined,
            rules: [{
              required: true,
              message: '请填写内容',
            }],
          })(
            <InputNumber
              max={9999999999}
              min={0}
              formatter={Unit.limitDecimals}
              parser={Unit.limitDecimals}
              // disabled={disabled}
              disabled={isDisable}
              onChange={this.onChangeNoApportionMoney}
            />,
          ),
        },
      );
    }
    // 所填未分摊金额大于0，则显示未分摊时间段
    if (migrateFlag === 1 && noApportionMoney > 0) {
      formItems.push(
        {
          label: '未分摊时间段',
          form: getFieldDecorator('noApportionTime', {
            initialValue: allocationEndDate && allocationStartDate ? [moment(String(allocationStartDate)), moment(String(allocationEndDate))] : undefined,
            rules: [{
              required: true,
              message: '请选择',
            }],
          })(
            <RangePicker
              format={'YYYY-MM-DD'}
              disabled={timeDisable}
              disabledDate={this.disableDateTime}
            />,
          ),
        },
      );
    }

    // 否则显示已分摊结束日期
    if (migrateFlag === 1 && !noApportionMoney) {
      formItems.push(
        {
          label: '已分摊结束日期',
          form: getFieldDecorator('noApportionDate', {
            initialValue: is.existy(allocationEndDate) && is.not.empty(allocationEndDate) ? moment(String(allocationEndDate)) : null,
            rules: [{
              required: true,
              message: '请选择',
            }],
          })(
            <DatePicker
              format={'YYYY-MM-DD'}
              disabled={timeDisable}
              disabledDate={this.disabledDateDate}
            />,
          ),
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
    const { form = {}, houseContractDetail = {}, disabled } = this.props;
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

  // 渲染收款类型 对应的item
  renderCorresponding = (forms, isUpdateContract) => {
    const { houseContractDetail = {} } = this.props;

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
          <Input disabled={isUpdateContract} />,
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
          <Input disabled={isUpdateContract} />,
              ),
      };
      forms.push(idNumberForm);
    }
  };

  // 渲染收款类型
  renderPaymentMethodInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { isUpdateContract } = this.props;

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
          <Radio.Group onChange={this.onChangeRadioGroupValue} disabled={isUpdateContract}>
            <Radio value={PayModeEnumer.idCard}>{PayModeEnumer.description(PayModeEnumer.idCard)}</Radio>
            <Radio value={PayModeEnumer.credit}>{PayModeEnumer.description(PayModeEnumer.credit)}</Radio>
          </Radio.Group>,
          ),
      },
    ];
    // 根据收款类型的不同：显示对应的item
    this.renderCorresponding(formItems, isUpdateContract);
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
      <CoreContent title="合同租金信息">

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

