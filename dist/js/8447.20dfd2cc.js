"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[8447],{97376:function(e,t,n){n(52466);var a=n(10642),l=(n(29394),n(94756)),r=n(29439),o=n(93517),c=n.n(o),i=n(67294),s=n(55609);t.Z=(0,s.connect)((function(e){return{codeInformation:e.adminManage.codeInformation}}))((function(e){var t=e.visible,n=e.dispatch,o=e.values,s=e.roleInfos,m=void 0===s?[]:s,u=(0,i.useState)([]),p=(0,r.Z)(u,2),f=p[0],d=p[1],E=c().get(e,"codeInformation",[]),h=m.map((function(e){return e._id})),y=E.filter((function(e){return!h.includes(e._id)}));(0,i.useEffect)((function(){n({type:"adminManage/fetchSystemCodeInformation",payload:{}})}),[n]),(0,i.useEffect)((function(){d(o)}),[o]);var Z=function(){var t=g(f);e.onOk&&e.onOk(f,t)},v=function(){d([]),e.onCancel&&e.onCancel()},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=y.filter((function(t){return e.includes(t._id)}));return t},b=function(e){d(e)};return i.createElement(i.Fragment,null,!0!==t?null:i.createElement(a.Z,{title:"数据权限组",visible:t,onOk:Z,onCancel:v,width:900},i.createElement(l.Z,{dataSource:y,rowKey:function(e){return e._id},titles:["全选／合计","全选／合计"],showSearch:!0,targetKeys:f,onChange:b,render:function(e){return e.name},listStyle:{height:400,width:400}})))}))},78447:function(e,t,n){n.r(t);var a=n(87462),l=(n(13062),n(71230)),r=(n(89032),n(15746)),o=(n(36037),n(47933)),c=(n(52560),n(71577)),i=(n(9070),n(20924)),s=n(93433),m=(n(51838),n(48086)),u=(n(35668),n(86585)),p=n(29439),f=(n(29093),n(16317)),d=n(94315),E=n.n(d),h=n(55609),y=n(67294),Z=n(96036),v=n(88144),g=n(97376),b=n(80385),C=n(8240),I=n(97116),S=n(30203),w=f.Z.Option,k=I.By.isShowCode(),P={labelCol:{span:6},wrapperCol:{span:18}},F=[b.G8O.pending,b.G8O.normal,b.G8O.replace,b.G8O.pendingReview,b.G8O.repair];t.default=(0,h.connect)((function(e){return{accountManage:e.accountManage,staffProfile:e.employeeManage.staffProfile}}))((function(e){var t=e.dispatch,n=e.history,d=e.staffProfile,h=u.Z.useForm(),O=(0,p.Z)(h,1)[0],M=(0,y.useState)([]),_=(0,p.Z)(M,2),A=_[0],G=_[1],T=(0,y.useState)(!1),B=(0,p.Z)(T,2),V=B[0],q=B[1],z=(0,y.useState)([]),K=(0,p.Z)(z,2),x=K[0],Q=K[1],W=(0,y.useState)([]),j=(0,p.Z)(W,2),D=j[0],U=j[1],Y=(0,y.useRef)(!1);(0,y.useEffect)((function(){return function(){return t({type:"employeeManage/resetStaffProfile"})}}),[t]);var H,J=function(){n.push("/System/Account/Manage")},R=function(){m.ZP.success("创建成功"),n.push("/System/Account/Manage")},X=function(){Y.current=!1},N=function(){O.setFieldsValue({jobs:[]})},L=function(e,t){G(t)},$=function(e){var n=e.target.value;(O.setFieldsValue({staffProfileId:void 0}),n.length>10)?t({type:"employeeManage/fetchStaffProfile",payload:{phone:n,SignState:F}}):t({type:"employeeManage/resetStaffProfile"})},ee=function(){U((0,s.Z)(D)),q(!1),Q((0,s.Z)(x))},te=function(e,t){U(t),Q(e),q(!1)},ne={state:b.m3m.on};return y.createElement(u.Z,(0,a.Z)({},P,{initialValues:ne,form:O,layout:"horizontal",onFinish:function(e){if(!Y.current){var n={params:e,onSuccessCallback:R,onFailureCallback:X};k&&(n.allowBizGroupIds=x),t({type:"accountManage/createAccount",payload:n})}}}),y.createElement(Z.IT,{title:"基本信息"},(H=[y.createElement(u.Z.Item,{label:"姓名",name:"name",rules:[{required:!0,message:"请输入姓名"}]},y.createElement(i.Z,{placeholder:"请输入姓名"})),y.createElement(u.Z.Item,{label:"手机号",name:"phone",rules:[{required:!0,validator:C.PT}]},y.createElement(i.Z,{placeholder:"请输入手机号",onChange:$})),y.createElement(u.Z.Item,{label:"员工档案",name:"staffProfileId"},y.createElement(f.Z,{allowClear:!0,placeholder:"请选择员工档案"},d.map((function(e,t){return y.createElement(w,{value:e._id,key:t},e.name,"(",e.identity_card_id,")")}))))],y.createElement(Z.Fp,{items:H}))),y.createElement(Z.IT,{title:"组织信息"},function(){var e=[y.createElement(u.Z.Item,{label:"角色",name:"positions",labelCol:{span:2},wrapperCol:{span:10},rules:[{required:!0,message:"请选择角色"}]},y.createElement(v.GS,{onChange:L,allowClear:!0,showSearch:!0,optionFilterProp:"children",mode:"multiple",showArrow:!0,onlyShowOperable:!0,placeholder:"请选择角色"}))];return!0===k&&e.push(y.createElement(u.Z.Item,{label:"角色数据授权",labelCol:{span:2},wrapperCol:{span:22}},y.createElement("div",null,E().existy(A)&&E().not.empty(A)?A.map((function(e){return e.name})).join(", "):"--"))),y.createElement(Z.Fp,{items:e,cols:1})}()),function(){if(!0!==k)return null;var e=[y.createElement(u.Z.Item,{label:"特殊数据授权",labelCol:{span:2},wrapperCol:{span:22}},y.createElement("div",null,y.createElement(c.Z,{onClick:function(){q(!0)}},"请选择"),y.createElement("div",null,D.map((function(e){return e.name})).join(", "))))];return y.createElement(Z.IT,{title:"外部数据策略信息"},y.createElement(Z.Fp,{items:e,cols:1}),y.createElement(g.Z,{visible:V,values:x,roleInfos:A,onOk:te,onCancel:ee}))}(),y.createElement(Z.IT,{title:"状态信息"},function(){var e=[y.createElement(u.Z.Item,{label:"状态",name:"state",rules:[{required:!0,message:"请选择状态"}]},y.createElement(o.ZP.Group,{onChange:N,disabled:I.Iq.isAdmin()},y.createElement(o.ZP,{value:b.m3m.on},b.m3m.description(b.m3m.on)),y.createElement(o.ZP,{value:b.m3m.off},b.m3m.description(b.m3m.off))))];return y.createElement(Z.Fp,{items:e})}()),y.createElement(Z.IT,null,y.createElement(l.Z,null,y.createElement(r.Z,{span:11,className:S.Z["app-comp-system--create-operate-back-col"]},y.createElement(c.Z,{onClick:J},"返回")),y.createElement(r.Z,{span:11,offset:1},y.createElement(c.Z,{type:"primary",htmlType:"submit"},"提交")))))}))},30203:function(e,t){t.Z={"app-comp-system--create-operate-back-col":"AxX93IWPV2EzVUrvO_pT","app-comp-system-create-operate-submit-col":"vy28sq1OeFBDf9Qxei55","app-comp-system-detail-label":"bsvlTO2kA3axmv3nSu5W","app-comp-system-detail-value":"HYnsDEp59EW_55ytprgf","app-comp-system-detail-form-col":"cg2gQKzJ3Zakn81AKFpc","app-comp-system-detail-operate-col":"YdtafoBu7kMKtBJWoUsw","app-comp-system-form-cascade-selector":"Mh9d3eDznaXFQHAVQrsU","app-comp-system-table-operate-detail":"S_EYloo8bVhtEbZGerm_"}}}]);