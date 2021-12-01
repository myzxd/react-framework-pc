/**
 * 私教账户管理相关接口模块
 * @module services/team/manager
 */
import request from '../../application/utils/request';

/**
 * 创建私教账户
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTeamAccount(params) {
  return request('private_coach.coach_account.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除私教账户
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteTeamAccount(params) {
  return request('private_coach.coach_account.delete', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 编辑私教账户
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateTeamAccount(params) {
  return request('private_coach.coach_account.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamAccountDetail(params) {
  return request('private_coach.coach_account.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户业务范围详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamAccountDistrict(params) {
  return request('private_coach.coach_account.coach_biz_district_list', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamAccounts(params) {
  return request('private_coach.coach_account.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 导出私教商圈数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportCoachBiz(params) {
  return request('private_coach.coach_account.export_coach_account', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 导出无私教商圈数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportNotCoachBiz(params) {
  return request('private_coach.coach_account.export_no_coach_account_district', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 私教编辑页业务范围列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachScopeList(params) {
  return request('coach.coach_scope.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 私教编辑页业务范围列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachChangeLog(params) {
  return request('coach.coach_scope_rules.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户编辑页添加承揽范围
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachCreateScope(params) {
  return request('coach.coach_scope_rules.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户编辑页变更承揽范围
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachUpdateScope(params) {
  return request('coach.coach_scope_rules.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取私教账户编辑页终止承揽
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachCancelScope(params) {
  return request('coach.coach_scope_rules.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取私教账户编辑页取消变更
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachChangeCancel(params) {
  return request('coach.coach_scope_rules.toggle_off', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取私教业务记录列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachBusinessList(params) {
  return request('coach.coach_scope.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 私教业务编辑页保存
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachSave(params) {
  return request('private_coach.coach_account.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 私教业务编辑页保存
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachName(params) {
  return request('private_coach.coach_account.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
