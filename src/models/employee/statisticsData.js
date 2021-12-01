/**
 * 个户注册数据model
 * @module model/employee/contract
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchEmployeeStatisticsData,
  exportEmployeeStatisticsData,
} from '../../services/employee';

// 转换请求参数
const mapperParams = (payload, type) => {
  const params = {};
  const meta = {};
  // 平台
  if (is.not.empty(payload.platformCodes)) {
    if (is.array(payload.platformCodes)) {
      params.platform_codes = payload.platformCodes;
    } else if (is.string(payload.platformCodes)) {
      params.platform_codes = [payload.platformCodes];
    }
  }
  // 供应商
  if (is.not.empty(payload.supplierIds)) {
    if (is.array(payload.supplierIds)) {
      params.supplier_ids = payload.supplierIds;
    } else if (is.string(payload.supplierIds)) {
      params.supplier_ids = [payload.supplierIds];
    }
  }

  // 城市
  if (is.not.empty(payload.cityCodes)) {
    if (is.array(payload.cityCodes)) {
      params.city_codes = payload.cityCodes;
    } else if (is.string(payload.cityCodes)) {
      params.city_codes = [payload.cityCodes];
    }
  }

  // 页码
  if (is.existy(payload.page) && is.number(payload.page)) {
    meta.page = payload.page;
  }

  // 条数
  if (is.existy(payload.limit) && is.number(payload.limit)) {
    meta.limit = payload.limit;
  }
  // 分页
  if (is.existy(meta) && is.not.empty(meta) && type !== 'download') {
    params._meta = meta;
  }
  return params;
};

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'employeeStatisticsData',

  /**
   * 状态树
   * @prop {object} statisticsData 个户注册数据列表信息
   */
  state: {
    statisticsData: {},           // 人员列表信息
  },

  /**
   * @namespace employee/statisticsData/effects
   */
  effects: {
    /**
     * 获取个户注册数据列表
     * @param {array} platform_codes 平台
     * @param {array} supplier_ids 供应商
     * @param {array} city_codes 城市
     * @param {number} page 页码
     * @param {number} limit 每页数量
     * @memberof module:model/employee/statisticsData~employee/statisticsData/effects
     */
    *fetchEmployeeStatisticsData({ payload }, { call, put }) {
      // 转换请求参数
      const params = mapperParams(payload);
      const result = yield call(fetchEmployeeStatisticsData, params);

      // 错误提示
      if (result.zh_message) {
        return message.error(result.zh_message);
      }

      yield put({
        type: 'reduceEmployeeStatisticsData',
        payload: result,
      });
    },
    /**
     * 导出个户注册数据列表
     * @param {array} platform_codes 平台
     * @param {array} supplier_ids 供应商
     * @param {array} city_codes 城市
     * @memberof module:model/employee/statisticsData~employee/statisticsData/effects
     */
    *exportEmployeeStatisticsData({ payload }, { call }) {
      // 转换请求参数
      const params = mapperParams(payload, 'download');
      const result = yield call(exportEmployeeStatisticsData, params);
      // 错误提示
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      if (result.ok) {
        return message.success('请求成功');
      }
    },

  },

  /**
   * @namespace employee/statisticsData/reducers
   */
  reducers: {

    /**
     * 获取个户注册数据列表
     * @returns {object} 更新 statisticsData
     * @memberof module:model/employee/statisticsData~employee/statisticsData/reducers
     */
    reduceEmployeeStatisticsData(state, action) {
      return { ...state, statisticsData: action.payload };
    },
  },
};
