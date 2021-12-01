import React from 'react';
import {
  CodeOutlined,
  UserOutlined,
  DatabaseOutlined,
  PayCircleOutlined,
  BankOutlined,
  ReconciliationOutlined,
  CustomerServiceOutlined,
  SolutionOutlined,
  SettingOutlined,
  MoneyCollectOutlined,
  ApartmentOutlined,
  ShareAltOutlined,
  HomeOutlined,
  WalletOutlined,
  TransactionOutlined,
} from '@ant-design/icons';

// 模块对象(页面)
class Module {
  constructor({ id, key = '', title = '', path = '' }) {
    this.id = id;               // 对应服务器的模块id
    this.key = key;             // 模块的key, 标示
    this.title = title;         // 模块的标题
    this.path = path;           // 模块的路径
    this.isMenu = false;        // 是否是菜单
    this.isPage = false;        // 是否是页面
    this.isRule = false;        // 是否是页面内置功能
    this.isBoss = false;        // 是否是boss内置模块
    this.canAccess = false;     // 是否有权限访问(默认没有权限)
  }
}

// 菜单对象
class Menu extends Module {
  constructor({ id, key, icon = '', title = '', isBoss = false, isVerifyAuth = true, isAdmin = false, merchant }) {
    super({ id, key, title, path: `menu-${key}` });
    this.icon = icon;                 // 菜单栏icon
    this.isMenu = true;               // 是否是菜单
    this.isBoss = isBoss;             // 是否是boss内置模块
    this.isVerifyAuth = isVerifyAuth; // 是否验证菜单栏显示权限，true 判断权限，false不判断默认显示
    this.isAdmin = isAdmin;           // 判断是否是超级管理员模块
    this.merchant = merchant; // 商户
  }
}

// 页面
class Page extends Module {
  constructor({ id, key, icon = '', title = '', path = '', isBoss = false, isAdmin = false, merchant }) {
    super({ id, key, title, path });
    this.icon = icon;   // 页面icon
    this.isPage = true; // 是否是页面
    this.isBoss = isBoss; // 是否是boss内置模块
    this.isAdmin = isAdmin;           // 判断是否是超级管理员模块
    this.merchant = merchant; // 商户
  }
}

// 操作
class Operate extends Module {
  constructor({ id, key, title = '', isBoss = false, merchant }) {
    super({ id, key, title, path: `operate-${key}` });
    this.isOperate = true; // 是否是页面操作
    this.isBoss = isBoss;
    this.merchant = merchant; // 商户
  }
}

// 系统所有注册的模块
export default {
  // 超级管理
  MenuAdmin: new Menu({ id: '2-0', key: 'MenuAdmin', title: '超级管理(仅限超管)', icon: <CodeOutlined />, isAdmin: true }),
  ModuleAdminSystem: new Page({ id: '2-1', key: 'ModuleAdminSystem', title: '系统信息', path: 'Admin/System', isAdmin: true }),
  ModuleAdminAuthorize: new Page({ id: '2-2', key: 'ModuleAdminAuthorize', title: '权限管理', path: 'Admin/Management/Authorize', isAdmin: true }),
  ModuleAdminManagementRoles: new Page({ id: '2-3', key: 'ModuleAdminManagementRoles', title: '角色管理', path: 'Admin/Management/Roles', isAdmin: true }),
  OperateAdminManagementCodeRoles: new Page({ id: '2-6', key: 'OperateAdminManagementCodeRoles', title: 'CODE业务策略' }),
  ModuleAdminInterface: new Page({ id: '2-4', key: 'ModuleAdminInterface', title: '开发文档', path: 'Admin/Interface', isAdmin: true }),
  ModuleAdminDeveloper: new Page({ id: '2-5', key: 'ModuleAdminDeveloper', title: '开发调试', path: 'Admin/Developer', isAdmin: true }),

  // 组织架构 - 部门管理
  MenuOrganization: new Menu({ id: '25-0', key: 'MenuOrganization', title: '组织架构', icon: <ApartmentOutlined /> }),
  ModuleOrganizationManageDepartment: new Page({ id: '25-1', key: 'ModuleOrganizationManageDepartment', title: '部门管理', path: 'Organization/Manage/Department' }),
  OperateOrganizationManageDepartmentBusiness: new Operate({ id: '25-26', key: 'OperateOrganizationManageDepartmentBusiness', title: '业务信息/数据权限信息' }),
  OperateOrganizationManageDepartmentManager: new Operate({ id: '25-5', key: 'OperateOrganizationManageDepartmentManager', title: '设置部门负责人' }),
  OperateOrganizationManageDepartmentCreate: new Operate({ id: '25-6', key: 'OperateOrganizationManageDepartmentCreate', title: '新建部门' }),
  OperateOrganizationManageDepartmentUpdate: new Operate({ id: '25-7', key: 'OperateOrganizationManageDepartmentUpdate', title: '编辑部门' }),
  OperateOrganizationManageDepartmentDelete: new Operate({ id: '25-8', key: 'OperateOrganizationManageDepartmentDelete', title: '撤销部门' }),
  OperateOrganizationManageDepartmentExport: new Operate({ id: '25-22', key: 'OperateOrganizationManageDepartmentExport', title: '导出部门编制数报表' }),
  OperateOrganizationManageDepartmentEmployeeCreate: new Operate({ id: '25-9', key: 'OperateOrganizationManageDepartmentEmployeeCreate', title: '添加部门员工' }),
  OperateOrganizationManageDepartmentEmployeeUpdate: new Operate({ id: '25-10', key: 'OperateOrganizationManageDepartmentEmployeeUpdate', title: '编辑部门员工' }),
  OperateOrganizationManageDepartmentEmployeeDetail: new Operate({ id: '25-23', key: 'OperateOrganizationManageDepartmentEmployeeDetail', title: '查看部门员工' }),
  OperateOrganizationManageDepartmentEmployeeExport: new Operate({ id: '25-11', key: 'OperateOrganizationManageDepartmentEmployeeExport', title: '批量导出部门员工' }),
  OperateOrganizationManageStaffsCreate: new Operate({ id: '25-12', key: 'OperateOrganizationManageStaffsCreate', title: '新建岗位' }),
  OperateOrganizationManageStaffsUpdate: new Operate({ id: '25-13', key: 'OperateOrganizationManageStaffsUpdate', title: '编辑岗位' }),
  OperateOrganizationManageStaffsDelete: new Operate({ id: '25-20', key: 'OperateOrganizationManageStaffsDelete', title: '删除岗位' }),
  OperateOrganizationManageStaffsAddendum: new Operate({ id: '25-27', key: 'OperateOrganizationManageStaffsAddendum', title: '增编' }),
  OperateOrganizationManageStaffsReduction: new Operate({ id: '25-28', key: 'OperateOrganizationManageStaffsReduction', title: '减编' }),
  OperateOrganizationManageAttributesCreate: new Operate({ id: '25-14', key: 'OperateOrganizationManageAttributesCreate', title: '添加业务信息' }),
  OperateOrganizationManageAttributesUpdate: new Operate({ id: '25-15', key: 'OperateOrganizationManageAttributesUpdate', title: '编辑业务信息' }),
  OperateOrganizationManageDataPermissionCreate: new Operate({ id: '25-24', key: 'OperateOrganizationManageDataPermissionCreate', title: '创建数据权限范围' }),
  OperateOrganizationManageDataPermissionUpdate: new Operate({ id: '25-25', key: 'OperateOrganizationManageDataPermissionUpdate', title: '编辑数据权限范围' }),
  // 组织架构 - 岗位管理
  ModuleOrganizationStaffs: new Page({ id: '25-16', key: 'ModuleOrganizationStaffs', title: '岗位管理', path: 'Organization/Staffs' }),
  OperateOrganizationStaffsCreate: new Operate({ id: '25-17', key: 'OperateOrganizationStaffsCreate', title: '新建岗位' }),
  OperateOrganizationStaffsUpdate: new Operate({ id: '25-18', key: 'OperateOrganizationStaffsUpdate', title: '编辑岗位' }),
  OperateOrganizationStaffsDelete: new Operate({ id: '25-19', key: 'OperateOrganizationStaffsDelete', title: '删除岗位' }),
  // 组织架构 - 操作日志
  ModuleOrganizationOperationLog: new Page({ id: '25-21', key: 'ModuleOrganizationOperationLog', title: '操作日志', path: 'Organization/OperationLog' }),
  // Q钱包
  MenuWallet: new Menu({ id: '28-0', key: 'MenuWallet', title: 'Q钱包', icon: <WalletOutlined /> }),
  // Q钱包 - 钱包汇总
  ModuleWalletSummary: new Page({ id: '28-1', key: 'ModuleWalletSummary', title: '钱包汇总', path: 'Wallet/Summary' }),
  // Q钱包 - 支付账单
  ModuleWalletBills: new Page({ id: '28-2', key: 'ModuleWalletBills', title: '支付账单', path: 'Wallet/Bills' }),
  // Q钱包 - 钱包明细
  ModuleWalletDetail: new Page({ id: '28-6', key: 'ModuleWalletDetail', title: '钱包明细', path: 'Wallet/Detail' }),
  // Q钱包 - 支付账单 - 账单详情
  ModuleWalletBillsDetail: new Page({ id: '28-3', key: 'ModuleWalletBillsDetail', title: '账单详情', path: 'Wallet/Bills/Detail' }),
  // Q钱包 - 支付账单 - 付款/批量付款
  OperateWalletBillsPay: new Operate({ id: '28-4', key: 'OperateWalletBillsPay', title: '付款/批量付款' }),
  // Q钱包 - 支付账单 - 导出报表
  OperateWalletBillsExport: new Operate({ id: '28-5', key: 'OperateWalletBillsExport', title: '导出报表' }),
  // Q钱包 - 钱包明细 - 导出报表
  OperateWalletDetailExport: new Operate({ id: '28-7', key: 'OperateWalletDetailExport', title: '导出报表' }),

  // 人员管理
  MenuEmployee: new Menu({ id: '3-0', key: 'MenuEmployee', title: '人员管理', icon: <UserOutlined /> }),
  ModuleEmployeeStatisticsData: new Page({ id: '3-41', key: 'ModuleEmployeeStatisticsData', title: '个户注册数据', path: 'Employee/StatisticsData' }),
  ModuleEmployeeManage: new Page({ id: '3-1', key: 'ModuleEmployeeManage', title: '人员档案', path: 'Employee/Manage' }),
  ModuleEmployeeCreate: new Page({ id: '3-2', key: 'ModuleEmployeeCreate', title: '添加档案', path: 'Employee/Create' }),
  ModuleEmployeeDetail: new Page({ id: '3-3', key: 'ModuleEmployeeDetail', title: '档案详情', path: 'Employee/Detail' }),
  ModuleEmployeeUpdate: new Page({ id: '3-4', key: 'ModuleEmployeeUpdate', title: '编辑档案', path: 'Employee/Update' }),
  ModuleEmployeeDetailHistoryInfo: new Page({ id: '3-28', key: 'ModuleEmployeeDetailHistoryInfo', title: '历史银行卡记录', path: 'Employee/Detail/HistoryInfo' }),
  ModuleEmployeeDetailHistoryContractInfo: new Page({ id: '3-51', key: 'ModuleEmployeeDetailHistoryContractInfo', title: '历史合同信息', path: 'Employee/Detail/HistoryContractInfo' }),
  ModuleEmployeeDetailHistoryWorkInfo: new Page({ id: '3-52', key: 'ModuleEmployeeDetailHistoryWorkInfo', title: '历史工作信息', path: 'Employee/Detail/HistoryWorkInfo' }),
  ModuleEmployeeDetailHistoryTripartiteId: new Page({ id: '3-53', key: 'ModuleEmployeeDetailHistoryTripartiteId', title: '历史三方id', path: 'Employee/Detail/HistoryTripartiteId' }),
  ModuleEmployeeDetailIndividual: new Page({ id: '3-54', key: 'ModuleEmployeeDetailIndividual', title: '个户注册记录', path: 'Employee/Detail/Individual' }),
  ModuleEmployeeResignVerify: new Page({ id: '3-5', key: 'ModuleEmployeeResignVerify', title: '离职审批', path: 'Employee/Resign/Verify' }),
  ModuleEmployeeResign: new Page({ id: '3-55', key: 'ModuleEmployeeResign', title: '确认离职', path: 'Employee/Resign' }),
  ModuleEmployeeContractManage: new Page({ id: 'xxx', key: 'ModuleEmployeeContractManage', title: '合同管理', path: 'Employee/Contract/Manage' }),   // TODO：不确定
  ModuleEmployeeContractDetail: new Page({ id: 'xxx', key: 'ModuleEmployeeContractDetail', title: '合同详情', path: 'Employee/Contract/Detail' }),  // TODO：不确定
  ModuleEmployeeDelivery: new Page({ id: '3-6', key: 'ModuleEmployeeDelivery', title: '工号管理', path: 'Employee/Transport' }),
  ModuleEmployeeDeliveryUpdate: new Page({ id: '3-7', key: 'ModuleEmployeeDeliveryUpdate', title: '工号编辑', path: 'Employee/Transport/Update' }),
  ModuleEmployeeDeliveryDetail: new Page({ id: '3-8', key: 'ModuleEmployeeDeliveryDetail', title: '工号详情', path: 'Employee/Transport/Detail' }),
  OperateEmployeeSearchExportExcel: new Operate({ id: '3-9', key: 'OperateEmployeeSearchExportExcel', title: '导出EXCEL' }),
  OperateEmployeeSearchUpdateButton: new Operate({ id: '3-11', key: 'OperateEmployeeSearchUpdateButton', title: '编辑、添加档案信息按钮' }),
  OperateEmployeeResignVerifyButton: new Operate({ id: '3-12', key: 'OperateEmployeeResignVerifyButton', title: '离职审核按钮' }),
  OperateEmployeeDeliveryStartButton: new Operate({ id: '3-13', key: 'OperateEmployeeDeliveryStartButton', title: '编辑/启用/停用按钮' }),
  OperateEmployeeResignVerifyForceButton: new Operate({ id: '3-21', key: 'OperateEmployeeResignVerifyForceButton', title: '办理离职按钮' }),
  OperateEmployeeResignButton: new Operate({ id: '3-56', key: 'OperateEmployeeResignButton', title: '完成离职按钮' }),
  OperateEmployeeFileTypeSecond: new Operate({ id: '3-26', key: 'OperateEmployeeFileTypeSecond', title: '查看劳动者档案' }),
  OperateEmployeeFileTypeStaff: new Operate({ id: '3-27', key: 'OperateEmployeeFileTypeStaff', title: '查看人员档案' }),
  ModuleEmployeeTurnover: new Page({ id: '3-29', key: 'ModuleEmployeeTurnover', title: '人员异动管理', path: 'Employee/Turnover' }),
  ModuleEmployeeTurnoverDetail: new Page({ id: '3-30', key: 'ModuleEmployeeTurnoverDetail', title: '人员异动详情', path: 'Employee/Turnover/Detail' }),
  ModuleEmployeeTurnoverCreate: new Page({ id: '3-35', key: 'ModuleEmployeeTurnoverCreate', title: '人员异动创建', path: 'Employee/Turnover/Create' }),
  ModuleEmployeeTurnoverUpdate: new Page({ id: '3-37', key: 'ModuleEmployeeTurnoverUpdate', title: '人员异动编辑', path: 'Employee/Turnover/Update' }),
  OperateEmployeeTurnoverUpdate: new Operate({ id: '3-38', key: 'OperateEmployeeTurnoverUpdate', title: '人员异动编辑' }),
  OperateEmployeeTurnoverCreate: new Operate({ id: '3-36', key: 'OperateEmployeeTurnoverCreate', title: '人员异动创建' }),
  OperateEmployeeTurnoverDelete: new Operate({ id: '3-39', key: 'OperateEmployeeTurnoverDelete', title: '人员异动删除' }),
  OperateModuleEmployeeDetailHistoryInfo: new Operate({ id: '3-50', key: 'OperateModuleEmployeeDetailHistoryInfo', title: '查看档案历史信息（操作）' }),
  OperateEmployeeTurnoverInfoChange: new Operate({ id: '3-40', key: 'OperateEmployeeTurnoverInfoChange', title: '人员异动信息变更' }),
  ModuleEmployeeFileRecord: new Page({ id: '3-31', key: 'ModuleEmployeeFileRecord', title: '档案变更记录', path: 'Employee/FileRecord' }),
  OperateEmployeeCreateContract: new Operate({ id: '3-34', key: 'OperateEmployeeCreateContract', title: '新增合同' }),
  OperateEmployeeCreateIsOrganization: new Operate({ id: '3-42', key: 'OperateEmployeeCreateIsOrganization', title: '不计入占编数统计' }),
  ModuleEmployeeSociety: new Page({ id: '3-43', key: 'ModuleEmployeeSociety', title: '社保配置管理', path: 'Employee/Society' }),
  ModuleEmployeeSocietyCreate: new Page({ id: '3-44', key: 'ModuleEmployeeSocietyCreate', title: '社保配置管理新增', path: 'Employee/Society/Create' }),
  ModuleEmployeeSocietyUpdate: new Page({ id: '3-45', key: 'ModuleEmployeeSocietyUpdate', title: '社保配置管理编辑', path: 'Employee/Society/Update' }),
  ModuleEmployeeSocietyDetail: new Page({ id: '3-46', key: 'ModuleEmployeeSocietyDetail', title: '社保配置管理详情', path: 'Employee/Society/Detail' }),
  OperateEmployeeSocietyCreate: new Operate({ id: '3-47', key: 'OperateEmployeeSocietyCreate', title: '社保配置新增(按钮)' }),
  OperateEmployeeSocietyUpdate: new Operate({ id: '3-48', key: 'OperateEmployeeSocietyUpdate', title: '社保配置编辑(按钮)' }),
  OperateEmployeeSocietyDetail: new Operate({ id: '3-49', key: 'OperateEmployeeSocietyDetail', title: '社保配置详情(按钮)' }),
  OperateEmployeeAbolishDepartment: new Operate({ id: '30-0', key: 'OperateEmployeeAbolishDepartment', title: '包含已裁撤部门数据' }),
  OperateEmployeeChangeStaffTeam: new Operate({ id: '30-1', key: 'OperateEmployeeChangeStaffTeam', title: '批量操作员工档案team按钮' }),
  OperateEmployeeChangeScendTeam: new Operate({ id: '30-2', key: 'OperateEmployeeChangeScendTeam', title: '批量操作劳动者档案team按钮' }),

  // 新物资模块
  MenuSupply: new Menu({ id: '16-0', key: 'MenuSupply', title: '物资管理', icon: <DatabaseOutlined /> }),
  ModuleSupplySetting: new Page({ id: '16-1', key: 'ModuleSupplySetting', title: '物资设置', path: 'Supply/Setting' }),
  ModuleSupplyProcurement: new Page({ id: '16-3', key: 'ModuleSupplyProcurement', title: '采购入库明细', path: 'Supply/Procurement' }),
  ModuleSupplyDistribution: new Page({ id: '16-5', key: 'ModuleSupplyDistribution', title: '分发明细', path: 'Supply/Distribution' }),
  ModulesSupplyDeductSummarize: new Page({ id: '16-10', key: 'ModulesSupplyDeductSummarize', title: '扣款汇总', path: 'Supply/DeductSummarize' }),
  ModulesSupplyDeductSummarizeDetail: new Page({ id: '16-11', key: 'ModulesSupplyDeductSummarizeDetail', title: '扣款汇总详情', path: 'Supply/DeductSummarize/Detail' }),
  ModuleSupplyDeductions: new Page({ id: '16-7', key: 'ModuleSupplyDeductions', title: '扣款明细', path: 'Supply/Deductions' }),
  ModuleSupplyDetails: new Page({ id: '16-9', key: 'ModuleSupplyDetails', title: '物资台账', path: 'Supply/Parameter' }),
  OperateSupplySettingDownloadAndUpload: new Operate({ id: '16-2', key: 'OperateSupplySettingDownloadAndUpload', title: '物资设置上传附件、下载模板' }),
  OperateSupplyProcurementDownload: new Operate({ id: '16-4', key: 'OperateSupplyProcurementDownload', title: '采购入库明细下载模板' }),
  OperateSupplyDistributionDownloadAndUpload: new Operate({ id: '16-6', key: 'OperateSupplyDistributionDownloadAndUpload', title: '分发明细上传附件、下载模板' }),
  OperateSupplyDeductSummarizeExportAndUpload: new Operate({ id: '16-12', key: 'OperateSupplyDeductSummarizeExportAndUpload', title: '扣款汇总上传附件、导出EXCEL' }),
  OperateSupplyStandBookExport: new Operate({ id: '16-13', key: 'OperateSupplyStandBookExport', title: '物资台账导出EXCEL' }),

  // 共享登记
  MenuShared: new Menu({ id: '27-0', key: 'MenuShared', title: '共享登记', icon: <ShareAltOutlined /> }),
  ModuleSharedContract: new Page({ id: '27-1', key: 'ModuleSharedContract', title: '合同', path: 'Shared/Contract' }),
  ModuleSharedContractForm: new Page({ id: '27-2', key: 'ModuleSharedContractForm', title: '编辑', path: 'Shared/Contract/Form' }),
  ModuleSharedContractDetail: new Page({ id: '27-4', key: 'ModuleSharedContractDetail', title: '详情', path: 'Shared/Contract/Detail' }),
  ModuleSharedCompany: new Page({ id: '27-8', key: 'ModuleSharedCompany', title: '公司', path: 'Shared/Company' }),
  ModuleSharedCompanyCreate: new Page({ id: '27-9', key: 'ModuleSharedCompanyCreate', title: '创建', path: 'Shared/Company/Create' }),
  ModuleSharedCompanyUpdate: new Page({ id: '27-11', key: 'ModuleSharedCompanyUpdate', title: '编辑', path: 'Shared/Company/Update' }),
  ModuleSharedCompanyDetail: new Page({ id: '27-13', key: 'ModuleSharedCompanyDetail', title: '详情', path: 'Shared/Company/Detail' }),
  ModuleSharedBankAccount: new Page({ id: '27-17', key: 'ModuleSharedBankAccount', title: '银行账户', path: 'Shared/BankAccount' }),
  ModuleSharedBankAccountCreate: new Page({ id: '27-18', key: 'ModuleSharedBankAccountCreate', title: '创建', path: 'Shared/BankAccount/Create' }),
  ModuleSharedBankAccountUpdate: new Page({ id: '27-20', key: 'ModuleSharedBankAccountUpdate', title: '编辑', path: 'Shared/BankAccount/Update' }),
  ModuleSharedBankAccountDetail: new Page({ id: '27-22', key: 'ModuleSharedBankAccountDetail', title: '详情', path: 'Shared/BankAccount/Detail' }),
  ModuleSharedSeal: new Page({ id: '27-35', key: 'ModuleSharedSeal', title: '印章', path: 'Shared/Seal' }),
  ModuleSharedSealCreate: new Page({ id: '27-36', key: 'ModuleSharedSealCreate', title: '创建', path: 'Shared/Seal/Create' }),
  ModuleSharedSealUpdate: new Page({ id: '27-38', key: 'ModuleSharedSealUpdate', title: '编辑', path: 'Shared/Seal/Update' }),
  ModuleSharedSealDetail: new Page({ id: '27-40', key: 'ModuleSharedSealDetail', title: '详情', path: 'Shared/Seal/Detail' }),
  ModuleSharedLicense: new Page({ id: '27-26', key: 'ModuleSharedLicense', title: '证照', path: 'Shared/License' }),
  ModuleSharedLicenseCreate: new Page({ id: '27-27', key: 'ModuleSharedLicenseCreate', title: '创建', path: 'Shared/License/Create' }),
  ModuleSharedLicenseUpdate: new Page({ id: '27-29', key: 'ModuleSharedLicenseUpdate', title: '编辑', path: 'Shared/License/Update' }),
  ModuleSharedLicenseDetail: new Page({ id: '27-31', key: 'ModuleSharedLicenseDetail', title: '详情', path: 'Shared/License/Detail' }),
  OperateSharedContractUpdate: new Operate({ id: '27-3', key: 'OperateSharedContractUpdate', title: '合同编辑（操作）' }),
  OperateSharedContractDetail: new Operate({ id: '27-5', key: 'OperateSharedContractDetail', title: '合同查看（操作）' }),
  OperateSharedContractExport: new Operate({ id: '27-6', key: 'OperateSharedContractExport', title: '合同导出（操作）' }),
  OperateSharedContractAuthority: new Operate({ id: '27-7', key: 'OperateSharedContractAuthority', title: '合同权限（详情）' }),
  OperateSharedCompanyCreate: new Operate({ id: '27-10', key: 'OperateSharedCompanyCreate', title: '公司创建（操作）' }),
  OperateSharedCompanyUpdate: new Operate({ id: '27-12', key: 'OperateSharedCompanyUpdate', title: '公司编辑（操作）' }),
  OperateSharedCompanyDetail: new Operate({ id: '27-14', key: 'OperateSharedCompanyDetail', title: '公司查看（操作）' }),
  OperateSharedCompanyExport: new Operate({ id: '27-15', key: 'OperateSharedCompanyExport', title: '公司导出（操作）' }),
  OperateSharedCompanyAuthority: new Operate({ id: '27-16', key: 'OperateSharedCompanyAuthority', title: '公司权限（详情）' }),
  OperateSharedBankAccountCreate: new Operate({ id: '27-19', key: 'OperateSharedBankAccountCreate', title: '银行账户创建（操作）' }),
  OperateSharedBankAccountUpdate: new Operate({ id: '27-21', key: 'OperateSharedBankAccountUpdate', title: '银行账户编辑（操作）' }),
  OperateSharedBankAccountDetail: new Operate({ id: '27-23', key: 'OperateSharedBankAccountDetail', title: '银行账户查看（操作）' }),
  OperateSharedBankAccountExport: new Operate({ id: '27-24', key: 'OperateSharedBankAccountExport', title: '银行账户导出（操作）' }),
  OperateSharedBankAccountAuthority: new Operate({ id: '27-25', key: 'OperateSharedBankAccountAuthority', title: '银行账户权限（详情）' }),
  OperateSharedLicenseCreate: new Operate({ id: '27-28', key: 'OperateSharedLicenseCreate', title: '证照创建（操作）' }),
  OperateSharedLicenseUpdate: new Operate({ id: '27-30', key: 'OperateSharedLicenseUpdate', title: '证照编辑（操作）' }),
  OperateSharedLicenseDetail: new Operate({ id: '27-32', key: 'OperateSharedLicenseDetail', title: '证照查看（操作）' }),
  OperateSharedLicenseExport: new Operate({ id: '27-33', key: 'OperateSharedLicenseExport', title: '证照导出（操作）' }),
  OperateSharedLicenseAuthority: new Operate({ id: '27-34', key: 'OperateSharedLicenseAuthority', title: '证照权限（详情）' }),
  OperateSharedSealCreate: new Operate({ id: '27-37', key: 'OperateSharedSealCreate', title: '印章创建（操作）' }),
  OperateSharedSealUpdate: new Operate({ id: '27-39', key: 'OperateSharedSealUpdate', title: '印章编辑（操作）' }),
  OperateSharedSealDetail: new Operate({ id: '27-41', key: 'OperateSharedSealDetail', title: '印章查看（操作）' }),
  OperateSharedSealExport: new Operate({ id: '27-42', key: 'OperateSharedSealExport', title: '印章导出（操作）' }),
  OperateSharedSealAuthority: new Operate({ id: '27-43', key: 'OperateSharedSealAuthority', title: '印章权限（详情）' }),

  // 费用管理
  MenuExpense: new Menu({ id: '10-0', key: 'MenuExpense', title: '审批管理', icon: <PayCircleOutlined />, isVerifyAuth: false }),
  MenuExpenseControl: new Menu({ id: '19-41', key: 'MenuExpenseControl', title: '基础设置' }),
  ModuleExpenseSubject: new Page({ id: '10-1', key: 'ModuleExpenseSubject', title: '科目设置', path: 'Expense/Subject' }),
  ModuleExpenseSubjectCreate: new Page({ id: '10-35', key: 'ModuleExpenseSubjectCreate', title: '新建科目', path: 'Expense/Subject/Create' }),
  ModuleExpenseSubjectUpdate: new Page({ id: '10-36', key: 'ModuleExpenseSubjectUpdate', title: '编辑科目', path: 'Expense/Subject/Update' }),
  ModuleExpenseSubjectDetails: new Page({ id: '10-39', key: 'ModuleExpenseSubjectDetails', title: '科目详情', path: 'Expense/Subject/Details' }),
  ModuleExpenseExamineFlowProcess: new Page({ id: '10-3', key: 'ModuleExpenseExamineFlowProcess', title: '审批流程设置', path: 'Expense/ExamineFlow/Process' }),
  ModuleExpenseExamineFlowPost: new Page({ id: '19-8', key: 'ModuleExpenseExamineFlowPost', title: '审批岗位设置', path: 'Expense/ExamineFlow/Post' }),
  OperateExpensePostCreate: new Operate({ id: '19-24', key: 'OperateExpensePostCreate', title: '添加岗位' }),
  OperateExpensePostUpdate: new Operate({ id: '19-25', key: 'OperateExpensePostUpdate', title: '编辑岗位' }),
  OperateExpensePostEnable: new Operate({ id: '19-26', key: 'OperateExpensePostEnable', title: '启用岗位' }),
  OperateExpensePostDisable: new Operate({ id: '19-27', key: 'OperateExpensePostDisable', title: '停用岗位' }),
  ModuleExpenseExamineFlowDetail: new Page({ id: '10-4', key: 'ModuleExpenseExamineFlowDetail', title: '审批流查看页面', path: 'Expense/ExamineFlow/Detail' }),
  ModuleExpenseExamineFlowUpdate: new Page({ id: '10-28', key: 'ModuleExpenseExamineFlowUpdate', title: '审批流编辑页面', path: 'Expense/ExamineFlow/Form' }),
  ModuleExpenseExamineFlowConfig: new Page({ id: '10-30', key: 'ModuleExpenseExamineFlowConfig', title: '审批流配置页面', path: 'Expense/ExamineFlow/Config' }),
  ModuleExpenseRelationExamineFlow: new Page({ id: '33-0', key: 'ModuleExpenseRelationExamineFlow', title: '关联审批流', path: 'Expense/RelationExamineFlow', isBoss: true }),
  OperateExpenseRelationExamineFlowCodeTeam: new Operate({ id: '33-1', key: 'OperateExpenseRelationExamineFlowCodeTeam', title: 'code/team审批流', isBoss: true }),
  ModuleExpenseRelationExamineFlowCodeTeamDetail: new Page({ id: '33-5', key: 'ModuleExpenseRelationExamineFlowCodeTeamDetail', title: '详情', path: 'Expense/RelationExamineFlow/CodeTeamDetail', isBoss: true }),
  ModuleExpenseRelationExamineFlowCodeTeamCreate: new Page({ id: '33-2', key: 'ModuleExpenseRelationExamineFlowCodeTeamCreate', title: '创建', path: 'Expense/RelationExamineFlow/CodeTeamCreate', isBoss: true }),
  ModuleExpenseRelationExamineFlowCodeTeamUpdate: new Page({ id: '33-3', key: 'ModuleExpenseRelationExamineFlowCodeTeamUpdate', title: '编辑', path: 'Expense/RelationExamineFlow/CodeTeamUpdate', isBoss: true }),
  OperateExpenseRelationExamineFlowCodeTeamUpdateState: new Operate({ id: '33-4', key: 'OperateExpenseRelationExamineFlowCodeTeamUpdateState', title: '删除、禁用、启用', isBoss: true }),
  OperateExpenseRelationExamineFlowAffair: new Operate({ id: '33-6', key: 'OperateExpenseRelationExamineFlowAffair', title: '事务审批流', isBoss: true }),
  ModuleExpenseRelationExamineFlowAffairDetail: new Page({ id: '33-10', key: 'ModuleExpenseRelationExamineFlowAffairDetail', title: '详情', path: 'Expense/RelationExamineFlow/AffairDetail', isBoss: true }),
  ModuleExpenseRelationExamineFlowAffairCreate: new Page({ id: '33-7', key: 'ModuleExpenseRelationExamineFlowAffairCreate', title: '创建', path: 'Expense/RelationExamineFlow/AffairCreate', isBoss: true }),
  ModuleExpenseRelationExamineFlowAffairUpdate: new Page({ id: '33-8', key: 'ModuleExpenseRelationExamineFlowAffairUpdate', title: '编辑', path: 'Expense/RelationExamineFlow/AffairUpdate', isBoss: true }),
  OperateExpenseRelationExamineFlowAffairUpdateState: new Operate({ id: '33-9', key: 'OperateExpenseRelationExamineFlowAffairUpdateState', title: '删除、禁用、启用', isBoss: true }),
  OperateExpenseRelationExamineFlowCost: new Operate({ id: '33-11', key: 'OperateExpenseRelationExamineFlowCost', title: '成本类审批流', isBoss: true }),
  ModuleExpenseRelationExamineFlowCostDetail: new Page({ id: '33-15', key: 'ModuleExpenseRelationExamineFlowCostDetail', title: '详情', path: 'Expense/RelationExamineFlow/CostDetail', isBoss: true }),
  ModuleExpenseRelationExamineFlowCostCreate: new Page({ id: '33-12', key: 'ModuleExpenseRelationExamineFlowCostCreate', title: '创建', path: 'Expense/RelationExamineFlow/CostCreate', isBoss: true }),
  ModuleExpenseRelationExamineFlowCostUpdate: new Page({ id: '33-13', key: 'ModuleExpenseRelationExamineFlowCostUpdate', title: '编辑', path: 'Expense/RelationExamineFlow/CostUpdate', isBoss: true }),
  OperateExpenseRelationExamineFlowCostUpdateState: new Operate({ id: '33-14', key: 'OperateExpenseRelationExamineFlowCostUpdateState', title: '删除、禁用、启用', isBoss: true }),
  OperateExpenseRelationExamineFlowNoCost: new Operate({ id: '33-16', key: 'OperateExpenseRelationExamineFlowNoCost', title: '非成本类审批流', isBoss: true }),
  ModuleExpenseRelationExamineFlowNoCostDetail: new Page({ id: '33-20', key: 'ModuleExpenseRelationExamineFlowNoCostDetail', title: '详情', path: 'Expense/RelationExamineFlow/NoCostDetail', isBoss: true }),
  ModuleExpenseRelationExamineFlowNoCostCreate: new Page({ id: '33-17', key: 'ModuleExpenseRelationExamineFlowNoCostCreate', title: '创建', path: 'Expense/RelationExamineFlow/NoCostCreate', isBoss: true }),
  ModuleExpenseRelationExamineFlowNoCostUpdate: new Page({ id: '33-18', key: 'ModuleExpenseRelationExamineFlowNoCostUpdate', title: '编辑', path: 'Expense/RelationExamineFlow/NoCostUpdate', isBoss: true }),
  OperateExpenseRelationExamineFlowNoCostUpdateState: new Operate({ id: '33-19', key: 'OperateExpenseRelationExamineFlowNoCostUpdateState', title: '删除、禁用、启用', isBoss: true }),
  ModuleExpenseType: new Page({ id: '10-5', key: 'ModuleExpenseType', title: '费用分组设置', path: 'Expense/Type' }),
  ModuleExpenseTypeDetail: new Page({ id: '10-33', key: 'ModuleExpenseTypeDetail', title: '费用分组设置详情', path: 'Expense/Type/Detail' }),
  ModuleExpenseTypeCreate: new Page({ id: '10-6', key: 'ModuleExpenseTypeCreate', title: '费用分组设置新增', path: 'Expense/Type/Create' }),
  ModuleExpenseTypeUpdate: new Page({ id: '10-21', key: 'ModuleExpenseTypeUpdate', title: '费用分组设置编辑', path: 'Expense/Type/Update' }),

  MenuExpenseOrderManage: new Menu({ id: '26-0', key: 'MenuExpenseOrderManage', title: '审批中心' }),
  ModuleExpenseManageOAOrder: new Page({ id: '26-1', key: 'ModuleExpenseManageOAOrder', title: '事务审批', path: 'Expense/Manage/OAOrder' }),
  ModuleExpenseManageExamineOrder: new Page({ id: '10-9', key: 'ModuleExpenseManageExamineOrder', title: '付款审批', path: 'Expense/Manage/ExamineOrder' }),
  ModuleExpenseManageExamineOrderCreate: new Page({ id: '10-10', key: 'ModuleExpenseManageExamineOrderCreate', title: '审批单表单', path: 'Expense/Manage/ExamineOrder/Form' }),
  ModuleExpenseManageExamineOrderDetail: new Page({ id: '10-20', key: 'ModuleExpenseManageExamineOrderDetail', title: '审批单详情', path: 'Expense/Manage/ExamineOrder/Detail' }),
  ModuleExpenseManageTemplateCreate: new Page({ id: '10-15', key: 'ModuleExpenseManageTemplateCreate', title: '费用申请创建', path: 'Expense/Manage/Template/Create' }),
  ModuleExpenseManageTemplateUpdate: new Page({ id: '10-16', key: 'ModuleExpenseManageTemplateUpdate', title: '费用申请编辑', path: 'Expense/Manage/Template/Update' }),
  ModuleExpenseManageTemplateDetail: new Page({ id: '10-17', key: 'ModuleExpenseManageTemplateDetail', title: '费用申请详情', path: 'Expense/Manage/Template/Detail' }),
  ModuleExpenseRefundOrder: new Page({ id: '19-38', key: 'ModuleExpenseRefundOrder', title: '退款审批单编辑', path: 'Expense/Manage/RefundForm' }),
  ModuleExpenseRefundCostOrder: new Page({ id: '19-39', key: 'ModuleExpenseRefundCostOrder', title: '退款费用单编辑', path: 'Expense/Manage/RefundCostOrderForm' }),
  ModuleExpenseInvoiceAdjustOrder: new Page({ id: '19-35', key: 'ModuleExpenseInvoiceAdjustOrder', title: '红冲审批单编辑', path: 'Expense/Manage/InvoiceAdjust' }),
  ModuleExpenseInvoiceAdjustCostOrder: new Page({ id: '19-36', key: 'ModuleExpenseInvoiceAdjustCostOrder', title: '红冲费用单编辑', path: 'Expense/Manage/InvoiceAdjustCostOrderForm' }),
  ModuleExpenseManageExamineOrderPrint: new Page({ id: '10-44', key: 'ModuleExpenseManageExamineOrderPrint', title: '打印预览', path: 'Expense/Manage/ExamineOrder/print' }),
  ModuleExpenseBudget: new Page({ id: '19-10', key: 'ModuleExpenseBudget', title: '费用预算', path: 'Expense/Budget' }),
  ModuleExpenseManageRecords: new Page({ id: '10-12', key: 'ModuleExpenseManageRecords', title: '费用记录明细', path: 'Expense/Manage/Records' }),
  ModuleExpenseManageRecordsSummaryCreate: new Page({ id: '10-14', key: 'ModuleExpenseManageRecordsSummaryCreate', title: '编辑明细列表', path: 'Expense/Manage/Records/Summary/Create' }),
  ModuleExpenseManageRecordsForm: new Page({ id: '10-18', key: 'ModuleExpenseManageRecordsForm', title: '编辑明细记录', path: 'Expense/Manage/Records/Form' }),
  ModuleExpenseManageRecordsDetail: new Page({ id: '10-19', key: 'ModuleExpenseManageRecordsDetail', title: '明细记录详情', path: 'Expense/Manage/Template/Detail' }),
  ModuleExpenseStatistics: new Page({ id: '19-28', key: 'ModuleExpenseStatistics', title: '审批监控', path: 'Expense/Statistics' }),
  ModuleExpenseStatisticsDetail: new Page({ id: '19-29', key: 'ModuleExpenseStatisticsDetail', title: '审批流统计详情', path: 'Expense/Statistics/Detail' }),
  OperateExpenseStatisticsDetail: new Operate({ id: '19-30', key: 'OperateExpenseStatisticsDetail', title: '查看审批流统计详情（操作）' }),
  OperateExpenseSubjectCreate: new Operate({ id: '10-41', key: 'OperateExpenseSubjectCreate', title: '新建科目' }),
  OperateExpenseSubjectUpdate: new Operate({ id: '10-42', key: 'OperateExpenseSubjectUpdate', title: '编辑科目' }),
  OperateExpenseSubjectDetail: new Operate({ id: '10-43', key: 'OperateExpenseSubjectDetail', title: '查看科目' }),
  OperateExpenseSubjectDelete: new Operate({ id: '10-37', key: 'OperateExpenseSubjectDelete', title: '删除科目' }),
  OperateExpenseSubjectEnable: new Operate({ id: '10-38', key: 'OperateExpenseSubjectEnable', title: '启用科目' }),
  OperateExpenseSubjectDisable: new Operate({ id: '10-40', key: 'OperateExpenseSubjectDisable', title: '停用科目' }),
  OperateExpenseExamineUpdate: new Operate({ id: '10-23', key: 'OperateExpenseExamineUpdate', title: '新建、编辑、查看、启用、停用、删除审批流' }),
  OperateExpenseExpenseTypeUpdate: new Operate({ id: '10-24', key: 'OperateExpenseTypeEditButton', title: '费用分组编辑,新建' }),
  OperateExpenseManageEditButton: new Operate({ id: '10-25', key: 'OperateExpenseManageEditButton', title: '审批单编辑' }),
  OperateExpenseManageApprovalButton: new Operate({ id: '10-26', key: 'OperateExpenseManageApprovalButton', title: '审批单审批' }),
  OperateExpenseManageRefundButton: new Operate({ id: '19-40', key: 'OperateExpenseManageRefundButton', title: '审批单退款' }),
  OperateExpenseManageRedBluntButton: new Operate({ id: '19-37', key: 'OperateExpenseManageRedBluntButton', title: '审批单红冲' }),
  OperateExpenseManageCreate: new Operate({ id: '10-7', key: 'OperateExpenseManageCreate', title: '新建费用申请' }),
  OperateExpenseManageExamineOrderPrint: new Operate({ id: '10-45', key: 'OperateExpenseManageExamineOrderPrint', title: ' 单页打印' }),
  OperateExpenseManageExamineOrderBatchPrint: new Operate({ id: '10-46', key: 'OperateExpenseManageExamineOrderBatchPrint', title: ' 批量打印' }),
  OperateExpenseManageExamineOrderAll: new Operate({ id: '19-17', key: 'OperateExpenseManageExamineOrderAll', title: '付款审批列表中全部操作' }),
  OperateExpenseManageExamineOrderReported: new Operate({ id: '19-13', key: 'OperateExpenseManageExamineOrderReported', title: '付款审批列表中待提报操作' }),
  OperateExpenseManageExamineOrderStayDo: new Operate({ id: '19-14', key: 'OperateExpenseManageExamineOrderStayDo', title: '付款审批列表中待办操作' }),
  OperateExpenseManageExamineOrderSubmission: new Operate({ id: '19-16', key: 'OperateExpenseManageExamineOrderSubmission', title: '付款审批列表中我的提报操作' }),
  OperateExpenseManageExamineOrderHandle: new Operate({ id: '19-15', key: 'OperateExpenseManageExamineOrderHandle', title: '付款审批列表中我经手的操作' }),
  OperateExpenseBudgetUpload: new Operate({ id: '19-11', key: 'OperateExpenseBudgetUpload', title: '上传费用预算' }),
  OperateExpenseBudgetDownTemplate: new Operate({ id: '19-12', key: 'OperateExpenseBudgetDownTemplate', title: '下载费用预算模板' }),

  OperateExpenseManageOAOrderEditButton: new Operate({ id: '26-2', key: 'OperateExpenseManageOAOrderEditButton', title: '审批单编辑' }),
  OperateExpenseManageOAOrderApprovalButton: new Operate({ id: '26-3', key: 'OperateExpenseManageOAOrderApprovalButton', title: '审批单审批' }),
  OperateExpenseManageOAOrderAll: new Operate({ id: '26-4', key: 'OperateExpenseManageOAOrderAll', title: '事务审批列表中全部操作' }),
  OperateExpenseManageOAOrderReported: new Operate({ id: '26-5', key: 'OperateExpenseManageOAOrderReported', title: '事务审批列表中待提报操作' }),
  OperateExpenseManageOAOrderStayDo: new Operate({ id: '26-6', key: 'OperateExpenseManageOAOrderStayDo', title: '事务审批列表中待办操作' }),
  OperateExpenseManageOAOrderSubmission: new Operate({ id: '26-7', key: 'OperateExpenseManageOAOrderSubmission', title: '事务审批列表中我的提报操作' }),
  OperateExpenseManageOAOrderHandle: new Operate({ id: '26-8', key: 'OperateExpenseManageOAOrderHandle', title: '事务审批列表中我经手的操作' }),
  OperateExpenseManageOAOrderCopyGive: new Operate({ id: '26-9', key: 'OperateExpenseManageOAOrderCopyGive', title: '事务审批列表中抄送我的操作' }),

  MenuExpenseProcess: new Menu({ id: '19-42', key: 'MenuExpenseProcess', title: '流程审批', isVerifyAuth: false }),
  ModuleExpenseTravelApplication: new Page({ id: '19-0', key: 'ModuleExpenseTravelApplication', title: '出差管理', path: 'Expense/TravelApplication' }),
  ModuleExpenseTravelApplicationDetail: new Page({ id: '19-2', key: 'ModuleExpenseTravelApplicationDetail', title: ' 出差申请单详情', path: 'Expense/TravelApplication/Detail' }),
  ModuleExpenseManageExamineOrderBusinessTravelCreate: new Page({ id: '19-5', key: 'ModuleExpenseManageExamineOrderBusinessTravelCreate', title: '创建差旅报销单', path: 'Expense/Manage/ExamineOrder/BusinessTravel/Create' }),
  ModuleExpenseManageExamineOrderBusinessTravelUpdate: new Page({ id: '19-6', key: 'ModuleExpenseManageExamineOrderBusinessTravelUpdate', title: '编辑差旅报销单', path: 'Expense/Manage/ExamineOrder/BusinessTravel/Update' }),
  ModuleExpenseManageExamineOrderBusinessTripCreate: new Page({ id: '19-3', key: 'ModuleExpenseManageExamineOrderBusinessTripCreate', title: '创建出差申请单', path: 'Expense/Manage/ExamineOrder/BusinessTrip/Create' }),
  ModuleExpenseManageExamineOrderBusinessTripUpdate: new Page({ id: '19-4', key: 'ModuleExpenseManageExamineOrderBusinessTripUpdate', title: '编辑出差申请单', path: 'Expense/Manage/ExamineOrder/BusinessTrip/Update' }),
  MenuExpenseBorrowingRepayments: new Menu({ id: '10-47', key: 'MenuExpenseBorrowingRepayments', title: '借还款管理' }),
  ModuleExpenseBorrowing: new Page({ id: '10-48', key: 'ModuleExpenseBorrowing', title: '还款管理', path: 'Expense/BorrowingRepayments/Borrowing' }),
  ModuleExpenseBorrowingDetail: new Page({ id: '10-55', key: 'ModuleExpenseBorrowingDetail', title: '借款单详情', path: 'Expense/BorrowingRepayments/Borrowing/Detail' }),
  ModuleExpenseBorrowingCreate: new Page({ id: '10-56', key: 'ModuleExpenseBorrowingCreate', title: '创建借款申请单', path: 'Expense/BorrowingRepayments/Borrowing/Create' }),
  ModuleExpenseBorrowingUpdate: new Page({ id: '10-57', key: 'ModuleExpenseBorrowingUpdate', title: '编辑借款申请单', path: 'Expense/BorrowingRepayments/Borrowing/Update' }),
  ModuleExpenseRepayments: new Page({ id: '10-51', key: 'ModuleExpenseRepayments', title: '还款管理', path: 'Expense/BorrowingRepayments/Repayments' }),
  ModuleExpenseRepaymentsDetail: new Page({ id: '10-53', key: 'ModuleExpenseRepaymentsDetail', title: '还款单详情', path: 'Expense/BorrowingRepayments/Repayments/Detail' }),
  ModuleExpenseRepaymentsCreate: new Page({ id: '10-54', key: 'ModuleExpenseRepaymentsCreate', title: '创建还款申请单', path: 'Expense/BorrowingRepayments/Repayments/Create' }),
  ModuleExpenseRepaymentsUpdate: new Page({ id: '10-58', key: 'ModuleExpenseRepaymentsUpdate', title: '编辑还款申请单', path: 'Expense/BorrowingRepayments/Repayments/Update' }),
  OperateExpenseBorrowOrderMy: new Operate({ id: '19-18', key: 'OperateExpenseBorrowOrderMy', title: '还款管理我的操作' }),
  OperateExpenseBorrowOrderAll: new Operate({ id: '19-19', key: 'OperateExpenseBorrowOrderAll', title: '还款管理全部操作' }),
  OperateExpenseBorrowOrderDetail: new Operate({ id: '10-49', key: 'OperateExpenseBorrowOrderDetail', title: '借款单详情页面查看' }),
  OperateExpenseRepaymentOrderDetail: new Operate({ id: '10-52', key: 'OperateExpenseRepaymentOrderDetail', title: '还款单详情页面查看' }),
  OperateExpenseRepaymentOrderCreate: new Operate({ id: '10-50', key: 'OperateExpenseRepaymentOrderCreate', title: '还款单新建' }),
  OperateExpenseRepaymentOrderAll: new Operate({ id: '19-21', key: 'OperateExpenseRepaymentOrderAll', title: '还款列表全部操作' }),
  OperateExpenseRepaymentOrderMy: new Operate({ id: '19-20', key: 'OperateExpenseRepaymentOrderMy', title: '还款列表我的操作' }),
  OperateExpenseTravelApplicationDetail: new Operate({ id: '19-1', key: 'OperateExpenseTravelApplicationDetail', title: '差旅报销中点击可查看出差审批单（页面）权限' }),
  OperateExpenseTravelApplicationAll: new Operate({ id: '19-23', key: 'OperateExpenseTravelApplicationAll', title: '出差列表全部 (操作)' }),
  OperateExpenseTravelApplicationMy: new Operate({ id: '19-22', key: 'OperateExpenseTravelApplicationMy', title: '出差列表我的 (操作)' }),

  MenuExpenseAttendance: new Menu({ id: '19-43', key: 'MenuExpenseAttendance', title: '考勤管理' }),
  ModuleExpenseAttendanceTakeLeave: new Page({ id: '19-44', key: 'ModuleExpenseAttendanceTakeLeave', title: '请假管理', path: 'Expense/Attendance/TakeLeave' }),
  ModuleExpenseAttendanceTakeLeaveCreate: new Page({ id: '19-47', key: 'ModuleExpenseAttendanceTakeLeaveCreate', title: '创建请假申请', path: 'Expense/Attendance/TakeLeave/Create' }),
  ModuleExpenseAttendanceTakeLeaveUpdate: new Page({ id: '19-48', key: 'ModuleExpenseAttendanceTakeLeaveUpdate', title: '编辑请假申请', path: 'Expense/Attendance/TakeLeave/Update' }),
  ModuleExpenseAttendanceTakeLeaveDetail: new Page({ id: '19-49', key: 'ModuleExpenseAttendanceTakeLeaveDetail', title: '请假管理详情', path: 'Expense/Attendance/TakeLeave/Detail' }),
  OperateExpenseAttendanceTakeLeaveMy: new Operate({ id: '19-45', key: 'OperateExpenseAttendanceTakeLeaveMy', title: '请假管理（我的）（操作）' }),
  OperateExpenseAttendanceTakeLeaveAll: new Operate({ id: '19-46', key: 'OperateExpenseAttendanceTakeLeaveAll', title: '请假管理（全部）（操作）' }),
  ModuleExpenseAttendanceOverTime: new Page({ id: '19-50', key: 'ModuleExpenseAttendanceOverTime', title: '加班管理', path: 'Expense/Attendance/OverTime' }),
  ModuleExpenseAttendanceOverTimeCreate: new Page({ id: '19-53', key: 'ModuleExpenseAttendanceOverTimeCreate', title: '新建加班申请单', path: 'Expense/Attendance/OverTime/Create' }),
  ModuleExpenseAttendanceOverTimeUpdate: new Page({ id: '19-54', key: 'ModuleExpenseAttendanceOverTimeUpdate', title: '编辑加班申请单', path: 'Expense/Attendance/OverTime/Update' }),
  ModuleExpenseAttendanceOverTimeDetail: new Page({ id: '19-55', key: 'ModuleExpenseAttendanceOverTimeDetail', title: '加班申请单详情', path: 'Expense/Attendance/OverTime/Detail' }),
  OperateExpenseAttendanceOverTimeMy: new Operate({ id: '19-51', key: 'OperateExpenseAttendanceOverTimeMy', title: '加班管理（我的）（操作）' }),
  OperateExpenseAttendanceOverTimeAll: new Operate({ id: '19-52', key: 'OperateExpenseAttendanceOverTimeAll', title: '加班管理（全部）（操作）' }),

  ModuleOADocumentManage: new Page({ id: '19-57', key: 'ModuleOADocumentManage', title: '发起审批', path: 'OA/Document' }),


  // Code/Team审批管理
  MenuCodeApprovalAdministration: new Menu({ id: '29-0', key: 'MenuCodeApprovalAdministration', title: 'Code/Team审批管理', icon: <PayCircleOutlined /> }),
  MenuCodeBasicSet: new Menu({ id: '29-1', key: 'MenuCodeBasicSet', title: '基础设置' }),
  ModuleCodeExpenseTicket: new Page({ id: '29-3', key: 'ModuleCodeExpenseTicket', title: '验票标签库', path: 'Code/Ticket' }),
  ModuleCodeBasicSetProcess: new Page({ id: '29-2', key: 'ModuleCodeBasicSetProcess', title: '审批流设置', path: 'Code/BasicSetting/Flow' }),
  ModuleCodeFlowForm: new Page({ id: '29-21', key: 'ModuleCodeFlowForm', title: '审批流编辑页', path: 'Code/BasicSetting/Flow/Form' }),
  OperateCodeFlowCreate: new Operate({ id: '29-22', key: 'OperateCodeFlowCreate', title: '审批流操作' }),
  ModuleCodeHome: new Page({ id: '00-00', key: 'ModuleCodeHome', title: 'CODE首页', path: 'Code/Home', isVerifyAuth: false, icon: <HomeOutlined /> }),
  ModuleCodePaymentRule: new Page({ id: '29-26', key: 'ModuleCodePaymentRule', title: '付款规则', path: 'Code/BasicSetting/PaymentRule' }),
  OperateCodePaymentRuleUpdate: new Operate({ id: '29-27', key: 'OperateCodePaymentRuleUpdate', title: '编辑规则' }),

  ModuleCodeFlowDetail: new Page({ id: '29-18', key: 'ModuleCodeFlowDetail', title: '审批流详情', path: 'Code/BasicSetting/Flow/Detail' }),
  ModuleCodeTypeConfigPay: new Page({ id: '29-4', key: 'ModuleCodeTypeConfigPay', title: '自定义提报类型', path: 'Code/TypeConfig/Payment' }),
  MenuCodeOrderManage: new Menu({ id: '29-5', key: 'MenuCodeOrderManage', title: '审批中心' }),
  ModuleCodeDocumentManage: new Page({ id: '29-6', key: 'ModuleCodeDocumentManage', title: '发起审批', path: 'Code/Document' }),
  OperateCodeDocumentManageExpense: new Operate({ id: '29-7', key: 'OperateCodeDocumentManageExpense', title: '费控申请' }),
  OperateCodeDocumentManageExpenseCode: new Operate({ id: '29-9', key: 'OperateCodeDocumentManageExpenseCode', title: 'code申请' }),
  OperateCodeDocumentManageExpenseTeam: new Operate({ id: '29-10', key: 'OperateCodeDocumentManageExpenseTeam', title: 'team申请' }),
  ModuleCodeManageOAOrder: new Page({ id: '29-11', key: 'ModuleCodeManageOAOrder', title: '事务审批管理', path: 'Code/Manage/OAOrder' }),
  ModuleCodePayOrder: new Page({ id: '29-12', key: 'ModuleCodePayOrder', title: '费用审批管理', path: 'Code/PayOrder' }),
  ModuleCodeOrderDetail: new Page({ id: '29-17', key: 'ModuleCodeOrderDetail', title: '审批单详情', path: 'Code/PayOrder/Detail' }),
  ModuleCodeOrderCreate: new Page({ id: '29-8', key: 'ModuleCodeOrderCreate', title: '审批单创建', path: 'Code/PayOrder/Create' }),
  ModuleCodeOrderUpdate: new Page({ id: '29-13', key: 'ModuleCodeOrderUpdate', title: '审批单编辑', path: 'Code/PayOrder/Update' }),
  OperateCodeMatterUpdate: new Operate({ id: '29-19', key: 'OperateCodeMatterUpdate', title: '事项编辑' }),
  OperateCodeMatterLinkOp: new Operate({ id: '29-20', key: 'OperateCodeMatterLinkOp', title: '事项链接操作' }),
  OperateCodeApproveOrderTabOther: new Operate({ id: '29-14', key: 'OperateCodeApproveOrderTabOther', title: '审批单列表待提报/我提报/我待办/我经手tab' }),
  OperateCodeApproveOrderTabAll: new Operate({ id: '29-15', key: 'OperateCodeApproveOrderTabAll', title: '审批单列表全部Tab' }),
  OperateCodeApproveOrderOp: new Operate({ id: '29-16', key: 'OperateCodeApproveOrderOp', title: '审批单操作' }),
  ModuleCodeRecord: new Page({ id: '29-23', key: 'ModuleCodeRecord', title: 'code费用记录明细', path: 'Code/Record' }),
  ModuleCodeRecordDetail: new Page({ id: '29-24', key: 'ModuleCodeRecordDetail', title: 'code费用记录明细详情', path: 'Code/Record/Detail' }),
  OperateCodeRecordExport: new Operate({ id: '29-25', key: 'OperateCodeRecordExport', title: 'code费用记录明细导出' }),
  ModuleCodeOrderPrint: new Page({ id: '00-01', key: 'ModuleCodeOrderPrint', title: 'code审批单打印预览', path: 'Code/Print' }),

  // 摊销管理
  MenuCostAmortization: new Menu({ id: '31-0', key: 'MenuCostAmortization', title: '摊销管理', icon: <TransactionOutlined /> }),
  ModuleCostAmortizationConfirm: new Page({ id: '31-1', key: 'ModuleCostAmortizationConfirm', title: '摊销确认', path: 'Amortization/Confirm' }),
  ModuleCostAmortizationDetail: new Page({ id: '31-3', key: 'ModuleCostAmortizationDetail', title: '摊销详情', path: 'Amortization/Detail' }),
  ModuleCostAmortizationLedger: new Page({ id: '31-5', key: 'ModuleCostAmortizationLedger', title: '台账明细表', path: 'Amortization/Ledger' }),
  OperateCostAmortizationOption: new Operate({ id: '31-2', key: 'OperateCostAmortizationOption', title: '添加数据/批量确认摊销规则/编辑规则/终止按钮权限' }),
  OperateCostAmortizationConfirmAllData: new Operate({ id: '31-4', key: 'OperateCostAmortizationConfirmAllData', title: '全部数据' }),
  OperateCostAmortizationLedgerAllData: new Operate({ id: '31-6', key: 'OperateCostAmortizationLedgerAllData', title: '全部数据' }),

  // 房屋管理
  MenuExpenseManageHouse: new Menu({ id: '10-29', key: 'MenuExpenseManageHouse', title: '房屋管理', icon: <BankOutlined /> }),
  ModuleExpenseManageHouse: new Page({ id: '10-29', key: 'ModuleExpenseManageHouse', title: '房屋管理', path: 'Expense/Manage/House' }),
  ModuleExpenseManageHouseCreate: new Page({ id: '10-31', key: 'ModuleExpenseManageHouseCreate', title: '房屋信息新增', path: 'Expense/Manage/House/Create' }),
  ModuleExpenseManageHouseUpdate: new Page({ id: '10-32', key: 'ModuleExpenseManageHouseUpdate', title: '房屋信息编辑', path: 'Expense/Manage/House/Update' }),
  ModuleExpenseManageHouseDetail: new Page({ id: '10-34', key: 'ModuleExpenseManageHouseDetail', title: '房屋信息查看', path: 'Expense/Manage/House/Detail' }),
  OperateExpenseManageHouseoPeration: new Operate({ id: '19-9', key: 'OperateExpenseManageHouseoPeration', title: '断租,续租,退租,续签,退押金操作' }),
  ModuleExpenseManageHouseRenewalUpdate: new Page({ id: '19-31', key: 'ModuleExpenseManageHouseRenewalUpdate', title: '房屋续租信息编辑', path: 'Expense/Manage/House/RenewalUpdate' }),
  ModuleExpenseManageHouseBrokRentUpdate: new Page({ id: '19-32', key: 'ModuleExpenseManageHouseBrokRentUpdate', title: '房屋断租信息编辑', path: 'Expense/Manage/House/BrokRentUpdate' }),
  ModuleExpenseManageHouseWithbrawalUpdate: new Page({ id: '19-33', key: 'ModuleExpenseManageHouseWithbrawalUpdate', title: '房屋退租信息编辑', path: 'Expense/Manage/House/WithdrawalUpdate' }),
  ModuleExpenseManageHouseApply: new Page({ id: '19-34', key: 'ModuleExpenseManageHouseApply', title: '房屋申请单信息', path: 'Expense/Manage/House/Apply' }),
  OperateExpenseManageHouseLedgerExport: new Operate({ id: '19-56', key: 'OperateExpenseManageHouseLedgerExport', title: '房屋台账导出的权限（操作）' }),

  ModuleExpenseTicket: new Page({ id: '19-58', key: 'ModuleExpenseTicket', title: '验票标签库', path: 'Expense/Ticket' }),

  // 服务费结算
  MenuFinance: new Menu({ id: '8-0', key: 'MenuFinance', title: '服务费结算', icon: <BankOutlined /> }),
  MenuFinanceConfig: new Menu({ id: '8-1', key: 'MenuFinanceConfig', title: '基础设置' }),
  ModuleFinanceConfigTags: new Page({ id: '8-2', key: 'ModuleFinanceConfigTags', title: '骑士标签设置', path: 'Finance/Config/Tags' }),
  ModuleFinanceConfigIndex: new Page({ id: '8-3', key: 'ModuleFinanceConfigIndex', title: '结算指标设置', path: 'Finance/Config/Index' }),
  ModuleFinancePlan: new Page({ id: '8-4', key: 'ModuleFinancePlan', title: '服务费方案', path: 'Finance/Plan' }),
  ModuleFinanceRules: new Page({ id: '8-5', key: 'ModuleFinanceRules', title: '服务费规则', path: 'Finance/Rules' }),
  ModuleFinanceRulesHistory: new Page({ id: '8-6', key: 'ModuleFinanceRulesHistory', title: '服务费规则审批历史', path: 'Finance/Rules/History' }),
  ModuleFinanceRulesGenerator: new Page({ id: '8-7', key: 'ModuleFinanceRulesGenerator', title: '服务费规则生成', path: 'Finance/Rules/Generator' }),
  ModuleFinanceRulesCalculate: new Page({ id: '14-9', key: 'ModuleFinanceRulesCalculate', title: '服务费试算', path: 'Finance/Rules/Calculate' }),
  ModuleFinanceRulesCalculateDetail: new Page({ id: '14-10', key: 'ModuleFinanceRulesCalculateDetail', title: '服务费试算详情', path: 'Finance/Rules/Calculate/Detail' }),
  MenuFinanceManage: new Menu({ id: '14-0', key: 'MenuFinanceManage', title: '结算管理' }),
  ModuleFinanceManageTask: new Page({ id: '14-1', key: 'ModuleFinanceManageTask', title: '结算任务设置', path: 'Finance/Manage/Task' }),
  ModuleFinanceManageSummary: new Page({ id: '14-2', key: 'ModuleFinanceManageSummary', title: '结算单汇总', path: 'Finance/Manage/Summary' }),
  ModuleFinanceManageSummaryDetailCity: new Page({ id: '14-11', key: 'ModuleFinanceManageSummaryDetailCity', title: '城市结算明细', path: 'Finance/Manage/Summary/Detail/City' }),
  ModuleFinanceManageSummaryDetailKnight: new Page({ id: '14-12', key: 'ModuleFinanceManageSummaryDetailKnight', title: '骑士结算明细', path: 'Finance/Manage/Summary/Detail/Knight' }),
  OperateFinancePlanCreate: new Operate({ id: '8-8', key: 'OperateFinancePlanCreate', title: '创建服务费方案' }),
  OperateFinancePlanTrial: new Operate({ id: '14-13', key: 'OperateFinancePlanTrial', title: '服务费方案试算服务费开始试算' }),
  OperateFinancePlanonSubmit: new Operate({ id: '14-14', key: 'OperateFinancePlanonSubmit', title: '服务费方案试算服务费提交审核' }),
  OperateFinancePlanExportData: new Operate({ id: '14-15', key: 'OperateFinancePlanExportData', title: '服务费方案试算服务费导出数据' }),
  OperateFinancePlanRulesCreate: new Operate({ id: '8-9', key: 'OperateFinancePlanRulesCreate', title: '创建服务费方案规则集' }),
  OperateFinancePlanRulesUpdate: new Operate({ id: '8-10', key: 'OperateFinancePlanRulesUpdate', title: '编辑服务费方案规则集' }),
  OperateFinancePlanRulesMutualExclusion: new Operate({ id: '8-11', key: 'OperateFinancePlanRulesMutualExclusion', title: '服务费方案规则互斥互补操作' }),
  OperateFinancePlanVersionDelete: new Operate({ id: '8-12', key: 'OperateFinancePlanVersionDelete', title: '服务费方案版本删除' }),
  OperateFinancePlanVersionToDraft: new Operate({ id: '8-13', key: 'OperateFinancePlanVersionToDraft', title: '服务费方案版本取消生效' }),
  OperateFinancePlanVersionCreateDraft: new Operate({ id: '8-14', key: 'OperateFinancePlanVersionCreateDraft', title: '调薪' }),
  OperateFinancePlanRuleUpdate: new Operate({ id: '8-15', key: 'OperateFinancePlanRuleUpdate', title: '服务费方案规则编辑、保存、删除' }),
  OperateFinancePlanRuleMove: new Operate({ id: '8-16', key: 'OperateFinancePlanRuleMove', title: '服务费方案规则上移、下移' }),
  OperateFinanceManageTaskEnable: new Operate({ id: '14-4', key: 'OperateFinanceManageTaskEnable', title: '结算任务启用' }),
  OperateFinanceManageTaskDisable: new Operate({ id: '14-5', key: 'OperateFinanceManageTaskDisable', title: '结算任务禁用' }),
  OperateFinanceConfigTagsCreate: new Operate({ id: '8-17', key: 'OperateFinanceConfigTagsCreate', title: '骑士添加标签' }),
  OperateFinanceConfigTagsDelete: new Operate({ id: '8-18', key: 'OperateFinanceConfigTagsDelete', title: '骑士移除标签' }),
  OperateFinanceManageTaskCreate: new Operate({ id: '14-3', key: 'OperateFinanceManageTaskCreate', title: '创建结算计划' }),
  OperateFinanceManageSummaryDownload: new Operate({ id: '14-6', key: 'OperateFinanceManageSummaryDownload', title: '结算单汇总, 结算单下载' }),
  OperateFinanceManageSummaryModalDownload: new Operate({ id: '14-16', key: 'OperateFinanceManageSummaryModalDownload', title: '结算单汇总, 结算单计算模版下载' }),
  OperateFinanceManageSummaryUpload: new Operate({ id: '14-17', key: 'OperateFinanceManageSummaryUpload', title: '结算单汇总, 结算单计算文件上传' }),
  OperateFinanceManageOperatingModalDownload: new Operate({ id: '14-18', key: 'OperateFinanceManageOperatingModalDownload', title: '结算单汇总, 运营补扣款模版下载' }),
  OperateFinanceManageOperatingUpload: new Operate({ id: '14-19', key: 'OperateFinanceManageOperatingUpload', title: '结算单汇总, 运营补扣款文件上传' }),
  OperateFinanceManageSummarySubmit: new Operate({ id: '14-7', key: 'OperateFinanceManageSummarySubmit', title: '结算单汇总, 提交结算单' }),
  OperateFinanceManageSummaryDelay: new Operate({ id: '14-8', key: 'OperateFinanceManageSummaryDelay', title: '结算单汇总, 批量缓发按钮' }),

  // 业务承揽
  MenuTeamManager: new Menu({ id: '23-0', key: 'MenuTeamManager', title: '业务承揽', icon: <ReconciliationOutlined /> }),
  ModuleTeamManager: new Page({ id: '23-1', key: 'ModuleTeamManager', title: '业主团队管理', path: 'Team/Manager' }),
  ModuleTeamManagerBusiness: new Page({ id: '22-11', key: 'ModuleTeamManagerBusiness', title: '业务承揽记录', path: 'Team/Manager/Business' }),
  ModuleTeamManagerUpdate: new Page({ id: '23-6', key: 'ModuleTeamManagerUpdate', title: '编辑', path: 'Team/Manager/Update' }),
  ModuleTeamManagerDetail: new Page({ id: '23-4', key: 'ModuleTeamManagerDetail', title: '详情', path: 'Team/Manager/Detail' }),
  ModuleTeamManagerNothingOwner: new Page({ id: '22-24', key: 'ModuleTeamManagerNothingOwner', title: '无业主商圈监控', path: 'Team/Manager/NothingOwner' }),
  OperateTeamManagerCreate: new Operate({ id: '23-3', key: 'OperateTeamManagerCreate', title: '创建业主团队(操作)' }),
  OperateTeamManagerUpdate: new Operate({ id: '23-7', key: 'OperateTeamManagerUpdate', title: '编辑业主(操作)' }),
  OperateTeamManagerDetail: new Operate({ id: '23-5', key: 'OperateTeamManagerDetail', title: '查看业主(操作)' }),
  OperateTeamManagerUpdateOwner: new Operate({ id: '23-12', key: 'OperateTeamManagerUpdateOwner', title: '变更业主(操作)' }),
  OperateTeamManagerDissolution: new Operate({ id: '23-14', key: 'OperateTeamManagerDissolution', title: '解散团队(操作)' }),
  OperateTeamManagerExport: new Operate({ id: '23-9', key: 'OperateTeamManagerExport', title: '导出(操作)' }),
  OperateTeamManagerExportNotOwner: new Operate({ id: '23-10', key: 'OperateTeamManagerExportNotOwner', title: '导出无业主商圈(操作)' }),

  // 私教资产隶属管理
  MenuTeamTeacher: new Menu({ id: '22-0', key: 'MenuTeamTeacher', title: '私教资产隶属管理', icon: <CustomerServiceOutlined /> }),
  ModuleTeamTeacherManage: new Page({ id: '22-13', key: 'ModuleTeamTeacherManage', title: '私教团队管理', path: 'Team/Teacher/Manage' }),
  OperateTeamTeacherManageOwnerTeam: new Operate({ id: '22-15', key: 'OperateTeamTeacherManageOwnerTeam', title: '私教团队管理' }),
  OperateTeamTeacherManageOwnerCreate: new Operate({ id: '22-16', key: 'OperateTeamTeacherManageOwnerCreate', title: '关联业主' }),
  OperateTeamTeacherManageOwnerChange: new Operate({ id: '22-17', key: 'OperateTeamTeacherManageOwnerChange', title: '变更业主' }),
  OperateTeamTeacherManageOwnerStop: new Operate({ id: '22-18', key: 'OperateTeamTeacherManageOwnerStop', title: '终止关联业主' }),
  OperateTeamTeacherManageChangeCancel: new Operate({ id: '22-19', key: 'OperateTeamTeacherManageChangeCancel', title: '取消变更' }),
  ModuleTeamTeacherManageOwnerTeam: new Page({ id: '22-14', key: 'ModuleTeamTeacherManageOwnerTeam', title: '编辑页', path: 'Team/Teacher/Manage/OwnerTeam' }),
  ModuleTeamTeacherMonitoring: new Page({ id: '23-13', key: 'ModuleTeamTeacherMonitoring', title: '无私教业主团队监控', path: 'Team/Teacher/Monitoring' }),

  ModuleTeamTeacherManageOperations: new Page({ id: '22-20', key: 'ModuleTeamTeacherManageOperations', title: '私教运营管理', path: 'Team/Teacher/Manage/Operations' }),
  OperateTeamTeacherManageOperationsEdit: new Operate({ id: '22-21', key: 'OperateTeamTeacherManageOperationsEdit', title: '修改(按钮)' }),
  ModuleTeamTeacherManageOperationsUpdate: new Page({ id: '22-22', key: 'ModuleTeamTeacherManageOperationsUpdate', title: '编辑页', path: 'Team/Teacher/Manage/Operations/Update' }),
  OperateTeamTeacherManageOperationsBatchEdit: new Operate({ id: '22-23', key: 'OperateTeamTeacherManageOperationsBatchEdit', title: '批量修改(按钮)' }),
  ModuleTeamTeacherManageLog: new Page({ id: '22-26', key: 'ModuleTeamTeacherManageLog', title: '私教管理记录', path: 'Team/Teacher/Manage/Log' }),
  OperateTeamTeacherManageChange: new Operate({ id: '22-25', key: 'OperateTeamTeacherManageChange', title: '更换私教管理(按钮)' }),

  // 资产管理
  MenuAssectsAdministration: new Menu({ id: '24-17', key: 'MenuAssectsAdministration', title: '资产管理', icon: <MoneyCollectOutlined /> }),
  // 资产管理, 商圈管理
  ModuleAssectsAdministrationManage: new Page({ id: '9-29', key: 'ModuleAssectsAdministrationManage', title: '商圈管理', path: 'Assets/District/Manage' }),
  ModuleAssectsAdministrationCreate: new Page({ id: '9-30', key: 'ModuleAssectsAdministrationCreate', title: '添加商圈', path: 'Assets/District/Create' }),
  ModuleAssectsAdministrationDetail: new Page({ id: '9-32', key: 'ModuleAssectsAdministrationDetail', title: '查看详情', path: 'Assets/District/Detail' }),
  OperateAssectsAdministrationCreate: new Operate({ id: '9-35', key: 'OperateAssectsAdministrationCreate', title: '添加商圈按钮' }),
  ModuleAssetsChangeLog: new Page({ id: '24-18', key: 'ModuleAssetsChangeLog', title: '商圈变更记录', path: 'Assets/District/ChangeLog' }),
  OperateAssetsChangeLog: new Operate({ id: '24-19', key: 'OperateAssetsChangeLog', title: '商圈变更记录(按钮)' }),
  // 商圈标签管理
  ModuleAssectsAdministrationTagManage: new Page({ id: '24-13', key: 'ModuleAssectsAdministrationTagManage', title: '商圈标签管理', path: 'Assets/District/Tag' }),
  OperateAssectsAdministrationTagCreate: new Operate({ id: '24-14', key: 'OperateAssectsAdministrationTagCreate', title: '添加标签' }),
  OperateAssectsAdministrationTagUpdate: new Operate({ id: '24-15', key: 'OperateAssectsAdministrationTagUpdate', title: '编辑标签' }),
  OperateAssectsAdministrationTagDelete: new Operate({ id: '24-16', key: 'OperateAssectsAdministrationTagDelete', title: '停用标签' }),
  OperateAssectsAdministrationTagSet: new Operate({ id: '24-10', key: 'OperateAssectsAdministrationTagSet', title: '设置标签' }),
  OperateAssectsAdministrationTagBatchSet: new Operate({ id: '24-11', key: 'OperateAssectsAdministrationTagBatchSet', title: '批量设置标签' }),
  OperateAssectsAdministrationTagBatchDelete: new Operate({ id: '24-12', key: 'OperateAssectsAdministrationTagBatchDelete', title: '批量移除标签' }),

  // 我的账户
  MenuAccount: new Menu({ id: '7-0', key: 'MenuAccount', title: '我的账户', icon: <SolutionOutlined /> }),
  ModuleAccount: new Page({ id: '7-1', key: 'ModuleAccount', title: '我的账户', path: 'Account' }),

  // 系统管理
  MenuSystem: new Menu({ id: '9-0', key: 'MenuSystem', title: '系统管理', icon: <SettingOutlined /> }),
  ModuleSystemAccountManage: new Page({ id: '9-1', key: 'ModuleSystemAccountManage', title: '账号管理', path: 'System/Account/Manage' }),
  ModuleSystemAccountManageCreate: new Page({ id: '9-47', key: 'ModuleSystemAccountManageCreate', title: '添加账号', path: 'System/Account/Manage/Create' }),
  ModuleSystemAccountManageUpdate: new Page({ id: '9-45', key: 'ModuleSystemAccountManageUpdate', title: '编辑用户', path: 'System/Account/Manage/Update' }),
  ModuleSystemAccountManageDetails: new Page({ id: '9-46', key: 'ModuleSystemAccountManageDetails', title: '用户详情', path: 'System/Account/Manage/Details' }),
  ModuleSystemAccountReleated: new Page({ id: '9-22', key: 'ModuleSystemAccountReleated', title: '关联账号', path: 'System/Account/Releated' }),
  ModuleSystemSupplierManage: new Page({ id: '9-6', key: 'ModuleSystemSupplierManage', title: '供应商管理', path: 'System/Supplier/Manage' }),
  ModuleSystemSupplierDetail: new Page({ id: '9-5', key: 'ModuleSystemSupplierDetail', title: '查看详情', path: 'System/Supplier/Detail' }),
  ModuleSystemSupplierCreate: new Page({ id: '9-7', key: 'ModuleSystemSupplierCreate', title: '添加供应商', path: 'System/Supplier/Create' }),
  ModuleSystemSupplierUpdate: new Page({ id: '9-8', key: 'ModuleSystemSupplierUpdate', title: '编辑供应商', path: 'System/Supplier/Update' }),
  ModuleSystemSupplierScopeCity: new Page({ id: '9-25', key: 'ModuleSystemSupplierScopeCity', title: '业务分布情况(城市)', path: 'System/Supplier/Scope/City' }),
  ModuleSystemMerchants: new Page({ id: '24-3', key: 'ModuleSystemMerchants', title: '服务商配置', path: 'System/Merchants' }),
  ModuleSystemMerchantsDetail: new Page({ id: '24-4', key: 'ModuleSystemMerchantsDetail', title: '服务商配置详情', path: 'System/Merchants/Detail' }),
  ModuleSystemMerchantsCreate: new Page({ id: '24-6', key: 'ModuleSystemMerchantsCreate', title: '服务商配置创建', path: 'System/Merchants/Create' }),
  ModuleSystemMerchantsUpdate: new Page({ id: '24-5', key: 'ModuleSystemMerchantsUpdate', title: '服务商配置编辑', path: 'System/Merchants/Update' }),
  OperateSystemMerchantsUpdate: new Operate({ id: '24-7', key: 'OperateSystemMerchantsUpdate', title: '服务商配置 编辑操作 (按钮)' }),
  OperateSystemMerchantsCreate: new Operate({ id: '24-8', key: 'OperateSystemMerchantsCreate', title: '服务商配置 新增操作 (按钮)' }),
  OperateSystemMerchantsDetail: new Operate({ id: '24-9', key: 'OperateSystemMerchantsDetail', title: '服务商配置 详情操作 (按钮)' }),
  // 组织架构配置
  ModuleSystemApproalConfig: new Page({ id: '24-21', key: 'ModuleSystemApproalConfig', title: '组织架构配置', path: 'System/Approal/Config' }),
  ModuleSystemFeedBack: new Page({ id: '24-20', key: 'ModuleSystemFeedBack', title: '意见反馈', path: 'System/FeedBack' }),

  // 系统管理, 城市管理
  ModuleSystemCity: new Page({ id: '9-41', key: 'ModuleSystemCity', title: '城市管理', path: 'System/City' }),
  ModuleSystemCityDetail: new Page({ id: '9-42', key: 'ModuleSystemCityDetail', title: '查看详情', path: 'System/City/Detail' }),
  ModuleSystemCityUpdate: new Page({ id: '9-44', key: 'ModuleSystemCityUpdate', title: '城市编辑', path: 'System/City/Update' }),
  OperateSystemCityUpdate: new Operate({ id: '9-43', key: 'OperateSystemCityUpdate', title: '编辑城市按钮' }),

  ModuleSystemContractTemplate: new Page({ id: '34-0', key: 'ModuleSystemContractTemplate', title: '合同模版管理', path: 'System/ContractTemplate' }),
  ModuleSystemContractTemplateComponentDetail: new Page({ id: '34-1', key: 'ModuleSystemContractTemplateComponentDetail', title: '组件详情', path: 'System/ContractTemplate/ComponentDetail' }),
  ModuleSystemRecommendedCompany: new Page({ id: '9-37', key: 'ModuleSystemRecommendedCompany', title: '推荐公司管理', path: 'System/RecommendedCompany' }),
  ModuleSystemRecommendedCompanyDetail: new Page({ id: '9-40', key: 'ModuleSystemRecommendedCompanyDetail', title: '查看详情', path: 'System/RecommendedCompany/Detail' }),
  ModuleSystemManageCompany: new Page({ id: '9-10', key: 'ModuleSystemManageCompany', title: '合同归属管理', path: 'System/Manage/Company' }),
  ModuleSystemManageCompanyDetail: new Page({ id: '24-1', key: 'ModuleSystemManageCompanyDetail', title: '合同归属详情', path: 'System/Manage/Company/Detail' }),
  ModuleSystemManageCompanyUpdate: new Page({ id: '24-0', key: 'ModuleSystemManageCompanyUpdate', title: '合同归属编辑', path: 'System/Manage/Company/Update' }),
  OperateSystemManageCompanyUpdate: new Operate({ id: '9-13', key: 'OperateSystemManageCompanyUpdate', title: '编辑/禁用按钮' }),
  OperateSystemManageCompanyCreate: new Operate({ id: '9-14', key: 'OperateSystemManageCompanyCreate', title: '添加公司按钮' }),
  OperateSystemManageCompanyDetail: new Operate({ id: '24-2', key: 'OperateSystemManageCompanyDetail', title: '合同归属详情按钮' }),
  OperateSystemAccountManageVerifyEmployee: new Operate({ id: '9-17', key: 'OperateSystemAccountManageVerifyEmployee', title: '添加账号,人员信息确认' }),
  OperateSystemAccountManageUpdate: new Operate({ id: '9-48', key: 'OperateSystemAccountManageUpdate', title: '编辑/编辑按钮' }),
  OperateSystemAccountManageDatails: new Operate({ id: '9-49', key: 'OperateSystemAccountManageDatails', title: '详情/详情按钮' }),
  OperateSystemAccountReleatedUpdate: new Operate({ id: '9-27', key: 'OperateSystemAccountReleatedUpdate', title: '添加、编辑、全部解除关联账号' }),
  OperateSystemSupplierUpdate: new Operate({ id: '9-28', key: 'OperateSystemSupplierUpdate', title: '新建、编辑供应商' }),
  OperateSystemSupplierUpdateState: new Operate({ id: '9-33', key: 'OperateSystemSupplierUpdateState', title: '启用、停用供应商' }),
  OperateSystemRecommededCompanyUpdate: new Operate({ id: '9-39', key: 'OperateSystemRecommededCompanyUpdate', title: '推荐公司新建、编辑、停用、启用' }),
  OperateSystemRecommendedCompanyDetail: new Operate({ id: '9-38', key: 'OperateSystemRecommededCompanyDetail', title: '推荐公司详情按钮' }),

  // 白名单pro
  ModuleWhiteList: new Page({ id: '9-50', key: 'ModuleWhiteList', title: '白名单', path: 'WhiteList' }),
  ModuleWhiteListDetail: new Page({ id: '9-54', key: 'ModuleWhiteListDetail', title: '详情', path: 'WhiteList/Detail' }),
  ModuleWhiteListUpdate: new Page({ id: '9-55', key: 'ModuleWhiteListUpdate', title: '编辑', path: 'WhiteList/Update' }),
  ModuleWhiteListCreate: new Page({ id: '9-57', key: 'ModuleWhiteListCreate', title: '新增', path: 'WhiteList/Create' }),
  OperateWhiteListUpdate: new Operate({ id: '9-52', key: 'OperateWhiteListUpdate', title: '白名单 编辑操作 (按钮)' }),
  OperateWhiteListDelete: new Operate({ id: '9-53', key: 'OperateWhiteListDelete', title: '白名单 关闭操作（按钮）' }),
  OperateWhiteListCreate: new Operate({ id: '9-56', key: 'OperateWhiteListCreate', title: '白名单 新增操作 (按钮)' }),
  OperateWhiteListDetail: new Operate({ id: '9-51', key: 'OperateWhiteListDetail', title: '白名单 详情操作 (按钮)' }),


  // 企业付款
  MenuEnterprise: new Menu({ id: '18-0', key: 'MenuEnterprise', title: '企业付款' }),
  ModuleEnterprisePayment: new Page({ id: '18-1', key: 'ModuleEnterprisePayment', title: '付款单', path: 'Enterprise/Payment' }),
  ModuleEnterprisePaymentPaymentOrder: new Page({ id: '18-3', key: 'ModuleEnterprisePaymentPaymentOrder', title: '新增付款单', path: 'Enterprise/Payment/paymentOrder' }),
  ModuleEnterprisePaymentDetail: new Page({ id: '18-2', key: 'ModuleEnterprisePaymentDetail', title: '详情', path: 'Enterprise/Payment/Detail' }),
  OperateEnterprisePaymentUpdate: new Operate({ id: '18-4', key: 'OperateEnterprisePaymentUpdate', title: '新增付款单（执行付款）操作' }),

  // 高级设置
  MenuAdvanceSetting: new Menu({ id: '11-0', key: 'MenuAdvanceSetting', title: '高级权限', icon: <SettingOutlined /> }),
  OperateAdminManageHigherLevel: new Operate({ id: '11-1', key: 'OperateAdminManageHigherLevel', title: '向上跨级管理' }),
  OperateAdminManageLowerLevel: new Operate({ id: '11-2', key: 'OperateAdminManageLowerLevel', title: '向下跨级管理' }),

  // 公告接收人
  MenuAnnouncementRecipient: new Menu({ id: '21-0', key: 'MenuAnnouncementRecipient', title: '公告接收人' }),
  ModuleAnnouncementPermissions: new Page({ id: '21-1', key: 'ModuleAnnouncementPermissions', title: '权限列表', path: 'Announcement/Permissions' }),
  ModuleAnnouncementPermissionsDetail: new Page({ id: '21-7', key: 'ModuleAnnouncementPermissionsDetail', title: '详情', path: 'Announcement/Permissions/Detail' }),
  ModuleAnnouncementPermissionsCreate: new Page({ id: '21-3', key: 'ModuleAnnouncementPermissionsCreate', title: '创建', path: 'Announcement/Permissions/Create' }),
  ModuleAnnouncementPermissionsUpdate: new Page({ id: '21-5', key: 'ModuleAnnouncementPermissionsUpdate', title: '编辑', path: 'Announcement/Permissions/Update' }),
  OperateAnnouncementPermissionsDetail: new Operate({ id: '21-6', key: 'OperateAnnouncementPermissionsDetail', title: '权限列表详情操作按钮' }),
  OperateAnnouncementPermissionsCreate: new Operate({ id: '21-2', key: 'OperateAnnouncementPermissionsCreate', title: '权限列表创建操作按钮' }),
  OperateAnnouncementPermissionsUpdate: new Operate({ id: '21-4', key: 'OperateAnnouncementPermissionsUpdate', title: '权限列表编辑操作按钮' }),

  // 移动端权限
  OperateAPPTeam: new Page({ id: '32-0', key: 'OperateAPPTeam', title: '移动端team团队' }),
  OperateAPPTeamMember: new Page({ id: '32-1', key: 'OperateAPPTeamMember', title: '团队成员' }),
  OperateAPPTeamRelaCode: new Page({ id: '32-2', key: 'OperateAPPTeamRelaCode', title: '关联code' }),
  OperateAPPTeamBudget: new Page({ id: '32-3', key: 'OperateAPPTeamBudget', title: '预算目标' }),
  OperateAPPTeamPerformance: new Page({ id: '32-4', key: 'OperateAPPTeamPerformance', title: '团队业绩' }),
};
