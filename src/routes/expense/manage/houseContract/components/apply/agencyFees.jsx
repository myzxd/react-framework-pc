/**
 * 房屋管理/费用申请/中介费信息
 */

import is from 'is_js';
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
import ShowSubject from '../common/showSubject';
import Collection from '../form/collection';
import { Unit, PayModeEnumer } from '../../../../../../application/define';
import { isProperIdCardNumber } from '../../../../../../application/utils';

const { Option } = CoreSelect;

class AgencyFees extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object,  // 房屋详情数据
    subjectId: PropTypes.string,            // subjectId
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    subjectId: '',
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { houseContractDetail: prevData = {} } = prevProps;

    // 编辑页面 初始化收款类型值
    if (is.existy(prevData) && is.not.empty(prevData) && oriState.updateRadioValue) {
      const { agentPayeeInfo = {} } = prevData;
      const { payment = PayModeEnumer.credit } = agentPayeeInfo;
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

  // 修改是否开票
  onIsOpenTicket = (value) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const afterTax = getFieldValue('agentMoney') * 0.045; // 不开发票的税金

    // 判断是否开票来计算税金
    if (value === '1') {
      setFieldsValue({ agentPayeeTax: 0 });
    } else {
      setFieldsValue({ agentPayeeTax: afterTax });
    }
  }

  // 修改费用金额
  onAgentMoney = (value) => {
    const { setFieldsValue } = this.props.form;
    const afterTax = value * 0.045; // 不开发票的税金
    if (afterTax !== undefined) {
      setFieldsValue({ agentPayeeTax: afterTax });
    }
  }

   // 收款方式切换
  onChangeRadioGroupValue = (e) => {
    const { form = {} } = this.props;
    // 切换到统一信用radio 把身份证号输入框的内容清空
    if (e.target.value === PayModeEnumer.credit) {
      form.setFieldsValue({ mediumIdNumber: undefined });
    }
    // 切换到身份证号radio 把统一信用输入框的内容清空
    if (e.target.value === PayModeEnumer.idCard) {
      form.setFieldsValue({ mediumUnifiedCode: undefined });
    }
    this.setState({ updateRadioValue: false, radioValue: e.target.value });
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

  // 渲染费用信息
  renderExpenseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { houseContractDetail = {}, subjectId } = this.props;
    const {
      agentMoney,
    } = houseContractDetail;
    // 税金
    const afterTax = agentMoney * 0.045;
    const formItems = [
      {
        label: '费用金额(元)',
        form: getFieldDecorator('agentMoney', {
          initialValue: is.existy(agentMoney) && is.not.empty(agentMoney) ? Unit.exchangePriceToYuan(agentMoney) : '',
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            disabled
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onAgentMoney}
          />,
        ),
      },
      {
        label: '是否开票',
        form: getFieldDecorator('agentInvoiceFlag', {
          initialValue: '0',
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <CoreSelect placeholder="请选择" onChange={this.onIsOpenTicket} >
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </CoreSelect>,
        ),
      },
      {
        label: '税金(元)',
        form: getFieldDecorator('agentPayeeTax', {
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
      {
        label: '科目',
        form: getFieldDecorator('agentAccountingId', {
          initialValue: subjectId,
          rules: [{
            required: true,
            message: '没有科目',
          }],
        })(
          <ShowSubject subjectId={subjectId} />,
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
    const { form, houseContractDetail = {}, disabled } = this.props;
    const {
      agentPayeeInfo = {},
    } = houseContractDetail;

    const label = {
      cardNameLabel: '中介费收款人',
    };

    const placeholder = {
      cardNamePlace: '请输入姓名',
      cardNumPlace: '请输入卡号',
      bankNamePlace: '请输入全称',
    };

    const formName = {
      cardNameForm: 'agentPayee',
      cardNumForm: 'agentPayeeAccount',
      bankNameForm: 'agentBankName',
    };

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    const detail = { payeeInfo: agentPayeeInfo };

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
        namespace={'agent'}
      />
    );
  }

  // 渲染收款方式 对应的form
  renderCorresponding = (forms) => {
    const { getFieldDecorator } = this.props.form;
    const { disabled, houseContractDetail = {} } = this.props;
    // 获取中介信息
    const { agentPayeeInfo = {} } = houseContractDetail;
    const detail = { payeeInfo: agentPayeeInfo };

    if (this.state.radioValue === PayModeEnumer.credit) {
      // updateRadioValue为true代表第一次进来,并且详情有值就设置默认值,否则显示空
      const codeInitValue = this.state.updateRadioValue && dot.get(detail, 'payeeInfo.credit_no') ? dot.get(detail, 'payeeInfo.credit_no') : '';
      const UnifiedCodeForm = {
        label: '统一信用代码',
        form: getFieldDecorator('mediumUnifiedCode', {
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
        form: getFieldDecorator('mediumIdNumber', {
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
        form: getFieldDecorator('mediumPayMethod', {
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
      <CoreContent>

        {/* 渲染费用信息 */}
        {this.renderExpenseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

        {/* 渲染收款方式 */}
        {this.renderPaymentMethodInfo()}
      </CoreContent>
    );
  }
}

export default AgencyFees;
