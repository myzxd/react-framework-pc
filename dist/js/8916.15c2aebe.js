"use strict";(self.webpackChunkaoaoBoss=self.webpackChunkaoaoBoss||[]).push([[8916],{38916:function(e,t,a){a.r(t);a(13062);var n=a(71230),i=(a(89032),a(15746)),r=(a(52560),a(71577)),l=(a(36037),a(47933)),o=a(87462),s=a(15861),p=(a(35668),a(86585)),c=a(29439),m=a(87757),u=a.n(m),d=a(94315),f=a.n(d),v=a(93517),h=a.n(v),w=a(55609),y=a(67294),Z=(a(98703),a(96036)),E=a(80385),b=a(87418);t.default=(0,w.connect)((function(e){var t=e.systemMerchants.detailData;return{data:void 0===t?{}:t}}))((function(e){var t=e.location,a=e.dispatch,m=e.history,d=e.data,v=void 0===d?{}:d,w=t.query.id,x=p.Z.useForm(),g=(0,c.Z)(x,1)[0];(0,y.useEffect)((function(){void 0!==w&&a({type:"systemMerchants/fetchMerchantsDetail",payload:{id:w}})}),[w]),(0,y.useEffect)((function(){v&&g.setFieldsValue({serviceProviders:h().get(v,"individual_source",void 0)})}),[v]);var F=function(){m.push("/System/Merchants"),g.resetFields()},P=function(){var e=(0,s.Z)(u().mark((function e(){var t,n;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.validateFields();case 2:t=e.sent,n=t.serviceProviders,a({type:"systemMerchants/updateMerchants",payload:{params:{serviceProviders:n,id:w}}});case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();console.log(h().get(v,"individual_source"));var L,C,I,j;return y.createElement(p.Z,{layout:"horizontal",form:g},(I={labelCol:{span:2},wrapperCol:{span:20}},j=[y.createElement(p.Z.Item,(0,o.Z)({label:"平台"},I),y.createElement("span",null,h().get(v,"platform_name","--"))),y.createElement(p.Z.Item,(0,o.Z)({label:"供应商"},I),y.createElement("span",null,h().get(v,"supplier_name")||"全部")),y.createElement(p.Z.Item,(0,o.Z)({label:"城市"},I),y.createElement("span",null,(C=h().get(v,"city_list",[]),f().not.existy(C)||f().empty(C)||f().not.array(C)?"全部":C.map((function(e){return e.city_name})).join(" , ")))),y.createElement(p.Z.Item,(0,o.Z)({label:"商圈"},I),y.createElement("span",null,(L=h().get(v,"biz_district_list",[]),f().not.existy(L)||f().empty(L)||f().not.array(L)?"全部":L.map((function(e){return e.name})).join(" , "))))],y.createElement(Z.IT,{title:"选择应用范围"},y.createElement(Z.Fp,{items:j,cols:1}))),function(){var e=[y.createElement(p.Z.Item,(0,o.Z)({label:"选择服务商",name:"serviceProviders",rules:[{required:!0,message:"请选择服务商"}]},t),y.createElement(l.ZP.Group,{name:"serviceProviders"},y.createElement(l.ZP,{value:E.xL9.bodu},E.xL9.description(E.xL9.bodu)),y.createElement(l.ZP,{disabled:!0,value:E.xL9.mengda},E.xL9.description(E.xL9.mengda)),y.createElement(l.ZP,{value:E.xL9.zhongjian},E.xL9.description(E.xL9.zhongjian)),y.createElement(l.ZP,{value:E.xL9.caixingbang},E.xL9.description(E.xL9.caixingbang))))],t={labelCol:{span:3},wrapperCol:{span:10}};return y.createElement(Z.IT,{title:"个体工商户注册",style:{backgroundColor:"#FAFAFA"}},y.createElement(Z.Fp,{items:e,cols:1,layout:t}))}(),y.createElement(n.Z,null,y.createElement(i.Z,{span:8,offset:8,className:b.Z["app-comp-white-list-update-operate-wrap"]},y.createElement(r.Z,{type:"default",onClick:F},"取消"),y.createElement(r.Z,{type:"primary",htmlType:"submit",onClick:P},"保存"))))}))},87418:function(e,t){t.Z={"app-comp-white-list-create-operate-wrap":"rtSxIUrJ725gauTsVZrA","app-comp-white-list-detail-workbench-wrap":"TipM8KQ3cY11RfdPmDSf","app-comp-white-list-detail-workbench-item":"DytVLCOvY_5FvznQB5xd","app-comp-white-list-detail-join-team-info-title":"j8C2D1rCuTFKRtlRVVR9","app-comp-white-list-detail-join-team-info-item":"UwETPjzFJdflpfQyv7M7","app-comp-white-list-detail-join-team-info-label":"ESd4TCwQ4PSaYMPQzFLu","app-comp-white-list-detail-join-team-info-value":"IeWpLgv_9_C3jsFHiPMf","app-comp-white-list-detail-back-wrap":"j0sT57fAoy7m14vw6DdO","app-comp-white-list-detail-item":"EIRxw_4tSsUiJPH17lFQ","app-comp-white-list-operate-item":"tlIfvzjzxdZQulN12l2s","app-comp-white-list-operate-add":"QMM6Kr1cJtduNZytgAg0","app-comp-white-list-update-operate-wrap":"VhIGNbIFUIvk0rZa70BD"}}}]);