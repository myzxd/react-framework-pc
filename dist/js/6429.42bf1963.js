"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[6429],{6429:function(e,t,r){r.r(t),r.d(t,{default:function(){return k}});var n=r(15671),o=r(97326),a=r(60136),l=r(82963),c=r(61120),i=r(4942),s=r(93517),p=r.n(s),u=r(67294),m=r(80385),f=r(55609),d=r(66939),y=r(45697),b=r.n(y),g=(r(98703),r(96036)),v=r(97116),Z=r(89789),h=r(80458);function E(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,c.Z)(e);if(t){var o=(0,c.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var R=function(e){(0,a.Z)(r,e);var t=E(r);function r(){var e;(0,n.Z)(this,r);for(var a=arguments.length,l=new Array(a),c=0;c<a;c++)l[c]=arguments[c];return e=t.call.apply(t,[this].concat(l)),(0,i.Z)((0,o.Z)(e),"transFile",(function(e){var t=e;null==t&&(t=[]);var r=[];return t.forEach&&t.forEach((function(e){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t.name=n,t.value=e[n]);r.push(t)})),u.createElement("div",null,r.map((function(e,t){return u.createElement("a",{className:h.Z["app-comp-expense-manage-template-records-renewal-file"],target:"_blank",rel:"noopener noreferrer",key:t,href:e.value},e.name)})))})),(0,i.Z)((0,o.Z)(e),"renderBaseInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"房屋状态",form:m.Bb4.description(m.Bb4.continue)},{label:"申请人",form:p().get(n,"apply_account",v.Iq.account.name)}];return u.createElement(g.IT,{title:"基础信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderRentInfo",(function(){var t,r,n=e.props.orderRecordDetails,o=void 0===n?[]:n,a=p().get(o,"0",{}),l=[{label:"租金",form:m.fbc.exchangePriceToMathFormat(p().get(a,"month_rent","--"))},{label:"续租时间段",form:(t=p().get(a,"relet_start_time"),r=p().get(a,"relet_end_time"),null==t||null==r?"--":"".concat(t," ~ ").concat(r))},{label:"备注",form:p().get(a,"desc","--")},{label:"上传附件",form:e.transFile(p().get(a,"files_address",[]))}];return u.createElement(g.IT,{title:"费用信息"},u.createElement(g.KP,{items:l,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderExpenseInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o={};p().get(n,"catalog_id",[]).forEach((function(e){1===e.level&&(o.subjectOne=e.name),2===e.level&&(o.subjectTwo=e.name),3===e.level&&(o.subjectThree=e.name)}));var a=[{label:"一级科目",form:p().get(o,"subjectOne","--")},{label:"二级科目",form:p().get(o,"subjectTwo","--")},{label:"三级科目",form:p().get(o,"subjectThree","--")},{label:"成本中心",form:m.F$Y.description(p().get(n,"cost_center"))},{label:"成本归属",form:m.eL2.description(p().get(n,"cost_belong"))}],l=p().get(n,"cost_belong_items_zh",[])||[];return u.createElement(g.IT,{title:"项目信息"},u.createElement(g.KP,{items:a,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}),l.map((function(t,r){return e.renderCostItems(t,r)})))})),(0,i.Z)((0,o.Z)(e),"renderCostItems",(function(e,t){var r=[{label:"平台",form:p().get(e,"platform_code","--")},{label:"供应商",form:p().get(e,"supplier_id","--")},{label:"城市",form:p().get(e,"city_spelling","--")},{label:"商圈",form:p().get(e,"biz_id","--")}];e.custom_money&&r.push({label:"分摊金额",form:m.fbc.exchangePriceToMathFormat(p().get(e,"custom_money","--"))});return u.createElement(g.KP,{key:t,items:r,cols:6,layout:{labelCol:{span:9},wrapperCol:{span:15}}})})),(0,i.Z)((0,o.Z)(e),"renderPaymentInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"房租收款人",form:p().get(n,"payee_info.name","--")},{label:"收款账号",form:p().get(n,"payee_info.card_num","--")},{label:"开户支行",form:p().get(n,"payee_info.address","--")}];return u.createElement(g.IT,{title:"支付信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderHistoryInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=p().get(n,"history_id_list",[])||[];return u.createElement(g.IT,{title:"历史信息"},o.map((function(e,t){return u.createElement(Z.Z,{key:t,detail:e})})))})),(0,i.Z)((0,o.Z)(e),"render",(function(){return u.createElement(d.Z,{layout:"horizontal",onSubmit:e.onSubmitTemplate},e.renderBaseInfo(),e.renderRentInfo(),e.renderExpenseInfo(),e.renderPaymentInfo(),e.renderHistoryInfo())})),e}return r}(u.Component);(0,i.Z)(R,"propTypes",{orderRecordDetails:b().array}),(0,i.Z)(R,"defaultProps",{orderRecordDetails:[]});var _=(0,f.connect)((function(e){return{orderRecordDetails:e.approval.orderRecordDetails}}))(d.Z.create()(R));function I(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,c.Z)(e);if(t){var o=(0,c.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var C=function(e){(0,a.Z)(r,e);var t=I(r);function r(){var e;(0,n.Z)(this,r);for(var a=arguments.length,l=new Array(a),c=0;c<a;c++)l[c]=arguments[c];return e=t.call.apply(t,[this].concat(l)),(0,i.Z)((0,o.Z)(e),"transFile",(function(e){var t=e;null==t&&(t=[]);var r=[];return t.forEach&&t.forEach((function(e){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t.name=n,t.value=e[n]);r.push(t)})),u.createElement("div",null,r.map((function(e,t){return u.createElement("a",{className:h.Z["app-comp-expense-manage-template-records-sign-file"],target:"_blank",rel:"noopener noreferrer",key:t,href:e.value},e.name)})))})),(0,i.Z)((0,o.Z)(e),"renderBaseInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"房屋状态",form:m.Bb4.description(m.Bb4.sign)},{label:"申请人",form:p().get(n,"apply_account",v.Iq.account.name)}];return u.createElement(g.IT,{title:"基础信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderRentInfo",(function(){var t,r,n=e.props.orderRecordDetails,o=void 0===n?[]:n,a=p().get(o,"0",{}),l=[{label:"月租金",form:m.fbc.exchangePriceToMathFormat(p().get(a,"month_rent","--"))},{label:"付款月数（月／次）",form:p().get(a,"pay_time","--")},{label:"提前付款天数",form:p().get(a,"payment_date","--")},{label:"续签时间段",form:(t=p().get(a,"contract_start_date"),r=p().get(a,"contract_end_date"),null==t||null==r?"--":"".concat(t," ~ ").concat(r))},{label:"备注",form:p().get(a,"desc","--")},{label:"上传附件",form:e.transFile(p().get(a,"files_address",[]))}];return u.createElement(g.IT,{title:"费用信息"},u.createElement(g.KP,{items:l,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderExpenseInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o={};p().get(n,"catalog_id",[]).forEach((function(e){1===e.level&&(o.subjectOne=e.name),2===e.level&&(o.subjectTwo=e.name),3===e.level&&(o.subjectThree=e.name)}));var a=[{label:"一级科目",form:p().get(o,"subjectOne","--")},{label:"二级科目",form:p().get(o,"subjectTwo","--")},{label:"三级科目",form:p().get(o,"subjectThree","--")},{label:"成本中心",form:m.F$Y.description(p().get(n,"cost_center"))},{label:"成本归属",form:m.eL2.description(p().get(n,"cost_belong"))}],l=p().get(n,"cost_belong_items_zh",[])||[];return u.createElement(g.IT,{title:"项目信息"},u.createElement(g.KP,{items:a,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}),l.map((function(t,r){return e.renderCostItems(t,r)})))})),(0,i.Z)((0,o.Z)(e),"renderCostItems",(function(e,t){var r=[{label:"平台",form:p().get(e,"platform_code","--")},{label:"供应商",form:p().get(e,"supplier_id","--")},{label:"城市",form:p().get(e,"city_spelling","--")},{label:"商圈",form:p().get(e,"biz_id","--")}];e.custom_money&&r.push({label:"分摊金额",form:m.fbc.exchangePriceToMathFormat(p().get(e,"custom_money","--"))});return u.createElement(g.KP,{key:t,items:r,cols:6,layout:{labelCol:{span:9},wrapperCol:{span:15}}})})),(0,i.Z)((0,o.Z)(e),"renderPaymentInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"房租收款人",form:p().get(n,"payee_info.name","--")},{label:"收款账号",form:p().get(n,"payee_info.card_num","--")},{label:"开户支行",form:p().get(n,"payee_info.address","--")}];return u.createElement(g.IT,{title:"支付信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderHistoryInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=p().get(n,"history_id_list",[])||[];return u.createElement(g.IT,{title:"历史信息"},o.map((function(e,t){return u.createElement(Z.Z,{key:t,detail:e})})))})),(0,i.Z)((0,o.Z)(e),"render",(function(){return u.createElement(d.Z,{layout:"horizontal",onSubmit:e.onSubmitTemplate},e.renderBaseInfo(),e.renderRentInfo(),e.renderExpenseInfo(),e.renderPaymentInfo(),e.renderHistoryInfo())})),e}return r}(u.Component);(0,i.Z)(C,"propTypes",{orderRecordDetails:b().array}),(0,i.Z)(C,"defaultProps",{orderRecordDetails:[]});var x=(0,f.connect)((function(e){return{orderRecordDetails:e.approval.orderRecordDetails}}))(d.Z.create()(C));function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,c.Z)(e);if(t){var o=(0,c.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var T=function(e){(0,a.Z)(r,e);var t=P(r);function r(){var e;(0,n.Z)(this,r);for(var a=arguments.length,l=new Array(a),c=0;c<a;c++)l[c]=arguments[c];return e=t.call.apply(t,[this].concat(l)),(0,i.Z)((0,o.Z)(e),"renderBaseInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"房屋状态",form:m.Bb4.description(m.Bb4.break)},{label:"申请人",form:p().get(n,"apply_account",v.Iq.account.name)}];return u.createElement(g.IT,{title:"基础信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderRentInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"余额(注：断租退回余额)",form:m.fbc.exchangePriceToMathFormat(p().get(n,"remain_money","--"))},{label:"断租时间",form:p().get(n,"relet_break_date","--")},{label:"备注",form:p().get(n,"desc","--")}];return u.createElement(g.IT,{title:"费用信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderHistoryInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=p().get(n,"history_id_list",[])||[];return u.createElement(g.IT,{title:"历史信息"},o.map((function(e,t){return u.createElement(Z.Z,{key:t,detail:e})})))})),(0,i.Z)((0,o.Z)(e),"render",(function(){return u.createElement(d.Z,{layout:"horizontal",onSubmit:e.onSubmitTemplate},e.renderBaseInfo(),e.renderRentInfo(),e.renderHistoryInfo())})),e}return r}(u.Component);(0,i.Z)(T,"propTypes",{orderRecordDetails:b().array}),(0,i.Z)(T,"defaultProps",{orderRecordDetails:[]});var B=(0,f.connect)((function(e){return{orderRecordDetails:e.approval.orderRecordDetails}}))(T);function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,c.Z)(e);if(t){var o=(0,c.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var D=function(e){(0,a.Z)(r,e);var t=w(r);function r(){var e;(0,n.Z)(this,r);for(var a=arguments.length,l=new Array(a),c=0;c<a;c++)l[c]=arguments[c];return e=t.call.apply(t,[this].concat(l)),(0,i.Z)((0,o.Z)(e),"renderBaseInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"房屋状态",form:m.Bb4.description(m.Bb4.cancel)},{label:"申请人",form:p().get(n,"apply_account",v.Iq.account.name)}];return u.createElement(g.IT,{title:"基础信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderRentInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=[{label:"退换押金(注：退还押金有变动请说明原因)",form:m.fbc.exchangePriceToMathFormat(p().get(n,"deposit","--"))},{label:"备注",form:p().get(n,"desc","--")}];return u.createElement(g.IT,{title:"费用信息"},u.createElement(g.KP,{items:o,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderHistoryInfo",(function(){var t=e.props.orderRecordDetails,r=void 0===t?[]:t,n=p().get(r,"0",{}),o=p().get(n,"history_id_list",[])||[];return u.createElement(g.IT,{title:"历史信息"},o.map((function(e,t){return u.createElement(Z.Z,{key:t,detail:e})})))})),(0,i.Z)((0,o.Z)(e),"render",(function(){return u.createElement(d.Z,{layout:"horizontal",onSubmit:e.onSubmitTemplate},e.renderBaseInfo(),e.renderRentInfo(),e.renderHistoryInfo())})),e}return r}(u.Component);(0,i.Z)(D,"propTypes",{orderRecordDetails:b().array}),(0,i.Z)(D,"defaultProps",{orderRecordDetails:[]});var j=(0,f.connect)((function(e){return{orderRecordDetails:e.approval.orderRecordDetails}}))(D);function K(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,c.Z)(e);if(t){var o=(0,c.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var q=function(e){(0,a.Z)(r,e);var t=K(r);function r(e){var a;(0,n.Z)(this,r),a=t.call(this,e),(0,i.Z)((0,o.Z)(a),"render",(function(){var e=a.state.houseState;switch(Number(e)){case m.Bb4.continue:return u.createElement(_,{query:a.state.query});case m.Bb4.sign:return u.createElement(x,{query:a.state.query});case m.Bb4.break:return u.createElement(B,{query:a.state.query});case m.Bb4.cancel:return u.createElement(j,{query:a.state.query});default:return u.createElement("div",null)}}));var l=p().get(e,"location.query.houseState",""),c=p().get(e,"location.query",{});return a.state={houseState:l,query:c},a}return r}(u.Component),k=q},89789:function(e,t,r){var n=r(15671),o=r(97326),a=r(60136),l=r(82963),c=r(61120),i=r(4942),s=r(93517),p=r.n(s),u=r(45697),m=r.n(u),f=r(66939),d=(r(98703),r(67294)),y=r(96036),b=r(80385),g=r(80458);function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,c.Z)(e);if(t){var o=(0,c.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var Z=function(e){(0,a.Z)(r,e);var t=v(r);function r(){var e;(0,n.Z)(this,r);for(var a=arguments.length,l=new Array(a),c=0;c<a;c++)l[c]=arguments[c];return e=t.call.apply(t,[this].concat(l)),(0,i.Z)((0,o.Z)(e),"transFile",(function(e){var t=e;null==t&&(t=[]);var r=[];return t.forEach&&t.forEach((function(e){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t.name=n,t.value=e[n]);r.push(t)})),d.createElement("div",null,r.map((function(e,t){return d.createElement("a",{className:g.Z["app-comp-expense-manage-template-detail-rent-file"],target:"_blank",rel:"noopener noreferrer",key:t,href:e.value},e.name)})))})),(0,i.Z)((0,o.Z)(e),"renderPaymentInfo",(function(){return d.createElement(y.IT,{title:"支付信息",className:g.Z["app-comp-expense-manage-template-detail-rent"]},d.createElement(y.KP,{items:[{label:"房租收款人",form:"123"},{label:"收款账号",form:"123"},{label:"开户支行",form:"123"}],cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"renderRentInfo",(function(){var t=e.props.detail,r=void 0===t?{}:t,n=[{label:"备注",form:"123"},{label:"上传附件",form:e.transFile(p().get(r,"files_address",[]))}],o=p().get(r,"cost_belong_items_zh",[])||[],a={labelCol:{span:9},wrapperCol:{span:15}};return d.createElement(y.IT,{title:"租金信息",className:g.Z["app-comp-expense-manage-template-detail-rent"]},d.createElement(y.KP,{items:[{label:"月租金",form:"10000元"},{label:"租金时间段",form:"10000元"},{label:"合计金额",form:"10000元"}],cols:3,layout:a}),d.createElement(y.KP,{items:[{label:"科目",form:"房屋租金（10201）"}],cols:3,layout:a}),d.createElement(y.KP,{items:[{label:"成本分摊",form:"123"}],cols:3,layout:a}),o.map((function(t,r){return e.renderCostItems(t,r)})),d.createElement(y.KP,{items:n,cols:1,layout:{labelCol:{span:3},wrapperCol:{span:21}}}),e.renderPaymentInfo())})),(0,i.Z)((0,o.Z)(e),"renderCostItems",(function(e,t){var r=[{label:"平台",form:p().get(e,"platform_code","--")},{label:"供应商",form:p().get(e,"supplier_id","--")},{label:"城市",form:p().get(e,"city_spelling","--")},{label:"商圈",form:p().get(e,"biz_id","--")}];e.custom_money&&r.push({label:"分摊金额",form:b.fbc.exchangePriceToMathFormat(p().get(e,"custom_money","--"))}),p().get(e,"city_spelling","")||p().get(e,"biz_id","");return d.createElement("div",null,d.createElement(y.KP,{key:t,items:r,cols:6,layout:{labelCol:{span:9},wrapperCol:{span:15}}}))})),(0,i.Z)((0,o.Z)(e),"render",(function(){var t=e.props.title;return d.createElement("div",null,d.createElement(f.Z,{layout:"horizontal"},d.createElement(y.IT,{title:t},e.renderRentInfo())))})),e}return r}(d.Component);(0,i.Z)(Z,"propTypes",{title:m().string,detail:m().object}),(0,i.Z)(Z,"defaultProps",{title:"",detail:{}}),t.Z=Z},80458:function(e,t){t.Z={"app-comp-expense-manage-common-moneywrap":"Nx6pcNgUm11iqghWZiEr","app-comp-expense-manage-common-moneyiconlight":"b6WIIy0O9bubEiHobfeY","app-comp-expense-manage-common-moneytextlight":"ZO93xNaAgThs1lhcOUFD","app-comp-expense-manage-common-moneyicongrey":"Yfp9hs2RVbKroCanlbOU",moneytextgrey:"IlV2f9ndKVq8O2xj_DNQ","label-required":"WepBEM2kyiLcqo2M48kc","app-comp-expense-manage-template-detail-refund-file":"vVXZlzycuUEqxFZT6ZAW","app-comp-expense-manage-template-detail-refund-project":"iJjjTXH01UxT4uI8TYBU","app-comp-expense-manage-template-detail-refund-share":"hug8BEVJ39ndhobBPYQX","app-comp-expense-manage-template-detail-rent-file":"hVS65iMh3yq805JVuzU2","app-comp-expense-manage-template-detail-rent":"XRqNxoBcWkMuicinHARw","app-comp-expense-manage-template-detail-travel-share":"gUQuAMoncJLPaKwo7NwZ","app-comp-expense-manage-template-detail-travel-project":"fcIlo8ZqoB4OeLkvUsUe","app-comp-expense-manage-template-records-renewal-file":"vCPUxadbE5ChWPXLXXhE","app-comp-expense-manage-template-records-sign-file":"QRRAr2P78iCVvtrW6aqg","app-comp-expense-manage-template-records-form-sign-file":"u1PvnCBSv1aHRRzOJPjz","app-comp-expense-manage-common-expense-project":"SjrKrXeaXSyEay0xzQDH","app-comp-expense-manage-common-house-info-icon":"avArGJHtbTFEzNfajQCH","app-comp-expense-manage-common-house-info":"TBK4h94NnqbJBSBg1j_G","app-comp-expense-manage-common-district":"GZD8nqvobEDCxLA4WKYR","app-comp-expense-manage-common-item":"uEbtKZBzuhvZ_DRvo8Yn","app-comp-expense-manage-cost-item":"duBhZwwhY53798zw3_hQ","app-comp-expense-manage-collection":"jiUx0n2c4spK5kLal3fV","app-comp-expense-manage-collection-adjust":"BsFGHLvsC9wtG8tjnNHU"}}}]);