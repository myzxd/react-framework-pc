/**
 * 供应商管理模块
 *
 * @module model/supplier/manage
 */
import is from 'is_js';
import { message } from 'antd';

import {
  fetchSupplierList,
  fetchSupplierDetail,
  createSupplier,
  updateSupplier,
  updateSupplierState,
  fetchCityDistribution,
  fetchDistrictList,
} from '../../services/system/supplier';
import { ResponseMeta } from '../../application/object/';
import { SupplierState } from '../../application/define';
import Modules from '../../application/define/modules';
import { BizDistrictListItem } from '../../application/object/system/districtManage';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'supplierManage',

  /**
   * 状态树
   * @prop {array} suppliers 供应商
   * @prop {object} supplierDetail 供应商详情信息
   * @prop {object} cityDistributeList 业务分配列表
   */
  state: {
    suppliers: {},            // 供应商
    supplierDetail: {},       // 供应商详情信息
    cityDistributeList: {},   // 城市业务分配列表
    districts: {},              // 商圈列表
  },

  /**
   * @namespace supplier/manage/effects
   */
  effects: {

    /**
     * 供应商列表
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *fetchSuppliers({ payload = {} }, { call, put }) {
      const params = {
        permission_id: Modules.ModuleSystemSupplierManage.id,
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };
      // 根据平台获取供应商
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code = is.not.array(payload.platforms) ? [payload.platforms] : payload.platforms;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Number(payload.state);
      }
      // 供应商名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 供应商id
      if (is.existy(payload.supplierId) && is.not.empty(payload.supplierId)) {
        params.supplier_id = payload.supplierId;
      }
      // 请求服务器
      const result = yield call(fetchSupplierList, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceSuppliers', payload: result });
      }
    },

    /**
     * 获取供应商详情信息
     * @param {string} supplierId 供应商id
     * @param {function} toggleShowLoading 改变供应商显示回调
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *fetchSupplierDetail({ payload = {} }, { call, put }) {
      if (is.not.existy(payload.supplierId) || is.empty(payload.supplierId)) {
        // 编辑供应商loading隐藏
        if (payload.toggleShowLoading) {
          payload.toggleShowLoading(false);
        }
        return message.error('操作失败，数据的id不能为空');
      }
      const params = {
        _id: payload.supplierId,
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };

      // 请求服务器
      const result = yield call(fetchSupplierDetail, params);
      // 判断数据是否为空
      if (is.not.empty(result._id) && is.existy(result._id)) {
        yield put({ type: 'reduceSupplierDetail', payload: result });
        // 编辑供应商loading隐藏
        if (payload.toggleShowLoading) {
          payload.toggleShowLoading(false);
        }
      }
    },

    /**
     * 创建供应商（默认新创建的都是启用状态）
     * @param {string} name 供应商名称
     * @param {string} customId 供应商自定id
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *createSupplier({ payload = {} }, { call }) {
      if (is.not.existy(payload.name) || is.empty(payload.name)) {
        return message.error('操作失败，名称不能为空');
      }
      if (is.not.existy(payload.customId) || is.empty(payload.customId)) {
        return message.error('操作失败，供应商自定义Id不能为空');
      }
      if (is.not.existy(payload.creditNo) || is.empty(payload.creditNo)) {
        return message.error('操作失败，统一社会信用代码不能为空');
      }
      if (is.not.existy(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      if (is.not.existy(payload.cities)) {
        return message.error('操作失败，城市不能为空');
      }
      const params = {
        permission_id: Modules.ModuleSystemSupplierCreate.id,
        name: payload.name,                         // 名称
        supplier_id: payload.customId,              // 自定义供应商id
        platform_code: payload.platforms,           // 平台
        credit_no: payload.creditNo, // 统一社会信用代码
        city_codes: payload.cities, // 城市 todo: 删除每一项前的前缀
      };

      // 请求服务器
      const result = yield call(createSupplier, params);

      // 判断数据是否为空
      if (is.existy(result.ok) && is.not.empty(result.ok)) {
        message.success('创建供应商成功');

        // 成功的回调函数
        if (payload.onSuccessCallback) {
          return payload.onSuccessCallback(result);
        }
      }
      // 创建失败的回调函数
      if (is.existy(result.err_code)) {
        if (payload.onDefeatCallback) {
          message.error(`创建供应商失败:${result.zh_message}`);
          payload.onDefeatCallback();
        }
      }
    },

    /**
     * 更新供应商
     * @param {string} recordId 数据id
     * @param {number} state 供应商状态
     * @param {string} name 供应商名称
     * @param {string} customId 供应商自定id
     * @param {array} districts 商圈信息
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *updateSupplier({ payload = {} }, { call }) {
      if (is.not.existy(payload.name) || is.empty(payload.name)) {
        return message.error('操作失败，数据名称不能为空');
      }
      if (is.not.existy(payload.recordId) || is.empty(payload.recordId)) {
        return message.error('操作失败，数据id不能为空');
      }

      const params = {
        permission_id: Modules.ModuleSystemSupplierUpdate.id,
        _id: payload.recordId,    // 数据id
      };

      // 名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 自定义供应商id
      if (is.existy(payload.customId) && is.not.empty(payload.customId)) {
        params.supplier_id = payload.customId;
      }
      // 请求服务器
      const result = yield call(updateSupplier, params);

      // 判断数据是否为空
      if (is.existy(result.ok) && is.not.empty(result.ok)) {
        message.success('更新供应商成功');
        // 成功的回调函数
        if (payload.onSuccessCallback) {
          return payload.onSuccessCallback(result);
        }
        return;
      }
      // 更新失败的回调函数
      if (is.existy(result.err_code)) {
        if (payload.onDefeatCallback) {
          message.error(`更新供应商失败:${result.zh_message}`);
          payload.onDefeatCallback();
          return;
        }
      }
      payload.onDefeatCallback();
    },

    /**
     * 修改供应商状态
     * @param {string} recordId 数据id
     * @param {function} onSuccessCallback 请求成功回调
     * @memberof module:model/supplier/manage~supplier/manage/effects
     */
    *updateSupplierState({ payload = {} }, { call }) {
      const params = {
        _id: payload.recordId,
        state: payload.supplierState,
      };
      // 请求服务器
      const result = yield call(updateSupplierState, params);
      // 判断更新状态
      if (is.existy(result.ok) && is.not.empty(result.ok)) {
        message.success(`该供应商${SupplierState.description(payload.supplierState)}成功`);
        if (payload.onSuccessCallback) {
          return payload.onSuccessCallback(result); // 更新状态成功的回调函数
        }
      }
      // 如果更新失败 提示失败原因
      if (is.existy(result.err_code)) {
        // 失败
        message.error(`该供应商${SupplierState.description(payload.supplierState)}失败:${result.zh_message}`);
      }
    },

    /**
     * 获取商圈列表
     * @memberof module:model/district/manage~district/manage/effects
     */
    *fetchDistricts({ payload = {} }, { call, put }) {
      // 请求参数
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };

      // 供应商id列表
      if (is.not.empty(payload.supplierId) && is.existy(payload.supplierId)) {
        params.supplier_id = payload.supplierId;
      }
      // 请求服务器
      const result = yield call(fetchDistrictList, params);
      if (result.data) {
        yield put({ type: 'reduceDistricts', payload: result });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      }
    },

    // 获取城市业务分部列表
    *fetchCityDistribution({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };

      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code_list = payload.platforms;
      }
      // 分配情况
      if (is.existy(payload.distributeType) && is.not.empty(payload.distributeType)) {
        params.allot = +payload.distributeType;
      }
      const result = yield call(fetchCityDistribution, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceCityDistribution', payload: result });
      }
    },
  },

  /**
   * @namespace supplier/manage/reducers
   */
  reducers: {
    /**
     * 供应商
     * @return {object} 更新 suppliers
     * @memberof module:model/supplier/manage~supplier/manage/reducers
     */
    reduceSuppliers(state, action) {
      const datas = action.payload.data || [];
      const suppliers = {
        ...action.payload,
        data: datas.map((item) => {
          const operatorInfo = item.operator_info || {};
          return {
            ...item,
            operator_name: operatorInfo.name,
          };
        }),
      };
      return { ...state, suppliers };
    },

    /**
     * 供应商详情信息
     * @return {object} 更新 supplierDetail
     * @memberof module:model/supplier/manage~supplier/manage/reducers
     */
    reduceSupplierDetail(state, action) {
      return { ...state, supplierDetail: action.payload };
    },

    /**
     * 商圈列表
     * @return {object} 更新 districts
     * @memberof module:model/district/manage~district/manage/reducers
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
     * 获取城市业务分部列表
     * @returns {object} 更新 cityDistributeList
     * @memberof module:model/supplier/manage~supplier/manage/reducers
     */
    reduceCityDistribution(state, action) {
      return {
        ...state,
        cityDistributeList: action.payload,
      };
    },
  },
};
