// 事务性审批流合并审批规则
const AffairsFlowMergeRule = {
  continuous: 10,      // 房屋管理
  each: 20,          // 服务费规则
  description(rawValue) {
    switch (rawValue) {
      case this.continuous: return '连续节点为同一人时，自动同意';
      case this.each: return '每个节点都需要审批';
      default: return '未定义';
    }
  },
};

// 事务性审批流按协作关系指定
const AffairsFlowCooperationSpecify = {
  department: 50, // 指定部门
  fieldDep: 60, // 指定字段部门
  fieldPerson: 90, // 指定字段人员
  actualPerson: 30, // 实际申请人（直接上级）
  actualPersonT: 40, // 实际申请人（第二级上级）
  supPerson: 70, // 上一节点审批人（直接上级）
  supPersonT: 80, // 上一节点审批人（第二级上级）
  description(rawValue) {
    switch (rawValue) {
      case this.department: return '指定部门';
      case this.fieldDep: return '指定字段部门';
      case this.fieldPerson: return '指定字段相关人';
      case this.actualPerson: return '实际申请人';
      case this.actualPersonT: return '实际申请人第二级上级';
      case this.supPerson: return '上一节点审批人(直接上级)';
      case this.supPersonT: return '上一节点审批人（第二级上级）';
      default: return '未定义';
    }
  },
};

// 事务性审批流按协作关系指定审批人
const AffairsFlowCooperationPerson = {
  account: 10, // 申请人
  actualAccount: 20, // 按审批人指定（实际申请人）
  fieldAccount: 30, // 按审批人指定（指定字段相关人）
  description(rawValue) {
    switch (rawValue) {
      case this.account: return '申请人';
      case this.fieldAccount: return '指定字段相关人';
      case this.actualAccount: return '实际申请人';
      default: return '未定义';
    }
  },
};


// 事务性审批流指定部门审批人类型
const AffairsFlowSpecifyApplyType = {
  principal: 10, // 部门负责人
  post: 20, // 岗位
  description(rawValue) {
    switch (rawValue) {
      case this.principal: return '部门负责人';
      case this.post: return '指定岗位';
      default: return '未定义';
    }
  },
};

// 事务性审批流指定字段特殊部门
const AffairsFlowSpecifyFieldDep = {
  callOut: 10, // 调出部门
  callIn: 20, // 调入部门
  description(rawValue) {
    switch (rawValue) {
      case this.callOut: return '调出部门';
      case this.callIn: return '调入部门';
      default: return '未定义';
    }
  },
};

// 事务性审批流指定字段相关人
const AffairsFlowSpecifyFieldPerson = {
  contract: 10, // 合同保管人
  fare: 20, // 票款负责人
  description(rawValue) {
    switch (rawValue) {
      case this.contract: return '合同保管人';
      case this.fare: return '票款负责人';
      default: return '未定义';
    }
  },
};

// 事务性审批流节点设置关系
const AffairsFlowNodeRelation = {
  report: 10, // 按汇报关系
  coopera: 20, // 按协作关系
  description(rawValue) {
    switch (rawValue) {
      case this.report: return '按汇报关系';
      case this.coopera: return '按协作关系';
      default: return '未定义';
    }
  },
};

// 事务性审批流最高审批岗位类型
const AffairsFlowHighestPostType = {
  tag: 1, // 审批人标签
  post: 2, // 选择岗位
  description(rawValue) {
    switch (rawValue) {
      case this.tag: return '审批人标签';
      case this.post: return '选择岗位';
      default: return '未定义';
    }
  },
};

// 商务公司办理类型
const BusinessCompanyHandleType = {
  registered: 20,    // 公司注册
  cancellation: 10,    // 公司注销
  change: 30,         // 公司变更
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.registered: return '公司注册';
      case this.cancellation: return '公司注销';
      case this.change: return '公司变更';
      default: '未定义';
    }
  },
};

// 变更类型
const BusinessCompanyChangeType = {
  name: 10,            // 公司名称变更
  guardianship: 20,    // 法人变更
  monitoring: 30,      // 监事变更
  shareholders: 40,    // 股东变更
  capital: 50,         // 注册资本变更
  address: 60,         // 注册地址变更
  scope: 70,           // 经营范围变更
  other: 80,           // 其他变更
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.name: return '公司名称变更';
      case this.guardianship: return '法人变更';
      case this.monitoring: return '监事变更';
      case this.shareholders: return '股东变更';
      case this.capital: return '注册资本变更';
      case this.address: return '注册地址变更';
      case this.scope: return '经营范围变更';
      case this.other: return '其他变更';
      default: '未定义';
    }
  },
};

// 账户类型
const BusinesBankAccountType = {
  basic: 10,           // 基本存款户
  general: 20,         // 一般存款户
  temporary: 30,       // 临时存款户
  special: 40,         // 专用存款户
  treasure: 50,        // 支付宝
  dollar: 60,           // 美元户
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.basic: return '基本存款户';
      case this.general: return '一般存款户';
      case this.temporary: return '临时存款户';
      case this.special: return '专用存款户';
      case this.treasure: return '支付宝';
      case this.dollar: return '美元户';
      default: '未定义';
    }
  },
};

// 商务公司办理类型
const BusinessCompanyType = {
  child: 10,    // 子公司
  points: 20,    // 分公司
  joint: 30,    // 合资公司
  acquisition: 40,  // 收购子公司
  other: 50,    // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.child: return '子公司';
      case this.points: return '分公司';
      case this.joint: return '合资公司';
      case this.acquisition: return '收购子公司';
      case this.other: return '其他';
      default: '未定义';
    }
  },
};

// 离职原因
const ResignReason = {
  personal: 10, // 个人原因
  betterChance: 20, // 更好的机会
  dissatisfiedWithSalary: 30, // 对薪资不满
  tooMuchStress: 40, // 压力太大
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.personal: return '个人原因申请辞职';
      case this.betterChance: return '有了更好的发展机会';
      case this.dissatisfiedWithSalary: return '对公司现有公司福利不满意';
      case this.tooMuchStress: return '工作压力大，超出个人所能承受';
      default: '未定义';
    }
  },
};

// 人事调动类型
const PositionTransferType = {
  promoted: 10, // 晋升
  demote: 20, // 降级
  levelTransfer: 30, // 平级异动
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.promoted: return '晋升';
      case this.demote: return '降级';
      case this.levelTransfer: return '平级异动';
      default: '未定义';
    }
  },
};

// 社保公积金 - 险种
const SocietyFundType = {
  society: 10,
  fund: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.society: return '保险';
      case this.fund: return '公积金';
      default: '未定义';
    }
  },
};

// 调拨原因-其他-枚举
const FundTransferOtherReasonEnum = 60;

export {
  BusinessCompanyHandleType, // 商务公司办理类型
  BusinessCompanyChangeType, // 变更类型
  BusinesBankAccountType,    // 账户类型
  BusinessCompanyType, // 商务公司类型
  ResignReason, // 离职原因
  PositionTransferType, // 人事调动类型

  FundTransferOtherReasonEnum, // 调拨原因-其他-枚举
  SocietyFundType,              // 社保公积金险种
  AffairsFlowMergeRule, // 事务性审批流合并审批规则
  AffairsFlowCooperationSpecify, // 事务性审批流按协作关系指定
  AffairsFlowSpecifyApplyType, // 事务性审批流指定部门审批人类型
  AffairsFlowSpecifyFieldDep, // 事务性审批流指定字段特殊部门
  AffairsFlowSpecifyFieldPerson, // 事务性审批流指定字段相关人
  AffairsFlowNodeRelation, // 事务性审批流节点设置关系
  AffairsFlowHighestPostType, // 事务性审批流最高审批岗位类型
  AffairsFlowCooperationPerson, // 事务性审批流按协作关系指定审批人
};

