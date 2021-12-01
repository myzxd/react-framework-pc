/**
 *  CODE - 记录明细
 * @module model/code/record
 */
import dot from 'dot-prop';
import moment from 'moment';
import { message } from 'antd';
import {
  getRecordList,
  getRecordDetail,
  onExportRecords,
  getCodeCostCenterTypeList,
  getTeamCostCenterTypeList,
} from '../../services/code/record';
import {
  getEnumeratedValue,
} from '../../services/common';
import {
  CodeApproveOrderCostState,
} from '../../application/define';

// 处理查询参数
const dealSeatchParameter = (payload) => {
  const {
    page = 1,
    limit = 30,
    reportType, // 提报类型
    subject, // 科目名称
    accountCenter, // 核算中心
    state, // 单据状态
    costOrderId, // 费用单号
    orderId, // 审批单号
    belongTime, // 归属周期
    reportAt, // 提报时间
    payAt, // 付款时间
    invoiceTitle, // 发票抬头
    applicant, // 申请人
    payStatus, // 付款状态
    billRedPushState, // 是否红冲
  } = payload;

  const params = {
    _meta: { page, limit },
    state: [
      CodeApproveOrderCostState.conduct,
      CodeApproveOrderCostState.complete,
      CodeApproveOrderCostState.close,
    ],
  };

  // 提报类型
  reportType && (params.cost_center_type = reportType);
  // 科目名称
  subject && Array.isArray(subject) && subject.length > 0 && (params.cost_accounting_id = subject.map((s) => {
    return s.split('=')[0];
  }));
  // 核算中心
  accountCenter && (params.cost_target_id = accountCenter);
  // 单据状态
  state && (params.state = [Number(state)]);
  // 费用单号
  costOrderId && (params._id = costOrderId);
  // 审批单号
  orderId && (params.oa_order_id = orderId);
  // 提报时间开始时间
  dot.has(reportAt, '0') && (
    params.submit_min_at = Number(moment(reportAt[0]).format('YYYYMMDD'))
  );
  // 提报时间结束时间
  dot.has(reportAt, '1') && (
    params.submit_max_at = Number(moment(reportAt[1]).format('YYYYMMDD'))
  );
  // 付款时间结束时间
  dot.has(payAt, '0') && (
    params.paid_min_at = Number(moment(payAt[1]).format('YYYYMMDD'))
  );
   // 付款时间结束时间
  dot.has(payAt, '1') && (
    params.paid_max_at = Number(moment(payAt[1]).format('YYYYMMDD'))
  );
  // 归属周期
  belongTime && (params.book_month = Number(moment(belongTime).format('YYYYMM')));

  // 发票抬头
  invoiceTitle && (params.invoice_title = invoiceTitle);
  // 申请人
  applicant && (params.apply_account_id = applicant);
  // 付款状态
  payStatus && (params.paid_state = [Number(payStatus)]);
  // 是否红冲
  billRedPushState && (params.bill_red_push_state = billRedPushState);

  return params;
};

// 处理枚举值
const dealEnumerateVal = (payload) => {
  const data = {};
  const dataKeys = Object.keys(payload);
  dataKeys.forEach((invoice) => {
    const curData = payload[invoice];
    if (curData) {
      const curDataKeys = Object.keys(curData);
      const curDataVals = Object.values(curData);
      data[invoice] = curDataKeys.map((i, key) => {
        return { name: curDataVals[key], value: Number(i) };
      });
    } else {
      data[invoice] = [];
    }
  });
  return data;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'codeRecord',

  /**
   * 状态树
   */
  state: {
    recordList: {}, // 记录明细列表
    recordDetail: {}, // 记录明细详情
    codeCostCenterTypeList: [], // code核算中心
    teamCostCenterTypeList: [], // team核算中心
    enumeratedValue: {}, // 枚举值
  },

  /**
   * @namespace code/record/effects
   */
  effects: {
    /**
     * 记录明细list
     * @memberof module:model/code/record~code/record/effects
     */
    *getRecordList({ payload }, { call, put }) {
      const { setLoading } = payload;
      const params = dealSeatchParameter(payload);
      const res = yield call(getRecordList, params);

      setLoading && setLoading();

      if (res && res.data) {
        yield put({ type: 'reduceRecordList', payload: res });
      }
    },

    /**
     * 重置记录明细list
     */
    *resetRecordList({ payload }, { put }) {
      yield put({ type: 'reduceRecordList', payload: {} });
    },

    /**
     * 获取记录明细详情
     */
    *getRecordDetail({ payload }, { call, put }) {
      const params = { _id: payload.recordId };
      const res = yield call(getRecordDetail, params);
      if (res) {
        yield put({ type: 'reduceRecordDetail', payload: res });
      }
    },

    /**
     * 重置记录明细detail
     */
    *resetRecordDetail({ payload }, { put }) {
      yield put({ type: 'reduceRecordDetail', payload: {} });
    },

    /**
     * 记录明细导出
     * @memberof module:model/code/record~code/record/effects
     */
    *onExportRecords({ payload }, { call }) {
      const params = dealSeatchParameter(payload);
      const res = yield call(onExportRecords, params);

      if (res && res.ok) {
        return message.success('请求成功');
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 获取code核算中心
     * @memberof module:model/code/record~code/record/effects
     */
    *getCodeCostCenterTypeList({ payload }, { call, put }) {
      const res = yield call(getCodeCostCenterTypeList, {});
      const { data = [] } = res;
      if (Array.isArray(data)) {
        yield put({ type: 'reduceCodeCostCenterTtypeList', payload: data });
      }
    },

    /**
     * 重置code核算中心list
     */
    *resetCodeCostCenterTypeList({ payload }, { put }) {
      yield put({ type: 'reduceCodeCostCenterTtypeList', payload: {} });
    },

    /**
     * 获取team核算中心
     * @memberof module:model/code/record~code/record/effects
     */
    *getTeamCostCenterTypeList({ payload }, { call, put }) {
      const res = yield call(getTeamCostCenterTypeList, {});
      const { data = [] } = res;
      if (Array.isArray(data)) {
        yield put({ type: 'reduceTeamCostCenterTtypeList', payload: data });
      }
    },

    /**
     * 重置team核算中心list
     */
    *resetTeamCostCenterTypeList({ payload }, { put }) {
      yield put({ type: 'reduceTeamCostCenterTtypeList', payload: {} });
    },

    /**
     * 获取枚举值
     */
    * getEnumeratedValue({ payload }, { call, put }) {
      const res = yield call(getEnumeratedValue, {});
      if (res) {
        yield put({ type: 'reduceEnumeratedValue', payload: res });
      }
    },

    /**
     * 重置枚举值
     */
    *resetEnumerateValue({ payload }, { put }) {
      yield put({ type: 'reduceEnumeratedValue', payload: {} });
    },
  },

  /**
   * @namespace code/record/reducers
   */
  reducers: {
    /**
     * 更新记录明细list
     * @returns {object} 更新 recordList
     * @memberof module:model/code/record~code/record/reducers
     */
    reduceRecordList(state, action) {
      let recordList = {};
      if (action.payload) {
        recordList = action.payload;
      }
      return { ...state, recordList };
    },

    /**
     * 更新记录明细detail
     * @returns {object} 更新 recordDetail
     * @memberof module:model/code/record~code/record/reducers
     */
    reduceRecordDetail(state, action) {
      let recordDetail = {};
      if (action.payload) {
        recordDetail = action.payload;
      }
      return { ...state, recordDetail };
    },

    /**
     * 更新code核算中心list
     * @returns {object} 更新 codeCostCenterTypeList
     * @memberof module:model/code/record~code/record/reducers
     */
    reduceCodeCostCenterTtypeList(state, action) {
      let codeCostCenterTypeList = [];
      if (action.payload) {
        codeCostCenterTypeList = action.payload;
      }
      return { ...state, codeCostCenterTypeList };
    },

    /**
     * 更新team核算中心list
     * @returns {object} 更新 teamCostCenterTypeList
     * @memberof module:model/code/record~code/record/reducers
     */
    reduceTeamCostCenterTtypeList(state, action) {
      let teamCostCenterTypeList = [];
      if (action.payload) {
        teamCostCenterTypeList = action.payload;
      }
      return { ...state, teamCostCenterTypeList };
    },

    /**
     * 更新枚举值
     */
    reduceEnumeratedValue(state, action) {
      let enumeratedValue = {};
      if (action.payload) {
        enumeratedValue = dealEnumerateVal(action.payload);
      }
      return { ...state, enumeratedValue };
    },
  },
};
