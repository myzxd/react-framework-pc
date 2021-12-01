/**
 * 公司下拉 /Oa/Document/Pages/Administration/Components/CompanySelect
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CompanySelect = ({ dispatch, companyList = {}, value, onChange, disabled }) => {
  const [loadingState, setLoadingState] = useState(true);
  useEffect(() => {
    // 获取数据
    dispatch({ type: 'oaCommon/fetchCompanyList', payload: { onSuccessCallback } });
    // 清除数据
    return () => { dispatch({ type: 'oaCommon/resetCompanyList' }); };
  }, [dispatch]);

  const onSelectChange = (val) => {
    if (onChange) {
      onChange(val);
    }
  };

  // 请求完成后的回调
  const onSuccessCallback = () => {
    setLoadingState(false);
  };

  const { data = [] } = companyList;

  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder="请选择"
      value={value}
      optionFilterProp="children"
      onChange={onSelectChange}
      loading={loadingState}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      disabled={disabled}
    >
      {data.map((item, index) => (<Option value={item._id} key={index}>{item.name}</Option>))}
    </Select>
  );
};

function mapStateToProp({ oaCommon: { companyList } }) {
  return { companyList };
}

export default connect(mapStateToProp)(CompanySelect);
