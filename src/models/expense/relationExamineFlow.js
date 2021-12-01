/**
 * 费用管理
 * @module model/expense/relationExamineFlow
 **/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchExamineFlow,
  fetchExamineFlowinfo,
  fetchRelationExamineFlow,
  updateRelationExamineFlow,
  createRelationExamineFlow,
  updateRelationExamineFlowState,
} from '../../services/expense';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'relationExamineFlow',
    /**
   * 状态树
   * @prop {object} statisticsList 审批单列表
   */
  state: {
    relationExamineFlowList: {}, // 获取关联审批流列表
    examineFlowList: {}, // 审批流列表
    xdExamineFlowList: {}, // 兴达审批流列表
    examineFlowInfo: {}, // 审批流信息
  },
  /**
   * @namespace expense/relationExamineFlow/effects
   */
  effects: {

    /**
     * 获取关联审批流列表
     */
    fetchRelationExamineFlow: [
      function*({ payload = {} }, { call, put }) {
        const params = {};
        // 审批种类
        if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
          params.biz_type = payload.bizType;
        }
        // BU3审批流名称
        if (is.existy(payload.xdFlowName) && is.not.empty(payload.xdFlowName)) {
          params.xd_flow_name = payload.xdFlowName;
        }
        // 趣活审批流名称
        if (is.existy(payload.name) && is.not.empty(payload.name)) {
          params.qh_flow_name = payload.name;
        }
        // 成本中心类型
        if (is.existy(payload.centerType)
          && is.not.empty(payload.centerType)) {
          params.flow_type_list = Array.isArray(payload.centerType) ? payload.centerType : [payload.centerType];
        }
        // 适用类型
        if (is.existy(payload.applyApplicationType) && is.not.empty(payload.applyApplicationType)) {
          params.flow_type_list = [payload.applyApplicationType];
        }
        // 可用状态
        if (is.existy(payload.state)
          && is.not.empty(payload.state)) {
          params.state = payload.state;
        }

        // 请求接口，返回数据
        const result = yield call(fetchRelationExamineFlow, params);

        if (result === undefined) {
          return;
        }
        if (result) {
          yield put({ type: 'reduceRelationExamineFlow', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 更新关联审批流列表状态
     */
    * updateRelationExamineFlowState({ payload }, { call }) {
      const params = {};
      // 兴达关联审批流id
      if (is.existy(payload.pluginId) && is.not.empty(payload.pluginId)) {
        params.plugin_id = payload.pluginId;
      }
      // 趣活关联审批流id
      if (is.existy(payload.appWatchFlowId) && is.not.empty(payload.appWatchFlowId)) {
        params.app_watch_flow_id = payload.appWatchFlowId;
      }
      // 审批种类
      if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
        params.biz_type = payload.bizType;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      const result = yield call(updateRelationExamineFlowState, params);
      if (result.is_ok) {
        payload.onSuccessCallback && payload.onSuccessCallback();
      }
    },

    /**
     * 更新关联审批流
     */
    * updateRelationExamineFlow({ payload }, { call }) {
      const params = {};
      // 兴达关联审批流id
      if (is.existy(payload.pluginId) && is.not.empty(payload.pluginId)) {
        params.plugin_id = payload.pluginId;
      }
      // 趣活关联审批流id
      if (is.existy(payload.appWatchFlowId) && is.not.empty(payload.appWatchFlowId)) {
        params.app_watch_flow_id = payload.appWatchFlowId;
      }
      // 审批种类
      if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
        params.biz_type = payload.bizType;
      }
      // 趣活审批流id
      if (is.existy(payload.qhFlowId) && is.not.empty(payload.qhFlowId)) {
        params.qh_flow_id = payload.qhFlowId;
      }
      // 趣活审批流id
      if (is.existy(payload.xdFlowId) && is.not.empty(payload.xdFlowId)) {
        params.xd_flow_id = payload.xdFlowId;
      }
      const result = yield call(updateRelationExamineFlow, params);
      // 错误提示
      if (result.zh_message) {
        message.error(`请求错误：${result.zh_message}`);
        payload.onLoading && payload.onLoading();
        return;
      }
      if (result.is_ok) {
        payload.onSuccessCallback && payload.onSuccessCallback();
      }
    },

    /**
     * 创建关联审批流
     */
    * createRelationExamineFlow({ payload }, { call }) {
      const params = {};
      // 审批种类
      if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
        params.biz_type = payload.bizType;
      }
      // 趣活审批流id
      if (is.existy(payload.qhFlowId) && is.not.empty(payload.qhFlowId)) {
        params.qh_flow_id = payload.qhFlowId;
      }
      // 趣活审批流id
      if (is.existy(payload.xdFlowId) && is.not.empty(payload.xdFlowId)) {
        params.xd_flow_id = payload.xdFlowId;
      }
      const result = yield call(createRelationExamineFlow, params);
      // 错误提示
      if (result.zh_message) {
        message.error(`请求错误：${result.zh_message}`);
        payload.onLoading && payload.onLoading();
        return;
      }
      if (result.is_ok) {
        payload.onSuccessCallback && payload.onSuccessCallback();
      }
    },

    /**
     * 获取审批流列表
     */
    fetchXDExamineFlow: [
      function*({ payload = {} }, { call, put }) {
        const params = {};
        // 审批种类
        if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
          params.biz_type = payload.bizType;
        }
        // 审批流名称
        if (is.existy(payload.flowNameKey) && is.not.empty(payload.flowNameKey)) {
          params.flow_name_key = payload.flowNameKey;
        }
        // 事务审批类型
        if (is.existy(payload.applyApplicationType) && is.not.empty(payload.applyApplicationType)) {
          params.apply_application_type = payload.applyApplicationType;
        }
        // 商户类型
        if (is.existy(payload.merchant) && is.not.empty(payload.merchant)) {
          params.merchant = payload.merchant;
        }
        // 请求接口，返回数据
        const result = yield call(fetchExamineFlow, params);
        if (result === undefined) {
          return;
        }
        if (Array.isArray(result.datas) && result.datas.length === 0) {
          payload.onReset && payload.onReset();
        }
        if (Array.isArray(result.datas)) {
          yield put({ type: 'reduceXDExamineFlow', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],
    /**
     * 获取审批流列表
     */
    fetchExamineFlow: [
      function*({ payload = {} }, { call, put }) {
        const params = {};
        // 审批种类
        if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
          params.biz_type = payload.bizType;
        }
        // 审批流名称
        if (is.existy(payload.flowNameKey) && is.not.empty(payload.flowNameKey)) {
          params.flow_name_key = payload.flowNameKey;
        }
        // 事务审批类型
        if (is.existy(payload.applyApplicationType) && is.not.empty(payload.applyApplicationType)) {
          params.apply_application_type = payload.applyApplicationType;
        }
        // 商户类型
        if (is.existy(payload.merchant) && is.not.empty(payload.merchant)) {
          params.merchant = payload.merchant;
        }
        // 请求接口，返回数据
        const result = yield call(fetchExamineFlow, params);
        if (result === undefined) {
          return;
        }
        if (Array.isArray(result.datas) && result.datas.length === 0) {
          payload.onReset && payload.onReset();
        }
        if (Array.isArray(result.datas)) {
          yield put({ type: 'reduceExamineFlow', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 获取审批流信息
     */
    fetchExamineFlowXDInfo: [
      function* ({ payload = {} }, { call, put }) {
        const params = {};
         // 审批种类
        if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
          params.biz_type = payload.bizType;
        }
        // 商户类型
        if (is.existy(payload.merchant) && is.not.empty(payload.merchant)) {
          params.merchant = payload.merchant;
        }
        // 审批流id
        if (is.existy(payload.flowId) && is.not.empty(payload.flowId)) {
          params.flow_id = payload.flowId;
        }
        const result = yield call(fetchExamineFlowinfo, params);
        if (result.zh_message) {
          message.error(`请求错误：${result.zh_message}`);
          yield put({ type: 'reduceExamineFlowinfo', payload: { result, namespace: payload.namespace } });
          return;
        }
        if (result) {
          yield put({ type: 'reduceExamineFlowinfo', payload: { result, namespace: payload.namespace } });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 获取审批流信息
     */
    fetchExamineFlowinfo: [
      function* ({ payload = {} }, { call, put }) {
        const params = {};
         // 审批种类
        if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
          params.biz_type = payload.bizType;
        }
        // 商户类型
        if (is.existy(payload.merchant) && is.not.empty(payload.merchant)) {
          params.merchant = payload.merchant;
        }
        // 审批流id
        if (is.existy(payload.flowId) && is.not.empty(payload.flowId)) {
          params.flow_id = payload.flowId;
        }
        const result = yield call(fetchExamineFlowinfo, params);
        if (result.zh_message) {
          message.error(`请求错误：${result.zh_message}`);
          yield put({ type: 'reduceExamineFlowinfo', payload: { result, namespace: payload.namespace } });
          return;
        }
        if (result) {
          yield put({ type: 'reduceExamineFlowinfo', payload: { result, namespace: payload.namespace } });
        }
      },
      { type: 'takeLatest' },
    ],
  },

  /**
   * @namespace expense/relationExamineFlow/reducers
   */
  reducers: {
    /**
     * 关联审批流列表
     * @returns {object} 更新 relationExamineFlowList
     * @memberof module:model/expense/relationExamineFlow~expense/relationExamineFlow/reducers
     */
    reduceRelationExamineFlow(state, action) {
      return {
        ...state,
        relationExamineFlowList: action.payload,
      };
    },
    /**
     * 兴达审批流列表
     * @returns {object} 更新 xdExamineFlowList
     * @memberof module:model/expense/relationExamineFlow~expense/relationExamineFlow/reducers
     */
    reduceXDExamineFlow(state, action) {
      return {
        ...state,
        xdExamineFlowList: action.payload,
      };
    },
    /**
     * 审批流列表
     * @returns {object} 更新 examineFlowList
     * @memberof module:model/expense/relationExamineFlow~expense/relationExamineFlow/reducers
     */
    reduceExamineFlow(state, action) {
      return {
        ...state,
        examineFlowList: action.payload,
      };
    },
    /**
     * 审批流信息
     * @returns {object} 更新 examineFlowInfo
     * @memberof module:model/expense/relationExamineFlow~expense/relationExamineFlow/reducers
     */
    reduceExamineFlowinfo(state, action) {
      const { result, namespace } = action.payload;
      if (namespace && result) {
        return {
          ...state,
          examineFlowInfo: {
            ...state.examineFlowInfo,
            [namespace]: result,
          },
        };
      }
      return {
        ...state,
        examineFlowInfo: {},
      };
    },
  },
};
