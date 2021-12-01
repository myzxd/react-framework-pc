/**
 * upload Model  // TODO: @韩健 命名有问题
 *
 * @module model/operationManage
 */
import is from 'is_js';
import {
  getUploadToken,
  postFileToQINIU,
} from './../services/upload';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'operationManage',
  /**
   * 状态树
   * @prop {string} token 七牛token
   * @prop {string} path 七牛文件地址
   * @prop {object} uploadSpace 文件上传空间，根据命名空间储存数据(提供给费用管理的付款审批使用)
   */
  state: {
    // 七牛token
    token: '',
    // 七牛文件地址
    path: '',
    // 文件上传空间，根据命名空间储存数据(提供给费用管理的付款审批使用)
    uploadSpace: {},
  },

  /**
   * @namespace operationManage/effects
   */
  effects: {
    /**
     * 获取七牛的token
     * @param {string} key key值
     * @param {string} token token值
     * @memberof module:model/operationManage~operationManage/effects
     */
    *getUploadTokenE({ payload }, { call, put }) {
      const {
        namespace,
        file,
        onSuccessUpload,
      } = payload;
      // 获取上传的token
      const params = {
        file_name: file.name,
      };
      const result = yield call(getUploadToken, params);
      if (result.ok) {
        // TODO: 这里临时增加了一个字段做处理，后续的整个上传功能需要全部统一到CorePhotos中
        // 判断是否有命名空间，将数据存储到命名空间中
        if (is.existy(namespace)) {
          yield put({ type: 'reduceUploadSpace', payload: { namespace, data: result } });
        }

        // 储存数据
        yield put({ type: 'getUploadTokenR', payload: result.token });
        yield put({ type: 'getUploadPathR', payload: result.path });
        yield put({
          type: 'postFileToQINIUE',
          payload: {
            key: result.path,
            token: result.token,
            file,
            onSuccessUpload,
          },
        });
      }
    },

    /**
     * 上传文件到七牛
     * @param {string} key key值
     * @param {string} token token值
     * @param {string} file 文件信息
     * @memberof module:model/operationManage~operationManage/effects
     */
    *postFileToQINIUE({ payload }, { call }) {
      // form形式上传文件
      if (payload.token) {
        const formdata = new window.FormData();
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        const res = yield call(postFileToQINIU, formdata);  // 因为是七牛返回的，暂时无法处理，默认成功上传七牛
        if (payload.onSuccessUpload && res && res.key) {
          payload.onSuccessUpload(res);
        }
      }
      // 暂时不能处理七牛返回的正确或则错误信息。
    },
  },

  /**
   * @namespace operationManage/reducers
   */
  reducers: {
    /**
     * 获取七牛的token
     * @returns {string} 更新 token
     * @memberof module:model/operationManage~operationManage/reducers
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
     * @memberof module:model/operationManage~operationManage/reducers
     */
    getUploadPathR(state, action) {
      return {
        ...state,
        path: action.payload,
      };
    },

    /**
     * 更新文件上传空间，根据命名空间储存数据(提供给费用管理的付款审批使用)
     * @returns {object} 更新 uploadSpace
     * @memberof module:model/operationManage~operationManage/reducers
     */
    reduceUploadSpace(state, action) {
      const { uploadSpace } = state;
      const { namespace, data } = action.payload;
      uploadSpace[namespace] = data;
      return { ...state, uploadSpace };
    },
  },
};
