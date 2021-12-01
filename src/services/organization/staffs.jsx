/**
 * 组织架构 - 岗位管理
 * @module services/organization/staffs
 */
import request from '../../application/utils/request';

/**
 * 岗位列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getStaffList(params) {
  return request('organization.job.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新建岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createStaff(params) {
  return request('organization.job.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateStaff(params) {
  return request('organization.job.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteStaff(params) {
  return request('organization.job.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 岗位标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getPostTags(params) {
  return request('organization.job.find_tags',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
