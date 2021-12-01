// 人员类型
const EmployeeWorkType = {
  fulltime: 3001,
  parttime: 3002,
  description(rawValue) {
    switch (rawValue) {
      case this.fulltime:
        return '全职';
      case this.parttime:
        return '兼职';
      default:
        return '未定义';
    }
  },
  rawValue(description) {
    switch (description) {
      case '全职':
        return this.fulltime;
      case '兼职':
        return this.parttime;
      case '实习生':
        return this.intern;
      default:
        return undefined;
    }
  },
};

// 收款类型
const EmployeeCollectionType = {
  personal: 10,
  collecting: 20,
  description(rawValue) {
    switch (rawValue) {
      case this.personal:
        return '本人银行卡';
      case this.collecting:
        return '他人代收';
      default:
        return '未定义';
    }
  },
};

// 银行状态
const EmployeeBankState = {
  effective: 10,
  failure: 20,
  description(rawValue) {
    switch (rawValue) {
      case this.effective:
        return '有效中';
      case this.failure:
        return '已过期';
      default:
        return '未定义';
    }
  },
};

// 人员异动审情状态
const EmployeeTurnoverApplyState = {
  pendding: 1, // 草稿
  verifying: 10, // 审批中
  rejected: 50, // 驳回
  done: 100, // 审批完成
  withdraw: -100, // 已撤回
  close: -101, // 已关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding:
        return '草稿';
      case this.verifying:
        return '审批中';
      case this.rejected:
        return '驳回';
      case this.done:
        return '审批完成';
      case this.withdraw:
        return '已撤回';
      case this.close:
        return '已关闭';
      default:
        return '未定义';
    }
  },
};

const EmployeeTurnoverInfoChangeTask = {
  finished: 100, // 完成
  unfinished: 10, // 未完成
  detele: -100, // 已删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.finished:
        return '已完成';
      case this.unfinished:
        return '未完成';
      case this.detele:
        return '已删除';
      default:
        return '未定义';
    }
  },
};

// 人员异动主题标签
const EmployeeTurnoverThemeTag = {
  promotion: '晋升', // 晋升
  demotion: '降职', // 降职
  level: '平调', // 平调
  description(rawValue) {
    switch (rawValue) {
      case this.promotion:
        return '晋升';
      case this.demotion:
        return '降职';
      case this.level:
        return '平调';
      default:
        return '未定义';
    }
  },
};

// 劳动者个户注册状态
const EmployeeIndividualState = {
  examineIn: 10, // 审核中
  examineHang: 103, // 审核中
  success: 100, // 审核通过
  error: -100, // 审核失败
  description(rawValue) {
    switch (rawValue) {
      case this.examineIn:
        return '审核中';
      case this.examineHang:
        return '审核中';
      case this.success:
        return '审核通过';
      case this.error:
        return '审核失败';
      default:
        return '--';
    }
  },
};

// 人员是否在职
const DutyState = {
  onDuty: 50, // 在职
  onResignToApprove: 1, // 离职待审核
  onResign: -50, // 离职
  onPosition: 100, // 在职
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.onDuty:
        return '在职';
      case this.onResignToApprove:
        return '离职待审核';
      case this.onResign:
        return '离职';
      case this.onPosition:
        return '在职';
      default:
        return '--';
    }
  },
};

// 员工状态
const StaffSate = {
  inService: 100,
  departure: -100,
  willResign: -110,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.inService:
        return '在职';
      case this.departure:
        return '离职';
      case this.willResign:
        return '待离职';
      default:
        return '--';
    }
  },
};

// 待离职员工状态
const PendingDepartureState = {
  inService: 1, // 正常在职
  departure: 100, // 已离职
  willResign: 10, // 待离职
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.inService:
        return '正常在职';
      case this.departure:
        return '已离职';
      case this.willResign:
        return '待离职';
      default:
        return '--';
    }
  },
};


// 员工标签
const StaffTag = {
  partTime: 10,
  probation: 20,
  correct: 30,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.partTime:
        return '兼职';
      case this.probation:
        return '试用期';
      case this.correct:
        return '已转正';
      default:
        return '--';
    }
  },
};

// 员工类型
const StaffType = {
  fullTime: 10,
  partTime: 20,
  intern: 30,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.fullTime:
        return '全职';
      case this.partTime:
        return '兼职';
      case this.intern:
        return '实习生';
      default:
        return '--';
    }
  },
};

// 档案类型
const FileType = {
  first: 10, // 劳动者档案
  second: 20, // 劳动者档案
  staff: 30, // 员工档案
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.first:
        return '劳动者档案';
      case this.second:
        return '劳动者档案';
      case this.staff:
        return '员工档案';
      default:
        return '--';
    }
  },
};

// 人员档案——合同状态
const ContractState = {
  uploaded: 100, // 已上传
  notUpload: 1, // 未上传
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.uploaded:
        return '已上传';
      case this.notUpload:
        return '未上传';
      default:
        return '--';
    }
  },
};

// 人员档案——团队身份
const StaffTeamRank = {
  first: 1, // 一线
  second: 2, // 二线
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.first:
        return '一线';
      case this.second:
        return '二线';
      default:
        return '--';
    }
  },
};

// 人员档案——无需个户注册原因
const TeamNoAccountRegistrationReason = {
  // normal: 1,                          // 正常
  applyLowInsurance: 2, // 申请低保中
  receiveLowInsurance: 3, // 领取低保中
  oneselfApplyAffordableHousing: 4, // 本人申请经济适用房
  familyApplyAffordableHousing: 5, // 家人申请经济适用房
  description(rawValue) {
    switch (Number(rawValue)) {
      // case this.normal: return '正常';
      case this.applyLowInsurance:
        return '申请低保中';
      case this.receiveLowInsurance:
        return '领取低保中';
      case this.oneselfApplyAffordableHousing:
        return '本人申请经济适用房';
      case this.familyApplyAffordableHousing:
        return '家人申请经济适用房';
      default:
        return '--';
    }
  },
};

// 人员档案——成员类型
const TeamMemberAttribute = {
  fullTime: 10, // 全职
  partTime: 20, // 正常兼职
  highPricePartTime: 30, // 高价兼职
  holidayWorker: 40, // 假期工
  temporaryWorker: 50, // 临时工（午高峰及周末）
  nothing: 99, // 无
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.fullTime:
        return '全职';
      case this.partTime:
        return '正常兼职';
      case this.highPricePartTime:
        return '高价兼职';
      case this.holidayWorker:
        return '假期工';
      case this.temporaryWorker:
        return '临时工（午高峰及周末）';
      case this.nothing:
        return '无';
      default:
        return '--';
    }
  },
};

// 第三方平台ID stateType
const CustomListType = {
  noUse: 1,
  using: 100,
  invalid: -100,
  deleted: -101,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.noUse:
        return '待使用';
      case this.using:
        return '正常';
      case this.invalid:
        return '终止';
      case this.deleted:
        return '已删除';
      default:
        return '--';
    }
  },
};

// 个户类型
const HouseholdType = {
  first: 3001, // 甲类
  second: 3002, // 乙类
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.first:
        return '甲类';
      case this.second:
        return '乙类';
      default:
        return '--';
    }
  },
};

// 政治面貌
const PoliticalStatusType = {
  partyMember: 10, // 中共党员
  prepPartyMember: 20, // 中共预备党员
  member: 30, // 共青团员
  masses: 40, // 群众
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.partyMember:
        return '中共党员';
      case this.prepPartyMember:
        return '中共预备党员';
      case this.member:
        return '共青团员';
      case this.masses:
        return '群众';
      default:
        return '--';
    }
  },
};

// 婚姻状况
const MaritalStatusType = {
  married: 10, // 已婚
  unmarried: 20, // 未婚
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.married:
        return '已婚';
      case this.unmarried:
        return '未婚';
      default:
        return '--';
    }
  },
};

// 证件类型
const PaperworkType = {
  idCard: 10, // 居民身份证
  sergeant: 20, // 士官证
  student: 30, // 学生证
  passport: 40, // 护照
  hmPass: 50, // 港澳通行证
  health: 60, // 健康证
  drive: 70, // 驾驶证
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.idCard:
        return '居民身份证';
      case this.sergeant:
        return '士官证';
      case this.student:
        return '学生证';
      case this.passport:
        return '护照';
      case this.hmPass:
        return '港澳通行证';
      case this.health:
        return '健康证';
      case this.drive:
        return '驾驶证';
      default:
        return '--';
    }
  },
};

// 合同类型
const ContractType = {
  contract: 10, // 承揽协议
  labor: 20, // 劳动合同
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.contract:
        return '承揽协议';
      case this.labor:
        return '劳动合同';
      default:
        return '--';
    }
  },
};

// 时间周期
const TimeCycle = {
  year: 10, // 年
  month: 20, // 月
  day: 30, // 日
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.year:
        return '年';
      case this.month:
        return '月';
      case this.day:
        return '日';
      default:
        return '--';
    }
  },
};

// 最高学历
const HighestEducation = {
  doctor: 10, // 博士及以上
  master: 20, // 硕士
  undergraduate: 30, // 本科
  juniorCollege: 40, // 大专
  secondary: 50, // 中专
  highSchool: 60, // 高中
  juniorHighSchool: 70, // 初中及以下
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.doctor:
        return '博士及以上';
      case this.master:
        return '硕士';
      case this.undergraduate:
        return '本科';
      case this.juniorCollege:
        return '大专';
      case this.secondary:
        return '中专';
      case this.highSchool:
        return '高中';
      case this.juniorHighSchool:
        return '初中及以下';
      default:
        return '--';
    }
  },
};

// 推荐平台
const RecommendedPlatformStaff = {
  zhiLian: 3001, // 智联
  BOSS: 3002, // BOSS直聘
  liePin: 3003, // 猎聘
  other: 3004, // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.zhiLian:
        return '智联';
      case this.BOSS:
        return 'BOSS直聘';
      case this.liePin:
        return '猎聘';
      case this.other:
        return '其他';
      default:
        return '--';
    }
  },
};

// 员工档案tab
const EmployeePageSetp = {
  basic: '10',
  work: '20',
  costCenter: '30',
  contract: '40',
  welfare: '50',
  career: '60',
  description(rawValue) {
    switch (rawValue) {
      case this.basic:
        return '员工基础信息';
      case this.work:
        return '系统信息';
      case this.costCenter:
        return 'Team成本中心';
      case this.contract:
        return '合同信息';
      case this.welfare:
        return '福利信息';
      case this.career:
        return '职业生涯';
      default:
        return '未定义';
    }
  },
};

// 员工档案页面tab枚举
const EmployeeUpdatePageSetp = {
  one: '1', // 档案信息
  two: '2', // TEAM成本中心
  description(rawValue) {
    switch (rawValue) {
      case this.one: return '档案信息';
      case this.two: return 'TEAM成本中心';
      default: return '--';
    }
  },
};

// 劳动者档案tab
const LaborerPageSetp = {
  basic: '10',
  costCenter: '20',
  work: '30',
  contract: '40',
  description(rawValue) {
    switch (rawValue) {
      case this.basic: return '劳动者基础信息';
      case this.costCenter: return 'Team成本中心';
      case this.work: return '系统信息';
      case this.contract: return '合同信息';
      default: return '未定义';
    }
  },
};

// 员工列表tabKey
const StaffTabKey = {
  all: 'all',
  probation: 'probation',
  renew: 'renew',
  resign: 'resign',
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '在职';
      case this.probation: return '试用期';
      case this.renew: return '续签';
      case this.resign: return '离职';
      default: return '--';
    }
  },
};


export {
  StaffSate, // 员工档案--员工状态
  PendingDepartureState, // 待离职员工状态
  DutyState,              // 人员是否在职
  FileType,               // 档案类型
  HouseholdType,          // 个户类型
  PoliticalStatusType,    // 政治面貌
  MaritalStatusType,      // 婚姻状况
  PaperworkType,          // 证件类型
  ContractType,           // 合同类型
  ContractState,          // 合同状态
  TimeCycle,              // 时间周期
  HighestEducation,       // 最高学历
  RecommendedPlatformStaff, // 员工推荐渠道
  EmployeeCollectionType, // 收款类型
  EmployeeBankState,      // 银行状态
  EmployeeTurnoverApplyState,  // 人员异动申请状态
  EmployeeTurnoverInfoChangeTask,  // 人员异动信息变更任务状态
  EmployeeTurnoverThemeTag,  // 人员异动主题标签
  EmployeeIndividualState,    // 劳动者个户注册状态
  StaffTag, // 员工标签
  StaffTeamRank,              // 团队身份
  TeamNoAccountRegistrationReason, // 人员档案——无需个户注册原因
  TeamMemberAttribute,                  // 人员档案——成员类型
  EmployeeWorkType,       // 人员类型
  CustomListType,         // 第三方平台ID stateType
  EmployeePageSetp, // 员工档案tab（四五六线）
  StaffType, // 员工类型
  EmployeeUpdatePageSetp,  // 员工档案页面tab枚举
  LaborerPageSetp, // 劳动者tab（一二线）
  StaffTabKey, // 员工列表tabKey
};

