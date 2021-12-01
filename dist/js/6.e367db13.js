"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[6],{60006:function(e,t,a){a.r(t);var n=a(87462),l=(a(35668),a(86585)),i=a(29439),r=a(93517),o=a.n(r),c=a(30381),m=a.n(c),d=a(67294),s=a(55609),p=a(80385),u=a(96036),v=a(86221),_=a(45430),f={labelCol:{span:9},wrapperCol:{span:15}},E={labelCol:{span:3},wrapperCol:{span:21}};t.default=(0,s.connect)((function(e){return{licenseDetail:e.sharedLicense.licenseDetail}}),(function(e){return{getLicenseDetail:function(t){return e({type:"sharedLicense/getSharedLicenseDetail",payload:t})},resetLicenseDetail:function(){return e({type:"sharedLicense/resetSharedLicenseDetail",payload:{}})}}}))((function(e){var t=e.getLicenseDetail,a=e.resetLicenseDetail,r=e.location,c=void 0===r?{}:r,s=e.licenseDetail,g=void 0===s?{}:s,b=l.Z.useForm(),Z=(0,i.Z)(b,1)[0],I=c.query,Y=void 0===I?{}:I;if((0,d.useEffect)((function(){return Y.id&&t({id:Y.id}),function(){return a()}}),[t,a,Y.id]),!g||Object.keys(g).length<=0)return d.createElement("div",null);var D,y,M,h=g.cert_type,k=void 0===h?void 0:h,L=g.origin,w=void 0===L?void 0:L,S=g.display,A=void 0===S?void 0:S,F=g.from_date,C=void 0===F?void 0:F,U=g.end_date,B=void 0===U?void 0:U,O=g.certification_unit,V=void 0===O?void 0:O,x=g.send_date,j=void 0===x?void 0:x,q=g.cert_deadline_type,K=void 0===q?void 0:q,P=g.other_cert_deadline,T=void 0===P?void 0:P,W=g.note,z=void 0===W?void 0:W,G=g.borrow_state,H=void 0===G?void 0:G,J=g.expected_return_date,N=void 0===J?void 0:J,Q=g.created_at,R=void 0===Q?void 0:Q,X=[d.createElement(l.Z.Item,{label:"证照类型"},k?p.Vvo.description(k):"--"),d.createElement(l.Z.Item,{label:"证照负责人"},o().get(g,"keep_account_info.name",void 0)?o().get(g,"keep_account_info.name"):"--"),d.createElement(l.Z.Item,{label:"证照名称"},o().get(g,"name",void 0)?o().get(g,"name"):"--"),d.createElement(l.Z.Item,{label:"公司名称"},o().get(g,"firm_info.name",void 0)?o().get(g,"firm_info.name"):"--"),d.createElement(l.Z.Item,{label:"证照编号"},o().get(g,"cert_no",void 0)?o().get(g,"cert_no"):"--"),d.createElement(l.Z.Item,{label:"统一社会信用代码"},o().get(g,"credit_no",void 0)?o().get(g,"credit_no"):"--"),d.createElement(l.Z.Item,{label:"正副本"},w?p.Ak0.description(w):"--"),d.createElement(l.Z.Item,{label:"原件/复印件"},A?p.Sdt.description(A):"--"),d.createElement(l.Z.Item,{label:"公司区域"},"".concat(o().get(g,"province_name","-")).concat(o().get(g,"city_name","-"))),d.createElement(l.Z.Item,{label:"营业期限开始"},C?m()(String(C)).format("YYYY-MM-DD"):"--"),d.createElement(l.Z.Item,{label:"营业期限结束"},B?m()(String(B)).format("YYYY-MM-DD"):"--"),d.createElement(l.Z.Item,{label:"发证日期"},j?m()(String(j)).format("YYYY-MM-DD"):"--"),d.createElement(l.Z.Item,{label:"发证单位"},V||"--"),d.createElement(l.Z.Item,{label:"证照有效期"},d.createElement("span",null,K?p.WIA.description(K):"--"),d.createElement("span",{style:{paddingLeft:5}},T?m()(String(T)).format("YYYY-MM-DD"):""))],$=[d.createElement(l.Z.Item,(0,n.Z)({label:"备注"},E),d.createElement("div",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word"}},z||"--"))],ee=[d.createElement(l.Z.Item,{label:"来源"},o().get(g,"source_type","")?p.daU.description(o().get(g,"source_type")):"--"),d.createElement(l.Z.Item,{label:o().get(g,"source_type","")===p.daU.approval?"提报人":"创建人"},o().get(g,"source_type","")===p.daU.approval?o().get(g,"report_info.name","--"):o().get(g,"creator_info.name","--")),d.createElement(l.Z.Item,{label:"创建时间"},R?m()(R).format("YYYY-MM-DD"):"--")],te=[d.createElement(l.Z.Item,{label:"证照状态"},H?p.VxM.description(H):"--"),d.createElement(l.Z.Item,{label:"借用人"},o().get(g,"borrower_info.name","--")),d.createElement(l.Z.Item,{label:"预计归还时间"},N?m()(String(N)).format("YYYY-MM-DD"):"--")],ae=[d.createElement(l.Z.Item,(0,n.Z)({label:"附件"},E),d.createElement(v.uA,{domain:v.uA.UploadDomains.OAUploadDomain,displayMode:!0,value:v.uA.getInitialValue(g,"asset_infos")}))],ne=[d.createElement(l.Z.Item,(0,n.Z)({label:"可见成员"},E),o().get(g,"look_acl",void 0)===p.MmK.all?"全部":(D=o().get(g,"look_account_info_list",[]),y=o().get(g,"look_department_info_list",[]),M=D.concat(y),0===M.length?"--":M.reduce((function(e,t,a){return 0===a?t.name:"".concat(e,", ").concat(t.name)}),"")))];return d.createElement(l.Z,(0,n.Z)({},f,{form:Z}),d.createElement(u.IT,null,d.createElement(u.Fp,{items:X}),d.createElement(u.Fp,{items:$,cols:1}),d.createElement(u.Fp,{items:ee}),d.createElement(u.Fp,{items:te}),d.createElement(u.Fp,{items:ae,cols:1}),_.ZP.canOperateSharedLicenseAuthority()?d.createElement(u.Fp,{items:ne,cols:1}):""))}))}}]);