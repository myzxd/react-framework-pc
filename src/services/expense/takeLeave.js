/**
 * 请假管理相关借口服务
 * @module services/expense/takeLevave
 */
import request from '../../application/utils/request';

/**
 * 请假列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseTakeLeaveList(params) {
  return request('oa.leave_apply_order.find', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 请假管理详情
 */
export async function fetchExpenseTakeLeaveDetail(params) {
  return request('oa.leave_apply_order.get', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 创建请假管理
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createExpenseTakeLeave(params) {
  return request('oa.leave_apply_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 编辑请假管理
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExpenseTakeLeave(params) {
  return request('oa.leave_apply_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 导出EXCEL
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportTakeLeave(params) {
  return request('oa.leave_apply_order.export', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
