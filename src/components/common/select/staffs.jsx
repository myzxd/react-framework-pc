/**
 * 公用组件，用户信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectStaffs = (props = {}) => {
  const {
    namespace,                                                   // 命名空间
    staffs,                                                             // 部门树
    departmentId,                                                              // 选中的value数组
    onChange,
    fetchDataSource,                                         // 获取数据
    resetDataSource,                                         // 重置数据
    state = undefined,
    majorJobInfo = {},
    isDefaultValue,
  } = props;
  // 默认值判断
  const [isSetDefaultValue, setIsSetDefaultValue] = useState(false);

  // 数据
  const dataSource = dot.get(staffs, `${namespace}.data`, []);   // 部门树

  //  请求接口
  useEffect(() => {
    const payload = {
      namespace,
      departmentId,
      state,
    };
    fetchDataSource(payload);
    return () => {
      resetDataSource({ namespace });
    };
  }, [namespace, departmentId, state, fetchDataSource, resetDataSource]);

  //  请求城市接口
  useEffect(() => {
    // 默认值判断
    if (isDefaultValue && isSetDefaultValue !== true
      && is.existy(majorJobInfo) && is.not.empty(majorJobInfo)
      && is.existy(dataSource) && is.not.empty(dataSource)) {
      const defaultValue = dot.get(majorJobInfo, '_id', undefined);
      const items = dataSource.map(v => v.job_info);
      if (onChange) {
        setIsSetDefaultValue(true);
        const item = items.filter(v => v._id === defaultValue)[0];
        const flag = items.some(v => v._id === defaultValue);
        let value;
        if (flag === true) {
          value = defaultValue;
        }
        onChange(value, item);
      }
    }
  }, [staffs, majorJobInfo, dataSource, isDefaultValue, isSetDefaultValue]);


  const options = dataSource.map((item) => {
    //  默认值&事务性审批
    if (isDefaultValue) {
      const id = dot.get(item, 'job_info._id');
      const jobInfo = dot.get(item, 'job_info', {});
      return <Option value={id} item={jobInfo} key={id}>{dot.get(item, 'job_info.name', '--')}({dot.get(item, 'organization_count', 0)})</Option>;
    }
    const id = dot.get(item, '_id');
    return <Option value={id} item={item} key={id}>{dot.get(item, 'job_info.name', '--')}({dot.get(item, 'organization_count', 0)})</Option>;
  });
  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'staffs',
    'departmentId',
    'majorJobInfo',
    'isDefaultValue',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectStaffs.propTypes = {
  namespace: PropTypes.string,                                            // 命名空间
  staffs: PropTypes.object,                                               // 部门树
  departmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 部门id
  fetchDataSource: PropTypes.func,                                         // 获取数据
  resetDataSource: PropTypes.func,
  onChange: PropTypes.func,
};

CommonSelectStaffs.defaultProps = {
  namespace: 'default',                                                   // 命名空间
  staffs: {},                                                             // 部门树
  value: [],
  departmentId: undefined,                                                              // 选中的value数组
  onChange: () => { },
  fetchDataSource: () => { },                                         // 获取数据
  resetDataSource: () => { },                                         // 重置数据
};

// 引用数据
const mapStateToProps = ({ applicationCommon: { staffs } }) => ({ staffs });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchStaffs', payload: params }); },
    // 重置列表
    resetDataSource: (params) => { dispatch({ type: 'applicationCommon/resetStaffs', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectStaffs);
