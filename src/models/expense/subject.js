/**
 * 科目设置
 * @module model/expense/subject
 **/
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchExpenseSubjects, // 获取科目列表
  fetchSubjectsDetail, // 获取科目详情
  createSubject, // 创建科目
  updateSubject, // 编辑科目
  toggleSubjectState, // 启用/停用科目
  deleteSubject, // 删除科目
  fetchCostAttributionInfo,
  fetchExpenseLowlevelSubjects,
} from '../../services/expense';

import { authorize } from '../../application';
import { RequestMeta, ResponseMeta, CostAccountingDetail } from '../../application/object/';
import { OaCostAccountingState } from '../../application/define';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'expenseSubject',
  /**
   * 状态树
   * @prop {object} subjectsData    科目列表
   * @prop {object} subjectsDetail  测试详情数据
   * @prop {object} attributionData 成本归属信息
   */
  state: {
    // 科目列表
    subjectsData: {},
    subjectsDetail: {}, // 测试详情数据
    attributionData: {}, // 成本归属信息
    lowLevelSubjectsData: {}, // 最后一级科目数据
  },
 /**
   * @namespace expense/subject/subscriptions
   */
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }
        // 获取科目名称
        if (pathname === '/Expense/Manage/Records/Form') {
          dispatch({ type: 'fetchExpenseSubjects', payload: { page: 1, limit: 30 } });
        }
      });
    },
  },
 /**
   * @namespace expense/subject/effects
   */
  effects: {

    /**
     * 获取科目列表
     * @param {string}  costCenterType 成本中心
     * @param {string}  level   科目级别
     * @param {number}  state   状态
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    * fetchExpenseSubjects({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      if (payload.isAll === true) {
        params.state = [OaCostAccountingState.normal, OaCostAccountingState.disable, OaCostAccountingState.draft];
      }
      if (payload.state) {
        params.state = payload.state;
      }
      // 成本中心
      if (is.existy(payload.costCenterType) && is.not.empty(payload.costCenterType)) {
        params.cost_center_type = payload.costCenterType;
      }
       // 科目级别
      if (is.existy(payload.level) && is.not.empty(payload.level)) {
        params.level = payload.level.map(item => Number(item));
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state) && is.array(payload.state)) {
        params.state = payload.state.map(state => Number(state));
      }
      // 科目名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 创建时间
      if (is.existy(payload.startDate) && is.not.empty(payload.startDate)) {
        params.created_start_time = payload.startDate;
      }
      // 结束时间
      if (is.existy(payload.endDate) && is.not.empty(payload.endDate)) {
        params.created_end_time = payload.endDate;
      }
      // 科目编码
      if (is.existy(payload.coding) && is.not.empty(payload.coding)) {
        params.accounting_code = payload.coding;
      }

      // 适用场景
      payload.scense && Number(payload.scense) && (params.industry_codes = [Number(payload.scense)]);

      const result = yield call(fetchExpenseSubjects, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceExpenseSubjects', payload: result });
      }
    },

    /**
     * 获取最后一级科目列表
     * @param {number}  state   状态
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    fetchExpenseLowlevelSubjects: [
      function*({ payload = {} }, { call, put }) {
        // 请求列表的meta信息
        const params = {
          _meta: RequestMeta.mapper(payload),
          state: payload.state,
        };

        // 适用场景
        payload.scense && (params.industry_codes = [Number(payload.scense)]);

        const result = yield call(fetchExpenseLowlevelSubjects, params);

        if (is.existy(result)) {
          yield put({ type: 'reduceExpenseLowlevelSubjects', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 清空科目列表
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *resetSubjects({ payload = {} }, { put }) {
      yield put({ type: 'reduceExpenseSubjectsWithoutMapper', payload });
    },

    /**
     * 科目详情
     * @param {string}  id 科目id
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *fetchSubjectsDetail({ payload = {} }, { call, put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('科目id不能为空');
      }
      const params = {
        id: payload.id, // 科目id
      };
      const result = yield call(fetchSubjectsDetail, params);
      yield put({ type: 'reduceSubjectsDetail', payload: result });
    },

    /**
     * 清空科目详情
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *resetSubjectsDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceSubjectsDetailWithoutMapper', payload });
    },

    /**
     * 新建科目
     * @param {number} level 科目级别
     * @param {string} superior 上级科目
     * @param {boolean} costOd 是否是成本类
     * @param {number} attribution 成本归属
     * @param {string} name 科目名称
     * @param {string} coding 科目编号
     * @param {string} describe 科目描述
     * @param {number} state 状态
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *createSubject({ payload = {} }, { put }) {
      const {
        level,       // 科目级别
        superior,    // 上级科目
        costOf,      // 成本类
        attribution, // 成本归属
        name,        // 科目名称
        coding,      // 科目编码
        describe,    // 科目描述
        state,       // 状态
        scense = undefined, // 适用场景
      } = payload.params;
      const params = {};

      // 科目级别
      if (is.existy(level) && is.not.empty(level) && is.number(Number(level))) {
        params.level = Number(level);
      }

      // 上级科目
      if (is.string(superior)) {
        if (is.not.empty(superior)) {
          params.parent_id = superior;
        }
      }

      // 成本类
      if (is.existy(costOf) && is.not.empty(costOf) && is.boolean(costOf)) {
        params.cost_flag = costOf;
      }

      // 成本归属
      if (is.number(Number(attribution))) {
        if (is.not.empty(attribution)) {
          params.cost_center_type = Number(attribution);
        }
      }

      // 科目名称
      if (is.existy(name) && is.not.empty(name) && is.string(name)) {
        const trimedName = name.trim();
        if (is.not.empty(trimedName)) {
          params.name = trimedName;
        } else {
          return message.error('科目名称不能只有空格');
        }
      }

      // 科目编码
      if (is.existy(coding) && is.not.empty(coding) && is.string(coding)) {
        params.accounting_code = coding;
      }

      // 科目描述
      if (is.string(describe)) {
        if (is.not.empty(describe)) {
          params.description = describe;
        }
      }

      // 科目状态
      if (is.existy(state) && is.not.empty(state) && is.number(state)) {
        params.state = state;
      }

      // 适用场景
      scense && (params.industry_codes = [Number(scense)]);

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result._id) && is.not.empty(result._id);
      };

      const request = {
        params, // 接口参数
        service: createSubject,  // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 编辑科目
     * @param {number} level 科目级别
     * @param {string} superior 上级科目
     * @param {boolean} costOd 是否是成本类
     * @param {number} attribution 成本归属
     * @param {string} name 科目名称
     * @param {string} coding 科目编号
     * @param {string} describe 科目描述
     * @param {number} state 状态
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *updateSubject({ payload = {} }, { put }) {
      const {
        level,       // 科目级别
        superior,    // 上级科目
        costOf,      // 成本类
        attribution, // 成本归属
        name,        // 科目名称
        coding,      // 科目编码
        describe,    // 科目描述
        state,       // 状态
        id,
        scense = undefined, // 适用场景
      } = payload.params;
      const params = {};

      // 科目级别
      if (is.existy(level) && is.not.empty(level) && is.number(Number(level))) {
        params.level = Number(level);
      }

      // 上级科目
      if (is.string(superior)) {
        if (is.not.empty(superior)) {
          params.parent_id = superior;
        }
      }

      // 成本类
      if (is.existy(costOf) && is.not.empty(costOf) && is.boolean(costOf)) {
        params.cost_flag = costOf;
      }

      // 成本归属
      if (is.number(Number(attribution))) {
        if (is.not.empty(attribution)) {
          params.cost_center_type = Number(attribution);
        }
      }

      // 科目名称
      if (is.existy(name) && is.not.empty(name) && is.string(name)) {
        const trimedName = name.trim();
        if (is.not.empty(trimedName)) {
          params.name = trimedName;
        }
      }

      // 科目编码
      if (is.existy(coding) && is.not.empty(coding) && is.string(coding)) {
        params.accounting_code = coding;
      }

      // 科目描述
      if (is.string(describe)) {
        if (is.not.empty(describe)) {
          params.description = describe;
        } else {
          params.description = '';
        }
      }

      // 科目id
      if (is.string(id)) {
        params.id = id;
      }

      // 科目状态
      if (is.existy(state) && is.not.empty(state) && is.number(state)) {
        params.state = state;
      }

      // 适用场景
      scense && (params.industry_codes = [Number(scense)]);

      const request = {
        params, // 接口参数
        service: updateSubject,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 删除科目
     * @param {string}  id 科目id
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *deleteSubject({ payload = {} }, { put }) {
      // 科目id
      if (is.empty(payload.params.id) || is.not.existy(payload.params.id)) {
        return message.error('科目id不能为空');
      }
      const params = {
        id: payload.params.id, // 科目id
      };
      const request = {
        params, // 接口参数
        service: deleteSubject,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 启用/停用科目
     * @param {string}  id 科目id
     * @param {number}  state 状态
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *toggleSubjectState({ payload = {} }, { put }) {
      const {
        id, // 科目id
        state, // 状态
      } = payload.params;
      const params = {};

      // 科目id必填
      if (is.existy(id) && is.not.empty(id)) {
        params.id = id;
      } else {
        return message.error('科目id不能为空');
      }

      // 状态必填
      if (is.existy(state) && is.not.empty(state) && is.number(state)) {
        switch (state) {
          case OaCostAccountingState.normal:
            params.flag = true;
            break;
          case OaCostAccountingState.disable:
            params.flag = false;
            break;
          default:
            return message.error('状态不合法');
        }
      } else {
        return message.error('状态不合法');
      }
      const request = {
        params, // 接口参数
        service: toggleSubjectState,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取成本归属信息
     * @param {string}  id 科目id
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    *fetchCostAttributionInfo({ payload = {} }, { call, put }) {
      const result = yield call(fetchCostAttributionInfo);
      yield put({ type: 'reduceCostAttributionInfo', payload: result });
    },
  },
 /**
   * @namespace expense/subject/reducers
   */
  reducers: {
    /**
     * 获取科目列表
     * @returns {object} 更新 subjectsData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceExpenseSubjects(state, action) {
      const subjectsData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: CostAccountingDetail.mapperEach(action.payload.data, CostAccountingDetail),
      };
      return { ...state, subjectsData };
    },

    /**
     * 获取科目列表
     * @returns {object} 更新 subjectsData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceExpenseLowlevelSubjects(state, action) {
      let lowLevelSubjectsData = {};
      if (action.payload) {
        lowLevelSubjectsData = {
          meta: ResponseMeta.mapper(action.payload._meta),
          data: CostAccountingDetail.mapperEach(action.payload.data, CostAccountingDetail),
        };
      }
      return { ...state, lowLevelSubjectsData };
    },

    /**
     * 获取科目列表
     * @returns {object} 更新 subjectsData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceExpenseSubjectsWithoutMapper(state, action) {
      return { ...state, subjectsData: action.payload };
    },

    /**
     * 获取科目详情
     * @returns {object} 更新 subjectsDetail
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceSubjectsDetail(state, action) {
      const subjectsDetail = CostAccountingDetail.mapper(action.payload, CostAccountingDetail);
      return { ...state, subjectsDetail };
    },

    /**
     * 获取科目详情
     * @returns {object} 更新 subjectsDetail
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceSubjectsDetailWithoutMapper(state, action) {
      return { ...state, subjectsDetail: action.payload };
    },
    /**
     * 获取成本归属信息
     * @returns {object} 更新 attributionData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceCostAttributionInfo(state, action) {
      return { ...state, attributionData: action.payload };
    },
  },
};
