/**
 * 共享登记 - 银行账户编辑
 */
import React from 'react';
import BankAccountForm from './form';

const Update = ({
  location,
}) => {
  return (
    <BankAccountForm location={location} isUpdate />
  );
};

export default Update;
