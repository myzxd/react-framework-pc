/**
 * 借还款管理相关接口模块
 * @module services/expense/borrowingRepayment
 */
import request from '../../application/utils/request';

/**
 * 获取借款单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBorrowingOrders(params) {
  return request('oa.loan_order.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取还款单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRepaymentOrders(params) {
  return request('oa.repayment_order.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 创建还款单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRepayOrder(params) {
  return request('oa.repayment_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 编辑还款单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRepayOrder(params) {
  return request('oa.repayment_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 创建借款单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createBorrowOrder(params) {
  return request('oa.loan_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 编辑借款单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateBorrowOrder(params) {
  return request('oa.loan_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

 /**
 * 获取借款单详情数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBorrowingDetails(params) {
  return request('oa.loan_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

 /**
 * 获取还款单详情数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRepaymentsDetails(params) {
  return request('oa.repayment_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 借款导出数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function borrowingDownloadTemplate(params) {
  return request('oa.loan_order.export_loan_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 还款导出数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function repaymentsDownloadTemplate(params) {
  return request('oa.repayment_order.export_repayment_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 借款单流转记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineOrderFlowRecordList(params) {
  return request('oa.application_order_flow_record.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
