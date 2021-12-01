/**
 * 公用自定义Select组件-地区级联组件
 */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { regionalList } from './regionalList';

const Option = Select.Option;
const noop = () => { };

const CommonSelectRegionalCascade = (props = {}) => {
  const {
    onChange,  // 表单onChange
    value,              // initialValue
    isHideArea,           // 是否隐藏区选择
    id, // 自定义表单id
    style = {},
    disabled = false,
  } = props;

  // 省
  const [province, setProvinces] = useState(undefined);
  // 市
  const [city, setCity] = useState(undefined);
  // 区
  const [area, setArea] = useState(undefined);

  // 設置省市區默認值
  useEffect(() => {
    if (value && value.province) {
      setProvinces(value.province);
    }
    if (value && value.city) {
      setCity(value.city);
    }
    if (value && value.area) {
      setArea(value.area);
    }
  }, [value]);

  // 更改省份
  const onChangeProvince = (val) => {
    setCity(undefined);
    setArea(undefined);
    if (onChange) {
      onChange({
        province: val,
        city: undefined,
        area: undefined,
      });
    }
  };

  // 更改城市
  const onChangeCity = (val) => {
    setArea(undefined);
    if (onChange) {
      onChange({
        ...value,
        city: val,
        area: undefined,
      });
    }
  };

  // 更改区
  const onChangeArea = (val) => {
    if (onChange) {
      onChange({
        ...value,
        area: val,
      });
    }
  };

  // 当前省份
  const currentProvince = regionalList.find(item => item.code === Number(province));
  // 当前省份下城市
  const cities = currentProvince && currentProvince.children
    ? currentProvince.children
    : [];
  // 当前城市
  const currentCities = cities.find(item => item.code === Number(city));
  // 当前城市下区或县
  const counties = currentCities && currentCities.children
    ? currentCities.children
    : [];
  return (
    <div id={id}>
      {/* 省 */}
      <Select
        placeholder="请选择省份"
        onChange={onChangeProvince}
        value={province && Number(province)}
        style={style.province ? { ...style.province } : { width: 120, marginRight: 10 }}
        disabled={disabled}
        showSearch
        optionFilterProp="children"
      >
        {
          regionalList.map((item) => {
            return <Option value={item.code} key={item.code}>{item.value}</Option>;
          })
        }
      </Select>
      {/* 市 */}
      <Select
        placeholder="请选择城市"
        onChange={onChangeCity}
        value={city && Number(city)}
        style={style.city ? { ...style.city } : { width: 120, marginRight: 10 }}
        disabled={disabled}
        showSearch
        optionFilterProp="children"
      >
        {
          cities.map((item) => {
            return <Option value={item.code} key={item.code}>{item.value}</Option>;
          })
        }
      </Select>
      {/* 区/县 */}
      {
        isHideArea
        || <Select
          placeholder="请选择区/县"
          onChange={onChangeArea}
          value={area && Number(area)}
          style={{ width: 120 }}
          disabled={disabled}
          showSearch
          optionFilterProp="children"
        >
          {
            counties.map((item) => {
              return <Option value={item.code} key={item.code}>{item.value}</Option>;
            })
          }
        </Select>
      }
    </div>
  );
};

CommonSelectRegionalCascade.propTypes = {
  onChange: PropTypes.func.isRequired,  // 表单onChange
  value: PropTypes.object,              // initialValue
  isHideArea: PropTypes.bool,           // 是否隐藏区选择
  id: PropTypes.string, // 自定义表单id
};

CommonSelectRegionalCascade.defaultProps = {
  onChange: noop,
  isHideArea: false,
  id: '',
};


export default CommonSelectRegionalCascade;
