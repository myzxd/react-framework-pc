// 选择学历
import React from 'react';
import { CoreSelect } from '../../core';

const Option = CoreSelect.Option;

const CommonSelectEducations = (props = {}) => {
  return (
    <CoreSelect {...props} placeholder="请选择第一学历">
      <Option value={'本科以上'}>本科以上</Option>
      <Option value={'本科'}>本科</Option>
      <Option value={'大专'}>大专</Option>
      <Option value={'高中'}>高中</Option>
      <Option value={'中专'}>中专</Option>
      <Option value={'初中及以下'}>初中及以下</Option>
    </CoreSelect>
  );
};

export default CommonSelectEducations;
