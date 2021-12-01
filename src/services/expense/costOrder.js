/**
 * 费用单相关接口模块
 * @module services/expense/costOrder
 */
import request from '../../application/utils/request';

/**
 * 获取费用单记录列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCostOrders(params) {
  return request('oa.cost_order.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用单记录详情,获取差旅报销单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCostOrderDetail(params) {
  return request('oa.cost_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 新建费用单记录，新建差旅报销单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createCostOrder(params) {
  return request('oa.cost_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}

/**
 * 更新费用单记录，更新差旅报销单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateCostOrder(params) {
  return request('oa.cost_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 更新费用单记录，更新差旅报销单（更新外部审批单数据）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updatePluginAdjustCostMoney(params) {
  return request('oa.cost_order.plugin_adjust_cost_money', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除记录单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteCostOrder(params) {
  return request('oa.cost_order.mark_deleted', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用金额汇总
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAmountSummary(params) {
  return request('oa.cost_order.get_amount_summary', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用金额汇总(提报金额)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSubmitSummary(params) {
  return request('oa.cost_order.get_amount_with_submit', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用记录单导出
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCostOrderExport(params) {
  return request('oa.cost_order.export', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOriginalCostOrder(params) {
  return request('oa.application_order.former_cost_order_list', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSubjectBelong(params) {
  return request('oa.oa_cost_center.get_cost_center', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取费用单收款历史信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCollection(params) {
  return request('oa.cost_order.get_history_payee_info', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 成本分摊 - 发票抬头
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getCostInvoiceHeader(params) {
  return request('utils.utils.gain_enumeration', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
