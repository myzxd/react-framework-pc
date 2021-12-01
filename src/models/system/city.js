/**
 * 城市管理
 *
 * @module model/system/city
 */
import is from 'is_js';
import { message } from 'antd';

import {
  fetchCityList,
  fetchCityGetBasicInfo,
  fetchCityDetail,
  fetchCities,
  createCitySubmit,
} from '../../services/system/city';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'systemCity',

  /**
   * 状态树
   * @prop {object} cityList       城市列表
   * @prop {object} cityDetail     城市详情
   * @prop {object} citiesCodes      平台
  */
  state: {
    cityList: {},            // 城市管理列表
    cityDetail: {},          // 城市详情
    cities: [],              // 行政区城市
  },
  /**
   * @namespace system/city/effects
   */
  effects: {
    /**
     * 获取城市管理列表
     * @param {object} meta 页码、条数
     * @param {array} platformIds 平台
     * @param {array} industryCodes 所属场景
     * @param {string} namespace 命名空间
     * @memberof module:model/system/city~system/city/effects
     */
    *fetchCityList({ payload = {} }, { call, put }) {
      const params = {
      };
      // 页码、条数
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 平台
      if (is.existy(payload.platformIds) && is.not.empty(payload.platformIds)) {
        params.platform_ids = Array.isArray(payload.platformIds) ? payload.platformIds : [payload.platformIds];
      }
      // 所属场景
      if (is.existy(payload.industryCodes) && is.not.empty(payload.industryCodes)) {
        params.industry_codes = Array.isArray(payload.industryCodes) ? payload.industryCodes.map(v => Number(v)) : [payload.industryCodes].map(v => Number(v));
      }
      // 请求服务器
      const result = yield call(fetchCityList, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        // 命名空间
        const namespace = payload.namespace ? payload.namespace : 'default';
        yield put({ type: 'reduceCityList', payload: { result, namespace } });
      }
    },

    /**
     * 由平台code城市code获取单行城市处理完善的信息
     * @param {string} platformCode 平台code
     * @param {string} cityCode 城市code
     * @param {func} onSuccessCallBack 成功回调
     * @memberof module:model/system/city~system/city/effects
     */
    *fetchCityGetBasicInfo({ payload = {} }, { call }) {
      // 平台code
      if (is.not.existy(payload.platformCode) || is.empty(payload.platformCode)) {
        return message.error('操作失败，平台code不能为空');
      }
      // 城市code
      if (is.not.existy(payload.cityCode) || is.empty(payload.cityCode)) {
        return message.error('操作失败，城市code不能为空');
      }
      const params = {
        platform_code: payload.platformCode, // 平台code
        city_code: payload.cityCode,    // 城市code
      };
      // 请求服务器
      const result = yield call(fetchCityGetBasicInfo, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        // 命名空间
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result, payload.index);
        }
      }
    },

    /**
     * 获取详情
     * @param {string} id id
     * @memberof module:model/system/city~system/city/effects
     */
    *fetchCityDetail({ payload = {} }, { call, put }) {
      // id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('操作失败，id不能为空');
      }
      const params = {
        _id: payload.id,
      };
      // 请求服务器
      const result = yield call(fetchCityDetail, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCityDetail', payload: result });
      }
    },

    /**
     * 获取省级或地级行政区
     * @param {number} areaLevel 区域级别
     * @memberof module:model/system/city~system/city/effects
     */
    *fetchCities({ payload = {} }, { call, put }) {
      // 区域级别
      if (is.not.existy(payload.areaLevel) || is.empty(payload.areaLevel)) {
        return message.error('操作失败，区域级别不能为空');
      }
      const params = {
        area_level: payload.areaLevel, // 区域级别
      };
      // 请求服务器
      const result = yield call(fetchCities, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCities', payload: result });
      }
    },

    /**
     * 编辑城市，提交
     * @param {string} id id
     * @param {array} cityList 城市列表
     * @param {func} onSuccessCallback 成功回调
     * @memberof module:model/system/city~system/city/effects
     */
    *createCitySubmit({ payload = {} }, { call }) {
      // id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('操作失败，id不能为空');
      }
      // 城市列表
      if (is.not.existy(payload.cityList) || is.empty(payload.cityList)) {
        return message.error('操作失败，城市列表不能为空');
      }
      const params = {
        _id: payload.id,
        city_list: payload.cityList.map((v) => {
          return {
            city_code: v.city_code,
            city_custom_name: v.city_custom_name,
            city_spelling: v.city_spelling,
          };
        }),
      };
      const result = yield call(createCitySubmit, params);
        // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
        // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },
  },
  /**
   * @namespace system/city/reducers
   */
  reducers: {

    /**
     * 获取城市管理列表
     * @return {object} 更新 cityList
     * @memberof module:model/system/city~system/city/reducers
     */
    reduceCityList(state, action) {
      const cityList = { ...state.cityList };
      const { result, namespace } = action.payload;
      cityList[namespace] = result;
      return {
        ...state,
        cityList,
      };
    },

    /**
     * 获取省级或地级行政区
     * @return {object} 更新 cities
     * @memberof module:model/system/city~system/city/reducers
     */
    reduceCities(state, action) {
      return {
        ...state,
        cities: action.payload,
      };
    },

    /**
     * 获取详情
     * @return {object} 更新 cityDetail
     * @memberof module:model/system/city~system/city/reducers
     */
    reduceCityDetail(state, action) {
      return {
        ...state,
        cityDetail: action.payload,
      };
    },
  },
}
;
