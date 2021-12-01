/**
 * 趣活钱包
 * @module services/expense
 */
import request from '../application/utils/request';

/**
 * 趣活钱包 - 钱包汇总
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getWalletSummary(params) {
  return request('wallet.wallet.summary',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 支付账单 - list
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getWalletBills(params) {
  return request('oa.oa_payment_bill.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 支付账单 - detail
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getWalletBillDetail(params) {
  return request('oa.oa_payment_bill.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 支付账单 - 单账单支付
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onPayBill(params) {
  return request('wallet.wallet.settlement',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 支付账单 - 导出报表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onExportBills(params) {
  return request('oa.oa_payment_bill.export',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 钱包明细 - list
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getWalletDetails(params) {
  return request('wallet.wallet.gain_flow_records',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 钱包明细 - 导出报表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onExportWalletDetails(params) {
  return request('wallet.wallet.exprot_flow_records',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 趣活钱包 - 支付账单 - 作废
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onVoidBill(params) {
  return request('oa.oa_payment_bill.cancellation',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
