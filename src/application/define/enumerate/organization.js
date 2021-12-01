// 组织架构-业务信息标签的团队属性
const OrganizationTeamType = {
  personal: 10, // 私教
  region: 20, // 大区
  subDivision: 30,  // 分部
  division: 40, // 事业部
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.personal: return '私教';
      case this.region: return '大区';
      case this.subDivision: return '分部';
      case this.division: return '事业部';
      default: '未定义';
    }
  },
};

// 组织架构-岗位管理岗位状态
const OrganizationStaffsState = {
  enable: 100, // 启用
  disable: -100, // 禁用
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable: return '启用';
      case this.disable: return '禁用';
      default: '未定义';
    }
  },
};

// 组织架构-部门状态
const OrganizationDepartmentState = {
  enable: 100, // 启用
  disable: -100, // 裁撤
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.enable: return '启用';
      case this.disable: return '已裁撤';
      default: '未定义';
    }
  },
};

// 组织架构-tab
const OrganizationBizLabelType = {
  one: 1,    // 部门信息
  two: 2,    // 岗位编织
  three: 10, // 业务信息
  four: 20,  // 数据权限范围
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.one: return '部门信息';
      case this.two: return '岗位编织';
      case this.three: return '业务信息';
      case this.four: return '数据权限范围';
      default: '未定义';
    }
  },
};

// 组织架构-下级部门状态
const OrganizationSubDepartmentState = {
  normal: 1,  // 正常
  pending: 2, // 已生效
  close: 3,   // 已关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.normal: return '正常';
      case this.pending: return '已生效';
      case this.close: return '已关闭';
      default: '未定义';
    }
  },
};

// 组织架构-部门/编制调整 子类型
const OrganizationDepartmentChangeType = {
  create: 10,  // 新增子部门
  change: 20,  // 调整部门
  revoke: 30,  // 裁撤部门
  addPost: 40, // 添加岗位
  add: 50,     // 增编
  remove: 60,  // 减编
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.create: return '新增子部门';
      case this.change: return '调整部门';
      case this.revoke: return '裁撤部门';
      case this.addPost: return '添加岗位';
      case this.add: return '增编';
      case this.remove: return '减编';
      default: '未定义';
    }
  },
};

// 组织架构-部门/编制申请单生效状态
const OrganizationDepartmentChangeState = {
  effected: 100,  // 已生效
  effectBefore: 50, // 待生效
  close: -110, // 已关闭
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.effected: return '已生效';
      case this.effectBefore: return '待生效';
      case this.close: return '已关闭';
      default: '未定义';
    }
  },
  descriptionTabKey(rawValue) {
    switch (rawValue) {
      case 'tab1': return this.effected;
      case 'tab2': return this.effectBefore;
      case 'tab3': return this.close;
      default: '未定义';
    }
  },
};

// 组织架构 - 来源
const OrganizationSourceType = {
  manual: 10,
  approval: 20,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.manual: return '手动创建';
      case this.approval: return '审批单';
      default: '未定义';
    }
  },
};

export {
  // 资产隶属管理
  OrganizationTeamType, // 组织架构-业务信息标签的团队属性
  OrganizationStaffsState, // 组织架构-岗位管理岗位状态
  OrganizationDepartmentState, // 组织架构-部门状态
  OrganizationBizLabelType, // 组织架构-tab
  OrganizationSubDepartmentState, // 组织架构-下级部门状态
  OrganizationDepartmentChangeType, // 组织架构-部门/编制调整 子类型
  OrganizationDepartmentChangeState, // 组织架构-部门/编制申请单生效状态
  OrganizationSourceType, // 组织架构-来源
};
