/**
 * 账户管理相关接口模块
 * @module services/account
 */
import request from '../application/utils/request';

// NOTE: 重新封装
/**
 * 用户管理，获取用户列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAccounts(params) {
  return request('account.account.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 用户管理，获取角色
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAllPosition(params) {
  return request('permission.permission.all_position',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 用户管理，创建用户
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createAccount(params) {
  return request('account.account.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 用户管理，更新用户
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateAccount(params) {
  return request('account.account.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 用户管理，获取用户详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAccountsDetails(params) {
  return request('account.account.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取策略组
 */
export async function getStrategyGroupList(params) {
  return request('account.account.get_policy',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    },
    undefined,
    true,
  ).then(data => data);
}
