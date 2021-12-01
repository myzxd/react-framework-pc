/**
 * 供应商相关接口模块
 * @module services/system/supplier
 */
import request from '../../application/utils/request';

/**
 * 获取供应商信息(查询供应商列表接口，有分页)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplierList(params) {
  return request('supplier.supplier.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取供应商详情信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplierDetail(params) {
  return request('supplier.supplier.detail',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 创建供应商
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSupplier(params) {
  return request('supplier.supplier.create',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 更新供应商
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSupplier(params) {
  return request('supplier.supplier.update',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 修改供应商状态
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSupplierState(params) {
  return request('supplier.supplier.toggle_on_off',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取商圈列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDistrictList(params) {
  return request('biz_district.biz_district.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取城市分布情况
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCityDistribution(params) {
  return request('city.city.get_city_distribution',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}
