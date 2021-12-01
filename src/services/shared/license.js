/**
 * 共享登记 - 证照管理
 * @module services/shared/license
 */
import request from '../../application/utils/request';

/**
 * 证照列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedLicenseList(params) {
  return request('administration.cert.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 证照新建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSharedLicense(params) {
  return request('administration.cert.batch_create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 证照编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSharedLicense(params) {
  return request('administration.cert.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 证照详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedLicenseDetail(params) {
  return request('administration.cert.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 证照负责人
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedLicensePrincipal(params) {
  return request('administration.cert.keep_account_select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出证照
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportSharedLicense(params) {
  return request('administration.cert.create_download_task',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
