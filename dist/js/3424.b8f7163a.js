"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[3424],{93488:function(e,n,t){t.d(n,{Z:function(){return i}});var a=t(1413),l=t(67294),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"}}]},name:"arrow-right",theme:"outlined"},o=t(30076),c=function(e,n){return l.createElement(o.Z,(0,a.Z)((0,a.Z)({},e),{},{ref:n,icon:r}))};c.displayName="ArrowRightOutlined";var i=l.forwardRef(c)},3424:function(e,n,t){t.r(n);t(52560);var a=t(71577),l=(t(35668),t(86585)),r=t(29439),o=t(93517),c=t.n(o),i=t(67294),s=t(55609),m=t(96036),p=t(80385),u=t(13551),d=p.B_f.noCost,f=p.RbW.bu3,E=p.RbW.quhuo,y="".concat(d).concat(p.RbW.bu3),g="".concat(d).concat(p.RbW.quhuo),b="examineFlowApplyApplicationTypes";n.default=(0,s.connect)((function(e){return{examineFlowInfo:e.relationExamineFlow.examineFlowInfo,enumeratedValue:e.applicationCommon.enumeratedValue}}))((function(e){var n,t=e.dispatch,o=e.examineFlowInfo,s=e.enumeratedValue,w=void 0===s?{}:s,h=e.location.query,C=void 0===h?{}:h,Z=l.Z.useForm(),v=(0,r.Z)(Z,1)[0],F=w[b],x=void 0===F?[]:F;return(0,i.useEffect)((function(){return t({type:"applicationCommon/getEnumeratedValue",payload:{enumeratedType:b}}),function(){return t({type:"applicationCommon/resetEnumeratedValue",payload:{}})}}),[t]),(0,i.useEffect)((function(){return t({type:"relationExamineFlow/fetchExamineFlowXDInfo",payload:{bizType:d,merchant:f,namespace:y,flowId:C.xdFlowId}}),t({type:"relationExamineFlow/fetchExamineFlowinfo",payload:{bizType:d,merchant:E,namespace:g,flowId:C.qhFlowId}}),function(){t({type:"relationExamineFlow/reduceExamineFlowinfo",payload:{}})}}),[t,C]),i.createElement(l.Z,{layout:"horizontal",form:v,onFinish:function(){}},(n=[{span:24,render:i.createElement(l.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:i.createElement("h3",null,"非成本类审批流关联")})}],i.createElement(i.Fragment,null,i.createElement(m.Fp,{items:n,cols:3}))),function(){var e=c().get(o,y,{}),n=c().get(e,"node_list",[]),t=c().get(e,"platform_names",[]),a=c().get(e,"apply_application_types",void 0),r=[{span:24,render:i.createElement(l.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:i.createElement("h3",null,"BU3-非成本类审批流：")})},{span:24,render:i.createElement(l.Z.Item,{label:"审批流名称",name:"bu3ExamineFlow",labelCol:{span:2},wrapperCol:{span:12}},c().get(e,"name","--"),e.state?"（".concat(p.BsX.description(e.state),"）"):null)},{span:9,render:i.createElement(l.Z.Item,{label:"适用类型",labelCol:{span:6},wrapperCol:{span:18}},Array.isArray(a)&&a.length>0?a.map((function(e){return(x.find((function(n){return n.value===e}))||{}).name})).join("、"):"--")},{span:9,render:i.createElement(l.Z.Item,{label:"适用范围",labelCol:{span:6},wrapperCol:{span:18}},i.createElement("span",{className:"noteWrap"},Array.isArray(t)&&t.length>0?t.join("、"):"--"))},{span:4,render:i.createElement(l.Z.Item,{label:"是否有RS节点",labelCol:{span:14},wrapperCol:{span:8}},c().get(e,"is_rs")?"是":"否")},{span:24,render:i.createElement(l.Z.Item,{label:"审批流预览",labelCol:{span:2},wrapperCol:{span:22}},i.createElement(u.Z,{nodelist:n}))}];return i.createElement(m.IT,null,i.createElement(m.Fp,{items:r,cols:3}))}(),function(){var e=c().get(o,g,{}),n=c().get(e,"node_list",[]),t=c().get(e,"platform_names",[]),a=c().get(e,"apply_application_types",[]),r=[{span:24,render:i.createElement(l.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:i.createElement("h3",null,"趣活-非成本类审批流：")})},{span:24,render:i.createElement(l.Z.Item,{label:"审批流名称",name:"examineFlow",labelCol:{span:2},wrapperCol:{span:12}},c().get(e,"name","--"),e.state?"（".concat(p.BsX.description(e.state),"）"):null)},{span:12,render:i.createElement(l.Z.Item,{label:"适用类型",labelCol:{span:4},wrapperCol:{span:20}},Array.isArray(a)&&a.length>0?a.map((function(e){return(x.find((function(n){return n.value===e}))||{}).name})).join("、"):"--")},{span:12,render:i.createElement(l.Z.Item,{label:"适用范围",labelCol:{span:4},wrapperCol:{span:20}},i.createElement("span",{className:"noteWrap"},Array.isArray(t)&&t.length>0?t.join("、"):"--"))},{span:24,render:i.createElement(l.Z.Item,{label:"审批流预览",labelCol:{span:2},wrapperCol:{span:22}},i.createElement(u.Z,{nodelist:n}))}];return i.createElement(m.IT,null,i.createElement(m.Fp,{items:r,cols:3}))}(),i.createElement("div",{style:{textAlign:"center"}},i.createElement(a.Z,{onClick:function(){window.location.href="/#/Expense/RelationExamineFlow?activeKey=".concat(d)}},"返回")))}))},13551:function(e,n,t){t(13062);var a=t(71230),l=(t(89032),t(15746)),r=t(94315),o=t.n(r),c=t(93517),i=t.n(c),s=t(67294),m=t(55609),p=t(93488),u=t(80385);n.Z=(0,m.connect)((function(e){return{examineFlowInfo:e.relationExamineFlow.examineFlowInfo,contractTypeData:e.business.contractTypeData}}))((function(e){var n=i().get(e,"nodelist",[]),t=function(e,n){var t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],a=i().get(e,"account_list",[]),r=i().get(e,"post_list",[]),c=!1,m=Array.isArray(r)&&r.every((function(e){var n=i().get(e,"account_list",[]);return e.post_state===u.Dkk.disable||o().not.existy(n)||o().empty(n)}));return(o().not.existy(a)||o().empty(a))&&!0===m&&(c=!0),s.createElement(l.Z,{key:n,style:{marginLeft:5}},s.createElement("span",{style:{color:c?"red":""}},e.node_name,"（",a.join("、"),0===a.length&&0===r.length?"无":null,a.length>0&&r.length>0?"；":null,r.map((function(e){var n=i().get(e,"account_list",[]);return e.post_state===u.Dkk.disable?"".concat(e.post_name,"（禁用）"):"".concat(e.post_name,"（").concat(Array.isArray(n)&&n.length>0?n.join("、"):"无","）")})).join("、"),"）"),t?null:s.createElement(p.Z,null))};return s.createElement(s.Fragment,null,function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return o().not.existy(e)||o().empty(e)?"--":s.createElement(a.Z,null,s.createElement(l.Z,null,s.createElement("span",null,"申请人")," ",s.createElement(p.Z,null)),e.map((function(n,a){return t(n,a,a===e.length-1)})))}(n))}))}}]);