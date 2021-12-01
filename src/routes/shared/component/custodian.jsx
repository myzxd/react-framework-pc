/*
 * 共享登记 - 合同保管人
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../application/utils';
import {
  SharedContractState,
 } from '../../../application/define';

const Option = Select.Option;

const Custodian = (props) => {
  const { dispatch, custodian = {}, onChange, value } = props;

  const { data = [] } = custodian;

  useEffect(() => {
    const payload = {
      _meta: { page: 1, limit: 9999 },
      state: SharedContractState.normal,
    };
    dispatch({ type: 'sharedContract/getSharedContractCustodian', payload });
  }, [dispatch]);

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'custodian',
    'namespace',
  ], props);

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      {...omitedProps}
    >
      {
        data.map((i) => {
          const { preserver_info: info = {} } = i;
          if (info && info._id) {
            return <Option value={info._id} key={info._id}>{info.name}</Option>;
          }
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ sharedContract: { custodian } }) => ({ custodian });

export default connect(mapStateToProps)(Custodian);
