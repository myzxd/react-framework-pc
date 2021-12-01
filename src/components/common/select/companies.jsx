/**
 * 合同甲方
*/
import is from 'is_js';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectCompanies = (props = {}) => {
  const {
    type,                                                        // 三方公司类型
    platforms,                                                   // 平台
    suppliers,                                                   // 供应商
    isElectronicSign,                                         // 是否是电子签约
    dataSource,
    fetchCompanies,                                       // 获取数据
    resetCompanies,
    state,
    initialCompanies = {},
  } = props;

  //  请求城市接口
  useEffect(() => {
    const parmas = {
      platforms,
      suppliers,
      type,
      state,
      isElectronicSign,
    };
    fetchCompanies(parmas);
    return resetCompanies();
  }, [platforms, suppliers, state, type, isElectronicSign]);


  let data = [...dataSource];
  if (is.existy(initialCompanies) && is.not.empty(initialCompanies) &&
    Object.keys(initialCompanies).length > 0 && Array.isArray(dataSource) && dataSource.length > 0) {
    data = dataSource.find(d => d._id === initialCompanies._id) ?
      dataSource
      : [
        ...dataSource,
        {
          ...initialCompanies,
          disabled: true,
        },
      ];
  }
  // 选项
  const options = data.map((d) => {
    return (
      <Option
        disabled={d.disabled}
        key={d._id}
        value={`${d._id}`}
      >
        {d.name}
        {d.disabled ? '(已禁用)' : ''}
      </Option>
    );
  });

  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'type',
    'platforms',
    'suppliers',
    'isElectronicSign',
    'dataSource',
    'initialCompanies',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectCompanies.propTypes = {
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 三方公司类型
  platforms: PropTypes.array,                                      // 平台
  suppliers: PropTypes.array,                                      // 供应商
  state: PropTypes.string,                                          // 状态
  isElectronicSign: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),                                // 是否是电子签约
  dataSource: PropTypes.array,                                         // 重置城市数据
  fetchCompanies: PropTypes.func,                                         // 获取数据
  resetCompanies: PropTypes.func,
};

CommonSelectCompanies.defaultProps = {
  type: '',                                                        // 三方公司类型
  platforms: [],                                                   // 平台
  suppliers: [],                                                   // 供应商
  state: '',                                                        // 状态
  isElectronicSign: false,                                         // 是否是电子签约
  dataSource: [],                                                  // 重置城市数据
  fetchCompanies: () => { },                                         // 获取数据
  resetCompanies: () => { },
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { companies } }) => ({ dataSource: companies });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchCompanies: (params) => { dispatch({ type: 'applicationCommon/fetchCompanies', payload: params }); },
    // 重置列表
    resetCompanies: () => { dispatch({ type: 'applicationCommon/resetCompanies' }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectCompanies);
