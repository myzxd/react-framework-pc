/**
 * 公用组件，岗位下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectStaffs = (props = {}) => {
  const {
    namespace,                                                   // 命名空间
    staffs,                                                             // 部门树
    fetchStaffs,
    resetStaffs,
    departmentId,
  } = props;

  //  请求接口
  useEffect(() => {
    const parmas = {
      namespace,
      departmentId,
    };
    fetchStaffs(parmas);
    return resetStaffs({ namespace });
  }, [namespace, departmentId, fetchStaffs, resetStaffs]);


  const dataSource = dot.get(staffs, `${namespace}.data`, []);   // 部门树
  const options = dataSource.map((item) => {
    const id = dot.get(item, 'job_id');
    return <Option value={id} item={item} key={id}>{dot.get(item, 'job_info.name', '--')}({dot.get(item, 'organization_count', 0)})</Option>;
  });
  // 默认传递所有上级传入的参数
  const params = { ...props };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'staffs',
    'departmentId',
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
  fetchStaffs: PropTypes.func,
  resetStaffs: PropTypes.func,
};

CommonSelectStaffs.defaultProps = {
  namespace: 'default',                                                   // 命名空间
  staffs: {},                                                             // 部门树
  value: [],
  fetchStaffs: () => { },
  resetStaffs: () => { },
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { staffs } }) => ({ staffs });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchStaffs: (params) => { dispatch({ type: 'applicationCommon/fetchStaffs', payload: params }); },
    // 重置列表
    resetStaffs: (params) => { dispatch({ type: 'applicationCommon/resetStaffs', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectStaffs);
