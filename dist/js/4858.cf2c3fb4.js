"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[4858],{24858:function(e,t,n){n.r(t),n.d(t,{default:function(){return F}});n(20186);var r=n(75385),o=(n(18085),n(55241)),a=n(15671),i=n(43144),c=n(97326),l=n(60136),u=n(82963),s=n(61120),p=n(4942),f=n(93517),m=n.n(f),h=n(55609),d=n(30381),y=n.n(d),g=n(67294),O=n(96036),v=(n(9070),n(20924)),b=(n(35668),n(86585)),Z=(n(54071),n(14072)),w=n(88144),S=n(8240);function j(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,s.Z)(e);if(t){var o=(0,s.Z)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return(0,u.Z)(this,n)}}var E=O.Hr.Option,P=function(e){(0,l.Z)(n,e);var t=j(n);function n(e){var r;return(0,a.Z)(this,n),r=t.call(this,e),(0,p.Z)((0,c.Z)(r),"render",(function(){var e=r.props.operationObject,t=m().get(e,"domains",{}),n=Object.keys(t).map((function(e){return g.createElement(E,{value:e,key:e},t[e])})),o=(0,S.CE)(["dispatch","operationObject"],r.props);return g.createElement(O.Hr,o,n)})),r.state={},r}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){this.props.dispatch({type:"organizationOperationLog/fetchOperationObject",payload:{}})}},{key:"componentWillUnmount",value:function(){this.props.dispatch({type:"organizationOperationLog/reduceOperationObject",payload:{}})}}]),n}(g.Component),k=(0,h.connect)((function(e){return{operationObject:e.organizationOperationLog.operationObject}}))(P);function C(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,s.Z)(e);if(t){var o=(0,s.Z)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return(0,u.Z)(this,n)}}var R=Z.Z.RangePicker,z=function(e){(0,l.Z)(n,e);var t=L(n);function n(e){var r;return(0,a.Z)(this,n),r=t.call(this,e),(0,p.Z)((0,c.Z)(r),"onHookForm",(function(e){r.form=e})),(0,p.Z)((0,c.Z)(r),"onReset",(function(){var e=[y()().subtract("days",6),y()()],t={page:1,limit:30,date:e};r.form.setFieldsValue({date:e||void 0}),r.props.onSearch&&r.props.onSearch(t)})),(0,p.Z)((0,c.Z)(r),"onSearch",(function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?C(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):C(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({page:1,limit:30},e);r.props.onSearch&&r.props.onSearch(t)})),(0,p.Z)((0,c.Z)(r),"onChangeOperator",(function(e){var t=!1,n=!1;e&&Array.isArray(e)&&(e.includes("staff_profile")&&(t=!0),(e.includes("department_manage")||e.includes("biz_data_business")||e.includes("biz_label_manage"))&&(n=!0)),r.setState({isShowDepartmentForm:n,isShowEmployeeNameForm:t})})),(0,p.Z)((0,c.Z)(r),"render",(function(){var e=r.state.operations,t=r.props.date,n=[g.createElement(b.Z.Item,{label:"时间",name:"date"},g.createElement(R,{style:{width:"100%"}})),g.createElement(b.Z.Item,{label:"操作对象",name:"domain"},g.createElement(k,{allowClear:!0,showSearch:!0,showArrow:!0,enableSelectAll:!0,mode:"multiple",optionFilterProp:"children",placeholder:"请选择操作对象",onChange:r.onChangeOperator})),g.createElement(b.Z.Item,{label:"操作者",name:"name"},g.createElement(v.Z,{allowClear:!0,placeholder:"请输入操作者"}))];r.state.isShowEmployeeNameForm&&(n[n.length]=g.createElement(b.Z.Item,{label:"姓名",name:"employeeName"},g.createElement(v.Z,{allowClear:!0,placeholder:"请输入"}))),r.state.isShowDepartmentForm&&(n[n.length]=g.createElement(b.Z.Item,{label:"部门",name:"department"},g.createElement(w.MG,{namespace:"operationLog",isAuthorized:!0})));var o={initialValues:{date:t},items:n,operations:e,onReset:r.onReset,onSearch:r.onSearch,expand:!0,onHookForm:r.onHookForm};return g.createElement(O.IT,null,g.createElement(O.j6,o))})),r.state={isShowEmployeeNameForm:!1,isShowDepartmentForm:!1},r.form=null,r}return n}(g.Component),I=z;function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function _(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,s.Z)(e);if(t){var o=(0,s.Z)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return(0,u.Z)(this,n)}}var x=function(e){(0,l.Z)(n,e);var t=_(n);function n(e){var i;return(0,a.Z)(this,n),i=t.call(this,e),(0,p.Z)((0,c.Z)(i),"onShowSizeChange",(function(e,t){var n=i.state.searchParams;n.page=e,n.limit=t,i.onSearch(n)})),(0,p.Z)((0,c.Z)(i),"onChangePage",(function(e,t){var n=i.state.searchParams;n.page=e,n.limit=t,i.onSearch(n)})),(0,p.Z)((0,c.Z)(i),"onSearch",(function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e);i.setState({searchParams:t},(function(){i.onInterface()}))})),(0,p.Z)((0,c.Z)(i),"renderTables",(function(){var e=i.props.operationObject,t=m().get(e,"domains",{}),n=m().get(e,"events",{}),a=[{title:"时间",dataIndex:"created_at",key:"created_at",width:150,render:function(e){return e?y()(e).format("YYYY-MM-DD HH:mm"):"--"}},{title:"操作者",dataIndex:["operator_info","name"],key:"operator_info.name",width:100,render:function(e){return e||"--"}},{title:"手机号",dataIndex:["operator_info","phone"],key:"operator_info.phone",width:150,render:function(e){return e||"--"}},{title:"操作对象",dataIndex:"domain",key:"domain",width:150,render:function(e){return e?t[e]:"--"}},{title:"操作类型",dataIndex:"event",key:"event",width:100,render:function(e){return e?n[e]:"--"}},{title:"详细数据",dataIndex:"description",key:"description",render:function(e){if(!e||""===e)return"--";var t=e.split(".");return t.length<=2?t.map((function(e){return g.createElement("div",null,e,e?"。":null)})):g.createElement(o.Z,{content:g.createElement("div",{style:{maxWidth:400}},t.map((function(e){return g.createElement("div",{style:{textIndent:"2em"}},e,e?"。":null)}))),title:"详细数据",trigger:"hover"},g.createElement("div",null,t.slice(0,2).map((function(e,t){return g.createElement("div",null,e,e&&1!==t?"。":null," ",1===t?"...":null)}))))}}],c=m().get(i.props,"operationLogList",{}),l={current:i.state.searchParams.page,pageSize:i.state.searchParams.limit,onChange:i.onChangePage,showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:i.onShowSizeChange,pageSizeOptions:["10","20","30","40"],showTotal:function(e){return"总共".concat(e,"条")},total:m().get(c,"_meta.result_count",0)};return g.createElement(O.IT,{title:"操作日志列表"},g.createElement(r.Z,{rowKey:function(e,t){return t},pagination:l,columns:a,dataSource:c.data,bordered:!0,scroll:{y:500}}))})),i.state={searchParams:{page:1,limit:30,date:[y()().subtract("days",6),y()()]}},i}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){this.onInterface(),this.props.dispatch({type:"organizationOperationLog/fetchOperationObject",payload:{}})}},{key:"componentWillUnmount",value:function(){this.props.dispatch({type:"organizationOperationLog/reduceOperationLogList",payload:{}}),this.props.dispatch({type:"organizationOperationLog/reduceOperationObject",payload:{}})}},{key:"onInterface",value:function(){this.props.dispatch({type:"organizationOperationLog/fetchOperationLogList",payload:this.state.searchParams})}},{key:"render",value:function(){return g.createElement("div",null,g.createElement(I,{onSearch:this.onSearch,date:this.state.searchParams.date}),this.renderTables())}}]),n}(g.Component),F=(0,h.connect)((function(e){var t=e.organizationOperationLog;return{operationLogList:t.operationLogList,operationObject:t.operationObject}}))(x)}}]);