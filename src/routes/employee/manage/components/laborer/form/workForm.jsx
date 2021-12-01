/**
 * 劳动者档案 - 编辑 - 工作经历tab
 */
import moment from 'moment';
import React from 'react';
import {
  Button,
  Form,
  DatePicker,
  Row,
  Col,
  Input,
  Collapse,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  CoreContent,
} from '../../../../../../components/core';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CareerForm = ({
  form,
  employeeDetail = {}, // 劳动者详情
}) => {
  // 工作经历
  const renderWorkList = () => {
    return (
      <Form.List
        name="work_experience"
      >
        {
          (fields, { add, remove }) => (
            <React.Fragment>
              {
                fields.map((field, fieldKey) => (
                  <Row key={fieldKey}>
                    <Col span={8}>
                      <Form.Item
                        label="工作单位"
                        name={[field.name, 'employer']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入工作单位" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="曾任职岗位"
                        name={[field.name, 'position']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入职位" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="证明人姓名"
                        name={[field.name, 'certifier_name']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入证明人姓名" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="证明人电话"
                        name={[field.name, 'proof_phone']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入证明人电话" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="工作时间"
                        name={[field.name, 'work_time']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <RangePicker />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      {
                        fields.length > 1 ?
                          (
                            <Button
                              onClick={() => remove(field.name)}
                              shape="circle"
                              icon={<MinusOutlined />}
                              style={{ marginRight: 4 }}
                            />
                          ) : ''
                      }
                      {
                        fieldKey === fields.length - 1
                          ? (
                            <Button
                              onClick={() => add()}
                              shape="circle"
                              icon={<PlusOutlined />}
                            />
                          ) : ''
                      }
                    </Col>
                  </Row>
                ))
              }
            </React.Fragment>
         )
        }
      </Form.List>
    );
  };

  const initialWorkTime = Array.isArray(employeeDetail.work_experience) && employeeDetail.work_experience.length > 0 ?
    employeeDetail.work_experience.map(w => ({
      employer: w.employer,
      position: w.position,
      certifier_name: w.certifier_name,
      proof_phone: w.proof_phone,
      work_time: w.work_start_time && w.work_end_time ?
        [moment(String(w.work_start_time)), moment(String(w.work_end_time))]
        : undefined,
    }))
    : [{
      employer: undefined, // 工作单位
      position: undefined, // 曾任职岗位
      certifier_name: undefined, // 证明人姓名
      proof_phone: undefined, // 证明人电话
      work_time: undefined, // 工作时间
    }];

  const initialValues = {
    work_experience: initialWorkTime,
  };

  return (
    <CoreContent>
      <Form
        form={form}
        className="affairs-flow-basic"
        initialValues={initialValues}
      >
        <Collapse>
          <Panel header="工作经历">
            {renderWorkList()}
          </Panel>
        </Collapse>
      </Form>
    </CoreContent>
  );
};

export default CareerForm;
