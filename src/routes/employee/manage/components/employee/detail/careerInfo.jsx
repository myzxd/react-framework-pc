/**
 * 员工档案 - 员工详情 - 职业生涯tab
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
  Timeline,
  Button,
  Empty,
} from 'antd';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CareerInfo = ({
  employeeDetail = {}, // 员工详情
  onBack,
}) => {
  // 时间轴
  const renderTimeline = () => {
    const {
      employee_resume_list: employeeResumeList = [], // 任职记录
    } = employeeDetail;

    // 无数据
    if (!Array.isArray(employeeResumeList) || employeeResumeList.length < 1) return <Empty />;

    return (
      <Timeline mode="left">
        {
          employeeResumeList.map((d = {}, key) => {
            const {
              content,
            } = d;
            const time = content.slice(0, 8);
            const title = content.slice(8);
            return (
              <Timeline.Item
                label={moment(time).format('YYYY-MM-DD')}
                key={key}
              >
                <div>{title}</div>
              </Timeline.Item>
            );
          })
        }
      </Timeline>
    );
  };

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
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <Form
            className="affairs-flow-basic"
          >
            <CoreContent title="在职记录">
              {renderTimeline()}
            </CoreContent>
            <CoreContent title="工作经历">
              {renderWorkList()}
            </CoreContent>
          </Form>
        </div>
        <div
          className={style['contract-tab-scroll-button']}
        >
          <Button
            onClick={onBack}
          >返回</Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CareerInfo;
