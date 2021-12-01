/**
 * 员工档案 - 劳动者详情 - 基本信息tab - 来源信息
 */
import React from 'react';
import {
  Form,
} from 'antd';
import {
  AccountRecruitmentChannel,
  RecommendedPlatform,
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
    recruitment_channel_id: applyWay, // 推荐来源
    referrer_platform: applicationPlatform, // 渠道
  } = employeeDetail;

  // 猎头公司form item
  const renderCompanyItem = () => {
    const items = [
      <Form.Item
        label="推荐公司"
        {...formLayout}
      >
        {employeeDetail.referrer_company_id || '--'}
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
        label="推荐平台"
        {...formLayout}
      >
        {applicationPlatform ? RecommendedPlatform.description(applicationPlatform) : '--'}
      </Form.Item>,
    ];

    return items;
  };

  const items = [
    <Form.Item
      label="应聘途径"
      {...formLayout}
    >
      {applyWay ? AccountRecruitmentChannel.description(applyWay) : '--'}
    </Form.Item>,
  ];

  let formItems = [...items];
  // 猎头公司
  applyWay === AccountRecruitmentChannel.thrid && (
    formItems = [...items, ...renderCompanyItem()]
  );

  // 内部推荐
  applyWay === AccountRecruitmentChannel.recommend && (
    formItems = [...items, ...renderRecommendItems()]
  );

  // 招聘渠道
  applyWay === AccountRecruitmentChannel.thirdPlatform && (
    formItems = [...items, ...renderRecruitmentItem()]
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
