/**
 * 推荐公司相关接口模块
 * @module services/system/recommendedCompany
 */
import request from '../../application/utils/request';

/**
 * 获取推荐公司列表(查询推荐公司列表接口，有分页)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCompanyData(params) {
  return request('recommend_company.recommend_company.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取推荐公司详情(获取推荐公司详情接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCompanyDetail(params) {
  return request('recommend_company.recommend_company.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 创建推荐公司(创建推荐公司接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createCompany(params) {
  return request('recommend_company.recommend_company.create',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 编辑推荐公司(编辑推荐公司接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateCompany(params) {
  return request('recommend_company.recommend_company.update',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 改变推荐公司状态(改变推荐公司状态接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function changeCompanyState(params) {
  return request('recommend_company.recommend_company.toggle',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取推荐公司的服务范围(获取推荐公司的服务范围接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchServiceRange(params) {
  return request('recommend_company.recommend_company_supplier.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 创建推荐公司服务范围(创建推荐公司服务范围接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createServiceRange(params) {
  return request('recommend_company.recommend_company_supplier.create',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 改变推荐公司服务范围状态(改变推荐公司服务范围状态接口)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function changeServiceRangeState(params) {
  return request('recommend_company.recommend_company_supplier.toggle',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}
