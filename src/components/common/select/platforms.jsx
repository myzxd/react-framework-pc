/**
 * 公用组件，平台下拉选择
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectPlatforms = (props = {}) => {
  const {
    namespace,                                               // 命名空间
    defaultValue,                                                   // 默认值
    platforms,                                                      // 平台数据
    showDefaultValue,                                            // 是否显示默认选中平台为第一个
    onChange,
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
    isFilter,
    platformCode,
    scense,
  } = props;

  // 是否设置了默认值
  const [isSetDefaultValue, setIsSetDefaultValue] = useState(false);
  const dataSource = dot.get(platforms, namespace, []);   // 平台数据

  //  请求接口
  useEffect(() => {
    fetchDataSource({ namespace, scense });
    return resetDataSource({ namespace });
  }, [namespace, scense, fetchDataSource, resetDataSource]);

  /**
* 选择了默认展示第一条数据为默认值 &&
* 还未设置默认值 &&
* 数据不为空
* 则设置默认值，并且调用onchange方法
*/
  useEffect(() => {
    if (showDefaultValue && isSetDefaultValue === false && dataSource.length > 0) {
      const defaultValues = [dot.get(dataSource[0], 'platform_code', '')];
      // 设置默认值已设定
      setIsSetDefaultValue(true);
      // 调用onchange回调，回传默认值
      if (is.function(onChange)) {
        onChange(`${defaultValues}`);
      }
    }
  }, [showDefaultValue, isSetDefaultValue, dataSource]);

  // 平台数据优化
  let platformData = dataSource;
  // 业主范围进行筛选
  if (isFilter && (is.existy(platformCode) && is.not.empty(platformCode))) {
    // 判断平台是否相等
    platformData = dataSource.filter(data => data.platform_code === platformCode);
  }
  // 选项
  const options = platformData.map((data) => {
    return <Option key={data.platform_code} value={`${data.platform_code}`} industry={`${data.industry_code}`} >{data.platform_name}</Option>;
  });

  let params = {};
  if (defaultValue) {
    // 传递所有上级传入的参数和默认值
    params = { ...props, defaultValue };
  } else {
    // 默认传递所有上级传入的参数
    params = { ...props };
  }
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'platforms',
    'showDefaultValue',
    'isFilter',
    'platformCode',
  ], params);
  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectPlatforms.propTypes = {
  namespace: PropTypes.string,                                         // 命名空间
  defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // 默认值
  platforms: PropTypes.object,                                        // 平台数据
  showDefaultValue: PropTypes.bool,                                   // 是否显示默认选中平台为第一个
  onChange: PropTypes.func,
  fetchDataSource: PropTypes.func,                                         // 获取城市数据
  resetDataSource: PropTypes.func,
};

CommonSelectPlatforms.defaultProps = {
  namespace: 'default',                                               // 命名空间
  defaultValue: undefined,                                                   // 默认值
  platforms: {},                                                      // 平台数据
  showDefaultValue: false,                                            // 是否显示默认选中平台为第一个
  onChange: () => { },
  fetchDataSource: () => { },                                         // 获取城市数据
  resetDataSource: () => { },                                         // 重置城市数据
};

// 引用数据
const mapStateToProps = ({ applicationCommon: { platforms } }) => ({ platforms });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchPlatforms', payload: params }); },
    // 重置列表
    resetDataSource: (params) => { dispatch({ type: 'applicationCommon/resetPlatforms', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectPlatforms);
