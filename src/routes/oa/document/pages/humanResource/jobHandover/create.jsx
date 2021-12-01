/**
 * 人事类 - 工作交接 - 创建
 */
import is from 'is_js';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Input, message, Select, DatePicker, Alert } from 'antd';

import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import {
  CommonSelectDepartmentEmployees,
  CommonModalCopyGive,
} from '../../../../../../components/common';
import {
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components/index';
import EmployeesSelect from './components/employeesSelect';
import { authorize } from '../../../../../../application';
import {
  OaApplicationJobHandoverType,
  ApprovalDefaultParams,
} from '../../../../../../application/define';
import {
  showPlainText,
  showDate,
} from '../../../../../../application/utils';
import DepartmentFlow from '../../../components/form/departmentFlow';
import PostFlow from '../../../components/form/postFlow';
import ExamineFlow from '../../../components/form/flow';
import RelatedJobHandoverOrder from './components/relatedJobHandoverOrder';
import { PagesHelper } from '../../../define';

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

function JobHandoverCreate({
  query = {}, create, update, employeeDetail,
  fetchEmployeeDetail, clearEmployeeDetail, getEmployeeDepAndPostInfo, submitOrder,
  accountDep,
  newOaExamineList,
  relation, examineFlowInfo = [],
}) {
  const {
    department_id: departmentId, // 部门ID
    department_name: departmentName, // 部门名称
    is_self: isSelfStr, // 是否是自己提报的字符串
    flow_id: flowId, // 审批流ID
    post_id: postId, // 岗位id
    post_name: postName, // 岗位名称
    rank_name: rankName,  // 职级
  } = query;

  let isSelf = false; // 是否为自己提报
  if (isSelfStr === 'true') {
    isSelf = true;
  }
  // form的ref
  const [form] = Form.useForm();
  const { id: ownerId, staffProfileId } = authorize.account;
  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(departmentId);
  // 岗位表单id
  const [rank, setRank] = useState(undefined);

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);

  // 实际申请人id
  const initActualId = isSelf ? ownerId : undefined;
  const [actualId, setActualId] = useState(initActualId);

  // 实际申请人staffProfileId
  const initActualProId = isSelf ? staffProfileId : undefined;
  const [actualProId, setActualProId] = useState(initActualProId);

  // 审批流id
  const [flowVal, setFlowId] = useState(flowId);

  // 工作接收人
  const [recipientId, setRecipientId] = useState(undefined);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);


  // 如果是代提报，而且没有部门id，报错
  useEffect(() => {
    if (!isSelf && !departmentId) {
      message.error('代提报需提前选择部门');
    }
  }, [isSelf, departmentId]);

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
    actualProId && getEmployeeDepAndPostInfo({
      accountId: actualProId,
    });
  }, [actualProId, getEmployeeDepAndPostInfo]);

  // 代提报时当前选中人的信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});

  let employeeInfo = {};
  // 如果是自己提报，从请求的员工详情取数据
  if (isSelf) {
    employeeInfo = {
      name: dot.get(employeeDetail, 'name'),
      departmentId: dot.get(employeeDetail, 'major_department_info._id'),
      departmentName: dot.get(employeeDetail, 'major_department_info.name'),
      postId: dot.get(employeeDetail, 'major_job_info._id'),
      postName: showPlainText(employeeDetail, 'major_job_info.name'),
      rank: showPlainText(employeeDetail, 'major_job_info.rank'),
      entryDate: dot.get(employeeDetail, 'entry_date'),
    };
  } else {
    // 如果是代提报，从改变提报人的信息中取数据
    employeeInfo = {
      departmentId,
      departmentName: departmentName || '--',
      postName: postName || '--',
      rankName: rankName || '--',
      postId: dot.get(currentJobInfo, 'major_job_info._id'),
      entryDate: dot.get(currentJobInfo, 'entry_date'),
    };
  }

  const onChangeEmployee = (val, option) => {
    setActualId(val);
    setActualProId(option.payload._id);
    if (option && option.payload) {
      setCurrentJobInfo(option.payload);
    } else {
      setCurrentJobInfo({});
    }
    form.setFieldsValue({ relatedJobHandoverOrder: undefined });
  };

  // 工作接收人
  const onChangeRecipient = (val) => {
    setRecipientId(val);
  };

  const changeJobHandoverType = () => {
    form.setFieldsValue({ relatedJobHandoverOrder: undefined });
  };
  const examineList = dot.get(newOaExamineList, 'data', []);
// 审批流部门id集合
  const filterDepartmentIds = examineList.map((item = {}) => {
    return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
  });
// 将多维数组转为一维数组
  const departmentIds = _.flattenDeep(filterDepartmentIds);
  // 基本信息
  const employeeInfoFormItems = [
    isSelf ?
      <Form.Item label="实际交接人">{employeeInfo.name}</Form.Item> :
      <Form.Item
        name="actualHandoverEmployeeId"
        label="实际交接人"
        rules={[{ required: true, message: '请选择' }]}
      >
        <CommonSelectDepartmentEmployees
          postId={postId}
          departmentId={departmentId}
          onChange={onChangeEmployee}
          isCurrentDepartment
        />
      </Form.Item>,
    isSelf ?
      <Form.Item label="所在部门" name="departmentId">
        <DepartmentFlow
          examineFlowDepartmentIds={departmentIds}
          setJobForm={() => form.setFieldsValue({ postId: undefined })}
          setDepartmentId={setDepartmentFlowId}
          disabled={Boolean(orderId)}
          setRank={setRank}
        />
      </Form.Item> :
      <Form.Item label="所在部门">{employeeInfo.departmentName}</Form.Item>,
      // 只涉及非本人提报
      // 之前岗位如果不是本人提报的 是根据切换实际交接人 来加载岗位列表手动选中不可修改 现在不允许修改 默认从上一步选中带过来
    isSelf ?
      <Form.Item label="岗位" name="postId">
        <PostFlow
          departmentId={departmentFlowId}
          setRank={setRank}
          disabled={Boolean(orderId)}
        />
      </Form.Item>
      :
      <React.Fragment>
        <Form.Item label="岗位">{dot.get(employeeInfo, 'postName', '--')}</Form.Item>
      </React.Fragment>,
    isSelf ? <Form.Item label="职级">{rank || '--'}</Form.Item> : <Form.Item label="职级">{dot.get(employeeInfo, 'rankName', '--')}</Form.Item>,

    <Form.Item label="入职日期">{showDate(employeeInfo, 'entryDate')}</Form.Item>,
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
              orderAccountId={actualId}
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

  // 提交操作
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      // 锁定按钮不可点击
      onLockHook();
      // 单据id存在，直接提交审批单
      if (orderId) {
        await update({
          ...values,
          id: transacId,
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
        // 先创建提交单据，再提交审批单
        try {
          await create({
            ...values,
            flowId: flowVal,
            departmentId: isSelf ? values.departmentId : departmentId,
            postId: isSelf ? values.postId : employeeInfo.postId,
            entryDate: employeeInfo.entryDate,
            actualHandoverEmployeeId: isSelf ? ownerId : values.actualHandoverEmployeeId,
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
        const res = orderId ? await update({
          ...values,
          id: transacId,
          departmentId: isSelf ? values.departmentId : departmentId,
          postId: isSelf ? values.postId : employeeInfo.postId,
          entryDate: employeeInfo.entryDate,
          actualHandoverEmployeeId: isSelf ? ownerId : values.actualHandoverEmployeeId,
          onCreateSuccess: id => onCreateSuccess({ id, onErrorCallback: onUnsaveHook }),
          onErrorCallback: onUnsaveHook,
        }) : await create({
          ...values,
          flowId: flowVal,
          departmentId: isSelf ? values.departmentId : departmentId,
          postId: isSelf ? values.postId : employeeInfo.postId,
          entryDate: employeeInfo.entryDate,
          actualHandoverEmployeeId: isSelf ? ownerId : values.actualHandoverEmployeeId,
          onCreateSuccess: id => onCreateSuccess({ id, onErrorCallback: onUnsaveHook }),
          onErrorCallback: onUnsaveHook,
        });
        if (res) {
          res._id && (setTransacId(res._id));
          res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
          onUnsaveHook();
          return;
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
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 2 }}
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
    <Form
      {...FormLayout}
      form={form}
      initialValues={{
        jobHandoverType: OaApplicationJobHandoverType.resign,
        resignDate: moment(),
      }}
    >
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          isSelf={isSelf}
          departmentId={departmentFlowId}
          rank={rank}
          flowId={query.flow_id}
          postId={query.post_id}
          pageType={107}
          accountId={actualId}
          setFlowId={setFlowId}
          specialAccountId={recipientId}
        />
      </CoreContent>

      {/* 渲染关联审批组件 */}
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }

      {/* 渲染基本信息 */}
      <CoreContent title="基本信息">
        <CoreForm items={employeeInfoFormItems} />
        <Alert type="warning" showIcon message="若为【离职交接】，建议关联离职申请单" />
      </CoreContent>

      {/* 渲染附件 */}
      <CoreContent title="拍照上传《工作交接单》">
        <CoreForm items={photoFormItems} cols={1} />
      </CoreContent>

      {/* 渲染抄送 */}
      {renderCopyGive()}

      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
}

const mapStateToProps = ({ oaCommon: { employeeDetail, accountDep, examineFlowInfo }, expenseExamineFlow: { newOaExamineList } }) => ({
  employeeDetail, // 员工信息
  accountDep,
  newOaExamineList,
  examineFlowInfo,
});

const mapDispatchToProps = dispatch => ({
  // 获取员工信息
  fetchEmployeeDetail: id => dispatch({
    type: 'oaCommon/fetchEmployeeDetail',
    payload: { id },
  }),
  // 清空员工信息
  clearEmployeeDetail: () => dispatch({ type: 'oaCommon/resetEmployeeDetail' }),
  // 创建工作交接单
  create: payload => dispatch({
    type: 'humanResource/createHandoverOrder',
    payload,
  }),
  update: payload => dispatch({
    type: 'humanResource/updateHandoverOrder',
    payload,
  }),
  getEmployeeDepAndPostInfo: payload => dispatch({
    type: 'oaCommon/getEmployeeDepAndPostInfo',
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

export default connect(mapStateToProps, mapDispatchToProps)(JobHandoverCreate);
