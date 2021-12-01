/**
 * system Model  // TODO: @韩健 命名有问题
 *
 * @module model/system
 */
import dot from 'dot-prop';
import { message } from 'antd';
import {
  getAccountsList,               // 获取关联账号列表
  getAllAccounts,                // 获取所有有效账号
  addRelatedAccounts,                // 添加关联账号
  editRelatedAccounts,               // 编辑关联账号
} from './../services/system';

import { authorize } from '../application';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'system',

  /**
   * 状态树
   * @prop {boolean} loading 添加用户loading
   * @prop {object} employeeDetail 离职申请后的人员详情以及添加账户的待筛选人员列表 数据格式为以下 不可更改去除data属性
   * @prop {object} supplierList 供应商列表
   * @prop {object} supplierDetail 供应商详情
   * @prop {object} accountsList 关联账号列表
   * @prop {array} allAccounts 所有有效账号
   * @prop {boolean} visible 控制模态框
   * @prop {boolean} isOperationSuccess 控制是否提交成功
   * @prop {object} distributeList 业务分配列表
   * @prop {object} cityDistributeList 业务分配列表
   */
  state: {
    loading: false, // 添加用户loading
    // 离职申请后的人员详情以及添加账户的待筛选人员列表 数据格式为以下 不可更改去除data属性
    employeeDetail: {
      data: [],
      state: 50,  // staff/get_staff_info  50在职，-50离职， 1离职待审核
    },
    // 供应商列表
    supplierList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 供应商详情
    supplierDetail: {
      _id: '',  // id
      biz_district_info_list: [],   // 商圈列表
      supplier_name: '',            // 供应商名字
      supplier_id: '', // 供应商id
      state: '', // 状态
      created_at: '', // 创建时间
      disable_at: '', // 禁用时间
      updated_at: '', // 最新操作时间
      operator_name: '', // 最新操作人
    },
    // 关联账号列表
    accountsList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 所有有效账号
    allAccounts: [],
    visible: false,              // 控制模态框
    isOperationSuccess: false,   // 控制是否提交成功
    // 业务分配列表
    distributeList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 业务分配列表
    cityDistributeList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
  },

  /**
   * @namespace system/effects
   */
  effects: {

    /**
     * 关联账号列表
     * @param {number} page 页码
     * @param {number} limit 每页条数
     * @param {number} state 启用状态
     * @param {string} account_id 账号id
     * @memberof module:model/system~system/effects
     */
    *getAccountsListE({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: dot.get(payload, 'page', 1),
          limit: dot.get(payload, 'limit', 10),
        },
        state: 100,      // 启用状态
      };

      if (dot.has(payload, 'account_id')) {
        params.account_id = payload.account_id;
      }
      const result = yield call(getAccountsList, params);
      if (result !== undefined) {
        yield put({ type: 'getAccountsListR', payload: result });
      }
    },

    /**
     * 有效账号
     * @memberof module:model/system~system/effects
     */
    *getAllAccountsE({ payload }, { call, put }) {
      const params = {};
      const result = yield call(getAllAccounts, params);
      if (result !== undefined) {
        // 存储所有有效账号
        authorize.phones = result;
        yield put({ type: 'getAllAccountsR', payload: result });
      }
    },

    /**
     * 添加账号
     * @TODO 接口需优化
     * @memberof module:model/system~system/effects
     */
    *addRelatedAccountsE({ payload }, { call, put }) {
      const result = yield call(addRelatedAccounts, payload);
      if (dot.get(result, 'ok')) {
        message.success('账号关联成功');
        // 刷新列表
        yield put({ type: 'getAccountsListE' });
        return true;
      } else if (result.zh_message) {
        const errCallBack = payload.errCallBack;
        if (errCallBack) {
          errCallBack(result.zh_message);
        }
      }
    },

    /**
     * 编辑账号、删除账号
     * @TODO 接口需优化
     * @memberof module:model/system~system/effects
     */
    *editRelatedAccountsE({ payload }, { call, put }) {
      const result = yield call(editRelatedAccounts, payload);
      if (dot.get(result, 'ok')) {
        // 刷新列表
        yield put({ type: 'getAccountsListE' });
        return true;
      } else if (result.zh_message) {
        payload.onFailureCallBack(result.zh_message);
      }
    },
  },

  /**
   * @namespace system/reducers
   */
  reducers: {

    /**
     * 人员详情列表
     * @returns {object} 更新 employeeDetail
     * @memberof module:model/system~system/reducers
     */
    // TODO: @韩健 命名有问题
    getEmployeeDetailOneR(state, action) {
      return {
        ...state,
        employeeDetail: action.payload,
      };
    },

    /**
     * 关联账号列表
     * @returns {object} 更新 accountsList
     * @memberof module:model/system~system/reducers
     */
    // TODO: @韩健 命名有问题
    getAccountsListR(state, action) {
      return {
        ...state,
        accountsList: action.payload,
      };
    },

    /**
     * 所有有效账号
     * @returns {array} 更新 accountsList
     * @memberof module:model/system~system/reducers
     */
    // TODO: @韩健 命名有问题
    getAllAccountsR(state, action) {
      return {
        ...state,
        allAccounts: action.payload,
      };
    },

    /**
     * 判断是否编辑成功
     * @returns {boolean} 更新 isOperationSuccess
     * @memberof module:model/system~system/reducers
     */
    // TODO: @韩健 命名有问题
    updateOperationState(state, action) {
      return {
        ...state,
        isOperationSuccess: action.payload,
      };
    },

    /**
     * 获取业务分部列表
     * @returns {object} 更新 distributeList
     * @memberof module:model/system~system/reducers
     */
    // TODO: @韩健 命名有问题
    getBusinessDistributionR(state, action) {
      return {
        ...state,
        distributeList: action.payload,
      };
    },

  },
};
