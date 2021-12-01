/**
 * 共享登记 - 印章管理 models/shared/seal
 */
import { message } from 'antd';
import moment from 'moment';
import {
  getSharedSealList,
  getSharedSealDetail,
  updateSharedSeal,
  createSharedSeal,
  getSharedSealCustodian,
  exportSharedSeal,
} from '../../services/shared/seal';
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
  });
  return val;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'sharedSeal',

  /**
   * 状态树
   * @prop {object}
   */
  state: {
    sealList: {}, // 印章列表
    sealDetail: {}, // 印章详情
    custodian: {}, // 印章保管人
  },

  /**
   * @namespace shared/seal/effects
   */
  effects: {
    /**
     * 印章列表
     * @param {name}
     * @param {type}
     * @param {state}
     * @memberof module:model/shared/seal/effects
     */
    *getSharedSealList({ payload = {} }, { call, put }) {
      const params = dealParameter(payload);

      const result = yield call(getSharedSealList, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedSealList', payload: result });
      }
    },

    /**
     * 印章详情
     * @param {string} id
     * @memberof module:model/shared/seal/effects
     */
    *getSharedSealDetail({ payload = {} }, { call, put }) {
      const {
        id,
      } = payload;
      if (!id) return message.error('缺少合同id');
      const params = { _id: id };

      const result = yield call(getSharedSealDetail, params);

      // 判断数据是否为空
      if (result && result._id) {
        yield put({ type: 'reduceSharedSealDetail', payload: result });
      }
    },

    /**
     * 重置印章详情
     * @memberof module:model/shared/seal/effects
     */
    *resetSharedSealDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceSharedSealDetail', payload: {} });
    },

    /**
     * 印章创建
     * @memberof module:model/shared/seal/effects
     */
    *createSharedSeal({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };

      const result = yield call(createSharedSeal, params);

      return result;
    },

    /**
     * 印章编辑
     * @memberof module:model/shared/seal/effects
     */
    *updateSharedSeal({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };

      // 如果值不存在 默认传空字符串
      if (!params.note) {
        params.note = '';
      }
      const result = yield call(updateSharedSeal, params);
      return result;
    },

    /**
     * 印章保管人
     * @memberof module:model/shared/seal/effects
     */
    *getSharedSealCustodian({ payload = {} }, { call, put }) {
      const params = dealParameter(payload);
      const result = yield call(getSharedSealCustodian, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedSealCustodian', payload: result });
      }
    },

    /**
     * 导出印章
     * @memberof module:model/shared/seal/effects
     */
    *exportSharedSeal({ payload = {} }, { call }) {
      const { params = {}, onSuccessCallback, onFailureCallback } = payload;
      const result = yield call(exportSharedSeal, params);

      // 判断数据是否为空
      if (result && result._id && onSuccessCallback) {
        onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },
  },

  /**
   * @namespace shared/seal/reducers
   */
  reducers: {
    /**
     * 更新印章列表
     * @returns {object} 更新 sealList
     * @memberof module:model/shared/seal/reducers
     */
    reduceSharedSealList(state, action) {
      let sealList = {};
      if (action && action.payload) {
        sealList = action.payload;
      }
      return { ...state, sealList };
    },

    /**
     * 更新印章详情
     * @returns {object} 更新 sealDetail
     * @memberof module:model/shared/seal/reducers
     */
    reduceSharedSealDetail(state, action) {
      let sealDetail = {};
      if (action && action.payload) {
        sealDetail = action.payload;
      }
      return { ...state, sealDetail };
    },

    /**
     * 更新印章保管人
     * @returns {object} 更新 custodian
     * @memberof module:model/shared/seal/reducers
     */
    reduceSharedSealCustodian(state, action) {
      let custodian = {};
      if (action && action.payload) {
        custodian = action.payload;
      }
      return { ...state, custodian };
    },
  },
};
