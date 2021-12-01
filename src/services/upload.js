/**
 * 上传相关接口模块
 * @module services/upload
 */
import request from '../application/utils/request';

/**
 * 文件预览 wps接口
 */
export async function fetchPriview(params = {}) {
  return request('asset.asset.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 *
 * @param {获取文件地址} params
 * @returns
 */

export async function fetchKeyUrl(params = {}) {
  return request('tool.tool.get_s3_url', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
/**
 * 获取七牛的token
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getUploadToken(params = {}) {
  return request('tool.tool.get_qiniu_token', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 文件上传七牛 TODO: 清理和重构相关调用的上传，统一上传的基础组件
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function postFileToQINIU(params) {
  return request('https://upload-z1.qbox.me', {
    method: 'POST',
    body: params,
  }).then(data => data);
}

// ----------------------------------优化可能需要的----------------------------------

/**
 * 上传文件到七牛
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function uploadFileToQiNiu(params) {
  return request('https://upload-z1.qbox.me', {
    method: 'POST',
    body: params,
  }).then(data => data);
}

/**
 * 上传文件到本地服务器 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function uploadFileToServer(params) {
  return request('/files/biz_data/upload', {
    method: 'POST',
    header: 'multipart/form-data',
    body: params,
  }).then(data => data);
}

/**
 * 获取七牛文件地址(当请求类型为get，使用qs模块进行参数拼接)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchFileURL(params) {
  return request('tool.tool.get_qiniu_url', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 获取亚马逊的计算信息,加密信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAmazonInfo(params) {
  return request('tool.tool.get_s3_policy', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 文件上传到亚马逊
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function uploadFileToAmazon(params) {
  return request(params.url, {
    method: 'POST',
    body: params.formdata,
  }).then(data => data);
}
