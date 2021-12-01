/**
 * 服务商配置 model
 *
 * @module model/system/merchants
 */
import is from 'is_js';
import { message } from 'antd';
import { fetchMerchantsListData, fetchMerchantsCreate, fetchMerchantsDetail, updateMerchants } from '../../services/system/merchants';
import { RequestMeta } from '../../application/object/index';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'systemMerchants',
  /**
   * 状态树
   * @prop {object} merchantsData 服务商配置列表
   * @prop {object} detailData 服务商配置详情
   */
  state: {
    merchantsData: {},
    detailData: {},
  },
  /**
   * @namespace enterprise/system/merchants/effects
   */
  effects: {
    /**
     * 服务商配置列表
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @param {array} cities 城市
     * @param {array} districts 商圈
     */
    * fetchMerchantsListData({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 获取平台
      if (is.not.empty(payload.platforms) && is.existy(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 获取商圈
      if (is.not.empty(payload.districts) && is.existy(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
       // 获取供应商
      if (is.not.empty(payload.suppliers) && is.existy(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 获取城市
      if (is.not.empty(payload.cities) && is.existy(payload.cities)) {
        params.city_codes = payload.cities;
      }
      // 判断是新增页面发来的请求
      if (payload.whiteAdd) {
        params._meta.limit = 99999;
      }
      const result = yield call(fetchMerchantsListData, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceMerchantsListData', payload: result });
    },
    /**
     * 服务商配置详情页
     * @param {string} id 关闭服务费预支范围id
     */
    * fetchMerchantsDetail({ payload }, { call, put }) {
      const {
        id,
      } = payload;
      const params = {};
      // id
      if (is.not.empty(id) && is.existy(id)) {
        params.id = id;
      }

      const result = yield call(fetchMerchantsDetail, params);
      if (is.not.empty(result)) {
        yield put({ type: 'reduceMerchantsDetail', payload: result });
      }
    },
    /**
     * 新增服务商配置
     * @param {string} platform 平台
     * @param {string} supplier 供应商
     * @param {string} city 城市
     * @param {array} districtsArray 商圈
     * @param {string} serviceProviders 工商户注册
     *
     */
    * fetchMerchantsCreate({ payload = {} }, { call }) {
      const params = {
        domain: payload.allSelectorLevel,
      };
      // domain级别为1,是平台级别，只传平台，2为城市是全部，只传递平台和供应商，3为商圈全部，只传平台供应商与城市
      switch (params.domain) {
        case 2:
          // 供应商
          if (is.not.empty(payload.supplier) && is.existy(payload.supplier)) {
            params.supplier_id = payload.supplier;
          }
          break;
        case 3:
          // 供应商
          if (is.not.empty(payload.supplier) && is.existy(payload.supplier)) {
            params.supplier_id = payload.supplier;
          }
          // 城市
          if (is.not.empty(payload.city) && is.existy(payload.city)) {
            params.city_codes = payload.city;
          }
          break;
        case 4:
          // 供应商
          if (is.not.empty(payload.supplier) && is.existy(payload.supplier)) {
            params.supplier_id = payload.supplier;
          }
          // 城市
          if (is.not.empty(payload.city) && is.existy(payload.city)) {
            params.city_codes = payload.city;
          }
          // 商圈
          if (is.not.empty(payload.districtsArray) && is.existy(payload.districtsArray)) {
            params.biz_district_ids = payload.districtsArray;
          }
          break;
        default:
          break;
      }
      // 平台
      if (is.not.empty(payload.platform) && is.existy(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 个体工商户注册
      if (is.not.empty(payload.serviceProviders) && is.existy(payload.serviceProviders)) {
        params.individual_source = payload.serviceProviders;
      }
      const result = yield call(fetchMerchantsCreate, params);
      if (result.ok) {
        message.success('新增成功！');
        window.location.href = '/#/System/Merchants';
      }
      if (result.zh_message) {
        message.error(result.zh_message);
      }
    },

     /**
     * 编辑服务商配置
     * @param {string} serviceProviders 工商户注册
     * @param {string} id // 员工id
     */
    * updateMerchants({ payload = {} }, { call }) {
      // 请求参数
      const params = {};
      // id
      if (is.not.empty(payload.params.id) && is.existy(payload.params.id)) {
        params.id = payload.params.id;
      }
      // 个体工商户注册
      if (is.not.empty(payload.params.serviceProviders) && is.existy(payload.params.serviceProviders)) {
        params.individual_source = payload.params.serviceProviders;
      }
      const result = yield call(updateMerchants, params);
      if (result.ok) {
        message.success('编辑成功！');
        window.location.href = '/#/System/Merchants';
      }
      if (result.zh_message) {
        message.error(result.zh_message);
      }
    },
  },
  /**
   * @namespace enterprise/system/merchants/reducers
   */
  reducers: {
    /**
     * 服务商配置数据
     * @returns {object} 更新 merchantsData
     * @memberof module:model/system/merchants/type~merchants/type/reducers
     */
    reduceMerchantsListData(state, action) {
      const merchantsData = action.payload;
      return { ...state, merchantsData };
    },
    /**
     * 服务商配置详情页
     */
    reduceMerchantsDetail(state, action) {
      const detailData = action.payload;
      return { ...state, detailData };
    },
  },
};
