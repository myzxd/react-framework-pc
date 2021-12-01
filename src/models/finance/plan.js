/**
 * 结算设置 - 服务费方案 model
 *
 * @module model/finance/plan
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchTrialResultsList,
  fetchSalaryTaskDetails,
  fetchSalaryPlanList,
  fetchSalaryPlanTask,
  createSalaryPlan,
  fetchSalaryPlanDetailData,
  fetchPlanVersionDetailData,
  fetchRuleCollectionData,
  createRuleCollection,
  updateMutualExclusion,
  deletePlanVersion,
  cancelToDraft,
  forkSalaryPlan,
  fetchSalaryPlanVersion,
  fetchTrialSummaryList,
  downloadSalaryPlanList,
  updataEffective,
  fetchPayrollPlanSubmitAudit,
} from '../../services/finance';

import { ExpenseCostCenterType } from '../../application/define';
import { RequestMeta, ResponseMeta } from '../../application/object';
import {
  SalaryPlanDetail,
  SalaryPlanListItem,
  SalaryComputeDataSetListItem,
  SalaryPlanVersionDetail,
  SalaryPlanRuleCollection,
  SalaryComputeTaskDetail,
  SalaryComputeTaskListItem,
} from '../../application/object/salary/test';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'financePlan',

  /**
   * 状态树
   * @prop {object} planListData 服务费方案列表
   * @prop {object} calculateResultsData 获取试算服务费结果列表
   * @prop {object} calculateHistoryData 获取试算服务费历史列表
   * @prop {object} courierData 获取骑士维度明细数据列表
   * @prop {object} districtsData 获取商圈维度明细数据列表
   * @prop {object} calculateSummaryData 获取试算汇总数据列表
   * @prop {object} salaryPlanDetailData 服务费方案详情
   * @prop {object} planVersionDetailData 服务费方案版本详情
   * @prop {object} ruleCollectionData 服务费方案规则集详情
   * @prop {object} addressInfo 获取试算地址信息
   * @prop {object} auditInfo   提审信息
   */
  state: {
    planListData: {},           // 服务费方案列表
    calculateResultsData: {},   // 获取试算服务费结果列表
    calculateHistoryData: {},  // 获取试算服务费历史列表
    courierData: {},            // 获取骑士维度明细数据列表
    districtsData: {},          // 获取商圈维度明细数据列表
    calculateSummaryData: {},   // 获取试算汇总数据列表
    salaryPlanDetailData: {},   // 服务费方案详情
    planVersionDetailData: {},  // 服务费方案版本详情
    ruleCollectionData: {},     // 服务费方案规则集详情
    addressInfo: {},            // 获取试算地址信息
    auditInfo: {},              // 提神信息
  },

  /**
   * @namespace finance/plan/effects
   */
  effects: {

    /**
     * 服务费方案汇总列表
     * @param {object} meta 分页信息
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @param {array} cities 城市
     * @param {array} districts 商圈
     * @param {number} state 执行状态
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchSalaryPlanList({ payload = {} }, { call, put }) {
      const payloads = payload;
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
       // 获取平台
      if (is.not.empty(payload.platforms) && is.existy(payload.platforms)) {
        params.platform_code = payload.platforms;
      }
      // 获取商圈
      if (is.not.empty(payload.districts) && is.existy(payloads.districts)) {
        params.biz_district_id = payload.districts;
      }
      // 获取执行状态
      if (is.not.empty(payload.state) && is.existy(payload.state)) {
        params.domain = Number(payload.state);
      }
       // 获取供应商
      if (is.not.empty(payload.suppliers) && is.existy(payloads.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 获取城市
      if (is.not.empty(payload.cities) && is.existy(payload.cities)) {
        params.city_code = payload.cities;
      }
      const result = yield call(fetchSalaryPlanList, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceSalaryPlanListData', payload: result });
    },

    /**
     * 创建服务费方案类型
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @param {array} cities 城市
     * @param {array} districts 商圈
     * @param {string} fromDate 起始生效时间
     * @param {string} toDate 结束生效时间
     * @param {string} range 选择模板
     * @param {string} scope 适用范围
     * @param {string} name 名称
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * createSalaryPlanType({ payload = {} }, { put }) {
      const {
        name,
        platforms,        // 平台
        suppliers,        // 供应商
        cities,           // 城市
        districts,        // 商圈
        fromDate,         // 起始生效时间
        toDate,           // 结束生效时间
        range,            // 选择模板
        scope,            // 适用范围
      } = payload.params;
      // 请求列表的meta信息
      const params = {};
      // 获取供平台
      if (is.not.empty(platforms) && is.existy(platforms)) {
        params.platform_code = platforms;
      }
      // 获取供应商
      if (is.not.empty(suppliers) && is.existy(suppliers)) {
        params.supplier_id = suppliers;
      }
      // 获取适用范围
      if (is.not.empty(scope) && is.existy(scope)) {
        params.domain = scope;
      }
      // 获取城市
      if (is.not.empty(payload.cities) && is.existy(cities)) {
        params.city_code = cities;
      }
      // 获取商圈
      if (is.not.empty(districts) && is.existy(districts)) {
        params.biz_district_id = districts;
      }
      // 获取起始创建时间
      if (is.not.empty(fromDate) && is.existy(fromDate)) {
        params.from_date = fromDate;
      }
      // 获取结束创建时间
      if (is.not.empty(toDate) && is.existy(toDate)) {
        params.to_date = toDate;
      }
      // 获取模板
      if (is.not.empty(range) && is.existy(range)) {
        params.template = range;
      }
      if (is.not.empty(name) && is.existy(name)) {
        params.name = name;
      }
      const request = {
        params, // 接口参数
        service: createSalaryPlan, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 服务费试算任务创建
     * @param {string} versionId 服务费版本ID
     * @param {string} fromDate 起始生效时间
     * @param {string} toDate 结束生效时间
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * createSalaryPlanTask({ payload = {} }, { put }) {
      const {
        versionId, // 服务费版本ID
        fromDate, // 起始时间
        toDate,   // 结束时间
      } = payload.params;
      const params = {};
      // 获取起始试算时间
      if (is.not.empty(fromDate) && is.existy(fromDate)) {
        params.from_date = fromDate;
      }
      if (is.not.empty(toDate) && is.existy(toDate)) {
        params.to_date = toDate;
      }
      if (is.not.empty(versionId) && is.existy(versionId)) {
        params.plan_version_id = versionId;
      }
      const request = {
        params, // 接口参数
        service: fetchSalaryPlanTask, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 创建审核批单
     * @param {string} planVersionId 版本ID
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * createSalaryPlanVersion({ payload = {} }, { put }) {
      const {
        planVersionId,  // 版本id
        accountId,     // 下一个节点人员id
        postId,        // 下一节点各岗位 id
      } = payload.params;
      const params = {};
      // 获取版本id
      if (is.not.empty(planVersionId) && is.existy(planVersionId)) {
        params.plan_version_id = planVersionId;
      }
      // 获取版本节点人id
      if (is.not.empty(accountId) && is.existy(accountId)) {
        params.next_node_account_id = accountId;
      }
      // 获取版本岗位id
      if (is.not.empty(postId) && is.existy(postId)) {
        params.next_node_post_id = postId;
      }
      const request = {
        params, // 接口参数
        service: fetchSalaryPlanVersion, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 获取试算服务费结果列表
     * @param {string} planVersionId 版本ID
     * @param {number} type 类型
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchSalaryPlanResultsData({ payload = {} }, { put, call }) {
      const { planVersionId, type, onSuccessCallback } = payload;
      const params = {};
      // 获取版本id
      if (is.not.empty(planVersionId) && is.existy(planVersionId)) {
        params.plan_version_id = planVersionId;
      }
      if (is.not.empty(type) && is.existy(type)) {
        params.type = type;
      }
      const result = yield call(fetchTrialResultsList, params);
      // 回调函数
      if (onSuccessCallback) {
        onSuccessCallback(result);
      }

      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceSalaryPlanResultsData', payload: result });
    },

    /**
     * 获取试算服务费历史列表
     * @param {string} planVersionId 版本ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchSalaryPlanHistoryData({ payload = {} }, { put, call }) {
      const { planVersionId, onSuccessCallback } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 获取版本id
      if (is.not.empty(planVersionId) && is.existy(planVersionId)) {
        params.plan_version_id = planVersionId;
      }
      const result = yield call(fetchTrialResultsList, params);
      // 回调函数
      if (onSuccessCallback) {
        onSuccessCallback(result);
      }
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceSalaryPlanHistoryData', payload: result });
    },

    /**
     * 获取骑士维度明细数据列表
     * @param {string} taskId 版本ID
     * @param {number} type 类型
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchCourierDetailData({ payload = {} }, { put, call }) {
      const { taskId, type } = payload;
      const params = {};
      // 获取版本id
      if (is.not.empty(taskId) && is.existy(taskId)) {
        params.task_id = taskId;
      }
      // 获取方案类型
      if (is.not.empty(type) && is.existy(type)) {
        params.type = Number(type);
      }
      const result = yield call(fetchSalaryTaskDetails, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceCourierDetailData', payload: result });
    },

    /**
     * 获取商圈维度明细数据列表
     * @param {string} taskId 版本ID
     * @param {number} type 类型
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchDistrictsDetailData({ payload = {} }, { put, call }) {
      const { taskId, type } = payload;
      const params = {};
      // 获取版本id
      if (is.not.empty(taskId) && is.existy(taskId)) {
        params.task_id = taskId;
      }
      // 获取方案类型
      if (is.not.empty(type) && is.existy(type)) {
        params.type = Number(type);
      }
      const result = yield call(fetchSalaryTaskDetails, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceDistrictsDetailData', payload: result });
    },

    /**
     * 获取试算汇总详情数据列表
     * @param {string} taskId 版本ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchSalaryPlanSummaryData({ payload = {} }, { put, call }) {
      const { taskId } = payload;
      const params = {};
     // 获取版本id
      if (is.not.empty(taskId) && is.existy(taskId)) {
        params._id = taskId;
      }
      const result = yield call(fetchTrialSummaryList, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceSalaryPlanSummaryData', payload: result });
    },

    /**
     * 获取试算信息的地址
     * @param {string} taskId 版本ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * fetchSalaryPlanAddressInfo({ payload = {} }, { put, call }) {
      const { taskId } = payload;
      const params = {};
      // 获取版本id
      if (is.not.empty(taskId) && is.existy(taskId)) {
        params._id = taskId;
      }
      const result = yield call(fetchTrialSummaryList, params);
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reduceSalaryPlanAddressInfo', payload: result });
    },

    /**
     * 获取服务费方案详情
     * @param {string} id 服务费方案ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *fetchSalaryPlanDetailData({ payload }, { call, put }) {
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('缺少服务费方案id');
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchSalaryPlanDetailData, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceSalaryPlanDetailData', payload: result });
      }
    },

    /**
     * 导出服务费试算数据列表
     * @param {string} taskId 版本ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    * downloadSalaryPlanList({ payload }, { call }) {
      const { taskId } = payload;
      const params = {};
      // 获取版本id
      if (is.not.empty(taskId) && is.existy(taskId)) {
        params.task_id = taskId;
      }
      const result = yield call(downloadSalaryPlanList, params);
      if (result === undefined) {
        message.error('获取数据失败');
      }
      message.success('获取数据成功');
    },

    /**
     * 获取服务费方案版本详情
     * @param {string} id 服务费方案版本ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *fetchPlanVersionDetailData({ payload }, { call, put }) {
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('缺少服务费方案版本id');
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchPlanVersionDetailData, params);
      if (is.existy(result)) {
        yield put({ type: 'reducePlanVersionDetailData', payload: { result, planVersionId: payload.id } });
      }
    },

    /**
     * 修改服务费方案版本有效时间
     * @param {string} id 服务费方案版本ID
     * @param {string} effectiveDate 有效时间
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *updataEffective({ payload }, { call }) {
      const {
        id,
        effectiveStart,
        effectiveEnd,
        onSuccessCallback,
        onFailureCallback,
      } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        if (onFailureCallback) {
          onFailureCallback();
        }
        return message.error('缺少服务费方案版本id');
      }
      const params = {
        plan_version_id: id,
      };
      // 有效时间开始时间
      if (is.not.empty(effectiveStart) && is.existy(effectiveStart)) {
        params.from_date = Number(effectiveStart);
      }
      // 有效时间结束时间
      if (is.not.empty(effectiveEnd) && is.existy(effectiveEnd)) {
        params.to_date = Number(effectiveEnd);
      }
      const result = yield call(updataEffective, params);
      if (result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('修改成功');
      } else if (result.zh_message) {
        if (onFailureCallback) {
          onFailureCallback();
        }
        return message.error(result.zh_message);
      } else {
        if (onFailureCallback) {
          onFailureCallback();
        }
        return message.error('请求失败');
      }
    },

    /**
     * 获取服务费方案规则集详情
     * @param {string} id 服务费方案版本ID
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *fetchRuleCollectionData({ payload }, { call, put }) {
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchRuleCollectionData, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceRuleCollectionData', payload: { result, ruleCollectionId: payload.id } });
      }
    },

    /**
     * 创建服务费规则集
     * @param {string} planVersionId 版本ID
     * @param {number} workType 工作性质
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *createRuleCollection({ payload }, { put }) {
      if (is.not.existy(payload.workType) || is.empty(payload.workType)) {
        return message.error('请选择工作性质');
      }
      const params = {
        plan_version_id: payload.planVersionId,
        work_type: Number(payload.workType),
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: createRuleCollection,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费规则集互斥互补
     * @param {string} id 服务费方案版本ID
     * @param {boolean} exclusive 服务费规则是否互斥
     * @param {number} ruleType 规则类型
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *updateMutualExclusion({ payload }, { put }) {
      const params = {
        rule_collection_id: payload.id,
        rule_relation: payload.exclusive,
        type: payload.ruleType,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: updateMutualExclusion,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费方案版本删除
     * @param {string} id 服务费方案版本ID
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *deletePlanVersion({ payload }, { put }) {
      const params = {
        _id: payload.id,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: deletePlanVersion,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费方案待生效版本退回到草稿箱
     * @param {string} id 服务费方案版本ID
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *backPlanVersion({ payload }, { put }) {
      const params = {
        plan_version_id: payload.id,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: cancelToDraft,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费方案已生效版本调薪
     * @param {string} id 服务费方案版本ID
     * @param {function} onSuccessCallback 成功回调
     * @param {function} onFailureCallback 失败回调
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *adjustSalaryPlan({ payload }, { put }) {
      const params = {
        plan_version_id: payload.id,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: forkSalaryPlan,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
    /**
     * 获取提审信息
     * @param {string} platform 平台code
     * @param {string} supplier 供应商id
     * @param {string} city 城市查询
     * @param {string} district 商圈查询
     * @param {number} scope 范围
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *fetchPayrollPlanSubmitAudit({ payload }, { call, put }) {
      const params = {
        feature: 'salary_plan',
      };
      // 版本id
      if (is.not.empty(payload.planVersionId) && is.existy(payload.planVersionId)) {
        params.salary_plan_version_id = payload.planVersionId;
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
      // 商圈查询
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_id = payload.district;
      }
      const result = yield call(fetchPayrollPlanSubmitAudit, params);
      // 成功的回调函数
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }
      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }
      yield put({ type: 'reducePayrollPlanSubmitAudit', payload: result });
    },
    /**
     * 重置提审信息
     * @memberof module:model/finance/plan~finance/plan/effects
     */
    *resetPayrollPlanSubmitAudit({ payload }, { put }) {
      yield put({ type: 'reducePayrollPlanSubmitAudit', payload: {} });
    },
  },

  /**
   * @namespace finance/plan/reducers
   */
  reducers: {
    /**
     * 创建服务费方案列表数据
     * @return {object} 更新 planListData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalaryPlanListData(state, action) {
      const planListData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: SalaryPlanListItem.mapperEach(action.payload.data, SalaryPlanListItem),
      };
      return { ...state, planListData };
    },

    /**
     * 创建试算服务费结果列表
     * @return {object} 更新 calculateResultsData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalaryPlanResultsData(state, action) {
      const calculateResultsData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: SalaryComputeTaskListItem.mapperEach(action.payload.data, SalaryComputeTaskListItem),
      };
      return { ...state, calculateResultsData };
    },

    /**
     * 试算服务费历史列表
     * @return {object} 更新 calculateHistoryData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalaryPlanHistoryData(state, action) {
      const calculateHistoryData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: SalaryComputeTaskListItem.mapperEach(action.payload.data, SalaryComputeTaskListItem),
      };
      return { ...state, calculateHistoryData };
    },

    /**
     * 获取试算地址信息
     * @return {object} 更新 addressInfo
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalaryPlanAddressInfo(state, action) {
      const adderssData = [];
      adderssData.push(action.payload);
      const addressInfo = {
        data: SalaryComputeTaskDetail.mapperEach(adderssData, SalaryComputeTaskDetail),
      };
      return { ...state, addressInfo };
    },

    /**
     * 创建骑士维度明细数据列表
     * @return {object} 更新 courierData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceCourierDetailData(state, action) {
      const courier = action.payload.data;
      const courierListData = courier.filter(item => item.type === ExpenseCostCenterType.knight);
      const courierData = {
        data: SalaryComputeDataSetListItem.mapperEach(courierListData, SalaryComputeDataSetListItem),
      };
      return { ...state, courierData };
    },

    /**
     * 创建商圈维度明细数据列表
     * @return {object} 更新 districtsData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceDistrictsDetailData(state, action) {
      const district = action.payload.data;
      const districtListData = district.filter(item => item.type === ExpenseCostCenterType.district);
      const districtsData = {
        data: SalaryComputeDataSetListItem.mapperEach(districtListData, SalaryComputeDataSetListItem),
      };
      return { ...state, districtsData };
    },

    /**
     * 创建试算汇总数据列表
     * @return {object} 更新 calculateSummaryData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalaryPlanSummaryData(state, action) {
      const summaryData = [];
      summaryData.push(action.payload);
      const calculateSummaryData = {
        data: SalaryComputeTaskDetail.mapperEach(summaryData, SalaryComputeTaskDetail),
      };
      return { ...state, calculateSummaryData };
    },

    /**
     * 获取服务费方案详情
     * @return {object} 更新 salaryPlanDetailData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceSalaryPlanDetailData(state, { payload }) {
      let salaryPlanDetailData = {};
      if (is.not.empty(payload) && is.existy(payload)) {
        salaryPlanDetailData = SalaryPlanDetail.mapper(payload, SalaryPlanDetail);
      }
      return {
        ...state,
        salaryPlanDetailData,
      };
    },

    /**
     * 获取服务费方案版本详情
     * @return {object} 更新 planVersionDetailData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reducePlanVersionDetailData(state, { payload }) {
      let planVersionDetailData = {};
      if (is.not.empty(payload.result) && is.existy(payload.result)) {
        planVersionDetailData = {
          ...SalaryPlanVersionDetail.mapper(payload.result, SalaryPlanVersionDetail),
        };
      }
      return {
        ...state,
        planVersionDetailData: {
          ...state.planVersionDetailData,
          [payload.planVersionId]: planVersionDetailData,
        },
      };
    },

    /**
     * 获取服务费方案规则集详情 ruleCollectionId
     * @return {object} 更新 ruleCollectionData
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceRuleCollectionData(state, { payload }) {
      let ruleCollectionData = {};
      if (is.not.empty(payload.result) && is.existy(payload.result)) {
        ruleCollectionData = SalaryPlanRuleCollection.mapper(payload.result, SalaryPlanRuleCollection);
      }
      return {
        ...state,
        ruleCollectionData: {
          ...state.ruleCollectionData,
          [payload.ruleCollectionId]: ruleCollectionData,
        },
      };
    },
    /**
     * 获取服务费方案规则提审信息
     * @return {object} 更新 auditInfo
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reducePayrollPlanSubmitAudit(state, action) {
      const auditInfo = action.payload;
      return { ...state, auditInfo };
    },
  },
};
