/**
 * oa 假勤管理
 * @module services/oa/fake
 */
import request from '../../application/utils/request';

/**
 * 新建出差申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createBusinessTrip(params) {
  return request('vacations_attendance.transaction_travel_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
/**
 * 编辑出差申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateBusinessTrip(params) {
  return request('vacations_attendance.transaction_travel_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}

/**
 * 出差申请详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getBusinssTripDetail(params) {
  return request('vacations_attendance.transaction_travel_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}

/**
 * 出差申请列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getBusinssTripList(params) {
  return request('vacations_attendance.transaction_travel_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}

/**
 * 获取出差天数
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getBusinssTripDays(params) {
  return request('utils.utils.calculate_travel_days',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}

/**
 * 获取出差标准明细
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getTravelStandardDetails(params) {
  return request('vacations_attendance.transaction_travel_order.travel_reimbursement_system',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
