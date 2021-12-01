/**
 * 人事类 - 招聘申请 - 详情
 **/
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { Form } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { HighestEducation, Gender } from '../../../../../../application/define';
import { PageUpload } from '../../../components/index';

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

const RecruitmentDetail = ({
  query,
  recruitmentDetail,
  dispatch,
  oaDetail = {},
}) => {
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({
        type: 'humanResource/getRecruitmentDetail',
        payload: { isPluginOrder: true, oaDetail },
      });
    } else {
      // 获取招聘需求详情
      dispatch({
        type: 'humanResource/getRecruitmentDetail',
        payload: { id: query.id },
      });
    }
  }, []);

  const {
    department_info,                                  // 部门信息
    job_info,                                         // 岗位信息
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
  } = recruitmentDetail;

  const renderDemand = () => {
    const formItems = [
      <Form.Item
        {...layout}
        key="department"
        label="招聘部门"
      >
        {dot.get(department_info, 'name', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="podepartmentJobRelationId"
        label="岗位名称"
      >
        {dot.get(job_info, 'name', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="level"
        label="职级"
      >
        {dot.get(job_info, 'rank', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="superior"
        label="汇报上级"
      >
        {dot.get(report_job_info, 'name', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="address"
        label="工作地点"
      >
        <span className="noteWrap">{initialAddress || '--'}</span>
      </Form.Item>,
      <Form.Item
        {...layout}
        key="needNum"
        label="需求人数"
      >
        {initialNeedNum || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="date"
        label="期望到职日期"
      >
        {initialDate ? moment(`${initialDate}`).format('YYYYMMDD') : '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="sex"
        label="性别"
      >
        {initialSex ? Gender.description(Number(initialSex)) : '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="age"
        label="年龄"
      >
        {initialAge || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="foreignLanguage"
        label="外语"
      >
        {initialForeignLanguage || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="education"
        label="学历(及以上)"
      >
        {initialEducation ? HighestEducation.description(initialEducation) : '--'}
      </Form.Item>,
      <Form.Item {...layout} label="专业">
        {initialMajor || '--'}
      </Form.Item>,
      <Form.Item {...layout} label="工作年限">
        {initialWorkingYears || '--'}
      </Form.Item>,
    ];
    const formItemPost = [
      <Form.Item
        key="responsibilities"
        label="岗位职责"
        {...textAreaLayout}
      >
        <span className="noteWrap">{initialResponsibilities || '--'}</span>
      </Form.Item>,
    ];
    const formItemServe = [
      <Form.Item
        key="demand"
        label="任职要求"
        {...textAreaLayout}
      >
        <span className="noteWrap">{initialDemand || '--'}</span>
      </Form.Item>,
    ];
    const formItemOther = [
      <Form.Item
        key="other"
        label="其他要求"
        {...textAreaLayout}
      >
        <span className="noteWrap">{initialOther || '--'}</span>
      </Form.Item>,
    ];
    const formItemFiled = [
      <Form.Item
        {...textAreaLayout}
        key="uploadFiled"
        label="上传附件"
      >
        <PageUpload
          displayMode
          value={PageUpload.getInitialValue(recruitmentDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={4} />
        <CoreForm items={formItemPost} cols={1} />
        <CoreForm items={formItemServe} cols={1} />
        <CoreForm items={formItemOther} cols={1} />
        <CoreForm items={formItemFiled} cols={1} />
      </React.Fragment>
    );
  };

  return (
    <Form>
      <CoreContent title="招聘需求">
        {/* 渲染招聘需求 */}
        {renderDemand()}
      </CoreContent>
    </Form>
  );
};

RecruitmentDetail.propTypes = {
  query: PropTypes.object,             // 路由参数
  recruitmentDetail: PropTypes.object, // 招聘申请单详情数据
};
RecruitmentDetail.defaultProps = {
  recruitmentDetail: {},
};

function mapStateToProps({ humanResource: { recruitmentDetail } }) {
  return { recruitmentDetail };
}

export default connect(mapStateToProps)(RecruitmentDetail);
