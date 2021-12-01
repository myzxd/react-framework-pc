/**
 * 城市管理相关接口模块
 * @module services/system/city
 */
import request from '../../application/utils/request';

/**
 * 获取城市列表(有分页)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCityList(params) {
  return request('platform.platform.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取省级或地级行政区
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCities(params) {
  return request('city.city.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
* 由平台code城市code获取单行城市处理完善的信息
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchCityGetBasicInfo(params) {
  return request('city.city.get_basic_info',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
* 获取城市详情
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchCityDetail(params) {
  return request('platform.platform.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
* 编辑城市，提交
* @see {@link http://api.document/xxx 接口文档}
*/
export async function createCitySubmit(params) {
  return request('platform.platform.update_city_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}
