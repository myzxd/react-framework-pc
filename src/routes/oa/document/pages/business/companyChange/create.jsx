/**
 * 财商类 - 公司变更 - 创建
 */
 import React, { useState, useEffect } from 'react';
 import dot from 'dot-prop';
 import moment from 'moment';
 import { connect } from 'dva';
 import { Input, Select, Form } from 'antd';
 import is from 'is_js';

 import { CoreContent, CoreForm } from '../../../../../../components/core';
 import { CommonModalCopyGive } from '../../../../../../components/common';
 import { BusinessCompanyChangeType, BusinessCompanyType, Unit, ApprovalDefaultParams } from '../../../../../../application/define';
 import {
  PageBaseInfo,
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';
 import { PageCompanySelect } from '../common/index';

 const { Option } = Select;
 const { TextArea } = Input;
 const customizeNamespace = 'companyhChange';

 function CompanyhChangeCreate(props) {
   const { dispatch, companySelectInfo, query } = props;
   const [form] = Form.useForm();
   const [companyName, setCompanyName] = useState(undefined); // 获取公司名称
   const [companyInfo, setCompanyInfo] = useState({}); // 获取公司信息
  // 审批单id
   const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
   const [transacId, setTransacId] = useState(undefined);
  // 审批流id
   const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
   const [parentIds, setParentIds] = useState([]);
  // 筛选公司信息
   useEffect(() => {
     dot.get(companySelectInfo, `${customizeNamespace}.data`, []).map((company) => {
       if (company._id === companyName) {
         return setCompanyInfo(company);
       }
     });
   }, [companySelectInfo, companyName]);

  // 提交操作
   const onSubmit = (callbackObj) => {
     const type = orderId ? 'business/updateBusinessFirmModifyOrder' : 'business/createBusinessFirmModifyOrder';
     onSubmitTranOrder(
      type,
       {
         callback: (res, callback) => {
           onSubmitOrderRec(res, callback, callbackObj.onUnlockHook);
         },
         onErrorCallback: callbackObj.onUnlockHook,
         onSuccessCallback: callbackObj.onDoneHook,
         onLockHook: callbackObj.onLockHook,
       },
    );
   };

      // 审批单关联成功
   const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
        // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
     if (is.not.existy(values)) return;
     dispatch({ type: 'oaCommon/submitOrder',
       payload: {
         ...values,
         id: oId,
         // 判断是否是创建，创建提示提示语
         isOa: orderId ? false : true,
         onSuccessCallback: onDoneHook,
         onErrorCallback,
       } });
   };

      // 创建成功后调用关联审批单接口
   const onCreateSuccess = ({ _id, values, oId, onDoneHook, onErrorCallback }) => {
        // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
     if (is.empty(parentIds)) {
          // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
       if (values) {
         onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
       }
       return;
     }
        // 关联审批接口
     dispatch({ type: 'humanResource/fetchApproval',
       payload: {
         id: _id,
         ids: parentIds,        // 查询搜索后要关联的审批单id
         type: ApprovalDefaultParams.add, // 增加
         onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
         onErrorCallback,
       } });
   };

  // 保存操作
   const onSave = (callbackObj) => {
    // 根据单据提交状态调用对应接口
     const type = orderId ?
      'business/updateBusinessFirmModifyOrder'
      : 'business/createBusinessFirmModifyOrder';

     onSubmitTranOrder(
      type,
       {
         callback: (res) => {
           onSubmitTranRec(res, callbackObj.onUnsaveHook);
         },
         onErrorCallback: callbackObj.onUnsaveHook,
         onLockHook: callbackObj.onSaveHook,
       },
    );
   };

  // 提交事务性单据
   const onSubmitTranOrder = async (type, callbackObj) => {
     const formValues = await form.validateFields();
     if (callbackObj.onLockHook) {
       callbackObj.onLockHook();
     }
     dispatch({
       type,
       payload: {
         ...companyInfo,
         ...formValues,  // 单据参数
         type: 30,
         flowId: flowVal,
         id: transacId, // 单据id
         onSuccessCallback: res => callbackObj.callback(res, callbackObj.onSuccessCallback),
         onErrorCallback: callbackObj.onErrorCallback,
       },
     });
   };

  // 提交事务性单据回调
   const onSubmitTranRec = (res, onErrorCallback) => {
     res._id && (setTransacId(res._id));
     res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
     onErrorCallback();
     const params = {
       _id: res.oa_application_order_id,
       onErrorCallback,
     };
     onCreateSuccess(params);
   };

  // 提交审批单回调
   const onSubmitOrderRec = async (res, callback, onErrorCallback) => {
     const formValues = await form.validateFields();
     const params = {
       _id: res.oa_application_order_id,
       values: formValues,
       oId: res.oa_application_order_id,
       onDoneHook: callback,
       onErrorCallback,
     };
     onCreateSuccess(params);
   };

  // 更改公司名称
   const onCompanySelect = (value) => {
     setCompanyName(value);
   };

  // 渲染表单
   const renderFrom = function () {
     const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
     const formLayoutC1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
     const formItems = [
       <Form.Item
         label="公司名称"
         name="companyName"
         rules={[{ required: true, message: '请选择公司名称' }]}
         {...formLayoutC3}
       >
         <PageCompanySelect
           placeholder="请选择公司名称"
           customizeNamespace={customizeNamespace}
           onChange={onCompanySelect}
         />
       </Form.Item >,
       <Form.Item
         label="法人代表"
         {...formLayoutC3}
       >
         {dot.get(companyInfo, 'legal_name', '--')}
       </Form.Item >,
       <Form.Item
         label="注册资本"
         {...formLayoutC3}
       >
         {dot.get(companyInfo, 'registered_capital') >= 0 ? <span>{`${Unit.exchangePriceToWanYuan(dot.get(companyInfo, 'registered_capital'))}万元`}</span> : '--'}
       </Form.Item >,
       <Form.Item
         label="注册时间"
         {...formLayoutC3}
       >
         {dot.get(companyInfo, 'registered_date') ? moment(`${dot.get(companyInfo, 'registered_date')}`).format('YYYY-MM-DD') : '--'}
       </Form.Item >,
       <Form.Item
         label="注册地址"
         {...formLayoutC3}
       >
         {dot.get(companyInfo, 'registered_addr', '--')}
       </Form.Item >,
       <Form.Item
         label="公司性质"
         {...formLayoutC3}
       >
         {dot.get(companyInfo, 'firm_type') ? BusinessCompanyType.description(dot.get(companyInfo, 'firm_type')) : '--'}
       </Form.Item >,
       <Form.Item
         label="股东信息"
         {...formLayoutC3}
       >
         {dot.get(companyInfo, 'share_holder_info', '--')}
       </Form.Item >,
     ];

     const formItems2 = [
       <Form.Item
         label="变更类型"
         name="modifyType"
         rules={[{ required: true, message: '请选择变更类型' }]}
         {...formLayoutC1}
       >
         <Select placeholder="请选择变更类型" style={{ width: '100%' }} allowClear showArrow mode="multiple" >
           <Option value={BusinessCompanyChangeType.name}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.name)}</Option>
           <Option value={BusinessCompanyChangeType.guardianship}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.guardianship)}</Option>
           <Option value={BusinessCompanyChangeType.monitoring}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.monitoring)}</Option>
           <Option value={BusinessCompanyChangeType.shareholders}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.shareholders)}</Option>
           <Option value={BusinessCompanyChangeType.capital}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.capital)}</Option>
           <Option value={BusinessCompanyChangeType.address}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.address)}</Option>
           <Option value={BusinessCompanyChangeType.scope}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.scope)}</Option>
           <Option value={BusinessCompanyChangeType.other}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.other)}</Option>
         </Select>
       </Form.Item >,
       <Form.Item
         label="变更内容"
         name="content"
         rules={[{ required: true, message: '请输入变更内容' }]}
         {...formLayoutC1}
       >
         <TextArea placeholder="请输入变更内容" />
       </Form.Item >,
       <Form.Item
         label="申请原因及说明"
         name="note"
         rules={[{ required: true, message: '请输入申请原因及说明' }]}
         {...formLayoutC1}
       >
         <TextArea rows={4} placeholder="请输入申请原因及说明" />
       </Form.Item >,
       <Form.Item
         label="上传附件"
         name="fileList"
         {...formLayoutC1}
       >
         <PageUpload domain="oa_approval" />
       </Form.Item >,
     ];
     return (
       <CoreContent title="公司变更信息">
         <CoreForm items={formItems} cols={2} />
         <CoreForm items={formItems2} cols={1} />
       </CoreContent>
     );
   };

  // 抄送人
   const renderCopyGive = () => {
     const formItems = [
       <Form.Item
         label="抄送人"
         name="copyGive"
         labelCol={{ span: 3 }}
         wrapperCol={{ span: 21 }}
       >
         <CommonModalCopyGive flowId={flowVal} />
       </Form.Item>,
       <Form.Item
         label="固定抄送"
         labelCol={{ span: 3 }}
         wrapperCol={{ span: 21 }}
       >
         <FixedCopyGiveDisplay flowId={flowVal} />
       </Form.Item>,
     ];
     return (
       <CoreForm items={formItems} cols={1} />
     );
   };
   return (
     <Form layout="horizontal" form={form}>
       {/* 渲染基础信息 */}
       <PageBaseInfo
         is_self={query.is_self}
         form={form}
         flowId={query.flow_id}
         pageType={402}
         setFlowId={setFlowId}
         orderId={orderId}
       />
       {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
         <ComponentRelatedApproval setParentIds={setParentIds} />
         }
       {/* 渲染表单 */}
       {renderFrom()}

       {/* 渲染抄送 */}
       {renderCopyGive()}

       {/* 渲染表单按钮 */}
       <PageFormButtons
         query={props.query}
         onSubmit={onSubmit}
         onSave={onSave}
       />
     </Form>
   );
 }


 const mapStateToProps = ({ business: { companySelectInfo } }) => {
   return { companySelectInfo };
 };

 export default connect(mapStateToProps)(CompanyhChangeCreate);
