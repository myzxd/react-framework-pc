/**
 * 城市管理 - 行政区城市组件
 */
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { Select } from 'antd';
import { connect } from 'dva';

import { CityAreaLevel } from '../../../../application/define';

const { Option } = Select;

const ComponentSelectCities = (props) => {
  const {
    dispatch,
    onCityChange,
    cities = {}, // 城市数据
  } = props;

  // 获取城市数据
  const dataSource = dot.get(cities, 'data', []);

  // 获取城市数据
  useEffect(() => {
    const payload = {
      areaLevel: CityAreaLevel.prefecture, // 区域级别
    };
    dispatch({ type: 'systemCity/fetchCities', payload });
  }, [CityAreaLevel]);

  // 改变城市
  const onChangeCities = (e) => {
    const items = dataSource.filter(v => v._id === e)[0];
    if (onCityChange) {
      onCityChange(items);
    }
  };

    // 选项
  const options = dataSource.map((v) => {
    return (<Option key={v._id} value={v._id} >{v.city_name}</Option>);
  });

  return (
    <Select {...props} onChange={onChangeCities}>
      {options}
    </Select>
  );
};

function mapStateToProps({ systemCity: { cities } }) {
  return { cities };
}

export default connect(mapStateToProps)(ComponentSelectCities);
