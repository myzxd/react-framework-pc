/**
 * 审批流数据
 */
 import dot from 'dot-prop';
 import React, { useEffect } from 'react';
 import PropTypes from 'prop-types';
 import { connect } from 'dva';
 import { CoreSelect } from '../../core';
 import { OaApplicationFlowTemplateState } from '../../../application/define';
 import { omit } from '../../../application/utils';

 const Option = CoreSelect.Option;

 const CommonSelectExamineFlows = (props = {}) => {
   const {
     namespace,
     isShowDataDisable,                // 是否显示停用的数据
     onChange,                      // 回调事件
     examineFlows,                        // 审批流数据
     platformCodes,                       // 平台
     bizType,                      // 业务类型
     oaTypes,                             // oa单据类型
     state,                                       // 状态
     fetchDataSource,                                         // 获取城市数据
     resetDataSource,
     approvalType,
     isAll,
   } = props;

   // 获取数据
   const dataSource = dot.get(examineFlows, `${namespace}${isAll}.data`, []);

   //  请求城市接口
   useEffect(() => {
     const payload = {
       oaTypes,  // oa单据类型
       bizType,
       namespace: `${namespace}${isAll}`,
       state, // 状态
       platformCodes, // 平台
       approvalType,
       isNewInterface: isAll, // 是否用新接口
     };
     fetchDataSource(payload);
     return resetDataSource({ namespace: `${namespace}${isAll}` });
   }, [platformCodes, state, namespace, bizType, oaTypes, approvalType, isAll, fetchDataSource, resetDataSource]);


   const onChangeCallback = (e) => {
     let value;
     dataSource.forEach((data) => {
       if (data.id === e) {
         value = data;
       }
     });
     if (onChange) {
       onChange(e, value);
     }
   };

   const disable = OaApplicationFlowTemplateState.disable;
   // 选项
   const options = dataSource.filter(
     data => isShowDataDisable || data.state !== disable).map((data) => {
       // 是否显示停用的数据
       if (disable === data.state) {
         return (<Option key={data.id} value={`${data.id}`} >
           {data.name}({OaApplicationFlowTemplateState.description(data.state)})</Option>);
       }
       return (<Option key={data.id} value={`${data.id}`} >{data.name}</Option>);
     });

   // 默认传递所有上级传入的参数
   const params = { ...props, onChange: onChangeCallback };

   // 去除Antd Select不需要的props
   const omitedProps = omit([
     'dispatch',
     'applicationCommon',
     'isShowDataDisable',
     'platformCodes',
     'bizType',
     'state',
     'examineFlows',
     'oaTypes',
     'approvalType',
     'isAll',
     'namespace',
   ], params);

   return (
     <CoreSelect {...omitedProps} >
       {options}
     </CoreSelect>
   );
 };

 CommonSelectExamineFlows.propTypes = {
   namespace: PropTypes.string,
   isShowDataDisable: PropTypes.bool,       // 是否显示停用的数据
   onChange: PropTypes.func,                // 回调事件
   platformCodes: PropTypes.array,          // 平台
   oaTypes: PropTypes.array,                // oa单据类型
   bizType: PropTypes.oneOfType([           // 业务类型，审批流类型
     PropTypes.string,
     PropTypes.number,
     PropTypes.array,
   ]),
   state: PropTypes.oneOfType([
     PropTypes.array,
     PropTypes.string,
     PropTypes.number,
   ]),
   fetchDataSource: PropTypes.func,                                         // 获取城市数据
   resetDataSource: PropTypes.func,
 };

 CommonSelectExamineFlows.defaultProps = {
   namespace: 'default',
   isShowDataDisable: false,                // 是否显示停用的数据
   onChange: () => { },                      // 回调事件
   examineFlows: {},                        // 审批流数据
   platformCodes: [],                       // 平台
   bizType: undefined,                      // 业务类型
   oaTypes: [],                             // oa单据类型
   state: [
     OaApplicationFlowTemplateState.normal,
     OaApplicationFlowTemplateState.disable,
   ],                                       // 状态
   fetchDataSource: () => { },                                         // 获取城市数据
   resetDataSource: () => { },                                         // 重置城市数据
 };


 // 引用数据
 const mapStateToProps = ({ applicationCommon: { examineFlows } }) => ({ examineFlows });

 const mapDispatchToProps = dispatch => (
   {
     // 获取列表
     fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchExamineFlows', payload: params }); },
     // 重置列表
     resetDataSource: (params) => { dispatch({ type: 'applicationCommon/resetExamineFlows', payload: params }); },
   }
 );

 export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectExamineFlows);

