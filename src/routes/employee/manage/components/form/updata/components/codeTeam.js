/**
 * code - 归属team
*/
import is from 'is_js';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../../../../../application/utils';

const { Option } = Select;

function ComponentTeam(props) {
  const { dispatch, teams, namespace, codeTeamType, initCostTeamType, initCostTeamInfo } = props;
  useEffect(() => {
    if (codeTeamType && namespace) {
      dispatch({
        type: 'employeeManage/fetchGetTeams',
        payload: {
          teamTypes: codeTeamType,
          namespace,
        },
      });
      return;
    }
    dispatch({ type: 'employeeManage/reduceGetTeams', payload: [] });
    () => {
      dispatch({ type: 'employeeManage/reduceGetTeams', payload: [] });
    };
  }, [dispatch, codeTeamType, namespace]);
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'teams',
    'codeTeamType',
    'namespace',
  ], props);
  const dataScoure = teams[namespace] ? teams[namespace] : [];
  const options = dataScoure.map((v) => {
    return (
      <Option key={v._id} value={v._id}>{v.name}</Option>
    );
  });
  // 判断初始时，数据源是否包含当前数据
  if (initCostTeamType === codeTeamType && is.existy(initCostTeamInfo) && is.not.empty(initCostTeamInfo)) {
    const info = { _id: initCostTeamInfo.team_id, name: initCostTeamInfo.name };
    // id集合
    const ids = dataScoure.map(v => v._id);
    if (!ids.includes(info._id)) {
      options.push(
        <Option disabled key={info._id} value={info._id}>{info.name}</Option>,
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
  employeeManage: { teams },
}) => {
  return { teams };
};
export default connect(mapStateToProps)(ComponentTeam);
