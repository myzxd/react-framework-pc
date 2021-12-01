/**
 * 人员档案 - tem
*/
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const { Option } = Select;

const Team = ({
  dispatch,
  teamList = [],
  teamType,
  value,
  onChange,
}) => {
  useEffect(() => {
    dispatch({
      type: 'employeeManage/getTeamList',
      payload: {
        teamType,
      },
    });

    () => dispatch({ type: 'employeeManage/reduceTeamList', payload: [] });
  }, [dispatch, teamType]);

  return (
    <Select
      placeholder="请选择team"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
    >
      {
        teamList.map(t => (
          <Option
            key={t._id}
            value={t._id}
          >
            {t.name}
          </Option>
        ))
      }
    </Select>
  );
};

const mapStateToProps = ({
  employeeManage: { teamList },
}) => {
  return { teamList };
};
export default connect(mapStateToProps)(Team);
