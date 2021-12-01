/**
 * 服务费预支设置权限相关接口模块
 * @module services/whiteList/whiteList
 */

import request from '../../application/utils/request/index';

/**
 * 白名单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchWhiteListData(params) {
  return request('functional_whitelist_pro.functional_whitelist_pro.find', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 关闭白名单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchWhiteListClosePermission(params) {
  return request('functional_whitelist_pro.functional_whitelist_pro.close', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 白名单新增权限设置
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchWhiteListCreate(params) {
  return request('functional_whitelist_pro.functional_whitelist_pro.create', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 白名单获取详情页
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchWhiteListDetail(params) {
  return request('functional_whitelist_pro.functional_whitelist_pro.get', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}

/**
 * 白名单编辑页
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateWhiteList(params) {
  return request('functional_whitelist_pro.functional_whitelist_pro.update', {
    method: 'POST',
    body: JSON.stringify(params),
    apiVersion: 'v2',
  }).then(data => data);
}
