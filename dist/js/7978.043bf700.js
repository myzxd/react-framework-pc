"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7978],{7978:function(e,t,n){n.r(t),n.d(t,{default:function(){return L}});n(20186);var a=n(75385),r=n(15671),o=n(43144),c=n(97326),i=n(60136),p=n(82963),l=n(61120),s=n(4942),u=n(94315),d=n.n(u),f=n(67294),y=n(55609),m=n(30381),h=n.n(m),v=n(93517),x=n.n(v),b=n(96036),_=n(97116),Z=n(80385),D=n(45430),A=(n(9070),n(20924)),Y=(n(21316),n(75443)),S=(n(52560),n(71577)),O=(n(54071),n(14072)),T=(n(29093),n(16317)),g=n(45697),E=n.n(g),M=n(88144),w=n(74109);function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function P(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?k(Object(n),!0).forEach((function(t){(0,s.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function I(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,l.Z)(e);if(t){var r=(0,l.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,p.Z)(this,n)}}var C=T.Z.Option,j=O.Z.RangePicker,z=function(e){(0,i.Z)(n,e);var t=I(n);function n(e){var a;return(0,r.Z)(this,n),a=t.call(this,e),(0,s.Z)((0,c.Z)(a),"onReset",(function(){var e=a.props.onSearch;e&&e({applyUserName:"",applyAccountId:"",travelApplyOrderId:"",bizState:"",applyAt:"",expectStartTime:"",expectDoneTime:"",page:1,limit:30})})),(0,s.Z)((0,c.Z)(a),"onHookForm",(function(e){a.setState({form:e})})),(0,s.Z)((0,c.Z)(a),"onCreateExportTask",(function(){a.state.form.validateFields((function(e,t){var n=t.applyUserName,r=t.applyAccountId,o=t.travelApplyOrderId,c=t.bizState,i=t.applyAt,p=t.expectStartTime,l=t.expectDoneTime,s={applyUserName:n,applyAccountId:r,travelApplyOrderId:o,bizState:c,applyStartAt:x().has(i,"0")?h()(i[0]).format("YYYY-MM-DD 00:00:00"):"",applyDoneAt:x().has(i,"0")?h()(i[1]).format("YYYY-MM-DD 00:00:00"):"",expectStartMinAt:x().has(p,"0")?h()(p[0]).format("YYYY-MM-DD 00:00:00"):"",expectStartMaxAt:x().has(p,"0")?h()(p[1]).format("YYYY-MM-DD 00:00:00"):"",expectDoneMinAt:x().has(l,"0")?h()(l[0]).format("YYYY-MM-DD 00:00:00"):"",expectDoneMaxAt:x().has(l,"0")?h()(l[1]).format("YYYY-MM-DD 00:00:00"):""};a.props.isAll||(s=P(P({},s),{},{applyAccountId:_.Iq.account.id})),a.props.dispatch({type:"expenseTravelApplication/exportExpenseTravelApplication",payload:s})}))})),(0,s.Z)((0,c.Z)(a),"onSearch",(function(e){var t=a.props.onSearch,n=e.applyUserName,r=e.applyAccountId,o=e.travelApplyOrderId,c=e.bizState,i=e.applyAt,p=e.expectStartTime,l=e.expectDoneTime,s=x().has(i,"0")?h()(i[0]).format("YYYY-MM-DD 00:00:00"):"",u=x().has(i,"0")?h()(i[1]).format("YYYY-MM-DD 00:00:00"):"",d=x().has(p,"0")?h()(p[0]).format("YYYY-MM-DD 00:00:00"):"",f=x().has(p,"0")?h()(p[1]).format("YYYY-MM-DD 00:00:00"):"",y=x().has(l,"0")?h()(l[0]).format("YYYY-MM-DD 00:00:00"):"",m=x().has(l,"0")?h()(l[1]).format("YYYY-MM-DD 00:00:00"):"";t&&t({applyUserName:n,applyAccountId:r,travelApplyOrderId:o,bizState:c,applyStartAt:s,applyDoneAt:u,expectStartMinAt:d,expectStartMaxAt:f,expectDoneMinAt:y,expectDoneMaxAt:m,page:1,limit:30})})),(0,s.Z)((0,c.Z)(a),"render",(function(){var e="";D.ZP.canOperateEmployeeSearchExportExcel()&&(e=f.createElement(Y.Z,{title:"创建下载任务？",onConfirm:a.onCreateExportTask,okText:"确认",cancelText:"取消"},f.createElement(S.Z,{type:"primary"},"导出EXCEL")));var t=[{label:"实际出差人",form:function(e){return e.getFieldDecorator("applyUserName")(f.createElement(A.Z,{placeholder:"请输入实际出差人"}))}},{label:"出差申请单号",form:function(e){return e.getFieldDecorator("travelApplyOrderId")(f.createElement(A.Z,{placeholder:"请输入出差申请单号"}))}},{label:"报销状态",form:function(e){return e.getFieldDecorator("bizState")(f.createElement(T.Z,{allowClear:!0,placeholder:"请输入报销状态"},f.createElement(C,{value:Z.r0i.undone},Z.r0i.description(1)),f.createElement(C,{value:Z.r0i.completed},Z.r0i.description(100))))}},{label:"申请时间",form:function(e){return e.getFieldDecorator("applyAt",{initialValue:null})(f.createElement(j,{key:"apply-at"}))}},{label:"开始时间",form:function(e){return e.getFieldDecorator("expectStartTime",{initialValue:null})(f.createElement(j,{key:"expect-start-time"}))}},{label:"结束时间",form:function(e){return e.getFieldDecorator("expectDoneTime",{initialValue:null})(f.createElement(j,{key:"expect-done-time"}))}}];a.props.isAll&&t.splice(1,0,{label:"申请人",form:function(e){return e.getFieldDecorator("applyAccountId")(f.createElement(M.Di,{allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请输入申请人"}))}});var n={items:t,operations:e,expand:!0,onReset:a.onReset,onSearch:a.onSearch,onHookForm:a.onHookForm};return f.createElement("div",{className:w.Z["app-comp-expense-ravel-application-search"]},f.createElement(b.yL,n))})),a.state={form:void 0,search:{applyUserName:"",applyAccountId:"",travelApplyOrderId:"",bizState:"",applyAt:"",expectStartTime:"",expectDoneTime:""}},a}return n}(f.Component);(0,s.Z)(z,"propTypes",{onSearch:E().func}),(0,s.Z)(z,"defaultProps",{onSearch:function(){}});var K=z;function F(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function R(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?F(Object(n),!0).forEach((function(t){(0,s.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):F(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function H(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,l.Z)(e);if(t){var r=(0,l.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,p.Z)(this,n)}}var N=function(e){(0,i.Z)(n,e);var t=H(n);function n(e){var o;return(0,r.Z)(this,n),o=t.call(this,e),(0,s.Z)((0,c.Z)(o),"onSelectTab",(function(e){o.props.dispatch({type:"expenseTravelApplication/resetExpenseTravelApplication"}),o.setState({selectedTabKey:e},(function(){return o.onSearch()}))})),(0,s.Z)((0,c.Z)(o),"onSearch",(function(e){o.state.selectedTabKey==="".concat(Z.CyZ.mine)?o.private.searchParams=Object.assign({},e,{selectKey:o.state.selectedTabKey,applyAccountId:_.Iq.account.id}):o.private.searchParams=Object.assign({},e,{selectKey:o.state.selectedTabKey}),(0,o.props.dispatch)({type:"expenseTravelApplication/fetchExpenseTravelApplication",payload:o.private.searchParams})})),(0,s.Z)((0,c.Z)(o),"onShowSizeChange",(function(e,t){var n=o.private.searchParams;n.page=e,n.limit=t,o.onSearch(n)})),(0,s.Z)((0,c.Z)(o),"onChangePage",(function(e,t){var n=o.private.searchParams;n.page=e,n.limit=t,o.onSearch(n)})),(0,s.Z)((0,c.Z)(o),"renderTabContent",(function(){return f.createElement("div",null,o.renderSearch(),o.renderContent())})),(0,s.Z)((0,c.Z)(o),"renderTabs",(function(){var e=[];D.ZP.canOperateExpenseTravelApplicationMy()&&e.push({title:"我的",content:o.renderTabContent(),key:Z.CyZ.mine}),D.ZP.canOperateExpenseTravelApplicationAll()&&e.push({title:"全部",content:o.renderTabContent(),key:Z.CyZ.all});var t="".concat(o.state.selectedTabKey)||"".concat(Z.CyZ.mine);return f.createElement(b.DF,{items:e,onChange:o.onSelectTab,defaultActiveKey:t})})),(0,s.Z)((0,c.Z)(o),"renderSearch",(function(){var e=o.state.selectedTabKey;return f.createElement(K,{isAll:e==="".concat(Z.CyZ.all),onSearch:o.onSearch,dispatch:o.props.dispatch})})),(0,s.Z)((0,c.Z)(o),"renderContent",(function(){var e;e=o.state.selectedTabKey==="".concat(Z.CyZ.mine)?o.props.expenseTravelApplicationMineList:o.props.expenseTravelApplicationAllList;var t=o.private.searchParams.page,n=[{title:"出差申请单号",dataIndex:"_id",key:"_id",fixed:"left",width:200,render:function(e){return e||"--"}},{title:"实际出差人",dataIndex:"apply_user_name",key:"apply_user_name",fixed:"left",width:100,render:function(e){return e||"--"}},{title:"出发地",dataIndex:"departure",key:"departure",width:100,render:function(e){return e?"".concat(e.province_name).concat(e.area_name||"").concat(e.city_name||"").concat(e.detailed_address):"--"}},{title:"目的地",dataIndex:"destination",key:"destination",width:100,render:function(e){return e?"".concat(e.province_name).concat(e.area_name||"").concat(e.city_name||"").concat(e.detailed_address):"--"}},{title:"开始时间",dataIndex:"expect_start_at",key:"expect_start_at",width:100,render:function(e){return e?h()(e).format("YYYY-MM-DD HH:00:00"):"--"}},{title:"结束时间",dataIndex:"expect_done_at",key:"expect_done_at",width:100,render:function(e){return e?h()(e).format("YYYY-MM-DD HH:00:00"):"--"}},{title:"出差天数",dataIndex:"expect_apply_days",key:"expect_apply_days",width:100,render:function(e){return"".concat(e," 天")}},{title:"出差方式",dataIndex:"transport_kind",key:"transport_kind",width:100,render:function(e){var t="";return e.forEach((function(e){t+="".concat(Z.s6P.description(e),", ")})),t?t.substring(0,t.length-2):"--"}},{title:"审批流",dataIndex:"apply_application_order_info",key:"apply_application_order_info.flow_info",width:160,render:function(e){var t=x().get(e,"flow_info.name",void 0);return f.createElement("div",{className:w.Z["app-comp-expense-travel-application-approval"]},t)||"--"}},{title:"流程状态",dataIndex:"state",key:"state",width:100,render:function(e){return e?Z.DU5.description(e):"--"}},{title:"当前节点",dataIndex:"apply_application_order_info",key:"current_flow_node_info",width:100,render:function(e,t){var n=t.apply_application_order_info&&t.apply_application_order_info.current_flow_node_info;if(n){var a=n.name,r=n.account_list,o="";return r.length>0&&(o="(",r.map((function(e){o+=e.name})),o+=")"),a+o}return"--"}},{title:"报销状态",dataIndex:"biz_state",key:"biz_state",width:100,render:function(e){return e?Z.r0i.description(e):"--"}},{title:"申请人",dataIndex:"apply_account_info",key:"apply_account_info",width:100,render:function(e){return d().existy(e)&&d().not.empty(e)?e.state===Z.m3m.off?e.name?"".concat(e.name,"(").concat(Z.m3m.description(e.state),")"):"--":e.name?e.name:"--":"--"}},{title:"申请出差时间",dataIndex:"submit_at",key:"submit_at",width:200,render:function(e){return e?h()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"操作",dataIndex:"operation",key:"operation",fixed:"right",width:120,render:function(e,t){return f.createElement("div",null,D.ZP.canOperateExpenseTravelApplicationDetail()?f.createElement("a",{href:"/#/Expense/TravelApplication/Detail?id=".concat(t._id),target:"_blank",rel:"noopener noreferrer"},"查看"):"--")}}],r={current:void 0===t?1:t,defaultPageSize:30,onChange:o.onChangePage,showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:o.onShowSizeChange,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],total:x().get(e,"_meta.result_count",0)};return f.createElement(b.IT,null,f.createElement(a.Z,{rowKey:function(e){return e._id},pagination:r,columns:n,dataSource:e.data,bordered:!0,scroll:{x:1780,y:500}}))})),o.state={selectedTabKey:"".concat(Z.CyZ.mine)},o.private={searchParams:{limit:30,page:1,selectKey:o.state.selectedTabKey}},o}return(0,o.Z)(n,[{key:"componentDidMount",value:function(){this.private.searchParams=R(R({},this.private.searchParams),{},{applyAccountId:_.Iq.account.id}),this.props.dispatch({type:"expenseTravelApplication/fetchExpenseTravelApplication",payload:this.private.searchParams})}},{key:"render",value:function(){return f.createElement("div",null,this.renderTabs())}}]),n}(f.Component),L=(0,y.connect)((function(e){var t=e.expenseTravelApplication;return{expenseTravelApplicationMineList:t.expenseTravelApplicationMineList,expenseTravelApplicationAllList:t.expenseTravelApplicationAllList}}))(N)},74109:function(e,t){t.Z={"app-comp-expense-travel-application-detail":"Euvc6JGe4E5ygNosyd_f","app-comp-expense-travel-application-detail-project":"_atBvAbqFEU33EB7lkMe","app-comp-expense-travel-application-approval":"_8CmGvlcx7a8K1zhoEH2","app-comp-expense-ravel-application-search":"nDkLZS2xcHdhPHxJIlHO"}}}]);