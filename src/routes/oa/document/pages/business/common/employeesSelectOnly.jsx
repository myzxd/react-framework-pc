/**
 * 指定人员下拉（固定合同保管人）
 */
 import React, { useEffect, useState } from 'react';
 import { connect } from 'dva';
 import { Select } from 'antd';
 import PropTypes from 'prop-types';
 import '@ant-design/compatible/assets/index.css';
 import is from 'is_js';
 import { omit } from '../../../../../../application/utils';

 const { Option } = Select;
 function EmployeesSelectOnly(props) {
   const { dispatch, setEmployeesInfo, setEnumerator } = props;
   // 指定人员下拉枚举值信息
   const [employeesSelectInfo, setEmployeesSelectInfo] = useState({});

   // 获取指定人员下拉枚举值
   useEffect(() => {
     (async () => {
       const res = await dispatch({
         type: 'applicationCommon/getEnumeratedType',
         payload: {},
       });

       if (res && res.preserver) {
         setEmployeesSelectInfo(res.preserver);
         // 向父组件传递employeesSelectInfo
         setEmployeesInfo(res.preserver);
       }

       // 传递给父组件枚举表
       if (res && is.existy(setEnumerator)) {
         setEnumerator(res);
       }
     })();
   }, []);

   // 详情展示
   if (props.isDetail) {
     return <span>{employeesSelectInfo.name}</span>;
   // 创建、编辑
   } else {
     return (
       <Select
         showSearch
         {...omit([
           'dispatch',
           'isDetail',
           'employeesSelectInfo',
           'setEmployeesInfo',
           'setEnumerator'], props)}
       >
         <Option value={employeesSelectInfo._id}>{employeesSelectInfo.name}</Option>;
       </Select>
     );
   }
 }

 EmployeesSelectOnly.propTypes = {
   isDetail: PropTypes.bool, // 是否为详情展示
   setEmployeesInfo: PropTypes.func, // 向父组件传递employeesSelectInfo
   setEnumerator: PropTypes.Func, // 向父组件传递枚举表
 };
 EmployeesSelectOnly.defaultProps = {
   isDetail: false,
   setEmployeesInfo: () => {},
 };
 export default connect()(EmployeesSelectOnly);

