/**
 * 加班管理相关借口服务
 * @module services/expense/overTime
 */
import request from '../../application/utils/request';

/**
 * 加班申请列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOverTimeList(params) {
  return request('oa.oa_extra_work_order.find', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 加班申请详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOverTimeDetail(params) {
  return request('oa.oa_extra_work_order.get', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 新建加班申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOverTime(params) {
  return request('oa.oa_extra_work_order.create', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 编辑加班申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOverTime(params) {
  return request('oa.oa_extra_work_order.update', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 导出加班EXCEL
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportOverTime(params) {
  return request('oa.oa_extra_work_order.export', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
