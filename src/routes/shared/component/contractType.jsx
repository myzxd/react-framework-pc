/**
 * 合同类型
 */
 import React, { useEffect, useState } from 'react';
 import { connect } from 'dva';
 import { Select } from 'antd';
 import PropTypes from 'prop-types';
 import '@ant-design/compatible/assets/index.css';
 import { omit, dotOptimal } from '../../../application/utils';

 const { Option } = Select;

 function ContractType(props) {
   const { dispatch } = props;
   const [contractTypeInfo, setContractTypeInfo] = useState({});

   // 获取合同类型枚举值
   useEffect(() => {
     (async () => {
       const res = await dispatch({
         type: 'applicationCommon/getEnumeratedType',
         payload: {},
       });
       // 合同类型枚举值存在时，保存
       if (res && res.pact_types_has_sub_types) {
         setContractTypeInfo(res.pact_types_has_sub_types);
       }
     })();
   }, []);

    // option
   const options = Object.keys(contractTypeInfo).map((item) => {
     return <Option value={`${item}`} key={item}>{dotOptimal(contractTypeInfo, `${item}.name`)}</Option>;
   });

   // 详情展示
   if (props.isDetail) {
     return (
       <div>
         {
           props.showValue.map(item => dotOptimal(contractTypeInfo, `${item}.name`)).join(',')
         }
       </div>
     );
   // 创建、编辑
   } else {
     return (
       <Select
         allowClear
         showSearch
         {...omit(['dispatch', 'isDetail', 'showValue'], props)}
       >
         {options}
       </Select>
     );
   }
 }

 ContractType.propTypes = {
   isDetail: PropTypes.bool, // 是否为详情展示
   showValue: PropTypes.array, // 详情展示枚举
 };
 ContractType.defaultProps = {
   isDetail: false,
   showValue: [],
 };
 export default connect()(ContractType);
