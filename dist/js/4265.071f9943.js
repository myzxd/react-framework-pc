"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[4265],{34265:function(e,t,a){a.r(t),a.d(t,{default:function(){return w}});a(438);var n=a(14277),r=(a(20186),a(75385)),o=a(15671),c=a(43144),i=a(97326),l=a(60136),u=a(82963),d=a(61120),f=a(4942),s=a(93517),m=a.n(s),p=a(30381),h=a.n(p),_=a(67294),b=a(55609),y=a(45697),g=a.n(y),v=a(28221),C=a(96036),P=a(80385);function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=(0,d.Z)(e);if(t){var r=(0,d.Z)(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return(0,u.Z)(this,a)}}var Z=function(e){(0,l.Z)(a,e);var t=x(a);function a(){var e;(0,o.Z)(this,a);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return e=t.call.apply(t,[this].concat(r)),(0,f.Z)((0,i.Z)(e),"renderBasicInfo",(function(){var t=e.props.data,a=[{label:"平台",form:m().get(t,"platform_name","--")},{label:"供应商",layout:{labelCol:{span:8},wrapperCol:{span:16}},form:m().get(t,"supplier_name","--")},{label:"城市",form:m().get(t,"city_name","--")},{label:"商圈",form:m().get(t,"biz_district_name","--")},{label:"姓名",form:m().get(t,"staff_name","--")},{label:"身份证号",form:m().get(t,"identity_card_id","--")},{label:"物资分类",form:P.IO9.description(t.group)},{label:"归属时间",form:m().get(t,"month","--")}],n=t.ult_real_deduction_deposit,r=void 0===n?0:n,o=t.ult_real_deduction_usage_fee,c=void 0===o?0:o,i=t.ult_deduction_deposit,l=void 0===i?0:i,u=t.ult_deduction_usage_fee,d=void 0===u?0:u,f=t.deduction_deposit,s=void 0===f?0:f,p=t.deduction_usage_fee,h=r+c,b=l+d,y=s+(void 0===p?0:p),g=y+b,v=[{label:"上月实际扣款(元)",form:P.fbc.exchangePriceCentToMathFormat(h)},{label:"上月未扣款(元)",form:P.fbc.exchangePriceCentToMathFormat(b)}],x=[{label:"本月累计应扣款(元)",form:P.fbc.exchangePriceCentToMathFormat(g)},{label:"本月应扣款(元)",form:P.fbc.exchangePriceCentToMathFormat(y)}],Z={labelCol:{span:10},wrapperCol:{span:14}};return _.createElement(C.IT,{title:"基础信息"},_.createElement(C.KP,{items:a,cols:3,layout:Z}),_.createElement(C.KP,{items:v,cols:3,layout:Z}),_.createElement(C.KP,{items:x,cols:3,layout:Z}))})),(0,f.Z)((0,i.Z)(e),"renderLatMonthNoSeen",(function(){var t=e.props.data,a=[{label:"未扣款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_deduction_deposit||0))},{label:"未扣款使用费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_deduction_usage_fee||0))},{label:"未扣款折损费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_deduction_consume_fee||0))},{label:"未退款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_refund_deposit||0))}];return _.createElement(C.IT,{title:"上月未扣项"},_.createElement(C.KP,{items:a,cols:3,layout:{labelCol:{span:14},wrapperCol:{span:10}}}))})),(0,f.Z)((0,i.Z)(e),"renderActualBuckle",(function(){var t=e.props.data,a=[{label:"实际扣款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_real_deduction_deposit||0))},{label:"实际扣款使用费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_real_deduction_usage_fee||0))},{label:"实际扣款折损费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_real_deduction_consume_fee||0))},{label:"实际退款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.ult_real_refund_deposit||0))}];return _.createElement(C.IT,{title:"上月实扣项"},_.createElement(C.KP,{items:a,cols:3,layout:{labelCol:{span:14},wrapperCol:{span:10}}}))})),(0,f.Z)((0,i.Z)(e),"renderDeductible",(function(){var t=e.props.data,a=[{label:"应扣款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.deduction_deposit||0))},{label:"应扣款使用费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.deduction_usage_fee||0))},{label:"应扣款折损费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.deduction_fee||0))},{label:"应退款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.refund_deposit||0))}];return _.createElement(C.IT,{title:"本月应扣项"},_.createElement(C.KP,{items:a,cols:3,layout:{labelCol:{span:14},wrapperCol:{span:10}}}))})),(0,f.Z)((0,i.Z)(e),"renderDeductibleTotal",(function(){var t=e.props.data,a=[{label:"累计应扣款押金(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.accumulative_deduction_deposit||0))},{label:"累计应扣款使用费(元)",form:"".concat(P.fbc.exchangePriceCentToMathFormat(t.accumulative_deduction_usage_fee||0))},{label:"累计应扣款折损费(元)",form:"0.00"},{label:"累计应退款押金(元)",form:"0.00"}];return _.createElement(C.IT,{title:"本月累计应扣项"},_.createElement(C.KP,{items:a,cols:3,layout:{labelCol:{span:14},wrapperCol:{span:10}}}))})),e}return(0,c.Z)(a,[{key:"render",value:function(){return _.createElement("div",null,this.renderBasicInfo(),this.renderActualBuckle(),this.renderLatMonthNoSeen(),this.renderDeductible(),this.renderDeductibleTotal())}}]),a}(_.Component);(0,f.Z)(Z,"propTypes",{data:g().object}),(0,f.Z)(Z,"defaultProps",{data:{}});var T=Z;function D(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=(0,d.Z)(e);if(t){var r=(0,d.Z)(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return(0,u.Z)(this,a)}}var M=function(e){(0,l.Z)(a,e);var t=D(a);function a(e){var n;(0,o.Z)(this,a),n=t.call(this,e),(0,f.Z)((0,i.Z)(n),"onChangePage",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:30,a=n.state.id,r=n.props.dispatch;n.private.searchParams.page=e,n.private.searchParams.limit=t,r({type:"supplyDeductSummarize/fetchDeductSummarizeDetail",payload:{id:a,page:e,limit:t}})})),(0,f.Z)((0,i.Z)(n),"onShowSizeChange",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:30,a=n.state.id,r=n.props.dispatch;n.private.searchParams.page=e,n.private.searchParams.limit=t,r({type:"supplyDeductSummarize/fetchDeductSummarizeDetail",payload:{id:a,page:e,limit:t}})})),(0,f.Z)((0,i.Z)(n),"renderInfo",(function(){var e=n.props.deductSummarizeDetail;return _.createElement(T,{data:e})})),(0,f.Z)((0,i.Z)(n),"renderContent",(function(){var e=n.props.deductSummarizeDetail,t=n.private.searchParams.page,a=[{title:"物资名称",dataIndex:"material_name",key:"material_name.name",fixed:"left",width:100,render:function(e){return e||"--"}},{title:"物资编号",dataIndex:"material_code",key:"material_code.code",fixed:"left",width:100,render:function(e){return e||"--"}},{title:"数量",dataIndex:"qty",key:"qty",fixed:"left",width:80,render:function(e){return e||"--"}},{title:"分发时间",dataIndex:"distribute_at",key:"distribute_at",width:150,render:function(e){return e?h()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"领用时间",dataIndex:"received_at",key:"received_at",width:100,render:function(e){return e?h()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"扣款周期",dataIndex:"month",key:"month",width:100,render:function(e){return e||"--"}},{title:"押金扣款方式",dataIndex:"pledge_money_type",key:"pledge_money_type",width:120,render:function(e){return P.erU.description(e)||"--"}},{title:"使用费扣款方式",dataIndex:"fee_money_deduction_type",key:"fee_money_deduction_type",width:120,render:function(e){return P.DFN.description(e)||"--"}},{title:"应扣款押金(元)",dataIndex:"deduction_deposit",key:"deduction_deposit",width:120,render:function(e){return P.fbc.exchangePriceCentToMathFormat(e)||0}},{title:"应扣款使用费(元)",dataIndex:"deduction_usage_fee",key:"deduction_usage_fee",width:120,render:function(e){return P.fbc.exchangePriceCentToMathFormat(e)||0}},{title:"应扣款折损费(元)",dataIndex:"deduction_fee",key:"deduction_fee",width:120,render:function(e){return P.fbc.exchangePriceCentToMathFormat(e)||0}},{title:"应退款押金(元)",dataIndex:"refund_deposit",key:"refund_deposit",width:120,render:function(e){return P.fbc.exchangePriceCentToMathFormat(e)||0}}],o={showSizeChanger:!0,showQuickJumper:!0,defaultPageSize:30,onShowSizeChange:n.onShowSizeChange,total:e.total_count,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],onChange:n.onChangePage};return t&&(o.current=t),_.createElement(C.IT,null,_.createElement(r.Z,{columns:a,rowKey:function(e){return e._id},dataSource:e.deduction_order_list,bordered:!0,pagination:o,scroll:{x:1350}}))}));var c=m().get(e,"location.query.id");return n.state={id:c},n.private={searchParams:{}},n}return(0,c.Z)(a,[{key:"componentDidMount",value:function(){var e=this.state.id;(0,this.props.dispatch)({type:"supplyDeductSummarize/fetchDeductSummarizeDetail",payload:{id:e,page:1,limit:30}})}},{key:"componentWillUnmount",value:function(){(0,this.props.dispatch)({type:"supplyDeductSummarize/reduceDeductSummarizeDetail",payload:{}})}},{key:"render",value:function(){var e=this.props.deductSummarizeDetail;return 0===Object.keys(e).length?_.createElement(n.Z,null):_.createElement("div",null,this.renderInfo(),this.renderContent())}}]),a}(_.Component);(0,f.Z)(M,"propTypes",{dispatch:g().func,deductSummarizeDetail:g().object}),(0,f.Z)(M,"defaultProps",{deductSummarizeDetail:{},dispatch:v.ZT});var w=(0,b.connect)((function(e){return{deductSummarizeDetail:e.supplyDeductSummarize.deductSummarizeDetail}}))(M)}}]);