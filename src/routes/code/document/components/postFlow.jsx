/**
 * code - 发起审批 - 岗位（当前员工档案下的）
 */
import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const PostFlow = ({
  onChange,
  departmentId,
  postList = [],
  value,
}) => {
  const onChangeVal = (val, options) => {
    const { name } = options;
    // 重置表单岗位id
    onChange && (onChange(val, name));
  };

  const data = postList.filter((item) => {
    return item.department_info._id === departmentId;
  });

  return (
    <Select
      onChange={onChangeVal}
      placeholder="请选择"
      value={value}
    >
      {
        data.map((item) => {
          return (
            <Option
              value={item._id} // 部门&岗位关系id
              key={item._id}
              name={item.job_info.name} // 岗位name
            >{item.job_info.name}</Option>
          );
        })
      }
    </Select>
  );
};

export default PostFlow;
