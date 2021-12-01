/**
 * Boss骑士安卓app信息相关接口模块
 * @module services/setting
 */
import request from '../application/utils/request';

/**
 * 获取Boss骑士安卓app信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAndroidAppInfo() {
  return request('tool.tool.gain_android_url',
    {
      method: 'POST',
      apiVersion: 'v2',
    }).then(data => data);
}
/**
 * 获取Boss当家安卓app信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBossAppInfo() {
  return request('tool.tool.gain_android_owner_url ',
    {
      method: 'POST',
      apiVersion: 'v2',
    }).then(data => data);
}
/**
 * 获取Boss之家安卓app信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBossHomeAppInfo() {
  return request('tool.tool.gain_android_admin_url',
    {
      method: 'POST',
      apiVersion: 'v2',
    }).then(data => data);
}
