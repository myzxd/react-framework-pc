/*
 * 共享登记 - 银行账户列表 /Shared/BankAccount
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import Search from './search';
import Content from './content';

const BankAccount = ({
  dispatch,
  bankAccountList,
}) => {
  // search value
  const [searchVal, setSearchVal] = useState({ _meta: { page: 1, limit: 30 } });

  useEffect(() => {
    dispatch({ type: 'sharedBankAccount/getSharedBankAccountList', payload: { ...searchVal } });
    return () => {
      dispatch({ type: 'sharedBankAccount/reduceSharedBankAccountList', payload: { } });
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
        bankAccountList={bankAccountList}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  );
};

const mapStateToProps = ({ sharedBankAccount: { bankAccountList } }) => ({ bankAccountList });
export default connect(mapStateToProps)(BankAccount);
