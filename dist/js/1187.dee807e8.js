"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[1187],{22263:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(1413),a=n(67294),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"}}]},name:"star",theme:"outlined"},i=n(30076),l=function(e,t){return a.createElement(i.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};l.displayName="StarOutlined";var c=a.forwardRef(l)},91187:function(e,t,n){n.r(t),n.d(t,{default:function(){return J}});n(438);var r=n(14277),a=n(94315),o=n.n(a),i=n(67294),l=n(96036),c=n(93517),s=n.n(c),u=n(55609),d=n(97418),m=n(86221),p=(0,u.connect)((function(e){return{viewRange:e.oaCommon.viewRange,departments:e.applicationCommon.departments}}))((function(e){var t=e.dispatch,n=e.isShowCode,a=e.viewRange,c=void 0===a?[]:a,u=e.departments,p="oa-modal-department";function f(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e.map((function(e){var t=e.key,r=e.title,a=e.icon,o=e.hoverIcon;if(c.includes(t))return i.createElement(m.ux,{isShowCode:n,key:t,type:t,title:r,icon:a,hoverIcon:o})}))}return(0,i.useEffect)((function(){return t({type:"oaCommon/getViewRange"}),(o().empty(s().get(u,p))||o().not.existy(s().get(u,p)))&&t({type:"applicationCommon/fetchDepartments",payload:{namespace:p,isAuthorized:!0}}),function(){t({type:"oaCommon/resetViewRange"}),t({type:"applicationCommon/resetDepartments",payload:{namespace:p}})}}),[t]),c.length<1?i.createElement("div",{style:{height:500,display:"flex",alignItems:"center",justifyContent:"center"}},i.createElement(r.Z,{image:r.Z.PRESENTED_IMAGE_SIMPLE})):function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e.map((function(e){var t=e.title,n=void 0===t?"":t,r=e.routes,a=void 0===r?[]:r;return i.createElement(l.IT,{title:n,key:"page-".concat(n)},i.createElement("div",{style:{overflow:"hidden"}},f(a)))}))}(d.sC)})),f=n(29439),y=(n(9523),n(51752)),v=n(98244),_=n(80385),E=(n(52466),n(10642)),g=n(87462),h=(n(35668),n(86585)),C=(n(29093),n(16317)),b=C.Z.Option,k=function(e){var t=e.value,n=e.onChange,r=e.departmentList,a=void 0===r?[]:r;return i.createElement(C.Z,{value:t,onChange:function(e,t){var r=t.name;n&&n(e,r)},placeholder:"请选择"},a.map((function(e){return i.createElement(b,{value:e._id,name:e.name,key:e._id},e.name)})))},w=C.Z.Option,I=function(e){var t=e.onChange,n=e.departmentId,r=e.postList,a=void 0===r?[]:r,o=e.value,l=a.filter((function(e){return e.department_info._id===n}));return i.createElement(C.Z,{onChange:function(e,n){var r=n.name;t&&t(e,r)},placeholder:"请选择",value:o},l.map((function(e){return i.createElement(w,{value:e._id,key:e._id,name:e.job_info.name},e.job_info.name)})))};var Z=(0,u.connect)((function(e){return{accountDep:e.oaCommon.accountDep}}))((function(e){var t=e.values,n=void 0===t?{}:t,r=e.dispatch,a=e.accountDep,c=e.staffProfileId,u=void 0===c?void 0:c,d=e.relationInfoId,m=void 0===d?void 0:d,p=e.relationInfoName,y=void 0===p?void 0:p,v=e.majorDepartmentId,_=void 0===v?void 0:v,C=e.majorDepartmentName,b=void 0===C?void 0:C,w=h.Z.useForm(),Z=(0,f.Z)(w,1)[0],x=(0,i.useState)({}),N=(0,f.Z)(x,2),D=N[0],O=N[1],S=(0,i.useState)({}),j=(0,f.Z)(S,2),P=j[0],M=j[1],L=s().get(a,"departmentList",[]),R=s().get(a,"postList",[]);(0,i.useEffect)((function(){r({type:"oaCommon/getEmployeeDepAndPostInfo",payload:{accountId:u}})}),[r,u]);var F=function(){e.onCancel&&e.onCancel(),Z.resetFields()},T=function(){Z.validateFields().then((function(){var t=s().get(n,"departments",{_id:_,name:b}),r=o().existy(D)&&o().not.empty(D)?D:t;e.onOk&&e.onOk({departments:r,posts:o().not.empty(P)?P:{_id:m,name:y}})}))},z=function(e,t){O({_id:e,name:t}),Z.setFieldsValue({postId:void 0})},q=function(e,t){M({_id:e,name:t})};return function(){if(!0!==e.visible)return null;var t,r={departmentId:s().get(n,"departments._id",_),postId:s().get(n,"posts._id",m)};return i.createElement(E.Z,{title:"切换副岗提报",visible:e.visible,width:"650px",onOk:T,onCancel:F},i.createElement(h.Z,(0,g.Z)({form:Z,initialValues:r},{labelCol:{span:8},wrapperCol:{span:16}}),(t=[i.createElement(h.Z.Item,{name:"departmentId",label:"部门",labelCol:{span:4},wrapperCol:{span:18},rules:[{required:!0,message:"请选择部门"}]},i.createElement(k,{onChange:z,departmentList:L})),i.createElement(h.Z.Item,{noStyle:!0,key:"岗位",shouldUpdate:function(e,t){return e.departmentId!==t.departmentId}},(function(){return i.createElement(h.Z.Item,{name:"postId",label:"岗位",labelCol:{span:4},wrapperCol:{span:18},rules:[{required:!0,message:"请选择岗位"}]},i.createElement(I,{onChange:q,departmentId:Z.getFieldValue("departmentId"),postList:R}))}))],i.createElement(l.Fp,{items:t,cols:1}))))}()})),x=(n(62004),n(11382)),N=n(93433),D=(n(51838),n(48086)),O=n(15861),S=n(87757),j=n.n(S),P=n(30381),M=n.n(P),L=n(29506),R=n(97116),F=(n(18085),n(55241)),T=(n(55295),n(69713)),z=n(22263),q={"app-tree":"ia6dSR6ASNLG3kppHjlI","app-tree-treenode-row":"lf5PRzvT9ks9VCUsF4eo","app-tree-treenode-row-icon":"s6GQZRPeyp_g6N5tImmC","app-tree-treenode-row-name":"boKhqxEag5MxcGYkjI1w","app-tree-node-flow-box":"H1UwIdbWKn_4r4AKOwcL","app-tree-node-flow":"W17YpQz3sk5UKINv0S60","app-tree-node-flow-title":"ZqboYlx8wkRyCXVOPymr","app-comp-oa-card":"tD0RtUhdAF5zD4rTG9YO","app-comp-code-link-collect-tooltip-icon":"hzHiTLRqebp7qin8UGhJ","app-comp-code-link-collect-tooltip-content":"ihHF4huqIe2UA60rBGk3","app-comp-code-link-collect-wrap":"vfsoasfBwlvPKVpjd_9I"},A=function(e){var t=e.detail,r=void 0===t?{}:t,a=e.onClickFow,o=e.onCollect,l=(0,i.useState)(!1),c=(0,f.Z)(l,2),s=c[0],u=c[1],d=(0,i.useState)(!1),m=(0,f.Z)(d,2),p=m[0],y=m[1],v=function(){var e=i.createElement("span",null,i.createElement(z.Z,{className:q["app-comp-code-link-collect-tooltip-icon"],styles:{color:"#FF7700"}}),i.createElement("span",{className:q["app-comp-code-link-collect-tooltip-content"]},"点击收藏"));return s?i.createElement(T.Z,{title:e,visible:p},i.createElement("span",{className:q["app-comp-code-link-collect-wrap"]},i.createElement(z.Z,{onClick:function(){return o(r._id)},onMouseOver:function(){return y(!0)},onMouseOut:function(){return y(!1)}}))):i.createElement("span",{className:q["app-comp-code-link-collect-wrap"]},i.createElement(z.Z,{style:{opacity:0}}))};return r.note?i.createElement("div",{className:q["app-tree-node-flow"],key:r._id,onMouseOver:function(){return u(!0)},onMouseOut:function(){return u(!1)}},i.createElement(F.Z,{overlayStyle:{zIndex:99999},content:i.createElement("div",{style:{display:"flex",maxWidth:500}},i.createElement("img",{style:{width:12,height:12,marginRight:3},src:n(67554),alt:""}),i.createElement("span",null,r.note)),trigger:"hover",key:r._id},i.createElement("div",{onClick:function(){return a(r._id)}},r.icon?i.createElement("img",{src:n(54586)("./".concat(r.icon,".png")),alt:""}):null,i.createElement("span",{className:q["app-tree-node-flow-title"]},r.name))),v()):i.createElement("div",{key:r._id,className:q["app-tree-node-flow"]},i.createElement("div",{onClick:function(){return a(r._id)}},r.icon?i.createElement("img",{src:n(54586)("./".concat(r.icon,".png")),alt:""}):null,i.createElement("span",{className:q["app-tree-node-flow-title"]},r.name)),v())},G=n(4046);var B=(0,u.connect)((function(e){return{treeData:e.codeDocument.treeData}}))((function(e){var t=e.dispatch,n=e.isSelf,a=e.majorDepartmentId,l=e.relationInfoId,c=e.activeKey,u=e.departmentId,d=e.postId,m=e.treeData,p=(0,i.useState)(!1),y=(0,f.Z)(p,2),v=y[0],E=y[1],g=(0,i.useState)(!1),h=(0,f.Z)(g,2),C=h[0],b=h[1],k=(0,i.useState)(void 0),w=(0,f.Z)(k,2),I=w[0],Z=w[1],S=(0,i.useState)(void 0),P=(0,f.Z)(S,2),F=P[0],T=P[1],z=(0,i.useState)([]),B=(0,f.Z)(z,2),K=B[0],U=B[1];(0,i.useEffect)((function(){if(!0===n&&a&&l)return E(!0),t({type:"codeDocument/fetchTreeData",payload:{isSelf:n,type:c,departmentId:a,departmentJobId:l,onSucessCallback:function(){E(!1)},onErrorCallback:function(){E(!1)}}}),function(){return t({type:"codeDocument/resetTreeData"})};!0!==n&&o().existy(u)&&o().not.empty(u)&&o().existy(d)&&o().not.empty(d)&&(E(!0),t({type:"codeDocument/fetchTreeData",payload:{isSelf:n,type:c,departmentId:u,departmentJobId:d,onSucessCallback:function(){E(!1)},onErrorCallback:function(){E(!1)}}}));return function(){E(!1),t({type:"codeDocument/reduceTreeData",payload:{}})}}),[t,n,a,l,c,u,d]);var V,J=function(e){window.location.href="/#/Code/PayOrder/Update?orderId=".concat(e)},W=function(){var e=(0,O.Z)(j().mark((function e(n){var r;return j().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return T(n),e.next=3,t({type:"codeOrder/getDraftOrder",payload:{linkId:n}});case 3:(r=e.sent).id&&r.message?(a=void 0,o=void 0,i=void 0,l=void 0,c=void 0,a=R.Iq.prompt,o=a.value,i=a.date,l=a.employee_id,c=R.Iq.account.id,!(R.Iq.prompt&&o&&i&&l&&c===l)||1===o&&M()(new Date).diff(M()(i),"days")>=1||2===o&&M()(new Date).diff(M()(i),"days")>=7?(Z(r.id),b(!0)):J(r.id)):r.id&&!r.message?J(r.id):r.zh_message?r.zh_message&&D.ZP.error(r.zh_message):H(n);case 5:case"end":return e.stop()}var a,o,i,l,c}),e)})));return function(t){return e.apply(this,arguments)}}(),H=function(e){t({type:"codeOrder/createOrder",payload:{sceneLinkId:e,departmentId:u||a,departmentJobId:d||l,onSucessCallback:function(e){return t=e._id,void(window.location.href="/#/Code/PayOrder/Create?orderId=".concat(t));var t}}})},Y=function(){var e=(0,O.Z)(j().mark((function e(n){var r;return j().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t({type:"codeMatter/markCollectLink",payload:{linkId:n,state:_.Pm2.ok}});case 2:(r=e.sent)&&r._id&&(D.ZP.success("收藏成功"),!K.includes(r._id)&&U([].concat((0,N.Z)(K),[r._id])));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),$=function(e){return o().existy(e.scene_link_list)&&o().not.empty(e.scene_link_list)?i.createElement("div",{className:q["app-tree-node-flow-box"]},e.scene_link_list.map((function(e){return i.createElement(A,{key:e._id,detail:e,onClickFow:function(){return r=e._id,n||t({type:"codeOrder/onSubmitBuriedPoint",payload:{linkId:r,action:30}}),void W(r);var r},onCollect:Y})}))):i.createElement("div",{style:{height:20}})},Q=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return!o().not.existy(t)&&!o().empty(t)&&t.some((function(t){return!(!o().existy(t.scene_link_list)||!o().not.empty(t.scene_link_list))||(o().existy(t.child_scene_list)&&o().not.empty(t.child_scene_list)?e(t.child_scene_list):void 0)}))},X=function e(t){if(!(o().empty(t)||o().not.existy(t)||o().not.array(t)))return t.map((function(t){var n=$(t);if(!0===Q([t]))return i.createElement("div",{className:q["app-tree-treenode"],key:t._id,style:{marginLeft:20}},i.createElement("div",{className:q["app-tree-treenode-row"]},i.createElement("div",{className:q["app-tree-treenode-row-name"]},t.name)),n,e(t.child_scene_list))}))},ee=s().get(m,"data",[]),te=Q(ee);return o().not.existy(ee)||o().empty(ee)||!0!==te?i.createElement("div",{style:{background:"#fff",height:500,display:"flex",alignItems:"center",justifyContent:"center"}},v?i.createElement(x.Z,null):i.createElement("div",{style:{width:"100%",display:"flex",flexDirection:"column"}},i.createElement(r.Z,{image:r.Z.PRESENTED_IMAGE_SIMPLE}))):i.createElement("div",{style:{background:"#fff",marginTop:10}},i.createElement(L.ZP,{columnsCount:2},(V=ee,o().empty(V)||o().not.existy(V)||o().not.array(V)?[]:V.map((function(e){var t=$(e);if(Q([e]))return i.createElement(i.Fragment,{key:e._id},i.createElement("div",{span:12,key:e._id,className:q["app-tree"]},i.createElement("div",{className:q["app-tree-treenode"],key:e._id},i.createElement("div",{className:q["app-tree-treenode-row"],style:{marginTop:10}},i.createElement("div",{className:q["app-tree-treenode-row-icon"]}),i.createElement("div",{className:q["app-tree-treenode-row-name"]},e.name)),t,X(e.child_scene_list))))})).filter((function(e){return void 0!==e})))),i.createElement(G.Z,{visible:C,setVisble:b,onCreateOrder:function(){return H(F)},onUpdateOrder:function(){return J(I)}}))})),K=n(45430),U=y.Z.TabPane,V=(0,u.connect)((function(e){return{accountDetail:e.accountManage.accountDetail}}))((function(e){var t=R.Iq.account.id,n=e.dispatch,a=e.accountDetail,l=void 0===a?{}:a,c=e.jumpKey,u=s().get(l,"employee_info",{}),d=s().get(u,"department_job_relation_info._id",void 0),m=s().get(u,"department_job_relation_info.job_info.name",void 0),p=s().get(u,"major_department_info._id",void 0),E=s().get(u,"major_department_info.name",void 0),g=c||((0,K.Rs)()?"".concat(_.G$J.team):(0,K.mO)()?"".concat(_.G$J.code):void 0),h=(0,i.useState)(g),C=(0,f.Z)(h,2),b=C[0],k=C[1],w=(0,i.useState)(!0),I=(0,f.Z)(w,2),x=I[0],N=I[1],D=(0,i.useState)(!1),O=(0,f.Z)(D,2),S=O[0],j=O[1],P=(0,i.useState)({}),M=(0,f.Z)(P,2),L=M[0],F=M[1];(0,i.useEffect)((function(){return n({type:"accountManage/fetchAccountsDetails",payload:{id:t}}),function(){n({type:"accountManage/resetAccountsDetails"})}}),[n,t]),(0,i.useEffect)((function(){F({departments:{_id:s().get(l,"employee_info.major_department_info._id"),name:s().get(l,"employee_info.major_department_info.name")},posts:{_id:s().get(l,"employee_info.department_job_relation_info._id"),name:s().get(l,"employee_info.department_job_relation_info.job_info.name")}})}),[l]);var T,z,q=function(){j(!0)},A=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};N(!1),F({departments:s().get(e,"departments",{}),posts:s().get(e,"posts",{})}),G()},G=function(){j(!1)},V=function(e){k(e)},J=function(){var e=i.createElement("a",{style:{color:"#FF7700",marginLeft:5},onClick:q},"点此切岗 ",i.createElement(v.Z,null));if(o().not.existy(u)||o().empty(u))return i.createElement("div",null,"您无提报权限，请联系系统管理员配置对应权限");var t=s().get(L,"departments",{}),n=s().get(L,"posts",{});return o().existy(t)&&o().not.empty(t)&&o().existy(n)&&o().not.empty(n)?i.createElement(i.Fragment,null,i.createElement("div",{style:{display:"flex",alignItems:"center"}},i.createElement("span",null,"部门：",t.name),i.createElement("span",{style:{margin:"0 10px"}},"岗位：",n.name),e),i.createElement(Z,{visible:S,onCancel:G,onOk:A,staffProfileId:l.staff_profile_id,values:{departments:t,posts:n},relationInfoId:d,relationInfoName:m,majorDepartmentId:p,majorDepartmentName:E})):void 0};return i.createElement("div",null,!1===(0,K.mO)()&&!1===(0,K.Rs)()?i.createElement(r.Z,{description:"你没有权限操作此模块请联系管理员"}):i.createElement("div",null,i.createElement(y.Z,{activeKey:b,type:"card",size:"small",tabBarStyle:{margin:"0"},onChange:V,tabBarExtraContent:J()},(0,K.Rs)()?i.createElement(U,{tab:"TEAM相关",key:"".concat(_.G$J.team)}):null,(0,K.mO)()?i.createElement(U,{tab:"CODE相关",key:"".concat(_.G$J.code)}):null)),(T=s().get(L,"departments",{}),z=s().get(L,"posts",{}),!1===(0,K.mO)()&&!1===(0,K.Rs)()?null:i.createElement(B,{isSelf:x,departmentId:T._id,relationInfoId:d,postId:z._id,activeKey:b,majorDepartmentId:p})))})),J=function(e){var t,n=e.location.query.jumpKey;return i.createElement("div",null,(t=[],(0,K.Br)()&&t.push({title:"费控申请",content:i.createElement(V,{jumpKey:n&&"undefined"!==n?n:void 0}),key:"费控申请"}),(0,K._S)()&&t.push({title:"事务申请",content:i.createElement(p,{isShowCode:!0}),key:"事务申请"}),o().not.existy(t)||o().empty(t)?i.createElement(r.Z,{description:"你没有权限操作此页面请找管理员添加权限"}):i.createElement(l.DF,{items:t,size:"large"})))}},53029:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;o(n(45697));var r=o(n(67294)),a="/Users/cedric/Code/react-responsive-masonry/src/Masonry/index.js";function o(e){return e&&e.__esModule?e:{default:e}}function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i.apply(this,arguments)}var l=function(e){var t,n;function o(){return e.apply(this,arguments)||this}n=e,(t=o).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var l=o.prototype;return l.getColumns=function(){var e=this.props,t=e.children,n=e.columnsCount,a=Array.from({length:n},(function(){return[]}));return r.default.Children.forEach(t,(function(e,t){e&&r.default.isValidElement(e)&&a[t%n].push(e)})),a},l.renderColumn=function(e){var t=this,n=this.props.gutter;return e.map((function(e,o){return r.default.createElement("div",{key:o,style:{marginTop:o>0?n:void 0},__self:t,__source:{fileName:a,lineNumber:21,columnNumber:7}},e)}))},l.renderColumns=function(){var e=this,t=this.props.gutter;return this.getColumns().map((function(n,o){return r.default.createElement("div",{key:o,style:{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignContent:"stretch",flex:1,width:0,marginLeft:o>0?t:void 0},__self:e,__source:{fileName:a,lineNumber:30,columnNumber:7}},e.renderColumn(n))}))},l.render=function(){var e=this.props,t=e.className,n=e.style;return r.default.createElement("div",{style:i({display:"flex",flexDirection:"row",justifyContent:"center",alignContent:"stretch",boxSizing:"border-box",width:"100%"},n),className:t,__self:this,__source:{fileName:a,lineNumber:50,columnNumber:7}},this.renderColumns())},o}(r.default.Component);l.propTypes={},l.defaultProps={columnsCount:3,gutter:"0",className:null,style:{}};var c=l;t.default=c},67541:function(e,t,n){function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;(a=n(45697))&&a.__esModule;var a,o=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==r(e)&&"function"!=typeof e)return{default:e};var t=i();if(t&&t.has(e))return t.get(e);var n={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var l=a?Object.getOwnPropertyDescriptor(e,o):null;l&&(l.get||l.set)?Object.defineProperty(n,o,l):n[o]=e[o]}n.default=e,t&&t.set(e,n);return n}(n(67294));function i(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return i=function(){return e},e}var l=function(){return"undefined"==typeof window?null:window.innerWidth},c=function(e){var t,n,r,a,i,c=e.columnsCountBreakPoints,s=e.children,u=e.className,d=e.style,m=(t=(0,o.useState)(l()),n=t[0],r=t[1],a="undefined"!=typeof window,i=(0,o.useCallback)((function(){r(l())}),[]),(0,o.useEffect)((function(){if(a)return window.addEventListener("resize",i),function(){return window.removeEventListener("resize",i)}}),[a,i]),n),p=(0,o.useMemo)((function(){var e=Object.keys(c).sort((function(e,t){return e-t})),t=e.length>0?c[e[0]]:1;return e.forEach((function(e){e<m&&(t=c[e])})),t}),[m,c]);return o.default.createElement("div",{className:u,style:d,__self:undefined,__source:{fileName:"/Users/cedric/Code/react-responsive-masonry/src/ResponsiveMasonry/index.js",lineNumber:56,columnNumber:5}},o.default.Children.map(s,(function(e,t){return o.default.cloneElement(e,{key:t,columnsCount:p})})))};c.propTypes={},c.defaultProps={columnsCountBreakPoints:{350:1,750:2,900:3},className:null,style:null};var s=c;t.default=s},29506:function(e,t,n){t.ZP=void 0;var r=o(n(53029)),a=o(n(67541));function o(e){return e&&e.__esModule?e:{default:e}}var i=r.default;t.ZP=i}}]);