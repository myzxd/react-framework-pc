"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7556],{77556:function(e,t,a){a.r(t);a(52560);var n=a(71577),l=a(4942),r=(a(54071),a(14072)),o=(a(51838),a(48086)),i=a(15861),s=a(29439),p=(a(29093),a(16317)),c=(a(9070),a(20924)),u=a(87757),m=a.n(u),d=a(30381),f=a.n(d),y=a(93517),v=a.n(y),g=a(67294),b=a(94315),h=a.n(b),E=a(66939),C=(a(98703),a(55609)),_=a(96036),w=a(74962),Z=a(8240),j=a(80385),D=a(48717),O=a(36886);function T(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function k(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?T(Object(a),!0).forEach((function(t){(0,l.Z)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):T(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var x=c.Z.TextArea,q=p.Z.Option;t.default=(0,C.connect)((function(e){return{employeeTurnoverDetail:e.employeeTurnover.employeeTurnoverDetail,employeesAll:e.employeeManage.employeesAll}}))(E.Z.create()((function(e){var t=(0,g.useState)(!1),a=(0,s.Z)(t,2),l=a[0],u=a[1],d=(0,g.useState)(void 0),y=(0,s.Z)(d,2),b=y[0],E=y[1];(0,g.useEffect)((function(){var t=e.dispatch,a=e.location.query.id;void 0!==a&&t({type:"employeeTurnover/fetchEmployeeTurnoverDetail",payload:{id:a}})}),[]);var C,T=function(){var t=(0,i.Z)(m().mark((function t(a){var n;return m().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(18,18!==a.target.value.length){t.next=7;break}return t.next=4,e.dispatch({type:"employeeManage/fetchEmployees",payload:{identityCardId:a.target.value,state:[1,100,101,102,103]}});case 4:if(n=t.sent,0!==v().get(n,"data",[]).length){t.next=7;break}return t.abrupt("return",o.ZP.error("请输入劳动者身份证号"));case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),V=function(t){var a=e.employeeTurnoverDetail;return h().not.empty(t)&&h().existy(t)?g.createElement("div",null,t.map((function(e,t){return g.createElement("span",{key:t},e.name)}))):g.createElement("span",null,v().get(a,"changed_staff_info.name",void 0)||"--")},A=function(t){var a=e.employeeTurnoverDetail;return h().not.empty(t)&&h().existy(t)?g.createElement("div",null,t.map((function(e,t){return g.createElement("span",{key:t},e.identity_card_id)}))):g.createElement("span",null,v().get(a,"changed_staff_info.identity_card_id",void 0)||"--")},P=function(t){var a=e.employeeTurnoverDetail;return h().not.empty(t)&&h().existy(t)?g.createElement("div",null,t.map((function(e,t){return g.createElement("span",{key:t},j.Y0t.description(e.gender_id))}))):g.createElement("span",null,v().get(a,"changed_staff_info")?j.Y0t.description(v().get(a,"changed_staff_info.gender_id")):"--")},S=function(e,t){E(t)},I=function(e,t,a){if(h().not.empty(t)&&h().existy(t)){if(t.length<="5")return void a();a("最多可以输入五个主题标签")}a("请选择主题标签")},M=function(){u(!0)},Y=function(t){var a=e.location.query.id,n=e.employeeTurnoverDetail,l=v().get(e,"employeesAll.data",[]);e.form.validateFieldsAndScroll((function(r,o){if(!r){var i,s=o.fileList;i=h().not.empty(l)&&h().existy(l)?l[0]._id:v().get(n,"changed_staff_info._id",void 0);var p=k(k(k({},o),t),{},{employeeId:i,effectDate:b,fileList:s,id:a});e.dispatch({type:"employeeTurnover/updateEmployeeTurnover",payload:p})}}))},z=function(e){e.preventDefault(),Y({onSuccessCallback:M})},L=function(e){e.preventDefault(),Y({onSuccessCallback:function(){window.location.href="/#/Employee/Turnover"}})},N=function(){u(!1)},$=e.employeeTurnoverDetail;return 0===Object.keys($).length?null:g.createElement("div",null,function(){var t=e.form.getFieldDecorator,a=e.employeeTurnoverDetail,n=v().get(e,"employeesAll.data",[]),l=[{span:24,layout:{labelCol:{span:2},wrapperCol:{span:5}},label:"调岗人员",form:t("postIdCard",{initialValue:v().get(a,"changed_staff_info.identity_card_id",void 0),rules:[{required:!0,validator:Z.Hb,message:"您输入的劳动者身份证号有误，请重新输入"}]})(g.createElement(c.Z,{placeholder:"请输入调岗人员身份证号码",disabled:v().get(a,"state")!==j.Jku.pendding,onChange:T}))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"姓名",form:t("name",{initialValue:void 0})(g.createElement("div",null,V(n)))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"身份证号码",form:t("idCard",{initialValue:void 0})(g.createElement("div",null,A(n)))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"性别",form:t("gender",{initialValue:void 0})(g.createElement("div",null,P(n)))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"所属部门",form:t("department",{initialValue:v().get(a,"department",void 0),rules:[{required:!1,message:"请输入所属部门"},{pattern:/^[^\s]+$/g,message:"格式不正确，不能包含空格"},{max:16,message:"输入的长度为1-16个字符"}]})(g.createElement(c.Z,{placeholder:"请输入所属部门"}))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"岗位名称",form:t("postName",{initialValue:v().get(a,"station",void 0),rules:[{required:!0,message:"请输入岗位名称"},{pattern:/^[\u4e00-\u9fa5a-zA-Z-z]+$/g,message:"只能输入字母,汉字"},{max:16,message:"输入的长度为1-16个字符"}]})(g.createElement(c.Z,{placeholder:"请输入岗位名称"}))},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"调岗原因",form:t("postWhy",{initialValue:v().get(a,"change_reason",void 0),rules:[{required:!0,message:"请输入调岗原因"}]})(g.createElement(x,{placeholder:"请输入调岗原因",rows:4}))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"调岗后部门",form:t("afterDepartment",{initialValue:v().get(a,"adjusted_department",void 0),rules:[{required:!1,message:"请输入调岗后部门"},{pattern:/^[^\s]+$/g,message:"格式不正确，不能包含空格"},{max:16,message:"输入的长度为1-16个字符"}]})(g.createElement(c.Z,{placeholder:"请输入调岗后部门"}))},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"调岗后岗位",form:t("postAfterName",{initialValue:v().get(a,"adjusted_station",void 0),rules:[{required:!0,message:"请输入调岗后岗位"},{pattern:/^[\u4e00-\u9fa5a-zA-Z-z]+$/g,message:"只能输入字母,汉字"},{max:16,message:"输入的长度为1-16个字符"}]})(g.createElement(c.Z,{placeholder:"请输入调岗后岗位"}))},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"期望生效时间",form:t("expectDate",{initialValue:v().get(a,"active_at")?f()("".concat(v().get(a,"active_at")),"YYYY-MM-DD"):null,rules:[{required:!0,message:"请选择期望生效时间"}]})(g.createElement(r.Z,{onChange:S}))},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"主题标签",form:t("themeTag",{initialValue:v().get(a,"theme_tags",void 0),rules:[{required:!0,validator:I}]})(g.createElement(p.Z,{mode:"tags",style:{width:"100%"},placeholder:"请输入主题标签"},g.createElement(q,{value:j.cij.promotion},j.cij.description(j.cij.promotion)),g.createElement(q,{value:j.cij.demotion},j.cij.description(j.cij.demotion)),g.createElement(q,{value:j.cij.level},j.cij.description(j.cij.level))))},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"备注",form:t("note",{initialValue:v().get(a,"note",void 0),rules:[{required:!0,message:"请输入备注"}]})(g.createElement(x,{placeholder:"请输入备注",rows:4}))}],o=v().get(a,"file_url_list",[]).map((function(e){return e.file_name})),i=v().get(a,"file_url_list",[]).map((function(e){return e.file_url}));return g.createElement(_.IT,{title:"调岗申请单"},g.createElement(_.KP,{items:l,cols:3}),g.createElement(w.Z,{domain:"staff",form:e.form,fileList:o,fileListUrl:i}))}(),g.createElement(_.IT,{style:{textAlign:"center"}},g.createElement(n.Z,{type:"primary",className:O.Z["app-comp-employee-turnover-create-submit"],onClick:z},"保存并提交审核"),g.createElement(n.Z,{onClick:function(){window.location.href="/#/Employee/Turnover"}},"返回"),g.createElement(n.Z,{type:"primary",className:O.Z["app-comp-employee-turnover-create-save"],onClick:L},"保存")),(C=e.location.query.id,g.createElement(D.Z,{onHideModal:N,isShowModal:l,turnoverId:C})))})))}}]);