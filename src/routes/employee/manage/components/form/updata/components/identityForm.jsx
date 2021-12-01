/**
 * 身份证件信息表单
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select, Input } from 'antd';

import { DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../../components/core';
import { asyncValidateIdCardNumber } from '../../../../../../../application/utils';
import {
  PaperworkType,
  FileType,
  SignContractType,
  SigningState,
} from '../../../../../../../application/define';
import DynamicCustomId from './dynamicCustomId';

const { Option } = Select;

class IdentityForm extends Component {
  static propTypes = {
    form: PropTypes.object,           // 父组件表单form
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    form: {},
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      idFrontPhotosDisabled: false, // 证件正面照
      idObversePhotosDisabled: false, // 证件反面照
      idClosePhotosDisabled: false, // 手持证件半身照
    };
  }

  // 证件正面照校验
  onvalidatoridFrontPhotos = (rule, value, callback) => {
    const { keys } = value;
    if (keys.length === 0) {
      callback('请选择证件正面照');
      return;
    }
    callback();
  }
  // 证件反面照校验
  onvalidatoridObversePhotos = (rule, value, callback) => {
    const { keys } = value;
    if (keys.length === 0) {
      callback('请选择证件反面照');
      return;
    }
    callback();
  }

  // 禁用disabled
  onChangeUploadDisabled = (type) => {
    const { idFrontPhotosDisabled, idObversePhotosDisabled, idClosePhotosDisabled } = this.state;
    const params = {};
      // 正面照
    if (type === 'idFrontPhotos') {
      params.idFrontPhotosDisabled = !idFrontPhotosDisabled;
    }
      // 反面照
    if (type === 'idObversePhotos') {
      params.idObversePhotosDisabled = !idObversePhotosDisabled;
    }
      // 手持证件半身照
    if (type === 'idClosePhotos') {
      params.idClosePhotosDisabled = !idClosePhotosDisabled;
    }
    this.setState({
      ...params,
    });
  }

  renderForm = () => {
    const {
      state,                                                // 签约状态
      profile_type: fileType,                               // 档案类型
      identity_certificate_type: initIdPaperworkType,       // 身份证件类型
      identity_card_id: initIdPaperworkNumber = '',         // 身份证号
      staff_no: initIdemployeeId = '',                      // 人员编号
    } = this.props.employeeDetail;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // 证件类型（员工档案号码校验）
    const idPaperworkType = getFieldValue('idPaperworkType') || `${initIdPaperworkType}`;

    let formItems = [];
    if (`${fileType}` === `${FileType.staff}`) {
      formItems = [
        {
          label: '证件类型',
          key: 'idPaperworkType',
          form: getFieldDecorator('idPaperworkType', {
            rules: [{ required: true, message: '请选择内容' }],
            initialValue: initIdPaperworkType ? `${initIdPaperworkType}` : undefined,
          })(
            <Select placeholder="请选择证件类型">
              <Option value={`${PaperworkType.idCard}`}>{PaperworkType.description(PaperworkType.idCard)}</Option>
              <Option value={`${PaperworkType.sergeant}`}>{PaperworkType.description(PaperworkType.sergeant)}</Option>
              <Option value={`${PaperworkType.student}`}>{PaperworkType.description(PaperworkType.student)}</Option>
              <Option value={`${PaperworkType.passport}`}>{PaperworkType.description(PaperworkType.passport)}</Option>
              <Option value={`${PaperworkType.hmPass}`}>{PaperworkType.description(PaperworkType.hmPass)}</Option>
            </Select>,
          ),
        },
        {
          label: '证件号码',
          key: 'idPaperworkNumber',
          form: getFieldDecorator('idPaperworkNumber', {
            rules: [{
              required: true,
              validator: idPaperworkType === `${PaperworkType.idCard}`
                      ? asyncValidateIdCardNumber
                      : (rule, value, callback) => { callback(); },

            }],
            initialValue: initIdPaperworkNumber,
          })(
            <Input placeholder="请填写证件号码" />,
          ),
        },
      ];
    } else {
      formItems = [
        {
          label: '证件类型',
          form: <span>{PaperworkType.description(initIdPaperworkType)}</span>,
        },
        {
          label: '证件号码',
          form: <span>{initIdPaperworkNumber || '--'}</span>,
        },
      ];
      // 档案类型为劳动者档案时
      if (`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`) {
        formItems.push(
          {
            label: '人员编号',
            form: <span>{initIdemployeeId || '--'}</span>,
          },
        );
      }
      // 签约状态为待签约或已签约-待换签时，所有表单为可编辑状态
      if (`${state}` === `${SigningState.pending}` || `${state}` === `${SigningState.replace}`) {
        formItems.push(
          {
            label: '第三方平台ID',
            key: 'customId',
            form: dot.get(this.props.employeeDetail, 'custom_id', '--') || '--',
          },
        );
      }
    }
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {(fileType === FileType.second || fileType === FileType.first) && `${state}` !== `${SigningState.pending}` ? <DynamicCustomId employeeDetail={this.props.employeeDetail} /> : ''}
      </div>
    );
  }

  // 渲染证件照片
  renderPaperworkPhotos = () => {
    const {
      _id: id,                // 人员id
      state,                  // 签约状态
      profile_type: fileType, // 档案类型
      sign_type: signType,    // 签约类型
      identity_card_front: identityCardFrontPhotoList = '',           // 身份证正面照
      identity_card_front_url: identityCardFrontPhotoListUrl = '',    // 身份证正面照
      identity_card_back: identityCardBackPhotoList = '',             // 身份证反面照
      identity_card_back_url: identityCardBackPhotoListUrl = '',      // 身份证反面照
      identity_card_in_hand: identityCardInHandPhotoList = '',        // 手持身份证照
      identity_card_in_hand_url: identityCardInHandPhotoListUrl = '', // 手持身份证照
    } = this.props.employeeDetail;
    const { getFieldDecorator } = this.props.form;
    // 纸质签约时才显示上传证件照片操作
    if (`${signType}` !== `${SignContractType.paper}` || `${fileType}` !== `${FileType.staff}`) return;
    // 命名空间
    const namespace = `IdentityForm-${id || ''}`;
    // 身份证正面照
    const identityCardFrontValue = {
      keys: identityCardFrontPhotoList !== null && identityCardFrontPhotoList !== '' ? [identityCardFrontPhotoList] : [],
      urls: identityCardFrontPhotoListUrl !== null && identityCardFrontPhotoListUrl !== '' ? [identityCardFrontPhotoListUrl] : [],
    };
    // 身份证反面照
    const identityCardBackValue = {
      keys: identityCardBackPhotoList !== null && identityCardBackPhotoList !== '' ? [identityCardBackPhotoList] : [],
      urls: identityCardBackPhotoListUrl !== null && identityCardBackPhotoListUrl !== '' ? [identityCardBackPhotoListUrl] : [],
    };
    // 手持身份证照
    const identityCardInHandValue = {
      keys: identityCardInHandPhotoList !== null && identityCardInHandPhotoList !== '' ? [identityCardInHandPhotoList] : [],
      urls: identityCardInHandPhotoListUrl !== null && identityCardInHandPhotoListUrl !== '' ? [identityCardInHandPhotoListUrl] : [],
    };
    let formItems = [];

    const { idFrontPhotosDisabled, idObversePhotosDisabled, idClosePhotosDisabled } = this.state;
    // 档案类型为员工时照片为可编辑状态，其余情况为不可编辑状态
    if (`${fileType}` === `${FileType.staff}`) {
      formItems = [
        {
          label: '证件正面照',
          key: 'idFrontPhotos',
          form: getFieldDecorator('idFrontPhotos', {
            rules: [{
              required: true,
              message: '请选择证件正面照',
            }, { validator: this.onvalidatoridFrontPhotos }],
            initialValue: identityCardFrontValue,
          })(
            <CorePhotosAmazon
              domain="staff"
              maximum={1}
              namespace={`${namespace}idFrontPhotos`}
              disabled={idFrontPhotosDisabled}
              onChangeUploadDisabled={this.onChangeUploadDisabled.bind(this, 'idFrontPhotos')}
            />,
          ),
        },
        {
          label: '证件反面照',
          key: 'idObversePhotos',
          form: getFieldDecorator('idObversePhotos', {
            rules: [{
              required: true,
              message: '请选择证件反面照',
            }, { validator: this.onvalidatoridObversePhotos }],
            initialValue: identityCardBackValue,
          })(
            <CorePhotosAmazon
              domain="staff"
              maximum={1}
              namespace={`${namespace}idObversePhotos`}
              disabled={idObversePhotosDisabled}
              onChangeUploadDisabled={this.onChangeUploadDisabled.bind(this, 'idObversePhotos')}
            />,
          ),
        },
        {
          label: '手持证件半身照',
          key: 'idClosePhotos',
          form: getFieldDecorator('idClosePhotos', {
            rules: [{
              required: false,
              message: '请选择手持证件半身照',
            }],
            initialValue: identityCardInHandValue,
          })(
            <CorePhotosAmazon
              domain="staff"
              maximum={1}
              namespace={`${namespace}idClosePhotos`}
              disabled={idClosePhotosDisabled}
              onChangeUploadDisabled={this.onChangeUploadDisabled.bind(this, 'idClosePhotos')}
            />,
          ),
        },
      ];
      // 档案类型为劳动者，且签约状态为待签约时，合同照片为可编辑状态
    } else if ((`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`) && `${state}` === `${SigningState.pending}`) {
      formItems = [
        {
          label: '证件正面照',
          key: 'idFrontPhotos',
          form: getFieldDecorator('idFrontPhotos', {
            rules: [{
              required: true,
              message: '请选择证件正面照',
            },
            { validator: this.onvalidatoridFrontPhotos },
            ],
            initialValue: identityCardFrontValue,
          })(
            <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}idFrontPhotos`} />,
          ),
        },
        {
          label: '证件反面照',
          key: 'idObversePhotos',
          form: getFieldDecorator('idObversePhotos', {
            rules: [{
              required: true,
              message: '请选择证件反面照',
            },
              { validator: this.onvalidatoridObversePhotos },
            ],
            initialValue: identityCardBackValue,
          })(
            <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}idObversePhotos`} />,
          ),
        },
        {
          label: '手持证件半身照',
          key: 'idClosePhotos',
          form: getFieldDecorator('idClosePhotos', {
            rules: [{
              required: false,
              message: '请选择手持证件半身照',
            }],
            initialValue: identityCardInHandValue,
          })(
            <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}idClosePhotos`} />,
          ),
        },
      ];
    } else {
      formItems = [
        {
          label: '证件正面照',
          form: <CorePhotosAmazon domain="staff" isDisplayMode value={identityCardFrontValue} namespace={`${namespace}idFrontPhotos`} />,
        },
        {
          label: '证件反面照',
          form: <CorePhotosAmazon domain="staff" isDisplayMode value={identityCardBackValue} namespace={`${namespace}idObversePhotos`} />,
        },
        {
          label: '手持证件半身照',
          form: <CorePhotosAmazon domain="staff" isDisplayMode value={identityCardInHandValue} namespace={`${namespace}idClosePhotos`} />,
        },
      ];
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染表单 */}
        {this.renderForm()}
        {/* 渲染证件照片信息 */}
        {this.renderPaperworkPhotos()}
      </div>
    );
  }
}

export default IdentityForm;
