/**
 * 服务商配置权限相关接口模块
 * @module services/system/merchants
 */

import request from '../../application/utils/request/index';

/**
 * 服务商配置列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchMerchantsListData(params) {
  return request('biz_configure.biz_configure.find', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 服务商配置新增权限设置
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchMerchantsCreate(params) {
  return request('biz_configure.biz_configure.create', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 服务商配置获取详情页
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchMerchantsDetail(params) {
  return request('biz_configure.biz_configure.get', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 服务商配置编辑页
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateMerchants(params) {
  return request('biz_configure.biz_configure.update', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}
