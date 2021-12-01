/**
 * 审批单相关接口模块
 * @module services/expense/examineOrder
 */
import request from '../../application/utils/request';

/**
 * 获取审批单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineOrders(params) {
  return request('oa.application_order.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取审批单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineOrderDetail(params) {
  return request('oa.application_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取借款单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBorrowingOrderDetail(params) {
  return request('oa.loan_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取还款单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRepaymentOrderDetail(params) {
  return request('oa.repayment_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 新建审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createExamineOrder(params) {
  return request('oa.application_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 提报审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function submitExamineOrder(params) {
  return request('oa.application_order.submit', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  },
    undefined,
    true,
  ).then(data => data);
}

/**
 * 校验部门审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function checkExamineDepartmentOrder(params) {
  return request('oa_organization_order.oa_organization_order.hint', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 审批通过
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineOrderByApprove(params) {
  return request('oa.application_order.approve', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 审批驳回
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineOrderByReject(params) {
  return request('oa.application_order.reject', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineOrderByDelete(params) {
  return request('oa.application_order.mark_deleted', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 撤回审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineOrderByRecall(params) {
  return request('oa.application_order.withdraw', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 关闭审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineOrderByClose(params) {
  return request('oa.application_order.close', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 标记异常
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateExamineOrderByMarkPaid(params) {
  return request('oa.application_order.mark_paid', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 补充意见
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updataSupplementOpinion(params) {
  return request('oa.application_order.create_flow_extra', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 删除意见
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteSupplementOpinion(params) {
  return request('oa.application_order.delete_flow_extra', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 关联审批单账号
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAssociatedAccount(params) {
  return request('oa.application_order.add_relation_application_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 主题标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCostApprovalThemeTag(params) {
  return request('oa.application_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 出差申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTravelApplicationLists(params) {
  return request('oa.travel_apply_order.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 创建出差申请单
export async function createBusinessTrip(params) {
  return request('oa.travel_apply_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 编辑出差申请单
export async function updateBusinessTrip(params) {
  return request('oa.travel_apply_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 获取出差申请单详情
export async function fetchBusinessTrip(params) {
  return request('oa.travel_apply_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 请假管理详情
 */
export async function fetchExpenseTakeLeaveDetail(params) {
  return request('oa.leave_apply_order.get', {
    method: 'post',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 删除关联审批单
export async function deleteAssociatedAccount(params) {
  return request('oa.application_order.delete_relation_application_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取审批单详情（只适用PC）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPCExamineOrderDetail(params) {
  return request('oa.application_order.pc_get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取岗位下成员
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getStaffMember(params) {
  return request('staff.employee.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
