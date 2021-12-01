"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7957],{77957:function(t,e,a){a.r(e);a(20186);var n=a(75385),o=(a(35668),a(86585)),l=a(67294),c=a(55609),i=a(30381),r=a.n(i),m=a(45697),d=a.n(m),_=a(96036),u=a(97116),s=a(80385);function f(t){var e=t.location,a=t.amortizationDetail,c=t.getAmortizationDetail,i=t.resetAmortizationDetail,m=e.query.id;(0,l.useEffect)((function(){return c({id:m}),function(){return i()}}),[]);var d;return l.createElement(l.Fragment,null,(d=[l.createElement(o.Z.Item,{label:"费用单号",key:"costNum"},u.P6.dotOptimal(a,"cost_order_id","--")),l.createElement(o.Z.Item,{label:"科目",key:"subject"},u.P6.dotOptimal(a,"biz_account_name","--")),l.createElement(o.Z.Item,{label:"核算中心",key:"account"},a.biz_team_name||a.biz_code_name||"--"),l.createElement(o.Z.Item,{label:"发票抬头",key:"invoice"},u.P6.dotOptimal(a,"invoice_title","--")),l.createElement(o.Z.Item,{label:"付款金额",key:"report"},"".concat(u.P6.dotOptimal(a,"total_money")?s.fbc.exchangePriceCentToMathFormat(a.total_money):"--","元")),l.createElement(o.Z.Item,{label:"费用金额",key:"expense"},"".concat(u.P6.dotOptimal(a,"tax_deduction")?s.fbc.exchangePriceCentToMathFormat(a.tax_deduction):"--","元")),l.createElement(o.Z.Item,{label:"总税金",key:"tax"},"".concat(u.P6.dotOptimal(a,"tax_money")?s.fbc.exchangePriceCentToMathFormat(a.tax_money):"--","元")),l.createElement(o.Z.Item,{label:"审批单状态",key:"approvalState"},u.P6.dotOptimal(a,"order_state",void 0)?s.DU5.description(u.P6.dotOptimal(a,"order_state")):"--"),l.createElement(o.Z.Item,{label:"付款状态",key:"paymentState"},u.P6.dotOptimal(a,"paid_state",void 0)?s.rTI.description(u.P6.dotOptimal(a,"paid_state")):"--"),l.createElement(o.Z.Item,{label:"验票状态",key:"checkTicketState"},u.P6.dotOptimal(a,"inspect_bill_state",void 0)?s.A1w.description(u.P6.dotOptimal(a,"inspect_bill_state")):"--"),l.createElement(o.Z.Item,{label:"是否红冲",key:"hongchong"},u.P6.dotOptimal(a,"bill_red_push_state",void 0)?s.v7n.description(u.P6.dotOptimal(a,"bill_red_push_state")):"--")],l.createElement(_.IT,{title:"基本信息",className:"affairs-flow-basic"},l.createElement(_.Fp,{cols:4,items:d}))),function(){var t=[l.createElement(o.Z.Item,{label:"付款金额",key:"ledgerReport"},"".concat(u.P6.dotOptimal(a,"total_money")?s.fbc.exchangePriceCentToMathFormat(a.total_money):"--","元")),l.createElement(o.Z.Item,{label:"摊销周期",key:"cycle"},"".concat(u.P6.dotOptimal(a,"allocation_rule_info.allocation_cycle","--"),"期")),l.createElement(o.Z.Item,{label:"摊销日期",key:"date"},"".concat(u.P6.dotOptimal(a,"allocation_rule_info.allocation_start_date",void 0)?r()("".concat(u.P6.dotOptimal(a,"allocation_rule_info.allocation_start_date"))).format("YYYY-MM-DD"):"--","\n          -\n          ").concat(u.P6.dotOptimal(a,"allocation_rule_info.allocation_end_date",void 0)?r()("".concat(u.P6.dotOptimal(a,"allocation_rule_info.allocation_end_date"))).format("YYYY-MM-DD"):"--","\n          ")),l.createElement(o.Z.Item,{label:"残值率",key:"residual"},"".concat(u.P6.dotOptimal(a,"allocation_rule_info.salvage_value_rate","--"),"%"))],e=[{title:"原始科目",dataIndex:"original_subject",key:"original_subject",render:function(){var t=u.P6.dotOptimal(a,"biz_account_info",{})||{};if(!t)return"--";var e=t.name,n=t.ac_code;return e&&n?"".concat(e,"（").concat(n,"）"):e||"--"}},{title:"记账科目",dataIndex:"book_account_info",key:"book_account_info",render:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!t)return"--";var e=t.name,a=t.ac_code;return e&&a?"".concat(e,"（").concat(a,"）"):e||"--"}},{title:"税后金额",dataIndex:"tax_deduction",key:"tax_deduction",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}},{title:"记账月份",dataIndex:"book_month",key:"book_month",render:function(t){return t||"--"}},{title:"应摊总额",dataIndex:"allocation_total_money",key:"allocation_total_money",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}},{title:"税金",dataIndex:"tax_money",key:"tax_money",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}},{title:"本期已摊金额",dataIndex:"allocation_money",key:"allocation_money",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}},{title:"累计已摊金额",dataIndex:"accumulated_allocation_money",key:"accumulated_allocation_money",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}},{title:"未摊总金额",dataIndex:"accumulated_unallocation_money",key:"accumulated_unallocation_money",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}},{title:"残值率",dataIndex:"salvage_value_rate",key:"salvage_value_rate",render:function(t){return t?"".concat(t,"%"):"--"}},{title:"预计残值金额",dataIndex:"pre_salvage_money",key:"pre_salvage_money",render:function(t){return t||0===t?s.fbc.exchangePriceCentToMathFormat(t):"--"}}];return l.createElement(_.IT,{title:"摊销台账明细",className:"affairs-flow-basic"},l.createElement(_.Fp,{cols:4,items:t}),l.createElement(n.Z,{dataSource:u.P6.dotOptimal(a,"allocation_detail_list",[]),columns:e,pagination:!1,bordered:!0}))}())}f.propTypes={amortizationDetail:d().object};e.default=(0,c.connect)((function(t){return{amortizationDetail:t.costAmortization.amortizationDetail}}),(function(t){return{getAmortizationDetail:function(e){return t({type:"costAmortization/getAmortizationDetail",payload:e})},resetAmortizationDetail:function(e){return t({type:"costAmortization/resetAmortizationDetail",payload:e})}}}))(f)}}]);