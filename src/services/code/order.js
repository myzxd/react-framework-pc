/**
 * CODE审批单相关接口模块
 * @module services/code/order
 */
import request from '../../application/utils/request';


/**
 * 审批单列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchApprovalLists(params) {
  return request('oa.application_order.find_relation_application_order',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批单列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getApproveOrderList(params) {
  return request('qoa.order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 关联审批单列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getRelationOrderList(params) {
  return request('qoa.order.relation_order_find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 项目列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getProjectList(params) {
  return request('qcode.supplier.allow_suppliers',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流链接find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowLinkList(params) {
  return request('',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteOrder(params) {
  return request('qoa.order.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 撤回审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function recallOrder(params) {
  return request('qoa.order.mark_withdraw',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 关闭审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function closeOrder(params) {
  return request('qoa.order.mark_closed',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getApproveOrderDetail(params) {
  return request('qoa.order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 保存审批单主题标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function saveOrderThemeTags(params) {
  return request('qoa.order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code神批单 - 创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOrder(params) {
  return request('qoa.order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 同意审批
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function agreeApproveOrder(params) {
  return request('qoa.order.mark_approved',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 驳回审批
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function disallowanceApproveOrder(params) {
  return request('qoa.order.reject',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code神批单 - 提交
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createSubmitOrder(params) {
  return request('cost.order.submit',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/**
 * 关联审批单账号
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAssociatedAccount(params) {
  return request('qoa.order.add_relation_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 删除关联审批单
export async function deleteAssociatedAccount(params) {
  return request('qoa.order.remove_relation_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/*
 * code审批单 - 可驳回节点列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getRejectNodeList(params) {
  return request('qoa.oa_order_flow_record.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 标记异常审批
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markApproveOrderAbnormal(params) {
  return request('qoa.cost.mark_paid_abnormal',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 审批单下的单个费用单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOrderCostItem(params) {
  return request('cost.common_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 审批单下的单个差旅单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTravelOrder(params) {
  return request('cost.travel_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * code审批单 - 获取差旅补助|住宿金额是否超标
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTravelMoneyExceedingStandard(params) {
  return request('cost.travel_order.validate_money',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 创建审批单下的单个费用单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOrderCostItem(params) {
  return request('cost.common_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}
/**
 * code审批单 - 更新审批单下的单个费用单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOrderCostItem(params) {
  return request('cost.common_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/**
 * code审批单 - 更新审批单下的单个费用单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function removeOrderCostItem(params) {
  return request('cost.common_order.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * code审批单 - 创建审批单下的单个差旅单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOrderCostcostTravelOrder(params) {
  return request('cost.travel_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}
/**
 * code审批单 - 更新审批单下的单个差旅单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOrderCostcostTravelOrder(params) {
  return request('cost.travel_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/**
 * code审批单 - 流转记录 - 添加补充意见
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function addApproveOrderExtra(params) {
  return request('qoa.order.create_flow_extra',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 流转记录 - 删除补充意见
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteApproveOrderExtra(params) {
  return request('qoa.order.delete_flow_extra',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 付款完成审批
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markApproveOrderPayDone(params) {
  return request('qoa.cost.mark_paid_done',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 标记不付款审批
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markApproveOrderPayCancel(params) {
  return request('qoa.cost.mark_paid_cancel',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单 - 打验票标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markCostOrderBillLabel(params) {
  return request('cost.bill.mark_label',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单 - 标记验票异常
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markCostOrderBillAbnormal(params) {
  return request('cost.bill.mark_abnormal',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单 - 标记验票完成
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markCostOrderBillDone(params) {
  return request('cost.bill.mark_done',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单 - 红冲
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function pushRedCostOrder(params) {
  return request('cost.bill.bill_push_red',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 流转记录列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOrderFlowRecordList(params) {
  return request('qoa.oa_order_flow_record.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getCostOrderList(params) {
  return request('cost.order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单 - 添加发票
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function addCostOrderInvoice(params) {
  return request('cost.bill.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 费用单 - 删除发票
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteOrderInvoice(params) {
  return request('cost.bill.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 标记验票完成
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markOrderBillDone(params) {
  return request('cost.bill.mark_done',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 标记验票异常
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markOrderBillAbnormal(params) {
  return request('cost.bill.mark_abnormal',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 验票校验
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getTicketCheck(params) {
  return request('cost.bill.mark_validated',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code审批单 - 打验票标签
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setOrderTicket(params) {
  return request('cost.bill.mark_label',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code 获取原有审批单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOriginOrderList(params) {
  return request('oa.application_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code 获取当前账户草稿状态的审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDraftOrder(params) {
  return request('qoa.order.gain_init_order',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code 提报链接埋点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onSubmitBuriedPoint(params) {
  return request('qoa.order.submit_buried_point',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取记账月份list
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getBookMonthList(params) {
  return request('qoa.order.get_book_month_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 加入智能分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function addIntelligentGroup(params) {
  return request('qoa.oa_order_filter_group.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 修改费用单金额
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onUpdateOrderMoney(params) {
  return request('cost.order.update_payment_money',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取审批单查询条件分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOrderSearchGroupList(params) {
  return request('qoa.oa_order_filter_group.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 删除分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onDeleteGroup(params) {
  return request('qoa.oa_order_filter_group.mark_delete',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 设置默认分组
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onSetDefaultGroup(params) {
  return request('qoa.oa_order_filter_group.mark_default',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 优化：关联审批单 查询接口
 */

export async function fetchApprovalFind(params) {
  return request('oa.application_order.get_relation_application_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
