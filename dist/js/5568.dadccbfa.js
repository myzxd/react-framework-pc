"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[5568],{95568:function(e,a,t){t.r(a),t.d(a,{default:function(){return b}});var n=t(15671),r=t(43144),i=t(97326),c=t(60136),o=t(82963),s=t(61120),l=t(4942),u=t(94315),f=t.n(u),p=t(45697),h=t.n(p),y=t(67294),v=t(55609),d=t(96036),S=t(88144),m=(t(20186),t(75385)),g=t(93517),Z=t.n(g),P="BSls6oCkZRSAohB5XOVi",C="b2nYMIPWVil9AI4g3gOF";function x(e){var a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,s.Z)(e);if(a){var r=(0,s.Z)(this).constructor;t=Reflect.construct(n,arguments,r)}else t=n.apply(this,arguments);return(0,o.Z)(this,t)}}var k=function(e){(0,c.Z)(t,e);var a=x(t);function t(e){var r;return(0,n.Z)(this,t),r=a.call(this,e),(0,l.Z)((0,i.Z)(r),"onChangePage",(function(e,a){var t=r.private.searchParams,n=r.props.onSearch;t.page=e,t.limit=a,n&&n(t)})),(0,l.Z)((0,i.Z)(r),"onShowSizeChange",(function(e,a){var t=r.private.searchParams,n=r.props.onSearch;t.page=e,t.limit=a,n&&n(t)})),r.state={},r.private={searchParams:{page:1,limit:30}},r}return(0,r.Z)(t,[{key:"render",value:function(){var e=this.props.salarySpecifications,a=void 0===e?{}:e,t=Z().get(a,"data",[]),n=Z().get(a,"meta.count",0),r={defaultPageSize:30,onChange:this.onChangePage,showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:this.onShowSizeChange,total:n,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"]};return y.createElement(m.Z,{rowKey:function(e,a){return a},className:C,dataSource:t,pagination:r,columns:[{title:"指标名称",dataIndex:"name",key:"name",width:"20%"},{title:"单位",dataIndex:"unitText",key:"unitText",width:"10%"},{title:"指标定义",dataIndex:"definition",key:"definition",width:"70%"}],bordered:!0})}}]),t}(y.Component);(0,l.Z)(k,"propTypes",{salarySpecifications:h().object,onSearch:h().func}),(0,l.Z)(k,"defaultProps",{salarySpecifications:{},onSearch:function(){}});var w=k;function R(e){var a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,s.Z)(e);if(a){var r=(0,s.Z)(this).constructor;t=Reflect.construct(n,arguments,r)}else t=n.apply(this,arguments);return(0,o.Z)(this,t)}}var I=t(97116).Iq.platform(),B=function(e){(0,c.Z)(t,e);var a=R(t);function t(e){var r,c;return(0,n.Z)(this,t),r=a.call(this,e),(0,l.Z)((0,i.Z)(r),"onSearch",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=r.private.searchParams.salarySelected;r.private.searchParams=e,r.private.searchParams.page||(r.private.searchParams.page=1),r.private.searchParams.limit||(r.private.searchParams.limit=30),r.private.searchParams.salarySelected=a,r.props.dispatch({type:"financeConfigIndex/fetchSalarySpecifications",payload:r.private.searchParams})})),(0,l.Z)((0,i.Z)(r),"onChangeSalarySpecifications",(function(e){r.private.searchParams.salarySelected=e,r.onSearch()})),r.state={},f().existy(I)&&f().not.empty(I)&&(c=I[0].id),r.private={searchParams:{page:1,limit:30,salarySelected:c}},r}return(0,r.Z)(t,[{key:"componentDidMount",value:function(){var e=this.private.searchParams;this.props.dispatch({type:"financeConfigIndex/fetchSalarySpecifications",payload:e})}},{key:"render",value:function(){var e,a=this.props.salarySpecifications,t=this.private.searchParams.salarySelected;f().existy(I)&&f().not.empty(I)&&(e="".concat(I.filter((function(e){return e.id===t}))[0].name,"指标库"));var n=y.createElement(S.Yg,{value:t,className:P,onChange:this.onChangeSalarySpecifications}),r={salarySpecifications:a,onSearch:this.onSearch};return y.createElement(d.IT,{title:e,titleExt:n},y.createElement(w,r))}}]),t}(y.Component);(0,l.Z)(B,"propTypes",{salarySpecifications:h().object}),(0,l.Z)(B,"defaultProps",{salarySpecifications:{}});var b=(0,v.connect)((function(e){return{salarySpecifications:e.financeConfigIndex.salarySpecifications}}))(B)}}]);