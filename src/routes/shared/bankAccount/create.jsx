/**
 * 共享登记 - 银行账户创建
 */
import React from 'react';
import BankAccountForm from './form';

const Create = ({
  location,
}) => {
  return (
    <BankAccountForm location={location} />
  );
};

export default Create;
