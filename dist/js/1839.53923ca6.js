"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[1839],{41839:function(e,t,n){n.r(t),n.d(t,{default:function(){return N}});var r=n(15671),a=n(43144),o=n(97326),i=n(60136),c=n(82963),l=n(61120),u=n(4942),f=n(67294),s=n(45697),p=n.n(s),d=n(55609),h=(n(9070),n(20924)),v=n(96036),m=(n(29093),n(16317)),y=m.Z.Option,g=(0,d.connect)((function(e){return{allStaffList:e.organizationStaff.allStaffList}}))((function(e){var t=e.dispatch,n=e.allStaffList,r=void 0===n?{}:n,a=e.onChange,o=e.value,i=r.data,c=void 0===i?[]:i;return(0,f.useEffect)((function(){return t({type:"organizationStaff/getAllStaffList",payload:{}}),function(){t({type:"organizationStaff/resetAllStaffList"})}}),[t]),f.createElement(m.Z,{placeholder:"请选择",allowClear:!0,showSearch:!0,optionFilterProp:"children",onChange:a,value:o,dropdownMatchSelectWidth:!1},c.map((function(e){return f.createElement(y,{value:e.name,key:e._id},e.name,"(",e.rank,")")})))}));function Z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(n),!0).forEach((function(t){(0,u.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,l.Z)(e);if(t){var a=(0,l.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,c.Z)(this,n)}}var O=function(e){(0,i.Z)(n,e);var t=b(n);function n(e){var a;return(0,r.Z)(this,n),a=t.call(this,e),(0,u.Z)((0,o.Z)(a),"onHookForm",(function(e){a.setState({form:e})})),(0,u.Z)((0,o.Z)(a),"onSearchVal",(function(e){(0,a.props.onSearch)(S(S({},e),{},{limit:30,page:1}))})),(0,u.Z)((0,o.Z)(a),"renderSearch",(function(){var e=a.props.onReset,t={items:[{label:"岗位名称",form:function(e){return e.getFieldDecorator("staffName")(f.createElement(g,null))}},{label:"岗位编号",form:function(e){return e.getFieldDecorator("code")(f.createElement(h.Z,{placeholder:"请输入岗位编号"}))}},{label:"岗位职级",form:function(e){return e.getFieldDecorator("rank")(f.createElement(h.Z,{placeholder:"请输入岗位职级"}))}},{label:"审批岗标签",form:function(e){return e.getFieldDecorator("tags")(f.createElement(h.Z,{placeholder:"请输入审批岗位标签"}))}}],onSearch:a.onSearchVal,onHookForm:a.onHookForm,onReset:e};return f.createElement(v.IT,null,f.createElement(v.yL,t))})),a.state={form:{}},a}return(0,a.Z)(n,[{key:"render",value:function(){return this.renderSearch()}}]),n}(f.Component);(0,u.Z)(O,"propTypes",{onSearch:p().func,onReset:p().func}),(0,u.Z)(O,"defaultProps",{onSearch:function(){},onReset:function(){}}),(0,u.Z)(O,"getDerivedStateFromProps",(function(e,t){return!0===e.resetSearch&&t.form.resetFields&&t.form.resetFields(),null}));var P=O,C=(n(20186),n(75385)),k=(n(52560),n(71577)),j=(n(55295),n(69713)),E=(n(51838),n(48086)),w=n(30381),R=n.n(w),D=(n(52466),n(10642)),z=n(66939);n(98703);function F(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?F(Object(n),!0).forEach((function(t){(0,u.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):F(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,l.Z)(e);if(t){var a=(0,l.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,c.Z)(this,n)}}var _=function(e){(0,i.Z)(n,e);var t=L(n);function n(){var e;return(0,r.Z)(this,n),e=t.call(this),(0,u.Z)((0,o.Z)(e),"onVerify",(function(e,t,n){if(t){/^[0-9a-zA-Z-]{1,}$/.test(t)?n():n("请输入数字、字母和中横线")}else n("请输入岗位编号")})),(0,u.Z)((0,o.Z)(e),"onTagVerify",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2?arguments[2]:void 0,r=/^\S+$/,a=t.find((function(e){return!r.test(e)}));if(t.some((function(e){return/[;|；]/g.test(e)})))return n("标签名称不能包含分号");t.length>0&&a?n("标签名称不能包含空格"):n()})),(0,u.Z)((0,o.Z)(e),"onVerifyRank",(function(e,t,n){if(t){if(/^\S+$/.test(t)){/[\u4e00-\u9fa5]/.test(t)?n("岗位职级不能包含汉字"):n()}else n("岗位职级不能包含空格")}else n("请输入岗位职级")})),(0,u.Z)((0,o.Z)(e),"onSubmit",(function(){var t=e.props,n=t.form,r=t.type,a=t.dispatch,o=t.data,i=void 0===o?{}:o;n.validateFields((function(t,n){if(!t){var o=i._id,c=x(x({id:void 0===o?void 0:o},n),{},{onSuccessCallback:function(){a({type:"organizationStaff/getAllStaffList",payload:{}}),e.onSuccessCallback()},onFailureCallback:e.onFailureCallback});e.private.isSubmit&&("create"===r&&a({type:"organizationStaff/createStaff",payload:c}),"update"===r&&a({type:"organizationStaff/updateStaff",payload:c})),e.private.isSubmit=!1}}))})),(0,u.Z)((0,o.Z)(e),"onCancel",(function(){var t=e.props.onCancel;t&&t()})),(0,u.Z)((0,o.Z)(e),"onSuccessCallback",(function(){var t=e.props,n=t.onSearch,r=t.type;E.ZP.success("操作成功"),e.onCancel(),n&&n({},"update"===r)})),(0,u.Z)((0,o.Z)(e),"onFailureCallback",(function(){e.onCancel()})),(0,u.Z)((0,o.Z)(e),"renderForm",(function(){var t=e.props,n=t.form,r=t.type,a=t.data,o=n.getFieldDecorator,i=a.name,c=a.code,l=a.rank,u=a.apply_tags,s=void 0===u?[]:u,p=[{label:"岗位名称",form:o("staffName",{rules:[{required:!0,message:"请输入岗位名称"},{min:2,message:"岗位名称必须超过2个字"},{max:32,message:"岗位名称必须小于32个字"}],initialValue:i})(f.createElement(h.Z,{placeholder:"请输入岗位名称"}))},{label:"岗位编号",form:o("staffNum",{rules:[{required:!0,validator:e.onVerify}],initialValue:c})(f.createElement(h.Z,{disabled:"update"===r,placeholder:"请输入岗位编号"}))},{label:"岗位职级",form:o("staffRank",{rules:[{required:!0,validator:e.onVerifyRank}],initialValue:l})(f.createElement(h.Z,{placeholder:"请输入岗位职级"}))},{label:"审批岗标签",form:o("tags",{rules:[{validator:e.onTagVerify}],initialValue:s})(f.createElement(m.Z,{mode:"tags",placeholder:"请输入审批岗位标签",style:{width:"100%"}}))}];return f.createElement(v.KP,{items:p,cols:1,layout:{labelCol:{span:6},wrapperCol:{span:18}}})})),(0,u.Z)((0,o.Z)(e),"renderMadal",(function(){var t=e.props,n=t.visible,r="update"===t.type?"编辑岗位":"创建岗位";return f.createElement(D.Z,{title:r,visible:n,onOk:e.onSubmit,onCancel:e.onCancel,okText:"保存",cancelText:"取消"},e.renderForm())})),e.private={isSubmit:!0},e}return(0,a.Z)(n,[{key:"render",value:function(){return this.renderMadal()}}]),n}(f.Component);_.propTypes={visible:p().bool,form:p().object,type:p().string,dispatch:p().func,onCancel:p().func,data:p().object},_.defaultProps={visible:!1,form:{},type:"create",dispatch:function(){},onCancel:function(){},data:{}};var V=z.Z.create()(_),I=n(45430);function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,l.Z)(e);if(t){var a=(0,l.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,c.Z)(this,n)}}var B=function(e){(0,i.Z)(n,e);var t=T(n);function n(e){var a;return(0,r.Z)(this,n),a=t.call(this,e),(0,u.Z)((0,o.Z)(a),"onShow",(function(e,t){a.setState({visible:!0,type:e,updateData:t})})),(0,u.Z)((0,o.Z)(a),"onCancel",(function(){a.setState({visible:!1,updateData:void 0})})),(0,u.Z)((0,o.Z)(a),"onDelete",(function(e,t){if(t.organization_count>0)return E.ZP.error("请先移除该岗位下的成员，再删除此岗位");(0,a.props.dispatch)({type:"organizationStaff/deleteStaff",payload:{id:e,onSuccessCallback:a.onSuccessCallback,onFailureCallback:a.onFailureCallback}})})),(0,u.Z)((0,o.Z)(a),"onSuccessCallback",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,n=a.props.onSearch;E.ZP.success("操作成功"),n&&n(e,t)})),(0,u.Z)((0,o.Z)(a),"onFailureCallback",(function(e){e.zh_message&&E.ZP.success(e.zh_message)})),(0,u.Z)((0,o.Z)(a),"renderContent",(function(){var e=a.props,t=e.data,n=void 0===t?{}:t,r=e.onChangePage,o=n.data,i=void 0===o?[]:o,c=n._meta,l=(void 0===c?{}:c).result_count,u=void 0===l?0:l,s=[{title:"岗位名称",dataIndex:"name"},{title:"岗位编号",dataIndex:"code"},{title:"岗位职级",dataIndex:"rank",render:function(e){return e||"--"}},{title:"审批岗位标签",dataIndex:"apply_tags",render:function(e){return Array.isArray(e)&&e.length>3?f.createElement(j.Z,{title:e.join("；")},f.createElement("div",null,e[0],"；",e[1],"；",e[2],"...")):Array.isArray(e)&&e.length>0&&e.length<=3?f.createElement("div",null,e.join("；")):"--"}},{title:"占编人数",dataIndex:"organization_count"},{title:"创建时间",dataIndex:"created_at",render:function(e){return e?R()(String(e)).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"更新时间",dataIndex:"updated_at",render:function(e){return e?R()(String(e)).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"操作人",dataIndex:["operator_info","name"],render:function(e){return e||"--"}},{title:"操作",dataIndex:"_id",render:function(e,t){var n=I.ZP.canOperateOrganizationStaffsUpdate()?f.createElement("a",{onClick:function(){return a.onShow("update",t)}},"编辑"):null;return f.createElement("div",null,n||"--")}}],p={current:a.props.page,pageSize:a.props.limit,onChange:r,total:u,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],showQuickJumper:!0,showSizeChanger:!0,onShowSizeChange:r},d=I.ZP.canOperateOrganizationStaffsCreate()?f.createElement(k.Z,{type:"primary",onClick:function(){return a.onShow("create")}},"创建岗位"):null;return f.createElement(v.IT,{title:"岗位列表",titleExt:d},f.createElement(C.Z,{rowKey:function(e,t){return e._id||t},dataSource:i,columns:s,pagination:p}))})),(0,u.Z)((0,o.Z)(a),"renderModal",(function(){var e=a.state,t=e.visible,n=e.type,r=e.updateData,o=a.props,i=o.dispatch,c=o.onSearch;if(t)return f.createElement(V,{visible:t,type:n,dispatch:i,onCancel:a.onCancel,data:r,onSearch:c})})),a.state={visible:!1,type:void 0,updateData:void 0},a}return(0,a.Z)(n,[{key:"render",value:function(){return f.createElement("div",null,this.renderContent(),this.renderModal())}}]),n}(f.Component);B.propTypes={data:p().object,onChangePage:p().func,dispatch:p().func,onSearch:p().func},B.defaultProps={data:{},onChangePage:function(){},dispatch:function(){},onSearch:function(){}};var M=B;function A(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?A(Object(n),!0).forEach((function(t){(0,u.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):A(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function H(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,l.Z)(e);if(t){var a=(0,l.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,c.Z)(this,n)}}var q=function(e){(0,i.Z)(n,e);var t=H(n);function n(e){var a;return(0,r.Z)(this,n),a=t.call(this,e),(0,u.Z)((0,o.Z)(a),"onSearch",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=a.props.dispatch,r=a.private.searchParams,o=Y(Y({},r),e);!0===t?(o={limit:30,page:1},a.setState({resetSearch:t})):a.setState({resetSearch:!1}),a.private.searchParams=Y({},o),n({type:"organizationStaff/getStaffList",payload:o})})),(0,u.Z)((0,o.Z)(a),"onReset",(function(){var e=a.props.dispatch,t={limit:30,page:1};a.private.searchParams=Y({},t),e({type:"organizationStaff/getStaffList",payload:t})})),(0,u.Z)((0,o.Z)(a),"onChangePage",(function(e,t){var n=a.private.searchParams;n.page=e,n.limit=t,a.onSearch(n)})),(0,u.Z)((0,o.Z)(a),"renderContent",(function(){var e=a.props,t=e.staffList,n=void 0===t?{}:t,r=e.dispatch;return f.createElement("div",null,f.createElement(P,{onSearch:a.onSearch,onReset:a.onReset,resetSearch:a.state.resetSearch}),f.createElement(M,{data:n,dispatch:r,onChangePage:a.onChangePage,onSearch:a.onSearch,limit:a.private.searchParams.limit,page:a.private.searchParams.page}))})),a.state={resetSearch:!1},a.private={searchParams:{limit:30,page:1}},a}return(0,a.Z)(n,[{key:"componentDidMount",value:function(){(0,this.props.dispatch)({type:"organizationStaff/getStaffList",payload:Y({},this.private.searchParams)})}},{key:"componentWillUnmount",value:function(){(0,this.props.dispatch)({type:"organizationStaff/resetStaffList",payload:{}})}},{key:"render",value:function(){return this.renderContent()}}]),n}(f.Component);(0,u.Z)(q,"propTypes",{staffList:p().object}),(0,u.Z)(q,"defaultProps",{staffList:{}});var N=(0,d.connect)((function(e){return{staffList:e.organizationStaff.staffList}}))(q)}}]);