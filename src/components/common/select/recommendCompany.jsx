/**
 * 公用Select组件-推荐公司
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectRecommendCompany = (props = {}) => {
  const {
    suppliers,                         // 供应商id列表
    recommendCompanyData,              // 推荐公司列表
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
  } = props;

  //  请求城市接口
  useEffect(() => {
    fetchDataSource({ suppliers });
    return resetDataSource();
  }, [suppliers, fetchDataSource, resetDataSource]);

  const options = recommendCompanyData.map((item) => {
    return <Option value={item._id} key={item._id}>{item.name}</Option>;
  });
  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'suppliers',
    'recommendCompanyData',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectRecommendCompany.propTypes = {
  suppliers: PropTypes.array,            // 供应商id列表
  recommendCompanyData: PropTypes.array, // 推荐公司列表
  fetchDataSource: PropTypes.func,                                         // 获取数据
  resetDataSource: PropTypes.func,
};

CommonSelectRecommendCompany.defaultProps = {
  suppliers: [],                         // 供应商id列表
  recommendCompanyData: [],              // 推荐公司列表
  fetchDataSource: () => { },                                         // 获取数据
  resetDataSource: () => { },                                         // 重置数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { recommendCompanyData } }) => ({ recommendCompanyData });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchRecommendCompany', payload: params }); },
    // 重置列表
    resetDataSource: () => { dispatch({ type: 'applicationCommon/resetRecommendCompany' }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectRecommendCompany);
