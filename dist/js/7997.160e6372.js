"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7997],{32022:function(e,t,n){n(29093);var r=n(16317),i=n(55609),c=n(67294),a=r.Z.Option;t.Z=(0,i.connect)((function(e){return{societyPlanList:e.society.societyPlanList}}))((function(e){var t=e.city,n=e.societyPlanList,i=void 0===n?{}:n,o=e.dispatch,p=e.onChange,u=e.initValue,l=void 0===u?void 0:u;(0,c.useEffect)((function(){return o({type:"society/fetchSocietyPlanList",payload:{city:t}}),function(){return o({type:"society/reduceSocietyPlanList",payload:{}})}}),[o,t]);var d=i.data||[];return c.createElement(r.Z,{showSearch:!0,placeholder:"请选择",onChange:function(e){p&&p(e)},allowClear:!0,defaultValue:l,optionFilterProp:"children",filterOption:function(e,t){return t.children.toLowerCase().indexOf(e.toLowerCase())>=0}},d.map((function(e,t){return c.createElement(a,{value:e.name,key:t},e.name)})))}))},37997:function(e,t,n){n.r(t),n.d(t,{default:function(){return I}});n(20186);var r=n(75385),i=(n(52560),n(71577)),c=n(4942),a=n(29439),o=n(30381),p=n.n(o),u=n(93517),l=n.n(u),d=n(55609),m=n(67294),s=n(96036),y=n(80385),_=n(45430),f=n(55306),h=(n(35668),n(86585)),w=n(88144),b=n(32022);function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){(0,c.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var k=function(e){var t,n=e.onSearch,r=function(){n&&n(!1)},i=function(e){var t=v(v({},e),{},{meta:{page:1,limit:30}});n&&n(t)};return m.createElement("div",null,(t={items:[m.createElement(h.Z.Item,{label:"城市",name:"city"},m.createElement(w.TJ,{isHideArea:!0})),m.createElement(h.Z.Item,{label:"参保方案名称",name:"planName"},m.createElement(b.Z,null))],onReset:r,onSearch:i},m.createElement(s.IT,null,m.createElement(s.j6,t))))};function O(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?O(Object(n),!0).forEach((function(t){(0,c.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):O(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var I=(0,d.connect)((function(e){return{societyList:e.society.societyList}}))((function(e){var t=e.dispatch,n=e.societyList,c=void 0===n?{}:n,o=c.data,u=void 0===o?[]:o,d=(0,m.useState)({}),h=(0,a.Z)(d,2),w=h[0],b=h[1],g=(0,m.useState)({page:1,limit:30}),v=(0,a.Z)(g,2),O=v[0],I=v[1];(0,m.useEffect)((function(){return t({type:"society/fetchSocietyList",payload:x(x({},O),w)}),function(){return t({type:"society/reduceSocietyList",payload:{}})}}),[t,w,O]);var E,S,P,j,Z=function(e,t){I({page:e,limit:t})},C=function(e,t){I({page:e,limit:t})},D=function(){window.location.href="/#/Employee/Society/Create"};return m.createElement(m.Fragment,null,m.createElement(k,{onSearch:function(e){if(!e)return b({}),I({page:1,limit:30}),!1;var t=x(x({},O),e);b(t)}}),(E=function(e){return e||0===e?y.fbc.exchangePriceToYuan(e):void 0},S=[{title:"方案名称",fixed:"left",width:150,key:"name",dataIndex:"name",render:function(e){return e||"--"}},{title:"城市",fixed:"left",width:150,key:"splicing_name",dataIndex:"splicing_name",render:function(e){return e||"--"}},{title:"养老基数下限(元)",width:150,key:"old_age_insurance.lower_limit",dataIndex:"old_age_insurance",render:function(e){return E(e.lower_limit)||"--"}},{title:"养老基数上限(元)",width:150,key:"old_age_insurance.upper_limit",dataIndex:"old_age_insurance",render:function(e){return E(e.upper_limit)||"--"}},{title:"养老企业比例",width:150,key:"old_age_insurance.company_percent",dataIndex:"old_age_insurance",render:function(e){return e.company_percent?"".concat(e.company_percent,"%"):"--"}},{title:"养老个人比例",width:150,key:"old_age_insurance.person_percent",dataIndex:"old_age_insurance",render:function(e){return e.person_percent?"".concat(e.person_percent,"%"):"--"}},{title:"医疗基数下限(元)",width:150,key:"medical_insurance.lower_limit",dataIndex:"medical_insurance",render:function(e){return E(e.lower_limit)||"--"}},{title:"医疗基数上限(元)",width:150,key:"medical_insurance.upper_limit",dataIndex:"medical_insurance",render:function(e){return E(e.upper_limit)||"--"}},{title:"医疗企业比例",width:150,key:"medical_insurance.company_percent",dataIndex:"medical_insurance",render:function(e){return e.company_percent?"".concat(e.company_percent,"%"):"--"}},{title:"医疗个人比例",width:150,key:"medical_insurance.person_percent",dataIndex:"medical_insurance",render:function(e){return e.person_percent?"".concat(e.person_percent,"%"):"--"}},{title:"失业基数下限(元)",width:150,key:"unemployment_insurance.lower_limit",dataIndex:"unemployment_insurance",render:function(e){return E(e.lower_limit)||"--"}},{title:"失业基数上限(元)",width:150,key:"unemployment_insurance.upper_limit",dataIndex:"unemployment_insurance",render:function(e){return E(e.upper_limit)||"--"}},{title:"失业企业比例",width:150,key:"unemployment_insurance.company_percent",dataIndex:"unemployment_insurance",render:function(e){return e.company_percent?"".concat(e.company_percent,"%"):"--"}},{title:"失业个人比例",width:150,key:"unemployment_insurance.person_percent",dataIndex:"unemployment_insurance",render:function(e){return e.person_percent?"".concat(e.person_percent,"%"):"--"}},{title:"工伤基数下限(元)",width:150,key:"occupational_insurance.lower_limit",dataIndex:"occupational_insurance",render:function(e){return E(e.lower_limit)||"--"}},{title:"工伤基数上限(元)",width:150,key:"occupational_insurance.upper_limit",dataIndex:"occupational_insurance",render:function(e){return E(e.upper_limit)||"--"}},{title:"工伤企业比例",width:150,key:"occupational_insurance.company_percent",dataIndex:"occupational_insurance",render:function(e){return e.company_percent?"".concat(e.company_percent,"%"):"--"}},{title:"工伤个人比例",width:150,key:"occupational_insurance.person_percent",dataIndex:"occupational_insurance",render:function(e){return e.person_percent?"".concat(e.person_percent,"%"):"--"}},{title:"生育基数下限(元)",width:150,key:"birth_insurance.lower_limit",dataIndex:"birth_insurance",render:function(e){return E(e.lower_limit)||"--"}},{title:"生育基数上限(元)",width:150,key:"birth_insurance.upper_limit",dataIndex:"birth_insurance",render:function(e){return E(e.upper_limit)||"--"}},{title:"生育企业比例",width:150,key:"birth_insurance.company_percent",dataIndex:"birth_insurance",render:function(e){return e.company_percent?"".concat(e.company_percent,"%"):"--"}},{title:"生育个人比例",width:150,key:"birth_insurance.person_percent",dataIndex:"birth_insurance",render:function(e){return e.person_percent?"".concat(e.person_percent,"%"):"--"}},{title:"公积金基数下限(元)",width:150,key:"provident_fund.lower_limit",dataIndex:"provident_fund",render:function(e){return E(e.lower_limit)||"--"}},{title:"公积金基数上限(元)",width:150,key:"provident_fund.upper_limit",dataIndex:"provident_fund",render:function(e){return E(e.upper_limit)||"--"}},{title:"公积金企业缴费比例",width:150,key:"provident_fund.company_percent",dataIndex:"provident_fund",render:function(e){return e.company_percent?"".concat(e.company_percent,"%"):"--"}},{title:"公积金个人缴费比例",width:150,key:"provident_fund.person_percent",dataIndex:"provident_fund",render:function(e){return e.person_percent?"".concat(e.person_percent,"%"):"--"}},{title:"创建时间",width:150,key:"created_at",dataIndex:"created_at",render:function(e){return e?p()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"创建者",width:150,key:"creator_info.name",dataIndex:"creator_info",render:function(e){return e&&e.name?e.name:"--"}},{title:"最后操作时间",width:150,key:"updated_at",dataIndex:"updated_at",render:function(e){return e?p()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"操作人",width:150,key:"operator.name",dataIndex:"operator_info",render:function(e){return e&&e.name?e.name:"--"}},{title:"操作",width:150,fixed:"right",render:function(e,t){var n=[];return _.ZP.canOperateEmployeeSocietyDetail()&&n.push(m.createElement("a",{onClick:function(){var e;e=t._id,window.location.href="/#/Employee/Society/Detail?id=".concat(e)},className:f.Z["app-comp-employee-society-a"]},"查看")),_.ZP.canOperateEmployeeSocietyUpdate()&&n.push(m.createElement("a",{onClick:function(){var e;e=t._id,window.location.href="/#/Employee/Society/Update?id=".concat(e)}},"编辑")),m.createElement(m.Fragment,null,n)}}],P={current:O.page,pageSize:O.limit,onChange:Z,showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:C,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],total:l().get(c,"_meta.result_count",0)},j=null,_.ZP.canOperateEmployeeSocietyCreate()&&(j=m.createElement(i.Z,{type:"primary",onClick:D},"新建参保方案")),m.createElement(s.IT,{titleExt:j,title:"参保方案列表"},m.createElement(r.Z,{pagination:P,columns:S,rowKey:function(e,t){return e._id||t},dataSource:u,scroll:{x:4650}}))))}))},55306:function(e,t){t.Z={"app-comp-employee-society-title":"agDEbjhxVOczLwPXCW7g","app-comp-employee-society-justify":"bT1LuXLznav6PX5Pgz2_","app-comp-employee-society-input":"r00JZljFwQVS8BeqTzug","app-comp-employee-society-top":"KrkBsWJvm2vlMJQSQv5z","app-comp-employee-society-bottom":"oqTejn7FyLvSbEN9lebA","app-comp-employee-society-form-button-wrap":"dIPRpTKIYylptHW0dbS_","app-comp-employee-society-a":"mq4mEnuUADaunIbvwXCF","app-comp-employee-society-modal-footer":"VYyNqo7BB7qR9q9wcKnQ","app-comp-employee-society-tittle":"BXDSndSY28kJpEg_kvh1"}}}]);