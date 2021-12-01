/**
 * 文件服务（配合上传组件使用）
 *
 * @module model/application/files
 */
import is from 'is_js';
import { message } from 'antd';
import dot from 'dot-prop';
import { fetchPriview, fetchKeyUrl, uploadFileToQiNiu, getUploadToken, fetchFileURL, uploadFileToServer, fetchAmazonInfo, uploadFileToAmazon } from '../../services/upload';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'applicationFiles',

  /**
   * 状态树
   * @prop {object} storage 存储空间
   * @prop {string} token 上传token
   * @prop {string} path 上传path
   */
  state: {
    storage: {},  // 储存空间（根据指定的namespace来使用，隔离不同业务的文件列表）
    token: '',    // 上传token
    path: '',     // 上传path
  },

  /**
   * @namespace application/files/effects
   */
  effects: {
    /**
     *
     * @param {} param0
     * @param {*} param1
     */
    *fetchPriview({ payload = {} }, { call }) {
      const params = {
        type: ['doc', 'image'],
      };

      // 文件key *文件名称
      if (is.existy(payload.file_key) && is.not.empty(payload.file_key)) {
        // 单个也放入到数组里面
        params.keys = [payload.file_key];
      }

      const res = yield call(fetchPriview, params);
      const type = dot.get(res, 'data.0.type');
      const url = dot.get(res, 'data.0.url');
      // 如果是doc文档类型的 就在data里的doc对象下
      if (dot.get(res, 'data.0.doc.url') && payload.onSuccessPreview) {
        payload.onSuccessPreview(dot.get(res, 'data.0.doc.url'), type);
        return;
      }
      //  如果是图片类型的就直接返回在data
      if (url && payload.onSuccessPreview) {
        payload.onSuccessPreview(url, type);
      }
      // 如果是下载
      if (url && payload.onSuccessDownload) {
        payload.onSuccessDownload(url, type);
      }
    },
    /**
     *
     * @param {已经上传到s3的 直接拿key获取地址}
     * @returns
     */
    *fetchKeyUrl({ payload = {} }, { call }) {
      const params = {};
      let fileType = null;
      const reg = /\.(\w+)$/;

      if (is.existy(payload.key) && is.not.empty(payload.key)) {
        params.target_id = payload.key;
        if (payload.key.match(reg)[1]) {
          fileType = payload.key.match(reg)[1];
        }
      }
      const res = yield call(fetchKeyUrl, params);
      if (res.ok && payload.onUploadSuccess) {
        payload.onUploadSuccess(fileType, res.url);
      }
    },

    /**
     * 初始化文件容器，加载文件列表到容器中（编辑功能下，需要初始化文件列表）
     * @param {string} namespace 命名空间
     * @param {object} files 文件
     * @memberof module:model/application/files~application/files/effects
     */
    *initStorage({ payload }, { put }) {
      const { namespace, files } = payload;
      if (is.not.existy(namespace) || is.empty(namespace)) {
        return message.error('文件容器的命名空间不能为空');
      }

      yield put({ type: 'reduceStorageByInit', payload: { namespace, files } });
    },

    /**
     * 获取上传的token
     * @param {string} fileNmae 文件名
     * @memberof module:model/application/files~application/files/effects
     */
    *fetchToken({ payload = {} }, { call, put }) {
      const params = {
        file_name: 'defaultFileName',
      };
      // 文件名称
      if (is.existy(payload.filename) && is.not.empty(payload.filename)) {
        params.file_name = payload.filename;
      }

      const result = yield call(getUploadToken, params);
      if (is.truthy(result.ok) && is.existy(result.token) && is.existy(result.path)) {
        // 成功回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result.token, result.path);
        }
        yield put({ type: 'reduceParams', payload: { token: result.token, path: result.path } });
        return;
      }

      // 失败回调
      if (payload.onFailureCallback) {
        payload.onFailureCallback('上传文件失败，无法获取上传token');
      }
    },

    /**
     * 上传文件
     * @param {string} namespace 命名空间
     * @param {string} token 上传token
     * @param {string} path 上传path
     * @param {object} file 上传文件
     * @param {function} onSuccessCallback 上传成功回调
     * @param {function} onFailureCallback 上传失败回调
     * @memberof module:model/application/files~application/files/effects
     */
    *uploadFile({ payload }, { call, put }) {
      const { file, token, path, namespace, onSuccessCallback, onFailureCallback } = payload;

      // 验证参数
      if (is.not.existy(token) || is.empty(token)) {
        return message.error('上传token错误', token);
      }
      if (is.not.existy(path) || is.empty(path)) {
        return message.error('上传path错误', path);
      }
      if (is.not.existy(file) || is.empty(file)) {
        return message.error('上传文件不能为空');
      }
      if (is.not.existy(namespace) || is.empty(namespace)) {
        return message.error('上传文件的命名空间不能为空');
      }

      // form形式上传文件
      const formdata = new window.FormData();
      formdata.append('key', payload.path);
      formdata.append('token', payload.token);
      formdata.append('file', payload.file);
      const result = yield call(uploadFileToQiNiu, formdata);

      // 每次上传结束，重新获取上传的token
      yield put({ type: 'fetchToken' });

      if (is.not.existy(result.key) || is.empty(result.key)) {
        if (onFailureCallback) {
          onFailureCallback('上传文件失败');
        }
        return message.error('上传文件失败');
      }

      // 文件名称
      const name = payload.file.name;
      // 文件唯一标示（页面显示使用）
      const uid = result.key;
      // 请求返回的hash
      const hash = result.hash;
      // 根据key获取相应的文件地址
      const fileURL = yield call(fetchFileURL, { target_id: payload.path, name });

      if (is.not.truthy(fileURL.ok)) {
        if (onFailureCallback) {
          onFailureCallback('获取上传文件地址失败');
        }
        return message.error('获取上传文件地址失败');
      }
      // 已经处理好的文件信息
      const meta = {
        uid,
        hash,
        status: 'done',
        name: fileURL.name,
        url: fileURL.url,
      };
      yield put({ type: 'reduceStorageByUpload', payload: { namespace, file: meta } });
      // 添加成功回调
      if (onSuccessCallback) {
        onSuccessCallback(meta);
      }
    },

    /**
     * 上传照片
     * @param {object} file 上传的文件
     * @param {function} onSuccessCallback 上传成功回调
     * @memberof module:model/application/files~application/files/effects
     */
    *uploadPhotos({ payload }, { call }) {
      const {
        file,
        onSuccessCallback,
      } = payload;
      if (is.not.existy(file) || is.empty(file)) {
        return message.error('上传文件不能为空');
      }
      // 获取上传的token
      const tokenResult = yield call(getUploadToken, { file_name: 'defaultFileName' });
      if (is.truthy(tokenResult.ok) && is.existy(tokenResult.token) && is.existy(tokenResult.path)) {
        // form形式上传文件
        const formdata = new window.FormData();
        formdata.append('key', tokenResult.path);
        formdata.append('token', tokenResult.token);
        formdata.append('file', payload.file);
        const result = yield call(uploadFileToQiNiu, formdata);
        if (is.not.existy(result.key) || is.empty(result.key)) {
          return message.error('上传文件失败');
        }
        // 文件名称
        const name = payload.file.name;
        // 文件唯一标示（页面显示使用）
        const uid = result.key;
        // 请求返回的hash
        const hash = result.hash;
        // 根据key获取相应的文件地址
        const fileURL = yield call(fetchFileURL, { target_id: result.key, name });
        if (is.not.truthy(fileURL.ok)) {
          return message.error('获取上传文件地址失败');
        }
        // 已经处理好的文件信息
        const meta = {
          uid,
          hash,
          status: 'done',
          name: fileURL.name,
          url: fileURL.url,
        };
        // 添加成功回调
        if (onSuccessCallback) {
          onSuccessCallback(meta);
        }
      } else {
        return message.error('上传文件失败，无法获取上传token');
      }
    },

    /**
     * 上传文件到本地服务器
     * @param {string} namespace 命名空间
     * @param {object} file 上传文件
     * @param {function} onSuccessCallback 上传成功回调
     * @param {function} onFailureCallback 上传失败回调
     * @memberof module:model/application/files~application/files/effects
     */
    *uploadFileToServer({ payload }, { call, put }) {
      const { file, namespace, onSuccessCallback, onFailureCallback } = payload;

      // 验证参数
      if (is.not.existy(file) || is.empty(file)) {
        return message.error('上传文件不能为空');
      }
      if (is.not.existy(namespace) || is.empty(namespace)) {
        return message.error('上传文件的命名空间不能为空');
      }

      // form形式上传文件
      const formdata = new window.FormData();
      formdata.append('file', file);
      const result = yield call(uploadFileToServer, formdata);

      if (is.not.existy(result.key) || is.empty(result.key)) {
        if (onFailureCallback) {
          onFailureCallback('上传文件失败');
        }
        return message.error('上传文件失败');
      }

      // 文件名称
      const name = file.name;
      // 文件唯一标示（页面显示使用）
      const uid = result.key;
      // 请求返回的hash
      const hash = result.hash;
      // 根据key获取相应的文件地址
      // const fileURL = yield call(fetchFileURL, { target_id: path, name });

      if (is.not.truthy(result.ok)) {
        if (onFailureCallback) {
          onFailureCallback('获取上传文件地址失败');
        }
        return message.error('获取上传文件地址失败');
      }
      // 已经处理好的文件信息
      const meta = {
        uid,
        hash,
        status: 'done',
        name,
        url: result.url,
      };
      yield put({ type: 'reduceStorageByUpload', payload: { namespace, file: meta } });
      // 添加成功回调
      if (onSuccessCallback) {
        onSuccessCallback(meta);
      }
    },

    /**
     * 删除容器中的文件
     * @param {string} namespace 命名空间
     * @param {object} file 上传文件
     * @memberof module:model/application/files~application/files/effects
     */
    *removeFile({ payload }, { put }) {
      const { file, namespace } = payload;
      if (is.not.existy(file) || is.empty(file)) {
        return message.error('文件不能为空');
      }
      if (is.not.existy(namespace) || is.empty(namespace)) {
        return message.error('文件容器的命名空间不能为空');
      }

      yield put({ type: 'reduceStorageByRemove', payload: { namespace, file } });
    },

    /**
     * 清空上传空间的数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/files~application/files/effects
     */
    *clearNamespace({ payload }, { put }) {
      const { namespace } = payload;
      if (is.not.existy(namespace) || is.empty(namespace)) {
        return message.error('文件容器的命名空间不能为空');
      }

      yield put({ type: 'reduceStorageByClearNamespace', payload: { namespace } });
    },
    /**
     * 上传s3照片
     * @param {object} file 上传的文件
     * @param {function} onSuccessCallback 上传成功回调
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *uploadAmazonFile({ payload }, { call }) {
      const {
        file,
        domain,
        fileType,
        fileKey,
        onSuccessCallback,
        onChangeUploadDisabled,
        onFailureCallback,
      } = payload;
      if (is.not.existy(file) || is.empty(file)) {
        return message.error('上传文件不能为空');
      }
      // 获取上传的需要的验证信息
      const AmazonInfo = yield call(fetchAmazonInfo, { domain, file_type: fileType, file_key: fileKey });
      if (AmazonInfo && AmazonInfo.ok) {
        // console.log(file);
        const {
          url,
          fields = {},
        } = AmazonInfo.data;
        // form形式上传文件
        const formdata = new window.FormData();
        formdata.append('key', fields.key);
        formdata.append('acl', fields.acl);
        formdata.append('X-Amz-Algorithm', fields['x-amz-algorithm']);
        formdata.append('Policy', fields.policy);
        formdata.append('X-Amz-Signature', fields['x-amz-signature']);
        formdata.append('X-Amz-Date', fields['x-amz-date']);
        formdata.append('X-Amz-Credential', fields['x-amz-credential']);
        formdata.append('file', file);
        const result = yield call(uploadFileToAmazon, { url, formdata });
        if (result && Object.keys(result).length === 0) {
          // 添加成功回调
          if (onSuccessCallback) {
            onSuccessCallback(fields.key);
          }
        } else {
          // 禁用回调
          if (onChangeUploadDisabled) {
            onChangeUploadDisabled();
          }
          return message.error('上传文件失败');
        }
      } else {
        onFailureCallback && onFailureCallback();
        // 禁用回调
        if (onChangeUploadDisabled) {
          onChangeUploadDisabled();
        }
        return message.error('上传文件失败，无法获取验证信息');
      }
    },
  },

  /**
   * @namespace application/files/reducers
   */
  reducers: {
    /**
     * 更新上传的授权参数
     * @return {object} 更新 token,path
     * @memberof module:model/application/files~application/files/reducers
     */
    reduceParams(state, action) {
      const { token, path } = action.payload;
      return { ...state, token, path };
    },

    /**
     * 清空指定容器的数据
     * @return {object} 更新 storage
     * @memberof module:model/application/files~application/files/reducers
     */
    reduceStorageByClearNamespace(state, action) {
      const { namespace } = action.payload;
      const { storage } = state;
      // 如果容器不存在，则直接返回
      if (is.not.existy(storage[namespace]) || is.not.array(storage[namespace])) {
        return { ...state };
      }
      // 清空容器数据
      storage[namespace] = [];
      return { ...state, storage };
    },

    /**
     * 初始化文件容器，加载文件列表到容器中
     * @return {object} 更新 storage
     * @memberof module:model/application/files~application/files/reducers
     */
    reduceStorageByInit(state, action) {
      const { namespace, files } = action.payload;
      const { storage } = state;
      storage[namespace] = files;
      return { ...state, storage };
    },

    /**
     * 上传成功的数据保存到对应的储存空间中
     * @return {object} 更新 storage
     * @memberof module:model/application/files~application/files/reducers
     */
    reduceStorageByUpload(state, action) {
      const { namespace, file } = action.payload;
      const { storage } = state;
      // 判断数据是否存在
      if (is.existy(storage[namespace])) {
        storage[namespace].push(file);
      } else {
        storage[namespace] = [file];
      }

      return { ...state, storage };
    },

    /**
     * 删除指定容器中的文件
     * @return {object} 更新 storage
     * @memberof module:model/application/files~application/files/reducers
     */
    reduceStorageByRemove(state, action) {
      const { namespace, file } = action.payload;
      const { storage } = state;

      // 如果容器不存在，则直接返回
      if (is.not.existy(storage[namespace]) || is.not.array(storage[namespace])) {
        return { ...state };
      }

      // 过滤数据，删除数据
      storage[namespace] = storage[namespace].filter(item => (item.uid !== file.uid && item.name !== file.name));
      return { ...state, storage };
    },
  },
};
