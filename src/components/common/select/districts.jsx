/**
 * 公用组件，商圈下拉选择
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { CoreSelect } from '../../core';
import { DistrictState } from '../../../application/define';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectDistricts = (props = {}) => {
  const {
    namespace,  // 命名空间
    state,              // 商圈状态
    suppliers,  // 供应商数据
    platforms,  // 平台数据
    cities,           // 城市数据
    displayAll,        // 显示所有商圈
    filterDisable,  // 过滤禁止商圈
    isCities,       // 根据城市查询接口
    districts,   // 商圈数据
    onCallback,    // 回调函数
    fetchDistricts,
    resetDistricts,
  } = props;

  //  请求商圈接口
  useEffect(() => {
    // 获取所有商圈
    if (displayAll) {
      const parmas = {
        namespace,
        state,
      };
      fetchDistricts(parmas);
    }
    // 根据城市查询接口
    if (isCities && is.not.empty(cities)) {
      const parmas = {
        namespace,
        suppliers,
        platforms,
        cities,
        state,
      };
      fetchDistricts(parmas);
    }
    // 级联查询
    if (is.not.empty(cities) || is.not.empty(suppliers)) {
      const parmas = {
        namespace,
        suppliers,
        platforms,
        cities,
        state,
      };
      fetchDistricts(parmas);
    }
    return resetDistricts({ namespace });
  }, [namespace, suppliers, platforms, cities, displayAll, isCities, state, fetchDistricts, resetDistricts]);


  const dataSource = dot.get(districts, namespace, []);

  // 将商圈长度返回，用来判断是否已经全选
  if (onCallback) {
    onCallback(dataSource.length);
  }

  // 商圈数据
  let districtData = [];

  // 通过过滤禁止参数,来判断是展示禁用状态的数据
  if (filterDisable) {
    districtData = dataSource.filter(item => item.state !== DistrictState.disabled);
  } else {
    districtData = dataSource;
  }
  // 选项
  const options = districtData.map((data) => {
    // 判断状态，显示禁用的标示
    if (DistrictState.disabled === data.state) {
      return <Option key={data._id} value={`${data._id}`} >{data.biz_district_name} (停用)</Option>;
    }

    // 判断状态，显示筹备中的标示
    if (DistrictState.preparation === data.state) {
      return <Option key={data._id} value={`${data._id}`} >{data.biz_district_name} ({DistrictState.description(DistrictState.preparation)})</Option>;
    }

    return <Option key={data._id} value={`${data._id}`} >{data.biz_district_name}</Option>;
  });

  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'districts',
    'state',
    'platforms',
    'suppliers',
    'cities',
    'filterDisable',
    'onCallback',
    'displayAll',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectDistricts.propTypes = {
  namespace: PropTypes.string,  // 命名空间
  state: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),              // 商圈状态
  suppliers: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),  // 供应商数据
  platforms: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),  // 平台数据
  cities: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),           // 城市数据
  displayAll: PropTypes.bool,        // 显示所有商圈
  filterDisable: PropTypes.bool,  // 过滤禁止商圈
  districts: PropTypes.object,   // 商圈数据
  onCallback: PropTypes.func,    // 回调函数
  fetchDistricts: PropTypes.func,
  resetDistricts: PropTypes.func,
};

CommonSelectDistricts.defaultProps = {
  namespace: 'default',  // 命名空间
  state: [],              // 商圈状态
  suppliers: [],  // 供应商数据
  platforms: [],  // 平台数据
  cities: [],           // 城市数据
  displayAll: false,        // 显示所有商圈
  filterDisable: false,  // 过滤禁止商圈
  isCities: false,       // 根据城市查询接口
  districts: {},   // 商圈数据
  onCallback: () => { },    // 回调函数
  fetchDistricts: () => { },
  resetDistricts: () => { },
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { districts } }) => ({ districts });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDistricts: (params) => { dispatch({ type: 'applicationCommon/fetchDistricts', payload: params }); },
    // 重置列表
    resetDistricts: (params) => { dispatch({ type: 'applicationCommon/resetDistricts', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectDistricts);
