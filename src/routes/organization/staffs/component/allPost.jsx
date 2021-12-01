/*
 * 共享登记 - 公司列表组件
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const Option = Select.Option;

const Company = ({
  dispatch,
  allStaffList = {},
  onChange,
  value,
}) => {
  const { data = [] } = allStaffList;

  useEffect(() => {
    dispatch({ type: 'organizationStaff/getAllStaffList', payload: {} });

    return () => {
      dispatch({ type: 'organizationStaff/resetAllStaffList' });
    };
  }, [dispatch]);

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      dropdownMatchSelectWidth={false}
    >
      {
        data.map((i) => {
          return (
            <Option
              value={i.name}
              key={i._id}
            >{i.name}({i.rank})</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  organizationStaff: { allStaffList },
}) => ({ allStaffList });

export default connect(mapStateToProps)(Company);
