/**
 * 组织架构 - 部门管理 - 部门Tab
 * @module services/organization/manage/department
 */
import request from '../../../application/utils/request';

/**
 * 部门Tree
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDepartmentTree(params) {
  return request('organization.department.tree',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 部门详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDepartmentDetail(params) {
  return request('organization.department.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 当前部门下级部门
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getChildDepartmentList(params) {
  return request('organization.department.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建部门
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createDepartment(params) {
  return request('organization.department.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑部门
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateDepartment(params) {
  return request('organization.department.update',
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
 * 撤销部门
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteDepartment(params) {
  return request('organization.department.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出部门下成员
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportMember(params) {
  return request('staff.staff_profile.download_staff_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 部门下成员
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDepartmentMember(params) {
  return request('staff.employee.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 导出部门
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportDepartment(params) {
  return request('organization.department.download',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 裁撤部门校验
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function checkDeleteDepartment(params) {
  return request('organization.department.toggle_validator',
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
 * 审批-调整上级部门-创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOaUpperDepartment(params) {
  return request('oa_organization_order.adjust_department_apply.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批-调整上级部门-编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOaUpperDepartment(params) {
  return request('oa_organization_order.adjust_department_apply.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 部门操作前校验
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function checkDepartmentUpdate(params) {
  return request('oa_organization_order.oa_organization_order.hint',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 审批-新增子部门-创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOaSubDepartment(params) {
  return request('oa_organization_order.add_sub_department_apply.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批-新增子部门-编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateOaSubDepartment(params) {
  return request('oa_organization_order.add_sub_department_apply.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 部门/编制申请单关闭
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function closeOaOrganizationOrder(params) {
  return request('oa_organization_order.oa_organization_order.mark_closed',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批-裁撤部门-新增
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createRevokeDepartment(params) {
  return request('oa_organization_order.cut_department_apply.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批-裁撤部门-编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateRevokeDepartment(params) {
  return request('oa_organization_order.cut_department_apply.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 通用配置find（组织架构操作配置）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOrganizationConfig(params) {
  return request('common_config.common_config.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 事务申请获取可用事务审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getOrganizationFlowList(params) {
  return request('oa.application_flow.work_flow_apply_for_find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 部门/编制申请单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function findDepartmentOrderList(params) {
  return request('oa_organization_order.oa_organization_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
