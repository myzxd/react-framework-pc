/**
 * CODE审批事项配置相关接口模块
 * @module services/code/matter
 */
import request from '../../application/utils/request';

/**
 * 事项tree
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getMatterTree(params) {
  return request('qoa.scene.tree',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项详情get
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getMatterDetail(params) {
  return request('qoa.scene.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项链接列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getMatterLinkList(params) {
  return request('qoa.scene_link.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项编辑update
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateMatter(params) {
  return request('qoa.scene.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项链接详情get
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getMatterLinkDetail(params) {
  return request('qoa.scene_link.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项链接新建create
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createMatterLink(params) {
  return request('qoa.scene_link.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项链接编辑update
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateMatterLink(params) {
  return request('qoa.scene_link.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 事项链接删除delete
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteMatterLink(params) {
  return request('qoa.scene_link.mark_deleted',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * team列表find
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getTeamList(params) {
  return request('qcode.allow_cost_center.scene_link',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 收藏链接
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function markCollectLink(params) {
  return request('qoa.scene_link_collect.collect',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 收藏链接list
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getCollectLinkList(params) {
  return request('qoa.scene_link_collect.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * code首页提报校验
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function checkSubmit(params) {
  return request('qoa.scene_link_collect.check_submit',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}
