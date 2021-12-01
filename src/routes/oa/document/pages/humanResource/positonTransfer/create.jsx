/**
 * 人事类 - 人事调动 - 创建
 */
import React, { useEffect, useState } from 'react';
import {
  Form, Input, Radio, DatePicker, message,
} from 'antd';
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import is from 'is_js';

import { PositionTransferType, ApprovalDefaultParams } from '../../../../../../application/define';
import {
  CoreForm, CoreContent,
} from '../../../../../../components/core';
import {
  CommonTreeSelectDepartments,
  CommonSelectDepartmentPost,
  CommonSelectDepartmentEmployees,
  CommonModalCopyGive,
} from '../../../../../../components/common';
import {
  PageUpload, PageFormButtons, FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components';
import { showPlainText } from '../../../../../../application/utils';
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

function PositionTransferCreate({ query = {}, create, update, submitOrder, relation, examineFlowInfo = [] }) {
  const {
    department_id: departmentId, // 部门ID
    department_name: departmentName, // 部门名称
    post_id: postId, // 岗位ID
    post_name: postName, // 岗位名称
    rank_name: rankName, // 职级
    flow_id: flowId, // 审批流ID
  } = query;
  // form的ref
  const [form] = Form.useForm();

  // 没有部门id或岗位id，报错
  useEffect(() => {
    if (!departmentId || !postId) {
      message.error('需提前选择部门和岗位');
    }
  }, [departmentId, postId]);

  // 当前选中人的信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 调动人员id
  const [transferId, setTransferId] = useState();
  // 调动后部门id
  const [specialId, setSpecialId] = useState(undefined);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  // 岗位改变回调
  const onChangePost = (_, option) => {
    const jobInfo = dot.get(option, 'props.item.job_info', {});
    setCurrentJobInfo(prevState => ({
      ...prevState,
      transfer_job_info: jobInfo,
    }));
  };

  // 部门改变回调
  const onChangeTransferDepartment = (val) => {
    setSpecialId(val);
    form.setFieldsValue({ post: undefined });
    setCurrentJobInfo(prevState => ({
      ...prevState,
      transfer_job_info: {},
    }));
  };

  // 只能选择本月及以后的日期
  const disabledDate = (date) => {
    return date.isBefore(moment(), 'month');
  };


  // 基本信息
  const employeeInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item
          label="调动人员"
          name="transferName"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectDepartmentEmployees
            departmentId={departmentId}
            postId={postId}
            onChange={val => setTransferId(val)}
            isCurrentDepartment
          />
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
        <Form.Item label="所在部门">{departmentName || '--'}</Form.Item>,
        <Form.Item label="岗位">{postName || '--'}</Form.Item>,
        <Form.Item key="level" label="职级">{rankName || '--'}</Form.Item>,
        <Form.Item
          label="调动后部门"
          name="department"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonTreeSelectDepartments
            isAuthorized
            namespace={Namespace}
            onChange={onChangeTransferDepartment}
          />
        </Form.Item>,
        <Form.Item
          noStyle
          key="post"
          shouldUpdate={
            (prevValues, curValues) => prevValues.department !== curValues.department
          }
        >
          {
            ({ getFieldValue }) => (
              <Form.Item
                label="调动后岗位"
                name="post"
                rules={[{ required: true, message: '请选择' }]}
              >
                <CommonSelectDepartmentPost
                  namespace={Namespace}
                  showSearch
                  placeholder="请选择岗位"
                  optionFilterProp="children"
                  departmentId={getFieldValue('department')}
                  onChange={onChangePost}
                />
              </Form.Item>
            )
          }
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

  // 提交操作
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      // 锁定按钮不可点击
      onLockHook();
      // 单据已创建（提报审批单）
      if (orderId) {
        await update({
          ...values,
          flowId: flowVal,
          departmentId,
          postId,
          id: transacId, // 单据id
          onCreateSuccess: (id) => {
            const params = {
              id,
              values,
              oId: orderId,
              onDoneHook,
              onErrorCallback: onUnlockHook,
            };
            onCreateSuccess(params);
          },
          onErrorCallback: onUnlockHook,
        });
      } else {
        // 审批单未创建（先创建提交单据，再提交审批单）
        try {
          await create({
            ...values,
            flowId: flowVal,
            departmentId,
            postId,
            onCreateSuccess: (id) => {
              const params = {
                id,
                values,
                oId: id,
                onDoneHook,
                onErrorCallback: onUnlockHook,
              };
              onCreateSuccess(params);
            },
            onErrorCallback: onUnlockHook,
          });
        } catch (e) {
          onUnlockHook();
        }
      }
    });
  };

  // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
    // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    submitOrder({
      ...values,
      id: oId,
      // 判断是否是创建，创建提示提示语
      isOa: orderId ? false : true,
      onSuccessCallback: onDoneHook,
      onErrorCallback,
    });
  };

  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ id, values, oId, onDoneHook, onErrorCallback }) => {
    // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if (is.empty(parentIds)) {
      // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
    // 关联审批接口
    relation({
      id,
      ids: parentIds,        // 查询搜索后要关联的审批单id
      type: ApprovalDefaultParams.add, // 增加
      onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
      onErrorCallback,
    });
  };

  // 保存操作
  const onSave = ({ onSaveHook, onUnsaveHook }) => {
    form.validateFields().then(async (values) => {
      onSaveHook();
      try {
        // 保存单据（update）
        const res = orderId ? await update({
          ...values,
          flowId: flowVal,
          departmentId,
          postId,
          id: transacId, // 单据id
          onCreateSuccess: (id) => {
            const params = {
              id,
              onErrorCallback: onUnsaveHook,
            };
            onCreateSuccess(params);
          },
          onErrorCallback: onUnsaveHook,
          // 创建单据（create）
        }) : await create({
          ...values,
          flowId: flowVal,
          departmentId,
          postId,
          onCreateSuccess: (id) => {
            const params = {
              id,
              onErrorCallback: onUnsaveHook,
            };
            onCreateSuccess(params);
          },
          onErrorCallback: onUnsaveHook,
        });

        if (res) {
          onUnsaveHook();
          res._id && (setTransacId(res._id));
          res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
        } else {
          onUnsaveHook();
        }
      } catch (e) {
        onUnsaveHook();
      }
    });
  };

  // 抄送人
  const renderCopyGive = () => {
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={flowVal} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };


  return (<Form {...FormLayout} form={form}>
    <CoreContent title="流程预览" titleExt={renderFlowNames()}>
      {/* 渲染基本信息 */}
      <ExamineFlow
        isDetail
        departmentId={departmentId}
        accountId={transferId}
        flowId={flowId}
        pageType={105}
        setFlowId={setFlowId}
        rank={rankName}
        specialAccountId={transferId}
        specialDepartmentId={specialId}
      />
    </CoreContent>
    {/* 渲染关联审批组件 */}
    {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
      <ComponentRelatedApproval setParentIds={setParentIds} />
         }
    {/* 渲染调动人员信息 */}
    <CoreContent title="调动人员信息">
      {
        employeeInfoFormItems.map(({ key, items, cols }) => (
          <CoreForm key={key} items={items} cols={cols} />
        ))
      }
    </CoreContent>
    {/* 渲染抄送 */}
    {renderCopyGive()}

    <PageFormButtons
      query={query}
      onSubmit={onSubmit}
      onSave={onSave}
    />
  </Form>);
}

const mapStateToProps = ({ oaCommon: { examineFlowInfo } }) => ({
  examineFlowInfo, // 审批流列表
});

const mapDispatchToProps = dispatch => ({
  // 创建人事调动申请
  create: payload => dispatch({
    type: 'humanResource/createHumanResourceTransferOrder',
    payload,
  }),
  update: payload => dispatch({
    type: 'humanResource/updateHumanResourceTransferOrder',
    payload,
  }),
  submitOrder: payload => dispatch({
    type: 'oaCommon/submitOrder',
    payload,
  }),
  relation: payload => dispatch({
    type: 'humanResource/fetchApproval',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionTransferCreate);
