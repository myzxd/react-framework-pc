"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[1618],{71618:function(e,t,n){n.r(t),n.d(t,{default:function(){return T}});n(20186);var r=n(75385),a=(n(52560),n(71577)),o=n(15671),c=n(43144),i=n(97326),l=n(60136),s=n(82963),u=n(61120),p=n(4942),f=n(67294),d=n(55609),h=n(44654),m=n(93517),y=n.n(m),Z=(n(9070),n(20924)),g=n(45697),C=n.n(g),S=n(96036),v=n(88144);function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,u.Z)(e);if(t){var a=(0,u.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,s.Z)(this,n)}}var k=function(){},E=function(e){(0,l.Z)(n,e);var t=w(n);function n(e){var r;return(0,o.Z)(this,n),r=t.call(this,e),(0,p.Z)((0,i.Z)(r),"onChangeSearchExtensions",(function(e){r.setState({suppliers:e.suppliers})})),(0,p.Z)((0,i.Z)(r),"onReset",(function(){r.props.onReset()})),(0,p.Z)((0,i.Z)(r),"onSearch",(function(e){r.props.onSearch(e)})),(0,p.Z)((0,i.Z)(r),"onHookForm",(function(e){r.setState({form:e})})),(0,p.Z)((0,i.Z)(r),"render",(function(){var e=r.props.defaultSearchParams,t=e.name,n=e.phone,a=e.contracts,o=e.platformId,c=r.state.suppliers,i={items:[{label:"合同归属",form:function(e){return e.getFieldDecorator("contracts",{initialValue:a})(f.createElement(v.rf,{allowClear:!0,showArrow:!0,mode:"multiple",placeholder:"请选择合同归属",suppliers:c}))}},{label:"姓名",form:function(e){return e.getFieldDecorator("name",{initialValue:t})(f.createElement(Z.Z,{placeholder:"请输入姓名"}))}},{label:"手机号",form:function(e){return e.getFieldDecorator("phone",{initialValue:n})(f.createElement(Z.Z,{placeholder:"请输入手机号"}))}},{label:"第三方平台账户ID",form:function(e){return e.getFieldDecorator("platformId",{initialValue:o})(f.createElement(Z.Z,{placeholder:"请输入第三方平台账户ID"}))}}],onReset:r.onReset,onSearch:r.onSearch,onChange:r.onChangeSearchExtensions,onHookForm:r.onHookForm,expand:!0};return f.createElement(S.IT,null,f.createElement(v.p8,i))})),r.state={form:void 0,suppliers:[]},r}return n}(f.Component);(0,p.Z)(E,"propTypes",{onSearch:C().func.isRequired,onReset:C().func.isRequired,defaultSearchParams:C().object}),(0,p.Z)(E,"defaultProps",{onSearch:k,onReset:k,defaultSearchParams:{}});var b=E,R="nsEqk78V1ztzuEY11dCU",P="y75M_DV0Zt3kalVxURl4",x="BBqaXg4oLbqL7k0zwZBg",O=n(80385);function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach((function(t){(0,p.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function j(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,u.Z)(e);if(t){var a=(0,u.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,s.Z)(this,n)}}var B={page:1,limit:30},z={suppliers:[],platforms:[],cities:[],districts:[],name:"",phone:"",contracts:[],platformId:""},F=function(e){(0,l.Z)(n,e);var t=j(n);function n(e){var c;return(0,o.Z)(this,n),c=t.call(this,e),(0,p.Z)((0,i.Z)(c),"onSearch",(function(){var e=c.state.pagination,t=e.page,n=e.limit;c.props.dispatch({type:"employeeContract/fetchEmployeeContractData",payload:I({page:t,limit:n},c.private.searchParams)})})),(0,p.Z)((0,i.Z)(c),"onSearchClick",(function(e){c.private.searchParams=e,c.setState({pagination:I(I({},c.state.pagination),{},{page:B.page})},(function(){c.onSearch()}))})),(0,p.Z)((0,i.Z)(c),"onResetClick",(function(){c.private.searchParams=z,c.setState({pagination:B},(function(){c.onSearch()}))})),(0,p.Z)((0,i.Z)(c),"onPaginationChange",(function(e,t){c.setState({pagination:{page:e,limit:t}},(function(){c.onSearch()}))})),(0,p.Z)((0,i.Z)(c),"onExportContractClick",(function(){})),(0,p.Z)((0,i.Z)(c),"onExportContractAndCardClick",(function(){})),(0,p.Z)((0,i.Z)(c),"renderSearch",(function(){return f.createElement(b,{defaultSearchParams:z,onSearch:c.onSearchClick,onReset:c.onResetClick})})),(0,p.Z)((0,i.Z)(c),"renderTable",(function(){var e=y().get(c.props,"employeeContractData.data",[]),t=y().get(c.props,"employeeContractData.meta.resultCount",0),n=c.state,o=n.selectedRowKeys,i=n.pagination,l=[{dataIndex:"name",title:"姓名",width:80},{dataIndex:"phone",title:"手机号",width:100},{dataIndex:"knightType",title:"个户类型",width:70,render:function(e){return O.EbQ.description(e)}},{dataIndex:"platformId",title:"第三方平台账户ID",width:120},{dataIndex:"supplier",title:"供应商",width:150},{dataIndex:"platform",title:"平台",width:70},{dataIndex:"city",title:"城市",width:100},{dataIndex:"district",title:"商圈",width:120},{dataIndex:"contract",title:"合同归属",width:120},{key:"opration",title:"操作",render:function(e){return f.createElement("div",null,f.createElement(h.Link,{to:{pathname:"/Employee/Contract/Detail",search:"?id=".concat(e.id)},target:"_blank"},"查看详情"),f.createElement("a",{src:"",className:R},"下载"))}}],s={total:t,pageSize:i.limit,current:i.page,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],onChange:c.onPaginationChange,onShowSizeChange:c.onPaginationChange},u={selectedRowKeys:o,onChange:function(e){c.setState({selectedRowKeys:e})}};return f.createElement(S.IT,null,f.createElement(a.Z,{type:"primary",className:P,onClick:c.onExportContractClick},"批量导出合同"),f.createElement(a.Z,{type:"primary",className:x,onClick:c.onExportContractAndCardClick},"批量导出合同与身份证"),f.createElement(r.Z,{bordered:!0,rowKey:function(e){return e.id},columns:l,dataSource:e,pagination:s,rowSelection:u,scroll:{x:!1,y:380}}))})),c.state={pagination:B,selectedRowKeys:[]},c.private={searchParams:z},c}return(0,c.Z)(n,[{key:"componentDidMount",value:function(){this.onSearch()}},{key:"render",value:function(){return f.createElement("div",null,this.renderSearch(),this.renderTable())}}]),n}(f.Component);var T=(0,d.connect)((function(e){return{employeeContractData:e.employeeContract.employeeContractData}}))(F)}}]);