/**
 * 银行卡信息(编辑)
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

class UpdataBankInfo extends Component {
  static propTypes = {
    form: PropTypes.object, // 父组件表单form
    fileType: PropTypes.string,
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowBankInfo: true,  // 是否显示银行卡信息
    };
  }

  // 更改收款模式
  onCollectionBookChange = (e) => {
    const { form } = this.props;
    const { employeeDetail } = this.props;
    const address = dot.get(employeeDetail, 'bank_info.bank_location', []); // 获取省市数据
    this.setState({
      isShowBankInfo: true,
    });
    const initDeparture = {}; // 存储省市
    if (is.existy(address) && is.not.empty(address)) {
      initDeparture.province = address[0]; // 省
      initDeparture.city = address[1];     // 市
    }

    // 获取持卡人姓名
    const holderName = dot.get(employeeDetail, 'bank_info.card_holder_name');

    // 根据,默认值判断当收款模式改变是否保存默认值
    if (e.target.value === dot.get(employeeDetail, 'bank_info.payment_type')) {
      form.resetFields();
    } else if (e.target.value === EmployeeCollectionType.personal) {
      form.setFieldsValue({
        cardholder: holderName,
        account: undefined,
        bankName: undefined,
        branch: undefined,
        address: {},
        bankPositive: undefined,
      });
    } else {
      form.setFieldsValue({
        account: undefined,
        cardholder: undefined,
        bankName: undefined,
        branch: undefined,
        address: {},
        bankPositive: undefined,
      });
    }
  }

  // 识别银行卡成功的回调函数
  onIdentifySuccess = (res) => {
    const { form } = this.props;
    message.success('识别成功');
    this.setState({
      isShowBankInfo: false,
    });
    // 设置银行信息
    if (is.existy(res) && is.not.empty(res)) {
      form.setFieldsValue({ account: dot.get(res, 'record.bank_card_id', undefined) });
      form.setFieldsValue({ bankName: dot.get(res, 'record.bank_name', undefined) });
    }
  }

  // 识别银行卡信息
  onIdentifyBankCard = () => {
    const { getFieldValue } = this.props.form;
    // 银行卡照片信息
    const bankgPositive = getFieldValue('bankPositive');
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
    this.setState({
      isShowBankInfo: true,
    });
  }

  // 渲染表单信息
  renderForm = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { employeeDetail, fileType } = this.props;
    const { isShowBankInfo } = this.state;
    const address = dot.get(employeeDetail, 'bank_info.bank_location', []); // 获取省市数据
    const initDeparture = {}; // 存储省市
    if (is.existy(address) && is.not.empty(address)) {
      initDeparture.province = address[0]; // 省
      initDeparture.city = address[1];     // 市
    }

    // 没有默认值，initialValue设置为undefined。否则不校验
    // 代收协议
    const agreementKeys = dot.get(employeeDetail, 'bank_info.collect_protocol', undefined);
    const agreementUrls = dot.get(employeeDetail, 'bank_info.collect_protocol_url', undefined);
    const agreement = !agreementKeys || is.empty(agreementKeys) || !agreementUrls || is.empty(agreementUrls) ? undefined : { keys: agreementKeys, urls: agreementUrls };

    // 代收证明
    // const proveKeys = dot.get(employeeDetail, 'bank_info.collect_provement', undefined);
    // const proveUrls = dot.get(employeeDetail, 'bank_info.collect_provement_url', undefined);
    // const prove = !proveKeys || is.empty(proveKeys) || !proveUrls || is.empty(proveUrls) ? undefined : { keys: proveKeys, urls: proveUrls };

    // 银行卡正面照
    // const bankPositiveKeys = dot.get(employeeDetail, 'bank_info.bank_card_front', undefined);
    // const bankPositiveUrls = dot.get(employeeDetail, 'bank_info.bank_card_front_url', undefined);
    // const bankPositive = !bankPositiveKeys || is.empty(bankPositiveKeys) || !bankPositiveUrls || is.empty(bankPositiveUrls) ? undefined : { keys: [bankPositiveKeys], urls: [bankPositiveUrls] };

    // 是否为员工（员工，银行卡信息字段都为非必填项）
    const isStaff = Number(fileType) === FileType.staff;

    const formItems = [
      {
        label: '收款模式',
        key: 'collection',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('collection', {
          rules: [{ required: true, message: '请选择收款模式' }],
          initialValue: dot.get(employeeDetail, 'bank_info.payment_type', EmployeeCollectionType.personal),
        })(
          <Radio.Group name="radiogroup" onChange={this.onCollectionBookChange}>
            <Radio value={EmployeeCollectionType.personal}>{EmployeeCollectionType.description(EmployeeCollectionType.personal)}</Radio>
            <Radio value={EmployeeCollectionType.collecting}>{EmployeeCollectionType.description(EmployeeCollectionType.collecting)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    // 获取收款模式
    const collectionModel = getFieldValue('collection') !== undefined ? getFieldValue('collection') : dot.get(employeeDetail, 'bank_info.payment_type');
    if (collectionModel === EmployeeCollectionType.collecting) {
      formItems.push(
        {
          label: '代收人/持卡人姓名',
          key: 'cardholder',
          span: 8,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('cardholder', {
            initialValue: dot.get(employeeDetail, 'bank_info.card_holder_name'),
            rules: [{ required: true, message: '请输入代收人/持卡人姓名' }, { pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '代收人/持卡人姓名必须为汉字或字母' }],
          })(
            <Input placeholder="请输入代收人/持卡人姓名" />,
          ),
        },
        // {
        //   label: '性别',
        //   key: 'collectingGender',
        //   span: 8,
        //   layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        //   form: getFieldDecorator('collectingGender', {
        //     rules: [{ required: false, message: '请选性别' }],
        //     initialValue: (dot.get(employeeDetail, 'bank_info.collect_sex')),
        //   })(
        //     <Radio.Group name="radiogroup">
        //       <Radio value={Gender.male}>{Gender.description(Gender.male)}</Radio>
        //       <Radio value={Gender.female}>{Gender.description(Gender.female)}</Radio>
        //     </Radio.Group>,
        //   ),
        // },
        // {
        //   label: '代收人手机号',
        //   key: 'collectingPhone',
        //   span: 8,
        //   layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
        //   form: getFieldDecorator('collectingPhone', {
        //     rules: [{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的代收人手机号' }],
        //     initialValue: dot.get(employeeDetail, 'bank_info.collect_phone'),
        //   })(
        //     <Input placeholder="请输入代收人手机号" />,
        //   ),
        // },
        {
          label: '代收人身份证号码',
          key: 'identity',
          span: 23,
          layout: { labelCol: { span: 3 }, wrapperCol: { span: 5 } },
          form: getFieldDecorator('identity', { rules: [{ required: true, validator: Utils.asyncValidateIdCardNumber }], initialValue: dot.get(employeeDetail, 'bank_info.collect_id_card_no') })(
            <Input placeholder="请输入代收人身份证号码" />,
          ),
        },
        {
          label: '银行卡正面照',
          span: 8,
          key: 'bankPositive',
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('bankPositive', {
            rules: [{ required: true, message: '请添加银行卡正面照' }],
            initialValue: { keys: dot.get(employeeDetail, 'bank_info.bank_card_front') !== undefined && dot.get(employeeDetail, 'bank_info.bank_card_front') !== null ? [dot.get(employeeDetail, 'bank_info.bank_card_front')] : [], urls: dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== undefined && dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== null ? [dot.get(employeeDetail, 'bank_info.bank_card_front_url')] : [] },
          })(
            <CorePhotosAmazon domain="staff" namespace="bankPositive" maximum={1} onChange={this.onBankPositive} />,
          ),
        },
        {
          label: '代收人银行卡账号',
          key: 'account',
          span: 7,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('account', {
            rules: [{ required: true, pattern: /[0-9]{1,}/g, message: '请识别正确的代收人银行卡账号' }],
            initialValue: dot.get(employeeDetail, 'bank_info.card_holder_bank_card_no'),
          })(
            <Input placeholder="请识别正确的代收人银行卡账号" disabled={isShowBankInfo} />,
          ),
        },
        {
          label: '开户行',
          key: 'bankName',
          span: 7,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('bankName', {
            rules: [{ required: true, message: '请输识别开户行名称' }],
            initialValue: dot.get(employeeDetail, 'bank_info.bank_branch'),
          })(
            <Input placeholder="请输识别开户行名称" disabled={isShowBankInfo} />,
          ),
        },
        {
          label: '支行名称',
          key: 'branch',
          span: 7,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('branch', {
            rules: [{ required: true, message: '请输入支行名称' }, { pattern: /^[\u4e00-\u9fa5]+$/, message: '支行名称必须为汉字' }],
            initialValue: dot.get(employeeDetail, 'bank_info.bank_branch_name'),
          })(
            <Input placeholder="请输入支行名称" />,
          ),
        },
        {
          label: '开户行所在地',
          key: 'address',
          span: 9,
          layout: { labelCol: { span: 7 }, wrapperCol: { span: 17 } },
          form: getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入支行名称' }],
            initialValue: initDeparture,
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
            <Button type="primary" onClick={this.onIdentifyBankCard} className={style['app-comp-employee-manage-update-bank-identify']}>识别</Button>,
          ),
        },
        {
          label: '代收协议 (图)',
          span: 24,
          key: 'agreement',
          layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
          form: getFieldDecorator('agreement', {
            rules: [{ required: true, message: '请添加代收协议(图)' }],
            initialValue: agreement,
          })(
            <CorePhotosAmazon domain="staff" multiple namespace="agreement" />,
          ),
        },
        // {
        //   label: '代收证明 (图)',
        //   span: 24,
        //   key: 'prove',
        //   layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
        //   form: getFieldDecorator('prove', {
        //     rules: [{ required: true, message: '请添加代收证明(图)' }],
        //     initialValue: prove,
        //   })(
        //     <CorePhotosAmazon domain="staff" multiple namespace="prove" />,
        //   ),
        // },
      );
    } else {
      formItems.push(
        {
          label: '持卡人姓名',
          key: 'cardholder',
          span: 8,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('cardholder', {
            rules: [{ pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '持卡人姓名必须为汉字或字母' }],
            initialValue: dot.get(employeeDetail, 'bank_info.card_holder_name'),
          })(
            <Input placeholder="请输入持卡人姓名" disabled={!isStaff} />,
          ),
        },
        {
          label: '银行卡账号',
          key: 'account',
          span: 8,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('account', {
            rules: [{ required: false, pattern: /[0-9]{1,}/g, message: '请输入正确的银行卡账号' }],
            initialValue: dot.get(employeeDetail, 'bank_info.card_holder_bank_card_no'),
          })(
            <Input placeholder="请输入银行卡账号" disabled />,
          ),
        },
        {
          label: '开户行',
          key: 'bankName',
          span: 8,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('bankName', {
            rules: [{ required: false, message: '请输入开户行' }],
            initialValue: dot.get(employeeDetail, 'bank_info.bank_branch'),
          })(
            <Input placeholder="请输入开户行名称" disabled />,
          ),
        },
        {
          label: '支行名称',
          key: 'branch',
          span: 8,
          layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
          form: getFieldDecorator('branch', {
            rules: [{ required: false, message: '请输入支行名称' }, { pattern: /^[\u4e00-\u9fa5]+$/, message: '支行名称必须为汉字' }],
            initialValue: dot.get(employeeDetail, 'bank_info.bank_branch_name'),
          })(
            <Input placeholder="请输入支行名称" disabled={!isStaff} />,
          ),
        },
        {
          label: '开户行所在地',
          key: 'address',
          span: 10,
          layout: { labelCol: { span: 7 }, wrapperCol: { span: 17 } },
          form: getFieldDecorator('address', {
            rules: [{ required: false, message: '请输入支行名称' }],
            initialValue: initDeparture,
          })(
            <CommonSelectRegionalName disableds={!isStaff} />,
          ),
        },
        {
          label: '银行卡正面照',
          span: 24,
          key: 'bankPositives',
          layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
          form: getFieldDecorator('bankPositive', {
            rules: [{ required: false, message: '请添加银行卡正面照' }],
            initialValue: { keys: dot.get(employeeDetail, 'bank_info.bank_card_front') !== undefined && dot.get(employeeDetail, 'bank_info.bank_card_front') !== null ? [dot.get(employeeDetail, 'bank_info.bank_card_front')] : [], urls: dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== undefined && dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== null ? [dot.get(employeeDetail, 'bank_info.bank_card_front_url')] : [] },
          })(
            <CorePhotosAmazon domain="staff" namespace="bankPositive" disabled={!isStaff} maximum={1} onChange={this.onBankPositive} />,
          ),
        },
      );

      // 员工银行卡添加识别按钮
      isStaff && (formItems[formItems.length] = {
        label: '',
        key: 'identify',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('identify', {
        })(
          <Button type="primary" onClick={this.onIdentifyBankCard} className={style['app-comp-employee-manage-update-bank-identify']}>识别</Button>,
        ),
      });
    }
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

export default connect(mapStateToProps)(UpdataBankInfo);
