/*
 * 组织架构 - 部门管理 - 部门Tab - 下级部门组件
 */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs, Button, Popconfirm, message } from 'antd';

import { CoreContent } from '../../../../../../components/core';
import { OrganizationDepartmentChangeType } from '../../../../../../application/define';
import { dotOptimal } from '../../../../../../application/utils';
import Operate from '../../../../../../application/define/operate';

import Public from './public';
import AddSubDepartment from '../drawer/addSubDepartment';
import UpperDepartmentUpdate from '../drawer/upperDepartmentUpdate';
import RevokeDepartment from '../drawer/revokeDepartment';
import style from '../index.less';

const { TabPane } = Tabs;

const voidFunc = () => { };
SubordinateDepart.propTypes = {
  departmentId: PropTypes.string, // 当前部门id
  onSelectDepartment: PropTypes.func, // 选择部门
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  departmentDetail: PropTypes.object, // 部门详情
  isUpperDepartmentApprove: PropTypes.bool, // 调整上级部门操作是否走审批
  isAddSubDepartmentApprove: PropTypes.bool, // 添加子部门操作是否走审批
  isRevokeDepartmentApprove: PropTypes.bool, // 裁撤部门操作是否走审批
};
SubordinateDepart.defaultProps = {
  onSelectDepartment: voidFunc,
  onChangeCheckResult: voidFunc,
  departmentDetail: {},
  isUpperDepartmentApprove: false,
  isAddSubDepartmentApprove: false,
  isRevokeDepartmentApprove: false,
};

function SubordinateDepart({
  departmentId,
  onSelectDepartment,
  onChangeCheckResult,
  departmentDetail,
  getOrganizationFlowList,
  isUpperDepartmentApprove,
  isAddSubDepartmentApprove,
  isRevokeDepartmentApprove,
  getDepartmentTree,
  exportDepartment,
}) {
  // 新增子部门Drawer visible
  const [isAddSubVisible, setIsAddSubVisible] = useState(false);
  // 是否是走审批编辑操作(新增子部门)
  const [isAddSubUpdate, setIsAddSubUpdate] = useState(false);
  // 调整上级部门Drawer visible
  const [isUpperDepartmentVisible, setIsUpperDepartmentVisible] = useState(false);
  // 是否是走审批编辑操作(调整上级部门)
  const [isUpperDepartmentUpdate, setIsUpperDepartmentUpdate] = useState(false);
  // 裁撤部门Drawer visible
  const [isRevokeDepartmentVisible, setIsRevokeDepartmentVisible] = useState(false);
  // 是否是走审批编辑操作(裁撤部门)
  const [isRevokeDepartmentUpdate, setIsRevokeDepartmentUpdate] = useState(false);
  // 列表当前操作部门detail
  const [currentDepartmentDetail, setCurrentDepartmentDetail] = useState({});
  // 调整上级部门操作需要的审批流id
  const [upperDepartmentFlowId, setUpperDepartmentFlowId] = useState('');
  // 添加子部门操作需要的审批流id
  const [addSubDepartmentFlowId, setAddSubDepartmentFlowId] = useState('');
  // 裁撤部门操作需要的审批流id
  const [revokeDepartmentFlowId, setRevokeDepartmentFlowId] = useState('');
  const tabOnePublicRef = useRef(null);
  const tabTwoPublicRef = useRef(null);
  const tabThreePublicRef = useRef(null);

  // tab切换事件
  const onChangeTab = () => {
    // 是否是走审批编辑操作(调整上级部门)
    setIsUpperDepartmentUpdate(false);
    // 是否是走审批编辑操作(新增子部门)
    setIsAddSubUpdate(false);
    // 是否是走审批编辑操作(裁撤部门)
    setIsRevokeDepartmentUpdate(false);
  };

  // 导出EXCEL,创建下载任务
  const onCreateExportTask = () => {
    exportDepartment({ id: departmentId });
  };

  // 刷新tab下所有列表数据（展示table loading）
  const breakDepartmentAllList = () => {
    getDepartmentTree({ isAuthorized: true, namespace: 'organization' });
    // 部门下的子部门列表
    tabOnePublicRef.current && tabOnePublicRef.current.breakDepartmentList();
    // 部门/编制申请单列表（待生效）
    tabTwoPublicRef.current && tabTwoPublicRef.current.breakDepartmentList();
    // 部门/编制申请单列表（已关闭）
    tabThreePublicRef.current && tabThreePublicRef.current.breakDepartmentList();
  };

  // 添加子部门
  const createDepartment = Operate.canOperateOrganizationManageDepartmentCreate() ?
    (
      <Button
        type="primary"
        onClick={async () => {
          if (isAddSubDepartmentApprove) {
            // 获取组织架构审批流list
            const res = await getOrganizationFlowList({
              departmentId,
              organizationSubType: OrganizationDepartmentChangeType.create,
            });
            // 接口请求成功 200
            if (res && res.data) {
              // 有适用的审批流
              if (dotOptimal(res, 'data.0.flow_template_records.0._id', '')) {
                setAddSubDepartmentFlowId(dotOptimal(res, 'data.0.flow_template_records.0._id'));
                setIsAddSubVisible(true);
                setIsAddSubUpdate(false);
              } else {
                return message.error('提示：无适用审批流，请联系流程管理员');
              }
            }
            // 接口请求失败 400
            if (res && res.zh_message) {
              return message.error(res.zh_message);
            }
          } else {
            setIsAddSubVisible(true);
            setIsAddSubUpdate(false);
          }
        }}
        className={style['app-organization-department-basic-operate']}
      >
        添加子部门
      </Button>
    )
    : null;

  // 导出部门
  const exportDepartmentExt = Operate.canOperateOrganizationManageDepartmentExport() ?
    (
      <Popconfirm
        title="创建下载任务？"
        onConfirm={onCreateExportTask}
        okText="确认"
        cancelText="取消"
      >
        <Button>导出EXCEL</Button>
      </Popconfirm>
    ) : null;

  const titleExt = <div>{exportDepartmentExt}{createDepartment}</div>;
  return (
    <div>
      <CoreContent title="下级部门" titleExt={titleExt}>
        <Tabs defaultActiveKey="tab1" type="card" onChange={onChangeTab}>
          <TabPane tab="正常" key="tab1">
            <Public
              ref={tabOnePublicRef}
              tabKey="tab1"
              departmentId={departmentId}
              onSelectDepartment={onSelectDepartment}
              setCurrentDepartmentDetail={(info) => { setCurrentDepartmentDetail(info || {}); }}
              onChangeUpperDepartmentVisable={(flag) => { setIsUpperDepartmentVisible(flag || false); }}
              onChangeRevokeDepartmentVisable={(flag) => { setIsRevokeDepartmentVisible(flag || false); }}
              onChangeCheckResult={onChangeCheckResult}
              setRevokeDepartmentFlowId={setRevokeDepartmentFlowId}
              setUpperDepartmentFlowId={setUpperDepartmentFlowId}
              isUpperDepartmentApprove={isUpperDepartmentApprove}
              isRevokeDepartmentApprove={isRevokeDepartmentApprove}
              breakDepartmentAllList={breakDepartmentAllList}
            />
          </TabPane>
          <TabPane tab="待生效" key="tab2">
            <Public
              ref={tabTwoPublicRef}
              tabKey="tab2"
              departmentId={departmentId}
              onSelectDepartment={onSelectDepartment}
              setCurrentDepartmentDetail={(info) => { setCurrentDepartmentDetail(info || {}); }}
              onChangeUpperDepartmentVisable={(flag) => { setIsUpperDepartmentVisible(flag || false); }}
              onChangeAddSubVisible={(flag) => { setIsAddSubVisible(flag || false); }}
              onChangeRevokeDepartmentVisable={(flag) => { setIsRevokeDepartmentVisible(flag || false); }}
              setIsUpperDepartmentUpdate={setIsUpperDepartmentUpdate}
              setIsAddSubUpdate={setIsAddSubUpdate}
              setIsRevokeDepartmentUpdate={setIsRevokeDepartmentUpdate}
              breakDepartmentAllList={breakDepartmentAllList}
            />
          </TabPane>
          <TabPane tab="已关闭" key="tab3">
            <Public
              ref={tabThreePublicRef}
              tabKey="tab3"
              departmentId={departmentId}
              onSelectDepartment={onSelectDepartment}
            />
          </TabPane>
        </Tabs>
      </CoreContent>
      {/* 新增子部门Drawer */}
      <AddSubDepartment
        visible={isAddSubVisible}
        onChangeCheckResult={onChangeCheckResult}
        onChangeAddSubVisable={(flag) => { setIsAddSubVisible(flag || false); }}
        departmentDetail={isAddSubUpdate ? currentDepartmentDetail : departmentDetail}
        isUpdate={isAddSubUpdate}
        isAddSubDepartmentApprove={isAddSubDepartmentApprove}
        setAddSubDepartmentFlowId={setAddSubDepartmentFlowId}
        addSubDepartmentFlowId={addSubDepartmentFlowId}
        onSuccess={() => { breakDepartmentAllList(); }}
      />
      {/* 调整上级部门Drawer */}
      <UpperDepartmentUpdate
        departmentDetail={currentDepartmentDetail}
        onChangeUpperDepartmentVisable={(flag) => { setIsUpperDepartmentVisible(flag || false); }}
        visible={isUpperDepartmentVisible}
        onChangeCheckResult={onChangeCheckResult}
        isUpdate={isUpperDepartmentUpdate}
        upperDepartmentFlowId={upperDepartmentFlowId}
        onSuccess={() => { breakDepartmentAllList(); }}
      />
      {/* 裁撤部门Drawer */}
      <RevokeDepartment
        departmentDetail={currentDepartmentDetail}
        onChangeRevokeDepartmentVisable={(flag) => { setIsRevokeDepartmentVisible(flag || false); }}
        visible={isRevokeDepartmentVisible}
        onChangeCheckResult={onChangeCheckResult}
        isUpdate={isRevokeDepartmentUpdate}
        upperDepartmentId={departmentId}
        revokeDepartmentFlowId={revokeDepartmentFlowId}
        onSuccess={() => { breakDepartmentAllList(); }}
      />
    </div>
  );
}

const mapStateToProps = ({ department: { departmentDetail } }) => ({ departmentDetail });
const mapDispatchToProps = dispatch => ({
  // 获取组织架构审批流list
  getOrganizationFlowList: payload => dispatch({
    type: 'department/getOrganizationFlowList',
    payload,
  }),
  // 获取部门树
  getDepartmentTree: payload => dispatch({
    type: 'applicationCommon/fetchDepartments',
    payload,
  }),
  // 导出EXCEL,创建下载任务
  exportDepartment: payload => dispatch({
    type: 'department/exportDepartment',
    payload,
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(SubordinateDepart);
