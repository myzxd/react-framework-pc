/**
 * 费用管理
 * @module model/expense/statistics
 **/
import is from 'is_js';
import moment from 'moment';

import {
 fetchExpenseStatistics,
} from '../../services/expense';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'expenseStatistics',
    /**
   * 状态树
   * @prop {object} statisticsList 审批单列表
   */
  state: {

    // 审批监控
    statisticsList: {},
  },
  /**
   * @namespace expense/statistics/effects
   */
  effects: {

    /**
     * 获取审批流统计列表
     * @param {array} platforms 平台
     * @param {approvalFlow} approvalFlow 审批流名称
     * @param {number} month 筛选月份
     */
    * fetchExpenseStatistics({ payload }, { call, put }) {
      const {
        approvalFlowId, // 审批流id
        platforms, // 平台
        approvalFlow, // 审批流名称
        month, // 筛选月份
        page = 1,
        limit = 30,
      } = payload;

      const params = {
        _meta: {
          page,
          limit,
        },
      };

      // 审批流id
      if (is.existy(approvalFlowId) && is.not.empty(approvalFlowId)) {
        params._id = approvalFlowId;
      }

      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_codes = platforms;
      }

      // 审批流名称
      if (is.existy(approvalFlow) && is.not.empty(approvalFlow)) {
        params.name = approvalFlow;
      }

      // 审批流名称
      if (is.existy(month) && is.not.empty(month)) {
        params.belong_time = month;
      } else {
        params.belong_time = moment(new Date()).format('YYYYMM');
      }

      // 请求接口，返回数据
      const result = yield call(fetchExpenseStatistics, params);

      if (result === undefined) {
        return;
      }

      yield put({ type: 'reduceExpenseStatistics', payload: result });
    },

    /**
     * 重置审批流统计列表
     * @todo 接口需升级优化
     * @memberof module:model/expense/statistics~expense/statistics/effects
     */
    * resetExpenseStatistics({ payload }, { put }) {
      yield put({ type: 'reduceExpenseStatistics', payload: {} });
    },
  },

  /**
   * @namespace expense/statistics/reducers
   */
  reducers: {
    /**
     * 审批监控
     * @returns {object} 更新 statisticsList
     * @memberof module:model/expense/statistics~expense/statistics/reducers
     */
    reduceExpenseStatistics(state, action) {
      let statisticsList = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        statisticsList = action.payload;
      }
      return {
        ...state,
        statisticsList,
      };
    },
  },
};
