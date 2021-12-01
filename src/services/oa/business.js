/**
 *
 * @param {合同类型}
 * @returns
 */
 /**
 * oa 财商类相关接口模块
 * @module services/oa/business
 */
import request from '../../application/utils/request';

export async function fetchContractType(params) {
  return request('utils.utils.gain_all_enumeration',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 *创建公司变动申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createBusinessFirmModifyOrder(params) {
  return request('business.firm_modify_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 *公司变动申请单编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateBusinessFirmModifyOrder(params) {
  return request('business.firm_modify_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 *公司变动申请单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBusinessFirmModifyOrderDetail(params) {
  return request('business.firm_modify_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 *银行账户申请单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBusinessBankOrderDetail(params) {
  return request('business.bank_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
*创建银行账户申请单
* @see {@link http://api.document/xxx 接口文档}
*/
export async function createBusinessBankOrder(params) {
  return request('business.bank_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*编辑银行账户申请单
* @see {@link http://api.document/xxx 接口文档}
*/
export async function updateBusinessBankOrder(params) {
  return request('business.bank_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*新建合同借阅申请单
* @see {@link http://api.document/xxx 接口文档}
*/
export async function createBusinessPactBorrowOrder(params) {
  return request('business.pact_borrow_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}


/**
*编辑合同借阅申请单
* @see {@link http://api.document/xxx 接口文档}
*/
export async function updateBusinessPactBorrowOrder(params) {
  return request('business.pact_borrow_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*合同借阅申请单详情
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessPactBorrowOrderDetail(params) {
  return request('business.pact_borrow_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
* 盖章类型
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessSealTypes(params) {
  return request('business.pact.get_seal',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
*合同会审申请单创建
* @see {@link http://api.document/xxx 接口文档}
*/
export async function createBusinessPactApplyOrder(params) {
  return request('business.pact_apply_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*合同会审申请单编辑
* @see {@link http://api.document/xxx 接口文档}
*/
export async function updateBusinessPactApplyOrder(params) {
  return request('business.pact_apply_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*合同会审申请单详情
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessPactApplyOrderDetail(params) {
  return request('business.pact_apply_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*合同下拉
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessPactContractSelect(params) {
  return request('business.pact.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
*公司下拉
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessCompanySelect(params) {
  return request('business.firm.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
* 员工下拉
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessEmployeesSelect(params) {
  return request('organization.department.subordinate',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
* 账户下拉
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchBusinessAccountSelect(params) {
  return request('business.bank_account.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 公司详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSharedCompanyDetail(params) {
  return request('business.firm.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 资金调拨创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createFundTransfer(params) {
  return request('administration.capital_allocate_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 资金调拨编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateFundTransfer(params) {
  return request('administration.capital_allocate_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 资金调拨事由选择
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchFundTransferCause(params) {
  return request('',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 资金调拨金额范围选择
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchFundTransferAmountRange(params) {
  return request('',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 资金调度详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchFundTransferDetail(params) {
  return request('administration.capital_allocate_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
