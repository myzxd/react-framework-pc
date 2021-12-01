/**
 * 扣款汇总
 * @module model/supply/deductions
 **/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchSupplyDeductSummarizeList,
  fetchDeductSummarizeExport,
  fetchDeductSummarizeDetail,
} from '../../services/supply';
import { RequestMeta, ResponseMeta } from '../../application/object/';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'supplyDeductSummarize',

  /**
   * 状态树
   * @prop {object} deductSummarizeList    扣款汇总列表
   * @prop {object} deductSummarizeDetail   扣款汇总详情
   */
  state: {
    deductSummarizeList: {},
    deductSummarizeDetail: {},
  },

  /**
   * @namespace supply/deductSummarize/effects
   */
  effects: {
    /**
     * 获取扣款汇总列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {string}  belongTime  归属时间
     * @memberof module:model/supply/deductSummarize~supply/deductSummarize/effects
     */
    * fetchSupplyDeductSummarizeList({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_spellings = payload.cities;
      }
      // 根据商圈获取数据
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      // 物资分类
      if (is.existy(payload.supplyClass) && is.not.empty(payload.supplyClass)) {
        params.group = payload.supplyClass;
      }
      // 归属时间
      if (is.existy(payload.belongTime)) {
        params.belong_time = Number(payload.belongTime);
      }

      const result = yield call(fetchSupplyDeductSummarizeList, params);

      if (is.existy(result.data)) {
        yield put({ type: 'reduceDeductSummarizeList', payload: result });
      }
    },

    /**
     *  扣款汇总详情
     * @param {id}  id      id
     */
    * fetchDeductSummarizeDetail({ payload = {} }, { call, put }) {
      // 判断id是否存在
      if (is.not.existy(payload.id) && is.empty(payload.id)) {
        return message.error('获取汇总单详情错误，汇总单id不能为空');
      }

      const {
        page = 1,
        limit = 30,
      } = payload;

      const params = {
        book_summary_total_id: payload.id,
      };

      const result = yield call(fetchDeductSummarizeDetail, params);

      if (is.existy(result)) {
        // 页码、条数
        result.page = page;
        result.limit = limit;
        yield put({ type: 'reduceDeductSummarizeDetail', payload: result });
      }
    },

    /**
     * 扣款汇总导出
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {string}  belongTime  归属时间
     */
    * fetchDeductSummarizeExport({ payload = {} }, { put }) {
      // 查询参数
      const {
        platforms,
        suppliers,
        cities,
        districts,
        belongTime,
        supplyClass,
      } = payload.params;

      // 需要传入的参数
      const params = {};

      // 根据平台获取数据
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_codes = platforms;
      }
      // 根据供应商获取数据
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_ids = suppliers;
      }
      // 根据城市获取数据
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_spellings = cities;
      }
      // 根据商圈获取数据
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_ids = districts;
      }
      // 归属时间
      if (is.existy(belongTime) && is.not.empty(belongTime)) {
        params.belong_time = Number(belongTime);
      }
      // 归属时间
      if (is.existy(supplyClass) && is.not.empty(supplyClass)) {
        params.group = supplyClass;
      }

      const request = {
        params,     // 接口参数
        service: fetchDeductSummarizeExport,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
  },

  /**
   * @namespace supply/deductSummarize/reducers
   */
  reducers: {
    /**
     * 更新扣款汇总列表
     * @returns {object} 更新 deductSummarizeList
     * @memberof module:model/supply/deductSummarize~supply/deductSummarize/reducers
     */
    reduceDeductSummarizeList(state, action) {
      const deductSummarizeList = {
        // eslint-disable-next-line no-underscore-dangle
        meta: ResponseMeta.mapper(action.payload._meta),
        data: action.payload.data.map((v) => {
          const item = { ...v };
          // 判断物资相关内容是否存在
          if (is.not.existy(v.material_item_info) || is.empty(v.material_item_info)) {
            item.material_item_info = {};
          }
          // 判断人员相关内容是否存在
          if (is.not.existy(v.staff_info) || is.empty(v.staff_info)) {
            item.staff_info = {};
          }
          return item;
        }),
      };
      return { ...state, deductSummarizeList };
    },

    /**
     * 更新扣款汇总详情
     * @returns {object} 更新 deductSummarizeDetail
     * @memberof module:model/supply/deductSummarize~supply/deductSummarize/reducers
     */
    reduceDeductSummarizeDetail(state, action) {
      let deductSummarizeDetail = {};

      // 判断数据存在
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        // 获取参数
        const { page, limit, deduction_order_list: deductionOrderList } = action.payload;

        // 扣款明细列表存在
        if (is.existy(deductionOrderList)) {
         // 处理数据
          const data = new Array(Math.ceil(deductionOrderList.length / limit));

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < data.length; i++) {
            data[i] = [];
          }

          // 根据所传页码、条数，重置数据
          deductionOrderList.forEach((item, index) => {
            // eslint-disable-next-line radix
            data[parseInt((index / limit))][index % limit] = item;
          });

          // 详情
          deductSummarizeDetail = action.payload;

          // 总条数
          deductSummarizeDetail.total_count = deductionOrderList.length;

          // 分页数据
          deductSummarizeDetail.deduction_order_list = data[page - 1];
        } else {
          // 详情
          deductSummarizeDetail = action.payload;

          // 总条数
          deductSummarizeDetail.total_count = 0;
        }
      }
      return { ...state, deductSummarizeDetail };
    },
  },
};
