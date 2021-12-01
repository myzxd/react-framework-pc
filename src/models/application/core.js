/**
 * 核心业务员, 处理请求
 *
 * @module model/application/core
 */
import is from 'is_js';
import { message } from 'antd';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'applicationCore',

  /**
   * 状态树
   */
  state: {},

  /**
   * @namespace application/core/effects
   */
  effects: {
    /**
     * 封装的内部方法，请求接口，进行回调
     * @param {string} service 请求调用的接口服务
     * @param {object} params 请求的参数
     * @param {function} onVerifyCallback 校验回调
     * @param {function} onSuccessCallback 请求成功回调
     * @param {function} onFailureCallback 请求失败回调
     * @memberof module:model/application/core~application/core/effects
     */

    * requestWithCallback({ payload = {} }, { call }) {
      const {
        service,            // 请求调用的接口服务
        params,             // 请求的参数
        onVerifyCallback,   // 校验回调，参数为服务器返回数据。回调中需校验通过条件，成功返回true
        onSuccessCallback,  // 请求成功回调
        onFailureCallback,  // 请求失败回调
      } = payload;

      // 请求接口
      const result = yield call(service, params);

      // 请求结果校验
      let isVerify;
      if (onVerifyCallback) {
        // 判断结果数据是否不为空 && 自定义校验
        isVerify = is.existy(result) && onVerifyCallback(result);
      } else {
        // 判断结果数据是否不为空 && 默认校验
        isVerify = is.existy(result) && (is.truthy(result.ok) || is.truthy(result._id));
      }

      // 成功回调
      if (is.truthy(isVerify)) {
        if (onSuccessCallback) {
          onSuccessCallback(result);
        }
        return message.success('请求成功');
      }
      // 失败回调
      if (onFailureCallback) {
        onFailureCallback(result);
      } else if (result.zh_message) {
      // zh_message
        return message.error(`请求错误：${result.zh_message}`);
      } else if (result.message) {
      // message
        return message.error(`请求错误：${result.message}`);
      }
    },
  },
};
