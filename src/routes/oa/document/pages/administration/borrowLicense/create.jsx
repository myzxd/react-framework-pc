/**
 * 行政类 - 证照借用申请 - 新增 /Oa/Document/Pages/Administration/BorrowLicense/Create
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useState } from 'react';
import moment from 'moment';
import {
  Input,
  DatePicker,
  Form,
} from 'antd';
import is from 'is_js';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { AdministrationLicense, AdministrationLicenseType, ApprovalDefaultParams } from '../../../../../../application/define';
import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';
import CompanySelect from '../components/companySelect';
import ComponentLicense from '../components/license';

const { TextArea } = Input;

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };   // 一行三列
const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };   // 一行一列

const CreateBorrowLicense = (props) => {
  const { dispatch, query = {} } = props;
  const [form] = Form.useForm();
  // 证照保管人信息
  const [keepAccountInfo, setKeepAccountInfo] = useState({});
  // 证照类型
  const [licenseType, setLicenseType] = useState(undefined);
  // 公司
  const [companyId, setCompanyId] = useState(undefined);

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  // 禁用借用日期
  const disabledStartTimeDate = (current) => {
    return current && current < moment().subtract(1, 'days');
  };

  // 禁用归还日期
  const disabledEndTimeDate = (current) => {
    const startTime = form.getFieldValue('startTime');
    if (startTime) {
      return current && current < moment(startTime);
    }
    return current && current < moment().subtract(1, 'days');
  };

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'administration/updateBorrowLicense' : 'administration/createBorrowLicense';
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
      'administration/updateBorrowLicense'
      : 'administration/createBorrowLicense';

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
        id: transacId, // 单据id
        license: Number(query.seal_borrow_type), // 证照
        licenseType, // 证照类型
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

  // 公司变更
  const onChangeCompany = (val) => {
    setCompanyId(val);
    form.setFieldsValue({
      licenseName: undefined,
    });
    setKeepAccountInfo(null);
  };

  // 证照保管人
  const onChangeAccountInfo = (val, info) => {
    setKeepAccountInfo(info.keep_account_info);
    setLicenseType(info.origin);
  };

  // 预计借用时间
  const onChangeStartTime = (val) => {
    const str = moment(val).valueOf();
    const end = moment(form.getFieldValue('endTime')).valueOf();
    if (end < str) {
      form.setFieldsValue({
        endTime: null,
      });
    }
  };

  // 渲染证照信息
  const renderSeal = () => {
    const formItems = [
      <Form.Item
        label="公司名称"
        name="companyName"
        rules={[{ required: true, message: '请选择公司' }]}
        {...formLayoutC3}
      >
        <CompanySelect onChange={onChangeCompany} disabled={Boolean(orderId)} />
      </Form.Item>,
      <Form.Item
        label="证照名称"
        name="licenseName"
        rules={[{ required: true, message: '请选择证照' }]}
        {...formLayoutC3}
      >
        <ComponentLicense
          onChange={onChangeAccountInfo}
          companyId={companyId}
          license={Number(query.seal_borrow_type)}
          disabled={Boolean(orderId)}
        />
      </Form.Item>,
      <Form.Item
        label="证照保管人"
        {...formLayoutC3}
      >
        {dot.get(keepAccountInfo, 'name', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="原件/复印件"
        rules={[{ required: true, message: '请选择' }]}
        {...formLayoutC3}
      >
        {query.seal_borrow_type ? AdministrationLicense.description(query.seal_borrow_type) : '--'}
      </Form.Item>,
      <Form.Item
        label="证照类型"
        rules={[{ required: true, message: '请选择' }]}
        {...formLayoutC3}
      >
        {licenseType ? AdministrationLicenseType.description(licenseType) : '--'}
      </Form.Item>,
    ];

    const formItems3 = [
      <Form.Item
        label="预计借用时间"
        name="startTime"
        rules={[{ required: true, message: '请选择' }]}
        {...formLayoutC3}
      >
        <DatePicker showToday={false} onChange={onChangeStartTime} disabledDate={disabledStartTimeDate} />
      </Form.Item>,
      <Form.Item
        label="预计归还时间"
        name="endTime"
        rules={[{ required: true, message: '请选择' }]}
        {...formLayoutC3}
      >
        <DatePicker showToday={false} disabledDate={disabledEndTimeDate} />
      </Form.Item>,
    ];
    const formItems4 = [
      <Form.Item
        label="申请事由"
        name="note"
        rules={[{ required: true, message: '请输入' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} />
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
      <CoreContent title="证照信息">
        <CoreForm items={formItems} />
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
        wrapperCol={{ span: 22 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
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
      <PageBaseInfo
        form={form}
        flowId={query.flow_id}
        is_self={query.is_self}
        pageType={306}
        setFlowId={setFlowId}
        borrowType={Number(query.seal_borrow_type)}
        orderId={orderId}
        specialAccountId={dot.get(keepAccountInfo, '_id')}
      />
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }
      {renderSeal()}
      {/* 渲染抄送 */}
      {renderCopyGive()}
      <PageFormButtons
        query={props.query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
};

export default connect()(CreateBorrowLicense);
