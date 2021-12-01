/**
 * 组织架构 - 部门管理 - 岗位Tab
 * @module services/organization/manage/staffs
 */
import request from '../../../application/utils/request';

/**
 * 部门下岗位列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDepartmentStaffs(params) {
  return request('organization.department_job.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新建部门下岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createDepartmentStaff(params) {
  return request('organization.department_job.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑部门下岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateDepartmentStaff(params) {
  return request('organization.department_job.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 删除部门下岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onDeletePost(params) {
  return request('organization.department_job.toggle_state',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取岗位详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getStaffDetail(params) {
  return request('organization.department_job.get',
    {
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

/**
 * 删除岗位校验
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function checkDeleteDepartmentStaff(params) {
  return request('organization.department_job.toggle_validator',
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
 * 岗位编制数调整（不走审批）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setOrganizationCount(params) {
  return request('organization.department_job.update_organization_count',
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
 * 岗位编制数调整（新建申请）（走审批）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createApproveOrganizationCount(params) {
  return request('organization.department_job_apply.organization_count_create',
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
 * 岗位编制数调整（编辑申请）（走审批）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateApproveOrganizationCount(params) {
  return request('organization.department_job_apply.organization_count_update',
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
 * 新增岗位（不走审批）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createOrganizationPost(params) {
  return request('organization.department_job.create',
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
 * 新增岗位（走审批）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createApproveOrganizationPost(params) {
  return request('organization.department_job_apply.create',
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
 * 编辑岗位（走审批）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateApproveOrganizationPost(params) {
  return request('organization.department_job_apply.update',
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
 * 关闭审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function onCloseApproveOrder(params) {
  return request('oa_organization_order.oa_organization_order.mark_closed',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
     undefined,
     true,
   ).then(data => data);
}
