/**
 * 扩展搜索功能，添加业务相关的级联查询(供应商，平台，城市，商圈)
 */
 import _ from 'lodash';
 import is from 'is_js';
 import dot from 'dot-prop';
 import React, { useState } from 'react';
 import PropTypes from 'prop-types';

 import { DeprecatedCoreSearch } from '../../core';
 import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectCities, CommonSelectDistricts } from '../index';

 const DeprecatedCommonSearchExtension = (props = {}) => {
   const {
     namespace,    // 命名空间
     items,         // 详细item
     specialItems,  // 特殊查询，需要放置在动态之前
     isExpenseModel, // 是否为费用模块
     onReset,        // 重置的回调
     onSearch,       // 搜索的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
     onChange,       // 数据的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
     onHookForm,     // 绑定form控件
   } = props;

   // 表单
   const [form, setFrom] = useState({});

   // 搜索信息
   const [search, setSearch] = useState({});

   // 更换供应商
   const onChangeSuppliers = (e) => {
     const params = {
       ...search,
     };
     params.suppliers = e;
     params.cities = [];
     params.districts = [];
     setSearch(params);

     // 清空选项
     form.setFieldsValue({ cities: [] });
     form.setFieldsValue({ districts: [] });

     // 数据变更的回调
     if (onChange) {
       onChange(params);
     }
   };

   // 更换平台
   const onChangePlatforms = (e) => {
     const params = {
       ...search,
     };
     params.platforms = e;
     params.suppliers = [];
     params.cities = [];
     params.districts = [];
     setSearch(params);

     // 清空选项
     form.setFieldsValue({ suppliers: [] });
     form.setFieldsValue({ cities: [] });
     form.setFieldsValue({ districts: [] });

     // 数据变更的回调
     if (onChange) {
       onChange(params);
     }
   };

   // 更换城市
   const onChangeCity = (e, options) => {
     const params = {
       ...search,
     };
     // 获取city_spelling
     const citySpelling = options.map(option => dot.get(option, 'props.spell', []));
     // 保存城市参数
     params.cities = e;
     // 如果是费用模块，则传入商圈接口为city_spelling(费用模块的value使用的是city_code)
     if (isExpenseModel === true) {
       params.cities = citySpelling;
     }
     params.districts = [];
     setSearch(params);

     form.setFieldsValue({ districts: [] });

     // 数据变更的回调
     if (onChange) {
       onChange(params);
     }
   };

   // 更换区域
   const onChangeDistrict = (e) => {
     const params = {
       ...search,
     };
     params.districts = e;
     setSearch(params);

     // 数据变更的回调
     if (onChange) {
       onChange(params);
     }
   };

   // // 更换职位
   // const onChangePosition = (e) => {
   //   search.positions = e;
   //   setSearch({ search });

   //   // 数据变更的回调
   //   if (onChange) {
   //     onChange(search);
   //   }
   // };

   // 重置
   const onClickReset = () => {
     if (onReset) {
       onReset();
     }

     const params = {
       suppliers: [],  // 供应商
       platforms: [],  // 平台
       cities: [],     // 城市
       districts: [],  // 商圈
     };

     setSearch(params);
   };

   // 搜索
   const onSearchCallback = (values) => {
     const { suppliers: supplier, platforms: platform, cities: citie, districts: district } = values;

     // 默认回调，添加供应商，平台，城市，商圈查询条件
     const params = values;
     if (is.existy(supplier)) {
       params.supplier = supplier;
     }
     if (is.existy(platform)) {
       params.platform = platform;
     }
     if (is.existy(citie)) {
       params.city = citie;
     }
     if (is.existy(district)) {
       params.district = district;
     }

     if (onSearch) {
       onSearch(params);
     }
   };

   // 获取提交用的form表单
   const onHookFormCallback = (forms) => {
     if (onHookForm) {
       onHookForm(forms);
     }
     setFrom(forms);
   };

   const { suppliers, platforms, cities, districts } = search;
   const formItems = _.cloneDeep(items);
   formItems.unshift(
     {
       label: '平台',
       form: forms => (forms.getFieldDecorator('platforms', { initialValue: platforms })(
         <CommonSelectPlatforms showArrow namespace={namespace} allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择平台" onChange={onChangePlatforms} />,
       )),
     },
     {
       label: '供应商',
       form: forms => (forms.getFieldDecorator('suppliers', { initialValue: suppliers })(
         <CommonSelectSuppliers showArrow namespace={namespace} allowClear showSearch platforms={platforms} optionFilterProp="children" mode="multiple" placeholder="请选择供应商" onChange={onChangeSuppliers} />,
       )),
     },
     {
       label: '城市',
       form: forms => (forms.getFieldDecorator('cities', { initialValue: cities })(
         <CommonSelectCities
           showArrow
           namespace={namespace}
           allowClear
           isExpenseModel={isExpenseModel}
           showSearch
           optionFilterProp="children"
           mode="multiple"
           placeholder="请选择城市"
           platforms={platforms}
           suppliers={suppliers}
           onChange={onChangeCity}
         />,
       )),
     },
     {
       label: '商圈',
       form: forms => (forms.getFieldDecorator('districts', { initialValue: districts })(
         <CommonSelectDistricts showArrow namespace={namespace} allowClear showSearch optionFilterProp="children" mode="multiple" placeholder="请选择商圈" platforms={platforms} suppliers={suppliers} cities={cities} onChange={onChangeDistrict} />,
       )),
     },
   );

   if (specialItems.length > 0) {
     formItems.unshift(specialItems[0]);
   }

   // 默认传递所有上级传入的参数
   const params = {
     ...props,
     items: formItems,
     onReset: onClickReset,
     onSearch: onSearchCallback,
     onHookForm: onHookFormCallback,
   };
   return (
     <DeprecatedCoreSearch {...params} />
   );
 };

 DeprecatedCommonSearchExtension.propTypes = {
   namespace: PropTypes.string,    // 命名空间
   items: PropTypes.array,         // 详细item
   specialItems: PropTypes.array,  // 特殊查询，需要放置在动态之前
   isExpenseModel: PropTypes.bool, // 是否为费用模块
   onReset: PropTypes.func,        // 重置的回调
   onSearch: PropTypes.func,       // 搜索的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
   onChange: PropTypes.func,       // 数据的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
   onHookForm: PropTypes.func,     // 绑定form控件
 };

 DeprecatedCommonSearchExtension.defaultProps = {
   namespace: 'default',           // 命名空间
   items: [],                      // 详细item
   specialItems: [],               // 特殊查询，需要放置在动态之前
   isExpenseModel: false,          // 是否为费用模块
   onReset: () => { },              // 重置的回调
   onSearch: () => { },             // 搜索的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
   onChange: () => { },             // 数据的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
   onHookForm: () => { },           // 绑定form控件
 };

 export default DeprecatedCommonSearchExtension;

