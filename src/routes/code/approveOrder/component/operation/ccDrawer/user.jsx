/**
 * 抄送人 - 指定成员
*/
import React from 'react';
import { Select } from 'antd';

import { dotOptimal } from '../../../../../../application/utils';

const { Option } = Select;

const ComponentUser = ({
  applicantNodeCcInfo, // 单个节点抄送数据
  onChange,
}) => {
  // 渲染Select Option
  const renderData = () => {
    return dotOptimal(applicantNodeCcInfo, 'flexible_account_list', []).map((item) => {
      return (
        <Option value={item._id} key={item._id}>
          {dotOptimal(item, 'name', '--')}
        </Option>
      );
    });
  };

  return (
    <Select
      allowClear
      showArrow
      mode="multiple"
      optionFilterProp="children"
      placeholder="请选择"
      onChange={onChange}
    >
      {renderData()}
    </Select>
  );
};

export default ComponentUser;
