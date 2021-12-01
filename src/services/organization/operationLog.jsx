/**
 * 组织架构 - 操作日志
 * @module services/organization/operationLog
 */
import request from '../../application/utils/request';

/**
 * 操作日志列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOperationLogList(params) {
  return request('system.operate_log.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 操作对象
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchOperationObject(params) {
  return request('system.operate_log.attributes',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
