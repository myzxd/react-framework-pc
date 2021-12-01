/*
 * 共享登记 - 公司列表 /Shared/Company
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import Search from './search';
import Content from './content';

const Company = ({
  dispatch,
  companyList,
}) => {
  // search value
  const [searchVal, setSearchVal] = useState({ _meta: { page: 1, limit: 30 } });

  useEffect(() => {
    dispatch({ type: 'sharedCompany/getSharedCompanyList', payload: { ...searchVal } });
    return () => {
      dispatch({ type: 'sharedCompany/reduceSharedCompanyList', payload: { } });
    };
  }, [dispatch, searchVal]);

  // 获取公司类型
  useEffect(() => {
    dispatch({ type: 'sharedCompany/getSharedCompanyNature', payload: {} });
  }, []);

  // onSearch
  const onSearch = (values) => {
    setSearchVal({ _meta: { page: 1, limit: 30 }, ...values });
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    setSearchVal({ ...searchVal, _meta: { page, limit } });
  };

  // onShowSizeChange
  const onShowSizeChange = (page, limit) => {
    setSearchVal({ ...searchVal, _meta: { page, limit } });
  };

  return (
    <div>
      <Search
        onSearch={onSearch}
        dispatch={dispatch}
      />
      <Content
        companyList={companyList}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

const mapStateToProps = ({ sharedCompany: { companyList } }) => ({ companyList });
export default connect(mapStateToProps)(Company);
