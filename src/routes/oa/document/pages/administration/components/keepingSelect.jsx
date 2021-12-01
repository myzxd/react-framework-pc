/**
 * 印章保管人下拉 /Oa/Document/Pages/Administration/Components/KeepingSelect
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';

import { Select } from 'antd';

const { Option } = Select;

const KeepingSelect = ({ dispatch, keepingList = [], value, onChange, departmentId, postId, disabled }) => {
  const [loadingState, setLoadingState] = useState(true);
  useEffect(() => {
    dispatch({ type: 'administration/fetchKeepingList', payload: { departmentId, postId, onSuccessCallback, is_current_department: true } });
    return () => { dispatch({ type: 'administration/resetKeepingList' }); };
  }, [dispatch]);


  // 请求完成后的回调
  const onSuccessCallback = () => {
    setLoadingState(false);
  };

  const onSelectChange = (val, option) => {
    if (onChange) {
      onChange(val, option.itemObj);
    }
  };
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
      {keepingList.map((item, index) => (<Option value={item.account_id} key={index} itemObj={item}>{item.name}</Option>))}
    </Select>
  );
};

function mapStateToProp({ administration: { keepingList } }) {
  return { keepingList };
}

export default connect(mapStateToProp)(KeepingSelect);
