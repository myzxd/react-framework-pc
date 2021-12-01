/**
 * 身份证件信息表单
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select, Input, Button, message } from 'antd';

import { DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../../components/core';
import { asyncValidateIdCardNumber } from '../../../../../../../application/utils';
import {
  PaperworkType,
  FileType,
  SignContractType,
} from '../../../../../../../application/define';

const { Option } = Select;

class IdentityForm extends Component {
  static propTypes = {
    form: PropTypes.object,     // 父组件表单form
    fileType: PropTypes.string, // 档案类型
    signType: PropTypes.string, // 签约类型
    dispatch: PropTypes.func,
    onResetStaff: PropTypes.func,
  }

  static defaultProps = {
    form: {},
    fileType: '',
    signType: '',
    dispatch: () => {},
    onResetStaff: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      idFrontPhotosDisabled: false, // 证件正面照
      idObversePhotosDisabled: false, // 证件反面照
      idClosePhotosDisabled: false, // 手持证件半身照
    };
  }

  // 二次入职查询
  onTwiceBoard = () => {
    const { form = {}, dispatch, onResetStaff } = this.props;
    const { getFieldValue } = form;
    const idPaperworkNumber = getFieldValue('idPaperworkNumber');
    if (!idPaperworkNumber) return message.error('请填写证件号码');
    dispatch({ type: 'employeeManage/fetchEmployeeDetail', payload: { identityCardId: idPaperworkNumber, onSuccessCallback: onResetStaff, fileType: 'staff' } });
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

  renderForm = () => {
    const { fileType, disabledUpdate } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      identity_certificate_type: initIdPaperworkType,       // 身份证件类型
      identity_card_id: initIdPaperworkNumber = '',         // 身份证号
    } = this.props.employeeDetail;
    // 证件类型（员工档案号码校验）
    const formItems = [
      {
        label: '证件类型',
        key: 'idPaperworkType',
        form: getFieldDecorator('idPaperworkType', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: initIdPaperworkType ? `${initIdPaperworkType}` : `${PaperworkType.idCard}`,
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
          initialValue: initIdPaperworkNumber,
          rules: [{
            required: true,
            validator: getFieldValue('idPaperworkType') === `${PaperworkType.idCard}`
                      ? asyncValidateIdCardNumber
                      : (rule, value, callback) => { callback(); },
          }],
        })(
          <Input placeholder="请填写证件号码" />,
        ),
      },
    ];
    // 创建编辑不展示人员编号
    if (!disabledUpdate) {
      formItems.push({
        label: '人员编号',
        key: 'employeeId',
        form: getFieldDecorator('employeeId', {
        })(
          <Input placeholder="请填写人员编号" disabled={disabledUpdate} />,
          ),
      });
    }

    // 二次入职员工校验身份证并且不是编辑
    if (`${fileType}` === `${FileType.staff}` && !disabledUpdate) {
      formItems[formItems.length] = {
        label: '',
        keys: 'button',
        form: <Button type="primary" onClick={() => this.onTwiceBoard()}>二次入职查询</Button>,
      };
    }

    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染证件照片
  renderPaperworkPhotos = () => {
    const { signType, fileType } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      identity_card_front: identityCardFrontPhotoList = '',           // 身份证正面照
      identity_card_front_url: identityCardFrontPhotoListUrl = '',    // 身份证正面照
      identity_card_back: identityCardBackPhotoList = '',             // 身份证反面照
      identity_card_back_url: identityCardBackPhotoListUrl = '',      // 身份证反面照
      identity_card_in_hand: identityCardInHandPhotoList = '',        // 手持身份证照
      identity_card_in_hand_url: identityCardInHandPhotoListUrl = '', // 手持身份证照
    } = this.props.employeeDetail;
    // 纸质签约时才显示上传证件照片操作
    if (`${signType}` !== `${SignContractType.paper}` || `${fileType}` !== `${FileType.staff}`) return;
    // 命名空间
    const namespace = 'IdentityForm';
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
    const { idFrontPhotosDisabled, idObversePhotosDisabled, idClosePhotosDisabled } = this.state;
    const formItems = [
      {
        label: '证件正面照',
        form: getFieldDecorator('idFrontPhotos', {
          rules: [{
            required: true,
            message: '请选择证件正面照',
          },
          { validator: this.onvalidatoridFrontPhotos },
          ],
          initialValue: identityCardFrontValue,
        })(
          <CorePhotosAmazon
            domain="staff"
            disabled={idFrontPhotosDisabled}
            onChangeUploadDisabled={this.onChangeUploadDisabled.bind(this, 'idFrontPhotos')}
            maximum={1}
            namespace={`${namespace}idFrontPhotos`}
          />,
        ),
      },
      {
        label: '证件反面照',
        form: getFieldDecorator('idObversePhotos', {
          rules: [{
            required: true,
            message: '请选择证件反面照',
          },
            { validator: this.onvalidatoridObversePhotos },
          ],
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
