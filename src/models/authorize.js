/**
 * 用户授权管理model层模块
 *
 * @module model/authorizeManage
 */
import is from 'is_js';
import { message } from 'antd';

import { fetchVerifyCode, login, loginClear, refreashAuthorize, exchangeAccount, fetchDatahubAuthorizeURL } from '../services/login.js';

import { authorize, system } from '../application/';
import { Account } from '../application/object';
import { SystemIdentifier } from '../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'authorizeManage',
  /**
   * 状态树
   * @prop {string} verifyCode 登陆验证码
   */
  state: {
    verifyCode: '',  // 登陆验证码
  },

  /**
   * @namespace authorizeManage/effects
   */
  effects: {
    /**
     * 获取验证码
     * @memberof module:model/authorizeManage~authorizeManage/effects
     */
    *fetchVerifyCode({ payload }, { call, put }) {
      const result = yield call(fetchVerifyCode, payload);
      if (result.ok) {
        message.success('验证码发送成功', 2);
      } else if (result.verify_code) {
        // 测试环境，验证码直接填充到输入框中
        message.success(`验证码发送成功 ${result.verify_code}`, 2);
        yield put({ type: 'reduceVerifyCode', payload: result.verify_code });
      } else if (result.zh_message) {
        message.error(result.zh_message);
      }
    },

    /**
     * 登录授权
     * @memberof module:model/authorizeManage~authorizeManage/effects
     */
    *fetchAuthorize({ payload }, { call }) {
      const result = yield call(login, payload);
      if (!result || result.code || is.not.existy(result.account_id) || is.not.existy(result.access_token)) {
        return message.error('登陆失败');
      }

      // 登陆成功后的用户信息，转化成数据对象
      authorize.account = Account.mapper(result);
      // 判断是否有多个账户，如果账户只有一个或小于1个，则设置为授权状态
      if (authorize.account.exchangeAccounts.length <= 1) {
        authorize.setAuth(true);
      }
      // 登陆成功跳转
      message.success('登录成功, 页面跳转中...');

      // 多账号时，进入多账号页面
      if (authorize.isAuth() === false) {
        setTimeout(() => { window.location.href = '/#/authorize/auth'; }, 1000);
      } else {
        // 唯一账号自动跳入
        setTimeout(() => { window.location.href = '/#/Code/Home'; window.location.reload(); }, 3000);
      }
    },

    /**
     * 切换授权
     * @param {string} accountId 账户id
     * @memberof module:model/authorizeManage~authorizeManage/effects
     */
    *exchangeAuthorize({ payload }, { call }) {
      const accountId = payload.accountId;
      // 判断参数
      if (!accountId || accountId.length !== 24) {
        message.error('账户ID错误，无法获取账户ID信息');
        return;
      }
      const result = yield call(exchangeAccount, { account_id: accountId });
      if (!!result && result === undefined) {
        message.error(`切换账号失败 : ${result.err_code}`);
      }

      // 登陆成功后的用户信息，转化成数据对象
      authorize.account = Account.mapper(result);
      authorize.setAuth(true);

      // 登陆成功跳转
      message.success('切换账号成功, 页面跳转中...');
      setTimeout(() => { window.location.href = '/#/Code/Home'; window.location.reload(); }, 3000);
    },

    /**
     * 刷新授权
     * @param {string} accountId 账户id
     * @memberof module:model/authorizeManage~authorizeManage/effects
     */
    *refreashAuthorize({ payload }, { call }) {
      const result = yield call(refreashAuthorize);
      if (!!result && result === undefined) {
        // loading
        if (payload && payload.onLoading) {
          payload.onLoading();
        }
        // eslint-disable-next-line
        console.error(`自动刷新授权：获取账号信息失败 : ${result.err_code}`);
      }
      // loading
      if (payload && payload.onLoading) {
        payload.onLoading();
      }
      // 登陆成功后的用户信息，转化成数据对象
      authorize.account = Account.mapper(result);
      authorize.setAuth(true);
      // 切换账户页面不刷新页面
      if (payload && payload.isReload === false) {
        return;
      }
      window.location.reload();
    },

    /**
     * 注销登录
     * @param {string} access_token 注销的用户 token
     * @memberof module:model/authorizeManage~authorizeManage/effects
     */
    *loginClear({ payload }, { call }) {
      const params = {
        access_token: authorize.account.accessToken, // 注销的用户 token
      };
      // 判断退出时，是否有access_token，有则调用，否则不调用注销,只清除缓冲
      if (params.access_token) {
        const result = yield call(loginClear, params);
        if (!result || (result.code && result.code)) {
          message.error(`退出失败 ${result.message}`, 2);
          return;
        }
        message.success('注销成功', 1);
      }

      setTimeout(() => {
        authorize.clear();
        system.clear();
        // 跳转到首页
        window.location.href = '/';
      }, 500);
    },

    /**
     * 获取跳转链接参数的接口
     * @param {string} access_token 注销的用户 token
     * @memberof module:model/authorizeManage~authorizeManage/effects
     */
    *redirectToDatahub({ payload }, { call }) {
      const { domain, route } = payload;
      const params = {
        merchant_code: SystemIdentifier.boss,
      };
      // 判断domain参数
      if (is.existy(domain) && is.not.empty(domain)) {
        params.domain = domain;
      }

      // 判断是否有跳转后的路由参数
      if (is.existy(route) && is.not.empty(route)) {
        params.route = route;
      }

      const result = yield call(fetchDatahubAuthorizeURL, params);
      if (is.existy(result.url)) {
        // 拼接跳转的链接
        const authorizeURL = `${result.url}`;
        message.success('切换中...', 2, () => {
          window.location.href = authorizeURL;
        });
        return;
      }
      // 判断失败信息
      if (is.existy(result.zh_message)) {
        message.error(`切换失败: ${result.zh_message}`);
      } else {
        message.error('切换失败，无法获取授权信息');
      }
    },
  },

  /**
   * @namespace authorizeManage/reducers
   */
  reducers: {

    /**
     * 更新验证码（测试环境下会调用）
     * @returns {string} 更新 verifyCode
     * @memberof module:model/authorizeManage~authorizeManage/reducers
     */
    reduceVerifyCode(state, action) {
      return { ...state, verifyCode: action.payload };
    },
  },

};
