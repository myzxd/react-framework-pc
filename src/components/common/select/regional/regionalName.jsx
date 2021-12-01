/**
 * 公用自定义Select组件-地区级联组件
 */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { regionalList } from './regionalList';

const Option = Select.Option;
const noop = () => { };

const CommonSelectRegionalName = (props = {}) => {
  const {
    onChange,
    value,
    disableds = false,
    provinceWidth,
    cityWith,
    id = undefined,
  } = props;

  // 省
  const [province, setProvinces] = useState(undefined);
  // 市
  const [city, setCity] = useState(undefined);

  // 設置省市區默認值
  useEffect(() => {
    if (value && value.province) {
      setProvinces(value.province);
    }
    if (value && value.city) {
      setCity(value.city);
    }
  }, [value]);

  // 更改省份
  const onChangeProvince = (val) => {
    setCity(undefined);
    if (onChange) {
      onChange({
        province: val,
        city: undefined,
      });
    }
  };

  // 更改城市
  const onChangeCity = (val) => {
    setCity(undefined);
    if (onChange) {
      onChange({
        ...value,
        city: val,
      });
    }
  };

  // // 更改区
  // const onChangeArea = (area) => {
  //   if (onChange) {
  //     onChange({
  //       ...value,
  //       area,
  //     });
  //   }
  // };

  // 当前省份
  const currentProvince = regionalList.find(item => item.value === province);
  // 当前省份下城市
  const cities = currentProvince && currentProvince.children
    ? currentProvince.children
    : [];
  // 当前城市
  cities.find(item => item.value === city);
  return (
    <div id={id}>
      {/* 省 */}
      <Select
        placeholder="请选择省份"
        onChange={onChangeProvince}
        value={province}
        disabled={disableds}
        style={{ width: provinceWidth ? provinceWidth : 120, marginRight: 10 }}
      >
        {
          regionalList.map((item) => {
            return <Option value={item.value} key={item.code}>{item.value}</Option>;
          })
        }
      </Select>
      {/* 市 */}
      <Select
        placeholder="请选择城市"
        onChange={onChangeCity}
        value={city}
        disabled={disableds}
        style={{ width: cityWith ? cityWith : 120, marginRight: 10 }}
      >
        {
          cities.map((item) => {
            return <Option value={item.value} key={item.code}>{item.value}</Option>;
          })
        }
      </Select>
    </div>
  );
};

CommonSelectRegionalName.propTypes = {
  onChange: PropTypes.func.isRequired,  // 表单onChange
  value: PropTypes.object,              // initialValue
};

CommonSelectRegionalName.defaultProps = {
  onChange: noop,
  value: {},
};

export default CommonSelectRegionalName;
