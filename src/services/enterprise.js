/**
 * 企业付款相关接口模块
 * @module services/enterprise
 */

import request from '../application/utils/request';


// import { paymentList, paymentDetail, paymentDetailList } from '../services/mock/enterprise/payment';

/**
 * 付款单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPaymentList(params) {
  return request('wallet.payment_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 付款单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPaymentDetail(params) {
  return request('wallet.payment_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 确认执行付款单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPaymentApprove(params) {
  return request('wallet.payment_order.approve',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 付款单详情列表  /   确认执行付款单明细列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPaymentDetailList(params) {
  return request('wallet.payment_order.find_lines',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
* 付款单明细上传
* @see {@link http://api.document/xxx 接口文档}
*/
export async function fetchEmployeListUpload(params) {
  return request('wallet.payment_order.upload',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 下载模版
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPaymentDownloadTemplate(params) {
  return request('wallet.payment_order.download',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 创建付款单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createPayment(params) {
  return request('wallet.payment_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 人员筛选
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployees(params) {
  return request('wallet.sync_wallet.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
