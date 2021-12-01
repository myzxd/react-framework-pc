/**
 * 员工档案 - 创建 - 基本信息tab - 学历信息
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Button,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  HighestEducation,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
} from '../../../../../../components/core';
import {
  CommonSelectEducations,
} from '../../../../../../components/common';

const { Option } = Select;
const { RangePicker } = DatePicker;

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const timeFormLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

const EducationForm = ({
  form,
  employeeDetail = {}, // 员工详情
}) => {
  const items = [
    <Form.Item
      label="最高学历"
      name="highest_education"
      rules={[
        { required: true, message: '请选择最高学历' },
      ]}
      {...formLayout}
    >
      <Select placeholder="请选择最高学历" allowClear>
        <Option
          value={HighestEducation.doctor}
        >
          {HighestEducation.description(HighestEducation.doctor)}
        </Option>
        <Option
          value={HighestEducation.master}
        >
          {HighestEducation.description(HighestEducation.master)}
        </Option>
        <Option
          value={HighestEducation.undergraduate}
        >
          {HighestEducation.description(HighestEducation.undergraduate)}
        </Option>
        <Option
          value={HighestEducation.juniorCollege}
        >
          {HighestEducation.description(HighestEducation.juniorCollege)}
        </Option>
        <Option
          value={HighestEducation.secondary}
        >
          {HighestEducation.description(HighestEducation.secondary)}
        </Option>
        <Option
          value={HighestEducation.highSchool}
        >
          {HighestEducation.description(HighestEducation.highSchool)}
        </Option>
        <Option
          value={HighestEducation.juniorHighSchool}
        >
          {HighestEducation.description(HighestEducation.juniorHighSchool)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="专业职称"
      name="professional"
      rules={[
        { required: true, message: '请输入专业职称' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入专业职称" />
    </Form.Item>,
    <Form.Item
      label="外语及等级"
      name="language_level"
      rules={[
        { required: true, message: '请输入外语及等级' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入外语及等级" />
    </Form.Item>,
  ];

  // 学校
  const renderSchoolList = () => {
    return (
      <Form.List
        name="academy_list"
      >
        {
          (fields, { add, remove }) => {
            // add的默认值
            const initVal = {
              institution_name: undefined,
              education: undefined,
              profession: undefined,
              time: undefined,
            };
            return (
              <React.Fragment>
                {
                  fields.map((field, fieldKey) => (
                    <Row key={fieldKey}>
                      <Col span={5}>
                        <Form.Item
                          label="院校名称"
                          name={[field.name, 'institution_name']}
                          fieldKey={[field.fieldKey, fieldKey]}
                          rules={[
                            { required: true, message: '请输入院校名称' },
                          ]}
                          {...formLayout}
                        >
                          <Input
                            placeholder="请输入院校名称"
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          label="第一学历"
                          name={[field.name, 'education']}
                          fieldKey={[field.fieldKey, fieldKey]}
                          rules={[
                            { required: true, message: '请输入第一学历' },
                          ]}
                          {...formLayout}
                        >
                          <CommonSelectEducations
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          label="专业"
                          name={[field.name, 'profession']}
                          fieldKey={[field.fieldKey, fieldKey]}
                          rules={[
                            { required: true, message: '请输入专业' },
                          ]}
                          {...formLayout}
                        >
                          <Input
                            placeholder="请输入专业"
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          label="时间"
                          name={[field.name, 'time']}
                          fieldKey={[field.fieldKey, fieldKey]}
                          rules={[
                            { required: true, message: '请选择时间' },
                          ]}
                          {...timeFormLayout}
                        >
                          <RangePicker />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        {
                          fields.length > 1 ?
                            (
                              <Button
                                onClick={() => remove(field.name)}
                                shape="circle"
                                icon={<MinusOutlined />}
                                style={{ margin: '0 4px' }}
                              />
                            ) : ''
                        }
                        {
                          fieldKey === fields.length - 1
                            ? (
                              <Button
                                onClick={() => add(initVal)}
                                shape="circle"
                                icon={<PlusOutlined />}
                                style={{ margin: '0 4px' }}
                              />
                            ) : ''
                        }
                      </Col>
                    </Row>
                  ))
                }
              </React.Fragment>
            );
          }
        }
      </Form.List>
    );
  };

  // 图片form items
  const photoItems = [
    <Form.Item
      label="毕业证"
      name="degree"
      {...formLayout}
    >
      <CorePhotosAmazon domain="staff" multiple namespace="degree" />
    </Form.Item>,
    <Form.Item
      label="从业资格证"
      name="certificate_photo_list"
      {...formLayout}
    >
      <CorePhotosAmazon domain="staff" multiple namespace="certificate_photo_list" />
    </Form.Item>,
    <Form.Item
      label="其他证件"
      name="other_certificate_photo_list"
      {...formLayout}
    >
      <CorePhotosAmazon domain="staff" multiple namespace="other_certificate_photo_list" />
    </Form.Item>,
  ];

  const initialValues = {
    highest_education: employeeDetail.highest_education || undefined, // 最高学历
    professional: employeeDetail.professional, // 专业职称
    language_level: employeeDetail.language_level, // 外语及等级
    academy_list: Array.isArray(employeeDetail.academy_list) && employeeDetail.academy_list.length > 0 ?
      employeeDetail.academy_list.map(a => (
        {
          institution_name: a.institution_name || undefined,
          education: a.education || undefined,
          profession: a.profession || undefined,
          time: [
            a.start_time ? moment(a.start_time) : undefined,
            a.end_time ? moment(a.end_time) : undefined,
          ],
        }
      ))
      : [{
        institution_name: undefined,
        education: undefined,
        profession: undefined,
        time: undefined,
      }], // 学习经历
    degree: {
      keys: Array.isArray(employeeDetail.degree) ? employeeDetail.degree : [],
      urls: Array.isArray(employeeDetail.degree_url) ? employeeDetail.degree_url : [],
    }, // 毕业证
    certificate_photo_list: {
      keys: Array.isArray(employeeDetail.certificate_photo_list) ?
        employeeDetail.certificate_photo_list : [],
      urls: Array.isArray(employeeDetail.certificate_photo_url_list) ?
        employeeDetail.certificate_photo_url_list : [],
    }, // 从业资格证
    other_certificate_photo_list: {
      keys: Array.isArray(employeeDetail.other_certificate_photo_list) ?
        employeeDetail.other_certificate_photo_list
        : [],
      urls: Array.isArray(employeeDetail.other_certificate_photo_url_list) ?
        employeeDetail.other_certificate_photo_url_list
        : [],
    }, // 其他证件
  };

  return (
    <CoreContent title="学历信息">
      <Form
        form={form}
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
        {renderSchoolList()}
        <CoreForm items={photoItems} />
      </Form>
    </CoreContent>
  );
};

export default EducationForm;
