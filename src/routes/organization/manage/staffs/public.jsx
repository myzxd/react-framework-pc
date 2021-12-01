/*
 * 组织架构 - 部门管理 - 部门Tab - 下级部门组件 - 公共TabPane
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  OrganizationDepartmentChangeState,
  OrganizationDepartmentChangeType,
} from '../../../../application/define';

import Content from './content';

const voidFunc = () => {};
Public.propTypes = {
  tabKey: PropTypes.string, // tab key
  departmentId: PropTypes.string, // 当前部门id
  staffList: PropTypes.object, // 部门/编制申请单列表
  departmentOrderList: PropTypes.object, // 部门/编制申请单列表
  departmentDetail: PropTypes.object, // 当前部门详情
  onChangePageType: PropTypes.func, // 更改页面类型
};
Public.defaultProps = {
  staffList: {},
  departmentOrderList: {},
  departmentDetail: {},
  onChangePageType: voidFunc,
};

function Public({
  tabKey,
  departmentId,
  getDepartmentDetail,
  getDepartmentStaffs,
  findDepartmentOrderList,
  staffList,
  departmentOrderList,
  departmentDetail,
  onChangePageType,
}) {
  const tabSearchParmas = {};
  // 根据tabKey添加默认搜索条件
  switch (tabKey) {
    case 'tab1':
      break;
    case 'tab2':
      tabSearchParmas.state = OrganizationDepartmentChangeState.effectBefore;
      tabSearchParmas.organizationSubTypes = [
        OrganizationDepartmentChangeType.addPost,
        OrganizationDepartmentChangeType.add,
        OrganizationDepartmentChangeType.remove,
      ];
      tabSearchParmas.orderNameSpace = tabKey;
      break;
    case 'tab3':
      tabSearchParmas.state = OrganizationDepartmentChangeState.close;
      tabSearchParmas.organizationSubTypes = [
        OrganizationDepartmentChangeType.addPost,
        OrganizationDepartmentChangeType.add,
        OrganizationDepartmentChangeType.remove,
      ];
      tabSearchParmas.orderNameSpace = tabKey;
      break;
    default:
  }
  // search value
  const searchVal = useRef({
    _meta: { page: 1, limit: 30 },
    organizationSubTypes: [
      OrganizationDepartmentChangeType.addPost,
      OrganizationDepartmentChangeType.add,
      OrganizationDepartmentChangeType.remove,
    ],
    ...tabSearchParmas,
  });
  // table loading
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    (async () => {
      searchVal.current.departmentId = departmentId; // 当前部门id
      await Promise.all([
        fetchData(),
        getDepartmentDetail({ id: departmentId }),
      ]);
      setTableLoading(false);
    })();
  }, [departmentId, tabKey]);

  // 请求数据
  const fetchData = async (isApprove = false, orderState) => {
    if (tabKey === 'tab1') {
      await getDepartmentStaffs({ ...searchVal.current });
    } else {
      if (!orderState) {
        await findDepartmentOrderList({ ...searchVal.current });
      }

      // 查询参数
      let searchParams = {
        organizationSubTypes: [
          OrganizationDepartmentChangeType.addPost,
          OrganizationDepartmentChangeType.add,
          OrganizationDepartmentChangeType.remove,
        ],
      };

      // 正常状态（增编、减编、添加岗位走审批后）
      if (orderState === OrganizationDepartmentChangeState.effectBefore) {
        searchParams = {
          orderNameSpace: 'tab2',
          state: OrganizationDepartmentChangeState.effectBefore,
        };

        await findDepartmentOrderList({ ...searchVal.current, ...searchParams });
      }

      // 关闭状态（关闭审批单后）
      if (orderState === OrganizationDepartmentChangeState.close) {
        // 获取关闭tab数据
        await findDepartmentOrderList({
          ...searchVal.current,
          ...searchParams,
          orderNameSpace: 'tab2',
          state: OrganizationDepartmentChangeState.effectBefore,
        });
        // 获取正常tab数据
        await findDepartmentOrderList({
          ...searchVal.current,
          ...searchParams,
          orderNameSpace: 'tab3',
          state: OrganizationDepartmentChangeState.close,
        });
      }
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

  return (
    <div>
      <Content
        tabKey={tabKey}
        tableLoading={tableLoading}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
        data={tabKey === 'tab1' ? staffList : departmentOrderList[tabKey]}
        departmentDetail={departmentDetail}
        onChangePageType={onChangePageType}
        breakDepartmentList={async (isApprove, orderState) => {
          setTableLoading(true);
          await fetchData(isApprove, orderState);
          setTableLoading(false);
        }}
      />
    </div>
  );
}

const mapStateToProps = ({
  department: { departmentDetail, departmentOrderList },
  organizationStaffs: { staffList },
}) => ({ departmentDetail, staffList, departmentOrderList });
const mapDispatchToProps = dispatch => ({
  // 获取部门下岗位列表
  getDepartmentStaffs: payload => dispatch({
    type: 'organizationStaffs/getDepartmentStaffs',
    payload,
  }),
  // 部门/编制申请单列表
  findDepartmentOrderList: payload => dispatch({
    type: 'department/findDepartmentOrderList',
    payload,
  }),
  // 获取当前部门详情
  getDepartmentDetail: payload => dispatch({
    type: 'department/getDepartmentDetail',
    payload,
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Public);
