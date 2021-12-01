/**
 * 验票标签
 * @module services/expense/ticket
 */
import request from '../../application/utils/request';

/**
 * 标签列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getTicketTags(params) {
  return request('oa.oa_label.find', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 新建标签
 */
export async function createTicketTag(params) {
  return request('oa.oa_label.create', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteTicketTag(params) {
  return request('oa.oa_label.mark_deleted', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 完成验票
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function checketTicket(params) {
  return request('oa.application_order.make_inspect_bill', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 验票异常
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setAbnormalTicket(params) {
  return request('oa.application_order.mark_abnormal', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 费用单打验票标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setOrderTicket(params) {
  return request('oa.application_order.mark_label', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 费用单红冲
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setOrderRedPunch(params) {
  return request('', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 费用单添加发票
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function addOrderInvoice(params) {
  return request('cost.cost_bill.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 费用单删除发票
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteOrderInvoice(params) {
  return request('cost.cost_bill.mark_deleted', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 费用单发票列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOrderInvoiceList(params) {
  return request('cost.cost_bill.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 费用单验票校验
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getTicketCheck(params) {
  return request('oa.application_order.validate_make_inspect_bill', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 红冲（分摊）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setBillRedPunch(params) {
  return request('oa.cost_order.bill_push_red', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
