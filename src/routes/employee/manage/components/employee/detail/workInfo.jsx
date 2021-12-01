/**
 * 员工档案 - 员工详情 - 工作信息tab
 */
import React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  FileType,
} from '../../../../../../application/define';
import { CoreForm, CoreContent } from '../../../../../../components/core';
import Operate from '../../../../../../application/define/operate';

import style from './style.less';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const otherFormLayout = { labelCol: { span: 18 }, wrapperCol: { span: 5 } };

const WorkInfo = ({
  employeeDetail = {}, // 员工详情
  onBack,
}) => {
  const {
    profile_type: profileType, // 档案类型
    department_job_relation_info: departmentJobRelationInfo = {}, // 主岗关联信息
    // department_map: departmentMap = {}, // 部门
    pluralism_department_job_relation_list: pluralismDepartmentJobRelationList = [], // 兼职岗
  } = employeeDetail;

  // 部门岗位
  const renderDepartmentForm = () => {
    if (Object.keys(departmentJobRelationInfo).length < 1
      && (
        !Array.isArray(pluralismDepartmentJobRelationList)
        || pluralismDepartmentJobRelationList.length < 1
      )
    ) return <div />;

    const data = [
      { ...departmentJobRelationInfo, isLord: true },
      ...pluralismDepartmentJobRelationList,
    ];

    return data.map((dep, key) => {
      const {
        department_info: departmentInfo = {},
        job_info: jobInfo = {},
      } = dep;
      // 部门id
      // const departmentId = dep.department_info && dep.department_info._id ? dep.department_info._id : undefined;
      const formItems = [
        {
          span: 5,
          render: (
            <Form.Item
              label="所属部门"
              {...formLayout}
            >
              {(departmentInfo && departmentInfo.name) || '--'}
            </Form.Item>
          ),
        },
        {
          span: 6,
          render: (
            <Form.Item
              label="岗位"
              {...formLayout}
            >
              {(jobInfo && jobInfo.name) || '--'}
            </Form.Item>
          ),
        },
        {
          span: 4,
          render: (
            <Form.Item
              label="岗位职级"
              {...otherFormLayout}
            >
              {(jobInfo && jobInfo.rank) || '--'}
            </Form.Item>
          ),
        },
        {
          span: 4,
          render: (
            <Form.Item
              label="是否为主岗位"
              {...otherFormLayout}
            >
              {dep.isLord ? '是' : '否'}
            </Form.Item>
          ),
        },
      ];
      dep.isLord && Operate.canOperateEmployeeCreateIsOrganization() && (
        formItems[formItems.length] = {
          span: 3,
          render: (
            <Form.Item
              label="是否占编"
              {...otherFormLayout}
            >
              {employeeDetail.is_organization ? '是' : '否'}
            </Form.Item>
          ),
        }
      );

      return <CoreForm items={formItems} key={key} />;
    });
  };

  const items = [
    <Form.Item
      label="BOSS人员ID"
      {...formLayout}
    >
      {employeeDetail._id || '--'}
    </Form.Item>,
    <Form.Item
      label="档案类型"
      {...formLayout}
    >
      {profileType ? FileType.description(profileType) : '--'}
    </Form.Item>,
    <Form.Item
      label="员工工号"
      {...formLayout}
    >
      {employeeDetail.staff_no || '--'}
    </Form.Item>,
  ];

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <CoreContent title="工作信息">
            <Form
              className="affairs-flow-basic"
            >
              <CoreForm items={items} />
              {renderDepartmentForm()}
            </Form>
          </CoreContent>
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

export default WorkInfo;
