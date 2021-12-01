/**
 * 员工档案 - 员工详情 - 职业生涯tab
 */
import React from 'react';
import {
  Form,
} from 'antd';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const ExperinceInfo = ({
  employeeDetail = {}, // 员工详情
}) => {
  // 工作经历
  const renderWorkList = () => {
    const workExperience = Array.isArray(employeeDetail.work_experience) && employeeDetail.work_experience.length > 0 ?
      employeeDetail.work_experience
      : [{}];
    return workExperience.map((work = {}, key) => {
      const workItems = [
        <Form.Item
          label="工作单位"
          {...formLayout}
        >
          {work.employer || '--'}
        </Form.Item>,
        <Form.Item
          label="曾任职岗位"
          {...formLayout}
        >
          {work.position || '--'}
        </Form.Item>,
        <Form.Item
          label="证明人姓名"
          {...formLayout}
        >
          {work.certifier_name || '--'}
        </Form.Item>,
        <Form.Item
          label="证明人电话"
          {...formLayout}
        >
          {work.proof_phone || '--'}
        </Form.Item>,
        <Form.Item
          label="工作时间"
          {...formLayout}
        >
          {
            work.work_start_time && work.work_end_time ?
              `${work.work_start_time} - ${work.work_end_time}`
              : '--'
          }
        </Form.Item>,
      ];
      return (
        <CoreForm items={workItems} key={key} />
      );
    });
  };

  return (
    <Form
      className="affairs-flow-basic"
    >
      <CoreContent title="工作经历">
        {renderWorkList()}
      </CoreContent>
    </Form>
  );
};

export default ExperinceInfo;
