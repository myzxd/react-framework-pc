/**
 * 工作经历信息（创建）(废弃)
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { CoreContent } from '../../../../../../components/core';
import DynamicComponent from './components/dynamicComponent';

class WorkExperienceInfo extends Component {
  static propTypes = {
    form: PropTypes.object, // 父组件表单form
    fileType: PropTypes.string,           // 档案类型
  }

  static defaultProps = {
    form: {},               // 父组件表单form
    fileType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染自定义表单
  renderDynamicForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('workExperience', {
        initialValue: [{}],
      })(
        <DynamicComponent
          isModel={'work'}
          fileType={this.props.fileType}
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

export default WorkExperienceInfo;
