"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[3880],{83880:function(e,t,n){n.r(t),n.d(t,{default:function(){return q}});n(52560);var r=n(71577),a=n(87462),c=(n(35668),n(86585)),i=n(29439),o=n(30381),l=n.n(o),s=n(67294),m=n(55609),u=n(94315),p=n.n(u),y=n(96036),d=(n(13062),n(71230)),f=(n(21316),n(75443)),E=(n(9070),n(20924)),v=(n(89032),n(15746)),b=n(93433),Z=(n(51838),n(48086)),_=n(1058),h=n(49101),C=(n(29093),n(16317)),O=n(93517),g=n.n(O),w=n(80385),j=C.Z.Option;var P=(0,m.connect)((function(e){return{cities:e.systemCity.cities}}))((function(e){var t=e.dispatch,n=e.onCityChange,r=e.cities,c=void 0===r?{}:r,i=g().get(c,"data",[]);(0,s.useEffect)((function(){var e={areaLevel:w.vfl.prefecture};t({type:"systemCity/fetchCities",payload:e})}),[w.vfl]);var o=i.map((function(e){return s.createElement(j,{key:e._id,value:e._id},e.city_name)}));return s.createElement(C.Z,(0,a.Z)({},e,{onChange:function(e){var t=i.filter((function(t){return t._id===e}))[0];n&&n(t)}}),o)})),k="NNpKQKPIhLkoTX9TBNDE",D="V1YC876Q1ZuYFyAi53q_",I=function(e){var t=e.dispatch,n=e.details,a=void 0===n?{}:n,o=e.onChange,l=void 0===o?function(){}:o,m=e.value,u=(0,s.useState)([{}]),y=(0,i.Z)(u,2),C=y[0],O=y[1];(0,s.useEffect)((function(){m&&O(m)}),[m]);var g=function(e,t){var n=e.data[0];C[t].city_code=n.city_code,C[t].city_custom_name=n.city_custom_name,C[t].city_spelling=n.city_spelling,O(C),l&&l(C)},w=function(n,i,o){return s.createElement(d.Z,{key:i},s.createElement(v.Z,{span:5},s.createElement(c.Z.Item,{label:s.createElement("span",{style:{width:100},className:"boss-form-item-required"},"行政城市名称")},s.createElement(P,{showSearch:!0,optionFilterProp:"children",value:n._id,onCityChange:function(e){return function(e,n){C[n]._id=e._id,C[n].city_code=void 0,C[n].city_custom_name=void 0,C[n].city_spelling=void 0,O(C),l&&l(C);var r={platformCode:a.platform_code,cityCode:e._id,index:n,onSuccessCallback:g};t({type:"systemCity/fetchCityGetBasicInfo",payload:r})}(e,i)},placeholder:"行政城市名称",className:k}))),s.createElement(v.Z,{span:5},s.createElement(c.Z.Item,{label:s.createElement("span",{style:{width:100}},"行政城市code")},s.createElement(E.Z,{placeholder:"行政城市code",disabled:!0,value:n.city_code}))),s.createElement(v.Z,{span:5},s.createElement(c.Z.Item,{label:s.createElement("span",{style:{width:100},className:"boss-form-item-required"},"平台城市名称")},s.createElement(E.Z,{placeholder:"平台城市名称",value:n.city_custom_name,onChange:function(t){return function(t,n){C[n].city_custom_name=t.target.value,(p().not.existy(C[n]._id)||p().empty(C[n]._id))&&(C[n]._id=void 0),(p().not.existy(C[n].city_code)||p().empty(C[n].city_code))&&(C[n].city_code=void 0),(p().not.existy(C[n].city_spelling)||p().empty(C[n].city_spelling))&&(C[n].city_spelling=void 0),e.onChange&&e.onChange(C),O(C)}(t,i)}}))),s.createElement(v.Z,{span:5},s.createElement(c.Z.Item,{label:s.createElement("span",{style:{width:100}},"平台城市代码")},s.createElement(E.Z,{disabled:!0,placeholder:"平台城市代码",value:n.city_spelling}))),s.createElement(v.Z,{span:2,style:{marginLeft:10}},s.createElement(c.Z.Item,null,o.operatDelete?s.createElement(f.Z,{title:"是否要删除当前数据",onConfirm:function(){return e=i,C.splice(e,1),void(l&&l((0,b.Z)(C)));var e}},s.createElement(r.Z,{key:"minus",shape:"circle",icon:s.createElement(_.Z,null),className:D})):"",o.operatCreate?s.createElement(r.Z,{key:"plus",shape:"circle",icon:s.createElement(h.Z,null),onClick:function(){return function(e){if(p().not.existy(C[e])||p().empty(C[e]))return Z.ZP.error("当前数据，请填写完整再添加");var t=!0;if(Object.keys(C[e]).forEach((function(n){(p().not.existy(C[e][n])||p().empty(C[e][n]))&&(t=!1)})),!1===t)return Z.ZP.error("当前数据，请填写完整再添加");C.push({}),O(C),l&&l(C)}(i)}}):"")))};return s.createElement("div",null,s.createElement("div",null,C.map((function(e,t,n){var r={operatDelete:!0};return t===n.length-1&&(r.operatCreate=!0,0===t&&(r.operatDelete=!1)),w(e,t,r)}))))},N=(n(52466),n(10642)),S=n(4942);function Y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function x(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Y(Object(n),!0).forEach((function(t){(0,S.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Y(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var F=(0,m.connect)()((function(e){var t=e.dispatch,n=e.form,a=void 0===n?{}:n,c=e.location,o=(0,s.useState)(!1),l=(0,i.Z)(o,2),m=l[0],u=l[1],y=function(){Z.ZP.success("提交成功"),u(!1),window.location.href="/#/System/City"};return s.createElement("span",{style:x({},e.style),className:e.className},s.createElement(r.Z,{type:"primary",onClick:function(){a.validateFields().then((function(){u(!0)}))}},"新增"),s.createElement(N.Z,{title:"新增确认",visible:m,onOk:function(){a.validateFields().then((function(e){if(!1===function(e){var t=!0;return p().not.existy(e)||p().empty(e)?t=!1:(e.forEach((function(e){if(p().not.existy(e)||p().empty(e))return t=!1;Object.keys(e).forEach((function(n){if(p().not.existy(e[n])||p().empty(e[n]))return t=!1}))})),t)}(e.cityList))return Z.ZP.error("城市数据不能为空");var n=c.query.id,r=x(x({},e),{},{id:n,onSuccessCallback:y});t({type:"systemCity/createCitySubmit",payload:r})}))},onCancel:function(){u(!1)}},"说明：本次提交的城市数据后期不可再进行直接修改，允许新增城市。"))}));function H(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function L(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?H(Object(n),!0).forEach((function(t){(0,S.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):H(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var B=(0,m.connect)()((function(e){var t=e.dispatch,n=e.form,a=void 0===n?{}:n,c=e.location,o=(0,s.useState)(!1),l=(0,i.Z)(o,2),m=l[0],u=l[1];return s.createElement("span",{style:L({},e.style),className:e.className},s.createElement(r.Z,{type:"primary",onClick:function(){u(!0)}},"重置"),s.createElement(N.Z,{title:"重置确认",visible:m,onOk:function(){u(!1);var e=c.query.id;t({type:"systemCity/fetchCityDetail",payload:{id:e}}),a.resetFields()},onCancel:function(){u(!1)}},"说明：本次页面调整的内容都会被重置回原来状态。"))})),M=n(89977);var q=(0,m.connect)((function(e){var t=e.systemCity.cityDetail;return{details:void 0===t?{}:t}}))((function(e){var t,n,o,m,u,d=e.dispatch,f=e.location.query.id,E=c.Z.useForm(),v=(0,i.Z)(E,1)[0];return(0,s.useEffect)((function(){d({type:"systemCity/fetchCityDetail",payload:{id:f}})}),[d,f]),s.createElement(c.Z,{form:v},(n=e.details,o=n.creator_info||{},m=n.operator_info||{},u=[s.createElement(c.Z.Item,{label:"创建人"},o.name||"--"),s.createElement(c.Z.Item,{label:"创建时间"},n.created_at?l()(n.created_at).format("YYYY-MM-DD HH:mm:ss"):"--"),s.createElement(c.Z.Item,{label:"最后更新者"},m.name||"--"),s.createElement(c.Z.Item,{label:"更新时间"},n.updated_at?l()(n.updated_at).format("YYYY-MM-DD HH:mm:ss"):"--"),s.createElement(c.Z.Item,{label:"所属场景"},n.industry_name||"--"),s.createElement(c.Z.Item,{label:"平台"},n.name||"--")],s.createElement(y.IT,null,s.createElement(y.Fp,{items:u,cols:4}))),(t=e.details.city_codes||[],s.createElement(y.IT,{title:"平台城市方案"},s.createElement("div",null,t.map((function(e,t){return function(e,t){var n=[s.createElement(c.Z.Item,{label:"行政城市名称"},e.city_name||"--"),s.createElement(c.Z.Item,{label:"行政城市code"},e.city_code||"--"),s.createElement(c.Z.Item,{label:"平台城市名称"},e.city_custom_name||"--"),s.createElement(c.Z.Item,{label:"平台城市代码"},e.city_spelling||"--")];return s.createElement("div",{key:t},s.createElement(y.Fp,{items:n,cols:4}))}(e,t)}))),s.createElement(c.Z.Item,(0,a.Z)({label:"",name:"cityList",initialValue:[{}],rules:[{validator:function(e,t){return!0===t.some((function(e){return p().not.existy(e._id)||p().empty(e._id)||p().not.existy(e.city_custom_name)||p().empty(e.city_custom_name)}))?Promise.reject(new Error("请填写完整")):Promise.resolve()}}]},{labelCol:{span:0},wrapperCol:{span:24}}),s.createElement(I,(0,a.Z)({style:{width:"100%"}},e))))),s.createElement("div",{className:M.Z["app-comp-system-operate-wrap"]},s.createElement(r.Z,{onClick:function(){window.location.href="/#/System/City"}},"返回"),s.createElement(B,(0,a.Z)({className:M.Z["app-comp-system-update-operate-btn"],form:v},e)),s.createElement(F,(0,a.Z)({className:M.Z["app-comp-system-update-operate-btn"],form:v},e))))}))},89977:function(e,t){t.Z={"app-comp-system-operate-wrap":"wR3_uLsUrJwPgLp63zst","app-comp-system-detail-back-btn-wrap":"t0hsKN8YngMdcuT5mrHN","app-comp-system-operate-btn":"hSw6MioRCdPNjHwuYDd_",bossDetailBackBtnWrap:"ujyjNcCj08JfRHzTOpnu","app-comp-system-update-operate-btn":"EBdWMNOwymGZEWdNHu9L"}}}]);