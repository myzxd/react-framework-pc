/**
 * 人员管理 - 人员档案 - 劳动者档案
 */
import { connect } from 'dva';
import React, { useRef, useState, useEffect } from 'react';

import Search from './search';
import Content from './content';

const Second = ({
  dispatch,
  history,
  employeesSecond = {}, // 劳动者列表
}) => {
  // 表格加载状态
  const [loading, setLoading] = useState(true);

  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
    fileType: 'second', // 档案类型
  });

  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchEmployees',
      payload: {
        ...searchVal.current,
        onSuccessCallback: () => setLoading(false),
      },
    });
    return () => {
      dispatch({
        type: 'employeeManage/resetEmployees',
        payload: { fileType: 'second' },
      });
    };
  }, [dispatch]);

  // 获取劳动者档案list
  const getSecondList = async () => {
    // 设置列表loading
    setLoading(true);

    await dispatch({
      type: 'employeeManage/resetEmployees',
      payload: { fileType: 'second' },
    });

    dispatch({
      type: 'employeeManage/fetchEmployees',
      payload: {
        ...searchVal.current,
        onSuccessCallback: () => setLoading(false),
      },
    });
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
    getSecondList();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getSecondList();
  };

  // search props
  const sProps = {
    onSearch,
  };

  // content props
  const cProps = {
    onChangePage,
    onShowSizeChange: onChangePage,
    dispatch,
    getSecondList,
    loading,
    employeesSecond,
    history,
  };

  return (
    <React.Fragment>
      <Search {...sProps} />

      <Content {...cProps} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  employeeManage: { employeesSecond },
}) => {
  return { employeesSecond };
};

export default connect(mapStateToProps)(Second);
