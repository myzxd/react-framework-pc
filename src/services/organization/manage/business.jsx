/**
 * 组织架构 - 部门管理 - 业务信息Tab
 * @module services/organization/manage/business
 */
import request from '../../../application/utils/request';

/**
 * 平台
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getPlatformList(params) {
  return request('platform.platform.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 供应商
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSupplierList(params) {
  return request('platform.platform.get_supplier_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 城市
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getCityList(params) {
  return request('platform.platform.get_city_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 业务信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getBusiness(params) {
  return request('organization.biz_label.find_one',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新建业务信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createBusinessTag(params) {
  return request('organization.biz_label.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 业务信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateBusinessTag(params) {
  return request('organization.biz_label.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 是否开启数据权限开关
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function gainDataPermissionValidator(params) {
  return request('organization.biz_label.gain_data_permission_validator',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
