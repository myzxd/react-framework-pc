/**
 * 角色组件
*/
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';

import { CoreSelect } from '../../../../components/core';
import { omit } from '../../../../application/utils';

const Option = CoreSelect.Option;

function CommonSelectAllPositions(props) {
  const { dispatch } = props;
  const dataSource = dot.get(props, 'positions.result', []);

  useEffect(() => {
    const payload = {
      available: [1, 0],
    };
    // 获取数据
    dispatch({ type: 'accountManage/fetchAllPosition', payload });
    return () => {
      // 获取数据
      dispatch({ type: 'accountManage/reduceAllPosition', payload: {} });
    };
  }, [dispatch]);
      // 选项
  const options = dataSource.map((item) => {
    if (item.available === 0) {
      return (<Option
        key={item.gid}
        value={`${item.gid}`}
      >{item.name}(禁用)</Option>);
    }
    return (<Option
      key={item.gid}
      value={`${item.gid}`}
    >{item.name}</Option>);
  });
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'positions',
  ], props);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
}

function mapStateToProps({ accountManage: { positions } }) {
  return { positions };
}

export default connect(mapStateToProps)(CommonSelectAllPositions);
