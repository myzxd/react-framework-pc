/**
 * 公用组件，用户信息
 * 未使用
 */
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectUser = (props = {}) => {
  const {
    fetchDataSource,
    resetDataSource,
    allAccount,
  } = props;
  const userData = dot.get(allAccount, 'nameTree', []); // 账号树

  //  请求接口
  useEffect(() => {
    fetchDataSource();
    return resetDataSource();
  }, [fetchDataSource, resetDataSource]);

  const options = userData.map((item) => {
    return <Option value={item.key} key={item.key} disabled={item.disabled}>{item.title}</Option>;
  });
  // 默认传递所有上级传入的参数
  const params = { ...props };
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'applicationCommon',
  ], params);
  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectUser.propTypes = {
  allAccount: PropTypes.object,      // 职位数据
  fetchDataSource: PropTypes.func,                                         // 获取城市数据
  resetDataSource: PropTypes.func,
};

CommonSelectUser.defaultProps = {
  allAccount: {},
  fetchDataSource: () => { },                                         // 获取城市数据
  resetDataSource: () => { },                                         // 重置城市数据
};

// 引用数据
const mapStateToProps = ({ applicationCommon: { allAccount } }) => ({ allAccount });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: () => { dispatch({ type: 'applicationCommon/fetchAllAccountName' }); },
    // 重置列表
    resetDataSource: () => { dispatch({ type: 'applicationCommon/resetAllAccountName' }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectUser);
