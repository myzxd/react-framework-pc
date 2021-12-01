/**
 * 员工档案 - 员工 - 基本信息tab - 来源信息
 */
import React from 'react';
import {
  Form,
} from 'antd';
import {
  AccountApplyWay,
  RecommendedPlatformStaff,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const RecommendedSourceInfo = ({
  employeeDetail = {}, // 员工详情
}) => {
  const {
    application_channel_id: applyWay, // 推荐来源
    application_platform: applicationPlatform, // 渠道
  } = employeeDetail;

  // 猎头公司form item
  const renderCompanyItem = () => {
    const items = [
      <Form.Item
        label="公司名称"
        {...formLayout}
      >
        {employeeDetail.application_company_name || '--'}
      </Form.Item>,
    ];

    return items;
  };

  // 内部推荐form item
  const renderRecommendItems = () => {
    const items = [
      <Form.Item
        label="推荐人身份证号"
        {...formLayout}
      >
        {employeeDetail.referrer_identity_no || '--'}
      </Form.Item>,
      <Form.Item
        label="推荐人姓名"
        {...formLayout}
      >
        {employeeDetail.referrer_name || '--'}
      </Form.Item>,
      <Form.Item
        label="推荐人手机号"
        {...formLayout}
      >
        {employeeDetail.referrer_phone || '--'}
      </Form.Item>,
    ];

    return items;
  };

  // 招聘渠道form item
  const renderRecruitmentItem = () => {
    const items = [
      <Form.Item
        label="渠道"
        {...formLayout}
      >
        {applicationPlatform ? RecommendedPlatformStaff.description(applicationPlatform) : '--'}
      </Form.Item>,
    ];

    return items;
  };

  // 转签form item
  const renderResignItems = () => {
    const items = [
      <Form.Item
        label="平台"
        {...formLayout}
      >
        {employeeDetail.transfer_sign_plateform_name || '--'}
      </Form.Item>,
      <Form.Item
        label="供应商"
        {...formLayout}
      >
        {employeeDetail.transfer_sign_supplier_name || '--'}
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayout}
      >
        {employeeDetail.transfer_sign_post || '--'}
      </Form.Item>,
    ];

    return items;
  };

  const items = [
    <Form.Item
      label="应聘途径"
      {...formLayout}
    >
      {applyWay ? AccountApplyWay.description(applyWay) : '--'}
    </Form.Item>,
  ];

  let formItems = [...items];
  // 猎头公司
  applyWay === AccountApplyWay.company && (
    formItems = [...items, ...renderCompanyItem()]
  );

  // 内部推荐
  applyWay === AccountApplyWay.recommend && (
    formItems = [...items, ...renderRecommendItems()]
  );

  // 招聘渠道
  applyWay === AccountApplyWay.apply && (
    formItems = [...items, ...renderRecruitmentItem()]
  );
  // 转签
  applyWay === AccountApplyWay.transfer && (
    formItems = [...items, ...renderResignItems()]
  );

  return (
    <CoreContent title="推荐来源">
      <Form
        className="affairs-flow-basic"
      >
        <CoreForm items={formItems} />
      </Form>
    </CoreContent>
  );
};

export default RecommendedSourceInfo;
