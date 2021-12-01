/**
 * 私教运营管理接口模块
 * @module services/team/coachDepartment
 */
import request from '../../application/utils/request';

/**
 * 获取私教部门列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCoachOperationsList(params) {
  return request('coach.business_operations.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 编辑单成本、单收入
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateMoney(params) {
  return request('coach.business_operations.batch_update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
