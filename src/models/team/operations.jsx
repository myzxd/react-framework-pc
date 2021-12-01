/**
 * 私教运营管理 model
 *
 * @module model/modelCoachOperations
 */
import is from 'is_js';
import moment from 'moment';
import { message, Modal } from 'antd';

import {
  fetchCoachOperationsList,            // 获取私教运营管理列表
  updateMoney,                       // 编辑单成本、单收入
} from '../../services/team/operations';

import { Unit } from '../../application/define';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'modelCoachOperations',
  /**
   * 状态树
   * @prop {object} coachOperationsList      私教运营管理列表
   */
  state: {
    coachOperationsList: {},          // 私教运营管理列表
    coachOperationsUpdateList: {},          // 私教运营管理编辑页列表
  },

  /**
   * @namespace modelCoachOperations/effects
   */
  effects: {
    /**
     * 获取私教运营管理列表
     * @memberof module:model/modelCoachOperations~modelCoachOperations/effects
     */
    *fetchCoachOperationsList({ payload }, { call, put }) {
      const {
        platforms,
        suppliers,
        cities,
        districts,
        department,     // 私教部门
        month,          // 归属月份
        // singleCost,     // 单成本
        // singleIncome,   // 单收入
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }
      // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }
      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }
      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }
      // 私教部门
      if (is.existy(department) && is.not.empty(department)) {
        params.department_id = department;
      }
      // 归属月份
      // if (is.existy(month) && is.not.empty(month)) {       //无效
      if (month) {
        params.month = Number(moment(month).format('YYYYMM'));
      }
      // // 单成本
      // if (is.existy(singleCost) && is.not.empty(singleCost)) {
      //   params.cost_exists_value = singleCost;
      // }
      // // 单收入
      // if (is.existy(singleIncome) && is.not.empty(singleIncome)) {
      //   params.income_exists_value = singleIncome;
      // }
      // 请求服务器
      const result = yield call(fetchCoachOperationsList, params);
      if (result && result.data) {
        yield put({ type: 'reduceCoachOperationsList', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 获取私教运营管理编辑页列表
     * @memberof module:model/modelCoachOperations~modelCoachOperations/effects
     */
    *fetchCoachOperationsUpdateList({ payload }, { call, put }) {
      const {
        ids,            // 批量操作的id
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // ids
      if (is.existy(ids) && is.not.empty(ids)) {
        params._id = ids;
      }
      // 请求服务器
      const result = yield call(fetchCoachOperationsList, params);
      if (result && result.data) {
        yield put({ type: 'reduceCoachOperationsUpdateList', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 修改单成本、单收入
     * @memberof module:model/modelCoachOperations~modelCoachOperations/effects
     */
    *updateMoney({ payload }, { call }) {
      const {
        ids,            // 批量操作的id
        changeIncome,     // 单收入
        changeCost,       // 单成本
        onSuccessCallback,  // 成功的回调
      } = payload;
      const params = {};
      // ids
      if (is.existy(ids) && is.not.empty(ids)) {
        params._ids = ids;
      }
      // 单收入
      if (is.existy(changeIncome) && is.not.empty(changeIncome)) {
        params.forecast_order_income = Unit.exchangePriceToCent(changeIncome);
      }
      // 单成本
      if (is.existy(changeCost) && is.not.empty(changeCost)) {
        params.forecast_order_cost = Unit.exchangePriceToCent(changeCost);
      }
      // 请求服务器
      const result = yield call(updateMoney, params);
      if (result && result.zh_message) {
        return Modal.error({
          content: result.zh_message,
        });
      }
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  },

  /**
   * @namespace modelCoachOperations/reducers
   */
  reducers: {
    /**
     * 更新私教运营管理列表
     * @returns {string} 更新 coachOperationsList
     * @memberof module:model/modelCoachOperations~modelCoachOperations/reducers
     */
    reduceCoachOperationsList(state, { payload }) {
      return {
        ...state,
        coachOperationsList: payload,
      };
    },
    /**
     * 更新私教运营管理编辑页列表
     * @returns {string} 更新 coachOperationsUpdateList
     * @memberof module:model/modelCoachOperations~modelCoachOperations/reducers
     */
    reduceCoachOperationsUpdateList(state, { payload }) {
      return {
        ...state,
        coachOperationsUpdateList: payload,
      };
    },
  },
};
