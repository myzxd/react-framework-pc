/**
 * 人事类 - 离职申请 - 创建
 */
import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Radio, message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import dot from 'dot-prop';
import { ResignReason, ApprovalDefaultParams } from '../../../../../../application/define';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import {
  CommonSelectDepartmentEmployees,
  // CommonSelectJobHandover,
  CommonModalCopyGive,
} from '../../../../../../components/common';
import { authorize } from '../../../../../../application';
import {
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components/index';
import { showPlainText } from '../../../../../../application/utils';
import DepartmentFlow from '../../../components/form/departmentFlow';
import PostFlow from '../../../components/form/postFlow';
import ExamineFlow from '../../../components/form/flow';
import { PagesHelper } from '../../../define';

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

function ResignCreate({
  query = {}, create, update, employeeDetail, fetchEmployeeDetail, clearEmployeeDetail, submitOrder, getEmployeeDepAndPostInfo,
  newOaExamineList,
  accountDep,
  examineFlowInfo = [],
  relation,
}) {
  const {
    department_id: departmentId,
    department_name: departmentName,
    post_id: postId,
    post_name: postName,
    rank_name: rankName,
    is_self: isSelfStr,
  } = query;

  let isSelf = false; // 是否是本人提报
  if (isSelfStr === 'true') {
    isSelf = true;
  }
  // form的ref
  const [form] = Form.useForm();
  const { id: ownerId, staffProfileId } = authorize.account;
  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(departmentId);
  // 岗位表单id
  const [rank, setRank] = useState(rankName);
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);

  // 实际申请人id
  const initActualId = isSelf ? authorize.account.id : undefined;
  const [actualId, setActualId] = useState(initActualId);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // 如果是代提报，而且没有部门id或岗位id，报错
  useEffect(() => {
    if (!isSelf && (!departmentId || !postId)) {
      message.error('代提报需提前选择部门和岗位');
    }
  }, [isSelf, departmentId, postId]);

  // 本人提报时加载本人信息
  useEffect(() => {
    if (isSelf) {
      // 加载本人信息
      fetchEmployeeDetail(staffProfileId);
      return () => isSelf && clearEmployeeDetail;
    }
  }, [staffProfileId, isSelf, fetchEmployeeDetail, clearEmployeeDetail]);

  useEffect(() => {
    if (isSelf && is.existy(employeeDetail) && is.not.empty(employeeDetail)
      && is.existy(accountDep) && is.not.empty(accountDep)
      && is.existy(newOaExamineList) && is.not.empty(newOaExamineList)) {
      // 当前人的主部门id
      const majorDepartmentId = dot.get(employeeDetail, 'major_department_info._id', undefined);
      // 主岗
      const majorJobRank = dot.get(employeeDetail, 'major_job_info.rank', undefined);
      const examineList = dot.get(newOaExamineList, 'data', []);
      // 过滤包含主部门的审批流
      const filterMajorDepartmentList = examineList.filter((item = {}) => {
        const arr = [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
        const applyRanks = dot.get(item, 'applyRanks', []);
        // 判断部门集合是否包含主部门并且岗位集合为全部
        if (arr.includes(majorDepartmentId) && applyRanks[0] === 'all') {
          return true;
        }
        // 判断部门集合是否包含主部门并且岗位集合包含主岗
        return arr.includes(majorDepartmentId) && applyRanks.includes(majorJobRank);
      });
      // 判断主部门和主岗的审批流是否有数据
      if (is.existy(filterMajorDepartmentList) && is.not.empty(filterMajorDepartmentList)) {
        setDepartmentFlowId(majorDepartmentId);
        setRank(majorJobRank);
        form.setFieldsValue({
          departmentId: majorDepartmentId,
          postId: dot.get(employeeDetail, 'major_job_info._id', undefined),
        });
        return;
      }

      // 获取副部门数据，过滤主部门
      const deputyDepartmentList = dot.get(accountDep, 'postList', []).filter(item => dot.get(item, 'department_info._id', undefined) !== majorDepartmentId);
      // 副部门id集合
      const deputyDepartmentIds = deputyDepartmentList.map(item => dot.get(item, 'department_info._id', undefined));
      const examineItem = PagesHelper.pageCommonTerminateForEach(examineList, deputyDepartmentList, deputyDepartmentIds);
      if (is.existy(examineItem) && is.not.empty(examineItem)) {
        setDepartmentFlowId(examineItem.departmentId);
        setRank(examineItem.rank);
        form.setFieldsValue({
          departmentId: examineItem.departmentId,
          postId: examineItem.jobId,
        });
      }
    }
  }, [employeeDetail, isSelf, accountDep, newOaExamineList]);

  // 人员所属所有部门及岗位
  useEffect(() => {
    isSelf && getEmployeeDepAndPostInfo({
      accountId: authorize.account.staffProfileId,
    });
  }, [getEmployeeDepAndPostInfo, isSelf]);

  // 只能选择本月及以后的日期
  const disabledDate = (date) => {
    return date.isBefore(moment(), 'month');
  };

  // 员工详情
  let employeeInfo = {};
  // 如果是自己提报，从请求的员工详情取数据
  if (isSelf) {
    employeeInfo = {
      name: dot.get(employeeDetail, 'name'), // 姓名
      departmentId: dot.get(employeeDetail, 'major_department_info._id'), // 部门ID
      departmentName: dot.get(employeeDetail, 'major_department_info.name'), // 部门名称
      postId: dot.get(employeeDetail, 'major_job_info._id'), // 岗位ID
      postName: showPlainText(employeeDetail, 'major_job_info.name'), // 岗位名称
      // rankName: showPlainText(employeeDetail, 'major_job_info.rank'), // 职级
    };
  } else {
    // 如果是代提报，从改变提报人的信息中取数据
    employeeInfo = {
      departmentId, // 部门ID
      departmentName: departmentName || '--', // 部门名称
      postId, // 岗位ID
      postName: postName || '--', // 岗位名称
      rankName: rankName || '--', // 职级
    };
  }

  const onChangeActualResign = (val) => {
    setActualId(val);
  };

  const examineList = dot.get(newOaExamineList, 'data', []);
  // 审批流部门id集合
  const filterDepartmentIds = examineList.map((item = {}) => {
    return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
  });
  // 将多维数组转为一维数组
  const departmentIds = _.flattenDeep(filterDepartmentIds);
  const employeeInfoFormItems = isSelf ? [
    // 基本信息
    isSelf ?
      <Form.Item label="离职申请人">{employeeInfo.name}</Form.Item> :
      <Form.Item
        label="离职申请人"
        name="actualResignName"
        rules={[{ required: true, message: '请选择' }]}
        {...EmployeeFormLayout}
      >
        <CommonSelectDepartmentEmployees
          departmentId={departmentId}
          postId={postId}
          onChange={onChangeActualResign}
          isCurrentDepartment
        />
      </Form.Item>,
    <Form.Item label="部门" name="departmentId" {...EmployeeFormLayout}>
      <DepartmentFlow
        examineFlowDepartmentIds={departmentIds}
        setJobForm={() => form.setFieldsValue({ postId: undefined })}
        setDepartmentId={setDepartmentFlowId}
        disabled={Boolean(orderId)}
      />
    </Form.Item>,
    <Form.Item label="岗位" name="postId" {...EmployeeFormLayout}>
      <PostFlow
        departmentId={departmentFlowId}
        setRank={setRank}
        disabled={Boolean(orderId)}
      />
    </Form.Item>,
    <Form.Item label="职级" {...EmployeeFormLayout}>
      {rank}
    </Form.Item>,
  ] : [
    <Form.Item
      label="离职申请人"
      name="actualResignName"
      rules={[{ required: true, message: '请选择' }]}
      {...EmployeeFormLayout}
    >
      <CommonSelectDepartmentEmployees
        departmentId={departmentId}
        postId={postId}
        isCurrentDepartment
      />
    </Form.Item>,
    <Form.Item label="部门" {...EmployeeFormLayout}>
      {employeeInfo.departmentName}
    </Form.Item>,
    <Form.Item label="岗位" {...EmployeeFormLayout}>
      {employeeInfo.postName}
    </Form.Item>,
    <Form.Item label="职级" {...EmployeeFormLayout}>
      {employeeInfo.rankName}
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
    //   noStyle
    //   key="relatedJobHandoverOrder"
    //   shouldUpdate={
    //       (prevValues, curValues) => prevValues.actualResignName !== curValues.actualResignName
    //     }
    // >
    //   {
    //       ({ getFieldValue }) => (
    //         <Form.Item
    //           name="relatedJobHandoverOrder"
    //           label="工作交接关联审批单"
    //           {...ResignInfoFormLayout}
    //         >
    //           <CommonSelectJobHandover
    //             style={{ width: '50%' }}
    //             employeeId={isSelf ? ownerId : getFieldValue('actualResignName')}
    //           />
    //         </Form.Item>
    //       )
    //     }
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

  // 提交操作
  // 提交
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      // 锁定按钮不可点击
      onLockHook();
      if (orderId) {
        await update({
          ...values,
          id: transacId,
          departmentId: isSelf ? values.departmentId : departmentId,
          postId: isSelf ? values.postId : postId,
          actualResignName: isSelf ? ownerId : values.actualResignName,
          onCreateSuccess: (id) => {
            const params = {
              _id: id,
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
        try {
          await create({
            ...values,
            flowId: flowVal,
            departmentId: isSelf ? values.departmentId : departmentId,
            postId: isSelf ? values.postId : postId,
            actualResignName: isSelf ? ownerId : values.actualResignName,
            onCreateSuccess: (id) => {
              const params = {
                _id: id,
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
    relation({
      id: _id,
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

      // 保存单据（update）
      const res = orderId ? await update({
        ...values,
        id: transacId,
        departmentId: isSelf ? values.departmentId : departmentId,
        postId: isSelf ? values.postId : postId,
        actualResignName: isSelf ? ownerId : values.actualResignName,
        onCreateSuccess: id => onCreateSuccess({ _id: id, onErrorCallback: onUnsaveHook }),
        onErrorCallback: onUnsaveHook,
        // 创建单据（create）
      }) : await create({
        ...values,
        flowId: flowVal,
        departmentId: isSelf ? values.departmentId : departmentId,
        postId: isSelf ? values.postId : postId,
        actualResignName: isSelf ? ownerId : values.actualResignName,
        onCreateSuccess: id => onCreateSuccess({ _id: id, onErrorCallback: onUnsaveHook }),
        onErrorCallback: onUnsaveHook,
      });

      if (res) {
        onUnsaveHook();
        res._id && (setTransacId(res._id));
        res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
      } else {
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

   // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form}>
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          isSelf={isSelf}
          departmentId={departmentFlowId}
          rank={rank}
          pageType={106}
          accountId={actualId}
          setFlowId={setFlowId}
          specialAccountId={actualId}
        />
      </CoreContent>
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }

      {/* 渲染基本信息 */}
      <CoreContent title="基本信息">
        <CoreForm items={employeeInfoFormItems} cols={4} />
      </CoreContent>

      {/* 渲染离职信息 */}
      <CoreContent title="离职信息">
        <CoreForm items={resignInfoFormItems} cols={1} />
      </CoreContent>
      {/* 渲染抄送 */}
      {renderCopyGive()}

      {/* 渲染操作 */}
      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
}


const mapStateToProps = ({ oaCommon: { employeeDetail, accountDep, examineFlowInfo }, expenseExamineFlow: { newOaExamineList } }) => ({
  employeeDetail, // 员工详情
  newOaExamineList, // 审批流列表
  accountDep,
  examineFlowInfo,
});
const mapDispatchToProps = dispatch => ({
  // 获取员工详情
  fetchEmployeeDetail: id => dispatch({
    type: 'oaCommon/fetchEmployeeDetail',
    payload: { id },
  }),
  // 清空员工详情
  clearEmployeeDetail: () => dispatch({ type: 'oaCommon/resetEmployeeDetail' }),
  // 创建离职申请
  create: payload => dispatch({
    type: 'humanResource/createResignOrder',
    payload,
  }),
  update: payload => dispatch({
    type: 'humanResource/updateResignOrder',
    payload,
  }),
  submitOrder: payload => dispatch({
    type: 'oaCommon/submitOrder',
    payload,
  }),
  getEmployeeDepAndPostInfo: payload => dispatch({
    type: 'oaCommon/getEmployeeDepAndPostInfo',
    payload,
  }),
  relation: payload => dispatch({
    type: 'humanResource/fetchApproval',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResignCreate);
