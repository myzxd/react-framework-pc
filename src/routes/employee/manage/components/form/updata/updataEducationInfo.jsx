/**
 * 学历信息（编辑）
 */
import is from 'is_js';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select } from 'antd';

// import CorePhotos from '../components/corePhotos';
import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../components/core';
import { HighestEducation } from '../../../../../../application/define';
import DynamicComponent from '../create/components/dynamicComponent';

const { Option } = Select;

class UpdataEducationInfo extends Component {
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
    const { employeeDetail } = this.props;
    let academyList = [{}];
    // 学习经历
    if (is.existy(employeeDetail.academy_list) && is.not.empty(employeeDetail.academy_list)) {
      academyList = employeeDetail.academy_list;
    }
    const initLearnExperience = academyList.map((item) => {
      return {
        institutionName: item.institution_name, // 院校名称
        dynamicEducation: item.education,       // 学历
        profession: item.profession,            // 专业
        period: [
          item.start_time ? moment(item.start_time) : undefined,
          item.end_time ? moment(item.end_time) : undefined,
        ],                                      // 学习时间
      };
    });
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('learnExperience', {
        initialValue: initLearnExperience.length > 0 ? initLearnExperience : [{}],
      })(
        <DynamicComponent
          isModel={'education'}
        />,
      )
    );
  }

  // 渲染学位证照片信息
  renderDegreeCertificatePhotos = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      _id: id, // 人员id
      degree: degreePhotoList = [],
      degree_url: degreePhotoListUrl = [],
    } = this.props.employeeDetail;
    // 使用人员id，作为命名空间
    const namespace = `EducationInfo-${id || ''}`;
    const values = {
      keys: degreePhotoList,
      urls: degreePhotoListUrl,
    };
    const formItems = [
      {
        label: '学位证照片',
        form: getFieldDecorator('degreeCertificatePhotos', {
          initialValue: values,
        })(
          <CorePhotosAmazon domain="staff" multiple namespace={namespace} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  // 渲染表单信息
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      highest_education: initHighestEducation,  // 最高学历
      professional: initJobTitle = '',          // 专业职称
      language_level: initForeignLanguage = '', // 外语及等级
    } = this.props.employeeDetail;
    const formItems = [
      {
        label: '最高学历',
        key: 'highestEducation',
        form: getFieldDecorator('highestEducation', {
          initialValue: initHighestEducation ? `${initHighestEducation}` : undefined,
        })(
          <Select placeholder="请选择最高学历" allowClear>
            <Option value={`${HighestEducation.doctor}`}>{HighestEducation.description(HighestEducation.doctor)}</Option>
            <Option value={`${HighestEducation.master}`}>{HighestEducation.description(HighestEducation.master)}</Option>
            <Option value={`${HighestEducation.undergraduate}`}>{HighestEducation.description(HighestEducation.undergraduate)}</Option>
            <Option value={`${HighestEducation.juniorCollege}`}>{HighestEducation.description(HighestEducation.juniorCollege)}</Option>
            <Option value={`${HighestEducation.secondary}`}>{HighestEducation.description(HighestEducation.secondary)}</Option>
            <Option value={`${HighestEducation.highSchool}`}>{HighestEducation.description(HighestEducation.highSchool)}</Option>
            <Option value={`${HighestEducation.juniorHighSchool}`}>{HighestEducation.description(HighestEducation.juniorHighSchool)}</Option>
          </Select>,
        ),
      },
      {
        label: '专业职称',
        key: 'jobTitle',
        form: getFieldDecorator('jobTitle', {
          initialValue: initJobTitle,
        })(
          <Input placeholder="请输入专业职称" />,
        ),
      },
      {
        label: '外语及等级',
        key: 'foreignLanguage',
        form: getFieldDecorator('foreignLanguage', {
          initialValue: initForeignLanguage,
        })(
          <Input placeholder="请输入外语及等级" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {/* 渲染自定义表单 */}
        {this.renderDynamicForm()}
      </div>
    );
  }

  render() {
    const { isUpdata } = this.props;
    return (
      <CoreContent title={`${isUpdata ? '教育经历' : '学历信息'}`}>
        <Form layout="horizontal">
          {/* 渲染表单信息 */}
          {this.renderForm()}
          {/* 渲染学位证照片信息 */}
          {this.renderDegreeCertificatePhotos()}
        </Form>
      </CoreContent>
    );
  }
}

export default UpdataEducationInfo;
