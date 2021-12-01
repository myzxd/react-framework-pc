/**
 * 业主管理相关接口模块
 * @module services/team/manager
 */
import request from '../../application/utils/request';

/**
 * 创建业主
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTeamManager(params) {
  return request('owner.owner.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}

/**
 * 创建业主团队范围
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOwnerTeamScope(params) {
  return request('owner_scope.snapshot.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}

/**
 * 编辑业主
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateTeamManager(params) {
  return request('owner.owner.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取业主详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamManagerDetail(params) {
  return request('owner.owner.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取业主列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamManagers(params) {
  return request('owner.owner.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 导出业主商圈数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportOwnerBiz(params) {
  return request('owner.owner.export_owner', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 导出无业主商圈数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportNotOwnerBiz(params) {
  return request('owner.owner.export_no_owner_district', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取业主管理编辑页承揽范围列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerScopeList(params) {
  return request('owner_scope.snapshot.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取业主管理编辑页变更记录列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerChangeLog(params) {
  return request('owner_scope.change_task.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取业主管理编辑页添加承揽范围
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerCreateScope(params) {
  return request('owner_scope.change_task.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取业主管理编辑页变更承揽范围
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerUpdateScope(params) {
  return request('owner_scope.change_task.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取业主管理编辑页终止承揽
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerCancelScope(params) {
  return request('owner_scope.change_task.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 获取业主管理编辑页取消变更
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerChangeCancel(params) {
  return request('owner_scope.change_task.toggle_off', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 业主管理,变更业主
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOwnerteamManagers(params) {
  return request('owner.change_task.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 业主管理,解散团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateDissolutionTeam(params) {
  return request('owner.owner.dismiss', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}


/**
 * 业主团队变更记录列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamManagerUpdateOwnerList(params) {
  return request('owner.change_task.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 业主团队变更记录列表 - 取消待生效
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function cancelTeamManagerUpdateOwnerListItem(params) {
  return request('owner.change_task.cancel', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 *  获取其实商圈信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamKnightDistrcit(params) {
  return request('owner.owner.knight_biz_distrcit_find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
