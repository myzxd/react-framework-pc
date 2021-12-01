/**
 * 人员管理 - 人员档案 - 劳动者档案
 */
import { connect } from 'dva';
import React, { useRef, useState, useEffect } from 'react';
import {
  Tabs,
} from 'antd';
import {
  StaffTabKey,
  StaffSate,
} from '../../../../application/define';

import Search from './search';
import Content from './content';

const { TabPane } = Tabs;

const Staff = ({
  dispatch,
  staffList = {}, // 员工列表
}) => {
  // 表格加载状态
  const [loading, setLoading] = useState(true);
  // tabKey
  const [tabKey, setTabKey] = useState(StaffTabKey.all);

  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
    fileType: 'staff', // 档案类型
    searchState: [
      StaffSate.inService,
      StaffSate.departure,
      StaffSate.willResign,
    ],
  });

  useEffect(() => {
    dispatch({
      type: 'employeeManage/getStaffList',
      payload: {
        ...searchVal.current,
        tabKey,
        onSuccessCallback: () => setLoading(false),
      },
    });
    return () => {
      dispatch({
        type: 'employeeManage/resetStafList',
        payload: { fileType: 'staff' },
      });
    };
  }, [dispatch]);

  // 获取员工档案list
  const getStaffList = async (key) => {
    // 设置列表loading
    setLoading(true);

    // await dispatch({
      // type: 'employeeManage/resetStafList',
      // payload: {
        // fileType: 'staff',
        // tabKey,
      // },
    // });

    dispatch({
      type: 'employeeManage/getStaffList',
      payload: {
        ...searchVal.current,
        tabKey: key || tabKey,
        onSuccessCallback: () => setLoading(false),
      },
    });
  };

  // tab onChange
  const onChangeTab = (key) => {
    // 人员状态
    let searchState = [
      StaffSate.inService,
      StaffSate.departure,
      StaffSate.willResign,
    ];

    // 试用期
    key === StaffTabKey.probation && (
      searchState = [StaffSate.inService]
    );
    // 续签
    key === StaffTabKey.renew && (
      searchState = [
        StaffSate.inService,
        StaffSate.willResign,
      ]
    );
    // 离职
    key === StaffTabKey.resign && (
      searchState = [StaffSate.departure]
    );

    searchVal.current = {
      page: 1,
      limit: 30,
      fileType: 'staff', // 档案类型
      searchState,
    };

    setTabKey(key);
    getStaffList(key);
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
      state: val.state ? String(val.state).split('&') : undefined,
    };
    getStaffList();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getStaffList();
  };

  // search props
  const sProps = {
    onSearch,
    tabKey,
    dispatch,
  };

  // content props
  const cProps = {
    onChangePage,
    onShowSizeChange: onChangePage,
    dispatch,
    getStaffList,
    loading,
    staffList,
    tabKey,
  };

  // tab content
  const renderTabContent = () => {
    return (
      <React.Fragment>
        <Search {...sProps} />

        <Content {...cProps} />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Tabs
        activeKey={tabKey}
        onChange={onChangeTab}
      >
        <TabPane tab="全部" key={StaffTabKey.all} />
        <TabPane tab="试用期" key={StaffTabKey.probation} />
        <TabPane tab="续签" key={StaffTabKey.renew} />
        <TabPane tab="离职" key={StaffTabKey.resign} />
      </Tabs>
      {renderTabContent()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  employeeManage: { staffList },
}) => {
  return { staffList };
};

export default connect(mapStateToProps)(Staff);
