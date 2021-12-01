/**
 * 费用管理相关接口模块
 * @module services/expense
 */
import request from '../application/utils/request';

// ---------科目设置------------------

/**
 *
 * @param {合同子类型}
 * @returns
 */
export async function fetchContractChildType() {
  return {
    data: [
      { name: '投掷子类', key: 1 },
      { name: '但堡子类', key: 2 },
      { name: '技术子类', key: 3 },

    ],
  };
  // return request('oa.cost_accounting.find',
  //   {
  //     method: 'POST',
  //     apiVersion: 'v2',
  //     body: JSON.stringify(params),
  //   }).then(data => data);
}

/**
 * 新接口 请求审批流列表
 */
export async function fetchExamineFlowsApplyFind(params) {
  return request('oa.application_flow.work_flow_apply_for_find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 *
 * @param {合同类型}
 * @returns
 */
export async function fetchContractType(params) {
  return request('utils.utils.gain_all_enumeration',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 科目列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseSubjects(params) {
  return request('oa.cost_accounting.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 最后一级科目列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseLowlevelSubjects(params) {
  return request('oa.cost_accounting.find_chirld_cost_accounting',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 科目详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSubjectsDetail(params) {
  return request('oa.cost_accounting.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 科目创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSubject(params) {
  return request('oa.cost_accounting.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑科目
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSubject(params) {
  return request('oa.cost_accounting.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 科目删除
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteSubject(params) {
  return request('oa.cost_accounting.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 启用/停用科目
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function toggleSubjectState(params) {
  return request('oa.cost_accounting.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

// -----------审批流--------------

/**
 * 审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getNewExamineFlows(params) {
  return request('oa.application_flow.find_flow_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineFlows(params) {
  return request('oa.application_flow.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 禁用，启用审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineFlowState(params) {
  return request('oa.application_flow.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteExamineFlow(params) {
  return request('oa.application_flow.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 新建审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createExamineFlow(params) {
  return request('oa.application_flow.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑，更新审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineFlow(params) {
  return request('oa.application_flow.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 审批流详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineDetail(params) {
  return request('oa.application_flow.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除审批流节点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteExamineFlowNode(params) {
  return request('oa.application_flow.remove_node',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 添加审批流节点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createExamineFlowNode(params) {
  return request('oa.application_flow.create_node',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 修改审批流节点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineFlowNode(params) {
  return request('oa.application_flow.update_node',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取审批流设置
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineFlowConfig(params) {
  return request('oa.application_flow.get_feature_options',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 更新审批流设置
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineFlowConfig(params) {
  return request('oa.application_flow.update_feature_options',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取审批流配置 服务费方案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryPlanConfig(params) {
  return request('oa.application_flow.get_feature_options',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取审批流配置 服务费发放
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryDistribute(params) {
  return request('oa.application_flow.get_feature_options',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 更新审批流设置 服务费方案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSalaryPlanConfig(params) {
  return request('oa.application_flow.update_feature_options',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 更新审批流设置 服务费发放
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSalaryDistribute(params) {
  return request('oa.application_flow.update_feature_options',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批岗位列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExaminePost(params) {
  return request('post.post.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

// -------------费用分组-------------

/**
 * 费用分组列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseType(params) {
  return request('oa.cost_group.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑费用分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExpenseType(params) {
  return request('oa.cost_group.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除费用分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteExpenseType(params) {
  return request('oa.cost_group.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新建费用分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createExpenseType(params) {
  return request('oa.cost_group.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用分组详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseTypeDetail(params) {
  return request('oa.cost_group.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 启用/停用分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExpenseTypeByEnable(params) {
  return request('oa.cost_group.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

// ---------费用管理----------

/**
 * 费用申请记录列表 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSummaryRecordData(params) {
  return request('/oa_apply_order/find_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用申请费用申请单详情 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchorderRecordDetails(params) {
  return request('/oa_apply_order/find_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用申请费用申请单编辑 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineData(params) {
  return request('/oa_apply_order/edit_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用申请费用申请单删除 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function typeApplyDeleteS(params) {
  return request('/oa_apply_order/delete_apply_order',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用申请 提交费用申请单审批 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function submitTypeApplyGroupS(params) {
  return request('/oa_examine/examine_submit',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用申请 审批流名称接口 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getExamineSimpleNameS(params) {
  return request('/oa_examineflow/find_name',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用申请 审批单详情接口 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSummaryRecordDetail(params) {
  return request('/oa_examine/find_examine_order_detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

// -------记录明细---------

/**
 * 科目设置/成本归属
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCostAttributionInfo(params) {
  return request('oa.cost_accounting.find_cost_center',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 添加岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createPost(params) {
  return request('post.post.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑岗位（草稿状态下的编辑）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updatePost(params) {
  return request('post.post.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑岗位（正常状态下的编辑）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function managementPost(params) {
  return request('post.post.manager_post_account_ids',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 岗位启用/停用
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function enableAndDisablePost(params) {
  return request('post.post.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批监控
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseStatistics(params) {
  return request('oa.application_flow.statistics',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批监控
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setApplicationNodeCC(params) {
  return request('oa.application_flow.set_node_cc',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 关联审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRelationExamineFlow(params) {
  return request('oa.relevance_flow.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 更新关联审批流列表状态
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRelationExamineFlowState(params) {
  return request('oa.relevance_flow.update_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 更新关联审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRelationExamineFlow(params) {
  return request('oa.relevance_flow.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 创建关联审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRelationExamineFlow(params) {
  return request('oa.relevance_flow.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineFlow(params) {
  return request('oa.relevance_flow.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineFlowinfo(params) {
  return request('oa.relevance_flow.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}
