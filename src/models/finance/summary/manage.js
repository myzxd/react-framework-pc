/**
 * salary Model // TODO: @韩健 命名有问题
 *
 * @module model/financeSummaryManage
 */
import is from 'is_js';
import dot from 'dot-prop';
import { message } from 'antd';

import {
  fetchSalaryStatement,
  submitSalaryStatement,
  downloadSalaryStatement,
  updateSalaryMarkState,
  fetchSalaryCityStatement,
  fetchSalaryKnightStatement,
  fetchSalaryCityStatementInfo,
  fetchDownLoadSalaryStatementModal,
  fetchUploadSalaryExcel,
  fetchDownloadOperatingModal,
  fetchUploadOperatingExcel,
  fetchSalarySubmitAudit,
} from '../../../services/salary';

import { SalarySummaryState, SalaryPaymentState } from '../../../application/define';
import { RequestMeta } from '../../../application/object/';

const noop = () => {};

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'financeSummaryManage',
  /**
   * 状态树
   * @prop {object} salarySummary 结算汇总列表
   * @prop {object} salaryRecords 结算记录查询列表
   * @prop {object} salaryRecordsInfo 结算记录查询汇总信息
   * @prop {object} salaryDetail 结算明细store
   * @prop {object} auditInfo   提审信息
   */
  state: {
    // 结算汇总列表
    salarySummary: {},

    // 结算记录查询列表
    salaryRecords: {},

    // 结算记录查询汇总信息
    salaryRecordsInfo: {},

    // 结算明细store
    salaryDetail: {},

    // 提神信息
    auditInfo: {},
  },

  /**
   * @namespace financeSummaryManage/subscriptions
   */
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const { pathname, query } = history.location;
        switch (pathname) {
          // 服务费查询
          case '/Finance/Manage/Summary/Detail/City':
            {
              dispatch({ type: 'fetchSalaryCityStatement', payload: { recordId: query.id } });
              dispatch({ type: 'fetchSalaryCityStatementInfo', payload: { recordId: query.id } });
              break;
            }

          // 服务费详情页面，监听页面参数
          case '/Finance/Manage/Summary/Detail/Knight':
            dispatch({ type: 'fetchSalaryKnightStatement', payload: { id: query.id } });
            break;
          default:
            noop();
        }
      });
    },
  },

  /**
   * @namespace financeSummaryManage/effects
   */
  effects: {
    // NOTE: ------- 结算汇总页面 -----------
    /**
     * 获取结算单汇总数据
     * @param {object} _meta 分页格式
     * @param {array} platform_code 平台code
     * @param {array} supplier_id 供应商id
     * @param {array} city_code 城市查询
     * @param {array} state 审核状态
     * @param {number} work_type 工作性质
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchSalaryStatement({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 平台code
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 供应商id
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 城市查询
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_code = payload.cities;
      }
      // 审核状态
      if (is.existy(payload.verifyState) && is.not.empty(payload.verifyState)) {
        params.state = payload.verifyState.map(item => Number(item));
      }
      // 工作性质
      if (is.existy(payload.workType) && is.not.empty(payload.workType)) {
        params.work_type = Number(payload.workType);
      }
      // 结算周期
      if (is.existy(payload.cycle) && is.not.empty(payload.cycle)) {
        params.cycle = Number(payload.cycle);
      }
      const result = yield call(fetchSalaryStatement, params);

      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceSalarySummary', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    /**
     * 提交审核结算单
     * @param {object} ids id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *submitSalaryStatement({ payload }, { call, put }) {
      if (is.not.existy(payload.ids) || is.empty(payload.ids)) {
        return message.error('操作失败，请选择结算单');
      }
      const params = {
        ids: [payload.ids],
      };
      if (is.not.empty(payload.accountId) && is.existy(payload.accountId)) {
        params.next_node_account_id = payload.accountId;
      }
      if (is.not.empty(payload.postId) && is.existy(payload.postId)) {
        params.next_node_post_id = payload.postId;
      }
      const result = yield call(submitSalaryStatement, params);
      params.state = SalarySummaryState.processing;
      if (result && is.truthy(result.ok)) {
        message.success('操作成功');
        // 成功回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
        // 刷新列表
        yield put({ type: 'reduceSalarySummaryState', payload: params });
      } else {
        message.error(result.zh_message);
      }
    },

    // NOTE: ------- 服务费查询页面 -----------
    /**
     * 获取城市结算单列表
     * @param {array} salary_statement_id 平台code
     * @param {number} page 供应商id
     * @param {number} limit 城市查询
     * @param {string} task_flag 审核状态
     * @param {array} work_type work_type
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchSalaryCityStatement({ payload }, { call, put }) {
      // 结算汇总记录id
      if (is.not.existy(payload.recordId) || is.empty(payload.recordId)) {
        return message.error('操作失败，请选择结算单');
      }

      const params = {
        payroll_statement_id: payload.recordId,
        _meta: RequestMeta.mapper(payload),
      };

      // 判断是否是任务数据
      if (is.existy(payload.isTask) && is.not.empty(payload.isTask)) {
        params.task_flag = payload.isTask === '1';
      }

      // 商圈id
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_id = payload.districts;
      }

      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }

      // 服务费发放状态
      if (is.existy(payload.paymentState) && is.not.empty(payload.paymentState)) {
        params.pay_salary_state = payload.paymentState.map(item => Number(item));
      }

      // 骑士类型ids
      if (is.existy(payload.knightType) && is.not.empty(payload.knightType)) {
        params.knight_type_ids = payload.knightType;
      }
      const result = yield call(fetchSalaryCityStatement, params);

      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceSalaryRecords', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    /**
     * 获取城市结算单列表, 汇总信息
     * @param {string} _id 结算汇总记录id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchSalaryCityStatementInfo({ payload }, { call, put }) {
      // 结算汇总记录id
      if (is.not.existy(payload.recordId) || is.empty(payload.recordId)) {
        return message.error('操作失败，请选择结算单');
      }

      const params = {
        _id: payload.recordId,
      };

      const result = yield call(fetchSalaryCityStatementInfo, params);
      if (result) {
        yield put({ type: 'reduceSalaryRecordsInfo', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    /**
     * 服务费缓发
     * @param {array} ids 结算单ids
     * @param {number} pay_salary_state 状态
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *updateSalaryMarkDelay({ payload }, { call, put }) {
      // 结算单ids
      if (is.not.existy(payload.ids) || is.empty(payload.ids)) {
        return message.error('操作失败，请选择要缓发的数据');
      }
      const params = {
        ids: payload.ids,
        pay_salary_state: SalaryPaymentState.delayed,
      };
      const result = yield call(updateSalaryMarkState, params);
      if (result && result.ok) {
        message.success('操作成功');
        yield put({ type: 'reduceMarkDelaySalary', payload: params });
      } else {
        message.error('数据错误', result);
      }
    },

    /**
     * 缓发撤回
     * @param {array} ids 结算单ids
     * @param {number} pay_salary_state 状态
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *updateSalaryMarkNormal({ payload }, { call, put }) {
      // 结算单ids
      if (is.not.existy(payload.ids) || is.empty(payload.ids)) {
        return message.error('操作失败，请选择');
      }
      const params = {
        ids: payload.ids,
        pay_salary_state: SalaryPaymentState.normal,
      };
      const result = yield call(updateSalaryMarkState, params);
      if (result) {
        message.success('撤回成功');
        yield put({ type: 'reduceUnmakeDelaySalary', payload: params });
      } else {
        message.error('数据错误', result);
      }
    },

    /**
     * 结算明细
     * @param {array} _id id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchSalaryKnightStatement({ payload }, { call, put }) {
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchSalaryKnightStatement, params);
      if (result && is.existy(result.sheet_data_info)) {
        yield put({ type: 'reduceSalaryRecordDetail', payload: result });
      } else {
        message.error('获取结算明细失败', result);
      }
    },

    /**
     * 下载结算单
     * @param {array} platform_code 平台code
     * @param {array} supplier_id 供应商id
     * @param {array} city_code 城市查询
     * @param {array} state 审核状态
     * @param {array} work_type work_type
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *downloadSalaryStatement({ payload }, { call }) {
      const params = {
        payroll_statement_id: payload.id,
        download_type: 'payroll_task_download_data',   // 下载结算单 固定参数
      };
      const result = yield call(downloadSalaryStatement, params);
      if (result && is.truthy(result.ok)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      }
    },

    /**
     * 下载结算单模版
     * @param {array} _id id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchDownLoadSalaryStatementModal({ payload }, { call }) {
      const params = {
        payroll_statement_id: payload.id,
        download_type: 'payroll_calculation_template_download_target',   // 下载结算单模版 固定参数
      };
      const result = yield call(fetchDownLoadSalaryStatementModal, params);
      if (result && is.truthy(result.ok)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      }
    },

    /**
     * 下载运营补扣款模版
     * @param {array} _id id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchDownloadOperatingModal({ payload }, { call }) {
      const params = {
        payroll_statement_id: payload.id,
        download_type: 'payroll_adjustment_template_download_target',   // 下载结算单模版 固定参数
      };
      const result = yield call(fetchDownloadOperatingModal, params);
      if (result && is.truthy(result.ok)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      }
    },

    /**
     * 上传服务费结算表格
     * @param {array} _id id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchUploadSalaryExcel({ payload }, { call }) {
      const params = {
        file_key: payload.key,
        payroll_statement_id: payload.id,
        target: 'payroll_calculation_template_upload_target',
        storage_type: 3, // 上传文件的类型
      };
      const result = yield call(fetchUploadSalaryExcel, params);
      if (result.ok) {
        message.success('上传表格成功');
      } else {
        message.error('上传表格失败');
      }
    },

    /**
     * 上传运营补扣款表格
     * @param {array} _id id
     * @memberof module:model/financeSummaryManage~financeSummaryManage/effects
     */
    *fetchUploadOperatingExcel({ payload }, { call }) {
      const params = {
        file_key: payload.key,
        payroll_statement_id: payload.id,
        target: 'payroll_adjustment_template_upload_target',
        storage_type: 3, // 上传文件的类型
      };
      const result = yield call(fetchUploadOperatingExcel, params);
      if (result.ok) {
        message.success('上传表格成功');
      } else {
        message.error('上传表格失败');
      }
    },
    /**
     * 获取提审信息
     * @param {string} platform 平台code
     * @param {string} supplier 供应商id
     * @param {string} city 城市查询
     * @param {number} scope 范围
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *fetchSalarySubmitAudit({ payload }, { call, put }) {
      const params = {
        feature: 'salary_payment',
      };
      // 汇总id
      if (is.not.empty(payload.summaryItemId) && is.existy(payload.summaryItemId)) {
        params.payroll_statement_id = payload.summaryItemId;
      }
      // 获取范围
      if (is.not.empty(payload.scope) && is.existy(payload.scope)) {
        params.domain = payload.scope;
      }
      // 平台code
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 供应商id
      if (is.existy(payload.supplier) && is.not.empty(payload.supplier)) {
        params.supplier_id = payload.supplier;
      }
      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling = payload.city;
      }
      const result = yield call(fetchSalarySubmitAudit, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      // 成功的回调函数
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }
      yield put({ type: 'reduceSalarySubmitAudit', payload: result });
    },
    /**
     * 重置提审信息
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *resetSalarySubmitAudit({ payload }, { put }) {
      yield put({ type: 'reduceSalarySubmitAudit', payload: {} });
    },
  },

  /**
   * @namespace financeSummaryManage/reducers
   */
  reducers: {
    /**
     * 结算汇总列表
     * @returns {object} 更新 salarySummary
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceSalarySummary(state, action) {
      return { ...state, salarySummary: action.payload };
    },

    /**
     * 结算汇总更新状态
     * @returns {object} 更新 salarySummary
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceSalarySummaryState(state, action) {
      const salarySummary = {};
      salarySummary.data = dot.get(state, 'salarySummary.data', []).map((item) => {
        const data = item;
        if (action.payload.ids.includes(item._id)) {
          data.state = action.payload.state;
          if (action.payload.reason) {
            data.reason = action.payload.reason;
          }
        }
        return data;
      });
      return { ...state, salarySummary };
    },

    /**
     * 结算记录列表
     * @returns {object} 更新 salaryRecords
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceSalaryRecords(state, action) {
      return { ...state, salaryRecords: action.payload };
    },

    /**
     * 结算记录汇总信息
     * @returns {object} 更新 salaryRecords
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceSalaryRecordsInfo(state, action) {
      let salaryRecordsInfo = {};
      if (action.payload) {
        salaryRecordsInfo = action.payload;
      }
      return { ...state, salaryRecordsInfo };
    },

    /**
     * 服务费批量缓发
     * @returns {object} 更新 salaryRecords
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceMarkDelaySalary(state, action) {
      const salaryRecords = state.salaryRecords;
      const ids = action.payload.ids || [];
      salaryRecords.data = dot.get(state, 'salaryRecords.data', []).map((item) => {
        const data = item;
        if (ids.includes(item._id)) {
          data.pay_salary_state = SalaryPaymentState.delayed;
        }
        return data;
      });
      return { ...state, salaryRecords };
    },

    /**
     * 缓发撤回
     * @returns {object} 更新 salaryRecords
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceUnmakeDelaySalary(state, action) {
      const salaryRecords = state.salaryRecords;
      const ids = action.payload.ids || [];
      salaryRecords.data = dot.get(state, 'salaryRecords.data', []).map((item) => {
        const data = item;
        if (ids.includes(item._id)) {
          data.pay_salary_state = SalaryPaymentState.normal;
        }
        return data;
      });
      return { ...state, salaryRecords };
    },

    /**
     * 结算明细reducer
     * @returns {object} 更新 salaryDetail
     * @memberof module:model/financeSummaryManage~financeSummaryManage/reducers
     */
    reduceSalaryRecordDetail(state, action) {
      return { ...state, salaryDetail: action.payload };
    },
    /**
     * 获取薪资汇总提审信息
     * @return {object} 更新 auditInfo
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalarySubmitAudit(state, action) {
      const auditInfo = action.payload;
      return { ...state, auditInfo };
    },
  },
};
