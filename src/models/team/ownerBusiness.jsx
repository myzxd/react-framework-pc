/**
 * 业务承揽记录 model
 *
 * @module model/teamManager
 */
import is from 'is_js';

import {
  fetchOwnerBusinessList,
  fetchOwnerId,
} from '../../services/team/ownerBusiness.js';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'ownerBusiness',
  /**
   * 状态树
   * @prop {string} businessList      业务承揽记录列表
   */
  state: {
    businessList: {},   //  业务承揽记录列表
    businessOwner: [],
  },

  /**
   * @namespace ownerBusiness/effects
   */
  effects: {
    /**
     * 获取业务承揽记录列表
     * @memberof module:model/ownerBusiness~ownerBusiness/effects
     */
    *fetchOwnerBusinessList({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code = payload.platforms;
      }
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_code = payload.cities;
      }
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_id = payload.districts;
      }
      const result = yield call(fetchOwnerBusinessList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceBusinessList', payload: result });
      }
    },
    /**
     * 承揽范围获取业主
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerId({ payload }, { call, put }) {
      const params = {};
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      const result = yield call(fetchOwnerId, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceBusinessOwner', payload: result });
      }
    },
    /**
     * 重置承揽范围业主
     * @memberof module:model/teamManager~teamManager/effects
     */
    *effctResetOwnerId({ payload }, { put }) {
      yield put({ type: 'resetOwnerId' });
    },
  },

  /**
   * @namespace ownerBusiness/reducers
   */
  reducers: {

    /**
     * 更新业务承揽列表
     * @returns {string} 更新 ownerBusiness
     * @memberof module:model/ownerBusiness~ownerBusiness/reducers
     */
    reduceBusinessList(state, { payload }) {
      return {
        ...state,
        businessList: payload,
      };
    },

    /**
     * 根据身份证获取业主
     * @returns {string} 更新 ownerBusiness
     * @memberof module:model/ownerBusiness~ownerBusiness/reducers
     */
    reduceBusinessOwner(state, { payload }) {
      return {
        ...state,
        businessOwner: payload.data,
      };
    },
    /**
     * 根据身份证获取业主
     * @returns {string} 更新 ownerBusiness
     * @memberof module:model/ownerBusiness~ownerBusiness/reducers
     */
    resetOwnerId(state) {
      return {
        ...state,
        businessOwner: [],
      };
    },
  },
};
