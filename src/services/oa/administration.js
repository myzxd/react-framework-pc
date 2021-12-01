/**
 * oa 行政类相关接口模块
 * @module services/oa/administration
 */
import request from '../../application/utils/request';

/**
 * 印章保管人
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchKeepingList(params) {
  return request('organization.department.subordinate',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 用章申请 - 创建用章申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createUseSeal(params) {
  return request('administration.seal_use_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 用章申请 - 编辑用章申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateUseSeal(params) {
  return request('administration.seal_use_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 用章申请 - 用章申请详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchUseSealDetail(params) {
  return request('administration.seal_use_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 拉取印章库信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSealList(params) {
  return request('administration.seal.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 刻章申请 - 创建刻章申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createCarveSeal(params) {
  return request('administration.seal_engrave_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 刻章申请 - 编辑刻章申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateCarveSeal(params) {
  return request('administration.seal_engrave_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 刻章申请 - 刻章申请详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCarveSealDetail(params) {
  return request('administration.seal_engrave_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 名片申请 - 新增名片申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createBusinessCard(params) {
  return request('administration.visiting_card_order.create', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 名片申请 - 编辑名片申请
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateBusinessCard(params) {
  return request('administration.visiting_card_order.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 名片申请 - 名片申请详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBusinessCardDetail(params) {
  return request('administration.visiting_card_order.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 证照库
 */
export async function fetchLicenseList(params) {
  return request('administration.cert.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 创建证照借用申请
 */
export async function createBorrowLicense(params) {
  return request('administration.cert_borrow_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑证照借用申请
 */
export async function updateBorrowLicense(params) {
  return request('administration.cert_borrow_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 证照借用申请详情
 */
export async function fetchBorrowLicenseDetail(params) {
  return request('administration.cert_borrow_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建废章申请
 */
export async function createInvalidSeal(params) {
  return request('administration.seal_revoke_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑废章申请
 */
export async function updateInvalidSeal(params) {
  return request('administration.seal_revoke_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取废章申请详情
 */
export async function fetchInvalidSealDetail(params) {
  return request('administration.seal_revoke_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 创建奖惩申请
 */
export async function createReward(params) {
  return request('administration.prize_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 编辑奖惩申请
 */
export async function updateReward(params) {
  return request('administration.prize_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 奖惩申请详情
 */
export async function fetchRewardDetail(params) {
  return request('administration.prize_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
