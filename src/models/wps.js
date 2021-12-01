/**
 * 文件服务（配合上传组件使用）
 *
 * @module model/application/files
 */
import is from 'is_js';
import { message } from 'antd';
import { fetchAssets } from '../services/wps';

const FileMode = {
  readonly: 'readonly', // 只读
  rewrite: 'rewrite',   // 读写
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'applicationWPS',

  state: {},
  /**
   * @namespace application/wps/effects
   */
  effects: {
    /**
     * 获取wps相关的文件信息
     * 不加 sage takeLatest
     */
    *fetchAssets({ payload = {} }, { put }) {
      if (is.not.existy(payload.ids) || is.empty(payload.ids)) {
        return message.error('无法获取文件列表信息，查询文件不能为空');
      }

       // enableTakeLatest 存在 加载 sage takeLatest钩子
      if (payload.enableTakeLatest) {
        yield put({ type: 'fetchAssetsTakeLatest', payload });
      } else {
        yield put({ type: 'fetchAssetswps', payload });
      }
    },

    /**
     * 获取wps相关的文件信息
     * 加载 sage takeLatest钩子
     */
    fetchAssetsTakeLatest: [
      function* ({ payload = {} }, { call }) {
        const params = {
          // 要查询的文件id列表
          keys: payload.ids,
          // 文件类型，默认参数，后端自己判断文件格式（该参数后端后续需要调整）
          type: ['image ', 'doc'],
          // 文件模式, 默认只读
          mode: FileMode.readonly,
        };

        // 判断是否是读写模式参数
        if (is.existy(payload.mode) && is.not.empty(payload.mode)) {
          params.mode = payload.mode;
        }

        // 请求接口
        const result = yield call(fetchAssets, params);
        if (is.not.existy(result) || is.not.array(result.data)) {
          console.error('无法获取wps信息，查询失败', result);
          return message.error('无法获取文件列表信息');
        }
        // 成功回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result.data);
        }
      },
      { type: 'takeLatest' },
    ],
    /**
     *请求wps预览接口 不加载sage takeLatest
     */
    *fetchAssetswps({ payload = {} }, { call }) {
      const params = {
        // 要查询的文件id列表
        keys: payload.ids,
        // 文件类型，默认参数，后端自己判断文件格式（该参数后端后续需要调整）
        type: ['image ', 'doc'],
        // 文件模式, 默认只读
        mode: FileMode.readonly,
      };

      // 判断是否是读写模式参数
      if (is.existy(payload.mode) && is.not.empty(payload.mode)) {
        params.mode = payload.mode;
      }
      // 请求接口
      const result = yield call(fetchAssets, params);
      if (is.not.existy(result) || is.not.array(result.data)) {
        console.error('无法获取wps信息，查询失败', result);
        return message.error('无法获取文件列表信息');
      }
      // 成功回调函数
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result.data);
      }
    },

  },
};
