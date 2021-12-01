/**
 * 社保公积金相关接口模块
 * @module services/society
 */
import request from '../application/utils/request';

/**
 * 参保方案列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSocietyListApi(params) {
  return request('insurance_program.insurance_program.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 参保方案详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSocietyPlanDetail(params) {
  return request('insurance_program.insurance_program.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 创建参保方案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSociety(params) {
  return request('insurance_program.insurance_program.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 编辑参保方案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSociety(params) {
  return request('insurance_program.insurance_program.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

