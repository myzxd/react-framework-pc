"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[3021],{23021:function(e,r,n){n.r(r);n(52560);var t=n(71577),a=n(15671),o=n(43144),i=n(97326),c=n(60136),l=n(82963),d=n(61120),s=n(4942),u=n(55609),f=n(67294),p=n(45697),m=n.n(p),O=n(66939),x=(n(98703),n(34724)),y=n(34089),C=n(19556),Z=n(80385),h=n(68815);function v(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,t=(0,d.Z)(e);if(r){var a=(0,d.Z)(this).constructor;n=Reflect.construct(t,arguments,a)}else n=t.apply(this,arguments);return(0,l.Z)(this,n)}}var g=function(e){(0,c.Z)(n,e);var r=v(n);function n(){var e;(0,a.Z)(this,n);for(var o=arguments.length,c=new Array(o),l=0;l<o;l++)c[l]=arguments[l];return e=r.call.apply(r,[this].concat(c)),(0,s.Z)((0,i.Z)(e),"onSuccessCallback",(function(){window.location.href="/#/Expense/Manage/ExamineOrder"})),(0,s.Z)((0,i.Z)(e),"onEdit",(function(r,n){var t=e.props.location.query,a=t.refundId,o=t.originalId,i=void 0===o?"":o;window.location.href="/#/Expense/Manage/RefundCostOrderForm?orderId=".concat(r,"&refundId=").concat(a,"&costOrderId=").concat(n,"&originalId=").concat(i)})),(0,s.Z)((0,i.Z)(e),"onRefund",(function(r,n,t){var a=e.props.location.query.refundId;window.location.href=t?"/#/Expense/Manage/RefundCostOrderForm?orderId=".concat(r,"&refundId=").concat(a,"&costOrderId=").concat(n,"&originalId=").concat(t):"/#/Expense/Manage/RefundCostOrderForm?orderId=".concat(r,"&refundId=").concat(a,"&costOrderId=").concat(n)})),(0,s.Z)((0,i.Z)(e),"onSuccessCallbackExamineOrderDetail",(function(r){var n=r.flow_id,t=void 0===n?"":n,a=e.props.dispatch;t&&a({type:"expenseExamineFlow/fetchExamineDetail",payload:{id:t}})})),(0,s.Z)((0,i.Z)(e),"renderContent",(function(){var r=e.props,n=r.examineOrderDetail,t=r.originalCostOrder,a=r.examineDetail;return 0===Object.keys(n).length||0===Object.keys(a).length||0===t.length?null:f.createElement("div",null,e.renderBaseInfo(),e.renderAssociatedInfo(),e.renderCostOrder(),e.renderOperate())})),(0,s.Z)((0,i.Z)(e),"renderBaseInfo",(function(){var r=e.props.examineOrderDetail;return 0===Object.keys(r).length?null:f.createElement(x.Z,{detail:r})})),(0,s.Z)((0,i.Z)(e),"renderCostOrder",(function(){var r=e.props,n=r.examineOrderDetail,t=r.examineDetail,a=r.location,o=r.originalCostOrder;return 0===Object.keys(n).length?null:f.createElement(y.Z,{location:a,examineDetail:t,examineOrderDetail:n,originalCostOrder:o,extra:e.renderCollapseExtra})})),(0,s.Z)((0,i.Z)(e),"renderCollapseExtra",(function(r,n){var a=(e.props.originalCostOrder.filter((function(e){return e.id===n}))[0]||{}).refCostOrderInfoList,o=void 0===a?[]:a;if(o.filter((function(e){return e.state!==Z.Vm3.close&&e.state!==Z.Vm3.delete&&e.type===Z.rkq.invoiceAdjust})).length>0)return null;var i,c=o.filter((function(e){return e.state!==Z.Vm3.close&&e.state!==Z.Vm3.delete&&e.type===Z.rkq.refund}));1===c.length&&(i=c[0]._id);var l=f.createElement("a",{key:"edit",onClick:function(){return e.onRefund(r,n,i)}},"编辑"),d=f.createElement(t.Z,{key:r,type:"primary",onClick:function(){return e.onRefund(r,n)}},"发起退款");return c.length>0?l:0===c.length?d:null})),(0,s.Z)((0,i.Z)(e),"renderAssociatedInfo",(function(){var r=e.props.examineOrderDetail,n=r.id,t=r.relationApplicationOrderIds,a=void 0===t?[]:t;return f.createElement(h.Z,{key:"1",relationApplicationOrderId:a,orderId:n})})),(0,s.Z)((0,i.Z)(e),"renderOperate",(function(){var r=e.props,n=r.location,t=r.examineDetail,a=r.examineOrderDetail,o=r.originalCostOrder,i=n.query.refundId,c=o.map((function(e){return e.refCostOrderInfoList}));return[].concat.apply([],c).filter((function(e){return e.type===Z.rkq.refund&&e.state!==Z.Vm3.delete&&e.state!==Z.Vm3.close})).length>0?f.createElement(C.Z,{orderId:i,action:Z.rkq.refund,onSuccessCallback:e.onSuccessCallback,examineDetail:t,examineOrderDetail:a}):null})),e}return(0,o.Z)(n,[{key:"componentDidMount",value:function(){var e=this.props,r=e.dispatch,n=e.location.query.refundId;void 0!==n&&(r({type:"expenseExamineOrder/fetchExamineOrderDetail",payload:{id:n,flag:!0,onSuccessCallback:this.onSuccessCallbackExamineOrderDetail}}),r({type:"expenseCostOrder/fetchOriginalCostOrder",payload:{orderId:n}}))}},{key:"render",value:function(){return this.renderContent()}}]),n}(f.Component);(0,s.Z)(g,"propTypes",{examineOrderDetail:m().object,examineDetail:m().object,location:m().object,originalCostOrder:m().array}),(0,s.Z)(g,"defaultProps",{examineOrderDetail:{},examineDetail:{},location:{},originalCostOrder:[]}),r.default=(0,u.connect)((function(e){return{examineOrderDetail:e.expenseExamineOrder.examineOrderDetail,examineDetail:e.expenseExamineFlow.examineDetail,originalCostOrder:e.expenseCostOrder.originalCostOrder}}))(O.Z.create()(g))}}]);