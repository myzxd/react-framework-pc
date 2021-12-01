/**
 * 员工档案 - 创建 - 基本信息tab - 来源信息
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
} from 'antd';
import {
  AccountApplyWay,
  RecommendedPlatformStaff,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  CommonSelectPlatforms,
  CommonSelectSuppliers,
} from '../../../../../../components/common';
import { asyncValidateIdCardNumber } from '../../../../../../application/utils';

const { Option } = Select;

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const RecommendedSourceForm = ({
  form,
  employeeDetail = {}, // 员工详情
  resetState, // 重置状态
  specialFields,
}) => {
  // 应聘途径
  const [applyWay, setApplyWay] = useState(employeeDetail.application_channel_id);

  // 平台
  const [platform, setPlatform] = useState(employeeDetail.transfer_sign_platform);

  useEffect(() => {
    setApplyWay(employeeDetail.application_channel_id);
    setPlatform(employeeDetail.transfer_sign_platform);
  }, [resetState, employeeDetail]);

  useEffect(() => {
    if (specialFields
      && Object.keys(specialFields).length > 0
      && specialFields.application_channel_id
    ) {
      setApplyWay(specialFields.application_channel_id);

      specialFields.transfer_sign_platform && (
      setPlatform(specialFields.transfer_sign_platform)
      );
    }
  }, [specialFields]);

  // 猎头公司form item
  const renderCompanyItem = () => {
    const items = [
      <Form.Item
        label="公司名称"
        name="application_company_name"
        rules={[
          { required: true, message: '请输入公司名称' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入公司名称" />
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
          {
            required: true,
            validator: asyncValidateIdCardNumber,
          },
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
          { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' },
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
        label="渠道"
        name="application_platform"
        rules={[
          { required: true, message: '请选择渠道' },
        ]}
        {...formLayout}
      >
        <Select placeholder="请选择渠道">
          <Option
            value={RecommendedPlatformStaff.zhiLian}
          >
            {RecommendedPlatformStaff.description(RecommendedPlatformStaff.zhiLian)}
          </Option>
          <Option
            value={RecommendedPlatformStaff.BOSS}
          >
            {RecommendedPlatformStaff.description(RecommendedPlatformStaff.BOSS)}
          </Option>
          <Option
            value={RecommendedPlatformStaff.liePin}
          >
            {RecommendedPlatformStaff.description(RecommendedPlatformStaff.liePin)}
          </Option>
          <Option
            value={RecommendedPlatformStaff.other}
          >
            {RecommendedPlatformStaff.description(RecommendedPlatformStaff.other)}
          </Option>
        </Select>
      </Form.Item>,
    ];

    return items;
  };

  // 转签form item
  const renderResignItems = () => {
    const items = [
      <Form.Item
        label="平台"
        name="transfer_sign_platform"
        rules={[
          { required: true, message: '请选择平台' },
        ]}
        {...formLayout}
      >
        <CommonSelectPlatforms
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={val => setPlatform(val)}
        />
      </Form.Item>,
      <Form.Item
        label="供应商"
        name="transfer_sign_supplier"
        rules={[
          { required: true, message: '请选择供应商' },
        ]}
        {...formLayout}
      >
        <CommonSelectSuppliers
          platforms={platform}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择供应商"
        />
      </Form.Item>,
      <Form.Item
        label="岗位"
        name="transfer_sign_post"
        rules={[
          { required: true, message: '请输入岗位' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入岗位" />
      </Form.Item>,
    ];

    return items;
  };

  const items = [
    <Form.Item
      label="应聘途径"
      name="application_channel_id"
      rules={[
        { required: true, message: '请选择收款方式' },
      ]}
      {...formLayout}
    >
      <Select
        placeholder="请选择应聘途径"
        onChange={val => setApplyWay(val)}
      >
        <Option
          value={AccountApplyWay.company}
        >
          {AccountApplyWay.description(AccountApplyWay.company)}
        </Option>
        <Option
          value={AccountApplyWay.recommend}
        >
          {AccountApplyWay.description(AccountApplyWay.recommend)}
        </Option>
        <Option
          value={AccountApplyWay.apply}
        >
          {AccountApplyWay.description(AccountApplyWay.apply)}
        </Option>
        <Option
          value={AccountApplyWay.transfer}
        >
          {AccountApplyWay.description(AccountApplyWay.transfer)}
        </Option>
        <Option
          value={AccountApplyWay.hr}
        >
          {AccountApplyWay.description(AccountApplyWay.hr)}
        </Option>
        <Option
          value={AccountApplyWay.other}
        >
          {AccountApplyWay.description(AccountApplyWay.other)}
        </Option>
      </Select>
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

  // initialValues
  const initialValues = {
    application_channel_id: employeeDetail.application_channel_id || AccountApplyWay.other, // 应聘途径
    application_company_name: employeeDetail.application_company_name || undefined, // 公司名称
    referrer_identity_no: employeeDetail.referrer_identity_no || undefined, // 推荐人身份证
    referrer_name: employeeDetail.referrer_name || undefined, // 推荐人姓名
    referrer_phone: employeeDetail.referrer_phone || undefined, // 推荐人手机号
    application_platform: employeeDetail.application_platform || undefined, // 渠道
    transfer_sign_platform: employeeDetail.transfer_sign_platform || undefined, // 平台
    transfer_sign_supplier: employeeDetail.transfer_sign_supplier || undefined, // 供应商
    transfer_sign_post: employeeDetail.transfer_sign_post || undefined, // 岗位
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
