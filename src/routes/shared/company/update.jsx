/**
 * 共享登记 - 公司编辑
 */
import React from 'react';
import CompanyForm from './form';

const Update = ({
  location,
}) => {
  return (
    <CompanyForm location={location} isUpdate />
  );
};

export default Update;
