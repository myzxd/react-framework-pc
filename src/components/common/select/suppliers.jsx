/**
 * 公用组件，供应商下拉选择
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectSuppliers = (props = {}) => {
  const {
    namespace,                                                // 命名空间
    state,                                                           // 供应商状态
    platforms,                                                       // 平台数据
    suppliers,                                                      // 供应商数据
    isSubmitNameAsValue,                                          // 是否需要value变成name
    isCascade,
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
    isFilter = undefined,
    isNoSuppliers = false,
    supplierId = undefined,
  } = props;
  const dataSource = dot.get(suppliers, namespace, []);
  //  请求城市接口
  useEffect(() => {
    // 不调接口
    if (isNoSuppliers) {
      return null;
    }
    if (is.not.empty(platforms)) {
      fetchDataSource({ namespace, platforms, state });
    } else {
      fetchDataSource({ namespace, state, isCascade });
    }
    return resetDataSource({ namespace });
  }, [namespace, platforms, state, isCascade, isNoSuppliers, fetchDataSource, resetDataSource]);

  let suppliersData = dataSource;
  // 业主范围进行筛选
  if (isFilter && (is.existy(supplierId) && is.not.empty(supplierId))) {
    // 判断供应商是否相等
    suppliersData = dataSource.filter(data => data.supplier_id === supplierId);
  }
  // 选项
  const options = suppliersData.map((data) => {
    return <Option key={data.supplier_id} value={`${isSubmitNameAsValue ? data.supplier_name : data.supplier_id}`} >{data.supplier_name}</Option>;
  });

  // 默认传递所有上级传入的参数
  const params = { ...props };
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'suppliers',
    'platforms',
    'isCascade',
    'isSubmitNameAsValue',
    'isFilter',
    'supplierId',
    'isNoSuppliers',
  ], params);
  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectSuppliers.propTypes = {
  namespace: PropTypes.string,                                         // 命名空间
  state: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number, PropTypes.array,
  ]),                                                                  // 供应商状态
  platforms: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 平台数据
  suppliers: PropTypes.object,                                         // 供应商数据
  isSubmitNameAsValue: PropTypes.bool,                                 // 是否需要value变成name
  isCascade: PropTypes.bool,                                           // 是否级联
  fetchDataSource: PropTypes.func,                                         // 获取数据
  resetDataSource: PropTypes.func,
};

CommonSelectSuppliers.defaultProps = {
  namespace: 'default',                                                // 命名空间
  state: '',                                                           // 供应商状态
  platforms: [],                                                       // 平台数据
  suppliers: {},                                                      // 供应商数据
  isSubmitNameAsValue: false,                                          // 是否需要value变成name
  isCascade: false,
  fetchDataSource: () => { },                                         // 获取数据
  resetDataSource: () => { },                                         // 重置数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { suppliers } }) => ({ suppliers });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchSuppliers', payload: params }); },
    // 重置列表
    resetDataSource: (params) => { dispatch({ type: 'applicationCommon/resetSuppliers', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectSuppliers);
