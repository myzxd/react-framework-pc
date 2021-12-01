/**
 * 人员档案 - tem类型
*/
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const { Option } = Select;

const TeamType = ({
  dispatch,
  teamTypeList = [],
  value,
  onChange,
  disabled = false, // select disabled
}) => {
  useEffect(() => {
    dispatch({
      type: 'employeeManage/getTeamTypeList',
      payload: {},
    });

    () => dispatch({
      type: 'employeeManage/reduceTeamTypeList',
      payload: {},
    });
  }, [dispatch]);

  return (
    <Select
      placeholder="请选择tam类型"
      allowClear
      showSearch
      optionFilterProp="children"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {
        teamTypeList.map(t => (
          <Option
            key={t}
            value={t}
          >
            {t}
          </Option>
        ))
      }
    </Select>
  );
};

const mapStateToProps = ({
  employeeManage: { teamTypeList },
}) => {
  return { teamTypeList };
};
export default connect(mapStateToProps)(TeamType);
