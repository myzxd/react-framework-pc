/**
 * 私教账户管理 model
 *
 * @module model/teamAccount
 */
import is from 'is_js';
import { message } from 'antd';

import {
  fetchTeamMessage,
  createTeamMessage,
  fetchTeamAccountDistricts,
} from '../../services/team/message';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'teamMessage',
  /**
   * 状态树
   * @prop {string} teamMessages      私教指导列表
   */
  state: {
    // 私教指导列表
    teamMessages: {
      data: [],
      _meta: {},
    },
    // 私教账户商圈信息
    teamAccountDistricts: {},
  },

  /**
   * @namespace teamMessage/effects
   */
  effects: {
    /**
     * 获取私教账户列表
     * @memberof module:model/teamMessage~teamMessage/effects
     */
    *fetchTeamMessage({ payload }, { call, put }) {
      const {
        platforms,         // 平台
        suppliers,         // 供应商
        cities,            // 城市
        districts,         // 商圈
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }
      // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }
      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_spelling = cities;
      }
      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 请求服务器
      const result = yield call(fetchTeamMessage, params);
      if (result && result.data) {
        yield put({ type: 'reduceTeamMessage', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 获取私教账户商圈信息
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *fetchTeamAccountDistricts({ payload }, { call, put }) {
      const {
        onSuccessCallback,
      } = payload;
      const params = {};
      const result = yield call(fetchTeamAccountDistricts, params);
      if (result && result._id) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        yield put({ type: 'reduceTeamAccountDistricts', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 创建指导意见
     * @memberof module:model/teamMessage~teamMessage/effects
     */
    *createTeamMessage({ payload }, { call }) {
      const {
        districts,         // 商圈
        note,              // 指导意见
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(districts) || is.empty(districts)) {
        return message.error('商圈，参数不能为空');
      }
      if (is.not.existy(note) || is.empty(note)) {
        return message.error('指导意见，参数不能为空');
      }
      const params = {
        biz_district_id: districts,  // 商圈
        advise: note,                // 指导意见
      };
      const result = yield call(createTeamMessage, params);
      if (result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('创建成功');
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
  },

  /**
   * @namespace teamMessage/reducers
   */
  reducers: {

    /**
     * 更新私教账户列表
     * @returns {string} 更新 teamMessages
     * @memberof module:model/teamMessage~teamMessage/reducers
     */
    reduceTeamMessage(state, { payload }) {
      return {
        ...state,
        teamMessages: payload,
      };
    },

    /**
     * 更新私教账户商圈信息
     * @returns {string} 更新 teamAccountDistricts
     * @memberof module:model/teamMessage~teamMessage/reducers
     */
    reduceTeamAccountDistricts(state, { payload }) {
      return {
        ...state,
        teamAccountDistricts: payload,
      };
    },
  },
};
