
/**
 * 抄送人 - 按用户
*/

import React from 'react';
import { Transfer } from 'antd';

const ComponentUser = (props) => {
  const { targetKeys, dataSource } = props;

  // 获取用户姓名
  const getUserNames = (keys, arr = []) => {
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

  // 用户修改
  const onChangeUser = (keys) => {
    if (props.onChange) {
      props.onChange(getUserNames(keys));
    }
  };

  return (
    <Transfer
      dataSource={dataSource}
      targetKeys={targetKeys}
      showSearch
      onChange={onChangeUser}
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
export default ComponentUser;
