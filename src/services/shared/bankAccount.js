/**
 * 共享登记 - 银行账户管理
 * @module services/shared/bankAccount
 */
import request from '../../application/utils/request';

/**
 * 银行账户列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedBankAccountList(params) {
  return request('business.bank_account.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 银行账户详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedBankAccountDetail(params) {
  return request('business.bank_account.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 银行账户创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSharedBankAccount(params) {
  return request('business.bank_account.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 银行账户编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSharedBankAccount(params) {
  return request('business.bank_account.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出银行账户
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportSharedBankAccount(params) {
  return request('business.bank_account.create_download_task',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取银行操作人
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getBankOperator(params) {
  return request('business.bank_account.get_custodian_employee_data',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取员工档案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getEmployeeList(params) {
  return request('organization.department.subordinate',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
