/*
 * 共享登记 - 印章列表 /Shared/Seal
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import Search from './search';
import Content from './content';

const Seal = ({
  dispatch,
  sealList,
}) => {
  // search value
  const [searchVal, setSearchVal] = useState({ _meta: { page: 1, limit: 30 } });

  useEffect(() => {
    dispatch({ type: 'sharedSeal/getSharedSealList', payload: { ...searchVal } });
    return () => {
      dispatch({ type: 'sharedSeal/reduceSharedSealList', payload: { } });
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
        sealList={sealList}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

const mapStateToProps = ({ sharedSeal: { sealList } }) => ({ sealList });
export default connect(mapStateToProps)(Seal);
