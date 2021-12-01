/**
 * 合同模版管理相关接口模块
 * @module services/system/city
 */
import request from '../../application/utils/request';

/**
 * 获取合同模版列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchContractTemplates(params) {
  return request('staff.contract_template.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 删除合同模版
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteContractTemplates(params) {
  return request('staff.contract_template.mark_deleted',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}

/**
 * 添加合同模版
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createContractTemplates(params) {
  return request('staff.contract_template.create',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}

/**
 * 预览合同模版
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchContractTemplatesPreview(params) {
  return request('staff.contract_template.preview',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}

/**
 * 组件详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchComponentDetais(params) {
  return request('staff.contract_template.get_component_variables',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}

/**
 * 合同模版 - 刷新
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRefreshContractTemplate(params) {
  return request('staff.contract_template.refresh',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}
