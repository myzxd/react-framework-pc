/**
 * 趣活钱包
 * @module model/wallet
 */
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  getWalletSummary,
  getWalletBills,
  getWalletBillDetail,
  onPayBill,
  onExportBills,
  getWalletDetails,
  onExportWalletDetails,
  onVoidBill,
} from '../services/wallet';
import {
  WalletDetailType,
} from '../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'wallet',

  /**
   * 状态树
   */
  state: {
    walletSummary: {}, // 钱包汇总
    walletBills: {}, // 支付账单list
    walletBillDetail: {}, // 支付账单详情
    walletDetails: {}, // 钱包明细list
    walletDetailsInvoice: [], // 发票抬头
  },

  /**
   * @namespace wallet/effects
   */
  effects: {
    /**
     * 钱包汇总
     * @memberof module:model/wallet~wallet/effects
     */
    *getWalletSummary({ payload }, { call, put }) {
      const result = yield call(getWalletSummary, {});
      if (result) {
        yield put({ type: 'reduceWalletSummary', payload: result });
      }
    },

    /**
     * 重置钱包汇总
     * @memberof module:model/wallet~wallet/effects
     */
    *resetWalletSummary({ payload }, { put }) {
      yield put({ type: 'reduceWalletSummary', payload: {} });
    },

    /**
     * 支付账单list
     * @memberof module:model/wallet~wallet/effects
     */
    *getWalletBills({ payload }, { call, put }) {
      const { page = 1, limit = 30, type, informant, state } = payload;
      const params = {
        _meta: { page, limit },
      };

      // 类型
      type && (params.type = Number(type));
      // 状态
      state && (params.state = [Number(state)]);
      // 提报人
      informant && (params.apply_account_name = informant);

      const result = yield call(getWalletBills, params);
      if (result.zh_message) {
        // loading关闭
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
      if (result) {
        yield put({ type: 'reduceWalletBills', payload: result });
        // loading关闭
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
    },

    /**
     * 重置趣活钱包-支付账单list
     */
    *resetWalletBills({ payload }, { put }) {
      yield put({ type: 'reduceWalletBills', payload: {} });
    },

    /**
     * 支付账单detail
     * @memberof module:model/wallet~wallet/effects
     */
    * getWalletBillDetail({ payload }, { call, put }) {
      const { id } = payload;
      if (!id) return message.error('缺少账单id');

      const params = { _id: id };

      const result = yield call(getWalletBillDetail, params);

      if (result) {
        yield put({ type: 'reduceWalletBillDetail', payload: result });
      }
    },

    /**
     * 重置支付账单detail
     * @memberof module:model/wallet~wallet/effects
     */
    * resetWalletBillDetail({ payload }, { put }) {
      yield put({ type: 'reduceWalletBillDetail', payload: {} });
    },

    /**
     * 支付账单
     * @memberof module:model/wallet~wallet/effects
     */
    *onPayBill({ payload }, { call }) {
      const { billIds = [], billDetailIds = [] } = payload;
      // if (billIds.length < 1 || billDetailIds.length < 1) return message.error('缺少账单id');

      const params = {};
      // 账单ids
      billIds.length > 0 && (params.oa_payment_bill_ids = billIds);
      // 账单明细ids
      billDetailIds.length > 0 && (params.oa_payment_bill_detail_ids = billDetailIds);

      const res = yield call(onPayBill, params);

      if (res && res.ok) {
        return res;
      } else {
        return false;
      }
    },

    /**
     * 支付账单 - 导出报表
     * @memberof module:model/wallet~wallet/effects
     */
    * onExportBills({ payload }, { call }) {
      const { page = 1, limit = 30, type, informant, state } = payload;
      const params = { _meta: { page, limit } };

      // 类型
      type && (params.type = type);
      // 状态
      state && (params.state = [Number(state)]);
      // 提报人
      informant && (params.apply_account_name = informant);

      const res = yield call(onExportBills, params);

      if (res && res._id) {
        return message.success('请求成功');
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 钱包明细list
     * @memberof module:model/wallet~wallet/effects
     */
    * getWalletDetails({ payload }, { call, put }) {
      const { page = 1, limit = 30, name, invoice, time, type, isGetInvoice } = payload;
      const params = {
        _meta: { page, limit },
        is_auth: true,
      };

      // 姓名
      name && (params.name = name);
      // type不为数组
      if (!Array.isArray(type)) {
        // 全部类型时，type为【10， 30】重置，提现
        Number(type) === WalletDetailType.all && (params.type = [WalletDetailType.recharge, WalletDetailType.withdraw]);
        // 重置或提现
        Number(type) !== WalletDetailType.all && (params.type = [Number(type)]);
      }

      // 状态
      Array.isArray(type) && type.length > 0 && (params.type = type);

      // 发票抬头
      invoice && (params.invoice_title = invoice);
      // 交易完成时间
      time &&
        (params.start_at = Number(moment(time[0]).format('YYYYMMDD')))
        && (params.end_at = Number(moment(time[1]).format('YYYYMMDD')));

      const res = yield call(getWalletDetails, params);

      if (res) {
        yield put({ type: 'reduceWalletDetails', payload: { ...res, isGetInvoice } });
      }
    },

    /**
     * 重置趣活钱包-钱包明细
     */
    *resetWalletDetails({ payload }, { put }) {
      yield put({ type: 'reduceWalletDetails', payload: {} });
    },

    /**
     * 钱包明细 - 发票抬头
     * @memberof module:model/wallet~wallet/effects
     */
    * getWalletDetailsInvoice({ payload }, { call, put }) {
      const params = {
        _meta: { page: 1, limit: 9999 },
        is_auth: true,
        type: [WalletDetailType.recharge, WalletDetailType.withdraw],
      };

      const res = yield call(getWalletDetails, params);

      if (res) {
        yield put({ type: 'reduceWalletDetailsInvoice', payload: res });
      }
    },

    /**
     * 重置趣活钱包-钱包明细-发票抬头
     */
    *resetWalletDetailsInvoice({ payload }, { put }) {
      yield put({ type: 'reduceWalletDetailsInvoice', payload: {} });
    },

    /**
     * 钱包明细 - 导出报表
     * @memberof module:model/wallet~wallet/effects
     */
    * onExportWalletDetails({ payload }, { call }) {
      const { page = 1, limit = 30, name, invoice, time, type } = payload;
      const params = { _meta: { page, limit } };

      // 姓名
      name && (params.name = name);
      // 全部类型时，type为【10， 30】重置，提现
      Number(type) === WalletDetailType.all && (params.type = [WalletDetailType.recharge, WalletDetailType.withdraw]);
      // 重置或提现
      Number(type) !== WalletDetailType.all && (params.type = [Number(type)]);

      // 发票抬头
      invoice && (params.invoice_title = invoice);
      // 交易完成时间
      time &&
        (params.start_at = Number(moment(time[0]).format('YYYYMMDD')))
        && (params.end_at = Number(moment(time[1]).format('YYYYMMDD')));

      const res = yield call(onExportWalletDetails, params);

      if (res && res._id) {
        return message.success('请求成功');
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 账单 - 账单作废
     * @memberof module:model/wallet~wallet/effects
     */
    *onVoidBill({ payload }, { call }) {
      const { billId, state } = payload;
      const params = { _id: billId, state };

      const res = yield call(onVoidBill, params);
      return res;
    },
  },

  /**
   * @namespace wallet/reducers
   */
  reducers: {
    /**
     * 钱包汇总
     * @returns {object} 更新 walletSummary
     * @memberof module:model/wallet~wallet/reducers
     */
    reduceWalletSummary(state, action) {
      let walletSummary = {};
      if (action.payload) {
        walletSummary = action.payload;
      }
      return { ...state, walletSummary };
    },

    /**
     * 支付账单list
     * @returns {object} 更新 walletBills
     * @memberof module:model/wallet~wallet/reducers
     */
    reduceWalletBills(state, action) {
      let walletBills = {};
      if (action.payload) {
        walletBills = action.payload;
      }
      return { ...state, walletBills };
    },

    /**
     * 支付账单detail
     * @returns {object} 更新 walletBillDetail
     * @memberof module:model/wallet~wallet/reducers
     */
    reduceWalletBillDetail(state, action) {
      let walletBillDetail = {};
      if (action.payload) {
        walletBillDetail = action.payload;
      }
      return { ...state, walletBillDetail };
    },

    /**
     * 钱包明细list
     * @returns {object} 更新 walletDetails
     * @memberof module:model/wallet~wallet/reducers
     */
    reduceWalletDetails(state, action) {
      let walletDetails = {};
      if (action.payload) {
        walletDetails = action.payload;
      }
      return { ...state, walletDetails };
    },

    /**
     * 钱包明细 - 发票抬头
     * @returns {object} 更新 walletDetailsInvoice
     * @memberof module:model/wallet~wallet/reducers
     */
    reduceWalletDetailsInvoice(state, action) {
      let walletDetailsInvoice = [];
      if (action.payload) {
        const { data = [] } = action.payload;
        walletDetailsInvoice = _.uniqWith(data.filter(d => d.invoice_title).map(d => d.invoice_title), _.isEqual);
      }
      return { ...state, walletDetailsInvoice };
    },
  },
};
