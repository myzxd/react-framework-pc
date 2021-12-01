/**
 * 分发明细
 * @module model/supply/distribution
 **/
import is from 'is_js';
import { fetchSupplyDistributionList } from '../../services/supply';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'supplyDistribution',
  /**
   * 状态树
   * @prop {object} supplyDistributionData    采购入库明细列表
   */
  state: {
    supplyDistributionData: {},
  },
  /**
   * @namespace supply/distribution/effects
   */
  effects: {
    /**
     * 获取分发明细列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @memberof module:model/supply/distribution~supply/distribution/effects
     */
    * fetchSupplyDistributionList({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
       // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_spellings = payload.cities;
      }
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 根据商圈获取数据
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      // 分发周期
      if (is.existy(payload.belongTime) && is.not.empty(payload.belongTime)) {
        params.belong_month = Number(payload.belongTime);
      }
      // 领用状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.current_state = payload.state;
      }

      const result = yield call(fetchSupplyDistributionList, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceSupplyDistribution', payload: result });
      }
    },
  },
  /**
   * @namespace supply/distribution/reducers
   */
  reducers: {
    /**
     * 获取分发明细列表
     * @returns {object} 更新 supplyDistributionData
     * @memberof module:model/supply/distribution~supply/distribution/reducers
     */
    reduceSupplyDistribution(state, action) {
      const supplyDistributionData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: action.payload.data.map((v) => {
          const item = { ...v };
          // 判断物资相关内容是否存在
          if (is.not.existy(v.material_item_info) || is.empty(v.material_item_info)) {
            item.material_item_info = {};
          }
          // 判断人员相关内容是否存在
          if (is.not.existy(v.staff_info) || is.empty(v.staff_info)) {
            item.staff_info = {};
          }
          return item;
        }),
      };
      return { ...state, supplyDistributionData };
    },
  },
};
