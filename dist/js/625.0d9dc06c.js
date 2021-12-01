"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[625],{23091:function(e,a,t){t.r(a);t(13062);var n=t(71230),r=(t(89032),t(15746)),l=t(15671),o=t(43144),c=t(97326),p=t(60136),i=t(82963),s=t(61120),m=t(4942),f=(t(19597),t(27279)),u=t(93517),d=t.n(u),_=t(67294),b=t(55609),y=t(30381),v=t.n(y),h=t(96036),E=t(80385),Z=t(74109);function x(e){var a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,s.Z)(e);if(a){var r=(0,s.Z)(this).constructor;t=Reflect.construct(n,arguments,r)}else t=n.apply(this,arguments);return(0,i.Z)(this,t)}}var C=f.Z.Panel,P=function(e){(0,p.Z)(t,e);var a=x(t);function t(){var e;(0,l.Z)(this,t);for(var o=arguments.length,p=new Array(o),i=0;i<o;i++)p[i]=arguments[i];return e=a.call.apply(a,[this].concat(p)),(0,m.Z)((0,c.Z)(e),"renderBaseInfo",(function(){var a=e.props.detail,t=[{label:"审批单号",form:a.apply_application_order_id||"--"},{label:"申请人",form:a.apply_account_info?a.apply_account_info.name:"--"},{label:"审批类型",form:a.apply_application_order_info?E.ZBL.description(a.apply_application_order_info.application_order_type):"--"}];return _.createElement(h.IT,{title:"基本信息"},_.createElement(n.Z,{type:"flex",align:"middle"},_.createElement(r.Z,{span:24},_.createElement(h.KP,{items:t,cols:4}))))})),(0,m.Z)((0,c.Z)(e),"renderTravelList",(function(){var a=e.props.detail._id;return a&&_.createElement(h.IT,{title:"出差单"},_.createElement(f.Z,{bordered:!1,defaultActiveKey:["".concat(a)]},_.createElement(C,{header:"出差申请单号: ".concat(a),key:a},e.renderPersonInfo(),e.renderTravelInformation())))})),(0,m.Z)((0,c.Z)(e),"renderPersonInfo",(function(){var a=e.props.detail,t=[{label:"实际出差人",form:a.apply_user_name||"--"},{label:"联系方式",form:a.apply_user_phone||"--"},{label:"同行人员",form:a.together_user_names?a.together_user_names.join(", "):"--"}];return _.createElement(h.IT,{title:"出差人信息"},_.createElement(n.Z,{type:"flex",align:"middle"},_.createElement(r.Z,{span:24},_.createElement(h.KP,{items:t,cols:3}))))})),(0,m.Z)((0,c.Z)(e),"renderTravelInformation",(function(){var a=e.props.detail,t=a.departure,n=a.destination,r="";a.transport_kind?(a.transport_kind.forEach((function(e){r+="".concat(E.s6P.description(e)," ,")})),r=r.substring(0,r.length-1)):r="--";var l=[{label:"出差类别",form:E.a8e.description(a.biz_type)||"--"},{label:"出发方式",form:r},{label:"出发地",form:t?"".concat(t.province_name).concat(t.city_name||"").concat(t.area_name||"").concat(t.detailed_address):"--"},{label:"目的地",form:n?"".concat(n.province_name).concat(n.city_name||"").concat(n.area_name||"").concat(n.detailed_address):"--"},{label:"预计出差时间",form:"".concat(v()(a.expect_start_at).format("YYYY-MM-DD HH:00")," -- ").concat(v()(a.expect_done_at).format("YYYY-MM-DD HH:00"))||"--"},{label:"出差天数",form:"".concat(a.expect_apply_days,"天")},{label:"原因及说明",form:a.note||"--"},{label:"工作安排",form:a.working_plan||"--"}];return _.createElement(h.IT,{title:"出差信息"},_.createElement(h.KP,{items:l,cols:1,layout:{labelCol:{span:2},wrapperCol:{span:22}}}))})),(0,m.Z)((0,c.Z)(e),"renderReimburseForm",(function(){var a=e.props.detail,t=a.cost_order_info;return!d().get(a,"cost_order_info")||Object.keys(t).length<1?_.createElement("div",null):_.createElement(h.IT,{title:"报销单"},_.createElement(f.Z,{bordered:!1,defaultActiveKey:["".concat(t._id)]},_.createElement(C,{header:"费用单号: ".concat(t._id),key:t._id},e.renderReimburseBusiness(a),e.renderCostInformation(t),e.renderProjectInformation(t),e.renderPaymentInformation(t))))})),(0,m.Z)((0,c.Z)(e),"renderReimburseBusiness",(function(e){var a=[{label:"实际出差时间",form:e.actual_start_at?"".concat(v()(e.actual_start_at).format("YYYY-MM-DD HH:mm:ss")," -- ").concat(v()(e.actual_done_at).format("YYYY-MM-DD HH:mm:ss")):"--"},{label:"出差天数",form:"".concat(e.actual_apply_days,"天")}];return _.createElement(h.IT,{title:"出差信息"},_.createElement(h.KP,{items:a,cols:2}))})),(0,m.Z)((0,c.Z)(e),"renderCostInformation",(function(a){var t=[{label:"费用金额（元）",form:E.fbc.exchangePriceCentToMathFormat(a.total_money)||"--"},{label:"是否开票",form:a.invoice_flag?"是":"否"}],n=[{label:"差旅费用明细",layout:{labelCol:{span:3},wrapperCol:{span:21}},form:e.renderTravelExpensesInformation(a)}];return _.createElement(h.IT,{title:"费用信息"},_.createElement(h.KP,{items:t,cols:4}),_.createElement(h.KP,{items:n,cols:1}))})),(0,m.Z)((0,c.Z)(e),"renderTravelExpensesInformation",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=e.biz_extra_data,t=[{label:"补助（元）",span:4,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:a.subsidy_fee>=0?_.createElement("p",{className:Z.Z["app-comp-expense-travel-application-detail"]},E.fbc.exchangePriceCentToMathFormat(a.subsidy_fee)):"--"},{label:"住宿（元）",span:5,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:a.stay_fee>=0?_.createElement("p",{className:Z.Z["app-comp-expense-travel-application-detail"]},E.fbc.exchangePriceCentToMathFormat(a.stay_fee)):"--"},{label:"往返交通费（元）",span:5,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:a.transport_fee>=0?_.createElement("p",{className:Z.Z["app-comp-expense-travel-application-detail"]},E.fbc.exchangePriceCentToMathFormat(a.transport_fee)):"--"},{label:"市内交通费（元）",span:5,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:a.urban_transport_fee>=0?_.createElement("p",{className:Z.Z["app-comp-expense-travel-application-detail"]},E.fbc.exchangePriceCentToMathFormat(a.urban_transport_fee)):"--"},{label:"其他（元）",span:5,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:a.other_fee>=0?_.createElement("p",{className:Z.Z["app-comp-expense-travel-application-detail"]},E.fbc.exchangePriceCentToMathFormat(a.other_fee)):"--"}],l={labelCol:{span:18},wrapperCol:{span:6}};return _.createElement(n.Z,null,_.createElement(r.Z,{span:24}," "),_.createElement(h.KP,{items:t,layout:l}))})),(0,m.Z)((0,c.Z)(e),"renderProjectInformation",(function(a){var t=[{label:"科目",form:a.cost_accounting_info.name||"--"},{label:"费用分组",form:a.cost_group_name||"--"},{label:"成本分摊",form:e.renderCostAttribution(a)},{label:"备注",form:a.note||"--"},{label:"附件",form:a.attachments&&0!==a.attachments.length?_.createElement("div",null,a.attachments.map((function(e,t){return _.createElement("a",{key:"onDownloadPayroll_".concat(t),className:Z.Z["app-comp-expense-travel-application-detail-project"],href:a.attachment_private_urls[t]},e,_.createElement("span",null," "))}))):"--"}];return _.createElement(h.IT,{title:"项目信息"},_.createElement(h.KP,{items:t,cols:1,layout:{labelCol:{span:2},wrapperCol:{span:22}}}))})),(0,m.Z)((0,c.Z)(e),"renderCostAttribution",(function(e){return _.createElement(n.Z,{type:"flex",align:"middle"},_.createElement(r.Z,{span:24},6===e.allocation_mode?"分摊金额":"自定义分摊"),_.createElement(r.Z,{span:24},e.cost_allocation_list.map((function(e,a){return _.createElement("div",{key:a},"".concat(e.platform_name||"","——").concat(e.supplier_name||""," - ").concat(e.city_name||""," - ").concat(e.biz_district_name||"","  分摊金额：").concat(E.fbc.exchangePriceCentToMathFormat(e.money)||"","元"))}))))})),(0,m.Z)((0,c.Z)(e),"renderPaymentInformation",(function(e){var a=[{label:"收款人",form:e.payee_info.card_name||"--"},{label:"收款账号",form:e.payee_info.card_num||"--"},{label:"开户支行",form:e.payee_info.bank_details||"--"}];return _.createElement(h.IT,{title:"支付信息"},_.createElement(h.KP,{items:a,cols:3}))})),e}return(0,o.Z)(t,[{key:"componentDidMount",value:function(){this.props.dispatch({type:"expenseTravelApplication/getExpenseTravelApplicationDetail",payload:{travel_apply_order_id:this.props.location.query.id}})}},{key:"render",value:function(){return _.createElement("div",null,this.renderBaseInfo(),this.renderTravelList(),this.props.detail.cost_order_id&&this.renderReimburseForm())}}]),t}(_.Component);a.default=(0,b.connect)((function(e){return{detail:e.expenseTravelApplication.expenseTravelApplicationDetail}}))(P)},74109:function(e,a){a.Z={"app-comp-expense-travel-application-detail":"Euvc6JGe4E5ygNosyd_f","app-comp-expense-travel-application-detail-project":"_atBvAbqFEU33EB7lkMe","app-comp-expense-travel-application-approval":"_8CmGvlcx7a8K1zhoEH2","app-comp-expense-ravel-application-search":"nDkLZS2xcHdhPHxJIlHO"}}}]);