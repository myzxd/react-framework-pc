/**
 * 城市select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Scenes = ({
  dispatch,
  cityList = {}, // 场景列表
  value,
  onChange,
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'costAmortization/getCityList',
      payload: {},
    });
    return () => {
      dispatch({ type: 'costAmortization/resetCityList' });
    };
  }, [dispatch]);

  // 项目data
  const { data = [] } = cityList;

  return (
    <Select
      value={value}
      onChange={onChange}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      {
        data.map((i) => {
          return (
            <Option value={i._id} key={i._id}>
              {i.city_name}
            </Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  costAmortization: { cityList },
}) => {
  return { cityList };
};

export default connect(mapStateToProps)(Scenes);
