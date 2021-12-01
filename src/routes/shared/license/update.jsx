/**
 * 共享登记 - 证照编辑
 */
import React from 'react';
import LicenseForm from './form';

const Update = ({ location }) => {
  return (
    <LicenseForm isUpdate location={location} />
  );
};

export default Update;
