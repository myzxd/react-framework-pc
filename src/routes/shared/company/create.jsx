/**
 * 共享登记 - 公司创建
 */
import React from 'react';
import CompanyForm from './form';

const Create = ({
  location,
}) => {
  return (
    <CompanyForm location={location} />
  );
};

export default Create;
