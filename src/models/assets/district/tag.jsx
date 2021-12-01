/**
 * 资产管理 - 商圈管理 - 标签
 * @module model/Assets/District/tag
 **/
import is from 'is_js';
import { message } from 'antd';

import {
  getDistrictTags,
  createTag,
  updateTag,
  deleteTag,
  setDistrictTags,
  batchSetDistrictTags,
  batchDeleteDistrictTags,
  getDistrictTagChangeLog,
} from '../../../services/assets/districtTag';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'districtTag',
  /**
   * 状态树
   * @prop {object} districtTags 标签列表
   * @prop {array} districtTagDetail 商圈下标签
   * @prop {object} districtTagChangeLog 商圈下标签变更记录
   */
  state: {
    districtTags: {},
    districtTagDetail: [],
    districtTagChangeLog: {},
  },
  /**
   * @namespace Assets/District/tag/effects
   */
  effects: {
    /**
     * 获取标签列表
     * @param {string} name 标签名称
     * @memberof module:model/Assets/District/tag~Assets/District/tag/effects
     */
    * getDistrictTags({ payload = {} }, { call, put }) {
      const { limit = 30, page = 1, name = undefined } = payload;
      // 请求列表的meta信息
      const params = {
        _meta: { limit, page },
      };

      // 标签名称
      name && (params.name = name);
      const result = yield call(getDistrictTags, params);

      if (is.existy(result)) {
        yield put({ type: 'reduceDistrictTags', payload: result });
      }
    },

    /**
     * 重置标签列表
     */
    * resetDistrictTags({ payload = {} }, { put }) {
      yield put({ type: 'reduceDistrictTags', payload });
    },

    /**
     * 创建标签
     * @param {string} name 标签名称
     */
    * createTag({ payload = {} }, { call }) {
      const { name = undefined, onSuccessCallback, onFailureCallback } = payload;
      if (!is.existy(name) || is.empty(name)) {
        return message.error('缺少标签名称');
      }

      const params = { name };

      const result = yield call(createTag, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 编辑标签
     * @param {string} name 标签名称
     * @param {string} id 标签id
     */
    * updateTag({ payload = {} }, { call }) {
      const { id, name = undefined, onSuccessCallback, onFailureCallback } = payload;
      // 标签id
      if (!is.existy(id) || is.empty(id)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少标签id' });
        return;
      }

      // 标签name
      if (!is.existy(name) || is.empty(name)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少标签名称' });
        return;
      }

      const params = { _id: id, name };

      const result = yield call(updateTag, params);
      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 停用标签
     * @param {string} id 标签id
     */
    * deleteTag({ payload = {} }, { call }) {
      const { id, onSuccessCallback, onFailureCallback } = payload;
      // 标签id
      if (!is.existy(id) || is.empty(id)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少标签id' });
        return;
      }

      const params = { _id: id };

      const result = yield call(deleteTag, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },

    /**
     * 设置标签
     * @param {string} name 标签名称
     */
    * setDistrictTags({ payload = {} }, { call }) {
      const { districtId = undefined, tags = [], onSuccessCallback, onFailureCallback } = payload;
      // 商圈id
      if (!is.existy(districtId) || is.empty(districtId)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少商圈id' });
        return;
      }

      const params = { biz_district_id: districtId, label_ids: tags.filter(tag => tag) };

      const result = yield call(setDistrictTags, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 批量设置标签
     * @param {string} name 标签名称
     */
    * batchSetDistrictTags({ payload = {} }, { call }) {
      const { districtIds = undefined, tags = [], onSuccessCallback, onFailureCallback } = payload;
      // 商圈id
      if (!is.existy(districtIds) || is.empty(districtIds)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少商圈id' });
        return;
      }
      // 标签id
      if (!is.existy(tags) || is.empty(tags)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少标签id' });
        return;
      }

      const params = { biz_district_ids: districtIds, label_ids: tags.filter(tag => tag) };

      const result = yield call(batchSetDistrictTags, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 批量移除标签
     * @param {string} name 标签名称
     */
    * batchDeleteDistrictTags({ payload = {} }, { call }) {
      const {
        districtIds = undefined,
        tags = [],
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      // 商圈id
      if (!is.existy(districtIds) || is.empty(districtIds)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少商圈id' });
        return;
      }

      // 标签id
      if (!is.existy(tags) || is.empty(tags)) {
        onFailureCallback && onFailureCallback({ zh_message: '缺少标签id' });
        return;
      }

      const params = { biz_district_ids: districtIds, label_ids: tags.filter(tag => tag) };

      const result = yield call(batchDeleteDistrictTags, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 标签变更记录
     * @param {string} name 标签名称
     */
    * getDistrictTagChangeLog({ payload = {} }, { call, put }) {
      const { districtId = undefined, page = 1, limit = 30 } = payload;
      if (!is.existy(districtId) || is.empty(districtId)) {
        return message.error('缺少商圈id');
      }

      const params = { biz_district_id: districtId, _meta: { page, limit } };

      const result = yield call(getDistrictTagChangeLog, params);

      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceDistrictTagChangeLog', payload: result });
      }
    },

    /**
     * 重置标签变更记录
     */
    * resetDistrictTagChangeLog({ payload = {} }, { put }) {
      yield put({ type: 'reduceDistrictTagChangeLog', payload });
    },
  },
  /**
   * @namespace Assets/District/tag/reducers
   */
  reducers: {
    /**
     * 标签列表
     * @returns {object} 更新 districtTags
     * @memberof module:model/Assets/District/tag~Assets/District/tag/reducers
     */
    reduceDistrictTags(state, action) {
      let districtTags = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        districtTags = action.payload;
      }
      return { ...state, districtTags };
    },

    /**
     * 标签变更记录
     * @returns {object} 更新 districtTagChangeLog
     * @memberof module:model/Assets/District/tag~Assets/District/tag/reducers
     */
    reduceDistrictTagChangeLog(state, action) {
      let districtTagChangeLog = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        districtTagChangeLog = action.payload;
      }
      return { ...state, districtTagChangeLog };
    },
  },
};
