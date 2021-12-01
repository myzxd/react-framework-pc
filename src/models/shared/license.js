/**
 * 共享登记 - 证照管理 models/shared/license
 */
import moment from 'moment';
import { message } from 'antd';
import {
  getSharedLicenseList,
  getSharedLicenseDetail,
  createSharedLicense,
  updateSharedLicense,
  getSharedLicensePrincipal,
  exportSharedLicense,
} from '../../services/shared/license';
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
  namespace: 'sharedLicense',

  /**
   * 状态树
   * @prop {object}
   */
  state: {
    licenseList: {}, // 证照列表
    licenseDetail: {}, // 证照列表
    principal: {}, // 证照负责人
  },

  /**
   * @namespace shared/license/effects
   */
  effects: {
    /**
     * 证照列表
     * @param {name} 公司名称
     * @param {type} 公司类型
     * @param {state} 公司状态
     * @memberof module:model/shared/license/effects
     */
    *getSharedLicenseList({ payload = {} }, { call, put }) {
      const params = {
        ...dealParameter(payload),
      };

      const result = yield call(getSharedLicenseList, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedLicenseList', payload: result });
      }
    },

    /**
     * 证照详情
     * @param {string} id
     * @memberof module:model/shared/license/effects
     */
    *getSharedLicenseDetail({ payload = {} }, { call, put }) {
      const {
        id,
      } = payload;
      if (!id) return message.error('缺少合同id');
      const params = { _id: id };

      const result = yield call(getSharedLicenseDetail, params);

      // 判断数据是否为空
      if (result && result._id) {
        yield put({ type: 'reduceSharedLicenseDetail', payload: result });
      }
    },

    /**
     * 重置证照详情
     * @memberof module:model/shared/license/effects
     */
    *resetSharedLicenseDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceSharedLicenseDetail', payload: {} });
    },

    /**
     * 证照编辑
     * @memberof module:model/shared/license/effects
     */
    *updateSharedLicense({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };

      // 如果note值不存在 默认传空字符串
      if (!params.note) {
        params.note = '';
      }

      const result = yield call(updateSharedLicense, params);

      return result;
    },

    /**
     * 证照新建
     * @memberof module:model/shared/license/effects
     */
    *createSharedLicense({ payload = {} }, { call }) {
      const { lookAccountInfo, ...other } = payload;

      const params = {
        ...dealParameter(other),
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
      };
      const result = yield call(createSharedLicense, params);

      return result;
    },

    /**
     * 证照负责人
     * @memberof module:model/shared/license/effects
     */
    *getSharedLicensePrincipal({ payload = {} }, { call, put }) {
      const params = dealParameter(payload);
      const result = yield call(getSharedLicensePrincipal, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedLicensePrincipal', payload: result });
      }
    },

    /**
     * 导出证照
     * @memberof module:model/shared/license/effects
     */
    *exportSharedLicense({ payload = {} }, { call }) {
      const { params = {}, onSuccessCallback, onFailureCallback } = payload;
      const result = yield call(exportSharedLicense, params);

      // 判断数据是否为空
      if (result && result._id && onSuccessCallback) {
        onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },
  },

  /**
   * @namespace shared/license/reducers
   */
  reducers: {
    /**
     * 更新证照列表
     * @returns {object} 更新 licenseList
     * @memberof module:model/shared/license/reducers
     */
    reduceSharedLicenseList(state, action) {
      let licenseList = {};
      if (action && action.payload) {
        licenseList = action.payload;
      }
      return { ...state, licenseList };
    },

    /**
     * 更新证照详情
     * @returns {object} 更新 licenseDetail
     * @memberof module:model/shared/license/reducers
     */
    reduceSharedLicenseDetail(state, action) {
      let licenseDetail = {};
      if (action && action.payload) {
        licenseDetail = action.payload;
      }
      return { ...state, licenseDetail };
    },

    /**
     * 更新证照负责人
     * @returns {object} 更新 principal
     * @memberof module:model/shared/license/reducers
     */
    reduceSharedLicensePrincipal(state, action) {
      let principal = {};
      if (action && action.payload) {
        principal = action.payload;
      }
      return { ...state, principal };
    },
  },
};
