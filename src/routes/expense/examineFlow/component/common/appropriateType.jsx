/**
 * 适用类型
 **/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const Enumerated = ({
  value,
  onChange,
  dispatch,
  allEnumerated = {}, // 枚举值
  enumeratedType, // 枚举值类型
}) => {
  useEffect(() => {
    if (allEnumerated
      && Object.keys(allEnumerated).length > 0) return;

    dispatch({
      type: 'applicationCommon/getAllEnumerated',
    });
  }, [dispatch]);

  if (!allEnumerated
    || Object.keys(allEnumerated).length < 1
    || !enumeratedType
  ) {
    return <Select placeholder="请选择" />;
  }

  // 预处理数据
  const pretreatmentData = allEnumerated[enumeratedType] || {};

  // 数据keys
  const dataKeys = Object.keys(pretreatmentData);

  // data
  const data = dataKeys.map((v) => {
    return {
      _id: v,
      value: pretreatmentData[v],
    };
  });

  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="children"
      value={value}
      onChange={onChange}
      placeholder="请选择"
    >
      {
        data.map((u) => {
          return (
            <Option value={u._id} key={u._id}>{u.value}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  applicationCommon: { allEnumerated },
}) => {
  return { allEnumerated };
};

export default connect(mapStateToProps)(Enumerated);
