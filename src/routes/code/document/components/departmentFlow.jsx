/**
 * code - 发起审批 - 部门（当前员工档案下的）
 */
import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const DepartmentFlow = ({
  value,
  onChange,
  departmentList = [],
}) => {
  const onChangeVal = (val, options) => {
    const { name } = options;
    if (onChange) {
      onChange(val, name);
    }
  };

  return (
    <Select
      value={value}
      onChange={onChangeVal}
      placeholder="请选择"
    >
      {
        departmentList.map((item) => {
          return (
            <Option value={item._id} name={item.name} key={item._id}>{item.name}</Option>
          );
        })
      }
    </Select>
  );
};

export default DepartmentFlow;
