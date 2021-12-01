/**
 * 公用组件，用户下拉选择
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';
import { AccountState } from '../../../application/define';

const Option = CoreSelect.Option;

const CommonSelectExamineAccount = (props = {}) => {
  const {
    dataSource,
    isSpecial,
    fetchAllAccountName,                                         // 获取数据
    resetAllAccountName,                                         // 重置数据
  } = props;

  //  请求城市接口
  useEffect(() => {
    const payload = {
      state: [AccountState.on, AccountState.off],
    };
    fetchAllAccountName(payload);
    return resetAllAccountName();
  }, [fetchAllAccountName, resetAllAccountName]);


  let options;

  // 选项显示为 name (phone) 格式
  if (isSpecial === true) {
    options = dataSource.map((data) => {
      return <Option key={data.id} value={data.id} phone={data.phone} >{`${data.name}（${data.phone}）`}</Option>;
    }).filter(item => item !== '');
  } else {
    options = dataSource.map((data) => {
      // 禁用
      if (data.state === AccountState.off) {
        return <Option key={data.id} value={data.id} phone={data.phone} >{data.name}({AccountState.description(data.state)})</Option>;
      }
      return <Option key={data.id} value={data.id} phone={data.phone} >{data.name}</Option>;
    }).filter(item => item !== '');
  }

  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'dataSource',
    'isSpecial',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectExamineAccount.propTypes = {
  dataSource: PropTypes.array,                                     // 用户数据
  isSpecial: PropTypes.bool,
  fetchAllAccountName: PropTypes.func,                                         // 获取数据
  resetAllAccountName: PropTypes.func,                                         // 重置数据
};

CommonSelectExamineAccount.defaultProps = {
  dataSource: [],
  isSpecial: false,
  fetchAllAccountName: () => { },                                         // 获取数据
  resetAllAccountName: () => { },                                         // 重置数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { allAccount: { name } } }) => ({ dataSource: name });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchAllAccountName: (params) => { dispatch({ type: 'applicationCommon/fetchAllAccountName', payload: params }); },
    // 重置列表
    resetAllAccountName: () => { dispatch({ type: 'applicationCommon/resetAllAccountName', payload: {} }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectExamineAccount);
