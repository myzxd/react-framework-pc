"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[5860],{45860:function(e,t,n){n.r(t),n.d(t,{default:function(){return N}});n(20186);var a=n(75385),r=(n(18085),n(55241)),o=(n(438),n(14277)),i=n(15671),c=n(43144),s=n(97326),l=n(60136),u=n(82963),d=n(61120),p=n(4942),h=n(30381),f=n.n(h),m=n(67294),v=n(55609),g=n(45697),Z=n.n(g),_=n(68628),b=(n(9070),n(20924)),y=(n(54071),n(14072)),S=(n(29093),n(16317)),w=n(96036),E=n(21385);function P(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?P(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,d.Z)(e);if(t){var r=(0,d.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,u.Z)(this,n)}}var C=S.Z.Option,T=y.Z.MonthPicker,I=function(e){(0,l.Z)(n,e);var t=k(n);function n(){var e;(0,i.Z)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return e=t.call.apply(t,[this].concat(r)),(0,p.Z)((0,s.Z)(e),"onSearch",(function(t){var n=e.props.onSearch,a=x({},t),r=t.month;r&&(a.month=f()(r).format("YYYYMM")),n&&n(a)})),(0,p.Z)((0,s.Z)(e),"onReset",(function(){var t=e.props.onSearch;t&&t({})})),(0,p.Z)((0,s.Z)(e),"onChangeMonth",(function(t){var n=e.props.onChangeMonth;n&&n(t)})),(0,p.Z)((0,s.Z)(e),"disabledDate",(function(e){return e&&e>f()(new Date)})),(0,p.Z)((0,s.Z)(e),"renderSearch",(function(){var t=e.props.platforms,n=void 0===t?[]:t,a={items:[{label:"平台",form:function(e){return e.getFieldDecorator("platforms")(m.createElement(S.Z,{showArrow:!0,placeholder:"请选择平台",allowClear:!0,optionFilterProp:"children",mode:"multiple"},n.map((function(e){return m.createElement(C,{value:e.id,key:e.id},e.name)}))))}},{label:"审批流名称",form:function(e){return e.getFieldDecorator("approvalFlow")(m.createElement(b.Z,{placeholder:"请输入审批流名称",allowClear:!0}))}},{label:"筛选月份",form:function(t){return t.getFieldDecorator("month",{initialValue:f()(new Date)})(m.createElement(T,{placeholder:"请筛选月份",allowClear:!0,disabledDate:e.disabledDate,onChange:e.onChangeMonth}))}}],onSearch:e.onSearch,onReset:e.onReset};return m.createElement("div",{className:E.Z.searchWrap},m.createElement(w.yL,a))})),e}return(0,c.Z)(n,[{key:"render",value:function(){return this.renderSearch()}}]),n}(m.Component);(0,p.Z)(I,"propTypes",{platforms:Z().array,onSearch:Z().func,onChangeMonth:Z().func}),(0,p.Z)(I,"defaultProps",{platforms:[],onSearch:function(){},onChangeMonth:function(){}});var O=I,M=n(97116),D=n(45430);function j(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,d.Z)(e);if(t){var r=(0,d.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,u.Z)(this,n)}}var R=M.Iq.platform(),F=function(e){(0,l.Z)(n,e);var t=j(n);function n(e){var c;return(0,i.Z)(this,n),c=t.call(this,e),(0,p.Z)((0,s.Z)(c),"onSearch",(function(e){c.private.searchParams=e,c.private.searchParams.page||(c.private.searchParams.page=1),c.private.searchParams.limit||(c.private.searchParams.limit=30),c.props.dispatch({type:"expenseStatistics/fetchExpenseStatistics",payload:c.private.searchParams})})),(0,p.Z)((0,s.Z)(c),"onChangePage",(function(e,t){c.private.searchParams.page=e,c.private.searchParams.limit=t,c.onSearch(c.private.searchParams)})),(0,p.Z)((0,s.Z)(c),"onShowSizeChange",(function(e,t){c.private.searchParams.page=e,c.private.searchParams.limit=t,c.onSearch(c.private.searchParams)})),(0,p.Z)((0,s.Z)(c),"onChangeMonth",(function(e){c.setState({month:f()(e).format("YYYYMM")})})),(0,p.Z)((0,s.Z)(c),"changeTime",(function(e){return e&&e===+e?m.createElement("div",{className:E.Z.bossStatisticsTableBreakLine},"".concat(Math.floor(e/3600),"小时").concat(Math.floor(Math.floor(e%3600)/60),"分")):"--"})),(0,p.Z)((0,s.Z)(c),"renderContent",(function(){var e=c.private.searchParams,t=e.page,n=e.limit,i=c.props.statisticsList,s=c.state.month,l=void 0===s?"":s;if(0===Object.keys(i).length)return m.createElement(o.Z,null);var u=i.data,d=void 0===u?[]:u,p=i._meta,h=void 0===p?{}:p,f=[{title:"审批流名称",dataIndex:"name",key:"name",width:180,fixed:"left",align:"center",render:function(e){return e?m.createElement("div",{className:E.Z.bossStatisticsTableBreakLine},e):"--"}},{title:"平台",dataIndex:"platform_name",key:"platform_name",fixed:"left",align:"center",width:90},{title:m.createElement("div",null,m.createElement("span",null,"当月已提报总数量"),m.createElement(r.Z,{content:"本月除关闭的审批单以外，所有提报过的审批单总数量"},m.createElement(_.Z,{className:E.Z.bossStatisticsTablePopoverIcon}))),dataIndex:"sum_orders",key:"sum_orders",width:90,align:"center"},{title:"当月待审批总数量",dataIndex:"sum_wait_orders",key:"sum_wait_orders",width:90,align:"center"},{title:"当月已完成总数量",dataIndex:"sum_done_orders",key:"sum_done_orders",width:90,align:"center"},{title:m.createElement("div",null,m.createElement("span",null,"当月已关闭总数量"),m.createElement(r.Z,{content:"当月关闭的审批单总数量"},m.createElement(_.Z,{className:E.Z.bossStatisticsTablePopoverIcon}))),dataIndex:"sum_close_orders",key:"sum_close_orders",width:90,align:"center"},{title:"节点个数",dataIndex:"flow_nodes_count",key:"flow_nodes_count",width:70,align:"center"},{title:"当前已完成审批总时长",dataIndex:"total_done_time",key:"total_done_time",width:90,align:"center",render:function(e){return c.changeTime(e)}},{title:"已完成审批平均时长",dataIndex:"avg_done_time",key:"avg_done_time",width:90,align:"center",render:function(e){return c.changeTime(e)}},{title:m.createElement("div",null,m.createElement("span",null,"完成率"),m.createElement(r.Z,{content:"当月已完成总数量/当月已提报总数量"},m.createElement(_.Z,{className:E.Z.bossStatisticsTablePopoverIcon}))),dataIndex:"done_rate",key:"done_rate",width:80,align:"center",className:E.Z.bossStatisticsTableHightlight,render:function(e){return e||"--"}},{title:"已完成审批提报-付款平均时长",dataIndex:"avg_submit_to_paid",key:"avg_submit_to_paid",width:120,align:"center",render:function(e){return c.changeTime(e)}},{title:"已完成审批付款-完成平均时长",dataIndex:"avg_paid_to_done",key:"avg_paid_to_done",width:120,align:"center",render:function(e){return c.changeTime(e)}},{title:"提报-付款总时长占比（%）",dataIndex:"rate_submit_to_paid",key:"rate_submit_to_paid",width:120,align:"center",className:E.Z.bossStatisticsTableHightlight,render:function(e){return e||"--"}},{title:"付款-完成总时长占比（%）",dataIndex:"rate_paid_to_done",key:"rate_paid_to_done",align:"center",className:E.Z.bossStatisticsTableHightlight,render:function(e){return e||"--"}},{title:"操作",dataIndex:"_id",key:"_id",width:70,align:"center",fixed:"right",render:function(e){return D.ZP.canOperateExpenseStatisticsDetail()?m.createElement("a",{key:"detail",href:"/#/Expense/Statistics/Detail?approvalFlowId=".concat(e,"&month=").concat(l)},"详情"):"--"}}],v={showSizeChanger:!0,showQuickJumper:!0,pageSize:n||30,onShowSizeChange:c.onShowSizeChange,total:h.result_count,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],onChange:c.onChangePage};t&&(v.current=t);var g=m.createElement("div",null,m.createElement(_.Z,{className:E.Z.bossStatisticsTablePopoverIcon}),m.createElement("span",{className:E.Z.bossStatisticsTableTitleExt},"本月统计时长、完成率及占比等数据截止到次月3号，数据将锁定不再变更"));return m.createElement(w.IT,{title:"审批流统计列表",titleExt:g},m.createElement(a.Z,{columns:f,pagination:v,rowKey:function(e){return e._id},dataSource:d,scroll:{x:1510,y:600},bordered:!0}))})),(0,p.Z)((0,s.Z)(c),"renderSearch",(function(){var e={onSearch:c.onSearch,platforms:R,onChangeMonth:c.onChangeMonth};return m.createElement(O,e)})),c.state={month:void 0},c.private={searchParams:{page:1,limit:30}},c}return(0,c.Z)(n,[{key:"componentDidMount",value:function(){(0,this.props.dispatch)({type:"expenseStatistics/fetchExpenseStatistics",payload:{}})}},{key:"componentWillUnmount",value:function(){(0,this.props.dispatch)({type:"expenseStatistics/resetExpenseStatistics",payload:{}})}},{key:"render",value:function(){return m.createElement("div",null,this.renderSearch(),this.renderContent())}}]),n}(m.Component);(0,p.Z)(F,"propTypes",{dispatch:Z().func,statisticsList:Z().object}),(0,p.Z)(F,"defaultProps",{dispatch:function(){},statisticsList:{}});var N=(0,v.connect)((function(e){return{statisticsList:e.expenseStatistics.statisticsList}}))(F)},21385:function(e,t){t.Z={searchWrap:"JZHOZKhK_Crz2QiX97ZA",bossStatisticsTableTitle:"FzBEW5DFW72jdfd2GyjH",bossStatisticsTablePopoverIcon:"WC4GY_kl3F_4v6YSmJ2I",bossStatisticsTableHightlight:"w3TAQFSCCFz_DLt7SZpH",bossStatisticsTableBreakLine:"sIrhrQ7vp91ncIKqS20S",bossStatisticsTableTitleExt:"ab9diTZFWboYJi0OyMxX"}}}]);