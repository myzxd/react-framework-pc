/**
 * 劳动者档案 - 编就 - 基本信息tab - 个人信息
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  InputNumber,
} from 'antd';
import {
  Gender,
  MaritalStatusType,
  PoliticalStatusType,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  // CorePhotosAmazon,
} from '../../../../../../components/core';
import {
  CommonSelectNations,
  CommonSelectConstellation,
  CommonSelectEducations,
} from '../../../../../../components/common';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const { Option } = Select;

const PersonalForm = ({
  form,
  employeeDetail = {}, // 员工档案
}) => {
  const items = [
    <Form.Item
      label="姓名"
      name="name"
      rules={[
        { required: true, message: '请输入姓名' },
        { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入姓名" disabled />
    </Form.Item>,
    <Form.Item
      label="手机号"
      name="phone"
      rules={[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入姓名" disabled />
    </Form.Item>,
    <Form.Item
      label="性别"
      name="gender_id"
      rules={[
        { required: true, message: '请选择性别' },
      ]}
      {...formLayout}
    >
      <Radio.Group disabled>
        <Radio
          value={Gender.male}
        >{Gender.description(Gender.male)}</Radio>
        <Radio
          value={Gender.female}
        >{Gender.description(Gender.female)}</Radio>
      </Radio.Group>
    </Form.Item>,
    <Form.Item
      label="民族"
      name="national"
      rules={[
        { required: true, message: '请选择民族' },
      ]}
      {...formLayout}
    >
      <CommonSelectNations />
    </Form.Item>,
    <Form.Item
      label="出生日期"
      name="born_in"
      {...formLayout}
    >
      <DatePicker
        allowClear={false}
        disabledDate={c => (c && c > moment().endOf('day'))}
      />
    </Form.Item>,
    <Form.Item
      label="婚姻状况"
      name="marital_status"
      {...formLayout}
    >
      <Select placeholder="请选择婚姻状况">
        <Option
          value={MaritalStatusType.married}
        >
          {MaritalStatusType.description(MaritalStatusType.married)}
        </Option>
        <Option
          value={MaritalStatusType.unmarried}
        >
          {MaritalStatusType.description(MaritalStatusType.unmarried)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="户口所在地"
      name="native_place"
      {...formLayout}
    >
      <Input placeholder="请输入户口所在地" />
    </Form.Item>,
    <Form.Item
      label="常居地"
      name="often_address"
      rules={[{ required: true }]}
      {...formLayout}
    >
      <Input placeholder="请输入常居地" />
    </Form.Item>,
    <Form.Item
      label="紧急联系人"
      name="emergency_contact"
      {...formLayout}
    >
      <Input placeholder="请输入紧急联系人" />
    </Form.Item>,
    <Form.Item
      label="紧急联系电话"
      name="emergency_contact_phone"
      rules={[
        { required: true, message: '请输入紧急联系电话' },
        { pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入紧急联系电话" />
    </Form.Item>,
    <Form.Item
      label="政治面貌"
      name="politics_status"
      {...formLayout}
    >
      <Select placeholder="请选择政治面貌">
        <Option
          value={PoliticalStatusType.partyMember}
        >
          {PoliticalStatusType.description(PoliticalStatusType.partyMember)}
        </Option>
        <Option
          value={PoliticalStatusType.prepPartyMember}
        >
          {PoliticalStatusType.description(PoliticalStatusType.prepPartyMember)}
        </Option>
        <Option
          value={PoliticalStatusType.member}
        >
          {PoliticalStatusType.description(PoliticalStatusType.member)}
        </Option>
        <Option
          value={PoliticalStatusType.masses}
        >
          {PoliticalStatusType.description(PoliticalStatusType.masses)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="籍贯"
      name="birth_place"
      {...formLayout}
    >
      <Input placeholder="请输入籍贯" />
    </Form.Item>,
    <Form.Item
      label="个人邮箱"
      name="email"
      rules={[
        { type: 'email', message: '请输入正确邮箱地址' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入个人邮箱" />
    </Form.Item>,
    <Form.Item
      label="固定电话"
      name="telephone"
      {...formLayout}
    >
      <Input placeholder="请输入固定电话" />
    </Form.Item>,
    <Form.Item
      label="身高"
      name="height"
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入身高"
        formatter={v => `${v}cm`}
        parser={v => v.replace('cm', '')}
      />
    </Form.Item>,
    <Form.Item
      label="体重"
      name="weight"
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入体重"
        formatter={v => `${v}kg`}
        parser={v => v.replace('kg', '')}
      />
    </Form.Item>,
    <Form.Item
      label="爱好"
      name="interest"
      {...formLayout}
    >
      <Input placeholder="请输入爱好" />
    </Form.Item>,
    <Form.Item
      label="星座"
      name="constellation"
      {...formLayout}
    >
      <CommonSelectConstellation />
    </Form.Item>,
    <Form.Item
      label="特长"
      name="speciality"
      {...formLayout}
    >
      <Input placeholder="请输入特长" />
    </Form.Item>,
    <Form.Item
      label="学历"
      name="education"
      rules={[
        { required: true, message: '请选择学历' },
      ]}
      {...formLayout}
    >
      <CommonSelectEducations allowClear />
    </Form.Item>,
  ];

  // 获取initialValues
  const getInitialValues = () => {
    // 新建
    if (Object.keys(employeeDetail).length < 1) return {};
    // 编辑
    return {
      name: employeeDetail.name || undefined, // 姓名
      phone: employeeDetail.phone || undefined, // 手机号
      gender_id: employeeDetail.gender_id || undefined, // 性别
      national: employeeDetail.national || undefined, // 民族
      born_in: employeeDetail.born_in ? moment(String(employeeDetail.born_in)) : '', // 出生日期
      marital_status: employeeDetail.marital_status || undefined, // 婚姻状况
      native_place: employeeDetail.native_place || undefined, // 户口所在地
      often_address: employeeDetail.often_address || undefined, // 常居地
      emergency_contact: employeeDetail.emergency_contact || undefined, // 紧急联系人
      emergency_contact_phone: employeeDetail.emergency_contact_phone || undefined, // 紧急联系人电话
      email: employeeDetail.email || undefined, // 个人邮箱
      telephone: employeeDetail.telephone || undefined, // 固定电话
      height: employeeDetail.height || undefined, // 身高
      weight: employeeDetail.weight || undefined, // 体重
      interest: employeeDetail.interest || undefined, // 爱好
      constellation: employeeDetail.constellation || undefined, // 星座
      speciality: employeeDetail.speciality || undefined, // 特长
      education: employeeDetail.education, // 学历
      politics_status: employeeDetail.politics_status || undefined, // 政治面貌
      birth_place: employeeDetail.birth_place || undefined, // 籍贯
    };
  };

  return (
    <CoreContent title="个人信息">
      <Form
        form={form}
        initialValues={getInitialValues()}
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
      </Form>
    </CoreContent>
  );
};

export default PersonalForm;
