/**
 * 摊销管理
 *
 * @module model/costAmorization
 */
import moment from 'moment';
import {
  message,
} from 'antd';
import is from 'is_js';

import {
  getScenesList, // 获取场景列表
  getPlatformList, // 获取平台列表
  getProjectList, // 获取项目列表
  getAmortizationList, // 获取摊销确认列表
  fetchLedgerList,
  onAddShareList, // 添加分摊数据
  onTerminationAmortization, // 终止摊销
  onUpdateRule, // 编辑规则
  getAmortizationDetail,
  getMainBodyList, // 获取主体列表
  getCityList, // 城市
} from '../services/amortization';
import {
  getRecordList,
} from '../services/code/record';
import {
  getSubjectList,
} from '../services/code/flow';
import {
  Unit,
  AmortizationCycleType,
  ExpenseExamineOrderPaymentState,
  InvoiceAjustAction,
  AmortizationType,
} from '../application/define';
import Operate from '../application/define/operate';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'costAmortization',
  /**
   * 状态树
   */
  state: {
    scenesList: {}, // 场景列表
    platformList: {}, // 平台列表
    projectList: {}, // 项目列表
    amortizationList: {}, // 摊销确认列表
    amortizationDetail: {}, // 摊销确认详情
    ledgerListInfo: {}, // 台账列表信息
    recordList: {}, // 费用记录明细
    mainBodyList: {}, // 主体列表
    subjectList: {}, // 科目列表
    prePageAction: {},    // 存储用户操作的行为
  },

  /**
   * @namespace costAmorization/effects
   */
  effects: {
     /**
     * 上个页面用户的行为
     */
    *updateUserAction({ payload = {} }, { put }) {
      const { tabKey, page, pageSize } = payload;
      const params = {};

        // tab key
      if (is.existy(tabKey) && is.not.empty(tabKey)) {
        params.tabKey = tabKey;
      }
        // page
      if (is.existy(page) && is.not.empty(page)) {
        params.page = page;
      }
        // pageSize
      if (is.existy(pageSize) && is.not.empty(pageSize)) {
        params.pageSize = pageSize;
      }

      yield put({ type: 'reduceUserAction', payload: params });
    },
    /**
     * 获取场景列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getScenesList({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 9999,
        },
      };

      const res = yield call(getScenesList, params);

      if (res && res.data) {
        yield put({ type: 'reduceScenesList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置场景列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *resetScenesList({ payload }, { put }) {
      yield put({ type: 'reduceScenesList', payload: {} });
    },

    /**
     * 获取平台列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getPlatformList({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 9999,
        },
      };

      const res = yield call(getPlatformList, params);

      if (res && res.data) {
        yield put({ type: 'reducePlatformList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置平台列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *resetPlatformList({ payload }, { put }) {
      yield put({ type: 'reducePlatformList', payload: {} });
    },

    /**
     * 获取项目列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getProjectList({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 9999,
        },
      };

      const res = yield call(getProjectList, params);

      if (res && res.data) {
        yield put({ type: 'reduceProjectList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置项目列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *resetProjectList({ payload }, { put }) {
      yield put({ type: 'reduceProjectList', payload: {} });
    },

    /**
     * 获取主体列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getMainBodyList({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 9999,
        },
      };

      const res = yield call(getMainBodyList, params);

      if (res && res.data) {
        yield put({ type: 'reduceMainBodyList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置主体列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *resetMainBodyList({ payload }, { put }) {
      yield put({ type: 'reduceMainBodyList', payload: {} });
    },

    /**
     * 获取摊销确认列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getAmortizationList({ payload = {} }, { call, put }) {
      const {
        subject, // 科目名称
        scenes, // 场景
        platform, // 平台
        body, // 主体
        project, // 项目
        account, // 核算中心
        costId, // 费用单号
        orderId, // 审批单号
        payState, // 付款状态
        amortizationState, // 摊销状态
        billRedPushState, // 是否红冲
        isConfirmRule, // 是否确认规则
        bookMonth, // 记账月份
        invoiceTitle, // 发票抬头
      } = payload;

      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };

      // 科目名称
      Array.isArray(subject) && subject.length > 0 && (params.cost_accounting_ids = subject);
      // 场景
      Array.isArray(scenes) && scenes.length > 0 && (params.industry_ids = scenes);
      // 平台
      Array.isArray(platform) && platform.length > 0 && (params.platform_ids = platform);
      // 主体
      Array.isArray(body) && body.length > 0 && (params.supplier_ids = body);
      // 项目
      Array.isArray(project) && project.length > 0 && (params.project_ids = project);
      // 核算中心
      Array.isArray(account) && account.length > 0 && (params.cost_target_id = account);
      // 费用单号
      costId && (params.cost_order_id = costId);
      // 审批单号
      orderId && (params.oa_order_id = orderId);
      // 付款状态
      payState && (params.paid_state = [payState]);
      // 摊销状态
      amortizationState && (params.state = [amortizationState]);
      // 是否红冲
      billRedPushState !== undefined && (params.is_red_push = billRedPushState);
      // 是否确认摊销
      isConfirmRule !== undefined && (params.is_confirm_rule = isConfirmRule);
      // 记账月份
      bookMonth && (params.book_month = Number(moment(bookMonth).format('YYYYMM')));
      // 发票抬头
      Array.isArray(invoiceTitle) && invoiceTitle.length > 0 && (params.invoice_titles = invoiceTitle);

      // 数据权限
      if (Operate.canOperateCostAmortizationConfirmAllData()) {
        // 全量数据
        params.is_all_data = true;
      } else {
        // 当前账号权限内的数据
        params.is_all_data = false;
      }

      const res = yield call(getAmortizationList, params);

      payload.setLoading && payload.setLoading();

      if (res && res.data) {
        yield put({ type: 'reduceAmortizationList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置摊销列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *resetAmortizationList({ payload }, { put }) {
      yield put({ type: 'reduceAmortizationList', payload: {} });
    },

    /**
     * 获取摊销确认详情
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getAmortizationDetail({ payload }, { call, put }) {
      const {
        id,
      } = payload;
      const params = {
        id,
      };

      const res = yield call(getAmortizationDetail, params);

      if (res && res._id) {
        yield put({ type: 'reduceAmortizationDetail', payload: res });
      }
    },

    /**
     * 重置摊销确认详情
     */
    *resetAmortizationDetail({ payload }, { put }) {
      yield put({ type: 'reduceAmortizationDetail', payload: {} });
    },

    /**
     * 获取台账列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *fetchLedgerList({ payload }, { call, put }) {
      const {
        page,
        limit,
        subjectName, // 科目名称
        subjectType, // 科目类型
        scenes, // 场景
        platform, // 平台
        mainBody, // 主体
        project, // 项目
        billMonth, // 记账月份
        invoiceTitle, // 发票抬头
      } = payload;
      const params = {
        _meta: {
          page: page || 1,
          limit: limit || 30,
        },
      };
      // 科目名称
      if (Array.isArray(subjectName) && subjectName.length > 0) {
        params.cost_accounting_ids = subjectName;
      }
      // 科目类型
      subjectType && (params.cost_center_type = Number(subjectType));
      // 场景
      if (Array.isArray(scenes) && scenes.length > 0) {
        params.industry_ids = scenes;
      }
      // 平台
      if (Array.isArray(platform) && platform.length > 0) {
        params.platform_ids = platform;
      }
      // 主体
      if (Array.isArray(mainBody) && mainBody.length > 0) {
        params.supplier_ids = mainBody;
      }
      // 项目
      if (Array.isArray(project) && project.length > 0) {
        params.project_ids = project;
      }
      // 记账月份
      billMonth && (params.book_month = Number(moment(billMonth).format('YYYYMM')));
      // 发票抬头
      invoiceTitle && (params.invoice_titles = invoiceTitle);
      // 数据权限
      if (Operate.canOperateCostAmortizationLedgerAllData()) {
        // 全量数据
        params.is_all_data = true;
      } else {
        // 当前账号权限内的数据
        params.is_all_data = false;
      }

      const res = yield call(fetchLedgerList, params);

      if (res && res.data) {
        yield put({ type: 'reduceLedgerListInfo', payload: res });
      }
    },

    /**
     * 添加分摊数据
     */
    *onAddShareList({ payload }, { call }) {
      const { ids } = payload;
      if (!Array.isArray(ids) || ids.length < 1) {
        return message.error('缺少记录明细id');
      }
      const params = {
        cost_order_ids: ids,
      };

      const res = yield call(onAddShareList, params);

      return res;
    },

    /**
     * 确认规则（单条/批量）
     */
    *onUpdateRule({ payload }, { call }) {
      const {
        ids,
        residual, // 残值率
        belongTimeType, // 摊销周期类型
        belongTime, // 摊销周期
        belongDate, // 摊销起止日期
        subject, // 科目
        allocationTotalMoney, // 应摊总额
        unallocationTotalMoney, // 未摊总额
        allocationEndDate, // 摊销结束日期
        remaining, // 剩余摊销期数
      } = payload;

      if (!ids || !Array.isArray(ids) || ids.length < 1) return message.error('缺少摊销id');

      const params = {
        order_allocation_ids: ids,
      };

      // 残值率
      (residual || residual === 0) && (params.salvage_value_rate = residual);
      // 摊销周期类型
      belongTimeType && (params.allocation_type = belongTimeType);
      // 摊销周期
      belongTime && (params.allocation_cycle = belongTime);
      // 科目
      subject && (params.cost_accounting_id = subject);
      // 应摊总额
      (allocationTotalMoney || allocationTotalMoney === 0) && (params.allocation_total_money = allocationTotalMoney);
      // 未摊总额
      (unallocationTotalMoney || unallocationTotalMoney === 0) && (params.unallocation_total_money = unallocationTotalMoney);

      // 摊销起止日期
      Array.isArray(belongDate) && belongDate.length === 2 && (params.allocation_start_date = Number(moment(belongDate[0]).format('YYYYMMDD'))) && (params.allocation_end_date = Number(moment(belongDate[1]).format('YYYYMMDD')));

      // 摊销结束日期
      allocationEndDate && (params.allocation_end_date = Number(moment(allocationEndDate).format('YYYYMMDD')));

      // 剩余摊销期数
      remaining && (params.unallocation_cycle = remaining);

      // 摊销类型为周期摊销 && 未摊周期没有值 && 摊销周期有值
      // 未摊周期为摊销周期
      if (belongTimeType === AmortizationCycleType.cycle
        && remaining === undefined
        && belongTime
      ) {
        params.unallocation_cycle = belongTime;
      }

      const res = yield call(onUpdateRule, params);

      return res;
    },

    /**
     * 终止摊销
     */
    *onTerminationAmortization({ payload }, { call }) {
      if (!payload.id) return message.error('缺少摊销id');
      const {
        creditWay,
        money,
      } = payload;

      const params = {
        id: payload.id,
      };

      // 剩余摊销金额计入方式
      creditWay && (params.book_type = creditWay);
      // 计入金额
      money && (params.book_money = Unit.exchangePriceToCent(money));

      const res = yield call(onTerminationAmortization, params);

      return res;
    },

    /**
     * 获取费用记录明细
     */
    *getRecordList({ payload = {} }, { call, put }) {
      const {
        reportType, // 科目类型
        subject, // 科目
        scenes, // 场景
        platform, // 平台
        body, // 主体
        project, // 项目
      } = payload;

      const params = {
        paid_state: [ExpenseExamineOrderPaymentState.paid],
        type: [InvoiceAjustAction.normal],
        cost_allocation_state: AmortizationType.not,
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };

      // 科目类型
      reportType && (params.cost_center_type = reportType);
      // 科目名称
      Array.isArray(subject) && subject.length > 0 && (params.cost_accounting_id = subject);
      // 场景
      Array.isArray(scenes) && scenes.length > 0 && (params.industry_ids = scenes);
      // 平台
      Array.isArray(platform) && platform.length > 0 && (params.platform_ids = platform);
      // 主体
      Array.isArray(body) && body.length > 0 && (params.supplier_ids = body);
      // 项目
      Array.isArray(project) && project.length > 0 && (params.project_ids = project);
      // 数据权限
      if (Operate.canOperateCostAmortizationConfirmAllData()) {
        // 全量数据
        params.is_all_data = true;
      } else {
        // 当前账号权限内的数据
        params.is_all_data = false;
      }

      const res = yield call(getRecordList, params);

      payload.setLoading && payload.setLoading();

      if (res && res.data) {
        yield put({ type: 'reduceRecordList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置记录明细
     */
    *resetRecordList({ payload }, { put }) {
      yield put({ type: 'reduceRecordList', payload: {} });
    },

    /**
     * 获取城市列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *getCityList({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 9999,
        },
      };

      const res = yield call(getCityList, params);

      if (res && res.data) {
        yield put({ type: 'reduceCityList', payload: res });
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
      }
    },

    /**
     * 重置城市列表
     * @memberof module:model/costAmorization~costAmorization/effects
     */
    *resetCityList({ payload }, { put }) {
      yield put({ type: 'reduceCityList', payload: {} });
    },

    /**
     * 获取科目列表
     */
    *getSubjectList({ payload }, { call, put }) {
      const { type, namespace } = payload;
      const params = {};

      // 适用类型
      type && (params.cost_center_type = Number(type));

      const res = yield call(getSubjectList, params);

      if (res && res.data) {
        yield put({ type: 'reduceSubjectList', payload: { ...res, namespace } });
      }
    },


    /*
     * 重置科目list
     */
    *resetSubjectList({ payload }, { put }) {
      yield put({ type: 'reduceSubjectList', payload });
    },
  },

  /**
   * @namespace costAmorization/reducers
   */
  reducers: {
    /**
     * 存储用户操作行为
     */
    reduceUserAction(state, action) {
      return { ...state, prePageAction: action.payload };
    },
    /**
     * 更新场景列表 scenesList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceScenesList(state, action) {
      let scenesList = {};
      if (action.payload && action.payload.data) {
        scenesList = action.payload;
      }
      return { ...state, scenesList };
    },

    /**
     * 更新平台列表 platformList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reducePlatformList(state, action) {
      let platformList = {};
      if (action.payload && action.payload.data) {
        platformList = action.payload;
      }
      return { ...state, platformList };
    },

    /**
     * 更新项目列表 projectList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceProjectList(state, action) {
      let projectList = {};
      if (action.payload && action.payload.data) {
        projectList = action.payload;
      }
      return { ...state, projectList };
    },

    /**
     * 更新摊销列表 amortizationList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceAmortizationList(state, action) {
      let amortizationList = {};
      if (action.payload && action.payload.data) {
        amortizationList = action.payload;
      }
      return { ...state, amortizationList };
    },

    /**
     * 更新摊销详情 amortizationDetail
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceAmortizationDetail(state, { payload }) {
      return {
        ...state,
        amortizationDetail: payload,
      };
    },

    /**
     * 更新台账列表信息 ledgerListInfo
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceLedgerListInfo(state, { payload }) {
      return {
        ...state,
        ledgerListInfo: payload,
      };
    },

    /**
     * 更新费用记录明细 recordList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceRecordList(state, action) {
      let recordList = {};
      if (action.payload && action.payload.data) {
        recordList = action.payload;
      }
      return { ...state, recordList };
    },

    /**
     * 更新主体列表 mainBodyList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceMainBodyList(state, action) {
      let mainBodyList = {};
      if (action.payload && action.payload.data) {
        mainBodyList = action.payload;
      }
      return { ...state, mainBodyList };
    },

    /**
     * 更新城市列表 cityList
     * @memberof module:model/costAmorization~costAmorization/reducers
     */
    reduceCityList(state, action) {
      let cityList = {};
      if (action.payload && action.payload.data) {
        cityList = action.payload;
      }
      return { ...state, cityList };
    },

    /**
     * 更新科目list
     * @returns {object} 更新 subjectList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceSubjectList(state, action) {
      const {
        data,
        namespace,
      } = action.payload || {};
      let subjectList = {};
      if (data && Array.isArray(data) && data.length > 0) {
        subjectList = {
          ...state.subjectList,
          [namespace]: data,
        };
      }
      return { ...state, subjectList };
    },
  },
};
