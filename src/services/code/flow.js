/**
 * CODE审批流相关接口模块
 * @module services/code/flow
 */
import request from '../../application/utils/request';

/**
 * 审批流列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowList(params) {
  return request('qoa.flow.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流Select下拉列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowSelectList(params) {
  return request('qoa.flow.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流详情get
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowDetail(params) {
  return request('qoa.flow.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 停用/启用/删除审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setFlowState(params) {
  return request('qoa.flow.toggle',
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
 * 新增审批流节点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createFlowNode(params) {
  return request('qoa.flow_node.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑审批流节点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateFlowNode(params) {
  return request('qoa.flow_node.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除审批流节点
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteFlowNode(params) {
  return request('qoa.flow_node.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 科目列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getSubjectList(params) {
  return request('qcode.account.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流节点列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowNodeList(params) {
  return request('qoa.flow_node.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新增审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createFlow(params) {
  return request('qoa.flow.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑审批流
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateFlow(params) {
  return request('qoa.flow.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流适用code
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowCodeList(params) {
  return request('qcode.code.tree',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流适用team
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowTeamList(params) {
  return request('qcode.team.tree',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流预览
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFlowPreview(params) {
  return request('qoa.order.preview',
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
 * 付款规则详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getCodePaymentRule(params) {
  return request('qoa.payment_rule.get',
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
 * 编辑付款规则
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onUpdatePaymentRule(params) {
  return request('qoa.payment_rule.update',
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
 * 获取单个节点抄送数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getApplicantNodeCc(params) {
  return request('qoa.flow_node.get_carbon_copy',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用审批流申请节点设置抄送
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setCodeNodeCC(params) {
  return request('qoa.flow_node.set_carbon_copy',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
  ).then(data => data);
}
