/**
 * 房屋合同相关接口服务
 * @module services/expense/houseContract
 */
import request from '../../application/utils/request';

/**
 * 新建房屋合同
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createHouseContract(params) {
  return request('oa.house_contract.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}

/**
 * 更新房屋合同
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateHouseContract(params) {
  return request('oa.house_contract.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true).then(data => data);
}

/**
 * 费用申请信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function costApplyContract(params) {
  return request('oa.house_contract.apply', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取房屋合同列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHouseContracts(params) {
  return request('oa.house_contract.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取/续租/断组/退租审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createFlowByContract(params) {
  return request('oa.house_contract.create_rent_application_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取新租审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getNewGroupApprovaList(params) {
  return request('oa.house_contract.submit_contract', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取房屋合同详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHouseContractDetail(params) {
  return request('oa.house_contract.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除房屋合同
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHouseContractDelete(params) {
  return request('oa.house_contract.mark_deleted', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 房屋续签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHouseRenew(params) {
  return request('oa.house_contract.clone_contract', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 房屋台账
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHouseAccount(params) {
  return request('oa.house_contract.house_contract_allocation_find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 房屋台账导出
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportHouseLedger(params) {
  return request('oa.house_contract.export_house_allocation', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
