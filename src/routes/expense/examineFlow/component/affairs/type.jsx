/**
 * 类型
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const Type = ({
  enumeratedValue = {},
  value = [],
  onChange,
  type,
  dispatch,
  isDetail,
}) => {
  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { enumeratedType: type },
    });
  }, [dispatch, type]);
  if (Object.keys(enumeratedValue).length < 1 || !type) return <div />;

  const data = enumeratedValue[type] || [];

  // 详情
  if (isDetail) {
    if (value.length < 1) return '--';
    const filVal = data.filter(i => value.includes(i.value)) || [];
    return filVal.map(i => i.name).join('、');
  }

  return (
    <Select
      value={value}
      placeholder="请选择"
      mode="multiple"
      showArrow
      onChange={onChange}
      allowClear
      showSearch
      optionFilterProp="children"
    >
      {
        data.map(i => <Option value={i.value} key={i.value}>{i.name}</Option>)
      }
    </Select>
  );
};

const mapStateToProps = ({ applicationCommon: { enumeratedValue } }) => {
  return { enumeratedValue };
};

export default connect(mapStateToProps)(Type);
