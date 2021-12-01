/**
 * oa 其他相关接口模块
 * @module services/oa/other
 */
import request from '../../application/utils/request';

/**
 * 事务签呈编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSign(params) {
  return request('administration.petition.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
/**
 * 事务签呈创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSign(params) {
  return request('administration.petition.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}

/**
 * 事务签呈详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSignDetail(params) {
  return request('administration.petition.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
