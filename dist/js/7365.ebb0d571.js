"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[7365],{97365:function(e,t,r){r.r(t),r.d(t,{default:function(){return R}});r(20186);var n=r(75385),a=r(15671),o=r(43144),c=r(97326),i=r(60136),l=r(82963),s=r(61120),u=r(4942),p=r(93517),d=r.n(p),f=r(55609),m=r(67294),h=r(96036),y=(r(9070),r(20924)),v=(r(54071),r(14072)),S=r(88144);function Z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function g(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(r),!0).forEach((function(t){(0,u.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Z(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function I(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,s.Z)(e);if(t){var a=(0,s.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var P=v.Z.RangePicker,b=function(e){(0,i.Z)(r,e);var t=I(r);function r(e){var n;return(0,a.Z)(this,r),n=t.call(this,e),(0,u.Z)((0,c.Z)(n),"onReset",(function(){var e=n.state,t=e.onSearch,r={recordId:e.record.recordId,districts:[],name:"",phone:"",date:void 0};n.setState({search:r}),t&&t(r)})),(0,u.Z)((0,c.Z)(n),"onSearch",(function(e){var t=n.state,r=t.onSearch,a=t.record,o=a.recordId,c=a.supplierId,i=a.platformId,l=a.cityId,s=c?[c]:[],u=i?[i]:[],p=l?[l]:[],d=g(g({},e),{},{recordId:o,suppliers:s,platforms:u,cities:p});d.page=1,d.limit=30,r&&r(d)})),(0,u.Z)((0,c.Z)(n),"onHookForm",(function(e){n.setState({form:e})})),(0,u.Z)((0,c.Z)(n),"render",(function(){var e=n.state.record,t=e.supplierId,r=e.supplierName,a=e.platformId,o=e.platformName,c=e.cityId,i=e.cityName,l=t?[t]:[],s=a?[a]:[],u=c?[c]:[],p={items:[{label:"供应商",form:function(){return r||"--"}},{label:"平台",form:function(){return o||"--"}},{label:"城市",form:function(){return i||"--"}},{label:"商圈",form:function(e){return e.getFieldDecorator("districts")(m.createElement(S.Wc,{allowClear:!0,showSearch:!0,optionFilterProp:"children",showArrow:!0,mode:"multiple",placeholder:"请选择商圈",platforms:s,suppliers:l,cities:u}))}},{label:"姓名",form:function(e){return e.getFieldDecorator("name")(m.createElement(y.Z,{placeholder:"请输入姓名"}))}},{label:"手机号",form:function(e){return e.getFieldDecorator("phone")(m.createElement(y.Z,{placeholder:"请输入手机号"}))}},{label:"所属时间",form:function(e){return e.getFieldDecorator("date",{initialValue:null})(m.createElement(P,null))}}],onReset:n.onReset,onSearch:n.onSearch,onHookForm:n.onHookForm,expand:!0};return m.createElement(h.IT,null,m.createElement(h.yL,p))})),n.state={form:void 0,search:{districts:[],name:"",phone:"",date:void 0},record:e.record||{},onSearch:e.onSearch||void 0},n}return r}(m.Component),O="FinQhZM0IlsPLlS9Slxs";function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,s.Z)(e);if(t){var a=(0,s.Z)(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return(0,l.Z)(this,r)}}var w=function(e){(0,i.Z)(r,e);var t=k(r);function r(e){var o;(0,a.Z)(this,r),o=t.call(this,e),(0,u.Z)((0,c.Z)(o),"onShowSizeChange",(function(e,t){var r=o.private.searchParams;r.page=e,r.limit=t,o.onSearch(r)})),(0,u.Z)((0,c.Z)(o),"onChangePage",(function(e,t){var r=o.private.searchParams;r.page=e,r.limit=t,o.onSearch(r)})),(0,u.Z)((0,c.Z)(o),"onSearch",(function(e){o.private.searchParams=e,o.private.searchParams.page||(o.private.searchParams.page=1),o.private.searchParams.limit||(o.private.searchParams.limit=30),o.props.dispatch({type:"employeeTransport/fetchTransportRecords",payload:o.private.searchParams})})),(0,u.Z)((0,c.Z)(o),"renderSearch",(function(){var e=o.state.record;return m.createElement(b,{onSearch:o.onSearch,record:e})})),(0,u.Z)((0,c.Z)(o),"renderContent",(function(){var e=o.state.dataSource,t=o.private.searchParams.page,r={current:void 0===t?1:t,defaultPageSize:30,onChange:o.onChangePage,showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:o.onShowSizeChange,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],total:d().get(e,"meta.result_count",0)};return m.createElement(h.IT,{className:O,title:"列表"},m.createElement(n.Z,{rowKey:function(e,t){return t},pagination:r,columns:[{title:"姓名",dataIndex:"name",key:"name"},{title:"手机号",dataIndex:"phone",key:"phone"},{title:"平台",dataIndex:"platform_name",key:"platform_name"},{title:"城市",dataIndex:"city_name",key:"city_name"},{title:"商圈",dataIndex:"biz_district_name",key:"biz_district_name"},{title:"开始时间",dataIndex:"start_date",key:"start_date"},{title:"结束时间",dataIndex:"end_date",key:"end_date"}],dataSource:e.result,bordered:!0}))}));var i=e.location.query,l=i.id,s={recordId:l,supplierId:i.supplierId,supplierName:i.supplierName,platformId:i.platformId,platformName:i.platformName,cityId:i.cityId,cityName:i.cityName};return o.state={record:s,dataSource:d().get(e,"employeeTransport.transportRecords",{})},o.private={searchParams:{recordId:l}},o}return(0,o.Z)(r,[{key:"UNSAFE_componentWillReceiveProps",value:function(e){this.setState({dataSource:d().get(e,"employeeTransport.transportRecords",{})})}},{key:"render",value:function(){return m.createElement("div",null,this.renderSearch(),this.renderContent())}}]),r}(m.Component),R=(0,f.connect)((function(e){return{employeeTransport:e.employeeTransport}}))(w)}}]);