/**
 *  验票标签 models/expense/ticketTag
 */
import { message } from 'antd';

import {
  getTicketTags,
  createTicketTag,
  deleteTicketTag,
  checketTicket,
  setOrderTicket,
  setAbnormalTicket,
  setOrderRedPunch,
  addOrderInvoice,
  deleteOrderInvoice,
  getOrderInvoiceList,
  getTicketCheck,
  setBillRedPunch,
} from '../../services/expense/ticket';
import { ExpenseTicketTagState, Unit } from '../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'ticketTag',

  /**
   * 状态树
   * @prop {object}
   */
  state: {
    ticketTags: {}, // 验票标签列表
    invoiceList: {}, // 费用单发票列表
  },

  /**
   * @namespace expense/subject/effects
   */
  effects: {
    /**
     * 获取验票标签列表
     * @param {name} 标签名称
     * @memberof module:model/expense/ticketTag/effects
     */
    *getTicketTags({ payload = {} }, { call, put }) {
      const { name, limit = 30, page = 1, state } = payload;
      const params = {
        _meta: { page, limit },
        state: ExpenseTicketTagState.normal,
      };

      name && (params.name = name);
      state && (params.state = state);

      const result = yield call(getTicketTags, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceTicketTags', payload: result });
      }
    },

    /**
     * 新增标签
     *  @param {string} name 标签名称
     *  @param {string} remarks 备注
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *createTicketTag({ payload = {} }, { call }) {
      const { name = undefined, remarks = undefined } = payload;
      const params = { type: 10 };

      name && (params.name = name);
      remarks && (params.note = remarks);

      const res = yield call(createTicketTag, params);

      return res;
    },

     /**
     * 删除标签
     * @param {string} id 标签id
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *deleteTicketTag({ payload = {} }, { call }) {
      const { id } = payload;
      if (!id) return message('缺少标签id');
      const params = { _id: id };

      const res = yield call(deleteTicketTag, params);
      return res;
    },

    /**
     * 删除发票
     * @param {string} id 标签id
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *deleteOrderInvoice({ payload = {} }, { call }) {
      const { id, orderId, examineId } = payload;
      if (!id) return message('缺少标签id');
      if (!orderId) return message('缺少费用单id');

      const params = { _id: id, cost_order_id: orderId, order_id: examineId };

      const res = yield call(deleteOrderInvoice, params);
      return res;
    },

    /**
     * 完成验票
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *checketTicket({ payload = {} }, { call }) {
      const { note = undefined, id } = payload;
      if (!id) return message.error('缺少审批单id');
      const params = { _id: id };

      note && (params.note = note);

      const res = yield call(checketTicket, params);

      return res;
    },

    /**
     * 验票异常
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *setAbnormalTicket({ payload = {} }, { call }) {
      const { note = undefined, orderId = undefined, orderRecordId } = payload;
      const params = {};

      note && (params.note = note);
      orderId && (params._id = orderId);
      orderRecordId && (params.flow_record_id = orderRecordId);

      const res = yield call(setAbnormalTicket, params);

      return res;
    },

    /**
     * 费用单打验票标签
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *setOrderTicket({ payload = {} }, { call }) {
      const { tags = undefined, orderId, orderRecordId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      if (!orderRecordId) return message.error('缺少流转记录id');

      const params = {};

      tags && (params.oa_label_ids = tags);
      orderId && (params._id = orderId);
      orderRecordId && (params.flow_record_id = orderRecordId);

      const res = yield call(setOrderTicket, params);

      return res;
    },

    /**
     * 费用单红冲
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *setOrderRedPunch({ payload = {} }, { call }) {
      const { id = undefined } = payload;

      const params = {};

      id && (params._id = id);

      const res = yield call(setOrderRedPunch, params);

      return res;
    },

    /**
     * 费用单添加发票
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *addOrderInvoice({ payload = {} }, { call }) {
      const {
        id = undefined,
        type,
        code,
        money,
        taxRate,
        tax,
        noTax,
        examineId = undefined,
      } = payload;

      const params = {};

      id && (params.cost_order_id = id);
      examineId && (params.order_id = examineId);
      code && (params.code = code);
      type && (params.type = type);
      money && (params.money = Unit.exchangePriceToCent(Number(money)));
      taxRate && (params.tax_rate = taxRate);
      tax && (params.tax_amount = Unit.exchangePriceToCent(Number(tax)));
      noTax && (params.tax_deduction = Unit.exchangePriceToCent(Number(noTax)));

      const res = yield call(addOrderInvoice, params);

      return res;
    },

    /**
     * 获取费用单发票列表
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *getOrderInvoiceList({ payload = {} }, { call, put }) {
      const { id = undefined } = payload;

      const params = {};

      id && (params.cost_order_id = id);

      const res = yield call(getOrderInvoiceList, params);

      // 判断数据是否为空
      if (res && res.data) {
        yield put({ type: 'reduceOrderInvoice', payload: res });
      }
    },

    /**
     * 获取费用单验票校验
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *getTicketCheck({ payload = {} }, { call }) {
      const { id = undefined } = payload;
      if (!id) return message.error('缺少审批单id');

      const params = { _id: id };

      const res = yield call(getTicketCheck, params);
      return res;
    },

    /**
     * 红冲（分摊）
     * @param {string} note 说明
     * @memberof module:model/expense/ticketTag~expense/ticketTag/effects
     */
    *setBillRedPunch({ payload = {} }, { call }) {
      const { id = undefined, records = [], costAccountingId, examineId = undefined } = payload;
      if (!id) return message.error('缺少费用单id');

      // 转换字段
      const convert = records.length > 0 ? records.map((i) => {
        const {
          platform,
          supplier,
          city,
          district,
          teamType,
          teamId,
          staffId,
          teamCode,
          teamName,
          profileId,
        } = i;
        const record = { cost_group_id: costAccountingId };
        platform && (record.platform_code = platform);
        supplier && (record.supplier_id = supplier);
        city && (record.city_code = city);
        district && (record.biz_district_id = district);
        teamType && (record.team_type = teamType);
        teamId && (record.team_id = teamId);
        staffId && (record.identity_card_id = staffId);
        profileId && (record.profile_id = profileId);
        teamCode && (record.team_id_code = teamCode);
        teamName && (record.team_name = teamName);
        return record;
      }) : undefined;

      const params = { cost_order_id: id };
      examineId && (params.order_id = examineId);
      convert && (params.records = convert);

      const res = yield call(setBillRedPunch, params);
      return res;
    },
  },
  /**
   * @namespace expense/subject/reducers
   */
  reducers: {
    /**
     * 更新标签列表
     * @returns {object} 更新 reduceTicketTags
     * @memberof module:model/expense/ticketTags/reducers
     */
    reduceTicketTags(state, action) {
      let ticketTags = {};
      if (action && action.payload) {
        ticketTags = action.payload;
      }
      return { ...state, ticketTags };
    },

    /**
     * 更新费用单发票列表
     * @returns {object} 更新 reduceOrderInvoice
     * @memberof module:model/expense/ticketTags/reducers
     */
    reduceOrderInvoice(state, action) {
      let invoiceList = {};
      if (action && action.payload) {
        invoiceList = action.payload;
      }
      return { ...state, invoiceList };
    },
  },
};
