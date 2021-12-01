"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[1905],{41905:function(e,t,r){r.r(t),r.d(t,{default:function(){return X}});r(13062);var l=r(71230),i=(r(89032),r(15746)),s=(r(52560),r(71577)),a=(r(51838),r(48086)),o=r(29439),n=r(55609),c=r(66939),p=r(67294),u=(r(98703),r(15671)),d=r(43144),m=r(97326),f=r(60136),h=r(82963),v=r(61120),y=r(4942),g=r(96036),A=(r(9070),r(20924)),Z=(r(29093),r(16317)),C=r(93517),E=r.n(C),I=r(45697),S=r.n(I),w=r(88144),F="ZOkCVqsxiSxBVjGEpQFS",P="oAUU7Kj7lLGSFY1fvT2c",b="uZzBOU9ve5B5a4YY4dvp",x="CCglTqztMPV6chKozilQ";function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,l=(0,v.Z)(e);if(t){var i=(0,v.Z)(this).constructor;r=Reflect.construct(l,arguments,i)}else r=l.apply(this,arguments);return(0,h.Z)(this,r)}}var V=Z.Z.Option,L=A.Z.Group,D="platform",k="supplier",R="city",N="district",j="all",M="part",q=function(e){(0,f.Z)(r,e);var t=T(r);function r(e){var l;return(0,u.Z)(this,r),l=t.call(this,e),(0,y.Z)((0,m.Z)(l),"onChangeSelector",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],r=l.state.selectorAll,i=l.props,s=i.onChange,a=i.selectorType,o=null;l.setState({selectorValue:e}),a===R&&(o=t.map((function(e){return E().get(e,"props.spell",[])}))),s(a,e,r,o)})),(0,y.Z)((0,m.Z)(l),"onSelectorAll",(function(e){var t=l.state.selectorValue,r=l.props,i=r.onChange,s=r.selectorType;e===j?(l.setState({selectorAll:!0}),i(s,t,!0)):(l.setState({selectorAll:!1}),i(s,t,!1))})),(0,y.Z)((0,m.Z)(l),"renderPlatform",(function(){var e=l.props.namespace;return(0,l.props.form.getFieldDecorator)("platform",{rules:[{required:!0,message:"平台不能为空"}]})(p.createElement(w.Yg,{namespace:e,allowClear:!0,showSearch:!0,optionFilterProp:"children",placeholder:"请选择平台",onChange:l.onChangeSelector}))})),(0,y.Z)((0,m.Z)(l),"renderSupplier",(function(){var e=l.props,t=e.namespace,r=e.platforms,i=e.suppliersAll,s=l.props.form.getFieldDecorator;return p.createElement(L,{className:P},p.createElement(Z.Z,{value:l.props.supplierInput,className:b,onChange:l.onSelectorAll},p.createElement(V,{value:j},"全部"),p.createElement(V,{value:M},"自定义")),s("supplier",{rules:[{required:!0,message:"供应商不能为空"}]})(p.createElement(w.o2,{disabled:i,className:x,namespace:t,allowClear:!0,showSearch:!0,platforms:r,optionFilterProp:"children",placeholder:"请选择供应商",onChange:l.onChangeSelector})))})),(0,y.Z)((0,m.Z)(l),"renderCity",(function(){var e=l.props,t=e.namespace,r=e.platforms,i=e.suppliers,s=e.suppliersAll,a=e.citiesAll,o=l.props.form.getFieldDecorator;return p.createElement(L,{className:P},p.createElement(Z.Z,{value:l.props.cityInput,className:b,disabled:s,onChange:l.onSelectorAll},p.createElement(V,{value:j},"全部"),p.createElement(V,{value:M},"自定义")),o("city",{rules:[{required:!0,message:"城市不能为空"}]})(p.createElement(w.Wn,{namespace:t,allowClear:!0,showSearch:!0,optionFilterProp:"children",mode:"multiple",showArrow:!0,placeholder:"请选择城市",platforms:r,suppliers:i,onChange:l.onChangeSelector,isExpenseModel:!0,className:x,disabled:a})))})),(0,y.Z)((0,m.Z)(l),"renderDistrict",(function(){var e=l.props,t=e.namespace,r=e.platforms,i=e.suppliers,s=e.cities,a=e.citiesAll,o=e.districtsAll,n=l.props.form.getFieldDecorator;return p.createElement(L,{className:P},p.createElement(Z.Z,{value:l.props.districtInput,className:b,disabled:a,onChange:l.onSelectorAll},p.createElement(V,{value:j},"全部"),p.createElement(V,{value:M},"自定义")),n("districtsArray",{rules:[{required:!0,message:"商圈不能为空"}]})(p.createElement(w.Wc,{className:x,namespace:t,allowClear:!0,showSearch:!0,optionFilterProp:"children",mode:"multiple",showArrow:!0,placeholder:"请选择商圈",platforms:r,suppliers:i,cities:s,onChange:l.onChangeSelector,disabled:o})))})),l.state={selectorAll:!1,selectorValue:""},l}return(0,d.Z)(r,[{key:"render",value:function(){var e=this.props.selectorType;return e===D?this.renderPlatform():e===k?this.renderSupplier():e===R?this.renderCity():e===N?this.renderDistrict():void 0}}]),r}(p.Component);(0,y.Z)(q,"propTypes",{supplierInput:S().string,cityInput:S().string,districtInput:S().string}),(0,y.Z)(q,"defaultProps",{supplierInput:M,cityInput:M,districtInput:M});var z=(0,n.connect)((function(e){return{applicationCommon:e.applicationCommon}}))(c.Z.create()(q));function B(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,l=(0,v.Z)(e);if(t){var i=(0,v.Z)(this).constructor;r=Reflect.construct(l,arguments,i)}else r=l.apply(this,arguments);return(0,h.Z)(this,r)}}var Q="platform",K="supplier",O="city",U="district",Y=function(e){(0,f.Z)(r,e);var t=B(r);function r(){var e;return(0,u.Z)(this,r),e=t.call(this),(0,y.Z)((0,m.Z)(e),"onChange",(function(t,r){var l=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],s=e.props,a=s.form,o=s.onChangeSelectAll;t===Q&&(e.setState({platforms:r,suppliers:"",cities:"",districts:"",suppliersAll:!1,citiesAll:!1,districtsAll:!1,supplierInput:"part",cityInput:"part",districtInput:"part"}),a.setFieldsValue({platform:r,supplier:void 0,city:void 0,districtsArray:void 0})),t===K&&(e.setState({suppliers:r,cities:"",districts:""}),l?(o(1),a.setFieldsValue({supplier:"全部",city:"全部",districtsArray:"全部"}),e.setState({supplierInput:"all",cityInput:"all",districtInput:"all",suppliersAll:!0,citiesAll:!0,districtsAll:!0})):(o(4),a.setFieldsValue({supplier:void 0,city:void 0,districtsArray:void 0}),e.setState({supplierInput:"part",cityInput:"part",districtInput:"part",suppliersAll:!1,citiesAll:!1,districtsAll:!1}))),t===O&&(e.setState({cities:i,districts:""}),l?(o(2),a.setFieldsValue({city:"全部",districtsArray:"全部"}),e.setState({cityInput:"all",districtInput:"all",citiesAll:!0,districtsAll:!0})):(o(4),a.setFieldsValue({city:void 0,districtsArray:void 0}),e.setState({cityInput:"part",districtInput:"part",citiesAll:!1,districtsAll:!1}))),t===U&&(e.setState({districts:r}),l?(o(3),a.setFieldsValue({districtsArray:"全部"}),e.setState({districtInput:"all",districtsAll:!0})):(o(4),a.setFieldsValue({districtsArray:void 0}),e.setState({districtInput:"part",districtsAll:!1})))})),e.state={platforms:void 0,suppliers:void 0,cities:void 0,districts:void 0,suppliersAll:!1,citiesAll:!1,districtsAll:!1,supplierInput:"part",cityInput:"part",districtInput:"part"},e}return(0,d.Z)(r,[{key:"render",value:function(){var e=this.props.form,t=this.state,r=t.platforms,l=t.suppliers,i=t.cities,s=t.suppliersAll,a=t.citiesAll,o=t.districtsAll,n=t.cityInput,c=t.districtInput,u=t.supplierInput,d=[{label:"平台",form:e.getFieldDecorator("choice-platform",{rules:[{required:!0,message:"请选择平台"}]})(p.createElement(z,{selectorType:"platform",form:e,onChange:this.onChange}))},{label:"供应商",form:e.getFieldDecorator("choice-supplier",{rules:[{required:!0,message:"请选择供应商"}]})(p.createElement(z,{selectorType:"supplier",platforms:r,form:e,supplierInput:u,suppliersAll:s,onChange:this.onChange}))},{label:"城市",form:e.getFieldDecorator("choice-city",{rules:[{required:!a,message:"请选择城市"}]})(p.createElement(z,{selectorType:"city",form:e,platforms:r,suppliers:l,suppliersAll:s,citiesAll:a,onChange:this.onChange,cityInput:n}))},{label:"商圈",form:e.getFieldDecorator("choice-district",{rules:[{required:!o,message:"请选择商圈"}]})(p.createElement(z,{selectorType:"district",form:e,platforms:r,suppliers:l,cities:i,citiesAll:a,suppliersAll:s,districtsAll:o,onChange:this.onChange,districtInput:c}))}];return p.createElement(g.IT,{title:"选择应用范围",style:{backgroundColor:"#FAFAFA"}},p.createElement("p",{className:F},"* 选择 “全部” 表示选择该层级中的全部数据，包括现有数据以及后续增加的数据"),p.createElement(g.KP,{items:d,cols:1,layout:{labelCol:{span:8},wrapperCol:{span:8}}}))}}]),r}(p.Component),G=c.Z.create()(Y),J=(r(36037),r(47933)),_=r(80385),W=c.Z.create()((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.form,r=void 0===t?{}:t,l=function(){var e=[{label:"选择服务商",form:(0,r.getFieldDecorator)("serviceProviders",{rules:[{required:!0,message:"请选择服务商"}],initialValue:_.xL9.bodu})(p.createElement(J.ZP.Group,{name:"serviceProviders"},p.createElement(J.ZP,{value:_.xL9.bodu},_.xL9.description(_.xL9.bodu)),p.createElement(J.ZP,{disabled:!0,value:_.xL9.mengda},_.xL9.description(_.xL9.mengda)),p.createElement(J.ZP,{value:_.xL9.zhongjian},_.xL9.description(_.xL9.zhongjian)),p.createElement(J.ZP,{value:_.xL9.caixingbang},_.xL9.description(_.xL9.caixingbang))))}];return p.createElement(g.IT,{title:"个体工商户注册",style:{backgroundColor:"#FAFAFA"}},p.createElement(g.KP,{items:e,cols:1,layout:{labelCol:{span:3},wrapperCol:{span:10}}}))};return p.createElement("div",null,l())})),H=r(87418);var X=(0,n.connect)((function(e){return{applicationCommon:e.applicationCommon,systemMerchants:e.systemMerchants}}))(c.Z.create()((function(e){var t=e.history,r=e.dispatch,n=e.form,u=void 0===n?{}:n,d=(0,p.useState)(f),m=(0,o.Z)(d,2),f=m[0],h=m[1],v=function(e){h(e)},y=function(){u.validateFields((function(e,t){if(t.platform)if(t.supplier)if(t.city&&0!==t.city.length)if(t.districtsArray&&0!==t.districtsArray.length){if(!e){var l=t.platform,i=t.supplier,s=t.city,o=t.districtsArray,n=t.serviceProviders;r({type:"systemMerchants/fetchMerchantsCreate",payload:{platform:l,supplier:i,city:s,districtsArray:o,serviceProviders:n,allSelectorLevel:f}})}}else a.ZP.error("商圈不能为空");else a.ZP.error("城市不能为空");else a.ZP.error("供应商不能为空");else a.ZP.error("平台不能为空")}))},g=function(){u.resetFields(),t.push("/System/Merchants")};return p.createElement(c.Z,{layout:"horizontal",form:u},p.createElement(G,{onChangeSelectAll:v,form:u}),p.createElement(W,{form:u}),p.createElement(l.Z,null,p.createElement(i.Z,{span:8,offset:8,className:H.Z["app-comp-white-list-create-operate-wrap"]},p.createElement(s.Z,{type:"default",onClick:g},"取消"),p.createElement(s.Z,{type:"primary",htmlType:"submit",onClick:y},"新增"))))})))},87418:function(e,t){t.Z={"app-comp-white-list-create-operate-wrap":"rtSxIUrJ725gauTsVZrA","app-comp-white-list-detail-workbench-wrap":"TipM8KQ3cY11RfdPmDSf","app-comp-white-list-detail-workbench-item":"DytVLCOvY_5FvznQB5xd","app-comp-white-list-detail-join-team-info-title":"j8C2D1rCuTFKRtlRVVR9","app-comp-white-list-detail-join-team-info-item":"UwETPjzFJdflpfQyv7M7","app-comp-white-list-detail-join-team-info-label":"ESd4TCwQ4PSaYMPQzFLu","app-comp-white-list-detail-join-team-info-value":"IeWpLgv_9_C3jsFHiPMf","app-comp-white-list-detail-back-wrap":"j0sT57fAoy7m14vw6DdO","app-comp-white-list-detail-item":"EIRxw_4tSsUiJPH17lFQ","app-comp-white-list-operate-item":"tlIfvzjzxdZQulN12l2s","app-comp-white-list-operate-add":"QMM6Kr1cJtduNZytgAg0","app-comp-white-list-update-operate-wrap":"VhIGNbIFUIvk0rZa70BD"}}}]);