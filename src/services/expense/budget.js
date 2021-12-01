/**
 * 物资管理相关接口模块
 * @module services/expense
 */
import request from '../../application/utils/request';

/**
 * 获取费用预算列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseBudgetList(params) {
  return request('cost_budget.cost_budget.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 费用预算导出
 */
export async function fetchExpenseBudgetExport(params) {
  return request('cost_budget.cost_budget.download_cost_budget_file',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 费用预算上传
 */
export async function uploadExpenseBudget(params) {
  return request('cost_budget.cost_budget.upload_cost_budget_file',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
