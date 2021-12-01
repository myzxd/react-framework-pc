/**
 * code - team信息
*/
import is from 'is_js';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../../../application/utils';

const { Option } = Select;

function ComponentTeam(props) {
  const { dispatch, teams, namespace, codeTeamType, isShowEmpty } = props;
  const str = '- -';
  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchGetTeams',
      payload: {
        teamTypes: codeTeamType,
        namespace,
      },
    });
    () => {
      dispatch({ type: 'employeeManage/reduceGetTeams', payload: { namespace, result: [] } });
    };
  }, [dispatch, namespace, codeTeamType]);
    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'teams',
    'codeTeamType',
    'namespace',
    'isShowEmpty',
  ], props);
  const dataScoure = teams[namespace] ? teams[namespace] : [];
  const options = dataScoure.map((v) => {
    return (
      <Option key={v._id} value={v._id}>{v.name}</Option>
    );
  });
  const teamTypes = Array.isArray(codeTeamType) ? codeTeamType : [codeTeamType];
  // 判断显示空数据，没数据显示，类型包含--显示
  if ((isShowEmpty && (is.not.existy(codeTeamType) || is.empty(codeTeamType))) || (isShowEmpty && teamTypes.includes(str))) {
    options.unshift(
      <Option key={str} value={str}>未配置TEAM</Option>,
    );
  }
  return (
    <Select
      {...omitedProps}
    >
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
