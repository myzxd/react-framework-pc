/**
 * 共享登记 - 公司管理 models/shared/company
 */
import { message } from 'antd';
import moment from 'moment';
import {
  getSharedCompanyList,
  getSharedCompanyDetail,
  updateSharedCompany,
  createSharedCompany,
  getSharedCompany,
  getSharedCompanyPurview,
  exportSharedCompany,
  getSharedCompanyNature,
} from '../../services/shared/company';
import { SharedAuthorityState } from '../../application/define';

const objType = '[object Object]';
const arrType = '[object Array]';
const getObjType = obj => Object.prototype.toString.call(obj);

const dealParameter = (data = {}) => {
  const val = {};
  const objKeys = Object.keys(data);
  Object.values(data).map((i, index) => {
    i && (val[objKeys[index]] = i);

    // 处理时间
    if (getObjType(i) === objType && i._isAMomentObject) {
      val[objKeys[index]] = Number(moment(i).format('YYYYMMDD'));
    }

    // 处理附件
    if (getObjType(i) === arrType && objKeys[index] === 'asset_keys') {
      val[objKeys[index]] = i.map(v => Object.values(v)[0]);
    }

    // 处理金额
    if (objKeys[index] === 'registered_capital' || objKeys[index] === 'paid_capital') {
      val[objKeys[index]] = Number(i) * 1000000;
    }
  });
  return val;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'sharedCompany',

  /**
   * 状态树
   * @prop {object}
   */
  state: {
    companyList: {},    // 公司列表
    companyDetail: {},  // 公司详情
    company: {},        // 公司列表（名称）
    companyPurview: {}, // 公司列表（名称）(带state)
    companyNature: {},  // 公司类型
  },

  /**
   * @namespace shared/company/effects
   */
  effects: {
    /**
     * 公司列表
     * @param {name} 公司名称
     * @param {type} 公司类型
     * @param {state} 公司状态
     * @memberof module:model/shared/contract/effects
     */
    *getSharedCompanyList({ payload = {} }, { call, put }) {
      const params = {
        ...dealParameter(payload),
      };

      const result = yield call(getSharedCompanyList, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedCompanyList', payload: result });
      }
    },

    /**
     * 公司详情
     * @param {string} id
     * @memberof module:model/shared/company/effects
     */
    *getSharedCompanyDetail({ payload = {} }, { call, put }) {
      const {
        id,
      } = payload;
      if (!id) return message.error('缺少合同id');
      const params = { _id: id };

      const result = yield call(getSharedCompanyDetail, params);

      // 判断数据是否为空
      if (result && result._id) {
        yield put({ type: 'reduceSharedCompanyDetail', payload: result });
      }
    },

    /**
     * 重置公司详情
     * @memberof module:model/shared/company/effects
     */
    *resetSharedCompanyDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceSharedCompanyDetail', payload: {} });
    },

    /**
     * 公司管理创建
     * @memberof module:model/shared/company/effects
     */
    *createSharedCompany({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };
      const result = yield call(createSharedCompany, params);

      return result;
    },

    /**
     * 公司管理编辑
     * @memberof module:model/shared/company/effects
     */
    *updateSharedCompany({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };

      // 如果note不存在 没有填写 默认要传给后端一个空字符串
      if (!params.note) {
        params.note = '';
      }

      const result = yield call(updateSharedCompany, params);

      return result;
    },

    /**
     * 公司列表（名称）
     * @memberof module:model/shared/company/effects
     */
    *getSharedCompany({ payload = {} }, { call, put }) {
      const params = { ...dealParameter(payload) };
      const result = yield call(getSharedCompany, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedCompany', payload: result });
      }
    },

    /**
     * 公司列表（名称）（带state）
     * @memberof module:model/shared/company/effects
     */
    *getSharedCompanyPurview({ payload = {} }, { call, put }) {
      const params = { ...dealParameter(payload) };
      const result = yield call(getSharedCompanyPurview, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedCompanyPurview', payload: result });
      }
    },

    /**
     * 导出公司
     * @memberof module:model/shared/company/effects
     */
    *exportSharedCompany({ payload = {} }, { call }) {
      const { params = {}, onSuccessCallback, onFailureCallback } = payload;
      const result = yield call(exportSharedCompany, params);

      // 判断数据是否为空
      if (result && result._id && onSuccessCallback) {
        onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },

    /**
     * 获取公司类型
     * @memberof module:model/shared/company/effects
     */
    *getSharedCompanyNature({ payload = {} }, { call, put }) {
      const params = {};
      const result = yield call(getSharedCompanyNature, params);
      if (result && result.data) {
        yield put({ type: 'reduceSharedCompanyNature', payload: result });
      }
    },
  },

  /**
   * @namespace shared/company/reducers
   */
  reducers: {
    /**
     * 更新公司列表
     * @returns {object} 更新 companyList
     * @memberof module:model/shared/company/reducers
     */
    reduceSharedCompanyList(state, action) {
      let companyList = {};
      if (action && action.payload) {
        companyList = action.payload;
      }
      return { ...state, companyList };
    },

    /**
     * 更新公司详情
     * @returns {object} 更新 companyDetail
     * @memberof module:model/shared/company/reducers
     */
    reduceSharedCompanyDetail(state, action) {
      let companyDetail = {};
      if (action && action.payload) {
        companyDetail = action.payload;
      }
      return { ...state, companyDetail };
    },

    /**
     * 更新公司列表（名称）
     * @returns {object} 更新 company
     * @memberof module:model/shared/company/reducers
     */
    reduceSharedCompany(state, action) {
      let company = {};
      if (action && action.payload) {
        company = action.payload;
      }
      return { ...state, company };
    },

    /**
     * 更新公司列表（名称）(带state)
     * @returns {object} 更新 companyPurview
     * @memberof module:model/shared/company/reducers
     */
    reduceSharedCompanyPurview(state, action) {
      let companyPurview = {};
      if (action && action.payload) {
        companyPurview = action.payload;
      }
      return { ...state, companyPurview };
    },

    /**
     * 更新公司类型
     * @returns {object} 更新 companyPurview
     * @memberof module:model/shared/company/reducers
     */
    reduceSharedCompanyNature(state, action) {
      let companyNature = {};
      if (action && action.payload) {
        companyNature = action.payload;
      }
      return { ...state, companyNature };
    },
  },
};
