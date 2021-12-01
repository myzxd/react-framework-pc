/**
 * 发起审批 - 费控申请 /Code/Document
 * */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Tabs, Empty } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

import { CodeSubmitType } from '../../../application/define';
import CreatModal from './components/creatModal';
import TreeData from './components/treeData';
import { authorize } from '../../../application';
import {
  canOperateCodeDocumentManageExpenseCode,
  canOperateCodeDocumentManageExpenseTeam,
} from '../../../application/define/operate';

const { TabPane } = Tabs;


const ExpenseDocumentManageComponents = (props) => {
  const accountId = authorize.account.id;
  const { dispatch, accountDetail = {}, jumpKey } = props;
  const employeeInfo = dot.get(accountDetail, 'employee_info', {});
  // 部门岗位关系id
  const relationInfoId = dot.get(employeeInfo, 'department_job_relation_info._id', undefined);
  const relationInfoName = dot.get(employeeInfo, 'department_job_relation_info.job_info.name', undefined);
  // 主部门
  const majorDepartmentId = dot.get(employeeInfo, 'major_department_info._id', undefined);
  const majorDepartmentName = dot.get(employeeInfo, 'major_department_info.name', undefined);
  // 判断code权限和team权限
  const defaultKey = jumpKey || (canOperateCodeDocumentManageExpenseTeam() ? `${CodeSubmitType.team}` :
    (canOperateCodeDocumentManageExpenseCode() ? `${CodeSubmitType.code}` : undefined));
  const [activeKey, onChangeActiveKey] = useState(defaultKey);
  const [isSelf, onChangeIsSelf] = useState(true); // 主岗
  const [visible, onChangeVisible] = useState(false); // 弹框
  const [departmentPosts, onChangeDepartmentPosts] = useState({});
  useEffect(() => {
    dispatch({
      type: 'accountManage/fetchAccountsDetails',
      payload: { id: accountId },
    });
    return () => {
      dispatch({
        type: 'accountManage/resetAccountsDetails',
      });
    };
  }, [dispatch, accountId]);

  useEffect(() => {
    onChangeDepartmentPosts({
      departments: {
        _id: dot.get(accountDetail, 'employee_info.major_department_info._id'),
        name: dot.get(accountDetail, 'employee_info.major_department_info.name'),
      },
      posts: {
        _id: dot.get(accountDetail, 'employee_info.department_job_relation_info._id'),
        name: dot.get(accountDetail, 'employee_info.department_job_relation_info.job_info.name'),
      },
    });
  }, [accountDetail]);

  // 显示弹框
  const onClickShowCreatModal = () => {
    onChangeVisible(true);
  };
  // 弹框确定
  const onOkCreatModal = (values = {}) => {
    onChangeIsSelf(false);
    onChangeDepartmentPosts({
      departments: dot.get(values, 'departments', {}),
      posts: dot.get(values, 'posts', {}),
    });
    // 弹框取消
    onCancelCreatModal();
  };
  // 弹框取消
  const onCancelCreatModal = () => {
    onChangeVisible(false);
  };

  // tab
  const onChangeTabs = (e) => {
    onChangeActiveKey(e);
  };

  // 部门岗位
  const renderDepartmentPost = () => {
    const operate = (<a
      style={{ color: '#FF7700', marginLeft: 5 }}
      onClick={onClickShowCreatModal}
    >点此切岗 <DoubleRightOutlined /></a>);
    // 判断是否存在人员档案
    if (is.not.existy(employeeInfo) || is.empty(employeeInfo)) {
      return (
        <div>您无提报权限，请联系系统管理员配置对应权限</div>
      );
    }

    // 部门
    const departments = dot.get(departmentPosts, 'departments', {});
    // 岗位
    const posts = dot.get(departmentPosts, 'posts', {});
    // 部门岗位显示
    if (is.existy(departments) && is.not.empty(departments) &&
      is.existy(posts) && is.not.empty(posts)) {
      return (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>部门：{departments.name}</span>
            <span style={{ margin: '0 10px' }}>岗位：{posts.name}</span>
            {operate}
          </div>
          <CreatModal
            visible={visible}
            onCancel={onCancelCreatModal}
            onOk={onOkCreatModal}
            staffProfileId={accountDetail.staff_profile_id}
            values={{ departments, posts }}
            relationInfoId={relationInfoId}
            relationInfoName={relationInfoName}
            majorDepartmentId={majorDepartmentId}
            majorDepartmentName={majorDepartmentName}
          />
        </React.Fragment>
      );
    }
  };

  // 渲染主体内容
  const renderContent = () => {
    // 部门
    const departments = dot.get(departmentPosts, 'departments', {});
    // 岗位
    const posts = dot.get(departmentPosts, 'posts', {});

    // 判断是否有权限
    if (canOperateCodeDocumentManageExpenseCode() === false && canOperateCodeDocumentManageExpenseTeam() === false) {
      return null;
    }
    return (
      <TreeData
        isSelf={isSelf}
        departmentId={departments._id}
        relationInfoId={relationInfoId}
        postId={posts._id}
        activeKey={activeKey}
        majorDepartmentId={majorDepartmentId}
      />
    );
  };

  // 渲染tab
  const renderTabs = () => {
    // 判断是否有权限
    if (canOperateCodeDocumentManageExpenseCode() === false && canOperateCodeDocumentManageExpenseTeam() === false) {
      return (
        <Empty description="你没有权限操作此模块请联系管理员" />
      );
    }
    return (
      <div>
        <Tabs
          activeKey={activeKey}
          type="card"
          size="small"
          tabBarStyle={{ margin: '0' }}
          onChange={onChangeTabs}
          // 部门岗位
          tabBarExtraContent={renderDepartmentPost()}
        >
          {
            canOperateCodeDocumentManageExpenseTeam() ? (
              <TabPane tab="TEAM相关" key={`${CodeSubmitType.team}`} />
            ) : null
          }
          {
            canOperateCodeDocumentManageExpenseCode() ? (
              <TabPane tab="CODE相关" key={`${CodeSubmitType.code}`} />
            ) : null
          }
        </Tabs>
      </div>
    );
  };
  return (
    <div>
      {/* 渲染tab */}
      {renderTabs()}

      {/* 渲染主体内容 */}
      {renderContent()}
    </div>
  );
};


const mapStateToProps = ({ accountManage: { accountDetail } }) => ({ accountDetail });
export default connect(mapStateToProps)(ExpenseDocumentManageComponents);
