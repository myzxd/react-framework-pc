/**
 * 私教业务承揽列表页相关接口模块
 * @module services/team/ownerBusiness
 */
import request from '../../application/utils/request';

/**
 * 获取业务承揽列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerBusinessList(params) {
  return request('owner_scope.snapshot.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 承揽范围获取业主
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOwnerId(params) {
  return request('owner.owner.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
