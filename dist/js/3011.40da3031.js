"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[3011],{53011:function(e,t,n){n.r(t),n.d(t,{default:function(){return N}});n(20186);var a=n(75385),r=(n(52560),n(71577)),o=(n(21316),n(75443)),c=n(4942),i=n(29439),m=n(67294),l=n(55609),s=n(93517),p=n.n(s),u=n(44654),d=n(30381),f=n.n(d),y=n(96036),b=n(80385),h=(n(9070),n(20924)),v=(n(29093),n(16317)),O=n(45697),g=n.n(O),C=v.Z.Option;function E(e){var t=e.defaultState,n={items:[{label:"状态",form:function(e){return e.getFieldDecorator("state",{initialValue:t})(m.createElement(v.Z,{allowClear:!0,placeholder:"请选择状态"},m.createElement(C,{value:"".concat(b.J1k.on)},b.J1k.description(b.J1k.on)),m.createElement(C,{value:"".concat(b.J1k.off)},b.J1k.description(b.J1k.off))))}},{label:"推荐公司ID",form:function(e){return e.getFieldDecorator("companyId")(m.createElement(h.Z,{placeholder:"请输入推荐公司ID"}))}},{label:"推荐公司名称",form:function(e){return e.getFieldDecorator("companyName")(m.createElement(h.Z,{placeholder:"请输入推荐公司名称"}))}}],expand:!0,onReset:e.onSearch,onSearch:e.onSearch};return m.createElement(y.IT,null,m.createElement(y.yL,n))}E.onSearch={onSearch:g().func.isRequired};var S=E,k=(n(52466),n(10642)),P=n(66939);n(98703);function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function j(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach((function(t){(0,c.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var w=function(){};function Z(e){var t,n,a=e.onCreateSuccess,r=function(t){e.form.resetFields(),a(t)},o=e.visible;return m.createElement(k.Z,{title:"新增推荐公司",cancelText:"取消",okText:"保存",visible:o,onOk:function(){e.form.validateFields((function(t,n){t||e.dispatch({type:"systemRecommendedCompany/createCompany",payload:j(j({},n),{},{onSuccessCallback:r})})}))},onCancel:function(){e.form.resetFields(),e.onCancel()}},(t=e.form.getFieldDecorator,n=[{label:"推荐公司",form:t("name",{rules:[{required:!0,transform:function(e){return e?e.trim():void 0},message:"请填写"}]})(m.createElement(h.Z,{maxLength:100}))},{label:"公司简称",form:t("abbreviation")(m.createElement(h.Z,{maxLength:100}))}],m.createElement(y.KP,{items:n,layout:{labelCol:{span:5},wrapperCol:{span:17}}})))}Z.propTypes={visible:g().bool,onCreateSuccess:g().func.isRequired,onCancel:g().func.isRequired},Z.defaultProps={visible:!1,onCreateSuccess:w,onCancel:w};var x=(0,l.connect)()(P.Z.create()(Z)),I=n(45430),R=n(98258);function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function J(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach((function(t){(0,c.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var T=void 0,A=1,F=30,Y={searchParams:{state:T,companyId:void 0,companyName:void 0,meta:{page:A,limit:F}}};var N=(0,l.connect)((function(e){return{companyData:e.systemRecommendedCompany.companyData}}))((function(e){var t=(0,m.useState)(!1),n=(0,i.Z)(t,2),c=n[0],l=n[1],s=function(){e.dispatch({type:"systemRecommendedCompany/fetchCompanyData",payload:Y.searchParams})};(0,m.useEffect)((function(){return s(),function(){e.dispatch({type:"systemRecommendedCompany/resetCompanyData",payload:Y.searchParams})}}),[]);var d,h,v,O,g,C,E=function(e){Y.searchParams=J(J({},Y.searchParams),e),Y.searchParams.meta.page=A,s()},k=function(){s()},P=function(t,n){e.dispatch({type:"systemRecommendedCompany/changeCompanyState",payload:{state:n,recommendedCompanyId:t,onSuccessCallback:k}})},D=function(e,t){var n=Y.searchParams;n.meta.page=e,n.meta.limit=t,s()},j=function(e){l(e)},w=function(t){var n=t.record._id;j(!1),e.history.push("/System/RecommendedCompany/Detail?id=".concat(n))};return m.createElement("div",null,m.createElement(S,{defaultState:T,onSearch:E}),(d=Y.searchParams.meta.page,h=p().get(e,"companyData._meta.result_count",0),v=p().get(e,"companyData.data",[]),O=[{title:"推荐公司ID",dataIndex:"_id"},{title:"推荐公司",dataIndex:"name"},{title:"公司简称",dataIndex:"abbreviation",render:function(e){return e||"--"}},{title:"公司代号",dataIndex:"code",render:function(e){return e?m.createElement("div",{className:R.Z["app-comp-system-recommend-table-td-code"]},e):"--"}},{title:"平台",dataIndex:"platform_list",render:function(e){if(!Array.isArray(e)||e.length<=0)return"--";var t=[];return e.forEach((function(e){t.push(e.platform_name)})),t.join("、")}},{title:"状态",dataIndex:"state",render:function(e){return b.J1k.description(e)}},{title:"创建时间",dataIndex:"created_at",render:function(e){return f()(e).format("YYYY-MM-DD HH:mm")}},{title:"最后操作时间",dataIndex:"updated_at",render:function(e){return f()(e).format("YYYY-MM-DD HH:mm")}},{title:"最新操作人",dataIndex:"operator_info",render:function(e){return e&&e.name||"--"}},{title:"操作",key:"opration",width:100,render:function(e){var t=null;return I.ZP.canOperateSystemRecommendedCompanyUpdate()&&(e.state===b.J1k.on?t=m.createElement(o.Z,{title:"你确定要停用该推荐公司？",content:"停用后骑士将无法选择该公司为推荐公司。",onConfirm:function(){return P(e._id,b.J1k.off)},okText:"确认",cancelText:"取消"},m.createElement("a",{className:R.Z["app-comp-system-recommend-table-btn"]},"停用")):e.state===b.J1k.off&&(t=m.createElement(o.Z,{title:"你确定要启用该推荐公司？",content:"启用后骑士可选择该公司为推荐公司。",onConfirm:function(){return P(e._id,b.J1k.on)},okText:"确认",cancelText:"取消"},m.createElement("a",{className:R.Z["app-comp-system-recommend-table-btn"]},"启用")))),m.createElement("span",null,t,I.ZP.canOperateSystemRecommendedCompanyDetail()?m.createElement(u.Link,{className:R.Z["app-comp-system-recommend-table-detail-btn"],to:{pathname:"/System/RecommendedCompany/Detail",search:"?id=".concat(e._id)},target:"_blank"},"详情"):null)}}],g={current:d,defaultPageSize:F,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],total:h,onChange:D,onShowSizeChange:D},C=null,I.ZP.canOperateSystemRecommendedCompanyUpdate()&&(C=m.createElement(r.Z,{type:"primary",onClick:function(){return j(!0)}},"新增推荐公司")),m.createElement(y.IT,{title:"推荐公司列表",titleExt:C},m.createElement(a.Z,{rowKey:function(e){return e._id},columns:O,dataSource:v,pagination:g,scroll:{y:500}}))),m.createElement(x,{visible:c,onCreateSuccess:w,onCancel:function(){return j(!1)}}))}))},98258:function(e,t){t.Z={"app-comp-system-detail-form-item-code":"w4AGug26wHFtakIxvjtk","app-comp-system-detail-table-btn":"NAglS9mnkHTmeCAQEb0M","app-comp-system-recommend-table-td-code":"zvZzwtHRZXlAX6fdTAzo","app-comp-system-recommend-table-btn":"jr0V6IllVKBlVIoAPQW5","app-comp-system-recommend-table-detail-btn":"nvgEgtULY0AWcdONi0xF"}}}]);