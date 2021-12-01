/*
 * 共享登记 - 证照负责人
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { SharedLicenseState } from '../../../application/define';

const Option = Select.Option;

const Principal = (props) => {
  const { dispatch, principal = {}, onChange, value } = props;

  const { data = [] } = principal;

  useEffect(() => {
    const payload = {
      _meta: { page: 1, limit: 9999 },
      state: SharedLicenseState.normal,
    };
    dispatch({ type: 'sharedLicense/getSharedLicensePrincipal', payload });
  }, [dispatch]);

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
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

const mapStateToProps = ({ sharedLicense: { principal } }) => ({ principal });

export default connect(mapStateToProps)(Principal);
