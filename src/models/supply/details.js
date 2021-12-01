/**
 * 物资台账
 * @module model/supply/details
 **/
import is from 'is_js';
import { fetchSupplyDetailsList, fetchStandingBookExport } from '../../services/supply';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'supplyDetails',
  /**
   * 状态树
   * @prop {object} supplyDetailsData    采购入库明细列表
   */
  state: {
    supplyDetailsData: {},
  },
  /**
   * @namespace supply/details/effects
   */
  effects: {
    /**
     * 获取物资台账列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @memberof module:model/supply/details~supply/details/effects
     */
    * fetchSupplyDetailsList({ payload = {} }, { call, put }) {
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
      const result = yield call(fetchSupplyDetailsList, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceSupplyDetails', payload: result });
      }
    },

    /**
     * 物资台账导出
     * @param {array}   platforms      平台
     * @param {array}   suppliers      供应商
     * @param {array}   cities         城市
     * @param {array}   districts      商圈
     */
    * fetchStandingBookExport({ payload = {} }, { put }) {
      // 获取查询参数
      const payloads = payload.params;
      // 定义传入参数
      const params = {};
      // 根据平台获取数据
      if (is.existy(payloads.platforms) && is.not.empty(payloads.platforms)) {
        params.platform_codes = payloads.platforms;
      }
      // 根据供应商获取数据
      if (is.existy(payloads.suppliers) && is.not.empty(payloads.suppliers)) {
        params.supplier_ids = payloads.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payloads.cities) && is.not.empty(payloads.cities)) {
        params.city_spellings = payloads.cities;
      }
      // 根据商圈获取数据
      if (is.existy(payloads.districts) && is.not.empty(payloads.districts)) {
        params.biz_district_ids = payloads.districts;
      }

      const request = {
        params,     // 接口参数
        service: fetchStandingBookExport,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
  },
  /**
   * @namespace supply/details/reducers
   */
  reducers: {
    /**
     * 物资台账列表
     * @returns {object} 更新 supplyDetailsData
     * @memberof module:model/supply/details~supply/details/reducers
     */
    reduceSupplyDetails(state, action) {
      const supplyDetailsData = {
        // eslint-disable-next-line no-underscore-dangle
        meta: ResponseMeta.mapper(action.payload._meta),
        data: action.payload.data,
      };
      return { ...state, supplyDetailsData };
    },
  },
};
