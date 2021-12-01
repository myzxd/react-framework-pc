/**
 * 银行卡信息(创建)(废弃)
 */
import { connect } from 'dva';
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Radio, Button, message } from 'antd';

// import CorePhotos from '../components/corePhotos';
import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../components/core';
import { EmployeeCollectionType, FileType } from '../../../../../../application/define';
import Utils from '../../../../../../application/utils';
import { CommonSelectRegionalName } from '../../../../../../components/common';

import style from './style.css';

class BankInfo extends Component {
  static propTypes = {
    form: PropTypes.object, // 父组件表单form
    fileType: PropTypes.string,
  }

  static defaultProps = {
    form: {},               // 父组件表单form
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowBankInfo: true,  // 是否显示银行卡信息
      collectionType: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { form } = this.props;
    const collectionType = form.getFieldValue('collection');
    const { employeeDetail } = this.props;
    const address = dot.get(employeeDetail, 'bank_location', []); // 获取省市数据
    const initDeparture = {}; // 存储省市
    if (is.existy(address) && is.not.empty(address)) {
      initDeparture.province = address[0]; // 省
      initDeparture.city = address[1];     // 市
    }

    // 获取持卡人姓名
    const holderName = dot.get(employeeDetail, 'bank_info.card_holder_name');

    // 代收协议
    const agreementKeys = dot.get(employeeDetail, 'bank_info.collect_protocol', undefined);
    const agreementUrls = dot.get(employeeDetail, 'bank_info.collect_protocol_url', undefined);
    const agreement = !agreementKeys || is.empty(agreementKeys) || !agreementUrls || is.empty(agreementUrls) ? undefined : { keys: agreementKeys, urls: agreementUrls };

    // 代收证明
    const proveKeys = dot.get(employeeDetail, 'bank_info.collect_provement', undefined);
    const proveUrls = dot.get(employeeDetail, 'bank_info.collect_provement_url', undefined);
    const prove = !proveKeys || is.empty(proveKeys) || !proveUrls || is.empty(proveUrls) ? undefined : { keys: proveKeys, urls: proveUrls };

    if (this.state.collectionType !== collectionType) {
      if (prevState.collectionType !== null) {
        // 本人银行卡
        if (collectionType === EmployeeCollectionType.personal && collectionType === dot.get(employeeDetail, 'bank_info.payment_type')) {
          form.setFieldsValue({
            meAccount: dot.get(employeeDetail, 'bank_info.card_holder_bank_card_no'),
            meBankName: dot.get(employeeDetail, 'bank_info.bank_branch'),
            meBranch: dot.get(employeeDetail, 'bank_info.bank_branch_name'),
            meAddress: initDeparture,
            meCardholder: holderName,
            meBankPositive: { keys: [dot.get(employeeDetail, 'bank_info.bank_card_front')], urls: [dot.get(employeeDetail, 'bank_info.bank_card_front_url')] },

            otherCardholder: undefined,
            otherCollectingGender: undefined,
            otherIdentity: undefined,
            otherAccount: undefined,
            otherBankName: undefined,
            otherBranch: undefined,
            otherAddress: undefined,
            otherAgreement: undefined,
            otherProve: undefined,
            otherBankPositive: undefined,
          });
          // 他人代收
        } else if (collectionType === EmployeeCollectionType.collecting && collectionType === dot.get(employeeDetail, 'bank_info.payment_type')) {
          form.setFieldsValue({
            meAccount: undefined,
            meBankName: undefined,
            meBranch: undefined,
            meAddress: undefined,
            meCardholder: undefined,
            meBankPositive: {},

            otherCardholder: holderName,
            otherCollectingGender: dot.get(employeeDetail, 'bank_info.collect_sex', undefined),
            otherCollectingPhone: dot.get(employeeDetail, 'bank_info.collect_phone', undefined),
            otherIdentity: dot.get(employeeDetail, 'bank_info.collect_id_card_no', undefined),
            otherAccount: dot.get(employeeDetail, 'bank_info.card_holder_bank_card_no'),
            otherBankName: dot.get(employeeDetail, 'bank_info.bank_branch'),
            otherBranch: dot.get(employeeDetail, 'bank_info.bank_branch_name'),
            otherAddress: initDeparture,
            otherBankPositive: { keys: [dot.get(employeeDetail, 'bank_info.bank_card_front')], urls: [dot.get(employeeDetail, 'bank_info.bank_card_front_url')] },
            otherAgreement: agreement,
            otherProve: prove,
          });
        } else {
          form.setFieldsValue();
        }
      }
      // eslint-disable-next-line
      this.setState({ collectionType });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'employeeManage/resetBankCardIdentification', payload: {} });
  }

  // 识别银行卡成功的回调函数
  onIdentifySuccess = (res) => {
    const { form } = this.props;
    message.success('识别成功');
    this.setState({
      isShowBankInfo: false,
    });

    const collection = form.getFieldValue('collection');
    // 设置银行信息
    if (is.existy(res) && is.not.empty(res)) {
      if (collection === EmployeeCollectionType.personal) {
        form.setFieldsValue({
          meAccount: dot.get(res, 'record.bank_card_id', undefined),
          meBankName: dot.get(res, 'record.bank_name', undefined),
        });
      }
      if (collection === EmployeeCollectionType.collecting) {
        form.setFieldsValue({
          otherAccount: dot.get(res, 'record.bank_card_id', undefined),
          otherBankName: dot.get(res, 'record.bank_name', undefined),
        });
      }
    }
  }

  // 识别银行卡信息
  onIdentifyBankCard = () => {
    const { getFieldValue } = this.props.form;
    // 银行卡照片信息
    const collection = getFieldValue('collection');
    let bankgPositive;
    const otherBankgPositive = getFieldValue('otherBankPositive');
    const meBankgPositive = getFieldValue('meBankPositive');
    collection === EmployeeCollectionType.personal && (bankgPositive = meBankgPositive);
    collection === EmployeeCollectionType.collecting && (bankgPositive = otherBankgPositive);
    // 判断银行卡正面照是否为空
    if (is.existy(bankgPositive) && is.not.empty(bankgPositive) && is.existy(bankgPositive.keys) && is.not.empty(bankgPositive.keys)) {
      const params = {
        bankgPositive,
        onSuccessCallback: this.onIdentifySuccess,
      };
      this.props.dispatch({ type: 'employeeManage/fetchBankCardIdentification', payload: params });
    }
  }

  // 银行卡正面照更改
  onBankPositive = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ otherAccount: undefined });
    setFieldsValue({ otherBankName: undefined });
    setFieldsValue({ meBankName: undefined });
    setFieldsValue({ meAccount: undefined });
    this.setState({
      isShowBankInfo: true,
    });
  }

  // 更改收款模式
  onCollection = () => {
    this.setState({
      isShowBankInfo: true,
    });
  }

  // 渲染表单信息
  renderForm = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { fileType } = this.props;
    const { isShowBankInfo } = this.state;

    // 获取收款模式
    const collectionModel = getFieldValue('collection') !== undefined ? getFieldValue('collection') : EmployeeCollectionType.personal;

    const isVerify = collectionModel !== EmployeeCollectionType.personal;

    // 是否为员工（员工，银行卡信息字段都为非必填项）
    const isStaff = Number(fileType) === FileType.staff;
    const meForm = [
      {
        label: '持卡人姓名',
        key: 'meCardholder',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('meCardholder', {
          rules: [{ required: false, pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '持卡人姓名必须为汉字或字母' }],
        })(
          <Input placeholder="请输入持卡人姓名" disabled={!isStaff} />,
        ),
      },
      {
        label: '银行卡账号',
        key: 'meAccount',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('meAccount', {
          rules: [{ required: false, pattern: /[0-9]{1,}/g, message: '请输入正确的银行卡账号' }],
        })(
          <Input placeholder="请输入银行卡账号" disabled={!isStaff || isShowBankInfo} />,
        ),
      },
      {
        label: '开户行',
        key: 'meBankName',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('meBankName', {
          rules: [{ required: false, message: '请输入开户行' }],
        })(
          <Input placeholder="请输入开户行名称" disabled={!isStaff || isShowBankInfo} />,
        ),
      },
      {
        label: '支行名称',
        key: 'meBranch',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('meBranch', {
          rules: [{ required: false, message: '请输入支行名称' }, { pattern: /^[\u4e00-\u9fa5]+$/, message: '支行名称必须为汉字' }],
        })(
          <Input placeholder="请输入支行名称" disabled={!isStaff} />,
        ),
      },
      {
        label: '开户行所在地',
        key: 'meAddress',
        span: 10,
        layout: { labelCol: { span: 7 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('meAddress', {
          rules: [{ required: false, message: '请输入支行名称' }],
          initialValue: {},
        })(
          <CommonSelectRegionalName disableds={!isStaff} />,
        ),
      },
      {
        label: '银行卡正面照',
        span: 24,
        key: 'meBankPositives',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('meBankPositive', {
          rules: [{ required: false, message: '请添加银行卡正面照' }],
        })(
          <CorePhotosAmazon domain="staff" namespace="bankPositive" maximum={1} disableds={!isStaff} onChange={this.onBankPositive} />,
        ),
      },
    ];

    // 员工银行卡添加识别按钮
    isStaff && (meForm[meForm.length] = {
      label: '',
      key: 'identify',
      span: 24,
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
      form: getFieldDecorator('identify', {
      })(
        <Button type="primary" onClick={this.onIdentifyBankCard} className={style['app-comp-employee-manage-form-create-bankInfo-identify']}>识别</Button>,
      ),
    });

    const otherForm = [
      {
        label: '代收人/持卡人姓名',
        key: 'otherCardholder',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('otherCardholder', {
          rules: [{ required: isVerify, message: '请输入代收人/持卡人姓名' }, { pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '代收人/持卡人姓名必须为汉字或字母' }],
        })(
          <Input placeholder="请输入代收人/持卡人姓名" />,
        ),
      },
      // {
      //   label: '性别',
      //   key: 'otherCollectingGender',
      //   span: 8,
      //   layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
      //   form: getFieldDecorator('otherCollectingGender', {
      //     rules: [{ required: false, message: '请选性别' }],
      //     initialValue: Gender.male,
      //   })(
      //     <Radio.Group name="radiogroup">
      //       <Radio value={Gender.male}>{Gender.description(Gender.male)}</Radio>
      //       <Radio value={Gender.female}>{Gender.description(Gender.female)}</Radio>
      //     </Radio.Group>,
      //   ),
      // },
      // {
      //   label: '代收人手机号',
      //   key: 'otherCollectingPhone',
      //   span: 8,
      //   layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
      //   form: getFieldDecorator('otherCollectingPhone', {
      //     rules: [{ required: isVerify, pattern: /^1[0-9]{10}$/g, message: '请输入正确的代收人手机号' }],
      //   })(
      //     <Input placeholder="请输入代收人手机号" />,
      //   ),
      // },
      {
        label: '代收人身份证号码',
        key: 'otherIdentity',
        span: 23,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 5 } },
        form: getFieldDecorator('otherIdentity', { rules: isVerify ? [{ required: true, validator: Utils.asyncValidateIdCardNumber }] : null })(
          <Input placeholder="请输入代收人身份证号码" />,
        ),
      },
      {
        key: 'otherBankPositive',
        label: '银行卡正面照',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('otherBankPositive', {
          rules: [{ required: isVerify, message: '请添加银行卡正面照' }],
        })(
          <CorePhotosAmazon domain="staff" namespace="bankPositive" maximum={1} onChange={this.onBankPositive} />,
        ),
      },
      {
        label: '代收人银行卡账号',
        key: 'otherAccount',
        span: 7,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('otherAccount', {
          rules: [{ required: isVerify, message: '请识别正确的代收人银行卡账号', pattern: /[0-9]{1,}/g }],
          // initialValue: dot.get(bankInfo, 'bank_card_id', undefined),
        })(
          <Input placeholder="请识别正确的代收人银行卡账号" disabled={isShowBankInfo} />,
        ),
      },
      {
        label: '开户行',
        key: 'otherBankName',
        span: 7,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('otherBankName', {
          rules: [{ required: isVerify, message: '请输识别开户行名称' }],
          // initialValue: dot.get(bankInfo, 'bank_name', undefined),
        })(
          <Input placeholder="请识别开户行名称" disabled={isShowBankInfo} />,
        ),
      },
      {
        label: '支行名称',
        key: 'otherBranch',
        span: 7,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('otherBranch', {
          rules: [{ required: isVerify, message: '请输入支行名称' }, { pattern: /^[\u4e00-\u9fa5]+$/, message: '支行名称必须为汉字' }],
        })(
          <Input placeholder="请输入支行名称" />,
        ),
      },
      {
        label: '开户行所在地',
        key: 'otherAddress',
        span: 9,
        layout: { labelCol: { span: 7 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('otherAddress', {
          rules: [{ required: isVerify, message: '请输入支行名称' }],
          initialValue: {},
        })(
          <CommonSelectRegionalName />,
        ),
      },
      {
        label: '',
        key: 'identify',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('identify', {
        })(
          <Button type="primary" onClick={this.onIdentifyBankCard} className={style['app-comp-employee-manage-form-create-bankInfo-identify']} >识别</Button>,
        ),
      },
      {
        label: '代收协议 (图)',
        span: 24,
        key: 'otherAgreement',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('otherAgreement', {
          rules: [{ required: isVerify, message: '请添加代收协议(图)' }],
        })(
          <CorePhotosAmazon domain="staff" multiple namespace="agreement" />,
        ),
      },
      // {
      //   label: '代收证明 (图)',
      //   span: 24,
      //   key: 'otherProve',
      //   layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
      //   form: getFieldDecorator('otherProve', {
      //     rules: [{ required: isVerify, message: '请添加代收证明(图)' }],
      //   })(
      //     <CorePhotosAmazon domain="staff" multiple namespace="prove" />,
      //   ),
      // },
    ];

    const items = [
      {
        label: '收款模式',
        key: 'collection',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('collection', {
          rules: [{ required: true, message: '请选择收款模式' }],
          initialValue: EmployeeCollectionType.personal,
        })(
          <Radio.Group name="radiogroup" onChange={this.onCollection}>
            <Radio value={EmployeeCollectionType.personal}>{EmployeeCollectionType.description(EmployeeCollectionType.personal)}</Radio>
            <Radio value={EmployeeCollectionType.collecting}>{EmployeeCollectionType.description(EmployeeCollectionType.collecting)}</Radio>
          </Radio.Group>,
        ),
      },
    ];

    const formItems = collectionModel === EmployeeCollectionType.personal ? [...items, ...meForm] : [...items, ...otherForm];

    return (
      <div>
        <DeprecatedCoreForm items={formItems} />
      </div>
    );
  }

  render() {
    return (
      <CoreContent title="银行卡信息">
        <Form layout="horizontal">
          {/* 渲染表单信息 */}
          {this.renderForm()}
        </Form>
      </CoreContent>
    );
  }
}

function mapStateToProps({ employeeManage: { bankInfo } }) {
  return { bankInfo };
}

export default connect(mapStateToProps)(BankInfo);
