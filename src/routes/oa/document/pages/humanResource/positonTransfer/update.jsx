/**
 * 人事类 - 人事调动 - 编辑
 */
import React, { useEffect, useState } from 'react';
import {
  Form, Input, Radio, DatePicker,
} from 'antd';
import moment from 'moment';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';

import { PositionTransferType } from '../../../../../../application/define';
import {
  CoreForm, CoreContent,
} from '../../../../../../components/core';
import {
  CommonSelectDepartmentPost,
} from '../../../../../../components/common';
import {
  PageUpload, PageFormButtons,
  ComponentRenderFlowNames,
} from '../../../components';
import {
  showPlainText,
  getDateFormValue,
} from '../../../../../../application/utils';
import ExamineFlow from '../../../components/form/flow';

const Namespace = 'PositionTransferForm';

// 人事调动选择框可选值
const PositionTransferTypeOptions = [
  {
    value: PositionTransferType.promoted,
    label: PositionTransferType.description(PositionTransferType.promoted),
  },
  {
    value: PositionTransferType.demote,
    label: PositionTransferType.description(PositionTransferType.demote),
  },
  {
    value: PositionTransferType.levelTransfer,
    label: PositionTransferType.description(PositionTransferType.levelTransfer),
  },
];

// 表单布局
const FormLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

function PositionTransferUpdate({
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
        transferName: dot.get(dataSource, 'creator_info._id'), // 调动人员
        positionTransferType: dot.get(dataSource, 'human_resource_type'), // 调动类型
        effectiveTime: getDateFormValue(dataSource, 'effect_date'), // 生效时间
        post: dot.get(dataSource, 'transfer_job_info._id'), // 调动后岗位
        reason: dot.get(dataSource, 'note'), // 备注
        assets: PageUpload.getInitialValue(dataSource, 'asset_infos'), // 附件
      });
      setCurrentJobInfo({
        major_job_info: { // 岗位信息
          name: showPlainText(dataSource, 'job_info.name'), // 岗位
          rank: showPlainText(dataSource, 'job_info.rank'), // 职级
        },
        major_department_info: { // 部门信息
          name: showPlainText(dataSource, 'department_info.name'), // 部门
        },
        transfer_job_info: { // 调动后岗位信息
          rank: showPlainText(dataSource, 'transfer_job_info.rank'), // 调动后职级
        },
      });
    }
  }, [dataSource, form]);

  // 岗位修改回调
  const onChangePost = (_, option) => {
    const jobInfo = dot.get(option, 'props.item.job_info', {});
    setCurrentJobInfo(prevState => ({
      ...prevState,
      transfer_job_info: jobInfo,
    }));
  };

  // 只能选择本月及以后的日期
  const disabledDate = (date) => {
    return date.isBefore(moment(), 'month');
  };

  // 调动人员信息
  const employeeInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="调动人员">
          {showPlainText(dataSource, 'order_employee_info.name')}
        </Form.Item>,
        <Form.Item
          label="调动类型"
          name="positionTransferType"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Radio.Group options={PositionTransferTypeOptions} />
        </Form.Item>,
        <Form.Item
          label="调动生效时间"
          name="effectiveTime"
          rules={[{ required: true, message: '请选择' }]}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>,
        <Form.Item label="所在部门">
          {showPlainText(currentJobInfo, 'major_department_info.name')}
        </Form.Item>,
        <Form.Item label="岗位">
          {showPlainText(currentJobInfo, 'major_job_info.name')}
        </Form.Item>,
        <Form.Item key="level" label="职级">
          {showPlainText(currentJobInfo, 'major_job_info.rank')}
        </Form.Item>,
        <Form.Item label="调动后部门">
          {showPlainText(dataSource, 'transfer_department_info.name')}
        </Form.Item>,
        <Form.Item
          label="调动后岗位"
          name="post"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectDepartmentPost
            namespace={Namespace}
            departmentId={dot.get(dataSource, 'transfer_department_info._id')}
            onChange={onChangePost}
          />
        </Form.Item>,
        <Form.Item key="afterLevel" label="职级">
          {showPlainText(currentJobInfo, 'transfer_job_info.rank')}
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 1,
      items: [
        <Form.Item
          label="调动原因说明"
          name="reason"
          rules={[{ required: true, message: '请填写' }]}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <Input.TextArea />
        </Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 1,
      items: [
        <Form.Item
          name="assets"
          label="上传附件"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
        </Form.Item>,
      ],
    },
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

  return (<Form {...FormLayout} form={form}>
    {/* 审批信息 */}
    <CoreContent title="审批信息" titleExt={renderFlowNames()}>
      <ExamineFlow
        isDetail
        flowId={query.flow_id}
        accountId={dot.get(dataSource, 'order_account_info._id', undefined)}
        departmentId={dot.get(dataSource, 'creator_department_info._id', undefined)}
        specialAccountId={dot.get(dataSource, 'order_account_info._id', undefined)}
        specialDepartmentId={dot.get(dataSource, 'transfer_department_info._id')}
      />
    </CoreContent>

    {/* 渲染调动人员信息 */}
    <CoreContent title="调动人员信息">
      {
        employeeInfoFormItems.map(({ key, items, cols }) => (
          <CoreForm key={key} items={items} cols={cols} />
        ))
      }
    </CoreContent>
    <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
  </Form>);
}

const mapStateToProps = ({ humanResource: { positionTransferDetail }, oaCommon: { examineFlowInfo } }) => ({
  dataSource: positionTransferDetail,
  examineFlowInfo,
});

const mapDispatchToProps = dispatch => ({
  // 获取人事调动详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchHumanResourceTransferOrderDetail',
    payload: { id },
  }),
  // 清空人事调动详情
  clearData: () => dispatch({
    type: 'humanResource/reducePositionTransferDetail',
    payload: {},
  }),
  // 编辑人事调动申请
  update: payload => dispatch({
    type: 'humanResource/updateHumanResourceTransferOrder',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionTransferUpdate);
