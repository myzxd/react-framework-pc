/**
 * 无业主商圈监控相关接口模块
 * @module services/team/manager
 */
import request from '../../application/utils/request';

/**
 * 无业主商圈监控
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchNothingOwnerList(params) {
  return request('biz_district.biz_district.no_owner_find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
