/**
 * code - 基本设置 - 审批流配置
 */
import { connect } from 'dva';
import React, { useRef, useEffect } from 'react';

import {
  CodeFlowState,
} from '../../../../application/define';

import Search from './search';
import Content from './content';

const Flow = ({
  dispatch,
  flowList = {},
}) => {
  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
  });

  useEffect(() => {
    dispatch({
      type: 'codeFlow/getFlowList',
      payload: { ...searchVal.current },
    });
    return () => {
      dispatch({ type: 'codeFlow/resetFlowList' });
    };
  }, [dispatch]);

  // 获取审批流list
  const getFlowList = () => {
    dispatch({
      type: 'codeFlow/getFlowList',
      payload: { ...searchVal.current },
    });
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getFlowList();
  };

  // onReset
  const onReset = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
      state: [
        CodeFlowState.draft,
        CodeFlowState.normal,
        CodeFlowState.deactivate,
      ],
    };
    getFlowList();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getFlowList();
  };

  // search props
  const sProps = {
    onSearch,
    onReset,
  };

  // content props
  const cProps = {
    onChangePage,
    onShowSizeChange: onChangePage,
    flowList,
    dispatch,
    getFlowList,
  };

  return (
    <React.Fragment>
      <Search {...sProps} />
      <Content {...cProps} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeFlow: { flowList },
}) => {
  return { flowList };
};

export default connect(mapStateToProps)(Flow);
