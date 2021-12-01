/* eslint-disable comma-dangle */
/**
 * 结算设置-服务费规则生成 model
 *
 * @module model/financeRulesGenerator
 */
import is from 'is_js';

import {
  Unit,
  FinanceRulesGeneratorStep,
  FinanceQualityAwardType,
  FinanceQualityAwardOrPunish,
  SalaryExtractType,
  FinanceQualityType,
  FinanceSalaryManagementType,
  SalaryExtractListType,
  SalaryStationLevel,
  SalaryMonthState,
  FinanceQualityStaffOnDuty,
  SalaryRulesLadderCalculateType,
} from '../../application/define';

import {
  fetchGeneratorOrderTypes, // 获取单型指标数据
  fetchRulesGeneratorList, // 获取服务费规则明细列表
  updateFinanceRuleSort,
  deleteFinanceRulesGeneratorList,
  createFinanceRulesGeneratorListOne,
  createFinanceRulesGenerator,
  updateRulesGeneratorByState,
  createRulesGeneratorSteps,
} from '../../services/finance';

import { SalaryRuleListItem, SalaryVar } from '../../application/object/salary/test';


// 校验/转换payload到提交服务器params的方法集
const transferPayload = {
  // 获取指标id
  onGetOrderTypesID: (list = [], name) => {
    const data = list.filter(v => v.name === name);
    const obj = data[0] || {};
    return obj.id;
  },
  // 创建薪资规则第一步，单量
  createRulesFirst: (payload, orderTypes) => {
    const namespace = `${payload.platformCode}${payload.step}`;
    const data = orderTypes[namespace].data || [];
    const params = {
      payroll_mark: '',  // 薪资单对应列
      match_filters: [],
      compute_logic: {
        biz_logic: ['order_logic_range'], // 阶梯分段|阶梯变动
        params: {
          total_max_num: 0,
        },
      },
    };
    // step
    if (is.not.empty(payload.step) && is.existy(payload.step)) {
      params.collection_cate = payload.step;
    } else {
      throw new Error('step is required');
    }
    // ruleCollectionId
    if (is.not.empty(payload.ruleCollectionId) && is.existy(payload.ruleCollectionId)) {
      params.rule_collection_id = payload.ruleCollectionId;
    } else {
      throw new Error('ruleCollectionId is required');
    }
    // 当月在离职
    if (is.not.empty(payload.state) && is.existy(payload.state)) {
      const states = is.array(payload.state) ?
        payload.state.map(v => Number(v)) :
        [Number(payload.state)];
      // 判断是否包含全部，包含不传
      if (states.includes(SalaryMonthState.all) === false) {
        params.match_filters.push({
          var_name: '当月在离职',
          index: transferPayload.onGetOrderTypesID(data, '当月在离职'),
          symbol: 'in',
          value: states,
        });
      }
    }
    // 站点评星
    if (is.not.empty(payload.stationLevel) && is.existy(payload.stationLevel)) {
      const stationLevels = is.array(payload.stationLevel) ?
        payload.stationLevel.map(v => Number(v)) :
        [Number(payload.stationLevel)];
        // 判断是否包含全部，包含不传
      if (stationLevels.includes(SalaryStationLevel.all) === false) {
        params.match_filters.push({
          var_name: '站点评星',
          index: transferPayload.onGetOrderTypesID(data, '站点评星'),
          symbol: 'in',
          value: stationLevels,
        });
      }
    }
    // 方案提成
    if (is.not.empty(payload.type) && is.existy(payload.type)) {
      params.compute_logic.params.type = Number(payload.type);
    }
    // 单量规则
    if (is.not.empty(payload.rangeTable) && is.existy(payload.rangeTable)) {
      const rangeTable = payload.rangeTable.map((item) => {
        const newItem = {
          min: Number(item.min),
          symbol_min: item.symbolMin,
          index: payload.orderType,
          symbol_max: item.symbolMax,
          max: item.max,
          unit_amount: Number(item.unitAmount),
          money: Number(Unit.exchangePriceToCent(item.money)),
          min_money: 0,
        };
        return newItem;
      });
      params.compute_logic.params.range_table = rangeTable;
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 创建薪资规则第二步，出勤
  createRulesSecond: (payload, orderTypes) => {
    const namespace = `${payload.platformCode}${payload.step}`;
    const data = orderTypes[namespace].data || [];
    const params = {
      match_filters: [],
    };
    const computeLogic = {};
    const byOnceParams = {
      auto_dec_option: payload.autoDecOption, // 是否扣款
    }; // 总额补贴
    const byOrderUnitParams = {}; // 按单补贴
    const bySalaryBaseParams = {}; // 底薪补贴
    // 服务费规则集id
    if (is.existy(payload.ruleCollectionId) && is.not.empty(payload.ruleCollectionId)) {
      params.rule_collection_id = payload.ruleCollectionId;
    }
    // 步骤
    if (is.existy(payload.step) && is.not.empty(payload.step)) {
      params.collection_cate = payload.step;
    }
    // 当月在离职
    if (is.not.empty(payload.state) && is.existy(payload.state)) {
      const states = is.array(payload.state) ?
        payload.state.map(v => Number(v)) :
        [Number(payload.state)];
      // 判断是否包含全部，包含不传
      if (states.includes(SalaryMonthState.all) === false) {
        params.match_filters.push({
          var_name: '当月在离职',
          index: transferPayload.onGetOrderTypesID(data, '当月在离职'),
          symbol: 'in',
          value: states,
        });
      }
    }
    // 满足条件
    if (is.not.empty(payload.orderVars) && is.existy(payload.orderVars)) {
      const orderVars = {
        group_match: payload.orderVars.matchType,
      };
      // 总额补贴
      if ((is.not.empty(payload.orderVars.rules) && is.existy(payload.orderVars.rules)) &&
      (is.not.empty(payload.orderVars.rules[0]) && is.existy(payload.orderVars.rules[0]))) {
        orderVars.group_filters = payload.orderVars.rules.map((v) => {
          return {
            var_name: v.name,
            index: v.index,   // 指标
            symbol: v.symbol,  // 比较符
            value: Unit.dynamicExchange(v.num, v.unit), // 指标量
          };
        });
      }
      params.match_filters.push(orderVars);
    }
    // 总额补贴
    if (is.not.empty(payload.bizLogic) && is.existy(payload.bizLogic)) {
      computeLogic.biz_logic = Array.isArray(payload.bizLogic) ? payload.bizLogic : [payload.bizLogic];
    }
    // 一次性补贴
    if (is.not.empty(payload.onceMoney) && is.existy(payload.onceMoney)) {
      byOnceParams.once_money = Unit.exchangePriceToCent(payload.onceMoney);
    }
    // 奖罚金额指标
    if (is.not.empty(payload.unitIndex) && is.existy(payload.unitIndex)) {
      byOnceParams.unit_index = payload.unitIndex;
    }
     // 不满足？天
    if (is.not.empty(payload.decMinAmount) && is.existy(payload.decMinAmount)) {
      byOnceParams.dec_min_amount = payload.decMinAmount;
    }
    // 每 X 天
    if (is.not.empty(payload.decUnitAmount) && is.existy(payload.decUnitAmount)) {
      byOnceParams.dec_unit_amount = payload.decUnitAmount;
    }
    // 扣 ？元
    if (is.not.empty(payload.decUnitMoney) && is.existy(payload.decUnitMoney)) {
      byOnceParams.dec_unit_money = Unit.exchangePriceToCent(payload.decUnitMoney);
    }
    // 单量统计指标
    if (is.not.empty(payload.orderVarCount) && is.existy(payload.orderVarCount)) {
      byOrderUnitParams.unit_index = payload.orderVarCount;
    }
    // 每 X 单
    if (is.not.empty(payload.incUnitAmount) && is.existy(payload.incUnitAmount)) {
      byOrderUnitParams.inc_unit_amount = payload.incUnitAmount;
    }
    // 最小单量
    if (is.not.empty(payload.minAmount) && is.existy(payload.minAmount)) {
      byOrderUnitParams.min_amount = payload.minAmount;
    }
    // 补 Y 元
    if (is.not.empty(payload.incUnitMoney) && is.existy(payload.incUnitMoney)) {
      byOrderUnitParams.inc_unit_money = Unit.exchangePriceToCent(payload.incUnitMoney);
    }
    // 底薪？元
    if (is.not.empty(payload.salaryIncMoney) && is.existy(payload.salaryIncMoney)) {
      bySalaryBaseParams.salary_inc_money = Unit.exchangePriceToCent(payload.salaryIncMoney);
    }
    // 判断按单补贴是否有值
    if (is.not.empty(byOrderUnitParams) && is.existy(byOrderUnitParams)) {
      computeLogic.by_order_unit_params = byOrderUnitParams;
    }
    // 判断底薪补贴是否有值
    if (is.not.empty(bySalaryBaseParams) && is.existy(bySalaryBaseParams)) {
      computeLogic.by_salary_base_params = bySalaryBaseParams;
    }
    // 判断总额补贴是否有值
    if (is.not.empty(byOnceParams) && is.existy(byOnceParams)) {
      computeLogic.by_once_params = byOnceParams;
    }
    // 判断computeLogic是否有值
    if (is.not.empty(computeLogic) && is.existy(computeLogic)) {
      params.compute_logic = computeLogic;
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 创建薪资规则第三步，质量
  createRulesThird: (payload, orderTypes) => {
    const {
      step,
      ruleCollectionId,
      state,
      type,
    } = payload;
    const namespace = `${payload.platformCode}${step}`;
    // 第三步数据校验
    const params = {};
    params.match_filters = [];
    params.compute_logic = {};

    // 通用数据校验

    // step required
    if (is.existy(step) && is.not.empty(step)) {
      params.collection_cate = step;
    } else {
      throw new TypeError('step is required');
    }

    // id required
    if (is.existy(ruleCollectionId) && is.not.empty(ruleCollectionId)) {
      params.rule_collection_id = ruleCollectionId;
    } else {
      throw new TypeError('ruleCollectionId is required');
    }

    // 当月在离职必选(数组)
    if (is.existy(state) && is.not.empty(state)) {
      const states = is.array(state) ?
        state.map(v => Number(v)) :
        [Number(state)];
        // 判断是否包含全部，包含不传
      if (states.includes(FinanceQualityStaffOnDuty.all) === false) {
        params.match_filters.push({
          var_name: '当月在离职',
          index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '当月在离职'),
          symbol: 'in',
          value: states,
        });
      }
    } else {
      throw new TypeError('state is required');
    }

    if (is.not.existy(type) || is.empty(type)) {
      throw new TypeError('type is required');
    }

    if (type === FinanceQualityType.person) {
      // 质量类型
      params.match_filters.push({
        var_name: '评比分类',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '评比分类'),
        symbol: 'in',
        value: [FinanceQualityType.person],
      });
      transferPayload.qualityPerson(params, payload, orderTypes[namespace].data);
    } else if (type === FinanceQualityType.competition) {
      // 质量类型
      params.match_filters.push({
        var_name: '评比分类',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '评比分类'),
        symbol: 'in',
        value: [FinanceQualityType.competition],
      });
      transferPayload.qualityCompetition(params, payload, orderTypes);
    } else {
      throw new TypeError('type is invalid');
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 创建薪资规则第四步，管理
  createRulesForth: (payload, orderTypes) => {
    const params = {};
    const matchFilters = [];
    const computeLogic = {};
    const computeLogicParams = {};
    const orderVars = {};
    const bizLogic = [];
    const namespace = `${payload.platformCode}${payload.step}`;
    // 服务费规则集id
    if (is.existy(payload.ruleCollectionId) && is.not.empty(payload.ruleCollectionId)) {
      params.rule_collection_id = payload.ruleCollectionId;
    }
    // 步骤
    if (is.existy(payload.step) && is.not.empty(payload.step)) {
      params.collection_cate = payload.step;
    }
    // 类型
    if (is.existy(payload.bizCate) && is.not.empty(payload.bizCate)) {
      matchFilters.push({
        var_name: '管理扣款分类',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '管理扣款分类'),
        symbol: 'in',
        value: [payload.bizCate],
      });
    }
    // 明细项
    if (is.existy(payload.bizCateItem) && is.not.empty(payload.bizCateItem)) {
      // matchFilters.biz_cate_item = [Number(payload.bizCateItem)];
      matchFilters.push({
        var_name: '保险扣款项',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '保险扣款项'),
        symbol: 'in',
        value: [payload.bizCateItem],
      });
    }
    // 险种
    if (is.existy(payload.bizCateItemNote) && is.not.empty(payload.bizCateItemNote)) {
      // matchFilters.biz_cate_item_note = payload.bizCateItemNote;
      matchFilters.push({
        var_name: '险种',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '险种'),
        symbol: 'in',
        value: [payload.bizCateItemNote],
      });
    }

    // 物资
    if (payload.bizCate === FinanceSalaryManagementType.supplies) {
      // 出勤天数
      if (is.existy(payload.attendanceDays) && is.not.empty(payload.attendanceDays)) {
        orderVars.attendance_days = payload.attendanceDays;
      }
      // 在职天数
      if (is.existy(payload.workDays) && is.not.empty(payload.workDays)) {
        orderVars.work_days = payload.workDays;
      }
      // 满足条件
      if (is.existy(payload.matchType) && is.not.empty(payload.matchType)) {
        orderVars.match_type = payload.matchType;
        orderVars.type = 'compose';
      }
      // 条件规则
      if (is.existy(orderVars) && is.not.empty(orderVars)) {
        matchFilters.order_vars = orderVars;
      }
      computeLogicParams.total_max_num = 0; // 累计最大值
      computeLogicParams.type = 2; // 阶梯类型
      if (is.existy(payload.rangeTable) && is.not.empty(payload.rangeTable)) {
        computeLogicParams.range_table = payload.rangeTable.map((item) => {
          return {
            index: item.index,
            min: item.min,
            money: Unit.exchangePriceToCent(item.money),
            max: item.max,
            symbol_max: item.symbolMax,
            symbol_min: item.symbolMin,
          };
        });
      }
    }

    // 保险
    if (payload.bizCate === FinanceSalaryManagementType.insurance) {
      // 按天扣款
      if (is.existy(payload.dayFlag) && payload.dayFlag === true) {
        bizLogic.push('dec_logic_by_day');
      }
      // 统计指标
      if (is.existy(payload.unitIndex) && is.not.empty(payload.unitIndex)) {
        computeLogicParams.unit_index = payload.unitIndex;
      }
      // 最小天数
      if (is.existy(payload.unitAmount) && is.not.empty(payload.unitAmount)) {
        computeLogicParams.unit_amount = payload.unitAmount;
      }
      // 保险扣款金额
      if (is.existy(payload.unitMoney) && is.not.empty(payload.unitMoney)) {
        computeLogicParams.unit_money = Unit.exchangePriceToCent(payload.unitMoney);
      }
      // 按月扣款
      if (is.existy(payload.monthFlag) && payload.monthFlag === true) {
        bizLogic.push('dec_logic_by_once');
      }
      // 扣罚金额总额
      if (is.existy(payload.decMoney) && is.not.empty(payload.decMoney)) {
        computeLogicParams.dec_money = Unit.exchangePriceToCent(payload.decMoney);
      }
    }

    // 判断matchFilters是否有值
    if (is.not.empty(matchFilters) && is.existy(matchFilters)) {
      params.match_filters = matchFilters;
    }
    // 判断bizLogic是否有值
    if (is.not.empty(bizLogic) && is.existy(bizLogic)) {
      computeLogic.biz_logic = bizLogic;
    }
    // 判断computeLogicParams是否有值
    if (is.not.empty(computeLogicParams) && is.existy(computeLogicParams)) {
      computeLogic.params = computeLogicParams;
    }
    // 判断computeLogic是否有值
    if (is.not.empty(computeLogic) && is.existy(computeLogic)) {
      params.compute_logic = computeLogic;
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 编辑薪资规则第一步, 单量
  updateRulesFirst: (payload, orderTypes) => {
    const { computeLogic, matchFilters, step, id } = payload;
    const namespace = `${payload.platformCode}${step}`;
    const data = orderTypes[namespace].data || [];
    const params = {
      payroll_mark: '',  // 结算单对应列
      compute_logic: {
        biz_logic: ['order_logic_range'], // 阶梯分段|阶梯变动
        params: {
          total_max_num: 0,
        },
      },
      match_filters: [],
    };
    // step required
    if (is.existy(step) && is.not.empty(step)) {
      params.collection_cate = step;
    } else {
      throw new TypeError('step is required');
    }
    // objectId
    if (is.not.empty(id) && is.existy(id)) {
      params._id = id;
    } else {
      throw new Error('objectId is required');
    }
    if (is.not.empty(computeLogic) && is.existy(computeLogic)) {
      // 方案提成
      if (is.not.empty(computeLogic.type) && is.existy(computeLogic.type)) {
        params.compute_logic.params.type = Number(computeLogic.type);
      }
      // 单量规则
      if (is.not.empty(computeLogic.rangeTable) && is.existy(computeLogic.rangeTable)) {
        const rangeTable = computeLogic.rangeTable.map((item) => {
          return {
            index: item.index,
            symbol_min: item.symbolMin,
            money: Number(Unit.exchangePriceToCent(item.money)),
            min: Number(item.min),
            max: item.max,
            unit_amount: Number(item.unitAmount),
            symbol_max: item.symbolMax,
            min_money: 0,
          };
        });
        params.compute_logic.params.range_table = rangeTable;
      }
    }
    if (is.not.empty(matchFilters) && is.existy(matchFilters)) {
      // 当月在离职
      if (is.not.empty(matchFilters.state) && is.existy(matchFilters.state)) {
        params.match_filters.push({
          var_name: '当月在离职',
          index: transferPayload.onGetOrderTypesID(data, '当月在离职'),
          symbol: 'in',
          value: matchFilters.state,
        });
      }
      // 站点评星
      if (is.not.empty(matchFilters.stationLevel) && is.existy(matchFilters.stationLevel)) {
        params.match_filters.push({
          var_name: '站点评星',
          index: transferPayload.onGetOrderTypesID(data, '站点评星'),
          symbol: 'in',
          value: matchFilters.stationLevel,
        });
      }
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 编辑薪资规则第二步，出勤
  updateRulesSecond: (payload, orderTypes) => {
    const namespace = `${payload.platformCode}${payload.step}`;
    const data = orderTypes[namespace].data || [];
    const params = {
      match_filters: [],
    };
    const computeLogic = {};
    const byOnceParams = {
      auto_dec_option: payload.autoDecOption, // 是否扣款
    }; // 总额补贴
    const byOrderUnitParams = {}; // 按单补贴
    const bySalaryBaseParams = {}; // 底薪补贴
    // 服务费规则集id
    if (is.existy(payload.id) && is.not.empty(payload.id)) {
      params._id = payload.id;
    }
    // 步骤
    if (is.existy(payload.step) && is.not.empty(payload.step)) {
      params.collection_cate = payload.step;
    }
    // 当月在离职
    if (is.not.empty(payload.state) && is.existy(payload.state)) {
      const states = is.array(payload.state) ?
        payload.state.map(v => Number(v)) :
        [Number(payload.state)];
      // 判断是否包含全部，包含不传
      if (states.includes(SalaryMonthState.all) === false) {
        params.match_filters.push({
          var_name: '当月在离职',
          index: transferPayload.onGetOrderTypesID(data, '当月在离职'),
          symbol: 'in',
          value: states,
        });
      }
    }
    // 满足条件
    if (is.not.empty(payload.orderVars) && is.existy(payload.orderVars)) {
      const orderVars = {
        group_match: payload.orderVars.matchType,
      };
        // 当月在离职
      if ((is.not.empty(payload.orderVars.rules) && is.existy(payload.orderVars.rules)) &&
        (is.not.empty(payload.orderVars.rules[0]) && is.existy(payload.orderVars.rules[0]))) {
        orderVars.group_filters = payload.orderVars.rules.map((v) => {
          return {
            var_name: v.name,
            index: v.index,   // 指标
            symbol: v.symbol,  // 比较符
            value: Unit.dynamicExchange(v.num, v.unit), // 指标量
          };
        });
      }
      params.match_filters.push(orderVars);
    }
    // 总额补贴
    if (is.not.empty(payload.bizLogic) && is.existy(payload.bizLogic)) {
      computeLogic.biz_logic = Array.isArray(payload.bizLogic) ? payload.bizLogic : [payload.bizLogic];
    }
    // 一次性补贴
    if (is.not.empty(payload.onceMoney) && is.existy(payload.onceMoney)) {
      byOnceParams.once_money = Unit.exchangePriceToCent(payload.onceMoney);
    }
    // 奖罚金额指标
    if (is.not.empty(payload.unitIndex) && is.existy(payload.unitIndex)) {
      byOnceParams.unit_index = payload.unitIndex;
    }
    // 不满足？天
    if (is.not.empty(payload.decMinAmount) && is.existy(payload.decMinAmount)) {
      byOnceParams.dec_min_amount = payload.decMinAmount;
    }
    // 每 X 天
    if (is.not.empty(payload.decUnitAmount) && is.existy(payload.decUnitAmount)) {
      byOnceParams.dec_unit_amount = payload.decUnitAmount;
    }
    // 扣 ？元
    if (is.not.empty(payload.decUnitMoney) && is.existy(payload.decUnitMoney)) {
      byOnceParams.dec_unit_money = Unit.exchangePriceToCent(payload.decUnitMoney);
    }
    // 单量统计指标
    if (is.not.empty(payload.orderVarCount) && is.existy(payload.orderVarCount)) {
      byOrderUnitParams.unit_index = payload.orderVarCount;
    }
    // 每 X 单
    if (is.not.empty(payload.incUnitAmount) && is.existy(payload.incUnitAmount)) {
      byOrderUnitParams.inc_unit_amount = payload.incUnitAmount;
    }
    // 最小单量
    if (is.not.empty(payload.minAmount) && is.existy(payload.minAmount)) {
      byOrderUnitParams.min_amount = payload.minAmount;
    }
    // 补 Y 元
    if (is.not.empty(payload.incUnitMoney) && is.existy(payload.incUnitMoney)) {
      byOrderUnitParams.inc_unit_money = Unit.exchangePriceToCent(payload.incUnitMoney);
    }
    // 底薪？元
    if (is.not.empty(payload.salaryIncMoney) && is.existy(payload.salaryIncMoney)) {
      bySalaryBaseParams.salary_inc_money = Unit.exchangePriceToCent(payload.salaryIncMoney);
    }
    // 判断按单补贴是否有值
    if (is.not.empty(byOrderUnitParams) && is.existy(byOrderUnitParams)) {
      computeLogic.by_order_unit_params = byOrderUnitParams;
    }
    // 判断底薪补贴是否有值
    if (is.not.empty(bySalaryBaseParams) && is.existy(bySalaryBaseParams)) {
      computeLogic.by_salary_base_params = bySalaryBaseParams;
    }
    // 判断总额补贴是否有值
    if (is.not.empty(byOnceParams) && is.existy(byOnceParams)) {
      computeLogic.by_once_params = byOnceParams;
    }
    // 判断computeLogic是否有值
    if (is.not.empty(computeLogic) && is.existy(computeLogic)) {
      params.compute_logic = computeLogic;
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 编辑薪资规则第三步, 质量
  updateRulesThird: (payload, orderTypes) => {
    const {
      id,
      step,
      type,
      state,
    } = payload;
    const namespace = `${payload.platformCode}${step}`;
    // 第三步数据校验
    const params = {};
    params.match_filters = [];
    params.compute_logic = {};

    // id
    if (is.existy(id) && is.not.empty(id)) {
      params._id = id;
    } else {
      throw new TypeError('id is required');
    }

    // 步骤
    if (is.existy(step) && is.not.empty(step)) {
      params.collection_cate = step;
    }

    // 当月在离职必选(数组)
    if (is.existy(state) && is.not.empty(state)) {
      const states = is.array(state) ?
        state.map(v => Number(v)) :
        [Number(state)];
      // 判断是否包含全部，包含不传
      if (states.includes(FinanceQualityStaffOnDuty.all) === false) {
        params.match_filters.push({
          var_name: '当月在离职',
          index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '当月在离职'),
          symbol: 'in',
          value: states,
        });
      }
    }

    if (is.not.existy(type) || is.empty(type)) {
      throw new TypeError('type is required');
    }

    if (type === FinanceQualityType.person) {
      params.match_filters.push({
        var_name: '评比分类',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '评比分类'),
        symbol: 'in',
        value: [FinanceQualityType.person],
      });
      transferPayload.qualityPerson(params, payload, orderTypes[namespace].data);
    } else if (type === FinanceQualityType.competition) {
      params.match_filters.push({
        var_name: '评比分类',
        index: transferPayload.onGetOrderTypesID(orderTypes[namespace].data, '评比分类'),
        symbol: 'in',
        value: [FinanceQualityType.competition],
      });
      transferPayload.qualityCompetition(params, payload, orderTypes);
    } else {
      throw new TypeError('type is invalid');
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 编辑服务费规则第四步，管理
  updateRulesForth: (payload) => {
    const params = {};
    const matchFilters = [];
    const computeLogic = {};
    const computeLogicParams = {};
    // const orderVars = {};
    const bizLogic = [];
    // 服务费规则集id
    if (is.existy(payload.id) && is.not.empty(payload.id)) {
      params._id = payload.id;
    }
    // 步骤
    if (is.existy(payload.step) && is.not.empty(payload.step)) {
      params.collection_cate = payload.step;
    }
    // // 类型
    // if (is.existy(payload.bizCate) && is.not.empty(payload.bizCate)) {
    //   matchFilters.biz_cate = payload.bizCate;
    // }
    // // 明细项
    // if (is.existy(payload.bizCateItem) && is.not.empty(payload.bizCateItem)) {
    //   matchFilters.biz_cate_item = payload.bizCateItem;
    // }
    //
    // // 险种
    // if (is.existy(payload.bizCateItemNote) && is.not.empty(payload.bizCateItemNote)) {
    //   matchFilters.biz_cate_item_note = payload.bizCateItemNote;
    // }
    if (is.existy(payload.matchFilters) && is.not.empty(payload.matchFilters)) {
      payload.matchFilters.forEach((item) => {
        matchFilters.push({
          index: item.index,
          value: item.value,
          var_name: item.varName,
          symbol: item.symbol
        });
      });
      params.match_filters = matchFilters;
    }

    // // 物资
    // if (payload.bizCate[0] === FinanceSalaryManagementType.supplies) {
    //   // 出勤天数
    //   if (is.existy(payload.attendanceDays) && is.not.empty(payload.attendanceDays)) {
    //     orderVars.attendance_days = payload.attendanceDays;
    //   }
    //   // 在职天数
    //   if (is.existy(payload.workDays) && is.not.empty(payload.workDays)) {
    //     orderVars.work_days = payload.workDays;
    //   }
    //   // 满足条件
    //   if (is.existy(payload.matchType) && is.not.empty(payload.matchType)) {
    //     orderVars.match_type = payload.matchType;
    //     orderVars.type = 'compose';
    //   }
    //   // 条件规则
    //   if (is.existy(orderVars) && is.not.empty(orderVars)) {
    //     matchFilters.order_vars = orderVars;
    //   }
    //   computeLogicParams.total_max_num = 0; // 累计最大值
    //   computeLogicParams.type = 2; // 阶梯类型
    //   if (is.existy(payload.rangeTable) && is.not.empty(payload.rangeTable)) {
    //     computeLogicParams.range_table = payload.rangeTable.map((item) => {
    //       return {
    //         index: item.index,
    //         min: item.min,
    //         money: Unit.exchangePriceToCent(item.money),
    //         max: item.max,
    //         symbol_max: item.symbolMax,
    //         symbol_min: item.symbolMin,
    //       };
    //     });
    //   }
    // }

    // 保险
    // if (payload.bizCate[0] === FinanceSalaryManagementType.insurance) {
      // 按天扣款
    if (is.existy(payload.dayFlag) && payload.dayFlag === true) {
      bizLogic.push('dec_logic_by_day');
    }
    // 统计指标
    if (is.existy(payload.unitIndex) && is.not.empty(payload.unitIndex)) {
      computeLogicParams.unit_index = payload.unitIndex;
    }
    // 最小天数
    if (is.existy(payload.unitAmount) && is.not.empty(payload.unitAmount)) {
      computeLogicParams.unit_amount = payload.unitAmount;
    }
    // 保险扣款金额
    if (is.existy(payload.unitMoney) && is.not.empty(payload.unitMoney)) {
      computeLogicParams.unit_money = Unit.exchangePriceToCent(payload.unitMoney);
    }
    // 按月扣款
    if (is.existy(payload.monthFlag) && payload.monthFlag === true) {
      bizLogic.push('dec_logic_by_once');
    }
    // 扣罚金额总额
    if (is.existy(payload.decMoney) && is.not.empty(payload.decMoney)) {
      computeLogicParams.dec_money = Unit.exchangePriceToCent(payload.decMoney);
    }
    // }
    // // 判断matchFilters是否有值
    // if (is.not.empty(matchFilters) && is.existy(matchFilters)) {
    //   params.match_filters = matchFilters;
    // }
    // 判断bizLogic是否有值
    if (is.not.empty(bizLogic) && is.existy(bizLogic)) {
      computeLogic.biz_logic = bizLogic;
    }
    // 判断computeLogicParams是否有值
    if (is.not.empty(computeLogicParams) && is.existy(computeLogicParams)) {
      computeLogic.params = computeLogicParams;
    }
    // 判断computeLogic是否有值
    if (is.not.empty(computeLogic) && is.existy(computeLogic)) {
      params.compute_logic = computeLogic;
    }
    // 结算单对应列
    if (is.not.empty(payload.payrollMark) && is.existy(payload.payrollMark)) {
      params.payroll_mark = payload.payrollMark;
    }
    return params;
  },
  // 服务费规则质量奖励法
  qualityRuleAward: (param, payload) => {
    const {
      awardType,
      ladderAwardRule,
      multipleConditions,
      orderType,
      orderTypeUnit,
      rewardMoneyLimit,
    } = payload;
    const params = param;

    if (awardType === FinanceQualityAwardType.ladder) {
      // 奖励方式
      params.compute_logic.biz_logic.push('qc_logic_by_range');
      // 阶梯奖励
      params.compute_logic.range_params = {};
      // 阶梯类型(阶梯变动)
      params.compute_logic.range_params.type = SalaryExtractType.segmentation;
      // 指标
      if (is.existy(orderType) && is.not.empty(orderType)) {
        params.compute_logic.range_params.index = orderType;
      } else {
        throw new TypeError('orderType is required');
      }
      // 累加最大值(money)
      if (is.existy(rewardMoneyLimit) && is.not.empty(rewardMoneyLimit)) {
        params.compute_logic.range_params.total_max_num = Unit.exchangePriceToCent(rewardMoneyLimit);
      } else {
        throw new TypeError('rewardMoneyLimit is required');
      }
      // 阶梯奖励
      if (is.existy(ladderAwardRule) && is.not.empty(ladderAwardRule)) {
        params.compute_logic.range_params.range_table = ladderAwardRule.map((v) => {
          return {
            min: Unit.dynamicExchange(v.startOrder, orderTypeUnit), // 最小值
            symbol_min: '<',   // 第一个比较符
            index: orderType, // 指标
            symbol_max: v.compareType, // 第二个比较值
            max: Unit.dynamicExchange(v.endOrder, orderTypeUnit),  // 最大值
            // money(奖励为正数,扣罚为负数)
            money: Number(v.awardOrPunish) === FinanceQualityAwardOrPunish.award ?
              Unit.exchangePriceToCent(v.money) :
              -Unit.exchangePriceToCent(Number(v.money)),
            // money(奖励为正数,扣罚为负数)
            min_money: Number(v.awardOrPunish) === FinanceQualityAwardOrPunish.award ?
              Unit.exchangePriceToCent(v.minMoney) :
              -Unit.exchangePriceToCent(Number(v.minMoney)),
            unit_amount: Unit.dynamicExchange(v.unitAmount, orderTypeUnit), // 步长
            // 按和档位最高值不足部分（和档位上限差额值）计算 False 按实际量计算
            delta_flag: Number(v.calculateType) === SalaryRulesLadderCalculateType.difference,
          };
        });
      } else {
        throw new TypeError('ladderAwardRule is required');
      }
    } else if (awardType === FinanceQualityAwardType.mutipleConditions) {
      // 多条件筛选
      // 奖励方式
      params.compute_logic.biz_logic.push('qc_logic_by_multiple');
      // 多条件奖励
      if (is.existy(multipleConditions) && is.not.empty(multipleConditions)) {
        params.compute_logic.multiple_params = multipleConditions.map((rawValue) => {
          const {
            award: {
              awardOrPunish,
              compareItem,
              money,
              index,
              unit,
            },
            conditions: {
              rules,
            },
          } = rawValue;
          return {

            match_type: 1, // 条件类型(全部满足)
            rules: rules.map((v) => {
              return {
                index: v.index,   // 指标
                symbol: v.symbol,  // 比较符
                num: Unit.dynamicExchange(v.num, v.unit), // 指标量
              };
            }),
            unit_index: compareItem,  // 根据?指标
            unit_amount: Unit.dynamicExchange(index, unit), // 每?指标量
            // money(奖励为正数,扣罚为负数)
            unit_money: Number(awardOrPunish) === FinanceQualityAwardOrPunish.award ?
              Unit.exchangePriceToCent(money) :
              -Unit.exchangePriceToCent(money),
          };
        });
      } else {
        throw new TypeError('mutipleConditions is required');
      }
    }
  },
  // 薪资规则质量单人考核
  qualityPerson: (param, payload, orderTypes) => {
    const {
      statisticsTime,
      orderIndex,
    } = payload;
    const params = param;
    // 单人考核

    // 条件规则
    if (is.existy(orderIndex) && is.not.empty(orderIndex)) {
      params.match_filters.push({
        group_match: orderIndex.matchType,
        group_filters: orderIndex.rules.map((v) => {
          return {
            var_name: v.name,
            index: v.index,
            symbol: v.symbol,
            value: Unit.dynamicExchange(v.num, v.unit),
          };
        }),
      });
    } else {
      throw new TypeError('orderIndex is required');
    }

    // 计算逻辑

    // 数据统计时间必选(数字)
    if (is.existy(statisticsTime) && is.not.empty(statisticsTime)) {
      const statisticsTimes = is.array(statisticsTime) ? statisticsTime.map(v => Number(v)) : [Number(statisticsTime)];
      params.match_filters.push({
        var_name: '数据统计时间',
        index: transferPayload.onGetOrderTypesID(orderTypes, '数据统计时间'),
        symbol: 'in',
        value: statisticsTimes,
      });
    } else {
      throw new TypeError('statisticsTime is required');
    }

    // 奖励
    params.compute_logic.biz_logic = [];
    transferPayload.qualityRuleAward(params, payload);
  },
  // 薪资规则质量竞赛评比
  qualityCompetition: (param, payload, list = []) => {
    const {
      statisticsTime,
      sortIndex,
      sortOrder,
      awardSetting,
      rankSetting,
      rank,
      orderIndex,
      minPeople,
      maxPeople,
    } = payload;
    const namespacetwo = `${payload.platformCode}${payload.step}`;
    const namespaceone = `${payload.platformCode}${payload.step}`;
    const orderTypes = list[namespacetwo].data;
    const orderTypeone = list[namespaceone].data;
    const params = param;
    params.sort_options = [];
    // 竞赛评比


    // 数据统计时间必选(数字)
    if (is.existy(statisticsTime) && is.not.empty(statisticsTime)) {
      const statisticsTimes = is.array(statisticsTime) ? statisticsTime.map(v => Number(v)) : [Number(statisticsTime)];
      params.match_filters.push({
        var_name: '数据统计时间',
        index: transferPayload.onGetOrderTypesID(orderTypes, '数据统计时间'),
        symbol: 'in',
        value: statisticsTimes,
      });
    } else {
      throw new TypeError('statisticsTime is required');
    }
    // 筛选条件
    if (is.existy(orderIndex) && is.not.empty(orderIndex)) {
      params.match_filters.push({
        group_match: orderIndex.matchType,
        group_filters: orderIndex.rules.map((v) => {
          return {
            var_name: v.name,
            index: v.index,
            symbol: v.symbol,
            value: Unit.dynamicExchange(v.num, v.unit),
          };
        }),
      });
    } else {
      throw new TypeError('orderIndexMutiple is required');
    }

    // 排序指标必选(字符串)
    if (is.existy(sortIndex) && is.not.empty(sortIndex)) {
      const name = orderTypeone.filter(v => v.id === sortIndex)[0].name;
      const sortTarget = {
        var_name: name,
        index: sortIndex,
      };
        // 排序方式必选(数字)
      if (is.existy(sortOrder) && is.not.empty(sortOrder)) {
        sortTarget.direction = Number(sortOrder);
      } else {
        throw new TypeError('sortOrder is required');
      }
      params.sort_options.push(sortTarget);
    } else {
      throw new TypeError('sortIndex is required');
    }

    // 最小人数
    if (is.existy(minPeople) && is.not.empty(minPeople)) {
      const peopleNum = { group_match: 'all' };
      peopleNum.group_filters = [];
      peopleNum.group_filters.push({
        var_name: '入选人数',
        index: transferPayload.onGetOrderTypesID(orderTypes, '入选人数'),
        symbol: '>=', // 最小
        value: Number(minPeople),
      });
      // 最大人数
      if (is.existy(maxPeople) && is.not.empty(maxPeople)) {
        peopleNum.group_filters.push({
          var_name: '入选人数',
          index: transferPayload.onGetOrderTypesID(orderTypes, '入选人数'),
          symbol: '<=', // 最大
          value: Number(maxPeople),
        });
      } else {
        // 若未填写最大人数, 表示不限, 传给后端<=0的值即可
        peopleNum.group_filters.push({
          var_name: '入选人数',
          index: transferPayload.onGetOrderTypesID(orderTypes, '入选人数'),
          symbol: '<=', // 最大
          value: -1,
        });
      }
      params.match_filters.push(peopleNum);
    } else {
      throw new TypeError('minPeople is required');
    }

    // 1.奖励法 2.竞赛评比
    params.compute_logic.biz_logic = [];
    if (is.existy(awardSetting) && is.not.empty(awardSetting)) {
      if (awardSetting === true) {
        // 奖励法
        transferPayload.qualityRuleAward(params, payload);
      }
    } else {
      throw new TypeError('awardSetting is required');
    }

    if (is.existy(rankSetting) && is.not.empty(rankSetting)) {
      if (rankSetting === true) {
        params.compute_logic.biz_logic.push('qc_logic_battle');
        if (is.existy(rank) && is.not.empty(rank)) {
          params.compute_logic.battle_params = {
            rank_sum: rank.rankSum,
            ladder: rank.rankLadder.map((v) => {
              return {
                rank_from: v.interval[0],  // 第n名开始
                rank_to: v.interval[1],    // 到第n名
                money: Unit.exchangePriceToCent(v.money),         // 奖励的钱
              };
            }),
          };
        } else {
          throw new TypeError('rank is required');
        }
      }
    } else {
      throw new TypeError('rankSetting is required');
    }
  },
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'financeRulesGenerator',

  /**
   * 状态树
   * @prop {object} orderTypes 获取单型指标数据
   * @prop {object} financeRulesGeneratorList 服务费规则明细列表数据
   */
  state: {
    orderTypes: {
      /* [paramsStr]: {
        time: , // 上次请求成功时间
        currentTask: [], // 当前是否有请求
        data: , []// 数据
      }, */
    }, // 单型指标
    /**
     * 服务费规则明细列表
     * 按步骤划分
     */
    financeRulesGeneratorList: {
      /* ruleCollectionId: {
        [FinanceRulesGeneratorStep.first]: {}, // 第一步
        [FinanceRulesGeneratorStep.second]: {}, // 第二步
        [FinanceRulesGeneratorStep.third]: {}, // 第三步
        [FinanceRulesGeneratorStep.forth]: {}, // 第四步
      }, */
    },
  },

  /**
   * @namespace financeRulesGenerator/effects
   */
  effects: {
    /**
     * 创建服务费规则步骤
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *createRulesGeneratorSteps({ payload }, { put, select }) {
      const orderTypes = yield select(state => state.financeRulesGenerator.orderTypes);
      const { step } = payload;
      // 提交到服务器的参数
      let params = {};
      if (step === FinanceRulesGeneratorStep.first) {
        // 第一步数据校验
        params = transferPayload.createRulesFirst(payload, orderTypes);
      } else if (step === FinanceRulesGeneratorStep.second) {
        // 第二步数据校验
        params = transferPayload.createRulesSecond(payload, orderTypes);
      } else if (step === FinanceRulesGeneratorStep.third) {
        // 第三步数据校验
        params = transferPayload.createRulesThird(payload, orderTypes);
      } else if (step === FinanceRulesGeneratorStep.forth) {
        // 第四步数据校验
        params = transferPayload.createRulesForth(payload, orderTypes);
      } else {
        // step 错误
        throw new TypeError('step must be one of \'1 2 3 4\'');
      }
      // 业务请求
      const request = {
        params, // 接口参数
        service: createRulesGeneratorSteps,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取服务费规则明细列表
     * @param {string} state 状态
     * @param {object} _meta 分页格式
     * @param {unknow} collection_cate 通用数据校验
     * @param {string} rule_collection_id ruleCollectionId
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *fetchRulesGeneratorList({ payload }, { call, put }) {
      const params = {
        state: SalaryExtractListType.normal,
        _meta: { page: 1, limit: 1000 },
      };
      const {
        step,
        ruleCollectionId,
      } = payload;

      // 通用数据校验
      // step required
      if (is.existy(step) && is.not.empty(step)) {
        params.collection_cate = step;
      } else {
        throw new TypeError('step is required');
      }
      // ruleCollectionId
      if (is.not.empty(ruleCollectionId) && is.existy(ruleCollectionId)) {
        params.rule_collection_id = ruleCollectionId;
      } else {
        throw new Error('ruleCollectionId is required');
      }

      const result = yield call(fetchRulesGeneratorList, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceRulesGeneratorList', payload: { result, step, ruleCollectionId } });
      }
    },

    /**
     * 服务费规则/服务费规则生成/列表删除
     * @param {string} _id id
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *deleteFinanceRulesGeneratorList({ payload }, { put }) {
      const params = {
        _id: payload.id,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: deleteFinanceRulesGeneratorList,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费规则保存
     * @param {string} plan_version_id 方案id
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *createFinanceRulesGenerator({ payload }, { put }) {
      const params = {
        plan_version_id: payload.planVersionId,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: createFinanceRulesGenerator,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费规则列表保存
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *createFinanceRulesGeneratorListOne({ payload }, { put, select }) {
      let params = {};
      const orderTypes = yield select(state => state.financeRulesGenerator.orderTypes);
      const {
        step,
      } = payload;
      if (step === FinanceRulesGeneratorStep.first) {
        // 第一步数据校验
        params = transferPayload.updateRulesFirst(payload, orderTypes);
      } else if (step === FinanceRulesGeneratorStep.second) {
        // 第二步数据校验
        params = transferPayload.updateRulesSecond(payload, orderTypes);
      } else if (step === FinanceRulesGeneratorStep.third) {
        // 第三步数据校验
        params = transferPayload.updateRulesThird(payload, orderTypes);
      } else if (step === FinanceRulesGeneratorStep.forth) {
        // 第四步数据校验
        params = transferPayload.updateRulesForth(payload, orderTypes);
      } else {
        // step 错误
        throw new TypeError('step must be one of \'1 2 3 4\'');
      }
      // 业务请求
      const request = {
        params, // 接口参数
        service: createFinanceRulesGeneratorListOne,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 启用|不使用服务费规则
     * @param {string} rule_collection_id unknow
     * @param {unknow} rule_flag unknow
     * @param {unknow} type unknow
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *updateRulesGeneratorByEnableDisable({ payload }, { put }) {
      const params = {
        rule_collection_id: payload.ruleCollectionId,
        rule_flag: payload.ruleFlag,
        type: payload.step,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: updateRulesGeneratorByState,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 服务费规则/服务费规则生成/列表上移|下移
     * @param {string} up_id unknow
     * @param {string} down_id unknow
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *updateFinanceRuleSort({ payload }, { put }) {
      const params = {
        up_id: payload.upId,
        down_id: payload.downId,
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: updateFinanceRuleSort,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取单型指标
     * @param {array} platform_code 平台
     * @param {number} state 状态
     * @param {array} tags 步骤
     * @param {object} _meta 分页格式
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/effects
     */
    *fetchGeneratorOrderTypes({ payload }, { put, call }) {
      const params = {
        platform_code: payload.platformCode,
        state: 100, // 状态
        tags: payload.tags,
        _meta: { page: 1, limit: 1000 },
      };
      // 平台
      if (is.not.empty(payload.platformCode) && is.existy(payload.platformCode)) {
        params.platform_code = payload.platformCode;
      }
      // 步骤
      if (is.not.empty(payload.tags) && is.existy(payload.tags)) {
        params.tags = payload.tags;
      }
      // 用两个参数的唯一组合作为namespace,防止数据互相影响
      const namespace = `${payload.platformCode}${payload.tags}`;
      const result = yield call(fetchGeneratorOrderTypes, params);
      if (result !== undefined) {
        yield put({
          type: 'reduceGeneratorOrderTypes',
          payload: { namespace, result },
        });
      }
    },
  },

  /**
   * @namespace financeRulesGenerator/reducers
   */
  reducers: {
    /**
     * 获取服务费规则明细列表数据
     * @returns {object} 更新 financeRulesGeneratorList
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/reducers
     */
    reduceRulesGeneratorList(state, action) {
      // mock的数据映射,方便以后替换
      const mapperMetaMock = meta => meta;
      // const mapperDataMock = data => data;
      return {
        ...state,
        financeRulesGeneratorList: {
          ...state.financeRulesGeneratorList,
          [action.payload.ruleCollectionId]: {
            ...state.financeRulesGeneratorList[action.payload.ruleCollectionId],
            [action.payload.step]: {
              meta: mapperMetaMock(action.payload.result.meta),
              data: SalaryRuleListItem.mapperEach(action.payload.result.data, SalaryRuleListItem),
            },
          },
        },
      };
    },

    /**
     * 获取单型指标数据
     * @returns {object} 更新 orderTypes
     * @memberof module:model/financeRulesGenerator~financeRulesGenerator/reducers
     */
    reduceGeneratorOrderTypes(state, action) {
      const {
        namespace,
        result,
      } = action.payload;
      const data = SalaryVar.mapperEach(result.data, SalaryVar);
      const unitText = state.orderTypes.unitText || {};
      // id和指标单位名称的对应关系
      data.forEach((v) => {
        unitText[v.id] = v.unitText;
      });
      return {
        ...state,
        orderTypes: {
          ...state.orderTypes,
          unitText,
          [namespace]: {
            data,
          },
        },
      };
    },
  },
};
