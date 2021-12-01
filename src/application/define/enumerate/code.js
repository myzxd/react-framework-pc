// code审批流状态
const CodeFlowState = {
  draft: 1,     // 草稿
  normal: 100, // 正常
  deactivate: -100,  // 停用
  delete: -101, // 删除
  description(rawValue) {
    switch (rawValue) {
      case this.draft: return '草稿';
      case this.normal: return '正常';
      case this.deactivate: return '停用';
      case this.delete: return '删除';
      default: return '未定义';
    }
  },
};

// code成本中心类型
const CodeCostCenterType = {
  team: 20,  // team
  code: 10, // code
  description(rawValue) {
    switch (rawValue) {
      case this.team: return 'team';
      case this.code: return 'code';
      default: return '未定义';
    }
  },
};

// code事项tab类型
const CodeMatterType = {
  team: 20,  // team类型
  code: 10, // code类型
  description(rawValue) {
    switch (rawValue) {
      case this.team: return 'team类型';
      case this.code: return 'code类型';
      default: return '未定义';
    }
  },
};

// code审批单tab key
const CodeApproveOrderTabKey = {
  awaitReport: 10, // 待提报
  upcoming: 20, // 我待办的
  meReport: 30, // 我提报的
  meHandle: 40, // 我经手的
  copyGive: 50, // 抄送我的
  all: 0, // 全部
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.awaitReport: return '待提报';
      case this.upcoming: return '我待办的';
      case this.meReport: return '我提报的';
      case this.meHandle: return '我经手的';
      case this.copyGive: return '抄送我的';
      case this.all: return '全部';
      default: return '--';
    }
  },
};

// code审批单下的费用单状态
const CodeApproveOrderCostState = {
  toReport: 1, // 待提报
  conduct: 10, // 审批进行中
  complete: 100, // 审批完成
  close: -100, // 关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.toReport: return '待提报';
      case this.conduct: return '审批进行中';
      case this.complete: return '审批完成';
      case this.colse: return '关闭';
      default: return '--';
    }
  },
};

// code审批单付款状态
const CodeApproveOrderPayState = {
  done: 100, // 已打款
  abnormal: -100, // 异常
  untreated: 1, // 未处理
  noNeed: 10, // 无需打款
  noPayNode: -10, // 无需处理（无付款节点）
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.done: return '已打款';
      case this.abnormal: return '异常';
      case this.untreated: return '未处理';
      case this.noNeed: return '无需付款';
      case this.noPayNode: return '--';
      default: return '--';
    }
  },
};

// code审批单验票状态
const CodeTicketState = {
  already: 100, // 已验票
  waiting: 1, // 待验票
  abnormal: -100, // 验票异常
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.already: return '已验票';
      case this.waiting: return '待验票';
      case this.abnormal: return '验票异常';
      default: '未定义';
    }
  },
};
// code审批单类型
const CodeOrderType = {
  new: 10, // 新的审批单
  old: 20, // 老的审批单
};

// code审批流类型
const CodeFlowType = {
  payment: 50, // 付款类
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.payment: return '付款类';
      default: '未定义';
    }
  },
};

// code审批流类型
const CodeMatterLinkCollectState = {
  ok: 100, // 收藏
  cancel: -100, // 取消收藏
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.ok: return '收藏';
      case this.cancel: return '取消收藏';
      default: '未定义';
    }
  },
};

// code审批流节点组织架构审批方式
const CodeFlowNodeOrganizationApproveType = {
  principal: 10, // 部门负责人
  specialPost: 20, // 指定部门
  directLeader: 30, // 直接领导
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.principal: return '部门负责人';
      case this.specialPost: return '指定部门';
      case this.directLeader: return '直接领导';
      default: '未定义';
    }
  },
};

// code科目状态
const CodeSubjectState = {
  draft: 1, // 草稿
  normal: 100, // 正常
  delete: -101, // 删除
  disabled: -100, // 停用
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.draft: return '草稿';
      case this.normal: return '正常';
      case this.delete: return '删除';
      case this.disabled: return '停用';
      default: '未定义';
    }
  },
};

// code记录明细红冲状态
const CodeRecordBillRedPushState = {
  right: 100, // 是
  negate: 1, // 否
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.right: return '是';
      case this.negate: return '否';
      default: '未定义';
    }
  },
};

// code出差枚举
const CodeTravelState = {
  oa: 20, // 事务类出差申请
  expense: 10, // 非成本类出差申请
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.oa: return '事务类出差申请';
      case this.expense: return '非成本类出差申请';
      default: '未定义';
    }
  },
};

// code审批流节点设置金额条件类型
const CodeFlowNodeConditionMoneyType = {
  no: 'None', // 无条件
  lessThan: '<', // 小于
  moreThan: '>', // 大于
  lessThaneQual: '<=', // 小于等于
  moreThanEqual: '>=', // 大于
  notIn: 'not in', // 不包含
  description(rawValue) {
    switch (rawValue) {
      case this.no: return '无条件';
      case this.lessThan: return '小于';
      case this.moreThan: return '大于';
      case this.lessThaneQual: return '小于等于';
      case this.moreThanEqual: return '大于等于';
      case this.notIn: return '不包含';
      default: return '未定义';
    }
  },
};

// code审批流节点设置金额条件类型
const CodeFlowNodeConditionSubjectType = {
  no: 'Node', // 无条件
  notContain: 'not in',  // 不包含
  description(rawValue) {
    switch (rawValue) {
      case this.no: return '无条件';
      case this.notContain: return '不包含';
      default: return '未定义';
    }
  },
};

// code提报类型
const CodeSubmitType = {
  code: 10, // CODE
  team: 20,  // TEAM
  description(rawValue) {
    switch (rawValue) {
      case this.code: return 'CODE';
      case this.team: return 'TEAM';
      default: return '未定义';
    }
  },
};

// code审批单模版类型
const CodeApproveOrderType = {
  universal: 'common', // 通用模版
  travel: 'travel',  // 差旅报销
  transfer: 'transfer', // 内部结算划账模版
  description(rawValue) {
    switch (rawValue) {
      case this.universal: return '通用模版';
      case this.travel: return '差旅报销';
      case this.transfer: return '内部结算划账模版';
      default: return '未定义';
    }
  },
};

// code事项模版类型
const CodeMatterTemplateType = {
  common: 'common', // 通用
  travel: 'travel',  // 差旅报销
  transfer: 'transfer', // 内部划账
  description(rawValue) {
    switch (rawValue) {
      case this.common: return '通用模版';
      case this.travel: return '差旅报销模版';
      case this.transfer: return '内部结算划账模版';
      default: return '未定义';
    }
  },
};

export {
  CodeFlowState, // code审批流状态
  CodeCostCenterType, // code成本中心类型
  CodeFlowNodeConditionMoneyType, // code审批流节点设置金额条件类型
  CodeFlowNodeConditionSubjectType, // code审批流节点设置金额条件类型
  CodeSubmitType,                   // code提报类型
  CodeApproveOrderType, // code审批单模版类型
  CodeMatterTemplateType, // code事项模版类型
  CodeMatterType, // code事项tab类型
  CodeApproveOrderTabKey, // code审批单tab key
  CodeApproveOrderCostState, // code审批单下的费用单状态
  CodeApproveOrderPayState, // code审批单付款状态
  CodeTicketState, // code审批单验票状态
  CodeOrderType, // code审批单类型
  CodeFlowType, // code审批流类型
  CodeMatterLinkCollectState, // code事项链接收藏状态
  CodeFlowNodeOrganizationApproveType, // code审批流节点组织架构审批方式
  CodeSubjectState, // code科目状态
  CodeTravelState, // code出差枚举
  CodeRecordBillRedPushState, // code记录明细红冲状态
};
