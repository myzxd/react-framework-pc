/**
 * 员工档案 - 员工详情 - 基本信息tab - 学历信息
 */
import React from 'react';
import {
  Form,
} from 'antd';
import {
  HighestEducation,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
} from '../../../../../../components/core';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const EducationInfo = ({
  employeeDetail = {}, // 劳动者详情
}) => {
  const {
    highest_education: highestEducation, // 最高学历
  } = employeeDetail;

  // 毕业证照片
  const degreePhoto = {
    keys: Array.isArray(employeeDetail.degree) ? employeeDetail.degree : [],
    urls: Array.isArray(employeeDetail.degree_url) ? employeeDetail.degree_url : [],
  };

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

  const items = [
    <Form.Item
      label="最高学历"
      {...formLayout}
    >
      {highestEducation ? HighestEducation.description(highestEducation) : '--'}
    </Form.Item>,
    <Form.Item
      label="专业职称"
      {...formLayout}
    >
      {employeeDetail.professional || '--'}
    </Form.Item>,
    <Form.Item
      label="外语及等级"
      {...formLayout}
    >
      {employeeDetail.language_level || '--'}
    </Form.Item>,
  ];

  // 图片form items
  const photoItems = [
    <Form.Item
      label="毕业证"
      {...formLayout}
    >
      {renderPhoto('graduation_certificate', degreePhoto)}
    </Form.Item>,
  ];

  // 学校
  const renderSchoolList = () => {
    const academyList = Array.isArray(employeeDetail.academy_list) && employeeDetail.academy_list.length > 0 ?
      employeeDetail.academy_list
      : [{}];
    return academyList.map((school, key) => {
      const {
        start_time: startTime, // 开始时间
        end_time: endTime, // 结束时间
      } = school;
      const formItems = [
        <Form.Item
          label="院校名称"
          {...formLayout}
        >
          {school.institution_name || '--'}
        </Form.Item>,
        <Form.Item
          label="第一学历"
          {...formLayout}
        >
          {school.education || '--'}
        </Form.Item>,
        <Form.Item
          label="专业"
          {...formLayout}
        >
          {school.profession || '--'}
        </Form.Item>,
        <Form.Item
          label="时间"
          {...formLayout}
        >
          {
            startTime && endTime ?
              `${startTime} - ${endTime}`
              : '--'
          }
        </Form.Item>,
      ];

      return (
        <CoreForm items={formItems} key={key} cols={4} />
      );
    });
  };

  return (
    <CoreContent title="学历信息">
      <Form
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
        {renderSchoolList()}
        <CoreForm items={photoItems} />
      </Form>
    </CoreContent>
  );
};

export default EducationInfo;
