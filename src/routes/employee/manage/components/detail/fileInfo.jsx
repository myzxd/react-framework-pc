/**
 * 档案信息
 * */
import dot from 'dot-prop';
import React from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { FileType, HouseholdType } from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';

function FileInfo(props) {
  // 渲染所属部门及岗位列表
  const renderStaffDepartments = () => {
    const { employeeDetail = {} } = props;
    // 设置为主岗的部门、岗位信息
    const departmentJobRelationInfo = dot.get(employeeDetail, 'department_job_relation_info', {});
    // 所属部门
    const departmentMap = dot.get(employeeDetail, 'department_map', {});
    // 兼职岗位的部门、岗位信息
    const pluralismDepartmentJobRelationList = dot.get(employeeDetail, 'pluralism_department_job_relation_list', []);
    // 合并主岗及兼职岗信息
    const currentInfo = [
      { ...departmentJobRelationInfo, flag: true },
      ...pluralismDepartmentJobRelationList.map(item => ({ ...item, flag: false })),
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return currentInfo.map((item) => {
      // 部门id
      const departmentId = dot.get(item, 'department_info._id', undefined);
      const formItems = [
        {
          label: '所属部门',
          span: 5,
          layout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          },
          form: departmentId ? departmentMap[departmentId] : '--',
        },
        {
          label: '岗位',
          span: 5,
          layout: {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          },
          form: dot.get(item, 'job_info.name', '--'),
        },
        {
          label: '岗位职级',
          span: 3,
          form: dot.get(item, 'job_info.rank', '--'),
        },
        {
          label: '是否为主岗位',
          span: 3,
          layout: {
            labelCol: { span: 18 },
            wrapperCol: { span: 6 },
          },
          form: item.flag ? '是' : '否',
        },
      ];
      // 判断是否是主岗
      if (item.flag && Operate.canOperateEmployeeCreateIsOrganization()) {
        formItems.push(
          {
            label: '是否占编',
            span: 5,
            layout: {
              labelCol: { span: 18 },
              wrapperCol: { span: 6 },
            },
            form: employeeDetail.is_organization ? '是' : '否',
          });
      }
      return (
        <DeprecatedCoreForm key={item._id} items={formItems} layout={layout} />
      );
    });
  };

  const employeeDetail = dot.get(props, 'employeeDetail', {});
    // 判断是否是劳动者档案
  const isSecond = FileType.second === Number(employeeDetail.profile_type) || FileType.first === Number(employeeDetail.profile_type);

  const formItems = [
    {
      label: 'BOSS人员ID',
      form: dot.get(employeeDetail, '_id', '--'),
    },
    {
      label: '档案类型',
      form: FileType.description(employeeDetail.profile_type),
    },
  ];
  let label = '个户类型';
  let form = HouseholdType.description(employeeDetail.individual_type);
  if (isSecond) {
    label = '职能';
    form = dot.get(employeeDetail, 'office', '--') || '--';
  }
  const first = [
    {
      label: '所属场景',
      form: dot.get(employeeDetail, 'industry_name', '--') || '--',
    },
    {
      label,
      form,
    }, {
      label: '个户编号',
      form: dot.get(employeeDetail, 'personal_company_no', '--') || '--',
    }, {
      label: '个独编号',
      form: dot.get(employeeDetail, 'company_no', '--') || '--',
    }, {
      label: '个独名称',
      form: dot.get(employeeDetail, 'company_name', '--') || '--',
    },
  ];
  const staff = [
    {
      label: '员工工号',
      form: dot.get(employeeDetail, 'staff_no', '--') || '--',
    },
  ];
    // 判断是否是员工档案
  if (FileType.staff === Number(employeeDetail.profile_type) || props.isStaff) {
    formItems.push(...staff);
  } else {
    formItems.push(...first);
  }

  const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
  let titleExt;
    // 判断是否是劳动者档案页面，判断是否有权限
  if (isSecond && Operate.canOperateModuleEmployeeDetailHistoryInfo()) {
    titleExt = (<a
      target="_blank"
      rel="noopener noreferrer"
      href={`/#/Employee/Detail/Individual?staffId=${dot.get(employeeDetail, '_id', undefined)}&name=${dot.get(employeeDetail, 'name', '')}`}
    >个户注册记录</a>);
  }

  return (
    <CoreContent title="档案信息" titleExt={titleExt}>
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      {FileType.staff === Number(employeeDetail.profile_type) && renderStaffDepartments()}
    </CoreContent>
  );
}

export default FileInfo;
