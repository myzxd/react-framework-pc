/**
 * 行政类 - 印章作废申请 - 编辑 /Oa/Document/Pages/Administration/InvalidSeal/Update
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import React, {
  useEffect,
} from 'react';
import {
  Input,
  Form,
} from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import ExamineFlow from '../../../components/form/flow';

const UpdateInvalidSeal = ({ dispatch, query, invalidSealDetail, examineFlowInfo = [] }) => {
  useEffect(() => {
    dispatch({ type: 'administration/fetchInvalidSealDetail', payload: { id: query.id } });
    return () => { dispatch({ type: 'administration/resetInvalidSealDetail' }); };
  }, [dispatch, query]);

  const { TextArea } = Input;

  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  const [form] = Form.useForm();

  const sealInfo = dot.get(invalidSealDetail, 'seal_info', {});
  const keepAccountInfoDetail = dot.get(sealInfo, 'keep_account_info.employee_info', {});
  const companyInfo = dot.get(invalidSealDetail, 'firm_info', {});

  // 提交（编辑）
  const onUpdate = async (callbackObj) => {
    const { id } = query;
    const res = await form.validateFields();
    // 禁用提交按钮
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type: 'administration/updateInvalidSeal',
      payload: {
        id,
        ...res,
        company: dot.get(companyInfo, '_id', undefined),
        sealName: dot.get(sealInfo, '_id', undefined),
        onSuccessCallback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnlockHook,
      },
    });
  };

  // 渲染印章信息
  const renderSeal = () => {
    if (is.empty(invalidSealDetail)) {
      return null;
    }

    const formItems = [
      <Form.Item
        label="公司名称"
        name="company"
        {...formLayout}
      >
        {dot.get(companyInfo, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="印章名称"
        name="sealName"
        initialValue={dot.get(sealInfo, '_id', undefined)}
        rules={[{ required: true, message: '请选择印章名称' }]}
        {...formLayout}
      >
        {dot.get(sealInfo, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="印章保管人"
        {...formLayout}
      >
        {dot.get(keepAccountInfoDetail, 'name', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="废止理由"
        name="reason"
        initialValue={dot.get(invalidSealDetail, 'note', undefined)}
        rules={[{ required: true, message: '请输入废纸理由' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} />
      </Form.Item>,
      <Form.Item
        label="上传附件"
        name="fileList"
        initialValue={PageUpload.getInitialValue(invalidSealDetail, 'asset_infos')}
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

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form}>
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          flowId={query.flow_id}
          isDetail
          departmentId={dot.get(invalidSealDetail, 'creator_department_info._id', undefined)}
          accountId={dot.get(invalidSealDetail, 'creator_info._id', undefined)}
          specialAccountId={dot.get(sealInfo, 'keep_account_info._id', undefined)}
        />
      </CoreContent>

      {/* 渲染印章信息 */}
      {renderSeal()}

      {/* 渲染底部按钮 */}
      <PageFormButtons
        query={query}
        onUpdate={onUpdate}
        showUpdate={query.id ? true : false}
      />
    </Form>
  );
};
function mapPropsToState({ administration: { invalidSealDetail }, oaCommon: { examineFlowInfo } }) {
  return { invalidSealDetail, examineFlowInfo };
}
export default connect(mapPropsToState)(UpdateInvalidSeal);
