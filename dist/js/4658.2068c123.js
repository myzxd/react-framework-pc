"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[4658],{24658:function(e,t,n){n.r(t),n.d(t,{default:function(){return xe}});n(89032);var a=n(15746),r=(n(13062),n(71230)),o=n(15671),s=n(43144),c=n(97326),l=n(60136),i=n(82963),f=n(61120),u=n(4942),m=n(67294),d=n(96036),p=n(26783),h=(n(52560),n(71577)),A=(n(1868),n(12028)),v=n(93517),E=n.n(v),C=n(66939),b=(n(98703),n(88144)),y=n(45697),g=n.n(y);function Z(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var S=function(e){(0,l.Z)(n,e);var t=Z(n);function n(){var e;(0,o.Z)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r)),(0,u.Z)((0,c.Z)(e),"onChange",(function(t){e.props.onChange&&e.props.onChange(t);var n=e.props.namespace;if(e.props.form){var a=[];a["".concat(n,"-department")]=t.department,a["".concat(n,"-staff")]=t.staff,a["".concat(n,"-isSelected")]=t.isSelected,e.props.form.setFieldsValue(a)}})),(0,u.Z)((0,c.Z)(e),"onChangeDepartment",(function(t){var n=e.props.value;n.department=t,n.staff=[],e.onChange(n)})),(0,u.Z)((0,c.Z)(e),"onChangeStaff",(function(t){var n=e.props.value;n.staff=t,e.onChange(n)})),(0,u.Z)((0,c.Z)(e),"onChangeSwitch",(function(t){var n=e.props.value;n.isSelected=t,e.onChange(n)})),(0,u.Z)((0,c.Z)(e),"renderFormItems",(function(){var t=e.props.form.getFieldDecorator,n=e.props,a=n.namespace,r=n.value,o=[{label:"所属部门",form:t("".concat(a,".department"),{rules:[{required:!0,message:"请选择部门"}],initialValue:E().get(r,"department",[])})(m.createElement(b.MG,{namespace:"".concat(a,"-department"),onChange:e.onChangeDepartment}))},{label:"岗位",form:t("".concat(a,".staff"),{rules:[{required:!0,message:"请选择岗位"}],initialValue:E().get(r,"staff",[])})(m.createElement(b.b0,{namespace:"".concat(a,"-staff"),departmentId:E().get(r,"department",[]),onChange:e.onChangeStaff}))},{label:"设置为主岗位",form:t("".concat(a,".isSelected"),{initialValue:E().get(r,"isSelected",!1)})(m.createElement(A.Z,{onChange:e.onChangeSwitch}))}];return m.createElement(d.KP,{items:o,cols:3,layout:{labelCol:{span:8},wrapperCol:{span:16}}})})),(0,u.Z)((0,c.Z)(e),"renderItems",(function(){var t=e.state,n=t.namespace,a=t.value,r=[{label:"所属部门",form:m.createElement(b.MG,{value:E().get(a,"department",[]),namespace:"".concat(n,"-department"),onChange:e.onChangeDepartment})},{label:"岗位",form:m.createElement(b.b0,{value:E().get(a,"staff",[]),namespace:"".concat(n,"-staff"),departmentId:E().get(a,"department",[]),onChange:e.onChangeStaff})},{label:"设置为主岗位",form:m.createElement(A.Z,{checked:E().get(a,"isSelected",!1),onChange:e.onChangeSwitch})}];return m.createElement(d.KP,{items:r,cols:3,layout:{labelCol:{span:8},wrapperCol:{span:16}}})})),e}return(0,s.Z)(n,[{key:"render",value:function(){return this.props.form?this.renderFormItems():this.renderItems()}}]),n}(m.Component);(0,u.Z)(S,"propTypes",{namespace:g().string,form:g().object,onChange:g().func,value:g().object}),(0,u.Z)(S,"defaultProps",{namespace:"default"});var x=S;function X(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var z=function(e){(0,l.Z)(n,e);var t=X(n);function n(e){var a;return(0,o.Z)(this,n),a=t.call(this,e),(0,u.Z)((0,c.Z)(a),"onSubmit",(function(){a.props.form.validateFieldsAndScroll((function(e,t){e||console.log(t)}))})),(0,u.Z)((0,c.Z)(a),"onChangeDepartment",(function(e,t){var n=a.state.departments;n[e]=t,a.setState({departments:n});var r={};r["".concat(e,"-staff")]=void 0,a.props.form.setFieldsValue(r)})),(0,u.Z)((0,c.Z)(a),"onChangeStaffs",(function(e,t){var n=a.state.staffs;n[e]=t,a.setState({staffs:n})})),(0,u.Z)((0,c.Z)(a),"onChangeSwitch",(function(e,t){t?a.setState({selectetId:e}):a.setState({selectetId:void 0})})),(0,u.Z)((0,c.Z)(a),"renderFormItems",(function(){var e=a.props.form.getFieldDecorator,t=a.state.departments,n="namespace-1",r="".concat(n,"-department"),o="".concat(n,"-staff"),s=E().get(t,n),c=[{label:"所属部门",form:e(r,{rules:[{required:!0,message:"请选择部门"}]})(m.createElement(b.MG,{namespace:r,onChange:function(e){a.onChangeDepartment(n,e)}}))},{label:"岗位",form:e(o,{rules:[{required:!0,message:"请选择岗位"}]})(m.createElement(b.b0,{namespace:o,departmentId:s}))},{label:"设置为主岗位",form:e(o)(m.createElement(A.Z,{onChange:function(e){a.onChangeSwitch(s,e)}}))}];return m.createElement(d.IT,{title:"表单内组件"},m.createElement(d.KP,{items:c,cols:3,layout:{labelCol:{span:8},wrapperCol:{span:16}}}))})),(0,u.Z)((0,c.Z)(a),"renderCombineForm",(function(){var e=a.state,t=e.field2,n=e.field3,r=e.field4;return m.createElement(d.IT,{title:"集成组件"},m.createElement(x,{namespace:"fields-2",form:a.props.form,value:t,onChange:function(e){a.setState({field2:e})}}),m.createElement(x,{namespace:"fields-3",form:a.props.form,value:n,onChange:function(e){a.setState({field3:e})}}),m.createElement(x,{namespace:"fields-4",form:a.props.form,value:r,onChange:function(e){a.setState({field4:e})}}))})),(0,u.Z)((0,c.Z)(a),"renderMultiSelect",(function(){var e=[{label:"所属部门",form:(0,a.props.form.getFieldDecorator)("multiple-department",{rules:[{required:!0,message:"请选择部门"}]})(m.createElement(b.MG,{multiple:!0,namespace:"multiple-department"}))}];return m.createElement(d.IT,{title:"多选"},m.createElement(d.KP,{items:e,cols:3,layout:{labelCol:{span:8},wrapperCol:{span:16}}}))})),(0,u.Z)((0,c.Z)(a),"renderCoachFilterSelect",(function(){var e=[{label:"所属部门",form:(0,a.props.form.getFieldDecorator)("filter-department",{rules:[{required:!0,message:"请选择部门"}]})(m.createElement(b.MG,{multiple:!0,isOnlyShowCoach:!0,allowClear:!0,namespace:"filter-department"}))}];return m.createElement(d.IT,{title:"过滤选项，只显示私教部门"},m.createElement(d.KP,{items:e,cols:3,layout:{labelCol:{span:8},wrapperCol:{span:16}}}))})),(0,u.Z)((0,c.Z)(a),"renderAuthorizeFilterSelect",(function(){var e=[{label:"所属部门",form:(0,a.props.form.getFieldDecorator)("filter-department",{rules:[{required:!0,message:"请选择部门"}]})(m.createElement(b.MG,{isAuthorized:!0,namespace:"filter-department"}))}];return m.createElement(d.IT,{title:"过滤选项，只显示有权限的部门"},m.createElement(d.KP,{items:e,cols:3,layout:{labelCol:{span:8},wrapperCol:{span:16}}}))})),a.state={departments:{},staffs:{},selectetId:void 0,fields:{},field2:{department:6,staff:4},field3:{department:6,staff:4},field4:{department:6,staff:4}},a}return(0,s.Z)(n,[{key:"render",value:function(){return m.createElement(C.Z,{layout:"horizontal"},this.renderFormItems(),this.renderCombineForm(),this.renderMultiSelect(),this.renderCoachFilterSelect(),this.renderAuthorizeFilterSelect(),m.createElement("div",{style:{textAlign:"center"}},m.createElement(h.Z,{type:"primary",onClick:this.onSubmit},"保存")))}}]),n}(m.Component),M=C.Z.create()(z),j=(n(20186),n(75385)),F="DWcTBMvrgNhGI_BYXVvA",B="vWHWWW_CheKtoU8fJhhP",w="yXPMGaQFz0UrM9ILBv3M",_="jMCc_YbRqtxpDRvcSrAw",I="d6yMAxKpbvnRs8Rr9anZ",D="xBA_il3PgnpE80HKH2UO",k="WBG_3mjMMnihZYHhy9tb",P="qpJJh1L6NYevxjHvtODA",q="EfJ71NLoG2MBLGybS_Fr",R="GVO6sV1R7EnmB6EbWF3p",T="Qqh2C3pOqPBtzL7uMiI8",O="ua08lljY8XYWtg7LWHjX",H="jzTQ7jvZu58xZbT0ZRlj";function N(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var L=function(e){(0,l.Z)(n,e);var t=N(n);function n(){var e;(0,o.Z)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r)),(0,u.Z)((0,c.Z)(e),"renderDesc",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return m.createElement("div",null,m.createElement("p",{className:F},e),m.createElement("p",{className:B}))})),(0,u.Z)((0,c.Z)(e),"renderParams",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=[{title:"字段名称",dataIndex:"name",key:"name"},{title:"字段类型",dataIndex:"type",key:"type"},{title:"字段注释",dataIndex:"note",key:"note"},{title:"是否必填",dataIndex:"required",key:"required",render:function(e){return e?m.createElement("span",{className:w},"是"):"否"}},{title:"枚举值",dataIndex:"enum_values",key:"enum_values"}];return m.createElement(j.Z,{rowKey:function(e,t){return t},pagination:!1,columns:t,dataSource:e,bordered:!0})})),(0,u.Z)((0,c.Z)(e),"render",(function(){var t=e.props.item,n=t.name,a=t.desc,r=t.path,o=t.params,s=t.result,c=t.example,l=void 0===c?{}:c;return 0===Object.keys(t).length?m.createElement("div",null):m.createElement("div",null,m.createElement("div",{className:_},m.createElement("p",{className:I},n," - ",a),m.createElement("p",{className:D},"接口地址："),m.createElement("p",{className:k},r),m.createElement("p",{className:P},"请求参数："),e.renderParams(o),m.createElement("p",{className:q},"返回结果："),m.createElement(d.ek,null,JSON.stringify(s,null,"\t"))),m.createElement("div",{className:R},m.createElement("p",{className:T},"测试用例"),m.createElement("p",{className:O},"参数："),m.createElement(d.ek,null,l.params?JSON.stringify(l.params,null,"\t"):""),m.createElement("p",{className:H},"返回："),m.createElement(d.ek,null,l.result?JSON.stringify(l.result,null,"\t"):"")))})),e}return n}(m.Component);(0,u.Z)(L,"propTypes",{item:g().object}),(0,u.Z)(L,"defaultProps",{item:{}});var W=L,K="z2kGQqLZv0DejrOT6E8a",Q="q0uRl3dnVe29iM7rQOl8",G="tj6zwR9vjdt3jTGqEF4q",V="x56c8_iHFsgYQWT7UqgC",J="mWZGvcnH6udn_y0E4aYX",U="ePmNBz8yUPTHV5ampnFD";function Y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var $=function(e){(0,l.Z)(n,e);var t=Y(n);function n(){var e;(0,o.Z)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r)),(0,u.Z)((0,c.Z)(e),"renderCase",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return m.createElement("div",{className:K},m.createElement("div",{className:Q},n),m.createElement("div",{className:G},m.createElement("span",{className:V},e),m.createElement("span",null,t)),m.createElement(d.ek,null,a))})),(0,u.Z)((0,c.Z)(e),"renderDescription",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return m.createElement("div",null,m.createElement("p",{className:J},e),m.createElement("p",{className:U}))})),e}return(0,s.Z)(n,[{key:"render",value:function(){return m.createElement("div",null,this.renderDescription("CoreContent 组件，封装内容的容器。为了统一管理功能，功能页面必须封装在CoreContent中使用。"),this.renderCase("基本","无标题的，内容容器",m.createElement(d.IT,null," 内容 "),"<CoreContent> 内容 </CoreContent>"),this.renderCase("标题","带标题的，内容容器。 标题 为 可选参数 title, 标题提示 为 可选参数 titleTip。",m.createElement(d.IT,{title:"标题",titleTip:"这里是标题提示"}," 内容 "),"<CoreContent title={'标题'} titleTip={'这里是标题提示'}> 内容 </CoreContent>"),this.renderCase("标题扩展","标题扩展 为 可选参数 titleExt, 可以使用纯文本或组件对象。",m.createElement(d.IT,{title:"标题",titleExt:m.createElement("span",null,"添加 | 删除 | 操作")}," 内容 "),"<CoreContent title={'标题'} titleExt={<span>添加 | 删除 | 操作</span>}> 内容 </CoreContent>"),this.renderCase("页脚","页脚内容 为 可选参数 footer, 可以使用纯文本或组件对象。",m.createElement(d.IT,{title:"标题",footer:m.createElement("div",{style:{fontSize:"10px"}},"这里是页脚内容")}," 内容 "),"<CoreContent title={'标题'} footer={<div style={{ fontSize:'10px' }}>这里是页脚内容</div>}> 内容 </CoreContent>"))}}]),n}(m.Component),ee=$,te="h9xjc24NVb4yKC2HE3bA",ne="LGc5mVIUA1lVVbgX6Tq3",ae="yZESwztnNpGgBZemthKJ",re="IY0EledyJMbaGtkE2R5q",oe="LcEF8VNrIaL49ftWOKFH",se="Ij8Iw0Zme3KCSDZMB1bF";function ce(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var le=function(e){(0,l.Z)(n,e);var t=ce(n);function n(){var e;(0,o.Z)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r)),(0,u.Z)((0,c.Z)(e),"onChange",(function(){})),(0,u.Z)((0,c.Z)(e),"renderCase",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return m.createElement("div",{className:te},m.createElement("div",{className:ne},n),m.createElement("div",{className:ae},m.createElement("span",{className:re},e),m.createElement("span",null,t)),m.createElement(d.ek,null,a))})),(0,u.Z)((0,c.Z)(e),"renderDescription",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return m.createElement("div",null,m.createElement("p",{className:oe},e),m.createElement("p",{className:se}))})),e}return(0,s.Z)(n,[{key:"render",value:function(){var e=[{title:"标签1",content:"内容1",key:"aaa"},{title:"标签2",content:"内容2"},{title:"标签3",content:"内容3"}];return m.createElement("div",null,this.renderDescription("CoreTabs 组件，封装标签切换的容器。"),this.renderCase("基本","\n            多标签, 使用items参数传入数据, item的数据结构\n            {\n              key: '',          // 唯一标示\n              title: '',        // 标题\n              content: '',      // 内容\n            };\n            onChange 作为切换tab的回调函数使用\n          ",m.createElement(d.DF,{items:e,onChange:this.onChange}),"\n          onChange = (key) => {\n            console.log(key);\n          }\n\n          const items = [\n            { title: '标签1', content: '内容1', key: 'aaa' },\n            { title: '标签2', content: '内容2' },\n            { title: '标签3', content: '内容3' },\n          ];\n          <CoreTabs items={items} onChange={this.onChange} />,\n          "),this.renderCase("其他样式","样式参数 type，默认样式line，支持card",m.createElement(d.DF,{items:e,type:"card",onChange:this.onChange}),"\n          onChange = (key) => {\n            console.log(key);\n          }\n\n          const items = [\n            { title: '标签1', content: '内容1', key: 'aaa' },\n            { title: '标签2', content: '内容2' },\n            { title: '标签3', content: '内容3' },\n          ];\n          <CoreTabs items={items} type=\"card\" onChange={this.onChange} />,\n          "))}}]),n}(m.Component),ie=le;function fe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var ue=function(e){(0,l.Z)(n,e);var t=fe(n);function n(){var e;(0,o.Z)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r)),(0,u.Z)((0,c.Z)(e),"renderContent",(function(){var t=e.state,n=t.title,a=t.content;return t.isRenderMarkDown?m.createElement(d.IT,{title:n}," ",m.createElement(d.ek,{markdown:a})):m.createElement(d.IT,{title:n}," ",a," ")})),e}return(0,s.Z)(n,[{key:"render",value:function(){return m.createElement("span",null,"DemoDeprecatedCoreSearch")}}]),n}(m.Component),me=ue;function de(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var pe=function(e){(0,l.Z)(n,e);var t=de(n);function n(){var e;(0,o.Z)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r)),(0,u.Z)((0,c.Z)(e),"renderContent",(function(){var t=e.state,n=t.title,a=t.content;return t.isRenderMarkDown?m.createElement(d.IT,{title:n}," ",m.createElement(d.ek,{markdown:a})):m.createElement(d.IT,{title:n}," ",a," ")})),e}return(0,s.Z)(n,[{key:"render",value:function(){return m.createElement("span",null,"DemoDeprecatedCoreForm")}}]),n}(m.Component),he=pe,Ae=JSON.parse('[{"asset_id":"610a3045af4fbc2839adf62a","asset_key":"quhuo/oa_approval/2021/8/4/BOSS与WEB对接-610a3022af4fbc2839adf618.md","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/BOSS%E4%B8%8EWEB%E5%AF%B9%E6%8E%A5-610a3022af4fbc2839adf618.md?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=29b12f63b66837319d1a8f0906149705807af2bc4029b1d84bff013c43de6d71"},{"asset_id":"610a3045af4fbc2839adf62c","asset_key":"quhuo/oa_approval/2021/8/4/版本号 boss7月1优化2-610a3032af4fbc2839adf61e.md","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/%E7%89%88%E6%9C%AC%E5%8F%B7%20boss7%E6%9C%881%E4%BC%98%E5%8C%962-610a3032af4fbc2839adf61e.md?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=9131fe578f77d6886aa7a47a20309047e91bac1dd63ef88299f1575163e68124"},{"asset_id":"610a3045af4fbc2839adf62e","asset_key":"quhuo/oa_approval/2021/8/4/4650c8c251accf95336e4342129d396c-610a3032af4fbc2839adf61b.BMP","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/4650c8c251accf95336e4342129d396c-610a3032af4fbc2839adf61b.BMP?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=edc42df7e98c873062e83cacb64858375d7fc3e84e19d93f2ed3fa2d2e36691e"},{"asset_id":"610a3045af4fbc2839adf630","asset_key":"quhuo/oa_approval/2021/8/4/采购入库明细表2019-07-22-5ecbb4f2e4727d005b95d273 (1)-60b9f982fa1f4df09cf126e7 (6)的副本-610a3032af4fbc2839adf620.xlsx","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/%E9%87%87%E8%B4%AD%E5%85%A5%E5%BA%93%E6%98%8E%E7%BB%86%E8%A1%A82019-07-22-5ecbb4f2e4727d005b95d273%20%281%29-60b9f982fa1f4df09cf126e7%20%286%29%E7%9A%84%E5%89%AF%E6%9C%AC-610a3032af4fbc2839adf620.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=32d621297afbbb3655479e31e455db1e36edd0e2f60063106540beee706a59b4"},{"asset_id":"610a3045af4fbc2839adf632","asset_key":"quhuo/oa_approval/2021/8/4/8e9b97fb-2972-74be-87b5-fdcce877896a的副本-610a3032af4fbc2839adf61a.DOC","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/8e9b97fb-2972-74be-87b5-fdcce877896a%E7%9A%84%E5%89%AF%E6%9C%AC-610a3032af4fbc2839adf61a.DOC?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=a7778173abcba5db89bf2b91dfaa0196a6be1c5506b6e245ea8c97ae8ed0c6c0"},{"asset_id":"610a3045af4fbc2839adf634","asset_key":"quhuo/oa_approval/2021/8/4/8e9b97fb-2972-74be-87b5-fdcce877896a-610a3032af4fbc2839adf619.doc","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/8e9b97fb-2972-74be-87b5-fdcce877896a-610a3032af4fbc2839adf619.doc?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=5750e5064e2226059befe37bda422ea4b94d877c996931e029fa4f9f7617da5f"},{"asset_id":"610a3045af4fbc2839adf636","asset_key":"quhuo/oa_approval/2021/8/4/4650c8c251accf95336e4342129d396c-610a3032af4fbc2839adf61c.JPEG","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/4650c8c251accf95336e4342129d396c-610a3032af4fbc2839adf61c.JPEG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=f1e77976c66c47fa710b0c362a34b289ece6439775c54ed4bdc60332a808abc9"},{"asset_id":"610a3045af4fbc2839adf638","asset_key":"quhuo/oa_approval/2021/8/4/采购入库明细表2019-07-22-5ecbb4f2e4727d005b95d273 (1)-60b9f982fa1f4df09cf126e7 (6)-610a3032af4fbc2839adf621.XLSX","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/%E9%87%87%E8%B4%AD%E5%85%A5%E5%BA%93%E6%98%8E%E7%BB%86%E8%A1%A82019-07-22-5ecbb4f2e4727d005b95d273%20%281%29-60b9f982fa1f4df09cf126e7%20%286%29-610a3032af4fbc2839adf621.XLSX?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=2544e8b180d6b721691eb6587f79eea18219e632102ba13bba30dd895e3fe3f0"},{"asset_id":"610a3045af4fbc2839adf63a","asset_key":"quhuo/oa_approval/2021/8/4/测试PPtx格式附件预览-610a3032af4fbc2839adf61f.pptx","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/%E6%B5%8B%E8%AF%95PPtx%E6%A0%BC%E5%BC%8F%E9%99%84%E4%BB%B6%E9%A2%84%E8%A7%88-610a3032af4fbc2839adf61f.pptx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=b9c2ee63da89bca4cfc545317872331c409cee4a7b3f944bc2fbd974c4ac2482"},{"asset_id":"610a3045af4fbc2839adf63c","asset_key":"quhuo/oa_approval/2021/8/4/测试PPtx格式附件预览的副本-610a3032af4fbc2839adf622.PPTX","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/%E6%B5%8B%E8%AF%95PPtx%E6%A0%BC%E5%BC%8F%E9%99%84%E4%BB%B6%E9%A2%84%E8%A7%88%E7%9A%84%E5%89%AF%E6%9C%AC-610a3032af4fbc2839adf622.PPTX?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=1b2c5c4878fe0765b5192629bff3e1bcf8acb72d41104c3b59e4f0908a56a891"},{"asset_id":"610a3045af4fbc2839adf63e","asset_key":"quhuo/oa_approval/2021/8/4/1620974573811-610a3032af4fbc2839adf61d.PNG","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/1620974573811-610a3032af4fbc2839adf61d.PNG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=c6e48c95b957d3b077fd8d07ea5892b51bb556f7900e66e3f58db96f8f26b255"},{"asset_id":"610a3045af4fbc2839adf640","asset_key":"quhuo/oa_approval/2021/8/4/沉默的大多数-610a3032af4fbc2839adf623.pdf","asset_url":"https://s3.cn-northwest-1.amazonaws.com.cn/boss-biz-store-dev/quhuo/oa_approval/2021/8/4/%E6%B2%89%E9%BB%98%E7%9A%84%E5%A4%A7%E5%A4%9A%E6%95%B0-610a3032af4fbc2839adf623.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=360&X-Amz-Credential=AKIAOBSMFMACLBOIPQCQ%2F20210809%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Date=20210809T061413Z&X-Amz-Signature=669ea86107df812756b274b3d6edfb82e8d00898f8d4c6756f51a636ce63557d"}]'),ve=d.KT.CoreFinderList;var Ee=function(){var e=Ae.map((function(e){return{key:e.asset_key,url:e.asset_url,data:e}}));return m.createElement(ve,{data:e})},Ce="#项目配置文件\n基本配置文件目录 ~/src/application/define/\n  ├── index.jsx       (全局使用的基础类型定义，枚举定义)\n  ├── modules.js      (功能模块定义)\n  ├── navigation.js   (导航结构定义)\n  ├── permissions.js  (权限定义，角色-页面访问权限)\n  └── rules.js        (权限定义，角色-页面内功能使用权限)\n\n#项目模块定义\nmodules中定义的模块类型有两种\n\n1. 一种是菜单栏目。（没有具体地址）\n  命名规则:\n  MenuXXX, XXX代表自定义名称。\n  具体实例:\n  MenuXXX: new Module({ title: '菜单栏名称（自定义）', path: 'MenuXXX（与定义名称一致）', icon: '菜单栏icon（自定义）' })\n\n2. 一种是页面模块。（有访问地址）\n  命名规则:\n  ModuleXXX, XXX代表自定义名称。\n  具体实例:\n  ModuleXXX: new Module({ title: '模块名称（自定义）', path: 'Module/XXX(模块在路由中设置的访问地址 )' })\n\n#项目模块开发\n\n如何设置新菜单:\n1. 根据上述规则，在modules.js中定义菜单栏目。如，添加菜单为 MenuXXX。\n2. 将 Module.MenuXXX 定义，添加到 navigation.js  最上层结构中。（菜单为最上层第一级，模块为菜单下一级）\n3. 将 Module.MenuXXX 定义，添加到 permissions.js 对应的角色下。（必须设置权限才能访问）\n4. 正常使用\n\n如何新开发模块：\n1. 根据上述规则，在modules.js中定义新的模块。如，添加菜单为 ModuleXXX\n2. 将 Module.ModuleXXX 定义，添加到 navigation.js  菜单下层结构中。（菜单为最上层第一级，模块为菜单下一级）\n3. 将 Module.ModuleXXX 定义，添加到 permissions.js 对应的角色下。（必须设置权限才能访问）\n4. 正常使用\n",be="VWfRM9GXD8AZ8EkqnUam";function ye(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,i.Z)(this,n)}}var ge=0,Ze=1,Se=function(e){(0,l.Z)(n,e);var t=ye(n);function n(){var e;(0,o.Z)(this,n),e=t.call(this),(0,u.Z)((0,c.Z)(e),"onClickSider",(function(t){var n=t.title,a=!!t.noWapper,r="";t.type===ge&&(r=void 0===t.file?"未找到该文件":m.createElement(d.ek,{markdown:t.file})),t.type===Ze&&(r=t.component),e.setState({title:n,content:r,noWapper:a})})),(0,u.Z)((0,c.Z)(e),"renderSider",(function(t){var n=t.title,a=t.data,o=(0,c.Z)(e).onClickSider;return m.createElement(d.IT,{title:n,key:n},a.map((function(e){return m.createElement(r.Z,{span:24,className:be,key:e.title},m.createElement("a",{onClick:function(){return o(e)}},e.title))})))})),(0,u.Z)((0,c.Z)(e),"renderContent",(function(){var t=e.state,n=t.title,a=t.content;return t.noWapper?a:m.createElement(d.IT,{title:n}," ",a," ")})),e.state={title:"模块开发文档",content:m.createElement(d.ek,{markdown:Ce}),noWapper:!1};var a=p.TransferLoaderForSalaryDocument.transfer().map((function(e,t){return m.createElement(W,{item:e,key:"key".concat(t)})}));return e.private={sider:[{title:"模块实例",data:[{title:"CoreFinder",type:Ze,component:m.createElement(Ee,null)},{title:"CoreContent",type:Ze,noWapper:!0,component:m.createElement(ee,null)},{title:"DeprecatedCoreForm",type:Ze,component:m.createElement(me,null)},{title:"DeprecatedCoreSearch",type:Ze,component:m.createElement(he,null)},{title:"CoreTabs",type:Ze,component:m.createElement(ie,null)},{title:"TreeSelect",type:Ze,component:m.createElement(M,null)}]},{title:"接口文档",data:[].concat({title:"全部接口",type:Ze,noWapper:!0,component:m.createElement("div",null,a)},p.TransferLoaderForSalaryDocument.transfer().map((function(e){return{title:e.name,type:Ze,noWapper:!0,component:m.createElement(W,{item:e})}})))},{title:"说明文档",data:[{title:"项目开发文档",type:ge,file:"#项目开发文档\n\n##项目结构\n待完善\n\n##项目抽象分层\n待完善\n\n##项目路由设置\n待完善\n\n##项目配置文件\n详见 >> 模块开发文档\n\n##模块开发文档\n详见 >> 模块开发文档\n"},{title:"模块开发文档",type:ge,file:Ce},{title:"页面开发规范",type:ge,file:"#业务组件开发。根目录为 src/routes\n\n组件目录结构为 (举例)\naccount                   (菜单目录 ，如：超级管理，查询管理，操作管理)\n  ├── managent            (功能目录，如：账户管理，授权验证，)\n  │   ├── components     （managent 功能目录下，功能页面的拆分或公用模块）\n  │   │   ├── avatar.jsx （功能页面拆分模块，如：头像，信息，列表等具体的。）\n  │   │   └── info.jsx   （功能页面拆分模块，如：头像，信息，列表等具体的。）\n  │   ├── create.jsx     （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）\n  │   ├── detail.jsx     （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）\n  │   ├── index.jsx      （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）\n  │   └── update.jsx     （功能页面，如：登陆，创建，详情，列表，二级，三级具体页面）\n  ├── authorize           (功能目录)\n  │   ├── auth.jsx        (功能页面)\n  │   └── index.jsx       (功能页面, 默认的authorize模块首页)\n  └── components          (account 菜单目录下，managent，authorize 的公用模块)\n      └── common.jsx      (公用模块)\n\n#抽象组件开发。根目录为 src/compontens/core\n\ncomponents/\n└── core\n    ├── index.jsx     所有模块的引用封装\n    ├── style.less    样式\n    ├── content.jsx   内容盒子模块\n    ├── form.jsx      表单，字段排版显示模块\n    ├── search.jsx    搜索模块\n    └── upload.jsx    上传模块\n\n1. 页面统一样式，模块内容封装统一使用CoreContent。\n2. 页面搜索模块，使用DeprecatedCoreSearch。\n3. 页面字段排版，数据展示，使用DeprecatedCoreForm。\n4. 功能组件，使用Ant.Design。\n5. 业务组件，根据业务组件开发标准，进行模块查分开发。\n"},{title:"项目开发计划",type:ge,file:"调整项目目录与路由完全一致\n\n超级管理(仅限超管) - menu-MenuAdmin\n系统信息 - Admin/System\n权限管理 - Admin/Management/Authorize\n角色管理 - Admin/Management/Roles\n开发文档 - Admin/Interface\n开发调试 - Admin/Developer\n\n人员管理 - menu-MenuEmployee\n查看人员 - Employee/Manage\n    人员详情 - Employee/Detail\n    人员编辑 - Employee/Update\n添加人员 - Employee/Create\n离职审批 - Employee/LeaveFlow\n工号管理 - Employee/Transport\n    工号详情 - Employee/Transport/Detail\n    工号编辑 - Employee/Transport/Update\n\n物资管理 - menu-MenuMateriel\n\n库存信息 - menu-MenuMaterielStores\n查看库存 - Materiel/Stores/Search\n    变动明细 - Materiel/Stores/Log/Detail\n品目明细 - Materiel/Stores/Item\n查看骑士物资 - Materiel/Stores/Knight\n    骑士物资详情 - Materiel/Stores/Knight/Detail\n采购|报废 - menu-MenuMaterielPurchase\n采购|报废记录 - Materiel/purchase/Log\n    查看详情 - Materiel/purchase/Detail\n    提交报错单 - Materiel/purchase/ErrorOrder\n新建物资采购|报废 - Materiel/purchase/Create\n分发|退货记录 - menu-MenuMaterielDispatch\n分发|退货记录 - Materiel/Dispatcher/Log\n    查看详情 - Materiel/Dispatcher/Detail\n新建物资分发 - Materiel/Dispatcher/Create\n\n\n我的账户 - menu-MenuAccount\n我的账户 - Account\n\n系统管理 - menu-MenuSystem\n用户管理 - System/Account/Manage\n供应商管理 - System/Supplier\n    添加供应商 - System/Supplier/Create\n    编辑供应商 - System/Supplier/Update\n骑士结算指标库 - System/SalaryIndex\n合同归属管理 - System/Manage/Company\n"}]},{title:"模块说明",data:[{title:"超级管理",type:ge,file:".\n├── README.md\n├── developer                       开发调试模块\n│   └── index.jsx                   \n├── interface\n│   ├── components                  模块实例\n│   │   ├── content                 内容模块\n│   │   │   └── index.jsx\n│   │   ├── form                    表单模块\n│   │   │   └── index.jsx\n│   │   └── search                  查询模块\n│   │       └── index.jsx\n│   ├── document                    说明文档\n│   │   ├── application.md          项目开发文档\n│   │   ├── interface.md            页面开发规范\n│   │   ├── modules.md              模块开发文档\n│   │   └── plan.md                 项目开发计划\n│   └── index.jsx                   开发文档模块\n├── management\n│   ├── authorize                   模块权限信息\n│   │   ├── index.jsx               权限管理模块\n│   │   └── moduleTree.jsx          授权模块\n│   └── roles                       \n│       └── index.jsx               角色管理\n└── system.jsx                      系统信息"},{title:"人员管理",type:ge,file:".\n├── README.md\n├── add                          // 添加人员\n│   ├── index.js                 // 首页\n│   └── static                   // 静态文件夹\n│       └── uploadKnight.xlsx    // 上传骑士表\n├── delivery                     // 工号管理\n│   ├── IndexSearch.js           // 首页查找\n│   ├── Search.js                // 搜素组件\n│   ├── build.js                 // 新建模板列表\n│   ├── define.js                // 枚举值定义\n│   ├── detail.js                // 详情\n│   ├── edit.js                  // 编辑\n│   ├── index.js                 // 首页\n│   └── utils.js                 // 工具\n├── leaveApproval                // 离职申请\n│   ├── index.js                 // 首页\n└── search                       // 查询页\n    ├── cancel.js                // 返回组件\n    ├── cityList.json            // 城市表\n    ├── define.js                // 银行对照表\n    ├── detail.jsx               // 详情\n    ├── edit.jsx                 // 编辑\n    ├── editContractPhoto.jsx    // 编辑合同照片\n    ├── editPhotoDetail.jsx      // 编辑照片\n    ├── editPhotoDetail.less     // 编辑照片样式页\n    ├── historyInfoDetail.jsx    // 历史工作信息详情\n    ├── historyInformation.jsx   // 历史工作信息\n    ├── index.jsx                // 首页\n    ├── knightLeaveCheck.jsx     // 骑士离职审核\n    ├── search.jsx               // 搜索组件\n    ├── search.less              // 搜索组件样式\n    ├── showContractPhoto.jsx    // 显示合同照片组件\n    └── showPhotoDetail.jsx      // 合同照片详情\n\n5 directories, 29 files\n"},{title:"我的账户",type:ge,file:".\n├── README.md\n├── authorize\n│   ├── auth.jsx                    多账号登录\n│   ├── index.jsx                   登录相关路由\n│   ├── login.jsx                   登录业务组件\n│   ├── static                      静态文件\n│   │   ├── lgBg.jpg\n│   │   ├── loginBg.jpg\n│   │   ├── logo.png\n│   │   └── logoNew.png\n│   └── style                        样式\n│       ├── login.less\n│       └── theme.less\n├── component\n│   ├── certificate\n│   │   ├── cityList.json            城市数据\n│   │   ├── define.js                银行枚举\n│   │   ├── index.jsx                账户信息，编辑人员信息 上传图片页面\n│   │   └── style.less               样式\n│   └── index\n│       ├── baseInfo.jsx             个人信息\n│       ├── certificate.jsx          展示人员编辑模板\n│       ├── contractInfo.jsx         合同信息\n│       └── workInfo.jsx             工作信息\n├── index.jsx\n├── personalLeave\n│   ├── index.js                     个人离职模块\n│   ├── showContractPhoto.jsx        显示合同照片模板\n│   └── showPhotoDetail.jsx          显示每个合同照片的模板\n└── static                           静态文件\n    └── account.png\n\n8 directories, 23 files"},{title:"系统管理",type:ge,file:".\n├── README.md                // readme\n├── salaryIndex              // 骑士结算指标库\n│   ├── template             // 结算指标库首页\n│   │   ├── baidu.js         // 百度模版\n│   │   ├── meituan.js       // 美团模版\n│   │   └── elem.js          // 饿了么模版\n│   └── index.jsx            // 结算指标库首页\n├── field                    // 用户管理页\n│   └── index.jsx            // 首页\n├── supplier                 // 供应商\n│   ├── create.jsx              // 添加供应商\n│   ├── define.js            // 枚举值定义\n│   ├── edit.jsx             // 编辑\n│   └── index.js             // 首页\n├── system.less              // 系统样式\n├── target                   // 用户管理\n│   └── index.jsx            // 首页\n└── user                     // 用户信息\n    ├── edit.jsx             // 编辑用户信息\n    ├── index.jsx            // 首页\n    ├── modal.jsx            // 编辑对话框\n    └── search.jsx           // 查找\n\n8 directories, 35 files\n"}]}]},e}return(0,s.Z)(n,[{key:"render",value:function(){var e=this.renderSider,t=this.private.sider;return m.createElement(r.Z,{span:"24",gutter:16},m.createElement(a.Z,{span:5},t.map((function(t){return e(t)}))),m.createElement(a.Z,{span:"19"},this.renderContent()))}}]),n}(m.Component),xe=Se}}]);