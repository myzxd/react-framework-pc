"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7159],{37159:function(e,t,n){n.r(t),n.d(t,{default:function(){return S}});n(20186);var r=n(75385),a=(n(52560),n(71577)),c=(n(21316),n(75443)),o=(n(35668),n(86585)),i=(n(9070),n(20924)),l=(n(51838),n(48086)),s=n(15861),u=n(4942),p=n(29439),f=n(87757),m=n.n(f),d=n(67294),g=n(55609),b=n(68628),y=n(96036),O=(n(52466),n(10642)),h=n(87462),v=n(45697),w=n.n(v);function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function E(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?k(Object(n),!0).forEach((function(t){(0,u.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Z=i.Z.TextArea,j=function(e){var t=e.visible,n=e.onCancel,r=e.dispatch,a=o.Z.useForm(),c=(0,p.Z)(a,1)[0],u=function(){var e=(0,s.Z)(m().mark((function e(){var t,a;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.validateFields();case 2:return t=e.sent,e.next=5,r({type:"ticketTag/createTicketTag",payload:E({},t)});case 5:(a=e.sent)&&a.ok?(l.ZP.success("请求成功"),n&&n()):a&&a.zh_message&&l.ZP.error(a.zh_message);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return d.createElement(O.Z,{title:"新增验票标签",visible:t,onOk:u,onCancel:n},d.createElement(o.Z,(0,h.Z)({},{labelCol:{span:6},wrapperCol:{span:18}},{form:c}),d.createElement(o.Z.Item,{name:"name",label:"验票标签名称",rules:[{required:!0,message:"请输入"},{pattern:/^\S+$/,message:"验票标签名称不能包含空格"}]},d.createElement(i.Z,{allowClear:!0,placeholder:"请输入标签名称"})),d.createElement(o.Z.Item,{name:"remarks",label:"备注"},d.createElement(Z,{placeholder:"请输入备注",rows:4,allowClear:!0}))))};j.propTypes={visible:w().bool,onCancel:w().func,dispatch:w().func},j.defaultProps={visible:!1,onCancel:function(){},dispatch:function(){}};var P=j;function T(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function C(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?T(Object(n),!0).forEach((function(t){(0,u.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):T(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var S=(0,g.connect)((function(e){return{ticketTags:e.ticketTag.ticketTags}}))((function(e){var t=e.dispatch,n=e.ticketTags,u=void 0===n?{}:n,f=(0,d.useState)(!1),g=(0,p.Z)(f,2),O=g[0],h=g[1],v=u.data,w=void 0===v?[]:v,k=u._meta,E=void 0===k?{page:1,limit:30}:k,Z=(0,d.useState)(C({},E)),j=(0,p.Z)(Z,2),T=j[0],S=j[1],x=(0,d.useState)({name:void 0}),D=(0,p.Z)(x,2),I=D[0],z=D[1];(0,d.useEffect)((function(){var e=C(C({},T),I);t({type:"ticketTag/getTicketTags",payload:e})}),[t,T,I,O]);var _,F,B,q,A=function(e){z(C({},e)),S({page:1,limit:30})},J=function(e,t){S({page:e,limit:t})},K=function(e,t){S({page:e,limit:t})},N=function(){var e=(0,s.Z)(m().mark((function e(n){var r;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t({type:"ticketTag/deleteTicketTag",payload:{id:n}});case 2:(r=e.sent)&&r.ok?t({type:"ticketTag/getTicketTags",payload:C(C({},T),I)}):l.ZP.error("操作失败");case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return d.createElement("div",null,(q={items:[d.createElement(o.Z.Item,{label:"验票标签名称",name:"name"},d.createElement(i.Z,{placeholder:"请输入",allowClear:!0}))],onSearch:A,onReset:A},d.createElement(y.IT,null,d.createElement(y.j6,q))),(_=[{title:"验票标签名称",dataIndex:"name",width:200},{title:"备注",dataIndex:"note",render:function(e){return e?d.createElement("span",{className:"noteWrap"},e):"--"}},{title:"操作",dataIndex:"_id",width:150,render:function(e){return d.createElement(c.Z,{icon:d.createElement(b.Z,{style:{color:"#FF7700"}}),title:"是否删除此标签？",onConfirm:function(){return N(e)}},d.createElement("a",null,"删除"))}}],F=d.createElement(a.Z,{type:"primary",onClick:function(){return h(!0)}},"新增验票标签"),B={current:T.page||1,defaultPageSize:30,pageSize:T.limit||30,showQuickJumper:!0,showSizeChanger:!0,onChange:J,onShowSizeChange:K,showTotal:function(e){return"总共".concat(e,"条")},total:E.result_count,pageSizeOptions:["10","20","30","40"]},d.createElement(y.IT,{title:"验票标签",titleExt:F},d.createElement(r.Z,{rowKey:function(e,t){return e.id||t},columns:_,dataSource:w,pagination:B,bordered:!0}))),function(){if(O)return d.createElement(P,{dispatch:t,visible:O,onCancel:function(){return h(!1)}})}())}))}}]);