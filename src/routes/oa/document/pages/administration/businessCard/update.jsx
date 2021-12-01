/**
 * 行政类 - 名片申请 - 编辑 /Oa/Document/Pages/Administration/Business/Update
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, {
  useEffect,
} from 'react';
import {
  Input,
  InputNumber,
  DatePicker,
  Form,
} from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import ExamineFlow from '../../../components/form/flow';

const UpdateBusinessCard = (props) => {
  const { businessCardDetail, dispatch, query, examineFlowInfo = [] } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({
      type: 'administration/fetchBusinessCardDetail',
      payload: {
        id: query.id,
      },
    });
    return () => { dispatch({ type: 'administration/resetBusinessCardDetail' }); };
  }, [dispatch, query]);
  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

  // 提交（编辑）
  const onUpdate = async (callbackObj) => {
    const { id } = query;
    const res = await form.validateFields();
    // 禁用提交按钮
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type: 'administration/updateBusinessCard',
      payload: {
        id,
        ...res,
        onSuccessCallback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnlockHook,
      },
    });
  };

  // 不可选的需求时间
  const disabledDate = (current) => {
    return current && current < moment().subtract(1, 'days');
  };

  // 渲染申请信息
  const renderApplyInfo = () => {
    if (!businessCardDetail._id) {
      return null;
    }
    const personInfo = {
      departmentName: dot.get(businessCardDetail, 'department_info.name', '--'),
      departmentId: dot.get(businessCardDetail, 'department_info._id', '--'),
      jobName: dot.get(businessCardDetail, 'job_info.name', '--'),
      jobId: dot.get(businessCardDetail, 'job_info._id', '--'),
    };
    const formItems = [
      <Form.Item
        label="实际申请人"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'order_employee_info.name', undefined)}
      </Form.Item>,
      <Form.Item
        label="部门"
        {...formLayoutC3}
      >
        {dot.get(personInfo, 'departmentName', '--')}
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayoutC3}
      >
        {dot.get(personInfo, 'jobName', '--')}
      </Form.Item>,
      <Form.Item
        label="名片职务职称"
        name="jobTitle"
        initialValue={dot.get(businessCardDetail, 'official', undefined)}
        rules={[{ required: true, message: '请输入名片职务职称' }]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="名片姓名"
        name="cardName"
        initialValue={dot.get(businessCardDetail, 'name', undefined)}
        rules={[{ required: true, message: '请输入名片姓名' }]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="英文名"
        name="nameEn"
        initialValue={dot.get(businessCardDetail, 'en_name', undefined)}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="手机"
        name="phone"
        initialValue={dot.get(businessCardDetail, 'phone', undefined)}
        rules={[{ required: true, message: '请输入手机号码' },
          () => ({
            validator(rule, value) {
              const reg = new RegExp('^[1][3,4,5,7,8,9][0-9]{9}$');
              if (!value || reg.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('请输入正确的手机号');
            },
          }),
        ]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="电子邮箱"
        name="email"
        initialValue={dot.get(businessCardDetail, 'email', undefined)}
        rules={[{ required: true, message: '请输入邮箱' },
          () => ({
            validator(rule, value) {
              const reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@[-a-z0-9\\.]+\\.[a-z0-9]+$');
              if (!value || reg.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('请输入正确的邮箱');
            },
          }),
        ]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="QQ"
        name="qq"
        initialValue={dot.get(businessCardDetail, 'qq', undefined)}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="公司网址"
        name="website"
        initialValue={dot.get(businessCardDetail, 'company_url', undefined)}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="办公地址"
        name="address"
        initialValue={dot.get(businessCardDetail, 'address', undefined)}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="申请数量(盒)"
        name="num"
        initialValue={dot.get(businessCardDetail, 'apply_num', undefined)}
        rules={[{ required: true, message: '请输入申请盒数' }]}
        {...formLayoutC3}
      >
        <InputNumber placeholder="请输入" min={1} max={10000} />
      </Form.Item>,
      <Form.Item
        label="需求时间"
        name="time"
        initialValue={businessCardDetail.demand_date ? moment(`${businessCardDetail.demand_date}`) : undefined}
        rules={[{ required: true, message: '请输入需求时间' }]}
        {...formLayoutC3}
      >
        <DatePicker placeholder="请选择" style={{ width: '100%' }} disabledDate={disabledDate} />
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="上传附件"
            name="fileList"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
            initialValue={PageUpload.getInitialValue(businessCardDetail, 'asset_infos')}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
          </Form.Item>
        ),
      },
    ];
    return (
      <CoreContent title="申请信息">
        <CoreForm items={formItems} />
      </CoreContent>
    );
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form} >
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          flowId={query.flow_id}
          isDetail
          accountId={dot.get(businessCardDetail, 'order_account_info._id', undefined)}
          departmentId={dot.get(businessCardDetail, 'creator_department_info._id', undefined)}
          specialAccountId={dot.get(businessCardDetail, 'order_account_info._id', undefined)}
        />
      </CoreContent>

      {renderApplyInfo()}

      {/* 渲染底部按钮 */}
      <PageFormButtons
        query={query}
        onUpdate={onUpdate}
        showUpdate
      />
    </Form>
  );
};
function mapPropsToState({ administration: { businessCardDetail }, oaCommon: { examineFlowInfo } }) {
  return { businessCardDetail, examineFlowInfo };
}
export default connect(mapPropsToState)(UpdateBusinessCard);
