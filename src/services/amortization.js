/**
 * @module services/amortization
 */
import request from '../application/utils/request';

/**
 * 获取场景列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getScenesList(params) {
  return request('qcode.industry.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取平台列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getPlatformList(params) {
  return request('qcode.platform.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取项目列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getProjectList(params) {
  return request('qcode.project.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取主体列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getMainBodyList(params) {
  return request('qcode.supplier.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取摊销确认列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getAmortizationList(params) {
  return request('allocation.order_allocation.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取摊销确认详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getAmortizationDetail(params) {
  return request('allocation.order_allocation.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取台账列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchLedgerList(params) {
  return request('allocation.order_allocation_detail.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 添加分摊数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onAddShareList(params) {
  return request('allocation.order_allocation.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 终止摊销
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onTerminationAmortization(params) {
  return request('allocation.order_allocation.abort',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 确认/修改摊销规则
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onUpdateRule(params) {
  return request('allocation.order_allocation.confirm_allocation_rule',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 城市list
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getCityList(params) {
  return request('qcode.city.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}
