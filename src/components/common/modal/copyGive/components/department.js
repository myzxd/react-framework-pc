
/**
 * 抄送人 - 按部门
*/

import React from 'react';
import { Transfer } from 'antd';

const ComponentDepartment = (props) => {
  const { targetKeys, dataSource } = props;

  // 获取用户姓名
  const getDepartmentNames = (keys, arr = []) => {
    if (!keys) {
      return arr;
    }
    dataSource.forEach((item) => {
      if (keys.includes(item._id)) {
        arr.push({ _id: item._id, name: item.name });
      }
    });
    return arr;
  };

  // 部门修改
  const onChangeDepartment = (keys) => {
    if (props.onChange) {
      props.onChange(getDepartmentNames(keys));
    }
  };

  return (
    <Transfer
      dataSource={dataSource}
      targetKeys={targetKeys}
      showSearch
      onChange={onChangeDepartment}
      listStyle={{
        height: 300,
      }}
      style={{ marginBottom: 16 }}
      rowKey={record => record._id}
      titles={['全选／合计', '全选／合计']}
      render={item => `${item.name}`}
    />
  );
};
export default ComponentDepartment;
