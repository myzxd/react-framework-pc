/**
 * 合同模版管理
 * @module model/system/contractTemplate
 */
import is from 'is_js';
import { message, Modal } from 'antd';

import {
  fetchContractTemplates,
  deleteContractTemplates,
  createContractTemplates,
  fetchContractTemplatesPreview,
  fetchRefreshContractTemplate,
  fetchComponentDetais,
} from '../../services/system/contractTemplate';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'systemContractTemplate',

  /**
   * 状态树
  */
  state: {
    contractTemplates: {},
    templatesPreview: {},
    componentDetails: [],
  },
  /**
   * @namespace system/contractTemplate/effects
   */
  effects: {
    /**
     * 合同模版列表
     * @memberof module:model/system/contractTemplate~system/contractTemplate/effects
     */
    *fetchContractTemplates({ payload = {} }, { call, put }) {
      const params = {};
      // 分页
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 合同模版编码
      if (is.existy(payload.code) && is.not.empty(payload.code)) {
        params._id = payload.code;
      }
      // 合同模版名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 请求服务器
      const result = yield call(fetchContractTemplates, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceContractTemplates', payload: result });
      }
    },
    /**
     * 合同模版列表 - 刷新
     * @memberof module:model/system/contractTemplate~system/contractTemplate/effects
     */
    *fetchRefreshContractTemplate({ payload = {} }, { call }) {
      const params = {};
      // 合同模版id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 请求服务器
      const result = yield call(fetchRefreshContractTemplate, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (result.ok) {
        message.success('刷新成功');
        payload.onSuccessCallback && payload.onSuccessCallback();
      }
    },
    /**
     * 组件详情
     * @memberof module:model/system/contractTemplate~system/contractTemplate/effects
     */
    *fetchComponentDetais({ payload = {} }, { call, put }) {
      const params = {};
      // 请求服务器
      const result = yield call(fetchComponentDetais, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result) && Array.isArray(result)) {
        yield put({ type: 'reduceComponentDetails', payload: result });
      }
    },

    /**
     * 删除合同模版
     * @memberof module:model/system/contractTemplate~system/contractTemplate/effects
     */
    *deleteContractTemplates({ payload = {} }, { call }) {
      const params = {};
      // 分页
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 请求服务器
      const result = yield call(deleteContractTemplates, params);
      // 报错信息
      if (result.zh_message) {
        Modal.error({
          title: '提示',
          maskClosable: true,
          content: result.zh_message,
        });
        return;
      }
      // 判断数据是否为空
      if (result.ok) {
        message.success('删除成功');
        payload.onSuccessCallback && payload.onSuccessCallback();
      }
    },
    /**
     * 添加合同模版
     * @memberof module:model/system/contractTemplate~system/contractTemplate/effects
     */
    *createContractTemplates({ payload = {} }, { call }) {
      const params = {};
      // 编码
      if (is.existy(payload.code) && is.not.empty(payload.code)) {
        params._id = payload.code;
      }
      // 请求服务器
      const result = yield call(createContractTemplates, params);
      // 报错信息
      if (result.zh_message) {
        payload.onLoading && payload.onLoading();
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (result.ok) {
        message.success('创建成功');
        payload.onSuccessCallback && payload.onSuccessCallback();
        return;
      }
      payload.onLoading && payload.onLoading();
    },
    /**
     * 合同模版预览
     * @memberof module:model/system/contractTemplate~system/contractTemplate/effects
     */
    *fetchContractTemplatesPreview({ payload = {} }, { call, put }) {
      const params = {};
      // 编码
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 请求服务器
      const result = yield call(fetchContractTemplatesPreview, params);
      // 报错信息
      if (result.zh_message) {
        payload.onLoading && payload.onLoading();
        return message.error(`请求错误：${result.zh_message}`);
      }
        // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        payload.onLoading && payload.onLoading();
        yield put({ type: 'reduceContractTemplatesPreview', payload: result });
        return;
      }
      payload.onLoading && payload.onLoading();
    },
  },
  /**
   * @namespace system/contractTemplate/reducers
   */
  reducers: {
    /**
     * 合同模版列表
     * @return {object} 更新 contractTemplates
     * @memberof module:model/system/contractTemplate~system/contractTemplate/reducers
     */
    reduceContractTemplates(state, action) {
      return {
        ...state,
        contractTemplates: action.payload,
      };
    },
    /**
     * 组件详情
     * @return {object} 更新 componentDetails
     * @memberof module:model/system/contractTemplate~system/contractTemplate/reducers
     */
    reduceComponentDetails(state, action) {
      return {
        ...state,
        componentDetails: action.payload,
      };
    },

    /**
     * 合同模版预览
     * @return {object} 更新 templatesPreview
     * @memberof module:model/system/contractTemplate~system/contractTemplate/reducers
     */
    reduceContractTemplatesPreview(state, action) {
      return {
        ...state,
        templatesPreview: action.payload,
      };
    },
  },
};

