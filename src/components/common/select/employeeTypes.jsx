// 选择人员类型
import React from 'react';
import { CoreSelect } from '../../core';
import { EmployeeWorkType } from '../../../application/define';

const Option = CoreSelect.Option;

const CommonSelectEmployeeWorkTypes = (props = {}) => {
  return (
    <CoreSelect {...props} >
      <Option value={`${EmployeeWorkType.fulltime}`}>{EmployeeWorkType.description(EmployeeWorkType.fulltime)}</Option>
      <Option value={`${EmployeeWorkType.parttime}`}>{EmployeeWorkType.description(EmployeeWorkType.parttime)}</Option>
    </CoreSelect>
  );
};

export default CommonSelectEmployeeWorkTypes;
