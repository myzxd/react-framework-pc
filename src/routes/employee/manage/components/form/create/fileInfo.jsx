/**
 * 档案信息(创建)
 */
import dot from 'dot-prop';
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Input } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonSelectScene } from '../../../../../../components/common';
import {
  FileType,
} from '../../../../../../application/define';
import StaffDepartments from '../components/staffDepartments';

const { Option } = Select;
const noop = () => {};

class FileInfo extends Component {
  static propTypes = {
    onChangeIndustryType: PropTypes.func.isRequired, // 更改所属场景事件
    fileType: PropTypes.string.isRequired,           // 档案类型
  }

  static defaultProps = {
    onChangeIndustryType: noop,
    fileType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  staffDepartmentsValidator = (rule, value, callback) => {
    callback();
  }

  // 渲染表单信息
  renderForm = () => {
    const { onChangeIndustryType, fileType, employeeDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      is_organization: isOrganization,                  // 不计入占编数统计
      department_job_relation_info: departmentJobRelationInfo = {},                    // 设置为主岗的部门、岗位信息
      pluralism_department_job_relation_list: pluralismDepartmentJobRelationList = [], // 设置为主岗的部门、岗位信息
    } = employeeDetail;
    const initialStaffDepartments = [
      {
        department: dot.get(departmentJobRelationInfo, 'department_info._id', ''), // 部门id
        post: dot.get(departmentJobRelationInfo, 'job_info._id', ''),              // 岗位id
        podepartmentJobRelationId: dot.get(departmentJobRelationInfo, '_id', ''),  // 部门岗位关系id
        isSelected: true,                                                          // 是否为主岗
        isOrganization: dot.get(isOrganization, true), // 不计入占编数统计
      },
      ...pluralismDepartmentJobRelationList.map((item) => {
        return {
          department: dot.get(item, 'department_info._id', ''),
          post: dot.get(item, 'job_info._id', ''),
          podepartmentJobRelationId: dot.get(item, '_id', ''),
          isSelected: false,
          isOrganization: true,  // 不计入占编数统计
        };
      }),
    ];
    const formItems = [
      {
        label: '档案类型',
        key: 'fileType',
        form: getFieldDecorator('fileType', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: fileType,
        })(
          <Select placeholder="请选择档案类型">
            {
              fileType === `${FileType.second}`
              && <Option value={`${FileType.second}`}>{FileType.description(FileType.second)}</Option>
            }
            {
              fileType === `${FileType.staff}`
              && <Option value={`${FileType.staff}`}>{FileType.description(FileType.staff)}</Option>
            }
          </Select>,
        ),
      },
    ];
    // 档案类型为劳动者档案时
    if (`${fileType}` === `${FileType.second}`) {
      formItems.push(
        {
          label: '所属场景',
          key: 'industryType',
          form: getFieldDecorator('industryType', {
            rules: [{ required: true, message: '请选择内容' }],
          })(
            <CommonSelectScene enumeratedType="industry" onChange={onChangeIndustryType} />,
          ),
        },
        {
          label: '职能',
          key: 'post',
          form: getFieldDecorator('post')(
            <Input placeholder="请填写职能" />,
          ),
        },
        {
          label: '个户编号',
          key: 'householdNumber',
          form: getFieldDecorator('householdNumber')(
            <Input placeholder="请填写个户编号" />,
          ),
        },
        {
          label: '个独编号',
          key: 'unityNumber',
          form: getFieldDecorator('unityNumber')(
            <Input placeholder="请填写个独编号" />,
          ),
        },
        {
          label: '个独名称',
          key: 'unityName',
          form: getFieldDecorator('unityName')(
            <Input placeholder="请填写个独名称" />,
          ),
        },
      );
    }
    const staffDepartmentFormItems = [
      {
        label: '',
        form: getFieldDecorator('staffDepartments', {
          rules: [{
            required: true,
            validator: this.staffDepartmentsValidator,
          }],
          initialValue: is.existy(employeeDetail) && is.not.empty(employeeDetail) ?
            initialStaffDepartments : [{ isOrganization: true }],
        })(
          <StaffDepartments isEdit />,
        ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    const staffDepartmentLayout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {
          `${fileType}` === `${FileType.staff}`
          && <DeprecatedCoreForm items={staffDepartmentFormItems} cols={1} layout={staffDepartmentLayout} />
        }
      </Form>
    );
  }

  render() {
    return (
      <CoreContent title="档案信息">
        {/* 渲染档案信息表单 */}
        {this.renderForm()}
      </CoreContent>
    );
  }
}

export default FileInfo;
