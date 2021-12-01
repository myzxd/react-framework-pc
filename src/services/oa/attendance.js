/**
 * oa 考勤类相关接口模块
 * @module services/oa/attendance
 */
import request from '../../application/utils/request';
/**
 * 创建异常记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createAbnormal(params) {
  return request('attendance.exception_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑异常记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateAbnormal(params) {
  return request('attendance.exception_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取异常记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAbnormalDetail(params) {
  return request('attendance.exception_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 创建外出记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createExternalOut(params) {
  return request('attendance.break_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 编辑外出记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExternalOut(params) {
  return request('attendance.break_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取外出记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExternalOutDetail(params) {
  return request('attendance.break_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建加班记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOvertime(params) {
  return request('attendance.extra_work_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 编辑加班记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOvertime(params) {
  return request('attendance.extra_work_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取加班记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOvertimeDetail(params) {
  return request('attendance.extra_work_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 创建请假记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createLeave(params) {
  return request('attendance.leave_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 编辑请假记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateLeave(params) {
  return request('attendance.leave_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取请假记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchLeaveDetail(params) {
  return request('attendance.leave_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

