/**
 * 抄送人 - 指定成员
*/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ComponentUser = ({
  value,
  onChange,
  dispatch,
  allAccount = {},
}) => {
  useEffect(() => {
    if (allAccount.name
      && Array.isArray(allAccount.name)
      && allAccount.name.length > 0) return;

    dispatch({
      type: 'applicationCommon/fetchAllAccountName',
    });
  }, [dispatch]);

  // 用户数据
  const { name: dataSource = [] } = allAccount;

  return (
    <Select
      allowClear
      showArrow
      mode="multiple"
      optionFilterProp="children"
      value={Array.isArray(dataSource) && dataSource.length > 0 ? value : undefined}
      onChange={onChange}
      placeholder="请选择"
    >
      {
        dataSource.map((u, key) => {
          return (
            <Option value={u.id} key={key}>{u.name}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ applicationCommon: { allAccount } }) => {
  return { allAccount };
};

export default connect(mapStateToProps)(ComponentUser);
