/**
 * 劳动者档案 - 编辑 - 基本信息tab - 来源信息
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
} from 'antd';
import {
  AccountRecruitmentChannel,
  RecommendedPlatform,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  CommonSelectRecommendCompany,
} from '../../../../../../components/common';
import { asyncValidateIdCardNumber } from '../../../../../../application/utils';

const { Option } = Select;

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const RecommendedSourceForm = ({
  form,
  employeeDetail = {}, // 劳动者详情
  resetState, // 重置状态
}) => {
  // 推荐渠道
  const [applyWay, setApplyWay] = useState(employeeDetail.recruitment_channel_id || AccountRecruitmentChannel.other);

  useEffect(() => {
    setApplyWay(employeeDetail.recruitment_channel_id);
  }, [resetState, employeeDetail]);

  const {
    supplier_list: supplierIds, // 供应商列表
  } = employeeDetail;

  // 推荐公司form item
  const renderCompanyItem = () => {
    const items = [
      <Form.Item
        label="推荐公司"
        name="referrer_company_id"
        rules={[
          { required: true, message: '请输入推荐公司' },
        ]}
        {...formLayout}
      >
        <CommonSelectRecommendCompany
          showSearch
          optionFilterProp="children"
          placeholder="请选择推荐公司"
          suppliers={supplierIds}
        />
      </Form.Item>,
    ];

    return items;
  };

  // 内部推荐form item
  const renderRecommendItems = () => {
    const items = [
      <Form.Item
        label="推荐人身份证"
        name="referrer_identity_no"
        rules={[
          { required: true, message: '请输入推荐人身份证' },
          { validator: asyncValidateIdCardNumber },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入推荐人身份证" />
      </Form.Item>,
      <Form.Item
        label="推荐人姓名"
        name="referrer_name"
        rules={[
          { required: true, message: '请输入推荐人姓名' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入推荐人姓名" />
      </Form.Item>,
      <Form.Item
        label="推荐人手机号"
        name="referrer_phone"
        rules={[
          { required: true, message: '请输入推荐人手机号' },
          { pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>,
    ];

    return items;
  };

  // 招聘渠道form item
  const renderRecruitmentItem = () => {
    const items = [
      <Form.Item
        label="推荐平台"
        name="referrer_platform"
        rules={[
          { required: true, message: '请选择渠道' },
        ]}
        {...formLayout}
      >
        <Select placeholder="请选择推荐平台">
          <Option
            value={RecommendedPlatform.wuba}
          >
            {RecommendedPlatform.description(RecommendedPlatform.wuba)}
          </Option>
        </Select>
      </Form.Item>,
    ];

    return items;
  };

  const items = [
    <Form.Item
      label="推荐渠道"
      name="recruitment_channel_id"
      rules={[
        { required: true, message: '请选择收款方式' },
      ]}
      {...formLayout}
    >
      <Select
        placeholder="请选择推荐渠道"
        onChange={val => setApplyWay(val)}
      >
        <Option
          value={AccountRecruitmentChannel.third}
        >
          {AccountRecruitmentChannel.description(AccountRecruitmentChannel.third)}
        </Option>
        <Option
          value={AccountRecruitmentChannel.recommend}
        >
          {AccountRecruitmentChannel.description(AccountRecruitmentChannel.recommend)}
        </Option>
        <Option
          value={AccountRecruitmentChannel.thirdPlatform}
        >
          {AccountRecruitmentChannel.description(AccountRecruitmentChannel.thirdPlatform)}
        </Option>
        <Option
          value={AccountRecruitmentChannel.personal}
        >
          {AccountRecruitmentChannel.description(AccountRecruitmentChannel.personal)}
        </Option>
        <Option
          value={AccountRecruitmentChannel.transfer}
        >
          {AccountRecruitmentChannel.description(AccountRecruitmentChannel.transfer)}
        </Option>
        <Option
          value={AccountRecruitmentChannel.other}
        >
          {AccountRecruitmentChannel.description(AccountRecruitmentChannel.other)}
        </Option>
      </Select>
    </Form.Item>,
  ];

  let formItems = [...items];
  // 推荐公司
  applyWay === AccountRecruitmentChannel.third && (
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

  // initialValues
  const initialValues = {
    recruitment_channel_id: employeeDetail.recruitment_channel_id || AccountRecruitmentChannel.other, // 应聘途径
    referrer_company_id: employeeDetail.referrer_company_id || undefined, // 推荐公司
    referrer_identity_no: employeeDetail.referrer_identity_no || undefined, // 推荐人身份证
    referrer_platform: employeeDetail.referrer_platform || undefined, // 推荐平台
    referrer_name: employeeDetail.referrer_name || undefined, // 推荐人姓名
    referrer_phone: employeeDetail.referrer_phone || undefined, // 推荐人手机号
  };

  return (
    <CoreContent title="推荐来源">
      <Form
        form={form}
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <CoreForm items={formItems} />
      </Form>
    </CoreContent>
  );
};

export default RecommendedSourceForm;
