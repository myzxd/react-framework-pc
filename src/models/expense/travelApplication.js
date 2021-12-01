/**
 *  出差申请  models/expense/travelApplication
 */

import is from 'is_js';
import { message } from 'antd';

import { getTravelApplicationLists, exportTravelApplication, getTravelApplicationDetail } from '../../services/expense/travelApplication';
import { RequestMeta } from '../../application/object';
import { ExpenseBorrowRepaymentsTabType } from '../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'expenseTravelApplication',
  /**
   * 状态树
   * @prop {object}
   */
  state: {
    expenseTravelApplicationMineList: {
      data: [],
      _meta: {},
    }, // 出差申请列表-我的
    expenseTravelApplicationAllList: {
      data: [],
      _meta: {},
    },  // 出差申请列表-全部
    expenseTravelApplicationDetail: {},   // 出差申请单详情
  },
  /**
   * @namespace expense/subject/effects
   */
  effects: {
    /**
     * 获取出差申请列表
     * @param {string} applyUserName 实际出差人
     * @param {string} applyAccountName  申请人
     * @param {string} travelApplyOrderId 出差申请单号
     * @param {number} bizState  报销状态
     * @param {string} applyStartAt  申请开始时间
     * @param {string} applyDoneAt  申请结束时间
     * @param {string} expectStartMinAt 开始最小时间
     * @param {string} expectStartMaxAt 开始最大时间
     * @param {string} expectDoneMinAt 结束最小时间
     * @param {string} expectDoneMaxAt 结束最大时间
     * @memberof module:model/expense/travelApplication/effects
     */
    * fetchExpenseTravelApplication({ payload = {} }, { call, put }) {
      const {
        page,
        limit,
        applyUserName,                 // 实际出差人
        applyAccountName,              // 申请人
        travelApplyOrderId,            // 出差申请单号
        bizState,                      // 报销状态
        applyStartAt,                  // 申请开始时间
        applyDoneAt,                   // 申请结束时间
        expectStartMinAt,              // 开始最小时间
        expectStartMaxAt,              // 开始最大时间
        expectDoneMinAt,               // 结束最小时间
        expectDoneMaxAt,               // 结束最大时间
        applyAccountId,                // 我的
      } = payload;

      const params = {
        // 状态
        state: [10, 100, -100],
        _meta: RequestMeta.mapper({ page: page || 1, limit: limit || 30 }),
      };

      // 实际出差人
      if (is.existy(applyUserName) && is.not.empty(applyUserName)) {
        params.apply_user_name = applyUserName;
      }
      // 申请人
      if (is.existy(applyAccountName) && is.not.empty(applyAccountName)) {
        params.apply_account_id = applyAccountName;
      }
      // 出差申请单号
      if (is.existy(travelApplyOrderId) && is.not.empty(travelApplyOrderId)) {
        params.travel_apply_order_id = travelApplyOrderId;
      }
      // 报销状态
      if (is.existy(bizState) && is.not.empty(bizState)) {
        params.biz_state = bizState;
      }
      // 申请开始时间
      if (is.existy(applyStartAt) && is.not.empty(applyStartAt)) {
        params.apply_start_at = applyStartAt;
      }
      // 申请结束时间
      if (is.existy(applyDoneAt) && is.not.empty(applyDoneAt)) {
        params.apply_done_at = applyDoneAt;
      }
      // 开始最小时间
      if (is.existy(expectStartMinAt) && is.not.empty(expectStartMinAt)) {
        params.expect_start_min_at = expectStartMinAt;
      }
      // 开始最大时间
      if (is.existy(expectStartMaxAt) && is.not.empty(expectStartMaxAt)) {
        params.expect_start_max_at = expectStartMaxAt;
      }
      // 结束最小时间
      if (is.existy(expectDoneMinAt) && is.not.empty(expectDoneMinAt)) {
        params.expect_done_min_at = expectDoneMinAt;
      }
      // 结束最大时间
      if (is.existy(expectDoneMaxAt) && is.not.empty(expectDoneMaxAt)) {
        params.expect_done_max_at = expectDoneMaxAt;
      }
      // 我的
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

      // 请求服务器
      const result = yield call(getTravelApplicationLists, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        if (payload.selectKey === `${ExpenseBorrowRepaymentsTabType.mine}`) {
          // TODO:
          yield put({ type: 'reduceExpenseTravelApplicationMine', payload: result });
        } else {
          yield put({ type: 'reduceExpenseTravelApplicationAll', payload: result });
        }
      }
    },
    /**
     * 导出出差申请列表
     * @param {string} applyUserName 实际出差人
     * @param {string} applyAccountName  申请人
     * @param {string} travelApplyOrderId 出差申请单号
     * @param {number} bizState  报销状态
     * @param {string} applyStartAt  申请开始时间
     * @param {string} applyDoneAt  申请结束时间
     * @param {string} expectStartMinAt 开始最小时间
     * @param {string} expectStartMaxAt 开始最大时间
     * @param {string} expectDoneMinAt 结束最小时间
     * @param {string} expectDoneMaxAt 结束最大时间
     * @param {string} applyAccountId 我的
     * @memberof module:model/expense/travelApplication/effects
     */
    * exportExpenseTravelApplication({ payload }, { call }) {
      const {
        page,
        limit,
        applyUserName,                 // 实际出差人
        applyAccountName,              // 申请人
        travelApplyOrderId,            // 出差申请单号
        bizState,                      // 报销状态
        applyStartAt,                  // 申请开始时间
        applyDoneAt,                   // 申请结束时间
        expectStartMinAt,              // 开始最小时间
        expectStartMaxAt,              // 开始最大时间
        expectDoneMinAt,               // 结束最小时间
        expectDoneMaxAt,               // 结束最大时间
        applyAccountId,                // 我的
      } = payload;

      const params = {
        // 状态
        state: [10, 100, -100],
        _meta: RequestMeta.mapper({ page: page || 1, limit: limit || 30 }),
      };

      // 实际出差人
      if (is.existy(applyUserName) && is.not.empty(applyUserName)) {
        params.apply_user_name = applyUserName;
      }
      // 申请人
      if (is.existy(applyAccountName) && is.not.empty(applyAccountName)) {
        params.apply_account_id = applyAccountName;
      }
      // 出差申请单号
      if (is.existy(travelApplyOrderId) && is.not.empty(travelApplyOrderId)) {
        params.travel_apply_order_id = travelApplyOrderId;
      }
      // 报销状态
      if (is.existy(bizState) && is.not.empty(bizState)) {
        params.biz_state = bizState;
      }
      // 申请开始时间
      if (is.existy(applyStartAt) && is.not.empty(applyStartAt)) {
        params.apply_start_at = applyStartAt;
      }
      // 申请结束时间
      if (is.existy(applyDoneAt) && is.not.empty(applyDoneAt)) {
        params.apply_done_at = applyDoneAt;
      }
      // 开始最小时间
      if (is.existy(expectStartMinAt) && is.not.empty(expectStartMinAt)) {
        params.expect_start_min_at = expectStartMinAt;
      }
      // 开始最大时间
      if (is.existy(expectStartMaxAt) && is.not.empty(expectStartMaxAt)) {
        params.expect_start_max_at = expectStartMaxAt;
      }
      // 结束最小时间
      if (is.existy(expectDoneMinAt) && is.not.empty(expectDoneMinAt)) {
        params.expect_done_min_at = expectDoneMinAt;
      }
      // 结束最大时间
      if (is.existy(expectDoneMaxAt) && is.not.empty(expectDoneMaxAt)) {
        params.expect_done_max_at = expectDoneMaxAt;
      }
      // 我的
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

      // 请求服务器
      const result = yield call(exportTravelApplication, params);
      if (result && is.existy(result.record._id)) {
        message.success(`创建下载任务成功，任务id：${result.record._id}`);
      } else {
        message.error(result.message);
      }
    },
    /**
     * 重置出差管理数据
     * @todo 接口需升级优化
     * @memberof module:model/expense/travelApplication/effects
     */
    * resetExpenseTravelApplication({ payload }, { put }) {
      yield put({ type: 'reduceExpenseTravelApplication', payload: {} });
    },
    /**
     * 获取出差单id详情
     * @todo getTravelApplicationDetail
     * @memberof module:model/expense/travelApplication/effects
     */
    * getExpenseTravelApplicationDetail({ payload }, { call, put }) {
      // 请求服务器
      const result = yield call(getTravelApplicationDetail, payload);

      yield put({ type: 'reduceExpenseTravelApplicationDetail', payload: result });
    },
  },
  /**
   * @namespace expense/subject/reducers
   */
  reducers: {
    /**
     * 获取出差管理列表--我的
     * @returns {object} 更新 reduceExpenseTravelApplicationMine
     * @memberof module:model/expense/travelApplication/reducers
     */
    reduceExpenseTravelApplicationMine(state, action) {
      const expenseTravelApplicationMineList = action.payload;

      return { ...state, expenseTravelApplicationMineList };
    },
    /**
     * 获取出差管理列表--全部
     * @returns {object} 更新 reduceExpenseTravelApplicationAll
     * @memberof module:model/expense/travelApplication/reducers
     */
    reduceExpenseTravelApplicationAll(state, action) {
      const expenseTravelApplicationAllList = action.payload;

      return { ...state, expenseTravelApplicationAllList };
    },
    /**
     * 重置数据
     * @returns {object}
     * @memberof module:model/expense/travelApplication/reducers
     */
    reduceExpenseTravelApplication(state) {
      return {
        ...state,
        expenseTravelApplicationMineList: {},
        expenseTravelApplicationAllList: {},
      };
    },
    /**
     * 获取出差单id详情
     * @returns {object}
     * @memberof module:model/expense/travelApplication/reducers
     */
    reduceExpenseTravelApplicationDetail(state, action) {
      return {
        ...state,
        expenseTravelApplicationDetail: action.payload,
      };
    },
  },
};
