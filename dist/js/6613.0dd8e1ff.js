"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[6613],{36613:function(e,t,n){n.r(t);n(52560);var r=n(71577),a=(n(36037),n(47933)),o=(n(51838),n(48086)),l=n(4942),c=n(15861),u=(n(35668),n(86585)),s=n(29439),i=(n(29093),n(16317)),d=n(87757),m=n.n(d),p=n(55609),f=n(67294),y=n(96036),Z=n(80385),E=n(45430);function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(Object(n),!0).forEach((function(t){(0,l.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var v=i.Z.Option;t.default=(0,p.connect)((function(e){return{codePaymentRule:e.codeFlow.codePaymentRule}}))((function(e){var t=e.dispatch,n=e.codePaymentRule,l=void 0===n?{}:n,d=u.Z.useForm(),p=(0,s.Z)(d,1)[0],w=(0,f.useState)(!1),P=(0,s.Z)(w,2),_=P[0],j=P[1],O=(0,f.useState)(!1),g=(0,s.Z)(O,2),h=g[0],F=g[1];(0,f.useEffect)((function(){return t({type:"codeFlow/getCodePaymentRule",payload:{}}),function(){t({type:"codeFlow/resetCodePaymentRule"})}}),[t]);var k=function(){var e=(0,c.Z)(m().mark((function e(){var n,r;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.validateFields();case 2:return n=e.sent,F(!0),e.next=6,t({type:"codeFlow/onUpdatePaymentRule",payload:b({},n)});case 6:if((r=e.sent)&&r._id&&(j(!1),t({type:"codeFlow/getCodePaymentRule",payload:{}})),F(!1),!r||!r.zh_message){e.next=11;break}return e.abrupt("return",o.ZP.error(r.zh_message));case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return f.createElement(f.Fragment,null,function(){if(!_){var e=l.allow_update_money,t=void 0!==e&&e,n=l.cost_update_rule,r=void 0===n?Z.E_Z.down:n,a=[f.createElement(u.Z.Item,{label:"付款节点是否允许调整金额"},t?"是":"否")];return t&&(a[a.length]=f.createElement(u.Z.Item,{label:"调整规则"},r?Z.E_Z.description(r):"--")),f.createElement(u.Z,{className:"affairs-flow-basic"},f.createElement(y.Fp,{items:a,cols:3}))}}(),function(){if(_){var e=l.allow_update_money,t=void 0!==e&&e,n=l.cost_update_rule,r=void 0===n?Z.E_Z.down:n,o=[f.createElement(u.Z.Item,{label:"付款节点是否允许调整金额",name:"isAdjustment"},f.createElement(a.ZP.Group,null,f.createElement(a.ZP.Button,{value:!0},"是"),f.createElement(a.ZP.Button,{value:!1},"否"))),f.createElement(u.Z.Item,{key:"adjust_way_wrap",shouldUpdate:function(e,t){return e.isAdjustment!==t.isAdjustment}},(function(e){if((0,e.getFieldValue)("isAdjustment"))return f.createElement(u.Z.Item,{name:"adjustWay",label:"调整规则",rules:[{required:!0,message:"请选择"}]},f.createElement(i.Z,{placeholder:"请选择",allowClear:!0},f.createElement(v,{value:Z.E_Z.down},Z.E_Z.description(Z.E_Z.down))))}))],c={isAdjustment:t,adjustWay:r||Z.E_Z.down};return f.createElement(u.Z,{form:p,className:"affairs-flow-basic",initialValues:c},f.createElement(y.Fp,{items:o,cols:3}))}}(),E.ZP.canOperateCodePaymentRuleUpdate()?f.createElement("div",{style:{textAlign:"center"}},_?f.createElement(r.Z,{onClick:k,type:"primary",loading:h},"保存"):f.createElement(r.Z,{onClick:function(){return j(!0)},type:"primary"},"编辑")):"")}))}}]);