/**
 * 共享登记 - 合同管理
 * @module services/shared/contract
 */
import request from '../../application/utils/request';

/**
 *
 * @param {合同类型}
 * @returns
 */
export async function fetchContractType(params) {
  return request('utils.utils.gain_all_enumeration',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 *
 * @param {合同存档}
 * @returns
 */
export async function updateFiles(params) {
  return request('business.pact.filed',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 修改合同归档信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateContractFiles(params) {
  return request('business.pact.update_filed',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 *
 * @param {合同邮寄}
 * @returns
 */
export async function updateToMail(params) {
  return request('business.pact.mail',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 *
 * @param {合同作废}
 * @returns
 */
export async function updateVoidContract(params) {
  return request('business.pact.cancel',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 合同列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedContractList(params) {
  return request('business.pact.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 合同详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedContractDetail(params) {
  return request('business.pact.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 合同编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSharedContract(params) {
  return request('business.pact.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 合同保管人
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedContractCustodian(params) {
  return request('business.pact.preserver_select', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 签订单位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedSignUnit(params) {
  return request('business.firm.sign_pact_select', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 导出合同
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportSharedContract(params) {
  return request('business.pact.create_download_task', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 合同盖章
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function sharedContractSign(params) {
  return request('business.pact.batch_sign', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 合同转递
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function sharedContractDeliver(params) {
  return request('business.pact.deliver', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
