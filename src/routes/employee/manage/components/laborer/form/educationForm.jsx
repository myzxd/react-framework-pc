/**
 * 劳动者档案 - 编辑 - 基本信息tab - 学历信息
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
  Collapse,
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
const { Panel } = Collapse;

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const EducationForm = ({
  form,
  employeeDetail = {}, // 劳动者详情
}) => {
  const items = [
    <Form.Item
      label="最高学历"
      name="highest_education"
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
      {...formLayout}
    >
      <Input placeholder="请输入专业职称" />
    </Form.Item>,
    <Form.Item
      label="外语及等级"
      name="language_level"
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
                          {...formLayout}
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
      <CorePhotosAmazon
        domain="staff"
        multiple
        namespace="degree"
      />
    </Form.Item>,
  ];

  const initialValues = {
    highest_education: employeeDetail.highest_education || undefined, // 最高学历
    professional: employeeDetail.professional || undefined, // 专业职称
    language_level: employeeDetail.language_level || undefined, // 外语及等级
    academy_list: Array.isArray(employeeDetail.academy_list) && employeeDetail.academy_list.length > 0 ?
      employeeDetail.academy_list.map(a => (
        {
          institution_name: a.institution_name,
          education: a.education,
          profession: a.profession,
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
  };

  return (
    <CoreContent>
      <Form
        form={form}
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <Collapse>
          <Panel header="学历信息">
            <CoreForm items={items} />
            {renderSchoolList()}
            <CoreForm items={photoItems} />
          </Panel>
        </Collapse>
      </Form>
    </CoreContent>
  );
};

export default EducationForm;
