/**
 * 私教管理相关接口模块
 * @module services/team/manager
 */
import request from '../../application/utils/request';

/**
 * 创建私教团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTeamTeacher(params) {
  return request('private_coach.coach_team.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 编辑私教团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateTeamTeacher(params) {
  return request('private_coach.coach_team.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除私教团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteTeamTeacher(params) {
  return request('private_coach.coach_team.delete', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 禁用私教团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function toggleoffTeamTeacher(params) {
  return request('private_coach.coach_team.toggle_off', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamTeacherDetail(params) {
  return request('private_coach.coach_team.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教团队列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamTeachers(params) {
  return request('private_coach.coach_team.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAccountTeachers() {
  // return request('', {
  //   method: 'POST',
  //   body: JSON.stringify(params),
  // }).then(data => data);
}

/**
 * 获取无私教业主团队监控列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamTeacherMonitoringList(params) {
  return request('owner.owner.no_coach_find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 创建无私教业主团队监控
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTeamTeacherMonitoring(params) {
  return request('coach.change_task.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}

/**
 * 获取私教部门名称
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetachTeamMonitoringdePartmentList(params) {
  return request('coach.department.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教管理记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamTeacherManageLog(params) {
  return request('coach.snapshot.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
