/**
 * 档案信息(编辑)
 */
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  FileType,
} from '../../../../../../application/define';
import StaffDepartments from '../components/staffDepartments';
import Operate from '../../../../../../application/define/operate';

class FileInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  staffDepartmentsValidator = (rule, value, callback) => {
    callback();
  }

  // 渲染表单信息
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      _id: id = '--',
      profile_type: fileType,                        // 档案类型
      industry_name: industryName,                   // 所属场景
      personal_company_no: initHouseholdNumber = '', // 个户编号
      company_no: initUnityNumber = '',              // 个独编号
      company_name: initUnityName = '',              // 个独名称
      office: initFunction,                          // 职能
      staff_no: initStaffno,                         // 人员编号
      // station: initNowJob,                           // 当前岗位
      // station_level: initEmployeeLevel,              // 岗位等级
      is_organization: isOrganization,                  // 不计入占编数统计
      department_job_relation_info: departmentJobRelationInfo = {},                    // 设置为主岗的部门、岗位信息
      pluralism_department_job_relation_list: pluralismDepartmentJobRelationList = [], // 设置为主岗的部门、岗位信息
    } = this.props.employeeDetail;
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
        label: 'BOSS人员ID',
        form: <span>{id}</span>,
      },
      {
        label: '档案类型',
        key: 'fileType',
        form: <span>{FileType.description(fileType)}</span>,
      },
    ];
    // 档案类型为劳动者档案时
    if (`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`) {
      formItems.push(
        {
          label: '所属场景',
          key: 'industryType',
          form: <span>{industryName || '--'}</span>,
        },
        {
          label: '职能',
          key: 'post',
          form: <span>{initFunction || '--'}</span>,
        },
        {
          label: '个户编号',
          key: 'householdNumber',
          form: <span>{initHouseholdNumber || '--'}</span>,
        },
        {
          label: '个独编号',
          key: 'unityNumber',
          form: <span>{initUnityNumber || '--'}</span>,
        },
        {
          label: '个独名称',
          key: 'unityName',
          form: <span>{initUnityName || '--'}</span>,
        },
      );
    } else {
      formItems.push(
        {
          label: '员工工号',
          form: initStaffno || '--',
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
          initialValue: initialStaffDepartments,
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
    const { employeeDetail } = this.props;
    // 判断是否是劳动者档案
    const isSecond = employeeDetail.profile_type === FileType.second || employeeDetail.profile_type === FileType.first;
    let titleExt;
    // 判断是否是劳动者档案页面
    if (isSecond && Operate.canOperateModuleEmployeeDetailHistoryInfo()) {
      titleExt = (<a
        target="_blank"
        rel="noopener noreferrer"
        href={`/#/Employee/Detail/Individual?staffId=${dot.get(employeeDetail, '_id', undefined)}&name=${dot.get(employeeDetail, 'name', '')}`}
      >个户注册记录</a>);
    }
    return (
      <CoreContent title="档案信息" titleExt={titleExt}>
        {/* 渲染档案信息表单 */}
        {this.renderForm()}
      </CoreContent>
    );
  }
}

export default FileInfo;
