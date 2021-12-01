/**
 * oa 通用相关接口模块
 * @module services/oa/common
 */
import request from '../../application/utils/request';
/**
 * oa 部门信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDepartmentInformation(params) {
  return request('staff.employee.tiny',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 岗位库下拉列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOrganizationJob(params) {
  return request('organization.job.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 公司下拉列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCompanyList(params) {
  return request('business.firm.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 获取员工详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeDetail(params) {
  return request('staff.employee.tiny',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 根据部门/岗位获取审批流信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getExamineFlowInfo(params) {
  return request('oa.application_flow.preview',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 根据部门/岗位获取审批流信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getEmployeeDepAndPostInfo(params) {
  return request('staff.employee.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 提交事务性审批单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function submitOrder(params) {
  return request('oa.application_order.submit',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 事务性提报入口可见key
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getViewRange(params) {
  return request('utils.utils.gain_all_work_flow',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}
