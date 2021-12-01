// 业主状态
const TeamTeacherState = {
  true: 100,    // 启用
  close: -100,  // 禁用
  delete: -101, // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.true: return '启用';
      case this.close: return '禁用';
      case this.delete: return '删除';
      default: '未定义';
    }
  },
};

// 业主生效日期的状态
const TeamEffectiveDateState = {
  sameMonth: 1, // 立即生效
  nextMonth: 2, // 次月生效
  perfect: 3,   // 补全档案后生效
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.sameMonth: return '立即生效';
      case this.nextMonth: return '次月生效';
      case this.perfect: return '补全档案后生效';
      default: '未定义';
    }
  },
};

// 业主团队变更记录生效状态
const TeamUpdateOwnerEffectiveState = {
  effected: 100,  // 已生效
  effectBefore: 50, // 待生效
  lose: -100, // 已失效
  del: -101,  // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.effected: return '已生效';
      case this.effectBefore: return '待生效';
      case this.lose: return '已失效';
      case this.del: return '删除';
      default: '--';
    }
  },
};

// 业主团队变更记录动作状态
const TeamUpdateOwnerEffectiveEventState = {
  update: 'update',  // 变更业主
  description(rawValue) {
    switch (rawValue) {
      case this.update: return '变更业主';
      default: '--';
    }
  },
};

// 业主团队状态
const TeamOwnerManagerState = {
  normal: 100, // 正常
  notEffect: 50,  // 未生效
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.notEffect: return '未生效';
      default: '--';
    }
  },
};

// 业主|| 私教操作动作
const ChangeAction = {
  create: 'add',  // 新增
  change: 'update', // 变更
  stop: 'stop', // 终止
  description(rawValue) {
    switch (rawValue) {
      case this.create: return '添加';
      case this.change: return '变更';
      case this.stop: return '终止';
      default: return '未定义';
    }
  },
};

//  生效状态
const EffectState = {
  effected: 100,  // 已生效
  effectBefore: 101, // 待生效
  lose: -101, // 已失效
  del: -110,  // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.effected: return '已生效';
      case this.effectBefore: return '待生效';
      case this.lose: return '已失效';
      case this.del: return '删除';
      default: return '未定义';
    }
  },
};
//  私教的生效状态
const CoachEffectState = {
  effected: 100,  // 已生效
  effectBefore: 50, // 待生效
  lose: -100, // 已失效
  delete: -101, // 已删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.effected: return '已生效';
      case this.effectBefore: return '待生效';
      case this.lose: return '已失效';
      case this.delete: return '已删除';
      default: return '未定义';
    }
  },
};

// 是否允许电子签约
const AllowElectionSign = {
  yes: 1,
  no: 0,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.yes: return '是';
      case this.no: return '否';
      default: return '--';
    }
  },
};

// 企业付款单状态
const EnterprisePaymentState = {
  alreadyPayment: 100, // 已付款
  pendingPayment: 1, // 待付款
  rejectPayment: -100, // 异常
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.alreadyPayment: return '已付款';
      case this.pendingPayment: return '待付款';
      case this.rejectPayment: return '异常';
      default: return '未定义';
    }
  },
};
// 借款类型
const BorrowType = {
  normal: 1,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '普通借款';
      default: return '未定义';
    }
  },
};

// 还款周期
const RepayCircle = {
  once: 1,
  instalment: 10,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.once: return '一次还';
      case this.instalment: return '分期还';
      default: return '未定义';
    }
  },
};

// 还款方式
const RepayMethod = {
  currency: 1,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.currency: return '货币';
      default: return '未定义';
    }
  },
};

// 白名单
const WhiteListType = {
  wallet: 'wallet',
  salaryLoan: 'salary_loan',
  boduRegister: 'bodu_register',
  schoolStudy: 'school_study',
  message: 'message',
  description(rawValue) {
    switch (String(rawValue)) {
      case this.wallet: return '钱包';
      case this.salaryLoan: return '服务费预支';
      case this.boduRegister: return '委托个户注册';
      case this.schoolStudy: return '云学堂';
      case this.message: return '消息公告';
      default: '未定义';
    }
  },
};

// 白名单团队类型
const WhiteListTeamType = {
  is: true, // 是
  no: false,  // 否
  description(rawValue) {
    switch (rawValue) {
      case this.is: return '是';
      case this.no: return '否';
      default: return '未定义';
    }
  },
};

// 白名单工作类型
const WhiteListWorkType = {
  manageTeam: 'manage_team',
  team: 'team_info',
  work: 'work_profile',
  data: 'data_compass',
  study: 'study',
  internal: 'internal_recommend',
  receive: 'receive_material',
  advance: 'advance_service_charge',
  meeting: 'meeting',
  insurance: 'insurance',
  description(rawValue) {
    switch (String(rawValue)) {
      case this.manageTeam: return '管理团队';
      case this.team: return '团队信息';
      case this.work: return '工作档案';
      case this.data: return '数据罗盘';
      case this.study: return '学习';
      case this.internal: return '内部推荐';
      case this.receive: return '物资领用';
      case this.advance: return '服务费预支';
      case this.meeting: return '会议';
      case this.insurance: return '保险';
      default: '未定义';
    }
  },
};

// 白名单通讯录状态
const WhiteListAddressBookState = {
  show: true, // 显示
  hide: false,  // 不显示
  description(rawValue) {
    switch (rawValue) {
      case this.show: return '显示';
      case this.hide: return '不显示';
      default: return '未定义';
    }
  },
};

// 服务商类型
const ServiceProvidersType = {
  bodu: 10,
  mengda: 20,
  zhongjian: 30,
  caixingbang: 50,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.bodu: return '伯渡';
      case this.mengda: return '盟达';
      case this.zhongjian: return '众简';
      case this.caixingbang: return '才兴邦';
      default: return '未定义';
    }
  },
};

// 终端类型
const WhiteListTerminalType = {
  knight: 10,
  boss: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.knight: return 'BOSS骑士APP';
      case this.boss: return 'BOSS老板APP';
      default: return '未定义';
    }
  },
};

// 是否有公告发送权限
const AnnouncementSendPermissions = {
  yes: 1,
  no: 0,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.yes: return '有';
      case this.no: return '无';
      default: '未定义';
    }
  },
};

// 公告接收人范围
const AnnouncementScope = {
  all: 10,
  custom: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部团队';
      case this.custom: return '自定义';
      default: '未定义';
    }
  },
};

export {
  AllowElectionSign, // 是否允许电子签约
  EnterprisePaymentState, // 企业付款单状态
  BorrowType, // 借款类型
  RepayCircle, // 还款周期
  RepayMethod, // 还款方式
  WhiteListType, // 白名单
  WhiteListTeamType, // 白名单团队类型
  WhiteListWorkType, // 白名单工作类型
  WhiteListAddressBookState, // 白名单通讯录状态
  WhiteListTerminalType, // 白名单终端类型
  AnnouncementSendPermissions, // 是否有公告发送权限
  AnnouncementScope, // 公告接收人范围
  ServiceProvidersType, // 服务商类型

  // 业主
  TeamTeacherState,     // 业主状态
  TeamEffectiveDateState, // 业主生效日期的状态
  TeamUpdateOwnerEffectiveState, // 业主团队变更记录生效状态
  TeamUpdateOwnerEffectiveEventState, // 业主团队变更记录动作状态
  TeamOwnerManagerState, // 业主团队状态

  ChangeAction,     // 业主变更动作

  EffectState,    // 业主变更生效状态
  CoachEffectState, // 私教生效状态
};
