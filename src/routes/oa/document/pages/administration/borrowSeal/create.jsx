/**
 * 行政类 - 借章申请 - 新增 /Oa/Document/Pages/Administration/BorrowSeal/Create
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState } from 'react';
import { Input, InputNumber, DatePicker, Form } from 'antd';
import is from 'is_js';

import SealSelect from '../components/sealSelect';
import CompanySelect from '../components/companySelect';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';
import { AdministrationUseSealType, ApprovalDefaultParams } from '../../../../../../application/define';
import style from '../style.css';

const { TextArea } = Input;

const CreateUseSeal = ({ query, dispatch }) => {
  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  const { seal_type: sealType } = query;

  const [sealInfo, setSealInfo] = useState();
  const [companyId, setCompanyId] = useState(undefined);
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 借章单id
  const [sealId, setSealId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  const [form] = Form.useForm();

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'administration/updateUseSeal' : 'administration/createUseSeal';
    onSubmitTranOrder(
      type,
      {
        callback: (res, callback) => {
          onSubmitOrderRec(res, callback);
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
      'administration/updateUseSeal'
      : 'administration/createUseSeal';

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
        sealType: AdministrationUseSealType.borrow,
        onSuccessCallback: res => callbackObj.callback(res, callbackObj.onSuccessCallback),
        onErrorCallback: callbackObj.onErrorCallback,
      },
    });
  };

  // 提交事务性单据回调
  const onSubmitTranRec = (res, onErrorCallback) => {
    res._id && (setSealId(res._id));
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

  // 选择印章后，回填信息
  const onChangeSeal = (e, item) => {
    form.setFieldsValue({
      keepAccountId: dot.get(item, 'keep_account_info._id'),
    });
    setSealInfo(item);
  };

  // 预计借章时间限制
  const disabledStartDate = (current) => {
    return current && current < moment().subtract(1, 'days');
  };
  // 预计归还时间限制
  const disabledEndDate = (current) => {
    const startTime = form.getFieldValue('startTime');
    if (startTime) {
      return current && current < moment(startTime);
    }
    return current && current < moment().subtract(1, 'days');
  };
  // 选择借章时间
  const onStartTimeChange = (val) => {
    const str = moment(val).valueOf();
    const end = moment(form.getFieldValue('endTime')).valueOf();
    if (end < str) {
      form.setFieldsValue({
        endTime: null,
      });
    }
  };
  // 公司下拉选择
  const onCompanyChange = (val) => {
    setCompanyId(val);
    setSealInfo(null);
    form.setFieldsValue({
      sealName: undefined,
    });
  };

  // 渲染用章信息
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
        <SealSelect
          onChange={onChangeSeal}
          companyId={companyId}
          sealType={sealType}
          disabled={Boolean(orderId)}
        />
      </Form.Item>,
      <Form.Item label="印章保管人" name="keepAccountId" {...formLayout}>
        {dot.get(sealInfo, 'keep_account_info.name', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="预计借章时间"
        name="startTime"
        rules={[{ required: true, message: '请选择借章时间' }]}
        {...formLayoutC3}
      >
        <DatePicker style={{ width: '100%' }} disabledDate={disabledStartDate} onChange={onStartTimeChange} />
      </Form.Item>,
      <Form.Item
        label="预计归还时间"
        name="endTime"
        shouldUpdate={(prevValues, curValues) => prevValues.startTime !== curValues.startTime}
        rules={[{ required: true, message: '请选择归还时间' }]}
        {...formLayoutC3}
      >
        <DatePicker style={{ width: '100%' }} disabledDate={disabledEndDate} />
      </Form.Item>,
    ];

    const formItems3 = [
      <Form.Item
        label="用印章文件名"
        name="sealFile"
        rules={[{ required: true, message: '请输入用印章文件名' }]}
        {...formLayoutC3}
      >
        <Input />
      </Form.Item>,
      <Form.Item
        label={<span className={style['code-travel-form-required']}>用印份数</span>}
        style={{
          lineHeight: '32px',
        }}
        {...formLayoutC3}
      >
        <Form.Item
          name="formNum"
          rules={[
            { required: true, message: '请输入' },
          ]}
          style={{
            display: 'inline-block',
            marginBottom: 0,
            marginRight: 4,
          }}
        >
          <InputNumber precision={0} min={1} max={10000} style={{ width: 50 }} />
        </Form.Item>
        式
        <Form.Item
          name="fileNum"
          rules={[
            { required: true, message: '请输入' },
          ]}
          style={{
            display: 'inline-block',
            margin: '0 4px 0 4px',
          }}
        >
          <InputNumber precision={0} min={1} max={10000} style={{ width: 50 }} />
        </Form.Item>
        份
      </Form.Item>,
    ];

    const formItems4 = [
      <Form.Item label="申请事由" name="reason" rules={[{ required: true, message: '请输入事由' }]} {...formLayoutC1}>
        <TextArea rows={4} />
      </Form.Item>,
      <Form.Item label="上传附件" name="assets" {...formLayoutC1}>
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];

    return (
      <CoreContent title="借章信息">
        <CoreForm items={formItems} cols={1} />
        <CoreForm items={formItems2} />
        <CoreForm items={formItems3} />
        <CoreForm items={formItems4} cols={1} />
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

  // 表单默认值
  const initialValues = {
    fileNum: 1,
    formNum: 1,
  };
  return (
    <Form form={form} onFinish={() => { }} initialValues={initialValues}>
      {/* 渲染申请信息 */}
      <PageBaseInfo
        form={form}
        flowId={query.flow_id}
        is_self={query.is_self}
        sealType={sealType}
        pageType={309}
        setFlowId={setFlowId}
        orderId={orderId}
        specialAccountId={dot.get(sealInfo, 'keep_account_info._id', undefined)}
      />

      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }

      {/* 渲染用章信息 */}
      {renderSeal()}

      {/* 渲染抄送 */}
      {renderCopyGive()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
};

export default connect()(CreateUseSeal);
