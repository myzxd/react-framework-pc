/**
 * 其他 - 事务签呈 - 创建&编辑
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import is from 'is_js';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import {
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  PageBaseInfo,
  ComponentRelatedApproval,
} from '../../../components/index';
import { authorize } from '../../../../../../application';
import { ApprovalDefaultParams } from '../../../../../../application/define';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 10 } };
const { TextArea } = Input;

function PageAbnormalDetail({ dispatch, query = {}, signDetail }) {
  const flag = query.id;
  const [form] = Form.useForm();

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  useEffect(() => {
    if (query.id) {
      dispatch({
        type: 'oaOther/fetchSignDetail',
        payload: {
          id: query.id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'oaOther/reduceSignDetail',
        payload: {},
      });
    };
  }, [dispatch, query.id]);

    // 编辑时设置value值
  useEffect(() => {
    const formValues = {
        // 文件编号
      documentNumber: dot.get(signDetail, 'document_number', undefined),
        // 主题
      theme: dot.get(signDetail, 'theme', undefined),
        // 事由及说明
      note: dot.get(signDetail, 'note', undefined),
        // 附件
      fileList: PageUpload.getInitialValue(signDetail, 'asset_infos'),
    };
    form.setFieldsValue(formValues);
  }, [form, signDetail]);

  // 完成
  const onFinish = (params = {}) => {
    form.validateFields().then((values) => {
      // 锁定按钮
      if (params.onLockHook) {
        params.onLockHook();
      }
      const payload = {
        ...values, // form数据
        ...params, // 额外的参数
        flag: params.flag ? params.flag : flag, // 判断是否是编辑
        flowId: orderId ? undefined : params.flowId, // updateSign不需要flowId
      };
      dispatch({ type: 'oaOther/updateSign', payload });
    });
  };

    // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      flowId: flowVal,
      flag: orderId,
      id: transacId,
      onSuccessCallback: res => onSubmitOrderRec(res, onDoneHook, onUnlockHook),
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
    // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    dispatch({
      type: 'oaCommon/submitOrder',
      payload: {
        ...values,
        id: oId,
        // 判断是否是创建，创建提示提示语
        isOa: orderId ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      },
    });
  };

  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ id, values, oId, onDoneHook, onErrorCallback }) => {
   // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if ((is.empty(parentIds) || flag)) {
    // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
    dispatch({
      type: 'humanResource/fetchApproval',
      payload: {
        id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      },
    });
  };

  // 新建页保存操作
  const onSave = ({ onSaveHook, onUnsaveHook }) => {
    onFinish({
      flag: orderId ? orderId : undefined,
      flowId: flowVal,
      id: transacId,
      onSuccessCallback: res => onSubmitTranRec(res, onUnsaveHook),
      onErrorCallback: onUnsaveHook,
      onLockHook: onSaveHook,
    });
  };

  // 提交事务性单据回调
  const onSubmitTranRec = (res, onErrorCallback) => {
    res._id && (setTransacId(res._id));
    res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
    const params = {
      id: res.oa_application_order_id,
      onErrorCallback,
    };
    onCreateSuccess(params);
    onErrorCallback && onErrorCallback();
  };

  // 提交审批单
  const onSubmitOrderRec = async (res, callback, onErrorCallback) => {
    const formValues = await form.validateFields();
    const params = {
      id: res.oa_application_order_id,
      values: formValues,
      oId: res.oa_application_order_id,
      onDoneHook: callback,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 更新单据到服务器(编辑保存)
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      id: query.id,
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 签呈内容
  const renderContent = () => {
    const formItems = [
      <Form.Item
        label="文件编号"
        name="documentNumber"
      >
        <Input placeholder="例：集团人资【2020】第6号" />
      </Form.Item>,
      <Form.Item
        label="主题"
        name="theme"
        rules={[{ required: true, message: '请输入主题' }]}
      >
        <Input placeholder="请输入主题" />
      </Form.Item>,
      <Form.Item
        label="说明"
        name="note"
        rules={[{ required: true, message: '请填写说明' }]}
      >
        <TextArea rows={4} placeholder="请输入说明" />
      </Form.Item>,
    ];
    return (
      <CoreContent title="签呈内容">
        <CoreForm items={formItems} cols={1} />
      </CoreContent>
    );
  };

    // 附件
  const renderPageUpload = () => {
    const formItems = [
      <Form.Item
        label="附件"
        name="fileList"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 抄送人
  const renderCopyGive = () => {
    if (flag) return null;
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={flowVal} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 部门id
  const useDepartmentId = flag ?
    dot.get(signDetail, 'creator_department_info._id', undefined)
  : dot.get(query, 'department_id', undefined);

  // 人员id
  const useAccountId = flag ?
    dot.get(signDetail, 'creator_info._id', undefined)
  : authorize.account.id;

  // 渲染关联审批组件
  const renderComponentRelatedApproval = () => {
    // 如果是创建页面显示 关联审批和主题标签
    // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
    if (flag) {
      return (<React.Fragment />);
    }
    return <ComponentRelatedApproval setParentIds={setParentIds} />;
  };

  return (
    <Form {...formLayout} form={form}>
      {/* 审批信息 */}
      <PageBaseInfo
        form={form}
        pageType={501}
        setFlowId={setFlowId}
        departmentId={useDepartmentId}
        accountId={useAccountId}
        isDetail={flag ? true : false}
        is_self={query.is_self}
        flowId={query.flow_id}
        orderId={orderId}
      />

      {/* 渲染关联审批组件 */}
      {renderComponentRelatedApproval()}
      {/* 签呈内容 */}
      {renderContent()}

      {/* 附件 */}
      {renderPageUpload()}

      {/* 渲染抄送 */}
      {renderCopyGive()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate={flag ? true : false}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onSave={onSave}
      />
    </Form>
  );
}

function mapStateToProps({ oaOther: { signDetail } }) {
  return { signDetail };
}
export default connect(mapStateToProps)(PageAbnormalDetail);
