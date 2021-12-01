/**
 * 共享登记 - 银行账户管理 models/shared/bankAccount
 */
import { message } from 'antd';
import moment from 'moment';
import is from 'is_js';
import {
  getSharedBankAccountList,
  getSharedBankAccountDetail,
  updateSharedBankAccount,
  createSharedBankAccount,
  exportSharedBankAccount,
  getBankOperator,
  getEmployeeList,
} from '../../services/shared/bankAccount';

import { SharedAuthorityState } from '../../application/define';

const uppercaseLetterReg = /[A-Z]/;
const objType = '[object Object]';
const arrType = '[object Array]';
const getObjType = obj => Object.prototype.toString.call(obj);

const dealParameter = (data = {}, type) => {
  const val = {};
  const objKeys = Object.keys(data);
  Object.values(data).map((i, index) => {
    // 驼峰字段需要自己特殊处理
    i && !uppercaseLetterReg.test(objKeys[index]) && (val[objKeys[index]] = i);
    if (type === 'update' && (is.not.existy(i) || is.empty(i))
      && !uppercaseLetterReg.test(objKeys[index])) {
      val[objKeys[index]] = '';
    }

    if (type === 'update' && (is.not.existy(i) || is.empty(i))
      && (objKeys[index] === 'online_custodian_employee_ids' ||
        objKeys[index] === 'asset_keys' ||
        objKeys[index] === 'opened_data')) {
      val[objKeys[index]] = [];
    }

    // 处理时间
    if (getObjType(i) === objType && i._isAMomentObject && !uppercaseLetterReg.test(objKeys[index])) {
      val[objKeys[index]] = Number(moment(i).format('YYYYMMDD'));
    }

    // 处理附件
    if (getObjType(i) === arrType && objKeys[index] === 'asset_keys') {
      val[objKeys[index]] = i.map(v => Object.values(v)[0]);
    }
  });
  return val;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'sharedBankAccount',

  /**
   * 状态树
   * @prop {object}
   */
  state: {
    bankAccountList: {}, // 银行账户列表
    bankAccountDetail: {}, // 银行账户详情
    bankOperator: {}, // 银行操作人
    employeeList: {}, // 员工档案list
  },

  /**
   * @namespace shared/bankAccount/effects
   */
  effects: {
    /**
     * 银行账户列表
     * @param {name} 名称
     * @param {type} 类型
     * @param {state} 状态
     * @memberof module:model/shared/bankAccount/effects
     */
    *getSharedBankAccountList({ payload = {} }, { call, put }) {
      const {
        bankDate, // 银行开户月
      } = payload;
      const params = {
        ...dealParameter(payload),
      };

      if (bankDate) {
        // 开户开始时间
        params.bank_start_opened_date = Number(moment(bankDate).format('YYYYMM01'));
        // 开户结束时间
        params.bank_end_opened_date = Number(moment(bankDate).add(1, 'M').format('YYYYMM01'));
      }

      const result = yield call(getSharedBankAccountList, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedBankAccountList', payload: result });
      }
    },

    /**
     * 银行账户详情
     * @param {string} id
     * @memberof module:model/shared/bankAccount/effects
     */
    *getSharedBankAccountDetail({ payload = {} }, { call, put }) {
      const {
        id,
      } = payload;
      if (!id) return message.error('缺少合同id');
      const params = { _id: id };

      const result = yield call(getSharedBankAccountDetail, params);

      // 判断数据是否为空
      if (result && result._id) {
        yield put({ type: 'reduceSharedBankAccountDetail', payload: result });
      }
    },

    /**
     * 重置银行账户详情
     * @memberof module:model/shared/bankAccount/effects
     */
    *resetSharedBankAccountDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceSharedBankAccountDetail', payload: {} });
    },

    /**
     * 银行账户创建
     * @memberof module:model/shared/bankAccount/effects
     */
    *createSharedBankAccount({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };
      const result = yield call(createSharedBankAccount, params);

      return result;
    },

    /**
     * 银行账户编辑
     * @memberof module:model/shared/bankAccount/effects
     */
    *updateSharedBankAccount({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other, 'update'),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };
      const result = yield call(updateSharedBankAccount, params);

      return result;
    },

    /**
     * 导出银行账户
     * @memberof module:model/shared/bankAccount/effects
     */
    *exportSharedBankAccount({ payload = {} }, { call }) {
      const {
        params: pretreatmentParams = {},
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      const params = {
        ...dealParameter(pretreatmentParams),
      };

      if (pretreatmentParams.bankDate) {
        // 开户开始时间
        params.bank_start_opened_date = Number(moment(pretreatmentParams.bankDate).format('YYYYMM01'));
        // 开户结束时间
        params.bank_end_opened_date = Number(moment(pretreatmentParams.bankDate).add(1, 'M').format('YYYYMM01'));
      }

      const result = yield call(exportSharedBankAccount, params);

      // 判断数据是否为空
      if (result && result._id && onSuccessCallback) {
        onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },

    /**
     * 获取银行操作人（网银保管人，开户人）
     * @memberof module:model/shared/bankAccount/effects
     */
    *getBankOperator({ payload = {} }, { call, put }) {
      const res = yield call(getBankOperator, {});

      if (res) {
        yield put({ type: 'reduceBankOperator', payload: res });
      }
    },

    /**
     * 重置银行操作人（网银保管人，开户人）
     * @memberof module:model/shared/bankAccount/effects
     */
    *resetBankOperator({ payload = {} }, { put }) {
      yield put({ type: 'reduceBankOperator', payload: {} });
    },

    /**
     * 获取员工档案list
     * @memberof module:model/shared/bankAccount/effects
     */
    *getEmployeeList({ payload = {} }, { call, put }) {
      const res = yield call(getEmployeeList, { ...payload });

      if (res) {
        yield put({ type: 'reduceEmployeeList', payload: res });
      }
    },

    /**
     * 重置员工档案list
     * @memberof module:model/shared/bankAccount/effects
     */
    *resetEmployeeList({ payload = {} }, { put }) {
      yield put({ type: 'reduceEmployeeList', payload: {} });
    },
  },

  /**
   * @namespace shared/bankAccount/reducers
   */
  reducers: {
    /**
     * 更新银行账户列表
     * @returns {object} 更新 bankAccountList
     * @memberof module:model/shared/bankAccount/reducers
     */
    reduceSharedBankAccountList(state, action) {
      let bankAccountList = {};
      if (action && action.payload) {
        bankAccountList = action.payload;
      }
      return { ...state, bankAccountList };
    },

    /**
     * 更新银行账户详情
     * @returns {object} 更新 bankAccountDetail
     * @memberof module:model/shared/bankAccount/reducers
     */
    reduceSharedBankAccountDetail(state, action) {
      let bankAccountDetail = {};
      if (action && action.payload) {
        bankAccountDetail = action.payload;
      }
      return { ...state, bankAccountDetail };
    },

    /**
     * 更新银行操作人
     * @returns {object} 更新 bankOperator
     * @memberof module:model/shared/bankAccount/reducers
     */
    reduceBankOperator(state, action) {
      let bankOperator = {};
      if (action && action.payload) {
        bankOperator = action.payload;
      }
      return { ...state, bankOperator };
    },

    /**
     * 更新员工档案list
     * @returns {object} 更新 bankOperator
     * @memberof module:model/shared/bankAccount/reducers
     */
    reduceEmployeeList(state, action) {
      let employeeList = {};
      if (action && action.payload) {
        employeeList = action.payload;
      }
      return { ...state, employeeList };
    },
  },
};
