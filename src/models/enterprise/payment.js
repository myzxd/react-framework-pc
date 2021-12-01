/**
 * 付款单相关model
 * @module model/enterprise/payment
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';
import moment from 'moment';

import {
  fetchPaymentList,
  fetchPaymentDetail,
  fetchPaymentDetailList,
  fetchPaymentDownloadTemplate,
  fetchPaymentApprove,
  createPayment,
  fetchEmployees,
  fetchEmployeListUpload,
} from '../../services/enterprise';
import { Unit } from '../../application/define';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'enterprisePayment',
  /**
   * 状态树
   * @prop {object} paymentList 企业付款列表信息
   * @prop {object} paymentDetail 付款单详情
   * @prop {object} paymentDetailList 付款单详情页明细列表
   * @prop {object} employees 人员列表
   * @prop {object} employeList 付款单明细上传数据列表
   */
  state: {
    paymentList: {}, // 企业付款列表信息
    paymentDetail: {}, // 付款单详情
    paymentApprove: {}, // 确认付款单详情
    paymentDetailList: {}, // 付款单详情页明细列表
    employees: {}, // 人员列表
  },

  /**
   * @namespace enterprise/payment/effects
   */
  effects: {
    /**
     * 付款单列表
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    * fetchPaymentList({ payload }, { call, put }) {
      const params = {
        start_date: moment().subtract(1, 'years').format('YYYYMMDD'), // 提交时间(开始)
        end_date: moment().format('YYYYMMDD'), // 提交时间(结束)
        _meta: RequestMeta.mapper(payload),
      };
      // 提交时间(开始)
      if (is.existy(payload.start_date) && is.not.empty(payload.start_date)) {
        params.start_date = payload.start_date;
      }
      // 提交时间(结束)
      if (is.existy(payload.end_date) && is.not.empty(payload.end_date)) {
        params.end_date = payload.end_date;
      }

      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Number(payload.state);
      }
      const result = yield call(fetchPaymentList, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reducePaymentList', payload: result });
      }
    },

    /**
     * 付款单详情  / 确认执行付款单明细
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
    */
    * fetchPaymentDetail({ payload }, { call, put }) {
      const params = {};
      // 付款单id
      if (is.existy(payload.order_id) && is.not.empty(payload.order_id)) {
        params.order_id = payload.order_id;
      }
      const result = yield call(fetchPaymentDetail, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reducePaymentDetail', payload: result });
      }
    },
    /**
     * 付款单详情明细列表  / 确认执行付款单明细列表
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    * fetchPaymentDetailList({ payload }, { call, put }) {
      const params = {};
      // 页码，条数
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 付款单id
      if (is.existy(payload.order_id) && is.not.empty(payload.order_id)) {
        params.order_id = payload.order_id;
      }
      const result = yield call(fetchPaymentDetailList, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reducePaymentDetailList', payload: result });
      }
    },

    /**
     * 人员筛选
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    *fetchEmployees({ payload }, { call, put }) {
      // 公共文本参数
      const {
        page,
        limit,
        name,                        // 姓名
        state,                       // 状态
        onSuccessCallback,           // 请求成功回调
      } = payload;
      if (is.not.existy(name) || is.empty(name)) {
        return message.error('请输入姓名');
      }
      if (is.not.existy(state) || is.empty(state)) {
        return message.error('操作失败，缺少状态值');
      }
      // 默认参数
      const params = {
        _meta: RequestMeta.mapper({ page: page || 1, limit: limit || 30 }),
        name,
        state,
      };

      // 请求服务器
      const result = yield call(fetchEmployees, params);

      // 判断数据是否为空
      if (is.existy(result.data)) {
        if (onSuccessCallback) {
          onSuccessCallback(result.data);
        }
        const namespace = payload.namespace ? payload.namespace : 'default'; // 命名空间
        yield put({ type: 'reduceEmployees', payload: { result, namespace } });
      }
    },

    /**
     * 付款单明细上传
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    * fetchEmployeListUpload({ payload }, { call }) {
      // file_key
      if (is.not.existy(payload.fileKey) || is.empty(payload.fileKey)) {
        return message.error('操作失败，file_key不能为空');
      }
      const params = {
        file_key: payload.fileKey,
        storage_type: 3,         // 上传类型
      };
      const result = yield call(fetchEmployeListUpload, params);
      // 报错信息
      if (result.ok === false) {
        // 失败的回调
        if (payload.onErrorCallBack) {
          payload.onErrorCallBack();
        }
        return message.error('导入的excel有错误信息，请去任务列表里进行查看');
      }
      // 报错信息
      if (result.zh_message) {
        // 失败的回调
        if (payload.onErrorCallBack) {
          payload.onErrorCallBack();
        }
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        if (payload.onSuccessCallBack) {
          payload.onSuccessCallBack(result.result);
        }
      }
    },
    /**
     * 下载模版
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    * fetchPaymentDownloadTemplate({ payload }, { call }) {
      const params = {};
      const result = yield call(fetchPaymentDownloadTemplate, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        message.success('请求成功');
      }
    },

    /**
     * 创建付款单
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    * createPayment({ payload }, { call }) {
      // 总计金额
      if (is.not.existy(payload.totalMoney) || is.empty(payload.totalMoney)) {
        return message.error('操作失败，总计金额不能为空');
      }
      // 备注
      if (is.not.existy(payload.note) || is.empty(payload.note)) {
        return message.error('操作失败，备注不能为空');
      }
      // 明细信息
      if (is.not.existy(payload.detailArray) || is.empty(payload.detailArray)) {
        return message.error('操作失败，明细信息不能为空');
      }
      const params = {
        total_money: Unit.exchangePriceToCent(payload.totalMoney), // 总计金额换算成分
        note: payload.note, // 备注
        storage_type: 3,         // 上传类型
        lines: payload.detailArray.map((v) => {
          return {
            owner_id: v.owner_id, // 人员id
            temp_id: v.temp_id || null, // 临时信息id
            money: Unit.exchangePriceToCent(v.money), // 金额换算成分
          };
        }),
      };

      const result = yield call(createPayment, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      //  请求成功
      if (result.ok) {
        message.success('请求成功');
        window.location.href = `#/Enterprise/Payment/Detail?id=${result.record._id}`;
      }
    },
    /**
     * 确认执行付款单
     * @memberof module:model/enterprise/payment~enterprise/payment/effects
     */
    * fetchPaymentApprove({ payload }, { call }) {
      const params = {};
      // 付款单id
      if (is.existy(payload.order_id) && is.not.empty(payload.order_id)) {
        params.order_id = payload.order_id;
      }
      const result = yield call(fetchPaymentApprove, params);
      // 判断数据是否为空
      if (result.ok) {
        window.location.href = '#/Enterprise/Payment';
      }
    },
  },

  /**
   * @namespace enterprise/payment/reducers
   */
  reducers: {
    /**
     * 付款单列表
     * @returns {object} 更新 paymentList
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reducePaymentList(state, action) {
      return {
        ...state,
        paymentList: action.payload,
      };
    },
    /**
     * 付款单详情
     * @returns {object} 更新 paymentDetail
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reducePaymentDetail(state, action) {
      return {
        ...state,
        paymentDetail: action.payload,
      };
    },
    /**
     * 付款单详情页明细列表
     * @returns {object} 更新 paymentDetailList
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reducePaymentDetailList(state, action) {
      return {
        ...state,
        paymentDetailList: action.payload,
      };
    },

    /**
     * 获取人员列表
     * @returns {object} 更新 employees
     * @memberof module:model/enterprise/payment~enterprise/payment/reducers
     */
    reduceEmployees(state, action) {
      const { result, namespace } = action.payload;
      const employees = { ...state.employees };
      employees[namespace] = result;
      return {
        ...state,
        employees,
      };
    },

  },
}
;
