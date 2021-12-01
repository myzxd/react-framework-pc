/**
 * 采购入库明细
 * @module model/supply/procurement
 **/
import is from 'is_js';

import { fetchSupplyProcurement, materialUploadFile, materialDownloadTemplate, materialTemplateUpdatedDate } from '../../services/supply';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'supplyProcurement',
  /**
   * 状态树
   * @prop {object} supplyProcurementData    采购入库明细列表
   * @prop {string} templateDate 模板时间
   */
  state: {
    supplyProcurementData: {},
  },
  /**
   * @namespace supply/procurement/effects
   */
  effects: {
    /**
     * 获取科目列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @memberof module:model/supply/procurement~supply/procurement/effects
     */
    * fetchSupplyProcurement({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
       // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_spellings = payload.cities;
      }
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 根据商圈获取数据
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      const result = yield call(fetchSupplyProcurement, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceSupplyProcurement', payload: result });
      }
    },

    /**
     * 上传物资文件
     * @param {string}   type  上传的文件类别
     * @param {number}   storage 文件粗存模式
     * @param {string}   file    文件名
     * @memberof module:model/supply/procurement~supply/procurement/effects
     */
    * materialUploadFile({ payload = {} }, { put }) {
      const params = {
        storage_type: 3,         // 上传类型
      };

      // 上传文件的类别
      if (is.existy(payload.params.type)) {
        params.type = payload.params.type;
      }

      // 文件的存储模式
      // if (is.existy(payload.params.storage)) {
      //   params.storage_type = payload.params.storage;
      // }

      // 文件上传文件名
      if (is.existy(payload.params.file)) {
        params.file_key = payload.params.file;
      }
      const request = {
        params, // 接口参数
        service: materialUploadFile,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 模板下载
     * @param {string}   type  下载文件类别
     * @memberof module:model/supply/procurement~supply/procurement/effects
     */
    * materialDownloadTemplate({ payload = {} }, { put }) {
      const params = {};

      // 下载文件类别
      if (is.existy(payload.params.type)) {
        params.type = payload.params.type;
      }

      const request = {
        params, // 接口参数
        service: materialDownloadTemplate,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 模板更新的时间
     * @param {string}   type  下载文件类别
     * @memberof module:model/supply/procurement~supply/procurement/effects
     */
    * materialTemplateUpdatedDate({ payload = {} }, { call, put }) {
      const params = {};

      // 下载文件类别
      if (is.existy(payload.type)) {
        params.material_template_type = payload.type;
      }

      const result = yield call(materialTemplateUpdatedDate, params);
      yield put({ type: 'reduceTemplateUpdatedDate', payload: result });
    },
  },


  /**
   * @namespace supply/procurement/reducers
   */
  reducers: {
    /**
     * 采购入库明细列表
     * @returns {object} 更新 supplyProcurementData
     * @memberof module:model/supply/procurement~supply/procurement/reducers
     */
    reduceSupplyProcurement(state, action) {
      const supplyProcurementData = {
        // eslint-disable-next-line no-underscore-dangle
        meta: ResponseMeta.mapper(action.payload._meta),
        data: action.payload.data.map((v) => {
          const item = { ...v };
          // 判断物资相关内容是否存在
          if (is.not.existy(v.material_item_info) || is.empty(v.material_item_info)) {
            item.material_item_info = {};
          }
          return item;
        }),
      };
      return { ...state, supplyProcurementData };
    },
     /**
     * 模板更新时间数据
     * @returns {object} 更新 templateDate
     * @memberof module:model/supply/procurement~supply/procurement/reducers
     */
    reduceTemplateUpdatedDate(state, action) {
      const templateDate = action.payload.updated_at; // 获取最新更改的时间
      return { ...state, templateDate };
    },
  },
};
