"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[12],{20012:function(e,t,a){a.r(t),a.d(t,{default:function(){return b}});a(20186);var n=a(75385),r=(a(21316),a(75443)),o=(a(52560),a(71577)),c=(a(51838),a(48086)),i=a(15671),l=a(43144),p=a(97326),s=a(60136),u=a(82963),m=a(61120),f=a(4942),d=a(93517),h=a.n(d),v=a(45697),y=a.n(v),S=a(67294),Z=a(55609),g=a(94315),P=a.n(g),D=a(96036),w=a(88144);function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=(0,m.Z)(e);if(t){var r=(0,m.Z)(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return(0,u.Z)(this,a)}}var I=function(e){(0,s.Z)(a,e);var t=k(a);function a(e){var n;return(0,i.Z)(this,a),n=t.call(this,e),(0,f.Z)((0,p.Z)(n),"onReset",(function(){var e=n.props.onSearch,t={page:1,limit:30};n.setState({search:t}),e&&e(t)})),(0,f.Z)((0,p.Z)(n),"onSearch",(function(e){var t=n.props.onSearch,a=e.platforms,r={page:1,limit:30};P().existy(a)&&(r.platforms=a),t&&t(r)})),(0,f.Z)((0,p.Z)(n),"render",(function(){var e=n.state.platforms,t={items:[{label:"平台",form:function(t){return t.getFieldDecorator("platforms",{initialValue:e})(S.createElement(w.Yg,{showArrow:!0,allowClear:!0,showSearch:!0,mode:"multiple",optionFilterProp:"children",placeholder:"请选择平台"}))}}],onReset:n.onReset,onSearch:n.onSearch,onHookForm:n.onHookForm};return S.createElement(D.IT,null,S.createElement(D.yL,t))})),n.state={search:{platforms:void 0}},n}return a}(S.Component);(0,f.Z)(I,"propTypes",{onSearch:y().func}),(0,f.Z)(I,"defaultProps",{onSearch:function(){}});var C=I,x="zCxIc4GPllkn3EU9fnD1",U="UCnsToBHiNfYNBwmJgb7",F=a(80385),E=a(45430);function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=(0,m.Z)(e);if(t){var r=(0,m.Z)(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return(0,u.Z)(this,a)}}var R=function(e){(0,s.Z)(a,e);var t=T(a);function a(e){var l;return(0,i.Z)(this,a),l=t.call(this,e),(0,f.Z)((0,p.Z)(l),"onUpdateData",(function(){var e=setInterval((function(){l.props.dispatch({type:"supplySet/fetchSupplySet"})}),3e4);l.state.interval||window.clearInterval(e),l.setState({interval:e})})),(0,f.Z)((0,p.Z)(l),"onDataUpdateDate",(function(){var e=l.state,t=e.items,a=e.interval,n=t;clearInterval(l.private.timer),l.private.timer=setInterval((function(){n-=1,l.setState({items:n}),0===n&&(l.setState({items:60}),clearInterval(l.private.timer),window.clearInterval(a))}),3e3)})),(0,f.Z)((0,p.Z)(l),"onSearch",(function(e){l.private.searchParams=e,l.private.searchParams.page||(l.private.searchParams.page=1),l.private.searchParams.limit||(l.private.searchParams.limit=30),l.props.dispatch({type:"supplySet/fetchSupplySet",payload:l.private.searchParams})})),(0,f.Z)((0,p.Z)(l),"onChangePage",(function(e,t){l.private.searchParams.page=e,l.private.searchParams.limit=t,l.onSearch(l.private.searchParams)})),(0,f.Z)((0,p.Z)(l),"onShowSizeChange",(function(e,t){l.private.searchParams.page=e,l.private.searchParams.limit=t,l.onSearch(l.private.searchParams)})),(0,f.Z)((0,p.Z)(l),"onDownloadSuccess",(function(){c.ZP.success("模板下载成功")})),(0,f.Z)((0,p.Z)(l),"onDownloadFailure",(function(){c.ZP.error("模板下载失败")})),(0,f.Z)((0,p.Z)(l),"onDownload",(function(){var e={type:F.O3x.itemTemplate};l.props.dispatch({type:"supplyProcurement/materialDownloadTemplate",payload:{params:e,onSuccessCallback:l.onDownloadSuccess,onFailureCallback:l.onDownloadFailure}})})),(0,f.Z)((0,p.Z)(l),"onUploadFailure",(function(){c.ZP.error("上传文件失败")})),(0,f.Z)((0,p.Z)(l),"onUploadSuccessSetting",(function(){l.setState({items:60}),l.onUpdateData(),l.onDataUpdateDate(),c.ZP.success("物资设置上传文件成功")})),(0,f.Z)((0,p.Z)(l),"onUploadFailureSetting",(function(){c.ZP.success("物资设置上传文件失败")})),(0,f.Z)((0,p.Z)(l),"onUploadSuccess",(function(e){var t={type:F.V$8.item,file:e,storage:F.rIf.sevenCattle};l.props.dispatch({type:"supplyProcurement/materialUploadFile",payload:{params:t,onSuccessCallback:l.onUploadSuccessSetting,onFailureCallback:l.onUploadFailureSetting}})})),(0,f.Z)((0,p.Z)(l),"renderSearch",(function(){var e=(0,p.Z)(l).onSearch;return S.createElement(C,{onSearch:e})})),(0,f.Z)((0,p.Z)(l),"renderContent",(function(){var e=l.private.searchParams,t=e.page,a=e.limit,c=l.props,i=c.supplySetData,p=void 0===i?{}:i,s=c.templateDate,u=void 0===s?"":s,m=h().get(p,"data",[]),f=h().get(p,"meta.count",0),d=[{title:"一级分类",dataIndex:"group",key:"group",render:function(e){return F.IO9.description(e)||"--"}},{title:"二级分类",dataIndex:"secondary_group",key:"secondary_group",render:function(e){return e||"--"}},{title:"物资编号",dataIndex:"code",key:"code",render:function(e){return e||"--"}},{title:"物资名称",dataIndex:"name",key:"name",render:function(e){return e||"--"}},{title:"平台",dataIndex:"platform_name",key:"platform_name",render:function(e){return e||"--"}},{title:"单位",dataIndex:"unit",key:"unit",render:function(e){return e||"--"}},{title:"押金（元）",dataIndex:"deposit_money",key:"deposit_money",render:function(e){return F.fbc.exchangePriceToYuan(e)||0}},{title:"自采/租赁单价（元）",dataIndex:"purchase_price",key:"purchase_price",render:function(e){return F.fbc.exchangePriceToYuan(e)||0}},{title:"备注",dataIndex:"note",key:"note",render:function(e){return e||"--"}}],v={showSizeChanger:!0,showQuickJumper:!0,pageSize:a||30,onShowSizeChange:l.onShowSizeChange,total:f,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],onChange:l.onChangePage};t&&(v.current=t);var y="";return E.ZP.canOperateSupplySettingDownloadAndUpload()&&(y=S.createElement(S.Fragment,null,S.createElement("span",{className:x},"模板更新时间: ",u),S.createElement(r.Z,{placement:"top",title:"是否下载模板?",okText:"确认",onConfirm:function(){l.onDownload()},cancelText:"取消"},S.createElement(o.Z,{type:"primary",className:U},"下载模板")),S.createElement(D.zI,{domain:"material",namespace:l.private.namespace,onSuccess:l.onUploadSuccess,onFailure:l.onUploadFailure}))),S.createElement(D.IT,{title:"物资设置列表",titleExt:y},S.createElement(n.Z,{columns:d,pagination:v,rowKey:function(e,t){return t},dataSource:m,bordered:!0}))})),l.state={interval:null,items:60},l.private={searchParams:{},namespace:"namespace".concat(Math.floor(1e5*Math.random()))},l}return(0,l.Z)(a,[{key:"componentDidMount",value:function(){var e={type:F.O3x.itemTemplate};this.props.dispatch({type:"supplySet/fetchSupplySet"}),this.props.dispatch({type:"supplyProcurement/materialTemplateUpdatedDate",payload:e})}},{key:"componentDidUpdate",value:function(e){var t=this.state.interval;h().get(e,"supplySetData.meta.count",0)!==h().get(this.props,"supplySetData.meta.count",0)&&t&&window.clearInterval(t)}},{key:"componentWillUnmount",value:function(){var e=this.state.interval;window.clearInterval(e)}},{key:"render",value:function(){return S.createElement("div",null,this.renderSearch(),this.renderContent())}}]),a}(S.Component);(0,f.Z)(R,"propTypes",{supplySetData:y().object,templateDate:y().string}),(0,f.Z)(R,"defaultProps",{supplySetData:{},templateDate:""});var b=(0,Z.connect)((function(e){return{supplySetData:e.supplySet.supplySetData,templateDate:e.supplyProcurement.templateDate}}))(R)}}]);