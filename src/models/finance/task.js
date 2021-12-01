/**
 * 结算设置 - 结算计划
 *
 * @module model/finance/task
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import { fetchPayrollPlanList, createPayrollPlan, fetchPayrollPlanUpdate, fetchPayrollPlanToggle } from '../../services/finance';

import { ResponseMeta, RequestMeta } from '../../application/object';
import { PayrollPlanListItem } from '../../application/object/salary/test';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'financeTask',

  /**
   * 状态树
   * @prop {object} payrollPlanData 结算计划数据
   */
  state: {
    payrollPlanData: {},           // 结算计划数据
  },

  /**
   * @namespace finance/task/effects
   */
  effects: {

    /**
     * 获取结算计划数据列表
     * @param {object} meta 分页信息
     * @memberof module:model/finance/task~finance/task/effects
     */
    * fetchPayrollPlanList({ payload = {} }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      const result = yield call(fetchPayrollPlanList, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reducePayrollPlanData', payload: result });
    },

    /**
     * 结算计划创建
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @param {array} cities 城市
     * @param {number} work 工作性质
     * @param {number} startDate 首次开始日期
     * @param {number} cycle 结算周期
     * @param {number} deductions 补扣款
     * @param {number} day 延期天数
     * @param {number} date 周期时间的选择
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/task~finance/task/effects
     */
    * createPayrollPlan({ payload = {} }, { put }) {
      const {
        platforms,        // 平台
        suppliers,        // 供应商
        cities,           // 城市
        work,             // 工作性质
        startDate,        // 首次开始日期
        cycle,            // 结算周期
        deductions,       // 补扣款
        day,              // 延期天数
        date,             // 周期时间的选择
      } = payload.params;
      // 请求列表的meta信息
      const params = {};
      // 获取供平台
      if (is.not.empty(platforms) && is.existy(platforms)) {
        params.platform_code = platforms;
      }
      // 获取供应商
      if (is.not.empty(suppliers) && is.existy(suppliers)) {
        params.supplier_id = suppliers;
      }
      // 获取城市
      if (is.not.empty(cities) && is.existy(cities)) {
        params.city_code = cities;
      }
      // 获取工作性质
      if (is.not.empty(work) && is.existy(work)) {
        params.work_type = work;
      }
      // 首次执行日期
      if (is.not.empty(startDate) && is.existy(startDate)) {
        params.init_execute_date = startDate;
      }
      // 周期类型
      if (is.not.empty(cycle) && is.existy(cycle)) {
        params.payroll_cycle_type = cycle;
      }
      // 结算周期值
      if (is.not.empty(date) && is.existy(date)) {
        params.cycle_interval = date;
      }
      // 延后的天数
      if (is.not.empty(day) && is.existy(day)) {
        params.compute_delay_days = day;
      }
      // 补货款标识
      if (is.existy(deductions)) {
        params.adjustment_flag = deductions;
      }
      const request = {
        params, // 接口参数
        service: createPayrollPlan, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 编辑结算计划
     * @param {string} id id
     * @param {number} cycle 结算周期
     * @param {number} deductions 补扣款
     * @param {number} day 延期天数
     * @param {number} date 周期时间的选择
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/task~finance/task/effects
     */
    // TODO: @韩健 命名有问题
    * fetchPayrollPlanUpdate({ payload = {} }, { put }) {
      const {
        id,               // id
        cycle,            // 结算周期
        deductions,       // 补扣款
        day,              // 延期天数
        date,             // 周期时间的选择
      } = payload.params;
      const params = {};
      // 获取id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }
      // 补货款标识
      if (is.not.empty(deductions) && is.existy(deductions)) {
        params.adjustment_flag = deductions;
      }
      // 计算执行日
      if (is.not.empty(date) && is.existy(date)) {
        params.cycle_interval = date;
      }
      // 延后的天数
      if (is.not.empty(day) && is.existy(day)) {
        params.compute_delay_days = day;
      }
      // 周期类型
      if (is.not.empty(cycle) && is.existy(cycle)) {
        params.payroll_cycle_type = cycle;
      }
      const request = {
        params, // 接口参数
        service: fetchPayrollPlanUpdate, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 启用禁用按钮操作
     * @param {string} id id
     * @param {number} state 状态
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/task~finance/task/effects
     */
    * updatePayrollPlanState({ payload = {} }, { put }) {
      const {
        id,               // id
        state,            // 状态
      } = payload.params;
      const params = {};
      // 获取id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }
      // 获取状态
      if (is.not.empty(state) && is.existy(state)) {
        params.state = state;
      }
      const request = {
        params,                                       // 接口参数
        service: fetchPayrollPlanToggle,              // 接口
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
   * @namespace finance/task/reducers
   */
  reducers: {
    /**
     * 获取结算计划列表数据
     * @return {object} 更新 payrollPlanData
     * @memberof module:model/finance/task~finance/task/reducers
     */
    reducePayrollPlanData(state, action) {
      const payrollPlanData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: PayrollPlanListItem.mapperEach(action.payload.data, PayrollPlanListItem),
      };
      return { ...state, payrollPlanData };
    },
  },
};
