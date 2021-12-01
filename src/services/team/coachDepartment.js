/**
 * 私教部门相关接口模块
 * @module services/team/coachDepartment
 */
import request from '../../application/utils/request';

/**
 * 获取私教部门列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachDepartmentList(params) {
  return request('coach.department.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 获取私教部门详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachDepartmentDetail(params) {
  return request('organization.department.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取资产隶属关系列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachRelationshipList(params) {
  return request('coach.snapshot.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 获取业主信息列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerList(params) {
  return request('owner.owner.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 关联、变更、终止业主
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function relationOwner(params) {
  return request('coach.change_task.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}
/**
 * 资产编辑页变更记录列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchChangeLog(params) {
  return request('coach.change_task.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 资产变更取消
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchChangeCancel(params) {
  return request('coach.change_task.cancel', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
