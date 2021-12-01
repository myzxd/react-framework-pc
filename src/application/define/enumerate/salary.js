/* eslint-disable react/react-in-jsx-scope */
import dot from 'dot-prop';

// 结算模版设置审核状态
const SalaryVerifyState = {
  saving: 13000,    // 待提交
  pendding: 13001,  // 待审核
  waiting: 13002,   // 待使用
  reject: 13003,    // 审核未通过
  working: 13004,   // 使用中
  stoping: 13005,   // 停用
  remove: 13006,    // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.saving: return '待提交';
      case this.pendding: return '待审核';
      case this.waiting: return '待使用';
      case this.reject: return '不通过';
      case this.working: return '使用中';
      case this.stoping: return '停用';
      case this.remove: return '删除';
      default: return '未定义';
    }
  },
};

// 结算模版中的逻辑公式
// TODO: 确定, 可删除
const SalaryFormula = {
  1: 'A<指标<B',
  2: '指标<A',
  7: '指标<=A',
  3: '指标>A',
  6: '指标>=A',
  4: '指标=A',
  5: '指标!=A',

  // 返回当前对象的keys
  keys() {
    return [1, 2, 7, 3, 6, 4, 5];
  },

  // 获取参数的数量
  getOptionsCount(index) {
    if (Number(index) === 1) {
      return 2;
    }
    return 1;
  },

  // 根据参数，返回公式
  formula(index, options = {}, specification = '指标') {
    const x = dot.get(options, 'x', 0);
    const y = dot.get(options, 'y', 0);

    switch (Number(index)) {
      case 1: return <div>{x} &lt; {specification} &lt; {y}</div>;
      case 2: return <div>{specification} &lt; {x}</div>;
      case 3: return <div>{specification} &gt; {x}</div>;
      case 4: return <div>{specification} = {x} </div>;
      case 5: return <div>{specification} != {x} </div>;
      case 6: return <div>{specification} &gt;= {x} </div>;
      case 7: return <div>{specification} &lt;= {x} </div>;
      default: return '';
    }
  },
};

// 结算模版指标数据
const SalaryIndex = {
  none: 1,
  description(rawValue) {
    switch (rawValue) {
      case this.none: return '指标数据待定';
      default: return '未定义';
    }
  },
};

// 结算模版中满足的条件关系
// TODO: 确定, 可删除
const SalaryCondition = {
  all: 2,         // 同时满足
  atLeastOne: 3,  // 至少满足其中一个
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部';
      case this.atLeastOne: return '任一';
      default: return '未定义';
    }
  },
};

// 扣补款项目定义的状态
const SalaryDeductSupplementState = {
  on: 100,
  off: -100,
  delete: -101,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.on: return '启用';
      case this.off: return '禁用';
      case this.delete: return '删除';
      default: return '未定义';
    }
  },
};

// 服务费阶梯设置奖罚计算方式
const SalaryRulesLadderCalculateType = {
  nomal: 1,
  difference: 2,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.nomal: return '每单位';
      case this.difference: return '不足部分,每单位';
      default: return '未定义';
    }
  },
};

// 可创建结算模版的状态
// TODO: 确定, 可删除
const CreateSalaryDistrictState = {
  enable: 100,
  disabled: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable: return '可创建';
      case this.disabled: return '不可创建';
      default: return '未定义';
    }
  },
};

// 服务费发放状态
const SalaryPaymentState = {
  normal: 1,
  delayed: 10,
  reissue: 50,
  notPay: -100,
  paying: 20,
  paid: 100,
  description(rawValue) {
    switch (rawValue) {
      case this.normal: return '正常';
      case this.delayed: return '缓发';
      case this.reissue: return '补发成功';
      case this.notPay: return '不发薪';
      case this.paying: return '补发中';
      case this.paid: return '以发薪';
      default: return '未定义';
    }
  },
};

// 服务费计算周期-兼职
// TODO: 确定, 可删除
const SalaryPaymentCricle = {
  month: 14000,
  halfMonth: 14001,
  week: 14002,
  daily: 14003,
  asMonth: 14004,
  period: 14005,
  description(rawValue) {
    switch (rawValue) {
      case this.month: return '按月';
      case this.halfMonth: return '按半月';
      case this.week: return '按周';
      case this.daily: return '按天';
      case this.asMonth: return '按月'; // 试算月份
      case this.period: return '按旬';
      default: return '未定义';
    }
  },
};

// 结算单审核状态
// TODO: 确定, 可删除
const SalaryRecordState = {
  waiting: 10000,
  pendding: 10001,
  success: 10002,
  failure: 10003,
  description(rawValue) {
    switch (rawValue) {
      case this.waiting: return '待提交';
      case this.pendding: return '待审核';
      case this.success: return '审核通过';
      case this.failure: return '未通过';
      default: return '未定义';
    }
  },
};

// 结算汇总审核状态
const SalarySummaryState = {
  waiting: 1,
  processing: 50,
  success: 100,
  reject: -50,
  description(rawValue) {
    switch (rawValue) {
      case this.waiting: return '待审核';
      case this.processing: return '审核中';
      case this.success: return '已审核';
      case this.reject: return '审核中-驳回';
      default: return '未定义';
    }
  },
};
// 骑士扣款审核状态
const SalaryKnightState = {
  finished: 130001,
  unfinished: 130002,
  description(state) {
    switch (state) {
      case this.finished: return '已完成';
      case this.unfinished: return '未完成';
      default: return '未定义';
    }
  },
};

// 服务费计算文件上传的状态
const SalaryUploadState = {
  uploaded: true,
  notUploaded: false,
  description(rawValue) {
    switch (rawValue) {
      case this.uploaded: return '已上传';
      case this.notUploaded: return '未上传';
      default: return '未定义';
    }
  },
};

// 工资单汇总类型
const SalaryCollectType = {
  monthTesting: 16000,  // 月算试算汇总
  month: 16001,         // 月算汇总
  partTimeMonth: 16002, // 兼职月算汇总
  halfMonth: 16003,     // 半月算汇总
  week: 16004,          // 周算汇总
  daily: 16005,         // 日算汇总
  description(rawValue) {
    switch (rawValue) {
      case this.monthTesting: return '月算试算汇总';
      case this.month: return '月算汇总';
      case this.partTimeMonth: return '兼职月算汇总';
      case this.halfMonth: return '半月算汇总';
      case this.week: return '周算汇总';
      case this.daily: return '日算汇总';
      default: return '未定义';
    }
  },
};

// 规则集互斥或互补
const SalaryMutualExclusion = {
  Exclusion: 1,     // 互斥
  Complementary: 2, // 互补
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.Exclusion: return '互斥';
      case this.Complementary: return '互补';
      default: return '未定义';
    }
  },
};

// 服务费方案规则集订单类型
const SalaryOrderType = {
  all: 100,     // 全部
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部';
      default: return '未定义';
    }
  },
};

// 服务费方案规则集当月在离职状态
const SalaryMonthState = {
  all: 100,           // 全部
  incumbent: 1,     // 当月在职
  resignation: 2,   // 当月离职
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部';
      case this.incumbent: return '当月在职';
      case this.resignation: return '当月离职';
      default: return '未定义';
    }
  },
};

// 服务费方案规则集站点评星
const SalaryStationLevel = {
  all: 100,     // 全部
  first: 1,   // 一星（级）
  second: 2,  // 二星（级）
  third: 3,   // 三星（级）
  four: 4,    // 四星（级）
  fives: 5,   // 五星（级）
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部';
      case this.first: return '一星（级）';
      case this.second: return '二星（级）';
      case this.third: return '三星（级）';
      case this.four: return '四星（级）';
      case this.fives: return '五星（级）';
      default: return '未定义';
    }
  },
};

// 服务费方案规则集方案提成规则
const SalaryExtractType = {
  segmentation: 1, // 分段累计提成
  change: 2,       // 阶梯档位提成
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.segmentation: return '分段累计提成';
      case this.change: return '阶梯档位提成';
      default: return '未定义';
    }
  },
};

// 服务费方案规则列表状态（是否已删除）
const SalaryExtractListType = {
  delete: -100, // 已删除
  normal: 100,  // 正常
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.delete: return '已删除';
      case this.normal: return '正常';
      default: return '未定义';
    }
  },
};

// 服务费规则内容组件操作项类型
const SalaryCollapseType = {
  generator: 0,
  draft: 1,
  review: 2,
  todo: 3,
  now: 4,
  calculate: 5,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.generator: return '方案';
      case this.draft: return '草稿箱';
      case this.review: return '审核中';
      case this.todo: return '待生效';
      case this.now: return '已生效';
      case this.calculate: return '试算服务费';
      default: return '未定义';
    }
  },
};

// 服务费规则集列表
const SalaryRules = {
  order: 1,      // 单量
  attendance: 2, // 出勤
  quality: 3,    // 质量
  management: 4, // 管理
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.order: return '单量';
      case this.attendance: return '出勤';
      case this.quality: return '质量';
      case this.management: return '管理';
      default: return '未定义';
    }
  },
};

// 服务费方案审批流适用范围
const SalaryPlanExamineFlowApplyRange = {
  platform: 5,
  supplier: 4,
  city: 3,
  district: 2,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.platform: return '平台';
      case this.supplier: return '供应商';
      case this.city: return '城市';
      case this.district: return '商圈';
      default: return '未定义';
    }
  },
};

export {
  SalaryVerifyState,    // 结算模版设置审核状态
  SalaryFormula,        // 结算模版中的逻辑公式
  SalaryIndex,          // 结算模版中的指标数据
  SalaryCondition,      // 结算模版中满足的条件
  SalaryPaymentCricle,  // 服务费计算周期
  SalaryPaymentState,   // 服务费发放状态
  SalaryRecordState,    // 结算单审核状态
  SalarySummaryState,   // 结算汇总审核状态
  SalaryUploadState,    // 服务费计算文件上传的状态
  SalaryKnightState,    // 骑士扣款汇总审核状态
  SalaryCollectType,    // 工资单汇总类型
  SalaryMutualExclusion,  // 服务费方案规则集互斥或互补
  SalaryOrderType,        // 服务费方案规则集订单类型
  SalaryMonthState,       // 服务费方案规则集当月在离职状态
  SalaryStationLevel,     // 服务费方案规则集站点评星
  SalaryExtractType,      // 服务费方案规则集方案提成规则
  SalaryExtractListType,  // 服务费方案规则列表状态（是否已删除）
  SalaryDeductSupplementState,  // 扣补款项目定义的状态
  SalaryRulesLadderCalculateType, // 服务费阶梯设置奖罚计算方式
  SalaryCollapseType,     // 服务费规则内容组件操作项类型
  SalaryRules,            // 服务费规则集列表
  SalaryPlanExamineFlowApplyRange,      // 服务费方案审批流适用范围
  CreateSalaryDistrictState,    // 商圈是否可以创建服务费规则
};


