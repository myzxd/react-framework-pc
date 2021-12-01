/**
 * code - 科目
*/
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../application/utils';

const { Option } = Select;

function ComponentSubject(props) {
  const { dispatch, orderId } = props;
  useEffect(() => {
    dispatch({ type: 'codeCommon/fetchSubject', payload: { orderId } });
    () => {
      dispatch({ type: 'codeCommon/reduceSubject', payload: {} });
    };
  }, [dispatch, orderId]);
    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'orderId',
    'subjects',
  ], props);
  const dataScoure = dot.get(props, 'subjects', []);
  const options = dataScoure.map((v) => {
    return (
      <Option key={v._id} value={v._id}>{v.name}({v.ac_code})</Option>
    );
  });
  return (
    <Select {...omitedProps}>
      {options}
    </Select>
  );
}

const mapStateToProps = ({
  codeCommon: { subjects },
}) => {
  return { subjects };
};
export default connect(mapStateToProps)(ComponentSubject);
