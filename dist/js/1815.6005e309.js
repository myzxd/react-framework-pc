"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[1815],{41815:function(e,r,t){t.r(r);t(52560);var n=t(71577),a=(t(51838),t(48086)),o=t(15671),c=t(43144),i=t(97326),l=t(60136),p=t(82963),u=t(61120),s=t(4942),f=t(55609),d=t(67294),m=t(45697),v=t.n(m),y=t(66939),O=(t(98703),t(98519)),Z=t(66437),b=t(80385),h=t(53132);function k(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function x(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?k(Object(t),!0).forEach((function(r){(0,s.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):k(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function C(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=(0,u.Z)(e);if(r){var a=(0,u.Z)(this).constructor;t=Reflect.construct(n,arguments,a)}else t=n.apply(this,arguments);return(0,p.Z)(this,t)}}var E=function(e){(0,l.Z)(t,e);var r=C(t);function t(e){var c;return(0,o.Z)(this,t),c=r.call(this,e),(0,s.Z)((0,i.Z)(c),"onSave",(function(e){e.preventDefault(),c.onSubmit({onSuccessCallback:c.onCreateSuccessCallback,onFailureCallback:c.onFailureCallback})})),(0,s.Z)((0,i.Z)(c),"onNext",(function(e){e.preventDefault(),c.onSubmit({onSuccessCallback:c.onBack,onFailureCallback:c.onFailureCallback})})),(0,s.Z)((0,i.Z)(c),"onFailureCallback",(function(e){e&&e.zh_message&&a.ZP.error(e.zh_message)})),(0,s.Z)((0,i.Z)(c),"onBack",(function(){var e=c.props,r=e.history,t=e.location.query.applicationOrderId;r.push("/Expense/Manage/ExamineOrder/Form?orderId=".concat(t))})),(0,s.Z)((0,i.Z)(c),"onCreateSuccessCallback",(function(e){c.shouldUpdate+=1;var r=e.record,t=(r=void 0===r?{_id:""}:r)._id;t&&c.setState({overTimeId:t})})),(0,s.Z)((0,i.Z)(c),"onSubmit",(function(e){var r=c.props,t=r.form,n=r.dispatch,a=r.location,o=c.state.overTimeId,i=a.query.applicationOrderId;t.validateFields((function(r,t){if(!r){var a=x(x(x({},t),e),{},{orderId:i,overTimeId:o});o||c.shouldUpdate>=2?n({type:"expenseOverTime/updateOverTime",payload:a}):c.props.dispatch({type:"expenseOverTime/createOverTime",payload:a})}}))})),(0,s.Z)((0,i.Z)(c),"renderOprations",(function(){return d.createElement("div",{className:h.Z["app-comp-overTime-create-operate-wrap"]},d.createElement(n.Z,{type:"primary",onClick:c.onSave},"保存"),d.createElement(n.Z,{type:"primary",onClick:c.onNext,className:h.Z["app-comp-overTime-create-operate-next"]},"下一步"))})),c.state={overTimeId:""},c.shouldUpdate=1,c}return(0,c.Z)(t,[{key:"componentDidMount",value:function(){var e=this.props;(0,e.dispatch)({type:"expenseExamineOrder/fetchExamineOrderDetail",payload:{id:e.location.query.applicationOrderId,flag:!0}})}},{key:"render",value:function(){var e=this.props,r=e.form,t=e.examineOrderDetail,n=t.applyAccountInfo,a=(n=void 0===n?{name:void 0}:n).name,o=t.flowInfo,c=(o=void 0===o?{name:void 0}:o).name;return d.createElement("div",null,d.createElement(O.Z,{applyPerson:a,approvalType:b.ZBL.overTime,approvalFlow:c}),d.createElement(Z.T,{form:r}),d.createElement(Z.f,{form:r}),this.renderOprations())}}]),t}(d.Component);(0,s.Z)(E,"propTypes",{form:v().object.isRequired,examineOrderDetail:v().object}),(0,s.Z)(E,"defaultProps",{examineOrderDetail:{}}),r.default=(0,f.connect)((function(e){return{examineOrderDetail:e.expenseExamineOrder.examineOrderDetail}}))(y.Z.create()(E))}}]);