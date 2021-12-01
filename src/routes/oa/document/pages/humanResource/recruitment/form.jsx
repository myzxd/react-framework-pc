/**
 * 人事类 - 招聘申请 - 创建/编辑
 **/
import React, { useState, useRef, useEffect } from 'react';
import is from 'is_js';
import { connect } from 'dva';
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  message,
} from 'antd';

import { CommonModalCopyGive } from '../../../../../../components/common';
import { CoreContent, CoreForm } from '../../../../../../components/core';

import { cryptoRandomString } from '../../../../../../application/utils';
import { HighestEducation, Gender, ApprovalDefaultParams } from '../../../../../../application/define';
import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  OrganizationJobSelect,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';
import { authorize } from '../../../../../../application';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const textAreaLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 12,
  },
};

// 日期选择范围限制
const disabledDate = (current) => {
  // 创建日当日及以后
  return current && current < moment().endOf('day').subtract(1, 'days');
};

const RecruitmentForm = ({ query, staffs, recruitmentDetail, dispatch }) => {
  const [form] = Form.useForm();
  const [departmentObj, setDepartmentObj] = useState({});
  // 部门组件namespace
  const intervalRef = useRef(cryptoRandomString(32));
  // 是否是编辑状态
  const isUpdate = useRef(Boolean(dot.get(query, 'id', false)));

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // 岗位id
  const { post_id: postId } = query;

  // 获取岗位信息
  useEffect(() => {
    // 如果是编辑页面
    if (isUpdate.current) {
      const departmentId = dot.get(recruitmentDetail, 'department_id', '');
      // 获取岗位信息
      dispatch({ type: 'applicationCommon/fetchStaffs', payload: { namespace: intervalRef.current, departmentId } });
    } else {
      // 如果是创建页面
      const departmentId = dot.get(query, 'department_id', '');
      dispatch({ type: 'applicationCommon/fetchStaffs', payload: { namespace: intervalRef.current, departmentId } });
    }


    () => {
      return dispatch({ type: 'applicationCommon/resetStaffs', payload: { namespace: intervalRef.current } });
    };
  }, [recruitmentDetail]);

  // 创建 编辑 都需要设置岗位编制 和占编 需要请求岗位信息接口
  // 创建 通过query 拿到 postId 获取岗位职级信息
  // 编辑页面 需要获取招聘需求详情 拿到job_id 获取岗位职级信息
  useEffect(() => {
    if (is.empty(staffs)) return;
    const { data = [] } = staffs[intervalRef.current] || {};
    if (isUpdate.current) {
    // 编辑页面
      if (is.empty(recruitmentDetail) || is.not.existy(recruitmentDetail.job_id)) return;
      const currentData = data.find(item => item.job_id === recruitmentDetail.job_id);
      // 设置岗位信息
      setDepartmentObj(currentData);
    } else {
      // 创建页面
      if (is.not.existy(postId)) return;
      const currentData = data.find(item => item.job_id === postId);
      // 设置岗位信息
      setDepartmentObj(currentData);
    }
  }, [staffs, recruitmentDetail]);

  useEffect(() => {
    async function fetchDate() {
      if (isUpdate.current) {
        // 获取招聘需求详情
        const res = await dispatch({
          type: 'humanResource/getRecruitmentDetail',
          payload: { id: query.id },
        });
        const {
          // department_id: initialDepartment = undefined,     // 部门id
          job_id: initialJob = undefined,                   // 岗位id
          report_job_info,                                  // 汇报上级信息
          work_address: initialAddress = '',                // 工作地点
          demand_num: initialNeedNum = '',                  // 需求人数
          entry_date: initialDate = null,                   // 到职日期
          gender_id: initialSex = undefined,                // 性别
          age: initialAge = '',                             // 年龄
          foreign_language: initialForeignLanguage = '',    // 外语
          education: initialEducation = undefined,          // 学历
          position_statement: initialResponsibilities = '', // 岗位职责
          qualification: initialDemand = '',                // 任职要求
          other_requirement: initialOther = '',             // 其它要求
          professional: initialMajor = undefined,           // 专业
          work_years: initialWorkingYears = undefined,      // 工作年限
        } = res;
        // 汇报上级
        const initialSuperior = dot.get(report_job_info, '_id', undefined);
        // 设置表单值
        form.setFieldsValue({
          // department: initialDepartment,
          podepartmentJobRelationId: initialJob,
          superior: initialSuperior,
          address: initialAddress,
          needNum: initialNeedNum,
          date: initialDate && moment(`${initialDate}`),
          sex: initialSex,
          age: initialAge,
          foreignLanguage: initialForeignLanguage,
          education: initialEducation,
          responsibilities: initialResponsibilities,
          demand: initialDemand,
          other: initialOther,
          major: initialMajor,
          workingYears: initialWorkingYears,
          uploadFiled: PageUpload.getInitialValue(res, 'asset_infos'), // 附件信息
        });
        setDepartmentFn(initialJob);
      }
    }
    fetchDate();
  }, []);

  useEffect(() => {
    if (is.not.empty(staffs) && is.not.empty(recruitmentDetail)) {
      setDepartmentFn(recruitmentDetail.job_id);
    }
  }, [staffs, recruitmentDetail]);

  // 提交（创建）
  const onSubmit = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const values = await form.validateFields();
    const { organization_count: organizationCount, organization_num: organizationNum } = departmentObj;
    const deltaNum = organizationCount - organizationNum;
    if (values.needNum > deltaNum) {
      return message.error('需求人数不能大于岗位编制数减去占编人数的差');
    }
    onLockHook();

    if (orderId) {
      await dispatch({
        type: 'humanResource/updateRecruitment',
        payload: {
          id: transacId,
          ...values,
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
        },
      });
    } else {
      await dispatch({
        type: 'humanResource/createRecruitment',
        payload: {
          ...values,
          flowId: flowVal,
          department: dot.get(query, 'department_id', ''),          // 部门id
          podepartmentJobRelationId: dot.get(query, 'post_id', ''), // 岗位id
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
        },
      });
    }
  };

  // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
    // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    dispatch({
      type: 'oaCommon/submitOrder',
      payload: {
        ...values,
        id: oId,
        // 判断是否是创建，创建提示提示语
        isOa: orderId ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      },
    });
  };

  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ id, values, oId, onDoneHook, onErrorCallback }) => {
   // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if ((is.empty(parentIds) || isUpdate.current)) {
    // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
    dispatch({
      type: 'humanResource/fetchApproval',
      payload: {
        id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      },
    });
  };


  // 保存操作
  const onSave = async ({ onSaveHook, onUnsaveHook }) => {
    const values = await form.validateFields();
    const { organization_count: organizationCount, organization_num: organizationNum } = departmentObj;
    const deltaNum = organizationCount - organizationNum;
    if (values.needNum > deltaNum) {
      return message.error('需求人数不能大于岗位编制数减去占编人数的差');
    }
    onSaveHook();

    const res = orderId ? await dispatch({
      type: 'humanResource/updateRecruitment',
      payload: {
        id: transacId,
        ...values,
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnsaveHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnsaveHook,
      },
    }) : await dispatch({
      type: 'humanResource/createRecruitment',
      payload: {
        ...values,
        flowId: flowVal,
        department: dot.get(query, 'department_id', ''),          // 岗位id
        podepartmentJobRelationId: dot.get(query, 'post_id', ''), // 部门id
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnsaveHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnsaveHook,
      },
    });

    if (res && res._id) {
      setTransacId(res._id);
      setOrderId(res.oa_application_order_id);
      onUnsaveHook();
    }
  };

  // 提交（编辑）
  const onUpdate = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const values = await form.validateFields();
    const { organization_count: organizationCount, organization_num: organizationNum } = departmentObj;
    const deltaNum = organizationCount - organizationNum;
    if (values.needNum > deltaNum) {
      return message.error('需求人数不能大于岗位编制数减去占编人数的差');
    }
    onLockHook();
    const res = await dispatch({
      type: 'humanResource/updateRecruitment',
      payload: {
        id: query.id,
        ...values,
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnlockHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnlockHook,
      },
    });
    if (res && res._id) {
      onDoneHook();
      // return message.success('保存成功');
    }
  };

  // 设置岗位信息
  const setDepartmentFn = (podepartmentJobRelationId) => {
    const { data = [] } = staffs[intervalRef.current] || {};
    const currentData = data.find(item => item.job_id === podepartmentJobRelationId);
    setDepartmentObj(currentData);
  };


  const renderDemand = () => {
    const formItems = [
      {
        item: [
          <Form.Item
            key="department"
            label="招聘部门"
          >
            {
              isUpdate.current
              ? <span>{dot.get(recruitmentDetail, 'department_info.name', '--')}</span>
              : <span>{dot.get(query, 'department_name', '--')}</span>
            }
          </Form.Item>,
          <Form.Item
            name="podepartmentJobRelationId"
            label="岗位名称"
            rules={[{ required: false, message: '请选择' }]}
          >
            {
              isUpdate.current ?
                <span>{dot.get(recruitmentDetail, 'job_info.name', '--')}</span>
              :
                <span>{dot.get(query, 'post_name', '--')}</span>
            }
          </Form.Item>,
          <Form.Item
            label="岗位编制数"
          >
            <span>{dot.get(departmentObj, 'organization_count', '--')}</span>
          </Form.Item>,
          <Form.Item
            label="占编人数"
          >
            <span>{dot.get(departmentObj, 'organization_num', '--')}</span>
          </Form.Item>,
          <Form.Item
            label="职级"
          >
            {
             isUpdate.current ?
               <span>{dot.get(recruitmentDetail, 'job_info.rank', '--')}</span>
             :
               <span>{dot.get(query, 'rank_name', '--')}</span>
           }
          </Form.Item>,
          <Form.Item
            name="superior"
            label="汇报上级"
            rules={[{ required: true, message: '请选择' }]}
          >
            <OrganizationJobSelect
              showSearch
              optionFilterProp="children"
              placeholder="请选择"
            />
          </Form.Item>,
          <Form.Item
            name="address"
            label="工作地点"
          >
            <Input placeholder="请输入" />
          </Form.Item>,
          <Form.Item
            name="needNum"
            label="需求人数"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber
              min={1}
              precision={0}
              placeholder="请输入"
            />
          </Form.Item>,
          <Form.Item
            name="date"
            label="期望到职日期"
            rules={[{ required: true, message: '请选择' }]}
          >
            <DatePicker
              showToday={false}
              disabledDate={disabledDate}
              placeholder="请选择"
            />
          </Form.Item>,
          <Form.Item
            name="sex"
            label="性别"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select placeholder="请选择">
              <Option value={Gender.male}>{Gender.description(Gender.male)}</Option>
              <Option value={Gender.female}>{Gender.description(Gender.female)}</Option>
              <Option value={Gender.unlimited}>{Gender.description(Gender.unlimited)}</Option>
            </Select>
          </Form.Item>,
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>,
          <Form.Item
            name="foreignLanguage"
            label="外语"
          >
            <Input placeholder="请输入" />
          </Form.Item>,
          <Form.Item
            name="education"
            label="学历(及以上)"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select placeholder="请选择">
              <Option value={HighestEducation.doctor}>{HighestEducation.description(HighestEducation.doctor)}</Option>
              <Option value={HighestEducation.master}>{HighestEducation.description(HighestEducation.master)}</Option>
              <Option value={HighestEducation.undergraduate}>{HighestEducation.description(HighestEducation.undergraduate)}</Option>
              <Option value={HighestEducation.juniorCollege}>{HighestEducation.description(HighestEducation.juniorCollege)}</Option>
              <Option value={HighestEducation.secondary}>{HighestEducation.description(HighestEducation.secondary)}</Option>
              <Option value={HighestEducation.highSchool}>{HighestEducation.description(HighestEducation.highSchool)}</Option>
              <Option value={HighestEducation.juniorHighSchool}>{HighestEducation.description(HighestEducation.juniorHighSchool)}</Option>
            </Select>
          </Form.Item>,
          <Form.Item
            name="major"
            label="专业"
          >
            <Input placeholder="请输入" />
          </Form.Item>,
          <Form.Item
            name="workingYears"
            label="工作年限"
          >
            <Input placeholder="请输入" />
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            name="responsibilities"
            label="岗位职责"
            rules={[{ required: true, message: '请输入' }]}
          >
            <TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            name="demand"
            label="任职要求"
            rules={[{ required: true, message: '请输入' }]}
          >
            <TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            name="other"
            label="其他要求"
            rules={[{ required: true, message: '请输入' }]}
          >
            <TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            name="uploadFiled"
            label="上传附件"
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
          </Form.Item>,
        ],
      },
    ];
    return (
      <React.Fragment>
        {
          formItems.map((cur, idx) => {
            return (
              <CoreForm key={idx} items={cur.item} cols={cur.col || 4} />
            );
          })
        }
      </React.Fragment>
    );
  };

  // 抄送人
  const renderCopyGive = () => {
    if (query.id) return null;
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

  // 部门id
  const useDepartmentId = isUpdate.current ?
    dot.get(recruitmentDetail, 'creator_department_info._id', undefined)
  : dot.get(query, 'department_id', undefined);

  // 人员id
  const useAccountId = isUpdate.current ?
    dot.get(recruitmentDetail, 'creator_info._id', undefined)
  : authorize.account.id;

   // 渲染关联审批组件
  const renderComponentRelatedApproval = () => {
    // 如果是创建页面显示 关联审批和主题标签
    // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
    if (dot.get(isUpdate, 'current') === true) {
      return (<React.Fragment />);
    }
    return <ComponentRelatedApproval setParentIds={setParentIds} />;
  };

  return (
    <Form
      form={form}
      {...layout}
    >
      {/* 渲染基础信息 */}
      <PageBaseInfo
        isDetail={isUpdate.current}
        detail={recruitmentDetail}
        flowId={query.flow_id}
        pageType={101}
        special
        isDepDetail
        isPostDetail
        form={form}
        setFlowId={setFlowId}
        departmentId={useDepartmentId}
        specialDepartmentId={useDepartmentId}
        accountId={useAccountId}
        queryPostId={postId}
      />
      {/* 渲染关联审批组件 */}
      {renderComponentRelatedApproval()}
      <CoreContent title="招聘需求">
        {/* 渲染招聘需求 */}
        {renderDemand()}
      </CoreContent>
      {/* 渲染抄送 */}
      {renderCopyGive()}
      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate={isUpdate.current}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onSave={onSave}
      />
    </Form>
  );
};

RecruitmentForm.propTypes = {
  query: PropTypes.object,             // 路由参数
  staffs: PropTypes.object,            // 岗位信息
  recruitmentDetail: PropTypes.object, // 招聘申请单详情数据
};
RecruitmentForm.defaultProps = {
  staffs: {},
  recruitmentDetail: {},
};

function mapStateToProps({ applicationCommon: { staffs }, humanResource: { recruitmentDetail } }) {
  return { staffs, recruitmentDetail };
}

export default connect(mapStateToProps)(RecruitmentForm);
