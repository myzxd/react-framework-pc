/**
 * 学历信息(创建)(废弃)
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select } from 'antd';

// import CorePhotos from '../components/corePhotos';
import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../components/core';
import { HighestEducation } from '../../../../../../application/define';
import DynamicComponent from './components/dynamicComponent';

const { Option } = Select;

class EducationInfo extends Component {
  static propTypes = {
    form: PropTypes.object, // 父组件表单form
  }

  static defaultProps = {
    form: {},               // 父组件表单form
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染自定义表单
  renderDynamicForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('learnExperience', {
        initialValue: [{}],
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
    // 使用人员id，作为命名空间
    const namespace = 'EducationInfo';
    const values = {
      keys: [],
      urls: [],
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
    const formItems = [
      {
        label: '最高学历',
        key: 'highestEducation',
        form: getFieldDecorator('highestEducation')(
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
        form: getFieldDecorator('jobTitle')(
          <Input placeholder="请输入专业职称" />,
        ),
      },
      {
        label: '外语及等级',
        key: 'foreignLanguage',
        form: getFieldDecorator('foreignLanguage')(
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
    return (
      <CoreContent title="学历信息">
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

export default EducationInfo;
