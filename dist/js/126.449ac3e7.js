"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[126],{13153:function(e,t,a){a(29093);var n=a(16317),r=a(67294),o=a(55609),c=n.Z.Option;t.Z=(0,o.connect)((function(e){return{companyList:e.sharedCompany.companyList}}))((function(e){var t=e.dispatch,a=e.companyList,o=void 0===a?{}:a,l=e.onChange,i=e.value,u=o.data,d=void 0===u?[]:u;return(0,r.useEffect)((function(){return t({type:"sharedCompany/getSharedCompanyList",payload:{_meta:{page:1,limit:0}}}),function(){t({type:"sharedCompany/reduceSharedCompanyList",payload:{}})}}),[t]),r.createElement(n.Z,{placeholder:"请选择",allowClear:!0,showSearch:!0,optionFilterProp:"children",onChange:l,value:i},d.map((function(e){return r.createElement(c,{value:e._id,key:e._id,child:e},e.name)})))}))},70126:function(e,t,a){a.r(t),a.d(t,{default:function(){return L}});var n=a(4942),r=a(29439),o=a(67294),c=a(55609),l=(a(21316),a(75443)),i=(a(52560),a(71577)),u=(a(35668),a(86585)),d=(a(9070),a(20924)),p=(a(51838),a(48086)),s=a(15861),m=(a(29093),a(16317)),f=a(87757),h=a.n(f),y=a(80385),E=a(96036),v=a(13153),S=m.Z.Option,g=(0,c.connect)((function(e){return{custodian:e.sharedSeal.custodian}}))((function(e){var t=e.dispatch,a=e.custodian,n=void 0===a?{}:a,r=e.onChange,c=e.value,l=n.data,i=void 0===l?[]:l;return(0,o.useEffect)((function(){var e={_meta:{page:1,limit:9999},state:y.Xf4.normal};t({type:"sharedSeal/getSharedSealCustodian",payload:e})}),[t]),o.createElement(m.Z,{placeholder:"请选择",allowClear:!0,onChange:r,showSearch:!0,value:c,optionFilterProp:"children"},i.map((function(e){var t=e.keep_account_info,a=void 0===t?{}:t;return o.createElement(S,{value:a._id,key:a._id},a.name)})))})),b=a(45430);function O(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function w(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?O(Object(a),!0).forEach((function(t){(0,n.Z)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):O(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var _=m.Z.Option,Z=(0,c.connect)((function(e){return{enumeratedValue:e.codeRecord.enumeratedValue}}))((function(e){var t=e.onSearch,a=void 0===t?function(){}:t,n=e.dispatch,c=e.enumeratedValue,f=void 0===c?{}:c,S=(0,o.useState)({}),O=(0,r.Z)(S,2),Z=O[0],C=O[1];(0,o.useEffect)((function(){return n({type:"codeRecord/getEnumeratedValue",payload:{}}),function(){n({type:"codeRecord/resetEnumerateValue",payload:{}})}}),[n]);var P,j=function(){var e=(0,s.Z)(h().mark((function e(){var t;return h().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Z.validateFields();case 2:t=e.sent,n({type:"sharedSeal/exportSharedSeal",payload:{params:w({},t),onSuccessCallback:function(){return p.ZP.success("创建下载任务成功")},onFailureCallback:function(){return p.ZP.error("导出数据失败")}}});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),I=[o.createElement(u.Z.Item,{label:"印章名称",name:"name"},o.createElement(d.Z,{placeholder:"请输入",allowClear:!0})),o.createElement(u.Z.Item,{label:"公司名称",name:"firm_id"},o.createElement(v.Z,null)),o.createElement(u.Z.Item,{label:"印章类型",name:"seal_type"},o.createElement(m.Z,{placeholder:"请选择",allowClear:!0},(P=f.seal_types||[],P.length>0?P.map((function(e){return o.createElement(_,{value:e.value},e.name)})):[]))),o.createElement(u.Z.Item,{label:"印章状态",name:"state"},o.createElement(m.Z,{placeholder:"请选择",allowClear:!0},o.createElement(_,{value:y.Xf4.normal},y.Xf4.description(y.Xf4.normal)),o.createElement(_,{value:y.Xf4.scrap},y.Xf4.description(y.Xf4.scrap)))),o.createElement(u.Z.Item,{label:"印章保管人",name:"keep_account_id"},o.createElement(g,null)),o.createElement(u.Z.Item,{label:"借用状态",name:"borrow_state"},o.createElement(m.Z,{placeholder:"请选择",allowClear:!0},o.createElement(_,{value:y.hEf.not},y.hEf.description(y.hEf.not)),o.createElement(_,{value:y.hEf.already},y.hEf.description(y.hEf.already)))),o.createElement(u.Z.Item,{label:"印章ID",name:"_id"},o.createElement(d.Z,{placeholder:"请输入"}))],k={operations:o.createElement("span",null,b.ZP.canOperateSharedSealCreate()?o.createElement(i.Z,{type:"primary",onClick:function(){window.location.href="/#/Shared/Seal/Create"}},"创建"):"",b.ZP.canOperateSharedSealExport()?o.createElement(l.Z,{title:"创建下载任务？",onConfirm:j,okText:"确认",cancelText:"取消"},o.createElement(i.Z,{type:"primary",style:{marginLeft:10}},"导出EXCEL")):""),items:I,onSearch:a,onReset:a,onHookForm:function(e){C(e)}};return o.createElement(E.IT,null,o.createElement(E.j6,k))})),C=(a(20186),a(75385)),P=a(30381),j=a.n(P),I=(0,c.connect)((function(e){return{enumeratedValue:e.codeRecord.enumeratedValue}}))((function(e){var t=e.sealList,a=void 0===t?{}:t,n=e.onShowSizeChange,r=void 0===n?function(){}:n,c=e.onChangePage,l=void 0===c?function(){}:c,i=e.dispatch,u=e.enumeratedValue,d=void 0===u?{}:u,p=a.data,s=void 0===p?[]:p,m=a._meta,f=void 0===m?{}:m;(0,o.useEffect)((function(){return i({type:"codeRecord/getEnumeratedValue",payload:{}}),function(){i({type:"codeRecord/resetEnumerateValue",payload:{}})}}),[i]);var h=[{title:"印章ID",dataIndex:"_id"},{title:"印章名称",dataIndex:"name"},{title:"印章类型",dataIndex:"seal_type",render:function(e){return e?(t=e,a=d.seal_types||[],n="--",a.length>0&&a.forEach((function(e){e.value===t&&(n=e.name)})),n):"--";var t,a,n}},{title:"公司名称",dataIndex:["firm_info","name"]},{title:"保管人",dataIndex:["keep_account_info","name"]},{title:"印章状态",dataIndex:"state",render:function(e){return e?y.Xf4.description(e):"--"}},{title:"借用状态",dataIndex:"borrow_state",render:function(e){return e?y.Y7o.description(e):"--"}},{title:"借用人",dataIndex:["borrower_info","name"],render:function(e){return e||"--"}},{title:"预计归还时间",dataIndex:"expected_return_date",render:function(e){return e?j()(String(e)).format("YYYY-MM-DD"):"--"}},{title:"操作",dataIndex:"_id",width:150,render:function(e){var t="/#/Shared/Seal/Update?id=".concat(e),a="/#/Shared/Seal/Detail?id=".concat(e);return o.createElement("div",null,b.ZP.canOperateSharedSealDetail()?o.createElement("a",{href:a,target:"_blank",rel:"noopener noreferrer"},"查看"):"",b.ZP.canOperateSharedSealUpdate()?o.createElement("a",{href:t,style:{marginLeft:10}},"编辑"):"")}}],v={current:f.page||1,defaultPageSize:30,pageSize:f.page_size||30,showQuickJumper:!0,showSizeChanger:!0,onChange:l,onShowSizeChange:r,showTotal:function(e){return"总共".concat(e,"条")},total:f.result_count,pageSizeOptions:["10","20","30","40"]};return o.createElement(E.IT,{title:"印章列表"},o.createElement(C.Z,{rowKey:function(e,t){return e._id||t},columns:h,dataSource:s,pagination:v,bordered:!0}))}));function k(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function x(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?k(Object(a),!0).forEach((function(t){(0,n.Z)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):k(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var L=(0,c.connect)((function(e){return{sealList:e.sharedSeal.sealList}}))((function(e){var t=e.dispatch,a=e.sealList,n=(0,o.useState)({_meta:{page:1,limit:30}}),c=(0,r.Z)(n,2),l=c[0],i=c[1];(0,o.useEffect)((function(){return t({type:"sharedSeal/getSharedSealList",payload:x({},l)}),function(){t({type:"sharedSeal/reduceSharedSealList",payload:{}})}}),[t,l]);return o.createElement("div",null,o.createElement(Z,{onSearch:function(e){i(x({_meta:{page:1,limit:30}},e))},dispatch:t}),o.createElement(I,{sealList:a,onChangePage:function(e,t){i(x(x({},l),{},{_meta:{page:e,limit:t}}))},onShowSizeChange:function(e,t){i(x(x({},l),{},{_meta:{page:e,limit:t}}))}}))}))}}]);