"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[8514],{28514:function(e,t,n){n.r(t),n.d(t,{default:function(){return $}});n(20186);var a=n(75385),r=(n(52560),n(71577)),o=(n(55295),n(69713)),c=n(71002),i=(n(51838),n(48086)),s=n(15671),l=n(43144),u=n(97326),p=n(60136),d=n(82963),f=n(61120),h=n(4942),m=n(94315),y=n.n(m),Z=n(93517),g=n.n(Z),v=n(30381),b=n.n(v),x=n(45697),k=n.n(x),C=n(55609),w=n(44654),D=n(67294),E=n(96036),S=n(80385),R=n(97116),P=n(45430),M=(n(52466),n(10642)),N=(n(36616),n(51368)),O=n(66939);n(98703);function H(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,d.Z)(this,n)}}var Y=function(e){(0,p.Z)(n,e);var t=H(n);function n(){var e;return(0,s.Z)(this,n),e=t.call(this),(0,h.Z)((0,u.Z)(e),"onCancel",(function(){var t=e.props,n=t.onCancel;(0,t.form.resetFields)(),n&&n()})),(0,h.Z)((0,u.Z)(e),"onSuccessCallback",(function(e){window.location.href="/#/Expense/Manage/ExamineOrder/Form?orderId=".concat(e.application_order_id)})),(0,h.Z)((0,u.Z)(e),"onSubmit",(function(){var t=e.props,n=t.form,a=t.dispatch;(0,n.validateFields)((function(t,n){if(!t){var r={id:e.props.contractId,pledge:"close_pledge",returnpledgemoney:100*n.returnpledgemoney};a({type:"expenseHouseContract/createApprovalSheet",payload:{params:r,onSuccessCallback:e.onSuccessCallback}}),e.onCancel()}}))})),(0,h.Z)((0,u.Z)(e),"renderModal",(function(){var t=e.props,n=t.isShowRefundDeposit,a=t.form,r=t.unrefundedPledgeMoney,o=[{label:"退回押金",form:(0,a.getFieldDecorator)("returnpledgemoney",{initialValue:S.fbc.exchangePriceToYuan(r),rules:[{required:!0,message:"请填写正确金额"}]})(D.createElement(N.Z,{min:0,max:S.fbc.exchangePriceToYuan(r),formatter:S.fbc.limitDecimals,parser:S.fbc.limitDecimals}))}];return D.createElement(M.Z,{title:"退押金信息",visible:n,onOk:e.onSubmit,onCancel:e.onCancel,okText:"确认",cancelText:"取消"},D.createElement(O.Z,{layout:"horizontal"},D.createElement(E.KP,{items:o,cols:1,layout:{labelCol:{span:12},wrapperCol:{span:12}}})))})),(0,h.Z)((0,u.Z)(e),"render",(function(){return e.renderModal()})),e.state={},e}return n}(D.Component);(0,h.Z)(Y,"propTypes",{form:k().object,isShowRefundDeposit:k().bool,onCancel:k().func,dispatch:k().func,contractId:k().string,unrefundedPledgeMoney:k().number}),(0,h.Z)(Y,"defaultProps",{form:{},isShowRefundDeposit:!1,onCancel:function(){},dispatch:function(){},contractId:"",unrefundedPledgeMoney:0});var I=O.Z.create()(Y),j=(n(9070),n(20924)),z=(n(54071),n(14072)),T=(n(29093),n(16317)),F=n(88144);function B(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function A(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?B(Object(n),!0).forEach((function(t){(0,h.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):B(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var U=z.Z.MonthPicker,V=O.Z.create()((function(e){var t,n=e.form,a=e.visible,r=e.value,o=e.dispatch,c=void 0===o?function(){}:o,s=e.onCancelModal,l=void 0===s?function(){}:s,u=n.getFieldDecorator,p=function(){n.validateFields((function(e,t){if(!e){var n=A(A(A({},r),t),{},{onSuccessCallback:function(){return i.ZP.success("请求成功"),void(l&&l())},onFailureCallback:function(){return l()}});c({type:"expenseHouseContract/exportHouseLedger",payload:n})}}))},d=function(){l&&l()},f=function(e){return e&&e>b()().endOf("day")};return t=[{label:"台账导出时间",form:u("exportDate",{rules:[{required:!0,message:"请选择导出时间"}]})(D.createElement(U,{format:"YYYY-MM",disabledDate:f}))}],D.createElement(M.Z,{title:"房屋台账导出",visible:a,onOk:p,onCancel:d,okText:"确认",cancelText:"取消"},D.createElement(E.KP,{items:t,cols:1,layout:{labelCol:{span:8},wrapperCol:{span:8}}}))}));function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function q(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach((function(t){(0,h.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function K(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,d.Z)(this,n)}}var L=T.Z.Option,W=z.Z.RangePicker,J=function(e){(0,p.Z)(n,e);var t=K(n);function n(e){var a;return(0,s.Z)(this,n),a=t.call(this,e),(0,h.Z)((0,u.Z)(a),"onHookForm",(function(e){a.setState({form:e})})),(0,h.Z)((0,u.Z)(a),"onReset",(function(){var e=a.state.onSearch,t={state:void 0,contractnum:void 0,houseNumber:void 0};a.setState({search:t}),e&&e(t)})),(0,h.Z)((0,u.Z)(a),"onDealWith",(function(e){var t=e.startTime,n=e.endTime,a=e.contractnum,r=e.state,o=e.houseNumber,c=g().has(t,"0")?b()(t[0]).format("YYYYMMDD"):"",i=g().has(t,"1")?b()(t[1]).format("YYYYMMDD"):"",s=g().has(n,"0")?b()(n[0]).format("YYYYMMDD"):"",l=g().has(n,"1")?b()(n[1]).format("YYYYMMDD"):"";return q(q({},e),{},{contractnum:a,state:r,houseNumber:o,startBeforeTime:c,startAfterTime:i,endBeforeTime:s,endAfterTime:l})})),(0,h.Z)((0,u.Z)(a),"onSearch",(function(e){var t=a.state.onSearch,n=a.onDealWith(e);t&&t(n)})),(0,h.Z)((0,u.Z)(a),"onShowModal",(function(){a.state.form.validateFields((function(e,t){if(!e){var n=q({},a.onDealWith(t));a.setState({exportValue:n,visible:!0})}}))})),(0,h.Z)((0,u.Z)(a),"onCancelModal",(function(){a.setState({visible:!1})})),(0,h.Z)((0,u.Z)(a),"renderModal",(function(){var e=a.state,t=e.visible,n=e.exportValue,r=a.props.dispatch;return t?D.createElement(V,{visible:t,value:n,dispatch:r,onCancelModal:a.onCancelModal}):null})),(0,h.Z)((0,u.Z)(a),"render",(function(){var e="",t=a.state.search,n=t.contractnum,o=t.state,c=t.houseNumber;P.ZP.canOperateExpenseManageHouseLedgerExport()&&(e=D.createElement(r.Z,{type:"primary",onClick:a.onShowModal},"导出台账"));var i={items:[{label:"房屋编号",form:function(e){return e.getFieldDecorator("houseNumber",{initialValue:c})(D.createElement(j.Z,{placeholder:"请输入房屋编号"}))}},{label:"合同编号",form:function(e){return e.getFieldDecorator("contractnum",{initialValue:n})(D.createElement(j.Z,{placeholder:"请输入合同编号"}))}},{label:"执行状态",form:function(e){return e.getFieldDecorator("state",{initialValue:o})(D.createElement(T.Z,{allowClear:!0,placeholder:"请选择合同状态"},D.createElement(L,{value:"".concat(S.hRz.pendding)},S.hRz.description(S.hRz.pendding)),D.createElement(L,{value:"".concat(S.hRz.verifying)},S.hRz.description(S.hRz.verifying)),D.createElement(L,{value:"".concat(S.hRz.processing)},S.hRz.description(S.hRz.processing)),D.createElement(L,{value:"".concat(S.hRz.done)},S.hRz.description(S.hRz.done))))}},{label:"合同开始时间",form:function(e){return e.getFieldDecorator("startTime",{initialValue:null})(D.createElement(W,{format:"YYYY-MM-DD"}))}},{label:"合同结束时间",form:function(e){return e.getFieldDecorator("endTime",{initialValue:null})(D.createElement(W,{format:"YYYY-MM-DD"}))}}],isExpenseModel:!0,onReset:a.onReset,onSearch:a.onSearch,onHookForm:a.onHookForm,operations:e};return D.createElement(E.IT,null,D.createElement(F.p8,i),a.renderModal())})),a.state={form:void 0,visible:!1,exportValue:{},search:{state:void 0,contractnum:void 0,houseNumber:void 0},onSearch:e.onSearch},a}return n}(D.Component),Q=n(67955);function G(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=(0,f.Z)(e);if(t){var r=(0,f.Z)(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return(0,d.Z)(this,n)}}var X=function(e){(0,p.Z)(n,e);var t=G(n);function n(e){var l;return(0,s.Z)(this,n),l=t.call(this,e),(0,h.Z)((0,u.Z)(l),"onSearch",(function(e){var t=l.props.dispatch;l.private.searchParams=e,l.private.searchParams.page||(l.private.searchParams.page=1),l.private.searchParams.limit||(l.private.searchParams.limit=30),t({type:"expenseHouseContract/fetchHouseContracts",payload:l.private.searchParams})})),(0,h.Z)((0,u.Z)(l),"onChangePage",(function(e,t){l.private.searchParams.page=e,l.private.searchParams.limit=t,l.onSearch(l.private.searchParams)})),(0,h.Z)((0,u.Z)(l),"onShowSizeChange",(function(e,t){l.private.searchParams.page=e,l.private.searchParams.limit=t,l.onSearch(l.private.searchParams)})),(0,h.Z)((0,u.Z)(l),"onSuccessRenewCallback",(function(e){window.location.href="/#/Expense/Manage/House/Update?id=".concat(e.record._id,"&isCreateRenew=1")})),(0,h.Z)((0,u.Z)(l),"onFailureCallback",(function(e){i.ZP.error(e.zh_message)})),(0,h.Z)((0,u.Z)(l),"onNewrent",(function(e){void 0!==e.id&&(window.location.href="/#/Expense/Manage/House/Apply?id=".concat(e.id))})),(0,h.Z)((0,u.Z)(l),"onImplement",(function(e){(0,l.props.dispatch)({type:"expenseHouseContract/createInitApplicationOrder",payload:{params:{id:e.id},onSuccessCallback:l.onUpdateStart}})})),(0,h.Z)((0,u.Z)(l),"onDeleteCallback",(function(){(0,l.props.dispatch)({type:"expenseHouseContract/fetchHouseContracts"})})),(0,h.Z)((0,u.Z)(l),"onDelete",(function(e){if(e.state===S.hRz.processing)return i.ZP.error("执行中的合同不允许删除");(0,l.props.dispatch)({type:"expenseHouseContract/fetchHouseContractDelete",payload:{params:{id:e.id},onSuccessCallback:l.onDeleteCallback,onFailureCallback:function(){}}})})),(0,h.Z)((0,u.Z)(l),"onUpdateStart",(function(){(0,l.props.dispatch)({type:"expenseHouseContract/fetchHouseContracts"})})),(0,h.Z)((0,u.Z)(l),"onRenew",(function(e){(0,l.props.dispatch)({type:"expenseHouseContract/fetchHouseRenew",payload:{params:{id:e},onSuccessCallback:l.onSuccessRenewCallback,onFailureCallback:l.onFailureCallback}})})),(0,h.Z)((0,u.Z)(l),"onRefundDeposit",(function(e){l.setState({contractId:e.id,unrefundedPledgeMoney:e.unrefundedPledgeMoney,isShowRefundDeposit:!0})})),(0,h.Z)((0,u.Z)(l),"onCancleRefundDeposit",(function(){l.setState({isShowRefundDeposit:!1})})),(0,h.Z)((0,u.Z)(l),"onHousingInfo",(function(){window.location.href="/#/Expense/Manage/House/Create"})),(0,h.Z)((0,u.Z)(l),"reduceName",(function(e){return e.reduce((function(e,t,n){return 0===n?t:"".concat(e,", ").concat(t)}),"")})),(0,h.Z)((0,u.Z)(l),"renderBizDistrictNames",(function(e){if(!e||"object"===(0,c.Z)(e)&&Array===e.constructor&&0===e.length)return"--";var t=l.reduceName(e);return t.length<=7?t:D.createElement(o.Z,{title:t},D.createElement("span",null,"".concat(t.slice(0,7),"...")))})),(0,h.Z)((0,u.Z)(l),"renderSearch",(function(){var e=(0,u.Z)(l).onSearch,t=l.props.dispatch;return D.createElement(J,{onSearch:e,dispatch:t})})),(0,h.Z)((0,u.Z)(l),"renderRefundDeposit",(function(){var e=l.state,t=e.isShowRefundDeposit,n=e.contractId,a=e.unrefundedPledgeMoney,r=l.props.dispatch;return D.createElement(I,{onCancel:l.onCancleRefundDeposit,isShowRefundDeposit:t,unrefundedPledgeMoney:a,contractId:n,dispatch:r})})),(0,h.Z)((0,u.Z)(l),"renderTable",(function(){var e=l.private.searchParams,t=e.page,n=e.limit,o=R.vc.isHideExpenseEntrance,c=void 0!==o&&o,i=l.props.houseContractData,s=void 0===i?{}:i,u=g().get(s,"data",[]),p=g().get(s,"meta.count",0),d=[{title:"房屋编号",dataIndex:"houseNo",key:"houseNo",fixed:"left",width:135,render:function(e){return e||"--"}},{title:"合同编号",dataIndex:"id",key:"id",fixed:"left",width:135,render:function(e){return D.createElement("div",{className:Q.Z["app-comp-expense-house-contract-list-coding"]},e)}},{title:"平台",dataIndex:"platformNames",key:"platformNames",width:100,render:function(e){return y().empty(e)||y().not.existy(e)||y().not.array(e)?"--":e.join(" , ")}},{title:"供应商",dataIndex:"supplierNames",key:"supplierNames",width:120,render:function(e){return y().empty(e)||y().not.existy(e)||y().not.array(e)?"--":e.join(" , ")}},{title:"城市",dataIndex:"cityNames",key:"cityNames",width:100,render:function(e){return y().empty(e)||y().not.existy(e)||y().not.array(e)?"--":e.join(" , ")}},{title:"商圈",dataIndex:"bizDistrictNames",key:"bizDistrictNames",width:120,render:l.renderBizDistrictNames},{title:"合同租期",dataIndex:"contractStartDate",key:"contractStartDate",width:100,render:function(e,t){var n=t.contractEndDate;if(e&&n){var a="".concat(String(e).slice(0,4),"-").concat(String(e).slice(4,6),"-").concat(String(e).slice(6,8)),r="".concat(String(n).slice(0,4),"-").concat(String(n).slice(4,6),"-").concat(String(n).slice(6,8));return"".concat(a,"-").concat(r)}return"--"}},{title:"月租金（元）",dataIndex:"monthMoney",key:"monthMoney",width:100,render:function(e){return S.fbc.exchangePriceToYuan(e)}},{title:"押金（元）",dataIndex:"pledgeMoney",key:"pledgeMoney",width:100,render:function(e){return e?S.fbc.exchangePriceToYuan(e):0}},{title:"未退押金（元）",dataIndex:"unrefundedPledgeMoney",key:"unrefundedPledgeMoney",width:150,render:function(e){return e?S.fbc.exchangePriceToYuan(e):0}},{title:"创建人",dataIndex:["creatorInfo","name"],key:"creatorInfo.name",width:80,render:function(e){return e||"--"}},{title:"创建时间",dataIndex:"createdAt",key:"createdAt",width:140,render:function(e){return e?b()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"最新操作人",dataIndex:["operatorInfo","name"],key:"operatorInfo.name",width:100,render:function(e){return e||"--"}},{title:"更新时间",dataIndex:"updatedAt",key:"updatedAt",width:140,render:function(e){return e?b()(e).format("YYYY-MM-DD HH:mm:ss"):"--"}},{title:"执行状态",dataIndex:"state",key:"state",width:100,render:function(e){return S.hRz.description(e)}},{title:"操作",key:"key",fixed:"right",width:110,render:function(e,t){var n,a,r,o,i=t.state,s=t.id,u=t.fromContractId,p=t.firstRentCycle,d=void 0===p?[]:p,f=[];!0===(0,P.j2)()&&(n=D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"5",href:"/#/Expense/Manage/House/WithdrawalUpdate?id=".concat(s)},"退租"),a=D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"renew",onClick:function(){l.onRenew(s)}},"续签"),r=D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"deposit",onClick:function(){l.onRefundDeposit(t)}},"退押金"),o=D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"delete",onClick:function(){l.onDelete(t)}},"删除"));var h=!0===(0,P.j2)()&&2===d.length?D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"4",href:"/#/Expense/Manage/House/RenewalUpdate?id=".concat(s)},"续租"):null,m=D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"6",href:"/#/Expense/Manage/House/BrokRentUpdate?id=".concat(s)},"断租");switch(i){case S.hRz.pendding:t.migrateFlag?f.push(D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"2",onClick:function(){l.onImplement(t)}},"执行")):!c&&f.push(D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"1",onClick:function(){l.onNewrent(t)}},"新租")),f.push(D.createElement(w.Link,{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"10",to:{pathname:"/Expense/Manage/House/Update",query:{id:t.id}}},"编辑")),f.push(o);break;case S.hRz.processing:f.push(D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"7",target:"_blank",rel:"noopener noreferrer",href:"/#/Expense/Manage/House/Detail?id=".concat(t.id)},"查看")),f.push(D.createElement(w.Link,{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"12",to:{pathname:"/Expense/Manage/House/Update",query:{id:t.id}}},"编辑")),!c&&f.push(h),!c&&f.push(n),!c&&f.push(m),!c&&f.push(a),!c&&f.push(r),f.push(o);break;case S.hRz.verifying:!c&&f.push(D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"8",onClick:function(){l.onNewrent(t)}},"新租")),f.push(D.createElement(w.Link,{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"11",to:{pathname:"/Expense/Manage/House/Update",query:{id:t.id}}},"编辑")),f.push(o);break;default:f.push(D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"9",target:"_blank",rel:"noopener noreferrer",href:"/#/Expense/Manage/House/Detail?id=".concat(t.id)},"查看"))}return!0===(0,P.j2)()&&i===S.hRz.pendding&&u&&(f=[D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"renewExpense",href:"/#/Expense/Manage/House/Apply?id=".concat(t.id)},"续签"),D.createElement(w.Link,{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"updateRenew",to:{pathname:"/Expense/Manage/House/Update",query:{id:t.id,isCreateRenew:1}}},"编辑"),D.createElement("a",{className:Q.Z["app-comp-expense-house-contract-list-operation"],key:"deleteRenew",onClick:function(){l.onDelete(t)}},"删除")],c&&f.shift()),D.createElement("span",null,f)}}],f={showSizeChanger:!0,showQuickJumper:!0,pageSize:n||30,onShowSizeChange:l.onShowSizeChange,total:p,showTotal:function(e){return"总共".concat(e,"条")},pageSizeOptions:["10","20","30","40"],onChange:l.onChangePage};t&&(f.current=t);var h=c?"":D.createElement(r.Z,{onClick:l.onHousingInfo,className:Q.Z["app-comp-expense-house-contract-list-operation-create"]},"新增房屋信息");return D.createElement(E.IT,{title:"合同列表",titleExt:h},D.createElement(a.Z,{columns:d,pagination:f,rowKey:function(e,t){return t},scroll:{x:1830,y:400},dataSource:u,bordered:!0}))})),l.state={contractId:void 0,isShowRefundDeposit:!1,unrefundedPledgeMoney:void 0},l.private={searchParams:{}},l}return(0,l.Z)(n,[{key:"componentDidMount",value:function(){(0,this.props.dispatch)({type:"expenseHouseContract/fetchHouseContracts"})}},{key:"render",value:function(){return D.createElement("div",null,this.renderSearch(),this.renderTable(),this.renderRefundDeposit())}}]),n}(D.Component);(0,h.Z)(X,"propTypes",{houseContractData:k().object}),(0,h.Z)(X,"defaultProps",{houseContractData:{}});var $=(0,C.connect)((function(e){return{houseContractData:e.expenseHouseContract.houseContractData}}))(X)},67955:function(e,t){t.Z={"app-comp-expense-house-contract-create":"g8gD3K5rsywmRmGPEbuZ","app-comp-expense-house-contract-update":"bDjNVxNasBal4zNTKeQi","app-comp-expense-house-contract-list-operation":"NJctQmnYbcJ1vo4whsG_","app-comp-expense-house-contract-list-coding":"reXHvSqxK682_Dy25Xvk","app-comp-expense-house-contract-list-operation-create":"kMnUTgiV8aPemDtlyAAj"}}}]);