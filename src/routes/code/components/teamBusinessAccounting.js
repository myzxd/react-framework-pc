/**
 * code - code核算中心
*/
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../application/utils';

const { Option } = Select;

function ComponentTeamBusinessAccounting(props) {
  const { dispatch, orderId, subjectId } = props;
  useEffect(() => {
    if (orderId && subjectId) {
      dispatch({
        type: 'codeCommon/fetchTeamBusinessAccounting',
        payload: {
          orderId,
          subjectId,
        } });
    }
    // 清空数据
    dispatch({ type: 'codeCommon/reduceTeamBusinessAccounting', payload: [] });
    () => {
      dispatch({ type: 'codeCommon/reduceTeamBusinessAccounting', payload: [] });
    };
  }, [dispatch, orderId, subjectId]);
    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'teamBusAccount',
    'orderId',
    'subjectId',
  ], props);
  const dataScoure = dot.get(props, 'teamBusAccount', []);
  const options = dataScoure.map((v) => {
    return (
      <Option key={v._id} value={v._id}>{v.name}</Option>
    );
  });
  return (
    <Select {...omitedProps}>
      {options}
    </Select>
  );
}

const mapStateToProps = ({
  codeCommon: { teamBusAccount },
}) => {
  return { teamBusAccount };
};
export default connect(mapStateToProps)(ComponentTeamBusinessAccounting);
