/**
 * 健康证件信息表单
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

class HealthForm extends Component {
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
      health_certificate_type: initHealthPaperworkType, // 健康证证件类型
      health_certificate_no: initHealthPaperworkNumber, // 健康证证件号码
    } = this.props.employeeDetail;
    const formItems = [
      {
        label: '证件类型',
        key: 'healthPaperworkType',
        form: getFieldDecorator('healthPaperworkType', {
          initialValue: initHealthPaperworkType ? `${initHealthPaperworkType}` : `${PaperworkType.health}`,
        })(
          <Select placeholder="请选择证件类型">
            <Option value={`${PaperworkType.health}`}>{PaperworkType.description(PaperworkType.health)}</Option>
          </Select>,
        ),
      },
      {
        label: '证件号码',
        key: 'healthPaperworkNumber',
        form: getFieldDecorator('healthPaperworkNumber', {
          initialValue: initHealthPaperworkNumber,
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
      health_certificate: healthCertificatePhotoList = '',                      // 健康证正面照
      health_certificate_url: healthCertificatePhotoListUrl = '',               // 健康证正面照
      health_certificate_back: healthCertificateBackPhotoList = '',             // 健康证反面照
      health_certificate_back_url: healthCertificateBackPhotoListUrl = '',      // 健康证反面照
      health_certificate_in_hand: healthCertificateInHandPhotoList = '',        // 手持健康证
      health_certificate_in_hand_url: healthCertificateInHandPhotoListUrl = '', // 手持健康证
    } = this.props.employeeDetail;
    // 纸质签约时才显示上传证件照片操作
    if (`${signType}` !== `${SignContractType.paper}` || `${fileType}` !== `${FileType.staff}`) return;
    // 命名空间
    const namespace = 'HealthForm';
    // 健康证正面照
    const healthCertificateValue = {
      keys: healthCertificatePhotoList !== null && healthCertificatePhotoList !== '' ? [healthCertificatePhotoList] : [],
      urls: healthCertificatePhotoListUrl !== null && healthCertificatePhotoListUrl !== '' ? [healthCertificatePhotoListUrl] : [],
    };
    // 健康证反面照
    const healthCertificateBackValue = {
      keys: healthCertificateBackPhotoList !== null && healthCertificateBackPhotoList !== '' ? [healthCertificateBackPhotoList] : [],
      urls: healthCertificateBackPhotoListUrl !== null && healthCertificateBackPhotoListUrl !== '' ? [healthCertificateBackPhotoListUrl] : [],
    };
    // 手持健康证
    const healthCertificateInHandValue = {
      keys: healthCertificateInHandPhotoList !== null && healthCertificateInHandPhotoList !== '' ? [healthCertificateInHandPhotoList] : [],
      urls: healthCertificateInHandPhotoListUrl !== null && healthCertificateInHandPhotoListUrl !== '' ? [healthCertificateInHandPhotoListUrl] : [],
    };
    const formItems = [
      {
        label: '证件正面照',
        form: getFieldDecorator('healthFrontPhotos', {
          initialValue: healthCertificateValue,
        })(
          <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}healthFrontPhotos`} />,
        ),
      },
      {
        label: '证件反面照',
        form: getFieldDecorator('healthObversePhotos', {
          initialValue: healthCertificateBackValue,
        })(
          <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}healthObversePhotos`} />,
        ),
      },
      {
        label: '手持证件半身照',
        form: getFieldDecorator('healthClosePhotos', {
          initialValue: healthCertificateInHandValue,
        })(
          <CorePhotosAmazon domain="staff" maximum={1} namespace={`${namespace}healthClosePhotos`} />,
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

export default HealthForm;
