/**
 * 系统管理相关接口模块
 * @module services/system
 */
import request from '../application/utils/request';

/**
 * 获取下载的任务列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDownloadRecords(params) {
  return request('asyn_task.asyn_task.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 获取所有有效账号
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getAllAccounts(params) {
  return request('account.account.get_all_account',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取关联账号列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getAccountsList(params) {
  return request('whitelist.whitelist.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 添加关联账号
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function addRelatedAccounts(params) {
  // 添加
  return request('whitelist.whitelist.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 白名单编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function editRelatedAccounts(params) {
  // 编辑 删除
  return request('whitelist.whitelist.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
