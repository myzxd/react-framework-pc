/**
 * 费用分组
 */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectExpenseTypes = (props = {}) => {
  const {
    dataSource, // 科目列表
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
    scense = undefined,
  } = props;

  //  请求城市接口
  useEffect(() => {
    const payload = {
      scense,
    };
    fetchDataSource(payload);
    return resetDataSource();
  }, [fetchDataSource, scense, resetDataSource]);

  // 选项
  const options = dataSource.map((data) => {
    return <Option key={data._id} value={`${data._id}`} template={data.template}>{data.name}</Option>;
  });

  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'dataSource',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectExpenseTypes.propTypes = {
  dataSource: PropTypes.array, // 科目列表
  fetchDataSource: PropTypes.func,                                         // 获取城市数据
  resetDataSource: PropTypes.func,
};

CommonSelectExpenseTypes.defaultProps = {
  dataSource: [], // 科目列表
  fetchDataSource: () => { },                                         // 获取城市数据
  resetDataSource: () => { },                                         // 重置城市数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { expenseTypes } }) => ({ dataSource: expenseTypes });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchExpenseTypes', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectExpenseTypes);
