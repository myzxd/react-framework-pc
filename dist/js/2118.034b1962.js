"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[2118],{32118:function(e,t,r){r.r(t),r.d(t,{default:function(){return A}});var n=r(15671),o=r(43144),a=r(97326),l=r(60136),i=r(82963),p=r(61120),c=r(4942),s=r(93517),u=r.n(s),f=r(55609),d=r(67294),m=r(45697),y=r.n(m),g=r(80385),_=r(96036),b=r(93433),h=(r(19597),r(27279));function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,p.Z)(e);if(t){var o=(0,p.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,i.Z)(this,r)}}var w=_.KT.CoreFinderList,Z=h.Z.Panel,C=function(e){(0,l.Z)(r,e);var t=v(r);function r(){var e;(0,n.Z)(this,r);for(var o=arguments.length,l=new Array(o),i=0;i<o;i++)l[i]=arguments[i];return e=t.call.apply(t,[this].concat(l)),(0,c.Z)((0,a.Z)(e),"renderBorrowingPeopleInfo",(function(e){var t=e.platform_code,r=[{label:"平台",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"platform_name",void 0)||"--"},{label:"供应商",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"supplier_name",void 0)||"--"},{label:"城市",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"city_name",void 0)||"--"},{label:"商圈",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"biz_district_name",void 0)||"--"},{label:"实际借款人",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"actual_loan_info.name","--")}],n=[{label:"实际借款人",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"actual_loan_info.name","--")},{label:"团队信息",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"actual_loan_info.department_name","--")}],o="zongbu"===t?n:r,a=[].concat((0,b.Z)(o),[{label:"身份证号码",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"actual_loan_info.identity","--")},{label:"借款联系人方式",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"actual_loan_info.phone","--")},{label:"收款账户",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"payee_account_info.card_num","--")},{label:"开户支行",span:10,layout:{labelCol:{span:6},wrapperCol:{span:18}},form:u().get(e,"payee_account_info.bank_details","--")}]);return d.createElement(_.IT,{title:"借款人信息"},d.createElement(_.KP,{items:a}))})),(0,c.Z)((0,a.Z)(e),"renderCorePreview",(function(e){if(Array.isArray(e)&&u().get(e,"0.file_url")){var t=e.map((function(e){return{key:e.file_name,url:e.file_url}}));return d.createElement(w,{data:t,enableTakeLatest:!1})}return"--"})),(0,c.Z)((0,a.Z)(e),"renderBorrowingInfo",(function(t){var r=[{label:"借款金额 (元)",form:u().get(t,"loan_money",0)?g.fbc.exchangePriceCentToMathFormat(u().get(t,"loan_money",0)):"--"},{label:"借款类型",form:u().get(t,"loan_type",0)?g.eLy.description(u().get(t,"loan_type",0)):"--"},{label:"借款事由",form:d.createElement("span",{className:"noteWrap"},u().get(t,"loan_note","--")||"--")},{label:"上传附件",form:e.renderCorePreview(u().get(t,"assert_file_list",[]))}];return d.createElement(_.IT,{title:"借款信息"},d.createElement(_.KP,{items:r,cols:1,layout:{labelCol:{span:2},wrapperCol:{span:22}}}))})),(0,c.Z)((0,a.Z)(e),"renderRepaymentsInfo",(function(e){var t=[{label:"还款方式",form:u().get(e,"repayment_method",0)?g.d5u.description(u().get(e,"repayment_method",0)):"--"},{label:"还款周期",form:u().get(e,"repayment_cycle",0)?g.kHJ.description(u().get(e,"repayment_cycle",0)):"--"},{label:"预计还款时间",form:u().get(e,"expected_repayment_time",void 0)||"--"}];return d.createElement(_.IT,{title:"还款信息"},d.createElement(_.KP,{items:t,cols:3,layout:{labelCol:{span:7},wrapperCol:{span:15}}}))})),(0,c.Z)((0,a.Z)(e),"render",(function(){var t=e.props.borrowingDetail;return 0===Object.keys(t).length?null:d.createElement(_.IT,{title:"借款单"},d.createElement(h.Z,{bordered:!1,defaultActiveKey:["0"]},[t].map((function(t,r){var n="借款单号:".concat(" ",t._id);return d.createElement(Z,{header:n,key:r},e.renderBorrowingPeopleInfo(t),e.renderBorrowingInfo(t),e.renderRepaymentsInfo(t))}))))})),e}return r}(d.Component);(0,c.Z)(C,"propTypes",{borrowingDetail:y().object}),(0,c.Z)(C,"defaultProps",{borrowingDetail:{}});var R=C,I=(r(20186),r(75385)),E=(r(18085),r(55241)),k=r(94315),P=r.n(k),D=r(30381),x=r.n(D),B="vaEjuRt1TMTMcFS0yqST";function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,p.Z)(e);if(t){var o=(0,p.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,i.Z)(this,r)}}var T=function(e){(0,l.Z)(r,e);var t=O(r);function r(){var e;(0,n.Z)(this,r);for(var o=arguments.length,l=new Array(o),i=0;i<o;i++)l[i]=arguments[i];return e=t.call.apply(t,[this].concat(l)),(0,c.Z)((0,a.Z)(e),"onChangeRepaymentPage",(function(t){var r=e.props.id;r&&e.props.dispatch({type:"borrowingRepayment/fetchRepaymentOrders",payload:{borrowingId:r,orderState:!0,limit:30,page:t}})})),(0,c.Z)((0,a.Z)(e),"onRepaymentShowSizeChange",(function(t,r){var n=e.props.id;n&&e.props.dispatch({type:"borrowingRepayment/fetchRepaymentOrders",payload:{borrowingId:n,orderState:!0,limit:r,page:t}})})),e}return(0,o.Z)(r,[{key:"componentDidMount",value:function(){var e=this.props.id;e&&this.props.dispatch({type:"borrowingRepayment/fetchRepaymentOrders",payload:{borrowingId:e,orderState:!0}})}},{key:"componentWillUnmount",value:function(){void 0!==this.props.id&&this.props.dispatch({type:"borrowingRepayment/resetRepaymentOrders"})}},{key:"render",value:function(){var e=this.props.repaymentOrders,t=void 0===e?{}:e,r=u().get(t,"data",[]),n=u().get(t,"meta.count",0),o=[{title:"还款单号",dataIndex:"_id",key:"_id",render:function(e){return e||"--"}},{title:"还款金额",dataIndex:"repayment_money",key:"repayment_money",render:function(e){return g.fbc.exchangePriceCentToMathFormat(e)}},{title:"实际还款人",dataIndex:"apply_account_info",key:"apply_account_info",render:function(e){return e.name||"--"}},{title:"备注",dataIndex:"repayment_note",key:"repayment_note",render:function(e){return P().not.existy(e)||P().empty(e)?"--":e.length<=20?e:d.createElement(E.Z,{content:d.createElement("p",{className:B},e),trigger:"hover"},d.createElement("div",null,e.slice(0,20),"..."))}},{title:"审批流",dataIndex:"application_order_info",key:"application_order_info.flow_info",render:function(e){return u().get(e,"flow_info.name")||"--"}},{title:"还款时间",dataIndex:"done_at",key:"done_at",render:function(e){return e?x()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"流程状态",dataIndex:"state",key:"state",render:function(e){return g.DU5.description(e)||"--"}},{title:"操作",dataIndex:"operation",key:"operation",render:function(e,t){return d.createElement("a",{key:"delete",target:"_blank",rel:"noopener noreferrer",href:"/#/Expense/BorrowingRepayments/Repayments/Detail?orderId=".concat(t.application_order_id,"&repaymentOrderId=").concat(t._id)},"查看")}}],a={defaultPageSize:30,onChange:this.onChangeRepaymentPage,total:n,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:this.onRepaymentShowSizeChange};return d.createElement(_.IT,{title:"还款信息"},d.createElement(I.Z,{columns:o,rowKey:function(e){return e._id},pagination:a,dataSource:r}))}}]),r}(d.Component);(0,c.Z)(T,"propTypes",{id:y().string,repaymentOrders:y().object}),(0,c.Z)(T,"defaultProps",{id:"",repaymentOrders:{}});var S=(0,f.connect)((function(e){return{repaymentOrders:e.borrowingRepayment.repaymentOrders}}))(T),L=r(2671);function M(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,p.Z)(e);if(t){var o=(0,p.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,i.Z)(this,r)}}var z=function(e){(0,l.Z)(r,e);var t=M(r);function r(e){var o;return(0,n.Z)(this,r),o=t.call(this,e),(0,c.Z)((0,a.Z)(o),"renderBaseInfo",(function(){var e=o.props.borrowingDetail.application_order_info,t=void 0===e?{}:e,r=[{label:"审批单号",form:u().get(t,"_id","--")},{label:"申请人",form:u().get(t,"apply_account_info.name","--")},{label:"总金额",form:g.fbc.exchangePriceCentToMathFormat(u().get(t,"total_money",0))},{label:"审批类型",form:"".concat(g.ZBL.description(u().get(t,"application_order_type")))},{label:"审批流程",form:u().get(t,"flow_info.name","--")},{label:"标记付款状态",form:"".concat(g.$ym.description(u().get(t,"paid_state")))},{label:"付款异常说明",form:u().get(t,"paid_note","--")}];return d.createElement(_.IT,null,d.createElement(_.KP,{items:r,cols:4,layout:{labelCol:{span:10},wrapperCol:{span:14}}}))})),(0,c.Z)((0,a.Z)(o),"renderBorrowingInfo",(function(){var e=o.props.borrowingDetail;return d.createElement(R,{borrowingDetail:e})})),(0,c.Z)((0,a.Z)(o),"renderRepaymentsInfo",(function(){var e=o.props.borrowingDetail;return d.createElement("div",null,[e].map((function(e,t){return d.createElement(S,{key:t,id:e._id})})))})),(0,c.Z)((0,a.Z)(o),"renderAuditRecordsInfo",(function(){var e=o.state.approvalId,t=o.props,r=t.borrowingDetail,n=t.flowRecordList;if(0===n.length)return null;var a=r.application_order_info,l=r.apply_account_info,i=a.current_flow_node,p=a.operate_accounts_list,c=a.file_url_list,s=l.apply_account_id;return d.createElement(L.Z,{isOpera:!1,applyAccountId:s,orderId:e,data:n,currentFlowNode:i,dispatch:o.props.dispatch,accountList:p,fileUrlList:c})})),(0,c.Z)((0,a.Z)(o),"render",(function(){var e=o.props.borrowingDetail;return 0===Object.keys(e).length?d.createElement("div",null):d.createElement("div",null,o.renderBorrowingInfo(),o.renderRepaymentsInfo(),o.renderAuditRecordsInfo())})),o.state={approvalId:u().get(e,"location.query.approvalId",void 0),orderId:u().get(e,"location.query.orderId",void 0)},o}return(0,o.Z)(r,[{key:"componentDidMount",value:function(){var e=this.state,t=e.approvalId,r=e.orderId;this.props.dispatch({type:"borrowingRepayment/fetchBorrowingDetails",payload:{id:t}}),this.props.dispatch({type:"borrowingRepayment/fetchExamineOrderFlowRecordList",payload:{id:r}})}}]),r}(d.Component);(0,c.Z)(z,"propTypes",{borrowingDetail:y().object,flowRecordList:y().array}),(0,c.Z)(z,"defaultProps",{borrowingDetail:{},flowRecordList:[]});var A=(0,f.connect)((function(e){var t=e.borrowingRepayment;return{borrowingDetail:t.borrowingDetail,flowRecordList:t.flowRecordList}}))(z)}}]);