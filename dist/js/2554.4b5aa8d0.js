"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[2554],{12554:function(e,a,l){l.r(a);l(52560);var o=l(71577),n=l(30381),t=l.n(n),r=l(93517),p=l.n(r),s=l(67294),c=l(94315),i=l.n(c),m=l(55609),u=l(96036),f=l(80385),y=l(36886);a.default=(0,m.connect)((function(e){return{employeeTurnoverDetail:e.employeeTurnover.employeeTurnoverDetail}}))((function(e){(0,s.useEffect)((function(){var a=e.dispatch,l=e.location.query.id;a({type:"employeeTurnover/fetchEmployeeTurnoverDetail",payload:{id:"".concat(l)}})}),[]);var a,l,n,r=function(e){if(i().existy(e)&&i().not.empty(e)){var a=p().get(e,"theme_tags").join(",");return s.createElement("span",null,a)}return"--"};return s.createElement("div",null,(l=e.employeeTurnoverDetail,n=[{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"申请单状态",form:p().get(l,"state",void 0)?f.Jku.description(p().get(l,"state",void 0)):"--"},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"姓名",form:p().get(l,"changed_staff_info.name","--")},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"身份证号码",form:p().get(l,"changed_staff_info.identity_card_id","--")},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"性别",form:p().get(l,"changed_staff_info")?f.Y0t.description(p().get(l,"changed_staff_info.gender_id")):"--"},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"所属部门",form:p().get(l,"department","--")},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"岗位名称",form:p().get(l,"station","--")},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"调岗原因",form:p().get(l,"change_reason","--")},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"调岗后部门",form:p().get(l,"adjusted_department","--")},{span:8,layout:{labelCol:{span:6},wrapperCol:{span:15}},label:"调岗后岗位",form:p().get(l,"adjusted_station","--")},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"期望生效时间",form:p().get(l,"active_at",void 0)?t()(p().get(l,"active_at")).format("YYYY.MM.DD"):"--"},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"主题标签",form:r(l)},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"备注",form:p().get(l,"note","--")},{span:24,layout:{labelCol:{span:2},wrapperCol:{span:19}},label:"附件",form:(a=p().get(l,"file_url_list",[]),s.createElement("div",null,a.map((function(e,a){return s.createElement("p",null,s.createElement("a",{className:y.Z["app-comp-expense-borrowing-info-file"],rel:"noopener noreferrer",target:"_blank",key:a,href:e.file_url},e.file_name))}))))}],s.createElement(u.IT,{title:"调岗申请单"},s.createElement(u.KP,{items:n,cols:3}))),s.createElement(u.IT,{style:{textAlign:"center"}},s.createElement(o.Z,{onClick:function(){window.location.href="/#/Employee/Turnover"}},"返回")))}))},36886:function(e,a){a.Z={"app-comp-employee-contract-opration-download":"dJMAgvmTQYGwUsaVkeCC","app-comp-employee-contract-batch-contract":"yqRTAB2ADu84rs4X7rQQ","app-comp-employee-contract-batch-id-card":"zmPoXMO2oTFXDJ0VqFsO","app-comp-expense-borrowing-info-file":"kzsC6LyQj7EKa76eHxCg","app-comp-employee-turnover-create-submit":"tONgwwaLEf72Ne1EL65X","app-comp-employee-turnover-create-save":"ajXiGno65DUWAMmmgZyw"}}}]);