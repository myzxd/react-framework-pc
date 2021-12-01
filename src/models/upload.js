/**
 * upload Model  // TODO: @韩健 命名有问题
 *
 * @module model/upload
 */
import {
  getUploadToken,
  postFileToQINIU,
} from './../services/upload';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'upload',
   /**
   * 状态树
   * @prop {object} uploadRecord 上传api记录
   * @prop {string} token 七牛token
   * @prop {string} path 七牛文件地址
   * @prop {string} file 上传文件的信息
   * @prop {object} fileDetail 校验后的详细信息
   * @prop {object} response 请求上传之后的返回response
   */
  state: {
    // 上传api记录
    uploadRecord: {
      _meta: {
        has_more: '',
        result_count: 0,
      },
      data: [],
    },
    namespace: 'defaultNamespace',
    // 七牛token
    token: '',
    // 七牛文件地址
    path: '',
    // 上传文件的信息
    file: '',
    // 校验后的详细信息
    fileDetail: {
      ok: '',
      data: [],
    },
    // 请求上传之后的返回response
    response: {},
  },

  /**
   * @namespace upload/effects
   */
  effects: {

    /**
     * 获取七牛的token
     * @TODO 接口需升级优化
     * @memberof module:model/upload~upload/effects
     */
    *getUploadTokenE({ payload }, { call, put }) {
      const result = yield call(getUploadToken, payload);
      if (result.ok) {
        yield put({
          type: 'getUploadTokenR',
          payload: result.token,
        });
        yield put({
          type: 'getUploadPathR',
          payload: result.path,
        });
      }
    },

    /**
     * 上传文件到七牛服务器
     * @param {string} key key值
     * @param {string} token token值
     * @param {object} file 文件
     * @TODO 接口需升级优化
     * @memberof module:model/upload~upload/effects
     */
    *uploadToServer({ payload }, { call, put }) {
      const { namespace = 'defaultNamespace' } = payload;

      // form形式上传文件
      if (payload.token) {
        const formdata = new window.FormData();
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        const result = yield call(postFileToQINIU, formdata);
        if (result.key) {
          yield put({ type: 'reduceResponse', payload: { namespace, result } });
        }
      }
    },

    /**
     * 重置上传数据
     * @TODO 接口需升级优化
     * @memberof module:model/upload~upload/effects
     */
    *resetUploadResponse({ payload }, { put }) {
      yield put({ type: 'reduceResponse', payload: {} });
    },
  },

  /**
   * @namespace upload/reducers
   */
  reducers: {
    /**
     * 获取七牛的token
     * @returns {string} 更新 token
     * @memberof module:model/upload~upload/reducers
     */
    getUploadTokenR(state, action) {
      return {
        ...state,
        token: action.payload,
      };
    },

    /**
     * 七牛key
     * @returns {string} 更新 path
     * @memberof module:model/upload~upload/reducers
     */
    getUploadPathR(state, action) {
      return {
        ...state,
        path: action.payload,
      };
    },

    /**
     * 上传之后返回的response
     * @returns {object} 更新 response
     * @memberof module:model/upload~upload/reducers
     */
    reduceResponse(state, action) {
      const { namespace, result } = action.payload;
      return {
        ...state,
        response: { ...result, namespace },
      };
    },
  },

};
