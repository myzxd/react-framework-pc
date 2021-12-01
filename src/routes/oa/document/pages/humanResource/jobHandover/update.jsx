/**
 * 人事类 - 工作交接 - 编辑
 */
import React, { useEffect, useState } from 'react';
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { Form, Input, Select, DatePicker, Alert } from 'antd';
import { connect } from 'dva';
import { authorize } from '../../../../../../application';

import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import EmployeesSelect from './components/employeesSelect';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import {
  OaApplicationJobHandoverType,
} from '../../../../../../application/define';
import {
  showPlainText,
  showDate,
} from '../../../../../../application/utils';
import ExamineFlow from '../../../components/form/flow';
import RelatedJobHandoverOrder from './components/relatedJobHandoverOrder';

// 表单布局
const FormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const { Option } = Select;

// 只能选择本月及以后的日期
const disabledDate = (date) => {
  return date.isBefore(moment(), 'month');
};

function JobHandoverUpdate({
  query = {}, fetchData, clearData, dataSource = {}, update,
  examineFlowInfo = [],
}) {
  const { id } = query;
  const [form] = Form.useForm();
  const { id: ownerId } = authorize.account;

  // 加载详情数据
  useEffect(() => {
    fetchData(id);
    return () => clearData();
  }, [fetchData, clearData, id]);

  // 当前选中人的信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});

  // 工作接收人
  const [recipientId, setRecipientId] = useState(undefined);

  // 编辑时给表单初始值
  useEffect(() => {
    if (is.existy(dataSource) && is.not.empty(dataSource)) {
      form.setFieldsValue({
        actualHandoverEmployeeId: dot.get(dataSource, 'creator_info._id'), // 实际交接人
        jobRecipient: dataSource.receiver_info_list ? dot.get(dataSource, 'receiver_info_list', []).map(v => v._id)[0] : undefined, // 工作接受人
        jobHandoverSuperviser: dot.get(dataSource, 'supervisor'), // 监交人
        jobHandoverType: dot.get(dataSource, 'handover_type'), // 工作交接类型
        relatedJobHandoverOrder: dot.get(dataSource, 'relation_application_order_info._id', undefined), // 关联审批单
        resignDate: dataSource.departure_date ? moment(`${dataSource.departure_date}`) : null, // 离职日期
        resignJobHandoverOrder: PageUpload.getInitialValue(dataSource, 'asset_infos'),  // 附件
      });
      setRecipientId(dot.get(dataSource, 'receiver_info_list', []).map(v => v._id)[0]);
      setCurrentJobInfo({
        major_job_info: { // 岗位
          name: showPlainText(dataSource, 'job_info.name'),
        },
        major_department_info: { // 部门
          name: showPlainText(dataSource, 'department_info.name'),
        },
        entry_date: dataSource.entry_date, // 入职日期
      });
    }
  }, [dataSource, form]);

  const changeJobHandoverType = (val) => {
    if (val === OaApplicationJobHandoverType.resign) {
      form.setFieldsValue({ relatedJobHandoverOrder: dot.get(dataSource, 'relation_application_order_info._id', undefined) });
      return;
    }
    form.setFieldsValue({ relatedJobHandoverOrder: undefined });
  };

  // 工作接收人
  const onChangeRecipient = (val) => {
    setRecipientId(val);
  };

  // 基本信息
  const employeeInfoFormItems = [
    <Form.Item label="实际交接人">
      {showPlainText(dataSource, 'order_employee_info.name')}
    </Form.Item>,
    <Form.Item label="所在部门">
      {showPlainText(dataSource, 'department_info.name')}
    </Form.Item>,
    <Form.Item label="岗位">
      {showPlainText(currentJobInfo, 'major_job_info.name')}
    </Form.Item>,
    <Form.Item label="职级">
      {showPlainText(dataSource, 'job_info.rank', '--')}
    </Form.Item>,
    <Form.Item label="入职日期">
      {showDate(currentJobInfo, 'entry_date')}
    </Form.Item>,
    <Form.Item
      name="jobRecipient"
      label="工作接收人"
      rules={[{
        required: true,
        message: '请选择',
      }]}
    >
      <EmployeesSelect
        showSearch
        optionFilterProp="children"
        placeholder="请选择工作接收人"
        onChange={onChangeRecipient}
      />
    </Form.Item>,
    <Form.Item
      name="jobHandoverSuperviser"
      label="监交人"
    >
      <Input placeholder="请填写监交人" />
    </Form.Item>,
    <Form.Item
      label="工作交接类型"
      name="jobHandoverType"
      rules={[{
        required: true,
        message: '请选择',
      }]}
    >
      <Select placeholder="请选择工作交接类型" onChange={changeJobHandoverType}>
        <Option value={OaApplicationJobHandoverType.resign}>{OaApplicationJobHandoverType.description(OaApplicationJobHandoverType.resign)}</Option>
        <Option value={OaApplicationJobHandoverType.other}>{OaApplicationJobHandoverType.description(OaApplicationJobHandoverType.other)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      noStyle
      key="relatedJobHandoverOrderItem"
      shouldUpdate={(prevValues, curValues) => prevValues.jobHandoverType !== curValues.jobHandoverType}
    >
      {({ getFieldValue }) => {
        return (
          <Form.Item
            label="关联审批单"
            name="relatedJobHandoverOrder"
          >
            <RelatedJobHandoverOrder
              showSearch
              optionFilterProp="children"
              placeholder="请选择关联审批单"
              orderAccountId={ownerId}
              handoverType={getFieldValue('jobHandoverType')}
            />
          </Form.Item>
        );
      }}
    </Form.Item>,
    <Form.Item
      noStyle
      key="resignDateItem"
      shouldUpdate={(prevValues, curValues) => prevValues.jobHandoverType !== curValues.jobHandoverType}
    >
      {({ getFieldValue }) => {
        return getFieldValue('jobHandoverType') === OaApplicationJobHandoverType.resign
              ? <Form.Item
                label="离职日期"
                name="resignDate"
                rules={[{
                  required: true,
                  message: '请选择',
                }]}
              >
                <DatePicker disabledDate={disabledDate} />
              </Form.Item>
            : null;
      }}
    </Form.Item>,
  ];

  // 附件
  const photoFormItems = [
    <Form.Item
      label="附件"
      name="resignJobHandoverOrder"
      rules={[{ required: true, message: '请上传' }]}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 20 }}
    >
      <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
    </Form.Item>,
  ];

  // 点击保存
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      // 锁定按钮不可点击
      onLockHook();
      try {
        // 请求接口
        const ok = await update({ ...values, id });
        if (ok) {
          // 提交成功回调
          onDoneHook();
        } else {
          // 解锁按钮
          onUnlockHook();
        }
      } catch (e) {
        // 解锁按钮
        onUnlockHook();
      }
    });
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form {...FormLayout} form={form}>
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          detail={dataSource}
          flowId={query.flow_id}
          accountId={dot.get(dataSource, 'creator_info._id', undefined)}
          departmentId={dot.get(dataSource, 'creator_department_info._id', undefined)}
          specialAccountId={recipientId}
        />
      </CoreContent>

      {/* 渲染基本信息 */}
      <CoreContent title="基本信息">
        <CoreForm items={employeeInfoFormItems} />
        <Alert type="warning" showIcon message="若为【离职交接】，建议关联离职申请单" />
      </CoreContent>

      {/* 渲染附件 */}
      <CoreContent title="拍照上传《工作交接单》">
        <CoreForm items={photoFormItems} cols={1} />
      </CoreContent>

      {/* 渲染操作 */}
      <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
    </Form>
  );
}

const mapStateToProps = ({
  humanResource: { jobHandoverDetail },
  applicationCommon: { departmentEmployees },
  oaCommon: { examineFlowInfo },
}) => ({
  dataSource: jobHandoverDetail, // 工作交接单详情
  departmentEmployees, // 部门员工关联关系
  examineFlowInfo,
});

const mapDispatchToProps = dispatch => ({
  // 获取工作交接单详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchHandoverOrderDetail',
    payload: { id },
  }),
  // 清空工作交接单详情
  clearData: () => dispatch({
    type: 'humanResource/reduceJobHandoverDetail',
    payload: {},
  }),
  // 编辑工作交接单
  update: payload => dispatch({
    type: 'humanResource/updateHandoverOrder',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(JobHandoverUpdate);
