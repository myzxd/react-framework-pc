/**
 * 个人信息
 * */
import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { Gender, PoliticalStatusType, MaritalStatusType, FileType } from '../../../../../application/define';

function ComponentFormBaseInfo(props) {
  const employeeDetail = dot.get(props, 'employeeDetail', {});

   // 判断是否是人员档案
  if (FileType.staff === Number(employeeDetail.profile_type)) {
    formItems.splice(10, 0,
      {
        label: '工作地',
        form: <span>{dot.get(employeeDetail, 'work_province_name', '--')} - {dot.get(employeeDetail, 'work_city_name', '--')}</span>,
      },
    );

    // 工作邮箱
    formItems.splice(11, 0,
      {
        label: '工作邮箱',
        form: <span>{dot.get(employeeDetail, 'work_email', '--')}</span>,
      },
    );
  }
  const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

  const formItems = [
    {
      label: '姓名',
      form: dot.get(employeeDetail, 'name', '--') || '--',
    }, {
      label: '性别',
      form: Gender.description(dot.get(employeeDetail, 'gender_id')),
    }, {
      label: '出生日期',
      form: dot.get(employeeDetail, 'born_in') ? moment(`${dot.get(employeeDetail, 'born_in')}`).format('YYYY-MM-DD') : '--',
    }, {
      label: '年龄',
      form: dot.get(employeeDetail, 'age', '--') || '--',
    }, {
      label: '民族',
      form: dot.get(employeeDetail, 'national', '--') || '--',
    }, {
      label: '政治面貌',
      form: PoliticalStatusType.description(employeeDetail.politics_status),
    }, {
      label: '婚姻状况',
      form: MaritalStatusType.description(employeeDetail.marital_status),
    }, {
      label: '籍贯',
      form: dot.get(employeeDetail, 'birth_place', '--') || '--',
    }, {
      label: '户口所在地',
      form: dot.get(employeeDetail, 'native_place', '--') || '--',
    }, {
      label: '常居地',
      form: dot.get(employeeDetail, 'often_address', '--') || '--',
    }, {
      label: '手机号',
      form: dot.get(employeeDetail, 'phone', '--') || '--',
    }, {
      label: '固定电话',
      form: dot.get(employeeDetail, 'telephone', '--') || '--',
    }, {
      label: '个人邮箱',
      form: dot.get(employeeDetail, 'email', '--') || '--',
    }, {
      label: '学历',
      form: dot.get(employeeDetail, 'education', '--') || '--',
    }, {
      label: '紧急联系人',
      form: dot.get(employeeDetail, 'emergency_contact', '--') || '--',
    }, {
      label: '紧急联系人电话',
      form: dot.get(employeeDetail, 'emergency_contact_phone', '--') || '--',
    }, {
      label: '身高',
      form: dot.get(employeeDetail, 'height') ? `${dot.get(employeeDetail, 'height')}cm` : '--',
    }, {
      label: '体重',
      form: dot.get(employeeDetail, 'weight') ? `${dot.get(employeeDetail, 'weight')}kg` : '--',
    }, {
      label: '星座',
      form: dot.get(employeeDetail, 'constellation', '--') || '--',
    }, {
      label: '兴趣爱好',
      form: dot.get(employeeDetail, 'interest', '--') || '--',
    }, {
      label: '特长',
      form: dot.get(employeeDetail, 'speciality', '--') || '--',
    },
  ];

  return (
    <CoreContent title="基本信息">
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    </CoreContent>
  );
}

export default ComponentFormBaseInfo;
