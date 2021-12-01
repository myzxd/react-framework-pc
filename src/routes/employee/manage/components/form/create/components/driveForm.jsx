/**
 * 驾驶证件信息表单
 */
import PropTypes from 'prop-types';
import { Select, Input } from 'antd';
import React, { Component } from 'react';

// import CorePhotos from '../../components/corePhotos';
import { DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../../components/core';
import {
  PaperworkType,
  FileType,
  SignContractType,
} from '../../../../../../../application/define';

const { Option } = Select;

class DriveForm extends Component {
  static propTypes = {
    form: PropTypes.object,         // 父组件表单form
    fileType: PropTypes.string,     // 档案类型
    signType: PropTypes.string,     // 签约类型
  }

  static defaultProps = {
    form: {},
    fileType: '',
    signType: '',
    industryType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      drive_certificate_type: initDrivePaperworkType, // 驾驶证证件类型
      drive_certificate_no: initDrivePaperworkNumber, // 驾驶证证件号码
    } = this.props.employeeDetail;
    const formItems = [
      {
        label: '证件类型',
        key: 'drivePaperworkType',
        form: getFieldDecorator('drivePaperworkType', {
          initialValue: initDrivePaperworkType ? `${initDrivePaperworkType}` : `${PaperworkType.drive}`,
        })(
          <Select placeholder="请选择证件类型">
            <Option value={`${PaperworkType.drive}`}>{PaperworkType.description(PaperworkType.drive)}</Option>
          </Select>,
        ),
      },
      {
        label: '证件号码',
        key: 'drivePaperworkNumber',
        form: getFieldDecorator('drivePaperworkNumber', {
          initialValue: initDrivePaperworkNumber,
        })(
          <Input placeholder="请填写证件号码" />,
        ),
      },
    ];
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
      drive_certificate_front: driveCertificateFrontPhotoList = '',           // 驾驶证正面照
      drive_certificate_front_url: driveCertificateFPhotoListUrl = '',        // 驾驶证正面照
      drive_certificate_back: driveCertificateBackPhotoList = '',             // 驾驶证反面照
      drive_certificate_back_url: driveCertificateBackPhotoListUrl = '',      // 驾驶证反面照
      drive_certificate_in_hand: driveCertificateInHandPhotoList = '',        // 手持驾驶证
      drive_certificate_in_hand_url: driveCertificateInHandPhotoListUrl = '', // 手持驾驶证
    } = this.props.employeeDetail;
    // 纸质签约时才显示上传证件照片操作
    if (`${signType}` !== `${SignContractType.paper}` || `${fileType}` !== `${FileType.staff}`) return;
    // 命名空间
    const namespace = 'DriveForm';
    // 驾驶证正面照
    const healthCertificateValue = {
      keys: driveCertificateFrontPhotoList !== '' && driveCertificateFrontPhotoList !== null ? [driveCertificateFrontPhotoList] : [],
      urls: driveCertificateFPhotoListUrl !== '' && driveCertificateFPhotoListUrl !== null ? [driveCertificateFPhotoListUrl] : [],
    };
    // 驾驶证反面照
    const healthCertificateBackValue = {
      keys: driveCertificateBackPhotoList !== '' && driveCertificateBackPhotoList !== null ? [driveCertificateBackPhotoList] : [],
      urls: driveCertificateBackPhotoListUrl !== '' && driveCertificateBackPhotoListUrl !== null ? [driveCertificateBackPhotoListUrl] : [],
    };
    // 手持驾驶证
    const healthCertificateInHandValue = {
      keys: driveCertificateInHandPhotoList !== '' && driveCertificateInHandPhotoList !== null ? [driveCertificateInHandPhotoList] : [],
      urls: driveCertificateInHandPhotoListUrl !== '' && driveCertificateInHandPhotoListUrl !== null ? [driveCertificateInHandPhotoListUrl] : [],
    };
    const formItems = [
      {
        label: '证件正面照',
        form: getFieldDecorator('driveFrontPhotos', {
          initialValue: healthCertificateValue,
        })(
          <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}driveFrontPhotos`} />,
        ),
      },
      {
        label: '证件反面照',
        form: getFieldDecorator('driveObversePhotos', {
          initialValue: healthCertificateBackValue,
        })(
          <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}driveObversePhotos`} />,
        ),
      },
      {
        label: '手持证件半身照',
        form: getFieldDecorator('driveClosePhotos', {
          initialValue: healthCertificateInHandValue,
        })(
          <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}driveClosePhotos`} />,
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
        {/* 渲染证件照片 */}
        {this.renderPaperworkPhotos()}
      </div>
    );
  }
}

export default DriveForm;
