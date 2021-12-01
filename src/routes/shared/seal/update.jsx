/**
 * 共享登记 - 印章编辑
 */
import React from 'react';
import SealForm from './form';

const Update = ({
  location,
}) => {
  return (
    <SealForm location={location} isUpdate />
  );
};

export default Update;
