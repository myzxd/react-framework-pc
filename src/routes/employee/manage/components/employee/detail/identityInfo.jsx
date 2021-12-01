/**
 * 员工档案 - 员工详情 - 基本信息tab - 身份信息
 */
import React from 'react';
import {
  Form,
} from 'antd';
import {
  PaperworkType,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
} from '../../../../../../components/core';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const IdentityInfo = ({
  employeeDetail = {}, // 员工档案
}) => {
  const {
    identity_certificate_type: identityCertificateType, // 身份证证件类型
    health_certificate_type: healthCertificateType, // 健康证证件类型
    drive_certificate_type: driveCertificateType, // 驾驶证证件类型

    // 身份证正面照
    identity_card_front: identityCardFront,
    identity_card_front_url: identityCardFrontUrl,
    // 身份证反面照
    identity_card_back: identityCardBack,
    identity_card_back_url: identityCardBackUrl,
    // 身份证手持照
    identity_card_in_hand: identityCardInHand,
    identity_card_in_hand_url: identityCardInHandUrl,
    // 健康证正面照
    health_certificate: healthCertificate,
    health_certificate_url: healthCertificateUrl,
    // 健康证反面照
    health_certificate_back: healthCertificateBack,
    health_certificate_back_url: healthCertificateBackUrl,
    // 健康证半身照
    health_certificate_in_hand: healthCertificateInHand,
    health_certificate_in_hand_url: healthCertificateInHandUrl,
    // 驾驶证证正面照
    drive_certificate_front: driveCertificateFront,
    drive_certificate_front_url: driveCertificateFrontUrl,
    // 驾驶证证反面照
    drive_certificate_back: driveCertificateBack,
    drive_certificate_back_url: driveCertificateBackUrl,
    // 驾驶证证半身照
    drive_certificate_in_hand: driveCertificateInHand,
    drive_certificate_in_hand_url: driveCertificateInHandUrl,
  } = employeeDetail;

  // 上传图片
  const renderPhoto = (namespace, value = {}) => {
    if (!Array.isArray(value.keys)
      || !Array.isArray(value.urls)
      || value.keys.length < 1
      || value.urls.length < 1
    ) {
      return (
        <div
          style={{
            width: 104,
            height: 104,
            backgroundColor: '#eee',
            textAlign: 'center',
            lineHeight: '104px',
          }}
        >
          暂无
        </div>
      );
    }
    return (
      <CorePhotosAmazon
        isDisplayMode
        value={value}
        namespace={namespace}
        domain="staff"
      />
    );
  };

  // 身份证
  const renderIndentity = () => {
    // 身份证正面照
    const identityPhoto = {
      keys: identityCardFront ? [identityCardFront] : [],
      urls: identityCardFrontUrl ? [identityCardFrontUrl] : [],
    };

    // 身份证反面照
    const identityBackPhoto = {
      keys: identityCardBack ? [identityCardBack] : [],
      urls: identityCardBackUrl ? [identityCardBackUrl] : [],
    };

     // 身份证手持照
    const identityHandPhoto = {
      keys: identityCardInHand ? [identityCardInHand] : [],
      urls: identityCardInHandUrl ? [identityCardInHandUrl] : [],
    };

    const items = [
      <Form.Item
        label="证件类型"
        {...formLayout}
      >
        {
          identityCertificateType ?
            PaperworkType.description(identityCertificateType)
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="证件号码"
        {...formLayout}
      >
        {employeeDetail.identity_card_id || '--'}
      </Form.Item>,
      <Form.Item key="empty_identity" />,
      <Form.Item
        label="证件正面照"
        {...formLayout}
      >
        {renderPhoto('identity_card_front', identityPhoto)}
      </Form.Item>,
      <Form.Item
        label="证件反面照"
        {...formLayout}
      >
        {renderPhoto('identity_card_back', identityBackPhoto)}
      </Form.Item>,
      <Form.Item
        label="手持证件半身照"
        {...formLayout}
      >
        {renderPhoto('identity_card_in_hand', identityHandPhoto)}
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  // 健康证
  const renderHealth = () => {
    // 健康证正面照
    const healthPhoto = {
      keys: healthCertificate ? [healthCertificate] : [],
      urls: healthCertificateUrl ? [healthCertificateUrl] : [],
    };

    // 健康证反面照
    const healthBackPhoto = {
      keys: healthCertificateBack ? [healthCertificateBack] : [],
      urls: healthCertificateBackUrl ? [healthCertificateBackUrl] : [],
    };

     // 健康证手持照
    const healthHandPhoto = {
      keys: healthCertificateInHand ? [healthCertificateInHand] : [],
      urls: healthCertificateInHandUrl ? [healthCertificateInHandUrl] : [],
    };

    const items = [
      <Form.Item
        label="证件类型"
        {...formLayout}
      >
        {
          healthCertificateType ?
            PaperworkType.description(healthCertificateType)
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="证件号码"
        {...formLayout}
      >
        {employeeDetail.health_certificate_no || '--'}
      </Form.Item>,
      <Form.Item key="empty_health" />,
      <Form.Item
        label="证件正面照"
        {...formLayout}
      >
        {renderPhoto('health_certificate', healthPhoto)}
      </Form.Item>,
      <Form.Item
        label="证件反面照"
        {...formLayout}
      >
        {renderPhoto('health_certificate_back', healthBackPhoto)}
      </Form.Item>,
      <Form.Item
        label="手持证件半身照"
        {...formLayout}
      >
        {renderPhoto('health_certificate_in_hand', healthHandPhoto)}
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  // 驾驶证
  const renderDrive = () => {
    // 健康证正面照
    const drivePhoto = {
      keys: driveCertificateFront ? [driveCertificateFront] : [],
      urls: driveCertificateFrontUrl ? [driveCertificateFrontUrl] : [],
    };

    // 健康证反面照
    const driveBackPhoto = {
      keys: driveCertificateBack ? [driveCertificateBack] : [],
      urls: driveCertificateBackUrl ? [driveCertificateBackUrl] : [],
    };

     // 健康证手持照
    const driveHandPhoto = {
      keys: driveCertificateInHand ? [driveCertificateInHand] : [],
      urls: driveCertificateInHandUrl ? [driveCertificateInHandUrl] : [],
    };


    const items = [
      <Form.Item
        label="证件类型"
        {...formLayout}
      >
        {
          driveCertificateType ?
            PaperworkType.description(driveCertificateType)
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="证件号码"
        {...formLayout}
      >
        {employeeDetail.drive_certificate_no || '--'}
      </Form.Item>,
      <Form.Item key="empty_drive" />,
      <Form.Item
        label="证件正面照"
        {...formLayout}
      >
        {renderPhoto('drive_certificate_front', drivePhoto)}
      </Form.Item>,
      <Form.Item
        label="证件反面照"
        {...formLayout}
      >
        {renderPhoto('drive_certificate_back', driveBackPhoto)}
      </Form.Item>,
      <Form.Item
        label="手持证件半身照"
        {...formLayout}
      >
        {renderPhoto('drive_certificate_in_hand', driveHandPhoto)}
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  return (
    <CoreContent title="身份信息">
      <Form
        className="affairs-flow-basic"
      >
        {/* 身份证 */}
        {renderIndentity()}
        {/* 健康证 */}
        {renderHealth()}
        {/* 驾驶证 */}
        {renderDrive()}
      </Form>
    </CoreContent>
  );
};

export default IdentityInfo;
