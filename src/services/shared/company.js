/**
 * 共享登记 - 公司管理
 * @module services/shared/contract
 */
import request from '../../application/utils/request';

/**
 * 公司列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedCompanyList(params) {
  return request('business.firm.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 公司详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedCompanyDetail(params) {
  return request('business.firm.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 公司创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSharedCompany(params) {
  return request('business.firm.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 公司编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSharedCompany(params) {
  return request('business.firm.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 公司名称（带state）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedCompanyPurview(params) {
  return request('business.firm.sign_bank_account_select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 公司名称
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedCompany(params) {
  return request('business.firm.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出公司
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportSharedCompany(params) {
  return request('business.firm.create_download_task',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取公司类型
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedCompanyNature(params) {
  return request('utils.utils.gain_enumeration',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
