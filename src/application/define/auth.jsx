// 权限设置的配置文件
import Modules from './modules';

class Node {
  constructor({ key = '', title = '' }) {
    this.key = key;       // key, 标识
    this.title = title;   // 标题
  }
}

// 权限
class Auth extends Node {
  /**
   * 权限节点
   * @param {String} [key='']         [权限的key，前端自定义，仅权限模块使用，不传值给后台。key唯一不重复。]
   * @param {String} [title='']       [权限名称]
   * @param {String} [description=''] [权限定义]
   * @param {Array}  [modules=[]]     [权限相关（菜单，页面，操作）]
   * @param {Bool}   [onShowOnDebugMode=false]  [调试模式相关，ture 为只在调试模式展示，false为所有模式都显示 ]
   * @param {Bool}   [onShowOnBoss=false]  [调试模式相关，ture 为只在boss系统中展示，false为不显示 ]
   * @param {Bool}   [isVerifyAuth=true]  [是否验证权限，true 判断权限，false不判断权限]
   */
  constructor({ key = '', title = '', description = '', modules = [], onShowOnDebugMode = false, onShowOnBoss = false, isVerifyAuth = true }) {
    super({ key, title });
    this.description = description;  // 权限组的描述
    this.modules = modules;          // 权限组的模块
    this.onShowOnDebugMode = onShowOnDebugMode; // 只在调试模式展示
    this.onShowOnBoss = onShowOnBoss; // 只在boss系统中展示
    this.isVerifyAuth = isVerifyAuth; // 是否验证权限，true 判断权限，false不判断权限，不显示勾选框
  }
}

// 所有的权限节点
const AuthNodes = {
  // 超级管理
  AuthAdmin: new Auth({
    key: 'AuthAdmin',
    title: '超级管理',
    modules: [
      // 超级管理（菜单）
      Modules.MenuAdmin,
    ],
  }),

  // 系统信息
  AuthAdminSystem: new Auth({
    key: 'AuthAdminSystem',
    title: '系统信息',
    description: '查看（系统信息）页面的权限',
    modules: [
      // 超级管理 / 系统管理 （页面）
      Modules.ModuleAdminSystem,
    ],
    // 只在调试模式展示
    onShowOnDebugMode: true,
  }),

  // 权限管理
  AuthAdminAuthorize: new Auth({
    key: 'AuthAdminAuthorize',
    title: '权限管理',
    description: '查看、操作（权限管理）页面的权限',
    modules: [
      // 超级管理 / 权限管理 （页面）
      Modules.ModuleAdminAuthorize,
    ],
  }),

  // 角色管理
  AuthAdminManagementRoles: new Auth({
    key: 'AuthAdminManagementRoles',
    title: '角色管理',
    description: '查看、操作（角色管理）页面的权限',
    modules: [
      // 超级管理 / 角色管理 （页面）
      Modules.ModuleAdminManagementRoles,
    ],
  }),
  // CODE业务策略
  AuthAdminManagementCodeRoles: new Auth({
    key: 'AuthAdminManagementCodeRoles',
    title: 'CODE业务策略',
    description: '查看、操作（CODE业务策略）页面的权限',
    modules: [
      // 超级管理 / 角色管理 （页面）
      Modules.OperateAdminManagementCodeRoles,
    ],
  }),

  // 开发文档
  AuthAdminInterface: new Auth({
    key: 'AuthAdminInterface',
    title: '开发文档',
    description: '查看（开发文档）页面的权限',
    modules: [
      // 超级管理 / 开发文档 （页面）
      Modules.ModuleAdminInterface,
    ],
    // 只在调试模式展示
    onShowOnDebugMode: true,
  }),

  // 开发调试
  AuthAdminDeveloper: new Auth({
    key: 'AuthAdminDeveloper',
    title: '开发调试',
    description: '查看（开发调试）页面的权限',
    modules: [
      // 超级管理 / 开发调试 （页面）
      Modules.ModuleAdminDeveloper,
    ],
    // 只在调试模式展示
    onShowOnDebugMode: true,
  }),

  // 组织结构管理
  AuthOrganization: new Auth({
    key: 'AuthOrganization',
    title: '组织结构管理',
    description: '查看（组织结构）页面权限',
    modules: [
      // 组织架构 (菜单)
      Modules.MenuOrganization,
    ],
  }),

  // 部门管理（部门信息&岗位编制）
  AuthOrganizationDepartment: new Auth({
    key: 'AuthOrganizationDepartment',
    title: '部门管理',
    description: '查看（部门信息、岗位编制、业务信息）部门管理页面的权限',
    modules: [
      // 组织架构 / 部门管理 (页面)
      Modules.ModuleOrganizationManageDepartment,
    ],
  }),

  // 部门管理（业务信息&数据权限）
  AuthOrganizationDepartmentBusiness: new Auth({
    key: 'AuthOrganizationDepartmentBusiness',
    title: '业务信息/数据权限信息',
    description: '查看业务信息/数据权限信息（Tab）的权限',
    modules: [
      // 组织架构 / 部门管理（业务信息&数据权限信息） (页面)
      Modules.OperateOrganizationManageDepartmentBusiness,
    ],
  }),

  // 设置部门负责人
  AuthOrganizationManageDepartmentManager: new Auth({
    key: 'AuthOrganizationManageDepartmentManager',
    title: '设置部门负责人',
    description: '设置部门负责人的操作权限',
    modules: [
      // 设置部门负责人
      Modules.OperateOrganizationManageDepartmentManager,
    ],
  }),

  // 新建部门/调整上级部门
  AuthOperateOrganizationManageDepartmentCreate: new Auth({
    key: 'AuthOperateOrganizationManageDepartmentCreate',
    title: '新建部门/调整上级部门',
    description: '新建部门/调整上级部门的操作权限',
    modules: [
      // 新建部门
      Modules.OperateOrganizationManageDepartmentCreate,
    ],
  }),

  // 编辑部门（名称/编号）
  AuthOperateOrganizationManageDepartmentUpdate: new Auth({
    key: 'AuthOperateOrganizationManageDepartmentUpdate',
    title: '编辑部门（名称/编号）',
    description: '编辑部门（名称/编号）的操作权限',
    modules: [
      // 编辑部门
      Modules.OperateOrganizationManageDepartmentUpdate,
    ],
  }),

  // 撤销部门
  AuthOrganizationManageDepartmentCancle: new Auth({
    key: 'AuthOrganizationManageDepartmentCancle',
    title: '撤销部门',
    description: '撤销部门的操作权限',
    modules: [
      // 撤销部门
      Modules.OperateOrganizationManageDepartmentDelete,
    ],
  }),

  // 导出部门编制数报表
  AuthOrganizationManageDepartmentExport: new Auth({
    key: 'AuthOrganizationManageDepartmentExport',
    title: '导出部门编制数报表',
    description: '导出部门编制数报表的操作权限',
    modules: [
      // 导出部门编制数报表
      Modules.OperateOrganizationManageDepartmentExport,
    ],
  }),

  // 添加、编辑部门员工
  AuthOrganizationManageDepartmentEmployeeManage: new Auth({
    key: 'AuthOrganizationManageEmployeeManage',
    title: '添加、编辑部门员工',
    description: '添加、编辑部门员工的操作权限',
    modules: [
      // 添加部门员工
      Modules.OperateOrganizationManageDepartmentEmployeeCreate,
      // 编辑部门员工
      Modules.OperateOrganizationManageDepartmentEmployeeUpdate,
    ],
  }),

  // 查看部门员工
  AuthOrganizationManageDepartmentEmployeeDetail: new Auth({
    key: 'AuthOrganizationManageDepartmentEmployeeDetail',
    title: '查看部门员工',
    description: '查看部门员工的操作权限',
    modules: [
      // 查看部门员工
      Modules.OperateOrganizationManageDepartmentEmployeeDetail,
    ],
  }),

  // 批量导出部门员工
  AuthOrganizationManageDepartmentEmployeeExport: new Auth({
    key: 'AuthOrganizationManageDepartmentEmployeeExport',
    title: '批量导出部门员工',
    description: '批量导出部门员工的操作权限',
    modules: [
      // 批量导出部门员工
      Modules.OperateOrganizationManageDepartmentEmployeeExport,
    ],
  }),

  // 添加、编辑岗位的操作权限
  AuthOrganizationManageStaffsManage: new Auth({
    key: 'AuthOrganizationManageStaffsManage',
    title: '添加、删除岗位',
    description: '添加、删除岗位的操作权限',
    modules: [
      // 添加岗位
      Modules.OperateOrganizationManageStaffsCreate,
      // 删除岗位
      Modules.OperateOrganizationManageStaffsDelete,
    ],
  }),

  // 岗位增编
  AuthOperateOrganizationManageStaffsAddendum: new Auth({
    key: 'AuthOperateOrganizationManageStaffsAddendum',
    title: '增编',
    description: '岗位增编的操作权限',
    modules: [
      // 岗位增编
      Modules.OperateOrganizationManageStaffsAddendum,
    ],
  }),

  // 岗位减编
  AuthOperateOrganizationManageStaffsReduction: new Auth({
    key: 'AuthOperateOrganizationManageStaffsReduction',
    title: '减编',
    description: '岗位减编的操作权限',
    modules: [
      // 岗位减编
      Modules.OperateOrganizationManageStaffsReduction,
    ],
  }),

  // 创建、编辑业务信息
  AuthOrganizationManageAttributesManage: new Auth({
    key: 'AuthOrganizationManageAttributesManage',
    title: '创建、编辑业务信息',
    description: '创建、编辑业务信息的操作权限',
    modules: [
      // 添加业务信息
      Modules.OperateOrganizationManageAttributesCreate,
      // 编辑业务信息
      Modules.OperateOrganizationManageAttributesUpdate,
    ],
  }),

  // 创建、编辑数据权限范围
  AuthOrganizationManageDataPermissionManage: new Auth({
    key: 'AuthOrganizationManageDataPermissionManage',
    title: '创建、编辑数据权限范围',
    description: '创建、编辑数据权限范围的操作权限',
    modules: [
      // 创建数据权限范围
      Modules.OperateOrganizationManageDataPermissionCreate,
      // 编辑数据权限范围
      Modules.OperateOrganizationManageDataPermissionUpdate,
    ],
  }),

  // 岗位管理
  AuthOrganizationStaff: new Auth({
    key: 'AuthOrganizationStaff',
    title: '岗位管理',
    description: '管理岗位库中岗位列表及页面详情的权限',
    modules: [
      // 岗位管理
      Modules.ModuleOrganizationStaffs,
    ],
  }),

  // 新建、编辑岗位
  AuthOrganizationStaffManage: new Auth({
    key: 'AuthOrganizationStaffManage',
    title: '新建、编辑岗位',
    description: '新建、编辑岗位库中岗位信息的权限',
    modules: [
      // 新建岗位
      Modules.OperateOrganizationStaffsCreate,
      // 编辑岗位
      Modules.OperateOrganizationStaffsUpdate,
    ],
  }),

  // 删除岗位
  AuthOrganizationStaffDelete: new Auth({
    key: 'AuthOrganizationStaffDelete',
    title: '删除岗位',
    description: '删除岗位库中岗位的操作权限',
    modules: [
      // 删除岗位
      Modules.OperateOrganizationStaffsDelete,
    ],
  }),

  // 操作日志
  AuthOrganizationOperationLog: new Auth({
    key: 'AuthOrganizationOperationLog',
    title: '操作日志',
    description: '查看（操作日志）列表页面的权限',
    modules: [
      // 操作日志
      Modules.ModuleOrganizationOperationLog,
    ],
  }),

  // Q钱包
  AuthWallet: new Auth({
    key: 'AuthWallet',
    title: 'Q钱包',
    description: '',
    modules: [
      // Q钱包（菜单）
      Modules.MenuWallet,
    ],
  }),

  // Q钱包 - 钱包汇总
  AuthWalletSummary: new Auth({
    key: 'AuthWalletSummary',
    title: '钱包汇总',
    description: '查看钱包汇总（页面）的权限',
    modules: [
      // Q钱包 / 钱包汇总（页面）
      Modules.ModuleWalletSummary,
    ],
  }),

  // Q钱包 - 支付账单
  AuthWalletBills: new Auth({
    key: 'AuthWalletBills',
    title: '支付账单',
    description: '查看支付账单（页面）的权限',
    modules: [
      // Q钱包 / 支付账单（页面）
      Modules.ModuleWalletBills,
    ],
  }),

  // Q钱包 - 支付账单 - 付款/批量付款（操作）
  AuthWalletBillsPay: new Auth({
    key: 'AuthWalletBillsPay',
    title: '付款/批量付款',
    description: '支付账单付款/批量付款（操作）的权限',
    modules: [
      // Q钱包 / 支付账单 / 付款/批量付款（操作）
      Modules.OperateWalletBillsPay,
    ],
  }),

  // Q钱包 - 支付账单 - 导出报表（操作）
  AuthWalletBillsExport: new Auth({
    key: 'AuthWalletBillsExport',
    title: '导出报表',
    description: '支付账单导出报表（操作）的权限',
    modules: [
      // Q钱包 / 支付账单 / 导出报表（操作）
      Modules.OperateWalletBillsExport,
    ],
  }),

  // Q钱包 - 钱包明细
  AuthWalletDetail: new Auth({
    key: 'AuthWalletDetail',
    title: '钱包明细',
    description: '查看钱包明细（页面）的权限',
    modules: [
      // Q钱包 / 钱包明细（页面）
      Modules.ModuleWalletDetail,
    ],
  }),

  // Q钱包 - 钱包明细 - 导出报表（操作）
  AuthWalletDetailExport: new Auth({
    key: 'AuthWalletDetailExport',
    title: '导出报表',
    description: '钱包明细导出报表（操作）的权限',
    modules: [
      // Q钱包 / 钱包明细 / 导出报表（操作）
      Modules.OperateWalletDetailExport,
    ],
  }),

  // Q钱包 - 支付账单 - 账单详情
  AuthWalletBillsDetail: new Auth({
    key: 'AuthWalletBillsDetail',
    title: '支付账单详情',
    description: '查看支付账单详情（页面）的权限',
    modules: [
      // Q钱包 / 支付账单 / 详情（页面）
      Modules.ModuleWalletBillsDetail,
    ],
  }),

  // 人员管理
  AuthEmployee: new Auth({
    key: 'AuthEmployee',
    title: '人员管理',
    description: '',
    modules: [
      // 人员管理（菜单）
      Modules.MenuEmployee,
    ],
  }),

  // 人员档案
  AuthEmployeeDetail: new Auth({
    key: 'AuthEmployeeDetail',
    title: '人员档案',
    description: '查看（人员档案）列表页面及查看档案详情页面的权限',
    modules: [
      // 人员管理 / 人员档案（页面）
      Modules.ModuleEmployeeManage,
      // 人员管理 / 查看人员 / 档案详情（页面）
      Modules.ModuleEmployeeDetail,
    ],
  }),

  // 编辑
  AuthEmployeeUpdate: new Auth({
    key: 'AuthEmployeeUpdate',
    title: '编辑、添加',
    description: '编辑、添加档案信息的权限',
    modules: [
      // 人员管理 / 人员档案 / 添加档案（页面）
      Modules.ModuleEmployeeCreate,
      // 人员管理 / 人员档案 / 编辑档案（页面）
      Modules.ModuleEmployeeUpdate,
      // 人员管理 / 人员档案 / 编辑、添加档案信息按钮（操作）
      Modules.OperateEmployeeSearchUpdateButton,
    ],
  }),

  // 导出人员列表
  AuthEmployeeExport: new Auth({
    key: 'AuthEmployeeExport',
    title: '导出人员档案列表',
    description: '导出人员档案列表的权限',
    modules: [
      // 人员管理 / 人员档案 / 导出EXCEL（操作）
      Modules.OperateEmployeeSearchExportExcel,
    ],
  }),

  // 办理离职
  AuthEmployeeForceResign: new Auth({
    key: 'AuthEmployeeForceResign',
    title: '办理离职',
    description: '办理离职的权限',
    modules: [
      // 人员管理 / 人员档案 / 办理离职按钮（操作）
      Modules.OperateEmployeeResignVerifyForceButton,
    ],
  }),

  // 确认离职
  AuthEmployeeResign: new Auth({
    key: 'AuthEmployeeResign',
    title: '确认离职',
    description: '确认离职的权限',
    modules: [
      // 人员管理 / 人员档案 / 确认离职页面
      Modules.ModuleEmployeeResign,
      // 人员管理 / 人员档案 / 完成离职按钮（操作）
      Modules.OperateEmployeeResignButton,
    ],
  }),

  // 查看劳动者档案
  AuthEmployeeFileTypeSecond: new Auth({
    key: 'AuthEmployeeFileTypeSecond',
    title: '查看劳动者档案',
    description: '查看劳动者档案的权限',
    modules: [
      // 人员管理 / 人员档案 / 查看劳动者档案（操作）
      Modules.OperateEmployeeFileTypeSecond,
    ],
  }),
  // 查看档案历史信息
  AuthEmployeeFileTypeDetailHistory: new Auth({
    key: 'AuthEmployeeFileTypeDetailHistory',
    title: '查看档案历史信息',
    description: '查看档案历史信息',
    modules: [
      // 查看档案历史信息（操作）
      Modules.OperateModuleEmployeeDetailHistoryInfo,
      // 劳动者档案 / 人员档案 档案详情（页面）/ 历史合同信息
      Modules.ModuleEmployeeDetailHistoryContractInfo,
      // 劳动者档案 / 查看员工 / 档案详情（页面）/ 历史工作信息
      Modules.ModuleEmployeeDetailHistoryWorkInfo,
      // 劳动者档案 / 人员档案 档案详情（页面）/ 历史三方id
      Modules.ModuleEmployeeDetailHistoryTripartiteId,
      // 劳动者档案 / 查看员工 / 档案详情（页面）/ 个户注册记录
      Modules.ModuleEmployeeDetailIndividual,
      // 员工管理 / 查看员工 / 档案详情（页面）/ 银行卡历史记录
      Modules.ModuleEmployeeDetailHistoryInfo,
    ],
  }),

  // 查看人员档案
  AuthEmployeeFileTypeStaff: new Auth({
    key: 'AuthEmployeeFileTypeStaff',
    title: '查看人员档案',
    description: '查看人员档案的权限',
    modules: [
      // 人员管理 / 人员档案 / 查看人员档案（操作）
      Modules.OperateEmployeeFileTypeStaff,
    ],
  }),

  // 人员异动
  AuthEmployeeTurnover: new Auth({
    key: 'AuthEmployeeTurnover',
    title: '人员异动管理',
    description: '人员异动管理',
    modules: [
      // 人员管理 / 人员异动管理
      Modules.ModuleEmployeeTurnover,
      // 人员管理 / 人员异动管理
      Modules.ModuleEmployeeTurnoverDetail,
    ],
  }),

  // 人员异动
  AuthEmployeeTurnoverOperate: new Auth({
    key: 'AuthEmployeeTurnoverOperate',
    title: '创建、编辑、删除、信息变更',
    description: '创建、编辑、删除、信息变更人员异动权限',
    modules: [
      // 人员管理 / 人员异动管理 / 调岗申请 (页面)
      Modules.ModuleEmployeeTurnoverCreate,
      // 人员管理 / 人员异动管理 / 调岗申请 (操作)
      Modules.OperateEmployeeTurnoverCreate,
      // 人员管理 / 人员异动管理 / 编辑 (页面)
      Modules.ModuleEmployeeTurnoverUpdate,
      // 人员管理 / 人员异动管理 / 编辑 (操作)
      Modules.OperateEmployeeTurnoverUpdate,
      // 人员管理 / 人员异动管理 / 删除 (操作)
      Modules.OperateEmployeeTurnoverDelete,
      // 人员管理 / 人员异动管理 / 信息变更 (操作)
      Modules.OperateEmployeeTurnoverInfoChange,
    ],
  }),

  // 人员档案变更记录
  AuthEmployeeFileRecord: new Auth({
    key: 'AuthEmployeeFileRecord',
    title: '档案变更记录',
    description: '查看人员档案变更记录页面',
    modules: [
      // 档案变更记录页面
      Modules.ModuleEmployeeFileRecord,
    ],
  }),
  // 人员档案-社保配置管理
  AuthEmployeeSociety: new Auth({
    key: 'AuthEmployeeSociety',
    title: '社保配置管理',
    description: '查看人员社保配置管理',
    modules: [
      // 社保配置管理
      Modules.ModuleEmployeeSociety,
    ],
  }),

  // 人员档案-社保配置管理新增
  AuthEmployeeSocietyCreate: new Auth({
    key: 'AuthEmployeeSocietyCreate',
    title: '方案新增',
    description: '社保配置管理新增页面及按钮权限',
    modules: [
      // 社保配置管理
      Modules.ModuleEmployeeSocietyCreate,    // 新增页面
      Modules.OperateEmployeeSocietyCreate,   // 新增按钮
    ],
  }),
  // 人员档案-社保配置管理编辑页面
  AuthEmployeeSocietyUpdate: new Auth({
    key: 'AuthEmployeeSocietyUpdate',
    title: '方案编辑',
    description: '社保配置管理编辑页面及按钮权限',
    modules: [
      // 社保配置管理
      Modules.ModuleEmployeeSocietyUpdate,    // 编辑页面
      Modules.OperateEmployeeSocietyUpdate,   // 编辑按钮
    ],
  }),
  // 人员档案-社保配置管理详情页面
  AuthEmployeeSocietyDetail: new Auth({
    key: 'AuthEmployeeSocietyDetail',
    title: '方案详情',
    description: '社保配置管理详情页面及按钮权限',
    modules: [
      // 社保配置管理
      Modules.ModuleEmployeeSocietyDetail,    // 详情页面
      Modules.OperateEmployeeSocietyDetail,   // 详情按钮
    ],
  }),

  // 新增合同
  AuthEmployeeCreateContract: new Auth({
    key: 'AuthEmployeeCreateContract',
    title: '新增合同',
    description: '新增合同(按钮)',
    modules: [
      // 新增合同（按钮）
      Modules.OperateEmployeeCreateContract,
    ],
  }),

  // 不计入占编数统计
  AuthEmployeeCreateIsOrganization: new Auth({
    key: 'AuthEmployeeCreateIsOrganization',
    title: '不计入占编数统计',
    description: '不计入占编数统计',
    modules: [
      // 不计入占编数统计
      Modules.OperateEmployeeCreateIsOrganization,
    ],
  }),

  // 人员档案 - 包含已裁撤部门数据
  AuthEmployeeAbolishDepartment: new Auth({
    key: 'AuthEmployeeAbolishDepartment',
    title: '包含已裁撤部门数据',
    description: '查看包含已裁撤部门数据的权限',
    modules: [
      // 包含已裁撤部门数据
      Modules.OperateEmployeeAbolishDepartment,
    ],
  }),

  // 人员档案 - 批量操作员工档案team按钮
  AuthEmployeeChangeStaffTeam: new Auth({
    key: 'AuthEmployeeChangeStaffTeam',
    title: '批量操作员工档案team按钮',
    description: '批量操作员工档案team（操作）的权限',
    modules: [
      // 批量操作员工档案team按钮
      Modules.OperateEmployeeChangeStaffTeam,
    ],
  }),

  // 劳动者档案 - 批量操作劳动者档案team按钮
  AuthEmployeeChangeScendTeam: new Auth({
    key: 'AuthEmployeeChangeScendTeam',
    title: '批量操作劳动者档案team按钮',
    description: '批量操作劳动者档案team（操作）的权限',
    modules: [
      // 批量操作劳动者档案team按钮
      Modules.OperateEmployeeChangeScendTeam,
    ],
  }),


  // 个户注册数据
  AuthEmployeeStatisticsData: new Auth({
    key: 'AuthEmployeeStatisticsData',
    title: '个户注册数据',
    description: '查看（个户注册数据）列表页面的权限',
    modules: [
      // 个户注册数据页面
      Modules.ModuleEmployeeStatisticsData,
    ],
  }),

  // 物资管理
  AuthSupply: new Auth({
    key: 'AuthSupply',
    title: '物资管理',
    description: '',
    modules: [
      // 物资管理 (菜单)
      Modules.MenuSupply,
    ],
  }),

  // 物资设置
  AuthSupplySetting: new Auth({
    key: 'AuthSupplySetting',
    title: '物资设置',
    description: '查看（物资设置）页面的权限',
    modules: [
      // 物资管理 / 物资设置(页面)
      Modules.ModuleSupplySetting,
    ],
  }),

  // 采购入库明细
  AuthSupplyProcurement: new Auth({
    key: 'AuthSupplyProcurement',
    title: '采购入库明细',
    description: '查看（采购入库明细）页面的权限',
    modules: [
      // 物资管理 / 采购入库明细(页面)
      Modules.ModuleSupplyProcurement,
    ],
  }),

  // 分发明细
  AuthSupplyDistribution: new Auth({
    key: 'AuthSupplyDistribution',
    title: '分发明细',
    description: '查看（分发明细）页面的权限',
    modules: [
      // 物资管理 / 分发明细(页面)
      Modules.ModuleSupplyDistribution,
    ],
  }),

  // 扣款汇总
  AuthSupplyDeductSummarize: new Auth({
    key: 'AuthSupplyDeductSummarize',
    title: '扣款汇总',
    description: '查看（扣款汇总/扣款汇总详情）页面的权限',
    modules: [
      // 物资管理 / 扣款汇总(页面)
      Modules.ModulesSupplyDeductSummarize,
      // 物资管理 / 扣款汇总(页面)
      Modules.ModulesSupplyDeductSummarizeDetail,
    ],
  }),

  // 扣款明细
  AuthSupplyDeductions: new Auth({
    key: 'AuthSupplyDeductions',
    title: '扣款明细',
    description: '查看（扣款明细）页面的权限',
    modules: [
      // 物资管理 / 扣款明细(页面)
      Modules.ModuleSupplyDeductions,
    ],
  }),

  // 物资台账
  AuthSupplyDetails: new Auth({
    key: 'AuthSupplyDetails',
    title: '物资台账',
    description: '查看（物资台账）页面的权限',
    modules: [
      // 物资管理 / 物资台账(页面)
      Modules.ModuleSupplyDetails,
    ],
  }),

  // 物资设置上传附件、下载模板
  AuthSupplySettingDownloadAndUpload: new Auth({
    key: 'AuthSupplySettingDownloadAndUpload',
    title: '物资设置上传附件、下载模板',
    description: '物资设置上传附件/下载模板的权限',
    modules: [
      // 物资管理 / 物资设置 / 上传附件、下载模板 （操作）
      Modules.OperateSupplySettingDownloadAndUpload,
    ],
  }),

  // 采购入库明细下载模板
  AuthSupplyProcurementDownload: new Auth({
    key: 'AuthSupplyProcurementDownload',
    title: '采购入库明细下载模板',
    description: '采购入库明细下载模板的权限',
    modules: [
      // 物资管理 / 采购入库明细 / 下载模板 （操作）
      Modules.OperateSupplyProcurementDownload,
    ],
  }),

  // 分发明细上传附件、下载模板
  AuthSupplyDistributionDownloadAndUpload: new Auth({
    key: 'AuthSupplyDistributionDownloadAndUpload',
    title: '分发明细上传附件、下载模板',
    description: '分发明细上传附件/下载模板的权限',
    modules: [
      // 物资管理 / 分发明细 / 上传附件、下载模板 （操作）
      Modules.OperateSupplyDistributionDownloadAndUpload,
    ],
  }),

  // 物资台账导出excel
  AuthSupplyStandBookExport: new Auth({
    key: 'AuthSupplyStandBookExport',
    title: '物资台账导出EXCEL',
    description: '物资代账导出EXCEL的权限',
    modules: [
      // 物资管理 / 物资台账 / 导出excel （操作）
      Modules.OperateSupplyStandBookExport,
    ],
  }),

  // 共享登记
  AuthShared: new Auth({
    key: 'AuthShared',
    title: '共享登记',
    description: '',
    modules: [
      // 共享登记（菜单）
      Modules.MenuShared,
    ],
  }),

  // 合同列表
  AuthSharedContract: new Auth({
    key: 'AuthSharedContract',
    title: '合同列表',
    description: '查看合同列表的权限',
    modules: [
      // 共享登记 / 合同列表
      Modules.ModuleSharedContract,
    ],
  }),

  // 合同编辑
  AuthSharedContractForm: new Auth({
    key: 'AuthSharedContractForm',
    title: '合同编辑',
    description: '合同编辑页操作及页面的权限',
    modules: [
      // 共享登记 / 合同编辑（页面）
      Modules.ModuleSharedContractForm,
      // 共享登记 / 合同编辑（操作）
      Modules.OperateSharedContractUpdate,
    ],
  }),

  // 合同详情
  AuthSharedContractDetail: new Auth({
    key: 'AuthSharedContractDetail',
    title: '合同详情',
    description: '合同详情页操作及页面的权限',
    modules: [
      // 共享登记 / 合同详情（页面）
      Modules.ModuleSharedContractDetail,
      // 共享登记 / 合同详情（操作）
      Modules.OperateSharedContractDetail,
    ],
  }),

  // 合同导出
  AuthSharedContractExport: new Auth({
    key: 'AuthSharedContractExport',
    title: '合同导出',
    description: '合同导出操作的权限',
    modules: [
      // 共享登记 / 合同导出（操作）
      Modules.OperateSharedContractExport,
    ],
  }),

  // 合同权限
  AuthSharedContractAuthority: new Auth({
    key: 'AuthSharedContractAuthority',
    title: '合同权限',
    description: '查看及操作合同可查看成员的权限',
    modules: [
      // 共享登记 / 合同权限
      Modules.OperateSharedContractAuthority,
    ],
  }),

  // 公司列表
  AuthSharedCompany: new Auth({
    key: 'AuthSharedCompany',
    title: '公司列表',
    description: '查看公司列表的权限',
    modules: [
      // 共享登记 / 公司列表
      Modules.ModuleSharedCompany,
    ],
  }),

  // 公司创建
  AuthSharedCompanyCreate: new Auth({
    key: 'AuthSharedCompanyCreate',
    title: '公司创建',
    description: '公司创建页操作及页面的权限',
    modules: [
      // 共享登记 / 公司创建（页面）
      Modules.ModuleSharedCompanyCreate,
      // 共享登记 / 公司创建（操作）
      Modules.OperateSharedCompanyCreate,
    ],
  }),

  // 公司编辑
  AuthSharedCompanyUpdate: new Auth({
    key: 'AuthSharedCompanyUpdate',
    title: '公司编辑',
    description: '公司编辑页操作及页面的权限',
    modules: [
      // 共享登记 / 公司编辑（页面）
      Modules.ModuleSharedCompanyUpdate,
      // 共享登记 / 公司编辑（操作）
      Modules.OperateSharedCompanyUpdate,
    ],
  }),

  // 公司详情
  AuthSharedCompanyDetail: new Auth({
    key: 'AuthSharedCompanyDetail',
    title: '公司详情',
    description: '公司详情页操作及页面的权限',
    modules: [
      // 共享登记 / 公司详情（页面）
      Modules.ModuleSharedCompanyDetail,
      // 共享登记 / 公司详情（操作）
      Modules.OperateSharedCompanyDetail,
    ],
  }),

  // 公司导出
  AuthSharedCompanyExport: new Auth({
    key: 'AuthSharedCompanyExport',
    title: '公司导出',
    description: '公司导出操作的权限',
    modules: [
      // 共享登记 / 公司导出（操作）
      Modules.OperateSharedCompanyExport,
    ],
  }),

  // 公司权限
  AuthSharedCompanyAuthority: new Auth({
    key: 'AuthSharedCompanyAuthority',
    title: '公司权限',
    description: '查看及操作公司可查看成员的权限',
    modules: [
      // 共享登记 / 公司权限
      Modules.OperateSharedCompanyAuthority,
    ],
  }),

  // 银行账户列表
  AuthSharedBankAccount: new Auth({
    key: 'AuthSharedBankAccount',
    title: '银行账户列表',
    description: '查看银行账户列表的权限',
    modules: [
      // 共享登记 / 银行账户列表
      Modules.ModuleSharedBankAccount,
    ],
  }),

  // 银行账户创建
  AuthSharedBankAccountCreate: new Auth({
    key: 'AuthSharedBankAccountCreate',
    title: '银行账户创建',
    description: '银行账户创建页操作及页面的权限',
    modules: [
      // 共享登记 / 银行账户创建（页面）
      Modules.ModuleSharedBankAccountCreate,
      // 共享登记 / 银行账户创建（操作）
      Modules.OperateSharedBankAccountCreate,
    ],
  }),

  // 银行账户编辑
  AuthSharedBankAccountUpdate: new Auth({
    key: 'AuthSharedBankAccountUpdate',
    title: '银行账户编辑',
    description: '银行账户编辑页操作及页面的权限',
    modules: [
      // 共享登记 / 银行账户编辑（页面）
      Modules.ModuleSharedBankAccountUpdate,
      // 共享登记 / 银行账户编辑（操作）
      Modules.OperateSharedBankAccountUpdate,
    ],
  }),

  // 银行账户详情
  AuthSharedBankAccountDetail: new Auth({
    key: 'AuthSharedBankAccountDetail',
    title: '银行账户详情',
    description: '银行账户详情页操作及页面的权限',
    modules: [
      // 共享登记 / 银行账户详情（页面）
      Modules.ModuleSharedBankAccountDetail,
      // 共享登记 / 银行账户详情（操作）
      Modules.OperateSharedBankAccountDetail,
    ],
  }),

  // 银行账户导出
  AuthSharedBankAccountExport: new Auth({
    key: 'AuthSharedBankAccountExport',
    title: '银行账户导出',
    description: '银行账户导出操作的权限',
    modules: [
      // 共享登记 / 银行账户导出（操作）
      Modules.OperateSharedBankAccountExport,
    ],
  }),

  // 银行账户权限
  AuthSharedBankAccountAuthority: new Auth({
    key: 'AuthSharedBankAccountAuthority',
    title: '银行账户权限',
    description: '查看及操作银行账户可查看成员的权限',
    modules: [
      // 共享登记 / 银行账户权限
      Modules.OperateSharedBankAccountAuthority,
    ],
  }),

  // 印章列表
  AuthSharedSeal: new Auth({
    key: 'AuthSharedSeal',
    title: '印章列表',
    description: '查看印章列表的权限',
    modules: [
      // 共享登记 / 印章列表
      Modules.ModuleSharedSeal,
    ],
  }),

  // 印章创建
  AuthSharedSealCreate: new Auth({
    key: 'AuthSharedSealCreate',
    title: '印章创建',
    description: '印章创建页操作及页面的权限',
    modules: [
      // 共享登记 / 印章创建（页面）
      Modules.ModuleSharedSealCreate,
      // 共享登记 / 印章创建（操作）
      Modules.OperateSharedSealCreate,
    ],
  }),

  // 印章编辑
  AuthSharedSealUpdate: new Auth({
    key: 'AuthSharedSealUpdate',
    title: '印章编辑',
    description: '印章编辑页操作及页面的权限',
    modules: [
      // 共享登记 / 印章编辑（页面）
      Modules.ModuleSharedSealUpdate,
      // 共享登记 / 印章编辑（操作）
      Modules.OperateSharedSealUpdate,
    ],
  }),

  // 印章详情
  AuthSharedSealDetail: new Auth({
    key: 'AuthSharedSealDetail',
    title: '印章详情',
    description: '印章详情页操作及页面的权限',
    modules: [
      // 共享登记 / 印章详情（页面）
      Modules.ModuleSharedSealDetail,
      // 共享登记 / 印章详情（操作）
      Modules.OperateSharedSealDetail,
    ],
  }),

  // 印章导出
  AuthSharedSealExport: new Auth({
    key: 'AuthSharedSealExport',
    title: '印章导出',
    description: '印章导出操作的权限',
    modules: [
      // 共享登记 / 印章导出（操作）
      Modules.OperateSharedSealExport,
    ],
  }),

  // 印章权限
  AuthSharedSealAuthority: new Auth({
    key: 'AuthSharedSealAuthority',
    title: '印章权限',
    description: '查看及操作印章可查看成员的权限',
    modules: [
      // 共享登记 / 印章权限
      Modules.OperateSharedSealAuthority,
    ],
  }),

  // 证照列表
  AuthSharedLicense: new Auth({
    key: 'AuthSharedLicense',
    title: '证照列表',
    description: '查看证照列表的权限',
    modules: [
      // 共享登记 / 列表
      Modules.ModuleSharedLicense,
    ],
  }),

  // 证照创建
  AuthSharedLicenseCreate: new Auth({
    key: 'AuthSharedLicenseCreate',
    title: '证照创建',
    description: '证照创建页操作及页面的权限',
    modules: [
      // 共享登记 / 证照创建（页面）
      Modules.ModuleSharedLicenseCreate,
      // 共享登记 / 证照创建（操作）
      Modules.OperateSharedLicenseCreate,
    ],
  }),

  // 证照编辑
  AuthSharedLicenseUpdate: new Auth({
    key: 'AuthSharedLicenseUpdate',
    title: '证照编辑',
    description: '证照编辑页操作及页面的权限',
    modules: [
      // 共享登记 / 证照编辑（页面）
      Modules.ModuleSharedLicenseUpdate,
      // 共享登记 / 证照编辑（操作）
      Modules.OperateSharedLicenseUpdate,
    ],
  }),

  // 证照详情
  AuthSharedLicenseDetail: new Auth({
    key: 'AuthSharedLicenseDetail',
    title: '证照详情',
    description: '证照详情页操作及页面的权限',
    modules: [
      // 共享登记 / 证照详情（页面）
      Modules.ModuleSharedLicenseDetail,
      // 共享登记 / 证照详情（操作）
      Modules.OperateSharedLicenseDetail,
    ],
  }),

  // 证照导出
  AuthSharedLicenseExport: new Auth({
    key: 'AuthSharedLicenseExport',
    title: '证照导出',
    description: '证照导出操作的权限',
    modules: [
      // 共享登记 / 证照导出（操作）
      Modules.OperateSharedLicenseExport,
    ],
  }),

  // 证照权限
  AuthSharedLicenseAuthority: new Auth({
    key: 'AuthSharedlicenseAuthority',
    title: '证照权限',
    description: '查看及操作证照可查看成员的权限',
    modules: [
      // 共享登记 / 证照权限
      Modules.OperateSharedLicenseAuthority,
    ],
  }),

  // 审批管理
  AuthExpense: new Auth({
    key: 'AuthExpense',
    title: '审批管理',
    description: '',
    isVerifyAuth: false,
    modules: [
      // 审批管理（菜单）
      Modules.MenuExpense,
    ],
  }),

  // 基础设置
  AuthExpenseControl: new Auth({
    key: 'AuthExpenseControl',
    title: '基础设置',
    description: '基础设置的权限',
    modules: [
      // 基础设置（菜单）
      Modules.MenuExpenseControl,
    ],
  }),

  // 流程审批
  // AuthExpenseProcess: new Auth({
  //   key: 'AuthExpenseProcess',
  //   title: '流程审批',
  //   description: '流程审批的权限',
  //   isVerifyAuth: false,
  //   modules: [
  //     // 流程审批（菜单）
  //     // Modules.MenuExpenseProcess,
  //   ],
  // }),

  // 考勤管理
  AuthExpenseAttendance: new Auth({
    key: 'AuthExpenseAttendance',
    title: '考勤管理',
    description: '考勤管理的权限',
    modules: [
      // 考勤管理（菜单）
      Modules.MenuExpenseAttendance,
    ],
  }),

  // 请假管理
  AuthExpenseAttendanceTakeLeave: new Auth({
    key: 'AuthExpenseAttendanceTakeLeave',
    title: '请假管理',
    description: '请假管理的权限',
    modules: [
      // 考勤管理 (菜单) / 请假管理列表页
      Modules.ModuleExpenseAttendanceTakeLeave,
    ],
  }),

  // 请假管理(新建,编辑,详情) 页面
  AuthExpenseAttendanceTakeLeaveOrder: new Auth({
    key: 'AuthExpenseAttendanceTakeLeaveOrder',
    title: '请假申请单',
    description: '请假申请单的权限（新建、编辑、详情）页面',
    modules: [
      // 考勤管理 (菜单) / 请假管理列表页 / 创建
      Modules.ModuleExpenseAttendanceTakeLeaveCreate,
      // 考勤管理 (菜单) / 请假管理列表页 / 详情
      Modules.ModuleExpenseAttendanceTakeLeaveDetail,
      // 考勤管理 (菜单) / 请假管理列表页 / 编辑
      Modules.ModuleExpenseAttendanceTakeLeaveUpdate,
    ],
  }),

  // 请假管理 (我的) 操作
  AuthExpenseAttendanceTakeLeaveMy: new Auth({
    key: 'AuthExpenseAttendanceTakeLeaveMy',
    title: '请假管理 (我的) 操作',
    description: '请假管理 (我的) 操作权限',
    modules: [
      Modules.OperateExpenseAttendanceTakeLeaveMy,
    ],
  }),

  // 请假管理 (全部) 操作
  AuthExpenseAttendanceTakeLeaveAll: new Auth({
    key: 'AuthExpenseAttendanceTakeLeaveAll',
    title: '请假管理 (全部) 操作',
    description: '请假管理 (全部) 操作权限',
    modules: [
      Modules.OperateExpenseAttendanceTakeLeaveAll,
    ],
  }),

  // 加班管理
  AuthExpenseOverTime: new Auth({
    key: 'AuthExpenseOverTime',
    title: '加班管理',
    description: '加班管理的权限',
    modules: [
      // 加班管理（菜单）
      Modules.ModuleExpenseAttendanceOverTime,
    ],
  }),

  // 加班管理Tab我的
  AuthExpenseOverTimeMine: new Auth({
    key: 'AuthExpenseOverTimeMine',
    title: '加班管理列表-我的（操作）',
    description: '加班管理列表-我的的权限',
    modules: [
      // 加班管理 - 我的（操作）
      Modules.OperateExpenseAttendanceOverTimeMy,
    ],
  }),

  // 加班管理Tab全部
  AuthExpenseOverTimeAll: new Auth({
    key: 'AuthExpenseOverTimeAll',
    title: '加班管理列表-全部（操作）',
    description: '加班管理列表-全部的权限',
    modules: [
      // 加班管理 - 全部（操作）
      Modules.OperateExpenseAttendanceOverTimeAll,
    ],
  }),

  // 加班单
  AuthExpenseOverTimeOrder: new Auth({
    key: 'AuthExpenseOverTimeOrder',
    title: '加班申请单',
    description: '加班申请单的权限（新建、编辑、详情）',
    modules: [
      // 新建加班申请单（页面）
      Modules.ModuleExpenseAttendanceOverTimeCreate,
      // 编辑加班申请单（页面）
      Modules.ModuleExpenseAttendanceOverTimeUpdate,
      // 加班申请单详情（页面）
      Modules.ModuleExpenseAttendanceOverTimeDetail,
    ],
  }),

  // 科目设置
  AuthExpenseSubject: new Auth({
    key: 'AuthExpenseSubject',
    title: '科目设置',
    description: '查看（科目设置）页面的权限',
    modules: [
      // 费用管理 / 科目设置（页面）
      Modules.ModuleExpenseSubject,
    ],
  }),

  // 科目创建
  AuthExpenseSubjectCreate: new Auth({
    key: 'AuthExpenseSubjectCreate',
    title: '新建科目',
    description: '新建费用科目的权限',
    modules: [
      // 费用管理 / 科目新建（页面）
      Modules.ModuleExpenseSubjectCreate,
      // 费用管理 / 科目新建（操作）
      Modules.OperateExpenseSubjectCreate,
    ],
  }),

  // 科目编辑
  AuthExpenseSubjectUpdate: new Auth({
    key: 'AuthExpenseSubjectUpdate',
    title: '编辑科目',
    description: '编辑费用科目的权限',
    modules: [
      // 费用管理 / 科目编辑（页面）
      Modules.ModuleExpenseSubjectUpdate,
      // 费用管理 / 科目编辑（操作）
      Modules.OperateExpenseSubjectUpdate,
    ],
  }),

  // 科目删除
  AuthExpenseSubjectDelete: new Auth({
    key: 'AuthExpenseSubjectDelete',
    title: '删除科目',
    description: '删除费用科目的权限',
    modules: [
      // 费用管理 / 科目删除（按钮）
      Modules.OperateExpenseSubjectDelete,
    ],
  }),

  // 科目启用
  AuthExpenseSubjectEnable: new Auth({
    key: 'AuthExpenseSubjectEnable',
    title: '启用科目',
    description: '启用费用科目的权限',
    modules: [
      // 费用管理 / 科目删除（按钮）
      Modules.OperateExpenseSubjectEnable,
    ],
  }),

  // 科目停用
  AuthExpenseSubjectDisable: new Auth({
    key: 'AuthExpenseSubjectDisable',
    title: '停用科目',
    description: '停用费用科目的权限',
    modules: [
      // 费用管理 / 科目停用（按钮）
      Modules.OperateExpenseSubjectDisable,
    ],
  }),

  // 科目查看
  AuthExpenseSubjectDetail: new Auth({
    key: 'AuthExpenseSubjectDetail',
    title: '查看科目',
    description: '查看费用科目的权限',
    modules: [
      // 费用管理 / 科目查看（页面）
      Modules.ModuleExpenseSubjectDetails,
      // 费用管理 / 科目查看（按钮）
      Modules.OperateExpenseSubjectDetail,
    ],
  }),

  // 审批流程设置
  AuthExpenseExamineFlowProcess: new Auth({
    key: 'AuthExpenseExamineFlowProcess',
    title: '审批流程设置',
    description: '审批流程设置的权限（页面）',
    modules: [
      // 费用管理 / 审批流设置 / 审批流程设置（页面）
      Modules.ModuleExpenseExamineFlowProcess,
    ],
  }),

  // 审批岗位设置
  AuthExpenseExamineFlowPost: new Auth({
    key: 'AuthExpenseExamineFlowPost',
    title: '审批岗位设置',
    description: '审批岗位设置的权限（页面）',
    modules: [
      // 费用管理 / 审批流设置 / 审批岗位设置（页面）
      Modules.ModuleExpenseExamineFlowPost,
    ],
  }),

  // 添加岗位
  AuthExpensePostCreate: new Auth({
    key: 'AuthExpensePostCreate',
    title: '添加岗位',
    description: '添加岗位的权限（操作）',
    modules: [
      // 费用管理 / 审批流设置 / 审批岗位设置 / 添加岗位（操作）
      Modules.OperateExpensePostCreate,
    ],
  }),

  // 编辑岗位
  AuthExpensePostUpdate: new Auth({
    key: 'AuthExpensePostUpdate',
    title: '编辑岗位',
    description: '编辑岗位的权限（操作）',
    modules: [
      // 费用管理 / 审批流设置 / 审批岗位设置 / 编辑岗位（操作）
      Modules.OperateExpensePostUpdate,
    ],
  }),

  // 启用岗位
  AuthExpensePostEnable: new Auth({
    key: 'AuthExpensePostEnable',
    title: '启用岗位',
    description: '启用岗位的权限（操作）',
    modules: [
      // 费用管理 / 审批流设置 / 审批岗位设置 / 启用岗位（操作）
      Modules.OperateExpensePostEnable,
    ],
  }),

  // 停用岗位
  AuthExpensePostDisable: new Auth({
    key: 'AuthExpensePostDisable',
    title: '停用岗位',
    description: '停用岗位的权限（操作）',
    modules: [
      // 费用管理 / 审批流设置 / 审批岗位设置 / 停用岗位（操作）
      Modules.OperateExpensePostDisable,
    ],
  }),

  // 新建、编辑、启用、停用、删除
  AuthExpenseExamineFlowDetail: new Auth({
    key: 'AuthExpenseExamineFlowDetail',
    title: '查看详情',
    description: '查看详情',
    modules: [
      // 费用管理 / 审批流设置 / 审批流程设置 / 审批流查看页面（页面）
      Modules.ModuleExpenseExamineFlowDetail,
    ],
  }),

  // 新建、编辑、启用、停用、删除
  AuthExpenseExamineUpdate: new Auth({
    key: 'AuthExpenseExamineUpdate',
    title: '新建、编辑、启用、停用、删除',
    description: '新建、编辑、启用、停用、删除审批流的权限',
    modules: [
      // 费用管理 / 审批流设置 / 审批流程设置 / 审批流编辑页面（页面）
      Modules.ModuleExpenseExamineFlowUpdate,
      // 费用管理 / 审批流设置 / 审批流程设置 / 审批流配置页面 (页面)
      Modules.ModuleExpenseExamineFlowConfig,
      // 费用管理 / 审批流设置 / 审批流程设置 / 新建、编辑、查看、启用、停用、删除审批流（操作）
      Modules.OperateExpenseExamineUpdate,
    ],
  }),

  // 关联审批流
  AuthExpenseRelationExamineFlow: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlow',
    title: '关联审批流',
    description: '关联审批流的权限（页面）',
    modules: [
        // 费用管理 / 关联审批流（页面）
      Modules.ModuleExpenseRelationExamineFlow,
    ],
  }),

  // code/team审批流
  AuthExpenseRelationExamineFlowCodeTeam: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowCodeTeam',
    title: 'code/team审批流',
    description: 'code/team审批流的权限',
    modules: [
        // 费用管理 / code/team审批流
      Modules.OperateExpenseRelationExamineFlowCodeTeam,
    ],
  }),

  // 新增、编辑、删除、禁用、启用
  AuthExpenseRelationExamineFlowCodeTeamUpdate: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowCodeTeamUpdate',
    title: '新增、编辑、删除、禁用、启用',
    description: '新增、编辑、删除、禁用、启用',
    modules: [
      // 费用管理 / 关联审批流/ code/team审批流新增
      Modules.ModuleExpenseRelationExamineFlowCodeTeamCreate,
      // 费用管理 / 关联审批流/ code/team审批流编辑
      Modules.ModuleExpenseRelationExamineFlowCodeTeamUpdate,
      // 费用管理 / 关联审批流/ code/team审批流删除、禁用、启用
      Modules.OperateExpenseRelationExamineFlowCodeTeamUpdateState,
    ],
  }),

  // code/team审批流详情的权限
  AuthExpenseRelationExamineFlowCodeTeamDetail: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowCodeTeamDetail',
    title: '查看',
    description: 'code/team审批流详情的权限（页面）',
    modules: [
        // 费用管理 / 关联审批流/ code/team审批流详情（页面）
      Modules.ModuleExpenseRelationExamineFlowCodeTeamDetail,
    ],
  }),

  // 事务审批流
  AuthExpenseRelationExamineFlowAffair: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowAffair',
    title: '事务审批流',
    description: '事务审批流的权限',
    modules: [
        // 费用管理 / 事务审批流
      Modules.OperateExpenseRelationExamineFlowAffair,
    ],
  }),

  // 新增、编辑、删除、禁用、启用
  AuthExpenseRelationExamineFlowAffairUpdate: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowAffairUpdate',
    title: '新增、编辑、删除、禁用、启用',
    description: '新增、编辑、删除、禁用、启用',
    modules: [
      // 费用管理 / 关联审批流/ 事务审批流新增
      Modules.ModuleExpenseRelationExamineFlowAffairCreate,
      // 费用管理 / 关联审批流/ 事务审批流编辑
      Modules.ModuleExpenseRelationExamineFlowAffairUpdate,
      // 费用管理 / 关联审批流/ 事务审批流删除、禁用、启用
      Modules.OperateExpenseRelationExamineFlowAffairUpdateState,
    ],
  }),

  // 事务审批流详情的权限
  AuthExpenseRelationExamineFlowAffairDetail: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowAffairDetail',
    title: '查看',
    description: '事务审批流详情的权限（页面）',
    modules: [
        // 费用管理 / 关联审批流/ 事务审批流详情（页面）
      Modules.ModuleExpenseRelationExamineFlowAffairDetail,
    ],
  }),

  // 成本类审批流
  AuthExpenseRelationExamineFlowCost: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowCost',
    title: '成本类审批流',
    description: '成本类审批流的权限',
    modules: [
        // 费用管理 / 成本类审批流
      Modules.OperateExpenseRelationExamineFlowCost,
    ],
  }),

  // 新增、编辑、删除、禁用、启用
  AuthExpenseRelationExamineFlowCostUpdate: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowCostUpdate',
    title: '新增、编辑、删除、禁用、启用',
    description: '新增、编辑、删除、禁用、启用',
    modules: [
      // 费用管理 / 关联审批流/ 成本类审批流新增
      Modules.ModuleExpenseRelationExamineFlowCostCreate,
      // 费用管理 / 关联审批流/ 成本类审批流编辑
      Modules.ModuleExpenseRelationExamineFlowCostUpdate,
      // 费用管理 / 关联审批流/ 成本类审批流删除、禁用、启用
      Modules.OperateExpenseRelationExamineFlowCostUpdateState,
    ],
  }),

  // 成本类审批流详情的权限
  AuthExpenseRelationExamineFlowCostDetail: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowCostDetail',
    title: '查看',
    description: '成本类审批流详情的权限（页面）',
    modules: [
      // 费用管理 / 关联审批流/ 成本类审批流详情（页面）
      Modules.ModuleExpenseRelationExamineFlowCostDetail,
    ],
  }),

  // 非成本类审批流
  AuthExpenseRelationExamineFlowNoCost: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowNoCost',
    title: '非成本类审批流',
    description: '非成本类审批流的权限',
    modules: [
        // 费用管理 / 非成本类审批流
      Modules.OperateExpenseRelationExamineFlowNoCost,
    ],
  }),
  // 新增、编辑、删除、禁用、启用
  AuthExpenseRelationExamineFlowNoCostUpdate: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowNoCostUpdate',
    title: '新增、编辑、删除、禁用、启用',
    description: '新增、编辑、删除、禁用、启用',
    modules: [
      // 费用管理 / 关联审批流/ 非成本审批流新增
      Modules.ModuleExpenseRelationExamineFlowNoCostCreate,
      // 费用管理 / 关联审批流/ 非成本审批流编辑
      Modules.ModuleExpenseRelationExamineFlowNoCostUpdate,
      // 费用管理 / 关联审批流/ 非成本审批流删除、禁用、启用
      Modules.OperateExpenseRelationExamineFlowNoCostUpdateState,
    ],
  }),

  // 非成本类审批流详情的权限
  AuthExpenseRelationExamineFlowNoCostDetail: new Auth({
    onShowOnBoss: true, // 只在boss系统中展示
    key: 'AuthExpenseRelationExamineFlowNoCostDetail',
    title: '查看',
    description: '非成本类审批流详情的权限（页面）',
    modules: [
      // 费用管理 / 关联审批流/ 非成本类审批流详情（页面）
      Modules.ModuleExpenseRelationExamineFlowNoCostDetail,
    ],
  }),

  // 费用分组设置
  AuthExpenseType: new Auth({
    key: 'AuthExpenseType',
    title: '费用分组设置',
    description: '查看（费用分组设置）页面的权限',
    modules: [
      // 费用管理 / 费用分组设置（页面）
      Modules.ModuleExpenseType,
      // 费用管理 / 费用分组设置 / 费用分组设置详情（页面）
      Modules.ModuleExpenseTypeDetail,
    ],
  }),

  // 新建、编辑、启用、停用、删除
  AuthExpenseTypeUpdate: new Auth({
    key: 'AuthExpenseTypeUpdate',
    title: '新建、编辑、启用、停用、删除',
    description: '新建、编辑、启用、停用、删除费用分组的权限',
    modules: [
      // 费用管理 / 费用分组设置 / 费用分组设置新建（页面）
      Modules.ModuleExpenseTypeCreate,
      // 费用管理 / 费用分组设置 / 费用分组设置编辑（页面）
      Modules.ModuleExpenseTypeUpdate,
      // 费用管理 / 费用分组设置 / 新建、编辑、启用、停用、删除费用分组（操作）
      Modules.OperateExpenseExpenseTypeUpdate,
    ],
  }),

  // 费控申请
  AuthExpenseManage: new Auth({
    key: 'AuthExpenseManage',
    title: '费控申请',
    description: '新建费控申请的权限（注：包含费用申请，差旅报销，借款申请，使用该权限，需将（付款审批）权限勾选）',
    modules: [
      // 费用管理 / 费控申请 / 费用申请创建（页面）
      Modules.ModuleExpenseManageTemplateCreate,
      // 费用管理 / 新建费用申请（操作）
      Modules.OperateExpenseManageCreate,
    ],
  }),

  // 验票标签库
  AuthExpenseTicketTags: new Auth({
    key: 'AuthExpenseTicketTags',
    title: '验票标签库',
    description: '查看（验票标签库）页面及操作的权限',
    modules: [
      // 费用管理 / 验票标签库
      Modules.ModuleExpenseTicket,
    ],
  }),
  // 审批中心
  AuthExpenseOrderManage: new Auth({
    key: 'AuthExpenseOrderManage',
    title: '审批中心',
    description: '查看（审批中心）菜单入口的权限',
    modules: [
      // 费用管理 / 审批中心（菜单）
      Modules.MenuExpenseOrderManage,
    ],
  }),

  // 付款审批
  AuthExpenseManageAudit: new Auth({
    key: 'AuthExpenseManageAudit',
    title: '付款审批',
    description: '查看（付款审批）页面及查看付款审批明细的权限',
    modules: [
      // 费用管理 / 付款审批（页面）
      Modules.ModuleExpenseManageExamineOrder,
      // 费用管理 / 新建费用申请 / 费用申请编辑（页面）
      Modules.ModuleExpenseManageTemplateUpdate,
      // 费用管理 / 新建费用申请 / 费用申请详情（页面）
      Modules.ModuleExpenseManageTemplateDetail,
      // 费用管理 / 新建费用申请 / 付款审批创建（页面）
      Modules.ModuleExpenseManageExamineOrderCreate,
      // 费用管理 / 付款审批（页面） / 付款审批详情（页面）
      Modules.ModuleExpenseManageExamineOrderDetail,
      // 费用管理 / 付款审批（页面） / 创建出差申请单
      Modules.ModuleExpenseManageExamineOrderBusinessTripCreate,
      // 费用管理 / 付款审批（页面） / 编辑出差申请单
      Modules.ModuleExpenseManageExamineOrderBusinessTripUpdate,
      // 费用管理 / 付款审批（页面） / 创建差旅报销单
      Modules.ModuleExpenseManageExamineOrderBusinessTravelCreate,
      // 费用管理 / 付款审批（页面） / 编辑差旅报销单
      Modules.ModuleExpenseManageExamineOrderBusinessTravelUpdate,
      // 费用管理 / 付款审批（页面） / 付款审批打印预览（页面）
      Modules.ModuleExpenseManageExamineOrderPrint,
      // 费用管理 / 付款审批（页面） / 付款审批单页打印（操作）
      Modules.OperateExpenseManageExamineOrderPrint,
      // 费用管理 / 付款审批（页面） / 付款审批批量打印（操作）
      Modules.OperateExpenseManageExamineOrderBatchPrint,
    ],
  }),

  // 编辑
  AuthExpenseManageEdit: new Auth({
    key: 'AuthExpenseManageEdit',
    title: '编辑',
    description: '编辑费用申请的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单编辑（操作）
      Modules.OperateExpenseManageEditButton,
    ],
  }),

  // 审批
  AuthExpenseManageVerify: new Auth({
    key: 'AuthExpenseManageVerify',
    title: '审批',
    description: '审批费用申请的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单审批（操作）
      Modules.OperateExpenseManageApprovalButton,
    ],
  }),

  // 付款审批列表tab全部操作
  AuthExpenseManageAuditListAll: new Auth({
    key: 'AuthExpenseManageAuditListAll',
    title: '审批列表全部(操作)',
    description: '审批列表全部操作的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单列表全部（操作）
      Modules.OperateExpenseManageExamineOrderAll,
    ],
  }),

  // 付款审批列表tab待提报/待办/我提报/我经手的操作
  AuthExpenseManageAuditSubmission: new Auth({
    key: 'AuthExpenseManageAuditSubmission',
    title: '审批列表/待提报/待办/我提报/我经手 (操作)',
    description: '审批列表/待提报/待办/我提报/我经手操作的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单列表待提报（操作）
      Modules.OperateExpenseManageExamineOrderReported,
      // 费用管理 / 付款审批 / 审批单列表待办（操作）
      Modules.OperateExpenseManageExamineOrderStayDo,
      // 费用管理 / 付款审批 / 审批单列表我的提报（操作）
      Modules.OperateExpenseManageExamineOrderSubmission,
      // 费用管理 / 付款审批 / 审批单列表我经手的（操作）
      Modules.OperateExpenseManageExamineOrderHandle,
    ],
  }),

  // 审批单退款
  AuthExpenseManageRefund: new Auth({
    key: 'AuthExpenseManageRefund',
    title: '审批单退款',
    description: '审批单退款的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单退款（操作）
      Modules.OperateExpenseManageRefundButton,
      // 费用管理 / 付款审批 / 退款审批单（页面）
      Modules.ModuleExpenseRefundOrder,
      // 费用管理 / 付款审批 / 退款费用单（页面）
      Modules.ModuleExpenseRefundCostOrder,
    ],
  }),

  // 审批单红冲
  AuthExpenseManageInvoiceAdjust: new Auth({
    key: 'AuthExpenseManageInvoiceAdjust',
    title: '审批单红冲',
    description: '审批单红冲的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单红冲（操作）
      Modules.OperateExpenseManageRedBluntButton,
      // 费用管理 / 付款审批 / 红冲审批单（页面）
      Modules.ModuleExpenseInvoiceAdjustOrder,
      // 费用管理 / 付款审批 / 红冲费用单（页面）
      Modules.ModuleExpenseInvoiceAdjustCostOrder,
    ],
  }),

  // 事务审批
  AuthExpenseManageOAOrder: new Auth({
    key: 'AuthExpenseManageOAOrder',
    title: '事务审批',
    description: '查看（事务审批）页面及查看付款审批明细的权限',
    modules: [
      // 费用管理 / 付款审批（页面）
      Modules.ModuleExpenseManageOAOrder,
      // 费用管理 / 新建费用申请 / 付款审批创建（页面）
      Modules.ModuleExpenseManageExamineOrderCreate,
      // 费用管理 / 付款审批（页面） / 付款审批详情（页面）
      Modules.ModuleExpenseManageExamineOrderDetail,
    ],
  }),

  // 事务审批编辑
  AuthExpenseManageOAOrderEdit: new Auth({
    key: 'AuthExpenseManageOAOrderEdit',
    title: '编辑',
    description: '编辑费用申请的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单编辑（操作）
      Modules.OperateExpenseManageOAOrderEditButton,
    ],
  }),

  // 事务审批审批
  AuthExpenseManageOAOrderVerify: new Auth({
    key: 'AuthExpenseManageOAOrderVerify',
    title: '审批',
    description: '审批费用申请的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单审批（操作）
      Modules.OperateExpenseManageOAOrderApprovalButton,
    ],
  }),

  // 事务审批列表tab全部操作
  AuthExpenseManageOAOrderAuditAll: new Auth({
    key: 'AuthExpenseManageOAOrderAuditAll',
    title: '审批列表全部(操作)',
    description: '审批列表全部操作的权限',
    modules: [
      // 费用管理 / 付款审批 / 审批单列表全部（操作）
      Modules.OperateExpenseManageOAOrderAll,
    ],
  }),

  // 事务审批列表tab待提报/待办/我提报/我经手的操作
  AuthExpenseManageOAOrderAuditSubmission: new Auth({
    key: 'AuthExpenseManageOAOrderAuditSubmission',
    title: '审批列表/待提报/待办/我提报/我经手(操作)',
    description: '审批列表/待提报/待办/我提报/我经手操作的权限',
    modules: [
      // 费用管理 / 事务审批 / 审批单列表待提报（操作）
      Modules.OperateExpenseManageOAOrderReported,
      // 费用管理 / 事务审批 / 审批单列表待办（操作）
      Modules.OperateExpenseManageOAOrderStayDo,
      // 费用管理 / 事务审批 / 审批单列表我的提报（操作）
      Modules.OperateExpenseManageOAOrderSubmission,
      // 费用管理 / 事务审批 / 审批单列表我经手的（操作）
      Modules.OperateExpenseManageOAOrderHandle,
    ],
  }),

  // 事务审批列表tab抄送我的（操作）
  AuthExpenseManageOAOrderCopyGive: new Auth({
    key: 'AuthExpenseManageOAOrderCopyGive',
    title: '审批列表/抄送我 (操作)',
    description: '审批列表/抄送我操作的权限',
    modules: [
      // 费用管理 / 事务审批 / 事务审批列表中抄送我的（操作）
      Modules.OperateExpenseManageOAOrderCopyGive,
    ],
  }),

  // 费用记录明细
  AuthExpenseManageRecords: new Auth({
    key: 'AuthExpenseManageRecords',
    title: '费用记录明细',
    description: '查看（费用记录明细）页面及查看费用记录明细详情页的权限',
    modules: [
      // 费用管理 / 费用记录明细（页面）
      Modules.ModuleExpenseManageRecords,
      // 费用管理 / 费用记录明细 / 明细记录详情（页面）
      Modules.ModuleExpenseManageRecordsDetail,
    ],
  }),

  // 续签、断租、退租、续租
  AuthExpenseManageRecordsVerify: new Auth({
    key: 'AuthExpenseManageRecordsVerify',
    title: '续签、断租、退租、续租、退押金',
    description: '续签、断租、退租、续租、退押金租房费用申请单的权限',
    modules: [
      // 费用管理 / 费用记录明细 / 编辑明细列表（页面）
      Modules.ModuleExpenseManageRecordsSummaryCreate,
      // 费用管理 / 费用记录明细 / 编辑明细记录（页面）
      Modules.ModuleExpenseManageRecordsForm,
      // 费用管理 / 房屋管理 / 续签、断租、退租 / 退押金(操作)
      Modules.OperateExpenseManageHouseoPeration,
    ],
  }),

  // 发起审批
  AuthOADocumentManage: new Auth({
    key: 'AuthOADocumentManage',
    title: '发起审批-事务申请',
    description: '发起审批-事务申请的权限',
    modules: [
      // 费用管理 / 发起审批（页面）
      Modules.ModuleOADocumentManage,
    ],
  }),

  // Code/Team审批管理
  AuthCodeApprovalAdministration: new Auth({
    key: 'AuthCodeApprovalAdministration',
    title: 'Code/Team审批管理',
    description: 'Code/Team审批管理',
    modules: [
      // Code/Team审批管理
      Modules.MenuCodeApprovalAdministration,
    ],
  }),

  // 基础设置
  AuthCodeCodeBasicSet: new Auth({
    key: 'AuthCodeCodeBasicSet',
    title: '基础设置',
    description: '基础设置',
    modules: [
      // 基础设置
      Modules.MenuCodeBasicSet,
    ],
  }),

  // Code审批流设置
  AuthModuleCodeBasicSetProcess: new Auth({
    key: 'AuthModuleCodeBasicSetProcess',
    title: 'Code审批流设置',
    description: 'Code审批流设置',
    modules: [
      // Code审批流设置
      Modules.ModuleCodeBasicSetProcess,
    ],
  }),

  // 验票标签库
  AuthModuleCodeExpenseTicket: new Auth({
    key: 'AuthModuleCodeExpenseTicket',
    title: '验票标签库',
    description: '验票标签库',
    modules: [
      // 验票标签库
      Modules.ModuleCodeExpenseTicket,
    ],
  }),

  // 自定义提报类型
  AuthModuleCodeTypeConfigPay: new Auth({
    key: 'AuthModuleCodeTypeConfigPay',
    title: '自定义提报类型',
    description: '自定义提报类型',
    modules: [
      // 自定义提报类型
      Modules.ModuleCodeTypeConfigPay,
    ],
  }),

  // 付款规则
  AuthModuleCodePaymentRule: new Auth({
    key: 'AuthModuleCodePaymentRule',
    title: '付款规则',
    description: '付款规则（页面）的权限',
    modules: [
      // 付款规则
      Modules.ModuleCodePaymentRule,
    ],
  }),

  // 付款规则
  AuthOperateCodePaymentRuleUpdate: new Auth({
    key: 'AuthOperateCodePaymentRuleUpdate',
    title: '编辑付款规则',
    description: '编辑付款规则（操作）的权限',
    modules: [
      // 付款规则
      Modules.OperateCodePaymentRuleUpdate,
    ],
  }),

  // 审批中心
  AuthMenuCodeOrderManage: new Auth({
    key: 'AuthMenuCodeOrderManage',
    title: '审批中心',
    description: '审批中心',
    modules: [
      // 审批中心
      Modules.MenuCodeOrderManage,
    ],
  }),
  // 发起审批
  AuthModuleCodeDocumentManage: new Auth({
    key: 'AuthModuleCodeDocumentManage',
    title: '发起审批',
    description: '发起审批',
    modules: [
      // 发起审批
      Modules.ModuleCodeDocumentManage,
    ],
  }),
  // 费控申请
  AuthOperateCodeDocumentManageExpense: new Auth({
    key: 'AuthOperateCodeDocumentManageExpense',
    title: '费控申请',
    description: '费控申请',
    modules: [
      // 费控申请
      Modules.OperateCodeDocumentManageExpense,
      // 创建审批单
      Modules.ModuleCodeOrderCreate,
    ],
  }),
  // code申请
  AuthOperateCodeDocumentManageExpenseCode: new Auth({
    key: 'AuthOperateCodeDocumentManageExpenseCode',
    title: 'code申请',
    description: 'code申请',
    modules: [
      // code申请
      Modules.OperateCodeDocumentManageExpenseCode,
    ],
  }),
  // team申请
  AuthOperateCodeDocumentManageExpenseTeam: new Auth({
    key: 'AuthOperateCodeDocumentManageExpenseTeam',
    title: 'team申请',
    description: 'team申请',
    modules: [
      // team申请
      Modules.OperateCodeDocumentManageExpenseTeam,
    ],
  }),

  // 事务审批管理
  AuthModuleCodeManageOAOrder: new Auth({
    key: 'AuthModuleCodeManageOAOrder',
    title: '事务审批管理',
    description: '事务审批管理',
    modules: [
      // 事务审批管理
      Modules.ModuleCodeManageOAOrder,
    ],
  }),
  // 费用审批管理
  AuthModuleCodePayOrder: new Auth({
    key: 'AuthModuleCodePayOrder',
    title: '费用审批管理',
    description: '费用审批管理',
    modules: [
      // 费用审批管理
      Modules.ModuleCodePayOrder,
      // 编辑审批单
      Modules.ModuleCodeOrderUpdate,
    ],
  }),

  // 审批流详情
  AuthModuleCodeFlowDetail: new Auth({
    key: 'AuthModuleCodeFlowDetail',
    title: '审批流详情',
    description: '审批流查看（操作）及详情页（页面）的权限',
    modules: [
      // 审批流详情
      Modules.ModuleCodeFlowDetail,
    ],
  }),

  // 审批流编辑页及操作
  AuthModuleCodeFlowOption: new Auth({
    key: 'AuthModuleCodeFlowOption',
    title: '审批流编辑页及操作',
    description: '审批流编辑页（页面）及新增、编辑、启用、停用、删除（操作）的权限',
    modules: [
      // 审批流编辑页
      Modules.ModuleCodeFlowForm,
      // 审批流操作
      Modules.OperateCodeFlowCreate,
    ],
  }),

  // code事项编辑操作
  AuthOperateCodeMatterUpdate: new Auth({
    key: 'AuthOperateCodeMatterUpdate',
    title: '事项编辑',
    description: '事项编辑（操作）的权限',
    modules: [
      // 事项编辑
      Modules.OperateCodeMatterUpdate,
    ],
  }),

  // code事项配置编辑操作
  AuthOperateCodeMatterLinkOp: new Auth({
    key: 'AuthOperateCodeMatterLinkOp',
    title: '事项链接操作',
    description: '事项链接查看/删除/编辑（操作）的权限',
    modules: [
      // 事项链接查看/删除/编辑
      Modules.OperateCodeMatterLinkOp,
    ],
  }),

  // code审批单列表tab（待提报/我提报/我待办/我经手）
  AuthOperateCodeApproveOrderTabOther: new Auth({
    key: 'AuthOperateCodeApproveOrderTabOther',
    title: '审批单列表待提报/我待办/我提报/我经手/抄送我的Tab',
    description: '审批单列表待提报/我待办/我提报/我经手/抄送我的Tab（页面）的权限',
    modules: [
      // code审批单列表tab（待提报/我提报/我待办/我经手）
      Modules.OperateCodeApproveOrderTabOther,
    ],
  }),

  // code审批单列表tab（全部）
  AuthOperateCodeApproveOrderTabAll: new Auth({
    key: 'AuthOperateCodeApproveOrderTabAll',
    title: '审批单列表全部Tab',
    description: '审批单列表全部Tab（页面）的权限',
    modules: [
      // code审批单列表tab（全部）
      Modules.OperateCodeApproveOrderTabAll,
    ],
  }),

  // code审批单操作
  AuthOperateCodeApproveOrderOp: new Auth({
    key: 'AuthOperateCodeApproveOrderOp',
    title: '审批单操作（编辑，删除，撤回，关闭）',
    description: '审批单操作（编辑，删除，撤回，关闭）的权限',
    modules: [
      // code审批单操作
      Modules.OperateCodeApproveOrderOp,
    ],
  }),

  // code审批单审批操作
  AuthModuleCodeOrderDetail: new Auth({
    key: 'AuthModuleCodeOrderDetail',
    title: '审批单详情',
    description: '审批单详情页（页面）及审批单审批操作（通过，驳回，付款，验票等操作）的权限',
    modules: [
      // code审批单审批操作
      Modules.ModuleCodeOrderDetail,
    ],
  }),

  // code记录明细列表
  AuthModuleCodeRecord: new Auth({
    key: 'AuthModuleCodeRecord',
    title: 'code费用记录明细',
    description: 'code费用记录明细列表（页面）的权限',
    modules: [
      // code记录明细列表
      Modules.ModuleCodeRecord,
    ],
  }),

  // code记录明细详情
  AuthModuleCodeRecordDetail: new Auth({
    key: 'AuthModuleCodeRecordDetail',
    title: 'code费用记录明细详情',
    description: 'code费用记录明细详情（页面及操作）的权限',
    modules: [
      // code记录明细详情
      Modules.ModuleCodeRecordDetail,
    ],
  }),

  // code记录明细导出
  AuthOperateCodeRecordExport: new Auth({
    key: 'AuthOperateCodeRecordExport',
    title: 'code费用记录明细导出',
    description: 'code费用记录明细导出（操作）的权限',
    modules: [
      // code记录明细列表
      Modules.OperateCodeRecordExport,
    ],
  }),

  // 摊销管理
  AuthMenuCostAmortization: new Auth({
    key: 'AuthMenuCostAmortization',
    title: '摊销管理',
    description: '摊销管理（模块）的权限',
    modules: [
      // 费用摊销管理
      Modules.MenuCostAmortization,
    ],
  }),

  // 摊销管理 - 摊销确认页
  AuthModuleCostAmortizationConfirm: new Auth({
    key: 'AuthModuleCostAmortizationConfirm',
    title: '摊销确认页面权限',
    description: '摊销确认页（页面）的权限',
    modules: [
      // 摊销确认页
      Modules.ModuleCostAmortizationConfirm,
    ],
  }),

  // 摊销管理 - 摊销确认页 - 摊销操作
  AuthOperateCostAmortizationOption: new Auth({
    key: 'AuthOperateCostAmortizationOption',
    title: '添加数据/批量确认摊销规则/编辑规则/终止按钮权限',
    description: '添加数据/批量确认摊销规则/编辑规则/终止按钮（操作）的权限',
    modules: [
      // 摊销确认页 - 摊销操作
      Modules.OperateCostAmortizationOption,
    ],
  }),

  // 摊销管理 - 摊销确认页 - 摊销详情
  AuthModuleCostAmortizationDetail: new Auth({
    key: 'AuthModuleCostAmortizationDetail',
    title: '查看按钮及摊销详情页面的权限',
    description: '查看按钮（操作）及摊销详情页面（页面）的权限',
    modules: [
      // 摊销确认页 - 摊销详情
      Modules.ModuleCostAmortizationDetail,
    ],
  }),


  // 摊销管理 - 摊销确认页 - 全部数据
  AuthOperateCostAmortizationConfirmAllData: new Auth({
    key: 'AuthOperateCostAmortizationConfirmAllData',
    title: '全部数据',
    description: '全部数据的权限',
    modules: [
      // 摊销确认页 - 全部数据
      Modules.OperateCostAmortizationConfirmAllData,
    ],
  }),

  // 摊销管理 - 台账明细表
  AuthModuleCostAmortizationLedger: new Auth({
    key: 'AuthModuleCostAmortizationLedger',
    title: '台账明细页面权限',
    description: '台账明细页（页面）的权限',
    modules: [
      // 台账明细表
      Modules.ModuleCostAmortizationLedger,
    ],
  }),

  // 摊销管理 - 台账明细 - 全部数据
  AuthOperateCostAmortizationLedgerAllData: new Auth({
    key: 'AuthOperateCostAmortizationLedgerAllData',
    title: '全部数据',
    description: '全部数据的权限',
    modules: [
      // 台账明细 - 全部数据
      Modules.OperateCostAmortizationLedgerAllData,
    ],
  }),

  // 房屋管理
  AuthExpenseManageHouse: new Auth({
    key: 'AuthExpenseManageHouse',
    title: '房屋管理',
    description: '查看房屋管理的权限',
    modules: [
      // 费用管理 / 房屋管理（页面）
      Modules.ModuleExpenseManageHouse,
      // 费用管理 / 房屋信息新增（页面）
      Modules.ModuleExpenseManageHouseCreate,
      // 费用管理 / 房屋信息编辑（页面）
      Modules.ModuleExpenseManageHouseUpdate,
      // 费用管理 / 房屋信息申请（页面）
      Modules.ModuleExpenseManageHouseApply,
      // 费用管理 / 房屋信息查看（页面）
      Modules.ModuleExpenseManageHouseDetail,
      // 费用管理 / 房屋管理 / 续租信息编辑（页面）
      Modules.ModuleExpenseManageHouseRenewalUpdate,
      // 费用管理 / 房屋管理 / 断租信息编辑（页面）
      Modules.ModuleExpenseManageHouseBrokRentUpdate,
      // 费用管理 / 房屋管理 / 退租信息编辑（页面）
      Modules.ModuleExpenseManageHouseWithbrawalUpdate,
    ],
  }),

  // 房屋台账导出
  AuthExpenseManageHouseLedgerExport: new Auth({
    key: 'AuthExpenseManageHouseLedgerExport',
    title: '房屋台账导出',
    description: '房屋台账导出的权限',
    modules: [
      // 房屋台账带出（操作）
      Modules.OperateExpenseManageHouseLedgerExport,
    ],
  }),

  // 借还款管理
  // AuthExpenseBorrowingRepayments: new Auth({
  //   key: 'AuthExpenseBorrowingRepayments',
  //   title: '借还款管理',
  //   description: '借还款管理的权限',
  //   modules: [
  //     // 费用管理 / 借还款管理（二级菜单）
  //     Modules.MenuExpenseBorrowingRepayments,
  //   ],
  // }),

  // 借款管理
  AuthExpenseBorrowing: new Auth({
    key: 'AuthExpenseBorrowing',
    title: '还款管理icon的权限',
    description: '还款管理icon的权限',
    modules: [
      // 费用管理 / 借还款管理 / 还款管理
      Modules.ModuleExpenseBorrowing,
    ],
  }),

  // 借款单详情
  AuthExpenseBorrowingDetail: new Auth({
    key: 'AuthExpenseBorrowingDetail',
    title: '借款单详情',
    description: '查看借款单详情(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 借款管理 (页面) / 借款单详情 (页面)
      Modules.ModuleExpenseBorrowingDetail,
      // 费用管理 / 借还款管理 / 借款管理 (页面) / 查看借款单详情页面的权限（操作）
      Modules.OperateExpenseBorrowOrderDetail,
    ],
  }),

  // 创建借款申请单
  AuthExpenseBorrowingCreate: new Auth({
    key: 'AuthExpenseBorrowingCreate',
    title: '创建借款申请单',
    description: '创建借款申请单(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 借款管理 (页面) / 创建借款申请单 (页面)
      Modules.ModuleExpenseBorrowingCreate,
    ],
  }),

  // 编辑借款申请单
  AuthExpenseBorrowingUpdate: new Auth({
    key: 'AuthExpenseBorrowingUpdate',
    title: '编辑借款申请单',
    description: '编辑借款申请单(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 借款管理 (页面) / 编辑借款申请单 (页面)
      Modules.ModuleExpenseBorrowingUpdate,
    ],
  }),

  // 还款管理我的(页面)的权限
  AuthExpenseBorrowingListMy: new Auth({
    key: 'AuthExpenseBorrowingListMy',
    title: '还款管理我的(页面)的权限',
    description: '还款管理我的(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 还款管理我的 (操作)
      Modules.OperateExpenseBorrowOrderMy,
    ],
  }),
  // 还款管理全部(页面)的权限
  AuthExpenseBorrowingListAll: new Auth({
    key: 'AuthExpenseBorrowingListAll',
    title: '还款管理全部(页面)的权限',
    description: '还款管理全部(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 还款管理全部 (操作)
      Modules.OperateExpenseBorrowOrderAll,
    ],
  }),

  // 还款管理
  // AuthExpenseRepayments: new Auth({
  //   key: 'AuthExpenseRepayments',
  //   title: '还款管理',
  //   description: '还款管理的权限',
  //   modules: [
  //     // 费用管理 / 借还款管理 / 还款管理 (页面)
  //     Modules.ModuleExpenseRepayments,
  //   ],
  // }),

  // 还款单详情
  AuthExpenseRepaymentsDetail: new Auth({
    key: 'AuthExpenseRepaymentsDetail',
    title: '还款单详情',
    description: '还款单详情的权限',
    modules: [
      // 费用管理 / 借还款管理 / 还款款管理 (页面) / 还款单详情 (页面)
      Modules.ModuleExpenseRepaymentsDetail,
      // 费用管理 / 借还款管理 / 还款管理 (页面) / 还款单详情查看 (操作)
      Modules.OperateExpenseRepaymentOrderDetail,
    ],
  }),

  // 还款单列表全部操作
  // AuthExpenseRepaymentsListAll: new Auth({
  //   key: 'AuthExpenseRepaymentsListAll',
  //   title: '还款单列表全部操作',
  //   description: '还款单列表全部 (操作)权限',
  //   modules: [
  //     // 费用管理 / 借还款管理 / 还款款列表全部 (操作)
  //     Modules.OperateExpenseRepaymentOrderAll,
  //   ],
  // }),

  // 还款单列表我的操作
  // AuthExpenseRepaymentsListMy: new Auth({
  //   key: 'AuthExpenseRepaymentsListMy',
  //   title: '还款单列表我的操作',
  //   description: '还款单列表我的 (操作)权限',
  //   modules: [
  //     // 费用管理 / 借还款管理 / 还款款列表全部 (操作)
  //     Modules.OperateExpenseRepaymentOrderMy,
  //   ],
  // }),

  // 创建还款申请单
  AuthExpenseRepaymentsCreate: new Auth({
    key: 'AuthExpenseRepaymentsCreate',
    title: '创建还款申请单',
    description: '创建还款申请单(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 还款款管理 (页面) / 创建还款申请单 (页面)
      Modules.ModuleExpenseRepaymentsCreate,
      // 费用管理 / 借还款管理 / 还款款管理 (页面) / 创建还款申请单 (操作)
      Modules.OperateExpenseRepaymentOrderCreate,
    ],
  }),

  // 编辑还款申请单
  AuthExpenseRepaymentsUpdate: new Auth({
    key: 'AuthExpenseRepaymentsUpdate',
    title: '编辑还款申请单',
    description: '编辑还款申请单(页面)的权限',
    modules: [
      // 费用管理 / 借还款管理 / 还款款管理 (页面) / 编辑还款申请单 (页面)
      Modules.ModuleExpenseRepaymentsUpdate,
    ],
  }),

  // 出差管理
  // AuthExpenseTravelApplication: new Auth({
  //   key: 'AuthExpenseTravelApplication',
  //   title: '出差管理',
  //   description: '',
  //   modules: [
  //     // 出差管理
  //     Modules.ModuleExpenseTravelApplication,
  //   ],
  // }),

  // 出差申请单详情
  AuthExpenseTravelApplicationDetail: new Auth({
    key: 'AuthExpenseTravelApplicationDetail',
    title: '出差申请单详情',
    description: '查看出差申请单详情',
    modules: [
      // 出差申请单详情（页面）
      Modules.ModuleExpenseTravelApplicationDetail,
      // 差旅报销中点击可查看出差审批单（页面）权限
      Modules.OperateExpenseTravelApplicationDetail,
    ],
  }),

  // 出差列表全部操作
  // AuthExpenseTravelApplicationListAll: new Auth({
  //   key: 'AuthExpenseTravelApplicationListAll',
  //   title: '出差列表全部操作',
  //   description: '出差列表全部 (操作)权限',
  //   modules: [
  //     // 费用管理 / 出差管理列表全部 (操作)
  //     Modules.OperateExpenseTravelApplicationAll,
  //   ],
  // }),

  // 出差列表我的操作
  // AuthExpenseTravelApplicationListMy: new Auth({
  //   key: 'AuthExpenseTravelApplicationListMy',
  //   title: '出差列表我的操作',
  //   description: '出差列表我的 (操作)权限',
  //   modules: [
  //     // 费用管理 / 出差管理列表全部 (操作)
  //     Modules.OperateExpenseTravelApplicationMy,
  //   ],
  // }),

  // 审批监控
  AuthExpenseStatistics: new Auth({
    key: 'AuthExpenseStatistics',
    title: '审批监控',
    description: '审批监控的权限',
    modules: [
      // 审批监控
      Modules.ModuleExpenseStatistics,
    ],
  }),

  // 审批流统计详情
  AuthExpenseStatisticsDetail: new Auth({
    key: 'AuthExpenseStatisticsDetail',
    title: '审批流统计详情',
    description: '审批流统计详情的权限',
    modules: [
      // 审批流统计详情
      Modules.ModuleExpenseStatisticsDetail,
      // 审批流统计详情
      Modules.OperateExpenseStatisticsDetail,
    ],
  }),

  // 服务费结算
  AuthFinance: new Auth({
    key: 'AuthFinance',
    title: '服务费结算',
    description: '',
    modules: [
      // 服务费结算（菜单）
      Modules.MenuFinance,
    ],
  }),

  // 基础设置
  AuthFinanceConfig: new Auth({
    key: 'AuthFinanceConfig',
    title: '基础设置',
    description: '基础指标查看编辑权限',
    modules: [
      // 服务费结算 / 基础设置（菜单）
      Modules.MenuFinanceConfig,
    ],
  }),

  // 结算指标设置
  AuthFinanceConfigIndex: new Auth({
    key: 'AuthFinanceConfigIndex',
    title: '结算指标设置',
    description: '查看骑士标签和骑士信息的操作',
    modules: [
      // 服务费结算 / 基础设置 / 结算指标设置（页面）
      Modules.ModuleFinanceConfigIndex,
    ],
  }),

  // 查看服务费方案
  AuthFinancePlan: new Auth({
    key: 'AuthFinancePlan',
    title: '查看服务费方案',
    description: '服务费方案查看权限',
    modules: [
      // 服务费结算 / 服务费方案（页面）
      Modules.ModuleFinancePlan,
      // 服务费结算 / 服务费方案（页面）
      Modules.ModuleFinanceRules,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费规则审批历史（页面）
      Modules.ModuleFinanceRulesHistory,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费试算（页面）
      Modules.ModuleFinanceRulesCalculate,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费试算 / 服务费试算详情（页面）
      Modules.ModuleFinanceRulesCalculateDetail,
    ],
  }),

  // 服务费方案操作
  AuthFinancePlanManage: new Auth({
    key: 'AuthFinancePlanManage',
    title: '服务费方案操作',
    description: '创建服务费方案-提交审批流的全部操作',
    modules: [
      // 服务费结算 / 服务费方案 / 服务费方案创建（操作）
      Modules.OperateFinancePlanCreate,
      // 服务费结算 / 服务费方案 / 服务费方案试算服务费开始试算（操作）
      Modules.OperateFinancePlanTrial,
      // 服务费结算 / 服务费方案 / 服务费方案试算服务费提交审核（操作）
      Modules.OperateFinancePlanonSubmit,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费方案规则集创建（操作）
      Modules.OperateFinancePlanRulesCreate,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费方案规则集编辑（操作）
      Modules.OperateFinancePlanRulesUpdate,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费方案规则互斥互补操作（操作）
      Modules.OperateFinancePlanRulesMutualExclusion,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费方案版本删除（操作）
      Modules.OperateFinancePlanVersionDelete,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费方案版本取消生效（操作）
      Modules.OperateFinancePlanVersionToDraft,
      // 服务费结算 / 服务费方案 / 服务费规则 / 调薪（操作）
      Modules.OperateFinancePlanVersionCreateDraft,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费规则生成 / 服务费方案规则编辑、保存、删除（操作）
      Modules.OperateFinancePlanRuleUpdate,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费规则生成 / 服务费方案规则上移、下移（操作）
      Modules.OperateFinancePlanRuleMove,
      // 服务费结算 / 服务费方案 / 服务费规则 / 服务费规则生成（页面）
      Modules.ModuleFinanceRulesGenerator,
    ],
  }),

  // 试算结果导出
  AuthFinancePlanCalculateExport: new Auth({
    key: 'AuthFinancePlanCalculateExport',
    title: '试算结果导出',
    description: '试算结果导出',
    modules: [
      // 服务费结算 / 服务费方案 / 服务费方案试算服务费导出数据（操作）
      Modules.OperateFinancePlanExportData,
    ],
  }),

  // 结算管理
  AuthFinanceManage: new Auth({
    key: 'AuthFinanceManage',
    title: '结算管理',
    description: '查看（结算汇总）页面、查看城市结算明细页面、查看骑士结算明细页面的权限',
    modules: [
      // 服务费结算 / 结算管理（菜单）
      Modules.MenuFinanceManage,
    ],
  }),

  // 结算任务设置
  AuthFinanceManageTask: new Auth({
    key: 'AuthFinanceManageTask',
    title: '结算任务设置',
    description: '查看（结算汇总）页面、查看城市结算明细页面、查看骑士结算明细页面的权限',
    modules: [
      // 服务费结算 / 结算管理 / 结算任务设置（页面）
      Modules.ModuleFinanceManageTask,
    ],
  }),

  // 结算任务操作
  AuthFinanceManageTaskManage: new Auth({
    key: 'AuthFinanceManageTaskManage',
    title: '结算任务操作',
    description: '查看（结算汇总）页面、查看城市结算明细页面、查看骑士结算明细页面的权限',
    modules: [
      // 服务费结算 / 结算管理 / 结算任务设置 / 创建结算计划（操作）
      Modules.OperateFinanceManageTaskCreate,
      // 服务费结算 / 结算管理 / 结算任务设置 / 结算任务启用（操作）
      Modules.OperateFinanceManageTaskEnable,
      // 服务费结算 / 结算管理 / 结算任务设置 / 结算任务禁用（操作）
      Modules.OperateFinanceManageTaskDisable,
    ],
  }),

  // 结算单汇总
  AuthFinanceSummary: new Auth({
    key: 'AuthFinanceSummary',
    title: '结算单汇总',
    description: '查看（结算汇总）页面、查看城市结算明细页面、查看骑士结算明细页面的权限',
    modules: [
      // 服务费结算 / 结算管理 / 结算单汇总（页面）
      Modules.ModuleFinanceManageSummary,
      // 服务费结算 / 结算管理 / 结算单汇总 / 城市结算明细（页面）
      Modules.ModuleFinanceManageSummaryDetailCity,
      // 服务费结算 / 结算管理 / 结算单汇总 / 城市结算明细 / 骑士结算明细（页面)
      Modules.ModuleFinanceManageSummaryDetailKnight,
    ],
  }),

  // 提交审核
  AuthFinanceSearchSummarySubmit: new Auth({
    key: 'AuthFinanceSearchSummarySubmit',
    title: '提交审核',
    description: '提交结算单的权限',
    modules: [
      // 服务费结算 / 结算汇总 / 提交结算单审核（操作）
      Modules.OperateFinanceManageSummarySubmit,
    ],
  }),

  // 标记/撤销缓发
  AuthFinanceSearchRecordsDelay: new Auth({
    key: 'AuthFinanceSearchRecordsDelay',
    title: '标记/撤销缓发',
    description: '标记缓发结算单的权限',
    modules: [
      // 服务费结算 / 结算汇总 / 城市结算明细 / 批量缓发按钮（操作)
      Modules.OperateFinanceManageSummaryDelay,
    ],
  }),

  // 下载结算单
  AuthFinanceDistributeDownload: new Auth({
    key: 'AuthFinanceDistributeDownload',
    title: '下载结算单',
    description: '下载结算单的权限',
    modules: [
      // 服务费结算 / 服务费发放 / 下载结算单（操作）
      Modules.OperateFinanceManageSummaryDownload,
    ],
  }),

  // 服务费计算上传下载
  AuthFinanceSummaryDistribute: new Auth({
    key: 'AuthFinanceSummaryDistribute',
    title: '服务费计算/下载/上传',
    description: '服务费计算/下载/上传',
    modules: [
      // 服务费结算 / 服务费发放 / 下载结算单模版（操作）
      Modules.OperateFinanceManageSummaryModalDownload,
      // 服务费结算 / 服务费发放 / 上传服务费表格（操作）
      Modules.OperateFinanceManageSummaryUpload,
    ],
  }),

  // 运营补扣款上传下载
  AuthFinanceSummaryOperating: new Auth({
    key: 'AuthFinanceSummaryOperating',
    title: '运营补扣款/下载/上传',
    description: '运营补扣款/下载/上传',
    modules: [
      // 服务费结算 / 服务费发放 / 下载运营补扣款模版（操作）
      Modules.OperateFinanceManageOperatingModalDownload,
      // 服务费结算 / 服务费发放 / 上传运营补扣款表格（操作）
      Modules.OperateFinanceManageOperatingUpload,
    ],
  }),

  // 私教管理
  AuthTeamTeacher: new Auth({
    key: 'AuthTeamTeacher',
    title: '私教资产隶属管理',
    description: '查看私教资产隶属管理模块的权限',
    modules: [
      // 私教管理（菜单）
      Modules.MenuTeamTeacher,
    ],
  }),
  // 私教管理记录
  AuthTeamTeacherManageLog: new Auth({
    key: 'AuthTeamTeacherManageLog',
    title: '私教管理记录',
    description: '查看私教管理记录的权限',
    modules: [
      Modules.ModuleTeamTeacherManageLog,
    ],
  }),
  // 私教管理记录中更换私教管理
  AuthTeamTeacherManageChange: new Auth({
    key: 'AuthTeamTeacherManageChange',
    title: '更换私教管理',
    description: '私教管理记录中更换私教管理按钮的权限',
    modules: [
      Modules.OperateTeamTeacherManageChange,
    ],
  }),

  // 私教团队管理
  AuthTeamTeacherManage: new Auth({
    key: 'AuthTeamTeacherManage',
    title: '私教团队管理',
    description: '查看私教团队管理与编辑页面的权限',
    modules: [
      // 私教团队管理（页面）
      Modules.ModuleTeamTeacherManage,
    ],
  }),
  // 私教团队管理 - 编辑
  AuthTeamTeacherManageOwnerTeam: new Auth({
    key: 'AuthTeamTeacherManageOwnerTeam',
    title: '编辑',
    description: '查看私教团队管理（按钮）与编辑页面的权限',
    modules: [
      // 私教团队管理编辑（页面）
      Modules.ModuleTeamTeacherManageOwnerTeam,
      // 私教团队管理编辑（按钮）
      Modules.OperateTeamTeacherManageOwnerTeam,
    ],
  }),

  // 关联业主、变更业主、终止关联业主、取消变更(按钮)
  AuthTeamTeacherManageOwnerOperation: new Auth({
    key: 'AuthTeamTeacherManageOwnerOperation',
    title: '关联、变更、终止、取消',
    description: '关联业主、变更业主、终止关联业主、取消变更(按钮)',
    modules: [
      // 关联业主(按钮)
      Modules.OperateTeamTeacherManageOwnerCreate,
      // 变更业主按钮
      Modules.OperateTeamTeacherManageOwnerChange,
      // 终止关联业主按钮
      Modules.OperateTeamTeacherManageOwnerStop,
      // 取消变更按钮
      Modules.OperateTeamTeacherManageChangeCancel,
    ],
  }),
  // // 变更业主按钮
  // AuthTeamTeacherManageOwnerChange: new Auth({
  //   key: 'AuthTeamTeacherManageOwnerChange',
  //   title: '变更业主(按钮)',
  //   description: '私教团队管理-变更业主按钮',
  //   modules: [
  //
  //   ],
  // }),
  // // 终止关联业主按钮
  // AuthTeamTeacherManageOwnerStop: new Auth({
  //   key: 'AuthTeamTeacherManageOwnerStop',
  //   title: '终止关联业主(按钮)',
  //   description: '私教团队管理-终止关联业主按钮',
  //   modules: [
  //
  //   ],
  // }),
  // // 取消变更按钮
  // AuthTeamTeacherManageChangeCancel: new Auth({
  //   key: 'AuthTeamTeacherManageChangeCancel',
  //   title: '取消变更(按钮)',
  //   description: '私教团队管理-取消变更按钮',
  //   modules: [
  //
  //   ],
  // }),

  // 私教运营管理
  AuthTeamTeacherManageOperations: new Auth({
    key: 'AuthTeamTeacherManageOperations',
    title: '私教运营管理',
    description: '查看私教运营管理页面权限与修改按钮权限',
    modules: [
      // 私教运营管理（页面）
      Modules.ModuleTeamTeacherManageOperations,
    ],
  }),
  // 私教运营管理 - 批量操作页面
  AuthTeamTeacherManageOperationsEdit: new Auth({
    key: 'AuthTeamTeacherManageOperationsEdit',
    title: '编辑',
    description: '查看私教运营管理批量编辑页面的权限与批量操作按钮权限',
    modules: [
      // 私教运营管理批量编辑（页面）
      Modules.ModuleTeamTeacherManageOperationsUpdate,
      // 批量操作（按钮）
      Modules.OperateTeamTeacherManageOperationsBatchEdit,
      // 私教运营修改（按钮）
      Modules.OperateTeamTeacherManageOperationsEdit,
    ],
  }),

  // 无私教业主团队监控
  AuthTeamTeacherMonitoring: new Auth({
    key: 'AuthTeamTeacherMonitoring',
    title: '无私教业主团队监控',
    description: '查看无私教业主团队监控权限',
    modules: [
      // 无私教业主团队监控
      Modules.ModuleTeamTeacherMonitoring,
    ],
  }),

  // 我的账户
  AuthAccount: new Auth({
    key: 'AuthAccount',
    title: '我的账户',
    description: '',
    modules: [
      // 我的账户（菜单）（页面）
      Modules.MenuAccount,
    ],
  }),

  // 我的账户
  AuthAccountDetail: new Auth({
    key: 'AuthAccountDetail',
    title: '我的账户',
    description: '查看、操作（我的账户）页面的权限',
    modules: [
      // 我的账户 / 我的账户（页面）
      Modules.ModuleAccount,
    ],
  }),

  // 资产管理
  AuthAssectsAdministration: new Auth({
    key: 'AuthAssectsAdministration',
    title: '资产管理',
    description: '',
    modules: [
      // 资产管理（菜单）
      Modules.MenuAssectsAdministration,
    ],
  }),

  // 商圈管理
  AuthAssectsAdministrationManage: new Auth({
    key: 'AuthAssectsAdministrationManage',
    title: '商圈管理',
    description: '查看(商圈管理)页面的权限',
    modules: [
      // 系统管理 / 商圈管理（页面）
      Modules.ModuleAssectsAdministrationManage,
    ],
  }),

  // 编辑、添加
  AuthAssectsAdministrationUpdate: new Auth({
    key: 'AuthAssectsAdministrationUpdate',
    title: '新建、详情',
    description: '新建、详情(查看和修改)商圈的权限',
    modules: [
      // 系统管理 / 商圈管理 / 添加商圈（页面）
      Modules.ModuleAssectsAdministrationCreate,
      // 系统管理 / 商圈管理 / 添加商圈按钮 (操作)
      Modules.OperateAssectsAdministrationCreate,
      // 系统管理 / 商圈管理 / 查看详情（页面）
      Modules.ModuleAssectsAdministrationDetail,
    ],
  }),

  // 商圈标签管理
  AuthAssectsAdministrationTag: new Auth({
    key: 'AuthAssectsAdministrationTag',
    title: '商圈标签管理',
    description: '查看(商圈标签管理)页面的权限',
    modules: [
      // 系统管理 / 商圈标签管理（页面）
      Modules.ModuleAssectsAdministrationTagManage,
    ],
  }),

  // 新增、编辑、停用标签
  AuthSystemTagOperate: new Auth({
    key: 'AuthSystemTagOperate',
    title: '新增、编辑、停用标签',
    description: '新增、编辑、停用标签的权限',
    modules: [
      // 系统管理 / 商圈标签管理 / 新增标签（操作）
      Modules.OperateAssectsAdministrationTagCreate,
      // 系统管理 / 商圈标签管理 / 编辑标签 (操作)
      Modules.OperateAssectsAdministrationTagUpdate,
      // 系统管理 / 商圈标签管理 / 停用标签（页面）
      Modules.OperateAssectsAdministrationTagDelete,
    ],
  }),

  // 批量设置、批量移除标签
  AuthAssectsAdministrationTagOperate: new Auth({
    key: 'AuthAssectsAdministrationTagOperate',
    title: '设置标签',
    description: '设置标签的权限',
    modules: [
      // 系统管理 / 商圈管理 / 设置标签（操作）
      Modules.OperateAssectsAdministrationTagSet,
    ],
  }),

  // MenuAssectsAdministration
  // 批量设置、批量移除标签
  AuthAssectsAdministrationTagBatchOperate: new Auth({
    key: 'AuthAssectsAdministrationTagBatchOperate',
    title: '批量设置、批量移除商圈下标签',
    description: '批量设置、批量移除商圈下标签的权限',
    modules: [
      // 系统管理 / 商圈管理 / 批量设置标签 (操作)
      Modules.OperateAssectsAdministrationTagBatchSet,
      // 系统管理 / 商圈管理 / 批量移除标签（页面）
      Modules.OperateAssectsAdministrationTagBatchDelete,
    ],
  }),

  AuthAssetsChangeLog: new Auth({
    key: 'AuthAssetsChangeLog',
    title: '商圈变更记录',
    description: '商圈变更记录页面与按钮的权限',
    modules: [
      // 商圈变更记录页面
      Modules.ModuleAssetsChangeLog,
      // 商圈变更记录按钮
      Modules.OperateAssetsChangeLog,
    ],
  }),

  // 系统管理
  AuthSystem: new Auth({
    key: 'AuthSystem',
    title: '系统管理',
    description: '',
    modules: [
      // 系统管理（菜单）（页面）
      Modules.MenuSystem,
    ],
  }),
  // 组织架构配置
  AuthSystemApproalConfig: new Auth({
    key: 'AuthSystemApproalConfig',
    title: '组织架构配置',
    description: '查看（审批配置）页面的权限',
    modules: [
      // 组织架构配置
      Modules.ModuleSystemApproalConfig,
    ],
  }),

  // 账号管理
  AuthSystemAccountManage: new Auth({
    key: 'AuthSystemAccountManage',
    title: '账号管理',
    description: '查看、操作（账号管理）的权限',
    modules: [
      // 系统管理 / 账号管理（页面）
      Modules.ModuleSystemAccountManage,
    ],
  }),

  // 添加人员用户
  AuthSystemAccountCreate: new Auth({
    key: 'AuthSystemAccountCreate',
    title: '添加人员用户',
    description: '创建 操作 (账号管理) 页面人员用户权限',
    modules: [
      // 系统管理 / 账号管理 / 添加账号(页面)
      Modules.ModuleSystemAccountManageCreate,
      // 系统管理 / 账号管理 / 添加账号，人员信息确认（操作）
      Modules.OperateSystemAccountManageVerifyEmployee,
    ],
  }),

  // 编辑人员用户
  AuthSystemAccountUpdate: new Auth({
    key: 'AuthSystemAccountUpdate',
    title: '编辑人员用户',
    description: '编辑 操作 (账号管理) 页面人员用户权限',
    modules: [
      // 系统管理 / 账号管理 / 编辑用户(页面)
      Modules.ModuleSystemAccountManageUpdate,
      // 系统管理 / 账号管理 / 编辑用户（操作）
      Modules.OperateSystemAccountManageUpdate,
    ],
  }),

  // 用户详情页
  AuthSystemAccountDatails: new Auth({
    key: 'AuthSystemAccountDatails',
    title: '人员用户详情',
    description: '查看 操作 (账号管理) 页面人员用户权限',
    modules: [
      // 系统管理 / 账号管理 / 用户详情 (页面)
      Modules.ModuleSystemAccountManageDetails,
      // 系统管理 / 账号管理 / 详情按钮（操作）
      Modules.OperateSystemAccountManageDatails,
    ],
  }),

  // 关联账号
  AuthSystemAccountReleated: new Auth({
    key: 'AuthSystemAccountReleated',
    title: '关联账号',
    description: '查看（关联账号）页面的权限',
    modules: [
      // 系统管理 / 关联账号（页面）
      Modules.ModuleSystemAccountReleated,
    ],
  }),

  // 添加、编辑、全部解除
  AuthSystemAccountReleatedUpdate: new Auth({
    key: 'AuthSystemAccountReleatedUpdate',
    title: '添加、编辑、全部解除',
    description: '添加、编辑、解除关联账号的权限',
    modules: [
      // 系统管理 / 关联账号 / 添加、编辑、全部解除关联账号（操作）
      Modules.OperateSystemAccountReleatedUpdate,
    ],
  }),

  // 供应商管理
  AuthSystemSupplierManage: new Auth({
    key: 'AuthSystemSupplierManage',
    title: '供应商管理',
    description: '查看（供应商管理）页面及查看供应商详情页的权限',
    modules: [
      // 系统管理 / 供应商管理（页面）
      Modules.ModuleSystemSupplierManage,
      // 系统管理 / 供应商管理 / 查看详情（页面）
      Modules.ModuleSystemSupplierDetail,
    ],
  }),

  // 编辑、添加
  AuthSystemSupplierUpdate: new Auth({
    key: 'AuthSystemSupplierUpdate',
    title: '新建、编辑',
    description: '新建、编辑供应商的权限',
    modules: [
      // 系统管理 / 供应商管理 / 添加供应商（页面）
      Modules.ModuleSystemSupplierCreate,
      // 系统管理 / 供应商管理 / 编辑供应商（页面）
      Modules.ModuleSystemSupplierUpdate,
      // 系统管理 / 供应商管理 / 新建、编辑（操作）
      Modules.OperateSystemSupplierUpdate,
    ],
  }),

  // 启用、停用
  AuthSystemSupplierUpdateState: new Auth({
    key: 'AuthSystemSupplierUpdateState',
    title: '启用、停用',
    description: '启用、停用供应商的权限',
    modules: [
      // 系统管理 / 供应商管理 / 启用、停用（操作）
      Modules.OperateSystemSupplierUpdateState,
    ],
  }),

  // 业务分布情况（城市）
  AuthSystemSupplierScopeCity: new Auth({
    key: 'AuthSystemSupplierScopeCity',
    title: '业务分布情况（城市）',
    description: '查看城市级业务分布情况的权限',
    modules: [
      // 系统管理 / 供应商管理 / 业务分布情况（城市）（页面）
      Modules.ModuleSystemSupplierScopeCity,
    ],
  }),

  // 城市管理
  AuthSystemCity: new Auth({
    key: 'AuthSystemCity',
    title: '城市管理',
    description: '查看(城市管理)列表页面的权限及查看城市管理详情页面的权限',
    modules: [
      // 系统管理 / 查看城市列表(页面)
      Modules.ModuleSystemCity,
      // 系统管理 / 查看城市详情(页面)
      Modules.ModuleSystemCityDetail,
    ],
  }),

  // 编辑
  AuthSystemCityUpdate: new Auth({
    key: 'AuthSystemCityUpdate',
    title: '编辑',
    description: '编辑城市信息的权限',
    modules: [
      // 系统管理 / 城市编辑(页面)
      Modules.ModuleSystemCityUpdate,
      // 系统管理 / 编辑城市按钮(权限)
      Modules.OperateSystemCityUpdate,
    ],
  }),

  // 合同模版管理
  AuthSystemContractTemplate: new Auth({
    key: 'AuthSystemContractTemplate',
    title: '合同模版管理',
    description: '查看(合同模版管理)列表页面的权限',
    modules: [
      // 系统管理 / 合同模版管理(页面)
      Modules.ModuleSystemContractTemplate,
    ],
  }),

  // 合同模版管理 - 组件详情
  AuthSystemContractTemplateComponentDetail: new Auth({
    key: 'AuthSystemContractTemplateComponentDetail',
    title: '组件详情',
    description: '查看(组件详情)页面的权限',
    modules: [
      // 系统管理 / 组件详情(页面)
      Modules.ModuleSystemContractTemplateComponentDetail,
    ],
  }),

  // 合同归属管理
  AuthSystemManageCompany: new Auth({
    key: 'AuthSystemManageCompany',
    title: '合同归属管理',
    description: '查看（合同归属管理）的权限',
    modules: [
      // 系统管理 / 合同归属管理（页面）
      Modules.ModuleSystemManageCompany,
    ],
  }),

  // 添加、编辑、禁用
  AuthSystemCompanyUpdate: new Auth({
    key: 'AuthSystemCompanyUpdate',
    title: '添加、编辑、禁用、详情',
    description: '添加、编辑、禁用、详情合同归属的权限',
    modules: [
      // 系统管理 / 合同归属管理 / 编辑/禁用按钮（操作）
      Modules.OperateSystemManageCompanyUpdate,
      // 系统管理 / 合同归属管理 / 添加公司按钮（操作）
      Modules.OperateSystemManageCompanyCreate,
      // 系统管理 / 合同归属管理 / 详情（操作）
      Modules.OperateSystemManageCompanyDetail,
      // 系统管理 / 合同归属管理 / 详情（页面）
      Modules.ModuleSystemManageCompanyDetail,
      // 系统管理 / 合同归属管理 / 编辑（页面）
      Modules.ModuleSystemManageCompanyUpdate,
    ],
  }),

  // 推荐公司管理
  AuthSystemRecommededCompany: new Auth({
    key: 'AuthSystemRecommededCompany',
    title: '推荐公司管理',
    description: '查看骑士的推荐公司，查看推荐公司和供应商之间的关系',
    modules: [
      // 推荐公司管理页面
      Modules.ModuleSystemRecommendedCompany,
      // 推荐公司管理详情按钮
      Modules.OperateSystemRecommendedCompanyDetail,
      // 推荐公司管理详情页面
      Modules.ModuleSystemRecommendedCompanyDetail,
    ],
  }),

  // 推荐公司编辑、新建、停用、启用
  AuthSystemRecommededCompanyUpdate: new Auth({
    key: 'AuthSystemRecommededCompanyUpdate',
    title: '编辑、新建、停用、启用',
    description: '推荐公司的新增、编辑、停用、启用；推荐公司和供应商关系的新建、停用、启用、删除',
    modules: [
      // 推荐公司管理页面
      Modules.OperateSystemRecommededCompanyUpdate,
    ],
  }),

  // 白名单列表
  AuthWhiteList: new Auth({
    key: 'AuthWhiteList',
    title: '白名单列表',
    description: '白名单列表',
    modules: [
      Modules.ModuleWhiteList,
    ],
  }),

  // 白名单新增页面和新增按钮
  AuthWhiteListCreate: new Auth({
    key: 'AuthWhiteListCreate',
    title: '白名单新增',
    description: '白名单新增',
    modules: [
      Modules.OperateWhiteListCreate,
      Modules.ModuleWhiteListCreate,
    ],
  }),

  // 白名单详情页面/操作
  AuthWhiteListDetail: new Auth({
    key: 'AuthWhiteListDetail',
    title: '白名单详情',
    description: '白名单详情',
    modules: [
      Modules.ModuleWhiteListDetail,
      Modules.OperateWhiteListDetail,
    ],
  }),

  // 白名单编辑页面/操作
  AuthWhiteListUpdate: new Auth({
    key: 'AuthWhiteListUpdate',
    title: '白名单编辑',
    description: '白名单编辑',
    modules: [
      Modules.ModuleWhiteListUpdate,
      Modules.OperateWhiteListUpdate,
    ],
  }),

  // 白名单关闭操作
  AuthWhiteListDelete: new Auth({
    key: 'AuthWhiteListDelete',
    title: '白名单关闭',
    description: '白名单关闭',
    modules: [
      Modules.OperateWhiteListDelete,
    ],
  }),

  // 服务商配置列表
  AuthSystemMerchants: new Auth({
    key: 'AuthSystemMerchants',
    title: '服务商配置列表',
    description: '服务商配置列表',
    modules: [
      Modules.ModuleSystemMerchants,
    ],
  }),

  // 服务商配置新增页面和新增按钮
  AuthSystemMerchantsCreate: new Auth({
    key: 'AuthSystemMerchantsCreate',
    title: '服务商配置新增',
    description: '服务商配置新增',
    modules: [
      Modules.OperateSystemMerchantsCreate,
      Modules.ModuleSystemMerchantsCreate,
    ],
  }),

  // 服务商配置详情页面/操作
  AuthSystemMerchantsDetail: new Auth({
    key: 'AuthSystemMerchantsDetail',
    title: '服务商配置详情',
    description: '服务商配置详情',
    modules: [
      Modules.ModuleSystemMerchantsDetail,
      Modules.OperateSystemMerchantsDetail,
    ],
  }),

  // 服务商配置编辑页面/操作
  AuthSystemMerchantsUpdate: new Auth({
    key: 'AuthSystemMerchantsUpdate',
    title: '服务商配置编辑',
    description: '服务商配置编辑',
    modules: [
      Modules.ModuleSystemMerchantsUpdate,
      Modules.OperateSystemMerchantsUpdate,
    ],
  }),

  // 业主承揽
  AuthOwnerContract: new Auth({
    key: 'AuthOwnerContract',
    title: '业主承揽',
    description: '查看业主承揽模块的权限',
    modules: [
      // 业主承揽（模块）
      Modules.MenuTeamManager,
    ],
  }),
  // 业主承揽记录页面
  AuthTeamManagerBusiness: new Auth({
    key: 'AuthTeamManagerBusiness',
    title: '业主承揽记录',
    description: '查看业主承揽记录页面的权限',
    modules: [
      // 业主承揽记录（页面）
      Modules.ModuleTeamManagerBusiness,
    ],
  }),

  // 无业主商圈监控
  AuthTeamManagerNothingOwner: new Auth({
    key: 'AuthTeamManagerNothingOwner',
    title: '无业主商圈监控',
    description: '查看无业主商圈监控页面的权限',
    modules: [
      // 无业主商圈监控
      Modules.ModuleTeamManagerNothingOwner,
    ],
  }),

  // 业主团队管理
  AuthOwnerManagement: new Auth({
    key: 'AuthOwnerManagement',
    title: '业主团队管理',
    description: '查看业主团队管理页面的权限',
    modules: [
      // 业主团队管理（页面）
      Modules.ModuleTeamManager,
    ],
  }),

  // 创建业主团队
  AuthTeamManagerCreate: new Auth({
    key: 'AuthTeamManagerCreate',
    title: '创建业主团队',
    description: '创建业主团队（按钮）的权限',
    modules: [
      // 创建业主团队（操作）
      Modules.OperateTeamManagerCreate,
    ],
  }),

  // 编辑业主
  AuthTeamManagerUpdate: new Auth({
    key: 'AuthTeamManagerUpdate',
    title: '编辑业主',
    description: '编辑业主（页面、操作）的权限',
    modules: [
      // 编辑业主（页面）
      Modules.ModuleTeamManagerUpdate,
      // 编辑业主（操作）
      Modules.OperateTeamManagerUpdate,
    ],
  }),

  // 查看业主
  AuthTeamManagerDetail: new Auth({
    key: 'AuthTeamManagerDetail',
    title: '查看业主',
    description: '查看业主（页面、操作）的权限',
    modules: [
      // 查看业主（页面）
      Modules.ModuleTeamManagerDetail,
      // 查看业主（操作）
      Modules.OperateTeamManagerDetail,
    ],
  }),

  // 变更业主
  AuthTeamManagerUpdateOwner: new Auth({
    key: 'AuthTeamManagerUpdateOwner',
    title: '变更业主',
    description: '变更业主（页面、操作）的权限',
    modules: [
      // 变更业主（操作）
      Modules.OperateTeamManagerUpdateOwner,
    ],
  }),

  // 解散团队
  AuthTeamManagerDissolution: new Auth({
    key: 'AuthTeamManagerDissolution',
    title: '解散团队',
    description: '解散团队(操作)',
    modules: [
      // 解散团队(操作)
      Modules.OperateTeamManagerDissolution,
    ],
  }),

  // 业主导出
  AuthTeamManagerExport: new Auth({
    key: 'AuthTeamManagerExport',
    title: '导出',
    description: '导出(操作)',
    modules: [
      // 导出与导出无业主商圈（操作）
      Modules.OperateTeamManagerExport,
    ],
  }),
  // 业主导出
  AuthTeamManagerExportNotOwner: new Auth({
    key: 'AuthTeamManagerExportNotOwner',
    title: '导出无业主商圈',
    description: '导出无业主商圈(操作)',
    modules: [
      // 导出与导出无业主商圈（操作）
      Modules.OperateTeamManagerExportNotOwner,
    ],
  }),

  // 企业付款
  AuthEnterprise: new Auth({
    key: 'AuthEnterprise',
    title: '企业付款',
    description: '',
    modules: [
      // 企业付款（菜单）
      Modules.MenuEnterprise,
    ],
  }),

  // 付款单
  AuthEnterprisePayment: new Auth({
    key: 'AuthEnterprisePayment',
    title: '付款单',
    description: '付款单列表页、详情',
    modules: [
      // 付款单（页面）
      Modules.ModuleEnterprisePayment,
      // 详情（页面）
      Modules.ModuleEnterprisePaymentDetail,
    ],
  }),

  // 企业付款单、新增付款单（执行付款）操作
  AuthEnterprisePaymentUpdate: new Auth({
    key: 'AuthEnterprisePaymentUpdate',
    title: '付款单操作信息',
    description: '新增付款单（页面）、新增付款单（执行付款）按钮操作',
    modules: [
      // 新增付款单（执行付款）操作
      Modules.OperateEnterprisePaymentUpdate,
      // 新增付款单（页面）
      Modules.ModuleEnterprisePaymentPaymentOrder,
    ],
  }),

  // 高级权限
  AuthAdvanceSetting: new Auth({
    key: 'AuthAdvanceSetting',
    title: '高级权限',
    modules: [
      Modules.MenuAdvanceSetting,
    ],
  }),

  // 向上跨级管理
  AuthAdvanceSettingHigherLevel: new Auth({
    key: 'AuthAdvanceSettingHigherLevel',
    title: '向上跨级管理',
    description: '管理岗位级别以上所有岗位范围的业务及用户人员',
    modules: [
      // 高级权限 / 向上跨级管理（操作）
      Modules.OperateAdminManageHigherLevel,
    ],
  }),

  // 向下跨级管理
  AuthAdvanceSettingLowerLevel: new Auth({
    key: 'AuthAdvanceSettingLowerLevel',
    title: '向下跨级管理',
    description: '管理岗位级别以下所有岗位范围的业务及用户人员',
    modules: [
      // 高级权限 / 向下跨级管理（操作）
      Modules.OperateAdminManageLowerLevel,
    ],
  }),
  // 公告接收人
  AuthAnnouncementRecipient: new Auth({
    key: 'AuthAnnouncementRecipient',
    title: '公告接收人',
    modules: [
      Modules.MenuAnnouncementRecipient,
    ],
  }),

  // 权限列表
  AuthAnnouncementPermissions: new Auth({
    key: 'AuthAnnouncementPermissions',
    title: '权限列表',
    modules: [
      Modules.ModuleAnnouncementPermissions,
    ],
  }),

  // 权限列表详情
  AuthAnnouncementPermissionsDetail: new Auth({
    key: 'AuthAnnouncementPermissionsDetail',
    title: '权限列表详情',
    modules: [
      Modules.ModuleAnnouncementPermissionsDetail,
      Modules.OperateAnnouncementPermissionsDetail,
    ],
  }),

  // 权限列表创建
  AuthAnnouncementPermissionsCreate: new Auth({
    key: 'AuthAnnouncementPermissionsCreate',
    title: '权限列表创建',
    modules: [
      Modules.ModuleAnnouncementPermissionsCreate,
      Modules.OperateAnnouncementPermissionsCreate,
    ],
  }),

  // 权限列表编辑
  AuthAnnouncementPermissionsUpdate: new Auth({
    key: 'AuthAnnouncementPermissionsUpdate',
    title: '权限列表编辑',
    modules: [
      Modules.ModuleAnnouncementPermissionsUpdate,
      Modules.OperateAnnouncementPermissionsUpdate,
    ],
  }),

  // 系统管理 - 意见反馈
  AuthModuleSystemFeedBack: new Auth({
    key: 'AuthModuleSystemFeedBack',
    title: '意见反馈',
    description: '意见反馈（页面）的权限',
    modules: [
      // 意见反馈页面
      Modules.ModuleSystemFeedBack,
    ],
  }),

  // 移动端team团队
  AuthOperateAPPTeam: new Auth({
    key: 'AuthOperateAPPTeam',
    title: '移动端team团队',
    description: '移动端team团队',
    modules: [
      // 移动端team团队
      Modules.OperateAPPTeam,
    ],
  }),

  // 移动端team团队 - 团队成员
  AuthOperateAPPTeamMember: new Auth({
    key: 'AuthOperateAPPTeamMember',
    title: '团队成员',
    description: '团队成员（Tab）的权限',
    modules: [
      // 团队成员
      Modules.OperateAPPTeamMember,
    ],
  }),

  // 移动端team团队 - 关联code
  AuthOperateAPPTeamRelaCode: new Auth({
    key: 'AuthOperateAPPTeamRelaCode',
    title: '关联code',
    description: '关联code（Tab）的权限',
    modules: [
      // 关联code
      Modules.OperateAPPTeamRelaCode,
    ],
  }),

  // 移动端team团队 - 预算目标
  AuthOperateAPPTeamBudget: new Auth({
    key: 'AuthOperateAPPTeamBudget',
    title: '预算目标',
    description: '预算目标（Tab）的权限',
    modules: [
      // 预算目标
      Modules.OperateAPPTeamBudget,
    ],
  }),

  // 移动端team团队 - 团队业绩
  AuthOperateAPPTeamPerformance: new Auth({
    key: 'AuthOperateAPPTeamPerformance',
    title: '团队业绩',
    description: '团队业绩（Tab）的权限',
    modules: [
      // 团队业绩
      Modules.OperateAPPTeamPerformance,
    ],
  }),
};

/**
 * 权限设置的配置文件
 * @desc node {Auth}     节点
 * @desc leaf {Array}    子节点
 */
const AuthTree = [
  // 超级管理相关权限
  {
    // 超级管理
    node: AuthNodes.AuthAdmin,
    leaf: [
      // 系统信息
      { node: AuthNodes.AuthAdminSystem },
      // 权限管理
      { node: AuthNodes.AuthAdminAuthorize },
      // 角色管理
      {
        node: AuthNodes.AuthAdminManagementRoles,
        leaf: [
          // CODE业务策略
          { node: AuthNodes.AuthAdminManagementCodeRoles },
        ],
      },
      // 开发文档
      { node: AuthNodes.AuthAdminInterface },
      // 开发调试
      { node: AuthNodes.AuthAdminDeveloper },
    ],
  },

  // 组织结构管理
  {
    node: AuthNodes.AuthOrganization,
    leaf: [
      // 部门管理
      {
        node: AuthNodes.AuthOrganizationDepartment,
        leaf: [
          // 业务信息/数据权限信息
          { node: AuthNodes.AuthOrganizationDepartmentBusiness },
          // 设置部门负责人
          { node: AuthNodes.AuthOrganizationManageDepartmentManager },
          // 新建部门/调整上级部门
          { node: AuthNodes.AuthOperateOrganizationManageDepartmentCreate },
          // 撤销部门
          { node: AuthNodes.AuthOrganizationManageDepartmentCancle },
          // 导出部门编制数报表
          { node: AuthNodes.AuthOrganizationManageDepartmentExport },
          // 添加、编辑部门员工
          { node: AuthNodes.AuthOrganizationManageDepartmentEmployeeManage },
          // 查看部门员工
          { node: AuthNodes.AuthOrganizationManageDepartmentEmployeeDetail },
          // 批量导出部门员工
          { node: AuthNodes.AuthOrganizationManageDepartmentEmployeeExport },
          // 添加、编辑岗位的操作权限
          { node: AuthNodes.AuthOrganizationManageStaffsManage },
          // 岗位增编
          { node: AuthNodes.AuthOperateOrganizationManageStaffsAddendum },
          // 岗位减编
          { node: AuthNodes.AuthOperateOrganizationManageStaffsReduction },
          // 创建、编辑业务信息
          { node: AuthNodes.AuthOrganizationManageAttributesManage },
          // 创建、编辑数据权限范围
          { node: AuthNodes.AuthOrganizationManageDataPermissionManage },
          // 编辑部门（名称/编号）
          { node: AuthNodes.AuthOperateOrganizationManageDepartmentUpdate },
        ],
      },
      // 岗位管理
      {
        node: AuthNodes.AuthOrganizationStaff,
        leaf: [
          // 新建、编辑岗位
          { node: AuthNodes.AuthOrganizationStaffManage },
          // 删除岗位
          // { node: AuthNodes.AuthOrganizationStaffDelete },
        ],
      },
      // 操作日志
      {
        node: AuthNodes.AuthOrganizationOperationLog,
      },
    ],
  },

  // 人员管理相关权限
  {
    // 人员管理
    node: AuthNodes.AuthEmployee,
    leaf: [
      {
        // 人员档案
        node: AuthNodes.AuthEmployeeDetail,
        leaf: [
          // 编辑、添加档案
          { node: AuthNodes.AuthEmployeeUpdate },
          // 导出人员列表
          { node: AuthNodes.AuthEmployeeExport },
          // 办理离职
          { node: AuthNodes.AuthEmployeeForceResign },
          // 确认离职
          { node: AuthNodes.AuthEmployeeResign },
          // 查看劳动者档案
          { node: AuthNodes.AuthEmployeeFileTypeSecond },
          // 查看档案历史信息
          { node: AuthNodes.AuthEmployeeFileTypeDetailHistory },
          // 查看人员档案
          { node: AuthNodes.AuthEmployeeFileTypeStaff },
          // 人员档案变更记录
          { node: AuthNodes.AuthEmployeeFileRecord },
          // 新增合同
          { node: AuthNodes.AuthEmployeeCreateContract },
          // 不计入占编数统计
          { node: AuthNodes.AuthEmployeeCreateIsOrganization },
          // 包含已裁撤部门数据
          { node: AuthNodes.AuthEmployeeAbolishDepartment },
          // 批量操作员工档案team按钮
          { node: AuthNodes.AuthEmployeeChangeStaffTeam },
          // 批量操作劳动者档案team按钮
          { node: AuthNodes.AuthEmployeeChangeScendTeam },
        ],
      },
      {
        // 人员异动管
        node: AuthNodes.AuthEmployeeTurnover,
        leaf: [
          // 人员管理 / 人员 (创建,编辑,删除,信息变更) 操作
          { node: AuthNodes.AuthEmployeeTurnoverOperate },
        ],
      },
      {
        // 合同归属管理
        node: AuthNodes.AuthSystemManageCompany,
        leaf: [
          // 添加、编辑、禁用
          { node: AuthNodes.AuthSystemCompanyUpdate },
        ],
      },
      {
        // 推荐公司管理
        node: AuthNodes.AuthSystemRecommededCompany,
        leaf: [
          // 编辑、添加 启用、停用
          { node: AuthNodes.AuthSystemRecommededCompanyUpdate },
        ],
      },
      {
        // 个户注册数据
        node: AuthNodes.AuthEmployeeStatisticsData,
      },
      {
        // 社保配置管理
        node: AuthNodes.AuthEmployeeSociety,
        leaf: [
          // 新增、编辑、详情
          { node: AuthNodes.AuthEmployeeSocietyCreate },
          { node: AuthNodes.AuthEmployeeSocietyUpdate },
          { node: AuthNodes.AuthEmployeeSocietyDetail },
        ],
      },
    ],
  },

  // 物资管理相关权限（v6.x）
  {
    node: AuthNodes.AuthSupply,
    leaf: [
      {
        // 物资设置
        node: AuthNodes.AuthSupplySetting,
        leaf: [
          // 物资设置上传附件、下载模板
          { node: AuthNodes.AuthSupplySettingDownloadAndUpload },
        ],
      },
      {
        // 采购入库明细
        node: AuthNodes.AuthSupplyProcurement,
        leaf: [
          // 采购入库明细上传附件、下载模板
          { node: AuthNodes.AuthSupplyProcurementDownload },
        ],
      },
      {
        // 分发明细
        node: AuthNodes.AuthSupplyDistribution,
        leaf: [
          // 分发明细上传附件、下载模板
          { node: AuthNodes.AuthSupplyDistributionDownloadAndUpload },
        ],
      },
      {
        // 扣款汇总
        node: AuthNodes.AuthSupplyDeductSummarize,
      },
      {
        // 扣款明细
        node: AuthNodes.AuthSupplyDeductions,
      },
      {
        // 物资台账
        node: AuthNodes.AuthSupplyDetails,
        leaf: [
          // 物资台账导出EXCEL
          { node: AuthNodes.AuthSupplyStandBookExport },
        ],
      },
    ],
  },

  // 共享登记
  {
    node: AuthNodes.AuthShared,
    leaf: [
      // 合同列表
      {
        node: AuthNodes.AuthSharedContract,
        leaf: [
          // 编辑
          // { node: AuthNodes.AuthSharedContractForm },
          // 详情
          { node: AuthNodes.AuthSharedContractDetail },
          // 导出
          { node: AuthNodes.AuthSharedContractExport },
          // 权限
          { node: AuthNodes.AuthSharedContractAuthority },
        ],
      },
      // 公司列表
      {
        node: AuthNodes.AuthSharedCompany,
        leaf: [
          // 创建
          { node: AuthNodes.AuthSharedCompanyCreate },
          // 编辑
          { node: AuthNodes.AuthSharedCompanyUpdate },
          // 详情
          { node: AuthNodes.AuthSharedCompanyDetail },
          // 导出
          { node: AuthNodes.AuthSharedCompanyExport },
          // 权限
          { node: AuthNodes.AuthSharedCompanyAuthority },
        ],
      },
      // 银行账户列表
      {
        node: AuthNodes.AuthSharedBankAccount,
        leaf: [
          // 创建
          { node: AuthNodes.AuthSharedBankAccountCreate },
          // 编辑
          { node: AuthNodes.AuthSharedBankAccountUpdate },
          // 详情
          { node: AuthNodes.AuthSharedBankAccountDetail },
          // 导出
          { node: AuthNodes.AuthSharedBankAccountExport },
          // 权限
          { node: AuthNodes.AuthSharedBankAccountAuthority },
        ],
      },
      // 证照列表
      {
        node: AuthNodes.AuthSharedLicense,
        leaf: [
          // 创建
          { node: AuthNodes.AuthSharedLicenseCreate },
          // 编辑
          { node: AuthNodes.AuthSharedLicenseUpdate },
          // 详情
          { node: AuthNodes.AuthSharedLicenseDetail },
          // 导出
          { node: AuthNodes.AuthSharedLicenseExport },
          // 权限
          { node: AuthNodes.AuthSharedLicenseAuthority },
        ],
      },
      // 印章列表
      {
        node: AuthNodes.AuthSharedSeal,
        leaf: [
          // 创建
          { node: AuthNodes.AuthSharedSealCreate },
          // 编辑
          { node: AuthNodes.AuthSharedSealUpdate },
          // 详情
          { node: AuthNodes.AuthSharedSealDetail },
          // 导出
          { node: AuthNodes.AuthSharedSealExport },
          // 权限
          { node: AuthNodes.AuthSharedSealAuthority },
        ],
      },
    ],
  },

  {
    // Code/Team审批管理
    node: AuthNodes.AuthCodeApprovalAdministration,
    leaf: [
      // 基础设置
      {
        node: AuthNodes.AuthCodeCodeBasicSet,
        leaf: [
          // Code审批流设置
          {
            node: AuthNodes.AuthModuleCodeBasicSetProcess,
            leaf: [
              // 审批流详情
              { node: AuthNodes.AuthModuleCodeFlowDetail },
              // 审批流编辑页及操作
              { node: AuthNodes.AuthModuleCodeFlowOption },
            ],
          },
          // 验票标签库
          { node: AuthNodes.AuthModuleCodeExpenseTicket },
          // 自定义提报类型
          {
            node: AuthNodes.AuthModuleCodeTypeConfigPay,
            leaf: [
              // 事项编辑
              { node: AuthNodes.AuthOperateCodeMatterUpdate },
              // 事项链接操作
              { node: AuthNodes.AuthOperateCodeMatterLinkOp },
            ],
          },
          // 付款规则
          {
            node: AuthNodes.AuthModuleCodePaymentRule,
            leaf: [
              // 编辑付款规则
              { node: AuthNodes.AuthOperateCodePaymentRuleUpdate },
            ],
          },
        ],
      },
      // 审批中心
      {
        node: AuthNodes.AuthMenuCodeOrderManage,
        leaf: [
          // 发起审批
          {
            node: AuthNodes.AuthModuleCodeDocumentManage,
            leaf: [
              // 费控申请
              {
                node: AuthNodes.AuthOperateCodeDocumentManageExpense,
                leaf: [
                  // code申请
                  { node: AuthNodes.AuthOperateCodeDocumentManageExpenseCode },
                  // team申请
                  { node: AuthNodes.AuthOperateCodeDocumentManageExpenseTeam },
                ],
              },
            ],
          },
          // 费用审批管理
          {
            node: AuthNodes.AuthModuleCodePayOrder,
            leaf: [
              // code审批单列表tab（待提报/我提报/我待办/我经手）
              { node: AuthNodes.AuthOperateCodeApproveOrderTabOther },
              // code审批单列表tab（全部）
              { node: AuthNodes.AuthOperateCodeApproveOrderTabAll },
              // 审批单
              { node: AuthNodes.AuthOperateCodeApproveOrderOp },
              // 审批单详情
              { node: AuthNodes.AuthModuleCodeOrderDetail },
            ],
          },
          // 事务审批管理
          { node: AuthNodes.AuthModuleCodeManageOAOrder },
          // 记录明细
          {
            node: AuthNodes.AuthModuleCodeRecord,
            leaf: [
              // 记录明细详情
              { node: AuthNodes.AuthModuleCodeRecordDetail },
              // 记录明细导出
              { node: AuthNodes.AuthOperateCodeRecordExport },
            ],
          },
        ],
      },

    ],
  },

  // 费用摊销
  {
    node: AuthNodes.AuthMenuCostAmortization,
    leaf: [
      {
        // 摊销确认页
        node: AuthNodes.AuthModuleCostAmortizationConfirm,
        leaf: [
          // 摊销确认操作
          { node: AuthNodes.AuthOperateCostAmortizationOption },
          // 摊销查看操作及页面的权限
          { node: AuthNodes.AuthModuleCostAmortizationDetail },
          // 全部数据
          { node: AuthNodes.AuthOperateCostAmortizationConfirmAllData },
        ],
      },
      {
        // 台账明细表
        node: AuthNodes.AuthModuleCostAmortizationLedger,
        leaf: [
          // 全部数据
          { node: AuthNodes.AuthOperateCostAmortizationLedgerAllData },
        ],
      },
    ],
  },

  // 费用管理相关权限
  {
    // 审批管理
    node: AuthNodes.AuthExpense,
    leaf: [
      {
        // 基础设置
        node: AuthNodes.AuthExpenseControl,
        leaf: [
          // 审批流程设置
          {
            node: AuthNodes.AuthExpenseExamineFlowProcess,
            leaf: [
              // 查看
              { node: AuthNodes.AuthExpenseExamineFlowDetail },
              // 新建、编辑、启用、停用、删除
              { node: AuthNodes.AuthExpenseExamineUpdate },
            ],
          },
          {
            // 关联审批流
            node: AuthNodes.AuthExpenseRelationExamineFlow,
            leaf: [
              // code/team审批流
              {
                node: AuthNodes.AuthExpenseRelationExamineFlowCodeTeam,
                leaf: [
                  // 新增、编辑、删除、禁用、启用
                  { node: AuthNodes.AuthExpenseRelationExamineFlowCodeTeamUpdate },
                  // 查看
                  { node: AuthNodes.AuthExpenseRelationExamineFlowCodeTeamDetail },
                ],
              },
              // 事务审批流
              {
                node: AuthNodes.AuthExpenseRelationExamineFlowAffair,
                leaf: [
                  // 新增、编辑、删除、禁用、启用
                  { node: AuthNodes.AuthExpenseRelationExamineFlowAffairUpdate },
                  // 查看
                  { node: AuthNodes.AuthExpenseRelationExamineFlowAffairDetail },
                ],
              },
              // 成本类审批流
              {
                node: AuthNodes.AuthExpenseRelationExamineFlowCost,
                leaf: [
                  // 新增、编辑、删除、禁用、启用
                  { node: AuthNodes.AuthExpenseRelationExamineFlowCostUpdate },
                  // 查看
                  { node: AuthNodes.AuthExpenseRelationExamineFlowCostDetail },
                ],
              },
              // 非成本类审批流
              {
                node: AuthNodes.AuthExpenseRelationExamineFlowNoCost,
                leaf: [
                  // 新增、编辑、删除、禁用、启用
                  { node: AuthNodes.AuthExpenseRelationExamineFlowNoCostUpdate },
                  // 查看
                  { node: AuthNodes.AuthExpenseRelationExamineFlowNoCostDetail },
                ],
              },
            ],
          },
          // 审批岗位设置
          {
            node: AuthNodes.AuthExpenseExamineFlowPost,
            leaf: [
              // 添加岗位
              { node: AuthNodes.AuthExpensePostCreate },
              // 编辑岗位
              { node: AuthNodes.AuthExpensePostUpdate },
              // 启用岗位
              { node: AuthNodes.AuthExpensePostEnable },
              // 停用岗位
              { node: AuthNodes.AuthExpensePostDisable },
            ],
          },
          {
            // 科目设置
            node: AuthNodes.AuthExpenseSubject,
            leaf: [
              // 新建
              { node: AuthNodes.AuthExpenseSubjectCreate },
              // 编辑
              { node: AuthNodes.AuthExpenseSubjectUpdate },
              // 删除
              { node: AuthNodes.AuthExpenseSubjectDelete },
              // 启用
              { node: AuthNodes.AuthExpenseSubjectEnable },
              // 查看
              { node: AuthNodes.AuthExpenseSubjectDetail },
              // 停用
              { node: AuthNodes.AuthExpenseSubjectDisable },
            ],
          },
          {
            // 费用分组设置
            node: AuthNodes.AuthExpenseType,
            leaf: [
              // 新建、编辑、启用、停用、删除
              { node: AuthNodes.AuthExpenseTypeUpdate },
            ],
          },
          {
            // 验票标签库
            node: AuthNodes.AuthExpenseTicketTags,
          },
        ],
      },
      {
        // 审批中心
        node: AuthNodes.AuthExpenseOrderManage,
        leaf: [
          {
            // 发起审批
            node: AuthNodes.AuthOADocumentManage,
            leaf: [
              // 费控申请
              {
                node: AuthNodes.AuthExpenseManage,
                leaf: [
                  // 出差申请单详情
                  { node: AuthNodes.AuthExpenseTravelApplicationDetail },
                  // 借款管理
                  {
                    node: AuthNodes.AuthExpenseBorrowing,
                    leaf: [
                      // 借款单详情
                      { node: AuthNodes.AuthExpenseBorrowingDetail },
                      // 创建借款申请单
                      { node: AuthNodes.AuthExpenseBorrowingCreate },
                      // 编辑借款申请单
                      { node: AuthNodes.AuthExpenseBorrowingUpdate },
                      // 还款管理我的(页面)的权限
                      { node: AuthNodes.AuthExpenseBorrowingListMy },
                      // 还款管理全部(页面)的权限
                      { node: AuthNodes.AuthExpenseBorrowingListAll },
                      // 还款单详情
                      { node: AuthNodes.AuthExpenseRepaymentsDetail },
                      // 创建还款申请单
                      { node: AuthNodes.AuthExpenseRepaymentsCreate },
                      // 编辑还款申请单
                      { node: AuthNodes.AuthExpenseRepaymentsUpdate },
                    ],
                  },
                  // 还款管理
                  // {
                  //   node: AuthNodes.AuthExpenseRepayments,
                  //   leaf: [

                  //   ],
                  // },
                ],
              },
            ],
          },
          {
            // 付款审批
            node: AuthNodes.AuthExpenseManageAudit,
            leaf: [
              // 编辑
              { node: AuthNodes.AuthExpenseManageEdit },
              // 审批
              { node: AuthNodes.AuthExpenseManageVerify },
              // 审批单列表tab全部操作
              { node: AuthNodes.AuthExpenseManageAuditListAll },
              // 付款审批列表tab待提报/待办/我提报/我经手的操作
              { node: AuthNodes.AuthExpenseManageAuditSubmission },
              // 审批单退款
              { node: AuthNodes.AuthExpenseManageRefund },
              // 审批单红冲
              { node: AuthNodes.AuthExpenseManageInvoiceAdjust },
            ],
          },
          {
            // 事务审批
            node: AuthNodes.AuthExpenseManageOAOrder,
            leaf: [
              // 编辑
              { node: AuthNodes.AuthExpenseManageOAOrderEdit },
              // 审批
              { node: AuthNodes.AuthExpenseManageOAOrderVerify },
              // 审批单列表tab全部操作
              { node: AuthNodes.AuthExpenseManageOAOrderAuditAll },
              // 事务审批列表tab抄送我的（操作）
              { node: AuthNodes.AuthExpenseManageOAOrderCopyGive },
              // 付款审批列表tab待提报/待办/我提报/我经手的操作
              { node: AuthNodes.AuthExpenseManageOAOrderAuditSubmission },
            ],
          },
          {
            // 费用记录明细
            node: AuthNodes.AuthExpenseManageRecords,
          },
          {
            // 考勤管理
            node: AuthNodes.AuthExpenseAttendance,
            leaf: [
              // 请假管理
              {
                node: AuthNodes.AuthExpenseAttendanceTakeLeave,
                leaf: [
                  // 我的操作
                  { node: AuthNodes.AuthExpenseAttendanceTakeLeaveMy },
                  // 全部操作
                  { node: AuthNodes.AuthExpenseAttendanceTakeLeaveAll },
                  // 请假(编辑,详情,创建) 页面
                  { node: AuthNodes.AuthExpenseAttendanceTakeLeaveOrder },
                ],
              },
              {
                // 加班管理
                node: AuthNodes.AuthExpenseOverTime,
                leaf: [
                  // 加班管理（我的）
                  { node: AuthNodes.AuthExpenseOverTimeMine },
                  // 加班管理（全部）
                  { node: AuthNodes.AuthExpenseOverTimeAll },
                  // 加班单（新建、编辑、详情）
                  { node: AuthNodes.AuthExpenseOverTimeOrder },
                ],
              },
            ],
          },
        ],
      },
      {
        // 审批监控
        node: AuthNodes.AuthExpenseStatistics,
        leaf: [
          // 审批流统计详情
          { node: AuthNodes.AuthExpenseStatisticsDetail },
        ],
      },
      // {
      //   // 流程审批
      //   node: AuthNodes.AuthExpenseProcess,
      //   leaf: [
      //     // {
      //     //   // 出差管理
      //     //   node: AuthNodes.AuthExpenseTravelApplication,
      //     //   leaf: [
      //     //     // 出差列表全部操作
      //     //     { node: AuthNodes.AuthExpenseTravelApplicationListAll },
      //     //     // 出差列表我的操作
      //     //     { node: AuthNodes.AuthExpenseTravelApplicationListMy },
      //     //   ],
      //     // },
      //   ],
      // },
    ],
  },
  {
    // 房屋管理
    node: AuthNodes.AuthExpenseManageHouse,
    leaf: [
      // 续签、断租、退租、续租、退押金
      { node: AuthNodes.AuthExpenseManageRecordsVerify },
      // 房屋台账导出
      { node: AuthNodes.AuthExpenseManageHouseLedgerExport },
    ],
  },

  // 服务费结算 暂时隐藏@李彩燕
  // {
  //   node: AuthNodes.AuthFinance,
  //   leaf: [
  //     // 基础设置
  //     {
  //       node: AuthNodes.AuthFinanceConfig,
  //       leaf: [
  //         // 结算指标设置
  //         { node: AuthNodes.AuthFinanceConfigIndex },
  //       ],
  //     },
  //     // 查看服务费方案
  //     {
  //       node: AuthNodes.AuthFinancePlan,
  //       leaf: [
  //         // 服务费方案操作
  //         { node: AuthNodes.AuthFinancePlanManage },
  //         // 试算结果导出
  //         { node: AuthNodes.AuthFinancePlanCalculateExport },
  //       ],
  //     },
  //     // 结算管理
  //     {
  //       node: AuthNodes.AuthFinanceManage,
  //       leaf: [
  //         {
  //           // 结算任务设置
  //           node: AuthNodes.AuthFinanceManageTask,
  //           leaf: [
  //             // 结算任务操作
  //             { node: AuthNodes.AuthFinanceManageTaskManage },
  //           ],
  //         },
  //         // 结算汇总
  //         {
  //           node: AuthNodes.AuthFinanceSummary,
  //           leaf: [
  //             // 提交审核
  //             { node: AuthNodes.AuthFinanceSearchSummarySubmit },
  //             // 标记/撤销缓发
  //             { node: AuthNodes.AuthFinanceSearchRecordsDelay },
  //             // 下载结算单
  //             { node: AuthNodes.AuthFinanceDistributeDownload },
  //             // 下载上传结算单模版
  //             { node: AuthNodes.AuthFinanceSummaryDistribute },
  //             // 上传下载运营补扣款
  //             { node: AuthNodes.AuthFinanceSummaryOperating },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

  // 业主承揽相关权限
  {
    // 业主承揽
    node: AuthNodes.AuthOwnerContract,
    leaf: [
      {
        // 业主团队管理
        node: AuthNodes.AuthOwnerManagement,
        leaf: [
          // 创建业主团队（按钮）
          { node: AuthNodes.AuthTeamManagerCreate },
          // 编辑业主（页面、操作）
          { node: AuthNodes.AuthTeamManagerUpdate },
          // 查看业主（页面、操作）
          { node: AuthNodes.AuthTeamManagerDetail },
          // 变更业主
          { node: AuthNodes.AuthTeamManagerUpdateOwner },
          // 解散团队（操作）
          { node: AuthNodes.AuthTeamManagerDissolution },
          // 导出（操作）
          { node: AuthNodes.AuthTeamManagerExport },
          // 导出无业主商圈（操作）
          { node: AuthNodes.AuthTeamManagerExportNotOwner },
        ],
      },
      {
        // 业主承揽记录页面
        node: AuthNodes.AuthTeamManagerBusiness,
      },
      {
        // 无业主商圈监控
        node: AuthNodes.AuthTeamManagerNothingOwner,
      },
    ],
  },

  // 私教管理相关权限
  {
    // 私教管理
    node: AuthNodes.AuthTeamTeacher,
    leaf: [
      // 私教管理记录
      {
        node: AuthNodes.AuthTeamTeacherManageLog,
        leaf: [
          // 私教管理记录 - 更换私教管理按钮
          {
            node: AuthNodes.AuthTeamTeacherManageChange,
          },
        ],
      },
      // 私教团队管理
      {
        node: AuthNodes.AuthTeamTeacherManage,
        leaf: [
          // 私教团队管理 -编辑
          {
            node: AuthNodes.AuthTeamTeacherManageOwnerTeam,
            leaf: [
              // 编辑页 - 关联业主、变更业主、终止关联业主、取消变更(按钮)
              {
                node: AuthNodes.AuthTeamTeacherManageOwnerOperation,
              },
            ],
          },
        ],
      },
      //  私教运营管理 暂时隐藏v10.0.7 @彭悦
      // {
      //   node: AuthNodes.AuthTeamTeacherManageOperations,
      //   leaf: [
      //     // 私教运营管理 -编辑
      //     { node: AuthNodes.AuthTeamTeacherManageOperationsEdit },
      //   ],
      // },
      // 无私教业主团队监控
      {
        node: AuthNodes.AuthTeamTeacherMonitoring,
      },
    ],
  },
  {
    // 资产管理
    node: AuthNodes.AuthAssectsAdministration,
    leaf: [
      {
        // 商圈管理
        node: AuthNodes.AuthAssectsAdministrationManage,
        leaf: [
          // 编辑、添加
          { node: AuthNodes.AuthAssectsAdministrationUpdate },
          // 商圈列表、详情设置标签
          { node: AuthNodes.AuthAssectsAdministrationTagOperate },
          // 批量设置、批量移除商圈下标签
          { node: AuthNodes.AuthAssectsAdministrationTagBatchOperate },
          // 商圈变更记录
          { node: AuthNodes.AuthAssetsChangeLog },
        ],
      },
      {
        // 商圈标签管理
        node: AuthNodes.AuthAssectsAdministrationTag,
        leaf: [
          // 新增、编辑、停用标签
          { node: AuthNodes.AuthSystemTagOperate },
        ],
      },
    ],
  },
  // 我的账户相关权限
  {
    // 我的账户
    node: AuthNodes.AuthAccount,
    leaf: [
      // 我的账户
      { node: AuthNodes.AuthAccountDetail },
    ],
  },

  // 系统管理相关权限
  {
    // 系统管理
    node: AuthNodes.AuthSystem,
    leaf: [
      // 审批配置
      {
        node: AuthNodes.AuthSystemApproalConfig,
      },
      {
        // 账号管理
        node: AuthNodes.AuthSystemAccountManage,
        leaf: [
          // 添加人员用户
          { node: AuthNodes.AuthSystemAccountCreate },
          // 编辑人员用户
          { node: AuthNodes.AuthSystemAccountUpdate },
          // 用户详情
          { node: AuthNodes.AuthSystemAccountDatails },
        ],
      },
      {
        // 关联账号
        node: AuthNodes.AuthSystemAccountReleated,
        leaf: [
          // 添加、编辑、全部解除
          { node: AuthNodes.AuthSystemAccountReleatedUpdate },
        ],
      },
      {
        // 供应商管理
        node: AuthNodes.AuthSystemSupplierManage,
        leaf: [
          // 编辑、添加
          { node: AuthNodes.AuthSystemSupplierUpdate },
          // 启用、停用
          { node: AuthNodes.AuthSystemSupplierUpdateState },
          // 业务分布情况（城市）
          { node: AuthNodes.AuthSystemSupplierScopeCity },
        ],
      },
      // 城市管理
      {
        node: AuthNodes.AuthSystemCity,
        leaf: [
          // 编辑城市信息的权限
          { node: AuthNodes.AuthSystemCityUpdate },
        ],
      },
      // 合同模版管理
      {
        node: AuthNodes.AuthSystemContractTemplate,
        leaf: [
          // 组件详情
          { node: AuthNodes.AuthSystemContractTemplateComponentDetail },
        ],
      },
      // 意见反馈
      {
        node: AuthNodes.AuthModuleSystemFeedBack,
      },
      // 公告接收人 v9.6.0暂时隐藏@李彩燕
      // {
      //   node: AuthNodes.AuthAnnouncementRecipient,
      //   leaf: [
      //     { node: AuthNodes.AuthAnnouncementPermissions },
      //     { node: AuthNodes.AuthAnnouncementPermissionsDetail },
      //     { node: AuthNodes.AuthAnnouncementPermissionsCreate },
      //     { node: AuthNodes.AuthAnnouncementPermissionsUpdate },
      //   ],
      // },
    ],
  },

  // 企业付款相关权限
  {
    node: AuthNodes.AuthEnterprise,
    leaf: [
      // 付款单(页面)
      { node: AuthNodes.AuthEnterprisePayment },
      // 企业付款单、新增付款单（执行付款）操作
      { node: AuthNodes.AuthEnterprisePaymentUpdate },
    ],
  },

  // 白名单列表权限
  {
    node: AuthNodes.AuthWhiteList,
    leaf: [
      { node: AuthNodes.AuthWhiteListCreate },
      { node: AuthNodes.AuthWhiteListDetail },
      { node: AuthNodes.AuthWhiteListUpdate },
      { node: AuthNodes.AuthWhiteListDelete },
    ],
  },

  // 服务商配置列表
  {
    node: AuthNodes.AuthSystemMerchants,
    leaf: [
      { node: AuthNodes.AuthSystemMerchantsCreate },
      { node: AuthNodes.AuthSystemMerchantsUpdate },
      { node: AuthNodes.AuthSystemMerchantsDetail },
    ],
  },
  // 高级权限相关权限
  {
    // 高级权限
    node: AuthNodes.AuthAdvanceSetting,
    leaf: [
      // 向上跨级管理
      { node: AuthNodes.AuthAdvanceSettingHigherLevel },
      // 向下跨级管理
      { node: AuthNodes.AuthAdvanceSettingLowerLevel },
    ],
  },

  // Q钱包
  {
    node: AuthNodes.AuthWallet,
    leaf: [
      // 钱包汇总
      { node: AuthNodes.AuthWalletSummary },
      // 支付账单
      {
        node: AuthNodes.AuthWalletBills,
        leaf: [
          // 支付账单详情
          { node: AuthNodes.AuthWalletBillsDetail },
          // 支付账单 - 付款/批量付款
          { node: AuthNodes.AuthWalletBillsPay },
          // 支付账单 - 导出报表
          { node: AuthNodes.AuthWalletBillsExport },
        ],
      },
      // 钱包明细
      {
        node: AuthNodes.AuthWalletDetail,
        leaf: [
          // 钱包明细 - 导出报表
          { node: AuthNodes.AuthWalletDetailExport },
        ],
      },
    ],
  },

  // 移动端权限
  {
    node: AuthNodes.AuthOperateAPPTeam,
    leaf: [
      // 团队成员
      { node: AuthNodes.AuthOperateAPPTeamMember },
      // 关联code
      { node: AuthNodes.AuthOperateAPPTeamRelaCode },
      // 预算目标
      { node: AuthNodes.AuthOperateAPPTeamBudget },
      // 团队业绩
      { node: AuthNodes.AuthOperateAPPTeamPerformance },
    ],
  },
];

// 上一版module.exports
export default {
  AuthNodes,   // 权限的节点
  AuthTree,    // 权限的树结构
};

export {
  AuthNodes,   // 权限的节点
  AuthTree,    // 权限的树结构
};
