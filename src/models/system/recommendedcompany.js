/**
 * 推荐公司
 *
 * @module model/system/recommendedCompany
 */
import is from 'is_js';
import { message } from 'antd';

import { RequestMeta } from '../../application/object';
import {
  fetchCompanyData, // 获取推荐公司列表
  createCompany, // 创建推荐公司
  updateCompany, // 编辑推荐公司
  changeCompanyState, // 改变推荐公司状态
  fetchServiceRange, // 获取推荐公司的服务范围
  fetchCompanyDetail, // 获取推荐公司详情
  createServiceRange, // 创建推荐公司服务范围
  changeServiceRangeState, // 改变推荐公司服务范围状态
} from '../../services/system/recommendedcompany';
import { RecommendedCompanyServiceRangeDomain } from '../../application/define';

// 服务范围供应商选项为全部的value
const SupplierAll = 'supplierall';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'systemRecommendedCompany',
  /**
   * 状态树
   * @prop {object} companyData 推荐公司列表
   * @prop {object} companyDetail 推荐公司详情
   */
  state: {
    companyData: {}, // 推荐公司列表
    companyDetail: {}, // 推荐公司详情
    serviceRange: [], // 推荐公司服务范围列表
  },

  /**
   * @namespace system/recommendedCompany/effects
   */
  effects: {

    /**
     * 获取推荐公司列表
     * @param {number} page 页码
     * @param {number} limit 每页条数
     * @param {number} state 状态
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *fetchCompanyData({ payload = {} }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 状态, 若为空则不传state, 代表“全部”
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Number(payload.state);
      }
      // 推荐公司id
      if (is.existy(payload.companyId) && is.not.empty(payload.companyId)) {
        params._id = payload.companyId;
      }
      // 推荐公司名称
      if (is.existy(payload.companyName) && is.not.empty(payload.companyName)) {
        params.name = payload.companyName;
      }
      // 请求服务器
      const result = yield call(fetchCompanyData, params);
      yield put({ type: 'reduceCompanyData', payload: result });
    },
    /**
     * 获取推荐公司详情
     * @param {string} recommendedCompanyId 推荐公司id
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *fetchCompanyDetail({ payload = {} }, { call, put }) {
      const params = {};
      // 推荐公司ID
      if (is.existy(payload.recommendedCompanyId) && is.not.empty(payload.recommendedCompanyId)) {
        params._id = payload.recommendedCompanyId;
      } else {
        return message.error('请求失败, 推荐公司ID必传');
      }

      // 请求服务器
      const result = yield call(fetchCompanyDetail, params);

      // 判断数据是否为空
      if (is.existy(result) && is.object(result)) {
        yield put({ type: 'reduceCompanyDetail', payload: result });
      } else {
        message.error('推荐公司详情请求错误, 数据错误');
      }
    },
    /**
     * 创建推荐公司
     * @param {string} name 公司名称
     * @param {string} abbreviation 公司简称
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *createCompany({ payload = {} }, { put }) {
      const params = {};
      const {
        name, // 公司名称
        abbreviation, // 公司简称
        onSuccessCallback, // 成功回调
      } = payload;

      // 公司名称必填
      // 去掉前后空格
      const nameWithoutSpace = name.trim();
      if (is.existy(nameWithoutSpace) && is.not.empty(nameWithoutSpace)) {
        params.name = nameWithoutSpace;
      } else {
        return message.error('操作失败, 公司名称不能为空');
      }

      // 公司简称选填, 若不填传空串
      // 去掉前后空格
      if (is.existy(abbreviation) && is.not.empty(abbreviation)) {
        params.abbreviation = abbreviation.trim();
      } else {
        params.abbreviation = '';
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };
      // 失败回调
      const onFailureCallback = (err) => {
        if (err.zh_message) return message.error(err.zh_message);
        return message.error('请求失败');
      };
      const request = {
        params, // 接口参数
        service: createCompany, // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
    /**
     * 编辑推荐公司
     * @param {string} recommendedCompanyId 公司id
     * @param {string} name 公司名称
     * @param {string} abbreviation 公司简称
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *updateCompany({ payload = {} }, { put }) {
      const params = {};
      const {
        recommendedCompanyId, // 推荐公司ID
        name, // 公司名称
        abbreviation, // 公司简称
        onSuccessCallback, // 成功回调
      } = payload;

      // 公司id必传
      if (is.existy(recommendedCompanyId) && is.not.empty(recommendedCompanyId)) {
        params._id = recommendedCompanyId;
      } else {
        return message.error('操作失败, 公司id不能为空');
      }

      // 公司名称必填
      // 去掉前后空格
      const nameWithoutSpace = name.trim();
      if (is.existy(nameWithoutSpace) && is.not.empty(nameWithoutSpace)) {
        params.name = nameWithoutSpace;
      } else {
        return message.error('操作失败, 公司名称不能为空');
      }

      // 公司简称选填, 若不填传空串
      // 去掉前后空格
      if (is.existy(abbreviation) && is.not.empty(abbreviation)) {
        params.abbreviation = abbreviation.trim();
      } else {
        params.abbreviation = '';
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };
      // 失败回调
      const onFailureCallback = (err) => {
        if (err.zh_message) return message.error(err.zh_message);
        return message.error('请求失败');
      };
      const request = {
        params, // 接口参数
        service: updateCompany, // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 改变公司状态
     * @param {number} state 状态
     * @param {string} recommendedCompanyId 推荐公司id
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *changeCompanyState({ payload = {} }, { put }) {
      const {
        state,
        recommendedCompanyId,
        onSuccessCallback,
      } = payload;
      const params = {};
      // ID必传
      if (is.existy(recommendedCompanyId) && is.not.empty(recommendedCompanyId)) {
        params._id = recommendedCompanyId;
      } else {
        return message.error('操作失败, ID不能为空');
      }
      // 状态必选
      if (is.existy(state) && is.not.empty(state)) {
        params.state = Number(state);
      } else {
        return message.error('操作失败, 状态不能为空');
      }
      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };
      // 失败回调
      const onFailureCallback = (err) => {
        if (err.zh_message) return message.error(err.zh_message);
        return message.error('请求失败');
      };
      const request = {
        params, // 接口参数
        service: changeCompanyState, // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取推荐公司服务范围列表
     * @param {string} recommendedCompanyId 推荐公司id
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *fetchServiceRange({ payload = {} }, { call, put }) {
      // 不做分页, 所以默认请求9999条数据
      const params = {
        _meta: {
          page: 1,
          limit: 9999,
        },
      };
      // 推荐公司ID
      if (is.existy(payload.recommendedCompanyId) && is.not.empty(payload.recommendedCompanyId)) {
        params.recommend_company_id = payload.recommendedCompanyId;
      } else {
        return message.error('请求失败, 推荐公司ID必传');
      }

      // 请求接口
      const result = yield call(fetchServiceRange, params);

      // 判断数据是否为空
      if (is.existy(result) && is.array(result.data)) {
        yield put({ type: 'reduceServiceRange', payload: result });
      } else {
        message.error('推荐公司服务范围请求错误, 数据错误');
      }
    },

    /**
     * 创建推荐公司服务范围
     * @param {string} recommendedCompanyId 推荐公司id
     * @param {string} platformCode 平台id
     * @param {array} supplierIds 供应商id列表
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *createServiceRange({ payload = {} }, { put }) {
      const params = {};
      const {
        recommendedCompanyId, // 推荐公司ID
        platformCode, // 平台
        supplierIds, // 供应商
        onSuccessCallback, // 成功回调
      } = payload;
      // 推荐公司ID必传
      if (is.existy(recommendedCompanyId) && is.not.empty(recommendedCompanyId)) {
        params.recommend_company_id = recommendedCompanyId;
      } else {
        return message.error('操作错误, 推荐公司ID不能为空');
      }
      // 平台ID必传
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.platform_code = platformCode;
      } else {
        return message.error('操作错误, 平台不能为空');
      }
      // 供应商
      if (is.existy(supplierIds) && is.not.empty(supplierIds)) {
        if (is.array(supplierIds)) {
          if (supplierIds.indexOf(SupplierAll) > -1) {
            // 选择了全部, 则说明是平台级别
            params.domain = RecommendedCompanyServiceRangeDomain.platform;
          } else {
            // 未选择全部, 则说明是供应商级别
            params.domain = RecommendedCompanyServiceRangeDomain.supplier;
            params.supplier_ids = supplierIds;
          }
        } else {
          return message.error('操作错误, 供应商格式错误');
        }
      } else {
        return message.error('操作错误, 供应商不能为空');
      }
      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };
      // 失败回调
      const onFailureCallback = (err) => {
        if (err.zh_message) return message.error(err.zh_message);
        return message.error('请求失败');
      };
      const request = {
        params, // 接口参数
        service: createServiceRange, // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 改变公司服务范围状态
     * @param {number} state 状态
     * @param {string} serviceRangeId 服务范围ID
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *changeServiceRangeState({ payload = {} }, { put }) {
      const {
        state, // 状态
        serviceRangeId, // 服务范围ID
        onSuccessCallback, // 成功回调
      } = payload;
      const params = {};
      // ID必传
      if (is.existy(serviceRangeId) && is.not.empty(serviceRangeId)) {
        params._id = serviceRangeId;
      } else {
        return message.error('操作失败, ID不能为空');
      }
      // 状态必选
      if (is.existy(state) && is.not.empty(state)) {
        params.state = Number(state);
      } else {
        return message.error('操作失败, 状态不能为空');
      }
      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };
      // 失败回调
      const onFailureCallback = (err) => {
        if (err.zh_message) return message.error(err.zh_message);
        return message.error('请求失败');
      };
      const request = {
        params, // 接口参数
        service: changeServiceRangeState, // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 重置推荐公司列表
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *resetCompanyData({ payload }, { put }) {
      yield put({ type: 'reduceCompanyData', payload: {} });
    },

    /**
     * 重置推荐公司详情
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *resetCompanyDetail({ payload }, { put }) {
      yield put({ type: 'reduceCompanyDetail', payload: {} });
    },

    /**
     * 重置服务范围列表
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/effects
     */
    *resetServiceRange({ payload }, { put }) {
      yield put({ type: 'reduceServiceRange', payload: {} });
    },
  },

  /**
   * @namespace system/recommendedCompany/reducers
   */
  reducers: {
    /**
     * 推荐公司列表
     * @return {object} 更新 companyData
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/reducers
     */
    reduceCompanyData(state, action) {
      return { ...state, companyData: action.payload };
    },

    /**
     * 推荐公司详情
     * @return {object} 更新 companyData
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/reducers
     */
    reduceCompanyDetail(state, action) {
      return { ...state, companyDetail: action.payload };
    },

    /**
     * 推荐公司服务范围列表
     * @return {array} 更新 serviceRange
     * @memberof module:model/system/recommendedCompany~system/recommendedCompany/reducers
     */
    reduceServiceRange(state, action) {
      return { ...state, serviceRange: action.payload };
    },
  },
};
