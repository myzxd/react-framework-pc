/**
 * 基本信息
 */
import is from 'is_js';
import _ from 'lodash';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import dot from 'dot-prop';
import { Form } from 'antd';

import { ComponentRenderFlowNames } from './index';
import { CoreForm, CoreContent } from '../../../../components/core';
import DepartmentFlow from '../components/form/departmentFlow';
import PostFlow from '../components/form/postFlow';
import ExamineFlow from '../components/form/flow';
import { authorize } from '../../../../application';
import { PagesHelper } from '../define';

const FormItem = Form.Item;

function PageBaseInfo(props) {
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  const {
    dispatch,
    isDetail,
    istBorrowing,
    form,
    isDepDetail, // 部门字段详情展示（创建）
    isPostDetail, // 岗位字段详情展示（创建）
    initField, // 前置选择的字段（部门，岗位）
    departmentId,
    isShowFlow = true, // 是否显示审批流预览信息
    accountId,
    orderId, // 审批单id
    accountDep,
    newOaExamineList,
    employeeDetail,
    is_self: isSelfStr,
    examineFlowInfo = [], // 审批流列表
    queryPostId, // 岗位id
    borrowType,
  } = props;
  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(departmentId);
  // 岗位职级
  const [rank, setRank] = useState(undefined);

  let isSelf = false; // 是否是本人提报
  if (isSelfStr === 'true') {
    isSelf = true;
  }
  useEffect(() => {
    if (isSelf) {
      dispatch({
        type: 'oaCommon/fetchEmployeeDetail',
        payload: { id: authorize.account.staffProfileId },
      });
    }
    return () => dispatch({ type: 'oaCommon/resetEmployeeDetail' });
  }, [dispatch, isSelf]);

  // 人员所属所有部门及岗位
  useEffect(() => {
    dispatch({
      type: 'oaCommon/getEmployeeDepAndPostInfo',
      payload: { accountId: authorize.account.staffProfileId },
    });
  }, []);

  useEffect(() => {
    // 判断是否是详情，详情不需请求接口
    if (!isDetail) {
      dispatch({ type: 'oaCommon/fetchDepartmentInformation', payload: {} });
    }
    return () => {
      dispatch({ type: 'oaCommon/reduceDepartmentInformation', payload: {} });
    };
  }, [dispatch, isDetail]);

  useEffect(() => {
    // 本人提报&&创建
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


  // 重置岗位信息，职级信息
  const setJobForm = () => {
    form.setFieldsValue({ postId: undefined });
    setRank(undefined);
  };

  // 创建
  const renderCreate = () => {
    const examineList = dot.get(newOaExamineList, 'data', []);
    // 审批流部门id集合
    const filterDepartmentIds = examineList.map((item = {}) => {
      return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
    });
    // 将多维数组转为一维数组
    const departmentIds = _.flattenDeep(filterDepartmentIds);
    const detail = dot.get(props, 'departmentInformation', {});
    const departmentInfo = dot.get(detail, 'major_department_info', {});
    const majorInfo = dot.get(detail, 'major_job_info', {});
    const peopleInfo = istBorrowing ? '借阅人' : '申请人'; // 判断是否是合同借阅
    const formItems = [
      <FormItem label={peopleInfo} {...layout}>
        {dot.get(detail, 'name', '--')}
      </FormItem>,
      !isDepDetail ? (
        <FormItem label="部门" name="departmentId" {...layout}>
          <DepartmentFlow
            examineFlowDepartmentIds={departmentIds}
            setJobForm={setJobForm}
            setDepartmentId={setDepartmentFlowId}
            disabled={Boolean(orderId)}
          />
        </FormItem>
      ) : (
        <FormItem label="部门" {...layout}>
          {
            dot.get(initField, 'major_department_info.name', undefined) ?
              dot.get(initField, 'major_department_info.name', undefined) :
            dot.get(departmentInfo, 'name', '--')
          }
        </FormItem>
      ),
      !isPostDetail ? (
        <FormItem label="岗位" name="postId" {...layout}>
          <PostFlow
            departmentId={departmentFlowId}
            setRank={setRank}
            disabled={Boolean(orderId)}
          />
        </FormItem>
      ) : (
        <FormItem label="岗位" {...layout}>
          {
            dot.get(initField, 'major_job_info.name', undefined) ?
              dot.get(initField, 'major_job_info.name', undefined) :
            dot.get(majorInfo, 'name', '--')
          }
        </FormItem>
      ),
      <FormItem label="职级" {...layout}>
        {isPostDetail ? dot.get(majorInfo, 'rank', undefined) : rank}
      </FormItem>,
    ];
    return (
      <CoreForm items={formItems} cols={4} />
    );
  };

  // 详情
  const renderDetail = () => {
    // 版本兼容，详情不显示
    if (isDetail) return <div />;
    const detail = dot.get(props, 'detail', {});
    const creatorInfo = dot.get(detail, 'creator_info', {});
    const departmentInfo = dot.get(detail, 'creator_department_info', {});
    const majorInfo = dot.get(detail, 'creator_job_info', {});
    const peopleInfo = istBorrowing ? '借阅人' : '申请人'; // 判断是否是合同借阅
    const formItems = [
      <FormItem label={peopleInfo} {...layout}>
        {dot.get(creatorInfo, 'name', '--')}
      </FormItem>,
      <FormItem label="部门" {...layout}>
        {dot.get(departmentInfo, 'name', '--')}
      </FormItem>,
      <FormItem label="岗位" {...layout}>
        {dot.get(majorInfo, 'name', '--')}
      </FormItem>,
      <FormItem label="职级" {...layout}>
        {dot.get(majorInfo, 'rank', '--')}
      </FormItem>,
    ];
    return (
      <CoreForm items={formItems} cols={4} />
    );
  };


  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  // 渲染审批预览
  const renderFlow = () => {
    // 是否显示审批预览
    if (isShowFlow) {
      return (
        <CoreContent title="流程预览" titleExt={renderFlowNames()}>
          <ExamineFlow
            rank={rank}
            isSelf={isSelf}
            {...props}
            departmentId={departmentFlowId || departmentId}
            accountId={accountId || authorize.account.id}
            postId={queryPostId}
            borrowType={borrowType}
          />
        </CoreContent>
      );
    }
    return <React.Fragment />;
  };

  // 渲染基本信息
  const renderBaseInfo = () => {
    if (!isDetail) {
      return (
        <CoreContent title="基本信息">
          {isDetail ? renderDetail() : renderCreate()}
        </CoreContent>
      );
    }
    return <React.Fragment />;
  };
  return (
    <React.Fragment>
      {/* 渲染审批预览 */}
      {renderFlow()}
      {/* 版本兼容，详情不显示 */}
      {renderBaseInfo()}
    </React.Fragment>
  );
}
function mapStateToProps({
  oaCommon: { employeeDetail, accountDep, departmentInformation, examineFlowInfo },
  expenseExamineFlow: { newOaExamineList } }) {
  return {
    departmentInformation,
    employeeDetail,
    newOaExamineList,
    accountDep,
    examineFlowInfo,
  };
}
export default connect(mapStateToProps)(PageBaseInfo);
