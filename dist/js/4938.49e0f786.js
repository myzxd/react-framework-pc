"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[4938],{93488:function(e,t,n){n.d(t,{Z:function(){return i}});var a=n(1413),l=n(67294),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"}}]},name:"arrow-right",theme:"outlined"},o=n(30076),c=function(e,t){return l.createElement(o.Z,(0,a.Z)((0,a.Z)({},e),{},{ref:t,icon:r}))};c.displayName="ArrowRightOutlined";var i=l.forwardRef(c)},94938:function(e,t,n){n.r(t);n(52560);var a=n(71577),l=n(87462),r=(n(35668),n(86585)),o=n(29439),c=n(94315),i=n.n(c),p=n(93517),s=n.n(p),m=n(67294),u=n(55609),d=n(96036),f=n(80385),y=n(88144),v=n(96521),E=n(64434),g={labelCol:{span:6},wrapperCol:{span:17}},h=f.B_f.affair,b=f.RbW.bu3,_=f.RbW.quhuo,Z="".concat(h).concat(f.RbW.bu3),w="".concat(h).concat(f.RbW.quhuo);t.default=(0,u.connect)((function(e){return{examineFlowInfo:e.relationExamineFlow.examineFlowInfo,contractTypeData:e.business.contractTypeData,enumeratedValue:e.applicationCommon.enumeratedValue}}))((function(e){var t=e.dispatch,n=e.location.query,c=void 0===n?{}:n,p=e.examineFlowInfo,u=void 0===p?{}:p,C=e.contractTypeData,I=void 0===C?{}:C,F=e.enumeratedValue,T=r.Z.useForm(),x=(0,o.Z)(T,1)[0];(0,m.useEffect)((function(){t({type:"business/fetchContractType",payload:{}})}),[t]),(0,m.useEffect)((function(){return t({type:"applicationCommon/getEnumeratedValue",payload:{enumeratedType:"affairs"}}),function(){return t({type:"applicationCommon/resetEnumeratedValue",payload:{}})}}),[t]),(0,m.useEffect)((function(){return t({type:"relationExamineFlow/fetchExamineFlowXDInfo",payload:{bizType:h,merchant:b,namespace:Z,flowId:c.xdFlowId}}),t({type:"relationExamineFlow/fetchExamineFlowinfo",payload:{bizType:h,merchant:_,namespace:w,flowId:c.qhFlowId}}),function(){t({type:"relationExamineFlow/reduceExamineFlowinfo",payload:{}})}}),[t,c]);var A,D,B,V,j,k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=s().get(e,"final_type",[]),n=s().get(e,"final_approval_jobs",[]),a=s().get(e,"final_approval_job_tags",[]),l="--";return Array.isArray(n)&&n.length>0&&(l=m.createElement("div",null,f.mqh.description(t),"(",n.join("、"),")")),Array.isArray(a)&&a.length>0&&(l=m.createElement("div",null,f.mqh.description(t),"(",a.join("、"),")")),l},R=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.stamp_types,a=void 0===n?[]:n,o=t.seal_types,c=void 0===o?[]:o,p=t.pact_borrow_types,u=void 0===p?[]:p,d=t.display_types,E=void 0===d?[]:d,h=t.pact_apply_types,b=void 0===h?[]:h,_=t.pact_sub_types,Z=void 0===_?[]:_,w=t.organization_sub_types,C=void 0===w?[]:w,F=s().get(t,"apply_application_types.0",void 0),T=I.pact_types_has_sub_types,x=void 0===T?[]:T,A=[],D=[];b.map((function(e){var t=x[e]||{};A.push(t);var n=t.sub_types||{};Object.keys(n).map((function(){Z.map((function(e){var t=n[e];i().existy(t)&&i().not.empty(t)&&!D.includes(t)&&D.push(t)}))}))})),303!==F&&309!==F||e.splice(2,0,m.createElement(r.Z.Item,(0,l.Z)({label:"印章类型"},g),m.createElement(v.Z,{type:"flowSealType",value:c,isDetail:!0}))),306===F&&e.splice(2,0,m.createElement(r.Z.Item,(0,l.Z)({label:"类型"},g),m.createElement(v.Z,{type:"license",value:E,isDetail:!0}))),406===F&&e.splice(2,0,m.createElement(r.Z.Item,(0,l.Z)({label:"类型"},g),m.createElement(v.Z,{type:"contract",value:u,isDetail:!0}))),405===F&&e.splice(2,0,m.createElement(r.Z.Item,(0,l.Z)({label:"会审类型"},g),m.createElement(y.gB,{isDetail:!0,showValue:a||a[0]})),m.createElement(r.Z.Item,(0,l.Z)({label:"合同类型"},g),i().empty(A)?"--":A.map((function(e,t){return A.length===t+1?e.name:"".concat(e.name,",")}))),m.createElement(r.Z.Item,(0,l.Z)({label:"合同子类型"},g),i().empty(D)?"--":D.map((function(e,t){return D.length===t+1?e:"".concat(e,",")})))),701===F&&e.splice(2,0,m.createElement(r.Z.Item,(0,l.Z)({label:"调整子类型"},g),Array.isArray(C)&&C.length>0?C.map((function(e){return f.KV8.description(e)})).join(", "):"--"))};return m.createElement(r.Z,{layout:"horizontal",form:x,onFinish:function(){}},(A=s().get(u,w,{}).apply_application_types,D=F.affairs,B=void 0===D?[]:D,V=Array.isArray(A)&&A.length>0&&B.find((function(e){return e.value===A[0]}))||{},j=[{span:24,render:m.createElement(r.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:m.createElement("h3",null,"事务类审批流关联")})},m.createElement(r.Z.Item,(0,l.Z)({label:"适用类型"},g),V.name||"--")],m.createElement(m.Fragment,null,m.createElement(d.Fp,{items:j,cols:3}))),function(){var e=s().get(u,Z,{}),t=s().get(e,"node_list",[]),n=[{span:24,render:m.createElement(r.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:m.createElement("h3",null,"BU3-事务审批流：")})},{span:24,render:m.createElement(r.Z.Item,{label:"审批流名称",labelCol:{span:2},wrapperCol:{span:12}},s().get(e,"name","--"),e.state?"（".concat(f.BsX.description(e.state),"）"):null)},{span:4,render:m.createElement(r.Z.Item,{label:"是否有RS节点",labelCol:{span:14},wrapperCol:{span:8}},s().get(e,"is_rs")?"是":"否")},{span:12,render:m.createElement(r.Z.Item,{label:"最高审批岗",labelCol:{span:4},wrapperCol:{span:20}},m.createElement("span",{className:"noteWrap"},k(e)))},{span:24,render:m.createElement(r.Z.Item,{label:"审批流预览",labelCol:{span:2},wrapperCol:{span:22}},m.createElement(E.Z,{nodelist:t,applyApplicationType:s().get(e,"apply_application_types.0",void 0)}))}];return R(n,e),m.createElement(d.IT,null,m.createElement(d.Fp,{items:n,cols:3}))}(),function(){var e=s().get(u,w,{}),t=s().get(e,"node_list",[]),n=[{span:24,render:m.createElement(r.Z.Item,{labelCol:{span:3},colon:!1,style:{marginBottom:0},label:m.createElement("h3",null,"趣活-事务审批流：")})},{span:24,render:m.createElement(r.Z.Item,{label:"审批流名称",labelCol:{span:2},wrapperCol:{span:12}},s().get(e,"name","--"),e.state?"（".concat(f.BsX.description(e.state),"）"):null)},{span:12,render:m.createElement(r.Z.Item,{label:"最高审批岗",labelCol:{span:4},wrapperCol:{span:20}},m.createElement("span",{className:"noteWrap"},k(e)))},{span:24,render:m.createElement(r.Z.Item,{label:"审批流预览",labelCol:{span:2},wrapperCol:{span:22}},m.createElement(E.Z,{nodelist:t,applyApplicationType:s().get(e,"apply_application_types.0",void 0)}))}];return R(n,e),m.createElement(d.IT,null,m.createElement(d.Fp,{items:n,cols:3}))}(),m.createElement("div",{style:{textAlign:"center"}},m.createElement(a.Z,{style:{marginRight:15},onClick:function(){window.location.href="/#/Expense/RelationExamineFlow?activeKey=".concat(h)}},"返回")))}))},64434:function(e,t,n){n(13062);var a=n(71230),l=(n(89032),n(15746)),r=n(94315),o=n.n(r),c=n(93517),i=n.n(c),p=n(67294),s=n(55609),m=n(93488),u=n(80385),d=[{reportOne:1,reportTwo:1,value:u.agl.actualPerson,name:"实际申请人本部门负责人"},{reportOne:1,reportTwo:2,value:u.agl.actualPersonT,name:"实际申请人上级部门负责人"},{reportOne:2,reportTwo:1,value:u.agl.supPerson,name:"上一节点审批人本部门负责人"},{reportOne:2,reportTwo:2,value:u.agl.supPersonT,name:"上一节点审批人上级部门负责人"}];t.Z=(0,s.connect)((function(e){return{examineFlowInfo:e.relationExamineFlow.examineFlowInfo,contractTypeData:e.business.contractTypeData}}))((function(e){var t=i().get(e,"nodelist",[]),n=i().get(e,"applyApplicationType",void 0),r=function(e,t){var a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=!1,c=e.node_approve_type,i=e.organization_approve_type,s=e.account_approve_type,f=e.approve_department_name,y=e.approve_job_name,v=e.current_node_apply_account_name,E="";if(c===u.gH5.report){var g=d.find((function(e){return e.value===i}))||{};E=g.name}if(c===u.gH5.coopera){if(i===u.agl.fieldDep){var h={105:u.vA4.description(u.vA4.callIn),102:"增编部门",101:"招聘部门",108:"录用部门",109:"入职部门"};E=h[n]||u.agl.description(i)}else i&&(E=u.agl.description(i));if(s===u.Evl.fieldAccount){var b={405:u.lXD.description(u.lXD.contract),107:"工作接收人",303:"印章保管人",309:"印章保管人",301:"印章保管人",302:"印章保管人",306:"证照保管人",406:"合同保管人"};E=b[n]||u.Evl.description(s)}else s&&(E=u.Evl.description(s))}return i&&i===u.agl.department&&f&&((o().not.existy(v)||o().empty(v))&&(r=!0),E=f,!y&&(E="".concat(f," - 部门负责人 - ").concat(v||"无")),y&&(E="".concat(f," - ").concat(y," - ").concat(v||"无"))),p.createElement(l.Z,{key:t,style:{marginLeft:5}},p.createElement("span",{style:{color:r?"red":""}},e.node_name,"（",E,"）"),a?null:p.createElement(m.Z,null))};return p.createElement(p.Fragment,null,function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return o().not.existy(e)||o().empty(e)?"--":p.createElement(a.Z,null,p.createElement(l.Z,null,p.createElement("span",null,"申请人")," ",p.createElement(m.Z,null)),e.map((function(t,n){return r(t,n,n===e.length-1)})))}(t))}))},96521:function(e,t,n){n(29093);var a=n(16317),l=n(55609),r=n(67294),o=a.Z.Option;t.Z=(0,l.connect)((function(e){return{enumeratedValue:e.applicationCommon.enumeratedValue}}))((function(e){var t=e.enumeratedValue,n=void 0===t?{}:t,l=e.value,c=void 0===l?[]:l,i=e.onChange,p=e.type,s=e.dispatch,m=e.isDetail;if((0,r.useEffect)((function(){s({type:"applicationCommon/getEnumeratedValue",payload:{enumeratedType:p}})}),[s,p]),Object.keys(n).length<1||!p)return r.createElement("div",null);var u=n[p]||[];return m?c.length<1?"--":(u.filter((function(e){return c.includes(e.value)}))||[]).map((function(e){return e.name})).join("、"):r.createElement(a.Z,{value:c,placeholder:"请选择",mode:"multiple",showArrow:!0,onChange:i,allowClear:!0,showSearch:!0,optionFilterProp:"children"},u.map((function(e){return r.createElement(o,{value:e.value,key:e.value},e.name)})))}))}}]);