import CryptoJS from 'crypto-js';
// import Crypto from 'crypto';
import Errors from './errors';
import { authorize, config } from '../../../application';

class RequestHelper {

  /**
   * X-AUTH 签名
   *
   * @param  {number} timestamp 时间戳
   * @return {string}           加密串
   */
  static signByAuth(timestamp) {
    const message = [timestamp, timestamp].join(':');
    return CryptoJS.HmacMD5(message, config.SecretKey).toString();
  }

  /**
   * X-TOKEN 签名
   *
   * @param  {string} token     登陆后返回的授权token
   * @param  {number} timestamp 时间戳
   * @return {string}           加密串
   */
  static signByToken(token, timestamp) {
    const message = [token, timestamp, timestamp].join(':');
    return CryptoJS.HmacMD5(message, config.SecretKey).toString();
  }

  /**
   * 获取签名的header
   *
   * @param  {string} type header签名类型，X-AUTH或者X-TOKEN
   * @return {array}       签名加密后的header数据
   */
  static getHeaderBySign(type) {
    const timestamp = new Date() * 1;
    const result = {
      'X-APP-KEY': config.AccessKey,
      'X-MSG-ID': [timestamp, timestamp].join(','),
    };

    let sign = null;
    if (type === 'X-AUTH') {
      sign = RequestHelper.signByAuth(timestamp);
      result[type] = [sign].join(',');
    } else {
      const token = authorize.account.accessToken;
      sign = RequestHelper.signByToken(token, timestamp);
      result[type] = [token, sign].join(',');
    }
    return result;
  }


  /**
   * 获取错误信息
   *
   * @param  {object} error 错误信息对象
   * @return {string}       错误信息
   */
  static getErrorMessage(error) {
    // 错误不存在，则直接返回
    if (error === undefined) {
      return '错误不存在，无法提供信息';
    }

    // 错误码不存在，则直接返回错误
    if (!error.err_code && !Number(error.err_code) && error.err_code !== 0) {
      return error;
    }

    // 错误信息
    let errorMessage = '';

    // 判断新的接口格式返回的错误信息
    if (error.zh_message) {
      errorMessage = error.zh_message;
    } else {
      errorMessage = Errors[error.err_code] || `${error.err_code} ${error.err_name} ${error.message}`;
    }

    // 返回参数错误的具体信息
    if (error.err_code === 401001) {
      return `${errorMessage}`;
    }

    // TODO 关联账号已存在
    if (error.err_code === 1080 || error.err_code === 1088) {
      // 展示关联失败的手机号
      const phones = authorize.phones;
      const accountIds = [];
      phones.forEach((item) => {
        const errMsg = error.message;
        for (let i = 0; i < errMsg.length; i += 1) {
          if (item.id === error.message[i]) {
            accountIds.push(item.phone);
          }
        }
      });
      return `${Errors[error.err_code]}:${accountIds.join(',')}`;
    }
    // 返回正常的错误
    if (error.err_code !== 415001 && error.err_code !== 415002) {
      return errorMessage;
    }

    return errorMessage;
  }

  // 随机字符串（指定长度）
  static cryptoRandomString(len) {
    if (!Number.isFinite(len)) {
      throw new TypeError('Expected a finite number');
    }

    return Array.prototype.map.call(window.crypto.getRandomValues(new Uint8Array(len)), item => item.toString(16)).join('');
  }

  // 32位的随机字符串
  static uniqueString() {
    return RequestHelper.cryptoRandomString(32);
  }

}

export default RequestHelper;
