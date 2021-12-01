/**
 * 行政类 - 印章作废申请 - 新增 /Oa/Document/Pages/Administration/InvalidSeal/Create
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, {
  useState,
} from 'react';
import {
  Input,
  Form,
} from 'antd';
import is from 'is_js';

import SealSelect from '../components/sealSelect';
import CompanySelect from '../components/companySelect';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { ApprovalDefaultParams } from '../../../../../../application/define';
import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';

const CreateInvalidSeal = ({ query = {}, dispatch }) => {
  const [sealInfo, setSealInfo] = useState();
  const [companyId, setCompanyId] = useState(undefined);
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 用章单id
  const [sealId, setSealId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  const { TextArea } = Input;
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } }; //  一行一列
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  const [form] = Form.useForm();

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'administration/updateInvalidSeal' : 'administration/createInvalidSeal';
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
      'administration/updateInvalidSeal'
      : 'administration/createInvalidSeal';

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
        ...formValues,  // 单据参数
        flowId: flowVal,
        id: sealId, // 单据id
        onSuccessCallback: res => callbackObj.callback(res, callbackObj.onSuccessCallback),
        onErrorCallback: callbackObj.onErrorCallback,
      },
    });
  };

  // 提交事务性单据回调
  const onSubmitTranRec = (res, onErrorCallback) => {
    res._id && (setSealId(res._id));
    res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
    const params = {
      _id: res.oa_application_order_id,
      onErrorCallback,
    };
    onErrorCallback();
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

  // 选择印章后，回填信息
  const onChangeSeal = (e, item) => {
    setSealInfo(item);
  };

  // 公司下拉选择
  const onCompanyChange = (val) => {
    setCompanyId(val);
    setSealInfo(null);
    form.setFieldsValue({
      sealName: undefined,
    });
  };

  // 渲染印章信息
  const renderSeal = () => {
    const formItems = [
      <Form.Item
        label="公司名称"
        name="company"
        rules={[{ required: true, message: '请选择公司名称' }]}
        {...formLayout}
      >
        <CompanySelect onChange={onCompanyChange} disabled={Boolean(orderId)} />
      </Form.Item>,
      <Form.Item
        label="印章名称"
        name="sealName"
        rules={[{ required: true, message: '请选择印章名称' }]}
        {...formLayout}
      >
        <SealSelect onChange={onChangeSeal} companyId={companyId} disabled={Boolean(orderId)} />
      </Form.Item>,
      <Form.Item label="印章保管人" {...formLayout}>
        {dot.get(sealInfo, 'keep_account_info.employee_info.name', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="废止理由"
        name="reason"
        rules={[{ required: true, message: '请输入废纸理由' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="上传附件"
        name="fileList"
        {...formLayoutC1}
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    return (
      <CoreContent title="印章信息">
        <CoreForm items={formItems} cols={1} />
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
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={flowVal} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  return (
    <Form form={form}>
      {/* 渲染审批信息 */}
      <PageBaseInfo
        form={form}
        flowId={query.flow_id}
        is_self={query.is_self}
        pageType={302}
        setFlowId={setFlowId}
        orderId={orderId}
        specialAccountId={dot.get(sealInfo, 'keep_account_info._id', undefined)}
      />

      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }
      {/* 渲染印章信息 */}
      {renderSeal()}

      {/* 渲染抄送 */}
      {renderCopyGive()}

      {/* 渲染底部按钮 */}
      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
};

export default connect()(CreateInvalidSeal);
