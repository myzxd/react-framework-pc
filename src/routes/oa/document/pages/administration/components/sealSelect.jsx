/**
 * 印章信息下拉 /Oa/Document/Pages/Administration/Components/SealSelect
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';

import { Select } from 'antd';

const { Option } = Select;

const SealSelect = ({ dispatch, sealList = {}, value, onChange, companyId, sealType, disabled, keepAccountId }) => {
  const [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    if (companyId || keepAccountId) {
      setLoadingState(true);
      // 获取数据
      dispatch({ type: 'administration/fetchSealList', payload: { onSuccessCallback, companyId, sealType: Number(sealType), keepAccountId } });
      // 清除数据
      return () => { dispatch({ type: 'administration/resetSealList' }); };
    }
  }, [dispatch, companyId, sealType, keepAccountId]);

  // 请求完成后的回调
  const onSuccessCallback = () => {
    setLoadingState(false);
  };

  // 回调函数
  const onSelect = (val, option) => {
    if (onChange) {
      onChange(val, option.extra);
    }
  };

  const { data = [] } = sealList;

  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder="请选择"
      optionFilterProp="children"
      value={value}
      onChange={onSelect}
      loading={loadingState}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      disabled={disabled}
    >
      {
        data.map((item, index) => (
          <Option value={item._id} key={index} extra={item}>{item.name}</Option>
        ))
      }
    </Select>
  );
};

function mapStateToProp({ administration: { sealList } }) {
  return { sealList };
}

export default connect(mapStateToProp)(SealSelect);
