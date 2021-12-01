"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[6018],{66018:function(e,t,r){r.r(t),r.d(t,{default:function(){return _}});r(20186);var a=r(75385),n=(r(52560),r(71577)),o=r(4942),p=r(29439),i=r(55609),l=r(93517),c=r.n(l),s=r(67294),u=r(30381),m=r.n(u),d=r(45430),f=r(96036),y=r(80385),b=(r(9070),r(20924)),S=(r(35668),r(86585)),h=(r(29093),r(16317)),g=r(94315),E=r.n(g),v=r(88144),I=h.Z.Option,O=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.onSearch,r=void 0===t?function(){}:t,a=e.operations,n=void 0===a?void 0:a,o=function(e){var t=e.platforms,a=e.name,n=e.supplierId,o=e.state,p=e;E().existy(t)&&(p.platforms=t),E().existy(a)&&E().not.empty(a)&&(p.name=a),E().existy(n)&&E().not.empty(n)&&(p.supplierId=n),E().existy(o)&&E().not.empty(o)&&(p.state=o),p.page=1,p.limit=30,r&&r(p)},p=function(){var e={platforms:[],name:"",supplierId:void 0,state:"".concat(y.Acu.enable),page:1,limit:30};r&&r(e)},i=[s.createElement(S.Z.Item,{label:"平台",name:"platforms"},s.createElement(v.Yg,{allowClear:!0,showSearch:!0,optionFilterProp:"children",mode:"multiple",showArrow:!0,placeholder:"请选择平台"})),s.createElement(S.Z.Item,{label:"供应商名称",name:"name"},s.createElement(b.Z,{placeholder:"请输入供应商名称"})),s.createElement(S.Z.Item,{label:"供应商ID",name:"supplierId"},s.createElement(b.Z,{placeholder:"请输入供应商ID"})),s.createElement(S.Z.Item,{label:"状态",name:"state"},s.createElement(h.Z,{placeholder:"请选择状态"},s.createElement(I,{value:"".concat(y.Acu.enable)},y.Acu.description(y.Acu.enable)),s.createElement(I,{value:"".concat(y.Acu.stoped)},y.Acu.description(y.Acu.stoped))))],l={items:i,operations:n,expand:!0,onReset:p,onSearch:o,initialValues:{state:"".concat(y.Acu.enable)}};return s.createElement(f.IT,null,s.createElement(f.j6,l))},w=r(29401);function Z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function k(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(r),!0).forEach((function(t){(0,o.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Z(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var _=(0,i.connect)((function(e){var t=e.supplierManage.suppliers;return{dataSource:void 0===t?{}:t}}))((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.dataSource,o=void 0===r?{}:r,i=(0,s.useState)({page:1,limit:30,state:y.Acu.enable}),l=(0,p.Z)(i,2),u=l[0],b=l[1],S=function(e,t){var r={state:y.Acu.enable,page:e,limit:t};b(k(k({},u),{},{page:e,limit:t})),g(r)},h=function(e,t){var r={state:y.Acu.enable,page:e,limit:t};b(k(k({},u),{},{page:e,limit:t})),g(r)},g=function(e){b(k({},e)),t({type:"supplierManage/fetchSuppliers",payload:e})},E=function(){var e=[];return d.ZP.canOperateSystemSupplierUpdate()&&e.push(s.createElement(n.Z,{key:"OperateSystemSupplierUpdate",type:"primary",onClick:function(){window.location.href="#/System/Supplier/Create"},className:w.Z["app-comp-system-supplier-operate-btn"]},"添加供应商")),d.ZP.canOperateModuleSystemSupplierScopeCity()&&e.push(s.createElement(n.Z,{key:"OperateModuleSystemSupplierScopeCity",onClick:function(){window.location.href="#/System/Supplier/Scope/City"},className:w.Z["app-comp-system-supplier-operate-btn"]},"业务分布情况（城市）")),s.createElement(O,{onSearch:g,operations:e})},v=function(){var e=[{title:"供应商ID",dataIndex:"supplier_id",key:"supplier_id",render:function(e){return e||"--"}},{title:"供应商名称",dataIndex:"name",key:"name",render:function(e){return e||"--"}},{title:"所属平台",dataIndex:"platform_name",key:"platform_name",render:function(e){return e||"--"}},{title:"状态",dataIndex:"state",key:"state",render:function(e){return y.Acu.description(e)||"--"}},{title:"创建时间",dataIndex:"created_at",key:"created_at",render:function(e){return e?m()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"停用时间",dataIndex:"forbidden_at",key:"forbidden_at",render:function(e){return e&&Number(u.state)===y.Acu.stoped?m()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"最新操作人",dataIndex:"operator_name",key:"operator_name",render:function(e){return e||"--"}},{title:"操作",dataIndex:"operation",key:"operation",fixed:"right",width:100,render:function(e,t){return!0!==d.ZP.canOperateSystemSupplierUpdate()?s.createElement("a",{href:"#/System/Supplier/Detail?id=".concat(t._id),target:"_blank",rel:"noopener noreferrer",className:w.Z["app-comp-system-supplier-operate-btn"]},"详情"):s.createElement("div",null,s.createElement("a",{href:"#/System/Supplier/Update?id=".concat(t._id),target:"_blank",rel:"noopener noreferrer",className:w.Z["app-comp-system-supplier-operate-btn"]},"编辑"),s.createElement("a",{href:"#/System/Supplier/Detail?id=".concat(t._id),target:"_blank",rel:"noopener noreferrer",className:w.Z["app-comp-system-supplier-operate-btn"]},"详情"))}}],t={current:u.page,pageSize:u.limit||30,onChange:h,showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:S,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],total:c().get(o,"_meta.result_count",0)};return s.createElement(f.IT,null,s.createElement(a.Z,{rowKey:function(e,t){return t},pagination:t,columns:e,dataSource:c().get(o,"data",[]),bordered:!0,scroll:{x:1e3}}))};return s.createElement("div",null,E(),v())}))},29401:function(e,t){t.Z={"app-comp-system-detail-stoped-title":"ksyllvX0nI8pe3ET7Vwy","app-comp-system-title":"XxbfF22BPlE8h6AEBYDd","app-comp-system-line":"IaPUI9qzA92bT4rU4MBs","app-comp-system-detail-enable-title":"uRJK03eNaQlC4rD6YDZ0","app-comp-system-detail-operate-btn":"TBzeeWmVN6i1OYFudBUx","app-comp-system-form-submit-btn":"SMWMu62_PAuaIEsKeBet","app-comp-system-supplier-operate-btn":"oELKpAmWEP8W3rW0UtBT"}}}]);