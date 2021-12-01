"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[5830],{55509:function(e,t,r){r.d(t,{Z:function(){return j}});r(36616);var n=r(51368),a=r(15671),o=r(43144),l=r(97326),i=r(60136),c=r(82963),s=r(61120),u=r(4942),p=(r(29093),r(16317)),f=r(93517),m=r.n(f),d=r(94315),v=r.n(d),y=r(67294),h=r(96036),b=r(80385);function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Z(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(Object(r),!0).forEach((function(t){(0,u.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,s.Z)(e);if(t){var a=(0,s.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,c.Z)(this,r)}}var D=function(e){(0,i.Z)(r,e);var t=O(r);function r(e){var o;return(0,a.Z)(this,r),o=t.call(this,e),(0,u.Z)((0,l.Z)(o),"onChangeSubsidyFee",(function(e){var t=o.state.value;t.subsidy_fee=e,o.setState({value:t}),o.triggerChange(Z({},t))})),(0,u.Z)((0,l.Z)(o),"onChangeStayFee",(function(e){var t=o.state.value;t.stay_fee=e,o.setState({value:t}),o.triggerChange(Z({},t))})),(0,u.Z)((0,l.Z)(o),"onChangeTransportFee",(function(e){var t=o.state.value;t.transport_fee=e,o.setState({value:t}),o.triggerChange(Z({},t))})),(0,u.Z)((0,l.Z)(o),"onChangeurBanTransportFee",(function(e){var t=o.state.value;t.urban_transport_fee=e,o.setState({value:t}),o.triggerChange(Z({},t))})),(0,u.Z)((0,l.Z)(o),"onChangeOtherFee",(function(e){var t=o.state.value;t.other_fee=e,o.setState({value:t}),o.triggerChange(Z({},t))})),(0,u.Z)((0,l.Z)(o),"triggerChange",(function(e){var t=o.props.onChange;t&&t(Object.assign({},o.state.value,e))})),(0,u.Z)((0,l.Z)(o),"renderDetailed",(function(){var e=o.state.value,t=[{label:"补助(元)",style:{marginRight:10},form:y.createElement(n.Z,{value:e.subsidy_fee,onChange:o.onChangeSubsidyFee,min:0,step:.01,formatter:b.fbc.limitDecimals,parser:b.fbc.limitDecimals})},{label:"住宿(元)",style:{marginRight:10},form:y.createElement(n.Z,{value:e.stay_fee,min:0,step:.01,formatter:b.fbc.limitDecimals,parser:b.fbc.limitDecimals,onChange:o.onChangeStayFee})},{label:"往返交通费(元)",style:{marginRight:10},form:y.createElement(n.Z,{value:e.transport_fee,min:0,step:.01,formatter:b.fbc.limitDecimals,parser:b.fbc.limitDecimals,onChange:o.onChangeTransportFee})},{label:"市内交通费(元)",style:{marginRight:10},form:y.createElement(n.Z,{value:e.urban_transport_fee,min:0,step:.01,formatter:b.fbc.limitDecimals,parser:b.fbc.limitDecimals,onChange:o.onChangeurBanTransportFee})},{label:"其他(元)",form:y.createElement(n.Z,{value:e.other_fee,min:0,step:.01,formatter:b.fbc.limitDecimals,parser:b.fbc.limitDecimals,onChange:o.onChangeOtherFee})}];return y.createElement("div",null,t.map((function(e,t){return y.createElement("span",{key:t,style:e.style},e.label,": ",e.form)})))})),o.state={value:m().get(e,"value",{})},o}return(0,o.Z)(r,[{key:"render",value:function(){return y.createElement("div",null,this.renderDetailed())}}],[{key:"getDerivedStateFromProps",value:function(e,t){return e.value!==t.value?{value:e.value}:null}}]),r}(y.Component);function _(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?_(Object(r),!0).forEach((function(t){(0,u.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):_(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,s.Z)(e);if(t){var a=(0,s.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,c.Z)(this,r)}}var P=p.Z.Option,Y=function(e){(0,i.Z)(r,e);var t=C(r);function r(){var e;(0,a.Z)(this,r);for(var o=arguments.length,i=new Array(o),c=0;c<o;c++)i[c]=arguments[c];return e=t.call.apply(t,[this].concat(i)),(0,u.Z)((0,l.Z)(e),"checkDetaileditems",(function(e,t,r){if(v().existy(t)&&v().not.empty(t)){if(!0===Object.values(t).every((function(e){return v().existy(e)&&v().not.empty(e)}))&&5===Object.values(t).length)return void r();r("差旅费用明细请填写完整")}r("请填写差旅费用明细")})),(0,u.Z)((0,l.Z)(e),"renderRentInfo",(function(){var t=e.props.form.getFieldDecorator,r=m().get(e.props,"detail",{}),a=[{label:"费用金额(元)",form:t("money",{initialValue:r.totalMoney>=0?b.fbc.exchangePriceToYuan(r.totalMoney):void 0,rules:[{required:!0,message:"请填写内容"}]})(y.createElement(n.Z,{min:0,step:.01,formatter:b.fbc.limitDecimals,parser:b.fbc.limitDecimals}))},{label:"是否开票",form:t("hasInvoice",{initialValue:r.invoiceFlag?"1":"0",rules:[{required:!0,message:"请填写内容"}]})(y.createElement(p.Z,{placeholder:"请选择是否开票"},y.createElement(P,{value:"1"},"是"),y.createElement(P,{value:"0"},"否")))}];return y.createElement(h.KP,{items:a,cols:3,layout:{labelCol:{span:9},wrapperCol:{span:15}}})})),(0,u.Z)((0,l.Z)(e),"renderDetailed",(function(){var t=e.props.form.getFieldDecorator,r=m().get(e.props,"detail",{}),n=[{label:"差旅费用明细",form:t("bizExtraData",{initialValue:E(E({},{subsidy_fee:0,stay_fee:0,transport_fee:0,urban_transport_fee:0,other_fee:0}),r.bizExtraData),rules:[{required:!0,validator:e.checkDetaileditems}]})(y.createElement(D,null))}];return y.createElement(h.KP,{items:n,layout:{labelCol:{span:2},wrapperCol:{span:22}}})})),e}return(0,o.Z)(r,[{key:"render",value:function(){return y.createElement(h.IT,{title:"费用信息"},this.renderRentInfo(),this.renderDetailed())}}]),r}(y.Component),j=Y},67442:function(e,t,r){r.d(t,{Z:function(){return T}});var n=r(93433),a=r(15671),o=r(43144),l=r(97326),i=r(60136),c=r(82963),s=r(61120),u=r(4942),p=(r(54071),r(14072)),f=r(93517),m=r.n(f),d=r(67294),v=r(30381),y=r.n(v),h=r(94315),b=r.n(h),g=r(96036),Z=r(87462),O=(r(29093),r(16317)),D=r(55609),_=r(80385),E=r(97116);function C(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function P(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?C(Object(r),!0).forEach((function(t){(0,u.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):C(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,s.Z)(e);if(t){var a=(0,s.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,c.Z)(this,r)}}var j=O.Z.Option,x=function(e){(0,i.Z)(r,e);var t=Y(r);function r(e){var n;return(0,a.Z)(this,r),n=t.call(this,e),(0,u.Z)((0,l.Z)(n),"componentDidMount",(function(){var e={state:[_.NWs.complete],bizState:_.r0i.undone,applyAccountId:E.Iq.account.id};n.props.dispatch({type:"expenseExamineOrder/fetchTravelApplicationLists",payload:e})})),(0,u.Z)((0,l.Z)(n),"onChangeSelect",(function(e){var t=n.props.onChange,r=(n.props.travelApplicationLists.data||[]).filter((function(t){return t._id===e})),a=[];b().existy(r)&&b().not.empty(r)&&(a=r[0]),t&&t(e,a)})),n.state={},n}return(0,o.Z)(r,[{key:"render",value:function(){var e=P(P({},this.props),{},{style:this.props.style,value:this.props.value,disabled:this.props.disabled,placeholder:this.props.placeholder}),t=(this.props.travelApplicationLists.data||[]).map((function(e){var t=e.departure||{},r=e.destination||{};return d.createElement(j,{key:e._id,value:e._id},e.apply_user_name,"-- (",t.province_name,t.city_name,"--",r.province_name,r.city_name,") -",e._id)}));return d.createElement("div",null,d.createElement(O.Z,(0,Z.Z)({},e,{onChange:this.onChangeSelect}),t))}}]),r}(d.Component);var w=(0,D.connect)((function(e){return{travelApplicationLists:e.expenseExamineOrder.travelApplicationLists}}))(x),R="EZbAJbTPm5zLdWIhrQXX";function F(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,s.Z)(e);if(t){var a=(0,s.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,c.Z)(this,r)}}var H=p.Z.RangePicker,T=function(e){(0,i.Z)(r,e);var t=F(r);function r(e){var o;return(0,a.Z)(this,r),o=t.call(this,e),(0,u.Z)((0,l.Z)(o),"onChangeTravelApplicationForm",(function(e,t){o.setState({travelItem:t}),(0,o.props.form.setFieldsValue)({bizExtraTravelApplyOrderId:e})})),(0,u.Z)((0,l.Z)(o),"onChangeFilterDiffDay",(function(){var e,t=(0,o.props.form.getFieldValue)("date"),r=b().existy(t)&&b().not.empty(t)?y()(t[0],"YYYY-MM-DD HH:00"):void 0,n=b().existy(t)&&b().not.empty(t)?y()(t[1],"YYYY-MM-DD HH:00"):void 0;b().existy(t)&&b().not.empty(t)&&(e=n.diff(r,"day"));var a=0;return e>=0?(Array.from({length:e}).forEach((function(){a+=1})),a):"--"})),(0,u.Z)((0,l.Z)(o),"onGetValueFromEvent",(function(e){if(Array.isArray(e)){var t=(0,n.Z)(e);return y()(e[1]).valueOf()>y()().valueOf()&&(t[1]=y()()),t}})),(0,u.Z)((0,l.Z)(o),"disabledDate",(function(e){return e&&e>y()().endOf("hours")})),(0,u.Z)((0,l.Z)(o),"disabledRangeTime",(function(e,t){var r,n=(new Date).getHours(),a=y()(new Date).format("YYYYHHDD");if(e&&2===e.length)return r=y()(e[1]).format("YYYYHHDD"),Number(r)===Number(a)&&"end"===t?{disabledHours:function(){return o.range(n+1,24)}}:{disabledHours:function(){return[]}}})),(0,u.Z)((0,l.Z)(o),"range",(function(e,t){for(var r=[],n=e;n<t;n+=1)r.push(n);return r})),(0,u.Z)((0,l.Z)(o),"renderTravelApplyOrder",(function(){var e=o.props.form.getFieldDecorator,t=o.state.travelItem,r=m().get(o.props,"detail",{}),n=m().get(r,"bizExtraTravelApplyOrderInfo",{}),a={},l=(a=b().existy(t)&&b().not.empty(t)?t:n).departure||{},i=a.destination||{},c=[{label:"出差申请单",layout:{labelCol:{span:6,pull:1},wrapperCol:{span:18,pull:1}},form:e("bizExtraTravelApplyOrderId",{initialValue:r.bizExtraTravelApplyOrderId||void 0,rules:[{required:!0,message:"请选择出差申请单"}]})(d.createElement(w,{className:R,placeholder:"请选择出差申请单",enableSelectAll:!0,showSearch:!0,optionFilterProp:"children",onChange:o.onChangeTravelApplicationForm}))}],s=[{label:"出差申请单号",form:d.createElement("span",null,a._id?d.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"/#/Expense/TravelApplication/Detail?id=".concat(a._id)},a._id):"--")},{label:"实际出差人",form:a.apply_user_name||"--"},{label:"预计出差时间",form:d.createElement("span",null,a.expect_start_at?y()(a.expect_start_at).format("YYYY-MM-DD HH:00"):"","--",a.expect_done_at?y()(a.expect_done_at).format("YYYY-MM-DD HH:00"):"")},{label:"出差地点",form:d.createElement("span",null,l.province_name||"",l.city_name||"","--",i.province_name||"",i.city_name||"")}],u=[];b().existy(n.actual_start_at)&&b().not.empty(n.actual_start_at)&&b().existy(n.actual_done_at)&&b().not.empty(n.actual_done_at)&&(u=[y()("".concat(n.actual_start_at),"YYYY-MM-DD HH:00"),y()("".concat(n.actual_done_at),"YYYY-MM-DD HH:00")]);var p=[{label:"实际出差时间",form:e("date",{initialValue:u,getValueFromEvent:o.onGetValueFromEvent,rules:[{required:!0,message:"请选择实际出差时间"}]})(d.createElement(H,{disabledDate:o.disabledDate,disabledTime:o.disabledRangeTime,showTime:{format:"HH:00"},format:"YYYY-MM-DD HH:00"}))},{label:"出差天数",form:"".concat("--"!==o.onChangeFilterDiffDay()?o.onChangeFilterDiffDay():n.actual_apply_days||"--","天")}];return d.createElement("div",null,d.createElement(g.KP,{items:c,cols:2}),d.createElement(g.KP,{items:s,cols:4}),d.createElement(g.KP,{items:p,cols:2,layout:{labelCol:{span:6},wrapperCol:{span:18}}}))})),o.state={travelItem:{}},o}return(0,o.Z)(r,[{key:"render",value:function(){return d.createElement(g.IT,{title:"出差信息"},this.renderTravelApplyOrder())}}]),r}(d.Component)},81170:function(e,t){t.Z={"app-comp-expense-create-files-del-btn":"BYsIBT4AB2AtznB5LhF1","app-comp-expense-create-operate-wrap":"KJgicPIOpIz5Qgw5LacZ",bossUpdateFilesLink:"txgodqpVvyQ_tPH00yVJ",bossUpdateFilesDelBtn:"hk4j4wwvQexMIajRgUHh",bossUpdateOperateWrap:"RMJPH5K3ylOPtZlBYYft","app-comp-expense-update-upload":"BKkFJPNn4DUkoRe6gKxC","app-comp-expense-update-detele":"d_3g2uOVfTV6CCwCHaeg","app-comp-expense-update-button":"uMKzP4QX3MEka8FUs8BV","app-comp-expense-manage-create-form-hide":"hmSP60rnRcIYE4Rwdz1j"}}}]);