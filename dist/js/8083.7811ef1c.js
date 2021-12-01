"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[8083],{79743:function(e,t,a){a(13062);var n=a(71230),r=(a(89032),a(15746)),o=a(15671),c=a(43144),l=a(97326),i=a(60136),s=a(82963),p=a(61120),m=a(4942),u=a(94315),d=a.n(u),f=a(93517),y=a.n(f),v=a(30381),b=a.n(v),C=a(55609),g=a(67294),h=a(80385),Z=a(96036);function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=(0,p.Z)(e);if(t){var r=(0,p.Z)(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return(0,s.Z)(this,a)}}var _=function(e){(0,i.Z)(a,e);var t=x(a);function a(){var e;(0,o.Z)(this,a);for(var c=arguments.length,i=new Array(c),s=0;s<c;s++)i[s]=arguments[s];return e=t.call.apply(t,[this].concat(i)),(0,m.Z)((0,l.Z)(e),"getCostTargetId",(function(e,t){return e===h.F$Y.project?t.platform_code:e===h.F$Y.headquarter?t.supplier_id:e===h.F$Y.city?t.city_code:e===h.F$Y.district||e===h.F$Y.knight?t.biz_district_id:void 0})),(0,m.Z)((0,l.Z)(e),"fetchAllocationName",(function(e){var t,a=e.platform_name,n=e.supplier_name,r=e.city_name,o=e.biz_district_name;return d().existy(a)&&d().not.empty(a)&&(t="".concat(a)),d().existy(n)&&d().not.empty(n)&&(t="".concat(a," - ").concat(n)),d().existy(r)&&d().not.empty(r)&&(t="".concat(a," - ").concat(n," - ").concat(r)),d().existy(o)&&d().not.empty(o)&&(t="".concat(a," - ").concat(n," - ").concat(r," - ").concat(o)),t})),(0,m.Z)((0,l.Z)(e),"fetchAmountMoney",(function(t){var a=e.props,n=a.detail,r=a.examineOrderDetail,o=a.costOrderSubmitSummary,c=a.costOrderAmountSummary,l=n.cost_accounting_info,i=(l=void 0===l?{_id:"",cost_center_type:""}:l)._id,s=l.cost_center_type,p=r.submitAt,m=void 0===p?void 0:p,u=e.getCostTargetId(s,t),d="",f="";m?(d=b()(m).format("YYYYMM"),f=b()(m).format("YYYY-MM-DD")):(d=b()().format("YYYYMM"),f=b()().format("YYYY-MM-DD"));var v="".concat(i,"-").concat(u,"-").concat(d),C="".concat(i,"-").concat(u,"-").concat(f);return{submitMoney:y().get(o,"".concat(C,".amountMoney"),0),totalMoney:y().get(c,"".concat(v,".money"),0)}})),(0,m.Z)((0,l.Z)(e),"renderCostShare",(function(){var t=e.props.detail,a=t.cost_allocation_list,o=void 0===a?[]:a,c=t.allocation_mode;return g.createElement("div",null,g.createElement(n.Z,null,g.createElement(r.Z,{span:24},h.eL2.description(c)),g.createElement(r.Z,{span:24},o.map((function(t,a){return e.renderCostShareItems(t,a)})))))})),(0,m.Z)((0,l.Z)(e),"renderCostShareItems",(function(t,a){var o=t.money,c=e.fetchAmountMoney(t),l=c.submitMoney,i=c.totalMoney,s=e.fetchAllocationName(t),p=[{label:"当月已提报费用合计",span:9,layout:{labelCol:{span:15},wrapperCol:{span:9}},form:"".concat(h.fbc.exchangePriceCentToMathFormat(l),"元")},{label:"当月已付款费用合计",span:9,layout:{labelCol:{span:15},wrapperCol:{span:9}},form:"".concat(h.fbc.exchangePriceCentToMathFormat(i),"元")}];return o&&p.unshift({label:"分摊金额",span:6,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:"".concat(h.fbc.exchangePriceToYuan(o),"元")}),g.createElement(n.Z,{key:a},g.createElement(r.Z,{span:10},s),g.createElement(r.Z,{span:14},g.createElement(Z.KP,{items:p})))})),(0,m.Z)((0,l.Z)(e),"renderContent",(function(){var t=[{label:"成本分摊",layout:{labelCol:{span:3},wrapperCol:{span:21}},form:e.renderCostShare()}];return g.createElement(Z.KP,{items:t,cols:1})})),e}return(0,c.Z)(a,[{key:"componentDidMount",value:function(){var e=this,t=this.props,a=t.detail,n=t.examineOrderDetail,r=a.cost_allocation_list,o=void 0===r?[]:r,c=a.application_order_id,l=a.cost_accounting_info,i=(l=void 0===l?{_id:"",cost_center_type:""}:l)._id,s=l.cost_center_type,p=n.submitAt;o.forEach((function(t){var a={costCenter:s,costTargetId:e.getCostTargetId(s,t),subjectId:i,applicationOrderId:c,submitAt:p},n={costCenter:s,applicationOrderId:c,accountingId:i,costTargetId:e.getCostTargetId(s,t),platformCode:t.platformCode,supplierId:t.supplierId,cityCode:t.cityCode,bizDistrictId:t.bizDistrictId,submitAt:p,assetsId:t.assetsId};e.props.dispatch({type:"expenseCostOrder/fetchAmountSummary",payload:a}),e.props.dispatch({type:"expenseCostOrder/fetchSubmitSummary",payload:n})}))}},{key:"render",value:function(){return this.renderContent()}}]),a}(g.Component);t.Z=(0,C.connect)((function(e){var t=e.expenseCostOrder;return{costOrderAmountSummary:t.costOrderAmountSummary,costOrderSubmitSummary:t.costOrderSubmitSummary}}))(_)},54971:function(e,t,a){a.d(t,{Z:function(){return k}});a(13062);var n=a(71230),r=(a(89032),a(15746)),o=a(15671),c=a(43144),l=a(97326),i=a(60136),s=a(82963),p=a(61120),m=a(4942),u=a(94315),d=a.n(u),f=a(93517),y=a.n(f),v=a(30381),b=a.n(v),C=a(55609),g=a(45697),h=a.n(g),Z=a(67294),x=a(80385),_=a(96036),I=a(79743),Y=a(38109),E=_.KT.CoreFinderList,O=function(e){var t,a,n,r,o=e.detail,c=e.examineOrderDetail,l=o.attachment_private_urls,i=o.attachments,s=o.note,p=o.invoice_title,m=o.cost_accounting_info,u=(m=void 0===m?{name:""}:m).name,d=o.cost_group_name,f=o.total_money,v=function(e,t){if(Array.isArray(e)&&y().get(e,"0")){var a=e.map((function(e,a){return{key:t[a],url:e}}));return Z.createElement(E,{data:a,enableTakeLatest:!1})}return"--"};return Z.createElement("div",{className:Y.Z["app-comp-expense-manage-refund-cost-wrap"]},Z.createElement("h2",{span:4,className:Y.Z["app-comp-expense-manage-refund-cost-title"]},"退款申请单"),(r=[{label:"退款金额",form:f?x.fbc.exchangePriceToYuan(f):"--"},{label:"费用分组",form:d||"--"},{label:"科目",form:u||"--"}],Z.createElement(_.KP,{cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}},items:r})),Z.createElement(I.Z,{detail:o,examineOrderDetail:c}),(t=[{label:"备注",form:s}],a=[{label:"发票抬头",form:p}],n={labelCol:{span:3},wrapperCol:{span:21}},Z.createElement("div",null,Z.createElement(_.KP,{items:t,cols:1,layout:n}),Z.createElement(_.KP,{items:a,cols:1,layout:n}))),function(){var e=[{label:"上传附件",form:v(l,i)}];return Z.createElement(_.KP,{items:e,cols:1,layout:{labelCol:{span:3},wrapperCol:{span:21}}})}())},S=a(38386);function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=(0,p.Z)(e);if(t){var r=(0,p.Z)(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return(0,s.Z)(this,a)}}var w=_.KT.CoreFinderList,P=function(e){(0,i.Z)(a,e);var t=A(a);function a(e){var c;return(0,o.Z)(this,a),c=t.call(this,e),(0,m.Z)((0,l.Z)(c),"onChangePreview",(function(e,t){if(t&&e){var a;return a=e.match(/\.(\w+)$/)[1],void c.onUploadSuccess(a,t,e)}c.props.dispatch({type:"applicationFiles/fetchKeyUrl",payload:{key:e,onUploadSuccess:function(t,a){return c.onUploadSuccess(t,a,e)}}})})),(0,m.Z)((0,l.Z)(c),"onUploadSuccess",(function(e,t,a){c.setState({fileName:a,fileType:e,fileUrl:t,visible:!0})})),(0,m.Z)((0,l.Z)(c),"getCostTargetId",(function(e,t){return e===x.F$Y.project?t.platformCode:e===x.F$Y.headquarter?t.supplierId:e===x.F$Y.city?t.cityCode:e===x.F$Y.district||e===x.F$Y.knight?t.bizDistrictId:void 0})),(0,m.Z)((0,l.Z)(c),"setVisible",(function(){c.setState({visible:!1})})),(0,m.Z)((0,l.Z)(c),"fetchCostOrderAmountSummay",(function(e){var t=e.costAllocationList,a=e.costCenterType,n=e.costAccountingId,r=e.applicationOrderId,o=c.props.examineOrderDetail.submitAt;t.forEach((function(e){var t={costCenter:a,costTargetId:c.getCostTargetId(a,e),subjectId:n,applicationOrderId:r,submitAt:o},l={costCenter:a,applicationOrderId:r,accountingId:n,costTargetId:c.getCostTargetId(a,e),platformCode:e.platformCode,supplierId:e.supplierId,cityCode:e.cityCode,bizDistrictId:e.bizDistrictId,submitAt:o,assetsId:e.assetsId};c.props.dispatch({type:"expenseCostOrder/fetchAmountSummary",payload:t}),c.props.dispatch({type:"expenseCostOrder/fetchSubmitSummary",payload:l})}))})),(0,m.Z)((0,l.Z)(c),"renderCorePreview",(function(e,t){if(Array.isArray(e)&&y().get(e,"0")){var a=e.map((function(e,a){return{key:t[a],url:e}}));return Z.createElement(w,{data:a})}return"--"})),(0,m.Z)((0,l.Z)(c),"renderCostShare",(function(){var e=c.props.costOrderDetail,t=y().get(e,"costAllocationList",[])||[];return Z.createElement("div",null,Z.createElement(n.Z,null,Z.createElement(r.Z,{span:24},x.eL2.description(y().get(e,"allocationMode"))),Z.createElement(r.Z,{span:24},t.map((function(e,t){return c.renderCostShareItems(e,t)})))))})),(0,m.Z)((0,l.Z)(c),"renderCostShareItems",(function(e,t){var a,o=c.props,l=o.examineOrderDetail,i=o.costOrderDetail,s=e.platformName,p=e.supplierName,m=e.cityName,u=e.bizDistrictName,f=c.props,v=f.costOrderAmountSummary,C=f.costOrderSubmitSummary,g=i.costAccountingId,h=i.costCenterType,I=c.getCostTargetId(h,e);d().existy(s)&&d().not.empty(s)&&(a="".concat(s)),d().existy(p)&&d().not.empty(p)&&(a="".concat(s," - ").concat(p)),d().existy(m)&&d().not.empty(m)&&(a="".concat(s," - ").concat(p," - ").concat(m)),d().existy(u)&&d().not.empty(u)&&(a="".concat(s," - ").concat(p," - ").concat(m," - ").concat(u));var Y=y().get(l,"submitAt",void 0),E="",O="";Y?(E=b()(Y).format("YYYYMM"),O=b()(Y).format("YYYY-MM-DD")):(E=b()().format("YYYYMM"),O=b()().format("YYYY-MM"));var S="".concat(g,"-").concat(I,"-").concat(E),A="".concat(g,"-").concat(I,"-").concat(O),w=y().get(C,"".concat(A,".amountMoney"),0),P=y().get(v,"".concat(S,".money"),0),k=[{label:"当月已提报费用合计",span:9,layout:{labelCol:{span:15},wrapperCol:{span:9}},form:"".concat(x.fbc.exchangePriceCentToMathFormat(w),"元")},{label:"当月已付款费用合计",span:9,layout:{labelCol:{span:15},wrapperCol:{span:9}},form:"".concat(x.fbc.exchangePriceCentToMathFormat(P),"元")}];return e.money&&k.unshift({label:"分摊金额",span:6,layout:{labelCol:{span:13},wrapperCol:{span:11}},form:"".concat(x.fbc.exchangePriceToYuan(y().get(e,"money","--")),"元")}),Z.createElement(n.Z,{key:t},Z.createElement(r.Z,{span:10},a),Z.createElement(r.Z,{span:14},Z.createElement(_.KP,{items:k,key:t})))})),(0,m.Z)((0,l.Z)(c),"renderOringinal",(function(){var e=c.props,t=e.recordId,a=e.costOrderDetail,n=e.isInvoiceAdjust;if(0===a.length)return Z.createElement("div",null);if(!a||0===Object.keys(a).length)return Z.createElement("div",null);var r=a.id,o=a.totalMoney,l=void 0===o?"":o,i=a.invoiceFlag,s=void 0===i?void 0:i,p=a.costGroupName,m=void 0===p?"":p,u=a.costAccountingInfo,d=(u=void 0===u?{name:""}:u).name,f=a.costAccountingCode,v=void 0===f?"":f,b=a.invoiceTitle,C=void 0===b?"":b,g=a.note,h=void 0===g?"":g,I=a.payeeInfo,Y=I.card_num,E=I.card_name,O=I.bank_details,S=[{label:"费用单号",form:r||""}],A=[{label:"费用金额",form:l?n?"-".concat(x.fbc.exchangePriceToYuan(l),"元"):"".concat(x.fbc.exchangePriceToYuan(l),"元"):"--"},{label:"是否开票",form:s?"是":"否"},{label:"费用分组",form:m||"--"},{label:"科目",form:d&&v?"".concat(d).concat(v):"--"}],w=[{label:"成本分摊",layout:{labelCol:{span:2},wrapperCol:{span:22}},form:c.renderCostShare()}],P=[{label:"发票抬头",layout:{labelCol:{span:2},wrapperCol:{span:22}},form:C||"--"},{label:"备注",layout:{labelCol:{span:2},wrapperCol:{span:22}},form:h||"--"},{label:"上传附件",layout:{labelCol:{span:2},wrapperCol:{span:22}},form:c.renderCorePreview(y().get(a,"attachmentPrivateUrls",[]),y().get(a,"attachments",[]))}],k=[{label:"收款人",layout:{labelCol:{span:9,pull:3},wrapperCol:{span:15,pull:3}},form:E||"--"},{label:"收款账号",form:Y||"--"},{label:"开户支行",form:O||"--"}],D={labelCol:{span:9},wrapperCol:{span:15}};return Z.createElement("div",{key:t},Z.createElement(_.KP,{items:S,cols:4,layout:D}),Z.createElement(_.KP,{items:A,cols:4,layout:D}),Z.createElement(_.KP,{items:w,cols:1}),Z.createElement(_.KP,{items:P,cols:1}),Z.createElement(_.KP,{items:k,cols:3,layout:D}))})),(0,m.Z)((0,l.Z)(c),"renderInvoice",(function(){var e=c.props,t=e.costOrderDetail,a=e.examineOrderDetail,n=t.refCostOrderInfoList,r=void 0===n?[]:n,o=a.applicationSubType;if(0===r.length)return null;var l=r.filter((function(e){return e.state!==x.Vm3.delete&&e.state!==x.Vm3.close}));return 0===l.length?null:Z.createElement("div",null,l.map((function(e,t){return e.type===x.rkq.refund&&o===x.rkq.refund?Z.createElement(O,{key:t,detail:e,examineOrderDetail:a}):e.type===x.rkq.invoiceAdjust&&e.total_money>0&&o===x.rkq.invoiceAdjust?Z.createElement(S.Z,{key:t,isShow:!0,detail:e,examineOrderDetail:a}):null})))})),(0,m.Z)((0,l.Z)(c),"render",(function(){return Z.createElement("div",null,c.renderOringinal(),c.renderInvoice())})),c.state={fileList:[],fileType:null,fileUrl:null,visible:!1,fileName:""},c}return(0,c.Z)(a,[{key:"componentDidMount",value:function(){var e=this.props.costOrderDetail;this.fetchCostOrderAmountSummay(e)}}]),a}(Z.Component);(0,m.Z)(P,"propTypes",{recordId:h().string,examineOrderDetail:h().object,costOrderDetail:h().object}),(0,m.Z)(P,"defaultProps",{recordId:"",examineDetail:{},examineOrderDetail:{},costOrderDetail:{},isRefund:!1});var k=(0,C.connect)((function(e){var t=e.expenseCostOrder;return{costOrderAmountSummary:t.costOrderAmountSummary,costOrderSubmitSummary:t.costOrderSubmitSummary}}))(P)},38386:function(e,t,a){var n=a(67294),r=a(96036),o=a(80385),c=a(79743),l=a(36621);t.Z=function(e){var t,a,i,s,p=e.isShow,m=e.detail,u=e.examineOrderDetail,d=m.attachment_private_urls,f=void 0===d?[]:d,y=m.attachments,v=void 0===y?[]:y,b=m.note,C=m.invoice_title,g=m.cost_accounting_info,h=(g=void 0===g?{name:""}:g).name,Z=m.cost_group_name,x=m.invoice_flag,_=m.total_money,I=m.payee_info,Y=(I=void 0===I?{card_name:"",card_num:"",bank_details:""}:I).card_name,E=I.card_num,O=I.bank_details;return n.createElement("div",{className:p?l.Z["app-comp-expense-manage-invoiceAdjust-cost-wrap"]:null},p?n.createElement("h2",{span:4,className:l.Z["app-comp-expense-manage-invoiceAdjust-cost-title"]},"红冲申请单"):null,(s=[{label:"费用分组",form:Z||"--"},{label:"科目",form:h||"--"},{label:"费用金额",form:_?o.fbc.exchangePriceToYuan(_):"--"},{label:"是否开发票",form:x?"是":"否"}],n.createElement(r.KP,{cols:4,layout:{labelCol:{span:9},wrapperCol:{span:15}},items:s})),n.createElement(c.Z,{detail:m,examineOrderDetail:u}),(t=[{label:"备注",form:b}],a=[{label:"发票抬头",form:C}],i={labelCol:{span:3},wrapperCol:{span:21}},n.createElement("div",null,n.createElement(r.KP,{items:t,cols:1,layout:i}),n.createElement(r.KP,{items:a,cols:1,layout:i}))),function(){var e,t,a=[{label:"上传附件",form:(e=f,t=v,n.createElement("div",null,e.map((function(e,a){return n.createElement("a",{className:l.Z["app-comp-expense-manage-template-detail-refund-file"],rel:"noopener noreferrer",target:"_blank",key:a,href:e},t[a])}))))}];return n.createElement(r.KP,{items:a,cols:1,layout:{labelCol:{span:3},wrapperCol:{span:21}}})}(),function(){var e=[{label:"收款人",form:Y||"--"},{label:"收款账号",form:E||"--"},{label:"开户支行",form:O||"--"}];return n.createElement(r.KP,{items:e,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}})}())}},38108:function(e,t){t.Z={"app-comp-expense-detail-tag-core":"V6RAsEsHw_HvSEaIw3b0","app-comp-expense-detail-tag-wrap":"PbjBMX9J16vJ2i4p0dZI","app-comp-expense-detail-tag-save":"gwUUYx9qVUN7LGim4Frh","app-comp-expense-detail-tag-select":"lfP3VrlTndVpIBWCkfZc","app-comp-expense-detail-order-info-ext":"LVPgqAOY1X7yFlpzhY_M","app-comp-expense-manage-refund-form-upload":"JLbYv3wpuSxyMbU4wZqt","app-comp-expense-cost-order-item-files-link":"UbzEcLfm_SOXsOMAFUCK","app-comp-expense-cost-order-item-update-cost-money":"NK39ICsFIiNh_QLpVDWt","app-comp-expense-manage-form-upload":"CDNra2TTNQg2Zom90aI0","app-comp-expense-manage-form-submit":"WJNY_P60uP68QpbQC0xg","app-comp-expense-form-modal-next-approval-wrap":"mizENYYRIcxk2u9WnksU","app-comp-expense-form-modal-next-approval":"vHk499lfzWK0qk5Nrqm8"}},36621:function(e,t){t.Z={"app-comp-expense-invoiceAdjust-operate-wrap":"XueIrR_sxf4tEoClPoAv","app-comp-expense-invoiceAdjust-operate-done":"iq1kYQXeygaglUmkmNsg","app-comp-expense-manage-template-detail-refund-file":"apyjXPsiouLMhlIQ6rto","app-comp-expense-manage-invoiceAdjust-cost-operate":"NaZ6jNXZ6F1wpVKL7Boi","app-comp-expense-manage-invoiceAdjust-cost-wrap":"JnbjMv4rkyjArqYuzXJi","app-comp-expense-manage-invoiceAdjust-cost-title":"YHS_daawSnhfznmxuh75"}},38109:function(e,t){t.Z={"app-comp-expense-manage-refund-cost-wrap":"OSu6TZBULWexob2geXRX","app-comp-expense-manage-refund-cost-title":"iTTB96afUyKFWJQobg7L","app-comp-expense-refund-operate-wrap":"_uBrZeA4wsZBJBfNoD8g","app-comp-expense-refund-save":"KC9wSkvPwyjrvLzUGbRL"}}}]);