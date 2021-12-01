/**
 * 部门岗位Select
 */
import React from 'react';
import { Select } from 'antd';

import { dotOptimal } from '../../../../../../application/utils';

const { Option } = Select;

const DepAndPostTreeSelect = ({
  onChange,
  applicantNodeCcInfo, // 单个节点抄送数据
}) => {
  // 渲染Select Option
  const renderData = () => {
    const targetArr = [
      ...dotOptimal(applicantNodeCcInfo, 'flexible_department_list', []),
      ...dotOptimal(applicantNodeCcInfo, 'flexible_department_job_list', []),
    ];
    return targetArr.map((item) => {
      if (item.job_info) {
        // isDepartmentJobid（_id为部门岗位关系id）
        return (
          <Option value={item._id} key={item._id} data-isdepartmentjobid>
            {`${dotOptimal(item, 'department_info.name', '--')} - ${dotOptimal(item, 'job_info.name', '--')}`}
          </Option>
        );
      }
      return (
        <Option value={item._id} key={item._id}>
          {dotOptimal(item, 'name', '--')}
        </Option>
      );
    });
  };

  return (
    <Select
      showSearch
      showArrow
      optionFilterProp="children"
      mode="multiple"
      onChange={onChange}
      placeholder="请选择"
    >
      {renderData()}
    </Select>
  );
};

export default DepAndPostTreeSelect;

