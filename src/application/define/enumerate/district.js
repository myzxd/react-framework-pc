// 商圈状态
const DistrictState = {
  enable: 100,  // 运营中
  disabled: -100, // 已关闭
  preparation: 50, // 筹备中
  waitClose: 105,   // 待关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable: return '运营中';
      case this.disabled: return '已关闭';
      case this.preparation: return '筹备中';
      case this.waitClose: return '待关闭';
      default: return '未定义';
    }
  },
};

// 商圈平台状态
const DistrictPlatformState = {
  one: 'legwork_custom_id',     // MT跑腿
  two: 'crowdsource_custom_id', // MT众包
  three: 'quickly_send_custom_id', // MT快送
  four: 'enterprise_customer_custom_id', // MT企客
  description(rawValue) {
    switch (rawValue) {
      case this.one: return 'MT跑腿';
      case this.two: return 'MT众包';
      case this.three: return 'MT快送';
      case this.four: return 'MT企客';
      default: return '未定义';
    }
  },
};

// 数据返回商圈平台状态
const DistrictPlatformReturnState = {
  one: 'legwork',     // MT跑腿
  two: 'crowd_source', // MT众包
  three: 'special_delivery', // MT专送
  description(rawValue) {
    switch (rawValue) {
      case this.one: return 'MT跑腿';
      case this.two: return 'MT众包';
      case this.three: return '平台专送';
      default: return '未定义';
    }
  },
};

// 商圈修改原因
const DistrictNoteState = {
  one: 10,  // 三方平台变更
  two: 20,  // 填写有误
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.one: return '三方平台变更';
      case this.two: return '填写有误';
      default: return '未定义';
    }
  },
};

// 生效日期类型
const TeameEffectiveDateType = {
  immediately: 10,  // 立即生效
  second: 20, // 次月生效
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.immediately: return '立即生效';
      case this.second: return '次月生效';
      default: return '未定义';
    }
  },
};

// 商圈标签状态
const DistrictTagState = {
  enable: 100,  // 启用
  disabled: -100, // 禁用
  delete: -101, // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable: return '启用';
      case this.disabled: return '禁用';
      case this.delete: return '删除';
      default: return '未定义';
    }
  },
};

// 商圈来源
const DistrictSource = {
  selfBuild: 10,  // 自建
  purchase: 20,   // 收购
  combine: 30,    // 合并
  split: 40,    // 拆分
  replace: 50,    // 置换
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.selfBuild: return '自建';
      case this.purchase: return '收购';
      case this.combine: return '合并';
      case this.split: return '拆分';
      case this.replace: return '置换';
      default: return '未定义';
    }
  },
};

// 商圈经营方式
const DistrictManageMode = {
  selfSupport: 10,  // 自营
  out: 20,          // 外包
  together: 30,          // 聚合
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.selfSupport: return '自营';
      case this.out: return '外包';
      case this.together: return '聚合';
      default: return '未定义';
    }
  },
};

// 商圈处置方式
const DistrictDisposeWay = {
  autoClose: 10,        // 自然关闭
  makeOver: 20,         // 转让
  mix: 30,              // 被合并
  split: 40,              // 被拆分
  replace: 50,              // 被置换
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.autoClose: return '自然关闭';
      case this.makeOver: return '转让';
      case this.mix: return '被合并';
      case this.split: return '被拆分';
      case this.replace: return '被置换';
      default: return '未定义';
    }
  },
};

// 商圈变更记录- 变更类型
const DistrictChangeType = {
  changeTag: 10,        // 商圈标签变更
  changeInfo: 20,         // 基本信息变更
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.changeTag: return '商圈标签变更';
      case this.changeInfo: return '基本信息变更';
      default: return '未定义';
    }
  },
};

export {
  DistrictState,          // 商圈状态
  DistrictNoteState,      // 商圈修改原因
  DistrictPlatformState,  // 商圈平台状态
  DistrictPlatformReturnState, // 数据返回商圈平台状态
  DistrictTagState, // 商圈标签状态
  DistrictSource,           // 商圈来源
  DistrictManageMode,           // 商圈经营方式
  DistrictDisposeWay,           // 商圈处置方式
  DistrictChangeType,           // 商圈-变更记录类型
  TeameEffectiveDateType,   // 生效类型
};

