/**
 * code - 发票抬头
*/
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../../../../../application/utils';

const { Option } = Select;

function ComponentTeamType(props) {
  const { dispatch, teamTypes, initCostTeamType } = props;
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
  ], props);
  const dataScoure = dot.get(teamTypes, []);
  const options = dataScoure.map((v) => {
    return (
      <Option key={v} value={v}>{v}</Option>
    );
  });
  // 判断初始时，数据源是否包含当前数据
  if (is.existy(initCostTeamType) && is.not.empty(initCostTeamType)) {
    if (!dataScoure.includes(initCostTeamType)) {
      options.push(
        <Option disabled key={initCostTeamType} value={initCostTeamType}>{initCostTeamType}</Option>,
        );
    }
  }
  return (
    <Select {...omitedProps}>
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
