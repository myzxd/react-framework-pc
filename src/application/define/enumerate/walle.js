// Q钱包支付账单支付状态
const WalletBillsPaidState = {
  toBePaid: 1,
  payOngoing: 50,
  done: 100,
  fail: -100,
  void: -110,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.toBePaid: return '待支付';
      case this.payOngoing: return '支付中';
      case this.done: return '支付完成';
      case this.fail: return '支付失败';
      case this.void: return '已作废';
      default: '未定义';
    }
  },
};

// Q钱包钱包明细类型
const WalletDetailType = {
  recharge: 10,
  withdraw: 30,
  all: 1000,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.recharge: return '充值';
      case this.withdraw: return '提现';
      case this.all: return '全部';
      default: '未定义';
    }
  },
};

// Q钱包钱包明细交易状态
const WalletBillsPaidType = {
  approval: 10,
  code: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.approval: return '审批单类';
      case this.code: return 'CODE审批类';
      default: '未定义';
    }
  },
};

// 摊销管理，摊销状态
const AmortizationState = {
  processing: 50, // 进行中
  completed: 100, // 已完成
  terminated: 110, // 已终止（终止摊销）
  notStarted: 10, // 未开始（已确认摊销规则，但未到摊销开始日）
  notFund: 1, // 未定义（未确认摊销规则的数据）
  description(rawValue) {
    switch (rawValue) {
      case this.processing: return '进行中';
      case this.completed: return '已完成';
      case this.terminated: return '已终止';
      case this.notStarted: return '未开始';
      case this.notFund: return '未定义';
      default: return '未定义';
    }
  },
};

// 摊销管理，是否确认摊销规则状态
const AmortizationIsRedPush = {
  right: true, // 是
  negate: false, // 否
  description(rawValue) {
    switch (rawValue) {
      case this.right: return '是';
      case this.negate: return '否';
      default: return '未定义';
    }
  },
};

// 摊销确认状态
const AmortizationType = {
  not: 1, // 未进入摊销确认
  manual: 20, // 手动进入摊销确认
  description(rawValue) {
    switch (rawValue) {
      case this.not: return '未进入摊销确认';
      case this.manual: return '手动进入摊销确认';
      default: return '未定义';
    }
  },
};

// 摊销管理，是否确认摊销规则状态
const AmortizationIsConfirmRule = {
  right: true, // 是
  negate: false, // 否
  description(rawValue) {
    switch (rawValue) {
      case this.right: return '是';
      case this.negate: return '否';
      default: return '未定义';
    }
  },
};

// 摊销管理，剩余摊销金额计入方式
const AmortizationSurplusMoneyGreditWay = {
  allGredit: 10, // 全部计入
  notGredit: 20, // 不计入
  sectionGredit: 30, // 部分计入
  description(rawValue) {
    switch (rawValue) {
      case this.allGredit: return '全部计入';
      case this.notGredit: return '不计入';
      case this.sectionGredit: return '部分计入';
      default: return '未定义';
    }
  },
};

// 摊销周期类型
const AmortizationCycleType = {
  cycle: 10, // 按照周期
  startAndEnd: 20, // 按照起止日期
  description(rawValue) {
    switch (rawValue) {
      case this.cycle: return '按照周期（默认付款月为第一期）';
      case this.startAndEnd: return '按照起止日';
      default: return '未定义';
    }
  },
};

// 摊销周期类型
const AmortizationRuleType = {
  average: 10, // 平均分摊
  description(rawValue) {
    switch (rawValue) {
      case this.average: return '平均分摊';
      default: return '未定义';
    }
  },
};
// 是否需要邮寄
const MailRadioType = {
  yes: true,
  no: false,
  description(rawValue) {
    switch (rawValue) {
      case this.yes: return '是';
      case this.no : return '否';
      default:return '未定义';
    }
  },
};

// 摊销确认状态
const AmortizationCostAllocationState = {
  notEntered: 1, // 未进入摊销确认
  manualEntered: 20, // 手动进入摊销确认
  description(rawValue) {
    switch (rawValue) {
      case this.notEntered: return '未进入摊销确认';
      case this.manualEntered: return '手动进入摊销确认';
      default: return '未定义';
    }
  },
};

export {
  WalletBillsPaidState, // Q钱包支付账单支付状态
  WalletBillsPaidType, // Q钱包支付账单类型
  WalletDetailType, // Q钱包钱包明细类型
  AmortizationState, // 摊销状态
  AmortizationIsConfirmRule, // 是否确认摊销规则
  AmortizationIsRedPush, // 摊销确认，是否红冲
  AmortizationType, // 摊销确认状态
  AmortizationSurplusMoneyGreditWay, // 剩余摊销金额计入方式
  AmortizationCycleType, // 摊销周期类型
  AmortizationRuleType, // 摊销规则
  MailRadioType, // 是否需要邮寄
  AmortizationCostAllocationState, // 确认摊销状态
};
