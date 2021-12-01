/**
 *  CODE提报页相关接口模块
 * @module model/code/flow
 */
import is from 'is_js';
import {
  message,
} from 'antd';
import {
  fetchSubject,
  fetchCodeBusinessAccounting,
  fetchTeamBusinessAccounting,
} from '../../services/code/common';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'codeCommon',

  /**
   * 状态树
   */
  state: {
    subjects: [],            // 科目
    codeBusAccount: [],      // code核算中心
    teamBusAccount: [],      // team核算中心
  },

  /**
   * @namespace code/codeCommon/effects
   */
  effects: {
    /**
     * 获取科目
     */
    *fetchSubject({ payload }, { call, put }) {
      if (!payload.orderId) return message.error('缺少审批单id');
      const params = {};
      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.order_id = payload.orderId;
      }
      const result = yield call(fetchSubject, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceSubject', payload: result });
      }
    },
    /**
     * 获取code核算中心
     */
    *fetchCodeBusinessAccounting({ payload }, { call, put }) {
      const params = {};
      if (!payload.orderId) return message.error('缺少审批单id');
      if (!payload.subjectId) return message.error('缺少审科目id');
      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.order_id = payload.orderId;
      }
      // 科目id
      if (is.existy(payload.subjectId) && is.not.empty(payload.subjectId)) {
        params.account_id = payload.subjectId;
      }
      const result = yield call(fetchCodeBusinessAccounting, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceCodeBusinessAccounting', payload: result });
      }
    },
    /**
     * 获取team核算中心
     */
    *fetchTeamBusinessAccounting({ payload }, { call, put }) {
      const params = {};
      if (!payload.orderId) return message.error('缺少审批单id');
      if (!payload.subjectId) return message.error('缺少审科目id');
      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.order_id = payload.orderId;
      }
      // 科目id
      if (is.existy(payload.subjectId) && is.not.empty(payload.subjectId)) {
        params.account_id = payload.subjectId;
      }
      const result = yield call(fetchTeamBusinessAccounting, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceTeamBusinessAccounting', payload: result });
      }
    },
  },

  /**
   * @namespace code/codeCommon/reducers
   */
  reducers: {
    /**
     * 获取科目
     * @returns {object} 更新 subjects
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reduceSubject(state, action) {
      return {
        ...state,
        subjects: action.payload,
      };
    },
    /**
     * 获取code核算中心
     * @returns {object} 更新 codeBusAccount
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reduceCodeBusinessAccounting(state, action) {
      return {
        ...state,
        codeBusAccount: action.payload,
      };
    },
    /**
     * 获取team核算中心
     * @returns {object} 更新 teamBusAccount
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reduceTeamBusinessAccounting(state, action) {
      return {
        ...state,
        teamBusAccount: action.payload,
      };
    },
  },
};
