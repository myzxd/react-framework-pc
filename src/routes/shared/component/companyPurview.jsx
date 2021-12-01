/*
 * 共享登记 - 公司列表组件（带state）
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const Option = Select.Option;

const CompanyPurview = (props) => {
  const { dispatch, companyPurview = {}, onChange, value } = props;

  const { data = [] } = companyPurview;

  useEffect(() => {
    const payload = {
      state: 100,
      _meta: { page: 1, limit: 9999 },
    };

    dispatch({ type: 'sharedCompany/getSharedCompanyPurview', payload });
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
          return <Option value={i._id} key={i._id} child={i}>{i.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  sharedCompany: {
    companyPurview, // 公司列表（名称）(带state)
  },
  }) => ({ companyPurview });

export default connect(mapStateToProps)(CompanyPurview);
