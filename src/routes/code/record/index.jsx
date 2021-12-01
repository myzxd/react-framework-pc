/**
 * code - 记录明细
 */
import { connect } from 'dva';
import React, { useRef, useEffect, useState } from 'react';

import Search from './search';
import Content from './content';

const Record = ({
  dispatch,
  recordList = {},
}) => {
  // 表格加载状态
  const [loading, setLoading] = useState(true);

  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
  });

  useEffect(() => {
    dispatch({
      type: 'codeRecord/getRecordList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
    return () => {
      dispatch({ type: 'codeRecord/resetRecordList' });
    };
  }, [dispatch]);

  // 获取审批流list
  const getRecordList = () => {
    // 设置列表loading
    setLoading(true);

    dispatch({ type: 'codeRecord/resetRecordList' });

    dispatch({
      type: 'codeRecord/getRecordList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
    };
    getRecordList();
  };

  // onReset
  const onReset = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getRecordList();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getRecordList();
  };

  // search props
  const sProps = {
    onSearch,
    onReset,
    dispatch,
  };

  // content props
  const cProps = {
    onChangePage,
    onShowSizeChange: onChangePage,
    recordList,
    dispatch,
    getRecordList,
    loading,
  };

  return (
    <React.Fragment>
      <Search {...sProps} />
      <Content {...cProps} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeRecord: { recordList },
}) => {
  return { recordList };
};

export default connect(mapStateToProps)(Record);
