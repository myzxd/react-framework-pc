/**
 * 结算设置相关接口模块
 * @module services/finance
 */
import request from '../application/utils/request';

/**
 * 获取服务费方案详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryPlanDetailData(params) {
  return request('salary.salary_plan.get',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取服务费方案版本详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPlanVersionDetailData(params) {
  return request('salary.salary_plan_version.get',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 修改服务费方案版本有效时间
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updataEffective(params) {
  return request('salary.salary_plan_version.update',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取服务费方案规则集详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRuleCollectionData(params) {
  return request('salary.salary_plan_rule_collection.get',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建服务费规则集
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRuleCollection(params) {
  return request('salary.salary_plan_rule_collection.create',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 服务费规则集互斥互补
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateMutualExclusion(params) {
  return request('salary.salary_plan_rule_collection.update_rule_relation',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 服务费方案版本删除
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deletePlanVersion(params) {
  return request('salary.salary_plan_version.delete',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 服务费方案待生效版本退回到草稿箱
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function cancelToDraft(params) {
  return request('salary.salary_plan_version.cancel_to_draft',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 服务费方案已生效版本调薪
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function forkSalaryPlan(params) {
  return request('salary.salary_plan_version.fork',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建服务费规则步骤
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRulesGeneratorSteps(params) {
  return request('salary.salary_rule.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 服务费规则/服务费规则生成/列表上移|下移
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateFinanceRuleSort(params) {
  return request('salary.salary_rule.change_index_num',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 服务费规则列表保存
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createFinanceRulesGeneratorListOne(params) {
  return request('salary.salary_rule.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 启用|不使用用服务费规则
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRulesGeneratorByState(params) {
  return request('salary.salary_plan_rule_collection.toggle_on_off',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 保存服务费规则
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createFinanceRulesGenerator(params) {
  return request('salary.salary_plan_version.save',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 服务费规则/服务费规则生成/列表删除
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteFinanceRulesGeneratorList(params) {
  return request('salary.salary_rule.delete',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取服务费规则明细列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRulesGeneratorList(params) {
  // return financeRulesGeneratorList[params.collection_cate];
  return request('salary.salary_rule.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取单型指标数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchGeneratorOrderTypes(params) {
  // return OrderTypes;
  return request('salary.salary_var.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取骑士标签设置数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchKnightTags(params) {
  // 调用接口返回骑士标签数据
  return request('staff.staff_tag.find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取骑士数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchKnightData(params) {
  // 调用接口返回骑士数据
  return request('staff.staff_tag.staff_find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 删除骑士标签设置数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteKnightTags(params) {
  // 调用接口返回删除后数据
  return request('staff.staff_tag.remove',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取所有骑士数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAllKnight(params) {
  return request('staff.staff_tag.staff_all_find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 骑士添加标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createKnightTags(params) {
  return request('staff.staff_tag.add',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取服务费方案列表数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryPlanList(params) {
  return request('salary.salary_plan.find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取试算服务费结果列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTrialResultsList(params) {
  return request('salary.salary_compute_task.find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 明细详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryTaskDetails(params) {
  return request('salary.salary_compute_task.dataset_find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取试算汇总数据列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTrialSummaryList(params) {
  return request('salary.salary_compute_task.get',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取服务费方案版本提审
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryPlanVersion(params) {
  return request('salary.salary_plan.submit',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建薪方案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSalaryPlan(params) {
  return request('salary.salary_plan.create',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建服务费试算任务
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryPlanTask(params) {
  return request('salary.salary_compute_task.create',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出服务费试算服务费数据列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function downloadSalaryPlanList(params) {
  return request('salary.salary_compute_task.export_compute_result',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取结算模版指标
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalarySpecifications(params) {
  return request('salary.salary_var.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取结算计划数据列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPayrollPlanList(params) {
  return request('payroll.payroll_plan.find',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建结算计划
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createPayrollPlan(params) {
  return request('payroll.payroll_plan.create',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑发新计划
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPayrollPlanUpdate(params) {
  return request('payroll.payroll_plan.update',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 启用禁用发新计划
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPayrollPlanToggle(params) {
  return request('payroll.payroll_plan.toggle',
    {
      methods: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取提升信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPayrollPlanSubmitAudit(params) {
  return request('oa.application_flow.get_salary_feature_options',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}
