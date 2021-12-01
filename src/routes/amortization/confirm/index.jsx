/**
 * 摊销管理 - 摊销确认页
 */
import { connect } from 'dva';
import React, { useRef, useState, useEffect } from 'react';
import is from 'is_js';

import Search from './search';
import Content from './content';
import { cryptoRandomString } from '../../../application/utils';

const Confirm = ({
  dispatch,
  history,
  amortizationList = {}, // 摊销确认列表
  prePageAction = {},    // 存储上次用户操作的行为
}) => {
  // 表格加载状态
  const [loading, setLoading] = useState(true);
  // 随机字符串
  const [randomString, setRandomString] = useState(undefined);

  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
  });


  useEffect(() => {
    // 如果存储的用户行为不存在 直接返回
    if (is.not.existy(prePageAction) || is.empty(prePageAction)) return;
    searchVal.current = {
      page: prePageAction.page,
      limit: prePageAction.pageSize,
    };
  }, [prePageAction]);

  useEffect(() => {
    dispatch({
      type: 'costAmortization/getAmortizationList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
    return () => {
      dispatch({ type: 'costAmortization/resetAmortizationList' });
      dispatch({ type: 'costAmortization/resetSubjectList' });
    };
  }, [dispatch]);

  // 获取审批流list
  const getAmortizationList = async () => {
    // 设置列表loading
    setLoading(true);

    await dispatch({ type: 'costAmortization/resetAmortizationList' });

    dispatch({
      type: 'costAmortization/getAmortizationList',
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
      page: 1,
      limit: 30,
    };
    getAmortizationList();
    // 更新随机字符串（用于清空列表selectedRowKeys）
    setRandomString(cryptoRandomString(32));
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getAmortizationList();
  };

  // search props
  const sProps = {
    onSearch,
  };

  // content props
  const cProps = {
    onChangePage,
    onShowSizeChange: onChangePage,
    amortizationList,
    dispatch,
    getAmortizationList,
    loading,
    history,
    randomString,
  };
  return (
    <React.Fragment>
      <Search {...sProps} />

      <Content {...cProps} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  costAmortization: { amortizationList, prePageAction },
}) => {
  return { amortizationList, prePageAction };
};

export default connect(mapStateToProps)(Confirm);
