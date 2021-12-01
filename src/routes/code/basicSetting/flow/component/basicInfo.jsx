/**
 * 事务性审批流详情页
 */
import is from 'is_js';
import React from 'react';
import {
  Empty,
  Form,
} from 'antd';
import {
  AffairsFlowHighestPostType,
  AffairsFlowMergeRule,
  CodeCostCenterType,
} from '../../../../../application/define';

import { CoreContent, CoreForm } from '../../../../../components/core';

// form layout
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } };

const BasicInfo = ({
  detail = {}, // 审批流详情
  originCodeList = {},
  originTeamList = {},
}) => {
  // 无数据
  if (Object.keys(detail).length < 1) {
    return (
      <CoreContent title="审批流详情设置">
        <Empty />
      </CoreContent>
    );
  }

  const {
    name, // 名称
    application_rule: applicationRule, // 合并审批规则
    cost_center_types: type = [], // 成本中心类型
    code_list: code = [], // code信息
    team_list: team = [], // team信息
    note, // 描述
    final_type: finalType, // 最高审批岗位类型
    final_approval_job_tags: finalApprovalJobTags = [], // 最高审批岗位标签列表
    final_approval_job_list: finalApprovalJobList = [], // 最高审批岗位岗位列表
  } = detail;

    // 最高审批岗位
  let highestPost = '--';
  if (Array.isArray(finalApprovalJobList) && finalApprovalJobList.length > 0) {
    highestPost = (
      <div>
        {AffairsFlowHighestPostType.description(finalType)}({finalApprovalJobList.map(i => i.name).join('、')})
        </div>
      );
  }

  if (Array.isArray(finalApprovalJobTags) && finalApprovalJobTags.length > 0) {
    highestPost = (
      <div>
        {AffairsFlowHighestPostType.description(finalType)}({finalApprovalJobTags.join('、')})
        </div>
      );
  }

  // 获取code initialValue
  const getInitialCodeValue = () => {
    const { code_list: interfaceValue = [] } = detail;
    // 全部
    if (interfaceValue.find(originValue => originValue._id === '*')) {
      return [{ _id: '*', name: '全部' }];
    }

    const originCodeValues = [].concat(...(Object.values(originCodeList)));
    // 获取数据，获取接口的数据
    const initValue = interfaceValue.map((v) => {
      // 过滤数据
      const filterList = originCodeValues.filter(j => j._id === v._id);
      return filterList[0] || {};
    });
    // 过滤空数据
    const filterValue = initValue.filter(v => is.existy(v) && is.not.empty(v));
    // 拼接数据
    return filterValue.map((v = {}) => {
      // 判断是否是否为空
      if (is.existy(v) && is.not.empty(v)) {
        return { _id: v._id, name: v.name };
      }
      return {};
    });
  };

  // 获取team initialValue
  const getInitialTeamValue = () => {
    const { team_list: interfaceValue = [] } = detail;
    // 全部
    if (interfaceValue.find(originValue => originValue._id === '*')) {
      return [{ _id: '*', name: '全部' }];
    }

    const originTeamValues = [].concat(...(Object.values(originTeamList)));
    // 获取数据，获取接口的数据
    const initValue = interfaceValue.map((v) => {
      // 过滤数据
      const filterList = originTeamValues.filter(j => j._id === v._id);
      return filterList[0] || {};
    });
    // 过滤空数据
    const filterValue = initValue.filter(v => is.existy(v) && is.not.empty(v));
    // 拼接数据
    return filterValue.map((v = {}) => {
      // 判断是否是否为空
      if (is.existy(v) && is.not.empty(v)) {
        return { _id: v._id, name: v.name };
      }
      return {};
    });
  };

  let applicationType = '';
  if (Array.isArray(type) && type.length > 0) {
    applicationType = (
      <React.Fragment>
        {/* 适用code */}
        {
          type.includes(CodeCostCenterType.code) && Array.isArray(code) ?
            (
              <Form.Item
                label="适用code"
                {...formLayout}
              >
                {
                  (Array.isArray(code) && code.length > 0) ?
                    getInitialCodeValue().map(i => i.name).join('，')
                    : '--'
                }
              </Form.Item>
            ) : ''
        }
        {/* 适用team */}
        {
          type.includes(CodeCostCenterType.team) && Array.isArray(code) ?
            (
              <Form.Item
                label="适用team"
                {...formLayout}
              >
                {
                  (Array.isArray(team) && team.length > 0) ?
                    getInitialTeamValue().map(i => i.name).join('，')
                    : '--'
                }
              </Form.Item>
            ) : ''
        }
      </React.Fragment>
    );
  }

  // form item
  const formItems = [
    <Form.Item
      label="审批流名称"
      {...formLayout}
    >
      {name || '--'}
    </Form.Item>,
    <Form.Item
      label="审批流类型"
      {...formLayout}
    >
      <span>付款类</span>
    </Form.Item>,
    <Form.Item
      label="适用成本中心类型"
      {...formLayout}
    >
      {Array.isArray(type) && type.length > 0 ? type.map(t => CodeCostCenterType.description(t)).join('，') : '--'}
    </Form.Item>,
    applicationType,
    <Form.Item
      label="合并审批"
      {...formLayout}
    >
      {
      applicationRule ?
        AffairsFlowMergeRule.description(applicationRule)
      : '--'
    }
    </Form.Item>,
    <Form.Item
      label="最高审批岗位"
      {...formLayout}
    >
      {highestPost}
    </Form.Item>,
    <Form.Item
      label="描述"
      {...formLayout}
    >
      {note || '--'}
    </Form.Item>,
  ];

  return (
    <CoreContent title="审批流详情设置">
      <Form className="affairs-flow-detail-basic">
        <CoreForm items={formItems} cols={1} />
      </Form>
    </CoreContent>
  );
};

export default BasicInfo;
