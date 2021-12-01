

/**
 * oa 人事类相关接口模块
 * @module services/oa/humanResource
 */
import request from '../../application/utils/request';


/**
 * 关联审批
 */
export async function fetchApproval(params) {
  return request('oa.application_order.relation_application_order',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 工作交接申请单，创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createHandoverOrder(params) {
  return request('human_resource.handover_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 工作交接申请单，编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateHandoverOrder(params) {
  return request('human_resource.handover_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 工作交接申请单，列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHandoverOrderList(params) {
  return request('human_resource.handover_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 工作交接申请单，详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHandoverOrderDetail(params) {
  return request('human_resource.handover_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 离职申请单，创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createResignOrder(params) {
  return request('human_resource.departure_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 离职申请单，编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateResignOrder(params) {
  return request('human_resource.departure_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 离职申请单，列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchResignOrderList(params) {
  return request('human_resource.departure_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 离职申请单，详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchResignOrderDetail(params) {
  return request('human_resource.departure_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 人事调动申请单，创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createHumanResourceTransferOrder(params) {
  return request('human_resource.human_resource_transfer_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 人事调动申请单，编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateHumanResourceTransferOrder(params) {
  return request('human_resource.human_resource_transfer_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 人事调动申请单，列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHumanResourceTransferOrderList(params) {
  return request('human_resource.human_resource_transfer_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 人事调动申请单，详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchHumanResourceTransferOrderDetail(params) {
  return request('human_resource.human_resource_transfer_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 续签申请单，创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRenewOrder(params) {
  return request('human_resource.renew_contract_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 续签申请单，编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRenewOrder(params) {
  return request('human_resource.renew_contract_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 续签申请单，列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRenewOrderList(params) {
  return request('human_resource.renew_contract_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 续签申请单，详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRenewOrderDetail(params) {
  return request('human_resource.renew_contract_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 获取事务性单据列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOrderList(params) {
  const { url, oa_application_order_id } = params;
  return request(url,
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify({ oa_application_order_id }),
    });
}

/**
 * 创建招聘申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRecruitment(params) {
  return request('human_resource.recruitment_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 编辑招聘申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRecruitment(params) {
  return request('human_resource.recruitment_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 招聘申请单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getRecruitmentDetail(params) {
  return request('human_resource.recruitment_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 创建增编申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createAuthorizedStrength(params) {
  return request('human_resource.addendum_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 更新增编申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateAuthorizedStrength(params) {
  return request('human_resource.addendum_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 获取增编申请单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getAuthorizedStrengthDetail(params) {
  return request('human_resource.addendum_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 创建录用申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createEmploy(params) {
  return request('human_resource.employ_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 更新录用申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateEmploy(params) {
  return request('human_resource.employ_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 获取录用申请单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getEmployDetail(params) {
  return request('human_resource.employ_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 创建转正申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOfficial(params) {
  return request('human_resource.positive_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 编辑转正申请单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOfficial(params) {
  return request('human_resource.positive_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 获取转正申请单详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOfficialDetail(params) {
  return request('human_resource.positive_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
/**
 * 编辑入职申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateInduction(params) {
  return request('administration.employment_apply.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
/**
 * 创建入职申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createInduction(params) {
  return request('administration.employment_apply.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
/**
 * 获取入职申请详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchInductionDetail(params) {
  return request('administration.employment_apply.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
/**
 * 获取关联审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getRelatedJobHandoverOrder(params) {
  return request('human_resource.handover_order.relate_select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true);
}
