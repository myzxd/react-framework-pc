/**
 * code/team - 首页 - 账号信息
 */
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
} from 'antd';
import { authorize } from '../../../../application';

import user from '../../static/avatar.png';
import style from '../style.less';

const BasicInfo = ({
  accountDetail = {}, // 账户信息
  dispatch,
  loading,
}) => {
  // 当前账户id
  const accountId = authorize.account.id;
  useEffect(() => {
    accountId && dispatch({
      type: 'accountManage/fetchAccountsDetails',
      payload: { id: accountId },
    });

    return () => {
      dispatch({ type: 'accountManage/resetAccountsDetails' });
    };
  }, [dispatch, accountId]);

  if (loading) return <div />;

  const {
    name,
    phone,
    role_names: roleNames = [],
    employee_info: employeeInfo = {},
  } = accountDetail;
  let departments = [];
  // 判断是否有值
  if (employeeInfo && Object.keys(employeeInfo).length > 0) {
    const {
      department_job_relation_info: departmentJobRelationInfo = {},                    // 设置为主岗的部门、岗位信息
      pluralism_department_job_relation_list: pluralismDepartmentJobRelationList = [], // 设置为副岗的部门、岗位信息
    } = employeeInfo;
    departments = [
      {
        departmentName: dot.get(departmentJobRelationInfo, 'department_info.name', '--'), // 部门
        postName: dot.get(departmentJobRelationInfo, 'job_info.name', undefined) ?
          `${dot.get(departmentJobRelationInfo, 'job_info.name')} - 主岗` : '--',  // 岗位
        isSelected: true, // 主岗
      },
      ...pluralismDepartmentJobRelationList.map((item) => {
        return {
          departmentName: dot.get(item, 'department_info.name', '--'),
          postName: dot.get(item, 'job_info.name', '--'),
        };
      }),
    ];
  }

  // 渲染部门岗位
  const renderConent = () => {
    return departments.map((v, key) => {
      return (
        <Col key={key} span={6} style={{ marginTop: 10 }}>
          <div>
            <span
              className={style['code-home-basic-info-other-label']}
            >部门： </span>
            <span
              className={style['code-home-basic-info-other-content']}
              style={{ fontWeight: v.isSelected ? 'bold' : 0 }}
            >
              {v.departmentName}
            </span>
          </div>
          <div>
            <span
              className={style['code-home-basic-info-other-label']}
            >岗位： </span>
            <span
              className={style['code-home-basic-info-other-content']}
              style={{ fontWeight: v.isSelected ? 'bold' : 0 }}
            >
              {v.postName}
            </span>
          </div>
        </Col>
      );
    });
  };

  return (
    <div
      className={style['code-home-basic-wrap']}
    >
      <img src={user} role="presentation" className={style['code-home-basic-icon']} />
      <div className={style['code-home-basic-info-wrap']}>
        <div className={style['code-home-basic-info-name']}>
          {name || '--'}，祝您开心每一天！
          <span
            className={style['code-home-basic-info-phone']}
          >({phone ? phone : '--'})</span>
          <span
            className={style['code-home-basic-info-other-label']}
            style={{ marginLeft: 12, fontSize: 12 }}
          >角色： </span>
          <span
            className={style['code-home-basic-info-other-content']}
            style={{ fontSize: 12 }}
          >
            {
                Array.isArray(roleNames)
                ? roleNames.join('/')
                : '--'
              }
          </span>
        </div>
        <Row className={style['code-home-basic-info-other-wrap']}>
          {/* 渲染部门岗位 */}
          {renderConent()}
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  accountManage: { accountDetail },
}) => {
  return { accountDetail };
};

export default connect(mapStateToProps)(BasicInfo);
