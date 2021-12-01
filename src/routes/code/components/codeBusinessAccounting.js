/**
 * code - code核算中心
*/
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../application/utils';

const { Option } = Select;

function ComponentCodeBusinessAccounting(props) {
  const { dispatch, orderId, subjectId } = props;
  useEffect(() => {
    // 审批单id和科目id都满足才调接口
    if (orderId && subjectId) {
      dispatch({
        type: 'codeCommon/fetchCodeBusinessAccounting',
        payload: {
          orderId,
          subjectId,
        } });
    }
    // 清空数据
    dispatch({ type: 'codeCommon/reduceCodeBusinessAccounting', payload: [] });
    () => {
      dispatch({ type: 'codeCommon/reduceCodeBusinessAccounting', payload: [] });
    };
  }, [dispatch, orderId, subjectId]);

  // 改变
  const onChange = (e, option) => {
    const { item = {} } = option;
    if (props.onChange) {
      props.onChange(e, item);
    }
  };
    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'codeBusAccount',
    'orderId',
    'subjectId',
  ], props);
  const dataScoure = dot.get(props, 'codeBusAccount', []);
  const options = dataScoure.map((v) => {
    return (
      <Option key={v._id} item={v} value={v._id}>{v.name}</Option>
    );
  });
  return (
    <Select {...omitedProps} onChange={onChange}>
      {options}
    </Select>
  );
}

const mapStateToProps = ({
  codeCommon: { codeBusAccount },
}) => {
  return { codeBusAccount };
};
export default connect(mapStateToProps)(ComponentCodeBusinessAccounting);
