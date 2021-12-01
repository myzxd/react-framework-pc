/**
 * CODE提报页相关接口模块
 * @module services/code/flow
 */
import request from '../../application/utils/request';

export async function fetchTreeData(params) {
  return request('qoa.scene.tree', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 组织管理详情
export async function fetchDepartmentPostDetail(params) {
  return request('oa_organization_order.oa_organization_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

