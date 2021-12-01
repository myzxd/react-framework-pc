/**
 * 系统设置
 *
 * @module model/application/setting
 */
import is from 'is_js';

import { fetchAndroidAppInfo, fetchBossAppInfo, fetchBossHomeAppInfo } from '../../services/setting';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'applicationSetting',

  /**
   * 状态树
   * @prop {object} androidAppInfo boss骑士安卓app信息
   */
  state: {
    androidAppInfo: {},   // boss骑士安卓app信息
    bossAppInfo: {},   // boss当家安卓app信息
    bossHomeAppInfo: {},   // boss之家安卓app信息
  },

  /**
   * @namespace application/setting/effects
   */
  effects: {
    /**
     * 获取boss骑士安卓app信息
     * @memberof module:model/application/setting~application/setting/effects
     */
    *fetchAndroidAppInfo({ payload = {} }, { call, put }) {
      // 请求服务器
      const result = yield call(fetchAndroidAppInfo);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceAndroidAppInfo', payload: result });
      }
    },
    /**
     * 获取boss当家app信息
     * @memberof module:model/application/setting~application/setting/effects
     */
    *fetchBossAppInfo({ payload = {} }, { call, put }) {
      // 请求服务器
      const result = yield call(fetchBossAppInfo);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceBossAppInfo', payload: result });
      }
    },
    /**
     * 获取boss之家app信息
     * @memberof module:model/application/setting~application/setting/effects
     */
    *fetchBossHomeAppInfo({ payload = {} }, { call, put }) {
      // 请求服务器
      const result = yield call(fetchBossHomeAppInfo);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceBossHomeAppInfo', payload: result });
      }
    },
  },

  /**
   * @namespace application/setting/reducers
   */
  reducers: {
    /**
     * boss骑士安卓客户端信息
     * @return {object} 更新 androidAppInfo
     * @memberof module:model/application/setting~application/setting/reducers
     */
    reduceAndroidAppInfo(state, action) {
      // 写入数据
      return { ...state, androidAppInfo: action.payload };
    },
    /**
     * boss当家安卓客户端信息
     * @return {object} 更新 bossAppInfo
     * @memberof module:model/application/setting~application/setting/reducers
     */
    reduceBossAppInfo(state, action) {
      return { ...state, bossAppInfo: action.payload };
    },
    /**
     * boss之家安卓客户端信息
     * @return {object} 更新 bossHomeAppInfo
     * @memberof module:model/application/setting~application/setting/reducers
     */
    reduceBossHomeAppInfo(state, action) {
      return { ...state, bossHomeAppInfo: action.payload };
    },
  },
};
