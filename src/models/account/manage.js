/**
 * 账户管理相关model
 *
 * @module model/account/manage
 */
import is from 'is_js';
import { message } from 'antd';

import {
  fetchAccounts,
  fetchAllPosition,
  createAccount,
  updateAccount,
  fetchAccountsDetails,
  getStrategyGroupList,
} from '../../services/account';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'accountManage',
  /**
   * 状态树
   * @prop {object} accounts 账户列表数据
   * @prop {object} accountDetail 账户详情数据
   * @prop {boolean} isOperateAccountSuccess 是否创建||更新用户成功
   */
  state: {
    accounts: {},       // 账户列表数据
    accountDetail: {},  // 账户详情数据
    positions: {}, // 角色列表
  },

  /**
   * @namespace account/manage/effects
   */
  effects: {
    /**
     * 获取账户列表
     * @param {number} limit 每页条数
     * @param {number} page 页码
     * @param {number} state 账户状态
     * @param {string} name 名称
     * @param {string} phone 手机号
     * @param {array} positions 职位列表
     * @memberof module:model/account/manage~account/manage/effects
     */
    *fetchAccounts({ payload }, { call, put }) {
      // 默认参数
      const params = {
        _meta: {
          limit: 30,
          page: 1,
        },
      };
      // 条数限制
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params._meta.limit = payload.limit;
      }
      // 分页
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params._meta.page = payload.page;
      }
      // 账户状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Number(payload.state);
      }
      // 名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 职位列表
      if (is.existy(payload.positions) && is.not.empty(payload.positions) && is.array(payload.positions)) {
        params.role_ids = payload.positions.map(item => Number(item));
      }
      // 请求服务器
      const result = yield call(fetchAccounts, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceAccounts', payload: result });
      }
    },

    /**
     * 获取账户详情
     * @param {string} id 用户id
     * @memberof module:model/account/manage~account/manage/effects
     */
    *fetchAccountsDetails({ payload }, { call, put }) {
      // 默认参数
      const params = {};

      // 用户id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }

      // 请求服务器
      const result = yield call(fetchAccountsDetails, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        // 获取人员档案的回调
        if (payload.getStaff) {
          payload.getStaff(result.name, result.phone);
        }
        yield put({ type: 'reduceAccountsDetails', payload: result });
      }
    },

    /**
     * 重置账户详情
     * @memberof module:model/account/manage~account/manage/effects
     */
    *resetAccountsDetails({ payload }, { put }) {
      yield put({ type: 'reduceAccountsDetails', payload: {} });
    },

    /**
     * 获取启用和禁用角色
     * @memberof module:model/account/manage~account/manage/effects
     */
    *fetchAllPosition({ payload }, { put, call }) {
      const params = {};
      // 状态
      if (is.existy(payload.available) && is.not.empty(payload.available)) {
        params.available = payload.available;
      }
      // 请求服务器
      const result = yield call(fetchAllPosition, params);
      if (result) {
        yield put({ type: 'reduceAllPosition', payload: result });
      }
    },

    /**
     * 创建账户
     * @param {string} name 名称
     * @param {string} phone 手机号
     * @param {array} positions 职位列表
     * @param {number} state 账户状态
     * @memberof module:model/account/manage~account/manage/effects
     */
    *createAccount({ payload }, { put }) {
      if (is.not.existy(payload.params.name) || is.empty(payload.params.name)) {
        return message.error('操作失败，用户名不能为空');
      }
      if (is.not.existy(payload.params.phone) || is.empty(payload.params.phone)) {
        return message.error('操作失败，手机号不能为空');
      }
      if (is.not.existy(payload.params.positions) || is.empty(payload.params.positions)) {
        return message.error('操作失败，职位信息错误');
      }
      if (is.not.existy(payload.params.state) || is.empty(payload.params.state)) {
        return message.error('操作失败，状态信息错误');
      }

      const roleIds = Array.isArray(payload.params.positions) ?
        payload.params.positions.map(v => Number(v)) : Number(payload.params.positions);

      const params = {
        name: payload.params.name,
        phone: payload.params.phone,
        role_ids: roleIds,
        state: payload.params.state,
      };
      // 人员档案id
      if (is.existy(payload.params.staffProfileId) && is.not.empty(payload.params.staffProfileId)) {
        params.staff_profile_id = payload.params.staffProfileId;
      }
      // 特殊code策略组
      if (is.existy(payload.allowBizGroupIds) && is.not.empty(payload.allowBizGroupIds)) {
        params.allow_biz_group_ids = payload.allowBizGroupIds;
      }
      const request = {
        params, // 接口参数
        service: createAccount, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 更新账户信息
     * @param {string} name 名称
     * @param {string} phone 手机号
     * @param {array} positions 职位列表
     * @param {number} state 账户状态
     * @memberof module:model/account/manage~account/manage/effects
     */
    *updateAccount({ payload }, { put }) {
      if (is.not.existy(payload.params.name) || is.empty(payload.params.name)) {
        return message.error('操作失败，用户名不能为空');
      }
      if (is.not.existy(payload.params.phone) || is.empty(payload.params.phone)) {
        return message.error('操作失败，手机号不能为空');
      }
      if (is.not.existy(payload.params.positions) || is.empty(payload.params.positions)) {
        return message.error('操作失败，职位信息错误');
      }
      if (is.not.existy(payload.params.state) || is.empty(payload.params.state)) {
        return message.error('操作失败，状态信息错误');
      }
      const roleIds = Array.isArray(payload.params.positions) ?
        payload.params.positions.map(v => Number(v)) : Number(payload.params.positions);
      const params = {
        _id: payload.params.id,
        name: payload.params.name,
        phone: payload.params.phone,
        role_ids: roleIds,
        state: payload.params.state,
      };
      // 人员档案id
      if (is.existy(payload.params.staffProfileId) && is.not.empty(payload.params.staffProfileId)) {
        params.staff_profile_id = payload.params.staffProfileId;
      }
      // 特殊code策略组
      if (is.existy(payload.allowBizGroupIds) && is.not.empty(payload.allowBizGroupIds)) {
        params.allow_biz_group_ids = payload.allowBizGroupIds;
      }
      // 请求服务器
      const request = {
        params, // 接口参数
        service: updateAccount, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 获取策略组
     */
    *getStrategyGroupList({ payload }, { call, put }) {
      const {
        strategyGroupId,
        onSuccessCallback,
      } = payload;
      if (!strategyGroupId) {
        return message.error('缺少策略组id');
      }
      const params = {
        _id: strategyGroupId,
      };

      const res = yield call(getStrategyGroupList, params);

      if (res && res.zh_message) {
        return message.error(res.zh_message);
      }

      yield put({
        type: 'reduceStrategyGroupList',
        payload: res,
      });

      onSuccessCallback && onSuccessCallback();
    },

    /**
     * 重置策略组预览
     */
    *resetStrategyGroupList({ payload }, { put }) {
      yield put({
        type: 'reduceStrategyGroupList',
        payload: {},
      });
    },
  },

  /**
   * @namespace account/manage/reducers
   */
  reducers: {

    /**
     * 账户列表
     * @returns {object} 更新 accounts
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceAccounts(state, action) {
      return { ...state, accounts: action.payload };
    },

    /**
     * 用户详情
     * @returns {object} 更新 accountDetail
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceAccountsDetails(state, action) {
      return { ...state, accountDetail: action.payload };
    },

    /**
     * 获取角色
     * @returns {object} 更新 positions
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceAllPosition(state, action) {
      return { ...state, positions: action.payload };
    },

    /**
     * 更新策略组
     * @returns {object} 更新 strategyGroupList
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceStrategyGroupList(state, action) {
      let strategyGroupList = {};
      if (action.payload && Object.keys(action.payload).length > 0) {
        strategyGroupList = action.payload;
      }
      return { ...state, strategyGroupList };
    },
  },
};
