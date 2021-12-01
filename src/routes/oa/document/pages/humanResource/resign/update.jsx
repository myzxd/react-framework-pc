/**
 * 人事类 - 离职申请 - 编辑
 */
import React, { useEffect, useState } from 'react';
import is from 'is_js';
import dot from 'dot-prop';
import { DatePicker, Form, Input, Radio } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

import { ResignReason } from '../../../../../../application/define';
import { CoreContent, CoreForm } from '../../../../../../components/core';
// import {
//   CommonSelectJobHandover,
// } from '../../../../../../components/common';
import {
  PageFormButtons,
  PageUpload,
  ComponentRenderFlowNames,
} from '../../../components/index';
import {
  showPlainText,
  getDateFormValue,
} from '../../../../../../application/utils';
import ExamineFlow from '../../../components/form/flow';

// 基本信息表单布局
const EmployeeFormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// 离职信息表单布局
const ResignInfoFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

// 离职原因选择框可选项
const ResignReasonOptions = [
  {
    value: ResignReason.personal,
    label: ResignReason.description(ResignReason.personal),
  },
  {
    value: ResignReason.betterChance,
    label: ResignReason.description(ResignReason.betterChance),
  },
  {
    value: ResignReason.dissatisfiedWithSalary,
    label: ResignReason.description(ResignReason.dissatisfiedWithSalary),
  },
  {
    value: ResignReason.tooMuchStress,
    label: ResignReason.description(ResignReason.tooMuchStress),
  },
];

function ResignUpdate({
  query = {}, fetchData, clearData, dataSource = {}, update,
  examineFlowInfo = [],
}) {
  const { id } = query;
  // form的ref
  const [form] = Form.useForm();

  // 加载详情数据
  useEffect(() => {
    fetchData(id);
    return () => clearData();
  }, [fetchData, clearData, id]);

  // 当前选中人的信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});

  // 编辑时给表单初始值
  useEffect(() => {
    if (is.existy(dataSource) && is.not.empty(dataSource)) {
      form.setFieldsValue({
        actualResignName: dot.get(dataSource, 'creator_info._id'), // 实际离职人员
        applyResignDate: getDateFormValue(dataSource, 'apply_departure_date'), // 申请离职日期
        resignReason: dot.get(dataSource, 'departure_type'), // 离职原因
        // relatedJobHandoverOrder: dot.get(dataSource, 'handover_order_info._id'), // 关联工作交接审批单
        resignCause: dot.get(dataSource, 'note'), // 备注
        files: PageUpload.getInitialValue(dataSource, 'asset_infos'), // 附件
      });
      setCurrentJobInfo({
        major_job_info: { // 岗位信息
          name: showPlainText(dataSource, 'job_info.name'), // 岗位
          rank: showPlainText(dataSource, 'job_info.rank'), // 职级
        },
        major_department_info: { // 部门信息
          name: showPlainText(dataSource, 'department_info.name'), // 部门
        },
      });
    }
  }, [dataSource, form]);

  // 只能选择本月及以后的日期
  const disabledDate = (date) => {
    return date.isBefore(moment(), 'month');
  };

  // 基本信息
  const employeeInfoFormItems = [
    <Form.Item label="离职申请人" {...EmployeeFormLayout}>
      {showPlainText(dataSource, 'order_employee_info.name')}
    </Form.Item>,
    <Form.Item
      label="部门"
      {...EmployeeFormLayout}
    >
      {showPlainText(currentJobInfo, 'major_department_info.name')}
    </Form.Item>,
    <Form.Item
      label="岗位"
      {...EmployeeFormLayout}
    >
      {showPlainText(currentJobInfo, 'major_job_info.name')}
    </Form.Item>,
    <Form.Item
      label="职级"
      {...EmployeeFormLayout}
    >
      {showPlainText(currentJobInfo, 'major_job_info.rank')}
    </Form.Item>,
  ];

  // 离职信息
  const resignInfoFormItems = [
    <Form.Item
      name="applyResignDate"
      label="申请离职日期"
      rules={[{ required: true, message: '请选择' }]}
      {...ResignInfoFormLayout}
    >
      <DatePicker disabledDate={disabledDate} />
    </Form.Item>,
    <Form.Item
      name="resignReason"
      label="离职原因"
      rules={[{ required: true, message: '请选择' }]}
      {...ResignInfoFormLayout}
    >
      <Radio.Group options={ResignReasonOptions} />
    </Form.Item>,
    // <Form.Item
    //   name="relatedJobHandoverOrder"
    //   label="工作交接关联审批单"
    //   {...ResignInfoFormLayout}
    // >
    //   <CommonSelectJobHandover
    //     style={{ width: '50%' }}
    //     employeeId={dot.get(dataSource, 'creator_info._id')}
    //   />
    // </Form.Item>,
    <Form.Item
      name="resignCause"
      label="离职事由"
      rules={[{ required: true, message: '请选择' }]}
      {...ResignInfoFormLayout}
    >
      <Input.TextArea style={{ width: '50%' }} />
    </Form.Item>,
    <Form.Item
      label="附件"
      name="files"
      {...ResignInfoFormLayout}
    >
      <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
    </Form.Item>,
  ];

  // 保存
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
    <Form form={form}>
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          detail={dataSource}
          flowId={query.flow_id}
          accountId={dot.get(dataSource, 'creator_info._id', undefined)}
          departmentId={dot.get(dataSource, 'creator_department_info._id', undefined)}
          specialAccountId={dot.get(dataSource, 'creator_info._id', undefined)}
        />
      </CoreContent>

      {/* 渲染基本信息 */}
      <CoreContent title="基本信息">
        <CoreForm items={employeeInfoFormItems} cols={4} />
      </CoreContent>

      {/* 渲染离职信息 */}
      <CoreContent title="离职信息">
        <CoreForm items={resignInfoFormItems} cols={1} />
      </CoreContent>

      {/* 渲染操作 */}
      <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
    </Form>
  );
}

const mapStateToProps = ({ humanResource: { resignDetail }, oaCommon: { examineFlowInfo } }) => ({
  dataSource: resignDetail, // 离职申请详情
  examineFlowInfo,
});

const mapDispatchToProps = dispatch => ({
  // 获取离职申请详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchResignOrderDetail',
    payload: { id },
  }),
  // 清空离职申请详情
  clearData: () => dispatch({
    type: 'humanResource/reduceResignDetail',
    payload: {},
  }),
  // 编辑离职申请
  update: payload => dispatch({
    type: 'humanResource/updateResignOrder',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResignUpdate);
