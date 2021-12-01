/*
 * 组织架构 - 部门管理 - 部门Tab - 下级部门组件 - 公共TabPane
 */
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  OrganizationDepartmentChangeState,
  OrganizationDepartmentChangeType,
} from '../../../../../../application/define';

import Content from './content';

const voidFunc = () => {};
Public.propTypes = {
  tabKey: PropTypes.string, // tab key
  departmentId: PropTypes.string, // 当前部门id
  onSelectDepartment: PropTypes.func, // 选择部门
  childDepartmentList: PropTypes.object, // 当前部门下的子部门列表
  departmentOrderList: PropTypes.object, // 部门/编制申请单列表
  setCurrentDepartmentDetail: PropTypes.func, // 获取列表当前操作部门detail
  onChangeUpperDepartmentVisable: PropTypes.func, // 更改调整上级部门Drawer visable
  onChangeAddSubVisible: PropTypes.func, // 更改新增子部门Drawer visable
  onChangeRevokeDepartmentVisable: PropTypes.func, // 更改裁撤部门Drawer visable
  setIsUpperDepartmentUpdate: PropTypes.func, // 是否是走审批编辑操作(调整上级部门)
  setIsAddSubUpdate: PropTypes.func, // 是否是走审批编辑操作(新增子部门)
  setIsRevokeDepartmentUpdate: PropTypes.func, // 是否是走审批编辑操作(裁撤部门)
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  setRevokeDepartmentFlowId: PropTypes.func, // 更改裁撤部门操作需要的审批流id
  setUpperDepartmentFlowId: PropTypes.func, // 更改调整上级部门操作需要的审批流id
  breakDepartmentAllList: PropTypes.func, // 刷新tab下所有列表数据
  isUpperDepartmentApprove: PropTypes.bool, // 调整上级部门操作是否走审批
  isRevokeDepartmentApprove: PropTypes.bool, // 裁撤部门操作是否走审批
};
Public.defaultProps = {
  onSelectDepartment: voidFunc,
  setCurrentDepartmentDetail: voidFunc,
  onChangeUpperDepartmentVisable: voidFunc,
  onChangeAddSubVisible: voidFunc,
  onChangeRevokeDepartmentVisable: voidFunc,
  setIsUpperDepartmentUpdate: voidFunc,
  setIsAddSubUpdate: voidFunc,
  setIsRevokeDepartmentUpdate: voidFunc,
  onChangeCheckResult: voidFunc,
  setRevokeDepartmentFlowId: voidFunc,
  setUpperDepartmentFlowId: voidFunc,
  breakDepartmentAllList: voidFunc,
  childDepartmentList: {},
  departmentOrderList: {},
  isUpperDepartmentApprove: false,
  isRevokeDepartmentApprove: false,
};

function Public({
  Ref,
  tabKey,
  departmentId,
  onSelectDepartment,
  getChildDepartmentList,
  findDepartmentOrderList,
  departmentOrderList,
  childDepartmentList,
  setCurrentDepartmentDetail,
  onChangeUpperDepartmentVisable,
  onChangeAddSubVisible,
  onChangeRevokeDepartmentVisable,
  setIsUpperDepartmentUpdate,
  setIsAddSubUpdate,
  setIsRevokeDepartmentUpdate,
  onChangeCheckResult,
  setRevokeDepartmentFlowId,
  setUpperDepartmentFlowId,
  isUpperDepartmentApprove,
  isRevokeDepartmentApprove,
  breakDepartmentAllList,
}) {
  const tabSearchParmas = {};
  // 根据tabKey添加默认搜索条件
  switch (tabKey) {
    case 'tab1':
      break;
    case 'tab2':
      tabSearchParmas.state = OrganizationDepartmentChangeState.effectBefore;
      tabSearchParmas.organizationSubTypes = [
        OrganizationDepartmentChangeType.create,
        OrganizationDepartmentChangeType.change,
        OrganizationDepartmentChangeType.revoke,
      ];
      tabSearchParmas.orderNameSpace = `department-${tabKey}`;
      break;
    case 'tab3':
      tabSearchParmas.state = OrganizationDepartmentChangeState.close;
      tabSearchParmas.organizationSubTypes = [
        OrganizationDepartmentChangeType.create,
        OrganizationDepartmentChangeType.change,
        OrganizationDepartmentChangeType.revoke,
      ];
      tabSearchParmas.orderNameSpace = `department-${tabKey}`;
      break;
    default:
  }
  // search value
  const searchVal = useRef({
    _meta: { page: 1, limit: 30 },
    ...tabSearchParmas,
  });
  // table loading
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // tab（正常）
      if (tabKey === 'tab1') {
        searchVal.current.id = departmentId; // 当前部门id
      } else {
        searchVal.current.targetParentDepartmentId = departmentId; // 当前部门id
      }
      await fetchData();
      setTableLoading(false);
    })();
  }, [departmentId]);

  // 自定义暴露给父组件的实例值
  useImperativeHandle(Ref, () => ({
    breakDepartmentList: () => { breakDepartmentList(); },
  }));

  // 请求数据
  const fetchData = async () => {
    if (tabKey === 'tab1') {
      await getChildDepartmentList({ ...searchVal.current });
    } else {
      await findDepartmentOrderList({ ...searchVal.current });
    }
  };

  // onChangePage
  const onChangePage = async (page, limit) => {
    setTableLoading(true);
    searchVal.current = {
      ...searchVal.current,
      _meta: { page, limit },
    };
    await fetchData();
    setTableLoading(false);
  };

  // onShowSizeChange
  const onShowSizeChange = async (page, limit) => {
    setTableLoading(true);
    searchVal.current = {
      ...searchVal.current,
      _meta: { page, limit },
    };
    await fetchData();
    setTableLoading(false);
  };

  // 刷新列表
  const breakDepartmentList = async () => {
    setTableLoading(true);
    await fetchData();
    setTableLoading(false);
  };

  return (
    <div>
      <Content
        tabKey={tabKey}
        tableLoading={tableLoading}
        onSelectDepartment={onSelectDepartment}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
        childDepartmentData={tabKey === 'tab1' ? childDepartmentList : departmentOrderList[`department-${tabKey}`]}
        breakDepartmentList={breakDepartmentList}
        setCurrentDepartmentDetail={setCurrentDepartmentDetail}
        onChangeUpperDepartmentVisable={onChangeUpperDepartmentVisable}
        setIsUpperDepartmentUpdate={setIsUpperDepartmentUpdate}
        setIsAddSubUpdate={setIsAddSubUpdate}
        onChangeAddSubVisible={onChangeAddSubVisible}
        onChangeRevokeDepartmentVisable={onChangeRevokeDepartmentVisable}
        setIsRevokeDepartmentUpdate={setIsRevokeDepartmentUpdate}
        onChangeCheckResult={onChangeCheckResult}
        setRevokeDepartmentFlowId={setRevokeDepartmentFlowId}
        setUpperDepartmentFlowId={setUpperDepartmentFlowId}
        isUpperDepartmentApprove={isUpperDepartmentApprove}
        isRevokeDepartmentApprove={isRevokeDepartmentApprove}
        breakDepartmentAllList={breakDepartmentAllList}
      />
    </div>
  );
}

const mapStateToProps = ({
  department: { childDepartmentList, departmentOrderList },
}) => ({ childDepartmentList, departmentOrderList });
const mapDispatchToProps = dispatch => ({
  // 获取当前部门下的子部门列表
  getChildDepartmentList: payload => dispatch({
    type: 'department/getChildDepartmentList',
    payload,
  }),
  // 部门/编制申请单列表
  findDepartmentOrderList: payload => dispatch({
    type: 'department/findDepartmentOrderList',
    payload,
  }),
});

const PublicComponent = connect(mapStateToProps, mapDispatchToProps)(Public);
export default forwardRef((props, ref) => <PublicComponent {...props} Ref={ref} />);
