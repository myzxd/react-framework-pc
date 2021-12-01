/**
 * 盖章类型
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

import { omit } from '../../../../../../../application/utils';

const { Option } = Select;

function ComponentSealType(props) {
  const { dispatch, firmId, sealTypes, isDetail, value } = props;
  useEffect(() => {
    // 清空数据
    dispatch({ type: 'business/reduceBusinessSealTypes', payload: {} });
    if (firmId) {
      dispatch({ type: 'business/fetchBusinessSealTypes', payload: { firmId } });
    }
    return () => {
      dispatch({ type: 'business/reduceBusinessSealTypes', payload: {} });
    };
  }, [dispatch, firmId]);
  const data = dot.get(sealTypes, 'data', []);
  // 过滤数据
  const filterItem = data.filter(item => item.seal_enumerate === value)[0] || {};
  // 判断是否是详情
  if (isDetail) {
    return <span>{dot.get(filterItem, 'seal_name', '--')}</span>;
  }
  const omitProps = {
    ...omit(['dispatch', 'sealTypes', 'firmId', 'isDetail'], props),
  };
  return (
    <Select {...omitProps}>
      {data.map((item) => {
        return <Option value={item.seal_enumerate} key={item.seal_enumerate}>{item.seal_name}</Option>;
      })}
    </Select>
  );
}


const mapStateToProps = ({
  business: { sealTypes },
}) => {
  return { sealTypes };
};
export default connect(mapStateToProps)(ComponentSealType);
