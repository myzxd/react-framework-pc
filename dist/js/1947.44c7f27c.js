"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[1947],{21947:function(e,t,a){a.r(t),a.d(t,{default:function(){return E}});a(12184);var n=a(76022),r=(a(438),a(14277)),o=a(29439),i=a(30381),l=a.n(i),c=a(94315),s=a.n(c),p=a(93517),u=a.n(p),m=a(55609),f=a(67294),g=a(96036),d=a(80385),y=a(4942),b=a(44925),v=a(85193),h=["form","keys"];function O(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function _(e){var t=e.form,a=e.keys,n=(0,b.Z)(e,h),r={urls:["".concat(t)],keys:a||["".concat(t)]};Array.isArray(t)&&(r.urls=t);var o="ComponentDetailContractInfo-".concat(r.urls[0].slice(-8)),i=f.createElement(g.MV,{isDisplayMode:!0,value:r,namespace:o});return""!==t&&null!==t&&"--"!==t||(i=f.createElement("div",{className:v.Z["app-comp-employee-manage-detail-util"]},"暂无")),function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?O(Object(a),!0).forEach((function(t){(0,y.Z)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):O(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({span:8,layout:{labelCol:{span:8},wrapperCol:{span:16}},form:i},n)}var E=(0,m.connect)((function(e){return{individualRegistration:e.employeeManage.individualRegistration}}))((function(e){var t=e.dispatch,a=e.individualRegistration,i=e.location.query,c=void 0===i?{}:i,p=c.staffId,m=(0,f.useState)({page:1,limit:10}),y=(0,o.Z)(m,2),b=y[0],v=y[1];(0,f.useEffect)((function(){return t({type:"employeeManage/fetchEmployeeIndividualRegistration",payload:{meta:b,staffId:p,state:[d.rsI.examineIn,d.rsI.examineHang,d.rsI.success,d.rsI.error]}}),function(){t({type:"employeeManage/reduceEmployeeIndividualRegistration",payload:{}})}}),[t,b,p]);var h,O=function(e,t){v({page:e,limit:t})},E=function(e,t){v({page:e,limit:t})};return f.createElement(g.IT,{title:"".concat(c.name||"","个户注册记录")},(h=u().get(a,"data",[]),s().not.existy(h)||s().empty(h)?f.createElement(r.Z,null):f.createElement(f.Fragment,null,h.map((function(e,t){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,a=[{label:"提交时间",form:u().get(e,"submit_at",void 0)?l()(u().get(e,"submit_at",void 0)).format("YYYY-MM-DD"):"--"},{label:"注册结果",form:d.rsI.description(u().get(e,"state",void 0))},{label:"姓名",form:f.createElement("span",null,u().get(e,"name","--"))},{label:"手机号",form:u().get(e,"phone","--")},{label:"身份证号",form:u().get(e,"identity_card_id","--")},_({label:"身份证正面照",form:u().get(e,"idcard_front_asset_url","--")}),_({label:"身份证反面照",form:u().get(e,"idcard_back_asset_url","--")}),{label:"承揽协议",form:u().get(e,"contract_no",void 0)?f.createElement("a",{href:"".concat(u().get(e,"contract_asset_url",""))},u().get(e,"contract_no",void 0)):"--"},_({label:"营业执照",form:u().get(e,"license_asset_url","--")})];d.rsI.error===u().get(e,"state","--")?a.splice(2,0,{label:"失败原因",form:u().get(e,"reason","--")}):a.splice(2,0,{label:"",form:""});var n={labelCol:{span:8},wrapperCol:{span:16}};return f.createElement(g.KP,{key:t,items:a,cols:3,layout:n})}(e,t)})),f.createElement("div",{style:{textAlign:"right",margin:"16px 0"}},f.createElement(n.Z,{current:b.page,pageSize:b.limit,showTotal:function(e){return"总共".concat(e,"条")},total:u().get(a,"_meta.result_count",0),pageSizeOptions:["10","20","30","40"],showQuickJumper:!0,showSizeChanger:!0,onChange:E,onShowSizeChange:O})))))}))},85193:function(e,t){t.Z={"app-comp-employee-manage-detail-bankinfo":"Ma1gU4Q3_ASP4Dst4XP6","app-comp-employee-manage-detail-util":"q95u0DqnArtlgyPPEAnO","app-comp-employee-manage-detail-history-info-pagination":"eUi6E0Q3x8J6idl3l89P"}}}]);