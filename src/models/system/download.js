/**
 * 系统下载管理
 *
 * @module model/system/download
 */
import is from 'is_js';
import dot from 'dot-prop';
import { message } from 'antd';

import { fetchDownloadRecords } from './../../services/system';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'SystemDownloadModal', // TODO: @韩健 命名开头应该小写

  /**
   * 状态树
   * @prop {array} downloadRecords 下载的任务列表
   */
  state: {
    downloadRecords: [],  // 下载的任务列表
  },

  /**
   * @namespace system/download/effects
   */
  effects: {

    /**
     * 获取下载任务的记录列表
     * @param {number} page 页码
     * @param {number} limit 每页条数
     * @memberof module:model/system/download~system/download/effects
     */
    *fetchDownloadRecords({ payload }, { call, put }) {
      const params = {
        page: dot.get(payload, 'page', 1),
        limit: dot.get(payload, 'limit', 10),
        // action: 2, // （1：上传，2：下载 3:异步任务），目前只使用到下载，上传是服务器内部逻辑
      };

      const result = yield call(fetchDownloadRecords, params);

      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceDownloadRecords', payload: result });
      } else {
        message.error('获取下载列表错误', result);
      }
    },

  },

  /**
   * @namespace system/download/reducers
   */
  reducers: {
    /**
     * 获取下载任务的记录列表
     * @return {object} 更新 downloadRecords
     * @memberof module:model/system/download~system/download/reducers
     */
    reduceDownloadRecords(state, action) {
      return { ...state, downloadRecords: action.payload };
    },
  },
};
