/* eslint no-underscore-dangle: ["error", { "allow": ["_global", "_search","_config","_cache"] }]*/
import moment from 'moment';
import CryptoJS from 'crypto-js';

import Config from './config';
import { SystemIdentifier } from '../define/index';
import Storage from '../library/storage';

const namespace = 'aoao.app.system';

class System {
  constructor() {
    // 全局变量（服务器获取的）
    this._global = new Storage(namespace, { container: 'global' });
    // 全局变量（search value）
    this._search = new Storage(namespace, { container: 'search' });
  }

  get debugToken() {
    return this._global.get('debugToken');
  }

  set debugToken(token) {
    this._global.set('debugToken', token);
  }

  // 获取搜索参数
  searchParams = key => this._search.get(key, {});

  // 设置搜索参数
  setSearchParams = (key, data) => {
    this._search.set(key, data);
  }

  // 是否允许费用归属模块
  isEnableCostBelongModule = () => {
    // 趣活 ，兴达，鲜巧
    return SystemIdentifier.isBossSystemIdentifier(Config.SystemIdentifier) ||
    SystemIdentifier.isXingDaSystemIdentifier(Config.SystemIdentifier) ||
    SystemIdentifier.isXianQiaoSystemIdentifier(Config.SystemIdentifier);
  }
  // 是否允许费用，收款信息选择钱包类型
  isEnablExpenseCollectionPayeeType = () => {
      // 趣活,兴达,游客
    return SystemIdentifier.isBossSystemIdentifier(Config.SystemIdentifier) ||
      SystemIdentifier.isXingDaSystemIdentifier(Config.SystemIdentifier) ||
      SystemIdentifier.isYouKeSystemIdentifier(Config.SystemIdentifier);
  }
  // 是否是code系统
  isShowCode = () => {
    return Config.isShowCode;
  }


  // 判断是否是调试模式
  isDebugMode = () => {
    return this.debugToken === this.debugModeToken();
  }

  // 调试模式token
  debugModeToken = () => {
    const date = moment().format('YYYY-MM-DD');
    return CryptoJS.MD5(date).toString();
  }

  // 清空数据
  clear = () => {
    this._global.clear();
    this._search.clear();
  }

  debug = () => {
    const storage = new Storage(namespace);
    // eslint-disable-next-line no-console
    console.log('DEBUG:storage', storage);
    // eslint-disable-next-line no-console
    console.log('DEBUG:this._global', this._global);
  }
}

// 上一版 module.exports = System;
export default System;
