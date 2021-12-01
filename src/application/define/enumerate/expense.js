// 费用单验票状态
const ExpenseTicketState = {
  already: 100, // 已验票
  waiting: 1, // 待验票
  abnormal: -1, // 验票异常
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.already:
        return '已验票';
      case this.waiting:
        return '待验票';
      case this.abnormal:
        return '验票异常';
      default:
        '未定义';
    }
  },
};

// 费用单验票存在状态
const ExpenseTicketExistState = {
  all: 1, // 全部
  have: 100, // 有
  no: -100, // 无
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all:
        return '全部';
      case this.have:
        return '有';
      case this.no:
        return '无';
      default:
        '未定义';
    }
  },
};

// 费用单发票类型
const ExpenseInvoiceType = {
  ordinary: 10, // 普通发票
  avt: 20, // 增值税专用发票
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.ordinary:
        return '普通发票';
      case this.avt:
        return '增值税专用发票';
      default:
        '未定义';
    }
  },
};

// 费用单发票类型
const ExpenseInvoiceTaxRate = {
  zero: 0,
  three: 0.03,
  five: 0.05,
  six: 0.06,
  nine: 0.09,
  ten: 0.1,
  thirteen: 0.13,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.zero:
        return '0%';
      case this.three:
        return '3%';
      case this.five:
        return '5%';
      case this.six:
        return '6%';
      case this.nine:
        return '9%';
      case this.ten:
        return '10%';
      case this.thirteen:
        return '13%';
      default:
        return '--';
    }
  },
};

// 费用单发票状态
const ExpenseTicketTagState = {
  normal: 100,
  delete: -101,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal:
        return '正常';
      case this.delete:
        return '删除';
      default:
        '未定义';
    }
  },
};

// 费用单类型
const ExpenseCostOrderType = {
  normal: 1,
  refund: 10,
  redPunch: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal:
        return '正常审批费用单';
      case this.refund:
        return '退款费用单';
      case this.redPunch:
        return '红冲费用单';
      default:
        '未定义';
    }
  },
};

// 费用的成本中心
const ExpenseCostCenterType = {
  project: 5, // 项目总部
  headquarter: 4, // 项目主体
  city: 3, // 城市
  district: 2, // 商圈
  knight: 1, // 骑士
  managementCost: 6, // 管理费用
  operatingSupport: 7, // 运营支持
  vehicleDirectly: 8, // 车辆直接成本
  vehicleIndirect: 9, // 车辆间接成本
  team: 10, // 团队
  person: 11, // 个人
  asset: 12, // 资产
  headquarters: 13, // 集团总部
  group: 20, // 集团
  description(rawValue) {
    switch (rawValue) {
      case this.project:
        return '项目总部'; // 平台
      case this.headquarter:
        return '项目主体'; // 供应商
      case this.city:
        return '城市';
      case this.district:
        return '商圈';
      case this.knight:
        return '骑士';
      case this.managementCost:
        return '管理费用';
      case this.operatingSupport:
        return '运营支持';
      case this.vehicleDirectly:
        return '车辆直接成本';
      case this.vehicleIndirect:
        return '车辆间接成本';
      case this.team:
        return '团队';
      case this.person:
        return '个人';
      case this.asset:
        return '资产';
      case this.headquarters:
        return '集团总部';
      case this.group:
        return '集团';
      default:
        return '未定义';
    }
  },
};

// 收款类型
const ExpenseCollectionType = {
  onlineBanking: 10, // 网银
  wallet: 20, // Q钱包
  noQWallet: 30, // 非Q钱包
  description(value) {
    switch (Number(value)) {
      case this.onlineBanking:
        return '网银';
      case this.wallet:
        return 'Q钱包';
      case this.noQWallet:
        return '非Q钱包';
      default:
        return '未定义';
    }
  },
};

// 费用分组，状态
const ExpenseCostGroupState = {
  enable: 100,
  disabled: -100,
  deleted: -101,
  edit: 1,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable:
        return '正常';
      case this.disabled:
        return '停用';
      case this.deleted:
        return '删除';
      case this.edit:
        return '草稿';
      default:
        return '未定义';
    }
  },
};

// 审批流类型
const ExpenseCostOrderBizType = {
  costOf: 1, // 成本类型
  noCostOf: 90, // 非成本类型
  transactional: 100, // 事务性
  description(rawValue) {
    switch (rawValue) {
      case this.costOf:
        return '成本类';
      case this.noCostOf:
        return '非成本类';
      case this.transactional:
        return '事务性';
      default:
        return '未定义';
    }
  },
};

// 审批岗位类型
const ExpenseExaminePostType = {
  normal: 100, // 正常
  disable: -100, // 停用
  draft: 1, // 草稿
  delete: -101, // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal:
        return '正常';
      case this.delete:
        return '删除';
      case this.draft:
        return '草稿';
      case this.disable:
        return '停用';
      default:
        return '未定义';
    }
  },
};

// 部门/子类型
const ExpenseDepartmentSubtype = {
  newAdd: 10, // 新增部门
  adjustment: 20, // 调整上级部门
  abolition: 30, // 裁撤部门
  addPost: 40, // 添加岗位
  addendum: 50, // 增编
  reduceStaff: 60, // 减编
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.newAdd:
        return '新增部门';
      case this.adjustment:
        return '调整上级部门';
      case this.abolition:
        return '裁撤部门';
      case this.addPost:
        return '添加岗位';
      case this.addendum:
        return '增编';
      case this.reduceStaff:
        return '减编';
      default:
        return '未定义';
    }
  },
};

// 金额调整
const ExpenseExamineFlowAmountAdjust = {
  upward: 1, // 向上调整
  down: -1, // 向下调整
  any: 0, // 任意调整
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.upward:
        return '向上调整';
      case this.down:
        return '向下调整';
      case this.any:
        return '任意调整';
      default:
        return '未定义';
    }
  },
};

// 审批单,流程状态
const ExpenseExamineOrderProcessState = {
  pendding: 1, // 待提交
  processing: 10, // 审批流进行中
  finish: 100, // 流程完成
  close: -100, // 流程关闭
  deleted: -101, // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding:
        return '待提交';
      case this.processing:
        return '审批流进行中';
      case this.finish:
        return '流程完成';
      case this.close:
        return '流程关闭';
      case this.deleted:
        return '删除';
      default:
        return '未定义';
    }
  },
};

// 付款审批,审核状态
const ExpenseExamineOrderVerifyState = {
  pendding: 1, // 待处理（首次未提交）
  waiting: 10, // 待补充
  exception: 50, // 异常
  reject: -100, // 驳回
  approve: 100, // 通过
  close: -101, // 已关闭
  recall: -50, // 撤回
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding:
        return '待处理（首次未提交）';
      case this.waiting:
        return '待补充';
      case this.exception:
        return '异常';
      case this.reject:
        return '不通过';
      case this.approve:
        return '通过';
      case this.close:
        return '已关闭';
      case this.recall:
        return '已撤回';
      default:
        return '未定义';
    }
  },
};

// 付款审批,付款状态
const ExpenseExamineOrderPaymentState = {
  paid: 100, // 已打款
  exception: -1, // 异常
  waiting: 1, // 未处理
  close: -100, // 关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.paid:
        return '已打款';
      case this.exception:
        return '异常';
      case this.waiting:
        return '未处理';
      case this.close:
        return '关闭';
      default:
        return '--';
    }
  },
};
// 是否开票
const ExpenseInvoiceFlag = {
  yes: true,
  no: false,
  description(rawValue) {
    switch (rawValue) {
      case this.yes:
        return '有';
      case this.no:
        return '无';
      default:
        return '未定义';
    }
  },
};
// 审批单操作人归属类型
const ExpenseApprovalType = {
  penddingSubmit: 1, // 待提报
  penddingVerify: 2, // 我待办的
  submit: 3, // 我提报的
  verify: 4, // 我经手的
  copyGive: 6, // 抄送我的
  all: 5, // 全部

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.penddingSubmit:
        return '待提报';
      case this.penddingVerify:
        return '我待办的';
      case this.submit:
        return '我提报的';
      case this.verify:
        return '我经手的';
      case this.copyGive:
        return '抄送我的';
      case this.all:
        return '全部';
      default:
        return '--';
    }
  },
};

// 费用申请单,状态
const ExpenseCostOrderState = {
  pendding: 1, // 待提交
  processing: 10, // 进行中
  done: 100, // 完成
  close: -100, // 关闭
  delete: -101, // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding:
        return '待提交';
      case this.processing:
        return '进行中';
      case this.done:
        return '完成';
      case this.close:
        return '关闭';
      case this.delete:
        return '删除';
      default:
        return '未定义';
    }
  },
};

// 费用申请单,付款状态
const ExpenseCostOrderPaymentState = {
  payment: 100, // 已付款
  untreated: 1, // 未处理
  abnormal: -1, // 异常
  close: -100, // 关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.payment:
        return '已付款';
      case this.untreated:
        return '未处理';
      case this.abnormal:
        return '异常';
      case this.close:
        return '关闭';
      default:
        return '未定义';
    }
  },
};

// 还款状态
const ExpenseRepaymentState = {
  hasAlso: 100, // 已还
  repaymenting: 50, // 还款中
  notYet: 1, // 未还
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.hasAlso:
        return '已还';
      case this.repaymenting:
        return '还款中';
      case this.notYet:
        return '未还';
      default:
        return '未定义';
    }
  },
};

// 费用管理-借还款管理tab类型
const ExpenseBorrowRepaymentsTabType = {
  mine: 1,
  all: 2,
  description(rawValue) {
    switch (rawValue) {
      case this.mine:
        return '我的';
      case this.all:
        return '全部';
      default:
        return '未定义';
    }
  },
};

// 加班tab类型
const ExpenseOverTimeTabType = {
  mine: 1,
  all: 2,
  description(rawValue) {
    switch (rawValue) {
      case this.mine:
        return '我的';
      case this.all:
        return '全部';
      default:
        return '未定义';
    }
  },
};

// 加班主题标签
const ExpenseOverTimeThemeTag = {
  product: '产品小组',
  data: '数据小组',
  mobile: '移动端小组',
  rearEnd: '后端小组',
  frontEnd: '前端小组',
  implement: '实施小组',
  qualityInspection: '质检小组',
  description(rawValue) {
    switch (rawValue) {
      case this.product:
        return '产品小组';
      case this.data:
        return '数据小组';
      case this.mobile:
        return '移动端小组';
      case this.rearEnd:
        return '后端小组';
      case this.frontEnd:
        return '前端小组';
      case this.implement:
        return '实施小组';
      case this.qualityInspection:
        return '质检小组';
      default:
        return '未定义';
    }
  },
};

// 费用申请单, 模版类型
const ExpenseCostOrderTemplateType = {
  refund: 1, // 报销
  rent: 2, // 新租
  continue: 3, // 续租
  break: 4, // 断租，提前终止合约
  renewal: 5, // 续签
  close: 6, // 退租，到期不续约
  travel: 7, // 差旅报销
  description(rawValue) {
    switch (rawValue) {
      case this.refund:
        return '报销';
      case this.rent:
        return '新租';
      case this.continue:
        return '续租';
      case this.renewal:
        return '续签';
      case this.break:
        return '断租，提前终止合约';
      case this.close:
        return '退租，到期不续约';
      case this.travel:
        return '差旅报销';
      default:
        return '未定义';
    }
  },
};

// 红冲退款单的状态标识
const InvoiceAjustAction = {
  normal: 1, // 正常
  refund: 10, // 退款费用单
  invoiceAdjust: 20, // 红冲费用单
  description(rawValue) {
    switch (rawValue) {
      case this.normal:
        return '正常';
      case this.refund:
        return '退款';
      case this.invoiceAdjust:
        return '红冲';
      default:
        return '未定义';
    }
  },
};

// 费用申请单，成本归属
const ExpenseCostOrderBelong = {
  average: 6,
  custom: 8,
  description(rawValue) {
    switch (rawValue) {
      case this.average:
        return '平均分摊';
      case this.custom:
        return '自定义分摊';
      default:
        return '未定义';
    }
  },
};

// 出差类别
const ExpenseBusinessTripType = {
  oneWay: 10,
  roundTrip: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.oneWay:
        return '单程';
      case this.roundTrip:
        return '往返';
      default:
        return '未定义';
    }
  },
};

// 出差方式
const ExpenseBusinessTripWay = {
  train: 101,
  bulletTrainOne: 201,
  bulletTrainTwo: 202,
  heightIronOne: 203,
  heightIronTwo: 204,
  planeOne: 301,
  planeTwo: 302,
  passengerCar: 401,
  drive: 501,
  TRAIN_ORDINARY_SOFT_SLEEPER: 101,
  softSleeper: 102, // 普快软卧
  highSpeedRailMotorCarOne: 205,
  highSpeedRailMotorCarTwo: 206,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.train:
        return '火车-普通列车';
      case this.bulletTrainOne:
        return '火车 - 动车 - 一等座';
      case this.bulletTrainTwo:
        return '火车 - 动车 - 二等座';
      case this.heightIronOne:
        return '火车 - 高铁 - 一等座';
      case this.heightIronTwo:
        return '火车 - 高铁 - 二等座';
      case this.planeOne:
        return '飞机 - 头等舱';
      case this.planeTwo:
        return '飞机 - 经济舱';
      case this.passengerCar:
        return '客车';
      case this.drive:
        return '自驾';
      case this.softSleeper:
        return '普快软卧';
      case this.highSpeedRailMotorCarOne:
        return '动车/高铁-一等座';
      case this.highSpeedRailMotorCarTwo:
        return '动车/高铁-二等座';
      default:
        return '未定义';
    }
  },
};


// 费用的房屋状态
const ExpenseHouseState = {
  new: 1,
  continue: 2,
  sign: 3,
  break: -1,
  cancel: 0,
  description(rawValue) {
    switch (rawValue) {
      case this.new:
        return '新租';
      case this.continue:
        return '续租';
      case this.sign:
        return '续签';
      case this.break:
        return '断租';
      case this.cancel:
        return '退租';
      default:
        return '--';
    }
  },
};

// 审批单审批进度状态
// TODO: 确定, 可删除
const ExpenseProcessState = {
  pendding: 1, // 待处理
  waiting: 10, // 待补充
  error: 50, // 异常
  reject: -100, // 驳回
  success: 100, // 通过
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding:
        return '待处理';
      case this.waiting:
        return '待补充';
      case this.error:
        return '异常';
      case this.reject:
        return '驳回';
      case this.success:
        return '通过';
      default:
        return '--';
    }
  },
};
// 请假类型
const ExpenseAttendanceTakeLeaveType = {
  things: 10, // 事假
  disease: 20, // 病假
  years: 30, // 年假
  marriage: 40, // 婚假
  maternity: 50, // 产假
  paternal: 60, // 陪产假
  bereavement: 70, // 丧假
  goOut: 80, // 外出
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.things:
        return '事假';
      case this.disease:
        return '病假';
      case this.years:
        return '年假';
      case this.marriage:
        return '婚假';
      case this.maternity:
        return '产假';
      case this.paternal:
        return '陪产假';
      case this.bereavement:
        return '丧假';
      case this.goOut:
        return '外出';
      default:
        return '--';
    }
  },
};

// 费用管理-出差管理-报销状态
const ExpenseTravelApplicationBizState = {
  undone: 1,
  completed: 100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.undone:
        return '未报销';
      case this.completed:
        return '已报销';
      default:
        return '未定义';
    }
  },
};

// 费用单团队类型
const ExpenseTeamType = {
  owner: 1,
  personalEd: 2,
  personalEdTeam: 3,
  industry: 4,
  data: 5,
  operationAndMaintenance: 6,
  business: 7,
  departmentCoach: 10,
  departmentCoachTeam: 20,
  departmentSub: 30,
  departmentBusiness: 40,
  departmentOwner: 50,
  description(rawValue) {
    switch (rawValue) {
      case this.owner:
        return '业主小队';
      case this.personalEd:
        return '私教小队';
      case this.personalEdTeam:
        return '私教团队';
      case this.industry:
        return '业务赋能小队';
      case this.data:
        return '数据小队';
      case this.operationAndMaintenance:
        return '运维小队';
      case this.business:
        return '商务小队';
      case this.departmentCoach:
        return '私教';
      case this.departmentCoachTeam:
        return '大区';
      case this.departmentSub:
        return '分部';
      case this.departmentBusiness:
        return '事业部';
      case this.departmentOwner:
        return '业主';
      default:
        return '未定义';
    }
  },
};

// 科目级别
const OaCostAccountingLevel = {
  one: 1,   // 一级
  two: 2,   // 二级
  three: 3, // 三级
  four: 4,  // 四级
  five: 5,  // 五级
  six: 6,   // 六级
  seven: 7, // 七级
  eight: 8, // 八级
  nine: 9,  // 九级
  ten: 10,  // 十级
  description(rawValue) {
    switch (rawValue) {
      case this.one: return '一级';
      case this.two: return '二级';
      case this.three: return '三级';
      case this.four: return '四级';
      case this.five: return '五级';
      case this.six: return '六级';
      case this.seven: return '七级';
      case this.eight: return '八级';
      case this.nine: return '九级';
      case this.ten: return '十级';
      default: return '未定义';
    }
  },
};

// 科目状态
const OaCostAccountingState = {
  normal: 100, // 正常
  disable: -100,  // 停用
  delete: -101, // 删除
  draft: 1,     // 草稿
  description(rawValue) {
    switch (rawValue) {
      case this.normal: return '正常';
      case this.disable: return '停用';
      case this.delete: return '删除';
      case this.draft: return '草稿';
      default: return '未定义';
    }
  },
};

// 成本信息
// TODO: 确定 可删除
const OaCostAccountingCostCenter = {
  one: 1,   // 项目主体
  two: 2,   // 项目主体总部
  three: 3, // 城市
  four: 4,  // 商圈
  five: 5,  // 骑士
  description(rawValue) {
    switch (rawValue) {
      case this.one: return '项目主体';
      case this.two: return '项目主体总部';
      case this.three: return '城市';
      case this.four: return '商圈';
      case this.five: return '骑士';
      default: return '未定义';
    }
  },
};

// 审批流列表状态值
// 上一版 export const OaApplicationFlowTemplateState
const OaApplicationFlowTemplateState = {
  normal: 100, // 正常
  disable: -100,  // 停用
  delete: -101, // 删除
  draft: 1,     // 草稿
  description(rawValue) {
    switch (rawValue) {
      case this.normal: return '正常';
      case this.disable: return '停用';
      case this.delete: return '删除';
      case this.draft: return '草稿';
      default: return '未定义';
    }
  },
};

// 审批单类型
const OaApplicationOrderType = {
  cost: 1, // 费用申请
  salaryRules: 2,  // 服务费规则
  salaryIssue: 3, // 服务费发放
  supplies: 4,     // 物资采购
  housing: 5,      // 房屋管理
  borrowing: 6,    // 借款申请
  repayments: 7, // 还款
  business: 8,      // 出差申请
  travel: 9,        // 差旅报销
  overTime: 10,    // 加班申请
  takeLeave: 11,   // 请假申请
  turnover: 12,    // 人员异动
  externalApproval: 13,    // 外部审批管理
  recruitment: 101,   // 部门招聘申请
  authorizedStrength: 102,   // 部门增编申请
  employ: 108,   // 录用申请
  official: 103, // 转正申请
  renew: 104, // 劳动合同续签申请
  positionTransfer: 105, // 人事调动申请
  resign: 106, // 离职申请
  jobHandover: 107, // 工作交接
  leave: 201, // 请假申请
  overtime: 202, // 加班申请
  externalOut: 203, // 外出申请
  abnormal: 204, // 考勤异常申请
  useSeal: 303, // 用章申请
  carveSeal: 301, // 印章刻制申请
  invalidSeal: 302, // 印章作废申请
  businessCard: 305, // 名片申请
  borrowLicense: 306, // 证照借用申请
  reward: 308, // 奖罚申请
  borrowSeal: 309,  // 借章申请
  company: 401, // 注册/注销公司申请
  companyChange: 402, // 公司变更
  bankAccount: 403, // 银行开户申请
  cancellationBank: 404, // 注销银行账户申请
  contractCome: 405, // 合同会审申请
  contractBorrowing: 406, // 合同借阅申请
  oaBusiness: 601, // 出差申请（事务）
  description(rawValue) {
    switch (rawValue) {
      case this.cost: return '费用申请';
      case this.salaryRules: return '服务费规则';
      case this.salaryIssue: return '服务费发放';
      case this.supplies: return '物资采购';
      case this.housing: return '房屋管理';
      case this.borrowing: return '借款申请';
      case this.repayments: return '还款';
      case this.business: return '出差申请';
      case this.travel: return '差旅报销';
      case this.overTime: return '加班申请';
      case this.takeLeave: return '请假申请';
      case this.turnover: return '人员异动';
      case this.externalApproval: return '外部审批管理';
      case this.recruitment: return '部门招聘申请';
      case this.authorizedStrength: return '部门增编申请';
      case this.employ: return '录用申请';
      case this.official: return '转正申请';
      case this.renew: return '劳动合同续签申请';
      case this.positionTransfer: return '人事调动申请';
      case this.resign: return '离职申请';
      case this.jobHandover: return '工作交接';
      case this.leave: return '请假申请';
      case this.overtime: return '加班申请';
      case this.externalOut: return '外出申请';
      case this.abnormal: return '考勤异常申请';
      case this.useSeal: return '用章申请';
      case this.carveSeal: return '印章刻制申请';
      case this.invalidSeal: return '印章作废申请';
      case this.businessCard: return '名片申请';
      case this.borrowLicense: return '证照借用申请';
      case this.reward: return '奖罚申请';
      case this.borrowSeal: return '借章申请';
      case this.company: return '注册/注销公司申请';
      case this.companyChange: return '公司变更申请';
      case this.bankAccount: return '银行开户申请';
      case this.cancellationBank: return '注销银行账户申请';
      case this.contractCome: return '合同会审申请';
      case this.contractBorrowing: return '合同借阅申请';
      default: return '未定义';
    }
  },
};


// 出差申请单状态
const OaApplicationTravelApplyOrderState = {
  delete: -101, // 删除
  close: -100, // 关闭
  staySubmit: 1, // 待提交
  complete: 100, // 完成
  conduct: 10, // 进行中
  description(rawValue) {
    switch (rawValue) {
      case this.delete: return '删除';
      case this.close: return '关闭';
      case this.staySubmit: return '待提交';
      case this.complete: return '完成';
      case this.conduct: return '进行中';
      default: return '未定义';
    }
  },
};

// 审批流审批规则
// 上一版 export const OaApplicationFlowTemplateApproveMode
const OaApplicationFlowTemplateApproveMode = {
  all: 10, // 全部
  any: 20,  // 任一
  description(rawValue) {
    switch (rawValue) {
      case this.all: return '全部';
      case this.any: return '任一';
      default: return '未定义';
    }
  },
};

// 审批流指派
const OaApplicationFlowAssigned = {
  automatic: 2, // 自动指派
  manual: 1,  // 手动指派
  description(rawValue) {
    switch (rawValue) {
      case this.automatic: return '自动分配';
      case this.manual: return '手动指派';
      default: return '未定义';
    }
  },
};

// 审批流节点调控
const OaApplicationFlowRegulation = {
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

// 是否可查看历史审批单
const OaApplicationisViewHistory = {
  is: 1, // 允许
  no: 2,  // 不允许
  description(rawValue) {
    switch (rawValue) {
      case this.is: return '允许';
      case this.no: return '不允许';
      default: return '未定义';
    }
  },
};

// 工作交接类型
const OaApplicationJobHandoverType = {
  resign: 10, // 离职交接
  other: 99,  // 异动交接
  description(rawValue) {
    switch (rawValue) {
      case this.resign: return '离职交接';
      case this.other: return '异动交接';
      default: return '未定义';
    }
  },
};

// 转交原因
const OaApplicationApprovalTransferReason = {
  resign: 10, // 员工离职
  description(rawValue) {
    switch (rawValue) {
      case this.resign: return '员工离职';
      default: return '未定义';
    }
  },
};

// 审批流配置类型
const ExamineFlowConfigType = {
  houseManage: 'house_contract',      // 房屋管理
  salaryPlan: 'salary_plan',          // 服务费规则
  salaryIssue: 'salary_payment',      // 服务费发放
  description(rawValue) {
    switch (rawValue) {
      case this.houseManage: return '房屋管理';
      case this.salaryPlan: return '服务费规则';
      case this.salaryIssue: return '服务费发放';
      default: return '未定义';
    }
  },
};

// OA请假类型
const OAAttendanceTakeLeaveType = {
  things: 10,    // 年休假
  disease: 20,   // 婚假
  years: 30,     // 病假
  marriage: 40,  // 事假
  maternity: 50, // 产假
  paternal: 60,  // 陪产假
  bereavement: 70, // 丧假
  compensatory: 80, // 调休
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.things: return '年休假';
      case this.disease: return '婚假';
      case this.years: return '病假';
      case this.marriage: return '事假';
      case this.maternity: return '产假';
      case this.paternal: return '陪产假';
      case this.bereavement: return '丧假';
      case this.compensatory: return '调休';
      default: return '--';
    }
  },
};

// 考勤异常类型
const OaAttendanceAbnormalState = {
  forget: 10,    // 忘打卡
  other: 99,    // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.forget: return '忘打卡';
      case this.other: return '其他';
      default: '--';
    }
  },
};

// 借阅类型 (印章+合同)
const OABorrowingType = {
  sealOriginal: 10,   // 印章原件
  sealCopy: 20,       // 印章复印件
  sealScanning: 30,   // 印章扫描件
  original: 40,       // 合同原件
  copy: 50,           // 合同复印件
  scanning: 60,       // 电子版
  other: 70,          // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.sealOriginal: return '原件';
      case this.sealCopy: return '复印件';
      case this.sealScanning: return '扫描件';
      case this.original: return '合同原件';
      case this.copy: return '合同复印件';
      case this.scanning: return '电子版';
      case this.other: return '其他';
      default: '未定义';
    }
  },
  transDescription(rawValue) {
    switch (Number(rawValue)) {
      case this.original: return 10;
      case this.copy: return 20;
      case this.scanning: return 30;
      case this.other: return 40;
      default: '未定义';
    }
  },
};


// 借阅类型
const OAContractBorrowingType = {
  original: 10,       // 合同原件
  copy: 20,           // 合同复印件
  scanning: 30,       // 合同扫描件
  other: 40,          // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.original: return '合同原件';
      case this.copy: return '合同复印件';
      case this.scanning: return '合同扫描件';
      case this.other: return '其他';
      default: '未定义';
    }
  },
};

// 盖章类型
const OAContractStampType = {
  weFirst: 170,       // 我方先盖章
  weNext: 180,        // 我方后盖章
  unNeed: 190,        // 无需盖章存档
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.weFirst: return '我方先盖章';
      case this.weNext: return '我方后盖章';
      case this.unNeed: return '无需盖章存档';
      default: '未定义';
    }
  },
};

// OA - 行政类 - 印章类型
const AdministrationSealType = {
  common: 10,
  contract: 20,
  legal: 30,
  finance: 40,
  bill: 50,
  other: 60,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.common: return '公章';
      case this.contract: return '合同章';
      case this.legal: return '法人章';
      case this.finance: return '财务章';
      case this.bill: return '发票专用章';
      case this.other: return '其它章';
      default: '未定义';
    }
  },
};
// OA - 行政类 - 奖惩措施
const AdministrationRewardWay = {
  praise: 10, // 奖励-书面表彰
  money: 20, // 奖励-奖金
  warning: 30,  // 书面警告
  fire: 40,  // 辞退
  fine: 50,  // 罚款
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.praise: return '奖励-书面表彰';
      case this.money: return '奖励-奖金';
      case this.warning: return '书面警告';
      case this.fire: return '辞退';
      case this.fine: return '罚款';
      default: '未定义';
    }
  },
};
// OA - 行政类 - 证照
const AdministrationLicense = {
  original: 10,        // 原件
  copies: 20,          // 复印件
  scannedCopy: 30,     // 扫描件
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.original: return '原件';
      case this.copies: return '复印件';
      case this.scannedCopy: return '扫描件';
      default: '未定义';
    }
  },
};

// OA - 行政类 - 证照类型
const AdministrationLicenseType = {
  original: 10,     // 正本
  copy: 20,        // 副本
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.original: return '正本';
      case this.copy: return '副本';
      default: '未定义';
    }
  },
};
// OA - 行政类 - 用章类型
const AdministrationUseSealType = {
  use: 10,            // 用章
  borrow: 20,        // 借章
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.use: return '用章';
      case this.borrow: return '借章';
      default: '未定义';
    }
  },
};

// OA - 入职方式
const OAentrySource = {
  official: 10,
  service: 20,
  intern: 30,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.official: return '正式';
      case this.service: return '劳务工';
      case this.intern: return '实习生';
      default: '未定义';
    }
  },
};

// 费用单发票红冲状态
const CostOrderTicketPunchState = {
  unprocessed: 1,
  done: 100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.unprocessed: return '未处理';
      case this.done: return '已完成';
      default: '未定义';
    }
  },
};
// OA - 请假时长
const OALeaveDayType = {
  levelA: 10,
  levelB: 20,
  levelC: 30,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.levelA: return 'x≤5';
      case this.levelB: return '5<x≤10';
      case this.levelC: return '10<x';
      default: '未定义';
    }
  },
};

// 外部审批-事务审批
const OAExtra = {
  701: 'oaOrganizationOrderInfo',                // 组织管理
  101: 'recruitmentOrderInfo', // 招聘管理 - 招聘需求表单
  102: 'addendumOrderInfo',     // 增编管理 - 增编申请表
  103: 'positiveOrderInfo',     // 转正申请 - 转正申请表单
  104: 'renewContractOrderInfo',  // 合同续签 - 合同续签申请表
  105: 'humanResourceTransferOrderInfo',  // 人事异动 - 人事异动申请表
  106: 'departureOrderInfo',      // 离职申请 - 离职申请表
  107: 'handoverOrderInfo',       // 工作交接 - 工作交接表
  108: 'employOrderInfo',         // 录用申请 - 录用申请表单
  109: 'employmentApplyOrderInfo', // 入职申请 - 入职申请表单
  201: 'leaveOrderInfo',          // 请假 - 请假申请表
  202: 'extraWorkOrderInfo',      // 加班 - 加班申请表
  203: 'breakOrderInfo',          // 外出 - 外出申请表
  204: 'attendanceExceptionOrderInfo',  // 考勤异常 - 考勤异常申请表
  // xxx: 'leaveSpecieInfo',         // 假种配置 - 假种配置页面'
  301: 'sealModifyOrderInfo',     // 印章刻制 - 印章刻制申请表
  302: 'sealModifyOrderInfo',     // 印章作废 - 印章作废申请表
  303: 'sealUseOrderInfo',        // 用章申请 - 用章申请表
  // xxx: 'sealInfo',                // 用章申请 - 印章库
  305: 'visitingCardOrderInfo',   // 名片申请 - 名片申请表
  306: 'certBorrowOrderInfo',     // 证照借用 - 证照借用
  // xxx: 'certInfo',                // 证照借用 - 证照库
  308: 'prizeOrderInfo',          // 奖惩通知 - 奖惩通知表单
  309: 'sealUseOrderInfo',        // 用章申请 - 借章申请表
  401: 'firmModifyOrderInfo',     // 注册公司 - 注销/注册公司申请表
  402: 'firmModifyOrderInfo',     // 公司变更 - 公司变更申请表
  403: 'firmBankOrderInfo',       // 银行开户 - 银行开户申请表
  404: 'firmBankOrderInfo',       // 注销开户 - 注销银行账户申请
  405: 'pactApplyOrderInfo',      // 合同会审 - 合同会审审批
  406: 'pactBorrowOrderInfo',     // 合同借阅 - 合同借阅审批
  408: 'capitalAllocateOrderInfo', // 资金调拨 - 资金调拨审批
  501: 'petitionOrderInfo',     // 事务签呈 - 事务签呈审批
  // xxx: 'pactInfo',                // 合同借阅 - 合同库
};

// 关联审批流tab类型
const RelationExamineFlowTabType = {
  codeTeam: 10,
  affair: 20,
  cost: 30,
  noCost: 40,
  description(rawValue) {
    switch (rawValue) {
      case this.codeTeam: return 'code/team审批流';
      case this.affair: return '事务审批流';
      case this.cost: return '成本类审批流';
      case this.noCost: return '非成本类审批流';
      default: return '未定义';
    }
  },
};

// 房屋管理下的 收款类型 枚举
const PayModeEnumer = {
  credit: 20, // 对公： 统一信用代码
  idCard: 10, // 对私： 身份证号
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.credit:return '对公';
      case this.idCard:return '对私';
      default: return '--';
    }
  },
};

// 审批流商户类型
const RelationExamineFlowMerchantType = {
  quhuo: 10, // 趣活
  bu3: 20, // bu3（兴达）
  description(rawValue) {
    switch (rawValue) {
      case this.quhuo: return '趣活';
      case this.bu3: return 'bu3';
      default: return '未定义';
    }
  },
};

// 关联审批流可用状态
const RelationExamineFlowAvailableState = {
  available: 100, // 可用
  noAvailable: -100, // 不可用
  description(rawValue) {
    switch (rawValue) {
      case this.available: return '可用';
      case this.noAvailable: return '不可用';
      default: return '未定义';
    }
  },
};

// 关联审批流状态
const RelationExamineFlowState = {
  normal: 100, // 正常
  disable: -100,  // 停用
  delete: -101, // 删除
  description(rawValue) {
    switch (rawValue) {
      case this.normal: return '正常';
      case this.disable: return '停用';
      case this.delete: return '删除';
      default: return '未定义';
    }
  },
};

export {
  ExpenseCostCenterType, // 成本中心类型
  ExpenseCollectionType, // 收款类型
  ExpenseCostGroupState, // 费用分组,状态
  ExpenseExamineFlowAmountAdjust, // 审批流,金额调整
  InvoiceAjustAction,                    // 红冲退款单的状态标识
  ExpenseApprovalType,                  // 审批单操作人归属类型
  ExpenseCostOrderBizType,              // 审批流,类型
  ExpenseExaminePostType,               // 审批岗位类型
  ExpenseDepartmentSubtype,             // 部门/子类型
  ExpenseExamineOrderProcessState,      // 付款审批,流程状态
  ExpenseExamineOrderVerifyState,       // 付款审批,审批状态
  ExpenseExamineOrderPaymentState,      // 付款审批,付款状态
  ExpenseCostOrderState,                // 费用申请单,状态
  ExpenseCostOrderPaymentState,         // 费用申请单,付款状态
  ExpenseCostOrderTemplateType,         // 费用申请单,模版类型
  ExpenseCostOrderBelong,               // 费用申请单,成本归属
  ExpenseBusinessTripType,              // 出差类别
  ExpenseBusinessTripWay,               // 出差方式
  ExpenseRepaymentState,                // 还款状态
  ExpenseBorrowRepaymentsTabType,       // 费用管理-借还款管理tab类型
  ExpenseOverTimeTabType,               // 加班tab类型
  ExpenseOverTimeThemeTag,              // 加班主题标签
  ExpenseTravelApplicationBizState,     // 费用管理-出差管理-报销状态
  ExpenseHouseState,            // 房屋状态
  ExpenseProcessState,          // 审批单进度审核状态
  ExpenseInvoiceFlag,           // 是否开票的类型
  ExpenseAttendanceTakeLeaveType,       // 请假类型
  ExpenseTicketState, // 费用单验票状态
  ExpenseTicketExistState, // 费用单验票存在状态
  ExpenseInvoiceType, // 费用单发票类型
  ExpenseInvoiceTaxRate, // 费用单发票税率
  ExpenseTicketTagState, // 验票标签状态
  ExpenseCostOrderType, // 费用单类型
  ExpenseTeamType, // 费用团队类型
  OaApplicationFlowTemplateState,       // 审批流列表状态
  OaApplicationOrderType,                 // 审批流类型
  OaApplicationTravelApplyOrderState,     // 出差申请单状态
  ExamineFlowConfigType,                // 审批流配置类型
  OaCostAccountingLevel,                // 科目级别
  OaCostAccountingState,                // 科目状态
  OaApplicationFlowTemplateApproveMode, // 审批流审批规则
  OaApplicationFlowAssigned,            // 审批流指派
  OaApplicationFlowRegulation,          // 审批流节点调控
  OaApplicationisViewHistory,           // 是否可查看历史审批单
  OaApplicationJobHandoverType,         // 工作交接类型
  OaApplicationApprovalTransferReason,  // 转交原因
  OaCostAccountingCostCenter,           // 成本信息
  CostOrderTicketPunchState, // 费用单发票红冲状态
  OaAttendanceAbnormalState, // 考勤异常类型
  OAAttendanceTakeLeaveType, // OA请假类型
  OABorrowingType, // 借阅类型
  OAContractBorrowingType, // 借阅类型
  OAContractStampType, // 盖章类型
  OAentrySource,  // OA - 入职方式
  AdministrationSealType,     // OA - 行政类 - 印章类型
  AdministrationRewardWay,    // OA - 行政类 - 奖惩措施
  AdministrationLicense,      // OA - 行政类 - 证照
  AdministrationLicenseType,  // OA - 行政类 - 证照类型
  AdministrationUseSealType,  // OA - 行政类 - 证照类型
  OALeaveDayType,   // OA - 请假时长
  OAExtra,            // 外部审批-事务审批
  RelationExamineFlowTabType, // 关联审批流tab类型
  RelationExamineFlowMerchantType, // 审批流商户类型
  RelationExamineFlowAvailableState, // 关联审批流可用状态
  RelationExamineFlowState, // 关联审批流状态
  PayModeEnumer,      // 房屋管理下的 收款类型 枚举
};
