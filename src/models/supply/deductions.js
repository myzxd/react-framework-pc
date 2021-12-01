/**
 * 扣款明细
 * @module model/supply/deductions
 **/
import is from 'is_js';
import { fetchSupplyDeductionsList } from '../../services/supply';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'supplyDeductions',
  /**
   * 状态树
   * @prop {object} supplyDeductionsData    采购入库明细列表
   */
  state: {
    supplyDeductionsData: {},
  },
  /**
   * @namespace supply/deductions/effects
   */
  effects: {
    /**
     * 获取扣款明细列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @memberof module:model/supply/deductions~supply/deductions/effects
     */
    * fetchSupplyDeductionsList({ payload = {} }, { call, put }) {
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
      // 根据归属时间获取数据
      if (is.existy(payload.belongTime) && is.not.empty(payload.belongTime)) {
        params.belong_time = Number(payload.belongTime);
      }
      const result = yield call(fetchSupplyDeductionsList, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceSupplyDeductions', payload: result });
      }
    },
  },
  /**
   * @namespace supply/deductions/reducers
   */
  reducers: {
    /**
     * 扣款明细列表
     * @returns {object} 更新 supplyDeductionsData
     * @memberof module:model/supply/deductions~supply/deductions/reducers
     */
    reduceSupplyDeductions(state, action) {
      const supplyDeductionsData = {
        // eslint-disable-next-line no-underscore-dangle
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
      return { ...state, supplyDeductionsData };
    },
  },
};
