/**
 * CODE公用的相关接口模块
 * @module services/code/flow
 */
import request from '../../application/utils/request';

// 科目
export async function fetchSubject(params) {
  return request('qcode.account.find_biz_accounts', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 获取code核算中心
export async function fetchCodeBusinessAccounting(params) {
  return request('qcode.code.find_biz_codes', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

// 获取team核算中心
export async function fetchTeamBusinessAccounting(params) {
  return request('qcode.team.find_biz_teams', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
