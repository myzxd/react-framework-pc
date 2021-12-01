"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[6751],{93488:function(e,n,t){t.d(n,{Z:function(){return c}});var a=t(1413),o=t(67294),l={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"}}]},name:"arrow-right",theme:"outlined"},r=t(30076),i=function(e,n){return o.createElement(r.Z,(0,a.Z)((0,a.Z)({},e),{},{ref:n,icon:l}))};i.displayName="ArrowRightOutlined";var c=o.forwardRef(i)},56087:function(e,n,t){var a=t(4942),o=(t(29093),t(16317)),l=t(94315),r=t.n(l),i=t(93517),c=t.n(i),p=t(67294),s=t(55609),m=t(96486),u=t.n(m),d=t(80385),y=t(8240);function f(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function E(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?f(Object(t),!0).forEach((function(n){(0,a.Z)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var w=o.Z.Option;n.Z=(0,s.connect)((function(e){return{examineFlowList:e.relationExamineFlow.examineFlowList}}))((function(e){var n=e.dispatch,t=e.name,a=e.state,l=e.examineFlowList,i=void 0===l?{}:l,s=e.initItem,m=void 0===s?{}:s,f=e.applyApplicationType,h=e.bizType,b=e.merchant,g=c().get(i,"datas",[]),F=(0,p.useRef)(!0);(0,p.useEffect)((function(){t&&!0===F.current&&n({type:"relationExamineFlow/fetchExamineFlow",payload:{flowNameKey:t,bizType:h,merchant:b,applyApplicationType:f}})}),[n,t,h,b,F,f]),(0,p.useEffect)((function(){return f&&n({type:"relationExamineFlow/reduceExamineFlow",payload:{}}),function(){n({type:"relationExamineFlow/reduceExamineFlow",payload:{}})}}),[n,f]);var x=u().debounce((function(t){F.current=!1,t&&n({type:"relationExamineFlow/fetchExamineFlow",payload:{flowNameKey:t,bizType:h,merchant:b,applyApplicationType:f,onReset:function(){e.onChange&&e.onChange()}}})}),800),v=E(E({},(0,y.CE)(["dispatch","examineFlowList","bizType","merchant","applyApplicationType","initItem","state"],e)),{},{placeholder:"请输入",showSearch:!0,defaultActiveFirstOption:!1,allowClear:!0,filterOption:!1,onChange:function(t){F.current=!1,t?e.onChange&&e.onChange(t):void 0===t&&(n({type:"relationExamineFlow/reduceExamineFlow",payload:{}}),e.onChange&&e.onChange())},onSearch:x,notFoundContent:null}),C=h===d.B_f.codeTeam?d.ZAv:d.BsX;return F.current&&r().existy(m)&&r().not.empty(m)&&m._id&&!1===g.map((function(e){return e._id})).includes(m._id)&&g.push(E(E({},m),{},{disabled:!0})),p.createElement(o.Z,v,g.map((function(e){return p.createElement(w,{key:e._id,value:e._id,disabled:e.disabled},e.name,e.disabled&&a!==C.normal?"（".concat(C.description(a),"）"):null)})))}))},29796:function(e,n,t){var a=t(4942),o=(t(29093),t(16317)),l=t(94315),r=t.n(l),i=t(93517),c=t.n(i),p=t(67294),s=t(55609),m=t(96486),u=t.n(m),d=t(80385),y=t(8240);function f(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function E(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?f(Object(t),!0).forEach((function(n){(0,a.Z)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var w=o.Z.Option;n.Z=(0,s.connect)((function(e){return{xdExamineFlowList:e.relationExamineFlow.xdExamineFlowList}}))((function(e){var n=e.dispatch,t=e.name,a=e.state,l=e.xdExamineFlowList,i=void 0===l?{}:l,s=e.initItem,m=void 0===s?{}:s,f=e.applyApplicationType,h=e.bizType,b=e.merchant,g=c().get(i,"datas",[]),F=(0,p.useRef)(!0);(0,p.useEffect)((function(){t&&!0===F.current&&n({type:"relationExamineFlow/fetchXDExamineFlow",payload:{flowNameKey:t,bizType:h,merchant:b,applyApplicationType:f}})}),[n,t,h,b,F,f]),(0,p.useEffect)((function(){return f&&n({type:"relationExamineFlow/reduceXDExamineFlow",payload:{}}),function(){n({type:"relationExamineFlow/reduceXDExamineFlow",payload:{}})}}),[n,f]);var x=u().debounce((function(t){F.current=!1,t&&n({type:"relationExamineFlow/fetchXDExamineFlow",payload:{flowNameKey:t,bizType:h,merchant:b,applyApplicationType:f,onReset:function(){e.onChange&&e.onChange()}}})}),800),v=E(E({},(0,y.CE)(["dispatch","xdExamineFlowList","bizType","merchant","applyApplicationType","initItem","state"],e)),{},{placeholder:"请输入",showSearch:!0,defaultActiveFirstOption:!1,allowClear:!0,filterOption:!1,onChange:function(t){F.current=!1,t?e.onChange&&e.onChange(t):void 0===t&&(n({type:"relationExamineFlow/reduceXDExamineFlow",payload:{}}),e.onChange&&e.onChange())},onSearch:x,notFoundContent:null}),C=h===d.B_f.codeTeam?d.ZAv:d.BsX;return F.current&&r().existy(m)&&r().not.empty(m)&&m._id&&!1===g.map((function(e){return e._id})).includes(m._id)&&g.push(E(E({},m),{},{disabled:!0})),p.createElement(o.Z,v,g.map((function(e){return p.createElement(w,{key:e._id,value:e._id,disabled:e.disabled},e.name,e.disabled&&a!==C.normal?"（".concat(C.description(a),"）"):null)})))}))},76579:function(e,n,t){t(13062);var a=t(71230),o=(t(89032),t(15746)),l=t(94315),r=t.n(l),i=t(93517),c=t.n(i),p=t(67294),s=t(55609),m=t(93488),u=t(80385);n.Z=(0,s.connect)((function(e){return{examineFlowInfo:e.relationExamineFlow.examineFlowInfo,contractTypeData:e.business.contractTypeData}}))((function(e){var n=c().get(e,"nodelist",[]),t=function(e,n){var t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],a=c().get(e,"account_list",[]),l=c().get(e,"post_list",[]),i=!1,s=Array.isArray(l)&&l.every((function(e){var n=c().get(e,"account_list",[]);return e.post_state===u.Dkk.disable||r().not.existy(n)||r().empty(n)}));return(r().not.existy(a)||r().empty(a))&&!0===s&&(i=!0),p.createElement(o.Z,{key:n,style:{marginLeft:5}},p.createElement("span",{style:{color:i?"red":""}},e.node_name,"（",a.join("、"),0===a.length&&0===l.length?"无":null,a.length>0&&l.length>0?"；":null,l.map((function(e){var n=c().get(e,"account_list",[]);return e.post_state===u.Dkk.disable?"".concat(e.post_name,"（禁用）"):"".concat(e.post_name,"（").concat(Array.isArray(n)&&n.length>0?n.join("、"):"无","）")})).join("、"),"）"),t?null:p.createElement(m.Z,null))};return p.createElement(p.Fragment,null,function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return r().not.existy(e)||r().empty(e)?"--":p.createElement(a.Z,null,p.createElement(o.Z,null,p.createElement("span",null,"申请人")," ",p.createElement(m.Z,null)),e.map((function(n,a){return t(n,a,a===e.length-1)})))}(n))}))},76751:function(e,n,t){t.r(n);t(52560);var a=t(71577),o=(t(75310),t(76772)),l=t(87462),r=(t(51838),t(48086)),i=(t(35668),t(86585)),c=t(29439),p=t(93517),s=t.n(p),m=t(67294),u=t(55609),d=t(96036),y=t(80385),f=t(56087),E=t(29796),w=t(76579),h={labelCol:{span:6},wrapperCol:{span:17}},b=y.B_f.cost,g=y.RbW.bu3,F=y.RbW.quhuo,x="".concat(b).concat(y.RbW.bu3),v="".concat(b).concat(y.RbW.quhuo),C="industry";n.default=(0,u.connect)((function(e){return{examineFlowInfo:e.relationExamineFlow.examineFlowInfo,enumeratedValue:e.applicationCommon.enumeratedValue}}))((function(e){var n=e.dispatch,t=e.examineFlowInfo,p=e.enumeratedValue,u=e.location.query,Z=void 0===u?{}:u,I=i.Z.useForm(),O=(0,c.Z)(I,1)[0],_=(0,m.useState)(),T=(0,c.Z)(_,2),j=T[0],A=T[1],D=p.industry;(0,m.useEffect)((function(){return n({type:"relationExamineFlow/fetchExamineFlowXDInfo",payload:{bizType:b,merchant:g,namespace:x,flowId:Z.xdFlowId}}),n({type:"relationExamineFlow/fetchExamineFlowinfo",payload:{bizType:b,merchant:F,namespace:v,flowId:Z.qhFlowId}}),function(){n({type:"relationExamineFlow/reduceExamineFlowinfo",payload:{}})}}),[n,Z]),(0,m.useEffect)((function(){return n({type:"applicationCommon/getEnumeratedValue",payload:{enumeratedType:C}}),function(){return n({type:"applicationCommon/resetEnumeratedValue",payload:{}})}}),[n]),(0,m.useEffect)((function(){O.setFieldsValue({bu3ExamineFlow:s().get(t,"".concat(x,"._id"),void 0),examineFlow:s().get(t,"".concat(v,"._id"),void 0)})}),[t,O]);var z,P=function(e){n(e?{type:"relationExamineFlow/fetchExamineFlowinfo",payload:{bizType:b,namespace:x,merchant:g,flowId:e}}:{type:"relationExamineFlow/reduceExamineFlowinfo",payload:{result:{},namespace:x}})},k=function(e){n(e?{type:"relationExamineFlow/fetchExamineFlowinfo",payload:{bizType:b,namespace:v,merchant:F,flowId:e}}:{type:"relationExamineFlow/reduceExamineFlowinfo",payload:{result:{},namespace:v}})},L=function(){r.ZP.success("请求成功"),window.location.href="/#/Expense/RelationExamineFlow?activeKey=".concat(b)};return m.createElement(i.Z,{layout:"horizontal",form:O,onFinish:function(){}},m.createElement(o.Z,{showIcon:!0,message:"提示：节点颜色显示红色为节点无审批人，关联关系不能创建成功！",type:"error",style:{margin:"10px 0"}}),(z=[{span:24,render:m.createElement(i.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:m.createElement("h3",null,"成本类审批流关联")})},m.createElement(i.Z.Item,(0,l.Z)({label:m.createElement("span",{className:"boss-form-item-wrap-required"},"适用类型")},h),y.ZBL.description(y.ZBL.housing))],m.createElement(m.Fragment,null,m.createElement(d.Fp,{items:z,cols:3}))),function(){var e=s().get(t,x,{}),n=s().get(e,"node_list",[]),a=s().get(e,"platform_names",[]),o=s().get(e,"industry_codes.0",void 0),l=s().get(e,"cost_catalog_scope_names",[]),r="--";o&&D&&D.length>0&&(r=(D.find((function(e){return e.value===o}))||{}).name||"--");var c=[{span:24,render:m.createElement(i.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:m.createElement("h3",null,"BU3-成本类审批流：")})},{span:24,render:m.createElement(i.Z.Item,{label:"审批流名称",name:"bu3ExamineFlow",labelCol:{span:2},wrapperCol:{span:12},rules:[{required:!0,message:"请输入审批流名称"}]},m.createElement(E.Z,{onChange:P,name:e.name,state:e.state,initItem:{_id:e._id,name:e.name},bizType:b,merchant:g}))},{span:4,render:m.createElement(i.Z.Item,{label:"适用场景",labelCol:{span:8},wrapperCol:{span:10}},r||"--")},{span:6,render:m.createElement(i.Z.Item,{label:"适用范围",labelCol:{span:8},wrapperCol:{span:16}},m.createElement("span",{className:"noteWrap"},Array.isArray(a)&&a.length>0?a.join("、"):"--"))},{span:10,render:m.createElement(i.Z.Item,{label:"费用分组",labelCol:{span:5},wrapperCol:{span:18}},m.createElement("span",{className:"noteWrap"},Array.isArray(l)&&l.length>0?l.join("、"):"--"))},{span:4,render:m.createElement(i.Z.Item,{label:"是否有RS节点",labelCol:{span:14},wrapperCol:{span:8}},s().get(e,"is_rs")?"是":"否")},{span:24,render:m.createElement(i.Z.Item,{label:"审批流预览",labelCol:{span:2},wrapperCol:{span:22}},m.createElement(w.Z,{nodelist:n}))}];return m.createElement(d.IT,null,m.createElement(d.Fp,{items:c,cols:3}))}(),function(){var e=s().get(t,v,{}),n=s().get(e,"node_list",[]),a=s().get(e,"platform_names",[]),o=s().get(e,"industry_codes.0",void 0),l=s().get(e,"cost_catalog_scope_names",[]),r="--";o&&D&&D.length>0&&(r=(D.find((function(e){return e.value===o}))||{}).name||"--");var c=[{span:24,render:m.createElement(i.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:m.createElement("h3",null,"趣活-成本类审批流：")})},{span:24,render:m.createElement(i.Z.Item,{label:"审批流名称",name:"examineFlow",labelCol:{span:2},wrapperCol:{span:12},rules:[{required:!0,message:"请输入审批流名称"}]},m.createElement(f.Z,{onChange:k,name:e.name,state:e.state,initItem:{_id:e._id,name:e.name},bizType:b,merchant:F}))},{span:4,render:m.createElement(i.Z.Item,{label:"适用场景",labelCol:{span:8},wrapperCol:{span:10}},r||"--")},{span:6,render:m.createElement(i.Z.Item,{label:"适用范围",labelCol:{span:8},wrapperCol:{span:16}},m.createElement("span",{className:"noteWrap"},Array.isArray(a)&&a.length>0?a.join("、"):"--"))},{span:14,render:m.createElement(i.Z.Item,{label:"费用分组",labelCol:{span:4},wrapperCol:{span:20}},m.createElement("span",{className:"noteWrap"},Array.isArray(l)&&l.length>0?l.join("、"):"--"))},{span:24,render:m.createElement(i.Z.Item,{label:"审批流预览",labelCol:{span:2},wrapperCol:{span:22}},m.createElement(w.Z,{nodelist:n}))}];return m.createElement(d.IT,null,m.createElement(d.Fp,{items:c,cols:3}))}(),m.createElement("div",{style:{textAlign:"center"}},m.createElement(a.Z,{style:{marginRight:15},onClick:function(){window.location.href="/#/Expense/RelationExamineFlow?activeKey=".concat(b)}},"返回"),m.createElement(a.Z,{type:"primary",loading:j,onClick:function(){O.validateFields().then((function(e){A(!0);var t={xdFlowId:e.bu3ExamineFlow,qhFlowId:e.examineFlow,appWatchFlowId:Z.appWatchFlowId,pluginId:Z.pluginId,bizType:b,onLoading:function(){A(!1)},onSuccessCallback:L};n({type:"relationExamineFlow/updateRelationExamineFlow",payload:t})}))}},"启用")))}))}}]);