"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[938],{20938:function(e,t,n){n.r(t),n.d(t,{default:function(){return J}});n(20186);var a=n(75385),r=(n(18085),n(55241)),o=n(15671),i=n(43144),c=n(97326),s=n(60136),l=n(82963),p=n(61120),u=n(4942),d=n(94315),m=n.n(d),f=n(93517),h=n.n(f),v=n(30381),y=n.n(v),g=n(55609),Z=n(67294),x=n(96036),w=n(45430),b=n(80385),k=(n(9070),n(20924)),E=(n(21316),n(75443)),C=(n(52560),n(71577)),S=(n(51838),n(48086)),D=(n(54071),n(14072)),T=(n(29093),n(16317)),L=n(88144),_=(n(52466),n(10642)),H=n(71002),F=(n(39305),n(97880)),I=n(66939),P=(n(98703),"vrCx1hCIQcYflFIqO5a5"),O="NSsmntIam3duW6KwDrYs";function Y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,p.Z)(e);if(t){var r=(0,p.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,l.Z)(this,n)}}var M=F.Z.Step,G=function(e){(0,s.Z)(n,e);var t=Y(n);function n(){var e;return(0,o.Z)(this,n),e=t.call(this),(0,u.Z)((0,c.Z)(e),"onAdd",(function(){e.setState({visible:!0})})),(0,u.Z)((0,c.Z)(e),"onSubmit",(function(){e.props.form.validateFields((function(t,n){if(!t){var a={examineFlowId:n.examineFlowId,approvalType:b.ZBL.takeLeave,onSuccessCallback:e.onSuccessCallback,onFailureCallback:e.onFailureCallback};e.private.isSubmit&&e.props.dispatch({type:"expenseExamineOrder/createExamineOrder",payload:a})}}))})),(0,u.Z)((0,c.Z)(e),"onSuccessCallback",(function(e){e&&e._id&&(window.location.href="/#/Expense/Attendance/TakeLeave/Create?applicationOrderId=".concat(e._id))})),(0,u.Z)((0,c.Z)(e),"onFailureCallback",(function(t){e.private.isSubmit=!0,t&&t.zh_message&&S.ZP.error(t.zh_message),e.setState({visible:!1})})),(0,u.Z)((0,c.Z)(e),"onCancel",(function(){e.setState({visible:!1}),(0,e.props.dispatch)({type:"expenseExamineFlow/resetExamineFlowDetail",payload:{}})})),(0,u.Z)((0,c.Z)(e),"onChangeExamineFlow",(function(t){(0,e.props.dispatch)({type:"expenseExamineFlow/fetchExamineDetail",payload:{id:t}})})),(0,u.Z)((0,c.Z)(e),"reduceAccountList",(function(e){return!e||"object"===(0,H.Z)(e)&&Array===e.constructor&&0===e.length?"无":e.reduce((function(e,t,n){return 0===n?t.name:"".concat(e,", ").concat(t.name)}),"")})),(0,u.Z)((0,c.Z)(e),"renderNodeListText",(function(t,n){var a=t&&"object"===(0,H.Z)(t)&&Array===t.constructor?t.reduce((function(t,n,a){return 0===a?"".concat(n.post_name,"(").concat(e.reduceAccountList(n.account_info_list),")"):"".concat(t,", ").concat(n.post_name,"(").concat(e.reduceAccountList(n.account_info_list),")")}),""):"",r=n&&"object"===(0,H.Z)(n)&&Array===n.constructor?n.reduce((function(e,t,n){return 0===n?t.name:"".concat(e,", ").concat(t.name)}),""):"";return a&&r?"".concat(a,", ").concat(r):a||r})),(0,u.Z)((0,c.Z)(e),"renderForm",(function(){var t=e.props.form.getFieldDecorator,n={onChange:e.onChangeExamineFlow,bizType:b.z_o.noCostOf,showSearch:!0,optionFilterProp:"children",placeholder:"请选择审批流",namespace:"overTime",state:[b.BsX.normal],style:{width:"100%"},approvalType:b.ZBL.takeLeave},a=[{label:"审批类型",form:"请假申请"},{label:"审批流",form:t("examineFlowId",{rules:[{required:!0,message:"请选择审批流"}],initialValue:void 0})(Z.createElement(L.Z6,n))}];return Z.createElement(x.KP,{items:a,cols:1,layout:{labelCol:{span:6},wrapperCol:{span:18}}})})),(0,u.Z)((0,c.Z)(e),"renderFlowNodes",(function(){var t=e.props.examineDetail,n=(void 0===t?{}:t).nodeList,a=void 0===n?[]:n;return 0===a.length?"":a.map((function(t,n){return Z.createElement(F.Z,{direction:"vertical",key:n,current:n+1},Z.createElement(M,{title:"节点-".concat(n+1),description:e.renderNodeListText(t.postList,t.accountList)}))}))})),(0,u.Z)((0,c.Z)(e),"renderModal",(function(){var t=e.state.visible,n=(0,c.Z)(e),a=n.onSubmit,r=n.onCancel;return!1===t?null:Z.createElement(_.Z,{title:"新建请假",visible:t,onOk:a,onCancel:r,okText:"确认",cancelText:"取消"},e.renderForm(),e.renderFlowNodes())})),(0,u.Z)((0,c.Z)(e),"renderButton",(function(){return Z.createElement(C.Z,{type:"primary",onClick:e.onAdd,className:O},"新建请假审批")})),e.state={visible:!1},e.private={isSubmit:!0},e}return(0,i.Z)(n,[{key:"componentWillUnmount",value:function(){this.props.dispatch({type:"expenseExamineFlow/resetExamineFlowDetail",payload:{}})}},{key:"render",value:function(){return Z.createElement("div",{className:P},this.renderButton(),this.renderModal())}}]),n}(Z.Component);var A=(0,g.connect)((function(e){return{examineDetail:e.expenseExamineFlow.examineDetail}}))(I.Z.create()(G)),N=n(97116),R={"app-comp-expense-borrowing-tooltip":"LcQEAB7rSkrIQU3Lk6Lw","app-comp-expense-borrowing-actual-borrower":"bw6t_AzBEFf9yyeBOqhd","app-comp-expense-borrowing-flow-info":"IRSUfDdwkBzETN_pIvsh","app-comp-expense-borrowing-operation-reimbursement":"eOYhbSr0dGoQkXsTIlIt","app-comp-expense-borrowin-id":"OjJTy4H8S5gzj2BQcm7Y","app-comp-expense-borrowing-node-color":"FaPbdqko6C_iPzhl73z8","app-comp-expense-manage-template-takeLeave-uplod":"GnCYrah8WrYvtLl7_enA","app-comp-expense-takeLeave-export":"Jv3zEsG7QDN9sYdRzctQ","app-comp-expense-takeLeave-search-time":"LGkNSQpW2U2MNaqujqjD"};function z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function j(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?z(Object(n),!0).forEach((function(t){(0,u.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):z(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function B(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,p.Z)(e);if(t){var r=(0,p.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,l.Z)(this,n)}}var U=T.Z.Option,V=D.Z.RangePicker,K=function(e){(0,s.Z)(n,e);var t=B(n);function n(e){var a;return(0,o.Z)(this,n),a=t.call(this,e),(0,u.Z)((0,c.Z)(a),"onChangePlatforms",(function(e){var t=a.state,n=t.search,r=t.form;n.platforms=e,n.cities=[],n.districts=[],a.setState({search:n,citySpelling:[]}),r.setFieldsValue({cities:void 0}),r.setFieldsValue({districts:void 0})})),(0,u.Z)((0,c.Z)(a),"onChangeCity",(function(e,t){var n=a.state,r=n.search,o=n.form,i=t.map((function(e){return h().get(e,"props.spell",[])}));r.cities=e,r.districts=[],a.setState({search:r,citySpelling:i}),o.setFieldsValue({districts:void 0})})),(0,u.Z)((0,c.Z)(a),"onChangeDistrict",(function(e){var t=a.state.search;t.districts=e,a.setState({search:t})})),(0,u.Z)((0,c.Z)(a),"onReset",(function(){var e=a.props.onSearch;e&&e({page:1,limit:30})})),(0,u.Z)((0,c.Z)(a),"onDealWithData",(function(e){var t=e.platforms,n=e.cities,a=e.districts,r=e.takeLeaveType,o=e.takeLeaveId,i=e.state,c=e.expectStartTime,s=e.expectDoneTime;return{platforms:t,cities:n,districts:a,takeLeaveType:r,takeLeaveId:o,state:i,startMinDate:h().has(c,"0")?y()(c[0]).format("YYYY-MM-DD HH:mm:ss"):"",startMaxDate:h().has(c,"0")?y()(c[1]).format("YYYY-MM-DD HH:mm:ss"):"",endMinDate:h().has(s,"0")?y()(s[0]).format("YYYY-MM-DD HH:mm:ss"):"",endMaxDate:h().has(s,"0")?y()(s[1]).format("YYYY-MM-DD HH:mm:ss"):""}})),(0,u.Z)((0,c.Z)(a),"onSearch",(function(e){var t=a.props.onSearch,n=a.onDealWithData(e);t&&t(n)})),(0,u.Z)((0,c.Z)(a),"onCreateExportTask",(function(){var e=a.state.form,t=a.props,n=t.dispatch,r=void 0===n?function(){}:n,o=t.activeKey;e.validateFields((function(e,t){if(!e){var n=j(j({},a.onDealWithData(t)),{},{onSuccessCallback:function(){return S.ZP.success("请求成功")}});Number(o)===b.CyZ.mine&&(n.applyAccountId=N.Iq.account.id),r({type:"expenseTakeLeave/exportTakeLeave",payload:n})}}))})),(0,u.Z)((0,c.Z)(a),"onToggle",(function(e){var t=a.props.onToggle;t&&t(e)})),(0,u.Z)((0,c.Z)(a),"onHookForm",(function(e){a.setState({form:e})})),(0,u.Z)((0,c.Z)(a),"disableDateOfMonth",(function(e){return e&&e>new Date})),(0,u.Z)((0,c.Z)(a),"renderSearchForm",(function(){var e=a.props.expand,t=a.state.search.platforms,n=a.state.citySpelling,r=Z.createElement(E.Z,{title:"创建下载任务？",onConfirm:a.onCreateExportTask,okText:"确认",cancelText:"取消",key:"export"},Z.createElement(C.Z,{type:"primary",className:R["app-comp-expense-takeLeave-export"]},"导出EXCEL")),o=[];b.CyZ.mine===Number(a.props.activeKey)&&o.push(Z.createElement(A,{key:"createModal"})),w.ZP.canOperateExpenseAttendanceTakeLeaveAll()&&o.push(r);var i=[{label:"请假类型",form:function(e){return e.getFieldDecorator("takeLeaveType")(Z.createElement(T.Z,{allowClear:!0,placeholder:"请选择请假类型"},Z.createElement(U,{value:b.gGH.things},b.gGH.description(b.gGH.things)),Z.createElement(U,{value:b.gGH.disease},b.gGH.description(b.gGH.disease)),Z.createElement(U,{value:b.gGH.years},b.gGH.description(b.gGH.years)),Z.createElement(U,{value:b.gGH.marriage},b.gGH.description(b.gGH.marriage)),Z.createElement(U,{value:b.gGH.maternity},b.gGH.description(b.gGH.maternity)),Z.createElement(U,{value:b.gGH.paternal},b.gGH.description(b.gGH.paternal)),Z.createElement(U,{value:b.gGH.bereavement},b.gGH.description(b.gGH.bereavement)),Z.createElement(U,{value:b.gGH.goOut},b.gGH.description(b.gGH.goOut))))}},{label:"请假单号",form:function(e){return e.getFieldDecorator("takeLeaveId")(Z.createElement(k.Z,{placeholder:"请输入借款单号"}))}},{label:"流程状态",form:function(e){return e.getFieldDecorator("state")(Z.createElement(T.Z,{allowClear:!0,placeholder:"请选择流程状态"},Z.createElement(U,{value:b.DU5.processing},b.DU5.description(b.DU5.processing)),Z.createElement(U,{value:b.DU5.finish},b.DU5.description(b.DU5.finish)),Z.createElement(U,{value:b.DU5.close},b.DU5.description(b.DU5.close))))}},{label:"申请请假开始时间",form:function(e){return e.getFieldDecorator("expectStartTime",{initialValue:null})(Z.createElement(V,{key:"expect-start-time",format:"YYYY-MM-DD",showTime:{defaultValue:[y()("00:00:00","HH:mm:ss"),y()("23:59:59","HH:mm:ss")]},className:R["app-comp-expense-takeLeave-search-time"]}))}},{label:"申请请假结束时间",form:function(e){return e.getFieldDecorator("expectDoneTime",{initialValue:null})(Z.createElement(V,{key:"expect-done-time",format:"YYYY-MM-DD",showTime:{defaultValue:[y()("00:00:00","HH:mm:ss"),y()("23:59:59","HH:mm:ss")]},className:R["app-comp-expense-takeLeave-search-time"]}))}}];b.CyZ.all===Number(a.props.activeKey)&&i.unshift({label:"项目",form:function(e){return e.getFieldDecorator("platforms",{initialValue:void 0})(Z.createElement(L.Yg,{mode:"multiple",showArrow:!0,allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请选择平台",onChange:a.onChangePlatforms}))}},{label:"城市",form:function(e){return e.getFieldDecorator("cities",{initialValue:void 0})(Z.createElement(L.Wn,{mode:"multiple",showArrow:!0,namespace:"cities",isExpenseModel:!0,allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请选择城市",platforms:t,onChange:a.onChangeCity}))}},{label:"商圈",form:function(e){return e.getFieldDecorator("districts",{initialValue:void 0})(Z.createElement(L.Wc,{showArrow:!0,mode:"multiple",allowClear:!0,showSearch:!0,namespace:"districts",optionFilterProp:"children",placeholder:"请选择商圈",platforms:t,cities:n,disabled:a.state.isShowDistricts,onChange:a.onChangeDistrict}))}});var c={items:i,expand:e,operations:o,isExpenseModel:!0,onReset:a.onReset,onSearch:a.onSearch,onToggle:a.onToggle,onHookForm:a.onHookForm,namespace:"borrow".concat(a.props.activeKey)};return Z.createElement(x.IT,null,Z.createElement(x.yL,c))})),(0,u.Z)((0,c.Z)(a),"render",(function(){return Z.createElement("div",null,a.renderSearchForm())})),a.state={form:void 0,search:{platforms:[],cities:[],districts:[]},citySpelling:[]},a}return n}(Z.Component),W=K;function q(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,p.Z)(e);if(t){var r=(0,p.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,l.Z)(this,n)}}var Q=function(e){(0,s.Z)(n,e);var t=q(n);function n(e){var i;return(0,o.Z)(this,n),i=t.call(this,e),(0,u.Z)((0,c.Z)(i),"onShowRepaymentsModal",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2?arguments[2]:void 0;i.setState({repaymentsVisible:!0,borrowOrderId:e,flowInfo:t,state:n})})),(0,u.Z)((0,c.Z)(i),"onHideRepaymentsModal",(function(){i.setState({repaymentsVisible:!1,borrowOrderId:""})})),(0,u.Z)((0,c.Z)(i),"onSearch",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=i.state.activeKey;i.setState({searchInfo:e}),i.private.searchParams=e,(m().not.existy(i.private.searchParams.page)||m().empty(i.private.searchParams.page))&&(i.private.searchParams.page=1),(m().not.existy(i.private.searchParams.limit)||m().empty(i.private.searchParams.limit))&&(i.private.searchParams.limit=30),Number(t)===b.CyZ.mine&&(i.private.searchParams.applyAccountId=N.Iq.account.id),i.props.dispatch({type:"expenseTakeLeave/fetchExpenseTakeLeaveList",payload:i.private.searchParams})})),(0,u.Z)((0,c.Z)(i),"onChangePage",(function(e,t){var n=i.private.searchParams;n.page=e,n.limit=t,i.onSearch(n)})),(0,u.Z)((0,c.Z)(i),"onShowSizeChange",(function(e,t){var n=i.private.searchParams;n.page=e,n.limit=t,i.onSearch(n)})),(0,u.Z)((0,c.Z)(i),"onChangeTab",(function(e){(0,i.props.dispatch)({type:"expenseTakeLeave/resetExpenseTakeLeave"}),i.setState({activeKey:e},(function(){return i.onSearch()}))})),(0,u.Z)((0,c.Z)(i),"onToggle",(function(e){i.setState({isShowExpand:e})})),(0,u.Z)((0,c.Z)(i),"renderSearch",(function(){var e=(0,c.Z)(i).onSearch,t=i.state,n=t.activeKey,a=t.isShowExpand,r=i.props.dispatch;return Z.createElement(W,{onSearch:e,dispatch:r,activeKey:n,expand:a,onToggle:i.onToggle})})),(0,u.Z)((0,c.Z)(i),"renderContent",(function(){var e=i.props.expenseTakeLeaveMineList,t=h().get(e,"data",[]),n=h().get(e,"_meta",{}),o=h().get(n,"result_count",0),c=[{title:"请假单号",dataIndex:"_id",key:"_id",width:100,fixed:"left",render:function(e){return Z.createElement("div",{className:R["app-comp-expense-borrowin-id"]},e)}},{title:"项目",dataIndex:"platform_name",key:"platform_name",width:100,render:function(e){return e||"--"}},{title:"城市",dataIndex:"city_name",key:"city_name",width:100,render:function(e){return e||"--"}},{title:"团队",dataIndex:"biz_district_name",key:"biz_district_name",width:150,render:function(e){return e||"--"}},{title:"实际请假人",dataIndex:"actual_apply_name",key:"actual_apply_name",width:100,render:function(e){return Z.createElement("div",{className:R["app-comp-expense-borrowing-actual-borrower"]},e)}},{title:"请假类型",dataIndex:"leave_type",key:"leave_type",width:100,render:function(e){return b.gGH.description(e)||"--"}},{title:"请假事由",dataIndex:"reason",key:"reason",width:120,render:function(e){return m().not.existy(e)||m().empty(e)?"--":e.length<=11?Z.createElement("span",null,e):Z.createElement(r.Z,{content:e,title:"请假事由",trigger:"hover"},Z.createElement("div",null,e.slice(0,11),"..."))}},{title:"审批流",dataIndex:"application_order_info",key:"application_order_info.flow_info",width:160,render:function(e){var t=h().get(e,"flow_info.name",void 0);return Z.createElement("div",{className:R["app-comp-expense-borrowing-flow-info"]},t)||"--"}},{title:"流程状态",dataIndex:"state",key:"state",width:100,render:function(e){return b.DU5.description(e)||"--"}},{title:"当前节点",dataIndex:"application_order_info",key:"currentFlowNodeInfo",width:150,render:function(e){var t=e.current_flow_node_info,n=void 0===t?{}:t;if(n){var a=n.name,r=n.account_list,o="";return r.length>0&&(o="(",r.map((function(e){o+=e.name})),o+=")"),Z.createElement("div",{className:R["app-comp-expense-overtime-table-line"]},"".concat(a).concat(o))}return"--"}},{title:"申请人",dataIndex:"apply_account_info",key:"apply_account_info.name",width:100,render:function(e){return h().get(e,"name","--")}},{title:"开始时间",dataIndex:"start_at",key:"start_at",width:150,render:function(e){return e?y()(e).format("YYYY-MM-DD HH:mm"):"--"}},{title:"结束时间",dataIndex:"end_at",key:"end_at",width:150,render:function(e){return e?y()(e).format("YYYY-MM-DD HH:mm"):"--"}},{title:"操作",dataIndex:"operation",key:"operation",width:120,fixed:"right",render:function(e,t){var n=t._id,a=[];return a.push(Z.createElement("a",{key:"detail",href:"/#/Expense/Attendance/TakeLeave/Detail?takeLeaveId=".concat(n),target:"_blank",rel:"noopener noreferrer"},"查看")),a}}],s={defaultPageSize:30,onChange:i.onChangePage,total:o,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:i.onShowSizeChange},l=i.private.searchParams.page;return l&&(s.current=l),Z.createElement(x.IT,{title:"请假列表"},Z.createElement(a.Z,{rowKey:function(e){return e._id},dataSource:t,columns:c,bordered:!0,pagination:s,scroll:{x:1700,y:400}}))})),(0,u.Z)((0,c.Z)(i),"renderTabContent",(function(){return Z.createElement("div",null,i.renderSearch(),i.renderContent())})),(0,u.Z)((0,c.Z)(i),"renderTabs",(function(){var e=[];return w.ZP.canOperateExpenseAttendanceTakeLeaveMy()&&e.push({title:"我的",content:i.renderTabContent(b.CyZ.mine),key:b.CyZ.mine}),w.ZP.canOperateExpenseAttendanceTakeLeaveAll()&&e.push({title:"全部",content:i.renderTabContent(b.CyZ.all),key:b.CyZ.all}),Z.createElement(x.DF,{items:e,onChange:i.onChangeTab,defaultActiveKey:"".concat(b.CyZ.mine)})})),(0,u.Z)((0,c.Z)(i),"render",(function(){return Z.createElement("div",null,i.renderTabs())})),i.state={repaymentsVisible:!1,activeKey:b.CyZ.mine,borrowOrderId:"",isShowExpand:!0,flowInfo:{},state:void 0},i.private={searchParams:{limit:30,page:1,applyAccountId:N.Iq.account.id}},i}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){this.props.dispatch({type:"expenseTakeLeave/fetchExpenseTakeLeaveList",payload:this.private.searchParams})}},{key:"componentWillUnmount",value:function(){this.props.dispatch({type:"expenseTakeLeave/resetExpenseTakeLeave"})}}]),n}(Z.Component);var J=(0,g.connect)((function(e){return{expenseTakeLeaveMineList:e.expenseTakeLeave.expenseTakeLeaveMineList}}))(Q)}}]);