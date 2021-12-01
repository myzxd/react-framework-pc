/*
 * 共享登记 - 证照列表 /Shared/License
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import Search from './search';
import Content from './content';

const License = ({
  dispatch,
  licenseList,
}) => {
  // search value
  const [searchVal, setSearchVal] = useState({ _meta: { page: 1, limit: 30 } });

  useEffect(() => {
    dispatch({ type: 'sharedLicense/getSharedLicenseList', payload: { ...searchVal } });
    return () => {
      dispatch({ type: 'sharedLicense/reduceSharedLicenseList', payload: {} });
    };
  }, [dispatch, searchVal]);

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
        licenseList={licenseList}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

const mapStateToProps = ({ sharedLicense: { licenseList } }) => ({ licenseList });
export default connect(mapStateToProps)(License);
