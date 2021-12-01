/**
 * CODE审批记录明细相关接口模块
 * @module services/code/record
 */
import request from '../../application/utils/request';

/**
 * 记录明细列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getRecordList(params) {
  return request('cost.order.cost_find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 记录明细详情get
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getRecordDetail(params) {
  return request('cost.common_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 记录明细导出
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onExportRecords(params) {
  return request('cost.order.export',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

// code核算中心list
export async function getCodeCostCenterTypeList(params) {
  return request('qcode.code.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// team核算中心list
export async function getTeamCostCenterTypeList(params) {
  return request('qcode.team.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
