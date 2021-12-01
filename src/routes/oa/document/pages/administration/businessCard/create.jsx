/**
 * 行政类 - 名片申请 - 新增 /Oa/Document/Pages/Administration/Business/Create
 */
import is from 'is_js';
import _ from 'lodash';
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, {
  useState,
  useEffect,
} from 'react';
import {
  Input,
  InputNumber,
  DatePicker,
  Form,
} from 'antd';

import { authorize } from '../../../../../../application';
import { ApprovalDefaultParams } from '../../../../../../application/define';
import KeepingSelect from '../components/keepingSelect';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { PageFormButtons, PageUpload, FixedCopyGiveDisplay, ComponentRelatedApproval, ComponentRenderFlowNames } from '../../../components/index';
import DepartmentFlow from '../../../components/form/departmentFlow';
import PostFlow from '../../../components/form/postFlow';
import ExamineFlow from '../../../components/form/flow';
import { PagesHelper } from '../../../define';

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const CreateBusinessCard = (props) => {
  const { id, name, staffProfileId } = authorize.account || {};
  const { dispatch, query = {}, keepingList, departmentInformation,
    employeeDetail,
    newOaExamineList,
    accountDep,
    examineFlowInfo = [],
  } = props;
  const { is_self: isSelf, department_id, department_name } = query;

  // 部门&岗位详情信息
  const [personState, setPersonState] = useState({});

  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(undefined);
  // 岗位表单id
  const [rank, setRank] = useState(undefined);

  // 初始化实际申请人id
  const initActualId = isSelf === 'true' ? staffProfileId : undefined;
  // 实际申请人id
  const initAccountId = isSelf === 'true' ? id : undefined;
  // 实际申请人
  const [actualId, setActualId] = useState(initActualId);
  // 实际申请人
  const [accountId, setAccountId] = useState(initAccountId);

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (isSelf === 'true') {
      dispatch({ type: 'oaCommon/fetchDepartmentInformation', payload: {} });
      return () => {
        dispatch({ type: 'oaCommon/reduceDepartmentInformation', payload: {} });
      };
    }
  }, [dispatch, isSelf]);

  useEffect(() => {
    if (isSelf === 'true') {
      dispatch({
        type: 'oaCommon/fetchEmployeeDetail',
        payload: { id: authorize.account.staffProfileId },
      });
    }
    return () => dispatch({ type: 'oaCommon/resetEmployeeDetail' });
  }, [dispatch, isSelf]);

  useEffect(() => {
    // 本人提报&&创建,部门&岗位使用表单
    if (isSelf === 'true' && is.existy(employeeDetail) && is.not.empty(employeeDetail)
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
        setPersonState({
          major_department_info: dot.get(employeeDetail, 'major_department_info', {}),
          major_job_info: dot.get(employeeDetail, 'major_job_info', {}),
        });
        setDepartmentFlowId(majorDepartmentId);
        setRank(majorJobRank);
        form.setFieldsValue({
          department: majorDepartmentId,
          job: dot.get(employeeDetail, 'major_job_info._id', undefined),
        });
        return;
      }

      // 获取副部门数据，过滤主部门
      const deputyDepartmentList = dot.get(accountDep, 'postList', []).filter(item => dot.get(item, 'department_info._id', undefined) !== majorDepartmentId);
      // 副部门id集合
      const deputyDepartmentIds = deputyDepartmentList.map(item => dot.get(item, 'department_info._id', undefined));
      const examineItem = PagesHelper.pageCommonTerminateForEach(examineList, deputyDepartmentList, deputyDepartmentIds);
      if (is.existy(examineItem) && is.not.empty(examineItem)) {
        setPersonState({
          major_department_info: examineItem.departmentInfo,
          major_job_info: examineItem.jobInfo,
        });
        setDepartmentFlowId(examineItem.departmentId);
        setRank(examineItem.rank);
        form.setFieldsValue({
          department: examineItem.departmentId,
          job: examineItem.jobId,
        });
      }
    }
  }, [employeeDetail, isSelf, accountDep, newOaExamineList]);

  useEffect(() => {
    if (isSelf === 'false') {
      let flag = true;
      keepingList.map((item) => {
        if (item.account_id === id) {
          setPersonState(item);
          flag = false;
          form.setFieldsValue({ applyMan: id });
          setActualId(item._id);
          setAccountId(item.account_id);
        }
      });

      if (flag) {
        setPersonState({
          major_department_info: {
            name: department_name,
            _id: department_id,
          },
          major_job_info: {},
        });

        // 部门表单id（岗位表单使用）
        setDepartmentFlowId(department_id);
      }
    }
  }, [keepingList, departmentInformation]);

  // 实际申请人所属所有部门及岗位
  useEffect(() => {
    actualId && dispatch({
      type: 'oaCommon/getEmployeeDepAndPostInfo',
      payload: { accountId: actualId },
    });
  }, [dispatch, actualId]);

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'administration/updateBusinessCard' : 'administration/createBusinessCard';
    onSubmitTranOrder(
      type,
      {
        callback: (res, callback) => {
          onSubmitOrderRec(res, callback, callbackObj.onUnlockHook);
        },
        onErrorCallback: callbackObj.onUnlockHook,
        onSuccessCallback: callbackObj.onDoneHook,
        onLockHook: callbackObj.onLockHook,
      },
    );
  };

    // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
      // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    dispatch({ type: 'oaCommon/submitOrder',
      payload: {
        ...values,
        id: oId,
        // 判断是否是创建，创建提示提示语
        isOa: orderId ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      } });
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
    dispatch({ type: 'humanResource/fetchApproval',
      payload: {
        id: _id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      } });
  };

  // 保存操作
  const onSave = (callbackObj) => {
    // 根据单据提交状态调用对应接口
    const type = orderId ?
      'administration/updateBusinessCard'
      : 'administration/createBusinessCard';

    onSubmitTranOrder(
      type,
      {
        callback: (res) => {
          onSubmitTranRec(res, callbackObj.onUnsaveHook);
        },
        onErrorCallback: callbackObj.onUnsaveHook,
        onLockHook: callbackObj.onSaveHook,
      },
    );
  };

  // 提交事务性单据
  const onSubmitTranOrder = async (type, callbackObj) => {
    const formValues = await form.validateFields();
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type,
      payload: {
        ...formValues,  // 单据参数
        flowId: orderId ? undefined : flowVal,
        id: transacId, // 单据id
        // 实际申请人（本人提报时用账户信息，他人提报时用表单值）
        applyMan: isSelf === 'true' ? id : formValues.applyMan,

        // 部门（本人提报时使用表单值，他人提报时使用传入值）
        department: isSelf === 'true' ?
          formValues.department
          : dot.get(personState, 'major_department_info._id', undefined),

        job: isSelf === 'true' ?
          formValues.job
          : dot.get(personState, 'major_job_info._id', undefined),
        onSuccessCallback: res => callbackObj.callback(res, callbackObj.onSuccessCallback),
        onErrorCallback: callbackObj.onErrorCallback,
      },
    });
  };

  // 提交事务性单据回调
  const onSubmitTranRec = (res, onErrorCallback) => {
    res._id && (setTransacId(res._id));
    res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
    const params = {
      _id: res.oa_application_order_id,
      onErrorCallback,
    };
    onErrorCallback();
    onCreateSuccess(params);
  };

  // 提交审批单回调
  const onSubmitOrderRec = async (res, callback, onErrorCallback) => {
    const formValues = await form.validateFields();
    const params = {
      _id: res.oa_application_order_id,
      values: formValues,
      oId: res.oa_application_order_id,
      onDoneHook: callback,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 改变申请人
  const onChangeKeeping = (val, obj) => {
    const job = dot.get(obj, 'major_job_info._id', undefined);
    const departmentId = dot.get(obj, 'major_department_info._id', undefined);
    form.setFieldsValue({ job, departmentId });
    setPersonState(obj);
    setAccountId(obj.account_id);
    // 实际申请人id
    setActualId(obj._id);
  };

  // 不可选的需求时间
  const disabledDate = (current) => {
    return current && current < moment().subtract(1, 'days');
  };

  // 渲染申请信息
  const renderApplyInfo = () => {
    const { department_id: departmentId } = query;
    const examineList = dot.get(newOaExamineList, 'data', []);
    // 审批流部门id集合
    const filterDepartmentIds = examineList.map((item = {}) => {
      return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
    });
    // 将多维数组转为一维数组
    const departmentIds = _.flattenDeep(filterDepartmentIds);
    const formItems = [
      <Form.Item
        label="部门"
        name="department"
        {...formLayoutC3}
      >
        {
          isSelf === 'false' ? (
            dot.get(personState, 'major_department_info.name', '--')
          ) : (<DepartmentFlow
            examineFlowDepartmentIds={departmentIds}
            setJobForm={() => form.setFieldsValue({ job: undefined })}
            setDepartmentId={setDepartmentFlowId}
            disabled={Boolean(orderId)}
          />)
        }
      </Form.Item>,
      <Form.Item
        label="岗位"
        name="job"
        {...formLayoutC3}
      >
        <PostFlow
          departmentId={departmentFlowId}
          setRank={setRank}
          disabled={Boolean(orderId)}
        />
        {/* dot.get(personState, 'major_job_info.name', '--') */}
      </Form.Item>,
      <Form.Item
        label="名片职务职称"
        name="jobTitle"
        rules={[{ required: true, message: '请输入名片职务职称' }]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="名片姓名"
        name="cardName"
        rules={[{ required: true, message: '请输入名片姓名' }]}
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="英文名"
        name="nameEn"
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="手机"
        name="phone"
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
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="公司网址"
        name="website"
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="办公地址"
        name="address"
        {...formLayoutC3}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="申请数量(盒)"
        name="num"
        rules={[{ required: true, message: '请输入申请盒数' }]}
        {...formLayoutC3}
      >
        <InputNumber placeholder="请输入" precision={0} min={1} max={10000} />
      </Form.Item>,
      <Form.Item
        label="需求时间"
        name="time"
        rules={[{ required: true, message: '请输入需求时间' }]}
        {...formLayoutC3}
      >
        <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} placeholder="请选择" />
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="上传附件"
            name="fileList"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
          </Form.Item>
        ),
      },
    ];
    if (isSelf === 'true') {
      formItems.unshift(<Form.Item
        label="实际申请人"
        {...formLayoutC3}
      >
        {name}
      </Form.Item>);
    }
    if (isSelf === 'false') {
      formItems.unshift(
        <Form.Item
          label="实际申请人"
          name="applyMan"
          rules={[{ required: true, message: '请选择实际申请人' }]}
          {...formLayoutC3}
        >
          <KeepingSelect onChange={onChangeKeeping} departmentId={departmentId} />
        </Form.Item>,
      );
    }
    return (
      <CoreContent title="申请信息">
        <CoreForm items={formItems} />
      </CoreContent>
    );
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
    <Form form={form}>
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          isSelf={isSelf === 'true'}
          departmentId={departmentFlowId}
          rank={rank}
          flowId={query.flow_id}
          pageType={305}
          setFlowId={setFlowId}
          accountId={accountId}
          specialAccountId={actualId}
        />
      </CoreContent>
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }
      {/* 表单信息 */}
      {renderApplyInfo()}
      {/* 渲染抄送 */}
      {renderCopyGive()}
      {/* 渲染底部按钮 */}
      <PageFormButtons
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
};

function mapStateToProp({ administration: { keepingList },
  oaCommon: { employeeDetail, accountDep, departmentInformation, examineFlowInfo },
  expenseExamineFlow: { newOaExamineList } }) {
  return {
    keepingList,
    departmentInformation,
    employeeDetail,
    newOaExamineList,
    accountDep,
    examineFlowInfo,
  };
}

export default connect(mapStateToProp)(CreateBusinessCard);
