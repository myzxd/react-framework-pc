/**
 * 房屋管理/新建(编辑)/中介费信息
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
} from '../../../../../../components/core';
import ShowSubject from '../common/showSubject';
import Collection from './collection';
import { Unit, PayModeEnumer } from '../../../../../../application/define';
import { isProperIdCardNumber } from '../../../../../../application/utils';


class AgencyFees extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object,  // 房屋详情数据
    subjectId: PropTypes.string,            // subjectId
    disabled: PropTypes.bool, // 是否禁用
    isUpdateContract: PropTypes.bool,

  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    disabled: false, // 是否禁用
    isUpdateContract: false,

  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { houseContractDetail: prevData = {} } = prevProps;

    // 编辑页面 初始化收款类型值
    if (is.existy(prevData) && is.not.empty(prevData) && oriState.updateRadioValue) {
      const { agentPayeeInfo = {} } = prevData;
      const { payment = PayModeEnumer.idCard } = agentPayeeInfo;
      return { radioValue: payment };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      radioValue: PayModeEnumer.idCard,
      updateRadioValue: true, // 初始化收款类型状态为true 代表第一次进来 后面只要操作会设置为false
    };
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
    const { houseContractDetail = {}, subjectId, disabled } = this.props;
    const {
      agentMoney,
      // agentInvoiceFlag,
    } = houseContractDetail;
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
            max={9999999999}
            disabled={disabled}
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

  // 渲染收款方式 对应的form
  renderCorresponding = (forms, isUpdateContract) => {
    const { getFieldDecorator } = this.props.form;
    const { houseContractDetail = {} } = this.props;
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
        form: getFieldDecorator('mediumIdNumber', {
          initialValue: idCardInitValue,
          rules: [{ required: true, validator: this.validatorIdentityCardId }],
        })(
          <Input disabled={isUpdateContract} />,
              ),
      };
      forms.push(idNumberForm);
    }
  };

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

  // 渲染收款方式
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
        form: getFieldDecorator('mediumPayMethod', {
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
      <CoreContent title="合同中介费信息">

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
