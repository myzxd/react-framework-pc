"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[8609],{68609:function(e,r,t){t.r(r),t.d(r,{default:function(){return M}});t(52560);var n=t(71577),a=(t(51838),t(48086)),s=t(15671),i=t(43144),o=t(97326),l=t(60136),p=t(82963),u=t(61120),c=t(4942),d=t(55609),m=t(45697),f=t.n(m),y=t(67294),v=t(66939),Z=(t(98703),t(96036)),b=t(80385),T=(t(29093),t(16317)),h=(t(9070),t(20924)),E=t(8240);function P(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,u.Z)(e);if(r){var a=(0,u.Z)(this).constructor;t=Reflect.construct(n,arguments,a)}else t=n.apply(this,arguments);return(0,p.Z)(this,t)}}var D=function(e){(0,l.Z)(t,e);var r=P(t);function t(e){var n;return(0,s.Z)(this,t),n=r.call(this,e),(0,c.Z)((0,o.Z)(n),"onChangePeerTags",(function(e){var r=n.props.form,t=r.getFieldValue,a=r.setFieldsValue,s=e,i=s.length;if(i>t("peer")){var o=s[i-1].replace(/\s+/g,"");if(""===o)return;s[i-1]=o}a({peer:s})})),(0,c.Z)((0,o.Z)(n),"renderForm",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData,a=t.apply_user_name,s=void 0===a?"":a,i=t.apply_user_phone,o=void 0===i?"":i,l=t.together_user_names,p=void 0===l?[]:l,u=n.props.form.getFieldDecorator,c=r?o:"",d=r?p:[],m=[{label:"实际出差人",key:"businessTraveler",form:u("businessTraveler",{initialValue:r?s:"",rules:[{required:!0,message:"请输入内容"}]})(y.createElement(h.Z,{placeholder:"请填写实际出差人"}))},{label:"联系方式",key:"phone",form:u("phone",{initialValue:c,rules:[{validator:E.pe}]})(y.createElement(h.Z,{placeholder:"请填写联系方式"}))}],f=[{label:"同行人员",layout:{labelCol:{span:10},wrapperCol:{span:14}},key:"peer",form:u("peer",{initialValue:d})(y.createElement(T.Z,{placeholder:"请填写同行人员",mode:"tags",notFoundContent:"",onChange:n.onChangePeerTags,tokenSeparators:[",","，"]}))},{label:"",span:15,form:y.createElement("span",null,"提示：添写完同行人员后，该同行人员将不能进行此次出差申请的重复提报")}];return y.createElement("div",null,y.createElement(Z.KP,{items:m,cols:4,layout:{labelCol:{span:10},wrapperCol:{span:14}}}),y.createElement(Z.KP,{items:f,cols:4}))})),n.state={},n}return(0,i.Z)(t,[{key:"render",value:function(){return y.createElement(Z.IT,{title:"出差人信息"},this.renderForm())}}]),t}(y.Component);(0,c.Z)(D,"propTypes",{businessTripData:f().object,isUpdate:f().bool}),(0,c.Z)(D,"defaultProps",{businessTripData:{},isUpdate:!1});var C=(0,d.connect)()(D),g=(t(13062),t(71230)),O=(t(89032),t(15746)),k=(t(26574),t(9676)),B=(t(54071),t(14072)),x=(t(36037),t(47933)),w=t(30381),U=t.n(w),I=t(88144),F="v8rltuuEL0tkkqNiFumf";function R(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,u.Z)(e);if(r){var a=(0,u.Z)(this).constructor;t=Reflect.construct(n,arguments,a)}else t=n.apply(this,arguments);return(0,p.Z)(this,t)}}var _=h.Z.TextArea,V=x.ZP.Group,j=B.Z.RangePicker,S=function(e){(0,l.Z)(t,e);var r=R(t);function t(e){var n;return(0,s.Z)(this,t),n=r.call(this,e),(0,c.Z)((0,o.Z)(n),"onChangeBusinessTripType",(function(){(0,n.props.form.setFieldsValue)({businessTripWay:[]})})),(0,c.Z)((0,o.Z)(n),"onChangeBusinessTripTime",(function(e){if(e){var r=n.countWorkDay(e[0],e[1]);n.props.form.setFieldsValue({businessTripCountDay:r})}else n.props.form.resetFields(["businessTripCountDay"])})),(0,c.Z)((0,o.Z)(n),"countWorkDay",(function(e,r){if(!e||!r)return 0;var t=r.diff(e,"day"),n=0;return t>=0?(Array.from({length:t}).forEach((function(){n+=1})),n):0})),(0,c.Z)((0,o.Z)(n),"renderBusinessTripType",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData.biz_type,a=void 0===t?b.a8e.oneWay:t,s=[{label:"出差类别",layout:{labelCol:{span:5},wrapperCol:{span:19}},span:10,key:"businessTripType",form:(0,n.props.form.getFieldDecorator)("businessTripType",{initialValue:r?a:b.a8e.oneWay,rules:[{required:!0,message:"请选择出差类别"}]})(y.createElement(V,{onChange:n.onChangeBusinessTripType},y.createElement(x.ZP,{value:b.a8e.oneWay},"单程"),y.createElement(x.ZP,{value:b.a8e.roundTrip},"往返")))}];return y.createElement(Z.KP,{items:s})})),(0,c.Z)((0,o.Z)(n),"renderBusinessTripWay",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData.transport_kind,a=void 0===t?[]:t,s=[{label:"出差方式",layout:{labelCol:{span:2},wrapperCol:{span:22}},key:"businessTripWay",form:(0,n.props.form.getFieldDecorator)("businessTripWay",{initialValue:r?a:[],rules:[{required:!0,message:"请选择出差方式"}]})(y.createElement(k.Z.Group,{className:F},y.createElement(g.Z,null,y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.planeOne},b.s6P.description(b.s6P.planeOne))),y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.planeTwo},b.s6P.description(b.s6P.planeTwo)))),y.createElement(g.Z,null,y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.heightIronOne},b.s6P.description(b.s6P.heightIronOne))),y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.heightIronTwo},b.s6P.description(b.s6P.heightIronTwo))),y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.bulletTrainOne},b.s6P.description(b.s6P.bulletTrainOne))),y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.bulletTrainTwo},b.s6P.description(b.s6P.bulletTrainTwo))),y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.train},b.s6P.description(b.s6P.train)))),y.createElement(g.Z,null,y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.passengerCar},b.s6P.description(b.s6P.passengerCar))),y.createElement(O.Z,{span:4},y.createElement(k.Z,{value:b.s6P.drive},b.s6P.description(b.s6P.drive))))))}];return y.createElement(Z.KP,{items:s})})),(0,c.Z)((0,o.Z)(n),"renderDeparture",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData.departure,a=(t=void 0===t?{}:t).province,s=t.city,i=t.area,o=t.detailed_address,l=void 0===o?"":o,p=n.props.form.getFieldDecorator,u=r?l:"",c=[{label:"出发地",layout:{labelCol:{span:5},wrapperCol:{span:19}},span:10,key:"departure",form:p("departure",{initialValue:r?{province:a,city:s,area:i}:{},rules:[{required:!0}]})(y.createElement(I.TJ,null))},{label:"",span:12,key:"departureAddress",form:p("departureAddress",{initialValue:u})(y.createElement(h.Z,{placeholder:"请输入详细地址"}))}];return y.createElement(Z.KP,{items:c})})),(0,c.Z)((0,o.Z)(n),"renderDestination",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData.destination,a=(t=void 0===t?{}:t).province,s=t.city,i=t.area,o=t.detailed_address,l=void 0===o?"":o,p=n.props.form.getFieldDecorator,u=r?l:"",c=[{label:"目的地",layout:{labelCol:{span:5},wrapperCol:{span:19}},span:10,key:"destination",form:p("destination",{initialValue:r?{province:a,city:s,area:i}:{},rules:[{required:!0}]})(y.createElement(I.TJ,null))},{label:"",span:12,key:"destinationAddress",form:p("destinationAddress",{initialValue:u})(y.createElement(h.Z,{placeholder:"请输入详细地址"}))}];return y.createElement(Z.KP,{items:c})})),(0,c.Z)((0,o.Z)(n),"renderBusinessTripTime",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData,a=t.expect_start_at,s=void 0===a?void 0:a,i=t.expect_done_at,o=void 0===i?void 0:i,l=t.expect_apply_days,p=void 0===l?void 0:l,u=n.props.form,c=u.getFieldDecorator,d=u.getFieldValue,m=r?[U()(s),U()(o)]:[],f=r?p:void 0,v=0===d("businessTripCountDay")?0:d("businessTripCountDay")||f,b=[{label:"预计出差时间",layout:{labelCol:{span:5},wrapperCol:{span:19}},span:10,key:"businessTripTime",form:c("businessTripTime",{initialValue:m,rules:[{required:!0,message:"请选择预计出差时间"}]})(y.createElement(j,{showTime:{format:"HH:00"},format:"YYYY-MM-DD HH:00",onChange:n.onChangeBusinessTripTime}))},{label:"",span:10,key:"businessTripCountDay",form:c("businessTripCountDay",{initialValue:f})(y.createElement("span",null,"出差天数：",v,"天"))}];return y.createElement(Z.KP,{items:b})})),(0,c.Z)((0,o.Z)(n),"renderReason",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData.note,a=void 0===t?"":t,s=[{label:"原由及说明",layout:{labelCol:{span:5},wrapperCol:{span:19}},span:10,key:"reason",form:(0,n.props.form.getFieldDecorator)("reason",{initialValue:r?a:""})(y.createElement(_,{autoSize:{minRows:4}}))}];return y.createElement(Z.KP,{items:s})})),(0,c.Z)((0,o.Z)(n),"renderArrangement",(function(){var e=n.props,r=e.isUpdate,t=e.businessTripData.working_plan,a=void 0===t?"":t,s=[{label:"工作安排",layout:{labelCol:{span:5},wrapperCol:{span:19}},span:10,key:"arrangement",form:(0,n.props.form.getFieldDecorator)("arrangement",{initialValue:r?a:""})(y.createElement(_,{autoSize:{minRows:4}}))}];return y.createElement(Z.KP,{items:s})})),n.state={},n}return(0,i.Z)(t,[{key:"render",value:function(){return y.createElement(Z.IT,{title:"出差信息"},this.renderBusinessTripType(),this.renderBusinessTripWay(),this.renderDeparture(),this.renderDestination(),this.renderBusinessTripTime(),this.renderReason(),this.renderArrangement())}}]),t}(y.Component);(0,c.Z)(S,"propTypes",{businessTripData:f().object,isUpdate:f().bool}),(0,c.Z)(S,"defaultProps",{businessTripData:{},isUpdate:!1});var q=(0,d.connect)()(S),Y="Wn9YQW_kypS6ZsCDajqL";function W(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function A(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?W(Object(t),!0).forEach((function(r){(0,c.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):W(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function K(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,u.Z)(e);if(r){var a=(0,u.Z)(this).constructor;t=Reflect.construct(n,arguments,a)}else t=n.apply(this,arguments);return(0,p.Z)(this,t)}}var H=function(e){(0,l.Z)(t,e);var r=K(t);function t(e){var n;return(0,s.Z)(this,t),n=r.call(this,e),(0,c.Z)((0,o.Z)(n),"onSave",(function(e){e.preventDefault(),n.onSubmit({onCreateSuccessCallBack:n.onCreateSuccessCallBack})})),(0,c.Z)((0,o.Z)(n),"onNext",(function(e){e.preventDefault(),n.onSubmit({onCreateSuccessCallBack:n.onBack,onSuccessCallBack:n.onBack})})),(0,c.Z)((0,o.Z)(n),"onBack",(function(){var e=n.props.history,r=n.props.location.query.applicationOrderId;e.push("/Expense/Manage/ExamineOrder/Form?orderId=".concat(r))})),(0,c.Z)((0,o.Z)(n),"onCreateSuccessCallBack",(function(){n.shouldUpdate+=1})),(0,c.Z)((0,o.Z)(n),"onSubmit",(function(e){var r=n.props.businessTripData._id,t=void 0===r?"":r,s=n.props.location.query.applicationOrderId,i=n.props.location.query.costOrderId||t,o=[441900,442e3,460300,460400,620200,71e4,81e4,82e4];n.props.form.validateFields((function(r,t){if(!r){var l=A(A({},t),{},{businessTripTime:[t.businessTripTime[0].format("YYYY-MM-DD HH:mm:ss"),t.businessTripTime[1].format("YYYY-MM-DD HH:mm:ss")]});if(l.businessTripTime[0]===l.businessTripTime[1])return a.ZP.error("开始时间与结束时间不能完全相同");if(l.departure){if(!l.departure.province)return a.ZP.error("请选择出发地省份");if(!1===o.includes(l.departure.province)&&!l.departure.city)return a.ZP.error("请选择出发地城市");if(!1===o.includes(l.departure.province)&&!1===o.includes(l.departure.city)&&!l.departure.area)return a.ZP.error("请选择出发地区/县")}if(l.destination){if(!l.destination.province)return a.ZP.error("请选择目的地省份");if(!1===o.includes(Number(l.destination.province))&&!l.destination.city)return a.ZP.error("请选择目的地城市");if(!1===o.includes(Number(l.destination.province))&&!1===o.includes(l.destination.city)&&!l.destination.area)return a.ZP.error("请选择目的地区/县")}var p=A(A(A({},l),e),{},{applicationOrderId:s,costOrderId:i});n.isUpdate||n.shouldUpdate>=2?n.props.dispatch({type:"expenseExamineOrder/updateBusinessTrip",payload:p}):n.props.dispatch({type:"expenseExamineOrder/createBusinessTrip",payload:p})}}))})),(0,c.Z)((0,o.Z)(n),"renderBasicInfo",(function(){var e=n.props.examineOrderDetail,r=e.applyAccountInfo,t=(r=void 0===r?{}:r).name,a=void 0===t?"":t,s=e.applicationOrderType,i=void 0===s?"":s,o=e.flowInfo,l=(o=void 0===o?{}:o).name,p=void 0===l?"":l,u=n.props.businessTripData._id,c=void 0===u?"":u,d=[{label:"申请人",key:"name",form:y.createElement("span",null,a)},{label:"审批类型",key:"examineType",form:y.createElement("span",null,b.ZBL.description(i))},{label:"审批流程",key:"examineProcess",form:y.createElement("span",null,p)}];n.isUpdate&&d.unshift({label:"出差申请单号",key:"tripApplicationNumber",form:y.createElement("span",null,c)});return y.createElement(Z.IT,{title:"基本信息"},y.createElement(Z.KP,{items:d,cols:4,layout:{labelCol:{span:10},wrapperCol:{span:14}}}))})),(0,c.Z)((0,o.Z)(n),"renderBusinessTraveler",(function(){var e=n.props.businessTripData;return y.createElement(C,{form:n.props.form,businessTripData:e,isUpdate:n.isUpdate})})),(0,c.Z)((0,o.Z)(n),"renderBusinessTrip",(function(){var e=n.props.businessTripData;return y.createElement(q,{form:n.props.form,businessTripData:e,isUpdate:n.isUpdate})})),n.state={},n.isUpdate=Boolean(n.props.location.query.costOrderId),n.shouldUpdate=1,n}return(0,i.Z)(t,[{key:"componentDidMount",value:function(){var e=this.props.location.query.applicationOrderId;if(this.props.dispatch({type:"expenseExamineOrder/fetchExamineOrderDetail",payload:{id:e}}),this.isUpdate){var r=this.props.location.query.costOrderId;this.props.dispatch({type:"expenseExamineOrder/fetchBusinessTrip",payload:{costOrderId:r}})}}},{key:"render",value:function(){return y.createElement(v.Z,{layout:"horizontal"},this.renderBasicInfo(),this.renderBusinessTraveler(),this.renderBusinessTrip(),y.createElement(Z.IT,{style:{textAlign:"center"}},y.createElement(n.Z,{type:"primary",className:Y,onClick:this.onSave},"保存"),y.createElement(n.Z,{type:"primary",onClick:this.onNext},"下一步")))}}]),t}(y.Component);(0,c.Z)(H,"propTypes",{examineOrderDetail:f().object,businessTripData:f().object}),(0,c.Z)(H,"defaultProps",{examineOrderDetail:{},businessTripData:{}});var M=v.Z.create()((0,d.connect)((function(e){var r=e.expenseExamineOrder;return{examineOrderDetail:r.examineOrderDetail,businessTripData:r.businessTripData}}))(H))}}]);