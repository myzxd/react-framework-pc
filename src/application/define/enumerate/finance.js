import is from 'is_js';
// 骑士分类
const FinanceKnightClassification = {
  newKnight: 1, // 新骑士
  oldKnight: 2, // 老骑士
  all: 100, // 全部
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.newKnight:
        return '新骑士';
      case this.oldKnight:
        return '老骑士';
      case this.all:
        return '全部';
      default:
        return '未定义';
    }
  },
};

// 薪资规则，筛选value数据
const FinanceMatchFiltersValue = {
  description(data = [], name, flag) {
    if (flag === true) {
      return data.filter(v => v.groupMatch);
    }
    const list = data.filter(v => v.varName === name);
    const obj = list[0] || {};
    return obj.value || [];
  },
};

// 质量类型
const FinanceQualityType = {
  person: 1, // 单人
  competition: 2, // 竞赛
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.person:
        return '单人考核';
      case this.competition:
        return '竞赛评比';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比数据统计时间
const FinanceQualityStatisticsTime = {
  day: 1, // 日
  month: 2, // 月
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.day:
        return '日';
      case this.month:
        return '月';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比评比地域范围
const FinanceQualityAreaRange = {
  district: 1, // 本商圈
  city: 2, // 本市
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.district:
        return '本商圈';
      case this.city:
        return '本市';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比人员当月在离职
const FinanceQualityStaffOnDuty = {
  all: 100, // 全部
  on: 1, // 在职
  no: 2, // 离职
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all:
        return '全部';
      case this.on:
        return '当月在职';
      case this.no:
        return '当月离职';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比竞赛评比竞赛排序顺序
const FinanceQualityCompetitionSortOrder = {
  ascend: 1, // 从小到大
  descend: -1, // 从大到小
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.ascend:
        return '从小到大';
      case this.descend:
        return '从大到小';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比奖励法奖励方式
const FinanceQualityAwardType = {
  ladder: 1, // 按阶梯设置
  mutipleConditions: 2, // 按多组条件设置
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.ladder:
        return '按阶梯设置';
      case this.mutipleConditions:
        return '按多组条件设置';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比竞赛奖励方式
// TODO: 确定, 可删除
const FinanceQualityCompetitionAwardType = {
  award: 0, // 奖励法
  rank: 1, // 竞赛评比
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.award:
        return '奖励法';
      case this.rank:
        return '竞赛评比';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比阶梯设置奖励或扣罚
const FinanceQualityAwardOrPunish = {
  award: 1, // 奖励
  punish: 2, // 扣罚
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.award:
        return '奖励';
      case this.punish:
        return '扣罚';
      default:
        return '未定义';
    }
  },
};

// 服务费质量评比订单指标tab
// TODO: 确定, 可删除
const FinanceQualityOrderIndexTab = {
  mutiple: '1', // 多条件
  single: '2', // 单条件
  description(rawValue) {
    switch (rawValue) {
      case this.mutiple:
        return '多条件筛选';
      case this.single:
        return '单条件筛选';
      default:
        return '未定义';
    }
  },
};

// 服务费规则步骤
const FinanceRulesGeneratorStep = {
  first: 1, // 第一步
  second: 2, // 第二步
  third: 3, // 第三步
  forth: 4, // 第四步
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.first:
        return '第一步';
      case this.second:
        return '第二步';
      case this.third:
        return '第三步';
      case this.forth:
        return '第四步';
      default:
        return '未定义';
    }
  },
};

// 结算汇总的模板类型
const FinanceTemplateType = {
  templates: 1, // 样板
  empty: 0, // 空
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.templates:
        return '样板';
      case this.empty:
        return '空';
      default:
        return '未定义';
    }
  },
};
// 服务费补款类型
const FinanceSalaryDeductions = {
  taskYes: true, // 有
  taskNo: false, // 无
  description(rawValue) {
    switch (rawValue) {
      case this.taskYes:
        return '有';
      case this.taskNo:
        return '无';
      default:
        return '未定义';
    }
  },
};

// 服务费方案状态
const FinanceSalaryPlanState = {
  draft: 1,
  stop: -100,
  delete: -101,
  now: 100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.draft:
        return '草稿箱';
      case this.stop:
        return '停用';
      case this.delete:
        return '删除';
      case this.now:
        return '启用';
      default:
        return '未定义';
    }
  },
};

// 管理类型
const FinanceSalaryManagementType = {
  supplies: 1, // 物资
  insurance: 2, // 保险
  description(rawValue) {
    switch (rawValue) {
      case this.supplies:
        return '物资';
      case this.insurance:
        return '保险';
      default:
        return '未定义';
    }
  },
};

// 天数类型
const FinanceSalaryDayState = {
  attendanceDays: 'attendance_days', // 出勤天数
  workDays: 'work_days', // 在职天数
  knightTags: 'knight_tags', // 骑士标签
  description(rawValue) {
    switch (rawValue) {
      case this.attendanceDays:
        return '出勤天数';
      case this.workDays:
        return '在职天数';
      case this.knightTags:
        return '骑士标签';
      default:
        return '未定义';
    }
  },
};

// 服务费规则，管理扣款类型
const FinanceSalaryDeductionsType = {
  equipment: 1, // 装备扣款
  insurance: 2, // 保险
  description(rawValue) {
    switch (rawValue) {
      case this.equipment:
        return '装备扣款';
      case this.insurance:
        return '保险';
      default:
        return '未定义';
    }
  },
};

// 补贴方式
const FinanceSalaryTotalSubsidies = {
  workLogicByOnce: 'work_logic_by_once', // 总额补贴
  workLogicByOrderUnit: 'work_logic_by_order_unit', // 按单补贴
  workLogicBySalaryBase: 'work_logic_by_salary_base', // 底薪补贴
  description(rawValue) {
    switch (rawValue) {
      case this.workLogicByOnce:
        return '总额补贴';
      case this.workLogicByOrderUnit:
        return '按单补贴';
      case this.workLogicBySalaryBase:
        return '底薪补贴';
      default:
        return '未定义';
    }
  },
};

// 满足条件
const FinanceSalaryMeetConditions = {
  meetAll: 'all', // 满足全部条件
  meetAny: 'any', // 满足任一条件
  description(rawValue) {
    switch (rawValue) {
      case this.meetAll:
        return '满足全部条件';
      case this.meetAny:
        return '满足任一条件';
      default:
        return '未定义';
    }
  },
};

// 骑士标签
const FinanceSalaryKnightTagState = {
  all: 100, // 全部
  description(rawValue) {
    switch (rawValue) {
      case this.all:
        return '全部';
      default:
        return '未定义';
    }
  },
  // 筛选骑士标签
  renderSalaryKnightTag(data = [], knightTag = []) {
    // 判断是否为空
    if (is.empty(data) && is.empty(knightTag)) {
      return '--';
    }
    // 判断是否为数组
    if (!Array.isArray(knightTag)) {
      return '--';
    }
    return knightTag.map((val) => {
      // 判断是否是全部
      if (Number(val) === FinanceSalaryKnightTagState.all) {
        return FinanceSalaryKnightTagState.description(Number(val));
        // 判断数据源和数据是否存在
      } else if (
        data[0] !== undefined && is.existy(val) &&
        is.not.empty(val) && Number(val) !== FinanceSalaryKnightTagState.all) {
        // 进行筛选
        return data.filter(item => item.id === val)[0].name;
      } else {
        return '--';
      }
    }).join(',');
  },
};

// 服务费试算任务的状态
const FinanceSalaryTaskState = {
  waiting: 1,
  pendding: 50,
  success: 100,
  failure: -100,
  description(rawValue) {
    switch (rawValue) {
      case this.waiting:
        return '待试算';
      case this.pendding:
        return '正在试算';
      case this.success:
        return '试算成功';
      case this.failure:
        return '试算失败';
      default:
        return '未定义';
    }
  },
};

// 服务费规则明细操作项类型
const FinanceSalaryDetailType = {
  districts: 1,
  courier: 2,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.districts:
        return '方案';
      case this.courier:
        return '草稿箱';
      default:
        return '未定义';
    }
  },
};

// 服务费周期类型
const FinanceSalaryCycleType = {
  month: 1,
  day: 2,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.month:
        return '按月';
      case this.day:
        return '按天';
      default:
        return '未定义';
    }
  },
  unitDescription(rawValue) {
    switch (Number(rawValue)) {
      case this.month:
        return '月';
      case this.day:
        return '天';
      default:
        return '未定义';
    }
  },
};


export {
  FinanceKnightClassification, // 骑士分类
  FinanceMatchFiltersValue, // 薪资规则，筛选value数据
  FinanceTemplateType, // 结算模版类型
  FinanceQualityType, // 质量类型
  FinanceQualityStatisticsTime, // 服务费质量评比数据统计时间
  FinanceQualityAreaRange, // 服务费质量评比评比地域范围
  FinanceQualityStaffOnDuty, // 服务费质量评比人员当月在离职
  FinanceQualityCompetitionSortOrder, // 服务费质量评比竞赛评比竞赛排序顺序
  FinanceQualityAwardType, // 服务费质量评比奖励法奖励方式
  FinanceQualityCompetitionAwardType, // 服务费质量评比竞赛奖励方式
  FinanceQualityAwardOrPunish, // 服务费质量评比阶梯设置奖励或扣罚
  FinanceQualityOrderIndexTab, // 服务费质量评比订单指标tab
  FinanceSalaryDetailType, // 服务费规则明细操作项类型
  FinanceRulesGeneratorStep, // 服务费规则步骤
  FinanceSalaryDeductions, // 服务费补款的类型
  FinanceSalaryCycleType, // 服务费周期类型
  FinanceSalaryManagementType, // 管理类型
  FinanceSalaryDeductionsType, // 服务费规则，管理扣款类型
  FinanceSalaryTotalSubsidies, // 补贴方式
  FinanceSalaryMeetConditions, // 满足条件
  FinanceSalaryKnightTagState, // 骑士标签
  FinanceSalaryDayState, // 天数类型
  FinanceSalaryTaskState, // 服务费试算任务的状态
  FinanceSalaryPlanState, // 服务费方案状态
};
