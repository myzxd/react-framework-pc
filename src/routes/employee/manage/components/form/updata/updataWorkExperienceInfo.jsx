/**
 * 工作经历信息（编辑）
 */
import { Form } from '@ant-design/compatible';

import '@ant-design/compatible/assets/index.css';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { CoreContent } from '../../../../../../components/core';
import DynamicComponent from '../create/components/dynamicComponent';

class UpdataWorkExperienceInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染自定义表单
  renderDynamicForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { fileType } = this.props;
    const {
      profile_type: profileType,                        // 档案类型
      work_experience: workExperience = [{}], // 工作经历
    } = this.props.employeeDetail;
    const initWorkExperience = workExperience.map((item) => {
      return {
        employer: item.employer,        // 工作单位
        workPosition: item.position,    // 职位
        witness: item.certifier_name,   // 证明人姓名
        witnessPhone: item.proof_phone, // 证明人电话
        workPeriod: [
          item.work_start_time ? moment(item.work_start_time) : undefined,
          item.work_end_time ? moment(item.work_end_time) : undefined,
        ],                              // 工作时间
      };
    });
    return (
      getFieldDecorator('workExperience', {
        initialValue: initWorkExperience.length > 0 ? initWorkExperience : [{}],
      })(
        <DynamicComponent
          isModel={'work'}
          fileType={`${profileType || fileType}`}
        />,
      )
    );
  }

  render() {
    return (
      <CoreContent title="工作经历">
        <Form layout="horizontal">
          {/* 渲染自定义表单 */}
          {this.renderDynamicForm()}
        </Form>
      </CoreContent>
    );
  }
}

export default UpdataWorkExperienceInfo;
