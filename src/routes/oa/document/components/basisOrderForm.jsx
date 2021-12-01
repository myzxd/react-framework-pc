/**
 * 基本信息（兼容旧版本form）
 */
import is from 'is_js';
import _ from 'lodash';
import { connect } from 'dva';
import React, { useCallback, useEffect, useState } from 'react';
import dot from 'dot-prop';
import { DeprecatedCoreForm, CoreContent } from '../../../../components/core';
import DepartmentFlow from '../components/form/departmentFlow';
import { PageComponentThemeTag, ComponentRenderFlowNames } from './index';
import PostFlow from '../components/form/postFlow';
import ExamineFlow from '../components/form/flow';
import { authorize } from '../../../../application';
import { PagesHelper } from '../define';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
function PageBaseInfo(props) {
  const {
    dispatch,
    isDetail,
    istBorrowing,
    form,
    isDepDetail, // 部门字段详情展示（创建）
    isPostDetail, // 岗位字段详情展示（创建）
    initField, // 前置选择的字段（部门，岗位）
    isShowFlow = true, // 是否显示审批流预览信息
    orderId, // 审批单id
    isThemeTagRequired = false, // 主体标签是否必填
    stampType, // 盖章类型
    accountDep,
    newOaExamineList,
    employeeDetail,
    is_self: isSelf,
    examineFlowInfo = [],  // 审批流列表
    isShowRequireTagTheme, // 是否显示主题标签
  } = props;
  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(undefined);
  // 岗位职级
  const [rank, setRank] = useState(undefined);
  useEffect(() => {
    if (isSelf === 'true') {
      dispatch({
        type: 'oaCommon/fetchEmployeeDetail',
        payload: { id: authorize.account.staffProfileId },
      });
    }
    return () => dispatch({ type: 'oaCommon/resetEmployeeDetail' });
  }, [dispatch, isSelf]);

  // 人员所属所有部门及岗位
  useEffect(() => {
    if (!isDetail || (!isDepDetail && !isPostDetail)) {
      dispatch({
        type: 'oaCommon/getEmployeeDepAndPostInfo',
        payload: { accountId: authorize.account.staffProfileId },
      });
    }
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

  // 重置岗位，职级信息
  const setJobForm = () => {
    form.setFieldsValue({ postId: undefined });
    setRank(undefined);
  };

  // 创建
  const renderCreate = () => {
    const detail = dot.get(props, 'departmentInformation', {});
    const departmentInfo = dot.get(detail, 'major_department_info', {});
    const majorInfo = dot.get(detail, 'major_job_info', {});
    const peopleInfo = istBorrowing ? '借阅人' : '申请人'; // 判断是否是合同借阅
    const examineList = dot.get(newOaExamineList, 'data', []);
    // 审批流部门id集合
    const filterDepartmentIds = examineList.map((item = {}) => {
      return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
    });
    // 将多维数组转为一维数组
    const departmentIds = _.flattenDeep(filterDepartmentIds);
    const depForm = !isDepDetail ?
    {
      label: '部门',
      span: 8,
      layout: { labelCol: { span: 4 }, wrapperCol: { span: 20 } },
      form: form.getFieldDecorator('departmentId', {
      })(
        <DepartmentFlow
          examineFlowDepartmentIds={departmentIds}
          setJobForm={setJobForm}
          setDepartmentId={setDepartmentFlowId}
          disabled={Boolean(orderId)}
        />,
      ),
    } :
    {
      label: '部门',
      span: 8,
      layout: { labelCol: { span: 4 }, wrapperCol: { span: 20 } },
      form: (
        dot.get(initField, 'major_department_info.name', undefined) ?
          dot.get(initField, 'major_department_info.name', undefined) :
        dot.get(departmentInfo, 'name', '--')
      ),
    };

    const postForm = !isPostDetail ? {
      label: '岗位',
      span: 8,
      layout: { labelCol: { span: 4 }, wrapperCol: { span: 20 } },
      form: form.getFieldDecorator('postId', {})(
        <PostFlow
          departmentId={departmentFlowId}
          setRank={setRank}
          disabled={Boolean(orderId)}
        />,
      ),
    } : {
      label: '岗位',
      span: 8,
      layout: { labelCol: { span: 4 }, wrapperCol: { span: 20 } },
      form: (
        dot.get(initField, 'major_job_info.name', undefined) ?
          dot.get(initField, 'major_job_info.name', undefined) :
        dot.get(majorInfo, 'name', '--')
      ),
    };

    const formItems = [
      {
        label: peopleInfo,
        span: 4,
        form: dot.get(detail, 'name', '--'),
      },
      depForm,
      postForm,
      {
        label: '职级',
        span: 4,
        form: rank,
      },
    ];
    return (
      <DeprecatedCoreForm layout={layout} items={formItems} cols={4} />
    );
  };

  // 详情
  const renderDetail = () => {
    const detail = dot.get(props, 'detail', {});
    const creatorInfo = dot.get(detail, 'creator_info', {});
    const departmentInfo = dot.get(detail, 'creator_department_info', {});
    const majorInfo = dot.get(detail, 'creator_job_info', {});
    const peopleInfo = istBorrowing ? '借阅人' : '申请人'; // 判断是否是合同借阅
    const formItems = [
      {
        label: peopleInfo,
        form: dot.get(creatorInfo, 'name', '--'),
      },
      {
        label: '部门',
        form: dot.get(departmentInfo, 'name', '--'),
      },
      {
        label: '岗位',
        form: dot.get(majorInfo, 'name', '--'),
      },
      {
        label: '职级',
        form: dot.get(majorInfo, 'rank', '--'),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} cols={4} />
    );
  };

  // 渲染展示信息
  const renderThemeTag = () => {
    // 详情不渲染主题标签
    if (isDetail) return <div />;

    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '主题标签',
        form: getFieldDecorator('themeTag', {
          rules: [{ required: isThemeTagRequired, message: '请填写主题标签' }],
        })(
          <PageComponentThemeTag placeholder="请填写主题标签" />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} cols={4} />
    );
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  // 是否展示原主题标签
  const renderShowThemeTag = () => {
    if (isShowRequireTagTheme) {
      return renderThemeTag();
    }
    return <React.Fragment />;
  };

  // 渲染审批预览
  const renderFlow = useCallback(() => {
    if (isShowFlow) {
      return (
        <CoreContent title="流程预览" titleExt={renderFlowNames()}>
          <ExamineFlow
            stampType={stampType}
            isSelf={isSelf === 'true'}
            departmentId={departmentFlowId}
            rank={rank}
            accountId={authorize.account.id}
            {...props}
          />
          {/* 是否展示原主题标签 */}
          {renderShowThemeTag()}
        </CoreContent>
      );
    }
    return <React.Fragment />;
  }, [departmentFlowId, examineFlowInfo, props.specialAccountId, props.specialDepartmentId]);

  const renderBaseInfo = () => {
    // 如果存在展示详情
    if (isDetail) {
      return renderDetail();
    }
    // 否则展示创建
    return renderCreate();
  };
  return (
    <React.Fragment>
      {/* 渲染审批预览 */}
      {renderFlow()}
      <CoreContent title="基本信息">
        {renderBaseInfo()}
      </CoreContent>
    </React.Fragment>
  );
}
function mapStateToProps({ oaCommon: { employeeDetail, accountDep, departmentInformation, examineFlowInfo },
  expenseExamineFlow: { newOaExamineList } }) {
  return {
    departmentInformation,
    employeeDetail,
    accountDep,
    newOaExamineList,
    examineFlowInfo,
  };
}
export default connect(mapStateToProps)(PageBaseInfo);
