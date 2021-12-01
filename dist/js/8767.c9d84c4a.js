"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[8767],{34724:function(e,t,n){n.d(t,{Z:function(){return m}});var a=n(67294),o=n(96036),r=n(80385),p=(n(52560),n(71577)),s=(n(29093),n(16317)),i=n(55609),c=n(66939),l=(n(98703),n(38108)),d=(0,i.connect)()(c.Z.create()((function(e){var t,n=e.themeTags,r=void 0===n?void 0:n,i=e.canEditTags,c=void 0===i||i,d=e.orderId,m=e.form,u=e.dispatch,f=m.getFieldDecorator,x=m.validateFields,v=m.getFieldsValue,h=function(){x((function(e,t){if(!e){var n=t.tags;u({type:"expenseExamineOrder/fetchCostApprovalThemeTag",payload:{params:{themeTags:n,orderId:d}}})}}))},g=function(e){var t=v(["tags"]),n=e,a=n.length;if(a>t.length){var o=n[a-1].replace(/\s+/g,"");if(""===o)return;n[a-1]=o}return n};return t=[{label:"主题标签",form:f("tags",{initialValue:r,rules:[{required:!0,message:"请填写内容"}]})(a.createElement(s.Z,{mode:"tags",notFoundContent:"",onChange:g,tokenSeparators:[",","，"],className:l.Z["app-comp-expense-detail-tag-select"],disabled:!c}))}],a.createElement("div",{className:l.Z["app-comp-expense-detail-tag-wrap"]},a.createElement(o.KP,{cols:1,layout:{labelCol:{span:2},wrapperCol:{span:22}},items:t,className:l.Z["app-comp-expense-detail-tag-core"]}),a.createElement(p.Z,{disabled:!c,type:"primary",onClick:h,className:l.Z["app-comp-expense-detail-tag-save"]},"保存"))}))),m=function(e){var t,n,p,s,i,c,l,m,u,f,x,v=e.detail,h=void 0===v?{}:v;return a.createElement("div",null,(t=h.id,n=h.applyAccountInfo,p=(n=void 0===n?{accountName:""}:n).name,s=h.totalMoney,i=h.flowInfo,c=(i=void 0===i?{flowName:""}:i).name,l=h.applicationOrderType,m=h.paidState,u=h.paidNote,f=h.themeLabelList,x=[{label:"审批单号",form:t},{label:"申请人",form:p},{label:"总金额",form:r.fbc.exchangePriceCentToMathFormat(s)},{label:"审批流程",form:c},{label:"审批类型",form:"".concat(r.ZBL.description(l))},{label:"标记付款状态",form:"".concat(r.$ym.description(m))},{label:"付款异常说明",form:u}],a.createElement(o.IT,null,a.createElement(o.KP,{items:x,layout:{labelCol:{span:8},wrapperCol:{span:16}},cols:3}),a.createElement(d,{themeTags:f,orderId:t}))))}},34089:function(e,t,n){var a=n(15671),o=n(43144),r=n(97326),p=n(60136),s=n(82963),i=n(61120),c=n(4942),l=(n(19597),n(27279)),d=n(67294),m=n(45697),u=n.n(m),f=n(96036),x=n(54971),v=n(38108);function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,i.Z)(e);if(t){var o=(0,i.Z)(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return(0,s.Z)(this,n)}}var g=l.Z.Panel,Z=function(e){(0,p.Z)(n,e);var t=h(n);function n(){var e;return(0,a.Z)(this,n),e=t.call(this),(0,c.Z)((0,r.Z)(e),"onChangeCollapse",(function(){var t=e.state.activeKey,n=e.props.originalCostOrder,a=[];t.length!==n.length&&n.forEach((function(e,t){a.push("".concat(t))})),e.setState({activeKey:a})})),(0,c.Z)((0,r.Z)(e),"onChangePanel",(function(t){e.setState({activeKey:t})})),(0,c.Z)((0,r.Z)(e),"renderExtra",(function(t,n){var a=e.props.extra;return a&&a(t,n)})),(0,c.Z)((0,r.Z)(e),"renderContent",(function(){var t=e.state.activeKey,n=e.props,a=n.location,o=n.examineOrderDetail,r=n.examineDetail,p=n.originalCostOrder,s=o.id,i=d.createElement("span",{onClick:e.onChangeCollapse,className:v.Z["app-comp-expense-detail-order-info-ext"]},t.length!==p.length?"全部展开":"全部收起");return d.createElement(f.IT,{key:"salaryRules",title:"费用单",titleExt:i},d.createElement(l.Z,{bordered:!1,activeKey:t,onChange:e.onChangePanel},p.map((function(t,n){var p="费用单号: ".concat(t.id);return d.createElement(g,{header:p,key:"".concat(n),extra:e.renderExtra(s,t.id)},d.createElement(x.Z,{location:a,examineOrderDetail:o,examineDetail:r,costOrderDetail:t}))}))))})),e.state={activeKey:[]},e}return(0,o.Z)(n,[{key:"render",value:function(){return this.renderContent()}}]),n}(d.Component);(0,c.Z)(Z,"propTypes",{location:u().object,examineOrderDetail:u().object,examineDetail:u().object,originalCostOrder:u().array}),(0,c.Z)(Z,"defaultProps",{location:{},examineOrderDetail:{},examineDetail:{},originalCostOrder:[]}),t.Z=Z},19556:function(e,t,n){n(52560);var a=n(71577),o=(n(52466),n(10642)),r=(n(51838),n(48086)),p=n(15671),s=n(43144),i=n(97326),c=n(60136),l=n(82963),d=n(61120),m=n(4942),u=n(94315),f=n.n(u),x=n(93517),v=n.n(x),h=n(55609),g=n(67294),Z=n(45697),y=n.n(Z),b=n(66939),I=(n(98703),n(96036)),E=n(88081),w=n(80385),C=n(38108);function O(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function P(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?O(Object(n),!0).forEach((function(t){(0,m.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):O(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function S(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,d.Z)(e);if(t){var o=(0,d.Z)(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return(0,l.Z)(this,n)}}var D=function(e){(0,c.Z)(n,e);var t=S(n);function n(){var e;return(0,p.Z)(this,n),e=t.call(this),(0,m.Z)((0,i.Z)(e),"onHideModal",(function(){e.setState({visible:!1,isVerifyPost:!1,isDefault:!0})})),(0,m.Z)((0,i.Z)(e),"onChangePerson",(function(t,n){e.setState({isVerifyPost:t,isDefault:!1,isDisabledPerson:n})})),(0,m.Z)((0,i.Z)(e),"onSubmitSuccessCallback",(function(){var t=e.props.onSuccessCallback;t&&t()})),(0,m.Z)((0,i.Z)(e),"onSubmitFailureCallback",(function(t){return e.private.isSubmit=!0,r.ZP.error(t.zh_message)})),(0,m.Z)((0,i.Z)(e),"onVerify",(function(t,n,a){var o=e.props.examineOrderDetail,r=e.state.isVerifyPost,p=v().get(o,"flowInfo.nodeList",[]),s=v().get(p[0],"accountList",[]);1===v().get(p[0],"postList",[]).length&&0===s.length&&(r=!0),!0===t.isApprovalAll||!1===t.isApprovalAll&&t.isAutoMatic&&!1===r||!1===t.isApprovalAll&&!0===r&&n.postId&&n.personId||!1===t.isApprovalAll&&!1===t.isAutoMatic&&!1===r&&n.personId?a():a("请选择指派审批人或审批岗位")})),(0,m.Z)((0,i.Z)(e),"onPresent",(function(){var t,n=e.props.examineDetail.nodeList,a=void 0===n?[]:n;a&&a.length>0&&(t=a[0].approveMode),t===w.Fv8.all?e.onSubmit():e.setState({visible:!0})})),(0,m.Z)((0,i.Z)(e),"onSubmit",(function(){var t=e.props,n=t.form,a=t.orderId,o=t.dispatch,r=t.action;n.validateFields((function(t,n){if(!t){var p={action:r,id:a,onSuccessCallback:e.onSubmitSuccessCallback,onFailureCallback:e.onSubmitFailureCallback},s=n.assignedPerson,i=void 0===s?{}:s,c=i.postId,l=i.personId;l&&(p.person=l),c&&(p.postIds=c),e.private.isSubmit&&(o({type:"expenseExamineOrder/submitExamineOrder",payload:p}),e.private.isSubmit=!1)}}))})),(0,m.Z)((0,i.Z)(e),"fetchNodeByIndex",(function(t){var n=e.state.examineDetail;return!0!==f().number(t)?{}:v().get(n,"nodeList.".concat(t),{})})),(0,m.Z)((0,i.Z)(e),"isAutoMatic",(function(){var t=e.fetchNodeByIndex(0);return!0===v().has(t,"pickMode")&&v().get(t,"pickMode")===w.zn9.automatic})),(0,m.Z)((0,i.Z)(e),"renderModal",(function(){var t=e.props.form.getFieldDecorator,n=e.state,a=n.visible,r=n.isDefault,p=e.props.examineDetail;if(a&&0!==Object.keys(p).length){var s,i,c=[],l=[],d={},m=v().get(p,"nodeList");f().existy(m)&&f().array(m)&&f().not.empty(m)&&(d=m[0]||{},c=v().get(m[0],"accountList",[]),l=v().get(m[0],"postList",[]),i=v().get(m[0],"pickMode"),s=m[0].approveMode);var u={message:"请选择审批人或审批岗位",isApprovalAll:!1,isAutoMatic:!1,required:!1};s===w.Fv8.all&&(u.isApprovalAll=!0),i===w.zn9.automatic&&(u.isAutoMatic=!0),u.isApprovalAll||u.isAutoMatic||(u.required=!0);var x,h,Z,y,O=c.concat(l),S=!1,D=!1;0===l.length&&1===O.length&&s===w.Fv8.any&&(h=O[0].id,y=O[0].id,S=!0),1===l.length&&1===O.length&&s===w.Fv8.any&&(x=l[0]._id,y=l[0]._id,S=!0),1===l.length&&1===O.length&&1===l[0].account_ids.length&&s===w.Fv8.any&&(h=l[0].account_ids[0],x=l[0]._id,Z=l[0].account_ids[0],y=l[0]._id,S=!0,D=!0);var k={nextNodeDetail:d,accountIdsData:O,postPersonList:l,onChangePerson:e.onChangePerson,isDisabledPost:S,isDisabledPerson:r?D:e.state.isDisabledPerson,postList:l,personList:c},A=[{label:"下一节点审批人",form:t("assignedPerson",{initialValue:{personId:h,postId:x,postPersonId:Z,personShowId:y},rules:[P(P({},u),{},{validator:e.onVerify})],validateTrigger:e.onSubmit})(g.createElement(E.Z,k))}];return g.createElement(o.Z,{title:"审批意见",visible:a,onOk:e.onSubmit,onCancel:e.onHideModal},g.createElement("div",{className:C.Z["app-comp-expense-form-modal-next-approval-wrap"]},g.createElement("p",{className:C.Z["app-comp-expense-form-modal-next-approval"]},"请指派下一个节点的审批人")),g.createElement(b.Z,null,g.createElement(I.KP,{items:A,cols:1,layout:{labelCol:{span:8},wrapperCol:{span:16}}})))}})),(0,m.Z)((0,i.Z)(e),"renderContent",(function(){return g.createElement("div",{className:C.Z["app-comp-expense-manage-form-submit"]},g.createElement(a.Z,{type:"primary",onClick:e.onPresent},"提交"),e.renderModal())})),e.state={visible:!1,isDefault:!0,isVerifyPost:!1,isDisabledPerson:!1},e.private={isSubmit:!0},e}return(0,s.Z)(n,[{key:"render",value:function(){return this.renderContent()}}]),n}(g.Component);(0,m.Z)(D,"propTypes",{orderId:y().string,examineDetail:y().object,examineOrderDetail:y().object,action:y().number,onSuccessCallback:y().func}),(0,m.Z)(D,"defaultProps",{orderId:"",examineDetail:{},examineOrderDetail:{},action:1,onSuccessCallback:function(){}}),t.Z=(0,h.connect)()(b.Z.create()(D))},68815:function(e,t,n){n(13062);var a=n(71230),o=(n(52560),n(71577)),r=(n(9070),n(20924)),p=(n(89032),n(15746)),s=(n(20186),n(75385)),i=(n(55295),n(69713)),c=(n(51838),n(48086)),l=n(15671),d=n(43144),m=n(97326),u=n(60136),f=n(82963),x=n(61120),v=n(4942),h=n(93517),g=n.n(h),Z=n(55609),y=n(94315),b=n.n(y),I=n(67294),E=n(45697),w=n.n(E),C=n(30381),O=n.n(C),P=n(73218),S=n(96036),D=n(80385),k=n(52911);function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,x.Z)(e);if(t){var o=(0,x.Z)(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return(0,f.Z)(this,n)}}var j=function(e){(0,u.Z)(n,e);var t=A(n);function n(e){var d;return(0,l.Z)(this,n),d=t.call(this,e),(0,v.Z)((0,m.Z)(d),"onChangeAssociated",(function(e){var t=e.target.value.trim();d.setState({associatedId:t})})),(0,v.Z)((0,m.Z)(d),"onDeleteAssociatedOrder",(function(e){var t=d.props.orderId,n=d.props.dispatch;d.setState({associatedId:void 0,associatedAccount:[]}),n({type:"expenseExamineOrder/deleteAssociatedAccount",payload:{associatedId:t,id:e,onSuccessCallback:function(){return d.onSuccessDeleteAssociatedCallback(e)},onFailureCallback:function(e){return c.ZP.error(e.zh_message)}}})})),(0,v.Z)((0,m.Z)(d),"onSuccessDeleteAssociatedCallback",(function(e){var t=d.props,n=t.orderId,a=t.relationApplicationOrderId,o=[];a.map((function(t){if(t!==e)return o.push(t),o})),d.props.dispatch({type:"expenseExamineOrder/fetchExamineOrderDetail",payload:{id:n}});var r={limit:9999,associatedId:o,state:[D.DU5.close,D.DU5.pendding,D.DU5.processing,D.DU5.finish]};d.props.dispatch({type:"expenseExamineOrder/fetchExamineOrders",payload:r})})),(0,v.Z)((0,m.Z)(d),"onSuccessAssociatedCallback",(function(){var e=d.props.relationApplicationOrderId;if(b().not.empty(e)&&b().existy(e)){var t={limit:9999,associatedId:e,state:[D.DU5.close,D.DU5.pendding,D.DU5.processing,D.DU5.finish]};d.props.dispatch({type:"expenseExamineOrder/fetchExamineOrders",payload:t})}var n=d.props.orderId;d.props.dispatch({type:"expenseExamineOrder/fetchExamineOrderDetail",payload:{id:n}}),c.ZP.success("关联成功"),d.setState({isAssociate:!0})})),(0,v.Z)((0,m.Z)(d),"onFailureAssociatedCallback",(function(e){var t=d.state.associatedAccount;t.pop(),c.ZP.error(e.zh_message),d.setState({isAssociate:!1,associatedAccount:t})})),(0,v.Z)((0,m.Z)(d),"onSubmitAssociated",(function(){var e=d.state.associatedId,t=d.props,n=t.orderId,a=t.relationApplicationOrderId;if(e){var o=a;o.push(e),d.setState({associatedAccount:o});var r={associatedId:e,orderId:n};d.props.dispatch({type:"expenseExamineOrder/updateAssociatedAccount",payload:{params:r,onSuccessCallback:d.onSuccessAssociatedCallback,onFailureCallback:d.onFailureAssociatedCallback}})}})),(0,v.Z)((0,m.Z)(d),"renderAssociatedList",(function(){var e=d.props,t=e.examineOrderDetail,n=void 0===t?{}:t,a=e.isNewMoneyRule,o=g().get(n,"relationApplicationOrderListItem",[]),r=[{title:"审批单号",dataIndex:"_id",fixed:"left",width:100,render:function(e){return e||"--"}},{title:"主题标签",dataIndex:"theme_label_list",render:function(e){return b().not.empty(e)&&e.length>3?I.createElement(i.Z,{title:e.map((function(e){return e})).join(" 、 ")},I.createElement("div",{className:k.Z["app-comp-expense-associated-tag"]},g().get(e,"0"),"、",g().get(e,"1"),"、",g().get(e,"2"),"...")):b().not.empty(e)&&e.length<=3?I.createElement("div",null,e.map((function(e){return e})).join("、")):"--"}},{title:"平台",dataIndex:"platform_names",width:60,render:function(e){return b().not.existy(e)||b().empty(e)||b().not.array(e)?"--":e.map((function(e){return e})).join(" , ")}},{title:"供应商",dataIndex:"supplier_names",width:170,render:function(e){return b().not.existy(e)||b().empty(e)||b().not.array(e)?"--":1===e.length?g().get(e,"0"):I.createElement(i.Z,{title:e.map((function(e){return e})).join(" , ")},I.createElement("span",null,g().get(e,"0")," 等",e.length,"条"))}},{title:"城市",dataIndex:"city_names",width:70,render:function(e){return b().not.existy(e)||b().empty(e)||b().not.array(e)?"--":1===e.length?g().get(e,"0"):I.createElement(i.Z,{title:e.map((function(e){return e})).join(" , ")},I.createElement("span",null,g().get(e,"0")," 等",e.length,"条"))}},{title:"商圈",dataIndex:"biz_district_names",width:158,render:function(e){return b().not.existy(e)||b().empty(e)||b().not.array(e)?"--":1===e.length?g().get(e,"0"):I.createElement(i.Z,{title:e.map((function(e){return e})).join(" , ")},I.createElement("span",null,g().get(e,"0")," 等",e.length,"条"))}},{title:a?"付款金额(元)":"总金额（元）",dataIndex:"total_money",width:100,render:function(e){return e?D.fbc.exchangePriceCentToMathFormat(e):"--"}},{title:"提报时间",dataIndex:"submit_at",width:120,render:function(e){return e?O()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"付款时间",dataIndex:"paid_at",width:120,render:function(e){return e?O()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"审批类型",dataIndex:"application_order_type",width:100,render:function(e){return e?D.ZBL.description(e):"--"}},{title:"流程状态",dataIndex:"state",width:100,render:function(e){return D.DU5.description(e)||"--"}},{title:"操作",dataIndex:"operation",fixed:"right",width:100,render:function(e,t){return D.DU5.pendding===t.state?"--":I.createElement("a",{key:"delete",target:"_blank",rel:"noopener noreferrer",href:"/#/Expense/Manage/ExamineOrder/Detail?orderId=".concat(t._id)},"查看")}}];return I.createElement(s.Z,{rowKey:function(e){return e._id},scroll:{x:1300},dataSource:o,columns:r,pagination:!1,bordered:!0})})),(0,v.Z)((0,m.Z)(d),"renderAssociatedInfo",(function(){var e,t=d.state,n=t.associatedAccount,s=t.isAssociate,i=t.associatedId,c=d.props.relationApplicationOrderId;e=b().not.empty(n)&&b().existy(n)?n:c;var l=[];return s?l.push(I.createElement("span",{className:k.Z["app-comp-expense-associated-info-wrap"],key:"success"},e.map((function(t,n){return I.createElement("span",{key:n},I.createElement("a",{key:"delete",target:"_blank",rel:"noopener noreferrer",className:k.Z["app-comp-expense-associated-info-link"],href:"/#/Expense/Manage/ExamineOrder/Detail?orderId=".concat(t)},t),b().not.empty(e)&&b().existy(e)?I.createElement(P.Z,{className:k.Z["app-comp-expense-associated-info-icon"],onClick:function(){return d.onDeleteAssociatedOrder(t)}}):null)})))):l.push(I.createElement("span",{className:k.Z["app-comp-expense-associated-info-wrap"],key:"error"},e.map((function(t,n){return I.createElement("span",{key:n},I.createElement("a",{herf:"#"},t),b().not.empty(e)&&b().existy(e)?I.createElement(P.Z,{className:k.Z["app-comp-expense-associated-info-icon"],onClick:function(){return d.onDeleteAssociatedOrder(t)}}):null)})))),I.createElement(S.IT,{key:"associated",title:"关联信息"},I.createElement(a.Z,{type:"flex",align:"middle"},I.createElement(p.Z,{span:24},I.createElement(a.Z,null,I.createElement(p.Z,{span:2,className:k.Z["app-comp-expense-associated-info-input-label"]},I.createElement("span",{className:k.Z["app-comp-expense-associated-info-wrap"]},"关联审批单:")),I.createElement(p.Z,{span:6,className:k.Z["app-comp-expense-associated-info-input"]},I.createElement(r.Z,{placeholder:"请输入关联审批单号",value:i,onChange:d.onChangeAssociated})),I.createElement(p.Z,{span:2,className:k.Z["app-comp-expense-associated-info-btn"]},I.createElement(o.Z,{type:"primary",onClick:d.onSubmitAssociated},"确定")),I.createElement(p.Z,{span:10,className:k.Z["app-comp-expense-associated-info-content"]},I.createElement("span",null,l)))),I.createElement(p.Z,{span:24,className:k.Z["app-comp-expense-associated-info-table-wrap"]},I.createElement(a.Z,null,I.createElement(p.Z,{span:2,className:k.Z["app-comp-expense-associated-info-list-table"]},"关联审批单列表:"),I.createElement(p.Z,{span:21,className:k.Z["app-comp-expense-associated-info-list"]},d.renderAssociatedList())))))})),d.state={associatedAccount:[],associatedId:void 0,isAssociate:!0},d}return(0,d.Z)(n,[{key:"render",value:function(){return I.createElement("div",null,this.renderAssociatedInfo())}}]),n}(I.Component);(0,v.Z)(j,"propTypes",{relationApplicationOrderId:w().array,orderId:w().string,examineOrderDetail:w().object}),(0,v.Z)(j,"defaultProps",{relationApplicationOrderId:[],orderId:"",examineOrderDetail:{}}),t.Z=(0,Z.connect)((function(e){return{examineOrdersData:e.expenseExamineOrder.examineOrdersData}}))(j)},88081:function(e,t,n){var a=n(15671),o=n(43144),r=n(97326),p=n(60136),s=n(82963),i=n(61120),c=n(4942),l=(n(29093),n(16317)),d=n(96486),m=n.n(d),u=n(93517),f=n.n(u),x=n(45697),v=n.n(x),h=n(67294),g=n(29335);function Z(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,i.Z)(e);if(t){var o=(0,i.Z)(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return(0,s.Z)(this,n)}}var y=l.Z.Option,b=function(e){(0,p.Z)(n,e);var t=Z(n);function n(){var e;return(0,a.Z)(this,n),e=t.call(this),(0,c.Z)((0,r.Z)(e),"onChangePersonOrPost",(function(t){var n,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=e.props,r=o.onChange,p=o.onChangePerson,s=o.postPersonList,i=t,c=[],l=a.postmark,d=void 0===l?void 0:l,m=!!d;if(m){n=t;var u=s.filter((function(e){return e._id===t}));i=1===(c=f().get(u[0],"account_info_list",[])).length?c[0]._id:void 0}e.setState({personId:i,postId:n,personShowId:t,isShowPost:m,accountList:c}),r({personId:i,postId:n,postPersonId:1===c.length?c[0]._id:void 0,personShowId:t});var x=1===c.length,v=!!m;p&&p(v,x)})),(0,c.Z)((0,r.Z)(e),"onChangePerson",(function(t){var n=e.props.onChange,a=e.state,o=a.postId,r=a.personShowId;e.setState({personId:t,postPersonId:t}),n&&n({personId:t,postId:o,postPersonId:t,personShowId:r})})),(0,c.Z)((0,r.Z)(e),"renderForm",(function(){var t=e.props,n=t.accountIdsData,a=t.value,o=t.isDisabledPost,r=t.isDisabledPerson,p=t.postList,s=void 0===p?[]:p,i=t.personList,c=void 0===i?[]:i,d=e.state.accountList,u=a.postPersonId,x=a.personShowId,v=e.state.isShowPost;1===s.length&&0===c.length&&1!==s[0].account_ids&&(d=f().get(n[0],"account_info_list",[]),v=!0),1===s.length&&0===c.length&&1===s[0].account_ids&&(d=f().get(n[0],"account_info_list",[]),v=!0);var Z=m().uniqWith(d,m().isEqual);return h.createElement("div",null,h.createElement(l.Z,{placeholder:"请选择审批人或审批岗位",value:x,className:!0===v?g.Z["app-comp-expense-approve-person-post-selector"]:g.Z["app-comp-expense-approve-person-selector"],disabled:o,onChange:e.onChangePersonOrPost},n.map((function(e){var t=e.id||e._id,n=e.name||e.post_name,a=e.post_name;return h.createElement(y,{key:t,value:t,postmark:a},n)}))),!0===v?h.createElement(l.Z,{placeholder:"请选择审批人",value:u,className:g.Z["app-comp-expense-approve-person-post-person-selector"],disabled:r,onChange:e.onChangePerson},Z.map((function(e){return h.createElement(y,{key:e._id,value:e._id},e.name)}))):null)})),e.state={value:void 0,isShowPost:!1,personShowId:void 0,postPersonId:void 0,postId:void 0,personId:void 0,accountList:[]},e}return(0,o.Z)(n,[{key:"render",value:function(){return h.createElement("div",null,this.renderForm())}}],[{key:"getDerivedStateFromProps",value:function(e,t){var n=e.value,a=void 0===n?{}:n,o=t.value;return void 0===(void 0===o?void 0:o)&&Object.keys(a).length>0?{value:a,personShowId:a.personShowId,postPersonId:a.postPersonId,postId:a.postId,personId:a.personId}:null}}]),n}(h.Component);(0,c.Z)(b,"propTypes",{value:v().object}),(0,c.Z)(b,"defaultProps",{value:{}}),t.Z=b},52911:function(e,t){t.Z={processTable:"SKn1pcjtxJ6wNJIyuHUF","ant-table-content":"bWndSDezf99bcuhdqUao",moneywrap:"ACaO799eL6U048k6f77n",moneyiconlight:"y2YQdGHT7q5E0daOuvIh",moneytextlight:"U3UinWKzGutmPeQt_Rgc",moneyicongrey:"jz8KvRgtCgaMRTWdAHbb",moneytextgrey:"fqLX6YPSV1VJi9d82zAF","app-comp-expense-associated-tag":"j_sDScrFPYtVLFWPMWVr","app-comp-expense-associated-info-wrap":"QVngxz76Tp0sNzqPX9P8","app-comp-expense-associated-info-link":"iNZtt3TGd3xy5KR4RSnR","app-comp-expense-associated-info-icon":"hAZFad4o9oUzMC8DRF5h","app-comp-expense-associated-info-input-label":"KQvbSKN3wcY8zCPfewiA","app-comp-expense-associated-info-input":"baWzSe9_bGCq2UnfKrEN","app-comp-expense-associated-info-btn":"YZBv4OngKG_4wyaRRnxn","app-comp-expense-associated-info-content":"RoxypCnji6uXzKG2bX1n","app-comp-expense-associated-info-table-wrap":"wCPnD1ySzJBSqHcB03Lg","app-comp-expense-associated-info-list-table":"m6iABT6dUIiPD1XTl7g3","app-comp-expense-associated-info-list":"nCfAqkm0lJwrfjNYK_46","app-comp-expense-borrow-actual-loan-name":"NvIl2iXGGOUDmUpQK06i","app-comp-expense-borrow-loan-note":"TqdWeHBaYeRRa7E1cldm","app-comp-expense-borrow-loan-note-tooltip":"LwGnTq8sdVmei6OjM8DS","app-comp-expense-borrow-operate":"_EWKLA29z8fHHypgkAfP","app-comp-expense-trip-note":"Ga3e2SUftPZshjbBel8j","app-comp-expense-trip-note-tool-tip":"SX1MqHDw3LLTbfHgCuom","app-comp-expense-trip-operate":"mZZrhHk6Nqtut6pMlLeR","app-comp-expense-supplement-title":"xP_EFSIvdBtkqreL4xNL","app-comp-expense-supplement-content":"QBSN0sNpHw8zCpio7Lgs","app-comp-expense-supplement-item":"jj1TuGCSzNaSu31BBfu9","app-comp-expense-supplement-creator-name":"KJwpJZne97LJQp3rXYZQ","app-comp-expense-supplement-create-at":"VfOXsgTnMewU5DfCX3uo","app-comp-expense-supplement-text-wrap":"fgqGaP87sq4IK4cfzN6V","app-comp-expense-supplement-text":"zjAGNRD6XpqktFyHwmRw","app-comp-expense-supplement-files":"gjamGYGT4UB1wa4xxGGQ","app-comp-expense-supplement-file-item":"WpkWPopUCyFMacQ1gTDA","app-comp-expense-supplement-del-icon":"mCXRkgk1xZZiSqkWFbyj","app-comp-expense-supplement-show-more-btn":"wgktKiOifPyKdVPSMdKw","app-comp-expense-repayment-id":"Hst1wdjLdq1Jdsn9MMmC","app-comp-expense-repayment-operation":"MjPz2zOnfE08IFfjPjVi","app-comp-expense-create-cost-order-label":"IRwJppRu5DhOrCG3VigQ","app-comp-expense-create-cost-order-selector":"gE_1pjsNBqSApsg5Od2W","app-comp-expense-process-state-img":"NLuN9noOHsP5QIJeXSVY","app-comp-expense-process-timeline-item":"IX2jfpRWFExV7il6FvyU","app-comp-expense-process-point-name-wrap":"NASjcTfGkTFDdrULCkBw","app-comp-expense-process-point-name":"tsbd4FT1rUdbHoA2zYSA","app-comp-expense-process-point-item-wrap":"KHhjRbWpo_4Z6xNnLqW9","app-comp-expense-process-point-item-people-name":"sJeU66Gv8L_b6m8_VSfs","app-comp-expense-process-point-item-node-wrap":"sXv5Wh5x5xtienTlYABj","app-comp-expense-process-point-item-node-post-name":"ZA9X4hK5XNZvjCBfYWWF","app-comp-expense-process-point-item-node-name":"m0yT8wSc_rq27aAafupA","app-comp-expense-process-point-item-node-position-name":"HsYAainzve0i6aXjE37I","app-comp-expense-process-point-item-node-operate-at":"zD9ZcRNE7KbITMeUQQqd","app-comp-expense-process-point-item-node-state":"DJarfl_aptmXnG9iegcF","app-comp-expense-process-point-item-node-operate-wrap":"ThT1PwdLf5jC9lER58j9","app-comp-expense-process-point-item-node-note":"mkBLqCDNzZ_KSmpQueAL","app-comp-expense-process-point-item-node-addition-wrap":"HiWF0d4m3SsYVZYgHLYW","app-comp-expense-process-show-more-btn":"E4d2EN6moPnjZozBtFTp","app-comp-expense-process-examflow-wrap":"VWWQJdZBqRxa4vkGbHHf","app-comp-expense-process-examflow-icon":"UcXeyPUlOpXccC01iFbJ","app-comp-expense-detail-operate-wrap":"VlPl5izbwl3QehtERcZv","app-comp-expense-detail-operate-item":"jAQfOM5UrzDRYgqBOYFq"}},29335:function(e,t){t.Z={"app-comp-expense-approve-close-modal-wrap":"wFWoJcqtHrYnD2k8OP3T","app-comp-expense-approve-close-modal-icon":"NVxOz8H3KCLv2PrksvNr","app-comp-expense-approve-close-modal-finish":"D2StYhDY5JgCv2lDVq_X","app-comp-expense-approve-close-modal-count":"DsT4Bl_ZOds1ViSTcHNg","app-comp-expense-approve-close-modal-seconds":"c3a9kycIP3SgUuOgIVgA","app-comp-expense-approve-close-modal-tip":"yi1yWK7DaYHUOCR7dag5","app-comp-expense-approve-close-modal-btn-wrap":"j0nQgO9DmzwkLMe7HMMw","app-comp-expense-approve-close-modal-btn":"YyYFH8hHW4FtyChayxHY","app-comp-expense-approve-person-post-selector":"vw4ra8UPKBLmynjjiqIi","app-comp-expense-approve-person-selector":"_Pt_gfsyyzkRRTMZ5MtA","app-comp-expense-approve-person-post-person-selector":"eup6JthyTMeF6m9INbbv","app-comp-expense-borrow-info-download-btn":"c8c6zBDL2peXANzK80sx","app-comp-expense-business-info-together-name":"mm09g3qaUJ5XRMHvdwwL","app-comp-expense-business-info-transport-kind":"Z8cRkTgFMMdAXRRG838S","app-comp-expense-business-info-ext":"acU3pMBuzOKi8RO2Hek7","app-comp-expense-cost-order-item-files-link":"cVx63tklQroCVJaWRzuB","app-comp-expense-cost-order-item-update-cost-money":"wmb7gmM1JjHdN0pwCrQX","app-comp-expense-detail-operate-wrap":"WOg4C32YPoCKdaflWLOq","app-comp-expense-detail-operate-item":"E5eUuKkyGvwMhvv3hAFi","app-comp-expense-detail-tag-selector":"jhmUqieq6sXXO69HqGtP","app-comp-expense-detail-tag-td":"d06rEhpZq17srsc7ijeT","app-comp-expense-detail-order-info-ext":"DMhWKR3u6STKrG5e3mlt","app-comp-expense-reject-node-node-selector":"fRouNAirBZucSZKkMCA7","app-comp-expense-reject-node-person-or-post":"Pgb0alct1pRvzcOsTpRE","app-comp-expense-reject-node-person":"W84Xvw0jcgp_t74Hdvy3","app-comp-expense-repay-files-item":"vObdtEo4n0SRvNWgHHH7","app-comp-expense-supplement-del-file":"hIq0sjNUScES1sjFqJQD","app-comp-expense-travel-files-link":"Lirch3sn1CwX14gdWgOc","app-comp-expense-travel-update-money":"GTlnH0rPqViFKSqOok19","app-comp-expense-travel-submit-money-td":"u5IVOW2NKkmxHBthDVXf","app-comp-expense-travel-total-money-td":"KMx98PygMK6EePscxp7G","app-comp-expense-travel-money-item-td":"k_4im_OlFswFtXqhewMS","app-comp-expense-borrowing-info-file":"ERWF7UpjdwiVGWGnXxT5","app-comp-expense-borrowing-repayments-info-not":"BWZS14eSTC8EafOxwQSz",preview:"gRDOrI2RAftWkchirlnj","preview-button":"cBPYFgy6Lkf4RZoS5W4Q"}}}]);