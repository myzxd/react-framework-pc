/**
 * 省、市、区、详细地址组件
 */
import React from 'react';
import { Select, Input } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { regionalList } from './regionalList';

const Option = Select.Option;

const Regional = ({
  value = {},
  onChange,
  add = () => {},
  remove = () => {},
  isList = false,
  field = {},
  fields = [],
  fieldKey,
}) => {
  // 省
  const onChangeProvince = (val) => {
    onChange && onChange({
      province: val,
      city: undefined,
      area: undefined,
      detailed_address: undefined,
    });
  };

  // 市
  const onChangeCity = (val) => {
    onChange && onChange({
      ...value,
      city: val,
      area: undefined,
      detailed_address: undefined,
    });
  };

  // 区
  const onChangeArea = (val) => {
    onChange && onChange({
      ...value,
      area: val,
      detailed_address: undefined,
    });
  };

  // 区
  const onChangeAddress = (e) => {
    onChange && onChange({
      ...value,
      detailed_address: e.target.value,
    });
  };

  const { province, city, area, detailed_address: address } = value;

  // 当前省份
  const currentProvince = province ? regionalList.find(item => item.code === Number(province)) : undefined;
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
    <React.Fragment>
      <Select
        placeholder="请选择省份"
        value={province && Number(province)}
        onChange={onChangeProvince}
        showSearch
        optionFilterProp="children"
        allowClear
        style={{
          width: '15%',
          minWidth: '160px',
          marginRight: 10,
        }}
      >
        {
            regionalList.map((item) => {
              return (
                <Option
                  value={item.code}
                  key={item.code}
                >{item.value}</Option>
              );
            })
          }
      </Select>
      <Select
        placeholder="请选择城市"
        value={city && Number(city)}
        onChange={onChangeCity}
        showSearch
        allowClear
        optionFilterProp="children"
        style={{
          width: '15%',
          minWidth: '160px',
          marginRight: 10,
        }}
      >
        {
            cities.map((item) => {
              return (
                <Option
                  value={item.code}
                  key={item.code}
                >{item.value}</Option>
              );
            })
          }
      </Select>
      <Select
        placeholder="请选择区/县"
        value={area && Number(area)}
        onChange={onChangeArea}
        showSearch
        allowClear
        optionFilterProp="children"
        style={{
          width: '17%',
          minWidth: '160px',
          marginRight: 10,
        }}
      >
        {
          counties.map((item) => {
            return (
              <Option
                value={item.code}
                key={item.code}
              >{item.value}</Option>
            );
          })
        }
      </Select>
      <Input
        value={address}
        onChange={onChangeAddress}
        placeholder="请输入详细地址"
        allowClear
        style={{
          width: '38%',
        }}
      />
      {
        isList ? (
          <span
            style={{
              width: '8%',
              marginLeft: 10,
              display: 'inline-block',
              fontSize: '16px',
            }}
          >
            <span>
              {
                fields.length !== 1 ?
                  <MinusCircleOutlined
                    style={{ margin: '0 20px 0 10px' }}
                    onClick={() => remove(field.name)}
                  />
                  : ''
              }
              {
                fieldKey === fields.length - 1 && fields.length < 5 ?
                  <PlusCircleOutlined onClick={() => add(field.name)} />
                  : ''
              }
            </span>
          </span>
        ) : ''
      }
    </React.Fragment>
  );
};

export default Regional;
