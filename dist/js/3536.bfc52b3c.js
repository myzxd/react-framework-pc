"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[3536],{63536:function(e,t,r){r.r(t);r(52560);var n=r(71577),a=(r(36616),r(51368)),i=(r(54071),r(14072)),o=r(93433),l=r(15671),s=r(43144),c=r(97326),u=r(60136),p=r(82963),f=r(61120),m=r(4942),d=(r(9070),r(20924)),y=(r(29093),r(16317)),v=r(94315),Z=r.n(v),h=r(30381),g=r.n(h),b=r(55609),E=r(67294),O=r(66939),D=(r(98703),r(96036)),C=r(88144),F=r(80385),w=r(97116),P=r(8240),H=r(74962);r(39562);function S(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function T(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?S(Object(r),!0).forEach((function(t){(0,m.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):S(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,f.Z)(e);if(t){var a=(0,f.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,p.Z)(this,r)}}var Y=y.Z.Option,x=d.Z.TextArea,V=function(e){(0,u.Z)(r,e);var t=L(r);function r(e){var n;return(0,l.Z)(this,r),n=t.call(this,e),(0,m.Z)((0,c.Z)(n),"onDisabledDate",(function(e){var t=(0,n.props.form.getFieldValue)("leaveType"),r=g()(e).day();if(Number(t)===F.gGH.things||Number(t)===F.gGH.disease||void 0===t)return e&&(6===r||0===r)})),(0,m.Z)((0,c.Z)(n),"onSave",(function(e){e.preventDefault(),n.onSubmit({onSuccessCallback:function(){return n.setState({flag:!1})}})})),(0,m.Z)((0,c.Z)(n),"onNext",(function(e){var t=n.state.flag;e.preventDefault(),t?n.onSubmit({onSuccessCallback:n.onBack}):n.onBack()})),(0,m.Z)((0,c.Z)(n),"onBack",(function(){var e=n.props.history,t=n.props.location.query.applicationOrderId;e.push("/Expense/Manage/ExamineOrder/Form?orderId=".concat(t))})),(0,m.Z)((0,c.Z)(n),"onSubmit",(function(e){var t=n.props.location.query.applicationOrderId;n.props.form.validateFieldsAndScroll((function(r,a){if(!r){var i=a.fileList,o=T(T(T({},a),e),{},{fileList:i,applicationOrderId:t});n.props.dispatch({type:"expenseTakeLeave/createExpenseTakeLeave",payload:o})}}))})),(0,m.Z)((0,c.Z)(n),"onUploadSuccess",(function(e){var t=n.state.fileList;t.push(e),n.setState({fileList:t})})),(0,m.Z)((0,c.Z)(n),"onDeleteFile",(function(e){var t=n.state.fileList;t.splice(e,1),n.setState({fileList:t})})),(0,m.Z)((0,c.Z)(n),"onValidatorPhone",(function(e,t,r){Z().existy(t)&&Z().not.empty(t)&&!(0,P.WK)(t)?r("请输入正确的手机号码"):r()})),(0,m.Z)((0,c.Z)(n),"onChangePlatforms",(function(){(0,n.props.form.setFieldsValue)({cities:void 0,districts:void 0}),n.props.dispatch({type:"applicationCommon/resetDistricts",payload:{namespace:"districts"}}),n.setState({citySpelling:[]})})),(0,m.Z)((0,c.Z)(n),"onChangeCity",(function(e,t){var r=n.props.form.setFieldsValue;t&&t.props?n.setState({citySpelling:t.props.spell}):n.setState({citySpelling:[]}),r({districts:void 0,cities:void 0}),n.props.dispatch({type:"applicationCommon/resetDistricts",payload:{namespace:"districts"}})})),(0,m.Z)((0,c.Z)(n),"onChangeTimeRange",(function(e){return(0,n.props.form.setFieldsValue)({endTime:null}),n.onChangeTime(e)})),(0,m.Z)((0,c.Z)(n),"onChangeTime",(function(e){if(!Z().empty(e)&&!Z().not.existy(e)){var t=g()(e).minutes(),r=g()(e).hours();return r>19?g()(g()(e).format("YYYY-MM-DD 19:30")):r<9?g()(g()(e).format("YYYY-MM-DD 9:00")):t<30?g()(g()(e).format("YYYY-MM-DD HH:00")):t>30?g()(g()(e).format("YYYY-MM-DD HH:30")):g()(e)}})),(0,m.Z)((0,c.Z)(n),"onChangeEndTimeRange",(function(e){var t=(0,n.props.form.getFieldValue)("startTime");if(!Z().empty(e)&&!Z().not.existy(e))return e<t?g()(t):n.onChangeTime(e)})),(0,m.Z)((0,c.Z)(n),"disabledRangeTime",(function(){return{disabledHours:function(){return(0,o.Z)(Array(24).keys()).filter((function(e){return e<9||e>19}))},disabledMinutes:function(){return(0,o.Z)(Array(60).keys()).filter((function(e){return 0!==e&&30!==e}))}}})),(0,m.Z)((0,c.Z)(n),"disabledEndRangeTime",(function(e){var t=(0,n.props.form.getFieldValue)("startTime"),r=g()(g()(t).format("YYYY-MM-DD")).valueOf(),a=g()(g()(e).format("YYYY-MM-DD")).valueOf();if(Z().empty(t)||Z().not.existy(t)||a>r)return{disabledHours:function(){return(0,o.Z)(Array(24).keys()).filter((function(e){return e<9||e>19}))},disabledMinutes:function(){return(0,o.Z)(Array(60).keys()).filter((function(e){return 0!==e&&30!==e}))}};var i=g()(t).hours();return{disabledHours:function(){return(0,o.Z)(Array(24).keys()).filter((function(e){return e<i||e>19}))},disabledMinutes:function(){return(0,o.Z)(Array(60).keys()).filter((function(e){return 0!==e&&30!==e}))}}})),(0,m.Z)((0,c.Z)(n),"disabledEndDate",(function(e){var t=(0,n.props.form.getFieldValue)("startTime");if(!e||!t)return!1;var r=g()(g()(t).format("YYYY-MM-DD")).valueOf();return g()(g()(e).format("YYYY-MM-DD")).valueOf()<r})),(0,m.Z)((0,c.Z)(n),"renderTitle",(function(){var e=n.props.form.getFieldDecorator,t=n.props.examineOrderDetail,r=t.applyAccountInfo,a=(r=void 0===r?{}:r).name,i=void 0===a?"":a,o=t.applicationOrderType,l=void 0===o?"":o,s=t.flowInfo,c=(s=void 0===s?{}:s).name,u=void 0===c?"":c,p=[{label:"申请人",form:i||"--"},{label:"审批类型",form:F.ZBL.description(l)},{label:"审批流程",form:u||"--"},{label:"请假类型",form:e("leaveType",{initialValue:void 0,rules:[{required:!0,message:"请选择请假类型"}]})(E.createElement(y.Z,{placeholder:"请选择请假类型"},E.createElement(Y,{value:F.gGH.things},F.gGH.description(F.gGH.things)),E.createElement(Y,{value:F.gGH.disease},F.gGH.description(F.gGH.disease)),E.createElement(Y,{value:F.gGH.years},F.gGH.description(F.gGH.years)),E.createElement(Y,{value:F.gGH.marriage},F.gGH.description(F.gGH.marriage)),E.createElement(Y,{value:F.gGH.maternity},F.gGH.description(F.gGH.maternity)),E.createElement(Y,{value:F.gGH.paternal},F.gGH.description(F.gGH.paternal)),E.createElement(Y,{value:F.gGH.bereavement},F.gGH.description(F.gGH.bereavement)),E.createElement(Y,{value:F.gGH.goOut},F.gGH.description(F.gGH.goOut))))}];return E.createElement(D.IT,{title:"基本信息"},E.createElement(D.KP,{items:p,cols:4,layout:{labelCol:{span:10},wrapperCol:{span:14}}}))})),(0,m.Z)((0,c.Z)(n),"renderLeavePeople",(function(){var e=n.props.form,t=e.getFieldDecorator,r=e.getFieldValue,a=n.state.citySpelling,i=[{label:"实际请假人",form:t("leavePeople",{initialValue:w.Iq.account.name})(E.createElement("span",null,w.Iq.account.name))},{label:"联系方式",form:t("phone",{initialValue:void 0,rules:[{validator:n.onValidatorPhone}]})(E.createElement(d.Z,{placeholder:"请输入手机号"}))},{label:"项目",form:t("platforms",{initialValue:void 0,rules:[{required:!0,message:"请选择项目"}]})(E.createElement(C.Yg,{showArrow:!0,allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请选择项目",onChange:n.onChangePlatforms}))},{label:"城市",form:t("cities",{initialValue:void 0,rules:[{required:!0,message:"请选择城市"}]})(E.createElement(C.Wn,{showArrow:!0,namespace:"cities",isExpenseModel:!0,allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请选择城市",platforms:r("platforms")||"",onChange:n.onChangeCity}))},{label:"团队",form:t("districts",{rules:[{required:!0,message:"请选择团队"}]})(E.createElement(C.Wc,{showArrow:!0,namespace:"districts",allowClear:!0,showSearch:!0,filterDisable:!0,optionFilterProp:"children",placeholder:"请选择团队",platforms:r("platforms")||"",cities:a}))}];return E.createElement(D.IT,{title:"请假人信息"},E.createElement(D.KP,{items:i,cols:3,layout:{labelCol:{span:5},wrapperCol:{span:19}}}))})),(0,m.Z)((0,c.Z)(n),"renderLeave",(function(){var e=n.props.form.getFieldDecorator,t=[{label:"开始时间",form:e("startTime",{rules:[{required:!0,message:"请选择开始时间"}],getValueFromEvent:n.onChangeTimeRange,initialValue:null})(E.createElement(i.Z,{style:{width:"40%"},disabledTime:n.disabledRangeTime,showTime:{hideDisabledOptions:!0,format:"HH:mm",defaultValue:g()("".concat(g()().hours(),":00"),"HH:mm")},format:"YYYY-MM-DD HH:mm"}))},{label:"结束时间",form:e("endTime",{rules:[{required:!0,message:"请选择结束时间"}],getValueFromEvent:n.onChangeEndTimeRange,initialValue:null})(E.createElement(i.Z,{style:{width:"40%"},disabledTime:n.disabledEndRangeTime,disabledDate:n.disabledEndDate,showTime:{hideDisabledOptions:!0,format:"HH:mm",defaultValue:g()("".concat(g()().hours(),":00"),"HH:mm")},format:"YYYY-MM-DD HH:mm"}))},{label:"时长",form:e("duration",{nitialValue:void 0,rules:[{required:!0,message:"请输入时长"}]})(E.createElement(a.Z,{min:0,placeholder:"请输入时长",precision:1}))},{label:"请假事由",form:e("note",{nitialValue:void 0,rules:[{required:!0,message:"请选择请假事由"}]})(E.createElement(x,{rows:4}))},{label:"工作安排",form:e("work",{nitialValue:void 0})(E.createElement(x,{rows:4}))}];return E.createElement(D.IT,{title:"请假信息"},E.createElement(D.KP,{items:t,cols:1,layout:{labelCol:{span:2},wrapperCol:{span:10}}}),E.createElement(H.Z,{domain:"cost",form:n.props.form}))})),n.state={citySpelling:"",flag:!0},n.private={namespace:"namespace".concat(Math.floor(1e5*Math.random()))},n}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){var e=this.props.location.query.applicationOrderId;this.props.dispatch({type:"expenseExamineOrder/fetchExamineOrderDetail",payload:{id:e}})}},{key:"componentWillUnmount",value:function(){this.props.dispatch({type:"expenseExamineOrder/reduceExamineOrderDetail",payload:{}})}},{key:"render",value:function(){return E.createElement(O.Z,{layout:"horizontal"},this.renderTitle(),this.renderLeavePeople(),this.renderLeave(),E.createElement("div",{style:{textAlign:"center"}},E.createElement(n.Z,{type:"primary",onClick:this.onSave},"保存"),E.createElement(n.Z,{type:"primary",style:{marginLeft:20},onClick:this.onNext},"下一步")))}}]),r}(E.Component);t.default=(0,b.connect)((function(e){return{examineOrderDetail:e.expenseExamineOrder.examineOrderDetail}}))(O.Z.create()(V))},24986:function(e,t,r){r(13062);var n=r(71230),a=(r(89032),r(15746)),i=(r(61023),r(11324)),o=(r(52560),r(71577)),l=(r(51838),r(48086)),s=r(15671),c=r(43144),u=r(97326),p=r(60136),f=r(82963),m=r(61120),d=r(4942),y=r(45697),v=r.n(y),Z=r(55609),h=r(67294),g=(r(98703),r(84391)),b=r(99124);function E(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return O(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return O(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,a=function(){};return{s:a,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,l=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return o=e.done,e},e:function(e){l=!0,i=e},f:function(){try{o||null==r.return||r.return()}finally{if(l)throw i}}}}function O(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function D(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function C(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?D(Object(r),!0).forEach((function(t){(0,d.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):D(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function F(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,m.Z)(e);if(t){var a=(0,m.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,f.Z)(this,r)}}var w=function(e){(0,p.Z)(r,e);var t=F(r);function r(e){var n;return(0,s.Z)(this,r),n=t.call(this,e),(0,d.Z)((0,u.Z)(n),"componentWillReceiveProps",(function(e){n.setState({isVerifyFileType:!!e.isVerifyFileType&&e.isVerifyFileType,onSuccess:e.onSuccess?e.onSuccess:void 0,onFailure:e.onFailure?e.onFailure:void 0})})),(0,d.Z)((0,u.Z)(n),"onUpload",(function(){return!1})),(0,d.Z)((0,u.Z)(n),"onCancel",(function(){n.setState(C(C({},n.state),{},{visible:!1}))})),(0,d.Z)((0,u.Z)(n),"onUploadSuccessCallback",(function(e,t){var r=n.props.onSuccess;t&&r&&r(t)})),(0,d.Z)((0,u.Z)(n),"onCheckValue",(function(e,t){var r,n=E(e);try{for(n.s();!(r=n.n()).done;){if(r.value.uid===t)return!0}}catch(e){n.e(e)}finally{n.f()}return!1})),(0,d.Z)((0,u.Z)(n),"onChange",(function(e){var t=e.file,r=n.state.domain,a=n.state,i=a.isVerifyFileType,o=a.verifyFileType,s=t.name.slice(t.name.lastIndexOf(".")+1),c="";if(t.name&&(c=t.name.slice(0,t.name.lastIndexOf("."))),t.size>=152e5)return l.ZP.error("单个压缩包最大限制为15兆，请重新上传");if(i){if(o.some((function(e){return e===s})))return l.ZP.error("不支持上传压缩文件")}else if(o.some((function(e){return e===s}))&&"zip"!==s)return l.ZP.error("仅支持zip格式压缩包，请重新上传");return n.props.dispatch({type:"applicationFiles/uploadAmazonFile",payload:{file:t,domain:r,fileType:s,fileKey:c,onSuccessCallback:n.onUploadSuccessCallback.bind((0,u.Z)(n),t)}}),!1})),n.state={isVerifyFileType:!!e.isVerifyFileType&&e.isVerifyFileType,verifyFileType:["zip","rar","7z","wim","cab","iso","jar","ace","tar","arj","lzh"],onSuccess:e.onSuccess?e.onSuccess:void 0,onFailure:e.onFailure?e.onFailure:void 0,domain:e.domain},n}return(0,c.Z)(r,[{key:"render",value:function(){var e={action:"",name:"file",onChange:this.onChange,beforeUpload:this.onUpload,showUploadList:!1,multiple:!0};return h.createElement("div",{className:b.Z["app-comp-expense-common-upload-box"]},h.createElement(n.Z,null,h.createElement(a.Z,{sm:17,id:b.Z["app-comp-expense-common-upload-btn "]},h.createElement(i.Z,e,h.createElement(o.Z,{className:b.Z["app-comp-expense-common-upload-reset-hover"]},h.createElement(g.Z,null),"点击上传")),h.createElement("br",null),h.createElement("span",{className:b.Z["upload-style"]},"上传压缩包仅支持zip格式，单个压缩包限制15M"))))}}]),r}(h.Component);(0,d.Z)(w,"propTypes",{domain:v().string}),(0,d.Z)(w,"defaultProps",{domain:"deflateDomain"}),t.Z=(0,Z.connect)()(w)},74962:function(e,t,r){r(9070);var n=r(20924),a=r(93433),i=r(15671),o=r(43144),l=r(97326),s=r(60136),c=r(82963),u=r(61120),p=r(4942),f=r(45697),m=r.n(f),d=r(67294),y=r(93517),v=r.n(y),Z=r(24986),h=r(96036);function g(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,u.Z)(e);if(t){var a=(0,u.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,c.Z)(this,r)}}var b=h.KT.CoreFinderList,E=function(e,t){return e.every((function(e,r){return e===t[r]}))},O=function(e){(0,s.Z)(r,e);var t=g(r);function r(e){var o;return(0,i.Z)(this,r),o=t.call(this,e),(0,p.Z)((0,l.Z)(o),"onUploadSuccess",(function(e){var t=o.private.fileList,r=o.props.form.setFieldsValue,n=[].concat((0,a.Z)(t),[e]);o.private.fileList=n,r({fileList:n})})),(0,p.Z)((0,l.Z)(o),"onDeleteFile",(function(e){var t=o.private.fileList,r=o.props.form.setFieldsValue,n=(0,a.Z)(t);n.splice(e,1),o.private.fileList=n,r({fileList:n})})),(0,p.Z)((0,l.Z)(o),"renderCorePreview",(function(e){if(Array.isArray(e)&&v().get(e,"0")){var t=e.map((function(e){return{key:e}}));return d.createElement(b,{data:t,enableDownload:!1,enableRemove:!0,onRemove:o.onDeleteFile})}})),(0,p.Z)((0,l.Z)(o),"renderForm",(function(){var e=o.state.domain,t=o.private.fileList,r=[{label:"上传附件",key:"uploadFile",form:d.createElement("div",null,d.createElement(Z.Z,{namespace:o.private.namespace,onSuccess:o.onUploadSuccess,onFailure:o.onUploadFailure,domain:e}),o.renderCorePreview(t))}];return d.createElement(h.KP,{cols:1,items:r,layout:{labelCol:{span:3},wrapperCol:{span:21}}})})),(0,p.Z)((0,l.Z)(o),"renderHiddenForm",(function(){var e=o.state.fileList,t=[{label:"",form:o.props.form.getFieldDecorator("fileList",{initialValue:e})(d.createElement(n.Z,{hidden:!0}))}];return d.createElement(h.KP,{items:t,cols:1,layout:{labelCol:{span:3},wrapperCol:{span:21}}})})),(0,p.Z)((0,l.Z)(o),"renderContent",(function(){return d.createElement("div",null,o.renderForm(),o.renderHiddenForm())})),o.state={fileListUrl:e.fileListUrl,domain:e.domain},o.private={fileList:e.fileList,namespace:"namespace".concat(Math.floor(1e5*Math.random()))},o}return(0,o.Z)(r,[{key:"render",value:function(){return this.renderContent()}}],[{key:"getDerivedStateFromProps",value:function(e,t){var r=e.fileList,n=e.fileListUrl;return t.prevProps&&E(t.prevProps.fileList,r)&&E(t.prevProps.fileListUrl,n)?null:(t.prevProps=e,r!==t.fileList&&n!==t.fileListUrl?{fileList:r,fileListUrl:n}:null)}}]),r}(d.Component);(0,p.Z)(O,"propTypes",{form:m().object,fileList:m().array,fileListUrl:m().array,domain:m().string}),(0,p.Z)(O,"defaultProps",{form:{},fileList:[],fileListUrl:[],isDown:!1,domain:"deflateDomain"}),t.Z=O},39562:function(){},99124:function(e,t){t.Z={"app-comp-expense-common-upload-box":"HvPrJmcqrWJOrV5j8C5g","app-comp-expense-common-upload-btn":"FXDaFFzmn3v5c61WEw2o","app-comp-expense-common-upload-reset-hover":"Ztvt9wDo4OQefPj4bgYI",icon:"f1zznHvQSxAiiPbzC_L5",p:"LMfU9da5ocO97R5I6Pr5","upload-style":"IJtlVgqAmW2YjinmEqBg"}}}]);