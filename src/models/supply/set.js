/**
 * 科目设置
 * @module model/supply/set
 **/
import is from 'is_js';
import { fetchSupplySet } from '../../services/supply';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'supplySet',
  /**
   * 状态树
   * @prop {object} supplySetData    物资设置列表
   */
  state: {
    supplySetData: {},
  },
  /**
   * @namespace supply/set/effects
   */
  effects: {
    /**
     * 获取科目列表
     * @param {array}   platforms  平台
     * @memberof module:model/supply/set~supply/set/effects
     */
    * fetchSupplySet({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };

      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      const result = yield call(fetchSupplySet, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceExpenseSubjects', payload: result });
      }
    },
  },
  /**
   * @namespace supply/set/reducers
   */
  reducers: {
    /**
     * 获取科目列表
     * @returns {object} 更新 subjectsData
     * @memberof module:model/supply/set~supply/set/reducers
     */
    reduceExpenseSubjects(state, action) {
      const supplySetData = {
        // eslint-disable-next-line no-underscore-dangle
        meta: ResponseMeta.mapper(action.payload._meta),
        data: action.payload.data,
      };
      return { ...state, supplySetData };
    },
  },
};
