/**
 * 公用组件，审批岗位
 */
 import dot from 'dot-prop';
 import React, { useEffect } from 'react';
 import PropTypes from 'prop-types';
 import { connect } from 'dva';
 import { CoreSelect } from '../../core';
 import { omit } from '../../../application/utils';

 const Option = CoreSelect.Option;

 const CommonSelectJobs = (props = {}) => {
   const {
     approvalJobs,
     fetchDataSource,                                         // 获取城市数据
     resetDataSource,
   } = props;

   //  请求城市接口
   useEffect(() => {
     fetchDataSource();
     return resetDataSource();
   }, [fetchDataSource, resetDataSource]);

   const jobsData = dot.get(approvalJobs, 'data', []);
   const options = jobsData.map((item) => {
     return <Option value={item._id} key={item._id}>{item.post_name}</Option>;
   });
   // 默认传递所有上级传入的参数
   const params = { ...props };

   // 去除Antd Select不需要的props
   const omitedProps = omit([
     'dispatch',
     'approvalJobs',
   ], params);

   return (
     <CoreSelect {...omitedProps} >
       {options}
     </CoreSelect>
   );
 };

 CommonSelectJobs.propTypes = {
   approvalJobs: PropTypes.object, // 数据
   fetchDataSource: PropTypes.func,                                         // 获取城市数据
   resetDataSource: PropTypes.func,
 };

 CommonSelectJobs.defaultProps = {
   approvalJobs: {}, // 数据
   fetchDataSource: () => { },                                         // 获取城市数据
   resetDataSource: () => { },                                         // 重置城市数据
 };


 // 引用数据
 const mapStateToProps = ({ applicationCommon: { approvalJobs } }) => ({ approvalJobs });

 const mapDispatchToProps = dispatch => (
   {
     // 获取列表
     fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchRecommendApprovalJobs', payload: params }); },
     // 重置列表
     resetDataSource: () => { dispatch({ type: 'applicationCommon/resetRecommendApprovalJobs' }); },
   }
 );

 export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectJobs);

