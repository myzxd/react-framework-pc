/**
 * 行政类 - 证照借用申请 - 编辑 /Oa/Document/Pages/Administration/BorrowLicense/Update
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import is from 'is_js';
import React, { useEffect } from 'react';
import moment from 'moment';
import {
  Input,
  DatePicker,
  Form,
} from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { AdministrationLicense, AdministrationLicenseType } from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';

const { TextArea } = Input;

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };

const UpdateBorrowLicense = (props) => {
  const [form] = Form.useForm();
  const { query, dispatch, borrowLicenseDetail, examineFlowInfo = [] } = props;
  useEffect(() => {
    if (query.id) {
      dispatch({ type: 'administration/fetchBorrowLicenseDetail', payload: { id: query.id } });
    }
    return () => {
      dispatch({ type: 'administration/resetBorrowLicenseDetail' });
    };
  }, [dispatch, query.id]);
  // 禁用借用日期
  const disabledStartTimeDate = (current) => {
    const day = Number(moment().format('YYYYMMDD'));
    return current && Number(moment(current).format('YYYYMMDD')) < day;
  };

  const disabledEndTimeDate = (current) => {
    const startTime = form.getFieldValue('startTime');
    const day = Number(moment().format('YYYYMMDD'));
    return current && (current < startTime ||
      Number(moment(current).format('YYYYMMDD')) < day);
  };

  const onFinish = (callbackObj) => {
    // 提交按钮参数校验
    form.validateFields().then((values) => {
      // 禁用提交按钮
      if (callbackObj.onLockHook) {
        callbackObj.onLockHook();
      }
      const payload = {
        ...values, // form数据
        id: query.id, // 编辑id
        onSuccessCallback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnlockHook,
      };
      dispatch({ type: 'administration/updateBorrowLicense', payload });
    });
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

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  // 渲染基本信息
  const renderBaseInfo = () => {
    return (
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          flowId={query.flow_id}
          accountId={dot.get(borrowLicenseDetail, 'creator_info._id', undefined)}
          departmentId={dot.get(borrowLicenseDetail, 'creator_department_info._id', undefined)}
          specialAccountId={dot.get(borrowLicenseDetail, 'cert_info.keep_account_info._id', undefined)}
        />
      </CoreContent>
    );
  };
  // 渲染证照信息
  const renderSeal = () => {
    const certInfo = dot.get(borrowLicenseDetail, 'cert_info', {});
    const formItems = [
      <Form.Item
        label="公司名称"
        {...formLayoutC3}
      >
        {dot.get(borrowLicenseDetail, 'firm_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="证照名称"
        {...formLayoutC3}
      >
        {certInfo.name ? certInfo.name : '--'}
      </Form.Item>,
      <Form.Item
        label="证照保管人"
        {...formLayoutC3}
      >
        {dot.get(certInfo, 'keep_account_info.employee_info.name', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="原件/复印件"
        {...formLayoutC3}
      >
        {borrowLicenseDetail.cert_nature ? AdministrationLicense.description(borrowLicenseDetail.cert_nature) : '--'}
      </Form.Item>,
      <Form.Item
        label="证照类型"
        {...formLayoutC3}
      >
        {borrowLicenseDetail.cert_type ? AdministrationLicenseType.description(borrowLicenseDetail.cert_type) : '--'}
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
  if (is.empty(borrowLicenseDetail)) {
    return null;
  }
  const expectFromDate = borrowLicenseDetail.expect_from_date ? moment(`${borrowLicenseDetail.expect_from_date}`) : undefined;
  const expectEndDate = borrowLicenseDetail.expect_end_date ? moment(`${borrowLicenseDetail.expect_end_date}`) : undefined;
  const initialValue = {
    startTime: expectFromDate,
    endTime: expectEndDate,
    note: dot.get(borrowLicenseDetail, 'note', undefined),
    fileList: PageUpload.getInitialValue(borrowLicenseDetail, 'asset_infos'), // 附件信息
  };
  return (
    <Form form={form} initialValues={initialValue}>
      {renderBaseInfo()}
      {renderSeal()}
      <PageFormButtons
        query={props.query}
        onUpdate={onFinish}
        showUpdate={query.id ? true : false}
      />
    </Form>
  );
};
function mapStateToProps({ administration: { borrowLicenseDetail }, oaCommon: { examineFlowInfo } }) {
  return { borrowLicenseDetail, examineFlowInfo };
}
export default connect(mapStateToProps)(UpdateBorrowLicense);
