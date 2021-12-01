/**
 * 组织架构 - 标签管理
 * @module services/organization/staffs
 */
import request from '../../application/utils/request';

/**
 * 标签列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDistrictTags(params) {
  return request('label.label.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新建标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTag(params) {
  return request('label.label.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateTag(params) {
  return request('label.label.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 停用标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteTag(params) {
  return request('label.label.disable',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 设置商圈标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setDistrictTags(params) {
  return request('biz_district.biz_district.add_label',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 批量设置商圈标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function batchSetDistrictTags(params) {
  return request('biz_district.biz_district.batch_add_labels',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 批量移除商圈标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function batchDeleteDistrictTags(params) {
  return request('biz_district.biz_district.batch_delete_labels',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取商圈下标签变更记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDistrictTagChangeLog(params) {
  return request('biz_district.biz_district.find_label_history',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
