/**
 * 私教指导相关接口模块
 * @module services/team/manager
 */
import request from '../../application/utils/request';

/**
 * 获取私教指导列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamMessage(params) {
  return request('private_coach.coach_suggests.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取私教账户对应商圈信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamAccountDistricts(params) {
  return request('private_coach.coach_suggests.coach_biz_district_list', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 新增指导意见
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTeamMessage(params) {
  return request('private_coach.coach_suggests.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
