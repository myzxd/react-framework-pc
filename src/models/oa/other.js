/**
 * oa - 其他
 *
 * @module model/oa/other
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  updateSign,
  createSign,
  fetchSignDetail,
} from '../../services/oa/other';
import { OAPayloadMapper } from './helper';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'oaOther',

  /**
   * 状态树
   */
  state: {
    signDetail: {}, // 事务签呈详情
  },

  /**
   * @namespace oa/oaOther/effects
   */
  effects: {
    /**
     * 事务签呈编辑
     */
    *updateSign({ payload = {} }, { call }) {
      // 创建时配置审批流参数
      const mapper = !payload.flag ? OAPayloadMapper(payload) : {};
      if (mapper === false && !payload.flag) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      // 请求参数
      const params = {
        ...mapper,
      };
      // 编辑id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 文件编号
      if (is.existy(payload.documentNumber) && is.not.empty(payload.documentNumber)) {
        params.document_number = payload.documentNumber;
      }
      // 主题
      if (is.existy(payload.theme) && is.not.empty(payload.theme)) {
        params.theme = payload.theme;
      }
      // 说明
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 附件
      if (is.existy(payload.fileList) && is.not.empty(payload.fileList)) {
        params.asset_keys = Array.isArray(payload.fileList) ? payload.fileList.map(item => item.key) : [];
      } else {
        params.asset_keys = [];
      }

      payload.departmentId && !payload.flag && (params.actual_department_id = payload.departmentId);
      payload.postId && !payload.flag && (params.actual_job_id = payload.postId);

      const res = payload.flag ? yield call(updateSign, params) : yield call(createSign, params);
      if (res && res.zh_message) {
        message.error(res.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (res && res._id) {
        message.success('请求成功');
        // 成功的回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(res);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 获取事务签呈详情信息
     */
    *fetchSignDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      // 判断是否是兴达插件
      if (isPluginOrder) {
        yield put({ type: 'reduceSignDetail', payload: oaDetail });
        return;
      }
      // 请求参数
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchSignDetail, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceSignDetail', payload: result });
      }
    },
  },

  /**
   * @namespace oa/oaOther/reducers
   */
  reducers: {
    // 获取事务签呈详情信息
    reduceSignDetail(state, action) {
      return { ...state, signDetail: action.payload };
    },
  },
};
