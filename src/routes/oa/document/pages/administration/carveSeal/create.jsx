/**
 * 行政类 - 刻章申请 - 新增 /Oa/Document/Pages/Administration/CarveSeal/Create
 */
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Input, Select, Form } from 'antd';
import is from 'is_js';

import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { ApprovalDefaultParams } from '../../../../../../application/define';

import KeepingSelect from '../components/keepingSelect';
import CompanySelect from '../components/companySelect';

const { Option } = Select;
const { TextArea } = Input;

const CreateCarveSeal = ({ query, dispatch, enumeratedValue = {} }) => {
  const formLayoutC2 = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 用章单id
  const [sealId, setSealId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 印章保管人
  const [custodyId, setCustodyId] = useState(undefined);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  const [form] = Form.useForm();

  // 请求枚举列表接口
  useEffect(() => {
    dispatch({
      type: 'codeRecord/getEnumeratedValue',
      payload: {},
    });

    return () => {
      dispatch({
        type: 'codeRecord/resetEnumerateValue',
        payload: {},
      });
    };
  }, [dispatch]);

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'administration/updateCarveSeal' : 'administration/createCarveSeal';
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
      'administration/updateCarveSeal'
      : 'administration/createCarveSeal';

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

  // 印章保管人
  const onChangeKeeping = (val) => {
    setCustodyId(val);
  };

  // 渲染 印章类型 options
  const renderSealTypeOptions = () => {
    const sealTypes = enumeratedValue.seal_types || [];
    if (sealTypes.length > 0) {
      return sealTypes.map((item) => {
        return <Option value={item.value}>{item.name}</Option>;
      });
    }
    return [];
  };

  // 渲染印章刻制信息
  const renderSeal = () => {
    const formItems = [
      <Form.Item
        label="印章类型"
        name="sealType"
        rules={[{ required: true, message: '请选择印章类型' }]}
        {...formLayoutC2}
      >
        <Select style={{ width: '100%' }} placeholder="请选择">
          {renderSealTypeOptions()}
        </Select>
      </Form.Item>,
      <Form.Item
        label="公司名称"
        name="company"
        {...formLayoutC2}
        rules={[{ required: true, message: '请选择公司名称' }]}
      >
        <CompanySelect />
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="印章全称"
        name="sealName"
        rules={[{ required: true, message: '请输入印章全称' }]}
        {...formLayout}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="印章字体"
        name="sealFont"
        {...formLayoutC2}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="印章保管人"
        name="sealKeeping"
        rules={[{ required: true, message: '请选择印章保管人' }]}
        {...formLayoutC2}
      >
        <KeepingSelect disabled={Boolean(orderId)} onChange={onChangeKeeping} />
      </Form.Item>,
    ];
    const formItems4 = [
      <Form.Item
        label="申请事由"
        name="reason"
        rules={[{ required: true, message: '请输入申请事由' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="上传附件" name="assets" {...formLayoutC1}>
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    return (
      <CoreContent title="印章刻制信息">
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={formItems2} cols={1} />
        <CoreForm items={formItems3} cols={2} />
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

  return (
    <Form form={form} onFinish={() => { }}>
      <PageBaseInfo
        form={form}
        is_self={query.is_self}
        flowId={query.flow_id}
        pageType={301}
        setFlowId={setFlowId}
        orderId={orderId}
        specialAccountId={custodyId}
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
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
};

const mapStateToProps = ({
  codeRecord: { enumeratedValue },
}) => {
  return { enumeratedValue };
};


export default connect(mapStateToProps)(CreateCarveSeal);
