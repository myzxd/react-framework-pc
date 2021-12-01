/**
 * 出差管理相关借口服务
 * @module services/expense/travelApplication
 */
import request from '../../application/utils/request';

/**
 * 出差申请列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getTravelApplicationLists(params) {
  return request('oa.travel_apply_order.find', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 *
 * @param {*} params
 */
export async function exportTravelApplication(params) {
  return request('oa.travel_apply_order.export_travel_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 出差申请单详情
 */
export async function getTravelApplicationDetail(params) {
  return request('oa.travel_apply_order.get', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
