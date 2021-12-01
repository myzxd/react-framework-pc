/*
 * 共享登记 -  签订单位
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
// import {
//   SharedContractState,
// } from '../../../application/define';

const Option = Select.Option;

const Signatory = (props) => {
  const { dispatch, signUnitList = {}, onChange, value } = props;
  const { data = [] } = signUnitList;

  useEffect(() => {
    const payload = {
      _meta: { page: 1, limit: 9999 },
      // state: SharedContractState.normal,
    };

    dispatch({ type: 'sharedContract/getSharedSignUnit', payload });
  }, [dispatch]);

  return (
    <Select
      placeholder="请选择"
      allowClear
      onChange={onChange}
      showSearch
      value={value}
      optionFilterProp="children"
    >
      {
        data.map((i) => {
          return <Option value={i._id} key={i._id}>{i.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ sharedContract: { signUnitList } }) => ({ signUnitList });

export default connect(mapStateToProps)(Signatory);
