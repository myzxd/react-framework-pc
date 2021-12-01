// 账户状态
const AccountState = {
  on: 100,
  off: -100,
  ons: -101,
  description(rawValue) {
    switch (rawValue) {
      case this.on: return '可用';
      case this.off: return '禁用';
      case this.ons: return '禁止用';
      default: return '--';
    }
  },
};

// 账户应聘渠道
const AccountApplyWay = {
  company: 4001,
  recommend: 4002,
  apply: 4004,
  transfer: 4005,
  hr: 4003,
  other: 4006,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.company: return '人力资源服务公司 / 猎头公司';
      case this.recommend: return '内部推荐';
      case this.apply: return '招聘渠道';
      case this.transfer: return '转签';
      case this.hr: return 'HR寻访';
      case this.other: return '其他';
      default: return '--';
    }
  },
};

// 账户招聘渠道
const AccountRecruitmentChannel = {
  third: 5001,
  personal: 5002,
  other: 5003,
  transfer: 5004,
  recommend: 5005,
  thirdPlatform: 5006,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.third: return '三方服务公司';
      case this.personal: return '个人推荐';
      case this.other: return '其他';
      case this.transfer: return '转签';
      case this.recommend: return '内部推荐';
      case this.thirdPlatform: return '三方推广平台';
      default: return '--';
    }
  },
};

export {
  AccountState,               // 账户状态
  AccountRecruitmentChannel,  // 账户招聘渠道
  AccountApplyWay,          // 账户应聘渠道
};

