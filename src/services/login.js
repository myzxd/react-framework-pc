/**
 * 登录相关接口模块
 * @module services/login
 */
import request from '../application/utils/request';

/**
 * 获取验证码
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchVerifyCode(params) {
  return request('auth.auth.send_verify_code',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, 'X-AUTH').then(data => data);
}

/**
 * 登录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function login(params) {
  return request('auth.auth.login',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, 'X-AUTH').then(data => data);
}

/**
 * 切换账号
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exchangeAccount(params) {
  return request('account.account.exchange_account',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    })
    .then(data => data);
}

/**
 * 刷新授权信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function refreashAuthorize(params) {
  return request('auth.auth_info.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 注销登录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function loginClear(params) {
  return request('auth.auth.logout',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, 'X-AUTH').then(data => data);
}

/**
 * 更新权限信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSystemPermission(params) {
  return request('permission.permission.update_permission',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建角色
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSystemRole(params) {
  return request('permission.permission.create_group',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 更新角色
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSystemRole(params) {
  return request('permission.permission.update_group',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取最新的角色
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSystemAuthorize(params) {
  return request('permission.permission.current_permission',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取跳转链接参数的接口
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDatahubAuthorizeURL(params) {
  return request('jump_to_datahub.jump_to_datahub.jump',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取code的信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSystemCodeInformation(params) {
  return request('qoa.rpc.get_biz_groups',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

