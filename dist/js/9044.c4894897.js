(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[9044],{15260:function(e,t,n){"use strict";n(29093);var r=n(16317),a=n(55609),l=n(67294),i=r.Z.Option;t.Z=(0,a.connect)((function(e){return{flowSelectList:e.codeFlow.flowSelectList}}))((function(e){var t=e.dispatch,n=e.flowSelectList,a=void 0===n?{}:n,o=e.value,c=e.onChange,s=e.type;(0,l.useEffect)((function(){return t({type:"codeFlow/getFlowSelectList",payload:{page:1,limit:9999,type:s}}),function(){t({type:"codeFlow/resetFlowSelectList"})}}),[t,s]);var u=a.data,m=void 0===u?[]:u;return l.createElement(r.Z,{value:o,onChange:c,placeholder:"请选择",allowClear:!0,showSearch:!0,optionFilterProp:"children"},m.map((function(e){return l.createElement(i,{value:e._id,key:e._id,team:e.team},e.name)})))}))},99044:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return ie}});n(13062);var r=n(71230),a=(n(89032),n(15746)),l=n(29439),i=n(93517),o=n.n(i),c=n(67294),s=n(80385),u=n(96036),m=(n(38252),n(91665)),d=(n(438),n(14277)),p=n(55609),f=(0,p.connect)((function(e){return{matterTree:e.codeMatter.matterTree}}))((function(e){var t=e.tabKey,n=e.onSelect,r=e.dispatch,a=e.matterTree,l=void 0===a?[]:a,i=e.setMenuSelectedKey;if((0,c.useEffect)((function(){return r({type:"codeMatter/getMatterTree",payload:{type:t}}),function(){r({type:"codeMatter/resetMatterTree"})}}),[r,t]),(0,c.useEffect)((function(){if(Array.isArray(l)&&l.length>0){var e=[o().get(l,"0._id")];i&&i(e)}}),[l,i]),!Array.isArray(l)||l.length<1)return c.createElement(d.Z,null);var s=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.map((function(t){return{title:t.name,value:t._id,key:t._id,children:e(t.child_scene_list)}}))}(l);return c.createElement(m.Z,{treeData:s,defaultExpandAll:!0,onSelect:n,defaultSelectedKeys:[o().get(l,"0._id")]})})),g=(n(52560),n(71577)),A=(n(35668),n(86585)),E=n(87462),v=(n(51838),n(48086)),b=n(4942),Z=n(15861),y=(n(9070),n(20924)),w=n(87757),h=n.n(w),I=n(1825);n(48659);function C(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function k(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?C(Object(n),!0).forEach((function(t){(0,b.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):C(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var j=y.Z.TextArea,O={labelCol:{span:6},wrapperCol:{span:18}},x=function(e){var t=e.visible,n=e.onClose,r=e.dispatch,a=e.data,i=void 0===a?{}:a,o=e.matterId,s=A.Z.useForm(),m=(0,l.Z)(s,1)[0],d=function(){var e=(0,Z.Z)(h().mark((function e(){var t,a;return h().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m.validateFields();case 2:return t=e.sent,e.next=5,r({type:"codeMatter/updateMatter",payload:k(k({},t),{},{matterId:o})});case 5:(a=e.sent)&&a._id&&(v.ZP.success("请求成功"),n&&n(a._id));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();(0,c.useEffect)((function(){t&&m.setFieldsValue({name:i.name,note:i.note})}),[t]);var p,f={name:i.name,note:i.note};return c.createElement(I.Z,{title:"编辑菜单",visible:t,onClose:n,width:400,footer:c.createElement("div",{style:{textAlign:"right"}},c.createElement(g.Z,{onClick:function(){return n()}},"取消"),c.createElement(g.Z,{onClick:function(){return d()},type:"primary",style:{marginLeft:10}},"确定"))},(p=[c.createElement(A.Z.Item,(0,E.Z)({label:"菜单名称",name:"name"},O,{rules:[{required:!0,message:"请输入"},{pattern:/^\S+$/,message:"菜单名称不能包含空格"}]}),c.createElement(y.Z,{placeholder:"请输入",allowClear:!0})),c.createElement(A.Z.Item,(0,E.Z)({label:"说明",name:"note",className:"code-flow-link-textArea"},O),c.createElement(j,{allowClear:!0,placeholder:"请输入",rows:4}))],c.createElement(A.Z,{form:m,className:"affairs-flow-basic",initialValues:f},c.createElement(u.Fp,{items:p,cols:1}))))},L=n(45430),P=(0,p.connect)((function(e){return{matterDetail:e.codeMatter.matterDetail}}))((function(e){var t=e.matterDetail,n=void 0===t?{}:t,r=e.dispatch,a=e.matterId,i=(0,c.useState)(!1),o=(0,l.Z)(i,2),s=o[0],m=o[1];if((0,c.useEffect)((function(){return a&&r({type:"codeMatter/getMatterDetail",payload:{matterId:a}}),function(){r({type:"codeMatter/resetMatterDetail"})}}),[r,a]),Object.keys(n).length<1)return c.createElement(u.IT,{title:"基本信息"},c.createElement(d.Z,null));var p,f,E,v,b={data:n,visible:s,onClose:function(e){e&&r({type:"codeMatter/getMatterDetail",payload:{matterId:a}}),m(!1)},matterId:a,dispatch:r};return c.createElement(c.Fragment,null,(p=n.name,f=n.note,E=[c.createElement(A.Z.Item,{label:"分类名称"},p||"--"),c.createElement(A.Z.Item,{label:"说明"},f||"--")],v=L.ZP.canOperateOperateCodeMatterUpdate()?c.createElement(g.Z,{type:"primary",onClick:function(){return m(!0)}},"编辑"):"",c.createElement(u.IT,{title:"基本信息",titleExt:v},c.createElement(A.Z,{className:"wallet-bill-detail-basic-form"},c.createElement(u.Fp,{items:E,cols:3})))),c.createElement(x,b))})),_=(n(20186),n(75385)),M=(n(21316),n(75443)),S=(n(36037),n(47933)),F=n(93433),U=n(15260),B=(n(29093),n(16317)),N=B.Z.Option,K=function(e){var t=e.value,r=e.onChange,a=[{_id:"001",icon:c.createElement("img",{src:n(80581),role:"presentation"})},{_id:"002",icon:c.createElement("img",{src:n(3947),role:"presentation"})},{_id:"003",icon:c.createElement("img",{src:n(30352),role:"presentation"})},{_id:"004",icon:c.createElement("img",{src:n(36957),role:"presentation"})},{_id:"005",icon:c.createElement("img",{src:n(80598),role:"presentation"})}];return c.createElement(B.Z,{value:t,onChange:r,placeholder:"请选择",allowClear:!0,showSearch:!0,optionFilterProp:"children"},a.map((function(e){return c.createElement(N,{value:e._id,key:e._id},e.icon)})))},T=B.Z.Option,D=(0,p.connect)((function(e){return{subjectList:e.codeFlow.subjectList}}))((function(e){var t=e.dispatch,n=e.subjectList,r=void 0===n?{}:n,a=e.value,l=e.onChange,i=e.type;(0,c.useEffect)((function(){return t({type:"codeFlow/getSubjectList",payload:{page:1,limit:9999,type:i}}),function(){t({type:"codeFlow/resetSubjectList"})}}),[t,i]);var o=r.data,s=void 0===o?[]:o;return c.createElement(B.Z,{value:a,onChange:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];e.includes("*")?l&&l(["*"]):l&&l(e)},placeholder:"请选择",mode:"multiple",allowClear:!0,showSearch:!0,showArrow:!0,optionFilterProp:"children"},s.length>0&&c.createElement(T,{value:"*",key:"*"},"全部"),s.map((function(e){return c.createElement(T,{value:e._id,key:e._id,disabled:Array.isArray(a)&&a.includes("*")},e.name,"(",e.ac_code,")")})))})),V=n(94315),R=n.n(V),G=B.Z.Option,Y=(0,p.connect)((function(e){return{teamList:e.codeMatter.teamList}}))((function(e){var t=e.dispatch,n=e.teamList,r=void 0===n?{}:n,a=e.value,l=e.onChange,i=e.flowId,o=e.subject,s=e.tabKey,u=e.isInitFlag,m=e.initAllowCodeList,d=e.initAllowTeamList;(0,c.useEffect)((function(){return i&&t({type:"codeMatter/getTeamList",payload:{flowId:i,subject:o,tabKey:s}}),function(){t({type:"codeMatter/resetTeamList"})}}),[t,i,o,s]);var p=r.data,f=void 0===p?[]:p,g=f.map((function(e){return c.createElement(G,{value:e._id,key:e._id,disabled:Array.isArray(a)&&a.includes("*")},e.name)}));if(!0===u){if(R().existy(m)&&R().not.empty(m)){var A=f.map((function(e){return e._id})),E=m.filter((function(e){return!A.includes(e._id)})).map((function(e){return c.createElement(G,{value:e._id,key:e._id,disabled:!0},e.name)}));g.push.apply(g,(0,F.Z)(E))}if(R().existy(d)&&R().not.empty(d)){var v=f.map((function(e){return e._id})),b=d.filter((function(e){return!v.includes(e._id)})).map((function(e){return c.createElement(G,{value:e._id,key:e._id,disabled:!0},e.name)}));g.push.apply(g,(0,F.Z)(b))}}return c.createElement(B.Z,{value:a,onChange:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];e.includes("*")?l&&l(["*"]):l&&l(e)},onFocus:function(){if(u&&!a.includes("*")){var e=f.map((function(e){return e._id})),t=a.filter((function(t){return e.includes(t)}));l&&l(t)}},placeholder:"请选择",mode:"multiple",allowClear:!0,showSearch:!0,showArrow:!0,optionFilterProp:"children"},f.length>0&&c.createElement(G,{value:"*",key:"*"},"全部"),g)})),q=(n(88775),n(12010)),z=(0,p.connect)((function(e){return{depAndPostTree:e.applicationCommon.depAndPostTree}}))((function(e){var t=e.dispatch,n=e.value,r=e.onChange,a=e.multiple,l=void 0!==a&&a,i=e.depAndPostTree,o=void 0===i?[]:i;if((0,c.useEffect)((function(){t({type:"applicationCommon/getDepAndPost"})}),[t]),!Array.isArray(o)||o.length<1)return c.createElement(B.Z,null);var s=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.map((function(t){if(t.node){var n=t.leaf?(0,F.Z)(t.leaf):[],r=t.job_list?(0,F.Z)(t.job_list):[];return{title:t.node.name,value:t.node._id,key:t.node._id,jobId:t.node.job_id,children:e([].concat((0,F.Z)(r),(0,F.Z)(n)))}}}))}(o),u={treeData:s,treeDefaultExpandAll:!0,value:s.length>0?n:[],filterTreeNode:function(e,t){return t.title.indexOf(e)>-1},onChange:r,allowClear:!0,multiple:l,placeholder:"请选择",style:{width:"100%"}};return c.createElement(q.Z,u)}));function J(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Q(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?J(Object(n),!0).forEach((function(t){(0,b.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):J(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var W=y.Z.TextArea,H={labelCol:{span:6},wrapperCol:{span:18}},X=function(e){var t,n,r=e.visible,a=e.onClose,i=e.dispatch,o=e.matterId,m=e.tabKey,d=A.Z.useForm(),p=(0,l.Z)(d,1)[0],f=(0,c.useState)([]),b=(0,l.Z)(f,2),w=b[0],C=b[1],k=(0,c.useState)(void 0),j=(0,l.Z)(k,2),O=j[0],x=j[1],L=(0,c.useState)(void 0),P=(0,l.Z)(L,2),_=P[0],M=P[1],B=(0,c.useState)(!0),N=(0,l.Z)(B,2),T=N[0],V=N[1],R=(0,c.useState)(!1),G=(0,l.Z)(R,2),q=G[0],J=G[1],X=function(){var e=(0,Z.Z)(h().mark((function e(){var t,n;return h().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.validateFields();case 2:return t=e.sent,J(!0),e.next=6,i({type:"codeMatter/createMatterLink",payload:Q(Q({},t),{},{matterId:o,depAndPostVals:w})});case 6:(n=e.sent)&&n._id?(v.ZP.success("请求成功"),p.resetFields(),J(!1),a&&a(n._id)):n&&n.zh_message?(v.ZP.error(n.zh_message),J(!1)):J(!1);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),$=function(e){x(e),p.setFieldsValue({team:void 0,code:void 0})},ee=function(e){M(e),p.setFieldsValue({team:void 0,code:void 0})},te=function(e,t,n){var r=n.triggerNode.props;C([].concat((0,F.Z)(w),[r]))},ne=function(e){V(e.target.value),C([])};return c.createElement(I.Z,{title:"添加链接",visible:r,onClose:function(){return a()},width:500,footer:c.createElement("div",{style:{textAlign:"right"}},c.createElement(g.Z,{onClick:function(){return a()}},"取消"),c.createElement(g.Z,{loading:q,onClick:function(){return X()},type:"primary",style:{marginLeft:10}},"确定"))},(t=Number(m)===s.IGK.code?c.createElement(A.Z.Item,(0,E.Z)({label:"选择CODE",name:"code",rules:[{required:!0,message:"请选择"}]},H),c.createElement(Y,{flowId:O,subject:_,tabKey:m})):c.createElement(A.Z.Item,(0,E.Z)({label:"选择TEAM",name:"team",rules:[{required:!0,message:"请选择"}]},H),c.createElement(Y,{flowId:O,subject:_,tabKey:m})),n=[c.createElement(A.Z.Item,(0,E.Z)({label:"标题",name:"title",rules:[{required:!0,message:"请输入"},{pattern:/^\S+$/,message:"标题不能包含空格"},{type:"string",max:20,message:"名称最多20字符"}]},H),c.createElement(y.Z,{placeholder:"请输入",allowClear:!0})),c.createElement(A.Z.Item,(0,E.Z)({label:"说明",name:"note",rules:[{required:!0,message:"请输入"}],className:"code-flow-link-textArea"},H),c.createElement(W,{allowClear:!0,placeholder:"请输入",rows:4})),c.createElement(A.Z.Item,(0,E.Z)({label:"icon",name:"icon",rules:[{required:!0,message:"请选择"}]},H),c.createElement(K,null)),c.createElement("div",null,"审批流选择"),c.createElement(A.Z.Item,(0,E.Z)({label:"审批流",name:"flowId",rules:[{required:!0,message:"请选择"}]},H),c.createElement(U.Z,{type:m,onChange:$})),c.createElement("div",null,"选项"),c.createElement(A.Z.Item,(0,E.Z)({label:"启动选择科目",name:"subject",rules:[{required:!0,message:"请选择"}]},H),c.createElement(D,{type:m,onChange:ee})),t,c.createElement(A.Z.Item,(0,E.Z)({label:"是否特定范围提报",name:"isAll"},H),c.createElement(S.ZP.Group,{onChange:ne},c.createElement(S.ZP,{value:!1},"是"),c.createElement(S.ZP,{value:!0},"否")))],!T&&(n[n.length]=c.createElement(A.Z.Item,(0,E.Z)({label:"部门及岗位",name:"dep",rules:[{required:!0,message:"请选择"}]},H),c.createElement(z,{multiple:!0,onChange:te}))),c.createElement(A.Z,{form:p,className:"affairs-flow-basic",initialValues:{isAll:!0}},c.createElement(u.Fp,{items:n,cols:1}))))};function $(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ee(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?$(Object(n),!0).forEach((function(t){(0,b.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):$(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var te=y.Z.TextArea,ne={labelCol:{span:6},wrapperCol:{span:18}},re=(0,p.connect)((function(e){return{matterLinkDetail:e.codeMatter.matterLinkDetail}}))((function(e){var t=e.visible,r=e.onClose,a=e.dispatch,i=e.matterLinkDetail,u=void 0===i?{}:i,m=e.linkId,d=e.tabKey,p=A.Z.useForm(),f=(0,l.Z)(p,1)[0],b=(0,c.useState)(!1),w=(0,l.Z)(b,2),C=w[0],k=w[1],j=(0,c.useState)(!0),O=(0,l.Z)(j,2),x=O[0],L=O[1],P=(0,c.useState)([]),_=(0,l.Z)(P,2),M=_[0],B=_[1],N=(0,c.useState)(void 0),T=(0,l.Z)(N,2),V=T[0],R=T[1],G=(0,c.useState)(void 0),q=(0,l.Z)(G,2),J=q[0],Q=q[1],W=(0,c.useState)(!0),H=(0,l.Z)(W,2),X=H[0],$=H[1],re=(0,c.useState)(!1),ae=(0,l.Z)(re,2),le=ae[0],ie=ae[1];(0,c.useEffect)((function(){return m&&a({type:"codeMatter/getMatterLinkDetail",payload:{linkId:m}}),function(){a({type:"codeMatter/resetMatterLinkDetail"})}}),[a,m]),(0,c.useEffect)((function(){if(Object.keys(u).length>0){var e=u.allow_department_list,t=void 0===e?[]:e,n=u.allow_department_job_list,r=void 0===n?[]:n,a=u.flow_id,l=u.allow_accouting_ids,i=void 0===l?[]:l,o=t.map((function(e){return{value:e._id,name:e.name}})),c=r.map((function(e){var t=e.job_info,n=void 0===t?{}:t;return ee({relaId:e._id},n)})).map((function(e){return{value:e.relaId,name:e.name,jobId:e._id}}));B([].concat((0,F.Z)(o),(0,F.Z)(c))),a&&R(a),i&&Q(i)}}),[u]);var oe,ce=function(){var e=(0,Z.Z)(h().mark((function e(){var t,n;return h().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.validateFields();case 2:return t=e.sent,ie(!0),e.next=6,a({type:"codeMatter/updateMatterLink",payload:ee(ee({},t),{},{linkId:m,depAndPostVals:M})});case 6:(n=e.sent)&&n._id?(v.ZP.success("请求成功"),k(!1),B([]),ie(!1),r&&r(n._id)):n&&n.zh_message?(v.ZP.error(n.zh_message),ie(!1)):ie(!1);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),se=function(){k(!1),r&&r()},ue=function(e){R(e),f.setFieldsValue({team:void 0,code:void 0})},me=function(e){Q(e),L(!1),f.setFieldsValue({team:void 0,code:void 0})},de=function(e,t,n){var r=n.triggerNode.props;B([].concat((0,F.Z)(M),[r]))},pe=function(e){$(e.target.value),B([])},fe=C?"编辑链接":"查看链接",ge=C?"查看":"修改";return c.createElement(I.Z,{title:fe,visible:t,onClose:function(){return se()},width:500,footer:C?c.createElement("div",{style:{textAlign:"right"}},c.createElement(g.Z,{onClick:function(){return se()}},"取消"),c.createElement(g.Z,{onClick:function(){return ce()},type:"primary",style:{marginLeft:10},loading:le},"确定")):c.createElement("div",{style:{textAlign:"right"}},c.createElement(g.Z,{onClick:function(){return se()}},"取消"))},c.createElement("div",{style:{textAlign:"right",marginBottom:10}},c.createElement(g.Z,{type:"primary",onClick:function(){return function(){if(!C){var e=o().get(u,"allow_department_ids",[])||[],t=o().get(u,"allow_department_job_ids",[])||[];f.setFieldsValue({title:o().get(u,"name",void 0),note:o().get(u,"note",void 0),icon:o().get(u,"icon",void 0),flowId:o().get(u,"flow_id",void 0),subject:o().get(u,"allow_accouting_ids",[]),team:o().get(u,"is_all_cost_center",!1)?["*"]:o().get(u,"allow_team_ids",[]),code:o().get(u,"is_all_cost_center",!1)?["*"]:o().get(u,"allow_code_ids",[]),isAll:o().get(u,"is_all",!0),dep:[].concat((0,F.Z)(e),(0,F.Z)(t))}),$(o().get(u,"is_all",void 0))}k(!C)}()}},ge)),C?(oe=Number(d)===s.IGK.code?c.createElement(A.Z.Item,(0,E.Z)({label:"选择CODE",name:"code",rules:[{required:!0,message:"请选择"}]},ne),c.createElement(Y,{flowId:V,subject:J,tabKey:d,initAllowCodeList:o().get(u,"is_all_cost_center",!1)?[]:o().get(u,"allow_code_list",[]),isInitFlag:x})):c.createElement(A.Z.Item,(0,E.Z)({label:"选择TEAM",name:"team",rules:[{required:!0,message:"请选择"}]},ne),c.createElement(Y,{flowId:V,subject:J,tabKey:d,isInitFlag:x,initAllowTeamList:o().get(u,"is_all_cost_center",!1)?[]:o().get(u,"allow_team_list",[])})),c.createElement(A.Z,{form:f,className:"affairs-flow-basic"},c.createElement(A.Z.Item,(0,E.Z)({label:"标题",name:"title",rules:[{required:!0,message:"请输入"},{pattern:/^\S+$/,message:"标题不能包含空格"},{type:"string",max:20,message:"名称最多20字符"}]},ne),c.createElement(y.Z,{placeholder:"请输入",allowClear:!0})),c.createElement(A.Z.Item,(0,E.Z)({label:"说明",name:"note",rules:[{required:!0,message:"请输入"}],className:"code-flow-link-textArea"},ne),c.createElement(te,{allowClear:!0,placeholder:"请输入",rows:4})),c.createElement(A.Z.Item,(0,E.Z)({label:"icon",name:"icon",rules:[{required:!0,message:"请输入"}]},ne),c.createElement(K,null)),c.createElement(A.Z.Item,(0,E.Z)({label:"请选择审批流",name:"flowId",rules:[{required:!0,message:"请选择"}]},ne),c.createElement(U.Z,{type:d,onChange:ue})),c.createElement(A.Z.Item,(0,E.Z)({label:"启动选择科目",name:"subject",rules:[{required:!0,message:"请选择"}]},ne),c.createElement(D,{type:d,onChange:me})),oe,c.createElement(A.Z.Item,(0,E.Z)({label:"是否特定范围提报",name:"isAll"},ne),c.createElement(S.ZP.Group,{onChange:pe},c.createElement(S.ZP,{value:!1},"是"),c.createElement(S.ZP,{value:!0},"否"))),!X&&c.createElement(A.Z.Item,(0,E.Z)({label:"部门及岗位",name:"dep",rules:[{required:!0,message:"请选择"}]},ne),c.createElement(z,{multiple:!0,onChange:de})))):function(){var e=u.allow_accouting_list,t=void 0===e?[]:e,r="--";Array.isArray(t)&&t.length>0&&(r=t.map((function(e){return e.name})).join("，"));var a,l,i,m,p,g;return c.createElement(A.Z,{form:f,className:"affairs-flow-node-time-line-form"},c.createElement(A.Z.Item,(0,E.Z)({label:"标题"},ne),o().get(u,"name","--")),c.createElement(A.Z.Item,(0,E.Z)({label:"说明"},ne),o().get(u,"note","--")),c.createElement(A.Z.Item,(0,E.Z)({label:"icon"},ne),o().get(u,"icon",void 0)?c.createElement("img",{role:"presentation",src:n(22406)("./".concat(u.icon,"@1x.png"))}):"--"),c.createElement(A.Z.Item,(0,E.Z)({label:"请选择审批流"},ne),o().get(u,"flow_info.name","--")),c.createElement(A.Z.Item,(0,E.Z)({label:"启动选择科目"},ne),r),function(){var e=u.allow_code_list,t=void 0===e?[]:e,n=u.allow_team_list,r=void 0===n?[]:n;if(Number(d)===s.IGK.code){var a=t.includes("*")?"全部":t.map((function(e){return e.name})).join("，");return c.createElement(A.Z.Item,(0,E.Z)({label:"选择CODE"},ne),a)}if(Number(d)===s.IGK.team){var l=r.includes("*")?"全部":r.map((function(e){return e.name})).join("，");return c.createElement(A.Z.Item,(0,E.Z)({label:"选择TEAM"},ne),l)}}(),c.createElement(A.Z.Item,(0,E.Z)({label:"是否特定范围提报"},ne),o().get(u,"is_all")?"否":"是"),(a=u.is_all,l=u.allow_department_list,i=void 0===l?[]:l,m=u.allow_department_job_list,p=void 0===m?[]:m,g=Array.isArray(p)?p.map((function(e){return e.job_info})):[],a?"":c.createElement(A.Z.Item,(0,E.Z)({label:"部门及岗位"},ne),Array.isArray(i)&&Array.isArray(g)?[].concat((0,F.Z)(i),(0,F.Z)(g)).map((function(e){return e.name})).join("，"):"--")))}())})),ae=(0,p.connect)((function(e){return{matterLinkList:e.codeMatter.matterLinkList}}))((function(e){var t=e.matterLinkList,r=void 0===t?{}:t,a=e.dispatch,i=e.matterId,o=e.tabKey,s=(0,c.useState)(void 0),m=(0,l.Z)(s,2),d=m[0],p=m[1],f=(0,c.useState)(!1),A=(0,l.Z)(f,2),E=A[0],b=A[1],y=(0,c.useState)(!1),w=(0,l.Z)(y,2),I=w[0],C=w[1];(0,c.useEffect)((function(){return i&&a({type:"codeMatter/getMatterLinkList",payload:{matterId:i}}),function(){a({type:"codeMatter/resetMatterLinkList"})}}),[i]);var k,j,O,x=r.data,P=void 0===x?[]:x,S=function(){a({type:"codeMatter/getMatterLinkList",payload:{matterId:i}})},F=function(){var e=(0,Z.Z)(h().mark((function e(t){var n;return h().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a({type:"codeMatter/deleteMatterLink",payload:{id:t}});case 2:(n=e.sent)&&n._id?(v.ZP.success("请求成功"),S()):n.zh_message&&v.ZP.error(n.zh_message);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U={visible:E,onClose:function(e){e&&S(),b(!1)},dispatch:a,tabKey:o,matterId:i},B={linkId:d,visible:I,onClose:function(e){e&&S(),C(!1)},setUpdateLinkVis:C,dispatch:a,tabKey:o};return c.createElement(c.Fragment,null,(k=L.ZP.canOperateOperateCodeMatterLinkOp(),j=k?c.createElement(g.Z,{type:"primary",onClick:function(){return b(!0)}},"新增链接"):"",O=[{dataIndex:"name",render:function(e,t){var r=t.icon?c.createElement("img",{role:"presentation",style:{marginRight:5},src:n(22406)("./".concat(t.icon,"@1x.png"))}):"";return c.createElement("span",null,r,e)}},{dataIndex:"_id",key:"operate",render:function(e){var t=c.createElement("a",{onClick:function(){return p(e),void C(!0)}},"查看"),n=c.createElement(M.Z,{title:"您是否确定删除该链接",onConfirm:function(){return F(e)},okText:"确定",cancelText:"取消"},c.createElement("a",{className:"common-table-list-operate"},"删除"));return c.createElement(c.Fragment,null,k?c.createElement("span",null,t,n):"--")}}],c.createElement(u.IT,{title:"链接列表",titleExt:j},c.createElement(_.Z,{rowKey:function(e,t){return e._id||t},pagination:!1,columns:O,dataSource:P,showHeader:!1}))),E&&c.createElement(X,U),I&&c.createElement(re,B))})),le=function(e){var t={matterId:e.matterId,tabKey:e.tabKey};return c.createElement(c.Fragment,null,c.createElement(P,t),c.createElement(ae,t))},ie=function(){var e,t,n=(0,c.useState)([]),i=(0,l.Z)(n,2),m=i[0],d=i[1],p=(0,c.useState)(s.IGK.code),g=(0,l.Z)(p,2),A=g[0],E=g[1],v=[{title:s.IGK.description(s.IGK.code),key:s.IGK.code},{title:s.IGK.description(s.IGK.team),key:s.IGK.team}];return c.createElement(c.Fragment,null,c.createElement(u.DF,{items:v,onChange:function(e){return E(e)},defaultActiveKey:A}),(e={tabKey:A,onSelect:function(e){return d(e)},setMenuSelectedKey:d},t={matterId:o().get(m,"0",void 0),tabKey:A},c.createElement(r.Z,null,c.createElement(a.Z,{span:6},c.createElement(f,e)),c.createElement(a.Z,{span:18},c.createElement(le,t)))))}},22406:function(e,t,n){var r={"./001@1x.png":80581,"./002@1x.png":3947,"./003@1x.png":30352,"./004@1x.png":36957,"./005@1x.png":80598,"./006@1x.png":87503};function a(e){var t=l(e);return n(t)}function l(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}a.keys=function(){return Object.keys(r)},a.resolve=l,e.exports=a,a.id=22406},80581:function(e){"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAB60lEQVQ4T62VPWsUURSGn/dMvkgKo41NUFTSGLLELkgqCy0EQRtLK7GQREv1H0i6bWwUrQTBxp+QKBJFSIjRTquIWCgBIWbNzn1l12Ti7s5GMZny3Pc8c77uuaLksxEvxofp0zCqDwK9W7JN3LPOT68x9XZNwu3uajd4cWKY9TRC5v6ynxW2XDUGY1Wnltb+1LUAvVAZAR/eFdRxqC+aXF7dNhfA/4MVmALaBDbTrOUnukaWM4RcJ1TrqunPPjTSV7MBLytjpTWThX3BMA38kJjFMV8KbdT09PI7+fn4QXo53ilKo4bbQKW16J5HMYv1ucNnk4/yq8ox7EPFofMeQjM2l4GsPEVvyLqP4lHLufRNfn1yjJQN7IwDfUS6Y3Ee6BirLV3d8DiIagsw8o0GcIKU7UTSiFAxij3g4BampVkSiyTdJTyAY6UNmHcB6iZmCHwP6Rxw1VCTXSW8hGMGeA/xsAzYmjL1XpRNkNJ3Iq5jz5GYI5QgXUJqRF8FjUAsdKbc3pRIkXKuhXyUUBV7EscZ7IxMT0j+ZDMtMQ/xtLMp3cZGPgLcSPZKoGfNBtlXEAdAjQi/lo/NboPd9MjPIl387ewHOHuz62D/09VL7kcpR1n9r1dvW7Cvy2Fv0C7rq4Du54ItoHt4An4B5ML9wwrpqS8AAAAASUVORK5CYII="},3947:function(e){"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABbElEQVQ4T7WVP0vDYBDG797k1bYUrC4uXdSxi4O7gyBoKDg4+iUcRHRwcLBoQb+Eo4NLEAQHd1dHnbp0kYghTU1yJ4lG8z+0xIz3Pvd789xdLgiZD6PWe28JFVqgKA3PRenLFJUd8DyLXDD0ozkDADmZjsnAzhW3HNdsA4rZ7Mt+okxjqTYHt/toRHUx4Na51RYKLxaCEofk4fDusDEIw7/AaWAhJAoNgIFNz1qZ5M2SWqk0Xnz7CMCo9c1Oac3KbmMa6wfNZ9R6xjxIuZzUCyQdAMJ6DomFVlNR3V2vnfram0f7xHbZjeU5zit2+8YSoVzIAD5FY8RibW+jflafwU0/Pvrk++uH0XFUI9h5w+7lR4dI1CoBCrJx+8JcRYFKFZaZ2MsFlvUg6zwAFlhONSWrUbEa+pYnaYpASjUq1ZSCsUkllwHBH5u8wc6yV2g5HOx/+PS+q1DpcggLOw00d32F0EoX7N8ITP8L+AKSgPlvcIIK/gAAAABJRU5ErkJggg=="},30352:function(e){"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAB6klEQVQ4T62VPWsUURSGn/fMRiWgrB+YJk20TGNhFbQIWgQb0UYLCdrZ+APSDYrE1spKMIUIFoqkUAuJkqiNrWWs0kggbKFBk51zZHYz7s7ObMCY28055z73fLz3jqhbgViZb+LtJkmMomSkExbZNpk2sUaLc3MtRAxuV4W3lDY5wDhuB2sPK4zmv9lijem01R9XBi6l4zRsbFfQoLPt35lO1wpzD7gXWEHpg3aBeZkNO/1PmVUzXc3Lz9sqPqWTtT0zzNq6hHSL6AzgsYe/JcErh+c9nUq/iuX5o7B9ajDAwi5EcFsw0e+LYFWJHjnZ+2pFI9/Eh3sTWBwrOV1jBgugE0PasO7WngVbH9i3IVbuThIc6ndY6JpLy+ZcBGaBZtcfLdATt3hnofMuf14Cil/i4/0zeJaUgG5fEJt4PPWEFwYzhMLJ3lgkVxE3CEbd/GwJaEk2HNgT1gbhc0oSjyweAMcLVz2wruQ8w74V8DL/FFzpt1eAnZJrhmJun4Hu/c07B692gJf/AsWWy6eqQ6mRjbnyTO6AjgwBtrB46MRiWQW5bIYKW4fNdRO4HorXnQxDMyieObGA+FEeSCHs3Lrb1VOcxJPRzmbFT4iy9gpq23euXmHY18fhf6BDn68edB8f2J5O9vwL+ANvEOhrXRTIJAAAAABJRU5ErkJggg=="},36957:function(e){"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAB5ElEQVQ4T7WVO2gUURSGv/uY2QcKq4Uv0qhYpVGwtlEsUhmwMKiVhYU2QtTFQlarIMFKAhZWGiIhEKsUopWtYGUlWgVUEF1Qdnce9x6ZrBM3w0zAJU55z3++87x3FKWfqMU2rSClpQ1NbwgymXYk3tFLLN2Lc3RBSdFdFQ9WO9KKfjGhLbXyYMNTnxLVdrE+3VHdUd0W4LNbMhFq9m8HKtpiz9dLD9R6fr4JHAeWQ0ahG8CszGTA0X/JrKgN6nzMylcg6vksk1U9SweccJ57gBhNx9Z5VxY46+mFed6rxbbsCeBIVXZxj8dGs4DGu5TrYZOrVdoEPqnlWTmMZW+VKOpzX8M3AS+wr9bgbmVrUr6rldsy6RX1yqgRp7zjYWY3lhs25E2VVgsDtXxHjuMxZSKXsjuNWQIO/LF/sSEzxvKzFKpx2wLjHnMCZwqL+yps0q4ElpXsYw4mjisI50odFS8CwxMd8nnUPiy5ZChRn6dasyqOkwJnCxm+VIa33jNda3B5S8BsKGVrE/VZMwEz4jjtHeeV4kPmKMIxbVhRhtcuYanWYGoUuLE2ZYudxExJyjXgh7XczEtLUw65mHkULa14FNRZy4Gbi/0frt4wxo4+Dnna40Arn68cuqMP7N+Jjf8L+A0XP+Irsf3f7gAAAABJRU5ErkJggg=="},80598:function(e){"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABeklEQVQ4T62VPU4CQRTH/29WxKwN2pgghWCDEggmfsV4BjsvYGy8BAUn8ADGA9h5BonfiQRjpBEbAtHCbONGxJlndiOr7sySKDvl+/jN+5o3BMNhBqFWTGGcUqAPG0Diy6wPHnPxzg42bx0icNidwgK+KafgqgwsTpouC2SSerBFm5bqzk+7X0A+L2UAnhkK0pT0ROuN9kAcAP8HCzAB1Af6afbk/N8iC1knrQcvffIbcFoqRNZs4fAAll323aVbx/3OrvFir6YbjTvik+IUEsjpRvKYQbPIVkGTeV/Nr03gsQICOoDY0nz6aBFflLJgnta6DXU9rAQEsaz3h16ILxcLUNaE7qzO+Hv+wmpJEGuaj5BvHrAMZVm6klchVcYYJYlngGoGoIwGktoGU9oM5C5YHEUBjSkz1BXg1d94mCBWzCnH3pTIsVH7AOY4V02TnRf+2LhNRa1KhxldIrFnHpu4Bzv2pzcIO9blMBo0Yn0F0DgXbAAd4Qv4BECjxcOpQv2dAAAAAElFTkSuQmCC"},87503:function(e){"use strict";e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACF0lEQVQ4T62VPWhTURTH/+fed9MkpDSxokUDtSqIxiGrk5ugoeCmIBTcdClUEHEQEYeihRa66CYIgm4uRXBzcu1gFcGvQlQq1rySkJfkvnuPvKRP8+JLwJA7no/f+XznEWIfU2lxJyscZCFl2vikAjPpsIYxdevDXbs54QLEve7UKzi/wlnt1/IgMRYfbFfKtqmcTPn5ArnddhHg2Xv1vJC8fyCoR2kNbb24kS6H4j/AYWAhpBvaBrbLNPUj/5NZr62S6Y9B+QQwlZZqhbieFWZU8WBO3AJBtgEM87Vi72581uv/BGfbXLue2aDSopuDUofjsjt1InExk+ILlSo9DPS5cb5S8+jZ67etp7HVaP2JZpfcGUtqT7eBTcgDJOlOwsFeR7DjtdAI9KkEkr4lv+XjJxu+LVrmW7efYP2LZperBWtFMhJxTF2C5IWBPTW0gqZ+EgEK26Bz92tFEtTp0e6jpJpjwfNT48DUBGG93NnfYp7wfYexVQXI0io39ONuP7ZsBgKP7SNMTxJevrNtvzPHBTa3Ge9/cH9gXMlhhocmCdM5wqsPHeDpowKbFcaX7XigCEqOGwol5RwLmh/UQ7a8Sg0TKbk9lNi1UeokFD8IBtsH6kHTVWj9JqIP1qbfYjOTg7S8RkCdPfsocKSUuMyMNDyzTMR+BBYudiAc8afXiTPS4xCmPgy07/kKoSM9sH+bPPwv4DfzKSB+Li8/kAAAAABJRU5ErkJggg=="}}]);