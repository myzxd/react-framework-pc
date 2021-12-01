/**
 * 无业主商圈监控
 * @module model/team/nothingOwner
 **/
import is from 'is_js';
import {
  fetchNothingOwnerList,
} from '../../services/team/nothingOwner';


export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'nothingOwner',
  /**
   * 状态树
   * @prop {object} nothingOwnerData    无业主商圈监控列表
   */
  state: {
    nothingOwnerData: {},
  },
  /**
   * @namespace team/nothingOwner/effects
   */
  effects: {
    /**
     * 无业主商圈监控列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   name       商圈名称
     * @memberof module:model/team/nothingOwner~team/nothingOwner/effects
     */
    * fetchNothingOwnerList({ payload = {} }, { call, put }) {
      const params = {};
       // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = Array.isArray(payload.suppliers) ? payload.suppliers : [payload.suppliers];
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_code = Array.isArray(payload.cities) ? payload.cities : [payload.cities];
      }
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code = payload.platforms;
      }
      // 商圈名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 商圈BOSS ID
      if (is.existy(payload.bossId) && is.not.empty(payload.bossId)) {
        params.biz_district_id = payload.bossId;
      }
      // 分页
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      const result = yield call(fetchNothingOwnerList, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceNothingOwner', payload: result });
      }
    },
  },
  /**
   * @namespace team/nothingOwner/reducers
   */
  reducers: {
    /**
     * 扣款明细列表
     * @returns {object} 更新 nothingOwnerData
     * @memberof module:model/team/nothingOwner~team/nothingOwner/reducers
     */
    reduceNothingOwner(state, action) {
      return { ...state, nothingOwnerData: action.payload };
    },
  },
};
