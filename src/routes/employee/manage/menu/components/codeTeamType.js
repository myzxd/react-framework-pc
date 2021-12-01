/**
 * code - team类型
*/
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../../../application/utils';

const { Option } = Select;

function ComponentTeamType(props) {
  const { dispatch, teamTypes, isShowEmpty, value } = props;
  const str = '- -';
  useEffect(() => {
    dispatch({ type: 'employeeManage/fetchGetTeamTypes', payload: {} });
    () => {
      dispatch({ type: 'employeeManage/reduceGetTeamTypes', payload: [] });
    };
  }, [dispatch]);
    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'teamTypes',
    'isShowEmpty',
  ], props);
  const dataScoure = dot.get(teamTypes, []);
  const options = dataScoure.map((v) => {
    return (
      <Option
        key={v}
        disabled={(is.existy(value) && is.not.empty(value)) && value.includes(str)}
        value={v}
      >{v}</Option>
    );
  });
    // 判断显示空数据
  if (isShowEmpty) {
    options.unshift(
      <Option
        key={str}
        disabled={(is.existy(value) && is.not.empty(value)) && !value.includes(str)}
        value={str}
      >未配置TEAM</Option>,
      );
  }
  return (
    <Select
      {...omitedProps}
      mode="multiple"
    >
      {options}
    </Select>
  );
}

const mapStateToProps = ({
  employeeManage: { teamTypes },
}) => {
  return { teamTypes };
};
export default connect(mapStateToProps)(ComponentTeamType);
