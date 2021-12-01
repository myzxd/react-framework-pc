/**
 * 共享登记 - 印章管理
 * @module services/shared/seal
 */
import request from '../../application/utils/request';

/**
 * 印章列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedSealList(params) {
  return request('administration.seal.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 印章详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedSealDetail(params) {
  return request('administration.seal.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 印章创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSharedSeal(params) {
  return request('administration.seal.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 印章编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSharedSeal(params) {
  return request('administration.seal.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 印章保管人
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedSealCustodian(params) {
  return request('administration.seal.keep_account_select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出印章
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportSharedSeal(params) {
  return request('administration.seal.create_download_task',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
