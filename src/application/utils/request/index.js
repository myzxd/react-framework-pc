/* eslint no-underscore-dangle: ["error", { "allow": ["_options"] }]*/

import fetch from 'dva/fetch';
import { message } from 'antd';
import RequestHelper from './helper';
import { notification, authorize, config } from '../../index';

// api请求的版本号
const APIVersion = {
  v1: 'v1',  // 正常的http请求
  v2: 'v2',  // cmd方式的http请求
};

// api协议版本1.0的接口地址
const ApiV1 = config.ApiV1;
// api协议版本2.0的接口地址
const ApiV2 = config.ApiV2;

/**
* 解析json
*
* @param  {object} response 返回数据
* @return {object}          解析数据
*/
function parseJSON(response) {
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

/**
 * 检查网络请求的返回状态
 *
 * @param  {object} response 请求结果数据
 * @return {object}          如果状态成功，返回请求结果数据，失败则返回错误信息
 */
function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status >= 400 && response.status < 500) {
    return response;
  }

  // 错误抛出
  const error = new Error(response.statusText);
  error.code = response.status;
  error.message = response.statusText;
  error.response = response;
  error.serverError = true;
  throw error;
}

// 检查服务器返回数据是否有错误
function checkServerError(data, noMessage) {
  // 处理400错误，判断服务器数据错误
  if (((data.err_code !== undefined && data.err_code) || data.err_code === 0) && noMessage !== true) {
    const error = new Error(data.err_name);
    error.code = data.err_code;
    error.name = data.err_name;
    error.message = RequestHelper.getErrorMessage(data);
    error.response = data;
    throw error;
  }
  return data;
}

/**
 * 请求服务器
 * @param  {[type]} uri                        接口地址
 * @param  {[type]} options                    设置项目
 * @param  {[type]} type                       验证类型
 * @return {[type]}                            处理后的数据
 */
function request(uri, options = {}, type, noMessage) {
  // 请求协议类型。默认1.0
  const apiVersion = options.apiVersion || APIVersion.v1;

  // 默认的请求方式是get方式
  const _options = options || {
    method: 'get',
  };
  // 删除版本号相关的参数
  delete _options.apiVersion;

  _options.headers = {};

  // 刷新缓存，屏蔽，数据没处理好，账户容易出问题
  // if (authorize.account != undefined) {
  //   refreshToken();
  // }

  let api;
  if (uri.match('https://(.*)qbox.me')) {
    // 如果是七牛、百度语音api，亚马逊S3就直接用外部的API
    api = uri;
  } else if (uri.match('https://(.*)amazonaws.com')) {
    // 如果是亚马逊S3就直接用外部的API
    api = uri;
  } else if (uri.indexOf('/files/biz_data/upload') > -1) {
    api = ApiV1 + uri;
    // 判断是否需要进行授权，如果需要进行授权，则使用xAuth
    _options.headers = RequestHelper.getHeaderBySign(type ? 'X-AUTH' : 'X-TOKEN');
  } else {
    // 协议版本 1
    if (apiVersion === APIVersion.v1) {
      api = ApiV1 + uri;
      // 判断是否需要进行授权，如果需要进行授权，则使用xAuth
      _options.headers = RequestHelper.getHeaderBySign(type ? 'X-AUTH' : 'X-TOKEN');
      if (_options.method !== 'GET') {
        _options.headers['Content-Type'] = 'application/json';
      }
    }

    // 协议版本2
    if (apiVersion === APIVersion.v2) {
      api = ApiV2;
      // 必须是post方式
      _options.method = 'POST';
      // 判断是否需要进行授权，如果需要进行授权，则使用xAuth
      _options.headers = RequestHelper.getHeaderBySign(type ? 'X-AUTH' : 'X-TOKEN');
      _options.headers['X-CMD'] = `boss.${uri}`;
      _options.headers['Content-Type'] = 'application/json';
    }
  }


  // 跨域
  Object.assign(_options, {
    mode: 'cors',
  });

  // 请求标识
  const requestKey = RequestHelper.uniqueString();
  if (notification.create) {
    notification.create(requestKey);
  }

  return fetch(api, _options)
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(data => checkServerError(data, noMessage))
    .then((data) => {
      if (notification.success) {
        notification.success(requestKey);
      }
      return data;
    })
    .catch((error) => {
      if (notification.failure) {
        // 网络链接错误
        if (error.code === undefined && error.message === 'Failed to fetch') {
          notification.failure(requestKey, '请检查您的网络链接');
          return;
        }

        // 账户已过期，需要重新登陆
        if (error.code === 415001) {
          // message.info('账户已过期，请重新登录', 2);
          const timer = setTimeout(() => {
            authorize.clear();
            window.location.href = '/#/';
            window.location.reload();
            clearTimeout(timer);
          }, 2000);
          return;
        }

        // 处理错误信息
        let failureMessage = '';
        const code = error.code || '';
        const name = error.name || '';
        if (error.serverError) {
          failureMessage = `服务器错误：${error.message} ${code} ${name} `;
          notification.failure(requestKey, failureMessage);
        } else {
          notification.success(requestKey);
          message.error(`请求错误：${error.message}`);
        }
      }
      return error;
    });
}

// 判断token是否过期
/* function refreshToken() {
  let timestamp = Date.parse(new Date());
  const head = RequestHelper.getHeaderBySign('X-TOKEN');
  head['Content-Type'] = 'application/json';
  timestamp /= 1000;
  const accountInfo = authorize.account;
  if (accountInfo === undefined) {
    authorize.clear();
  }
  if (accountInfo.expiredAt < timestamp) {
    // message.error('账户过期请重新登录');
    window.location.href = '/#/';
    window.location.reload();
  } else if (accountInfo.expiredAt - timestamp < 3600 * 24 && accountInfo.expiredAt - timestamp > 0) {
    // TODO: refreshToken
  }
} */

export default request;
