// 共享登记 - 合同状态
const SharedContractState = {
  normal: 100,
  lend: 20,
  void: 30,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.lend: return '已借出';
      case this.void: return '已作废';
      default: '未定义';
    }
  },
};

// 共享登记 - 业务类别
const SharedBusinessType = {
  purchase: 10,
  electromechanical: 20,
  building: 30,
  airCondi: 40,
  equipment: 50,
  maintenance: 60,
  firefighting: 70,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.purchase: return '采购安装';
      case this.electromechanical: return '机电安装';
      case this.building: return '建筑智能化';
      case this.airCondi: return '空调安装';
      case this.equipment: return '设备销售';
      case this.maintenance: return '维修保养';
      case this.firefighting: return '消防工程';
      default: '未定义';
    }
  },
};

// 共享登记 - 证照类型
const SharedLicenseType = {
  businessLicense: 10,
  expressDelivery: 20,
  food: 30,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.businessLicense: return '营业执照';
      case this.expressDelivery: return '快递许可证';
      case this.food: return '食品经营许可证';
      default: '未定义';
    }
  },
};

// 共享登记 - 公司状态
const SharedCompanyState = {
  normal: 100,
  logout: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.logout: return '已注销';
      default: '未定义';
    }
  },
};

// 共享登记 - 银行账户状态
const SharedBankAccountState = {
  normal: 100,
  disable: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.disable: return '禁用';
      default: '未定义';
    }
  },
};

// 共享登记 - 印章状态
const SharedSealState = {
  normal: 100,
  scrap: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.scrap: return '已作废';
      default: '未定义';
    }
  },
};

// 共享登记 - 印章借用状态
const SharedSealBorrowState = {
  not: 20,
  already: 10,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.not: return '未借出';
      case this.already: return '已借出';
      default: '未定义';
    }
  },
};

// 共享登记 - 借用状态
const SharedContractBorrowState = {
  not: 20,
  already: 10,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.not: return '未借出';
      case this.already: return '已借出';
      default: '未定义';
    }
  },
};

// 共享登记 - 合同状态(新)
const SharedNewContractState = {
  toBeEffective: 50,
  effective: 100,
  invalid: -50,
  expired: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.toBeEffective: return '待生效';
      case this.effective: return '生效中';
      case this.invalid: return '已作废';
      case this.expired: return '已失效';
      default: '未定义';
    }
  },
};

// 共享登记 - 合同邮寄状态
const SharedContractMailState = {
  notMail: 10,
  done: 100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.notMail: return '未邮寄';
      case this.done: return '已邮寄';
      default: '未定义';
    }
  },
};

// 共享登记 - 证照有效期
const SharedLicenseDeadLineType = {
  exist: 10,
  not: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.exist: return '有限期';
      case this.not: return '无限期';
      default: '未定义';
    }
  },
};

// 共享登记 - 印章状态
const SharedLicenseBorrowState = {
  already: 10,
  not: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.already: return '已借出';
      case this.not: return '未借出';
      default: '未定义';
    }
  },
};

// 共享登记 - 印章状态
const SharedLicenseState = {
  normal: 100,
  disable: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.disable: return '禁用';
      default: '未定义';
    }
  },
};

// 共享登记 - 权限状态
const SharedAuthorityState = {
  all: 10,
  section: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '完全公开';
      case this.section: return '指定范围';
      default: '未定义';
    }
  },
};

// 共享登记 - 来源
const SharedSourceType = {
  approval: 10,
  manual: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.approval: return '审批单';
      case this.manual: return '手动创建';
      default: '未定义';
    }
  },
};

// 共享登记 - 银行账户 - 币种
const SharedBankCurrency = {
  rmb: 1,
  dollar: 2,
  hkdollar: 3,
  other: 300,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.rmb: return '人民币';
      case this.dollar: return '美元';
      case this.hkdollar: return '港币';
      case this.other: return '其他';
      default: return '未定义';
    }
  },
};

// 共享登记 - 银行账户 - 账户体系
const SharedBankAccountSystem = {
  inside: 10,
  outside: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.inside: return '体系内';
      case this.outside: return '体系外';
      default: return '--';
    }
  },
};


// 共享登记 - 银行账户 - 网银类型
const SharedBankOnlineBankType = {
  manage: 10,
  approve: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.manage: return '经办网银';
      case this.approve: return '审批网银';
      default: return '未定义';
    }
  },
};

// 共享登记 - 银行账户 - 开户资料类型
const SharedBankOpenAccountInfoType = {
  printCard: 10,
  application: 20,
  settlementCatd: 30,
  cipherLetter: 40,
  other: 50,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.printCard: return '印鉴卡';
      case this.application: return '银行开户申请书';
      case this.settlementCatd: return '单位结算卡';
      case this.cipherLetter: return '存款人查询密码函';
      case this.other: return '其他';
      default: '未定义';
    }
  },
};

// 共享登记 - 银行账户 - 银行变更进度
const SharedBankChangeSchedule = {
  done: 100,
  undone: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.done: return '已完成';
      case this.undone: return '未完成';
      default: '未定义';
    }
  },
};

export {
  SharedContractState, // 共享登记 - 合同状态
  SharedCompanyState, // 共享登记 - 公司状态
  SharedBankAccountState, // 共享登记 - 银行账户状态
  SharedBusinessType, // 共享登记 - 业务类别
  SharedLicenseType, // 共享登记 - 证照类型
  SharedSealState, // 共享登记 - 印章状态
  SharedSealBorrowState, // 共享登记 - 印章借用状态
  SharedContractBorrowState, // 共享登记 - 合同借阅状态
  SharedNewContractState, // 共享登记 - 合同状态（新）
  SharedContractMailState, // 共享登记 - 合同邮寄状态
  SharedLicenseDeadLineType, // 共享登记 - 证照有效期
  SharedLicenseBorrowState, // 共享登记 - 证照借阅状态
  SharedLicenseState, // 共享登记 - 证照状态
  SharedAuthorityState, // 共享登记 - 权限状态
  SharedSourceType, // 共享登记 - 来源
  SharedBankCurrency, // 共享登记 - 银行账户 - 币种
  SharedBankAccountSystem, // 共享登记 - 银行账户 - 账户体系
  SharedBankOnlineBankType, // 共享登记 - 银行账户 - 网银类型
  SharedBankOpenAccountInfoType, // 共享登记 - 银行账户 - 网银类型
  SharedBankChangeSchedule, // 共享登记 - 银行账户 - 账户变更进度
};
