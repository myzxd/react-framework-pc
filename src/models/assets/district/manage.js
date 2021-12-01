/**
 * 商圈管理模块
 * @module model/assets/districtManage
 */
import is from 'is_js';
import { message, Modal } from 'antd';

import {
  fetchDistrictList,
  fetchDistrictDetail,
  createDistrict,
  updateDistrict,
  fetchPlatformList,
  fetchAssetsChangLog,
} from '../../../services/common';
import { RequestMeta, ResponseMeta } from '../../../application/object/';
import { BizDistrictListItem, BizDistrictDetail } from '../../../application/object/system/districtManage';
import { DistrictState } from '../../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'districtManage',

  /**
   * 状态树
   * @prop {array} districts 商圈列表
   * @prop {object} districtDetail 商圈详情信息
   */
  state: {
    districts: {
      data: [],   // 商圈列表
      meta: {},   // 分页信息
    },
    districtDetail: {},       // 商圈详情信息
    platformList: [], // 平台列表（所属场景级联）
    assetsChangeLog: {},        // 商圈变更记录
  },

  /**
   * @namespace assets/districtManage/effects
   */
  effects: {
    /**
     * 获取商圈列表
     * @param {object} meta 页码, 条数
     * @param {string} platformCode 平台
     * @param {array} cityCodes 城市
     * @param {array} supplierIds 供应商
     * @param {string} name 商圈名称
     * @param {string} customId 平台商圈ID
     * @param {number} state 状态
     * @param {string} tag 标签
     * @memberof module:model/assets/districtManage~assets/districtManage/effects
     */
    *fetchDistricts({ payload = {} }, { call, put }) {
      const {
        meta,
        platformCode,
        cityCodes,
        supplierIds,
        name,
        customId,
        state,
        tag,
        bossId,                   // BOSS商圈id
      } = payload;
      // 请求参数
      const params = {
        _meta: RequestMeta.mapper(meta),
      };

      // 平台
      if (is.not.empty(platformCode) && is.existy(platformCode)) {
        params.platform_code = platformCode;
      }

      // 城市
      if (is.not.empty(cityCodes) && is.existy(cityCodes)) {
        params.city_spelling = cityCodes;
      }

      // 供应商id列表
      if (is.not.empty(supplierIds) && is.existy(supplierIds)) {
        params.supplier_id = supplierIds;
      }
      // 商圈名称
      if (is.not.empty(name) && is.existy(name)) {
        params.name = name;
      }
      // 平台商圈ID
      if (is.not.empty(customId) && is.existy(customId)) {
        params.custom_id = customId;
      }
      // 状态（启用、禁用）
      if (is.not.empty(state) && is.existy(state)) {
        params.state = state.map(item => Number(item));
      }
      // 标签id
      if (is.not.empty(tag) && is.existy(tag)) {
        params.label_id = tag;
      }
      // BOSS商圈id
      if (is.not.empty(bossId) && is.existy(bossId)) {
        params._id = bossId;
      }

      // 请求服务器
      const result = yield call(fetchDistrictList, params);
      if (result.data) {
        yield put({ type: 'reduceDistricts', payload: result });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      }
    },

    /**
     * 获取商圈详情
     * @param {string} districtId 商圈id
     * @param {func} onSuccessCallBack 成功回调
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *fetchDistrictDetail({ payload = {} }, { call, put }) {
      const { districtId, onSuccessCallBack } = payload;
      if (is.empty(districtId) || is.not.existy(districtId)) {
        return message.error('操作失败，数据的id不能为空');
      }
      // 请求参数
      const params = {
        _id: districtId,
      };
      // 请求服务器
      const result = yield call(fetchDistrictDetail, params);
      if (result._id) {
        // 请求成功回调
        if (onSuccessCallBack) {
          onSuccessCallBack(result);
        }
        yield put({ type: 'reduceDistrictDetail', payload: result });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      }
    },

    /**
     * 创建商圈
     * @param {string} platformCode 平台code
     * @param {string} cityId       城市id
     * @param {string} supplierId   供应商id
     * @param {string} customId     平台关联商圈id
     * @param {string} name         商圈名称
     * @param {object} tripartiteId  更多三方平台商圈ID
     * @param {func}  onSuccessCallBack 成功回调
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *createDistrict({ payload = {} }, { call }) {
      const {
        platformCode,
        cityId,
        supplierId,
        customId,
        name,
        state,
        business,
        tags,
        tripartiteId,
        onSuccessCallBack,
        source,
        mode,
      } = payload;
      if (is.empty(platformCode) || is.not.existy(platformCode)) {
        return message.error('操作失败，平台code不能为空');
      }
      if (is.empty(cityId) || is.not.existy(cityId)) {
        return message.error('操作失败，城市code不能为空');
      }
      if (is.empty(supplierId) || is.not.existy(supplierId)) {
        return message.error('操作失败，供应商id不能为空');
      }
      if (is.empty(state) || is.not.existy(state)) {
        return message.error('操作失败，商圈状态不能为空');
      }
      if ((Number(state) === DistrictState.enable) && (is.empty(customId) && (platformCode !== 'meituan'))) {
        return message.error('操作失败，平台商圈id不能为空');
      }
      if (is.empty(name) || is.not.existy(name)) {
        return message.error('操作失败，商圈名称不能为空');
      }
      if (is.empty(business) || is.not.existy(business)) {
        return message.error('操作失败，业务线不能为空');
      }
      const params = {
        platform_code: platformCode,
        city_code: cityId,
        supplier_id: supplierId,
        name,
        industry_code: business,
        state: Number(state),
      };
      // 平台商圈ID
      if (is.existy(customId) && is.not.empty(customId)) {
        params.custom_id = customId;
      }
      // 更多三方平台商圈ID
      if ((is.existy(tripartiteId) && is.not.empty(tripartiteId)) && (is.existy(tripartiteId.items) && is.not.empty(tripartiteId.items))) {
        tripartiteId.items.forEach((v) => {
          params[v.code] = v.id;
        });
      }
      // 商圈来源
      if (is.existy(source) && is.not.empty(source)) {
        params.source_type = source;
      }
      // 商圈经营方式
      if (is.existy(mode) && is.not.empty(mode)) {
        params.operation_type = mode;
      }

      // 标签
      (is.existy(tags) && is.not.empty(tags)) && (params.label_ids = tags);
      const result = yield call(createDistrict, params);
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      message.success('创建成功');
      // 请求成功回调
      if (onSuccessCallBack) {
        onSuccessCallBack(result);
      }
    },

    /**
     * 编辑商圈
     * @param {string} districtId 商圈id
     * @param {string} name       商圈名称
     * @param {number} state      商圈状态
     * @param {string} customId   平台商圈ID
     * @param {object} tripartiteId   更多三方平台商圈ID
     * @param {number} changeType   修改原因
     * @param {func}  onSuccessCallBack 成功回调
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *updateDistrict({ payload = {} }, { call }) {
      const {
        districtId,
        name,
        state,
        customId,
        changeType,
        tripartiteId,
        onSuccessCallBack,
        source,
        mode,
        disposeWay,
        remark,
      } = payload;
      if (is.empty(districtId) || is.not.existy(districtId)) {
        return message.error('操作失败，商圈id不能为空');
      }
      const params = {
        _id: districtId,
      };

      // 平台商圈ID
      if (is.existy(customId) && is.not.empty(customId)) {
        params.custom_id = customId;
      }

      // 商圈名称
      if (is.existy(name) && is.not.empty(name)) {
        params.name = name;
      }
      // 状态
      if (is.existy(state) && is.not.empty(state)) {
        params.state = Number(state);
      }
      // 修改原因
      if (is.existy(changeType) && is.not.empty(changeType)) {
        params.change_type = Number(changeType);
      }
      // 更多三方平台商圈ID
      if ((is.existy(tripartiteId) && is.not.empty(tripartiteId)) && (is.existy(tripartiteId.items) && is.not.empty(tripartiteId.items))) {
        tripartiteId.items.forEach((v) => {
          params[v.code] = v.id;
        });
      }
      // 商圈来源
      if (is.existy(source) && is.not.empty(source)) {
        params.source_type = source;
      }
      // 商圈经营方式
      if (is.existy(mode) && is.not.empty(mode)) {
        params.operation_type = mode;
      }
      // 商圈处置方式
      if (is.existy(disposeWay) && is.not.empty(disposeWay)) {
        params.disposal_type = disposeWay;
      }
      // 状态调整备注
      if (is.existy(remark) && is.not.empty(remark)) {
        params.remark = remark;
      }
      // 清空备注
      if (payload.reastRemark === true) {
        params.remark = '';
      }
      const result = yield call(updateDistrict, params);
      if (Number(state) === DistrictState.disabled
        && result.zh_message) {
        return Modal.error({
          title: result.zh_message,
        });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      }
      message.success('编辑成功');
      // 请求成功回调
      if (onSuccessCallBack) {
        onSuccessCallBack();
      }
    },

    /**
     * 获取平台列表
     * @param {object} meta 页码、条数
     * @param {array} platformIds 平台
     * @param {array} industryCodes 所属场景
     * @param {string} namespace 命名空间
     * @memberof module:model/system/city~system/city/effects
     */
    *fetchPlatformList({ payload = {} }, { call, put }) {
      const params = {};

      // 所属场景
      if (is.existy(payload.industryCodes) && is.not.empty(payload.industryCodes)) {
        params.industry_codes = Array.isArray(payload.industryCodes) ? payload.industryCodes.map(v => Number(v)) : [payload.industryCodes].map(v => Number(v));
      }

      // 请求服务器
      const result = yield call(fetchPlatformList, params);

      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }

      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        // 命名空间
        yield put({ type: 'reducePlatforms', payload: result });
      }
    },

    /**
     * 重置平台列表（所属场景级联）
     */
    *resetPlatformList({ payload }, { put }) {
      yield put({ type: 'reducePlatforms', payload });
    },

    /**
     * 获取商圈变更记录
     */
    *fetchAssetsChangLog({ payload }, { call, put }) {
      const params = {
        _meta: payload.pageConfig,
      };
      // 商圈id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.biz_district_id = payload.id;
      }
      const result = yield call(fetchAssetsChangLog, params);

      yield put({ type: 'reduceAssetsChangLog', payload: result });
    },
  },

  /**
   * @namespace assets/districtManage/reducers
   */
  reducers: {
    /**
     * 商圈列表
     * @return {object} 更新 districts
     * @memberof module:model/assets/districtManage~assets/districtManage/reducers
     */
    reduceDistricts(state, action) {
      const { _meta, data } = action.payload;
      const districts = {
        meta: ResponseMeta.mapper(_meta),
        data: BizDistrictListItem.mapperEach(data, BizDistrictListItem),
      };
      return {
        ...state,
        districts,
      };
    },

    /**
     * 商圈详情
     * @return {object} 更新 districtDetail
     * @memberof module:model/assets/districtManage~assets/districtManage/reducers
     */
    reduceDistrictDetail(state, action) {
      const { payload } = action;
      const districtDetail = BizDistrictDetail.mapper(payload, BizDistrictDetail);
      return {
        ...state,
        districtDetail,
      };
    },

    /**
     * 启用、禁用更新商圈详情
     * @return {object} 启用、禁用更新 districtDetail
     * @memberof module:model/assets/districtManage~assets/districtManage/reducers
     */
    reduceUpdateDistrictDetail(state, action) {
      const { payload } = action;
      return {
        ...state,
        districtDetail: {
          ...state.districtDetail,
          state: payload.state,
          forbiddenAt: payload.forbidden_at,
          updatedAt: payload.updated_at,
        },
      };
    },

    /**
     * 获取城市管理列表
     * @return {object} 更新 cityList
     * @memberof module:model/system/city~system/city/reducers
     */
    reducePlatforms(state, action) {
      let platformList = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        platformList = action.payload.data;
      }
      return { ...state, platformList };
    },
    /**
     * 商圈变更记录
     * @returns {object} 更新 assetsChangeLog
     */
    reduceAssetsChangLog(state, action) {
      return { ...state, assetsChangeLog: action.payload };
    },
  },
};
