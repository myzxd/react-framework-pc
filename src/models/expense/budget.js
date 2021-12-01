/**
 * 费用预算
 * @module model/expense/budget
 **/
import is from 'is_js';
import {
  fetchExpenseBudgetList,
  fetchExpenseBudgetExport,
  uploadExpenseBudget,
} from '../../services/expense/budget';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'expenseBudget',
  /**
   * 状态树
   * @prop {object} expenseBudgetData 采购入库明细列表
   */
  state: {
    expenseBudgetData: {},
  },
  /**
   * @namespace expense/budget/effects
   */
  effects: {
    /**
     * 获取费用预算列表
     * @param {array}   platforms  平台
     * @param {array}   suppliers  供应商
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @memberof module:model/expense/budget~expense/budget/effects
     */
    * fetchExpenseBudgetList({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };

      const {
        platforms, // 平台
        districts, // 供应商
        cities, // 城市
        suppliers, // 商圈
        industryCode, // 所属场景
        budgetTime, // 预算周期
      } = payload;

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

      // 所属场景
      if (is.existy(industryCode) && is.not.empty(industryCode)) {
        params.industry_code = industryCode;
      }

      // 预算时间
      if (is.existy(budgetTime) && is.not.empty(budgetTime)) {
        params.budget_time = [Number(budgetTime)];
      }

      // 接口
      const result = yield call(fetchExpenseBudgetList, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceExpenseBudget', payload: result });
      }
    },

    /**
     * 费用预算导出
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     */
    *downloadTemplate({ payload = {} }, { put }) {
      const request = {
        params: {},     // 接口参数
        service: fetchExpenseBudgetExport,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 费用预算上传
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     */
    *uploadExpenseBudget({ payload = {} }, { put }) {
      const params = {
        file_key: payload.file,
        storage_type: 3,
      };

      const request = {
        params,     // 接口参数
        service: uploadExpenseBudget,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },


  },
  /**
   * @namespace expense/budget/reducers
   */
  reducers: {
    /**
     * 费用预算列表
     * @returns {object} 更新 expenseBudgetData
     * @memberof module:model/expense/expenseBudget~expense/expenseBudget/reducers
     */
    reduceExpenseBudget(state, action) {
      let expenseBudgetData = {};

      // 数据存在
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        expenseBudgetData = {
          meta: ResponseMeta.mapper(action.payload._meta),
          data: action.payload.data,
        };
      }
      return { ...state, expenseBudgetData };
    },
  },
};
