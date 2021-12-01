/**
 * 公用组件，城市下拉选择
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { CoreSelect } from '../../../core';
import { omit } from '../../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectCities = (props = {}) => {
  const {
    namespace,                                                // 命名空间
    value,                                                           // 默认值
    suppliers,                                                       // 供应商数据
    platforms,                                                       // 平台数据
    cities,                                                          // 城市数据
    isFilterUndefinedValue,                                       // 是否筛选未定义的默认值
    isExpenseModel,                                               // 是否为费用模块
    fetchCities,                                         // 获取城市数据
    resetCities,                                         // 重置城市数据
  } = props;

  // 城市数据
  const dataSource = dot.get(cities, namespace, []);

  //  请求城市接口
  useEffect(() => {
    if (is.not.empty(suppliers) || is.not.empty(platforms)) {
      const parmas = {
        namespace,
        suppliers,
        platforms,
      };
      fetchCities(parmas);
    }
    return resetCities({ namespace });
  }, [suppliers, platforms, fetchCities, resetCities]);

  // 筛选未定义的默认值
  const filterUndefinedValue = () => {
    // 判断是否有默认值
    if (is.empty(value)) {
      return [];
    }
    // 筛选未定义的默认值
    return value.filter((val) => {
      // 检测数组中的元素是否满足指定条件
      return dataSource.some(item => item.city_spelling === val);
    });
  };

  // 判断城市数据第一个数据是否有全部
  if (is.not.empty(dataSource) && dataSource[0].city_name !== '全部') {
    dataSource.unshift(
      { city_name: '全部', city_spelling: 'all', city_code: 'all', city_name_joint: '全部' },
    );
  }
  // 选项
  const options = dataSource.map((data) => {
    // 城市数据为空的时候，配合过滤filter，过滤当条数据
    if (data.city_spelling === '') {
      // console.log('DEBUG: 城市选项为空，后端配置文件错误，过滤数据', data);
      return '';
    }
    // 费用模块 || 服务费方案 || 结算管理使用fix city_code
    if (isExpenseModel === true) {
      return <Option key={data.city_code} value={`${data.city_code}`} spell={`${data.city_spelling}`}>{data.city_name_joint}</Option>;
    }
    // 其他模块使用city_spelling
    return <Option key={data.city_spelling} value={`${data.city_spelling}`} code={`${data.city_code}`}>{data.city_name_joint}</Option>;
  }).filter(item => item !== '');

  // 默认传递所有上级传入的参数
  const params = { ...props };
  // 是否筛选未定义的默认值
  if (isFilterUndefinedValue) {
    // 筛选未定义的默认值
    params.value = filterUndefinedValue();
  }
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'applicationCommon',
    'platforms',
    'suppliers',
    'isFilterUndefinedValue',
    'isExpenseModel',
  ], params);
  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectCities.propTypes = {
  namespace: PropTypes.string,                                         // 命名空间
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),     // 默认值
  suppliers: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // 供应商数据
  platforms: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // 平台数据
  cities: PropTypes.object,                                            // 城市数据
  isFilterUndefinedValue: PropTypes.bool,                              // 是否筛选未定义的默认值
  isExpenseModel: PropTypes.bool,
  fetchCities: PropTypes.func,                                         // 获取城市数据
  resetCities: PropTypes.func,                                         // 重置城市数据
};

CommonSelectCities.defaultProps = {
  namespace: 'default',                                                // 命名空间
  value: [],                                                           // 默认值
  suppliers: [],                                                       // 供应商数据
  platforms: [],                                                       // 平台数据
  cities: {},                                                          // 城市数据
  isFilterUndefinedValue: false,                                       // 是否筛选未定义的默认值
  isExpenseModel: false,
  fetchCities: () => { },                                         // 获取城市数据
  resetCities: () => { },                                         // 重置城市数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { cities } }) => ({ cities });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchCities: (params) => { dispatch({ type: 'applicationCommon/fetchCities', payload: params }); },
    // 重置列表
    resetCities: (params) => { dispatch({ type: 'applicationCommon/resetCities', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectCities);
