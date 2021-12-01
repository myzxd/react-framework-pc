"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[5946],{95946:function(e,t,a){a.r(t);var n=a(87462),l=(a(35668),a(86585)),r=a(29439),o=a(93517),c=a.n(o),i=a(30381),m=a.n(i),d=a(67294),u=a(55609),s=a(80385),p=a(96036),f=a(86221),E=a(45430),v={labelCol:{span:9},wrapperCol:{span:15}},_={labelCol:{span:3},wrapperCol:{span:21}};t.default=(0,u.connect)((function(e){return{enumeratedValue:e.codeRecord.enumeratedValue,sealDetail:e.sharedSeal.sealDetail}}),(function(e){return{getSealDetail:function(t){return e({type:"sharedSeal/getSharedSealDetail",payload:t})},resetSealDetail:function(){return e({type:"sharedSeal/resetSharedSealDetail",payload:{}})},getEnumer:function(){return e({type:"codeRecord/getEnumeratedValue",payload:{}})},resetEnumer:function(){return e({type:"codeRecord/resetEnumerateValue",payload:{}})}}}))((function(e){var t=e.sealDetail,a=void 0===t?{}:t,o=e.location,i=void 0===o?{}:o,u=e.getSealDetail,g=e.resetSealDetail,Z=e.getEnumer,b=e.resetEnumer,y=e.enumeratedValue,I=void 0===y?{}:y,D=l.Z.useForm(),S=(0,r.Z)(D,1)[0],h=i.query,Y=void 0===h?{}:h;(0,d.useEffect)((function(){return Z(),function(){b()}}),[]),(0,d.useEffect)((function(){return Y.id&&u({id:Y.id}),function(){return g()}}),[u,g,Y.id]);var k,w,M=a.name,C=void 0===M?void 0:M,F=a.seal_type,V=void 0===F?void 0:F,A=a.note,U=void 0===A?void 0:A,B=a.state,R=void 0===B?void 0:B,O=a.borrow_state,X=void 0===O?void 0:O,q=a.created_at,x=void 0===q?void 0:q,K=a.canceler_date,P=void 0===K?void 0:K,T=a.expected_return_date,j=void 0===T?void 0:T,z=[d.createElement(l.Z.Item,{label:"印章名称"},C||"--"),d.createElement(l.Z.Item,{label:"公司名称"},c().get(a,"firm_info.name",void 0)?c().get(a,"firm_info.name"):"--"),d.createElement(l.Z.Item,{label:"印章类型"},(k=I.seal_types||[],w="--",k.length>0&&k.forEach((function(e){e.value===V&&(w=e.name)})),w)),d.createElement(l.Z.Item,{label:"印章保管人"},c().get(a,"keep_account_info.employee_info.name",void 0)?c().get(a,"keep_account_info.employee_info.name"):"--")],G=[d.createElement(l.Z.Item,(0,n.Z)({label:"备注"},_),d.createElement("div",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word"}},U||"--"))],H=[d.createElement(l.Z.Item,{label:"来源"},c().get(a,"source_type","")?s.daU.description(c().get(a,"source_type")):"--"),d.createElement(l.Z.Item,{label:c().get(a,"source_type","")===s.daU.approval?"提报人":"创建人"},c().get(a,"source_type","")===s.daU.approval?c().get(a,"report_info.name","--"):c().get(a,"creator_info.name","--")),d.createElement(l.Z.Item,{label:"创建时间"},x?m()(x).format("YYYY-MM-DD"):"--"),d.createElement(l.Z.Item,{label:"印章状态"},R?s.Xf4.description(R):"--"),d.createElement(l.Z.Item,{label:"借用状态"},X?s.hEf.description(X):"--"),d.createElement(l.Z.Item,{label:"借用人"},c().get(a,"borrower_info.name","--")),d.createElement(l.Z.Item,{label:"预计归还时间"},j?m()(String(j)).format("YYYY-MM-DD"):"--")];"".concat(R)!=="".concat(s.Xf4.normal)&&H.splice(4,0,d.createElement(l.Z.Item,{label:"作废提报人"},c().get(a,"canceler_info.name","--")),d.createElement(l.Z.Item,{label:"注销时间"},P?m()(String(P)).format("YYYY-MM-DD"):"--"));var J,L,N,Q=[d.createElement(l.Z.Item,(0,n.Z)({label:"附件"},_),d.createElement(f.uA,{domain:f.uA.UploadDomains.OAUploadDomain,displayMode:!0,value:f.uA.getInitialValue(a,"asset_infos")}))],W=[d.createElement(l.Z.Item,(0,n.Z)({label:"可见成员"},_),c().get(a,"look_acl",void 0)===s.MmK.all?"全部":(J=c().get(a,"look_account_info_list",[]),L=c().get(a,"look_department_info_list",[]),N=J.concat(L),0===N.length?"--":N.reduce((function(e,t,a){return 0===a?t.name:"".concat(e,", ").concat(t.name)}),"")))];return d.createElement(l.Z,(0,n.Z)({},v,{form:S}),d.createElement(p.IT,null,d.createElement(p.Fp,{items:z}),d.createElement(p.Fp,{items:G,cols:1}),d.createElement(p.Fp,{items:H}),d.createElement(p.Fp,{items:Q,cols:1}),E.ZP.canOperateSharedSealAuthority()?d.createElement(p.Fp,{items:W,cols:1}):""))}))}}]);