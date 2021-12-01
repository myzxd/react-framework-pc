/**
 *  城市管理-搜索组件
 */
 import { connect } from 'dva';
 import React, { useState } from 'react';
 import PropTypes from 'prop-types';
 import { Form } from 'antd';

 import { CoreSearch, CoreContent } from '../../../components/core';
 import CommonSelectPlatforms from './components/platforms';
 import { CommonSelectScene } from '../../../components/common';

 const NameSpace = 'Search';
 const Search = (props = {}) => {
   const {
     onSearch,
     dispatch,
     operations = undefined,
   } = props;
   // 设置表单
   const [form, setForm] = useState(undefined);
   console.log(form);

   // 搜索
   const onClickSearch = (params) => {
     // 每次点击搜索重置页码为1
     const newParams = {
       ...params,
       meta: { page: 1, limit: 30 },
     };
     if (onSearch) {
       onSearch(newParams);
     }
   };

   // 获取提交用的form表单
   const onHookForm = (val) => {
     setForm(val);
   };

   // 重置搜索条件
   const onReset = () => {
     const params = {
       meta: { page: 1, limit: 30 },
     };
     if (dispatch) {
       dispatch({
         type: 'systemCity/reduceCityList',
         payload: {
           namespace: NameSpace,
           result: {},
         },
       });
     }
     if (onSearch) {
       onSearch(params);
     }
   };

   // 选择所属场景回调
   const onChangeIndustry = (val) => {
     const { setFieldsValue } = form;
     setFieldsValue({ platformIds: undefined });
     if (!val && dispatch) {
       dispatch({
         type: 'systemCity/reduceCityList',
         payload: {
           namespace: NameSpace,
           result: {},
         },
       });
     }
   };

   // 渲染查询条件
   const renderSearch = () => {
     const items = [
       <Form.Item label="所属场景" name="industryCodes">
         <CommonSelectScene onChange={onChangeIndustry} enumeratedType="industry" />
       </Form.Item>,
       <Form.Item
         key="platformIds"
         noStyle
         shouldUpdate={(prevValues, curValues) => prevValues.industryCodes !== curValues.industryCodes}
       >
         {({ getFieldValue }) =>
           <Form.Item label="平台" name="platformIds">
             <CommonSelectPlatforms
               enableSelectAll
               allowClear
               showSearch
               optionFilterProp="children"
               namespace={NameSpace}
               placeholder="请选择平台"
               industryCodes={getFieldValue('industryCodes')}
             />
           </Form.Item>
         }
       </Form.Item>,
     ];
     const params = {
       items,
       operations,
       expand: true,
       onReset,
       onSearch: onClickSearch,
       onHookForm,
     };
     return (
       <CoreContent>
         <CoreSearch {...params} />
       </CoreContent>
     );
   };

   return (
     <div>
       {/* 渲染查询条件 */}
       {renderSearch()}
     </div>
   );
 };

 Search.propTypes = {
   onSearch: PropTypes.func.isRequired,    // 点击搜索事件
 };

 Search.defaultProps = {
   onSearch: () => {},
 };

 export default connect()(Search);

