/**
 * 公告接收人
 * @module services/announcement
 */
import request from '../application/utils/request';

/**
 * 权限列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPermissionsList(params) {
  return request('notice_area.notice_area.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 权限详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPermissionsDetail(params) {
  return request('notice_area.notice_area.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建权限
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createPermissions(params) {
  return request('notice_area.notice_area.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 更新权限
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updatePermissions(params) {
  return request('notice_area.notice_area.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
