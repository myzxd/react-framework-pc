/**
 * 枚举值
 */
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

const Enumerated = ({
  filterValues = [],
  enumeratedValue = {},
  dispatch,
  disabled = false,
  value,
  onChange,
  doc,
  type,
  examineFlowBiz,
  enumeratedType,
  mode = undefined,
  isDetail = false,
  style,
}) => {
  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { type, doc, enumeratedType, examineFlowBiz },
    });
    return () => dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
  }, [type, dispatch, doc]);

  if (!enumeratedValue || Object.keys(enumeratedValue).length <= 0 || !enumeratedType) return <Select placeholder="请选择" style={style} />;

  // 获取对应枚举值
  const data = enumeratedValue[enumeratedType] || [];

  // 详情
  if (isDetail) {
    const currentEn = data.find(i => i.value === value) || {};
    const { name: currentName } = currentEn;
    return currentName || '--';
  }

  // 过滤类型
  const dataScoure = data.filter(item => !(Array.isArray(filterValues) && filterValues.includes(item.value)));

  return (
    <Select
      allowClear
      showSearch
      placeholder="请选择"
      optionFilterProp="children"
      disabled={disabled}
      value={value}
      onChange={onChange}
      mode={mode}
      style={style}
    >
      {
        dataScoure.map((i) => {
          return <Option value={i.value} key={i.value}>{i.name}</Option>;
        })
      }
    </Select>
  );
};

function mapStateToProps({ applicationCommon: { enumeratedValue } }) {
  return {
    enumeratedValue,
  };
}

export default connect(mapStateToProps)(Enumerated);
