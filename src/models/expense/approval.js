/**
 * 费用管理
 * @module model/expense/approval
 **/
import is from 'is_js';
import dot from 'dot-prop';
import { message } from 'antd';

import {
  fetchSummaryRecordData,
  fetchorderRecordDetails,
  updateExamineData,
  submitTypeApplyGroupS,
  getExamineSimpleNameS,
  fetchSummaryRecordDetail,
  typeApplyDeleteS,
} from '../../services/expense';

import { authorize } from '../../application';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'approval',
    /**
   * 状态树
   * @prop {object} approvalList 审批单列表
   * @prop {object} getRecordList 记录明细列表
   * @prop {array} summaryProcess 审批单记录
   * @prop {boolean} dispatching 默认没有处理请求
   * @prop {boolean} dispatching 审批单记录
   * @prop {number} dispatching 默认没有处理请求
   * @prop {array} orderRecordDetails 费用申请费用申请单详情, 数组格式，可能有多条数据
   * @prop {object} summaryRecordData 费用申请记录列表 NOTE：summary,records
   * @prop {array} examineSimpleNameList 审批流名称接口 NOTE：summary,records
   * @prop {object} summaryRecordDetail 审批单详情接口 NOTE：summary,records
   */
  state: {

    // audit
    approvalList: {        // 审批单列表
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },

    // records
    getRecordList: {        // 记录明细列表
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },
    recordEdit: undefined,         // 编辑审批单号

    // summary
    // summaryRecordProcess: [],       // 审批单进度
    summaryProcess: [],  // 审批单记录
    dispatching: false, // 默认没有处理请求

    // template
    uniqueHouseNum: 0, // 费用申请租房生成唯一房屋编号
    orderRecordDetails: [],   // 费用申请费用申请单详情, 数组格式，可能有多条数据

    // common
    typeNameList: [], // 费用申请获得费用分组名称 NOTE：audit,records
    summaryRecordData: {  // 费用申请记录列表 NOTE：summary,records
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },
    examineSimpleNameList: [],   // 审批流名称接口 NOTE：summary,records
    summaryRecordDetail: {},       // 审批单详情接口 NOTE：summary,records
  },
  /**
   * @namespace expense/approval/subscriptions
   */
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location;
        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }

        // 断租，续租，续签，退租 表单页面
        if (pathname === '/Expense/Manage/Records/Form') {
          // 获取单条流水记录的详情数据
          dispatch({ type: 'fetchorderRecordDetails', payload: { recordId: query.recordId } });
        }

        // 断租，续租，续签，退租 详情页面
        if (pathname === '/Expense/Manage/Records/Detail') {
          // 获取单条流水记录的详情数据
          dispatch({ type: 'fetchorderRecordDetails', payload: { recordId: query.recordId } });
        }

        // 记录明细页面, 编辑明细列表
        if (pathname === '/Expense/Manage/Records/Summary/Create') {
          // 获取审批流列表数据
          dispatch({ type: 'getExamineSimpleNameE' });
        }
      });
    },
  },
  /**
   * @namespace expense/approval/effects
   */
  effects: {

    // records
    // -------------记录明细-----------------
    // 获取汇总审批单详情
    * fetchSummaryRecordDetail({ payload }, { call, put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('数据id不能为空，无法获取汇总审批单详情');
      }
      const params = {
        examine_id: payload.id, // 流水号
      };
      const result = yield call(fetchSummaryRecordDetail, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceSummaryRecordDetail', payload: result.result });
    },

    // 费用申请费用申请单编辑--断租／续租／退租／续签:
    * typeApplyEditRentE({ payload }, { call }) {
      // HACK: 断租／续租／退租／续签 的提交接口，包装一层数组格式
      const params = {
        data: [payload],
      };
      const result = yield call(updateExamineData, params);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        // 如果成功后退返回列表页
        window.history.back(-1);
      }
    },

    /**
     * 费用申请单详情 NOTE：template，records
     * @param {string} recordId 单条单号
     * @memberof module:model/expense/approval~expense/approval/effects
     */
    * fetchorderRecordDetails({ payload }, { call, put }) {
      if (is.empty(payload.recordId) || is.not.existy(payload.recordId)) {
        return message.error('数据id错误，无法获取记录详情');
      }
      const params = {
        order_id: payload.recordId,
      };
      const result = yield call(fetchorderRecordDetails, params);
      if (result.ok) {
        yield put({ type: 'reduceorderRecordDetails', payload: result.result });

        yield put({ type: 'dispatchingR', payload: false });
      }
    },

    /**
     * 费用申请删除费用申请单审批 NOTE：summary，records
     * @param {string} recordId   单条单号
     * @param {number}  state     枚举值删除
     * @param {string}  examineId 汇总单号
     * @param {function}  onSuccessCallback 成功的回调函数
     * @memberof module:model/expense/approval~expense/approval/effects
     */
    * typeApplyDeleteE({ payload }, { call, put, select }) {
      const params = {
        examine_id: payload.examineId,   // 汇总单号
        order_id: payload.orderId,  // 单条单号
        state: payload.state,   // 枚举值删除
      };
      const result = yield call(typeApplyDeleteS, params);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'fetchSummaryRecordData',
          payload: {
            examineflowId: payload.examineId,
            limit: 30,
            page: 1,
          },
        });
        yield put({ type: 'fetchSummaryRecordDetail', payload: { id: payload.examineId } });
        // 删除成功回调
        if (payload.onSuccessCallback) {
          const state = yield select();
          const resultCount = dot.get(state, 'approval.summaryRecordData._meta.result_count');
          payload.onSuccessCallback(resultCount);
        }
      }
    },

    /**
     * 费用申请提交费用申请单审批 NOTE：summary，records
     * @param {string}  examineId 审批单ID
     * @param {string}  examineflowId 审批流ID
     * @memberof module:model/expense/approval~expense/approval/effects
     */
    * submitTypeApplyGroupE({ payload }, { call, put }) {
      // 审批单id
      if (is.empty(payload.examineId) || is.not.existy(payload.examineId)) {
        return message.error('审批单ID不能为空');
      }
      // 审批流ID
      if (is.empty(payload.examineflowId) || is.not.existy(payload.examineflowId)) {
        return message.error('审批流ID不能为空');
      }
      const params = {
        examine_id: payload.examineId, // 审批单ID，提供则代表重新提交
        examineflow_id: payload.examineflowId, // 审批流ID
      };
      const result = yield call(submitTypeApplyGroupS, params);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        message.success('操作成功');
        yield put({ type: 'dispatchingR', payload: true });
        window.location.href = '#/Expense/Manage/ExamineOrder';
      }
    },

    /**
     * 获取审批流列表 NOTE：summary，records
     * @todo 接口需升级优化
     * @memberof module:model/expense/approval~expense/approval/effects
     */
    * getExamineSimpleNameE({ payload }, { call, put }) {
      const result = yield call(getExamineSimpleNameS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getExamineSimpleNameR', payload: result.result });
      yield put({ type: 'dispatchingR', payload: false });
    },

    /**
     * 获取汇总审批单记录 NOTE：summary，records
     * @param {number}  limit 总条数
     * @param {number}  page  页数
     * @param {number}  state  订单状态
     * @param {array}   supplierList   供应商列表
     * @param {string}  costclassId    费用分组id
     * @param {string}  examineflowId  审核单ID流水号
     * @param {string}  catalogId      科目类型id
     * @param {string}  proposerName   申请人姓名
     * @param {number}  thingState     房屋状态
     * @memberof module:model/expense/approval~expense/approval/effects
     */

    * fetchSummaryRecordData({ payload }, { call, put }) {
      const params = {
        page: payload.page, // 页码
        limit: payload.limit, // 条数
      };
      // 页码
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params.page = payload.page;
      }
      // 条数
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params.limit = payload.limit;
      }
      // 供应商列表
      if (is.existy(payload.supplierList) && is.not.empty(payload.supplierList)) {
        params.supplier_list = payload.supplierList;
      }
      // 审核单ID流水号
      if (is.existy(payload.examineflowId) && is.not.empty(payload.examineflowId)) {
        params.examineflow_id = payload.examineflowId;
      }
      // 费用分组id
      if (is.existy(payload.costclassId) && is.not.empty(payload.costclassId)) {
        params.costclass_id = payload.costclassId;
      }
      // 科目类型id
      if (is.existy(payload.catalogId) && is.not.empty(payload.catalogId)) {
        params.catalog_id = payload.catalogId;
      }
      // 申请人姓名
      if (is.existy(payload.proposerName) && is.not.empty(payload.proposerName)) {
        params.proposer_name = payload.proposerName;
      }
      // 订单状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 房屋状态
      if (is.existy(payload.thingState) && is.not.empty(payload.thingState)) {
        params.thing_state = payload.thingState;
      }
      // sort
      if (is.existy(payload.sort) && is.not.empty(payload.sort)) {
        params.sort = payload.sort;
      }

      const result = yield call(fetchSummaryRecordData, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceSummaryRecordData', payload: result });
    },

  },
  /**
   * @namespace expense/approval/reducers
   */
  reducers: {
    /**
     * 费用申请租房生成唯一房屋编号
     * @returns {object} 更新 uniqueHouseNum
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    // TODO: 确定, 可删除
    getUniqueHouseNumR(state, action) {
      return {
        ...state,
        uniqueHouseNum: action.payload,
      };
    },
    /**
     * 费用申请获得费用分组名称
     * @returns {object} 更新 typeNameList
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    // TODO: @确定, 可删除
    getTypeNameListR(state, action) {
      return {
        ...state,
        typeNameList: action.payload,
      };
    },
    /**
     * 费用申请单详情
     * @returns {object} 更新 orderRecordDetails
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    reduceorderRecordDetails(state, action) {
      return { ...state, orderRecordDetails: action.payload };
    },
    /**
     * 审批单列表
     * @returns {object} 更新 approvalList
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    // TODO: 确定, 可删除
    getApprovalListR(state, action) {
      return {
        ...state,
        approvalList: action.payload,
      };
    },
    /**
     * 记录明细列表
     * @returns {object} 更新 getRecordList
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    // TODO: 确定, 可删除
    getRecordListR(state, action) {
      return {
        ...state,
        getRecordList: action.payload,
      };
    },
    /**
     * 获取审批流列表
     * @returns {object} 更新 examineSimpleNameList
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    getExamineSimpleNameR(state, action) {
      return {
        ...state,
        examineSimpleNameList: action.payload,
      };
    },

    /**
     * 获取汇总审批单详情
     * @returns {object} 更新 summaryRecordDetail
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    reduceSummaryRecordDetail(state, action) {
      return { ...state, summaryRecordDetail: action.payload };
    },

    /**
     * 获取汇总审批单记录
     * @returns {object} 更新 summaryRecordData
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    reduceSummaryRecordData(state, action) {
      return { ...state, summaryRecordData: action.payload };
    },

    // // 获取汇总审批单进度
    // reduceSummaryRecordProcess(state, action) {
    //   return { ...state, summaryRecordProcess: action.payload };
    // },

    /**
     * 获取汇总审批单记录
     * @returns {object} 更新 summaryProcess
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    // TODO: 确定, 可删除
    reduceSummaryProcess(state, action) {
      return { ...state, summaryProcess: action.payload };
    },

    /**
     * 断租等传id
     * @returns {object} 更新 recordEdit
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    // TODO: 确定, 可删除
    recordEditR(state, action) {
      return {
        ...state,
        recordEdit: action.payload,
      };
    },
    /**
     * 申请单审批
     * @returns {object} 更新 dispatching
     * @memberof module:model/expense/approval~expense/approval/reducers
     */
    dispatchingR(state, action) {
      return {
        ...state,
        dispatching: action.payload,
      };
    },
  },
};
