/**
 * 行政类 - 借章申请 - 编辑 /Oa/Document/Pages/Administration/BorrowSeal/Update
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';

import { Input, InputNumber, DatePicker, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';

import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import ExamineFlow from '../../../components/form/flow';
import style from '../style.css';

const { TextArea } = Input;

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

const UpdateUseSeal = ({ useSealDetail, dispatch, query, examineFlowInfo = [] }) => {
  const [keepingInfoState, setKeepingInfoState] = useState(null);
  const [companyInfoState, setCompanyInfoState] = useState(null);
  const [sealInfoState, setSealInfoState] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({ type: 'administration/fetchUseSealDetail', payload: { id: query.id } });

    // 清空页面详情数据（componentWillUnmount）
    return () => {
      dispatch({ type: 'administration/resetUseSealDetail' });
    };
  }, []);

  useEffect(() => {
    setKeepingInfoState(dot.get(useSealDetail, 'keep_account_info.employee_info', {}));
    setCompanyInfoState(dot.get(useSealDetail, 'firm_info', {}));
    setSealInfoState(dot.get(useSealDetail, 'seal_info', {}));
  }, [useSealDetail._id]);

  // 提交（编辑）
  const onUpdate = async (callbackObj) => {
    const { id } = query;
    const res = await form.validateFields();
    // 禁用提交按钮
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type: 'administration/updateUseSeal',
      payload: {
        id,
        ...res,
        sealName: sealInfoState._id,
        company: companyInfoState._id,
        keepAccountId: keepingInfoState._id,
        onSuccessCallback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnlockHook,
      },
    });
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

  // 渲染用章信息
  const renderSeal = () => {
    if (!useSealDetail._id) {
      return null;
    }
    const formItems = [
      <Form.Item
        label="公司名称"
        {...formLayout}
      >
        {dot.get(companyInfoState, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="印章名称"
        {...formLayout}
      >
        {dot.get(sealInfoState, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="印章保管人"
        {...formLayout}
      >
        {dot.get(keepingInfoState, 'name', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="预计借章时间"
        name="startTime"
        initialValue={useSealDetail.expect_from_date ? moment(useSealDetail.expect_from_date, 'YYYY-MM-DD') : undefined}
        rules={[{ required: true, message: '请选择借章时间' }]}
        {...formLayoutC3}
      >
        <DatePicker style={{ width: '100%' }} placeholder="请选择" format="YYYY-MM-DD" disabledDate={disabledStartDate} onChange={onStartTimeChange} />
      </Form.Item>,
      <Form.Item
        label="预计归还时间"
        name="endTime"
        initialValue={useSealDetail.expect_end_date ? moment(useSealDetail.expect_end_date, 'YYYY-MM-DD') : undefined}
        rules={[{ required: true, message: '请选择归还时间' }]}
        {...formLayoutC3}
      >
        <DatePicker style={{ width: '100%' }} placeholder="请选择" format="YYYY-MM-DD" disabledDate={disabledEndDate} />
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="用印章文件名"
        name="sealFile"
        initialValue={dot.get(useSealDetail, 'file_name', undefined)}
        rules={[{ required: true, message: '请输入用印章文件名' }]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
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
          initialValue={dot.get(useSealDetail, 'form_num', 1)}
          rules={[{ required: true, message: '请输入' }]}
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
          rules={[{ required: true, message: '请输入' }]}
          initialValue={dot.get(useSealDetail, 'use_num', 1)}
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
      <Form.Item label="申请事由" name="reason" {...formLayoutC1} rules={[{ required: true, message: '请输入事由' }]} initialValue={dot.get(useSealDetail, 'note', undefined)}>
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="上传附件" name="assets" initialValue={PageUpload.getInitialValue(useSealDetail, 'asset_infos')} {...formLayoutC1}>
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

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form} onFinish={() => { }}>
      {/* 渲染申请信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          flowId={query.flow_id}
          accountId={dot.get(useSealDetail, 'creator_info._id', undefined)}
          departmentId={dot.get(useSealDetail, 'creator_department_info._id', undefined)}
          specialAccountId={dot.get(useSealDetail, 'keep_account_info._id', undefined)}
        />
      </CoreContent>

      {/* 渲染用章信息 */}
      {renderSeal()}

      {/* 渲染表单按钮 */}
      <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
    </Form>
  );
};
function mapPropsToState({ administration: { useSealDetail }, oaCommon: { examineFlowInfo } }) {
  return { useSealDetail, examineFlowInfo };
}

export default connect(mapPropsToState)(UpdateUseSeal);
