// 系统标示符号
const SystemIdentifier = {
  boss: 9999,           // boss 系统
  xingDa: 'XingDa',     // 兴达 系统
  xianQiao: 'XianQiao', // 鲜巧 系统
  youKe: 'YouKe', // 游客 系统

  // 是否是boss系统
  isBossSystemIdentifier(identifier = '') {
    return `${identifier}` === `${this.boss}`;
  },
  // 是否是兴达系统
  isXingDaSystemIdentifier(identifier = '') {
    return `${identifier}` === `${this.xingDa}`;
  },
  // 是否是鲜巧系统
  isXianQiaoSystemIdentifier(identifier = '') {
    return `${identifier}` === `${this.xianQiao}`;
  },
  // 是否是游客系统
  isYouKeSystemIdentifier(identifier = '') {
    return `${identifier}` === `${this.youKe}`;
  },
};

// 关联审批接口 参数
const ApprovalDefaultParams = {
  add: 1,     // 1 是新增
  delete: 0,  // 0 是删除
};

// 系统管理，意见反馈状态
const SystemFeedBackState = {
  done: 10, // 已完成
  padding: 90, // 待处理
  description(rawValue) {
    switch (rawValue) {
      case this.done: return '已完成';
      case this.padding: return '待处理';
      default: return '未定义';
    }
  },
};

// 劳动者三方id修改原因
const EmployeeManageReasonsRevision = {
  error: 30,     // 填写有误
  platformSystem: 10, // 平台系统升级
  business: 20,  //  业务调整
  other: 99,  // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.error: return '填写有误';
      case this.platformSystem: return '平台系统升级';
      case this.business: return '业务调整';
      case this.other: return '其他';
      default: return '未定义';
    }
  },
};

// 合同模版状态
const ContractTemplateState = {
  on: 100,
  off: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.on: return '正常';
      case this.off: return '删除';
      default: return '--';
    }
  },
};

export {
  SystemIdentifier,       // 系统标示符号
  EmployeeManageReasonsRevision, // 劳动者三方id修改原因
  ApprovalDefaultParams,         // 关联审批接口 参数 所有事务都要用到
  SystemFeedBackState, // 系统管理，意见反馈状态
  ContractTemplateState, // 合同模版状态
};
