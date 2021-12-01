/**
 * 共享登记 - 证照新建
 */
import React from 'react';
import LicenseForm from './form';

const Create = ({
  location,
}) => {
  return (
    <LicenseForm location={location} />
  );
};

export default Create;
