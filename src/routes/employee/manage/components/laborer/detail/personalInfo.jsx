/**
 * 员工档案 - 劳动者详情 - 基本信息 - 个人信息
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
} from 'antd';
import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import {
  PoliticalStatusType,
  MaritalStatusType,
  Gender,
} from '../../../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const PersonalInfo = ({
  employeeDetail = {}, // 员工详情
}) => {
  const {
    politics_status: politicalStatus, // 政治面貌
    marital_status: maritalStatus, // 婚姻状况
    born_in: bornIn, // 出生日期
    gender_id: genderId, // 性别
  } = employeeDetail;

  const items = [
    <Form.Item
      label="姓名"
      {...formLayout}
    >
      {employeeDetail.name || '--'}
    </Form.Item>,
    <Form.Item
      label="手机号"
      {...formLayout}
    >
      {employeeDetail.phone || '--'}
    </Form.Item>,
    <Form.Item
      label="性别"
      {...formLayout}
    >
      {
        genderId ? Gender.description(genderId) : '--'
      }
    </Form.Item>,
    <Form.Item
      label="民族"
      {...formLayout}
    >
      {employeeDetail.national || '--'}
    </Form.Item>,
    <Form.Item
      label="出生日期"
      {...formLayout}
    >
      {
        bornIn ? moment(String(bornIn)).format('YYYY-MM-DD') : '--'
      }
    </Form.Item>,
    <Form.Item
      label="政治面貌"
      {...formLayout}
    >
      {politicalStatus ? PoliticalStatusType.description(politicalStatus) : '--'}
    </Form.Item>,
    <Form.Item
      label="婚姻状况"
      {...formLayout}
    >
      {maritalStatus ? MaritalStatusType.description(maritalStatus) : '--'}
    </Form.Item>,
    <Form.Item
      label="籍贯"
      {...formLayout}
    >
      {employeeDetail.birth_place || '--'}
    </Form.Item>,
    <Form.Item
      label="户口所在地"
      {...formLayout}
    >
      {employeeDetail.native_place || '--'}
    </Form.Item>,
    <Form.Item
      label="常居地"
      {...formLayout}
    >
      {employeeDetail.often_address || '--'}
    </Form.Item>,
    <Form.Item
      label="个人邮箱"
      {...formLayout}
    >
      {employeeDetail.email || '--'}
    </Form.Item>,
    <Form.Item
      label="固定电话"
      {...formLayout}
    >
      {employeeDetail.telephone || '--'}
    </Form.Item>,
    <Form.Item
      label="紧急联系人"
      {...formLayout}
    >
      {employeeDetail.emergency_contact || '--'}
    </Form.Item>,
    <Form.Item
      label="紧急联系电话"
      {...formLayout}
    >
      {employeeDetail.emergency_contact_phone || '--'}
    </Form.Item>,
    <Form.Item
      label="学历"
      {...formLayout}
    >
      {employeeDetail.education || '--'}
    </Form.Item>,
    <Form.Item
      label="身高"
      {...formLayout}
    >
      {employeeDetail.height || '--'}
    </Form.Item>,
    <Form.Item
      label="体重"
      {...formLayout}
    >
      {employeeDetail.weight || '--'}
    </Form.Item>,
    <Form.Item
      label="爱好"
      {...formLayout}
    >
      {employeeDetail.interest || '--'}
    </Form.Item>,
    <Form.Item
      label="星座"
      {...formLayout}
    >
      {employeeDetail.constellation || '--'}
    </Form.Item>,
    <Form.Item
      label="特长"
      {...formLayout}
    >
      {employeeDetail.speciality || '--'}
    </Form.Item>,
  ];

  return (
    <CoreContent title="个人信息">
      <Form
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
      </Form>
    </CoreContent>
  );
};

export default PersonalInfo;
