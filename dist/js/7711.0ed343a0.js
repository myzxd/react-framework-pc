"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7711],{47711:function(e,t,o){o.r(t);o(52560);var r=o(71577),a=(o(51838),o(48086)),n=o(15671),i=o(43144),s=o(97326),c=o(60136),l=o(82963),p=o(61120),u=o(4942),d=(o(9070),o(20924)),m=o(94315),f=o.n(m),y=o(96486),v=o.n(y),h=o(93517),b=o.n(h),g=o(30381),C=o.n(g),Z=o(67294),I=o(66939),D=(o(98703),o(55609)),O=o(88144),E=o(80385),x=o(67442),F=o(55509),T=o(75314),P=o(51872),N=o(96036),S=o(24986),j=o(28501),A=o(89690),k=o(81170);function Y(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function L(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Y(Object(o),!0).forEach((function(t){(0,u.Z)(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):Y(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function V(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var o,r=(0,p.Z)(e);if(t){var a=(0,p.Z)(this).constructor;o=Reflect.construct(r,arguments,a)}else o=r.apply(this,arguments);return(0,l.Z)(this,o)}}var w=d.Z.TextArea,M=function(e){(0,c.Z)(o,e);var t=V(o);function o(e){var r;(0,n.Z)(this,o),r=t.call(this,e),(0,u.Z)((0,s.Z)(r),"onSuccessCallback",(function(){var e=r.props.location.query,t=e.orderId,o=e.approvalKey;r.props.history.push("/Expense/Manage/ExamineOrder/Form?orderId=".concat(t,"&approvalKey=").concat(o))})),(0,u.Z)((0,s.Z)(r),"onFailureCallback",(function(e){if(f().existy(e.zh_message)&&f().not.empty(e.zh_message))return a.ZP.error(e.zh_message)})),(0,u.Z)((0,s.Z)(r),"onVerifyExpenseCostItems",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,o=arguments.length>2?arguments[2]:void 0,r=arguments.length>3?arguments[3]:void 0;if(f().empty(e))return a.ZP.error("分摊数据为空"),!0;if(f().not.array(e))return a.ZP.error("分摊数据格式错误"),!0;var n={vendor:"分摊信息供应商未选择",platform:"分摊信息平台未选择",city:"分摊信息城市未选择",district:"分摊信息商圈未选择",costCount:"分摊金额不能为空"};Number(o)===E.F$Y.team&&r!==E.F$Y.headquarters&&(n.teamType="团队类型未选择",n.teamId="团队ID未选择"),Number(o)===E.F$Y.team&&r===E.F$Y.headquarters&&(n.teamId="团队未选择"),Number(o)===E.F$Y.person&&(n.staffId="个人信息未选择",n.staffName="档案ID未选择");var i=!1,s=!1;return e.forEach((function(e,o){!0!==i&&(f().empty(e)&&(s=!0),Number(t)!==E.eL2.custom||!f().not.existy(e.costCount)&&0!==e.costCount||(i=!0,a.ZP.error("第".concat(o+1,"条分摊明细 : ").concat(n.costCount))),Object.keys(e).forEach((function(t){f().not.existy(n[t])||!0===i||(f().not.existy(e[t])||f().empty(e[t]))&&(i=!0,a.ZP.error("第".concat(o+1,"条分摊明细 : ").concat(n[t])))})))})),!0===s?a.ZP.error("分摊数据为空"):!0===i})),(0,u.Z)((0,s.Z)(r),"onChangeFilterDiffDay",(function(e){var t=C()(e[0],"YYYY-MM-DD HH:00"),o=C()(e[1],"YYYY-MM-DD HH:00").diff(t,"day"),r=0;return o>=0?(Array.from({length:o}).forEach((function(){r+=1})),r):"--"})),(0,u.Z)((0,s.Z)(r),"onSubmit",(function(){r.props.form.validateFields((function(e,t){if(!e){var o=t.expense,n=o.costItems,i=o.costBelong,s=t.costAttribution,c=void 0===s?void 0:s,l=t.costCenterType;if(!0===r.onVerifyExpenseCostItems(t.expense.costItems,i,c,l))return a.ZP.error("分摊数据为空");var p=n.map((function(e){return v().omit(e,["cityName","platformName","vendorName","districtName"])}));Number(i)===E.eL2.custom&&(p=n.map((function(e){return v().omit(e,["cityName","platformName","vendorName","districtName","costCount"])})));var u=v().uniqWith(p,v().isEqual);if(p.length!==u.length)return a.ZP.error("成本分摊不能设置相同的成本归属");var d={costBelong:i,costItems:n.map((function(e){var t=L({},e);return f().existy(e.costCount)&&f().not.empty(e.costCount)&&(t.costCount=e.costCount),t}))},m=Object.values(t.bizExtraData).map((function(e){return 100*e})).reduce((function(e,t){return e+t}))/100;if(m!==t.money)return a.ZP.error("差旅费用明细总和和费用金额不相等，请修改！");var y={};for(var h in t.bizExtraData)y[h]=E.fbc.exchangePriceToCent(t.bizExtraData[h]);var g={id:b().get(r.props,"location.query.recordId",""),record:L(L({},t),{},{storage_type:3,expense:d,actualApplyDays:r.onChangeFilterDiffDay(t.date),actualStartAt:C()(t.date[0]).format("YYYY-MM-DD HH:00:00"),actualDoneAt:C()(t.date[1]).format("YYYY-MM-DD HH:00:00"),bizExtraData:y,fileList:r.state.fileList}),onSuccessCallback:r.onSuccessCallback,onFailureCallback:r.onFailureCallback};if(g.record.actualStartAt===g.record.actualDoneAt)return a.ZP.error("开始时间与结束时间不能完全相同");r.props.dispatch({type:"expenseCostOrder/updateCostOrder",payload:g})}}))})),(0,u.Z)((0,s.Z)(r),"onChangeSubject",(function(e,t){var o=r.state.costAttribution;r.setState({selectedSubjectId:e,selectedCostCenterType:t,costAttribution:e?o:void 0}),r.props.form.setFieldsValue({costCenterType:t})})),(0,u.Z)((0,s.Z)(r),"onChangeCostAttribution",(function(e,t){var o=r.props.form,a=e.cost_center_type,n=void 0===a?void 0:a,i=e.team_type_list,s=void 0===i?[]:i;r.setState({costAttribution:n,teamTypeList:s});var c=o.getFieldsValue(["expense"]).expense||{},l=c.costBelong,p=void 0===l?void 0:l,u=c.costItems,d=void 0===u?[]:u;void 0===p&&e!==E.F$Y.person&&(p=E.eL2.average),o.setFieldsValue({expense:{costBelong:p,costItems:t?d:[{}]}})})),(0,u.Z)((0,s.Z)(r),"onUploadSuccess",(function(e){var t=r.state.fileList;t.push(e),r.setState({fileList:t}),r.props.form.setFieldsValue({fileList:t})})),(0,u.Z)((0,s.Z)(r),"onDeleteFile",(function(e){var t=r.state,o=t.fileList,a=t.fileUrlList;o.splice(e,1),a.splice(e,1),r.setState(L(L({},r.state),{},{fileList:o,fileUrlList:a}))})),(0,u.Z)((0,s.Z)(r),"getPlatFormVendor",(function(e){r.setState({apportionData:e,currentInvoiceFlag:!1},(function(){r.props.form.resetFields("invoiceTitle")}))})),(0,u.Z)((0,s.Z)(r),"renderBasics",(function(){var e=r.state.detail,t=e.applyAccountInfo||{},o=[{label:"费用分组",form:e.costGroupName||"--"},{label:"申请人",form:t.name||"--"}];return Z.createElement(N.IT,{title:"基础信息"},Z.createElement(N.KP,{items:o,cols:2}))})),(0,u.Z)((0,s.Z)(r),"renderExpenseInfo",(function(){var e=r.props.form.getFieldDecorator,t=r.state,o=t.fileList,a=void 0===o?[]:o,n=t.fileUrlList,i=void 0===n?[]:n,s=t.expenseTypeId,c=t.detail,l=t.apportionData,p=t.currentInvoiceFlag,u=t.selectedSubjectId,d=t.costAttribution,m=t.teamTypeList,f=t.platform,y=t.selectedCostCenterType,v=r.props.costOrderDetail,h=void 0===v?{}:v,g=h.costAccountingId,C=h.allocationMode,I=void 0===C?void 0:C,D=h.costAllocationList,x=void 0===D?[]:D,F=h.costCenterType,j=c.costAccountingCode,Y={costBelong:I,costItems:x.map((function(e){var t;e.money&&(t=E.fbc.exchangePriceToYuan(e.money));var o={};if(e.platformCode&&(o.platform=e.platformCode,o.platformName=e.platformCode),e.supplierId&&(o.vendor=e.supplierId,o.vendorName=e.supplierName),e.cityCode&&(o.city=e.cityCode,o.cityName=e.cityName,o.citySpelling=e.citySpelling),e.bizDistrictId&&(o.district=e.bizDistrictId,o.districtName=e.bizDistrictName),e.teamId&&(o.teamId=e.teamId,o.teamType=e.teamType,o.teamName=e.teamName,o.teamIdCode=e.teamIdCode),Object.keys(e.staffInfo).length>0){var r=e.staffInfo,a=r.identity_card_id,n=r.name;o.staffId=a,o.staffName="".concat(n,"(").concat(a,")")}return t&&(o.costCount=t),o}))};if(s){var L=[y===E.F$Y.headquarters?{label:"发票抬头",layout:{labelCol:{span:3},wrapperCol:{span:9}},form:e("invoiceTitle",{initialValue:b().get(c,"invoiceTitle",void 0)})(Z.createElement(A.Z,{platform:"zongbu"}))}:{label:"发票抬头",layout:{labelCol:{span:3},wrapperCol:{span:9}},form:e("invoiceTitle",{initialValue:p?b().get(c,"invoiceTitle",void 0):b().get(l,"vendorName",void 0)})(Z.createElement(O.o2,{platforms:b().get(l,"platform",b().get(c,"platformCodes.0","")),allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请选择供应商",isSubmitNameAsValue:!0}))},{label:"备注",form:e("note",{initialValue:b().get(c,"note",void 0)})(Z.createElement(w,{rows:2}))},{label:"上传附件",form:Z.createElement("div",null,Z.createElement(S.Z,{domain:"cost",namespace:r.private.namespace,onSuccess:r.onUploadSuccess,onFailure:r.onUploadFailure}),a.map((function(e,t){return Z.createElement("p",{key:t},i[t]?Z.createElement("a",{className:k.Z["app-comp-expense-update-upload"],rel:"noopener noreferrer",target:"_blank",key:t,href:i[t]},e):Z.createElement("span",null,e),Z.createElement("span",{onClick:function(){r.onDeleteFile(t)},className:k.Z["app-comp-expense-update-detele"]},"删除"))})))}];return Z.createElement(N.IT,{title:"项目信息"},e("subject",{initialValue:{subjectId:g,costAttribution:F}})(Z.createElement(T.Z,{selectedSubjectId:u||g,expenseTypeId:s,subjectCode:j,form:r.props.form,platform:f,onChangeSubject:r.onChangeSubject,onChangeCostAttribution:r.onChangeCostAttribution})),e("expense",{initialValue:Y})(Z.createElement(P.Z,{costAccountingId:u||g,selectedCostCenterType:y,getPlatFormVendor:r.getPlatFormVendor,form:r.props.form,costAttribution:d,teamTypeList:m,platform:f})),Z.createElement(N.KP,{items:L,cols:1,layout:{labelCol:{span:3},wrapperCol:{span:21}}}))}})),(0,u.Z)((0,s.Z)(r),"renderPaymentInfo",(function(){var e=r.props,t=e.form,o=void 0===t?{}:t,a=e.costOrderDetail,n=void 0===a?{}:a;return Z.createElement(j.Z,{form:o,detail:n,totalMoney:o.getFieldValue("money")})})),(0,u.Z)((0,s.Z)(r),"renderHiddenForm",(function(){var e=r.state.selectedCostCenterType,t=[{label:"",form:r.props.form.getFieldDecorator("costCenterType",{initialValue:e})(Z.createElement(d.Z,{hidden:!0}))}];return Z.createElement(N.KP,{className:k.Z["app-comp-expense-manage-create-form-hide"],items:t,cols:1,layout:{labelCol:{span:2},wrapperCol:{span:22}}})}));var i=b().get(e,"location.query.platform","");return r.state={fileList:b().get(e,"costOrderDetail.attachments",[]),fileUrlList:b().get(e,"costOrderDetail.attachmentPrivateUrls",[]),detail:b().get(e,"costOrderDetail",{}),expenseTypeId:b().get(e,"costOrderDetail.costGroupId",void 0),selectedCostCenterType:b().get(e,"costOrderDetail.costAccountingInfo.costCenterType",void 0),selectedSubjectId:b().get(e,"costOrderDetail.costAccountingId",void 0),apportionData:{},currentInvoiceFlag:!0,costAttribution:b().get(e,"costOrderDetail.costCenterType",void 0),teamTypeList:[],platform:i},r.private={namespace:"namespace".concat(Math.floor(1e5*Math.random()))},r}return(0,i.Z)(o,[{key:"componentDidMount",value:function(){this.props.dispatch({type:"expenseCostOrder/fetchCostOrderDetail",payload:{recordId:b().get(this.props,"location.query.recordId","")}})}},{key:"componentDidUpdate",value:function(e){var t=this.props.costOrderDetail,o=void 0===t?{}:t,r=e.costOrderDetail,a=void 0===r?{}:r;0===Object.keys(a).length&&Object.keys(a).length!==Object.keys(o).length&&this.setState({fileList:b().get(o,"attachments",[]),fileUrlList:b().get(o,"attachmentPrivateUrls",[]),detail:o,expenseTypeId:b().get(o,"costGroupId",void 0),selectedCostCenterType:b().get(o,"costAccountingInfo.costCenterType",void 0)})}},{key:"componentWillUnmount",value:function(){this.props.form.resetFields(),this.props.dispatch({type:"expenseCostOrder/reduceCostOrderDetail",payload:{}})}},{key:"render",value:function(){var e=this.props.costOrderDetail,t=void 0===e?{}:e;return 0===Object.keys(t).length?null:Z.createElement(I.Z,{layout:"horizontal"},this.renderBasics(),Z.createElement(x.Z,{form:this.props.form,detail:this.state.detail}),Z.createElement(F.Z,{form:this.props.form,detail:this.state.detail}),this.renderExpenseInfo(),this.renderPaymentInfo(),this.renderHiddenForm(),Z.createElement("div",{className:k.Z["app-comp-expense-update-button"]},Z.createElement(r.Z,{type:"primary",onClick:this.onSubmit},"提交")))}}]),o}(Z.Component);t.default=(0,D.connect)((function(e){return{costOrderDetail:e.expenseCostOrder.costOrderDetail}}))(I.Z.create()(M))}}]);