/*
 * 共享登记 -  签订人组件
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

import {
  SharedSealState,
} from '../../../application/define';

const Option = Select.Option;

const SealCustodian = (props) => {
  const { dispatch, custodian = {}, onChange, value } = props;

  const { data = [] } = custodian;

  useEffect(() => {
    const payload = {
      _meta: { page: 1, limit: 9999 },
      state: SharedSealState.normal,
    };

    dispatch({ type: 'sharedSeal/getSharedSealCustodian', payload });
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
          const { keep_account_info: info = {} } = i;
          return <Option value={info._id} key={info._id}>{info.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ sharedSeal: { custodian } }) => ({ custodian });

export default connect(mapStateToProps)(SealCustodian);
