/**
 * 员工档案 - 员工详情 - 基本信息 - 个人信息
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
} from 'antd';
import {
  CoreContent,
  CoreForm,
  CorePhotosAmazon,
  CoreOaUpload,
} from '../../../../../../components/core';
import {
  PoliticalStatusType,
  MaritalStatusType,
  Gender,
} from '../../../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formOneLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

const PersonalInfo = ({
  employeeDetail = {}, // 员工详情
}) => {
  const {
    politics_status: politicalStatus, // 政治面貌
    marital_status: maritalStatus, // 婚姻状况
    work_province_name: workProvinceName, // 工作地省份
    work_city_name: workCityName, // 工作地市
    born_in: bornIn, // 出生日期
    gender_id: genderId, // 性别
  } = employeeDetail;

  // 应聘人员登记表
  const candidatesPhotoList = {
    keys: Array.isArray(employeeDetail.candidates_photo_list) ?
      employeeDetail.candidates_photo_list : [],
    urls: Array.isArray(employeeDetail.candidates_photo_url_list) ?
      employeeDetail.candidates_photo_url_list : [],
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
      label="婚姻状况"
      {...formLayout}
    >
      {maritalStatus ? MaritalStatusType.description(maritalStatus) : '--'}
    </Form.Item>,
    <Form.Item
      label="工作地"
      {...formLayout}
    >
      {
        workProvinceName && workCityName
          ? `${workProvinceName}-${workCityName}`
          : '--'
      }
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
      label="年龄"
      {...formLayout}
    >
      {
        employeeDetail.born_in ?
          moment().year() - moment(String(employeeDetail.born_in)).year()
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="政治面貌"
      {...formLayout}
    >
      {politicalStatus ? PoliticalStatusType.description(politicalStatus) : '--'}
    </Form.Item>,
    <Form.Item
      label="籍贯"
      {...formLayout}
    >
      {employeeDetail.birth_place || '--'}
    </Form.Item>,
    <Form.Item
      label="工作邮箱"
      {...formLayout}
    >
      {employeeDetail.work_email || '--'}
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
      label="身高"
      {...formLayout}
    >
      {
        employeeDetail.height
          ? `${employeeDetail.height}cm`
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="体重"
      {...formLayout}
    >
      {
        employeeDetail.weight
          ? `${employeeDetail.weight}kg`
          : '--'
      }
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
    <Form.Item
      label="学历"
      {...formLayout}
    >
      {employeeDetail.education || '--'}
    </Form.Item>,
    {
      span: 24,
      render: (
        <Form.Item
          label="应聘人员登记表"
          {...formOneLayout}
        >
          {renderPhoto('candidates_photo_list', candidatesPhotoList)}
        </Form.Item>
      ),
    },
    {
      span: 24,
      render: (
        <Form.Item
          label="附件"
          {...formOneLayout}
        >
          <CoreOaUpload
            domain="staff"
            displayMode
            value={CoreOaUpload.getInitialValue(employeeDetail, 'enclosure_urls')}
          />
        </Form.Item>
      ),
    },
    // { 隐藏 @彭悦
    //   span: 24,
    //   render: (
    //     <Form.Item
    //       label="备注"
    //       {...formOneLayout}
    //     >
    //       <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
    //         {employeeDetail.remark || '--'}
    //       </div>
    //     </Form.Item>
    //   ),
    // },
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
