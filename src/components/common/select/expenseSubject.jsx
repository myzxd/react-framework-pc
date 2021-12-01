/**
 * 费用科目
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { OaCostAccountingState } from '../../../application/define';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectExpenseTypes = (props = {}) => {
  const {
    subjectsData, // 科目列表
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
  } = props;

  //  请求城市接口
  useEffect(() => {
    const payload = {
      state: [OaCostAccountingState.normal],
    };
    fetchDataSource(payload);
    return resetDataSource();
  }, [fetchDataSource, resetDataSource]);

  // 获取科目数据
  const options = subjectsData.map((item) => {
    return <Option value={item.id} key={item.id}>{item.name}({item.accountingCode})</Option>;
  });

  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'subjectsData',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectExpenseTypes.propTypes = {
  subjectsData: [], // 科目列表
  fetchDataSource: PropTypes.func,                                         // 获取城市数据
  resetDataSource: PropTypes.func,
};

CommonSelectExpenseTypes.defaultProps = {
  subjectsData: [], // 科目列表
  fetchDataSource: () => { },                                         // 获取城市数据
  resetDataSource: () => { },                                         // 重置城市数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { subjectsData: { data } } }) => ({ subjectsData: data });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchExpenseSubjects', payload: params }); },
    // 重置列表
    resetDataSource: () => { dispatch({ type: 'applicationCommon/resetExpenseSubject' }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectExpenseTypes);
