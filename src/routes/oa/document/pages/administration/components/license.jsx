/**
 * 证照库 /Oa/Document/Pages/Administration/Components/Licence
 */
import { connect } from 'dva';
import React, {
  useEffect,
  useState,
} from 'react';

import { Select } from 'antd';
import dot from 'dot-prop';

const { Option } = Select;

const ComponentLicense = ({ dispatch, licenseList = {}, value, onChange, companyId, license, disabled }) => {
  const [loadingState, setLoadingState] = useState(false);
  const list = dot.get(licenseList, 'data', []);
  useEffect(() => {
    if (companyId) {
      setLoadingState(true);
      dispatch({ type: 'administration/fetchLicenseList', payload: { onSuccessCallback, companyId, license } });
      return () => { dispatch({ type: 'administration/resetLicenseList' }); };
    }
  }, [dispatch, companyId, license]);

   // 请求完成后的回调
  const onSuccessCallback = () => {
    setLoadingState(false);
  };

  const onSelectChange = (val, Options) => {
    if (onChange) {
      onChange(val, Options.info);
    }
  };
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder="请选择"
      value={value}
      loading={loadingState}
      optionFilterProp="children"
      onChange={onSelectChange}
      disabled={disabled}
    >
      {list.map(item => (<Option value={item._id} key={item._id} info={item}>{item.name}</Option>))}
    </Select>
  );
};

function mapStateToProp({ administration: { licenseList } }) {
  return { licenseList };
}

export default connect(mapStateToProp)(ComponentLicense);
