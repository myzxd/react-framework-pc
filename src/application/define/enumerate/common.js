// 健康证到期天数
const HealthyExpireDays = {
  thirty: 30,
  ten: 10,
  current: 1,
  overdue: -1,
  description(rawValue) {
    switch (rawValue) {
      case this.thirty: return '30天';
      case this.ten: return '10天';
      case this.current: return '当天';
      case this.overdue: return '已过期';
      default: return '未知';
    }
  },
};

// 性别
const Gender = {
  male: 10,
  female: 20,
  unlimited: 30,
  description(rawValue) {
    switch (rawValue) {
      case this.male: return '男';
      case this.female: return '女';
      case this.unlimited: return '不限';
      default: return '未知';
    }
  },
};

// 角色状态
const RoleState = {
  available: 1,  // 可用
  disable: 0,    // 不可用
  deleted: -1,   // 删除（前端不显示
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.available: return '正常';
      case this.disable: return '禁用';
      case this.deleted: return '删除';
      default: return '未定义';
    }
  },
};

// 模块的状态
const ModuleState = {
  access: 1,
  forbid: 0,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.access: return '可访问';
      case this.forbid: return '禁止访问';
      default: return '未定义';
    }
  },
};

// NOTE: 站长和调度枚举址互换
// 人员职位
const Position = {
  superAdmin: 1000,             // 超级管理员
  ceo: 1020,                    // ceo
  coo: 1001,                    // coo
  chiefProjectManager: 1011,    // 项目总监
  chiefHRManager: 1012,         // 人事 || 人事总监
  chiefOperatingManager: 1002,  // 运营管理
  chiefManager: 1003,     // 总监
  cityManager: 1004,      // 城市经理
  cityAssistant: 1005,    // 城市助理
  dispatcher: 1006,       // 调度
  stationManager: 1007,   // 站长
  buyer: 1008,            // 采购
  postmanManager: 1009,   // 骑士长
  postman: 1010,          // 骑士
  tester: 1016,           // 测试
  // TODO: 特殊角色，目前不直接定义，需要使用 @韩健
  // a_1013 = 1013  # 张仕洋
  // a_1014 = 1014  # 巴联巴总
  // a_1015 = 1015  # 总裁特别助理
  // a_1016 = 1016  # 财务负责人
  // a_1017 = 1017  # 财务经理
  // a_1018 = 1018  # 出纳
  // a_1019 = 1019  # 人事专员

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.superAdmin: return '超级管理员';
      case this.ceo: return 'ceo';
      case this.coo: return 'coo';
      case this.chiefProjectManager: return '项目总监';
      case this.chiefHRManager: return '人事/人事总监';
      case this.chiefOperatingManager: return '运营管理';
      case this.chiefManager: return '总监';
      case this.cityManager: return '城市经理';
      case this.cityAssistant: return '城市助理';
      case this.dispatcher: return '调度';
      case this.buyer: return '采购';
      case this.stationManager: return '站长';
      case this.postmanManager: return '骑士长';
      case this.postman: return '骑士';
      case this.tester: return '测试';
      default: return '未定义';
    }
  },
};


// 签约状态
const SigningState = {
  pending: 1,          // 待签约
  normal: 100,         // 已签约-正常
  replace: 101,        // 已签约-待换签
  pendingReview: 102,  // 已签约-待续签
  repair: 103,         // 已签约-待补签
  release: -100,       // 已解约
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部';
      case this.pending: return '待签约';
      case this.normal: return '已签约-正常';
      case this.replace: return '已签约-待换签';
      case this.pendingReview: return '已签约-待续签';
      case this.repair: return '已签约-待补签';
      case this.release: return '已解约';
      default: return '--';
    }
  },
};

// 工作状态
const WorkState = {
  active: 100,          // 活跃中
  exit: -100,         // 已退出
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.active: return '活跃中';
      case this.exit: return '已退出';
      default: return '--';
    }
  },
};


// 三方公司状态
const ThirdCompanyState = {
  on: 100,
  off: -100,
  delete: -101,
  description(rawValue) {
    switch (rawValue) {
      case this.on: return '启用';
      case this.off: return '禁用';
      case this.delete: return '删除';
      default: return '未定义';
    }
  },
};

// 三方公司类型
const ThirdCompanyType = {
  staff: 1,          // 一二线员工
  staffProfile: 3,   // 员工档案
  description(rawValue) {
    switch (rawValue) {
      case this.staff: return '一二线员工';
      case this.staffProfile: return '员工档案';
      default: return '未定义';
    }
  },
};

// 供应商状态
const SupplierState = {
  enable: 100,
  stoped: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable: return '启用';
      case this.stoped: return '停用';
      default: return '未定义';
    }
  },
};

// 省级或地级行政区, 区域级别
const CityAreaLevel = {
  provincial: 10,  // 省级
  prefecture: 20, // 地级
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.provincial: return '省级';
      case this.prefecture: return '地级';
      default: return '未定义';
    }
  },
};

// 城市所属场景状态
const CityIndustryState = {
  food: 1000,            // 外卖配送
  car: 2000,             // 网约车
  home: 3000,            // 家政保洁
  security: 4000,        // 安保服务
  bike: 5000,            // 共享单车
  promotion: 6000,       // 促销
  business: 7000,        // 商业清洗
  tohome: 8000,          // 58到家
  hotelService: 9000,    // 酒店服务
  advertising: 10000,    // 广告投放
  sharingCar: 11000,     // 共享汽车
  humanResources: 12000, // 人力资源服务
  host: 13000,           // 主播
  drainage: 14000,       // 平台引流
  property: 15000,       // 物业
  minshuku: 16000,       // 民宿运营
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.food: return '外卖配送';
      case this.car: return '网约车';
      case this.home: return '家政保洁';
      case this.security: return '安保服务';
      case this.bike: return '共享单车';
      case this.promotion: return '促销';
      case this.business: return '商业清洗';
      case this.tohome: return '平台代运营';
      case this.hotelService: return '酒店服务';
      case this.advertising: return '广告投放';
      case this.sharingCar: return '共享汽车';
      case this.humanResources: return '人力资源服务';
      case this.host: return '主播';
      case this.drainage: return '平台引流';
      case this.property: return '物业';
      case this.minshuku: return '民宿运营';
      default: return '未定义';
    }
  },
};

// @郭建新
// OWNER_SCOPE_STATE_TRUE = 100  # 业主承揽记录状态为已生效
//
// OWNER_SCOPE_STATE_PENDING = 101  # 业主承揽记录状态为待生效
//
// OWNER_SCOPE_STATE_FALSE = -101  # 业主承揽记录状态为已失效
//
// OWNER_SCOPE_STATE_DELETE = -110  # 业主承揽记录状态为标记删除

// 平台定义
const Platform = {
  elem: 'elem',
  baidu: 'baidu',
  meituan: 'meituan',
  relian: 'relian',
  description(rawValue) {
    switch (rawValue) {
      case this.elem: return '饿了么';
      case this.baidu: return '百度';
      case this.meituan: return '美团';
      case this.relian: return '热链';
      default: return '未定义';
    }
  },
};

// 服务费规则状态
const GeneratorState = {
  none: 0,  // 未操作
  work: 1,  // 使用中
  skip: 2,  // 跳过
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.none: return '未操作';
      case this.work: return '使用中';
      case this.skip: return '跳过';
      default: return '未定义';
    }
  },
};

//
// // 费用成本中心 @常轩伟版
// const ExpenseCostBelong = {
//   team: 10, // 团队
//   person: 20, // 个人
//   asset: 30, // 资产
//   description(rawValue) {
//     switch (Number(rawValue)) {
//       case this.team: return '团队';
//       case this.person: return '个人';
//       case this.asset: return '资产';
//       default: return '未定义';
//     }
//   },
// };

// 运力工号类型
const TransportType = {
  transport: 50010,
  exchange: 50020,
  normal: 50030,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.transport: return '运力工号';
      case this.exchange: return '替跑工号';
      case this.normal: return '正常工号';
      default: return '未定义';
    }
  },
};

// 运力工号状态
const TransportState = {
  working: 50100,
  waiting: 50200,
  nothing: 50300,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.working: return '正在运力';
      case this.waiting: return '等待运力';
      case this.nothing: return '无运力状态';
      default: return '未定义';
    }
  },
};

// 将数字转为金额格式
const renderReplaceAmount = (amount) => {
  // 不等于空，undefined和--时转为金额格式
  if (amount !== '--' && amount !== '' && amount !== undefined) {
    return Number(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
  }
  return amount;
};

// 审批单补充意见状态
const SupplementOpinionState = {
  normal: 100,
  delete: -101,
  description(rawValue) {
    switch (rawValue) {
      case this.normal: return '正常';
      case this.delete: return '删除';
      default: return '--';
    }
  },
};

// 审批单常用语
const Alternatives = {
  often: '1',  // 常用回复语
  finance: '2',  // 财务回复语
  description(rawValue) {
    switch (rawValue) {
      case this.often: return '常用回复语';
      case this.finance: return '财务回复语';
      default: return '未定义';
    }
  },
  // 转换数据
  conversionData(rawValue) {
    switch (rawValue) {
      case this.often: return [
        {
          key: '0',
          value: '请确认后付款。',
        },
        {
          key: '1',
          value: '请确认到款后支付。',
        },
        {
          key: '2',
          value: '见票付款。',
        },
        {
          key: '3',
          value: '自动扣款，注意账面余额。',
        },
        {
          key: '4',
          value: '请确认。',
        },
        {
          key: '5',
          value: '无需付款。',
        },
        {
          key: '6',
          value: '无需付款，只付税金。',
        },
        {
          key: '7',
          value: '请确认后转会计核销。',
        },
        {
          key: '8',
          value: '请确认到款后转会计核销。',
        },
        {
          key: '9',
          value: '请审批。',
        },
        {
          key: '10',
          value: '同意。',
        },
        {
          key: '11',
          value: '已知。',
        },
      ];
      case this.finance: return [
        {
          key: '0',
          value: '已付款',
        },
        {
          key: '1',
          value: '已知。',
        },
        {
          key: '2',
          value: '款项已收到。',
        },
        {
          key: '3',
          value: '错误退回请尽快更正。',
        },
        {
          key: '4',
          value: '已充值。',
        },
        {
          key: '5',
          value: '已完成。',
        },
        {
          key: '6',
          value: '已扣款。',
        },
      ];
      default: return [];
    }
  },

};

// 上一版 module.exports
export {
  Gender,               // 性别
  HealthyExpireDays,    // 健康证到期天数
  RoleState,            // 角色状态
  ModuleState,          // 模块状态
  Position,             // 人员职位
  SigningState,           // 签约状态
  WorkState,              // 工作状态
  GeneratorState,         // 服务费规则状态
  TransportType,                // 运力工号类型
  TransportState,               // 运力工号状态
  SupplementOpinionState,   // 审批单补充意见状态
  Alternatives, // 审批单常用语
  ThirdCompanyState,      // 三方公司状态
  ThirdCompanyType,       // 三方公司类型
  SupplierState,          // 供应商状态
  Platform,               // 平台定义
  CityAreaLevel,          // 省级或地级行政区, 区域级别
  CityIndustryState,      // 城市所属场景状态
  renderReplaceAmount,        // 将数字转为金额格式
};

